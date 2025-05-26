import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import IndexNavbar from "components/Navbars/IndexNavbar.js";
import Footerr from "components/Footers/Footerr";

function NewTicketForm() {
  const history = useHistory();
  const [formData, setFormData] = useState({
    sujet: "",
    type: "",
    urgence: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const validate = () => {
    const newErrors = {};

    if (!formData.sujet.trim()) {
      newErrors.sujet = "Le sujet est obligatoire.";
    }

    if (!formData.type) {
      newErrors.type = "Le type est obligatoire.";
    }

    if (!formData.urgence) {
      newErrors.urgence = "Le niveau d'urgence est obligatoire.";
    }

    if (!formData.description.trim()) {
      newErrors.description = "La description est obligatoire.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("jwt_token");
      if (!token) {
        throw new Error("Vous devez être connecté pour créer un ticket");
      }

      const response = await fetch("/api/addticket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la création du ticket");
      }

      const newTicket = await response.json();

      const storedTickets = JSON.parse(localStorage.getItem("tickets")) || [];
      storedTickets.push({
        ...newTicket,
        id: newTicket._id,
        date: new Date(newTicket.createdAt).toLocaleDateString("fr-FR"),
      });
      localStorage.setItem("tickets", JSON.stringify(storedTickets));

      history.push("/MyTickets");

    } catch (error) {
      const offlineTicket = {
        ...formData,
        id: Date.now(),
        date: new Date().toLocaleDateString("fr-FR"),
        statut: "En attente de synchronisation",
        _id: `offline-${Date.now()}`,
      };

      const storedTickets = JSON.parse(localStorage.getItem("tickets")) || [];
      storedTickets.push(offlineTicket);
      localStorage.setItem("tickets", JSON.stringify(storedTickets));

      setError(`${error.message} - Le ticket a été sauvegardé localement`);
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
            src="https://s3-symbol-logo.tradingview.com/societe-tunisienne-de-banque--600.png"
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
            />
            {errors.sujet && <div style={styles.error}>{errors.sujet}</div>}

            <label style={styles.label}>Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="">-- Sélectionner --</option>
              <option value="IT">Informatique</option>
              <option value="NET">Problème réseau</option>
              <option value="SE">Sécurité</option>
              <option value="SC">Support client</option>
            </select>
            {errors.type && <div style={styles.error}>{errors.type}</div>}

            <label style={styles.label}>Niveau d'urgence</label>
            <select
              name="urgence"
              value={formData.urgence}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="">-- Choisir --</option>
              <option value="Urgent">Urgent</option>
              <option value="Normal">Normal</option>
       
            </select>
            {errors.urgence && <div style={styles.error}>{errors.urgence}</div>}

            <label style={styles.label}>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              style={styles.textarea}
            />
            {errors.description && <div style={styles.error}>{errors.description}</div>}

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
    filter: "brightness(0.95) contrast(1.05)",
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
  },
  link: {
    color: "#1a2a5e",
    textDecoration: "none",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    transition: "color 0.2s ease",
  },
  error: {
    color: "red",
    fontSize: "0.9rem",
  }
};

export default NewTicketForm;
