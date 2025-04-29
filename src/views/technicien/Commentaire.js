import React, { useState } from "react";
import PropTypes from "prop-types";
import { FaFilter, FaEdit, FaTrash } from "react-icons/fa";
import { X } from "lucide-react";

export default function TechnicienTable({ color }) {
  const [techniciens, setTechniciens] = useState([
    {
      id: 1,
      nom: "Dubois",
      prenom: "Marc",
      specialite: "Informatique",
      password: "secret123",
    },
    {
      id: 2,
      nom: "Leroy",
      prenom: "Julie",
      specialite: "Réseaux",
      password: "reseau456",
    },
    {
      id: 3,
      nom: "Moreau",
      prenom: "Luc",
      specialite: "Électricité",
      password: "elec789",
    },
    {
      id: 4,
      nom: "Roux",
      prenom: "Émilie",
      specialite: "Maintenance",
      password: "maint012",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterSpecialite, setFilterSpecialite] = useState("");
  const [filterId, setFilterId] = useState("");

  const [modalOuvert, setModalOuvert] = useState(false);
  const [newTechnicien, setNewTechnicien] = useState({
    nom: "",
    prenom: "",
    specialite: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const [editModalOuvert, setEditModalOuvert] = useState(false);
  const [editingTechnicien, setEditingTechnicien] = useState(null);
  const [editErrors, setEditErrors] = useState({});

  const [deleteModalOuvert, setDeleteModalOuvert] = useState(false);
  const [technicienIdToDelete, setTechnicienIdToDelete] = useState(null);

  const handleChange = (e) => {
    setNewTechnicien({ ...newTechnicien, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditingTechnicien({ ...editingTechnicien, [e.target.name]: e.target.value });
  };

  const validateForm = (technicien) => {
    const errors = {};
    if (!technicien.nom.trim()) errors.nom = "Le nom est requis";
    if (!technicien.prenom.trim()) errors.prenom = "Le prénom est requis";
    if (!technicien.specialite) errors.specialite = "La spécialité est requise";
    if (!technicien.password.trim()) errors.password = "Le mot de passe est requis";
    return errors;
  };

  const validateEditForm = (technicien) => {
    const errors = {};
    if (!technicien.nom.trim()) errors.nom = "Le nom est requis";
    if (!technicien.prenom.trim()) errors.prenom = "Le prénom est requis";
    if (!technicien.specialite) errors.specialite = "La spécialité est requise";
    return errors;
  };

  const handleCreateSubmit = () => {
    const errors = validateForm(newTechnicien);
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
    } else {
      const newItem = {
        ...newTechnicien,
        id: techniciens.length + 1,
      };
      setTechniciens([...techniciens, newItem]);
      setModalOuvert(false);
      setNewTechnicien({ nom: "", prenom: "", specialite: "", password: "" });
    }
  };

  const handleEditSubmit = () => {
    const errors = validateEditForm(editingTechnicien);
    if (Object.keys(errors).length > 0) {
      setEditErrors(errors);
    } else {
      setTechniciens(techniciens.map(tech => 
        tech.id === editingTechnicien.id ? editingTechnicien : tech
      ));
      setEditModalOuvert(false);
    }
  };

  const confirmDelete = () => {
    setTechniciens(techniciens.filter(tech => tech.id !== technicienIdToDelete));
    setDeleteModalOuvert(false);
  };

  const filteredTechniciens = techniciens.filter(tech => {
    const matchesId = filterId ? tech.id.toString().includes(filterId) : true;
    const matchesSearch = searchQuery
      ? tech.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tech.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tech.specialite.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesSpecialite = filterSpecialite ? tech.specialite === filterSpecialite : true;

    return matchesId && matchesSearch && matchesSpecialite;
  });

  const specialiteStyle = (specialite) => ({
    padding: "0.25rem 0.5rem",
    borderRadius: "9999px",
    fontSize: "0.75rem",
    fontWeight: "500",
    backgroundColor:
      specialite === "Informatique" ? "#dbeafe" :
      specialite === "Réseaux" ? "#dcfce7" :
      specialite === "Électricité" ? "#fef3c7" : "#fee2e2",
    color:
      specialite === "Informatique" ? "#1d4ed8" :
      specialite === "Réseaux" ? "#15803d" :
      specialite === "Électricité" ? "#b45309" : "#b91c1c",
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
      `}</style>

      <div className="px-6 pt-6 border-b-2 border-gray-300">
        <h1 className={`text-2xl font-bold text-center ${
          color === "light" ? "text-gray-800" : "text-white"
        }`}>
          les avis des clients 
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

      </div>

      <div className="overflow-x-auto px-6 pt-4 pb-14">
        <table className="w-full border-collapse">
          <thead>
            <tr className={`text-left ${
              color === "light" ? "bg-gray-50 text-gray-500" : "bg-slate-700 text-slate-200"
            }`}>
              <th className="px-6 py-4 font-medium">l'id du ticket</th>
              <th className="px-6 py-4 font-medium">Nom</th>
              <th className="px-6 py-4 font-medium">Prénom</th>
              <th className="px-6 py-4 font-medium">avis de client</th>
              <th className="px-6 py-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTechniciens.map((tech) => (
              <tr 
                key={tech.id} 
                className={`border-t ${
                  color === "light" ? "hover:bg-gray-50" : "hover:bg-slate-700"
                } transition-colors`}
              >
                <td className="px-6 py-4">{tech.id}</td>
                <td className="px-6 py-4">{tech.nom}</td>
                <td className="px-6 py-4">{tech.prenom}</td>
                <td className="px-6 py-4">
                  <span style={specialiteStyle(tech.specialite)}>
                    {tech.specialite}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex">
                    <button
                      onClick={() => {
                        setEditingTechnicien(tech);
                        setEditModalOuvert(true);
                      }}
                      className="gp-action-icon gp-edit mr-2"
                      title="Modifier"
                    >
                      <FaEdit size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setTechnicienIdToDelete(tech.id);
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

      {/* Modal Ajout */}
      {modalOuvert && (
        <div className="gp-modal-overlay">
          <div className="gp-modal-container">
            <div className="gp-modal-header">
              <h2 className="text-xl font-bold">Nouveau Technicien</h2>
              <button onClick={() => setModalOuvert(false)}>
                <X size={24} />
              </button>
            </div>

            <div>
              <div className="gp-form-group">
                <label className="block font-semibold mb-1">Nom *</label>
                <input
                  type="text"
                  name="nom"
                  value={newTechnicien.nom}
                  onChange={handleChange}
                  className="gp-form-input"
                />
                {errors.nom && <p className="text-red-500 text-sm">{errors.nom}</p>}
              </div>

              <div className="gp-form-group">
                <label className="block font-semibold mb-1">Prénom *</label>
                <input
                  type="text"
                  name="prenom"
                  value={newTechnicien.prenom}
                  onChange={handleChange}
                  className="gp-form-input"
                />
                {errors.prenom && <p className="text-red-500 text-sm">{errors.prenom}</p>}
              </div>

              <div className="gp-form-group">
                <label className="block font-semibold mb-1">Spécialité *</label>
                <select
                  name="specialite"
                  value={newTechnicien.specialite}
                  onChange={handleChange}
                  className="gp-form-input"
                >
                  <option value="">Sélectionner une spécialité</option>
                  <option value="Informatique">Informatique</option>
                  <option value="Réseaux">Réseaux</option>
                  <option value="Électricité">Électricité</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
                {errors.specialite && <p className="text-red-500 text-sm">{errors.specialite}</p>}
              </div>

              <div className="gp-form-group">
                <label className="block font-semibold mb-1">Mot de passe *</label>
                <input
                  type="password"
                  name="password"
                  value={newTechnicien.password}
                  onChange={handleChange}
                  className="gp-form-input"
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
              </div>

              <div className="flex justify-end mt-4 gap-2">
                <button 
                  onClick={() => setModalOuvert(false)} 
                  className="gp-btn gp-btn-cancel"
                >
                  Annuler
                </button>
                <button 
                  onClick={handleCreateSubmit} 
                  className="gp-btn gp-btn-save"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Modification */}
      {editModalOuvert && editingTechnicien && (
        <div className="gp-modal-overlay">
          <div className="gp-modal-container">
            <div className="gp-modal-header">
              <h2 className="text-xl font-bold">Modifier Technicien</h2>
              <button onClick={() => setEditModalOuvert(false)}>
                <X size={24} />
              </button>
            </div>

            <div>
              <div className="gp-form-group">
                <label className="block font-semibold mb-1">l'ID du ticket </label>
                <div className="gp-readonly-text">{editingTechnicien.id}</div>
              </div>

              <div className="gp-form-group">
                <label className="block font-semibold mb-1">Nom *</label>
                <input
                  type="text"
                  name="nom"
                  value={editingTechnicien.nom}
                  onChange={handleEditChange}
                  className="gp-form-input"
                />
                {editErrors.nom && <p className="text-red-500 text-sm">{editErrors.nom}</p>}
              </div>

              <div className="gp-form-group">
                <label className="block font-semibold mb-1">Prénom *</label>
                <input
                  type="text"
                  name="prenom"
                  value={editingTechnicien.prenom}
                  onChange={handleEditChange}
                  className="gp-form-input"
                />
                {editErrors.prenom && <p className="text-red-500 text-sm">{editErrors.prenom}</p>}
              </div>

              <div className="gp-form-group">
                <label className="block font-semibold mb-1">Spécialité *</label>
                <select
                  name="specialite"
                  value={editingTechnicien.specialite}
                  onChange={handleEditChange}
                  className="gp-form-input"
                >
                  <option value="Informatique">Informatique</option>
                  <option value="Réseaux">Réseaux</option>
                  <option value="Électricité">Électricité</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
                {editErrors.specialite && <p className="text-red-500 text-sm">{editErrors.specialite}</p>}
              </div>

              <div className="gp-form-group">
                <label className="block font-semibold mb-1">Nouveau mot de passe</label>
                <input
                  type="password"
                  name="password"
                  value={editingTechnicien.password || ''}
                  onChange={handleEditChange}
                  className="gp-form-input"
                  placeholder="Laisser vide pour ne pas modifier"
                />
              </div>

              <div className="flex justify-end mt-4 gap-2">
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
                  Sauvegarder
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
              <h2 className="text-xl font-bold">Confirmation</h2>
              <button onClick={() => setDeleteModalOuvert(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="text-center p-6">
              <div className="mb-4">
                <svg
                  className="mx-auto h-16 w-16 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <p className="text-lg font-medium mb-4">
                Êtes-vous sûr de vouloir supprimer ce technicien ?
              </p>
              <div className="flex justify-center gap-4">
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
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

TechnicienTable.defaultProps = {
  color: "light",
};

TechnicienTable.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
};