import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPen } from "@fortawesome/free-solid-svg-icons";
import { getAllUsers } from "services/ApiUser";

export default function CardTable({ color }) {
  const [users, setUsers] = useState([
    {
      nom: "Toumi",
      prenom: "Med Rayen",
      email: "toumirayen130@gmail.com",
      id: "05",
    },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [newUser, setNewUser] = useState({
    nom: "",
    prenom: "",
    email: "",
    id: "",
  });

  const getUsers = async () => {
    try {
      const res = await getAllUsers();
      if (res.data?.userList) {
        setUsers(res.data.userList);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // getUsers(); // décommente pour charger depuis l'API
  }, []);

  const handleInputChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    setUsers([...users, newUser]);
    setNewUser({ nom: "", prenom: "", email: "", id: "" });
    setShowForm(false);
  };

  return (
    <div
      className={
        "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg " +
        (color === "light" ? "bg-white" : "bg-lightBlue-900 text-white")
      }
    >
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
        <h3
          className={
            "font-bold text-xl " +
            (color === "light" ? "text-blueGray-700" : "text-white")
          }
        >
          Liste des utilisateurs
        </h3>
        <button
          className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold px-4 py-2 rounded shadow"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Annuler" : "Ajouter un utilisateur"}
        </button>
      </div>

      <div className="overflow-x-auto p-4">
        <table className="w-full text-sm text-left text-white">
          <thead className="text-xs uppercase bg-lightBlue-800 text-blueGray-100">
            <tr>
              <th className="px-6 py-3">Nom</th>
              <th className="px-6 py-3">Prénom</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-lightBlue-900 divide-y divide-blueGray-700">
            {users.map((user, index) => (
              <tr key={index} className="hover:bg-lightBlue-800">
                <td className="px-6 py-4">{user.nom}</td>
                <td className="px-6 py-4">{user.prenom}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.id}</td>
                <td className="px-6 py-4 text-right">
                  <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded mr-2 text-xs shadow">
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                  <button className="bg-lightBlue-500 hover:bg-lightBlue-600 text-white px-3 py-1 rounded text-xs shadow">
                    <FontAwesomeIcon icon={faPen} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showForm && (
          <form
            onSubmit={handleAddUser}
            className="mt-6 bg-lightBlue-900 text-white p-6 rounded shadow-md"
          >
            <h4 className="text-md font-semibold mb-4 text-white">Ajouter un utilisateur</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2"> {/* Réduit l'espace entre les inputs */}
              <input
                type="text"
                name="nom"
                placeholder="Nom"
                value={newUser.nom}
                onChange={handleInputChange}
                className="p-1 bg-lightBlue-800 border border-lightBlue-700 text-white placeholder-blueGray-200 rounded" // Réduit le padding
                required
              />
              <input
                type="text"
                name="prenom"
                placeholder="Prénom"
                value={newUser.prenom}
                onChange={handleInputChange}
                className="p-1 bg-lightBlue-800 border border-lightBlue-700 text-white placeholder-blueGray-200 rounded" // Réduit le padding
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={newUser.email}
                onChange={handleInputChange}
                className="p-1 bg-lightBlue-800 border border-lightBlue-700 text-white placeholder-blueGray-200 rounded" // Réduit le padding
                required
              />
              <input
                type="text"
                name="id"
                placeholder="ID"
                value={newUser.id}
                onChange={handleInputChange}
                className="p-1 bg-lightBlue-800 border border-lightBlue-700 text-white placeholder-blueGray-200 rounded" // Réduit le padding
                required
              />
            </div>
            <div className="flex justify-end">
            <button
    type="submit"
    className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold px-4 py-2 rounded shadow"
  >
    Ajouter
  </button>
  </div>
          </form>
        )}
      </div>
    </div>
  );
}

CardTable.defaultProps = {
  color: "dark",
};

CardTable.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
};
