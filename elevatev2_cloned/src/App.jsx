import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import AuthGuard from './components/AuthGuard';
import Home from './pages/Home';
import Login from './pages/Login';
import Portfolio from './pages/Portfolio';
import Blog from './pages/Blog';
import PracticeEnglish from './pages/PracticeEnglish';
import LearnProgramming from './pages/LearnProgramming';
import Tools from './pages/Tools';
import Resources from './pages/Resources';
import FocusSession from './pages/FocusSession';
import Dashboard from './pages/Dashboard';
import AIStudyBuddy from './pages/AIStudyBuddy';
import ProfilePage from './pages/ProfilePage';
import CommunityPage from './pages/CommunityPage';

import IntroPage from './pages/IntroPage';
import HomePage from './pages/HomePage';

function MainLayout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, position: 'relative' }}>
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Pages with their own Layout (no Navbar) */}
        <Route path="/" element={<IntroPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<AuthGuard><HomePage /></AuthGuard>} />
        <Route path="/focus-session" element={<AuthGuard><FocusSession /></AuthGuard>} />
        
        {/* Pages with Global V2 Layout (with Navbar) */}
        <Route element={<MainLayout />}>
          <Route path="/v2-home"           element={<Home />} />
          <Route path="/portfolio"         element={<Portfolio />} />
          <Route path="/blog"              element={<Blog />} />
          <Route path="/tools"             element={<Tools />} />
          <Route path="/resources"         element={<Resources />} />
          <Route path="/dashboard"         element={<AuthGuard><Dashboard /></AuthGuard>} />
          <Route path="/ai-study-buddy"    element={<AuthGuard><AIStudyBuddy /></AuthGuard>} />
          <Route path="/profile"           element={<AuthGuard><ProfilePage /></AuthGuard>} />
          <Route path="/community"         element={<AuthGuard><CommunityPage /></AuthGuard>} />

          {/* 🔒 Auth-protected practice routes */}
          <Route path="/practice/english"  element={<AuthGuard><PracticeEnglish /></AuthGuard>} />
          <Route path="/practice/programming" element={<AuthGuard><LearnProgramming /></AuthGuard>} />
          <Route path="/practice/cs"       element={<AuthGuard><PracticeEnglish /></AuthGuard>} />
          <Route path="/practice/reading"  element={<AuthGuard><PracticeEnglish /></AuthGuard>} />
          <Route path="/practice/*"        element={<AuthGuard><PracticeEnglish /></AuthGuard>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
