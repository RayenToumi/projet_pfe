import React, { useState } from "react";
import PropTypes from "prop-types";
import { FaEye, FaTrash } from "react-icons/fa";
import { X } from "lucide-react";

export default function AvisClientTable({ color }) {
  const [avis, setAvis] = useState([
    {
      id: 1,
      ticketId: "TKT-001",
      nom: "Dubois",
      prenom: "Marc",
      commentaire: "Service rapide et professionnel. Mon ordinateur est comme neuf !",
    },
    {
      id: 2,
      ticketId: "TKT-002",
      nom: "Leroy",
      prenom: "Julie",
      commentaire: "Intervention un peu longue mais résultat impeccable.",
    },
    {
      id: 3,
      ticketId: "TKT-003",
      nom: "Moreau",
      prenom: "Luc",
      commentaire: "Technicien très compétent et sympathique.",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterId, setFilterId] = useState("");

  const [deleteModalOuvert, setDeleteModalOuvert] = useState(false);
  const [avisIdToDelete, setAvisIdToDelete] = useState(null);
  const [detailModalOuvert, setDetailModalOuvert] = useState(false);
  const [avisDetail, setAvisDetail] = useState(null);

  const confirmDelete = () => {
    setAvis(avis.filter(a => a.id !== avisIdToDelete));
    setDeleteModalOuvert(false);
  };

  const filteredAvis = avis.filter(a => {
    const matchesId = filterId ? a.ticketId.toLowerCase().includes(filterId.toLowerCase()) : true;
    const matchesSearch = searchQuery
      ? a.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.commentaire.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return matchesId && matchesSearch;
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
            {filteredAvis.map((a) => (
              <tr 
                key={a.id} 
                className={`border-t ${
                  color === "light" ? "hover:bg-gray-50" : "hover:bg-slate-700"
                } transition-colors`}
              >
                <td className="px-6 py-4">{a.ticketId}</td>
                <td className="px-6 py-4">{a.nom}</td>
                <td className="px-6 py-4">{a.prenom}</td>
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
                        setAvisIdToDelete(a.id);
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
      <p className="mt-1 font-semibold">{avisDetail?.ticketId}</p>
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
                Êtes-vous sûr de vouloir supprimer cet avis ?
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

AvisClientTable.defaultProps = {
  color: "light",
};

AvisClientTable.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
};