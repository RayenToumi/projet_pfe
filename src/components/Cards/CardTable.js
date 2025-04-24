import React, { useEffect, useState } from "react";
import axios from 'axios';
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPen } from "@fortawesome/free-solid-svg-icons";

export default function CardTable({ color }) {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newUser, setNewUser] = useState({
    nom: "",
    prenom: "",
    email: "",
    _id: "",
    role: "",
    tel: "",
    password: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const getUsers = async () => {
    try {
      const res = await axios.get("/allusers");
      if (res.data) {
        setUsers(res.data);
        console.log("Users data:", res.data);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const handleInputChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleSubmitUser = async (e) => {
    e.preventDefault();

    if (isEditing) {
      try {
        const res = await axios.put(`/updateuser/${newUser._id}`, newUser);
        const updatedUsers = [...users];
        updatedUsers[editIndex] = res.data;
        setUsers(updatedUsers);
      } catch (error) {
        console.error("Erreur lors de la mise à jour:", error);
        alert("Échec de la mise à jour de l'utilisateur.");
      }
    } else {
      try {
        const res = await axios.post("/adduser", newUser);
        setUsers([...users, res.data]);
      } catch (error) {
        console.error("Erreur lors de l'ajout:", error);
        alert("Échec de l'ajout de l'utilisateur.");
      }
    }

    setShowForm(false);
    setIsEditing(false);
    setNewUser({
      nom: "",
      prenom: "",
      email: "",
      _id: "",
      role: "",
      tel: "",
      password: ""
    });
  };

  const handleDeleteUser = async (index) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?");
    if (confirmDelete) {
      try {
        const userId = users[index]._id;
        await axios.delete(`/deleteuser/${userId}`);
        const updatedUsers = users.filter((_, i) => i !== index);
        setUsers(updatedUsers);
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        alert("Échec de la suppression de l'utilisateur.");
      }
    }
  };

  const handleEditUser = (index) => {
    setNewUser({
      ...users[index],
      password: ""
    });
    setIsEditing(true);
    setEditIndex(index);
    setShowForm(true);
  };

  return (
    <div className={"relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg " + (color === "light" ? "bg-white" : "bg-lightBlue-900 text-white")}>
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
        <h3 className={"font-bold text-xl " + (color === "light" ? "text-blueGray-700" : "text-white")}>Liste des utilisateurs</h3>
      </div>

      <div className="overflow-x-auto p-4">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => {
              setShowForm(true);
              setIsEditing(false);
              setNewUser({
                nom: "",
                prenom: "",
                email: "",
                _id: "",
                role: "",
                tel: "",
                password: ""
              });
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow text-sm"
          >
            + Ajouter un utilisateur
          </button>
        </div>

        <table className="w-full text-sm text-left text-white">
          <thead className="text-xs uppercase bg-lightBlue-800 text-blueGray-100">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Nom</th>
              <th className="px-6 py-3">Prénom</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Rôle</th>
              <th className="px-6 py-3">Téléphone</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-lightBlue-900 divide-y divide-blueGray-700">
            {users.map((user, index) => (
              <tr key={user._id} className="hover:bg-lightBlue-800">
                <td className="px-6 py-4">{user._id}</td>
                <td className="px-6 py-4">{user.nom}</td>
                <td className="px-6 py-4">{user.prenom}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.role}</td>
                <td className="px-6 py-4">{user.tel}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDeleteUser(index)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded mr-2 text-xs shadow"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                  <button
                    onClick={() => handleEditUser(index)}
                    className="bg-lightBlue-500 hover:bg-lightBlue-600 text-white px-3 py-1 rounded text-xs shadow"
                  >
                    <FontAwesomeIcon icon={faPen} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showForm && (
          <form onSubmit={handleSubmitUser} className="mt-6 bg-lightBlue-900 text-white p-6 rounded shadow-md">
            <h4 className="text-lg font-semibold mb-4 text-white">
              {isEditing ? "Modifier l'utilisateur" : "Ajouter un nouvel utilisateur"}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {isEditing && (
                <div>
                  <label className="block text-sm mb-1" htmlFor="_id">ID</label>
                  <input
                    id="_id"
                    type="text"
                    name="_id"
                    value={newUser._id}
                    className="w-full p-2 bg-lightBlue-800 border border-lightBlue-700 text-white rounded cursor-not-allowed"
                    disabled
                    readOnly
                  />
                </div>
              )}
              <div>
                <label className="block text-sm mb-1" htmlFor="nom">Nom</label>
                <input
                  id="nom"
                  type="text"
                  name="nom"
                  value={newUser.nom}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-lightBlue-800 border border-lightBlue-700 text-white rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1" htmlFor="prenom">Prénom</label>
                <input
                  id="prenom"
                  type="text"
                  name="prenom"
                  value={newUser.prenom}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-lightBlue-800 border border-lightBlue-700 text-white rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1" htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-lightBlue-800 border border-lightBlue-700 text-white rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1" htmlFor="role">Rôle</label>
                <input
                  id="role"
                  type="text"
                  name="role"
                  value={newUser.role}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-lightBlue-800 border border-lightBlue-700 text-white rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1" htmlFor="tel">Téléphone</label>
                <input
                  id="tel"
                  type="text"
                  name="tel"
                  value={newUser.tel}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-lightBlue-800 border border-lightBlue-700 text-white rounded"
                  required
                />
              </div>
              {isEditing && (
                <div>
                  <label className="block text-sm mb-1" htmlFor="password">Nouveau mot de passe</label>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Laisser vide pour inchangé"
                    value={newUser.password}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-lightBlue-800 border border-lightBlue-700 text-white rounded"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white text-sm font-semibold px-6 py-2 rounded shadow"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold px-6 py-2 rounded shadow"
              >
                {isEditing ? "Modifier" : "Ajouter"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

