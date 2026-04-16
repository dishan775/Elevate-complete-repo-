import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'What is Elevate and who is it for?',
    a: 'Elevate is an AI-powered interview preparation platform designed for software engineers, CS students, and tech professionals. It covers Professional English communication, Programming challenges, and Core Computer Science theory — everything you need to ace modern technical interviews.'
  },
  {
    q: 'How does the AI feedback work?',
    a: 'Elevate analyses your responses in real time across three dimensions: technical correctness, clarity of communication, and logical structure. Instead of just marking answers right or wrong, it explains where your reasoning broke down and how to present your ideas more effectively — just like a senior engineer mentor would.'
  },
  {
    q: 'Do I need to log in to use Elevate?',
    a: 'You can explore most features without an account. Logging in unlocks session tracking, personal progress dashboards, and the Portfolio builder where you can showcase your skills and projects.'
  },
  {
    q: 'What modules does Elevate offer?',
    a: 'Elevate currently has three main modules: (1) Practice Professional English — for corporate communication, email writing, grammar, and mock interviews. (2) Learn Programming — coding challenges with AI-driven hints and syntax feedback. (3) Core Computer Science — theory questions on OS, DBMS, Networking, and System Design.'
  },
  {
    q: 'Is my progress saved between sessions?',
    a: 'Yes. Once you are logged in, every practice session is logged. You can review past answers, track improvement over time, and see which topic areas need more attention from your progress dashboard.'
  },
  {
    q: 'Can Elevate help with non-technical interviews too?',
    a: 'Absolutely. The Professional English module focuses specifically on corporate communication skills — writing effective emails, answering behavioural questions, and building fluency in a professional context. These skills are critical for interviews at any level.'
  },
  {
    q: 'Is Elevate free to use?',
    a: 'Elevate is currently free during its beta phase. All modules are fully accessible. Future premium tiers may offer advanced analytics and personalised coaching paths, but core practice features will remain free.'
  }
];
import '../styles/blog.css';

const articles = [
  {
    id: 1,
    title: 'How AI Is Transforming the Way Engineers Prepare for Technical Interviews',
    author: 'Elevate Team',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80',
    date: 'March 28, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    content: [
      {
        type: 'lead',
        text: 'The traditional interview prep playbook — Leetcode grind, cracking thick algorithm books, mock interviews with friends — is rapidly being supplemented, and in many cases replaced, by AI-powered tools that give you real-time, personalised feedback at scale.'
      },
      {
        type: 'h2', text: 'The Problem with Traditional Prep'
      },
      {
        type: 'p', text: 'Most candidates spend hundreds of hours on generic problem sets without ever getting meaningful feedback on their thought process. They can solve a binary tree problem but stumble when asked to explain their reasoning clearly — a skill that matters enormously in real interviews.'
      },
      {
        type: 'p', text: 'The gap between "knowing the answer" and "communicating it well" is where most candidates lose offers. AI tutors trained on thousands of real interview transcripts can now identify exactly where your explanation breaks down.'
      },
      {
        type: 'blockquote',
        text: '"The best engineers I hire aren\'t those who solve the problem fastest — they\'re the ones who think out loud, ask clarifying questions, and structure their approach." — Senior Engineering Manager, Google'
      },
      {
        type: 'h2', text: 'What Elevate Does Differently'
      },
      {
        type: 'p', text: 'Elevate\'s AI engine analyses your responses in real time across three dimensions: technical correctness, communication clarity, and logical structure. Rather than telling you if you got the answer right, it tells you how to present it better.'
      },
      {
        type: 'h3', text: 'Adaptive Question Generation'
      },
      {
        type: 'p', text: 'The system generates questions calibrated to your current performance level, gradually increasing difficulty as you improve. Spent three sessions on data structures? It\'ll push you toward dynamic programming and system design before you plateau.'
      },
      {
        type: 'h3', text: 'Instant Hint System'
      },
      {
        type: 'p', text: 'When you get stuck, Elevate\'s hint generator provides Socratic nudges — questions that guide your thinking rather than giving away the answer. This mirrors how senior engineers mentor juniors, building genuine intuition over time.'
      },
      {
        type: 'h2', text: 'Results That Speak'
      },
      {
        type: 'p', text: 'Users who practise with Elevate for 30+ days report significantly higher confidence going into technical screens. The combination of immediate feedback, structured questioning, and communication coaching addresses the full interview experience — not just algorithmic proficiency.'
      },
      {
        type: 'h2', text: 'Getting Started'
      },
      {
        type: 'p', text: 'Click "Practice" in the navbar to jump into any of the three modules: Professional English for communication skills, Learn Programming for coding challenges, or Core Computer Science for theory-based interview questions. Each session is logged so you can track your improvement over time.'
      }
    ]
  }
];

const Blog = () => {
  const navigate = useNavigate();
  const [article] = useState(articles[0]);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="blog-page">
      <nav className="blog-nav">
        <button className="blog-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
      </nav>

      <main className="blog-main">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <header className="article-header">
            <h1 className="blog-title">{article.title}</h1>
            <div className="blog-meta">
              <div className="author-info">
                <img src={article.avatar} alt={article.author} className="author-avatar" />
                <span className="author-name">{article.author}</span>
              </div>
              <span className="meta-divider">•</span>
              <time>{article.date}</time>
              <span className="meta-divider">•</span>
              <span>{article.readTime}</span>
            </div>
          </header>

          <figure className="featured-image-container">
            <img src={article.image} alt="AI interview preparation" className="featured-image" />
          </figure>

          <div className="article-content">
            {article.content.map((block, i) => {
              if (block.type === 'lead') return <p key={i} className="lead">{block.text}</p>;
              if (block.type === 'h2') return <h2 key={i}>{block.text}</h2>;
              if (block.type === 'h3') return <h3 key={i}>{block.text}</h3>;
              if (block.type === 'p') return <p key={i}>{block.text}</p>;
              if (block.type === 'blockquote') return <blockquote key={i}>{block.text}</blockquote>;
              return null;
            })}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              marginTop: '3rem',
              padding: '2rem',
              borderRadius: '16px',
              background: 'var(--color-accent-subtle, #eff6ff)',
              border: '1px solid var(--color-accent, #2563eb)',
              textAlign: 'center'
            }}
          >
            <h3 style={{ color: 'var(--color-accent, #2563eb)', marginBottom: '0.75rem' }}>
              Ready to practise?
            </h3>
            <p style={{ color: 'var(--color-text-secondary, #475569)', marginBottom: '1.25rem' }}>
              Jump into a module and start getting AI-powered feedback on your interview skills.
            </p>
            <button
              onClick={() => navigate('/practice/english')}
              style={{
                background: 'var(--color-accent, #2563eb)',
                color: '#fff',
                border: 'none',
                padding: '12px 28px',
                borderRadius: '10px',
                fontWeight: '600',
                fontSize: '0.95rem',
                cursor: 'pointer',
                transition: 'opacity 0.2s'
              }}
              onMouseOver={e => e.currentTarget.style.opacity = '0.85'}
              onMouseOut={e => e.currentTarget.style.opacity = '1'}
            >
              Start Practising →
            </button>
          </motion.div>
        </motion.article>

        {/* FAQ Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{ marginTop: '4rem', paddingBottom: '4rem' }}
        >
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: '800',
            color: 'var(--color-text, #0f172a)',
            marginBottom: '0.5rem',
            letterSpacing: '-0.02em'
          }}>
            Frequently Asked Questions
          </h2>
          <p style={{ color: 'var(--color-text-secondary, #475569)', marginBottom: '2rem', fontSize: '1rem' }}>
            Everything you need to know about Elevate.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqs.map((faq, i) => (
              <div
                key={i}
                style={{
                  border: '1px solid var(--color-border, #e2e8f0)',
                  borderRadius: '12px',
                  background: 'var(--color-surface, #fff)',
                  overflow: 'hidden',
                  transition: 'border-color 0.2s',
                  borderColor: openFaq === i ? 'var(--color-accent, #2563eb)' : 'var(--color-border, #e2e8f0)'
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '18px 20px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    color: 'var(--color-text, #0f172a)',
                    fontWeight: '600',
                    fontSize: '1rem',
                    gap: '12px'
                  }}
                >
                  <span>{faq.q}</span>
                  <motion.span
                    animate={{ rotate: openFaq === i ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ flexShrink: 0, color: 'var(--color-accent, #2563eb)' }}
                  >
                    <ChevronDown size={20} />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      style={{ overflow: 'hidden' }}
                    >
                      <p style={{
                        padding: '0 20px 18px',
                        color: 'var(--color-text-secondary, #475569)',
                        lineHeight: '1.75',
                        fontSize: '0.95rem',
                        margin: 0
                      }}>
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default Blog;
