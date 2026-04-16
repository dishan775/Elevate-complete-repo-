import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { Home, LayoutDashboard, FolderKanban, User, LogOut, Menu, X, Target } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { label: 'Home', path: '/home', icon: <Home size={18} /> },
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'Portfolio', path: '/portfolio', icon: <FolderKanban size={18} /> },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="main-navbar"
    >
      <div className="navbar-container">
        {/* Logo */}
        <div className="nav-logo" onClick={() => navigate('/home')}>
          <div className="nav-logo-icon"><Target size={20} /></div>
          <span>RIPIS</span>
        </div>

        {/* Desktop Nav Links */}
        <div className="nav-links desktop-only">
          {navLinks.map((link) => (
            <motion.button
              key={link.path}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(link.path)}
              className="nav-link"
            >
              {link.icon}
              <span>{link.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Profile Section */}
        <div className="nav-profile">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="profile-trigger"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className="profile-avatar">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="profile-info desktop-only">
              <span className="profile-name">{user?.name || 'User'}</span>
              <span className="profile-email">{user?.email || 'user@example.com'}</span>
            </div>
          </motion.div>

          {/* Dropdown Menu */}
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="profile-dropdown"
            >
              <div className="dropdown-item" onClick={() => navigate('/profile')}>
                <User size={18} />
                <span>Profile Settings</span>
              </div>
              <div className="dropdown-divider"></div>
              <div className="dropdown-item logout" onClick={handleLogout}>
                <LogOut size={18} />
                <span>Logout</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="mobile-menu-toggle mobile-only"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mobile-menu"
        >
          {navLinks.map((link) => (
            <div
              key={link.path}
              className="mobile-link"
              onClick={() => {
                navigate(link.path);
                setMobileMenuOpen(false);
              }}
            >
              {link.icon}
              <span>{link.label}</span>
            </div>
          ))}
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;