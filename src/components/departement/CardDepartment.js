import React, { useState } from "react";
import PropTypes from "prop-types";
import { MdDelete, MdEdit } from "react-icons/md";

// Styles CSS pour les dialogs et modals
const styles = `
  .titre {
    text-align: center;
    text-transform: uppercase;
    color: darkblue;
    font-size: 2.5em;
    margin-bottom: 2rem;
    font-weight: bold;
  }

  .fixed-dialog-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    z-index: 50;
    padding-top: 2rem;
  }

  .dialog-content {
    background-color: #f7fafc;
    padding: 2rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 30rem;
  }

  .modal-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
  }

  .modal-content {
    background-color: white;
    padding: 2rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 30rem;
  }

  .modal-content input,
  .modal-content select {
    width: 100%;
    padding: 0.75rem;
    margin-bottom: 1rem;
    border: 1px solid #ddd;
    border-radius: 0.25rem;
    transition: all 0.3s;
  }

  .modal-content input:focus,
  .modal-content select:focus {
    border-color: #3182ce;
    outline: none;
    box-shadow: 0 0 5px rgba(0, 122, 255, 0.5);
  }

  .modal-content button {
    padding: 0.75rem 1.5rem;
    border-radius: 0.25rem;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .modal-content button.cancel {
    background-color: #e2e8f0;
    margin-right: 1rem;
    color: #4a5568;
  }

  .modal-content button.cancel:hover {
    background-color: #cbd5e0;
  }

  .modal-content button.submit {
    background-color: #38a169;
    color: white;
  }

  .modal-content button.submit:hover {
    background-color: #2f855a;
  }

  .error-message {
    color: red;
    font-size: 0.875rem;
    margin-bottom: 1rem;
    font-weight: bold;
  }

  .table-container {
    overflow-x: auto;
    padding: 1.5rem;
    background-color: #f7fafc;
    border-radius: 0.5rem;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }

  table {
    width: 100%;
    border-collapse: collapse;
    background-color: #ffffff;
    border-radius: 0.5rem;
  }

  th,
  td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
  }

  th {
    background-color: #edf2f7;
    font-weight: 600;
    color: #4a5568;
  }

  td {
    font-size: 0.9rem;
    color: #2d3748;
  }

  td button {
    padding: 0.5rem;
    border-radius: 0.25rem;
    margin-right: 0.5rem;
    cursor: pointer;
    transition: all 0.3s;
  }

  td button:hover {
    opacity: 0.85;
  }

  .btn-edit {
    background-color: #fbbf24;
    color: white;
  }

  .btn-delete {
    background-color: #e53e3e;
    color: white;
  }

  .btn-add {
    background-color: #3182ce;
    color: white;
    padding: 0.75rem 2rem;
    border-radius: 0.25rem;
    font-weight: bold;
    transition: background-color 0.3s;
  }

  .btn-add:hover {
    background-color: #2b6cb0;
  }
`;

export default function CardTechnician({ color = "light" }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [technicians, setTechnicians] = useState([
    { id: 1, technicien: "Informatique" },
    { id: 2, technicien: "Ressources Humaines" },
    { id: 3, technicien: "Finance" },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTechnicianId, setSelectedTechnicianId] = useState(null);
  const [selectedTechnicianName, setSelectedTechnicianName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newTechnician, setNewTechnician] = useState({
    technicien: "",
  });
  const [selectedTechnician, setSelectedTechnician] = useState(null);
  const [errors, setErrors] = useState({});

  const filteredTechnicians = technicians
    .filter((technician) => {
      if (!isNaN(searchTerm)) {
        return technician.id.toString().includes(searchTerm);
      }
      return technician.technicien.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      if (!sortOption) return 0;
      if (sortOption === "id-asc") return a.id - b.id;
      if (sortOption === "id-desc") return b.id - a.id;
      if (sortOption === "technicien") return a.technicien.localeCompare(b.technicien);
      return 0;
    });

  const handleAction = (action, id, technicien) => {
    switch (action) {
      case "modifier":
        const technicianToEdit = technicians.find((technician) => technician.id === id);
        setSelectedTechnician(technicianToEdit);
        setIsEditModalOpen(true);
        break;
      case "supprimer":
        setSelectedTechnicianId(id);
        setSelectedTechnicianName(technicien);
        setIsDialogOpen(true);
        break;
      default:
        break;
    }
  };

  const handleConfirmDelete = () => {
    setTechnicians(technicians.filter((technician) => technician.id !== selectedTechnicianId));
    setIsDialogOpen(false);
    setSelectedTechnicianName("");
  };

  const handleCancelDelete = () => {
    setIsDialogOpen(false);
    setSelectedTechnicianName("");
  };

  const handleAddTechnician = () => {
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!newTechnician.technicien) newErrors.technicien = "Le technicien est obligatoire.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleModalSubmit = () => {
    if (!validateForm()) return;

    const newTechnicianEntry = {
      id: technicians.length + 1,
      technicien: newTechnician.technicien,
    };
    setTechnicians([...technicians, newTechnicianEntry]);
    setIsModalOpen(false);
    setNewTechnician({
      technicien: "",
    });
    setErrors({});
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setNewTechnician({
      technicien: "",
    });
    setErrors({});
  };

  const handleEditSubmit = () => {
    if (validateForm()) return;

    const updatedTechnicians = technicians.map((technician) =>
      technician.id === selectedTechnician.id ? { ...selectedTechnician } : technician
    );

    setTechnicians(updatedTechnicians);
    setIsEditModalOpen(false);
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
  };

  return (
    <>
      {/* Injection des styles CSS */}
      <style>{styles}</style>

      <div className={"relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " + (color === "light" ? "bg-white" : "bg-lightBlue-900 text-white")}>
        {/* Confirmation Dialog en Haut de la Page */}
        {isDialogOpen && (
          <div className="fixed-dialog-container">
            <div className="dialog-content">
              <p className="text-lg text-gray-700 mb-4">
                Êtes-vous sûr de vouloir supprimer le technicien <strong>{selectedTechnicianName}</strong> ?
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleCancelDelete}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:outline-none"
                >
                  Annuler
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal pour ajouter un technicien */}
        {isModalOpen && (
          <div className="modal-container">
            <div className="modal-content">
              <h2 className="text-lg font-semibold mb-4">Ajouter un technicien</h2>
              {errors.technicien && <div className="error-message">{errors.technicien}</div>}
              <input
                type="text"
                placeholder="Technicien"
                value={newTechnician.technicien}
                onChange={(e) => setNewTechnician({ ...newTechnician, technicien: e.target.value })}
              />
              <div className="flex justify-end">
                <button onClick={handleModalCancel} className="cancel">
                  Annuler
                </button>
                <button onClick={handleModalSubmit} className="submit">
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal pour modifier un technicien */}
        {isEditModalOpen && selectedTechnician && (
          <div className="modal-container">
            <div className="modal-content">
              <h2 className="text-lg font-semibold mb-4">Modifier le technicien</h2>
              <input
                type="text"
                placeholder="Technicien"
                value={selectedTechnician.technicien}
                onChange={(e) => setSelectedTechnician({ ...selectedTechnician, technicien: e.target.value })}
              />
              <div className="flex justify-end">
                <button onClick={handleEditCancel} className="cancel">
                  Annuler
                </button>
                <button onClick={handleEditSubmit} className="submit">
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="titre"><h1>Les Techniciens</h1></div>
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap items-center justify-between">
            <h3 className={"font-semibold text-lg " + (color === "light" ? "text-blueGray-700" : "text-white")}>
              Liste des Techniciens
            </h3>
          </div>
          <div className="flex flex-wrap items-center justify-between mt-4">
            <div className="flex items-center space-x-6">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="btn-filter py-2 border rounded-lg focus:outline-none btn-rech-id text-blueGray-700"
              >
                <option value="" disabled>Filtrer par</option>
                <option value="id-asc">ID Ascendant</option>
                <option value="id-desc">ID Descendant</option>
                <option value="technicien">Par Technicien</option>
              </select>
              <input
                type="text"
                placeholder="Rechercher par nom ou ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:outline-none border-blueGray-300 text-blueGray-700 ml-4"
              />
            </div>
            <button
              onClick={handleAddTechnician}
              className="btn-add"
            >
              Ajouter un technicien
            </button>
          </div>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                {["Id", "Technicien", "Action"].map((header, index) => (
                  <th key={index} className="px-6 py-3 text-xs uppercase font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredTechnicians.length > 0 ? (
                filteredTechnicians.map((technician) => (
                  <tr key={technician.id}>
                    <td className="px-6 py-4 border-b border-gray-200 text-sm">{technician.id}</td>
                    <td className="px-6 py-4 border-b border-gray-200 text-sm">{technician.technicien}</td>
                    <td className="px-6 py-4 border-b border-gray-200 text-sm">
                      <button onClick={() => handleAction("modifier", technician.id, technician.technicien)} className="btn-edit">
                        <MdEdit />
                      </button>
                      <button onClick={() => handleAction("supprimer", technician.id, technician.technicien)} className="btn-delete">
                        <MdDelete />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-4">
                    Aucun résultat trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

CardTechnician.propTypes = {
  color: PropTypes.string,
};
