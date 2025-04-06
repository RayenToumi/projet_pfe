import { useState } from "react";
import { FaGoogle } from "react-icons/fa";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  return (
    <div style={{ 
      display: "flex", 
      height: "100vh", 
      alignItems: "center", 
      justifyContent: "center", 
      backgroundImage: "url('https://img.freepik.com/premium-vector/abstract-geometric-white-gray-color-background-vector_665257-159.jpg?semt=ais_hybrid')", 
      backgroundSize: "cover", 
      backgroundPosition: "center", 
      padding: "16px" 
    }}>
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "1fr 1fr", 
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", 
        borderRadius: "12px", 
        overflow: "hidden", 
        maxWidth: "1000px",
        width: "100%", 
        position: "relative" 
      }}>
        
        {/* Logo */}
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/0/06/Logo_STB.png" 
          alt="STB Logo" 
          style={{ 
            position: "absolute", 
            top: "12px", 
            left: "12px", 
            width: "120px",
            height: "auto" 
          }} 
        />

        {/* Left Side - Formulaire d'inscription */}
        <div style={{ padding: "32px", display: "flex", flexDirection: "column", justifyContent: "center", background: "white" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#1f2937", textAlign: "center" }}>Sign Up</h2>
          
          {/* Prénom et Nom */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#4b5563" }}>First Name</label>
              <input 
                type="text" 
                placeholder="Enter your first name" 
                value={firstName} 
                onChange={(e) => setFirstName(e.target.value)} 
                style={{ width: "100%", padding: "8px", border: "1px solid #d1d5db", borderRadius: "6px", marginTop: "4px" }} 
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#4b5563" }}>Last Name</label>
              <input 
                type="text" 
                placeholder="Enter your last name" 
                value={lastName} 
                onChange={(e) => setLastName(e.target.value)} 
                style={{ width: "100%", padding: "8px", border: "1px solid #d1d5db", borderRadius: "6px", marginTop: "4px" }} 
              />
            </div>
          </div>

          {/* Email */}
          <div style={{ marginTop: "12px" }}>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#4b5563" }}>Email</label>
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              style={{ width: "100%", padding: "8px", border: "1px solid #d1d5db", borderRadius: "6px", marginTop: "4px" }} 
            />
          </div>

          {/* Téléphone */}
          <div style={{ marginTop: "12px" }}>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#4b5563" }}>Phone Number</label>
            <input 
              type="tel" 
              placeholder="Enter your phone number" 
              value={phoneNumber} 
              onChange={(e) => setPhoneNumber(e.target.value)} 
              style={{ width: "100%", padding: "8px", border: "1px solid #d1d5db", borderRadius: "6px", marginTop: "4px" }} 
            />
          </div>

          {/* Mot de passe */}
          <div style={{ marginTop: "12px" }}>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#4b5563" }}>Password</label>
            <input 
              type="password" 
              placeholder="Enter your password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              style={{ width: "100%", padding: "8px", border: "1px solid #d1d5db", borderRadius: "6px", marginTop: "4px" }} 
            />
          </div>

          {/* Bouton d'inscription */}
          <button style={{ 
            width: "100%", 
            background: "#3b82f6", 
            color: "white", 
            padding: "10px", 
            marginTop: "16px", 
            borderRadius: "6px", 
            fontWeight: "bold", 
            cursor: "pointer"
          }}>
            REGISTER
          </button>

          {/* Séparateur */}
          <div style={{ display: "flex", alignItems: "center", margin: "16px 0" }}>
            <div style={{ flex: "1", height: "1px", background: "#d1d5db" }}></div>
            <span style={{ margin: "0 8px", fontSize: "14px", color: "#6b7280" }}>OR</span>
            <div style={{ flex: "1", height: "1px", background: "#d1d5db" }}></div>
          </div>

          {/* Bouton Google */}
          <button style={{ 
            width: "100%", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            gap: "8px", 
            border: "1px solid #d1d5db", 
            padding: "10px", 
            borderRadius: "6px", 
            fontWeight: "bold", 
            cursor: "pointer", 
            background: "white" 
          }}>
            <FaGoogle style={{ color: "#3b82f6" }} /> Continue with Google
          </button>

          {/* Lien de connexion */}
          <p style={{ fontSize: "14px", textAlign: "center", color: "#6b7280", marginTop: "12px" }}>
            Already have an account? <a href="./" style={{ color: "#3b82f6", textDecoration: "none" }}>Log in</a>
          </p>
        </div>

        {/* Right Side - Message de bienvenue */}
        <div style={{ 
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundImage: "url('https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjrxCZS8RUx52KhkLFeYR19uXX3GnbF9-sH75brySGs70DJ1EINGwkFnr6K5LqopCqGHTVK79x_gscCHE_cR1wmpIADhJXkTZIJhDz_VtYuxwekNibQUVl6VKNuq3uOlTsfnFW2F_ZVXsm2m7DU2IGJREbwsM16cR45D3-4iI5AwRArtjCnR713SvfIJpg/s1934/stb%20%20thebanker.jpg')", backgroundSize: "cover", backgroundPosition: "center", color: "white", padding: "32px", textAlign: "center" 
          
        }}>
          
        </div>
      </div>
    </div>
  );
}