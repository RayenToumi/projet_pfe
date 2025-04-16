import React, { useState } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPen, faSquareCheck } from '@fortawesome/free-solid-svg-icons';

const styles = `
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
    padding-top: 6rem;
    z-index: 50;
  }

  .dialog-content {
    background-color: #fff;
    padding: 2rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 30rem;
    border-top: 6px solid #e53e3e;
  }

  .dialog-content button {
    padding: 0.75rem 1.5rem;
    border-radius: 0.25rem;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .dialog-content button.cancel {
    background-color: #e2e8f0;
    margin-right: 1rem;
    color: #4a5568;
  }

  .dialog-content button.cancel:hover {
    background-color: #cbd5e0;
  }

  .dialog-content button.submit {
    background-color: #e53e3e;
    color: white;
  }

  .dialog-content button.submit:hover {
    background-color: #c53030;
  }
`;

export default function CardTable({ color }) {
  const [items, setItems] = useState([
    { id: 1, subject: 'Problème d\'accès à l\'internet', type: 'Urgent', status: 'En attente', date: '2025-03-29', description: 'Le site intranet était inaccessible depuis plusieurs jours.' },
    { id: 2, subject: 'Mise à jour logiciel', type: 'Normal', status: 'Terminé', date: '2025-04-15', description: 'Mise à jour du logiciel de gestion RH.' }
  ]);
  const [filter, setFilter] = useState('Tous');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const handleDeleteConfirmation = (id) => {
    setSelectedItemId(id);
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    setItems(items.filter(item => item.id !== selectedItemId));
    setIsDialogOpen(false);
  };

  const handleCancelDelete = () => {
    setIsDialogOpen(false);
    setSelectedItemId(null);
  };

  const handleComplete = (id) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, status: 'Terminé' } : item
    ));
  };

  const handleEdit = (id) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, subject: 'Problème résolu', description: 'Le problème a été résolu avec succès.' } : item
    ));
  };

  const filteredItems = [...items]
    .filter(item => filter === 'Tous' || item.type === filter)
    .sort((a, b) => (a.type === 'Urgent' ? -1 : 1));

  return (
    <div className={"relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " + (color === "light" ? "bg-white" : "bg-lightBlue-900 text-white")}> 
      <style>{styles}</style>

      {isDialogOpen && (
        <div className="fixed-dialog-container">
          <div className="dialog-content">
            <p className="text-lg text-gray-700 mb-4 font-semibold">
              Êtes-vous sûr de vouloir supprimer ce ticket ?
            </p>
            <div className="flex justify-end space-x-4">
              <button onClick={handleCancelDelete} className="cancel">Annuler</button>
              <button onClick={handleConfirmDelete} className="submit">Supprimer</button>
            </div>
          </div>
        </div>
      )}

      <div className="p-4">
        <label className="block mb-2 font-semibold">Filtrer par type :</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="p-2 border rounded">
          <option value="Tous">Tous</option>
          <option value="Urgent">Urgent</option>
          <option value="Normal">Normal</option>
        </select>
      </div>

      <div className="block w-full overflow-x-auto">
        <table className="items-center w-full bg-transparent border-collapse">
          <thead>
            <tr>
              {["Id", "Sujet", "Type", "Statut", "Date", "Description", "Actions"].map((header, index) => (
                <th key={index} className={"px-6 py-3 border border-solid text-xs uppercase whitespace-nowrap font-semibold text-left " + (color === "light" ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100" : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-100 transition-colors duration-200">
                <td className="border-t p-4 text-xs whitespace-nowrap"><strong>{item.id}</strong></td>
                <td className="border-t p-4 text-xs whitespace-nowrap">{item.subject}</td>
                <td className="border-t p-4 text-xs whitespace-nowrap font-bold text-red-600">{item.type}</td>
                <td className="border-t p-4 text-xs whitespace-nowrap">
  <span className={item.status === 'En attente' ? 'text-red-600 font-bold' : 'text-green-600 font-bold'}>
    {item.status}
  </span>
</td>


                <td className="border-t p-4 text-xs whitespace-nowrap">{item.date}</td>
                <td className="border-t p-4 text-xs whitespace-nowrap">{item.description}</td>
                <td className="border-t p-4 text-xs whitespace-nowrap">
                  <button className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold uppercase px-3 py-2 rounded shadow transition-all duration-150 mr-2" onClick={() => handleDeleteConfirmation(item.id)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                  <button className="bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold uppercase px-3 py-2 rounded shadow transition-all duration-150 mr-2" onClick={() => handleEdit(item.id)}>
                    <FontAwesomeIcon icon={faPen} />
                  </button>
                  <button className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold uppercase px-3 py-2 rounded shadow transition-all duration-150" onClick={() => handleComplete(item.id)}>
                    <FontAwesomeIcon icon={faSquareCheck} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

CardTable.defaultProps = {
  color: "light",
};

CardTable.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
};
