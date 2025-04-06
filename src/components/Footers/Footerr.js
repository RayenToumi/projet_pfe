import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";
import logo from "assets/img/logo stb.png"; // Assure-toi que ce chemin est correct

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <img src={logo} alt="STB Logo" style={styles.logo} />
        <p style={styles.copy}>
          © {new Date().getFullYear()} Stb Banque
        </p>
        <div style={styles.socialIcons}>
          <a href="#" style={styles.icon}><FaFacebookF /></a>
          <a href="#" style={styles.icon}><FaInstagram /></a>
          <a href="#" style={styles.icon}><FaTwitter /></a>
          <a href="#" style={styles.icon}><FaLinkedinIn /></a>
        </div>
      </div>
    </footer>
  );
}

// Styles mini-mini
const styles = {
  footer: {
    backgroundColor: "#f3f4f6",
    padding: "1rem 0.5rem", // ↘️ Très petit padding
    borderTop: "2px solid #0d47a1",
    fontSize: "0.8rem",
  },
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.4rem",
  },
  logo: {
    width: "40px", // ↘️ Logo réduit au minimum
    height: "auto",
  },
  copy: {
    color: "#475569",
    margin: "0.2rem 0",
  },
  socialIcons: {
    display: "flex",
    gap: "0.5rem",
    justifyContent: "center",
  },
  icon: {
    backgroundColor: "#e0e7ff",
    color: "#0d47a1",
    borderRadius: "50%",
    width: "28px", // ↘️ Très petite icône
    height: "28px",
    fontSize: "0.9rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
  },
};
