import React, { useState, useEffect } from "react";
import bcrypt from "bcryptjs";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Importation des icônes

export default function CardSettings() {
  const [userData, setUserData] = useState({
    _id: "", // Ajout de l'ID
    nom: "",
    prenom: "",
    email: "",
    tel: "",
    password: "",
  });

  const [initialUserData, setInitialUserData] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false); // Pour afficher/masquer le mot de passe
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Pour confirmer le mot de passe

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserData({
        _id: parsedUser._id,  // Récupérer l'ID de l'utilisateur
        nom: parsedUser.nom || "",
        prenom: parsedUser.prenom || "",
        email: parsedUser.email || "",
        tel: parsedUser.tel || "",
        password: parsedUser.password || "",
      });
      setInitialUserData(parsedUser);
    }
  }, []);

  const handleUserChange = (e) => {
    setUserData({
      ...userData,
      [e.target.id]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.id]: e.target.value,
    });
  };

  const handleCancel = () => {
    if (initialUserData) {
      setUserData(initialUserData);
    }
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setErrors({});
  };

  const validatePhoneNumber = (tel) => {
    const phoneRegex = /^[259]\d{7}$/;
    return phoneRegex.test(tel);
  };

  const validateFields = () => {
    const newErrors = {};

    if (!validatePhoneNumber(userData.tel)) {
      newErrors.tel = "Numéro de téléphone incorrect.";
    }

    if (passwordData.currentPassword && !passwordData.newPassword) {
      newErrors.newPassword = "Veuillez entrer un nouveau mot de passe.";
    } else if (passwordData.newPassword && passwordData.newPassword.length < 6) {
      newErrors.newPassword = "Le nouveau mot de passe doit contenir au moins 6 caractères.";
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas.";
    }

    return newErrors;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const validationErrors = validateFields();
  
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    const hasUserDataChanged = Object.keys(userData).some(
      (key) => userData[key] !== initialUserData[key]
    );
    const hasPasswordChange = passwordData.newPassword !== "";
  
    if (!hasUserDataChanged && !hasPasswordChange) {
      setErrors({ general: "Aucune modification effectuée" });
      return;
    }
  
    const updatedUserData = { ...userData };
  
    const updateUserDataOnServer = async () => {
      try {
        const response = await fetch(`/updateuser/${userData._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUserData),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          const updatedData = data;
          setUserData(updatedData);
          setInitialUserData(updatedData);
          localStorage.setItem("user", JSON.stringify(updatedData));
          setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
          setErrors({});
        } else if (response.status === 409 || data.message?.includes("email")) {
          setErrors({ email: "Cet email est déjà utilisé" });
        } else {
          setErrors({ general: "verifier bien le formulaire" });
        }
      } catch (error) {
        console.error(error);
        setErrors({ general: "Erreur de connexion au serveur" });
      }
    };
  
    if (passwordData.currentPassword) {
      bcrypt.compare(
        passwordData.currentPassword,
        initialUserData.password,
        async (err, isMatch) => {
          if (err) {
            setErrors({ currentPassword: "Erreur de vérification" });
            return;
          }
  
          if (!isMatch) {
            setErrors({ currentPassword: "Mot de passe actuel incorrect" });
          } else {
            if (hasPasswordChange) {
              updatedUserData.password = passwordData.newPassword; // Envoi du mot de passe en clair
              updatedUserData.plainPassword = passwordData.newPassword; // Ajout d'un champ supplémentaire si nécessaire
            }
            await updateUserDataOnServer();
          }
        }
      );
    } else {
      await updateUserDataOnServer();
    }
  };
  
  
  
  
  
  

  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words w-full max-w-[1000px] mb-6 shadow-lg rounded-lg bg-[var(--ubci-card-bg)] border border-[var(--ubci-gray-200)] overflow-hidden">
        <div className="rounded-t bg-white mb-0 px-6 py-6">
          <div className="text-center flex justify-between">
            <h6 className="text-blueGray-700 text-xl font-bold">Mon Compte</h6>
          </div>
        </div>

        <div className="flex-auto px-4 lg:px-10 py-10 pt-0 bg-blueGray-50 rounded-b-lg overflow-auto">
          <form>
            {/* Informations Personnelles */}
            <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase flex items-center">
              <svg
                className="h-5 w-5 text-lightBlue-600 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Informations Personnelles
            </h6>

            <div className="flex flex-wrap">
              {/* Nom */}
              <div className="w-full lg:w-6/12 px-4 mb-4">
                <label className="block font-semibold mb-1" htmlFor="nom">Nom</label>
                <input
                  type="text"
                  className="gp-form-input"
                  id="nom"
                  value={userData.nom}
                  onChange={handleUserChange}
                />
              </div>

              {/* Prénom */}
              <div className="w-full lg:w-6/12 px-4 mb-4">
                <label className="block font-semibold mb-1" htmlFor="prenom">Prénom</label>
                <input
                  type="text"
                  className="gp-form-input"
                  id="prenom"
                  value={userData.prenom}
                  onChange={handleUserChange}
                />
              </div>

              {/* Email */}
              <div className="w-full lg:w-6/12 px-4 mb-4">
  <label className="block font-semibold mb-1" htmlFor="email">Email</label>
  <input
    type="email"
    className="gp-form-input"
    id="email"
    value={userData.email}
    onChange={handleUserChange}
  />
  {errors.email && 
    <p className="error-message mt-1 text-sm">⚠️ Cet email est déjà utilisé</p>
  }
</div>
             


              {/* Téléphone */}
              <div className="w-full lg:w-6/12 px-4 mb-4">
                <label className="block font-semibold mb-1" htmlFor="tel">Num Tel</label>
                <input
                  type="text"
                  className="gp-form-input"
                  id="tel"
                  value={userData.tel}
                  onChange={handleUserChange}
                />
                {errors.tel && <p className="error-message">{errors.tel}</p>}
              </div>
            </div>

            <hr className="mt-6 border-b-1 border-blueGray-300" />

            {/* Changer mot de passe */}
            <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase flex items-center">
              <svg
                className="h-5 w-5 text-lightBlue-600 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Changer le mot de passe
            </h6>

            <div className="flex flex-wrap">
              {/* Ancien mot de passe */}
              <div className="w-full lg:w-6/12 px-4 mb-4">
                <label className="block font-semibold mb-1" htmlFor="currentPassword">Ancien mot de passe</label>
                <input
                  type={showPassword ? "text" : "password"}
                  className="gp-form-input"
                  id="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                />
                <span onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
                {errors.currentPassword && <p className="error-message">{errors.currentPassword}</p>}
              </div>

              {/* Nouveau mot de passe */}
              <div className="w-full lg:w-6/12 px-4 mb-4">
                <label className="block font-semibold mb-1" htmlFor="newPassword">Nouveau mot de passe</label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="gp-form-input"
                  id="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                />
                <span onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
                {errors.newPassword && <p className="error-message">{errors.newPassword}</p>}
              </div>

              {/* Confirmer mot de passe */}
              <div className="w-full lg:w-6/12 px-4 mb-4">
                <label className="block font-semibold mb-1" htmlFor="confirmPassword">Confirmer mot de passe</label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="gp-form-input"
                  id="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                />
                {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end mt-6">
  <button
    type="button"
    className="gp-button-cancel"
    onClick={handleCancel}
  >
    Annuler
  </button>
  <button
    type="submit"
    className="gp-button-save"
    onClick={handleSave}
  >
    Sauvegarder
  </button>
</div>
          </form>
          {errors.general && (
  <p className="error-message text-center mb-4 font-bold">
    {errors.general}
  </p>
)}
        </div>
      </div>

      {/* Styles CSS */}
      <style jsx>{`
        .gp-form-input {
          width: 100%;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #ccc;
          font-size: 14px;
          color: #333;
        }

        .gp-form-input:focus {
          border-color: #4C9AFF;
        }

        .gp-button-cancel {
  background-color:rgb(110, 114, 117); /* Gris clair */
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  margin-right: 10px;
}

.gp-button-cancel:hover {
  background-color:rgb(114, 125, 126); /* Gris plus foncé au survol */
}

        .gp-button-save {
          background-color: #4C9AFF;
          color: white;
          padding: 10px 20px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
        }

        .gp-button-save:hover {
          background-color: #3498db;
        }

        .error-message {
          color: #e74c3c;
          font-size: 12px;
        }
      `}</style>
    </>
  );
}
