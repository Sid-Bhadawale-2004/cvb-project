'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  }

  return (
    <nav className="navbar">
      <Link href="/" className="navbar-brand">🤝 CVB Platform</Link>
      <div className="navbar-links">
        <Link href="/events" className="nav-link">Events</Link>
        {user ? (
          <>
            <Link href="/profile" className="nav-link">My Profile</Link>
            {user.role === 'admin' && (
              <Link href="/admin" className="nav-link">Admin</Link>
            )}
            <button className="nav-btn" onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link href="/login" className="nav-link">Login</Link>
            <Link href="/signup">
              <button className="nav-btn">Sign Up</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}