import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';

export default function Navbar() {
  return (
    <nav className="top-0 fixed z-50 w-full flex flex-wrap items-center justify-between px-2 py-3 navbar-expand-lg bg-white shadow-lg border-b border-blue-100">
      <style jsx>{`
        .gp-btn {
          padding: 0.5rem 1.25rem; /* Taille réduite */
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          border: none;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          position: relative;
          overflow: hidden;
          font-size: 0.875rem; /* Taille de police réduite */
        }

        .gp-btn:hover {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          transform: translateY(-1px);
        }

        .gp-btn:active {
          transform: translateY(1px);
          box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .gp-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            120deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .gp-btn:hover::before {
          left: 100%;
        }
          .gp-btn .icon-space {
          margin-right: 6px;
        }
      `}</style>

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
        <Link
            to="/login"
            className="gp-btn gp-btn-save"
          >
            <FontAwesomeIcon 
              icon={faSignInAlt} 
              className="icon-space"
              style={{ color: 'white', fontSize: '0.875rem' }} 
            />
            Se connecter
          </Link>
        </div>
      </div>
    </nav>
  );
}