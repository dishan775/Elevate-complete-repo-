import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, CheckCircle, ChevronRight, Loader } from 'lucide-react';
import usePracticeStore from '../store/practiceStore';

/* ── Typewriter hook ── */
function useTypewriter(texts, speed = 38) {
  const [display, setDisplay] = useState('');
  const [idx, setIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const cur = texts[idx];
    const timeout = setTimeout(() => {
      if (!deleting) {
        setDisplay(cur.slice(0, charIdx + 1));
        if (charIdx + 1 === cur.length) setTimeout(() => setDeleting(true), 1800);
        else setCharIdx(c => c + 1);
      } else {
        setDisplay(cur.slice(0, charIdx - 1));
        if (charIdx === 0) { setDeleting(false); setIdx(i => (i + 1) % texts.length); }
        else setCharIdx(c => c - 1);
      }
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, idx, texts, speed]);
  return display;
}

/* ── Mock Interview Card (hero right panel) ── */
const mockMessages = [
  { role: 'ai',   text: 'Explain the difference between TCP and UDP.' },
  { role: 'user', text: 'TCP is connection-based and guarantees delivery. UDP is connectionless and faster — used for streaming.' },
  { role: 'ai',   text: '✅ Great! Now, when would you choose UDP over TCP in a production system?' },
];

function MockInterviewCard() {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (shown < mockMessages.length) {
      const t = setTimeout(() => setShown(s => s + 1), shown === 0 ? 600 : 1800);
      return () => clearTimeout(t);
    }
  }, [shown]);
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--card-border)',
      borderRadius: 20,
      overflow: 'hidden',
      boxShadow: '0 24px 64px rgba(99,102,241,0.2), 0 0 0 1px rgba(99,102,241,0.1)',
      width: '100%', maxWidth: 420,
    }}>
      {/* Card header */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
        padding: '14px 18px',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f43f5e' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
        <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', marginLeft: 8, fontWeight: 600 }}>
          🤖 Elevate AI Interview — Live Session
        </span>
      </div>
      {/* Messages */}
      <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: 12, minHeight: 220 }}>
        {mockMessages.slice(0, shown).map((m, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: m.role === 'ai' ? 'flex-start' : 'flex-end',
            animation: 'fadeInUp 0.4s ease',
          }}>
            {m.role === 'ai' && (
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', flexShrink: 0, marginRight: 8, marginTop: 2 }}>AI</div>
            )}
            <div style={{
              background: m.role === 'ai' ? 'var(--surface-2)' : 'linear-gradient(135deg,#6366f1,#4f46e5)',
              color: m.role === 'ai' ? 'var(--text-main)' : '#fff',
              padding: '10px 14px', borderRadius: m.role === 'ai' ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
              fontSize: '0.82rem', lineHeight: 1.55, maxWidth: '82%',
              border: m.role === 'ai' ? '1px solid var(--card-border)' : 'none',
            }}>
              {m.text}
            </div>
          </div>
        ))}
        {shown < mockMessages.length && (
          <div style={{ display: 'flex', gap: 4, paddingLeft: 36 }}>
            {[0,1,2].map(i => (
              <div key={i} style={{
                width: 7, height: 7, borderRadius: '50%', background: 'var(--primary)',
                animation: `bounce 1.2s ${i * 0.2}s ease-in-out infinite`,
              }} />
            ))}
          </div>
        )}
      </div>
      {/* Footer score */}
      <div style={{
        borderTop: '1px solid var(--card-border)',
        padding: '10px 18px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'var(--surface-2)',
      }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Session Score</span>
        <div style={{ display: 'flex', gap: 4 }}>
          {[1,2,3,4,5].map(s => (
            <div key={s} style={{ width: 20, height: 6, borderRadius: 3, background: s <= 4 ? '#10b981' : 'var(--card-border)' }} />
          ))}
        </div>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981' }}>80%</span>
      </div>
      <style>{`
        @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-8px)} }
      `}</style>
    </div>
  );
}

/* ── Module cards with embedded visual previews ── */
function EnglishPreview() {
  const { xp, level, latestScore, badge, loading } = usePracticeStore();
  const phrases = [
    `Current Level: ${level} (${badge})`,
    `Total XP: ${xp}`,
    `Latest Score: ${latestScore}% ✅`
  ];
  const word = useTypewriter(phrases, 45);

  if (loading) return (
    <div style={{ background: 'var(--surface-2)', borderRadius: 12, padding: '24px', border: '1px solid var(--card-border)', marginTop: 16, display: 'flex', justifyContent: 'center' }}>
      <Loader className="animate-spin" size={20} color="var(--primary)" />
    </div>
  );

  return (
    <div style={{ background: 'var(--surface-2)', borderRadius: 12, padding: '14px', border: '1px solid var(--card-border)', marginTop: 16 }}>
      <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', marginBottom: 8, fontWeight: 600, letterSpacing: '0.05em' }}>💬 LIVE AI STATS</div>
      <div style={{
        background: 'rgba(99,102,241,0.08)', borderRadius: 8, padding: '10px 12px',
        fontSize: '0.8rem', color: '#818cf8', fontFamily: 'monospace', minHeight: 48,
        border: '1px solid rgba(99,102,241,0.2)',
        display: 'flex', alignItems: 'center'
      }}>
        {word}<span style={{ borderRight: '2px solid #818cf8', animation: 'blink 0.9s step-end infinite', marginLeft: 1 }} />
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        {['XP', 'Level', 'Score'].map((l, i) => {
          const val = i === 0 ? (xp % 100) : i === 1 ? (level * 10) : latestScore;
          return (
            <div key={l} style={{ flex: 1 }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-subtle)', marginBottom: 3 }}>{l}</div>
              <div style={{ height: 4, borderRadius: 2, background: 'var(--card-border)', overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 2, background: i === 0 ? '#d946ef' : i === 1 ? '#f59e0b' : '#818cf8', width: `${val}%`, transition: 'width 1s ease' }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProgrammingPreview() {
  return (
    <div style={{ background: '#0d1117', borderRadius: 12, padding: '14px', marginTop: 16, border: '1px solid #30363d', fontFamily: 'monospace' }}>
      <div style={{ fontSize: '0.65rem', color: '#6e7681', marginBottom: 8 }}>// Reverse a linked list</div>
      <div style={{ fontSize: '0.78rem', lineHeight: 1.7 }}>
        <span style={{ color: '#ff7b72' }}>def </span>
        <span style={{ color: '#d2a8ff' }}>reverse</span>
        <span style={{ color: '#c9d1d9' }}>(head):</span><br />
        <span style={{ color: '#c9d1d9' }}>  prev </span>
        <span style={{ color: '#ff7b72' }}>= </span>
        <span style={{ color: '#79c0ff' }}>None</span><br />
        <span style={{ color: '#c9d1d9' }}>  </span>
        <span style={{ color: '#ff7b72' }}>while </span>
        <span style={{ color: '#c9d1d9' }}>head:</span><br />
        <span style={{ color: '#c9d1d9' }}>    nxt </span>
        <span style={{ color: '#ff7b72' }}>= </span>
        <span style={{ color: '#c9d1d9' }}>head.next</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, paddingTop: 8, borderTop: '1px solid #30363d' }}>
        <span style={{ fontSize: '0.68rem', color: '#3fb950' }}>✓ O(n) time · O(1) space</span>
        <span style={{ fontSize: '0.68rem', color: '#6e7681' }}>Python</span>
      </div>
    </div>
  );
}

function CSPreview() {
  const cards = [
    { q: 'What is virtual memory?', tag: 'OS' },
    { q: 'Explain ACID properties', tag: 'DBMS' },
  ];
  const [flip, setFlip] = useState(false);
  useEffect(() => { const t = setInterval(() => setFlip(f => !f), 2200); return () => clearInterval(t); }, []);
  const card = cards[flip ? 1 : 0];
  return (
    <div style={{ marginTop: 16 }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(251,191,36,0.06))',
        border: '1px solid rgba(245,158,11,0.25)',
        borderRadius: 12, padding: '14px',
        animation: 'fadeInUp 0.4s ease', key: card.q,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#f59e0b', background: 'rgba(245,158,11,0.15)', padding: '2px 8px', borderRadius: 4 }}>{card.tag}</span>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-subtle)' }}>Flash card</span>
        </div>
        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: 8 }}>{card.q}</div>
        <div style={{ height: 1, background: 'var(--card-border)', margin: '8px 0' }} />
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Tap to reveal answer →</div>
      </div>
      <div style={{ display: 'flex', gap: 6, marginTop: 8, justifyContent: 'center' }}>
        {cards.map((_, i) => (
          <div key={i} style={{ width: i === (flip?1:0) ? 16 : 6, height: 6, borderRadius: 3, background: i === (flip?1:0) ? '#f59e0b' : 'var(--card-border)', transition: 'all 0.3s' }} />
        ))}
      </div>
    </div>
  );
}

function ReadingPreview() {
  return (
    <div style={{ marginTop: 16, background: 'var(--surface-2)', borderRadius: 12, padding: '14px', border: '1px solid var(--card-border)' }}>
      <div style={{ fontSize: '0.65rem', color: 'var(--text-subtle)', marginBottom: 8, fontWeight: 600, letterSpacing: '0.05em' }}>📄 TECHNICAL PASSAGE</div>
      {['████████ ████ ██ ████████', '████████████ ██ ████', '████ ████████████████'].map((line, i) => (
        <div key={i} style={{ height: 8, borderRadius: 4, background: `rgba(99,102,241,${0.08 + i*0.03})`, marginBottom: 6, width: ['90%','75%','60%'][i] }} />
      ))}
      <div style={{ marginTop: 10, padding: '8px 10px', background: 'rgba(244,63,94,0.08)', borderRadius: 8, border: '1px solid rgba(244,63,94,0.2)' }}>
        <div style={{ fontSize: '0.7rem', color: '#f43f5e', fontWeight: 600 }}>⚡ Reading speed: 240 wpm</div>
        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 2 }}>Comprehension: 88% ↑</div>
      </div>
    </div>
  );
}

const MODULES = [
  {
    title: 'Practice Professional English',
    emoji: '💬',
    tag: 'COMMUNICATION',
    tagColor: '#818cf8',
    tagBg: 'rgba(129,140,248,0.12)',
    desc: 'AI scores your tone, clarity and grammar in real-time.',
    path: '/practice/english',
    Preview: EnglishPreview,
  },
  {
    title: 'Learn Programming',
    emoji: '⌨️',
    tag: 'CODING',
    tagColor: '#10b981',
    tagBg: 'rgba(16,185,129,0.12)',
    desc: 'Solve DSA challenges with syntax hints and complexity analysis.',
    path: '/practice/programming',
    Preview: ProgrammingPreview,
  },
  {
    title: 'Core Computer Science',
    emoji: '🧠',
    tag: 'CS THEORY',
    tagColor: '#f59e0b',
    tagBg: 'rgba(245,158,11,0.12)',
    desc: 'OS, DBMS, Networks — flashcards and mock Q&A.',
    path: '/practice/cs',
    Preview: CSPreview,
  },
  {
    title: 'Enhance Reading Ability',
    emoji: '📖',
    tag: 'READING',
    tagColor: '#f43f5e',
    tagBg: 'rgba(244,63,94,0.12)',
    desc: 'Speed-read technical docs with comprehension tracking.',
    path: '/practice/reading',
    Preview: ReadingPreview,
  },
];

/* ── How it works ── */
const STEPS = [
  { icon: '🎯', label: 'Choose a Module', sub: 'Pick English, Coding, CS, or Reading' },
  { icon: '🤖', label: 'AI Interviews You', sub: 'Adaptive questions, real interview style' },
  { icon: '📊', label: 'Get Instant Feedback', sub: 'Scores, corrections, improvement tips' },
  { icon: '🏆', label: 'Land the Offer', sub: 'Confidence-tested, interview-ready' },
];

/* ── Company logos (SVG text badges) ── */
const COMPANIES = ['Google','Amazon','Meta','Microsoft','Adobe','Flipkart','Infosys','TCS'];

const STATS = [
  { num: '10K+', label: 'Sessions Done',   icon: '⚡', color: 'var(--cyan)' },
  { num: '95%',  label: 'Confidence Rate', icon: '🏆', color: '#f59e0b' },
  { num: '4',    label: 'Core Modules',    icon: '🎯', color: '#10b981' },
  { num: '24/7', label: 'AI Available',    icon: '🤖', color: 'var(--primary)' },
];

export default function Home() {
  const headline = useTypewriter(['Tech Interviews.', 'FAANG Interviews.', 'Dream Offers.'], 55);
  const { fetchSummary } = usePracticeStore();

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return (
    <div style={{ paddingTop: 60, paddingBottom: 120 }}>

      {/* ══ HERO ══ */}
      <section className="container" style={{ marginBottom: 100 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1fr) minmax(0,420px)',
          gap: 56, alignItems: 'center',
        }}>
          {/* Left */}
          <div>
            <div className="badge-pill animate-fade-in" style={{ marginBottom: 24, width: 'fit-content' }}>
              <span className="badge-dot" />
              AI-Powered · No more grinding alone
            </div>
            <h1 className="animate-fade-in delay-100" style={{ marginBottom: 10 }}>
              Crack Your<br />
              <span className="text-gradient">
                {headline}<span style={{ borderRight: '4px solid var(--primary)', animation: 'blink 0.9s step-end infinite', marginLeft: 2 }} />
              </span>
            </h1>
            <p className="animate-fade-in delay-200" style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: 480, lineHeight: 1.75, marginBottom: 36 }}>
              Real-time AI feedback on your English, Coding, and CS answers —
              exactly like a real interview, but safe to fail and learn.
            </p>
            <div className="animate-fade-in delay-300" style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 40 }}>
              <Link to="/practice/english" className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '1rem', borderRadius: 12 }}>
                <Zap size={17} /> Start Interview Prep
              </Link>
              <Link to="/resources" className="btn btn-secondary" style={{ padding: '14px 28px', fontSize: '1rem', borderRadius: 12 }}>
                Browse Resources <ArrowRight size={16} />
              </Link>
            </div>
            {/* Social proof */}
            <div className="animate-fade-in delay-400" style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              {[
                { icon: '✅', text: 'No credit card required' },
                { icon: '⚡', text: 'Ready in 30 seconds' },
                { icon: '🔒', text: 'Private & secure' },
              ].map(p => (
                <div key={p.text} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  <span>{p.icon}</span> {p.text}
                </div>
              ))}
            </div>
          </div>

          {/* Right — mock interview */}
          <div className="animate-fade-in delay-200" style={{ position: 'relative' }}>
            {/* glow orb behind card */}
            <div style={{
              position: 'absolute', width: 300, height: 300, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)',
              top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
              pointerEvents: 'none', zIndex: 0,
            }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <MockInterviewCard />
            </div>
            {/* floating badge */}
            <div style={{
              position: 'absolute', bottom: -16, right: -12,
              background: 'var(--surface)', border: '1px solid var(--card-border)',
              borderRadius: 20, padding: '10px 16px', boxShadow: 'var(--shadow-md)',
              display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.78rem',
              color: 'var(--text-main)', fontWeight: 600, zIndex: 2,
            }}>
              <CheckCircle size={14} color="#10b981" />
              Offer received! 🎉
            </div>
          </div>
        </div>
      </section>

      {/* ══ STATS ROW ══ */}
      <section className="container" style={{ marginBottom: 96 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
          {STATS.map(s => (
            <div key={s.label} className="stat-card">
              <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>{s.icon}</div>
              <div className="stat-num" style={{ fontSize: '1.8rem' }}>{s.num}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ MODULE CARDS with live previews ══ */}
      <section className="container" style={{ marginBottom: 96 }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <div className="section-eyebrow animate-fade-in">🎯 Choose your module</div>
          <h2 className="animate-fade-in delay-100">
            See what you'll <span className="text-gradient">practise</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', marginTop: 12, fontSize: '1rem' }}>
            Hover or tap a module — each preview shows exactly what the session looks like inside.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>
          {MODULES.map((m) => (
            <Link key={m.path} to={m.path} className="feature-card animate-fade-in" style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{
                  fontSize: '2rem', width: 52, height: 52, borderRadius: 14,
                  background: m.tagBg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `1px solid ${m.tagColor}25`,
                }}>
                  {m.emoji}
                </div>
                <span style={{
                  fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em',
                  color: m.tagColor, background: m.tagBg,
                  padding: '4px 10px', borderRadius: 20, border: `1px solid ${m.tagColor}30`,
                }}>
                  {m.tag}
                </span>
              </div>
              <h3 style={{ color: 'var(--text-main)', marginBottom: 6 }}>{m.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: 4 }}>{m.desc}</p>

              {/* ← LIVE PREVIEW */}
              <m.Preview />

              <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem', marginTop: 14 }}>
                Start Module <ChevronRight size={15} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section className="container" style={{ marginBottom: 96 }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="section-eyebrow animate-fade-in">🗺️ The journey</div>
          <h2 className="animate-fade-in delay-100">How Elevate <span className="text-gradient">works</span></h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 20, position: 'relative' }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ textAlign: 'center', position: 'relative' }}>
              {i < STEPS.length - 1 && (
                <div style={{
                  display: 'none', // hidden on small, visible via media query ideally
                }} />
              )}
              <div style={{
                width: 72, height: 72, borderRadius: '50%', margin: '0 auto 16px',
                background: 'var(--surface)', border: '1px solid var(--card-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2rem', boxShadow: 'var(--shadow-sm)',
                position: 'relative',
              }}>
                {s.icon}
                <div style={{
                  position: 'absolute', top: -4, right: -4,
                  width: 22, height: 22, borderRadius: '50%',
                  background: 'var(--primary)', color: '#fff',
                  fontSize: '0.65rem', fontWeight: 800,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {i + 1}
                </div>
              </div>
              <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: 6, fontSize: '0.95rem' }}>{s.label}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </section>



      {/* ══ BOTTOM CTA ══ */}
      <section className="container">
        <div style={{
          background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #7c3aed 100%)',
          borderRadius: 24, padding: '60px 48px', textAlign: 'center',
          position: 'relative', overflow: 'hidden',
          boxShadow: '0 24px 64px rgba(99,102,241,0.35)',
        }}>
          <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', top: -160, right: -100 }} />
          <div style={{ position: 'absolute', width: 280, height: 280, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', bottom: -100, left: -60 }} />
          <div style={{ position: 'relative' }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>🚀</div>
            <h2 style={{ color: '#fff', marginBottom: 14, fontSize: '2rem' }}>
              Ready to land your dream job?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.05rem', maxWidth: 460, margin: '0 auto 36px', lineHeight: 1.7 }}>
              Join engineers who stopped guessing and started practising smarter. Your next offer is one session away.
            </p>
            <Link
              to="/login"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: '#fff', color: '#4f46e5',
                fontWeight: 700, fontSize: '1rem',
                padding: '14px 36px', borderRadius: 12, textDecoration: 'none',
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                transition: 'all 0.25s',
              }}
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.25)'; }}
              onMouseOut={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)'; }}
            >
              Create Free Account <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @media (max-width: 768px) {
          section .container > div[style*="grid-template-columns: minmax(0,1fr) minmax(0,420px)"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
