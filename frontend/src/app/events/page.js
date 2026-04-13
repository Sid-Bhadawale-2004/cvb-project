'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const API = 'http://localhost:5000/api';

export default function EventsPage() {
  const router = useRouter();
  const [events,     setEvents]     = useState([]);
  const [alert,      setAlert]      = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [regLoading, setRegLoading] = useState({});

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    try {
      const res  = await fetch(`${API}/events`);
      const data = await res.json();
      setEvents(data);
    } catch {
      setAlert({ type:'error', msg:'Could not load events. Is backend running?' });
    } finally {
      setLoading(false);
    }
  }

  async function registerEvent(eventId) {
    const token = localStorage.getItem('token');
    if (!token) {
      setAlert({ type:'error', msg:'Please login first to register for events!' });
      setTimeout(() => router.push('/login'), 1500);
      return;
    }

    setRegLoading(prev => ({ ...prev, [eventId]: true }));
    setAlert(null);

    try {
      const res  = await fetch(`${API}/registrations`, {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ eventId }),
      });
      const data = await res.json();
      if (res.ok) {
        setAlert({ type:'success', msg:'Successfully registered for the event! Check My Profile to see it.' });
        loadEvents(); // Refresh slot count
      } else {
        setAlert({ type:'error', msg: data.message });
      }
    } catch {
      setAlert({ type:'error', msg:'Server error. Please try again.' });
    } finally {
      setRegLoading(prev => ({ ...prev, [eventId]: false }));
    }
  }

  if (loading) return <div className="loading">Loading events...</div>;

  return (
    <div className="container">
      <div className="page-header">
        <h1>Upcoming Events</h1>
        <p>Browse and register for volunteering events in your community</p>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type}`}>{alert.msg}</div>
      )}

      {events.length === 0 ? (
        <div className="empty">
          No upcoming events at the moment. Check back soon!
        </div>
      ) : (
        <div className="events-grid">
          {events.map(event => {
            const pct  = Math.round((event.currentParticipants / event.maxParticipants) * 100);
            const full = event.currentParticipants >= event.maxParticipants;
            return (
              <div className="event-card" key={event._id}>
                <h3>{event.title}</h3>
                <div className="event-meta">
                  <span>📅 {new Date(event.date).toLocaleDateString('en-IN', {
                    day:'numeric', month:'long', year:'numeric'
                  })}</span>
                  <span>📍 {event.location}</span>
                  <span>👥 {event.currentParticipants} / {event.maxParticipants} registered</span>
                </div>
                <div className="slots-bar">
                  <div className="slots-fill" style={{ width:`${pct}%` }} />
                </div>
                <p className="event-desc">{event.description}</p>
                <button
                  className="btn-register"
                  onClick={() => registerEvent(event._id)}
                  disabled={full || regLoading[event._id]}
                >
                  {regLoading[event._id]
                    ? 'Registering...'
                    : full
                    ? 'Event Full'
                    : 'Register Now'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
