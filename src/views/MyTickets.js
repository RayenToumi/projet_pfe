import React, { useState, useEffect } from "react";
import IndexNavbar from "components/Navbars/IndexNavbar.js";
import Footerr from "components/Footers/Footerr";

function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [searchId, setSearchId] = useState(""); // État pour la recherche

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.minHeight = "100vh";
    document.body.style.display = "flex";
    document.body.style.flexDirection = "column";

    const storedTickets = JSON.parse(localStorage.getItem("tickets")) || [];
    setTickets(storedTickets);
  }, []);


  const status = (statut) => ({
    padding: "0.3rem 0.8rem",
    borderRadius: "4px",
    fontSize: "0.85rem",
    backgroundColor: {
      "Ouvert": "#ffebee",
      "En cours": "#e3f2fd",
      "Résolu": "#e8f5e9",
    }[statut],
    color: {
      "Ouvert": "#c62828",
      "En cours": "#1565c0",
      "Résolu": "#2e7d32",
    }[statut],
    fontWeight: "bold",
  });

  const filteredTickets = tickets.filter(ticket =>
    searchId === "" || ticket.id.toString().includes(searchId)
  );

  return (
    <>
      <IndexNavbar />
      <div style={container}>
        <div style={contentWrapper}>
          <img 
            src="/images/support-banner.jpg" 
            alt="Bannière Support"
            style={bannerImage}
          />
          <h1 style={title}>Espace Support Client</h1>
          <p style={subtitle}>Consultez vos tickets et suivez leur avancement</p>

          {/* Champ de recherche */}
          <div style={{ marginBottom: "1rem", textAlign: "center" }}>
            <input
              type="text"
              placeholder="Rechercher par numéro de ticket"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              style={{
                padding: "0.5rem",
                width: "60%",
                maxWidth: "300px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                fontSize: "1rem"
              }}
            />
          </div>

          <div style={ticketGrid}>
            <div style={ticketList}>
              {filteredTickets.map((ticket) => (
                <div 
                  key={ticket.id}
                  style={ticketItem} 
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <div style={ticketHeader}>
                    <span style={ticketId}>#{ticket.id}</span>
                    <span style={status(ticket.statut)}>{ticket.statut}</span>
                  </div>
                  <h3 style={ticketTitle}>{ticket.sujet}</h3>
                  <p style={ticketDate}>{ticket.date}</p>
                </div>
              ))}
              {filteredTickets.length === 0 && (
                <p style={{ textAlign: "center", color: "#999" }}>Aucun ticket trouvé.</p>
              )}
            </div>

            {selectedTicket && (
              <div style={detailsPanel}>
                <div style={detailsHeader}>
                  <h2 style={detailsTitle}>Détails du ticket</h2>
                  <button style={closeButton} onClick={() => setSelectedTicket(null)}>×</button>
                </div>
                <div style={detailsContent}>
                  <div style={detailRow}>
                    <span style={detailLabel}>Numéro :</span>
                    <span>#{selectedTicket.id}</span>
                  </div>
                  <div style={detailRow}>
                    <span style={detailLabel}>Statut :</span>
                    <span style={status(selectedTicket.statut)}>{selectedTicket.statut}</span>
                  </div>
                  <div style={detailRow}>
                    <span style={detailLabel}>Date :</span>
                    <span>{selectedTicket.date}</span>
                  </div>
                  <div style={detailDescription}>
                    <p style={detailLabel}>Description :</p>
                    <p>{selectedTicket.description}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footerr />
    </>
  );
}

// Styles
const container = {
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "2rem",
  backgroundColor: "#f4f6f8"
};
const contentWrapper = { width: "100%", maxWidth: "800px" };
const bannerImage = {
  width: "100%",
  maxHeight: "200px",
  borderRadius: "12px",
  objectFit: "cover",
  marginBottom: "1rem",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
};
const title = {
  color: "#1a237e",
  fontSize: "2.5rem",
  textAlign: "center",
  marginBottom: "1rem",
  marginTop: "4rem",
  fontWeight: "bold",
  textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
  borderBottom: "3px solid #c5cae9",
  paddingBottom: "0.5rem",
  letterSpacing: "1px"
};
const subtitle = { textAlign: "center", color: "#555", marginBottom: "2rem" };
const ticketGrid = { display: "grid", gap: "2rem", gridTemplateColumns: "1fr" };
const ticketList = { backgroundColor: "#f8f9fa", borderRadius: "8px", padding: "1rem" };
const ticketItem = {
  backgroundColor: "white",
  borderRadius: "6px",
  padding: "1rem",
  marginBottom: "1rem",
  cursor: "pointer",
  border: "1px solid #eee",
  transition: "all 0.3s"
};
const ticketHeader = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" };
const ticketId = { color: "#666", fontSize: "0.9rem" };
const ticketTitle = { fontSize: "1.1rem", color: "#333", margin: "0 0 0.5rem 0" };
const ticketDate = { color: "#999", fontSize: "0.85rem", margin: "0" };
const detailsPanel = { backgroundColor: "white", borderRadius: "8px", padding: "1.5rem", border: "1px solid #eee" };
const detailsHeader = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" };
const detailsTitle = { fontSize: "1.5rem", color: "#1a237e", margin: "0" };
const closeButton = {
  background: "none",
  border: "none",
  fontSize: "1.5rem",
  color: "#666",
  cursor: "pointer",
  padding: "0 0.5rem"
};
const detailsContent = { lineHeight: "1.6" };
const detailRow = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "1rem",
  paddingBottom: "1rem",
  borderBottom: "1px solid #eee"
};
const detailLabel = { color: "#666", fontWeight: "bold", marginRight: "1rem" };
const detailDescription = { marginTop: "2rem" };

export default MyTickets;
