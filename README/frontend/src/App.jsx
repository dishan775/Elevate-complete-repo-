import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import IntroPage from './components/IntroPage';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import ProfilePage from './components/ProfilePage';
import PortfolioPage from './components/PortfolioPage';
import Dashboard from './components/Dashboard';
import BlogPage from './components/BlogPage';
import CommunityPage from './components/CommunityPage';
import PracticeEnglish from './components/PracticeEnglish';
import Tools from './components/Tools';
import Resources from './components/Resources';
import PortfolioV2 from './components/PortfolioV2';
import LearnProgramming from './components/LearnProgramming';
import BlogV2 from './components/BlogV2';
import useAuthStore from './store/authStore';
import useThemeStore from './store/themeStore';

function App() {
  const initTheme = useThemeStore((state) => state.initTheme);

  useEffect(() => {
    initTheme();
  }, [initTheme]);
  const { isAuthenticated } = useAuthStore();

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<IntroPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route path="/home" element={<HomePage />} />
        <Route
          path="/profile"
          element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/portfolio"
          element={isAuthenticated ? <PortfolioPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/blog"
          element={isAuthenticated ? <BlogPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/community"
          element={isAuthenticated ? <CommunityPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/practice"
          element={isAuthenticated ? <PracticeEnglish /> : <Navigate to="/login" />}
        />
        <Route
          path="/tools"
          element={isAuthenticated ? <Tools /> : <Navigate to="/login" />}
        />
        <Route
          path="/resources"
          element={isAuthenticated ? <Resources /> : <Navigate to="/login" />}
        />
        <Route
          path="/portfoliov2"
          element={isAuthenticated ? <PortfolioV2 /> : <Navigate to="/login" />}
        />
        <Route
          path="/blogv2"
          element={isAuthenticated ? <BlogV2 /> : <Navigate to="/login" />}
        />
        <Route
          path="/learn-programming"
          element={isAuthenticated ? <LearnProgramming /> : <Navigate to="/login" />}
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;