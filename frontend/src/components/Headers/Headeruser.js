import React from 'react';
import { FaUserCircle } from 'react-icons/fa'; // npm install react-icons

function Headeruser() {
  return (
    <div
      style={{
        width: '100%',
        height: '370px', // augmenté de 320 à 400px
        background: 'linear-gradient(to right, #e0eafc, #cfdef3)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        color: '#1f2937',
        textAlign: 'center',
        borderBottom: '2px solid #d1d9e6',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
        fontFamily: 'Segoe UI, Roboto, sans-serif',
        padding: '20px',
      }}
    >
      <FaUserCircle size={80} color="#3b82f6" style={{ marginBottom: '10px' }} />
      <h1 style={{ margin: 0, fontSize: '2.8rem', fontWeight: '700' }}>
        Espace Personnel
      </h1>
    </div>
  );
}

export default Headeruser;