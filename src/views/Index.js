import React from "react";
import IndexNavbar from "components/Navbars/IndexNavbar.js";
import Footer from "components/Footers/Footer"; // Importez votre Footer ici
import { Link } from "react-router-dom";

function Index() {
  return (
    <div style={containerStyle}>
      <IndexNavbar />

      <div style={heroStyle}>
        <div style={heroContentStyle}>
          <div style={textContainerStyle}>
            <h2 style={titleStyle}>Stb Gestion des tickets</h2>
            <p style={subtitleStyle}>
            Bienvenue sur la plateforme de gestion des tickets de la STB - un espace sécurisé, rapide et efficace pour suivre, gérer et résoudre toutes vos demandes en toute simplicité.
            </p>
            <div style={buttonGroupStyle}>
            <Link to="Ticket">
          <button style={primaryButtonStyle}>Commencer maintenant</button>
            </Link>
              <button style={secondaryButtonStyle}>Voir la vidéo</button>
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
            <p>Surveillez l'état de chaque ticket instantanément</p>
          </div>
          <div style={featureCardStyle}>
            <h4 style={featureTitleStyle}>🤝 Collaboration d'équipe</h4>
            <p>Assignez et partagez les tickets entre collègues</p>
          </div>
          <div style={featureCardStyle}>
            <h4 style={featureTitleStyle}>📊 Analytics avancés</h4>
            <p>Statistiques détaillées et rapports personnalisés</p>
          </div>
        </div>
      </section>
      <Footer/>
    </div>
  );
}

// 🔽 COPIE LES STYLES ICI
const containerStyle = {
  minHeight: '100vh',
  backgroundColor: '#f8f9fa'
};

const heroStyle = {
  padding: '4rem 2rem',
  backgroundColor: '#ffffff',
  marginTop: '50px', // Ajoute un espace en haut pour descendre la section
};


const heroContentStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  display: 'flex',
  alignItems: 'center',
  gap: '4rem'
};

const textContainerStyle = { flex: 1 };

const titleStyle = {
  fontSize: '2.5rem',
  color: '#2d3436',
  marginBottom: '1rem'
};

const subtitleStyle = {
  fontSize: '1.2rem',
  color: '#636e72',
  marginBottom: '2rem'
};

const buttonGroupStyle = {
  display: 'flex',
  gap: '1rem'
};

const primaryButtonStyle = {
  padding: '1rem 2rem',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '1rem'
};

const secondaryButtonStyle = {
  padding: '1rem 2rem',
  backgroundColor: 'transparent',
  color: '#007bff',
  border: '2px solid #007bff',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '1rem'
};

const imageStyle = {
  flex: 1,
  maxWidth: '600px',
  borderRadius: '12px',
  boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
};

const featuresStyle = {
  padding: '4rem 2rem',
  maxWidth: '1200px',
  margin: '0 auto'
};

const sectionTitleStyle = {
  textAlign: 'center',
  fontSize: '2rem',
  marginBottom: '3rem',
  color: '#2d3436'
};

const cardsContainerStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '2rem'
};

const featureCardStyle = {
  backgroundColor: 'white',
  padding: '2rem',
  borderRadius: '12px',
  boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
  textAlign: 'center'
};

const featureTitleStyle = {
  fontSize: '1.25rem',
  margin: '1rem 0',
  color: '#2d3436'
};

export default Index;
