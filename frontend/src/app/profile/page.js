'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const API = 'http://localhost:5000/api';

const BADGE_INFO = {
  bronze: { icon:'🥉', label:'Bronze', desc:'Complete 1 event' },
  silver: { icon:'🥈', label:'Silver', desc:'Complete 3 events' },
  gold:   { icon:'🥇', label:'Gold',   desc:'Complete 5 events' },
};

export default function ProfilePage() {
  const router = useRouter();
  const [user,    setUser]    = useState(null);
  const [badges,  setBadges]  = useState([]);
  const [regs,    setRegs]    = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    const token  = localStorage.getItem('token');
    if (!stored || !token) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(stored));
    loadData(token);
  }, []);

  async function loadData(token) {
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const [bRes, rRes] = await Promise.all([
        fetch(`${API}/badges/my`,        { headers }),
        fetch(`${API}/registrations/my`, { headers }),
      ]);
      setBadges(await bRes.json());
      setRegs(await rRes.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  if (loading || !user) return <div className="loading">Loading profile...</div>;

  const earnedTypes = badges.map(b => b.badgeType);

  return (
    <div className="container">

      {/* Profile Header Card */}
      <div className="profile-header">
        <div className="avatar">
          {user.name?.charAt(0).toUpperCase()}
        </div>
        <div className="profile-info">
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <div className="stat-chips">
            <span className="chip">🌱 {user.eventsAttended || 0} Events Attended</span>
            <span className="chip">🏅 {badges.length} Badges Earned</span>
            {user.role === 'admin' && (
              <span className="chip" style={{ background:'#fff4e0', color:'#854F0B' }}>
                ⚙️ Admin
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="page-header" style={{ marginBottom:14 }}>
        <h1 style={{ fontSize:20 }}>My Badges</h1>
        <p>Earn badges by attending volunteering events</p>
      </div>
      <div className="badges-grid">
        {['bronze','silver','gold'].map(type => {
          const earned = earnedTypes.includes(type);
          const info   = BADGE_INFO[type];
          const badge  = badges.find(b => b.badgeType === type);
          return (
            <div
              className={`badge-card ${earned ? '' : 'badge-locked'}`}
              key={type}
            >
              <div className="badge-icon">{info.icon}</div>
              <div className="badge-name">{info.label}</div>
              <div className="badge-date">
                {earned
                  ? `Earned on ${new Date(badge.createdAt).toLocaleDateString('en-IN')}`
                  : info.desc}
              </div>
            </div>
          );
        })}
      </div>

      {/* Registrations Section */}
      <div className="page-header" style={{ marginBottom:14, marginTop:28 }}>
        <h1 style={{ fontSize:20 }}>My Registrations</h1>
        <p>All events you have signed up for</p>
      </div>

      {regs.length === 0 ? (
        <div className="empty">
          No registrations yet.{' '}
          <Link href="/events" style={{ color:'var(--green)', fontWeight:600 }}>
            Browse events →
          </Link>
        </div>
      ) : (
        <div className="table-box">
          <table>
            <thead>
              <tr>
                <th>Event Name</th>
                <th>Date</th>
                <th>Location</th>
                <th>Attendance</th>
              </tr>
            </thead>
            <tbody>
              {regs.map(r => (
                <tr key={r._id}>
                  <td><strong>{r.eventId?.title || 'Event Deleted'}</strong></td>
                  <td>
                    {r.eventId?.date
                      ? new Date(r.eventId.date).toLocaleDateString('en-IN')
                      : '—'}
                  </td>
                  <td>{r.eventId?.location || '—'}</td>
                  <td className={r.attended ? 'status-attended' : 'status-pending'}>
                    {r.attended ? '✓ Attended' : '⏳ Pending'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
