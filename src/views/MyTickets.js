import React, { useState } from "react";
import IndexNavbar from "components/Navbars/IndexNavbar.js";
import Footerr from "components/Footers/Footerr";

function MyTickets() {
  const [selectedTicket, setSelectedTicket] = useState(null);

  const tickets = [
    {
      id: 1,
      sujet: "Connexion VPN bloquée",
      departement: "IT",
      statut: "Ouvert",
      date: "2025-04-04",
      description: "Je n'arrive plus à me connecter au VPN depuis ce matin.",
    },
    {
      id: 2,
      sujet: "Erreur sur fiche de paie",
      departement: "RH",
      statut: "En cours",
      date: "2025-04-01",
      description: "Il y a une erreur dans le montant net affiché.",
    },
    {
      id: 3,
      sujet: "Problème d'accès à l'intranet",
      departement: "IT",
      statut: "Résolu",
      date: "2025-03-29",
      description: "Le site intranet était inaccessible depuis plusieurs jours.",
    },
  ];

  return (
    <>
      <IndexNavbar />

      <div style={pageWrapper}>
        {/* Nouveau fond ajouté ici */}
        <img
           src="https://www.millim.tn/media/uploads/2023/07/26/stb.webp"
          alt="background"
          style={backgroundImageStyle}
        />

        <div style={glassCard}>
          <h1 style={titleStyle}>📋 Mes Tickets</h1>

          <div style={ticketListStyle}>
            {tickets.map((ticket) => (
              <div key={ticket.id} style={ticketItemStyle}>
                <div style={ticketHeaderStyle}>
                  <h3 style={{ margin: 0 }}>{ticket.sujet}</h3>
                  <span style={statusStyle(ticket.statut)}>{ticket.statut}</span>
                </div>
                <p style={ticketMetaStyle}>
                  🏢 {ticket.departement} | 📅 {ticket.date}
                </p>
                <button
                  style={detailButtonStyle}
                  onClick={() => setSelectedTicket(ticket)}
                >
                  🔍 Voir Détails
                </button>
              </div>
            ))}
          </div>

          {selectedTicket && (
            <div style={detailBoxStyle}>
              <h3 style={{ color: "#0d47a1" }}>🎫 Détails du ticket</h3>
              <p><strong>Sujet :</strong> {selectedTicket.sujet}</p>
              <p><strong>Département :</strong> {selectedTicket.departement}</p>
              <p><strong>Statut :</strong> {selectedTicket.statut}</p>
              <p><strong>Date :</strong> {selectedTicket.date}</p>
              <p><strong>Description :</strong> {selectedTicket.description}</p>
              <button onClick={() => setSelectedTicket(null)} style={closeButtonStyle}>
                ❌ Fermer
              </button>
            </div>
          )}
        </div>
      </div>

      <Footerr />
    </>
  );
}

// 🎨 Styles améliorés
const pageWrapper = {
  fontFamily: "'Segoe UI', sans-serif",
  minHeight: "100vh",
  position: "relative",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "4rem 2rem",
  overflow: "hidden",
};

const backgroundImageStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",

};

const glassCard = {
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(10px)",
  borderRadius: "24px",
  padding: "2rem", // Réduire la taille du padding
  maxWidth: "900px", // Réduire la largeur à 900px
  width: "100%",
  boxShadow: "0 12px 30px rgba(0, 0, 0, 0.25)",
};

const titleStyle = {
  fontSize: "2.5rem",
  fontWeight: "800",
  color: "#0d47a1",
  marginBottom: "2.5rem",
  textAlign: "center",
};

const ticketListStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "1.8rem",
};

const ticketItemStyle = {
  background: "#ffffff",
  padding: "1.5rem",
  borderRadius: "16px",
  borderLeft: "6px solid #0d47a1",
  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
  transition: "transform 0.2s ease",
};

const ticketHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const ticketMetaStyle = {
  marginTop: "0.5rem",
  color: "#555",
  fontSize: "0.95rem",
};

const statusStyle = (statut) => {
  let color;
  switch (statut) {
    case "Ouvert":
      color = "#ff9800";
      break;
    case "En cours":
      color = "#2196f3";
      break;
    case "Résolu":
      color = "#4caf50";
      break;
    default:
      color = "#999";
  }
  return {
    padding: "0.4rem 0.8rem",
    backgroundColor: color,
    color: "#fff",
    borderRadius: "8px",
    fontSize: "0.8rem",
    fontWeight: "600",
  };
};

const detailButtonStyle = {
  marginTop: "1rem",
  padding: "0.6rem 1.2rem",
  backgroundColor: "#0d47a1",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontWeight: "600",
  fontSize: "0.9rem",
  cursor: "pointer",
  transition: "background 0.3s ease",
};

const detailBoxStyle = {
  marginTop: "2rem",
  background: "#f5f5f5",
  padding: "1.5rem 2rem",
  borderRadius: "16px",
  boxShadow: "0 6px 14px rgba(0, 0, 0, 0.1)",
};

const closeButtonStyle = {
  marginTop: "1rem",
  padding: "0.5rem 1rem",
  backgroundColor: "#f44336",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "600",
};

export default MyTickets;
