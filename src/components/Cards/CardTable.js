import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FaFilter, FaEdit, FaTrash } from "react-icons/fa";
import { X } from "lucide-react";

export default function CardTable({ color }) {
  const [items, setItems] = useState([]);
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
    specialite: "", // Ajouté
  });
  const [errors, setErrors] = useState({});

  const [editModalOuvert, setEditModalOuvert] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editErrors, setEditErrors] = useState({});

  const [deleteModalOuvert, setDeleteModalOuvert] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/allusers');
        const data = await response.json();
        const formattedUsers = data.map(user => ({
          id: user._id,
          nom: user.nom,
          prenom: user.prenom,
          email: user.email,
          telephone: user.tel,
          role: user.role,
          password: ''
        }));
        setItems(formattedUsers);
      } catch (error) {
        console.error("Erreur lors du chargement des utilisateurs:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditingUser({ ...editingUser, [e.target.name]: e.target.value });
  };

  const validateForm = (user) => {
    const errors = {};
    // ... validations existantes
    if (user.role === 'technicien' && !user.specialite.trim()) {
      errors.specialite = "La spécialité est requise pour un technicien.";
    }
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

  const handleCreateSubmit = async () => {
    const errors = validateForm(newUser);
    if (Object.keys(errors).length > 0) return setErrors(errors);

    try {
      const userData = {
        nom: newUser.nom,
        prenom: newUser.prenom,
        email: newUser.email,
        tel: newUser.telephone,
        password: newUser.password,
        role: newUser.role,
        specialite: newUser.role === 'technicien' ? newUser.specialite : undefined,
      };
      

      const response = await fetch('/adduser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur inconnue');
      }

      setItems([...items, {
        id: data._id,
        ...userData,
        telephone: userData.tel,
        specialite: userData.specialite
      }]);
      
      setModalOuvert(false);
      setNewUser({ nom: "", prenom: "", email: "", telephone: "", role: "", password: "" });
      setErrors({});
      
    } catch (error) {
      console.error("Erreur:", error);
      alert(`Erreur lors de la création : ${error.message}`);
    }
  };

  const handleEditSubmit = async () => {
    const errors = validateEditForm(editingUser);
    if (Object.keys(errors).length > 0) return setEditErrors(errors);

    try {
      const userData = {
        nom: editingUser.nom,
        prenom: editingUser.prenom,
        email: editingUser.email,
        tel: editingUser.telephone,
        role: editingUser.role,
        ...(editingUser.password && { password: editingUser.password })
      };

      const response = await fetch(`/updateuser/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      if (!response.ok) throw new Error('Échec de la mise à jour');
      
      const data = await response.json();
      setItems(items.map(item => 
        item.id === editingUser.id ? { 
          ...item,
          ...userData,
          telephone: userData.tel
        } : item
      ));
      setEditModalOuvert(false);
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la mise à jour de l'utilisateur");
    }
  };

  const confirmDelete = async () => {
    
    try {
      const response = await fetch(`/deleteuser/${userIdToDelete}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Échec de la suppression');
      
      setItems(items.filter(item => item.id !== userIdToDelete));
      setDeleteModalOuvert(false);
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la suppression de l'utilisateur");
    }
  };
  const userToDelete = items.find(item => item.id === userIdToDelete);

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
              {newUser.role === 'technicien' && (
  <div className="gp-form-group">
    <label className="block font-semibold mb-1">Spécialité</label>
    <input
      type="text"
      name="specialite"
      value={newUser.specialite}
      onChange={handleChange}
      className="gp-form-input"
    />
    {errors.specialite && <p className="text-red-500 text-sm">{errors.specialite}</p>}
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
          Êtes-vous sûr de vouloir supprimer l'utilisateur <strong> {userToDelete?.nom} {userToDelete?.prenom} </strong>?
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