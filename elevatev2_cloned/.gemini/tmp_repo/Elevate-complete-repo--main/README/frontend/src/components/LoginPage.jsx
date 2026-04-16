import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, Facebook, Twitter, CheckCircle2, BarChart2, MessageSquare, TrendingUp } from 'lucide-react';
import useAuthStore from '../store/authStore';
import '../styles/login.css';

// SVGs for custom brand icons
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const AppleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.636 10.632c-.035-3.21 2.625-4.757 2.747-4.832-1.491-2.18-3.805-2.477-4.63-2.516-1.97-.197-3.846 1.16-4.848 1.16-1.002 0-2.548-1.127-4.168-1.096-2.11.03-4.053 1.226-5.143 3.123-2.2 3.808-.564 9.44 1.579 12.533 1.047 1.503 2.288 3.193 3.918 3.132 1.558-.06 2.144-1.005 4.026-1.005 1.88 0 2.427.973 4.055 1.002 1.66.03 2.736-1.474 3.771-2.986 1.196-1.748 1.69-3.444 1.716-3.535-.037-.015-3.228-1.238-3.023-4.981zm-2.883-7.53c.85-1.026 1.424-2.455 1.268-3.882-1.22.05-2.709.813-3.58 1.838-.7.807-1.39 2.259-1.203 3.666 1.36.105 2.663-.598 3.515-1.622z"/>
  </svg>
);

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const displayName = formData.name || formData.email.split('@')[0];
      login(formData.email, displayName);
      showMessage("Welcome to Elevate!");
      setTimeout(() => navigate('/home'), 500);
      setIsLoading(false);
    }, 800);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      login('google_user@gmail.com', 'Google User');
      showMessage("Logged in with Google!");
      setTimeout(() => navigate('/home'), 500);
      setIsLoading(false);
    }, 1000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleAuthMode = () => {
    setIsSignUpMode(!isSignUpMode);
    setFormData({ email: '', password: '', name: '' });
  };

  const showMessage = (text) => {
    const msg = document.getElementById('statusMessage');
    if (msg) {
      msg.innerText = text;
      msg.classList.add('visible');
      setTimeout(() => msg.classList.remove('visible'), 3000);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-background"></div>
      <div className="login-grid-overlay"></div>

      {/* Abstract Glowing Spheres Background */}
      <div className="bg-sphere sphere-1"></div>
      <div className="bg-sphere sphere-2"></div>
      
      {/* Particles effect for premium depth */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="login-particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0, 0.6, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: Math.random() * 4 + 3,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}

      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="back-btn"
        onClick={() => navigate('/')}
      >
        <span>←</span> Home
      </motion.button>

      {/* Brand Header Absolute */}
      <div className="login-brand-fixed">
        <div className="brand-logo-icon">E</div>
        <span className="brand-name">Elevate</span>
      </div>

      <div id="statusMessage" className="status-message">Action completed!</div>

      {/* Two Column Layout Container */}
      <div className="login-layout-container">
        
        {/* LEFT COLUMN: FORM CARD */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, type: "spring" }}
          className="login-form-side"
        >
          <div className="form-card-inner">
            <div className="login-header">
              <h2 className="login-title">
                {isSignUpMode ? 'Register' : 'Login'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <AnimatePresence>
                {isSignUpMode && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="form-group"
                  >
                    <div className="input-wrapper">
                      <span className="input-icon"><User size={18} /></span>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Full Name"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="form-group">
                <div className="input-wrapper">
                  <span className="input-icon"><User size={18} /></span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@gmail.com"
                    required
                  />
                  {formData.email && <CheckCircle2 size={16} className="valid-icon" />}
                </div>
              </div>

              <div className="form-group">
                <div className="input-wrapper">
                  <span className="input-icon"><Lock size={18} /></span>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                  />
                </div>
              </div>

              {!isSignUpMode && (
                <div className="form-options">
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={rememberMe} 
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="circle-checkbox"
                    />
                    <span>Remember Password</span>
                  </label>
                  <a href="#forgot" className="forgot-link">Forget Password?</a>
                </div>
              )}

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-auth-primary"
              >
                {isLoading ? 'Processing...' : (isSignUpMode ? 'Register' : 'Login')}
              </motion.button>
            </form>

            <div className="auth-switch-text">
              {isSignUpMode ? 'Already have an account? ' : 'No account yet? '}
              <button className="switch-btn" onClick={(e) => { e.preventDefault(); toggleAuthMode(); }}>
                {isSignUpMode ? 'Login' : 'Register'}
              </button>
            </div>

            <div className="auth-divider">
              <span>Or {isSignUpMode ? 'Register' : 'Login'} With:</span>
            </div>

            <div className="social-row">
              <button className="social-icon-btn"><AppleIcon /></button>
              <button className="social-icon-btn"><Twitter size={20} color="#1DA1F2" fill="#1DA1F2" /></button>
              <button className="social-icon-btn"><Facebook size={20} color="#1877F2" fill="#1877F2" /></button>
              <button className="social-icon-btn" onClick={handleGoogleLogin}><GoogleIcon /></button>
            </div>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: 3D FLOATING ILLUSTRATION */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="login-illustration-side"
        >
          <div className="illustration-wrapper">
             <motion.div 
               animate={{ y: [0, -15, 0] }} 
               transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
               className="floating-glass-card main-card"
             >
               <div className="card-mock-header">
                 <div className="mock-dots"><span></span><span></span><span></span></div>
               </div>
               <div className="card-mock-body">
                 <div className="mock-line w-70"></div>
                 <div className="mock-line w-40"></div>
                 <div className="mock-chart">
                    <BarChart2 size={48} color="#fff" strokeWidth={1} />
                 </div>
               </div>
             </motion.div>

             <motion.div 
               animate={{ y: [0, 10, 0], x: [0, 5, 0] }} 
               transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
               className="floating-glass-card mini-card top-right"
             >
               <TrendingUp size={24} color="#a8b8ff" />
               <div className="mini-card-text">
                  <div className="mock-line sm w-100"></div>
                  <div className="mock-line sm w-60"></div>
               </div>
             </motion.div>

             <motion.div 
               animate={{ y: [0, -8, 0], x: [0, -5, 0] }} 
               transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 2 }}
               className="floating-glass-card mini-card bottom-left"
             >
               <MessageSquare size={24} color="#667eea" />
               <div className="mini-card-text">
                  <div className="mock-line sm w-80"></div>
                  <div className="mock-line sm w-50"></div>
               </div>
             </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;