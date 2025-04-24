import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Search, Edit, Trash, Plus, X, Check, Filter } from "lucide-react";
import axios from "axios";

// CSS encapsulé avec préfixe "gp-" (cohérent avec Gestion Personnel)
const encapsulatedStyles = `
  .gp-department-container {
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  
  .gp-header-section {
    padding: 1.5rem;
    border-bottom: 1px solid #e2e8f0;
  }
  
  .gp-search-container {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .gp-search-input {
    flex: 1;
    position: relative;
  }
  
  .gp-search-icon {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
  }
  
  .gp-tab-button {
    padding: 0.5rem 1rem;
    border-bottom: 2px solid transparent;
    color: #6b7280;
    font-weight: 500;
    transition: all 0.2s ease;
  }
  
  .gp-tab-button.gp-active {
    border-bottom-color: #14b8a6;
    color: #14b8a6;
  }
  
  .gp-tab-button:hover:not(.gp-active) {
    color: #374151;
  }
  
  .gp-table-container {
    width: 100%;
    overflow-x: auto;
  }
  
  .gp-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .gp-th {
    text-align: left;
    padding: 0.75rem 1rem;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    color: #6b7280;
    background-color: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .gp-td {
    padding: 1rem;
    vertical-align: middle;
    color: #374151;
    border-bottom: 1px solid #f3f4f6;
  }
  
  .gp-tr:hover {
    background-color: #f9fafb;
  }
  
  .gp-department-badge {
    background-color: #e6fffa;
    color: #047857;
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
  }
  
  .gp-action-button {
    padding: 0.375rem;
    border-radius: 0.375rem;
    transition: all 0.2s ease;
  }
  
  .gp-edit-button {
    background-color: #dbeafe;
    color: #3b82f6;
  }
  
  .gp-edit-button:hover {
    background-color: #bfdbfe;
  }
  
  .gp-delete-button {
    background-color: #fee2e2;
    color: #ef4444;
  }
  
  .gp-delete-button:hover {
    background-color: #fecaca;
  }
  
  .gp-add-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: #14b8a6;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    transition: all 0.2s ease;
  }
  
  .gp-add-button:hover {
    background-color: #0d9488;
  }
  
  .gp-pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1.5rem;
    padding: 0 1rem;
  }
  
  .gp-modal-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    z-index: 50;
  }
  
  .gp-modal-container {
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    padding: 1.5rem;
    width: 100%;
    max-width: 28rem;
  }
  
  .gp-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }
  
  .gp-modal-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1f2937;
  }
  
  .gp-modal-close {
    color: #6b7280;
    transition: color 0.2s ease;
  }
  
  .gp-modal-close:hover {
    color: #1f2937;
  }
  
  .gp-form-group {
    margin-bottom: 1rem;
  }
  
  .gp-form-label {
    display: block;
    margin-bottom: 0.25rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
  }
  
  .gp-form-input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    transition: all 0.2s ease;
  }
  
  .gp-form-input:focus {
    outline: none;
    border-color: #14b8a6;
    box-shadow: 0 0 0 2px rgba(20, 184, 166, 0.2);
  }
  
  .gp-form-select {
    width: 100%;
    padding: 1 rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    transition: all 0.2s ease;
  }
  
  .gp-form-select:focus {
    outline: none;
    border-color: #14b8a6;
    box-shadow: 0 0 0 2px rgba(20, 184, 166, 0.2);
  }
  
  .gp-modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 1.5rem;
  }
  
  .gp-btn {
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    transition: all 0.2s ease;
  }
  
  .gp-btn-cancel {
    background-color: #f3f4f6;
    color: #374151;
  }
  
  .gp-btn-cancel:hover {
    background-color: #e5e7eb;
  }
  
  .gp-btn-save {
    background-color: #14b8a6;
    color: white;
  }
  
  .gp-btn-save:hover {
    background-color: #0d9488;
  }
  
  .gp-toast {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    padding: 1rem;
    border-radius: 0.375rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: white;
    z-index: 50;
  }
  
  .gp-toast-success {
    background-color: #10b981;
  }
  
  .gp-toast-error {
    background-color: #ef4444;
  }
`;
// Toast component for notifications
const Toast = ({ message, type, onClose }) => {
  const toastClass =
    type === "success"
      ? "gp-toast-success"
      : type === "error"
      ? "gp-toast-error"
      : "gp-toast-info";

  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`gp-toast ${toastClass}`}>
      {type === "success" && <Check size={20} />}
      {type === "error" && <X size={20} />}
      <p>{message}</p>
    </div>
  );
};

export default function CardDepartment({ color = "light" }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [departments, setDepartments] = useState([]);
  const [modalOuvert, setModalOuvert] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
  const [selectedDepartmentName, setSelectedDepartmentName] = useState("");
  const [newDepartment, setNewDepartment] = useState({
    nom: "",
  });
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ affiche: false, message: "", type: "" });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch departments on component mount
  useEffect(() => {
    fetchDepartments();
  }, []);



  // Fetch all departments
  const fetchDepartments = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/allusers`);
      setDepartments(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching departments:", error);
      afficherToast("Erreur lors du chargement des départements", "error");
      setIsLoading(false);
    }
  };

  const filteredDepartments = departments
    .filter((department) => {
      if (!isNaN(searchTerm) && searchTerm !== "") {
        return department._id.toString().includes(searchTerm);
      }
      return department.nom.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      if (!sortOption) return 0;
      if (sortOption === "id-asc") return a._id.localeCompare(b._id);
      if (sortOption === "id-desc") return b._id.localeCompare(a._id);
      if (sortOption === "departement") return a.nom.localeCompare(b.nom);
      return 0;
    });

  // Display a toast notification
  const afficherToast = (message, type) => {
    setToast({ affiche: true, message, type });
  };

  // Close toast
  const fermerToast = () => {
    setToast({ ...toast, affiche: false });
  };

  const handleAction = (action, id, nom) => {
    switch (action) {
      case "modifier":
        const departmentToEdit = departments.find(
          (department) => department._id === id
        );
        setSelectedDepartment(departmentToEdit);
        setIsEditModalOpen(true);
        break;
      case "supprimer":
        setSelectedDepartmentId(id);
        setSelectedDepartmentName(nom);
        setModalOuvert(true);
        break;
      default:
        break;
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(
        `/deletedepartment/${selectedDepartmentId}`
      );
      setDepartments(
        departments.filter(
          (department) => department._id !== selectedDepartmentId
        )
      );
      setModalOuvert(false);
      setSelectedDepartmentName("");
      afficherToast("Département supprimé avec succès", "success");
    } catch (error) {
      console.error("Error deleting department:", error);
      afficherToast("Erreur lors de la suppression du département", "error");
    }
  };

  const handleCancelDelete = () => {
    setModalOuvert(false);
    setSelectedDepartmentName("");
  };

  const handleAddDepartment = () => {
    setNewDepartment({ nom: "" });
    setSelectedDepartmentId(null);
    setIsEditModalOpen(false);
    setModalOuvert(true);
  };

  const validateForm = (department) => {
    const newErrors = {};
    if (!department.nom)
      newErrors.nom = "Le nom du département est obligatoire.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleModalSubmit = async () => {
    if (!validateForm(newDepartment)) return;

    try {
      const response = await axios.post(`/adddepartment`, {
        nom: newDepartment.nom,
      });

      setDepartments([...departments, response.data]);
      setModalOuvert(false);
      setNewDepartment({
        nom: "",
      });
      setErrors({});
      afficherToast("Département ajouté avec succès", "success");
    } catch (error) {
      console.error("Error adding department:", error);
      afficherToast("Erreur lors de l'ajout du département", "error");
    }
  };

  const handleModalCancel = () => {
    setModalOuvert(false);
    setNewDepartment({
      nom: "",
    });
    setErrors({});
  };

  const handleEditSubmit = async () => {
    if (!validateForm(selectedDepartment)) return;

    try {
      await axios.put(
        `/updatedepartment/${selectedDepartment._id}`,
        {
          nom: selectedDepartment.nom,
        }
      );

      const updatedDepartments = departments.map((department) =>
        department._id === selectedDepartment._id
          ? { ...selectedDepartment }
          : department
      );

      setDepartments(updatedDepartments);
      setIsEditModalOpen(false);
      afficherToast("Département modifié avec succès", "success");
    } catch (error) {
      console.error("Error updating department:", error);
      afficherToast("Erreur lors de la modification du département", "error");
    }
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (isEditModalOpen) {
      setSelectedDepartment((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewDepartment((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <>
      <style>{encapsulatedStyles}</style>
      <div
        className={
          "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded"
        }
      >
        <div className="gp-department-container">
          <div className="gp-header-section">
            <h1
              className="gp-modal-title"
              style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}
            >
              Gestion des Départements
            </h1>

            {/* Search and filter section */}
            <div className="gp-search-container">
              <div className="gp-search-input">
                <div className="gp-search-icon">
                  <Search size={20} />
                </div>
                <input
                  type="text"
                  placeholder="Rechercher par nom ou ID"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="gp-form-input"
                  style={{ paddingLeft: "2.5rem" }}
                />
              </div>

              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <Filter size={20} style={{ color: "#9ca3af" }} />
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="gp-form-select"
                >
                  <option value="">Filtrer par</option>
                  <option value="id-asc">ID Ascendant</option>
                  <option value="id-desc">ID Descendant</option>
                  <option value="departement">Par Département</option>
                </select>
              </div>

              <button onClick={handleAddDepartment} className="gp-add-button">
                <Plus size={20} />
                Ajouter
              </button>
            </div>

            {/* Departments table */}
            <div className="gp-table-container">
              <table className="gp-table">
                <thead>
                  <tr>
                    <th className="gp-th">ID</th>
                    <th className="gp-th">Département</th>
                    <th className="gp-th" style={{ textAlign: "center" }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan="3"
                        className="gp-td"
                        style={{
                          textAlign: "center",
                          color: "#6b7280",
                          padding: "1.5rem 0",
                        }}
                      >
                        Chargement des départements...
                      </td>
                    </tr>
                  ) : filteredDepartments.length > 0 ? (
                    filteredDepartments.map((department) => (
                      <tr className="gp-tr" key={department._id}>
                        <td className="gp-td">
                          {department._id.substring(0, 8)}...
                        </td>
                        <td className="gp-td">
                          <span className="gp-department-badge">
                            {department.nom}
                          </span>
                        </td>
                        <td className="gp-td">
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              gap: "0.5rem",
                            }}
                          >
                            <button
                              onClick={() =>
                                handleAction(
                                  "modifier",
                                  department._id,
                                  department.nom
                                )
                              }
                              className="gp-action-button gp-edit-button"
                              title="Modifier"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() =>
                                handleAction(
                                  "supprimer",
                                  department._id,
                                  department.nom
                                )
                              }
                              className="gp-action-button gp-delete-button"
                              title="Supprimer"
                            >
                              <Trash size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        className="gp-td"
                        style={{
                          textAlign: "center",
                          color: "#6b7280",
                          padding: "1.5rem 0",
                        }}
                      >
                        Aucun département trouvé
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="gp-pagination">
              <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                Affichage de {filteredDepartments.length} sur{" "}
                {departments.length} départements
              </div>
            </div>
          </div>
        </div>

        {/* Delete department modal */}
        {modalOuvert && selectedDepartmentId && (
          <div className="gp-modal-overlay">
            <div className="gp-modal-container">
              <div className="gp-modal-header">
                <h2 className="gp-modal-title">Confirmation de suppression</h2>
                <button onClick={handleCancelDelete} className="gp-modal-close">
                  <X size={24} />
                </button>
              </div>

              <div>
                <p style={{ marginBottom: "1.5rem", color: "#4b5563" }}>
                  Êtes-vous sûr de vouloir supprimer le département{" "}
                  <strong>{selectedDepartmentName}</strong> ?
                </p>

                <div className="gp-modal-footer">
                  <button
                    onClick={handleCancelDelete}
                    className="gp-btn gp-btn-cancel"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="gp-btn gp-btn-save"
                    style={{
                      backgroundColor: "#ef4444",
                      borderColor: "#ef4444",
                    }}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add department modal */}
        {modalOuvert && !selectedDepartmentId && (
          <div className="gp-modal-overlay">
            <div className="gp-modal-container">
              <div className="gp-modal-header">
                <h2 className="gp-modal-title">Ajouter un département</h2>
                <button onClick={handleModalCancel} className="gp-modal-close">
                  <X size={24} />
                </button>
              </div>

              <div>
                <div className="gp-form-group">
                  <label className="gp-form-label">Nom du département</label>
                  <input
                    type="text"
                    name="nom"
                    value={newDepartment.nom}
                    onChange={handleChange}
                    className="gp-form-input"
                  />
                  {errors.nom && (
                    <p
                      style={{
                        color: "#ef4444",
                        fontSize: "0.75rem",
                        marginTop: "0.25rem",
                      }}
                    >
                      {errors.nom}
                    </p>
                  )}
                </div>

                <div className="gp-modal-footer">
                  <button
                    onClick={handleModalCancel}
                    className="gp-btn gp-btn-cancel"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleModalSubmit}
                    className="gp-btn gp-btn-save"
                  >
                    Ajouter
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit department modal */}
        {isEditModalOpen && selectedDepartment && (
          <div className="gp-modal-overlay">
            <div className="gp-modal-container">
              <div className="gp-modal-header">
                <h2 className="gp-modal-title">Modifier le département</h2>
                <button onClick={handleEditCancel} className="gp-modal-close">
                  <X size={24} />
                </button>
              </div>

              <div>
                <div className="gp-form-group">
                  <label className="gp-form-label">ID</label>
                  <input
                    type="text"
                    value={selectedDepartment._id}
                    disabled
                    className="gp-form-input"
                    style={{ backgroundColor: "#f3f4f6" }}
                  />
                </div>

                <div className="gp-form-group">
                  <label className="gp-form-label">Nom du département</label>
                  <input
                    type="text"
                    name="nom"
                    value={selectedDepartment.nom}
                    onChange={handleChange}
                    className="gp-form-input"
                  />
                  {errors.nom && (
                    <p
                      style={{
                        color: "#ef4444",
                        fontSize: "0.75rem",
                        marginTop: "0.25rem",
                      }}
                    >
                      {errors.nom}
                    </p>
                  )}
                </div>

                <div className="gp-modal-footer">
                  <button
                    onClick={handleEditCancel}
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

        {/* Toast notifications */}
        {toast.affiche && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={fermerToast}
          />
        )}
      </div>
    </>
  );
}

CardDepartment.propTypes = {
  color: PropTypes.string,
};