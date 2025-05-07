import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import IndexNavbar from "components/Navbars/IndexNavbar.js";
import Footerr from "components/Footers/Footerr";

function MyTickets() {
  
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [feedback, setFeedback] = useState({  commentaire: "" });
  const [submitted, setSubmitted] = useState(false);

  const getShortCode = (id) => {
    const strId = String(id);
    if (!strId || strId.length < 10) return "XXXX";
    return strId.substring(6, 10);
  };

  const handleSubmitFeedback = async () => {
    console.log("Feedback soumis :", {
      ticketId: selectedTicket._id,
      ...feedback,
    });
  
    try {
      // Récupérer le token JWT et l'ID de l'utilisateur si nécessaire
      const token = localStorage.getItem('jwt_token');
  
      // Faire la requête POST vers votre API pour ajouter le commentaire
      const response = await fetch('/addcom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ticketId: selectedTicket._id,  // Passer l'ID du ticket ici
          commentaire: feedback.commentaire,  // Passer le commentaire
        }),
      });
  
      if (response.ok) {
        // Si la requête réussit, mettre à jour l'état
        setSubmitted(true);
        setFeedback({ commentaire: "" });  // Réinitialiser le champ commentaire
       
      } else {
        const errorData = await response.json();
        alert(`Erreur : ${errorData.message}`);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du commentaire :", error);
      alert("Une erreur est survenue lors de l'envoi de votre commentaire.");
    }
  };
  
  

    

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.minHeight = "100vh";
    document.body.style.display = "flex";
    document.body.style.flexDirection = "column";
  
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        const user = JSON.parse(localStorage.getItem('user')); 
        
        const response = await fetch(`/user/${user._id}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        const data = await response.json();
        setTickets(data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
        // Fallback vers le localStorage
        const localTickets = JSON.parse(localStorage.getItem("tickets")) || [];
        setTickets(localTickets);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);
  
 
  
  
  

  const badgeStyle = (status) => {
    const statusNormalized = status?.toLowerCase() || "";
    return {
      padding: "0.25rem 0.5rem",
      borderRadius: "0px",
      fontSize: "0.75rem",
      fontWeight: "500",
      backgroundColor:
        statusNormalized === "ouvert"
          ? "#FEE2E2"
          : statusNormalized === "en cours"
          ? "#FFEDD5"
          : statusNormalized === "fermé"
          ? "#DCFCE7"
          : "#FFFFFF",
      color:
        statusNormalized === "ouvert"
          ? "#DC2626"
          : statusNormalized === "en cours"
          ? "#C2410C"
          : statusNormalized === "fermé"
          ? "#065F46"
          : "#000000",
      textAlign: "center",
      minWidth: "80px",
      display: "inline-block",
      border: "1px solid",
      borderColor:
        statusNormalized === "ouvert"
          ? "#DC2626"
          : statusNormalized === "en cours"
          ? "#C2410C"
          : statusNormalized === "fermé"
          ? "#065F46"
          : "#000000",
    };
  };

  const filteredTickets = tickets.filter(
    (ticket) => searchId === "" || ticket._id?.toString().includes(searchId)
  );

  return (
    <>
      <IndexNavbar />
      <div style={container}>
        <div style={contentWrapper}>
         
          <h1 style={title}>Espace Support Client</h1>
          <p style={subtitle}>Consultez vos tickets et suivez leur avancement</p>

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
                fontSize: "1rem",
              }}
            />
          </div>

          <div style={ticketGrid}>
            <div style={ticketList}>
              {filteredTickets.map((ticket) => (
                <div
                  key={ticket._id}
                  style={ticketItem}
                  onClick={() => {
                    setSelectedTicket(ticket);
                    setSubmitted(false);
                    setFeedback({ 
                       commentaire: "" });
                  }}
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
              ))}
              {filteredTickets.length === 0 && (
                <p style={{ textAlign: "center", color: "#999" }}>Aucun ticket trouvé.</p>
              )}
            </div>

            {selectedTicket && (
              <div style={detailsPanel}>
                <div style={detailsHeader}>
                  <h2 style={detailsTitle}>Détails du ticket</h2>
                  <button style={closeButton} onClick={() => setSelectedTicket(null)}>
                    ×
                  </button>
                </div>
                <div style={detailsContent}>
                  <div style={detailRow}>
                    <span style={detailLabel}>Numéro :</span>
                    <span>#{getShortCode(selectedTicket._id)}</span>
                  </div>
                  <div style={detailRow}>
                    <span style={detailLabel}>Statut :</span>
                    <span style={badgeStyle(selectedTicket.statut)}>
                      {selectedTicket.statut}
                    </span>
                  </div>
                  <div style={detailRow}>
                    <span style={detailLabel}>Date :</span>
                    <span>{selectedTicket.date?.slice(0, 10)}</span>
                  </div>
                  <div style={detailDescription}>
                    <p style={detailLabel}>Description :</p>
                    <p>{selectedTicket.description}</p>
                  </div>

                  {/* Évaluation si ticket fermé */}
                  {selectedTicket.statut?.toLowerCase() === "fermé" && (
                    <div
                      style={{
                        marginTop: "2rem",
                        borderTop: "1px solid #ddd",
                        paddingTop: "1rem",
                      }}
                    >
                      <h4
                        style={{
                          fontSize: "1.1rem",
                          marginBottom: "0.5rem",
                          color: "#1a237e",
                        }}
                      >
                        Évaluez l’intervention :
                      </h4>

                      {submitted ? (
                        <p style={{ color: "green" }}>Merci pour votre retour !</p>
                      ) : (
                        <>
                          

                          <div style={{ marginBottom: "1rem" }}>
                            <label
                              style={{
                                fontWeight: "bold",
                                display: "block",
                                marginBottom: "0.5rem",
                              }}
                            >
                              Commentaire :
                            </label>
                            <textarea
                              rows="3"
                              value={feedback.commentaire}
                              onChange={(e) =>
                                setFeedback({ ...feedback, commentaire: e.target.value })
                              }
                              style={{
                                width: "100%",
                                borderRadius: "4px",
                                border: "1px solid #ccc",
                                padding: "0.5rem",
                                resize: "vertical",
                              }}
                            />
                          </div>

                          <button
                            onClick={handleSubmitFeedback}
                            style={{
                              backgroundColor: "#1a237e",
                              color: "#fff",
                              border: "none",
                              borderRadius: "4px",
                              padding: "0.5rem 1rem",
                              cursor: "pointer",
                            }}
                          >
                            Envoyer
                          </button>
                        </>
                      )}
                    </div>
                  )}
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

// Styles (inchangés)
const container = {
  minHeight: "100vh",
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  padding: "2rem",
  backgroundColor: "#f4f6f8",
};

const contentWrapper = { width: "100%", maxWidth: "800px" };

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
  letterSpacing: "1px",
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
  transition: "all 0.3s",
};
const ticketHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "0.5rem",
};
const ticketId = { color: "#666", fontSize: "0.9rem" };
const ticketTitle = { fontSize: "1.1rem", color: "#333", margin: "0 0 0.5rem 0" };
const ticketDate = { color: "#999", fontSize: "0.85rem", margin: "0" };
const detailsPanel = {
  backgroundColor: "white",
  borderRadius: "8px",
  padding: "1.5rem",
  border: "1px solid #eee",
};
const detailsHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "1.5rem",
};
const detailsTitle = { fontSize: "1.5rem", color: "#1a237e", margin: "0" };
const closeButton = {
  background: "none",
  border: "none",
  fontSize: "1.5rem",
  color: "#666",
  cursor: "pointer",
  padding: "0 0.5rem",
};
const detailsContent = { lineHeight: "1.6" };
const detailRow = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "1rem",
  paddingBottom: "1rem",
  borderBottom: "1px solid #eee",
};
const detailLabel = { color: "#666", fontWeight: "bold", marginRight: "1rem" };
const detailDescription = { marginTop: "2rem" };

export default MyTickets;