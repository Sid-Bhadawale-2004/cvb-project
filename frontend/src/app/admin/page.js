'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const API = 'http://localhost:5000/api';

export default function AdminPage() {
  const router = useRouter();

  const [eventForm, setEventForm] = useState({
    title:'', description:'', date:'', location:'', maxParticipants:''
  });
  const [attend,      setAttend]      = useState({ userId:'', eventId:'' });
  const [events,      setEvents]      = useState([]);
  const [eventAlert,  setEventAlert]  = useState(null);
  const [attendAlert, setAttendAlert] = useState(null);
  const [eLoading,    setELoading]    = useState(false);
  const [aLoading,    setALoading]    = useState(false);

  useEffect(() => {
    const user  = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    if (!token || user.role !== 'admin') {
      router.push('/login');
      return;
    }
    loadAllEvents();
  }, []);

  async function loadAllEvents() {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API}/events/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents(await res.json());
    } catch (e) { console.error(e); }
  }

  function onEventChange(e) {
    setEventForm({ ...eventForm, [e.target.name]: e.target.value });
  }

  async function createEvent() {
    const token = localStorage.getItem('token');
    const { title, description, date, location, maxParticipants } = eventForm;
    if (!title || !description || !date || !location || !maxParticipants) {
      return setEventAlert({ type:'error', msg:'All fields are required' });
    }
    setELoading(true); setEventAlert(null);
    try {
      const res  = await fetch(`${API}/events`, {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ ...eventForm, maxParticipants: Number(maxParticipants) }),
      });
      const data = await res.json();
      if (res.ok) {
        setEventAlert({ type:'success', msg:'Event created successfully!' });
        setEventForm({ title:'', description:'', date:'', location:'', maxParticipants:'' });
        loadAllEvents();
      } else {
        setEventAlert({ type:'error', msg: data.message });
      }
    } catch {
      setEventAlert({ type:'error', msg:'Server error!' });
    } finally { setELoading(false); }
  }

  async function markAttendance() {
    const token = localStorage.getItem('token');
    if (!attend.userId || !attend.eventId) {
      return setAttendAlert({ type:'error', msg:'Both User ID and Event ID are required' });
    }
    setALoading(true); setAttendAlert(null);
    try {
      const res  = await fetch(`${API}/registrations/attend`, {
        method:  'PUT',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(attend),
      });
      const data = await res.json();
      if (res.ok) {
        setAttendAlert({ type:'success', msg: data.message });
        setAttend({ userId:'', eventId:'' });
      } else {
        setAttendAlert({ type:'error', msg: data.message });
      }
    } catch {
      setAttendAlert({ type:'error', msg:'Server error!' });
    } finally { setALoading(false); }
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Manage events and mark participant attendance to award badges</p>
      </div>

      <div className="admin-grid">

        {/* ── Create Event ── */}
        <div className="admin-card">
          <h3>➕ Create New Event</h3>
          {eventAlert && (
            <div className={`alert alert-${eventAlert.type}`}>{eventAlert.msg}</div>
          )}
          <input
            className="admin-input"
            name="title"
            placeholder="Event Title *"
            value={eventForm.title}
            onChange={onEventChange}
          />
          <textarea
            className="admin-input"
            name="description"
            placeholder="Description *"
            rows={3}
            value={eventForm.description}
            onChange={onEventChange}
            style={{ resize:'vertical' }}
          />
          <input
            className="admin-input"
            name="date"
            type="date"
            value={eventForm.date}
            onChange={onEventChange}
          />
          <input
            className="admin-input"
            name="location"
            placeholder="Location *"
            value={eventForm.location}
            onChange={onEventChange}
          />
          <input
            className="admin-input"
            name="maxParticipants"
            type="number"
            placeholder="Max Participants *"
            value={eventForm.maxParticipants}
            onChange={onEventChange}
          />
          <button
            className="btn-admin"
            onClick={createEvent}
            disabled={eLoading}
          >
            {eLoading ? 'Creating...' : 'Create Event'}
          </button>
        </div>

        {/* ── Mark Attendance ── */}
        <div className="admin-card">
          <h3>✅ Mark Attendance</h3>
          <p style={{ fontSize:13, color:'var(--muted)', marginBottom:14 }}>
            Copy the User ID and Event ID from the table below (MongoDB _id values)
          </p>
          {attendAlert && (
            <div className={`alert alert-${attendAlert.type}`}>{attendAlert.msg}</div>
          )}
          <input
            className="admin-input"
            placeholder="User ID (copy from MongoDB) *"
            value={attend.userId}
            onChange={e => setAttend({ ...attend, userId: e.target.value })}
          />
          <input
            className="admin-input"
            placeholder="Event ID (copy from table below) *"
            value={attend.eventId}
            onChange={e => setAttend({ ...attend, eventId: e.target.value })}
          />
          <button
            className="btn-admin"
            onClick={markAttendance}
            disabled={aLoading}
          >
            {aLoading ? 'Marking...' : 'Mark Attended & Award Badge'}
          </button>
        </div>

      </div>

      {/* ── Events Table ── */}
      <div className="page-header" style={{ marginTop:32, marginBottom:14 }}>
        <h1 style={{ fontSize:20 }}>All Events</h1>
        <p>Copy Event ID from here to mark attendance above</p>
      </div>
      <div className="table-box">
        <table>
          <thead>
            <tr>
              <th>Event ID (copy this)</th>
              <th>Title</th>
              <th>Date</th>
              <th>Location</th>
              <th>Slots</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign:'center', color:'var(--muted)' }}>
                  No events found
                </td>
              </tr>
            ) : events.map(ev => (
              <tr key={ev._id}>
                <td style={{ fontFamily:'monospace', fontSize:11, color:'var(--muted)' }}>
                  {ev._id}
                </td>
                <td><strong>{ev.title}</strong></td>
                <td>{new Date(ev.date).toLocaleDateString('en-IN')}</td>
                <td>{ev.location}</td>
                <td>{ev.currentParticipants}/{ev.maxParticipants}</td>
                <td className={ev.status === 'completed' ? 'status-attended' : 'status-pending'}>
                  {ev.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
