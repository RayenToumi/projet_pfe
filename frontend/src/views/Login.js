import React, { useState } from "react";
import { useHistory } from "react-router-dom";


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const history = useHistory();

  // Validation de l'email
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setEmailError("");
    setPasswordError("");

    try {
      const loginResponse = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        throw new Error(loginData.message || "Échec de la connexion");
      }

      const { token, user } = loginData;

      localStorage.setItem("jwt_token", token);
      localStorage.setItem("user", JSON.stringify(user));

      switch (user.role) {
        case "admin":
          history.push("/admin/dashboard");
          break;
        case "technicien":
          history.push("/technicien/ticket");
          break;
        default:
          history.push("/homepage");
      }
    } catch (error) {
      setError(error.message);
      if (error.message.toLowerCase().includes("email")) {
        setEmailError("Veuillez vérifier votre adresse e-mail");
      } else if (error.message.toLowerCase().includes("password")) {
        setPasswordError("Veuillez vérifier votre mot de passe");
      } else {
        setEmailError("Vérifiez votre email");
        setPasswordError("Vérifiez votre mot de passe");
      }
    } finally {
      setLoading(false);
    }
  };

  // Méthode pour le mot de passe oublié
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");
    setEmailError("");

    // Validation de l'email avant d'envoyer la demande
    if (!validateEmail(email)) {
      setEmailError("Veuillez entrer une adresse e-mail valide.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'envoi");
      }

      setSuccessMessage("Un e-mail de réinitialisation a été envoyé.");
    } catch (error) {
      setEmailError("Vérifiez votre adresse e-mail");
    } finally {
      setLoading(false);
    }
  };

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

        <form onSubmit={showForgotPassword ? handleForgotPassword : handleSubmit} style={{
          padding: "32px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "white"
        }}>
          <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#1f2937", textAlign: "center" }}>
            {showForgotPassword ? "Mot de passe oublié" : "Se connecter"}
          </h2>

          {error && <div style={{ color: "red", marginBottom: "12px" }}>{error}</div>}
          {successMessage && <div style={{ color: "green", marginBottom: "12px" }}>{successMessage}</div>}

          <div style={{ marginTop: "16px" }}>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#4b5563" }}>Email</label>
            <input
              type="email"
              placeholder="Entrez votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                marginTop: "4px"
              }}
            />
            {emailError && <p style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>{emailError}</p>}
          </div>

          {!showForgotPassword && (
            <>
              <div style={{ marginTop: "12px" }}>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#4b5563" }}>Mot de passe</label>
                <input
                  type="password"
                  placeholder="Entrez votre Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    marginTop: "4px"
                  }}
                />
                {passwordError && <p style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>{passwordError}</p>}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <input type="checkbox" id="remember" />
                  <label htmlFor="remember" style={{ marginLeft: "6px", fontSize: "14px", color: "#4b5563" }}>Souviens-toi de moi</label>
                </div>
                <button type="button" onClick={() => setShowForgotPassword(true)} style={{
                  fontSize: "14px",
                  color: "#3b82f6",
                  textDecoration: "none",
                  background: "none",
                  border: "none",
                  cursor: "pointer"
                }}>
                  Mot de passe oublié ?
                </button>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              background: loading ? "#9ca3af" : "#3b82f6",
              color: "white",
              padding: "10px",
              marginTop: "16px",
              borderRadius: "6px",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Chargement..." : showForgotPassword ? "Envoyer" : "Se connecter"}
          </button>

          {!showForgotPassword && (
            <>
              <div style={{ display: "flex", alignItems: "center", margin: "16px 0" }}>
                <div style={{ flex: "1", height: "1px", background: "#d1d5db" }}></div>
                <span style={{ margin: "0 8px", fontSize: "14px", color: "#6b7280" }}>OR</span>
                <div style={{ flex: "1", height: "1px", background: "#d1d5db" }}></div>
              </div>
              <p style={{ fontSize: "14px", textAlign: "center", color: "#6b7280", marginTop: "12px" }}>
                Vous n'avez pas de compte ? <a href="Register" style={{ color: "#3b82f6", textDecoration: "none" }}>S'inscrire</a>
              </p>
            </>
          )}

          {showForgotPassword && (
            <button
              type="button"
              onClick={() => setShowForgotPassword(false)}
              style={{
                marginTop: "12px",
                fontSize: "14px",
                color: "#3b82f6",
                textDecoration: "none",
                background: "none",
                border: "none",
                cursor: "pointer"
              }}
            >
              Retour à la connexion
            </button>
          )}
        </form>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: "url('https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjrxCZS8RUx52KhkLFeYR19uXX3GnbF9-sH75brySGs70DJ1EINGwkFnr6K5LqopCqGHTVK79x_gscCHE_cR1wmpIADhJXkTZIJhDz_VtYuxwekNibQUVl6VKNuq3uOlTsfnFW2F_ZVXsm2m7DU2IGJREbwsM16cR45D3-4iI5AwRArtjCnR713SvfIJpg/s1934/stb%20%20thebanker.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
          padding: "32px",
          textAlign: "center"
        }}>
        </div>
      </div>
    </div>
  );
}
