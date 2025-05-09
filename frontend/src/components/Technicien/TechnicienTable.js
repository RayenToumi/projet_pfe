import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FaFilter, FaEdit, FaTrash } from "react-icons/fa";
import { X } from "lucide-react";

export default function TechnicienTable({ color }) {
  const [techniciens, setTechniciens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const togglePassword = () => setShowPassword(!showPassword);
  useEffect(() => {
    const fetchTechniciens = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        
        // Appel parallèle aux deux endpoints
        const [usersResponse, scoresResponse] = await Promise.all([
          fetch('/allusers'), // Sans token
          fetch('/score', {  // Avec token
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
        ]);
  
        if (!usersResponse.ok || !scoresResponse.ok) {
          throw new Error('Erreur réseau');
        }
  
        const [usersData, scoresData] = await Promise.all([
          usersResponse.json(),
          scoresResponse.json()
        ]);
  
        // Fusion des données
        const techs = usersData
          .filter(user => user.role === 'technicien')
          .map(tech => {
            const scoreInfo = scoresData.find(s => s.id === tech._id) || { score: '0.00' };
            
            return {
              id: tech._id,
              nom: tech.nom,
              prenom: tech.prenom,
              email: tech.email,
              telephone: tech.tel, 
              specialite: tech.specialite,
              actif: tech.actif,
              score: scoreInfo.score,
              password: ''
            };
          });
  
        setTechniciens(techs);
        setError(null);
  
      } catch (err) {
        setError(err.message);
        console.error("Erreur de chargement:", err);
        
        // Gestion spécifique des erreurs 401
        if (err.message.includes('401')) {
          localStorage.removeItem('jwt_token');
          // Ajouter une redirection vers /login si nécessaire
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchTechniciens();
  }, []);
  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => {
        const toast = document.querySelector('.toast-message');
        if (toast) {
          toast.style.animation = 'fade-out 0.3s ease-in forwards';
          setTimeout(() => {
            setShowSuccessMessage(false);
            setSuccessMessage('');
          }, 300);
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessMessage]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterSpecialite, setFilterSpecialite] = useState("");
  const [filterId, setFilterId] = useState("");
  const scoreStyle = (score) => {
    const numericScore = parseFloat(score);
  
    let backgroundColor = '';
    let icon = '';
  
    if (numericScore >= 0.8) {
      backgroundColor = '#d1fae5'; // vert pâle
      icon = '✓';
    } else if (numericScore >= 0.5) {
      backgroundColor = '#fef3c7'; // jaune pâle
      icon = '⚠';
    } else {
      backgroundColor = '#fee2e2'; // rouge pâle
      icon = '✕';
    }
  
    return {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      padding: '4px 10px',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: 'bold',
      backgroundColor,
      color: '#111',
      border: '1px solid #ccc'
    };
  };
  
  const [modalOuvert, setModalOuvert] = useState(false);
  const [newTechnicien, setNewTechnicien] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    role: "technicien",
    password: "",
    specialite: "",
    actif: true // Valeur par défaut
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
    
    // Validation du nom
    if (!technicien.nom.trim()) {
      errors.nom = "Le nom est obligatoire";
    } else if (!/^[A-Za-zÀ-ÿ]+(?: [A-Za-zÀ-ÿ]+)*$/.test(technicien.nom)) {
      errors.nom = "verifier bien le nom";
    }
  
    // Validation du prénom
    if (!technicien.prenom.trim()) {
      errors.prenom = "Le prénom est obligatoire";
    } else if (!/^[A-Za-zÀ-ÿ]+(?: [A-Za-zÀ-ÿ]+)*$/.test(technicien.prenom)) {
      errors.prenom = "verifier bien le prenom";
    }
  
    // Validation de l'email
    if (!technicien.email.trim()) {
      errors.email = "L'email est obligatoire";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(technicien.email)) {
      errors.email = "verifier bien l'email";
    }
  
    // Validation du téléphone
    if (!technicien.telephone.trim()) {
      errors.telephone = "Le téléphone est obligatoire";
    } else if (!/^[259]\d{7}$/.test(technicien.telephone)) {
      errors.telephone = "verifier bien le numero de telephone";
    }
  
    if (!technicien.specialite) errors.specialite = "La spécialité est obligatoire";
    if (typeof technicien.actif !== 'boolean') {
      errors.actif = "Statut invalide";
    }
    
    return errors;
  };

  const validateEditForm = (technicien) => {
    const errors = {};
  
    // Validation du nom
    if (!technicien.nom.trim()) {
      errors.nom = "Le nom est obligatoire";
    } else if (!/^[A-Za-zÀ-ÿ]+(?: [A-Za-zÀ-ÿ]+)*$/.test(technicien.nom)) {
      errors.nom = "verifier bien le nom";
    }
  
    // Validation du prénom
    if (!technicien.prenom.trim()) {
      errors.prenom = "Le prénom est obligatoire";
    } else if (!/^[A-Za-zÀ-ÿ]+(?: [A-Za-zÀ-ÿ]+)*$/.test(technicien.prenom)) {
      errors.prenom = "verifier bien le prenom";
    }
  
    // Validation de l'email
    if (!technicien.email.trim()) {
      errors.email = "L'email est obligatoire";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(technicien.email)) {
      errors.email = "verifier bien l'email";
    }
    if (!technicien.telephone.trim()) {
      errors.telephone = "Le téléphone est obligatoire";
    } else if (!/^[259]\d{7}$/.test(technicien.telephone)) {
      errors.telephone = "verifier bien le numero de telephone";
    }
    if (technicien.password && technicien.password.length < 6) {
      errors.password = "Le mot de passe doit contenir au moins 6 caractères.";
    }
  
    if (!technicien.specialite) errors.specialite = "La spécialité est requise";
    
    return errors;
  };

  const handleCreateSubmit = async () => {
    const validationErrors = validateForm(newTechnicien);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    try {
      const response = await fetch('/adduser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newTechnicien,
          tel: newTechnicien.telephone,
          role: 'technicien'
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        if (data.error.toLowerCase().includes('email')) {
          setErrors({ email: "Email déjà utilisé. Veuillez en choisir un autre." });
        } else {
          setErrors({ general: data.error || 'Erreur lors de la création' });
        }
        return;
      }
  
      const createdTech = data;
      
      setTechniciens(prev => [...prev, {
        id: createdTech._id,
        ...newTechnicien,
        telephone: newTechnicien.telephone,
        actif: true
      }]);
  
      setSuccessMessage('Technicien créé avec succès');
      setShowSuccessMessage(true);
      setModalOuvert(false);
      setNewTechnicien({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        specialite: "",
        password: ""
      });
  
    } catch (error) {
      console.error('Erreur:', error);
      if (error.message.toLowerCase().includes('email')) {
        setErrors({ email: "Email déjà utilisé. Veuillez en choisir un autre." });
      } else {
        setErrors({ general: error.message });
      }
    }
  };
  

  const handleEditSubmit = async () => {
    const errors = validateEditForm(editingTechnicien);
    if (Object.keys(errors).length > 0) {
      setEditErrors(errors);
      return;
    }
  
    try {
      const response = await fetch(`/updateuser/${editingTechnicien.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: editingTechnicien.nom,
        prenom: editingTechnicien.prenom,
        email: editingTechnicien.email,
        specialite: editingTechnicien.specialite,
        password: editingTechnicien.password,
        actif: editingTechnicien.actif,
        tel: editingTechnicien.telephone 
      }),
      });
  
      if (!response.ok) throw new Error('Erreur lors de la mise à jour');
  
      setTechniciens(prev => 
        prev.map(tech => 
          tech.id === editingTechnicien.id ? 
          { ...tech, ...editingTechnicien } : tech
        )
      );
  
      setSuccessMessage('Technicien modifié avec succès');
      setShowSuccessMessage(true);
      setEditModalOuvert(false);
  
    } catch (error) {
      console.error('Erreur:', error);
      setEditErrors({ general: error.message });
    }
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`/deleteuser/${technicienIdToDelete}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) throw new Error('Erreur lors de la suppression');
  
      setTechniciens(prev => 
        prev.filter(tech => tech.id !== technicienIdToDelete)
      );
      
      setSuccessMessage('Technicien supprimé avec succès');
      setShowSuccessMessage(true);
      setDeleteModalOuvert(false);
  
    } catch (error) {
      console.error('Erreur:', error);
      alert(error.message);
    }
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

  const specialiteStyle = (specialite) => {
    const style = {
      padding: "0.25rem 0.5rem",
      borderRadius: "9999px",
      fontSize: "0.75rem",
      fontWeight: "500",
    };
  
    switch(specialite.toLowerCase()) {
      case "informatique":
        return { ...style, backgroundColor: "#dbeafe", color: "#1d4ed8" };
      case "reseaux":
      case "réseaux": // Gestion des accents
        return { ...style, backgroundColor: "#dcfce7", color: "#15803d" };
      case "DAB":
        return { ...style, backgroundColor: "#fef3c7", color: "#b45309" };
      case "support":
      case "support client":
        return { ...style, backgroundColor: "#f3e8ff", color: "#6b21a8" }; // Nouvelle couleur
      default:
        return { ...style, backgroundColor: "#fee2e2", color: "#b91c1c" };
    }
  };

  return (
    <div className={`relative mx-auto max-w-screen-xl flex flex-col min-w-0 rounded-lg shadow-lg mb-10 ${
      color === "light" ? "bg-white" : "bg-slate-800 text-white"
    }`}>
        {showSuccessMessage && (
      <div className="toast-message animate-fade-in">
        <div className="toast-content">
          <div className="toast-icon">
            <svg xmlns="http://www.w3.org/2000/svg" 
                 width="24" 
                 height="24" 
                 viewBox="0 0 24 24" 
                 fill="none" 
                 stroke="currentColor" 
                 strokeWidth="2" 
                 strokeLinecap="round" 
                 strokeLinejoin="round">
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
           .gp-delete-buttons {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-top: 2rem;
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

      @keyframes fade-out {
        0% { transform: translateY(0); opacity: 1; }
        100% { transform: translateY(20px); opacity: 0; }
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
            .gp-readonly-text {
          padding: 0.5rem;
          background-color: #f3f4f6;
          border-radius: 0.375rem;
          display: block;
        }
          
      `}</style>

      <div className="px-6 pt-6 border-b-2 border-gray-300">
        <h1 className={`text-2xl font-bold text-center ${
          color === "light" ? "text-gray-800" : "text-white"
        }`}>
          Gestion des Techniciens
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
  value={filterSpecialite}
  onChange={(e) => setFilterSpecialite(e.target.value)}
  className="w-50 sm:w-64 border rounded-lg shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-4"
>
  <option value="">Toutes les spécialités</option>
  <option value="informatique">Informatique</option>
  <option value="reseaux">Réseaux</option>
  <option value="support">Support client</option>
  <option value="DAB">DAB</option>
</select>

         
        </div>
      </div>

      <div className="overflow-x-auto px-6 pt-4 pb-14">
  <table className="w-full border-collapse">
    <thead>
      <tr className={`text-left ${
        color === "light" ? "bg-gray-50 text-gray-500" : "bg-slate-700 text-slate-200"
      }`}>
        <th className="px-4 py-4 font-medium w-[10%] min-w-[80px]">ID</th>
        <th className="px-4 py-4 font-medium w-[25%] min-w-[150px]">Nom</th>
        <th className="px-4 py-4 font-medium w-[25%] min-w-[150px]">Prénom</th>
        <th className="px-4 py-4 font-medium w-[25%] min-w-[180px]">Spécialité</th>
        <th className="px-4 py-4 font-medium w-[15%] min-w-[120px]">Statut</th>
        <th className="px-4 py-4 font-medium w-[15%] min-w-[100px]">Score</th>
        <th className="px-4 py-4 font-medium w-[15%] min-w-[120px]">Actions</th>
        
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
      <td className="px-6 py-4 whitespace-nowrap">{tech.id}</td>
      <td className="px-6 py-4 whitespace-nowrap">{tech.nom}</td>
      <td className="px-6 py-4 whitespace-nowrap">{tech.prenom}</td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <span style={specialiteStyle(tech.specialite)}>
          {tech.specialite}
        </span>
      </td>
     
      <td className="px-6 py-4 whitespace-nowrap">
      {tech.actif ? (
  <span
    style={{
      color: '#28a745', // Vert
      fontWeight: '500', // Poids de la police modéré
      fontSize: '14px', // Taille de police plus petite
      backgroundColor: '#d4edda', // Fond vert clair
      padding: '4px 8px',
      borderRadius: '5px',
      textAlign: 'center',
    }}
  >
    Actif
  </span>
  
) : (
  <span
    style={{
      color: '#dc3545', // Rouge
      fontWeight: '500',
      fontSize: '14px',
      backgroundColor: '#f8d7da', // Fond rouge clair
      padding: '4px 8px',
      borderRadius: '5px',
      textAlign: 'center',
    }}
  >
    Inactif
  </span>
  
)}
</td>
<td className="px-6 py-4 whitespace-nowrap">
        <span style={scoreStyle(tech.score)}>
          {tech.score}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
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
  <label className="block font-semibold mb-1">Email *</label>
  <input
    type="email"
    name="email"
    value={newTechnicien.email}
    onChange={handleChange}
    className="gp-form-input"
  />
  {errors.email && (
    <p className="text-red-500 text-sm mt-1">
      {errors.email}
    </p>
  )}
</div>
              
              <div className="gp-form-group">
  <label className="block font-semibold mb-1">Téléphone *</label>
  <input
    type="text"
    name="telephone"
    value={newTechnicien.telephone}
    onChange={handleChange}
    className="gp-form-input"
    maxLength="8"
  />
  {errors.telephone && <p className="text-red-500 text-sm">{errors.telephone}</p>}
</div>
              <div className="gp-form-group">
                <label className="block font-semibold mb-1">Rôle</label>
                <div className="gp-form-input bg-gray-100 cursor-not-allowed">
                  Technicien
                  <input type="hidden" name="role" value="technicien" />
                </div>
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
                  
  <option value="informatique">Informatique</option>
  <option value="reseaux">Réseaux</option>
  <option value="support">Support client</option>
  <option value="DAB">DAB</option>
                </select>
                {errors.specialite && <p className="text-red-500 text-sm">{errors.specialite}</p>}
              </div>

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

      {/* Modal Modification */}
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
          <label className="block font-semibold mb-1">ID</label>
          <div className="gp-readonly-text">{editingTechnicien.id}</div>
        </div>

        {/* Nouveau champ Nom */}
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

        {/* Champ Email ajouté */}
        <div className="gp-form-group">
  
          <label className="block font-semibold mb-1">Email</label>
          <div className="gp-readonly-text">{editingTechnicien.email}</div>
    
        </div>

        {/* Spécialité en lecture seule */}
        <div className="gp-form-group">
          <label className="block font-semibold mb-1">Spécialité</label>
    
            <div className="gp-readonly-text">{editingTechnicien.specialite}</div>
            
     
        </div>
{/* Dans la partie Modal Modification */}
<div className="gp-form-group">
  <label className="block font-semibold mb-1">Téléphone *</label>
  <input
    type="text"
    name="telephone"
    value={editingTechnicien.telephone}
    onChange={handleEditChange}
    className="gp-form-input"
    maxLength="8"
  />
  {editErrors.telephone && <p className="text-red-500 text-sm">{editErrors.telephone}</p>}
</div>
        <div className="gp-form-group">
          <label className="block font-semibold mb-1">Nouveau mot de passe</label>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={editingTechnicien.password || ''}
            onChange={handleEditChange}
            className="gp-form-input"
            placeholder="nouveau mot de passe"
          />
          {editErrors.password && <p className="text-red-500 text-sm">{editErrors.password}</p>}
  <button
    type="button"
    onClick={togglePassword}
    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
    aria-label="Afficher ou masquer le mot de passe"
  >
    {showPassword ? (
      // œil barré
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.325.26-2.587.725-3.75m1.45-2.225A9.956 9.956 0 0112 5c5.523 0 10 4.477 10 10a9.956 9.956 0 01-2.05 6.025M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ) : (
      // œil ouvert
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7s-8.268-2.943-9.542-7z" />
      </svg>
    )}
  </button>
        </div>
        <div className="gp-form-group">
  <label className="block font-semibold mb-1">Statut</label>
  <label className="inline-flex items-center cursor-pointer">
  <input
  type="checkbox"
  name="actif"
  checked={editingTechnicien?.actif || false}
  onChange={(e) => handleEditChange({
    target: {
      name: 'actif',
      value: e.target.checked
    }
  })}
  className="form-checkbox h-5 w-5 text-blue-600 focus:ring-2 focus:ring-blue-400 rounded-lg transition duration-200 ease-in-out transform hover:scale-105"
  style={{
    backgroundColor: editingTechnicien?.actif ? '#4caf50' : '#f44336',
    borderColor: editingTechnicien?.actif ? '#388e3c' : '#d32f2f',
  }}
/>
    <span className="ml-2">
      {editingTechnicien?.actif ? 'Actif' : 'Inactif'}
    </span>
  </label>
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

TechnicienTable.defaultProps = {
  color: "light",
};

TechnicienTable.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
};