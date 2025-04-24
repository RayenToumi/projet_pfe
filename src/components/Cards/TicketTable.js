import React, { useState } from "react";
import PropTypes from "prop-types";
import { FaFilter } from "react-icons/fa";
import { X } from "lucide-react";

export default function CardTable({ color }) {
  const [items, setItems] = useState([
    {
      id: 1,
      subject: "Problème d'accès à l'internet",
      type: "Technique",
      urgency: "Urgent",
      status: "En attente",
      date: "2025-03-29",
      description: "Le site intranet était inaccessible depuis plusieurs jours.",
    },
    {
      id: 2,
      subject: "Mise à jour logiciel",
      type: "Fonctionnel",
      urgency: "Normal",
      status: "Terminé",
      date: "2025-04-15",
      description: "Mise à jour du logiciel de gestion RH.",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterId, setFilterId] = useState("");

  const [modalOuvert, setModalOuvert] = useState(false);
  const [newTicket, setNewTicket] = useState({
    subject: "",
    type: "",
    urgency: "",
    description: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setNewTicket({ ...newTicket, [e.target.name]: e.target.value });
  };

  const handleModalCancel = () => {
    setModalOuvert(false);
    setNewTicket({ subject: "", type: "", urgency: "", description: "" });
    setErrors({});
  };

  const handleModalSubmit = () => {
    const newErrors = {};
    if (!newTicket.subject.trim()) newErrors.subject = "Le sujet est requis.";
    if (!newTicket.type) newErrors.type = "Le type est requis.";
    if (!newTicket.urgency) newErrors.urgency = "L'urgence est requise.";
    if (!newTicket.description.trim()) newErrors.description = "La description est requise.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      const newItem = {
        ...newTicket,
        id: items.length + 1,
        status: "En attente",
        date: new Date().toISOString().split("T")[0],
      };
      setItems([...items, newItem]);
      handleModalCancel();
    }
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Voulez-vous vraiment supprimer ce ticket ?");
    if (confirmDelete) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesId = filterId ? item.id.toString().includes(filterId) : true;
    const matchesSearch = searchQuery
      ? item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesType = filterType ? item.urgency === filterType : true;

    return matchesId && matchesSearch && matchesType;
  });

  const badgeStyle = {
    backgroundColor: "#e6fffa",
    color: "#047857",
    padding: "0.25rem 0.5rem",
    borderRadius: "9999px",
    fontSize: "0.75rem",
    fontWeight: "500",
  };

  return (
    <div className={`relative mx-auto max-w-screen-xl flex flex-col min-w-0 rounded-lg shadow-lg mb-10 ${color === "light" ? "bg-white" : "bg-slate-800 text-white"}`}>
      <style jsx>{`
        /* Style de base pour tous les boutons d'action */
        .gp-action-button {
          padding: 0.375rem;
          border-radius: 0.375rem;
          transition: all 0.2s ease;
        }

        /* Style spécifique pour le bouton Modifier */
        .gp-edit-button {
          background-color: #dbeafe; /* Bleu clair */
          color: #3b82f6; /* Bleu vif */
        }

        .gp-edit-button:hover {
          background-color: #bfdbfe; /* Bleu clair plus foncé au survol */
        }

        /* Style spécifique pour le bouton Supprimer */
        .gp-delete-button {
          background-color: #fee2e2; /* Rouge clair */
          color: #ef4444; /* Rouge vif */
        }

        .gp-delete-button:hover {
          background-color: #fecaca; /* Rouge clair plus foncé au survol */
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
        .gp-btn {
          padding: 0.5rem 1.25rem;
          border-radius: 0.375rem;
          font-weight: 600;
        }
        .gp-btn-save {
          background-color: #0ea5e9;
          color: white;
          margin-left: 1rem;
        }
        .gp-btn-cancel {
          background-color: #f3f4f6;
          color: #374151;
        }
      `}</style>

      <div className="px-6 pt-6 border-b-2 border-gray-300">
        <h1 className={`text-2xl font-bold text-center ${color === "light" ? "text-gray-800" : "text-white"}`}>
          Liste des tickets
        </h1>
      </div>

      <div className="flex justify-between px-6 pt-6 pb-4 items-center gap-4">
        <input
          type="text"
          placeholder="🔍 Rechercher par ID..."
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

          <button className="gp-add-button" onClick={() => setModalOuvert(true)}>
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
              <th className="px-6 py-4 font-medium">Sujet</th>
              <th className="px-6 py-4 font-medium">Type</th>
              <th className="px-6 py-4 font-medium">Urgence</th>
              <th className="px-6 py-4 font-medium">Statut</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Description</th>
              <th className="px-6 py-4 font-medium">Actions</th> {/* Nouvelle colonne Actions */}
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr key={item.id} className={`border-t ${color === "light" ? "hover:bg-gray-50" : "hover:bg-slate-700"} transition-colors`}>
                <td className="px-6 py-4">{item.id}</td>
                <td className="px-6 py-4">{item.subject}</td>
                <td className="px-6 py-4">{item.type}</td>
                <td className="px-6 py-4 font-semibold text-red-600">{item.urgency}</td>
                <td className="px-6 py-4">
                  <span
                    style={{
                      ...badgeStyle,
                      backgroundColor: item.status === "En attente" ? "#e6fffa" : "#ffe6e6",
                      color: item.status === "En attente" ? "#047857" : "#d32f2f",
                    }}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4">{item.date}</td>
                <td className={`px-6 py-4 truncate max-w-[300px] ${color === "light" ? "text-gray-600" : "text-slate-300"}`}>
                  {item.description}
                </td>
                <td className="px-6 py-4">
  <div className="flex">
    <button
      onClick={() => alert(`Modifier ticket ID: ${item.id}`)} // À remplacer par ta fonction de modification
      className="gp-edit-button mr-4" // Ajout de margin-right
    >
      🖊 
    </button>
    <button
      onClick={() => handleDelete(item.id)}
      className="gp-delete-button"
    >
      🗑 
    </button>
  </div>
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOuvert && (
        <div className="gp-modal-overlay">
          <div className="gp-modal-container">
            <div className="gp-modal-header">
              <h2 className="text-xl font-bold">Créer un ticket</h2>
              <button onClick={handleModalCancel}><X size={24} /></button>
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
                  <option value="Technique">Technique</option>
                  <option value="Fonctionnel">Fonctionnel</option>
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

              <div className="flex justify-end mt-4">
                <button onClick={handleModalCancel} className="gp-btn gp-btn-cancel">Annuler</button>
                <button onClick={handleModalSubmit} className="gp-btn gp-btn-save">Ajouter</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

CardTable.defaultProps = {
  color: "light",
};

CardTable.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
};
