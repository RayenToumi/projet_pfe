import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPen, faSquareCheck } from '@fortawesome/free-solid-svg-icons';

export default function CardTable({ color }) {
  return (
    <>
      <div
        className={
          "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " +
          (color === "light" ? "bg-white" : "bg-lightBlue-900 text-white")
        }
      >
        {/* En-tête personnalisé */}
      

        {/* Tableau des tickets */}
        <div className="block w-full overflow-x-auto">
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                <th
                  className={
                    "px-6 py-3 border border-solid text-xs uppercase whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                  }
                >
                  Id
                </th>
                <th
                  className={
                    "px-6 py-3 border border-solid text-xs uppercase whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                  }
                >
                  Sujet
                </th>
                <th
                  className={
                    "px-6 py-3 border border-solid text-xs uppercase whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                  }
                >
                  Statut
                </th>
                <th
                  className={
                    "px-6 py-3 border border-solid text-xs uppercase whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                  }
                >
                  Date
                </th>
                <th
                  className={
                    "px-6 py-3 border border-solid text-xs uppercase whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                  }
                >
                  Description
                </th>
                <th
                  className={
                    "px-6 py-3 border border-solid text-xs uppercase whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                  }
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-t p-4 text-xs whitespace-nowrap">
                  <strong>05</strong>
                </td>
                <td className="border-t p-4 text-xs whitespace-nowrap">
                  Problème d'accès à l'internet
                </td>
                <td className="border-t p-4 text-xs whitespace-nowrap">
                  <span className="flex items-center">
                    <i className="fas fa-circle text-orange-500 mr-2"></i> En attente
                  </span>
                </td>
                <td className="border-t p-4 text-xs whitespace-nowrap">
                  2025-03-29
                </td>
                <td className="border-t p-4 text-xs whitespace-nowrap">
                  Le site intranet était inaccessible depuis plusieurs jours.
                </td>
                <td className="border-t p-4 text-xs whitespace-nowrap">
                  <button className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold uppercase px-3 py-2 rounded shadow transition-all duration-150 mr-2">
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                  <button className="bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold uppercase px-3 py-2 rounded shadow transition-all duration-150 mr-2">
                    <FontAwesomeIcon icon={faPen} />
                  </button>
                  <button className="bg-indigo-500 hover:bg-green-600 text-white text-xs font-bold uppercase px-3 py-2 rounded shadow transition-all duration-150">
                    <FontAwesomeIcon icon={faSquareCheck} />
                  </button>
                </td>
              </tr>
              {/* Vous pouvez ajouter d'autres lignes ici */}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

CardTable.defaultProps = {
  color: "light",
};

CardTable.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
};
