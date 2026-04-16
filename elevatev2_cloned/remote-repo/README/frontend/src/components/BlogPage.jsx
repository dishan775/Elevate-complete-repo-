import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import '../styles/blog.css';

const BlogPage = () => {
  const navigate = useNavigate();

  // Scroll to top when loaded
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="blog-page">
      {/* Small Header just for navigation and theme toggle */}
      <nav className="blog-nav">
        <button className="blog-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
        <div style={{ marginLeft: 'auto' }}>
          <ThemeToggle />
        </div>
      </nav>

      <main className="blog-main">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Article Header */}
          <header className="article-header">
            <h1 className="blog-title">
              The Art of Clean Typography in Modern Web Design
            </h1>
            
            <div className="blog-meta">
              <div className="author-info">
                <img 
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80" 
                  alt="Sarah Jenkins" 
                  className="author-avatar"
                />
                <span className="author-name">Sarah Jenkins</span>
              </div>
              <span className="meta-divider">•</span>
              <time dateTime="2026-03-14">March 14, 2026</time>
              <span className="meta-divider">•</span>
              <span>6 min read</span>
            </div>
          </header>

          {/* Featured Image */}
          <figure className="featured-image-container">
            <img 
              src="https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" 
              alt="Clean workspace with minimal design elements" 
              className="featured-image"
            />
          </figure>

          {/* Article Content */}
          <div className="article-content">
            <p className="lead">
              In a world flooded with visual information, the ability to present text clearly is paramount. 
              Typography isn't just about choosing pretty fonts; it's about framing content in a way that respects the reader's time and cognitive load.
            </p>

            <h2>Why Readability Matters</h2>
            <p>
              When users arrive at a content-focused page, their primary goal is to consume information. Fast-moving animations, overly complex layouts, and low-contrast text all compete for the user's finite attention. By prioritizing readability, we strip away the noise and let the content shine.
            </p>
            <p>
              A well-structured article reduces eye strain, improves comprehension, and ultimately increases the time a user spends engaging with your material. This is achieved through careful consideration of line height, font sizing, and line length (measure).
            </p>

            <blockquote>
              "Good typography is like a clear glass goblet. You shouldn't notice the glass; you should only notice the beauty of the wine it holds." — Beatrice Warde
            </blockquote>

            <h2>Key Principles of Typographic Design</h2>
            
            <h3>1. The Measure (Line Length)</h3>
            <p>
              The optimal line length for readable text is generally considered to be between 45 and 75 characters per line (including spaces). If lines are too long, the reader's eye will have a hard time focusing on the text. If lines are too short, the eye will have to travel back and forth too often, breaking the reader's rhythm.
            </p>

            <h3>2. Visual Hierarchy</h3>
            <p>
              Hierarchy helps readers scan a document and quickly understand its structure. Through the use of scale, weight, and spacing, designers can guide the eye from the most important elements (like the Title) down to the body text.
            </p>
            
            <ul>
              <li><strong>H1 (Title):</strong> Should be the largest, immediately grabbing attention.</li>
              <li><strong>H2 (Subsections):</strong> Clearly divide the article into digestible chunks.</li>
              <li><strong>Body Text:</strong> The workhorse of your article. Must be legible above all else.</li>
            </ul>

            <h2>Embracing White Space</h2>
            <p>
              White space (or negative space) is the empty area between design elements. In typography, it manifests as margins, padding, and line-height. Giving your text room to breathe prevents it from looking dense and intimidating. Don't be afraid to use generous spacing around your headings and between paragraphs.
            </p>

            <h2>Conclusion</h2>
            <p>
              Designing for readability is a subtle art. It rarely draws attention to itself when done well, but its absence is immediately felt. By focusing on fundamental typographic principles, we can create content experiences that are not only beautiful but truly serve the reader.
            </p>
          </div>
        </motion.article>
      </main>
    </div>
  );
};

export default BlogPage;
