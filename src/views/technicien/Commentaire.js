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
          <div className="gp-modal-container">
            <div className="gp-modal-header">
              <h2 className="text-xl font-bold">Détail de l'avis</h2>
              <button onClick={() => setDetailModalOuvert(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-semibold">ID Ticket</label>
                <p className="mt-1">{avisDetail?.ticketId}</p>
              </div>

              <div>
                <label className="block font-semibold">Client</label>
                <p className="mt-1">{avisDetail?.nom} {avisDetail?.prenom}</p>
              </div>

              <div>
                <label className="block font-semibold">Commentaire complet</label>
                <p className="mt-1 whitespace-pre-wrap">{avisDetail?.commentaire}</p>
              </div>

              <div className="flex justify-end mt-4">
                <button 
                  onClick={() => setDetailModalOuvert(false)} 
                  className="gp-btn gp-btn-cancel"
                >
                  Fermer
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