import React, { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import fr from 'date-fns/locale/fr';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = { 'fr': fr };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const Calender = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem('jwt_token'); // Récupère le token JWT stocké

        const response = await fetch('/allticketstec', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error('Erreur réseau');

        const tickets = await response.json();

        const formattedEvents = tickets.map(ticket => {
          // Utilise le champ 'date' comme date de début
          const [day, month, year] = ticket.date.split('/');
          const startDate = new Date(`${year}-${month}-${day}T09:00:00`);
          const endDate = new Date(startDate);
          endDate.setHours(endDate.getHours() + 1); // Durée de 1 heure

          return {
            title: ticket.sujet,
            start: startDate,
            end: endDate,
            statut: ticket.statut.toLowerCase(),
            description: ticket.description,
            type: ticket.type,
            urgence: ticket.urgence
          };
        });

        setEvents(formattedEvents);
      } catch (error) {
        console.error('Erreur:', error);
      }
    };

    fetchTickets();
  }, []);

  const eventStyleGetter = (event) => {
    let backgroundColor = '#3174ad';
    if (event.statut === 'ouvert') backgroundColor = '#e74c3c';
    if (event.statut === 'en cours') backgroundColor = '#f39c12';
    if (event.statut === 'fermé') backgroundColor = '#27ae60';

    return {
      style: {
        backgroundColor,
        color: 'white',
        borderRadius: '5px',
        border: 'none',
        padding: '2px 5px',
        fontSize: '0.8em'
      }
    };
  };

  return (
    <div
      className="absolute top-10 left-0 right-0"
      style={{
        marginLeft: '40px',
        marginRight: '40px',
        marginBottom: '20px',
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        padding: '20px',
      }}
    >
      <h2 style={{ fontSize: '24px', color: '#2c3e50', marginBottom: '1rem' }}>
        📅 Calendrier des Tickets
      </h2>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 570 }}
        tooltipAccessor={(event) => `${event.title} (${event.type})`}
        eventPropGetter={eventStyleGetter}
      />
    </div>
  );
};

export default Calender;
