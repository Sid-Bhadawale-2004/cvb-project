'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const API = 'http://localhost:5000/api';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm]       = useState({ email:'', password:'' });
  const [alert, setAlert]     = useState(null);
  const [loading, setLoading] = useState(false);

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleLogin() {
    if (!form.email || !form.password) {
      return setAlert({ type:'error', msg:'Please enter email and password' });
    }
    setLoading(true);
    setAlert(null);
    try {
      const res  = await fetch(`${API}/auth/login`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        // Save token and user to localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user',  JSON.stringify(data.user));
        setAlert({ type:'success', msg:'Login successful! Redirecting...' });
        setTimeout(() => {
          // Admin goes to admin panel, user goes to events
          router.push(data.user.role === 'admin' ? '/admin' : '/events');
        }, 1000);
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
      <h2>Welcome Back</h2>
      <p className="form-sub">Login to access your volunteering dashboard</p>

      {alert && (
        <div className={`alert alert-${alert.type}`}>{alert.msg}</div>
      )}

      <div className="form-group">
        <label>Email Address</label>
        <input
          name="email"
          type="email"
          placeholder="riya@example.com"
          value={form.email}
          onChange={onChange}
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          name="password"
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={onChange}
        />
      </div>

      <button
        className="btn-primary"
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>

      <p className="form-footer">
        Don&apos;t have an account? <Link href="/signup">Sign up here</Link>
      </p>
    </div>
  );
}
