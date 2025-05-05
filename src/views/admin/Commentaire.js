import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FaEye, FaTrash } from "react-icons/fa";
import { X } from "lucide-react";

export default function AvisClientTable({ color }) {
  const [avis, setAvis] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterId, setFilterId] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // Déclaration unique
  const [successMessage, setSuccessMessage] = useState('');
  const [detailModalOuvert, setDetailModalOuvert] = useState(false);
  const [avisDetail, setAvisDetail] = useState(null);
  const [deleteModalOuvert, setDeleteModalOuvert] = useState(false);
  const [selectedAvisToDelete, setSelectedAvisToDelete] = useState(null);
  useEffect(() => {
    const fetchAvis = async () => {
      try {
        const response = await fetch('/getcom');
        const result = await response.json();
    
        if (result.success) {
          setAvis(result.data);
        } else {
          throw new Error('Erreur dans les données reçues');
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des avis:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchAvis();
  }, []);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('jwt_token');
      
      if (!token) {
        alert('Authentification requise - Veuillez vous reconnecter');
        return;
      }
  
      const response = await fetch(`/deletecom/${selectedAvisToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Échec de la suppression');
      }
  
      // Mise à jour optimiste de l'état
      setAvis(prevAvis => prevAvis.filter(a => a.id !== selectedAvisToDelete.id));
      
      // Fermeture de la modal
      setDeleteModalOuvert(false);
      
      // Notification de succès
      setSuccessMessage('Commentaire supprimé avec succès');
      setShowSuccessMessage(true);
  
    } catch (error) {
      console.error("Erreur détaillée:", error);
      alert(`Échec de la suppression : ${error.message}`);
    }
  };
  
  // Gestion des animations de notification
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

  const filteredAvis = avis.filter(a => {
    const safeNom = a.nom?.toLowerCase() || '';
    const safePrenom = a.prenom?.toLowerCase() || '';
    const safeCommentaire = a.commentaire?.toLowerCase() || '';
    const safeTicket = a.ticket?.toLowerCase() || '';
  
    const matchesId = filterId 
      ? safeTicket.includes(filterId.toLowerCase())
      : true;
  
    const matchesSearch = searchQuery
      ? safeNom.includes(searchQuery.toLowerCase()) ||
        safePrenom.includes(searchQuery.toLowerCase()) ||
        safeCommentaire.includes(searchQuery.toLowerCase())
      : true;
  
    return matchesId && matchesSearch;
  });
  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => {
        const toast = document.querySelector('.toast-message');
        if (toast) {
          toast.style.animation = 'fade-out 0.3s ease-in forwards';
          setTimeout(() => setShowSuccessMessage(false), 300);
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessMessage]);
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
        .gp-action-icon {
          padding: 0.45rem;
          border-radius: 0.375rem;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .gp-view {
          background-color: #e0f2fe;
          color: #0284c7;
        }
        .gp-view:hover {
          background-color: #bae6fd;
        }
        .gp-delete {
          background-color: #fee2e2;
          color: #dc2626;
        }
        .gp-delete:hover {
          background-color: #fecaca;
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
        .gp-btn {
          padding: 0.5rem 1.25rem;
          border-radius: 0.375rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
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
        .comment-snippet {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          max-width: 300px;
        }

       


      `}</style>

      <div className="px-6 pt-6 border-b-2 border-gray-300">
        <h1 className={`text-2xl font-bold text-center ${
          color === "light" ? "text-gray-800" : "text-white"
        }`}>
          Avis des clients
        </h1>
      </div>

      <div className="flex justify-between px-6 pt-6 pb-4 items-center gap-4">
        <input
          type="text"
          placeholder="🔍 Rechercher par ID ticket..."
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
              <th className="px-6 py-4 font-medium">ID Ticket</th>
              <th className="px-6 py-4 font-medium">Nom</th>
              <th className="px-6 py-4 font-medium">Prénom</th>
              <th className="px-6 py-4 font-medium">Avis client</th>
              <th className="px-6 py-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <span className="ml-2">Chargement en cours...</span>
                  </div>
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-red-500">
                  ❌ Erreur lors du chargement des avis
                </td>
              </tr>
            ) : filteredAvis.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  Aucun avis trouvé
                </td>
              </tr>
            ) : (
              filteredAvis.map((a) => (
                <tr 
                  key={a.id} 
                  className={`border-t ${
                    color === "light" ? "hover:bg-gray-50" : "hover:bg-slate-700"
                  } transition-colors`}
                >
                  <td className="px-6 py-4 font-mono text-sm">{a.ticket}</td>
                  <td className="px-6 py-4">{a.nom || "-"}</td>
                  <td className="px-6 py-4">{a.prenom || "-"}</td>
                  <td className="px-6 py-4">
                    <div className="comment-snippet">
                      {a.commentaire}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex">
                      <button
                        onClick={() => {
                          setAvisDetail(a);
                          setDetailModalOuvert(true);
                        }}
                        className="gp-action-icon gp-view mr-2"
                        title="Voir le détail"
                      >
                        <FaEye size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedAvisToDelete(a);
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
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Détail Avis */}
      {detailModalOuvert && (
        <div className="gp-modal-overlay">
          <div className="gp-modal-container p-6 bg-white rounded-2xl shadow-2xl max-w-md mx-auto mt-8">
            <div className="flex justify-between items-center border-b pb-4 mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">📝 Détail de l'avis</h2>
              <button onClick={() => setDetailModalOuvert(false)} className="text-gray-500 hover:text-red-500 transition">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4 text-[15px] text-gray-800">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <label className="text-sm text-gray-500 font-medium block">ID Ticket</label>
                <p className="mt-1 font-semibold">{avisDetail?.ticket}</p>
              </div>
              <br></br>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <label className="text-sm text-gray-500 font-medium block">Client</label>
                <p className="mt-1 font-semibold">{avisDetail?.nom} {avisDetail?.prenom}</p>
              </div>
              <br></br>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <label className="text-sm text-gray-500 font-medium block">Commentaire complet</label>
                <p className="mt-2 whitespace-pre-wrap text-gray-700 leading-relaxed">{avisDetail?.commentaire}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Suppression */}
      {deleteModalOuvert && (
  <div className="gp-modal-overlay">
    <div className="gp-modal-container p-6 bg-white rounded-2xl shadow-2xl max-w-md mx-auto">
      <div className="flex justify-between items-center border-b pb-4 mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">⚠️ Confirmation</h2>
        <button onClick={() => setDeleteModalOuvert(false)} className="text-gray-500 hover:text-red-500 transition">
          <X size={24} />
        </button>
      </div>
      <div className="space-y-4 text-gray-800">
        <p>Êtes-vous sûr de vouloir supprimer cet avis ?</p>
        <p className="font-mono text-sm bg-gray-100 p-2 rounded-lg">
          ID Commentaire : {selectedAvisToDelete?.id} {/* Modifié ici */}
        </p>
        <div className="flex justify-end mt-6"> {/* Retirer gap-8 */}
  <button
    onClick={() => setDeleteModalOuvert(false)}
    className="gp-btn gp-btn-cancel mr-4" // Ajouter margin-right ici
  >
    Annuler
  </button>
  <button
    onClick={handleDelete}
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

AvisClientTable.defaultProps = {
  color: "light",
};

AvisClientTable.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
};