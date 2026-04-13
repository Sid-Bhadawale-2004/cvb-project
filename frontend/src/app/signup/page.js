'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const API = 'http://localhost:5000/api';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm]       = useState({ name:'', email:'', password:'', phone:'' });
  const [alert, setAlert]     = useState(null);
  const [loading, setLoading] = useState(false);

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSignup() {
    if (!form.name || !form.email || !form.password) {
      return setAlert({ type:'error', msg:'Please fill all required fields' });
    }
    if (form.password.length < 8) {
      return setAlert({ type:'error', msg:'Password must be at least 8 characters' });
    }
    setLoading(true);
    setAlert(null);
    try {
      const res  = await fetch(`${API}/auth/signup`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setAlert({ type:'success', msg:'Account created! Redirecting to login...' });
        setTimeout(() => router.push('/login'), 1500);
      } else {
        setAlert({ type:'error', msg: data.message });
      }
    } catch {
      setAlert({ type:'error', msg:'Cannot connect to server. Is backend running on port 5000?' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form-box">
      <h2>Create Account</h2>
      <p className="form-sub">Join the volunteering community today</p>

      {alert && (
        <div className={`alert alert-${alert.type}`}>{alert.msg}</div>
      )}

      <div className="form-group">
        <label>Full Name *</label>
        <input
          name="name"
          placeholder="Riya Sharma"
          value={form.name}
          onChange={onChange}
        />
      </div>
      <div className="form-group">
        <label>Email Address *</label>
        <input
          name="email"
          type="email"
          placeholder="riya@example.com"
          value={form.email}
          onChange={onChange}
        />
      </div>
      <div className="form-group">
        <label>Password * (min 8 characters)</label>
        <input
          name="password"
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={onChange}
        />
      </div>
      <div className="form-group">
        <label>Phone Number (optional)</label>
        <input
          name="phone"
          placeholder="9876543210"
          value={form.phone}
          onChange={onChange}
        />
      </div>

      <button
        className="btn-primary"
        onClick={handleSignup}
        disabled={loading}
      >
        {loading ? 'Creating account...' : 'Sign Up'}
      </button>

      <p className="form-footer">
        Already have an account? <Link href="/login">Login here</Link>
      </p>
    </div>
  );
}
