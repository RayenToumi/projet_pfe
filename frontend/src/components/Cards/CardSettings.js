import React, { useState, useEffect } from "react";
import bcrypt from "bcryptjs";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function CardSettings() {
  const [userData, setUserData] = useState({
    _id: "",
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("jwt_token");
        const response = await fetch("/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Erreur de récupération des données");

        const data = await response.json();
        const parsedUser = {
          _id: data.id,
          nom: data.nom || "",
          prenom: data.prenom || "",
          email: data.email || "",
          tel: data.tel || "",
          password: data.password || "",
        };

        setUserData(parsedUser);
        setInitialUserData(parsedUser);
        localStorage.setItem("user", JSON.stringify(parsedUser));
      } catch (error) {
        console.error("Erreur dans fetchUserData :", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => {
        const toast = document.querySelector('.toast-message');
        if (toast) {
          toast.style.animation = 'fade-out 0.3s ease-in forwards';
          setTimeout(() => setShowSuccessMessage(false), 300);
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessMessage]);

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

  const validatePhoneNumber = (tel) => /^[259]\d{7}$/.test(tel);
  const validateName = (name) => /^[A-Za-zÀ-ÿ]+(?: [A-Za-zÀ-ÿ]+)*$/.test(name);

  const validateFields = () => {
    const newErrors = {};

    if (!validateName(userData.nom)) {
      newErrors.nom = "Le nom doit contenir uniquement des lettres.";
    }

    if (!validateName(userData.prenom)) {
      newErrors.prenom = "Le prénom doit contenir uniquement des lettres.";
    }

    if (!validatePhoneNumber(userData.tel)) {
      newErrors.tel = "Numéro de téléphone incorrect (8 chiffres, commence par 2, 5 ou 9).";
    }

    if (passwordData.currentPassword && !passwordData.newPassword) {
      newErrors.newPassword = "Veuillez entrer un nouveau mot de passe.";
    } else if (passwordData.newPassword && passwordData.newPassword.length < 6) {
      newErrors.newPassword = "Le mot de passe doit contenir au moins 6 caractères.";
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

    const updateUserDataOnServer = async (dataToSend) => {
      try {
        const response = await fetch(`/updateuser/${userData._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSend),
        });

        const data = await response.json();

        if (response.ok) {
          const updatedData = {
            ...data,
            password: data.password || userData.password,
          };

          setUserData(updatedData);
          setInitialUserData(updatedData);
          localStorage.setItem("user", JSON.stringify(updatedData));

          setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
          setErrors({});
          setSuccessMessage("Modifications enregistrées avec succès !");
          setShowSuccessMessage(true);
        }
      } catch (error) {
        setErrors({ general: "Erreur lors de la mise à jour" });
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
            const dataToSend = { ...userData };
            if (hasPasswordChange) {
              dataToSend.password = passwordData.newPassword;
            }
            await updateUserDataOnServer(dataToSend);
          }
        }
      );
    } else {
      await updateUserDataOnServer(userData);
    }
  };

  return (
    <>
      <div className="relative flex flex-col w-full max-w-[1000px] mb-6 shadow-lg rounded-lg bg-[var(--ubci-card-bg)] border border-[var(--ubci-gray-200)] overflow-hidden">
        <div className="rounded-t bg-white mb-0 px-6 py-6">
          <div className="text-center flex justify-between">
            <h6 className="text-blueGray-700 text-xl font-bold">Mon Compte</h6>
          </div>
        </div>

        <div className="flex-auto px-4 lg:px-10 py-10 pt-0 bg-blueGray-50 rounded-b-lg overflow-auto">
          <form>
            <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase flex items-center">
              <svg className="h-5 w-5 text-lightBlue-600 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Informations Personnelles
            </h6>

            <div className="flex flex-wrap">
              <div className="w-full lg:w-6/12 px-4 mb-4">
                <label className="block font-semibold mb-1" htmlFor="nom">Nom</label>
                <input type="text" className="gp-form-input" id="nom" value={userData.nom} onChange={handleUserChange} />
                {errors.nom && <p className="error-message">{errors.nom}</p>}
              </div>

              <div className="w-full lg:w-6/12 px-4 mb-4">
                <label className="block font-semibold mb-1" htmlFor="prenom">Prénom</label>
                <input type="text" className="gp-form-input" id="prenom" value={userData.prenom} onChange={handleUserChange} />
                {errors.prenom && <p className="error-message">{errors.prenom}</p>}
              </div>

              <div className="w-full lg:w-6/12 px-4 mb-4">
                <label className="block font-semibold mb-1" htmlFor="email">Email</label>
                <input
                  type="email"
                  className="gp-form-input"
                  id="email"
                  value={userData.email}
                  disabled
                  style={{ backgroundColor: "#f3f3f3", cursor: "not-allowed" }}
                />
              </div>

              <div className="w-full lg:w-6/12 px-4 mb-4">
                <label className="block font-semibold mb-1" htmlFor="tel">Num Tel</label>
                <input type="text" className="gp-form-input" id="tel" value={userData.tel} onChange={handleUserChange} />
                {errors.tel && <p className="error-message">{errors.tel}</p>}
              </div>
            </div>

            <hr className="mt-6 border-b-1 border-blueGray-300" />

            <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase flex items-center">
              <svg className="h-5 w-5 text-lightBlue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Changer le mot de passe
            </h6>

            <div className="flex flex-wrap">
              <div className="w-full lg:w-6/12 px-4 mb-4 relative">
                <label className="block font-semibold mb-1" htmlFor="currentPassword">Ancien mot de passe</label>
                <input type={showPassword ? "text" : "password"} className="gp-form-input" id="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} />
                <span className="absolute top-9 right-6 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
                {errors.currentPassword && <p className="error-message">{errors.currentPassword}</p>}
              </div>

              <div className="w-full lg:w-6/12 px-4 mb-4 relative">
                <label className="block font-semibold mb-1" htmlFor="newPassword">Nouveau mot de passe</label>
                <input type={showConfirmPassword ? "text" : "password"} className="gp-form-input" id="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} />
                <span className="absolute top-9 right-6 cursor-pointer" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
                {errors.newPassword && <p className="error-message">{errors.newPassword}</p>}
              </div>

              <div className="w-full lg:w-6/12 px-4 mb-4">
                <label className="block font-semibold mb-1" htmlFor="confirmPassword">Confirmer mot de passe</label>
                <input type={showConfirmPassword ? "text" : "password"} className="gp-form-input" id="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} />
                {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button type="button" className="gp-button-cancel" onClick={handleCancel}>Annuler</button>
              <button type="submit" className="gp-button-save" onClick={handleSave}>Sauvegarder</button>
            </div>
          </form>

          {errors.general && <p className="error-message text-center mb-4 font-bold">{errors.general}</p>}
        </div>
      </div>

      {showSuccessMessage && (
        <div className="toast-message animate-fade-in">
          <div className="toast-content">
            <div className="toast-icon">
              <svg xmlns="http://www.w3.org/2000/svg" 
                   width="24" 
                   height="24" 
                   viewBox="0 0 24 24" 
                   fill="none" 
                   stroke="currentColor" 
                   strokeWidth="2" 
                   strokeLinecap="round" 
                   strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <span className="toast-text">{successMessage}</span>
          </div>
        </div>
      )}

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
          background-color: rgb(110, 114, 117);
          color: white;
          padding: 10px 20px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          margin-right: 10px;
        }

        .gp-button-cancel:hover {
          background-color: rgb(114, 125, 126);
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

        .toast-message {
          position: fixed;
          bottom: 40px;
          right: 40px;
          background: linear-gradient(145deg, #1a4338, #0d2a23);
          color: white;
          border-radius: 8px;
          padding: 18px 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          max-width: 400px;
          font-family: 'Inter', sans-serif;
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          gap: 14px;
          transform: translateY(20px);
          opacity: 0;
        }

        .toast-content {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .toast-icon {
          color: #76e0a7;
          display: flex;
          align-items: center;
        }

        .toast-icon svg {
          width: 22px;
          height: 22px;
        }

        .toast-text {
          font-size: 14px;
          font-weight: 400;
          line-height: 1.4;
          color: rgba(255, 255, 255, 0.95);
          letter-spacing: 0.2px;
        }

        @keyframes fade-in {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }

        @keyframes fade-out {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(20px); opacity: 0; }
        }
      `}</style>
    </>
  );
}