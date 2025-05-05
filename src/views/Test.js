import React, { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { FaFilter, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { X } from "lucide-react";

export default function TicketTable({ color }) {
  const [items, setItems] = useState([]);
  const [filterType, setFilterType] = useState("");
  const [filterId, setFilterId] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

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
  const [originalTicketData, setOriginalTicketData] = useState(null);
  const [editErrors, setEditErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  // États suppression
  const [deleteModalOuvert, setDeleteModalOuvert] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState(null);

  // États détails
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        const { data } = await axios.get('/alltickets', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const formatted = data.map(t => ({
          id: t._id,
          surnom: t.createur?.surnom || 'Anonyme',
          email: t.createur?.email || 'N/A',
          technicien: t.technicien || 'Non assigné',
          datePriseEnCharge: new Date(t.updatedAt).toLocaleDateString('fr-FR'),
          urgency: t.urgence,
          description: t.description,
          status: t.statut?.charAt(0).toUpperCase() + t.statut?.slice(1) || 'Inconnu',
          date: new Date(t.date).toLocaleDateString('fr-FR'),
          subject: t.sujet,
          type: t.type,
          statut: t.statut
        }));

        setItems(formatted);
      } catch (error) {
        console.error("Erreur chargement:", error.response?.data);
      }
    };
    fetchTickets();
  }, [modalOuvert, editModalOuvert, deleteModalOuvert]);

  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessMessage]);

  const handleChange = (e) => {
    setNewTicket({ ...newTicket, [e.target.name]: e.target.value });
  };

  const validateForm = (ticket, isEdit = false) => {
    const errors = {};
    if (!ticket.subject?.trim()) errors.subject = "Le sujet est obligatoire.";
    if (!ticket.type) errors.type = "Le type est obligatoire.";
    if (!isEdit && !ticket.urgency) errors.urgency = "L'urgence est obligatoire.";
    if (!ticket.description?.trim()) errors.description = "La description est obligatoire.";
    if (isEdit && !ticket.statut) errors.statut = "Le statut est obligatoire.";
    return errors;
  };

  const handleCreateSubmit = async () => {
    const errors = validateForm(newTicket);
    if (Object.keys(errors).length > 0) return setErrors(errors);

    try {
      const token = localStorage.getItem("jwt_token");
      const response = await axios.post('/addticket', {
        sujet: newTicket.subject,
        type: newTicket.type,
        urgence: newTicket.urgency,
        description: newTicket.description
      }, { headers: { Authorization: `Bearer ${token}` } });

      setItems(prev => [...prev, {
        id: response.data._id,
        ...newTicket,
        status: 'Ouvert',
        date: new Date().toLocaleDateString('fr-FR')
      }]);

      setSuccessMessage('Ticket créé avec succès');
      setShowSuccessMessage(true);
      setModalOuvert(false);
      setNewTicket({ subject: "", type: "", urgency: "", description: "" });

    } catch (error) {
      console.error('Erreur création:', error);
    }
  };

  const handleEditChange = (e) => {
    setEditingTicket(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditSubmit = async () => {
    if (!editingTicket || !originalTicketData) return;
    
    const errors = validateForm(editingTicket, true);
    if (Object.keys(errors).length > 0) return setEditErrors(errors);

    setIsEditing(true);
    try {
      const hasChanges = Object.keys(editingTicket).some(key => 
        originalTicketData[key] !== editingTicket[key]
      );

      if (hasChanges) {
        const token = localStorage.getItem("jwt_token");
        await axios.put(`/updateticket/${editingTicket.id}`, {
          sujet: editingTicket.subject,
          type: editingTicket.type,
          description: editingTicket.description,
          statut: editingTicket.statut
        }, { headers: { Authorization: `Bearer ${token}` } });

        setItems(prev => prev.map(item => 
          item.id === editingTicket.id ? {
            ...item,
            ...editingTicket,
            status: editingTicket.statut.charAt(0).toUpperCase() + editingTicket.statut.slice(1)
          } : item
        ));
        setSuccessMessage('Ticket modifié avec succès');
      } else {
        setSuccessMessage('Rien à changer dans ce ticket');
      }

      setShowSuccessMessage(true);
      setEditModalOuvert(false);

    } catch (error) {
      console.error("Erreur mise à jour:", error.response?.data);
    } finally {
      setIsEditing(false);
      setOriginalTicketData(null);
    }
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("jwt_token");
      await axios.delete(`/deleteticket/${ticketToDelete}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setItems(prev => prev.filter(item => item.id !== ticketToDelete));
      setSuccessMessage('Ticket supprimé avec succès');
      setShowSuccessMessage(true);
      setDeleteModalOuvert(false);

    } catch (error) {
      console.error("Erreur suppression:", error.response?.data);
    }
  };

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

  const filteredItems = items.filter(item => {
    const matchesId = filterId ? item.id.toString().includes(filterId) : true;
    const matchesUrgency = filterType ? item.urgency === filterType : true;
    return matchesId && matchesUrgency;
  });

  return (
    <div className={`relative mx-auto max-w-screen-xl flex flex-col min-w-0 rounded-lg shadow-lg mb-10 ${
      color === "light" ? "bg-white" : "bg-slate-800 text-white"
    }`}>

      {showSuccessMessage && (
        <div className="toast-message animate-fade-in">
          <div className="toast-content">
            <div className="toast-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                   fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <span className="toast-text">{successMessage}</span>
          </div>
        </div>
      )}

      <style jsx>{`
        .gp-action-icon {
          padding: 0.45rem;
          border-radius: 0.375rem;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .toast-message {
          position: fixed;
          bottom: 40px;
          right: 40px;
          background: linear-gradient(145deg, #1a4338, #0d2a23);
          color: white;
          border-radius: 8px;
          padding: 18px 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          max-width: 400px;
          font-family: 'Inter', sans-serif;
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          gap: 14px;
          transform: translateY(20px);
          opacity: 0;
        }
        .toast-content {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .toast-icon {
          color: #76e0a7;
          display: flex;
          align-items: center;
        }
        .toast-icon svg {
          width: 22px;
          height: 22px;
        }
        .toast-text {
          font-size: 14px;
          font-weight: 400;
          line-height: 1.4;
          color: rgba(255, 255, 255, 0.95);
          letter-spacing: 0.2px;
        }
        @keyframes fade-in {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        .gp-view { background-color: #dbeafe; color: #2563eb; }
        .gp-view:hover { background-color: #bfdbfe; }
        .gp-edit { background-color: #e0f2fe; color: #0284c7; }
        .gp-edit:hover { background-color: #bae6fd; }
        .gp-delete { background-color: #fee2e2; color: #dc2626; }
        .gp-delete:hover { background-color: #fecaca; }
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
        .gp-add-button:hover { background-color: #0284c7; }
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
        .gp-form-group { margin-bottom: 1.5rem; }
        .gp-form-input {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 0.375rem;
        }
        .gp-btn {
          padding: 0.5rem 1.25rem;
          border-radius: 0.375rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .gp-btn-save { background-color: #0ea5e9; color: white; }
        .gp-btn-save:hover { background-color: #0284c7; }
        .gp-btn-cancel { background-color: #f3f4f6; color: #374151; }
        .gp-btn-cancel:hover { background-color: #e5e7eb; }
        .gp-btn-danger { background-color: #dc2626; color: white; }
        .gp-btn-danger:hover { background-color: #b91c1c; }
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
          placeholder="🔍 Rechercher par ID"
          value={filterId}
          onChange={(e) => setFilterId(e.target.value)}
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
                        setOriginalTicketData(item);
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

      {/* Modals */}
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
                  <option value="IT">Informatique</option>
                  <option value="NET">Problème réseau</option>
                  <option value="DAB">Distributeur (DAB)</option>
                  <option value="SC">Support client</option>
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
                  <option value="IT">Informatique</option>
                  <option value="NET">Problème réseau</option>
                  <option value="DAB">Distributeur (DAB)</option>
                  <option value="SC">Support client</option>
                </select>
                {editErrors.type && <p className="text-red-500 text-sm">{editErrors.type}</p>}
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
                {editErrors.statut && <p className="text-red-500 text-sm">{editErrors.statut}</p>}
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
                  disabled={isEditing}
                >
                  {isEditing ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
}

TicketTable.defaultProps = {
  color: "light",
};

TicketTable.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
};