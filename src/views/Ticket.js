import React, { useState } from "react";
import IndexNavbar from "components/Navbars/IndexNavbar.js";
import Footerr from "components/Footers/Footerr";
import { Link } from "react-router-dom";

function NewTicketForm() {
  const [formData, setFormData] = useState({
    sujet: "",
    type: "",
    urgence: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Partie sauvegarde locale
      const newTicket = {
        ...formData,
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        statut: "Ouvert",
      };
      
      // Tentative d'envoi au backend
      const response = await fetch('/addticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }

      // Si le backend répond OK, on sauvegarde localement
      const storedTickets = JSON.parse(localStorage.getItem("tickets")) || [];
      storedTickets.push(newTicket);
      localStorage.setItem("tickets", JSON.stringify(storedTickets));

      // Redirection
      window.location.href = "/MyTickets";

    } catch (error) {
      console.error('Erreur:', error);
      
      // Fallback: Sauvegarde locale si le backend échoue
      const storedTickets = JSON.parse(localStorage.getItem("tickets")) || [];
      storedTickets.push({
        ...formData,
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        statut: "Erreur d'envoi - Sauvegardé localement",
      });
      localStorage.setItem("tickets", JSON.stringify(storedTickets));

      setError(`Échec de l'envoi au serveur. Ticket sauvegardé localement. ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <IndexNavbar />
      <div style={container}>
        <div style={card}>
          <div style={leftSide}>
            <h2 style={title}>🎫 Créer un ticket d'assistance</h2>
            <p style={subtitle}>
              Merci de remplir les informations nécessaires pour traiter votre
              demande.
            </p>

            {error && <div style={errorMessage}>{error}</div>}

            <form style={form} onSubmit={handleSubmit}>
              <div style={inputGroup}>
                <label htmlFor="sujet" style={label}>
                  Sujet
                </label>
                <input
                  type="text"
                  id="sujet"
                  name="sujet"
                  value={formData.sujet}
                  onChange={handleChange}
                  placeholder="Ex : Virement non effectué"
                  style={input}
                  required
                />
              </div>

              <div style={inputGroup}>
                <label htmlFor="type" style={label}>
                  Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  style={input}
                  required
                >
                  <option value="">-- Sélectionner --</option>
                  <option value="IT">IT - Informatique</option>
                  <option value="RH">RH - Ressources Humaines</option>
                  <option value="Comptabilité">Comptabilité</option>
                </select>
              </div>

              <div style={inputGroup}>
                <label htmlFor="urgence" style={label}>
                  Urgence
                </label>
                <select
                  id="urgence"
                  name="urgence"
                  value={formData.urgence}
                  onChange={handleChange}
                  style={input}
                  required
                >
                  <option value="">-- Choisir --</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Normal">Normal</option>
                  <option value="Faible">Faible priorité</option>
                </select>
              </div>

              <div style={inputGroup}>
                <label htmlFor="description" style={label}>
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Décrivez le problème rencontré..."
                  style={textarea}
                  required
                ></textarea>
              </div>

              <div style={buttonGroup}>
                <Link to="/MyTickets" style={backLink}>
                  ← Retour
                </Link>
                <button 
                  type="submit" 
                  style={submitButton}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Envoi en cours..." : "Soumettre"}
                </button>
              </div>
            </form>
          </div>

          <div style={rightSide}>
            <img
              src="https://images.unsplash.com/photo-1605902711622-cfb43c4437d4?auto=format&fit=crop&w=1000&q=80"
              alt="Assistance bancaire"
              style={imageStyle}
            />
          </div>
        </div>
      </div>
      <Footerr />
    </>
  );
}

// 🌟 Styles sobres et bancaires
const container = {
  backgroundColor: "#f1f3f6",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "2rem",
};

const card = {
  display: "flex",
  flexDirection: "row",
  backgroundColor: "#fff",
  borderRadius: "16px",
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.07)",
  overflow: "hidden",
  maxWidth: "1080px",
  width: "100%",
};

const leftSide = {
  flex: 1,
  padding: "2.5rem",
};

const rightSide = {
  flex: 1,
  backgroundColor: "#e3e9f1",
};

const imageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const title = {
  fontSize: "1.8rem",
  fontWeight: "700",
  color: "#003366",
  marginBottom: "1rem",
};

const subtitle = {
  fontSize: "1rem",
  color: "#555",
  marginBottom: "2rem",
};

const form = {
  display: "flex",
  flexDirection: "column",
  gap: "1.2rem",
};

const inputGroup = {
  display: "flex",
  flexDirection: "column",
};

const label = {
  fontWeight: "600",
  marginBottom: "0.5rem",
  color: "#003366",
};

const input = {
  padding: "0.8rem",
  fontSize: "1rem",
  borderRadius: "8px",
  border: "1px solid #ccc",
  backgroundColor: "#f9f9f9",
};

const textarea = {
  ...input,
  resize: "vertical",
  minHeight: "100px",
};

const buttonGroup = {
  marginTop: "1.5rem",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const submitButton = {
  backgroundColor: "#003366",
  color: "#fff",
  border: "none",
  padding: "0.8rem 1.6rem",
  fontSize: "1rem",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  opacity: (props) => (props.disabled ? 0.7 : 1),
};

const backLink = {
  color: "#003366",
  textDecoration: "none",
  fontWeight: "500",
};

const errorMessage = {
  backgroundColor: "#ffebee",
  color: "#c62828",
  padding: "0.8rem",
  borderRadius: "8px",
  marginBottom: "1rem",
  border: "1px solid #ef9a9a",
};

export default NewTicketForm;