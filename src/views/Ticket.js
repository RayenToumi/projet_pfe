import React, { useState } from "react";
import { Link } from "react-router-dom";
import IndexNavbar from "components/Navbars/IndexNavbar.js";
import Footerr from "components/Footers/Footerr";

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
      const newTicket = {
        ...formData,
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        statut: "Ouvert",
      };

      const response = await fetch("/addticket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`);

      const storedTickets = JSON.parse(localStorage.getItem("tickets")) || [];
      storedTickets.push(newTicket);
      localStorage.setItem("tickets", JSON.stringify(storedTickets));

      window.location.href = "/MyTickets";
    } catch (error) {
      const storedTickets = JSON.parse(localStorage.getItem("tickets")) || [];
      storedTickets.push({
        ...formData,
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        statut: "Erreur d'envoi - Sauvegardé localement",
      });
      localStorage.setItem("tickets", JSON.stringify(storedTickets));
      setError(`Échec de l'envoi. ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <IndexNavbar />
      <div style={styles.page}>
        <div style={styles.card}>
          <img 
            src="https://i1.wp.com/accessaa.co.uk/wp-content/uploads/2017/07/Screen-Shot-2017-07-03-at-11.42.31.png?fit=681%2C473&ssl=1" 
            alt="Support bancaire" 
            style={styles.headerImage}
          />
          <h2 style={styles.title}>Nouveau Ticket de Support</h2>

          {error && <div style={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            <label style={styles.label}>Sujet</label>
            <input 
              type="text" 
              name="sujet" 
              value={formData.sujet} 
              onChange={handleChange} 
              style={styles.input} 
              required 
            />

            <label style={styles.label}>Type</label>
            <select 
              name="type" 
              value={formData.type} 
              onChange={handleChange} 
              style={styles.input} 
              required
            >
              <option value="">-- Sélectionner --</option>
              <option value="IT">Informatique</option>
              <option value="RH">Ressources Humaines</option>
              <option value="Comptabilité">Comptabilité</option>
            </select>

            <label style={styles.label}>Niveau d'urgence</label>
            <select 
              name="urgence" 
              value={formData.urgence} 
              onChange={handleChange} 
              style={styles.input} 
              required
            >
              <option value="">-- Choisir --</option>
              <option value="Urgent">Urgent</option>
              <option value="Normal">Normal</option>
              <option value="Faible">Faible</option>
            </select>

            <label style={styles.label}>Description</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              rows="4" 
              style={styles.textarea} 
              required 
            />

            <div style={styles.actions}>
              <Link to="/MyTickets" style={styles.link}>
                ← Retour aux tickets
              </Link>
              <button 
                type="submit" 
                style={styles.submitBtn} 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Envoi en cours..." : "Soumettre le ticket"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footerr />
    </>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f8f9ff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "1rem",
    background: "linear-gradient(135deg, #f5f7ff 0%, #eef0ff 100%)",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    padding: "2rem",
    maxWidth: "550px",
    width: "100%",
    boxShadow: "0 2px 15px rgba(0, 51, 102, 0.08)",
    border: "1px solid #e0e5ec",
    position: "relative",
    marginTop: "50px",
    padding: "2rem 2rem 1.5rem 2rem",
  },
  headerImage: {
    width: "80px",
    height: "80px",
    position: "absolute",
    top: "-40px",
    left: "50%",
    transform: "translateX(-50%)",
    filter: "hue-rotate(200deg) brightness(0.9)",
    backgroundColor: "#fff",
    borderRadius: "50%",
    padding: "8px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },
  title: {
    fontSize: "1.5rem",
    marginBottom: "1.5rem",
    color: "#1a2a5e",
    textAlign: "center",
    fontWeight: "600",
    letterSpacing: "-0.5px",
    paddingTop: "1rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.2rem",
  },
  label: {
    fontWeight: "500",
    color: "#3a4767",
    fontSize: "0.9rem",
    marginBottom: "0.3rem",
    display: "block",
  },
  input: {
    padding: "0.7rem",
    borderRadius: "6px",
    border: "1px solid #d5dbe7",
    fontSize: "0.95rem",
    backgroundColor: "#fbfcff",
    transition: "all 0.2s ease",
    width: "100%",
    ":focus": {
      outline: "none",
      borderColor: "#1a2a5e",
      boxShadow: "0 0 0 2px rgba(26, 42, 94, 0.1)",
    },
  },
  textarea: {
    padding: "0.7rem",
    borderRadius: "6px",
    border: "1px solid #d5dbe7",
    fontSize: "0.95rem",
    backgroundColor: "#fbfcff",
    minHeight: "100px",
    resize: "vertical",
    width: "100%",
    ":focus": {
      outline: "none",
      borderColor: "#1a2a5e",
      boxShadow: "0 0 0 2px rgba(26, 42, 94, 0.1)",
    },
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",

    alignItems: "center",
    flexWrap: "wrap",
    gap: "1rem",
    marginTop: "0.2rem", 
  },
  submitBtn: {
    backgroundColor: "#1a2a5e",
    color: "#fff",
    padding: "0.7rem 2rem",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
    transition: "all 0.2s ease",
    fontSize: "0.95rem",
    ":hover": {
      backgroundColor: "#2a3a8e",
      transform: "translateY(-1px)",
    },
    ":active": {
      transform: "translateY(0)",
    },
  },
  link: {
    color: "#1a2a5e",
    textDecoration: "none",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    transition: "color 0.2s ease",
    ":hover": {
      color: "#2a3a8e",
    },
  },
  error: {
    backgroundColor: "#fff0f0",
    padding: "1rem",
    borderRadius: "8px",
    color: "#d32f2f",
    marginBottom: "1rem",
    border: "1px solid #ffcdd2",
    fontSize: "0.9rem",
  },
};

export default NewTicketForm;