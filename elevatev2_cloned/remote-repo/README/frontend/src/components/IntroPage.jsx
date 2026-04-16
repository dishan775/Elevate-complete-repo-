import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { 
  Brain, Users, Target, TrendingUp, Award, Zap, 
  MessageSquare, BarChart3, Calendar, FileText, Mic, 
  Play, ArrowRight, CheckCircle2, ChevronUp, Github, 
  Twitter, Linkedin, Check, AlertTriangle
} from 'lucide-react';
import '../styles/intro.css';

const IntroPage = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const slideInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const slideInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="landing-page">
      {/* Scroll Progress Bar */}
      <motion.div
        style={{ scaleX, position: 'fixed', top: 0, left: 0, right: 0, height: '3px', background: 'var(--gradient-main)', transformOrigin: '0%', zIndex: 1000 }}
      />

      {/* ── 1. Navigation Navbar ── */}
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container nav-container">
          <div className="nav-logo" onClick={scrollToTop}>
            <Brain className="nav-logo-icon" size={isScrolled ? 24 : 28} />
            <span>Elevate</span>
          </div>
          
          <div className="nav-links">
            <a href="#home">Home</a>
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
            <a href="#pricing">Pricing</a>
            <a href="/blog">Blog</a>
          </div>

          <div className="nav-actions">
            <a href="/login" className="nav-signin" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>Sign In</a>
            <button className="btn btn-primary" onClick={() => navigate('/login')}>
              Get Started Free
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
              <span className="text-gradient">Ace Every Interview</span><br />
              with AI
            </motion.h1>
            
            <motion.p variants={fadeUp} className="hero-subtitle">
              Master interview skills, track your progress, and land your dream job with intelligent practice and real-time feedback.
            </motion.p>
            
            <motion.div variants={fadeUp} className="hero-ctas">
              <button className="btn btn-primary minimalist-btn" onClick={() => navigate('/login')}>
                Start Practicing Free <ArrowRight size={18} />
              </button>
              <button className="btn btn-outline minimalist-btn">
                <Play size={18} /> Watch Demo
              </button>
            </motion.div>

            <motion.div variants={fadeUp} className="hero-proof">
              <div className="hero-proof-item"><CheckCircle2 size={16} className="text-primary" style={{color: 'var(--primary)'}} /> No credit card required</div>
              <div className="hero-proof-item"><CheckCircle2 size={16} className="text-primary" style={{color: 'var(--primary)'}} /> 7-day free trial</div>
            </motion.div>
          </motion.div>

          <motion.div 
            className="hero-dashboard-wrapper"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="mockup hero-dashboard">
              <div className="mockup-header">
                <div className="mockup-dot red"></div>
                <div className="mockup-dot yellow"></div>
                <div className="mockup-dot green"></div>
              </div>
              <div className="dashboard-grid">
                <div className="dashboard-sidebar">
                  <div style={{height: '24px', width: '70%', background: 'var(--border)', borderRadius: '4px', marginBottom: '24px'}}></div>
                  <div style={{height: '16px', width: '90%', background: 'var(--bg-card)', borderRadius: '4px', marginBottom: '16px'}}></div>
                  <div style={{height: '16px', width: '60%', background: 'var(--bg-card)', borderRadius: '4px', marginBottom: '16px'}}></div>
                  <div style={{height: '16px', width: '80%', background: 'var(--bg-card)', borderRadius: '4px', marginBottom: '16px'}}></div>
                </div>
                <div className="dashboard-main practice-mockup">
                  <div className="mockup-badge">Behavioral Question</div>
                  <div className="mockup-question">"Tell me about a time you handled a difficult situation."</div>
                  <div className="mockup-timer">
                    <div className="mockup-recording-dot"></div>
                    Recording... 2:30 remaining
                  </div>
                  <div className="mockup-input-area">
                    <p style={{color: 'var(--text-gray)'}}>Well, in my previous role...</p>
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

      {/* ── 3. Stats Section ── */}
      <section className="stats-section">
        <div className="container">
          <motion.div 
            className="stats-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
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

      {/* ── 4. Features Section ── */}
      <section id="features" className="section-padding features-section">
        <div className="container split-layout">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="section-heading-wrapper"
          >
            <div className="section-label">🚀 POWERFUL FEATURES</div>
            <h2 className="section-title">Everything you need to succeed</h2>
            <p className="section-subtitle" style={{marginBottom: '32px'}}>
              From AI-powered mock interviews to comprehensive progress tracking, Elevate provides a complete toolkit for your interview success.
            </p>
            <button className="btn btn-primary minimalist-btn" onClick={() => navigate('/login')}>
              Explore All Features <ArrowRight size={18} />
            </button>
          </motion.div>

          <motion.div 
            className="features-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {[
              { icon: <MessageSquare />, title: "AI Mock Interviews", desc: "Practice with our advanced AI tailored to your specific role." },
              { icon: <Zap />, title: "Real-time Feedback", desc: "Get instant, contextual guidance without breaking your flow." },
              { icon: <BarChart3 />, title: "Progress Dashboard", desc: "Track improvements with detailed analytics over time." },
              { icon: <Calendar />, title: "GitHub-style Calendar", desc: "Build consistency with daily streak tracking." },
              { icon: <FileText />, title: "STAR Method Trainer", desc: "Master behavioral questions using proven frameworks." },
              { icon: <Mic />, title: "Voice Analysis", desc: "Improve your delivery, pacing, and tone with audio insights." }
            ].map((feature, i) => (
              <motion.div key={i} variants={fadeUp} className="feature-card">
                <div className="feature-card-icon">{feature.icon}</div>
                <h3 className="feature-card-title">{feature.title}</h3>
                <p className="feature-card-desc">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 5. Setup / Smart Practice Section ── */}
      <section id="how-it-works" className="section-padding">
        <div className="container split-layout reversed">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={slideInLeft}
            className="mockup-container"
          >
            <div className="mockup practice-mockup" style={{boxShadow: 'var(--shadow-lg)'}}>
              <div className="mockup-badge">System Design</div>
              <div className="mockup-question">"Design a scalable rate limiter."</div>
              <div className="mockup-timer">
                <div className="mockup-recording-dot"></div>
                Recording... 14:20 remaining
              </div>
              <div className="mockup-input-area" style={{minHeight: '200px'}}>
                <p style={{color: 'var(--text-dark)', fontFamily: 'monospace', fontSize: '0.9rem'}}>
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

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={slideInRight}
            className="section-heading-wrapper text-right"
          >
            <div className="section-label">🎯 SMART PRACTICE</div>
            <h2 className="section-title">Practice like you're in the real interview</h2>
            <p className="section-subtitle" style={{marginBottom: '32px'}}>
              Experience the pressure of real interviews in a safe environment. Our intelligent system adapts to your answers, asks follow-up questions, and provides hints precisely when you get stuck.
            </p>
            <button className="btn btn-primary minimalist-btn" onClick={() => navigate('/login')}>
              Try Mock Interview <ArrowRight size={18} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── 6. Progress Tracking Section ── */}
      <section className="section-padding" style={{background: 'var(--bg-subtle)'}}>
        <div className="container split-layout">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={slideInLeft}
            className="section-heading-wrapper"
          >
            <div className="section-label">📊 TRACK YOUR GROWTH</div>
            <h2 className="section-title">See your improvement in real-time</h2>
            <p className="section-subtitle" style={{marginBottom: '32px'}}>
              Visualize your journey from novice to master. Elevate provides deep analytics on your problem-solving speed, accuracy, and communication clarity over time.
            </p>
            <button className="btn btn-primary minimalist-btn" onClick={() => navigate('/login')}>
              View Dashboard Demo <ArrowRight size={18} />
            </button>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={slideInRight}
            className="mockup-container"
          >
            <div className="mockup dashboard-mockup">
              <div className="dash-header">
                <h3 style={{fontFamily: 'var(--font-heading)', fontSize: '1.25rem'}}>Your Dashboard</h3>
                <div className="dash-streak">7 Day Streak 🔥</div>
              </div>
              <div className="dash-charts"></div>
              <div className="dash-stats-grid">
                <div className="dash-stat-card">
                  <div className="dash-stat-val">127h</div>
                  <div className="dash-stat-name">Study Time</div>
                </div>
                <div className="dash-stat-card">
                  <div className="dash-stat-val">248</div>
                  <div className="dash-stat-name">Problems Solved</div>
                </div>
                <div className="dash-stat-card">
                  <div className="dash-stat-val">32</div>
                  <div className="dash-stat-name">Modules</div>
                </div>
                <div className="dash-stat-card">
                  <div className="dash-stat-val">87%</div>
                  <div className="dash-stat-name">Avg Score</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 7. Portfolio Builder Section ── */}
      <section className="section-padding">
        <div className="container split-layout reversed">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={slideInLeft}
            className="mockup-container"
          >
            <div className="mockup portfolio-mockup">
              <div className="mockup-header">
                <div className="mockup-dot red"></div>
                <div className="mockup-dot yellow"></div>
                <div className="mockup-dot green"></div>
                <div style={{fontSize: '0.75rem', color: 'var(--text-gray)', marginLeft: '12px'}}>johndoe.elevate.com</div>
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
                  <div style={{height: '80px', background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border)'}}></div>
                  <div style={{height: '80px', background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border)'}}></div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={slideInRight}
            className="section-heading-wrapper text-right"
          >
            <div className="section-label">💼 BUILD YOUR PORTFOLIO</div>
            <h2 className="section-title">Showcase your skills professionally</h2>
            <p className="section-subtitle" style={{marginBottom: '32px'}}>
              Turn your practice into proof. Automatically generate a stunning developer portfolio that highlights your verified skills, streak, and mock interview performance.
            </p>
            <button className="btn btn-primary minimalist-btn" onClick={() => navigate('/login')}>
              Create Portfolio <ArrowRight size={18} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── 8. AI Insights Section ── */}
      <section className="section-padding" style={{background: 'var(--bg-subtle)'}}>
        <div className="container split-layout">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={slideInLeft}
            className="section-heading-wrapper"
          >
            <div className="section-label">🤖 AI-POWERED INSIGHTS</div>
            <h2 className="section-title">Get personalized feedback instantly</h2>
            <p className="section-subtitle" style={{marginBottom: '32px'}}>
              Our AI doesn't just tell you if you're right or wrong. It analyzes your communication style, problem-solving approach, and technical accuracy to provide actionable recommendations.
            </p>
            <button className="btn btn-primary minimalist-btn" onClick={() => navigate('/login')}>
              See Feedback Example <ArrowRight size={18} />
            </button>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={slideInRight}
            className="mockup-container"
          >
            <div className="mockup ai-mockup">
              <h3 className="section-title" style={{fontSize: '1.5rem', textAlign: 'center'}}>Interview Analysis</h3>
              <div className="ai-score-ring">
                <span>87<span style={{fontSize: '1rem', color: 'var(--text-gray)'}}>/100</span></span>
              </div>
              
              <div className="ai-feedback-section">
                <div className="ai-feedback-title">Strengths</div>
                <div className="ai-feedback-list">
                  <div className="ai-feedback-item success">
                    <Check size={18} color="#22c55e" /> Clear communication
                  </div>
                  <div className="ai-feedback-item success">
                    <Check size={18} color="#22c55e" /> Good STAR structure
                  </div>
                  <div className="ai-feedback-item success">
                    <Check size={18} color="#22c55e" /> Confident delivery
                  </div>
                </div>
              </div>

              <div className="ai-feedback-section">
                <div className="ai-feedback-title">Areas to Improve</div>
                <div className="ai-feedback-list">
                  <div className="ai-feedback-item warning">
                    <AlertTriangle size={18} color="#eab308" /> Add more quantifiable metrics
                  </div>
                  <div className="ai-feedback-item warning">
                    <AlertTriangle size={18} color="#eab308" /> Speak slightly slower
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 9. Testimonials ── */}
      <section className="section-padding testimonials-section">
        <div className="container">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="section-heading-wrapper text-center"
          >
            <h2 className="section-title">Loved by job seekers everywhere</h2>
            <p className="section-subtitle">Join those who landed their dream jobs at top tech companies.</p>
          </motion.div>

          <motion.div 
            className="testimonials-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {[
              { name: "Sarah J.", company: "Google", letter: "S", quote: "Elevate completely transformed my interview prep. The real-time hints helped me understand how to approach problems without just giving me the answer." },
              { name: "Michael T.", company: "Meta", letter: "M", quote: "The mock interviews felt incredibly realistic. Getting immediate feedback on my communication style was a game changer for my behavioral rounds." },
              { name: "Priya R.", company: "Amazon", letter: "P", quote: "I loved the streak tracking and daily goals. It kept me accountable for 3 months straight, resulting in 4 offers!" }
            ].map((test, i) => (
              <motion.div key={i} variants={fadeUp} className="testimonial-card">
                <div className="test-stars">
                  {[...Array(5)].map((_, j) => <svg key={j} width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
                </div>
                <div className="test-quote">"{test.quote}"</div>
                <div className="test-author">
                  <div className="test-avatar">{test.letter}</div>
                  <div>
                    <div className="test-name">{test.name}</div>
                    <div className="test-company">Landed at {test.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 10. Pricing Section ── */}
      <section id="pricing" className="section-padding pricing-section">
        <div className="container">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="section-heading-wrapper text-center"
          >
            <h2 className="section-title">Start preparing today</h2>
            <p className="section-subtitle">Choose the plan that works for you.</p>
          </motion.div>

          <motion.div 
            className="pricing-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {/* Free Tier */}
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

            {/* Pro Tier */}
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
              <button className="btn btn-white" onClick={() => navigate('/login')} style={{color: 'var(--secondary)'}}>Get Started <ArrowRight size={18} /></button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── 11. Final CTA Section ── */}
      <section className="cta-section">
        <div className="particles"></div>
        <div className="container" style={{position: 'relative', zIndex: 2}}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
            <h2 className="cta-title">Ready to ace your next interview?</h2>
            <p className="cta-subtitle">Join successful candidates today.</p>
            <button className="btn btn-white minimalist-btn" onClick={() => navigate('/login')} style={{padding: '16px 40px', fontSize: '1.1rem', color: 'var(--primary)'}}>
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
              <div className="footer-logo">
                <Brain className="footer-logo-icon" /> Elevate
              </div>
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
                <li><a href="#features" onClick={(e) => { e.preventDefault(); navigate('/#features'); }}>Features</a></li>
                <li><a href="#pricing" onClick={(e) => { e.preventDefault(); navigate('/#pricing'); }}>Pricing</a></li>
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

      {/* Back to Top Button */}
      {showBackToTop && (
        <motion.button 
          className="back-to-top"
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          whileHover={{ y: -5 }}
        >
          <ChevronUp size={24} />
        </motion.button>
      )}
    </div>
  );
};

export default IntroPage;