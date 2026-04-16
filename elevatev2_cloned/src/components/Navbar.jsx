import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Zap, LogOut, User as UserIcon, Award } from 'lucide-react';
import useAuthStore from '../store/authStore';
import usePracticeStore from '../store/practiceStore';

export default function Navbar() {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { xp, level, fetchSummary } = usePracticeStore();
  const [dark, setDark] = useState(() => localStorage.getItem('elevate-theme') === 'dark');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (isAuthenticated) fetchSummary();
  }, [isAuthenticated, fetchSummary]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem('elevate-theme', dark ? 'dark' : 'light');
  }, [dark]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { name: 'Home',      path: '/home' },
    { name: 'Practice',  path: '/practice/english' },
    { name: 'Resources', path: '/resources' },
    { name: 'Tools',     path: '/tools' },
    { name: 'Blog',      path: '/blog' },
    { name: 'Portfolio', path: '/portfolio' },
  ];

  const isActive = (path) =>
    path === '/home' ? location.pathname === '/home' : location.pathname.startsWith(path);

  return (
    <nav
      className="glass"
      style={{
        position: 'sticky', top: 0, zIndex: 200,
        padding: scrolled ? '10px 0' : '14px 0',
        transition: 'padding 0.3s ease, box-shadow 0.3s ease',
        boxShadow: scrolled ? '0 4px 24px rgba(99,102,241,0.15)' : 'none',
      }}
    >
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

        {/* Brand */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--primary), #4f46e5)',
            color: 'white',
            width: '38px', height: '38px',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: '900', fontSize: '1.1rem',
            boxShadow: '0 4px 12px var(--primary-glow)',
            flexShrink: 0,
          }}>E</div>
          <span style={{
            fontSize: '1.2rem', fontWeight: '800',
            letterSpacing: '-0.03em',
            color: 'var(--text-main)',
          }}>Elevate</span>
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                color: isActive(link.path) ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: isActive(link.path) ? '600' : '500',
                fontSize: '0.9rem',
                padding: '8px 14px',
                borderRadius: '8px',
                background: isActive(link.path) ? 'var(--color-accent-subtle)' : 'transparent',
                transition: 'all 0.2s',
                textDecoration: 'none',
              }}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right controls */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={() => setDark(d => !d)}
            title={dark ? 'Light mode' : 'Dark mode'}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--card-border)',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '8px',
              borderRadius: '50%',
              width: '36px', height: '36px',
              transition: 'all 0.2s',
            }}
            onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
          >
              {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {isAuthenticated ? (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Link to="/portfolio" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                padding: '6px 12px', 
                borderRadius: '50px', 
                background: 'var(--color-accent-subtle)', 
                color: 'var(--primary)',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '0.85rem'
              }}>
                <div style={{
                  width: '24px', height: '24px',
                  borderRadius: '50%',
                  background: 'var(--primary)',
                  color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.7rem'
                }}>{user?.avatar || 'U'}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '0.85rem' }}>{user?.name || 'User'}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-subtle)', background: 'var(--surface)', padding: '1px 6px', borderRadius: '4px', border: '1px solid var(--card-border)' }}>Lvl {level}</span>
                    <span style={{ fontSize: '0.65rem', color: '#d946ef', fontWeight: 'bold' }}>{xp % 100} XP</span>
                  </div>
                </div>
              </Link>
              <button
                onClick={logout}
                title="Log out"
                style={{
                  background: 'transparent',
                  border: '1px solid var(--card-border)',
                  color: 'var(--error, #ef4444)',
                  padding: '8px',
                  borderRadius: '50%',
                  width: '36px', height: '36px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="btn btn-primary"
              style={{ padding: '9px 22px', fontSize: '0.88rem', borderRadius: '10px' }}
            >
              <Zap size={15} /> Log In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
