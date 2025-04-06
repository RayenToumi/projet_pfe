import React, { useState } from "react";
import PropTypes from "prop-types";
import { MdDelete, MdEdit } from "react-icons/md";

// Styles CSS pour les dialogs et modals
const styles = `
  .titre {
    text-align: center;
    text-transform: uppercase;
    color: darkblue;
    font-size: 2em;
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
    padding-top: 1rem;
  }

  .dialog-content {
    background-color: aliceblue;
    padding: 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    max-width: 24rem;
    width: 100%;
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
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    max-width: 24rem;
    width: 100%;
  }

  .modal-content input,
  .modal-content select {
    width: 100%;
    padding: 0.5rem;
    margin-bottom: 1rem;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
  }

  .modal-content button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
  }

  .modal-content button.cancel {
    background-color: #ccc;
    margin-right: 0.5rem;
  }

  .modal-content button.submit {
    background-color: #4CAF50;
    color: white;
  }

  .error-message {
    color: red;
    font-size: 0.875rem;
    margin-bottom: 1rem;
  }
`;

export default function CardDepartment({ color = "light" }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [departments, setDepartments] = useState([
    { id: 1, departement: "Informatique" },
    { id: 2, departement: "Ressources Humaines" },
    { id: 3, departement: "Finance" },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
  const [selectedDepartmentName, setSelectedDepartmentName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newDepartment, setNewDepartment] = useState({
    departement: "",
  });
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [errors, setErrors] = useState({});

  const filteredDepartments = departments
    .filter((department) => {
      if (!isNaN(searchTerm)) {
        return department.id.toString().includes(searchTerm);
      }
      return department.departement.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      if (!sortOption) return 0;
      if (sortOption === "id-asc") return a.id - b.id;
      if (sortOption === "id-desc") return b.id - a.id;
      if (sortOption === "departement") return a.departement.localeCompare(b.departement);
      return 0;
    });

  const handleAction = (action, id, departement) => {
    switch (action) {
      case "modifier":
        const departmentToEdit = departments.find((department) => department.id === id);
        setSelectedDepartment(departmentToEdit);
        setIsEditModalOpen(true);
        break;
      case "supprimer":
        setSelectedDepartmentId(id);
        setSelectedDepartmentName(departement);
        setIsDialogOpen(true);
        break;
      default:
        break;
    }
  };

  const handleConfirmDelete = () => {
    setDepartments(departments.filter((department) => department.id !== selectedDepartmentId));
    setIsDialogOpen(false);
    setSelectedDepartmentName("");
  };

  const handleCancelDelete = () => {
    setIsDialogOpen(false);
    setSelectedDepartmentName("");
  };

  const handleAddDepartment = () => {
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!newDepartment.departement) newErrors.departement = "Le département est obligatoire.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleModalSubmit = () => {
    if (!validateForm()) return;

    const newDepartmentEntry = {
      id: departments.length + 1,
      departement: newDepartment.departement,
    };
    setDepartments([...departments, newDepartmentEntry]);
    setIsModalOpen(false);
    setNewDepartment({
      departement: "",
    });
    setErrors({});
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setNewDepartment({
      departement: "",
    });
    setErrors({});
  };

  const handleEditSubmit = () => {
    if (validateForm()) return;

    const updatedDepartments = departments.map((department) =>
      department.id === selectedDepartment.id ? { ...selectedDepartment } : department
    );

    setDepartments(updatedDepartments);
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
                Êtes-vous sûr de vouloir supprimer le département  <strong>{selectedDepartmentName}</strong> ?
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

        {/* Modal pour ajouter un département */}
        {isModalOpen && (
          <div className="modal-container">
            <div className="modal-content">
              <h2 className="text-lg font-semibold mb-4">Ajouter un département</h2>
              {errors.departement && <div className="error-message">{errors.departement}</div>}
              <input
                type="text"
                placeholder="Département"
                value={newDepartment.departement}
                onChange={(e) => setNewDepartment({ ...newDepartment, departement: e.target.value })}
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

        {/* Modal pour modifier un département */}
        {isEditModalOpen && selectedDepartment && (
          <div className="modal-container">
            <div className="modal-content">
              <h2 className="text-lg font-semibold mb-4">Modifier le département</h2>
              <input
                type="text"
                placeholder="Département"
                value={selectedDepartment.departement}
                onChange={(e) => setSelectedDepartment({ ...selectedDepartment, departement: e.target.value })}
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

        <div className="titre"><h1>Gestion des départements</h1></div>
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap items-center justify-between">
            <h3 className={"font-semibold text-lg " + (color === "light" ? "text-blueGray-700" : "text-white")}>
              Liste des départements
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
                <option value="departement">Par Département</option>
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
              onClick={handleAddDepartment}
              className="px-4 py-2 rounded-lg font-semibold text-btn-ajouterp bg-blue-500 hover:bg-blue-600 focus:outline-none"
            >
              Ajouter un département
            </button>
          </div>
        </div>
        <div className="block w-full overflow-x-auto">
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                {["Id", "Département", "Action"].map((header, index) => (
                  <th key={index} className="px-6 py-3 text-xs uppercase font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredDepartments.length > 0 ? (
                filteredDepartments.map((department) => (
                  <tr key={department.id}>
                    <td className="px-6 py-4 border-b border-gray-200 text-sm">{department.id}</td>
                    <td className="px-6 py-4 border-b border-gray-200 text-sm">{department.departement}</td>
                    <td className="px-6 py-4 border-b border-gray-200 text-sm">
                      <button onClick={() => handleAction("modifier", department.id, department.departement)} className="bg-yellow-500 text-white p-2 rounded mr-2">
                        <MdEdit />
                      </button>
                      <button onClick={() => handleAction("supprimer", department.id, department.departement)} className="bg-red-500 text-white p-2 rounded">
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

CardDepartment.propTypes = {
  color: PropTypes.string,
};