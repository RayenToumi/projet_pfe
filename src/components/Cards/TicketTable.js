import React, { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { FaFilter, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { X } from "lucide-react";

export default function TicketTable({ color }) {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterId, setFilterId] = useState("");
  const [error, setError] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // États création
  const [modalOuvert, setModalOuvert] = useState(false);
  const [newTicket, setNewTicket] = useState({
    subject: "",
    type: "",
    urgency: "",
    description: "",
  });
  const [errors, setErrors] = useState({});

  // États édition
  const [editModalOuvert, setEditModalOuvert] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [editErrors, setEditErrors] = useState({});

  // États suppression
  const [deleteModalOuvert, setDeleteModalOuvert] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState(null);

  // États détails
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const { data } = await axios.get('/alltickets');
        const formatted = data.map(t => {
          // Corrigez le format de date ici
          const [day, month, year] = t.date.split('/');
          const isoDate = `${year}-${month}-${day}`;
  
          return {
            id: t._id,
            surnom: t.createur?.surnom || 'Anonyme',
            email: t.createur?.email || 'N/A',
            urgency: t.urgence,
            description: t.description,
            status: t.statut.charAt(0).toUpperCase() + t.statut.slice(1),
            date: new Date(isoDate).toLocaleDateString('fr-FR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            }),
            subject: t.sujet,
            type: t.type,
            statut: t.statut
          };
        });
        setItems(formatted);
      } catch (error) {
        console.error("Erreur chargement:", error.response?.data);
      }
    };
    fetchTickets();
  }, [modalOuvert, editModalOuvert, deleteModalOuvert]);

  const handleChange = (e) => {
    setNewTicket({ ...newTicket, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditingTicket({ ...editingTicket, [e.target.name]: e.target.value });
  };

  const validateForm = (ticket, isEdit = false) => {
    const errors = {};
    
    // Validation du sujet
    if (!ticket.subject?.trim()) {
      errors.subject = "Le sujet est requis.";
    }
  
    // Validation du type
    if (!ticket.type) {
      errors.type = "Le type est requis.";
    }
  
    // Validation de l'urgence (uniquement à la création)
    if (!isEdit && !ticket.urgency) {
      errors.urgency = "L'urgence est requise.";
    }
  
    // Validation de la description
    if (!ticket.description?.trim()) {
      errors.description = "La description est requise.";
    }
  
    // Validation du statut (uniquement en édition)
    if (isEdit && !ticket.statut) {
      errors.statut = "Le statut est requis.";
    }
  
    return errors;
  };

  const handleCreateSubmit = async () => {
    const errors = validateForm(newTicket);
    if (Object.keys(errors).length > 0) return setErrors(errors);
  
    try {
      // Récupération du token JWT
      const token = localStorage.getItem("jwt_token");
      if (!token) {
        throw new Error("Authentication required");
      }
  
      // Création du ticket avec authentification
      const response = await axios.post('/addticket', {
        sujet: newTicket.subject,
        type: newTicket.type,
        urgence: newTicket.urgency,
        description: newTicket.description
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      // Mise à jour optimiste UI
      setItems(prev => [...prev, {
        id: response.data._id,
        subject: response.data.sujet,
        type: response.data.type,
        urgency: response.data.urgence,
        description: response.data.description,
        status: 'Ouvert',
        date: new Date(response.data.date).toLocaleDateString('fr-FR')
      }]);
  
      // Fermeture modal et reset form
      setModalOuvert(false);
      setNewTicket({ subject: "", type: "", urgency: "", description: "" });
  
      // Sauvegarde locale fallback
      const offlineTicket = {
        ...newTicket,
        id: response.data._id,
        date: new Date().toLocaleDateString('fr-FR'),
        statut: 'Ouvert'
      };
      
      const storedTickets = JSON.parse(localStorage.getItem("tickets")) || [];
      localStorage.setItem("tickets", JSON.stringify([...storedTickets, offlineTicket]));
  
    } catch (error) {
      console.error('Erreur création:', error);
      
      // Gestion erreur réseau/hors ligne
      if (!navigator.onLine || error.response?.status === 401) {
        const offlineTicket = {
          ...newTicket,
          id: `offline-${Date.now()}`,
          date: new Date().toLocaleDateString('fr-FR'),
          statut: 'En attente de synchronisation'
        };
  
        const storedTickets = JSON.parse(localStorage.getItem("tickets")) || [];
        localStorage.setItem("tickets", JSON.stringify([...storedTickets, offlineTicket]));
  
        setError(`Erreur réseau - Ticket sauvegardé localement`);
      } else if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setError(error.message);
      }
    }
  };

  const handleEditSubmit = async () => {
    // Valider le formulaire avec le mode édition
    const errors = validateForm(editingTicket, true);
    if (Object.keys(errors).length > 0) return setEditErrors(errors);
  
    try {
      // Préparer les données pour le backend
      const updateData = {
        sujet: editingTicket.subject,
        type: editingTicket.type,
        urgence: editingTicket.urgency,
        description: editingTicket.description,
        statut: editingTicket.statut // Conserver la casse originale du backend
      };
  
      // Envoyer la requête de mise à jour
      await axios.put(`/updateticket/${editingTicket.id}`, updateData);
  
      // Fermer la modal et rafraîchir les données
      setEditModalOuvert(false);
      
    } catch (error) {
      console.error("Erreur de mise à jour:", error.response?.data);
      // Gestion des erreurs serveur
      if (error.response?.data?.errors) {
        setEditErrors(error.response.data.errors);
      }
    }
  };
  const confirmDelete = async () => {
    try {
      await axios.delete(`/deleteticket/${ticketToDelete}`);
      setItems(prev => prev.filter(item => item.id !== ticketToDelete));
      setDeleteModalOuvert(false);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error("Erreur de suppression:", error.response?.data);
    }
  };

  const filteredItems = items.filter(item => {
   
    const matchesId = filterId ? item.id.toString().includes(filterId) : true;
    const matchesSearch = searchQuery
    ? item.surnom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase())
    : true;
    const matchesUrgency = filterType ? item.urgency === filterType : true;

    return matchesId && matchesSearch && matchesUrgency;
  });

  const badgeStyle = (status) => ({
    padding: "0.25rem 0.5rem",
    borderRadius: "9999px",
    fontSize: "0.75rem",
    fontWeight: "500",
    backgroundColor:
      status === "Ouvert" ? "#fee2e2" :
      status === "En cours" ? "#ffedd5" : "#dcfce7",
    color:
      status === "Ouvert" ? "#dc2626" :
      status === "En cours" ? "#ea580c" : "#16a34a",
  });

  return (
    <div className={`relative mx-auto max-w-screen-xl flex flex-col min-w-0 rounded-lg shadow-lg mb-10 ${
      color === "light" ? "bg-white" : "bg-slate-800 text-white"
    }`}>
      
      <style jsx>{`
        .gp-action-icon {
          padding: 0.45rem;
          border-radius: 0.375rem;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .gp-view {
          background-color: #dbeafe;
          color: #2563eb;
        }
        .gp-view:hover {
          background-color: #bfdbfe;
        }
        .gp-edit {
          background-color: #e0f2fe;
          color: #0284c7;
        }
        .gp-edit:hover {
          background-color: #bae6fd;
        }
        .gp-delete {
          background-color: #fee2e2;
          color: #dc2626;
        }
        .gp-delete:hover {
          background-color: #fecaca;
        }
        .gp-add-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background-color: #0ea5e9;
          color: white;
          padding: 0.55rem 2.5rem;
          border-radius: 0.375rem;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        .gp-add-button:hover {
          background-color: #0284c7;
        }
        .gp-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
        }
        .gp-modal-container {
          background-color: white;
          border-radius: 0.75rem;
          padding: 2rem;
          width: 90%;
          max-width: 500px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }
        .gp-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .gp-form-group {
          margin-bottom: 1.5rem;
        }
        .gp-form-input {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 0.375rem;
        }
        .gp-disabled-input {
          background-color: #f3f4f6;
          cursor: not-allowed;
        }
        .gp-readonly-text {
          padding: 0.5rem;
          background-color: #f3f4f6;
          border-radius: 0.375rem;
          display: block;
        }
        .gp-btn {
          padding: 0.5rem 1.25rem;
          border-radius: 0.375rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .gp-btn-save {
          background-color: #0ea5e9;
          color: white;
        }
        .gp-btn-save:hover {
          background-color: #0284c7;
        }
        .gp-btn-cancel {
          background-color: #f3f4f6;
          color: #374151;
        }
        .gp-btn-cancel:hover {
          background-color: #e5e7eb;
        }
        .gp-btn-danger {
          background-color: #dc2626;
          color: white;
        }
        .gp-btn-danger:hover {
          background-color: #b91c1c;
        }
        .gp-delete-modal-content {
          text-align: center;
          padding: 2rem;
        }
        .gp-delete-buttons {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-top: 2rem;
        }
          .animate-fade-in-out {
  animation: fadeInUp 0.5s ease-out, fadeOutDown 0.5s ease-out 2.5s forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translate(-50%, -20px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

@keyframes fadeOutDown {
  from {
    opacity: 1;
    transform: translate(-50%, 0);
  }
  to {
    opacity: 0;
    transform: translate(-50%, 20px);
  }
}
      `}</style>

      <div className="px-6 pt-6 border-b-2 border-gray-300">
        <h1 className={`text-2xl font-bold text-center ${
          color === "light" ? "text-gray-800" : "text-white"
        }`}>
          Liste des tickets
        </h1>
      </div>

      <div className="flex justify-between px-6 pt-6 pb-4 items-center gap-4">
        <input
          type="text"
      
          placeholder="🔍 Rechercher par surnom ou email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-64 px-4 py-2 border rounded-lg shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-4"
        />

        <div className="flex gap-4 items-center">
          <FaFilter className="text-gray-700 text-xl mr-2" />

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-50 sm:w-64 border rounded-lg shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-4"
          >
            <option value="">Filtrer par urgence</option>
            <option value="Urgent">Urgent</option>
            <option value="Normal">Normal</option>
          </select>

          <button 
            className="gp-add-button" 
            onClick={() => setModalOuvert(true)}
          >
            <span>+</span>
            <span>Créer</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto px-6 pt-4 pb-14">
        <table className="w-full border-collapse">
{/* En-têtes du tableau */}
<thead>
  <tr className={`text-left ${color === "light" ? "bg-gray-50 text-gray-500" : "bg-slate-700 text-slate-200"}`}>
    <th className="px-6 py-4 font-medium">ID</th>
    <th className="px-6 py-4 font-medium">Surnom</th>
    <th className="px-6 py-4 font-medium">Email</th>
    <th className="px-6 py-4 font-medium">Urgence</th>
    <th className="px-6 py-4 font-medium">Statut</th>
    <th className="px-6 py-4 font-medium">Date</th>
    <th className="px-6 py-4 font-medium">Actions</th>
  </tr>
</thead>
<tbody>
  {filteredItems.map((item) => (
    <tr key={item.id} className={`border-t ${color === "light" ? "hover:bg-gray-50" : "hover:bg-slate-700"} transition-colors`}>
      <td className="px-6 py-4">{item.id}</td>
      <td className="px-6 py-4 font-medium">{item.surnom}</td>
      <td className="px-6 py-4">{item.email}</td>
      <td className="px-6 py-4 font-semibold text-red-600">{item.urgency}</td>
      <td className="px-6 py-4">
        <span style={badgeStyle(item.status)}>
          {item.status}
        </span>
      </td>
      <td className="px-6 py-4">{item.date}</td>
      
      {/* Colonne Actions - Totalement intacte */}
      <td className="px-6 py-4">
        <div className="flex" style={{ gap: "8px" }}>
          <button
            onClick={() => {
              setSelectedTicket(item);
              setDetailsModalOpen(true);
            }}
            className="gp-action-icon gp-view"
            title="Voir les détails"
          >
            <FaEye size={16} />
          </button>
          <button
            onClick={() => {
              setEditingTicket(item);
              setEditModalOuvert(true);
            }}
            className="gp-action-icon gp-edit"
            title="Modifier"
          >
            <FaEdit size={16} />
          </button>
          <button
            onClick={() => {
              setTicketToDelete(item.id);
              setDeleteModalOuvert(true);
            }}
            className="gp-action-icon gp-delete"
            title="Supprimer"
          >
            <FaTrash size={16} />
          </button>
        </div>
      </td>
    </tr>
  ))}
</tbody>

        </table>
      </div>

      {/* Modal Création */}
      {modalOuvert && (
        <div className="gp-modal-overlay">
          <div className="gp-modal-container">
            <div className="gp-modal-header">
              <h2 className="text-xl font-bold">Créer un ticket</h2>
              <button onClick={() => setModalOuvert(false)}>
                <X size={24} />
              </button>
            </div>

            <div>
              <div className="gp-form-group">
                <label className="block font-semibold mb-1">Sujet</label>
                <input
                  type="text"
                  name="subject"
                  value={newTicket.subject}
                  onChange={handleChange}
                  className="gp-form-input"
                />
                {errors.subject && <p className="text-red-500 text-sm">{errors.subject}</p>}
              </div>

              <div className="gp-form-group">
                <label className="block font-semibold mb-1">Type</label>
                <select
                  name="type"
                  value={newTicket.type}
                  onChange={handleChange}
                  className="gp-form-input"
                >
                  <option value="">-- Sélectionner --</option>
                  <option value="Informatique">Informatique</option>
                  <option value="Ressources humaines">Ressources humaines</option>
                  <option value="Comptabilité">Comptabilité</option>
                </select>
                {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}
              </div>

              <div className="gp-form-group">
                <label className="block font-semibold mb-1">Urgence</label>
                <select
                  name="urgency"
                  value={newTicket.urgency}
                  onChange={handleChange}
                  className="gp-form-input"
                >
                  <option value="">-- Sélectionner --</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Normal">Normal</option>
                </select>
                {errors.urgency && <p className="text-red-500 text-sm">{errors.urgency}</p>}
              </div>

              <div className="gp-form-group">
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  name="description"
                  value={newTicket.description}
                  onChange={handleChange}
                  rows={4}
                  className="gp-form-input"
                />
                {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
              </div>

              <div className="flex justify-end mt-4" style={{ gap: "12px" }}>
                <button 
                  type="button"
                  onClick={() => setModalOuvert(false)} 
                  className="gp-btn gp-btn-cancel"
                >
                  Annuler
                </button>
                <button 
                  type="button"
                  onClick={handleCreateSubmit} 
                  className="gp-btn gp-btn-save"
                >
                  Créer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Détails */}
      {detailsModalOpen && selectedTicket && (
        <div className="gp-modal-overlay">
          <div className="gp-modal-container p-6 bg-white rounded-2xl shadow-2xl max-w-md mx-auto">
  <div className="gp-modal-header flex justify-between items-center border-b pb-4 mb-4">
    <h2 className="text-2xl font-extrabold text-gray-800">🧾 Détails du ticket</h2>
    <button onClick={() => setDetailsModalOpen(false)} className="text-gray-500 hover:text-red-500 transition">
      <X size={28} />
    </button>
  </div>

  <div className="space-y-4">
    {[
      { label: ' ID', value: selectedTicket.id },
      { label: ' Sujet', value: selectedTicket.subject },
      { label: ' Type', value: selectedTicket.type },
      { label: '🚨 Urgence', value: selectedTicket.urgency },
      { label: ' Statut', value: selectedTicket.status },
      { label: 'Date', value: selectedTicket.date },
      { label: ' Description', value: selectedTicket.description, isMultiline: true },
    ].map((item, index) => (
      <div
        key={index}
        className="bg-gray-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
      >
        <label className="block text-sm font-bold text-gray-600 mb-1">{item.label}</label>
        <p className={item.isMultiline ? 'whitespace-pre-wrap text-gray-700' : 'text-gray-700'}>
          {item.value}
        </p>
      </div>
    ))}
  </div>
</div>

        </div>
      )}

      {/* Modal Édition */}
      {editModalOuvert && editingTicket && (
        <div className="gp-modal-overlay">
          <div className="gp-modal-container">
            <div className="gp-modal-header">
              <h2 className="text-xl font-bold">Modifier le ticket</h2>
              <button onClick={() => setEditModalOuvert(false)}>
                <X size={24} />
              </button>
            </div>

            <div>
              <div className="gp-form-group">
                <label className="block font-semibold mb-1">ID</label>
                <div className="gp-readonly-text">{editingTicket.id}</div>
              </div>

              <div className="gp-form-group">
                <label className="block font-semibold mb-1">Sujet</label>
                <input
                  type="text"
                  name="subject"
                  value={editingTicket.subject}
                  onChange={handleEditChange}
                  className="gp-form-input"
                />
                {editErrors.subject && <p className="text-red-500 text-sm">{editErrors.subject}</p>}
              </div>

              <div className="gp-form-group">
                <label className="block font-semibold mb-1">Type</label>
                <select
                  name="type"
                  value={editingTicket.type}
                  onChange={handleEditChange}
                  className="gp-form-input"
                >
                  <option value="">-- Sélectionner --</option>
                  <option value="Informatique">Informatique</option>
                  <option value="Ressources humaines">Ressources humaines</option>
                  <option value="Comptabilité">Comptabilité</option>
                </select>
                {editErrors.type && <p className="text-red-500 text-sm">{editErrors.type}</p>}
              </div>

              <div className="gp-form-group">
                <label className="block font-semibold mb-1">Urgence</label>
                <select
                  name="urgency"
                  value={editingTicket.urgency}
                  className="gp-form-input gp-disabled-input"
                  disabled
                >
                  <option value="Urgent">Urgent</option>
                  <option value="Normal">Normal</option>
                </select>
              </div>
              <div className="gp-form-group">
  <label className="block font-semibold mb-1">Statut</label>
  <select
    name="statut"
    value={editingTicket.statut}
    onChange={handleEditChange}
    className="gp-form-input"
  >
    <option value="ouvert">Ouvert</option>
    <option value="en cours">En cours</option>
    <option value="fermé">Fermé</option>
  </select>
</div>

              

              <div className="gp-form-group">
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  name="description"
                  value={editingTicket.description}
                  onChange={handleEditChange}
                  rows={4}
                  className="gp-form-input"
                />
                {editErrors.description && <p className="text-red-500 text-sm">{editErrors.description}</p>}
              </div>

              <div className="flex justify-end mt-4" style={{ gap: "12px" }}>
                <button 
                  onClick={() => setEditModalOuvert(false)} 
                  className="gp-btn gp-btn-cancel"
                >
                  Annuler
                </button>
                <button 
                  onClick={handleEditSubmit}
                  className="gp-btn gp-btn-save"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Suppression */}
      {deleteModalOuvert && (
        <div className="gp-modal-overlay">
          <div className="gp-modal-container">
            <div className="gp-modal-header">
              <h2 className="text-xl font-bold">Confirmer la suppression</h2>
              <button onClick={() => setDeleteModalOuvert(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="gp-delete-modal-content">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-red-600 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              
              <p className="text-lg font-medium">
                Êtes-vous sûr de vouloir supprimer ce ticket ?
              </p>

              <div className="gp-delete-buttons">
                <button
                  onClick={() => setDeleteModalOuvert(false)}
                  className="gp-btn gp-btn-cancel"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmDelete}
                  className="gp-btn gp-btn-danger"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showSuccessMessage && (
  <div className="fixed top-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-md shadow-md border-l-4 animate-fade-in-out"
       style={{ backgroundColor: "#88d1a2", color: "white", borderLeftColor: "#86efac", zIndex: 1000 }}>
    <div className="flex items-center gap-3">
      <svg xmlns="http://www.w3.org/2000/svg" 
           width="24" height="24" viewBox="0 0 24 24" 
           fill="none" 
           stroke="white" 
           strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
           className="lucide lucide-check-circle">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
      <span className="font-medium">Ticket supprimé avec succès</span>
    </div>
  </div>
)}
    </div>
  );
}

TicketTable.defaultProps = {
  color: "light",
};

TicketTable.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
};