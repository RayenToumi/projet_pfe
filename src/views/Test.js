import React, { useState } from "react";
import PropTypes from "prop-types";
import { FaFilter, FaEdit, FaTrash } from "react-icons/fa";
import { X } from "lucide-react";

export default function CardTable({ color }) {
  const [items, setItems] = useState([
    {
      id: 1,
      nom: "Dupont",
      prenom: "Jean",
      email: "j.dupont@example.com",
      telephone: "01 23 45 67 89",
      role: "admin",
    },
    {
      id: 2,
      nom: "Martin",
      prenom: "Sophie",
      email: "s.martin@example.com",
      telephone: "06 12 34 56 78",
      role: "utilisateur",
    },
    {
      id: 3,
      nom: "Leroy",
      prenom: "Pierre",
      email: "p.leroy@example.com",
      telephone: "07 89 01 23 45",
      role: "technicien",
    },
    {
      id: 4,
      nom: "Dubois",
      prenom: "Marie",
      email: "m.dubois@example.com",
      telephone: "04 56 78 90 12",
      role: "manager",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterId, setFilterId] = useState("");

  const [modalOuvert, setModalOuvert] = useState(false);
  const [newUser, setNewUser] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    role: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const [editModalOuvert, setEditModalOuvert] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editErrors, setEditErrors] = useState({});

  const [deleteModalOuvert, setDeleteModalOuvert] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);

  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditingUser({ ...editingUser, [e.target.name]: e.target.value });
  };

  const validateForm = (user) => {
    const errors = {};
    if (!user.nom.trim()) errors.nom = "Le nom est requis.";
    if (!user.prenom.trim()) errors.prenom = "Le prénom est requis.";
    if (!user.email.trim()) errors.email = "L'email est requis.";
    if (!user.telephone.trim()) errors.telephone = "Le téléphone est requis.";
    if (!user.password.trim()) errors.password = "Le mot de passe est requis.";
    if (!user.role) errors.role = "Le rôle est requis.";
    return errors;
  };

  const validateEditForm = (user) => {
    const errors = {};
    if (!user.nom.trim()) errors.nom = "Le nom est requis.";
    if (!user.prenom.trim()) errors.prenom = "Le prénom est requis.";
    if (!user.email.trim()) errors.email = "L'email est requis.";
    if (!user.telephone.trim()) errors.telephone = "Le téléphone est requis.";
    if (!user.role) errors.role = "Le rôle est requis.";
    return errors;
  };

  const handleCreateSubmit = () => {
    const errors = validateForm(newUser);
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
    } else {
      const newItem = {
        ...newUser,
        id: items.length + 1,
      };
      setItems([...items, newItem]);
      setModalOuvert(false);
      setNewUser({ nom: "", prenom: "", email: "", telephone: "", role: "", password: "" });
    }
  };

  const handleEditSubmit = () => {
    const errors = validateEditForm(editingUser);
    if (Object.keys(errors).length > 0) {
      setEditErrors(errors);
    } else {
      setItems(items.map(item => item.id === editingUser.id ? editingUser : item));
      setEditModalOuvert(false);
    }
  };

  const confirmDelete = () => {
    setItems(items.filter(item => item.id !== userIdToDelete));
    setDeleteModalOuvert(false);
  };

  const filteredItems = items.filter(item => {
    const matchesId = filterId ? item.id.toString().includes(filterId) : true;
    const matchesSearch = searchQuery
      ? item.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesRole = filterRole ? item.role === filterRole : true;

    return matchesId && matchesSearch && matchesRole;
  });

  const roleStyle = (role) => ({
    padding: "0.25rem 0.5rem",
    borderRadius: "9999px",
    fontSize: "0.75rem",
    fontWeight: "500",
    backgroundColor:
      role === "admin" ? "#dcfce7" :
      role === "manager" ? "#ffedd5" :
      role === "technicien" ? "#fee2e2" : "#f3f4f6",
    color:
      role === "admin" ? "#16a34a" :
      role === "manager" ? "#ea580c" :
      role === "technicien" ? "#dc2626" : "#374151",
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
      `}</style>

      <div className="px-6 pt-6 border-b-2 border-gray-300">
        <h1 className={`text-2xl font-bold text-center ${
          color === "light" ? "text-gray-800" : "text-white"
        }`}>
          Liste des utilisateurs
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
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="w-50 sm:w-64 border rounded-lg shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-4"
          >
            <option value="">Tous les rôles</option>
            <option value="admin">Admin</option>
            <option value="utilisateur">Utilisateur</option>
            <option value="manager">Manager</option>
            <option value="technicien">Technicien</option>
          </select>

          <button 
            className="gp-add-button" 
            onClick={() => setModalOuvert(true)}
          >
            <span>+</span>
            <span>Ajouter </span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto px-6 pt-4 pb-14">
        <table className="w-full border-collapse">
          <thead>
            <tr className={`text-left ${
              color === "light" ? "bg-gray-50 text-gray-500" : "bg-slate-700 text-slate-200"
            }`}>
              <th className="px-6 py-4 font-medium">ID</th>
              <th className="px-6 py-4 font-medium">Nom</th>
              <th className="px-6 py-4 font-medium">Prénom</th>
              <th className="px-6 py-4 font-medium">Email</th>
              <th className="px-6 py-4 font-medium">Téléphone</th>
              <th className="px-6 py-4 font-medium">Rôle</th>
              <th className="px-6 py-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr 
                key={item.id} 
                className={`border-t ${
                  color === "light" ? "hover:bg-gray-50" : "hover:bg-slate-700"
                } transition-colors`}
              >
                <td className="px-6 py-4">{item.id}</td>
                <td className="px-6 py-4">{item.nom}</td>
                <td className="px-6 py-4">{item.prenom}</td>
                <td className="px-6 py-4">{item.email}</td>
                <td className="px-6 py-4">{item.telephone}</td>
                <td className="px-6 py-4">
                  <span style={roleStyle(item.role)}>
                    {item.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex">
                    <button
                      onClick={() => {
                        setEditingUser(item);
                        setEditModalOuvert(true);
                      }}
                      className="gp-action-icon gp-edit mr-2"
                      title="Modifier"
                    >
                      <FaEdit size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setUserIdToDelete(item.id);
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

      {modalOuvert && (
        <div className="gp-modal-overlay">
          <div className="gp-modal-container">
            <div className="gp-modal-header">
              <h2 className="text-xl font-bold">Créer un utilisateur</h2>
              <button onClick={() => setModalOuvert(false)}>
                <X size={24} />
              </button>
            </div>

            <div>
              <div className="gp-form-group">
                <label className="block font-semibold mb-1">Nom</label>
                <input
                  type="text"
                  name="nom"
                  value={newUser.nom}
                  onChange={handleChange}
                  className="gp-form-input"
                />
                {errors.nom && <p className="text-red-500 text-sm">{errors.nom}</p>}
              </div>

              <div className="gp-form-group">
                <label className="block font-semibold mb-1">Prénom</label>
                <input
                  type="text"
                  name="prenom"
                  value={newUser.prenom}
                  onChange={handleChange}
                  className="gp-form-input"
                />
                {errors.prenom && <p className="text-red-500 text-sm">{errors.prenom}</p>}
              </div>

              <div className="gp-form-group">
                <label className="block font-semibold mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleChange}
                  className="gp-form-input"
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>

              <div className="gp-form-group">
                <label className="block font-semibold mb-1">Téléphone</label>
                <input
                  type="tel"
                  name="telephone"
                  value={newUser.telephone}
                  onChange={handleChange}
                  className="gp-form-input"
                />
                {errors.telephone && <p className="text-red-500 text-sm">{errors.telephone}</p>}
              </div>

             

              <div className="gp-form-group">
                <label className="block font-semibold mb-1">Rôle</label>
                <select
                  name="role"
                  value={newUser.role}
                  onChange={handleChange}
                  className="gp-form-input"
                >
                  <option value="">-- Sélectionner --</option>
                  <option value="admin">Admin</option>
                  <option value="utilisateur">Utilisateur</option>
                  <option value="manager">Manager</option>
                  <option value="technicien">Technicien</option>
                </select>
                {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
              </div>

              {newUser.role === "technicien" && (
                <div className="gp-form-group">
                  <label className="block font-semibold mb-1">Département</label>
                  <select
                    name="department"
                    value={newUser.department}
                    onChange={handleChange}
                    className="gp-form-input"
                  >
                    <option value="">-- Sélectionner --</option>
                    <option value="Informatique">Informatique</option>
                    <option value="Ressources Humaines">Ressources Humaines</option>
                    <option value="Finance">Finance</option>
                  </select>
                  {errors.department && <p className="text-red-500 text-sm">{errors.department}</p>}
                </div>
              )}

              <div className="flex justify-end mt-4" style={{ gap: "12px" }}>
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
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editModalOuvert && editingUser && (
        <div className="gp-modal-overlay">
          <div className="gp-modal-container">
            <div className="gp-modal-header">
              <h2 className="text-xl font-bold">Modifier l'utilisateur</h2>
              <button onClick={() => setEditModalOuvert(false)}>
                <X size={24} />
              </button>
            </div>

            <div>
              <div className="gp-form-group">
                <label className="block font-semibold mb-1">ID</label>
                <div className="gp-readonly-text">{editingUser.id}</div>
              </div>

              <div className="gp-form-group">
                <label className="block font-semibold mb-1">Nom</label>
                <input
                  type="text"
                  name="nom"
                  value={editingUser.nom}
                  onChange={handleEditChange}
                  className="gp-form-input"
                />
                {editErrors.nom && <p className="text-red-500 text-sm">{editErrors.nom}</p>}
              </div>

              <div className="gp-form-group">
                <label className="block font-semibold mb-1">Prénom</label>
                <input
                  type="text"
                  name="prenom"
                  value={editingUser.prenom}
                  onChange={handleEditChange}
                  className="gp-form-input"
                />
                {editErrors.prenom && <p className="text-red-500 text-sm">{editErrors.prenom}</p>}
              </div>

              <div className="gp-form-group">
                <label className="block font-semibold mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editingUser.email}
                  onChange={handleEditChange}
                  className="gp-form-input"
                />
                {editErrors.email && <p className="text-red-500 text-sm">{editErrors.email}</p>}
              </div>

              <div className="gp-form-group">
                <label className="block font-semibold mb-1">Téléphone</label>
                <input
                  type="tel"
                  name="telephone"
                  value={editingUser.telephone}
                  onChange={handleEditChange}
                  className="gp-form-input"
                />
                {editErrors.telephone && <p className="text-red-500 text-sm">{editErrors.telephone}</p>}
              </div>

              <div className="gp-form-group">
                <label className="block font-semibold mb-1">Mot de passe</label>
                <input
                  type="password"
                  name="password"
                  value={editingUser.password || ''}
                  onChange={handleEditChange}
                  className="gp-form-input"
                  placeholder="Nouveau mot de passe"
                />
              </div>

              <div className="gp-form-group">
                <label className="block font-semibold mb-1">Rôle</label>
                <select
                  name="role"
                  value={editingUser.role}
                  onChange={handleEditChange}
                  className="gp-form-input"
                >
                  <option value="admin">Admin</option>
                  <option value="utilisateur">Utilisateur</option>
                  <option value="manager">Manager</option>
                  <option value="technicien">Technicien</option>
                </select>
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
                Êtes-vous sûr de vouloir supprimer cet utilisateur ?
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

CardTable.defaultProps = {
  color: "light",
};

CardTable.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
};