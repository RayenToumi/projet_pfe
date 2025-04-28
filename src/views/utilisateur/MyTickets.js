import React, { useState, useEffect } from "react";



function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [searchId, setSearchId] = useState("");

  const getShortCode = (id) => {
    const strId = String(id);
    if (!strId || strId.length < 10) return "XXXX";
    return strId.substring(6, 10); // index 6 inclus, 10 exclu
  };

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.minHeight = "100vh";
    document.body.style.display = "flex";
    document.body.style.flexDirection = "column";

    const fetchTickets = async () => {
      try {
        const response = await fetch('/alltickets');
        const data = await response.json();
        setTickets(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des tickets:", error);
      }
    };

    fetchTickets();
  }, []);

  const badgeStyle = (status) => {
    const statusNormalized = status?.toLowerCase() || ''; // Normalisation en minuscules
  
    return {
      padding: "0.25rem 0.5rem",
      borderRadius: "0px", // Bordure carrée
      fontSize: "0.75rem",
      fontWeight: "500",
      backgroundColor:
        statusNormalized === "ouvert" ? "#FEE2E2" : // Rouge clair pour "Ouvert"
        statusNormalized === "en cours" ? "#FFEDD5" : // Orange clair pour "En cours"
        statusNormalized === "fermé" ? "#DCFCE7" : // Vert clair pour "Fermé"
        "#FFFFFF", // Valeur par défaut si aucun statut ne correspond
      color:
        statusNormalized === "ouvert" ? "#DC2626" : // Rouge foncé pour "Ouvert"
        statusNormalized === "en cours" ? "#C2410C" : // Orange foncé pour "En cours"
        statusNormalized === "fermé" ? "#065F46" : // Vert foncé pour "Fermé"
        "#000000", // Valeur par défaut si aucun statut ne correspond
      textAlign: "center",
      minWidth: "80px",
      display: "inline-block",
      border: "1px solid", // Bordure de contraste
      borderColor:
        statusNormalized === "ouvert" ? "#DC2626" : // Rouge foncé pour "Ouvert"
        statusNormalized === "en cours" ? "#C2410C" : // Orange foncé pour "En cours"
        statusNormalized === "fermé" ? "#065F46" : // Vert foncé pour "Fermé"
        "#000000", // Valeur par défaut si aucun statut ne correspond
    };
  };
  
  
  

  const filteredTickets = tickets.filter(ticket =>
    searchId === "" || ticket._id?.toString().includes(searchId)
  );

  return (
    <>
    
      <div style={container}>
      <div style={contentWrapper}>
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
              {filteredTickets.map((ticket) => {
                console.log("TICKET:", ticket); // Pour debug
                return (
                  <div
                    key={ticket._id}
                    style={ticketItem}
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    <div style={ticketHeader}>
                      <span style={ticketId}>
                        {ticket._id ? `#${getShortCode(ticket._id)}` : "ID non disponible"}
                      </span>
                      <span style={badgeStyle(ticket.statut)}>{ticket.statut}</span>
                    </div>
                    <h3 style={ticketTitle}>{ticket.sujet}</h3>
                    <p style={ticketDate}>{ticket.date?.slice(0, 10)}</p>
                  </div>
                );
              })}
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
                    <span>#{getShortCode(selectedTicket._id)}</span>
                  </div>
                  <div style={detailRow}>
                    <span style={detailLabel}>Statut :</span>
                    <span style={badgeStyle(selectedTicket.statut)}>{selectedTicket.statut}</span>
                  </div>
                  <div style={detailRow}>
                    <span style={detailLabel}>Date :</span>
                    <span>{selectedTicket.date?.slice(0, 10)}</span>
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
   

    </>
  );
}

// Styles
const container = {
  minHeight: "100vh", // Prend toute la hauteur de l'écran
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  padding: "2rem",
  backgroundColor: "#f4f6f8",
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
  marginTop: "0.2rem",
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
