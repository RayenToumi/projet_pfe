import React, { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { FaFilter, FaEye } from "react-icons/fa";
import { X } from "lucide-react";

export default function TicketTech({ color }) {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterId, setFilterId] = useState("");
  const [error, setError] = useState(null);

  // États création
  const [modalOuvert, setModalOuvert] = useState(false);
  const [newTicket, setNewTicket] = useState({
    subject: "",
    type: "",
    urgency: "",
    description: "",
  });
  const [errors, setErrors] = useState({});

  // États détails
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        const { data } = await axios.get('/allticketstec', {
          headers: {
            Authorization: `Bearer ${token}`, // si besoin
          }
        });
        const formatted = data.map(t => {
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
  }, [modalOuvert]);

  const handleChange = (e) => {
    setNewTicket({ ...newTicket, [e.target.name]: e.target.value });
  };

  const validateForm = (ticket) => {
    const errors = {};
    
    if (!ticket.subject?.trim()) {
      errors.subject = "Le sujet est requis.";
    }
    
    if (!ticket.type) {
      errors.type = "Le type est requis.";
    }
    
    if (!ticket.urgency) {
      errors.urgency = "L'urgence est requise.";
    }
    
    if (!ticket.description?.trim()) {
      errors.description = "La description est requise.";
    }
    
    return errors;
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
      `}</style>

      <div className="px-6 pt-6 border-b-2 border-gray-300">
        <h1 className={`text-2xl font-bold text-center ${
          color === "light" ? "text-gray-800" : "text-white"
        }`}>
          Mes tâches


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
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Création */}


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
    </div>
  );
}

TicketTech.defaultProps = {
  color: "light",
};

TicketTech.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
};