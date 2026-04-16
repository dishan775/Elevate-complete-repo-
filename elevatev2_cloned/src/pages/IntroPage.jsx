import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { 
  Brain, Users, Target, TrendingUp, Award, Zap, 
  MessageSquare, BarChart3, Calendar, FileText, Mic, 
  Play, ArrowRight, CheckCircle2, ChevronUp, ChevronDown, Github, 
  Twitter, Linkedin, Check, AlertTriangle,
  BookOpen, Globe, Code2, Layers, Headphones, Rocket,
  Sun, Moon
} from 'lucide-react';

const faqs = [
  { q: "Do I need any programming experience?", a: "Not at all. Elevate caters to all levels. For complete beginners, our AI adjusts to explain concepts simply and provides guided foundational lessons." },
  { q: "Is the AI mock interview like a real one?", a: "Yes. Our AI models are trained on real interview transcripts from top tech companies. It evaluates not just the technical correctness of your answer, but also your delivery, structure, and problem-solving approach." },
  { q: "Can I cancel my subscription anytime?", a: "Absolutely. You can cancel your Pro plan at any time through your account settings. You will retain access to Pro features until the end of your billing cycle." },
  { q: "How does the portfolio builder work?", a: "It auto-generates a personalized portfolio website using your performance data, badges, and project history on Elevate. If you complete more modules, your portfolio instantly reflects your growing skills." },
  { q: "Does this work for non-technical interviews?", a: "Yes! While we have specialized tracks for coding and system design, our Behavioral and Professional English modules are perfect for any corporate role focusing on communication and leadership." }
];
import '../styles/intro.css';

const IntroPage = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('elevate-theme');
    return saved || 'light';
  });

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    localStorage.setItem('elevate-theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const isDark = theme === 'dark';

  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
  };
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
  };
  const slideInLeft = {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
  };
  const slideInRight = {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
  };
  const scaleUp = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  // Skeleton bar colors
  const skelColor1 = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const skelColor2 = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)';
  const mutedText = isDark ? 'rgba(255,255,255,0.4)' : '#9ca3af';
  const bodyText = isDark ? 'rgba(255,255,255,0.5)' : '#4b5563';

  return (
    <div className="landing-page" data-theme={theme}>
      {/* Scroll Progress Bar */}
      <motion.div
        style={{ scaleX, position: 'fixed', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #667eea, #f093fb, #00d4ff)', transformOrigin: '0%', zIndex: 1000 }}
      />

      {/* ── 1. Navbar ── */}
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container nav-container">
          <div className="nav-logo" onClick={scrollToTop}>
            <Brain className="nav-logo-icon" size={isScrolled ? 24 : 28} />
            <span>Elevate</span>
          </div>
          
          <div className="nav-links">
            <a href="#home">Home</a>
            <a href="#features">Features</a>
            <a href="#showcase">Showcase</a>
            <a href="#how-it-works">How it works</a>
            <a href="#pricing">Pricing</a>
          </div>

          <div className="nav-actions">
            {/* Theme Toggle */}
            <div className="theme-toggle-wrapper">
              <span className="theme-toggle-icon">{isDark ? '🌙' : '☀️'}</span>
              <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme" />
            </div>
            <a href="/login" className="nav-signin" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>Sign In</a>
            <button className="btn btn-primary-glow" onClick={() => navigate('/login')}>
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* ── 2. Hero Section ── */}
      <section id="home" className="hero">
        <div className="hero-bg"></div>
        <div className="particles"></div>
        
        <div className="container">
          <motion.div 
            className="hero-content"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.h1 variants={fadeUp} className="hero-title">
              <span className="text-gradient">Ace Every Interview</span>
              with AI
            </motion.h1>
            
            <motion.p variants={fadeUp} className="hero-subtitle">
              Master interview skills, track your progress, and land your dream job with intelligent practice and real-time AI feedback.
            </motion.p>
            
            <motion.div variants={fadeUp} className="hero-ctas">
              <button className="btn btn-primary-glow" onClick={() => navigate('/login')}>
                <Rocket size={20} /> Get Started Free
              </button>
              <button className="btn btn-minimal">
                <Play size={18} /> Watch Demo
              </button>
            </motion.div>

            <motion.div variants={fadeUp} className="hero-proof">
              <div className="hero-proof-item"><CheckCircle2 size={16} style={{color: '#667eea'}} /> No credit card required</div>
              <div className="hero-proof-item"><CheckCircle2 size={16} style={{color: '#667eea'}} /> 7-day free trial</div>
              <div className="hero-proof-item"><CheckCircle2 size={16} style={{color: '#667eea'}} /> Cancel anytime</div>
            </motion.div>
          </motion.div>

          <motion.div 
            className="hero-dashboard-wrapper"
            initial={{ opacity: 0, y: 120, rotateX: 15 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mockup hero-dashboard">
              <div className="mockup-header">
                <div className="mockup-dot red"></div>
                <div className="mockup-dot yellow"></div>
                <div className="mockup-dot green"></div>
              </div>
              <div className="dashboard-grid">
                <div className="dashboard-sidebar">
                  <div style={{height: '24px', width: '70%', background: skelColor1, borderRadius: '4px', marginBottom: '24px'}}></div>
                  <div style={{height: '16px', width: '90%', background: skelColor2, borderRadius: '4px', marginBottom: '16px'}}></div>
                  <div style={{height: '16px', width: '60%', background: skelColor2, borderRadius: '4px', marginBottom: '16px'}}></div>
                  <div style={{height: '16px', width: '80%', background: skelColor2, borderRadius: '4px', marginBottom: '16px'}}></div>
                </div>
                <div className="dashboard-main practice-mockup">
                  <div className="mockup-badge">Behavioral Question</div>
                  <div className="mockup-question">"Tell me about a time you handled a difficult situation."</div>
                  <div className="mockup-timer">
                    <div className="mockup-recording-dot"></div>
                    Recording... 2:30 remaining
                  </div>
                  <div className="mockup-input-area">
                    <p style={{color: mutedText}}>Well, in my previous role...</p>
                    <div className="mockup-hint">
                      <Zap size={14} /> Use the STAR method to structure your answer.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 3. Stats ── */}
      <section className="stats-section">
        <div className="container">
          <motion.div className="stats-grid" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}>
            {[
              { icon: <Users size={24} />, num: "Growing", label: "Community" },
              { icon: <Target size={24} />, num: "Active", label: "Practice Sessions" },
              { icon: <TrendingUp size={24} />, num: "High", label: "Success Rate" },
              { icon: <Award size={24} />, num: "Top", label: "Rated Platform" }
            ].map((stat, i) => (
              <motion.div key={i} variants={fadeUp} className="stat-item">
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-number">{stat.num}</div>
                <div className="stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 4. Core Features Grid ── */}
      <section id="features" className="section-padding features-section">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="section-heading-wrapper text-center">
            <div className="section-label">🚀 POWERFUL FEATURES</div>
            <h2 className="section-title">Everything you need to <span className="text-gradient">succeed</span></h2>
            <p className="section-subtitle">From AI-powered mock interviews to comprehensive progress tracking, Elevate provides a complete toolkit for interview success.</p>
          </motion.div>

          <motion.div className="features-grid" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}>
            {[
              { icon: <MessageSquare size={24} />, title: "AI Mock Interviews", desc: "Practice with our advanced AI that adapts to your specific role, experience level, and target company." },
              { icon: <Zap size={24} />, title: "Real-time Feedback", desc: "Get instant, contextual guidance and coaching tips without interrupting your interview flow." },
              { icon: <BarChart3 size={24} />, title: "Progress Dashboard", desc: "Track improvements with detailed analytics, streak tracking, and performance metrics over time." },
              { icon: <BookOpen size={24} />, title: "Practice English", desc: "Master corporate English with AI-powered speaking exercises, vocabulary builders, and grammar quizzes." },
              { icon: <Globe size={24} />, title: "Community Hub", desc: "Connect with other candidates, share tips, participate in mock interview sessions, and grow together." },
              { icon: <Code2 size={24} />, title: "CS Fundamentals", desc: "Drill data structures, algorithms, system design, databases, and networking with MCQ quizzes." },
              { icon: <FileText size={24} />, title: "Portfolio Builder", desc: "Automatically generate a stunning developer portfolio showcasing your verified skills and streak." },
              { icon: <Mic size={24} />, title: "Voice Analysis", desc: "Improve delivery, pacing, and tone with advanced AI-powered audio analysis and filler-word detection." },
              { icon: <Calendar size={24} />, title: "GitHub-style Calendar", desc: "Build consistency with daily streak tracking and earn XP rewards for maintaining your practice habits." }
            ].map((feature, i) => (
              <motion.div key={i} variants={scaleUp} className="feature-card">
                <div className="feature-card-icon">{feature.icon}</div>
                <h3 className="feature-card-title">{feature.title}</h3>
                <p className="feature-card-desc">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 5. Feature Showcase — Detailed Cards ── */}
      <section id="showcase" className="showcase-section">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="section-heading-wrapper text-center">
            <div className="section-label">✨ DEEP DIVE</div>
            <h2 className="section-title">Built for <span className="text-gradient">serious preparation</span></h2>
            <p className="section-subtitle">Every feature is designed to simulate real interview conditions and accelerate your learning curve.</p>
          </motion.div>

          <motion.div className="showcase-grid" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}>
            <motion.div variants={fadeUp} className="showcase-card">
              <div className="showcase-card-icon"><Brain size={32} /></div>
              <h3 className="showcase-card-title">AI Interview Engine</h3>
              <p className="showcase-card-desc">Powered by advanced language models, our AI adapts to your answers, asks follow-up questions, and provides hints when you get stuck.</p>
              <ul className="showcase-card-features">
                <li><Check size={16} color="#22c55e" /> Behavioral & technical questions</li>
                <li><Check size={16} color="#22c55e" /> Real-time STAR method coaching</li>
                <li><Check size={16} color="#22c55e" /> System design mock sessions</li>
                <li><Check size={16} color="#22c55e" /> Adaptive difficulty scaling</li>
              </ul>
            </motion.div>

            <motion.div variants={fadeUp} className="showcase-card">
              <div className="showcase-card-icon"><Headphones size={32} /></div>
              <h3 className="showcase-card-title">Corporate English Training</h3>
              <p className="showcase-card-desc">Complete language training suite with interactive lessons, vocabulary flashcards, reading comprehension, and real-time chat practice.</p>
              <ul className="showcase-card-features">
                <li><Check size={16} color="#f093fb" /> 8-step interactive AI lessons</li>
                <li><Check size={16} color="#f093fb" /> Salary negotiation chat simulator</li>
                <li><Check size={16} color="#f093fb" /> Grammar quizzes with timer</li>
                <li><Check size={16} color="#f093fb" /> Voice evaluation & TTS feedback</li>
              </ul>
            </motion.div>

            <motion.div variants={fadeUp} className="showcase-card">
              <div className="showcase-card-icon"><BarChart3 size={32} /></div>
              <h3 className="showcase-card-title">Analytics & Growth</h3>
              <p className="showcase-card-desc">Comprehensive analytics dashboard tracks your fluency scores, vocabulary usage, speaking pace, and problem-solving accuracy.</p>
              <ul className="showcase-card-features">
                <li><Check size={16} color="#22c55e" /> Score tracking with trend charts</li>
                <li><Check size={16} color="#22c55e" /> XP & gamification system</li>
                <li><Check size={16} color="#22c55e" /> GitHub-style activity calendar</li>
                <li><Check size={16} color="#22c55e" /> Exportable progress reports</li>
              </ul>
            </motion.div>

            <motion.div variants={fadeUp} className="showcase-card">
              <div className="showcase-card-icon"><Layers size={32} /></div>
              <h3 className="showcase-card-title">Community & Portfolio</h3>
              <p className="showcase-card-desc">Join a growing community of motivated learners. Share progress, get peer feedback, and showcase your abilities professionally.</p>
              <ul className="showcase-card-features">
                <li><Check size={16} color="#f59e0b" /> Community discussion forum</li>
                <li><Check size={16} color="#f59e0b" /> Auto-generated developer portfolio</li>
                <li><Check size={16} color="#f59e0b" /> Blog publishing platform</li>
                <li><Check size={16} color="#f59e0b" /> Resource & tool recommendations</li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── 6. Smart Practice ── */}
      <section id="how-it-works" className="section-padding">
        <div className="container split-layout reversed">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={slideInLeft} className="mockup-container">
            <div className="mockup practice-mockup" style={{boxShadow: 'var(--shadow-3d)'}}>
              <div className="mockup-badge">System Design</div>
              <div className="mockup-question">"Design a scalable rate limiter."</div>
              <div className="mockup-timer">
                <div className="mockup-recording-dot"></div>
                Recording... 14:20 remaining
              </div>
              <div className="mockup-input-area" style={{minHeight: '200px'}}>
                <p style={{color: bodyText, fontFamily: 'monospace', fontSize: '0.9rem'}}>
                  1. Token Bucket algorithm<br/>
                  2. Redis for distributed counter<br/>
                  3. Edge API gateway
                </p>
                <div className="mockup-hint">
                  <Zap size={14} /> Consider discussing network latency and redis failures.
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={slideInRight} className="section-heading-wrapper text-right">
            <div className="section-label">🎯 SMART PRACTICE</div>
            <h2 className="section-title">Practice like the <span className="text-gradient">real interview</span></h2>
            <p className="section-subtitle" style={{marginBottom: '32px'}}>
              Experience the pressure of real interviews in a safe environment. Our intelligent system adapts to your answers, asks follow-up questions, and provides hints precisely when you get stuck.
            </p>
            <button className="section-cta-btn" onClick={() => navigate('/login')}>
              Try Mock Interview <ArrowRight size={18} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── 7. Progress Tracking ── */}
      <section className="section-padding" style={{background: 'var(--bg-subtle)'}}>
        <div className="container split-layout">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={slideInLeft} className="section-heading-wrapper">
            <div className="section-label">📊 TRACK YOUR GROWTH</div>
            <h2 className="section-title">See your <span className="text-gradient">improvement</span> in real-time</h2>
            <p className="section-subtitle" style={{marginBottom: '32px'}}>
              Visualize your journey from novice to master. Deep analytics on problem-solving speed, accuracy, and communication clarity.
            </p>
            <button className="section-cta-btn" onClick={() => navigate('/login')}>
              View Dashboard Demo <ArrowRight size={18} />
            </button>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={slideInRight} className="mockup-container">
            <div className="mockup dashboard-mockup">
              <div className="dash-header">
                <h3>Your Dashboard</h3>
                <div className="dash-streak">7 Day Streak 🔥</div>
              </div>
              <div className="dash-charts"></div>
              <div className="dash-stats-grid">
                <div className="dash-stat-card"><div className="dash-stat-val">127h</div><div className="dash-stat-name">Study Time</div></div>
                <div className="dash-stat-card"><div className="dash-stat-val">248</div><div className="dash-stat-name">Problems Solved</div></div>
                <div className="dash-stat-card"><div className="dash-stat-val">32</div><div className="dash-stat-name">Modules</div></div>
                <div className="dash-stat-card"><div className="dash-stat-val">87%</div><div className="dash-stat-name">Avg Score</div></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 8. Portfolio Builder ── */}
      <section className="section-padding">
        <div className="container split-layout reversed">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={slideInLeft} className="mockup-container">
            <div className="mockup portfolio-mockup">
              <div className="mockup-header">
                <div className="mockup-dot red"></div>
                <div className="mockup-dot yellow"></div>
                <div className="mockup-dot green"></div>
                <div style={{fontSize: '0.75rem', color: mutedText, marginLeft: '12px'}}>johndoe.elevate.com</div>
              </div>
              <div className="port-cover"></div>
              <div className="port-profile">
                <div className="port-avatar"></div>
                <div className="port-name">John Doe</div>
                <div className="port-title">Full Stack Developer | Ready to Hire</div>
                <div className="port-skills">
                  <span className="port-skill">React</span>
                  <span className="port-skill">Node.js</span>
                  <span className="port-skill">Python</span>
                  <span className="port-skill">System Design</span>
                </div>
                <div style={{marginTop: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
                  <div style={{height: '80px', background: 'var(--bg-subtle)', borderRadius: '8px', border: '1px solid var(--border-card)'}}></div>
                  <div style={{height: '80px', background: 'var(--bg-subtle)', borderRadius: '8px', border: '1px solid var(--border-card)'}}></div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={slideInRight} className="section-heading-wrapper text-right">
            <div className="section-label">💼 BUILD YOUR PORTFOLIO</div>
            <h2 className="section-title">Showcase your skills <span className="text-gradient">professionally</span></h2>
            <p className="section-subtitle" style={{marginBottom: '32px'}}>
              Turn your practice into proof. Automatically generate a stunning portfolio that highlights your verified skills, streak, and performance.
            </p>
            <button className="section-cta-btn" onClick={() => navigate('/login')}>
              Create Portfolio <ArrowRight size={18} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── 9. AI Insights ── */}
      <section className="section-padding" style={{background: 'var(--bg-subtle)'}}>
        <div className="container split-layout">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={slideInLeft} className="section-heading-wrapper">
            <div className="section-label">🤖 AI-POWERED INSIGHTS</div>
            <h2 className="section-title">Get personalized <span className="text-gradient">feedback</span> instantly</h2>
            <p className="section-subtitle" style={{marginBottom: '32px'}}>
              Our AI analyzes your communication style, problem-solving approach, and technical accuracy to provide actionable recommendations.
            </p>
            <button className="section-cta-btn" onClick={() => navigate('/login')}>
              See Feedback Example <ArrowRight size={18} />
            </button>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={slideInRight} className="mockup-container">
            <div className="mockup ai-mockup">
              <h3 className="section-title" style={{fontSize: '1.5rem', textAlign: 'center', marginBottom: '24px'}}>Interview Analysis</h3>
              <div className="ai-score-ring">
                <span>87<span>/100</span></span>
              </div>
              <div className="ai-feedback-section">
                <div className="ai-feedback-title">Strengths</div>
                <div className="ai-feedback-list">
                  <div className="ai-feedback-item success"><Check size={18} color="#22c55e" /> Clear communication</div>
                  <div className="ai-feedback-item success"><Check size={18} color="#22c55e" /> Good STAR structure</div>
                  <div className="ai-feedback-item success"><Check size={18} color="#22c55e" /> Confident delivery</div>
                </div>
              </div>
              <div className="ai-feedback-section">
                <div className="ai-feedback-title">Areas to Improve</div>
                <div className="ai-feedback-list">
                  <div className="ai-feedback-item warning"><AlertTriangle size={18} color="#eab308" /> Add more quantifiable metrics</div>
                  <div className="ai-feedback-item warning"><AlertTriangle size={18} color="#eab308" /> Speak slightly slower</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 10. Pricing ── */}
      <section id="pricing" className="section-padding pricing-section">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="section-heading-wrapper text-center">
            <h2 className="section-title">Start preparing <span className="text-gradient">today</span></h2>
            <p className="section-subtitle">Choose the plan that works for you.</p>
          </motion.div>

          <motion.div className="pricing-grid" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}>
            <motion.div variants={fadeUp} className="pricing-card">
              <h3 className="pricing-name">Free Plan</h3>
              <div className="pricing-price">$0<span className="pricing-period">/month</span></div>
              <p className="pricing-desc">Perfect to test the waters and start practicing.</p>
              <ul className="pricing-features">
                <li className="pricing-feature"><CheckCircle2 size={18} /> Basic features</li>
                <li className="pricing-feature"><CheckCircle2 size={18} /> 5 mock interviews/month</li>
                <li className="pricing-feature"><CheckCircle2 size={18} /> Basic analytics</li>
              </ul>
              <button className="btn btn-outline" onClick={() => navigate('/login')}>Start Free</button>
            </motion.div>

            <motion.div variants={fadeUp} className="pricing-card popular">
              <div className="popular-badge">Most Popular</div>
              <h3 className="pricing-name">Pro Plan</h3>
              <div className="pricing-price">$9.99<span className="pricing-period">/month</span></div>
              <p className="pricing-desc">Everything you need to secure your dream offer.</p>
              <ul className="pricing-features">
                <li className="pricing-feature"><CheckCircle2 size={18} /> Everything in Free</li>
                <li className="pricing-feature"><CheckCircle2 size={18} /> Unlimited interviews</li>
                <li className="pricing-feature"><CheckCircle2 size={18} /> Advanced AI feedback</li>
                <li className="pricing-feature"><CheckCircle2 size={18} /> Portfolio builder</li>
                <li className="pricing-feature"><CheckCircle2 size={18} /> Priority support</li>
              </ul>
              <button className="btn btn-white" onClick={() => navigate('/login')}>Get Started <ArrowRight size={18} /></button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── 11. FAQ Section ── */}
      <section id="faq" className="faq-section">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="section-heading-wrapper text-center">
            <div className="section-label">🤔 GOT QUESTIONS?</div>
            <h2 className="section-title">Frequently Asked <span className="text-gradient">Questions</span></h2>
            <p className="section-subtitle">Everything you need to know about the product and billing.</p>
          </motion.div>

          <motion.div className="faq-grid" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}>
            {faqs.map((faq, i) => (
              <motion.div key={i} variants={fadeUp} className={`faq-item ${openFaq === i ? 'active' : ''}`} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <div className="faq-question">
                  <span>{faq.q}</span>
                  <div className="faq-icon"><ChevronDown size={18} /></div>
                </div>
                <motion.div 
                  className="faq-answer-wrapper"
                  initial={false}
                  animate={{ height: openFaq === i ? 'auto' : 0, opacity: openFaq === i ? 1 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="faq-answer">{faq.a}</div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 12. Final CTA ── */}
      <section className="cta-section">
        <div className="particles"></div>
        <div className="container" style={{position: 'relative', zIndex: 2}}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
            <h2 className="cta-title">Ready to ace your next interview?</h2>
            <p className="cta-subtitle">Join successful candidates who transformed their careers with Elevate.</p>
            <button className="btn btn-white" onClick={() => navigate('/login')} style={{padding: '16px 44px', fontSize: '1.1rem', fontWeight: 700}}>
              Get Started Free <ArrowRight size={20} />
            </button>
            <p className="cta-note">No credit card required</p>
          </motion.div>
        </div>
      </section>

      {/* ── 12. Footer ── */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="footer-logo"><Brain className="footer-logo-icon" /> Elevate</div>
              <p className="footer-desc">Interview prep, perfected by AI. Master every interview with real-time feedback and intelligent guidance.</p>
              <div className="social-links">
                <a href="#" className="social-link"><Twitter size={20} /></a>
                <a href="#" className="social-link"><Linkedin size={20} /></a>
                <a href="#" className="social-link"><Github size={20} /></a>
              </div>
            </div>
            <div>
              <h4 className="footer-title">Product</h4>
              <ul className="footer-links">
                <li><a href="#features">Features</a></li>
                <li><a href="#pricing">Pricing</a></li>
                <li><a href="/blog">Blog</a></li>
                <li><a href="/login">Sign In</a></li>
              </ul>
            </div>
            <div>
              <h4 className="footer-title">Resources</h4>
              <ul className="footer-links">
                <li><a href="#">Help Center</a></li>
                <li><a href="#">Tutorials</a></li>
                <li><a href="#">API Docs</a></li>
                <li><a href="#">System Design Guide</a></li>
              </ul>
            </div>
            <div>
              <h4 className="footer-title">Company</h4>
              <ul className="footer-links">
                <li><a href="#">About Us</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Contact</a></li>
                <li><a href="#">Partners</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>Copyright © {new Date().getFullYear()} Elevate (RIPIS).</p>
            <div className="footer-bottom-links">
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top */}
      {showBackToTop && (
        <motion.button className="back-to-top" onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }} whileHover={{ y: -5 }}
        >
          <ChevronUp size={24} />
        </motion.button>
      )}
    </div>
  );
};

export default IntroPage;