import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';

export default function Navbar() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <nav className="top-0 fixed z-50 w-full flex flex-wrap items-center justify-between px-2 py-3 navbar-expand-lg bg-white shadow-lg border-b border-blue-100">
      <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link
            to="/homepagevisiteur"
            className="text-blueGray-700 text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase"
          >
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/0/06/Logo_STB.png" 
              alt="STB Logo" 
              style={{ height: '50px', width: '150px' }} 
            />
          </Link>
        </div>

        {/* Bouton Se connecter */}
        <div className="flex items-center gap-4">
          <Link to="/login">
            <button
              style={{
                ...smallButtonStyle,
                ...(isHovered ? smallButtonHoverStyle : {}),
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <FontAwesomeIcon 
                icon={faSignInAlt} 
                style={{ marginRight: "6px", fontSize: "0.85rem" }} 
              />
              Se connecter
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

// ✅ Styles réduits
const smallButtonStyle = {
  padding: "0.5rem 1.2rem", // réduit
  backgroundColor: "#005baa",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "0.875rem", // plus petit
  fontWeight: "500",
  display: "flex",
  alignItems: "center",
};

const smallButtonHoverStyle = {
  backgroundColor: "#004080",
};
