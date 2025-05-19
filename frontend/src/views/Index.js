import React, { useState } from "react";
import VisiteurNavbar from "components/Navbars/IndexNavbar";
import Footer from "components/Footers/Footerr";
import { Link } from "react-router-dom";

function HomepageVisiteur() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div style={containerStyle}>
      <VisiteurNavbar />

      <div style={heroStyle}>
        <div style={heroContentStyle}>
          <div style={textContainerStyle}>
            <h2 style={titleStyle}>STB Gestion des tickets</h2>
            <p style={subtitleStyle}>
              Bienvenue sur la plateforme de gestion des tickets de la STB, un
              outil centralisé, sécurisé et performant permettant de gérer
              efficacement l’ensemble des demandes, incidents et interventions
              au sein de l’organisation.
            </p>
            <div style={buttonGroupStyle}>
              <Link to="/Ticket">
                <button
                  style={{
                    ...primaryButtonStyle,
                    ...(isHovered ? primaryButtonHoverStyle : {}),
                  }}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  Commencer maintenant
                </button>
              </Link>
            </div>
          </div>
          <img
            src="https://www.millim.tn/media/uploads/2023/07/26/stb.webp"
            alt="Interface de gestion"
            style={imageStyle}
          />
        </div>
      </div>

      <section style={featuresStyle} id="features">
        <h3 style={sectionTitleStyle}>Fonctionnalités clés</h3>
        <div style={cardsContainerStyle}>
          <div style={featureCardStyle}>
            <h4 style={featureTitleStyle}>🎯 Suivi en temps réel</h4>
            <p>Consultez en temps réel le statut de chaque ticket.</p>
          </div>
          <div style={featureCardStyle}>
            <h4 style={featureTitleStyle}>🤝 Collaboration d'équipe</h4>
            <p>Attribuez les tickets et collaborez facilement avec vos collègues.</p>
          </div>
          <div style={featureCardStyle}>
            <h4 style={featureTitleStyle}>📊 Analytics avancés</h4>
            <p>Accédez à des statistiques claires et détaillées pour un meilleur suivi des tickets.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// 🔽 Styles

const containerStyle = {
  minHeight: "100vh",
  backgroundColor: "#f8f9fa",
};

const heroStyle = {
  padding: "4rem 2rem",
  backgroundColor: "#ffffff",
  marginTop: "50px",
};

const heroContentStyle = {
  maxWidth: "1200px",
  margin: "0 auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "4rem",
  flexWrap: "wrap",
};

const textContainerStyle = { flex: 1 };

const titleStyle = {
  fontSize: "2.5rem",
  color: "#2d3436",
  marginBottom: "1rem",
};

const subtitleStyle = {
  fontSize: "1.2rem",
  color: "#636e72",
  marginBottom: "2rem",
};

const buttonGroupStyle = {
  display: "flex",
  justifyContent: "flex-start",
  marginTop: "1rem",
};

const primaryButtonStyle = {
  padding: "0.8rem 2rem",
  backgroundColor: "#005baa", // Bleu institutionnel
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "1rem",
  fontWeight: "500",
};

const primaryButtonHoverStyle = {
  backgroundColor: "#004080",
};

const imageStyle = {
  flex: 1,
  maxWidth: "600px",
  borderRadius: "12px",
  boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
};

const featuresStyle = {
  padding: "4rem 2rem",
  maxWidth: "1200px",
  margin: "0 auto",
};

const sectionTitleStyle = {
  textAlign: "center",
  fontSize: "2rem",
  marginBottom: "3rem",
  color: "#2d3436",
};

const cardsContainerStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "2rem",
};

const featureCardStyle = {
  backgroundColor: "white",
  padding: "2rem",
  borderRadius: "12px",
  boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
  textAlign: "center",
};

const featureTitleStyle = {
  fontSize: "1.25rem",
  margin: "1rem 0",
  color: "#2d3436",
};

export default HomepageVisiteur;
