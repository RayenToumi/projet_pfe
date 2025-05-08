import React from 'react';

const PowerBIDashboard = () => {
  // Styles pour le composant
  const styles = {
    container: {
      width: '100%',
      height: '100vh', // hauteur pleine
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f5f7fa',
      fontFamily: 'Arial, sans-serif'
    },
    header: {
      textAlign: 'center',
      padding: '20px 0',
      backgroundColor: '#ffffff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    title: {
      fontSize: '24px',
      fontWeight: '600',
      color: '#3b82f6',
      marginBottom: '2px'
    },
    divider: {
      width: '120px',
      height: '4px',
      backgroundColor: '#3b82f6',
      margin: '8px auto'
    },
    dashboardContainer: {
      flex: '1',
      padding: '20px',
      marginTop: '30px', // <-- espace ajouté au-dessus de l’iframe
      backgroundColor: '#f5f7fa'
    },
    iframe: {
      width: '100%',
      height: '100%',
      border: 'none',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }
  };

  // URL de votre rapport Power BI
  const powerBiUrl = "https://app.powerbi.com/reportEmbed?reportId=f7a7df31-5087-43e4-aa18-2db86a75abde&autoAuth=true&ctid=dbd6664d-4eb9-46eb-99d8-5c43ba153c61";

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Dashboard Avances sur Salaire</h1>
        <div style={styles.divider}></div>
      </div>

      <div style={styles.dashboardContainer}>
        <iframe 
          title="pfeubcirh" 
          style={styles.iframe}
          src={powerBiUrl}
          allowFullScreen={true}
        ></iframe>
      </div>
    </div>
  );
};

export default PowerBIDashboard;
