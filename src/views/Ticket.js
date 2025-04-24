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
          <h2 style={styles.title}>Créer un ticket</h2>

          {error && <div style={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            <label style={styles.label}>Sujet</label>
            <input type="text" name="sujet" value={formData.sujet} onChange={handleChange} style={styles.input} required />

            <label style={styles.label}>Type</label>
            <select name="type" value={formData.type} onChange={handleChange} style={styles.input} required>
              <option value="">-- Sélectionner --</option>
              <option value="IT">Informatique</option>
              <option value="RH">Ressources Humaines</option>
              <option value="Comptabilité">Comptabilité</option>
            </select>

            <label style={styles.label}>Urgence</label>
            <select name="urgence" value={formData.urgence} onChange={handleChange} style={styles.input} required>
              <option value="">-- Choisir --</option>
              <option value="Urgent">Urgent</option>
              <option value="Normal">Normal</option>
              <option value="Faible">Faible</option>
            </select>

            <label style={styles.label}>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="4" style={styles.textarea} required />

            <div style={styles.actions}>
              <Link to="/MyTickets" style={styles.link}>← Retour</Link>
              <button type="submit" style={styles.submitBtn} disabled={isSubmitting}>
                {isSubmitting ? "Soumission..." : "Soumettre"}
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
    backgroundColor: "#f0f2f5",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "3rem",
    maxWidth: "700px",
    width: "100%",
    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
  },
  title: {
    fontSize: "1.8rem",
    marginBottom: "1.5rem",
    color: "#003366",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  label: {
    fontWeight: "600",
    color: "#003366",
  },
  input: {
    padding: "0.9rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    backgroundColor: "#f9f9f9",
  },
  textarea: {
    padding: "0.9rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    backgroundColor: "#f9f9f9",
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "1.5rem",
  },
  submitBtn: {
    backgroundColor: "#003366",
    color: "#fff",
    padding: "0.8rem 2rem",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },
  link: {
    color: "#003366",
    textDecoration: "none",
    fontWeight: "500",
  },
  error: {
    backgroundColor: "#ffe6e6",
    padding: "1rem",
    borderRadius: "8px",
    color: "#cc0000",
    marginBottom: "1rem",
  },
};

export default NewTicketForm;
