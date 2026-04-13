'use client';
import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      <div className="hero">
        <h1>Volunteer. Participate.<br />Earn Badges.</h1>
        <p>Join community volunteering events, track your impact, and get rewarded with badges for your dedication.</p>
        <div className="hero-btns">
          <Link href="/signup">
            <button className="btn-hero-primary">Get Started Free</button>
          </Link>
          <Link href="/events">
            <button className="btn-hero-secondary">Browse Events</button>
          </Link>
        </div>
      </div>
      <div className="features">
        <div className="feature-card">
          <div className="feature-icon">🌱</div>
          <h3>Browse Events</h3>
          <p>Find local volunteering events that match your interests and availability.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">✅</div>
          <h3>Easy Registration</h3>
          <p>Sign up for events in one click. Track all your registrations in one place.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🏅</div>
          <h3>Earn Badges</h3>
          <p>Get Bronze, Silver, and Gold badges automatically as you complete events.</p>
        </div>
      </div>
    </>
  );
}
