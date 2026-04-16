import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ShieldAlert, Lock, Zap } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { Link } from 'react-router-dom';

export default function AuthGuard({ children }) {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (isAuthenticated) return children;

  return (
    <div style={{
      minHeight: '70vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      textAlign: 'center',
      padding: '2rem',
    }}>
      <div style={{
        width: 72, height: 72,
        borderRadius: '50%',
        background: 'var(--color-accent-subtle)',
        border: '2px solid var(--card-border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '1.5rem',
        boxShadow: '0 0 32px var(--primary-glow)',
      }}>
        <Lock size={32} color="var(--primary)" />
      </div>
      <h2 style={{ color: 'var(--text-main)', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
        Login Required
      </h2>
      <p style={{ color: 'var(--text-muted)', maxWidth: 400, marginBottom: '2rem', lineHeight: 1.7 }}>
        You need to be logged in to access practice modules. Create a free account and start your interview prep journey.
      </p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link
          to="/login"
          state={{ from: location.pathname }}
          className="btn btn-primary"
          style={{ padding: '12px 28px', borderRadius: 10 }}
        >
          <Zap size={16} /> Log In to Continue
        </Link>
        <Link to="/" className="btn btn-secondary" style={{ padding: '12px 24px', borderRadius: 10 }}>
          Back to Home
        </Link>
      </div>
    </div>
  );
}
