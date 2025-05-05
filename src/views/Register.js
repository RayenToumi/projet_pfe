import { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import axios from 'axios';

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: ""
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const validate = () => {
    const newErrors = {};

    if (!/^[A-Za-zÀ-ÿ\s'-]+$/.test(firstName)) {
      newErrors.firstName = "Veuillez vérifier le nom";
    }

    if (!/^[A-Za-zÀ-ÿ\s'-]+$/.test(lastName)) {
      newErrors.lastName = "Veuillez vérifier le prénom";
    }

    if (!/^[259][0-9]{7}$/.test(phoneNumber)) {
      newErrors.phoneNumber = "Veuillez vérifier le numero de telephone";
    }

    if (!email.includes("@") || !email.includes(".")) {
      newErrors.email = "Veuillez vérifier l'adresse email";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const userData = {
      nom: firstName,
      prenom: lastName,
      email: email,
      tel: phoneNumber,
    };

    try {
      const response = await axios.post("/adduser", userData);
      console.log("Utilisateur ajouté:", response.data);
      
      // Afficher un message de succès
      setSuccessMessage("Félicitations ! Vous avez ouvert un compte avec nous.Votre mot de passe a été envoyé sur votre email");
      setShowSuccessMessage(true);
      
      // Fermer le toast après 5 secondes
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);

    } catch (error) {
      console.error("Erreur lors de l'ajout de l'utilisateur:", error);

      if (error.response && error.response.status === 409) {
        setErrors(prev => ({ ...prev, email: "Email déjà existe" }));
      } else {
        setErrors(prev => ({ ...prev, email: "Email déjà existe" }));
      }
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", backgroundImage: "url('https://img.freepik.com/premium-vector/abstract-geometric-white-gray-color-background-vector_665257-159.jpg?semt=ais_hybrid')", backgroundSize: "cover", backgroundPosition: "center", padding: "16px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", borderRadius: "12px", overflow: "hidden", maxWidth: "1000px", width: "100%", position: "relative" }}>
        
        <img src="https://upload.wikimedia.org/wikipedia/commons/0/06/Logo_STB.png" alt="STB Logo" style={{ position: "absolute", top: "12px", left: "12px", width: "120px", height: "auto" }} />
        
        {/* Partie Gauche */}
        <div style={{ padding: "32px", display: "flex", flexDirection: "column", justifyContent: "center", background: "white" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#1f2937", textAlign: "center" }}>Sign Up</h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#4b5563" }}>Nom</label>
              <input
                type="text"
                placeholder="Entrez le nom"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                style={{ width: "100%", padding: "8px", border: "1px solid #d1d5db", borderRadius: "6px", marginTop: "4px" }}
              />
              {errors.firstName && <p style={{ color: "red", fontSize: "12px" }}>{errors.firstName}</p>}
            </div>

            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#4b5563" }}>Prénom</label>
              <input
                type="text"
                placeholder="Entrez le prénom"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                style={{ width: "100%", padding: "8px", border: "1px solid #d1d5db", borderRadius: "6px", marginTop: "4px" }}
              />
              {errors.lastName && <p style={{ color: "red", fontSize: "12px" }}>{errors.lastName}</p>}
            </div>
          </div>

          <div style={{ marginTop: "12px" }}>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#4b5563" }}>Email</label>
            <input
              type="email"
              placeholder="Entrez votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", padding: "8px", border: "1px solid #d1d5db", borderRadius: "6px", marginTop: "4px" }}
            />
            {errors.email && <p style={{ color: "red", fontSize: "12px" }}>{errors.email}</p>}
          </div>

          <div style={{ marginTop: "12px" }}>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#4b5563" }}>Numéro de téléphone</label>
            <input
              type="text"
              placeholder="Entrer le numer de telephone +216"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              style={{ width: "100%", padding: "8px", border: "1px solid #d1d5db", borderRadius: "6px", marginTop: "4px" }}
            />
            {errors.phoneNumber && <p style={{ color: "red", fontSize: "12px" }}>{errors.phoneNumber}</p>}
          </div>

          <button
            onClick={handleSubmit}
            style={{ width: "100%", background: "#3b82f6", color: "white", padding: "10px", marginTop: "16px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}
          >
            REGISTER
          </button>

          <div style={{ display: "flex", alignItems: "center", margin: "16px 0" }}>
            <div style={{ flex: "1", height: "1px", background: "#d1d5db" }}></div>
            <span style={{ margin: "0 8px", fontSize: "14px", color: "#6b7280" }}>OU</span>
            <div style={{ flex: "1", height: "1px", background: "#d1d5db" }}></div>
          </div>

          <button
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", border: "1px solid #d1d5db", padding: "10px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", background: "white" }}
          >
            <FaGoogle style={{ color: "#3b82f6" }} /> Continuer avec Google
          </button>

          <p style={{ fontSize: "14px", textAlign: "center", color: "#6b7280", marginTop: "12px" }}>
            Vous avez déjà un compte ? <a href="./login" style={{ color: "#3b82f6", textDecoration: "none" }}>Connectez-vous</a>
          </p>
        </div>

        {/* Partie Droite */}
        <div style={{ backgroundImage: "url('https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjrxCZS8RUx52KhkLFeYR19uXX3GnbF9-sH75brySGs70DJ1EINGwkFnr6K5LqopCqGHTVK79x_gscCHE_cR1wmpIADhJXkTZIJhDz_VtYuxwekNibQUVl6VKNuq3uOlTsfnFW2F_ZVXsm2m7DU2IGJREbwsM16cR45D3-4iI5AwRArtjCnR713SvfIJpg/s1934/stb%20%20thebanker.jpg')", backgroundSize: "cover", backgroundPosition: "center", color: "white" }} />
      </div>

      {/* Message Toast */}
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
    </div>
  );
}
