import React, { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import fr from 'date-fns/locale/fr';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = { 'fr': fr };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

const Calender = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const tickets = JSON.parse(localStorage.getItem("tickets")) || [];
    const formatted = tickets.map(ticket => ({
      title: ticket.sujet,
      start: new Date(ticket.start),
      end: new Date(ticket.end),
      type: ticket.type,
    }));
    setEvents(formatted);
  }, []);

  const eventStyleGetter = (event) => {
    let backgroundColor = '#3174ad';
    if (event.type === 'Urgent') backgroundColor = '#e74c3c';
    if (event.type === 'Normal') backgroundColor = '#f39c12';
    if (event.type === 'Faible') backgroundColor = '#27ae60';

    return {
      style: {
        backgroundColor,
        color: 'white',
        borderRadius: '6px',
        padding: '4px',
        fontSize: '14px',
      },
    };
  };

  return (
    <div style={{ padding: '2rem', backgroundColor: '#f4f6f9', minHeight: '100vh' }}>
      <h2 style={{ fontSize: '24px', color: '#2c3e50', marginBottom: '1rem' }}>📅 Calendrier des Tickets</h2>
      <div style={{ backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '20px' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          tooltipAccessor={event => `${event.title} (${event.type})`}
          eventPropGetter={eventStyleGetter}
        />
      </div>
    </div>
  );
};

export default Calender;
