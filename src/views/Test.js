import React from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";

// Localisation pour la bibliothèque date-fns
const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Événements de test : tickets bancaires STB
const events = [
  {
    title: "Réclamation - Carte bloquée",
    type: "Réclamation",
    start: new Date(2025, 3, 10, 10, 0),
    end: new Date(2025, 3, 10, 12, 0),
  },
  {
    title: "Demande info - Crédit logement",
    type: "Demande",
    start: new Date(2025, 3, 12, 9, 0),
    end: new Date(2025, 3, 12, 11, 0),
  },
  {
    title: "Réclamation - Virement non reçu",
    type: "Réclamation",
    start: new Date(2025, 3, 15, 14, 0),
    end: new Date(2025, 3, 15, 15, 30),
  },
];

// Couleurs personnalisées selon le type de ticket
const eventStyleGetter = (event) => {
  let backgroundColor = "#3174ad"; // couleur par défaut
  if (event.type === "Réclamation") backgroundColor = "#e74c3c";
  if (event.type === "Demande") backgroundColor = "#27ae60";

  return {
    style: {
      backgroundColor,
      color: "white",
      borderRadius: "6px",
      border: "none",
      padding: "4px",
      fontSize: "14px",
    },
  };
};

const Calender = () => {
  return (
    <div
      style={{
        height: "100%",
        padding: "20px",
        fontFamily: "Segoe UI, sans-serif",
        backgroundColor: "#f4f6f9",
      }}
    >
      <h2 style={{ fontSize: "24px", marginBottom: "20px", color: "#2c3e50" }}>
        📅 Calendrier des Tickets STB
      </h2>
      <div
        style={{
          backgroundColor: "#fff",
          padding: "15px",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          tooltipAccessor={(event) => `${event.title} (${event.type})`}
          eventPropGetter={eventStyleGetter}
          style={{ height: 600 }}
        />
      </div>
    </div>
  );
};

export default Calender;
