import React from "react";
import IndexNavbar from "components/Navbars/IndexNavbar.js";
import Footerr from "components/Footers/Footerr";

function NewTicketForm() {
  return (
    <>
      <IndexNavbar />

      <div style={pageWrapper}>
        <img
          src="https://www.cbf.org.tn/wp-content/uploads/2023/08/0001-1-scaled.jpg"
          alt="background"
          style={backgroundImageStyle}
        />

        <div style={ticketCard}>
          <div style={headerSection}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              
              <h1 style={titleStyle}>🎫 Nouveau Ticket STB</h1>
            </div>
            <button style={returnButtonStyle}>← Retour à la liste</button>
          </div>

          <div style={formSection}>
            <div style={inputGroup}>
              <label style={labelStyle}>📝 Sujet</label>
              <input
                type="text"
                placeholder="Ex: Mon accès internet est bloqué"
                style={inputStyle}
              />
            </div>

            <div style={inputGroup}>
              <label style={labelStyle}>🏢 Département</label>
              <select style={selectStyle}>
                <option>IT - Informatique</option>
                <option>RH - Ressources Humaines</option>
                <option>Comptabilité</option>
              </select>
            </div>

            <div style={inputGroup}>
              <label style={labelStyle}>📄 Description</label>
              <textarea
                rows="5"
                placeholder="Décrivez votre problème ici..."
                style={textareaStyle}
              />
            </div>

            <div style={createButtonContainer}>
              <button style={createButtonStyle}>📨 Créer le ticket</button>
            </div>
          </div>
        </div>
      </div>

      <Footerr />
    </>
  );
}

// 🎨 Styles améliorés avec image de fond et effet verre
const pageWrapper = {
  position: "relative",
  fontFamily: "'Segoe UI', sans-serif",
  minHeight: "100vh",
  padding: "3rem 1rem",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  overflow: "hidden",
};

const backgroundImageStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  filter: "blur(6px) brightness(0.9)",
  zIndex: -1,
};

const ticketCard = {
  background: "rgba(255, 255, 255, 0.85)",
  backdropFilter: "blur(10px)",
  borderRadius: "16px",
  boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
  padding: "2.5rem 3rem",
  maxWidth: "700px",
  width: "100%",
};

const headerSection = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "2rem",
};

const titleStyle = {
  fontSize: "1.9rem",
  fontWeight: "700",
  color: "#0d47a1",
};

const logoStyle = {
  width: "60px",
  height: "60px",
  objectFit: "contain",
};

const returnButtonStyle = {
  padding: "0.6rem 1.2rem",
  backgroundColor: "#eeeeee",
  color: "#0d47a1",
  border: "1px solid #ccc",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "600",
  transition: "all 0.2s ease-in-out",
};

const formSection = {
  display: "flex",
  flexDirection: "column",
  gap: "1.5rem",
};

const inputGroup = {
  display: "flex",
  flexDirection: "column",
};

const labelStyle = {
  fontWeight: "600",
  marginBottom: "0.5rem",
  color: "#333",
};

const inputStyle = {
  padding: "0.9rem",
  border: "1px solid #ccc",
  borderRadius: "6px",
  fontSize: "1rem",
  backgroundColor: "#fff",
};

const selectStyle = {
  ...inputStyle,
  cursor: "pointer",
};

const textareaStyle = {
  ...inputStyle,
  resize: "vertical",
  minHeight: "120px",
};

const createButtonContainer = {
  display: "flex",
  justifyContent: "flex-end",
};

const createButtonStyle = {
  padding: "1rem 2rem",
  backgroundColor: "#0d47a1",
  color: "#ffffff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "1rem",
  transition: "background 0.3s ease",
};

export default NewTicketForm;
