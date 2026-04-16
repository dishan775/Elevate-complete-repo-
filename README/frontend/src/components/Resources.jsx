import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Search } from 'lucide-react';
import '../styles/resources.css';

const CATEGORIES = [
  { id: 'all',         label: 'All',             emoji: '✦' },
  { id: 'english',     label: 'English',          emoji: '💬' },
  { id: 'programming', label: 'Programming',      emoji: '⌨️' },
  { id: 'cs',          label: 'CS Theory',        emoji: '🧠' },
  { id: 'system',      label: 'System Design',    emoji: '🏗️' },
  { id: 'hr',          label: 'HR & Soft Skills', emoji: '🤝' },
];

// Category colour configs
const CAT_STYLES = {
  english:     { bg: 'rgba(99,102,241,0.85)',  text: '#fff' },
  programming: { bg: 'rgba(16,185,129,0.85)',  text: '#fff' },
  cs:          { bg: 'rgba(245,158,11,0.85)',  text: '#fff' },
  system:      { bg: 'rgba(34,211,238,0.85)',  text: '#0f172a' },
  hr:          { bg: 'rgba(244,63,94,0.85)',   text: '#fff' },
};

const RESOURCES = [
  {
    id: 1, category: 'english',
    title: 'Corporate Email Templates Used at FAANG',
    desc: 'Real-world email formats for status updates, escalations, and cross-team communication.',
    image: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=600&q=75',
    difficulty: 'Beginner', time: '15 min read',
    link: '/practice/english',
  },
  {
    id: 2, category: 'programming',
    title: 'Top 30 DSA Patterns for Coding Interviews',
    desc: 'Sliding window, two pointers, divide & conquer — master the templates that repeat across 90% of problems.',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=75',
    difficulty: 'Intermediate', time: '45 min read',
    link: '/practice/programming',
  },
  {
    id: 3, category: 'cs',
    title: 'OS Concepts Every SDE Must Know',
    desc: 'Processes vs Threads, deadlocks, scheduling, memory management — simplified with real interview Q&A.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=75',
    difficulty: 'Intermediate', time: '30 min read',
    link: '/practice/cs',
  },
  {
    id: 4, category: 'system',
    title: 'How to Design a URL Shortener — Step by Step',
    desc: 'Walk through requirements, high-level design, DB schema, hash function, and scalability — all in one guide.',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=75',
    difficulty: 'Advanced', time: '1 hr guide',
    link: '/practice/cs',
  },
  {
    id: 5, category: 'hr',
    title: 'STAR Method: 20 Behavioural Question Templates',
    desc: '"Tell me about a time you failed." Master every behavioural interview question with structured STAR answers.',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&q=75',
    difficulty: 'Beginner', time: '20 min read',
    link: '/tools',
  },
  {
    id: 6, category: 'programming',
    title: 'Dynamic Programming: Visual Guide with LeetCode Examples',
    desc: 'Fibonacci, knapsack, LCS, LIS — illustrated step-by-step so the pattern becomes intuitive forever.',
    image: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=600&q=75',
    difficulty: 'Advanced', time: '1.5 hr guide',
    link: '/practice/programming',
  },
  {
    id: 7, category: 'cs',
    title: 'DBMS Essentials: Normalisation to Indexing',
    desc: '1NF to BCNF explained, B+Tree vs Hash indexes, transactions and ACID — everything asked at campus and senior interviews.',
    image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&q=75',
    difficulty: 'Intermediate', time: '40 min read',
    link: '/practice/cs',
  },
  {
    id: 8, category: 'english',
    title: 'How to Introduce Yourself in 60 Seconds',
    desc: 'The perfect professional self-introduction framework — for video calls, walk-ins, and networking events.',
    image: 'https://images.unsplash.com/photo-1560439514-4e9645039924?w=600&q=75',
    difficulty: 'Beginner', time: '10 min read',
    link: '/practice/english',
  },
  {
    id: 9, category: 'system',
    title: 'CAP Theorem Made Simple',
    desc: 'Consistency, Availability, Partition Tolerance — understand the trade-offs that define every distributed system decision.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=75',
    difficulty: 'Advanced', time: '25 min read',
    link: '/practice/cs',
  },
  {
    id: 10, category: 'hr',
    title: 'Salary Negotiation Script That Actually Works',
    desc: 'Word-for-word scripts and psychological techniques to negotiate 20-30% above the initial offer — confidently.',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=75',
    difficulty: 'Beginner', time: '15 min read',
    link: '/tools',
  },
  {
    id: 11, category: 'programming',
    title: 'Graph Algorithms Cheatsheet',
    desc: 'BFS, DFS, Dijkstra, Bellman-Ford, MST — implementation templates in Python and Java with complexity table.',
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&q=75',
    difficulty: 'Advanced', time: '50 min read',
    link: '/practice/programming',
  },
  {
    id: 12, category: 'cs',
    title: 'Computer Networks: HTTP to DNS Explained',
    desc: "How does a browser load a webpage? TCP/IP handshake, DNS resolution, HTTP/2, TLS — the full stack, explained clearly.",
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&q=75',
    difficulty: 'Intermediate', time: '35 min read',
    link: '/practice/cs',
  },
];

const DIFF_COLORS = {
  Beginner:     '#10b981',
  Intermediate: '#f59e0b',
  Advanced:     '#f43f5e',
};

export default function Resources() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return RESOURCES.filter(r => {
      const matchCat = activeCategory === 'all' || r.category === activeCategory;
      const matchSearch = !search || r.title.toLowerCase().includes(search.toLowerCase()) || r.desc.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCategory, search]);

  return (
    <div className="resources-page">
      <div className="container">
        {/* Hero */}
        <div className="resources-hero">
          <div className="badge-pill animate-fade-in" style={{ marginBottom: 20 }}>
            <span className="badge-dot" /> Curated Learning Library
          </div>
          <h1 className="animate-fade-in delay-100">
            Interview <span className="text-gradient">Resource Hub</span>
          </h1>
          <p className="animate-fade-in delay-200" style={{ color: 'var(--text-muted)', maxWidth: 520, margin: '16px auto 0', fontSize: '1.05rem', lineHeight: 1.7 }}>
            12 hand-picked guides across English, Programming, CS Theory, System Design, and HR — filterable, searchable, and linked to your practice modules.
          </p>

          {/* Search */}
          <div className="animate-fade-in delay-300" style={{ position: 'relative', maxWidth: 420, margin: '28px auto 0' }}>
            <Search size={17} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            <input
              type="text"
              placeholder="Search resources…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '12px 16px 12px 44px',
                background: 'var(--surface)', border: '1px solid var(--card-border)',
                borderRadius: 12, color: 'var(--text-main)', fontSize: '0.9rem',
                fontFamily: 'var(--font-family)', outline: 'none', transition: 'all 0.2s',
              }}
              onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px var(--primary-glow)'; }}
              onBlur={e  => { e.target.style.borderColor = 'var(--card-border)'; e.target.style.boxShadow = 'none'; }}
            />
          </div>
        </div>

        {/* Filter pills */}
        <div className="filter-bar animate-fade-in">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={`filter-btn ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <span>{cat.emoji}</span> {cat.label}
              {activeCategory === cat.id && (
                <span style={{
                  background: 'rgba(255,255,255,0.25)', borderRadius: 10, padding: '1px 7px', fontSize: '0.72rem',
                }}>
                  {cat.id === 'all' ? RESOURCES.length : RESOURCES.filter(r => r.category === cat.id).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Count */}
        <div className="resource-count animate-fade-in">
          Showing <strong>{filtered.length}</strong> of {RESOURCES.length} resources
        </div>

        {/* Grid */}
        <div className="resources-grid">
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <div className="resources-empty">
                <div className="resources-empty-icon">🔍</div>
                <p>No resources found for "<strong>{search}</strong>". Try a different keyword.</p>
              </div>
            ) : filtered.map(r => (
              <motion.a
                key={r.id}
                href={r.link}
                className="resource-card"
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.22 }}
              >
                <div className="resource-img-wrap">
                  <img src={r.image} alt={r.title} className="resource-img" loading="lazy" />
                  <span
                    className="resource-category-badge"
                    style={{ background: CAT_STYLES[r.category]?.bg, color: CAT_STYLES[r.category]?.text }}
                  >
                    {CATEGORIES.find(c => c.id === r.category)?.emoji}{' '}
                    {CATEGORIES.find(c => c.id === r.category)?.label}
                  </span>
                </div>
                <div className="resource-body">
                  <div className="resource-title">{r.title}</div>
                  <p className="resource-desc">{r.desc}</p>
                  <div className="resource-footer">
                    <div className="resource-meta">
                      <span style={{ color: DIFF_COLORS[r.difficulty], fontWeight: 600 }}>{r.difficulty}</span> · {r.time}
                    </div>
                    <div className="resource-action">
                      Open <ArrowRight size={13} />
                    </div>
                  </div>
                </div>
              </motion.a>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
