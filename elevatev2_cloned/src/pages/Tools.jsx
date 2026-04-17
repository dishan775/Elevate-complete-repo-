import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeftRight, X, Lightbulb, RefreshCw, DollarSign, FileText, Sparkles } from 'lucide-react';
import '../styles/tools.css';

/* ═══════════════════════════════════
   1. CURRENCY CONVERTER
   API: frankfurter.app (free, no key)
═══════════════════════════════════ */
const CURRENCIES = ['USD','EUR','GBP','INR','AED','JPY','CAD','AUD','SGD','CHF','MYR','THB'];

function CurrencyConverter() {
  const [amount, setAmount] = useState('1000');
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('INR');
  const [result, setResult] = useState(null);
  const [rate, setRate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');

  const convert = useCallback(async () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount.'); return;
    }
    setLoading(true); setError('');
    try {
      const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${from}`);
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      const r = data.rates[to];
      setRate(r);
      setResult((parseFloat(amount) * r).toFixed(2));
      setLastUpdated(new Date().toLocaleTimeString());
    } catch {
      setError('Could not fetch rates. Please try again.');
    } finally { setLoading(false); }
  }, [amount, from, to]);

  useEffect(() => { convert(); }, [from, to]);

  const swap = () => { setFrom(to); setTo(from); setResult(null); };

  return (
    <div className="tool-card">
      <div className="tool-card-header">
        <div className="tool-icon" style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981' }}>💱</div>
        <div>
          <h3 style={{ color: 'var(--text-main)', marginBottom: 2 }}>Salary Currency Converter</h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Compare job offers across countries</p>
        </div>
      </div>

      <div className="cc-row">
        <div className="cc-field">
          <label>Amount</label>
          <input
            type="number"
            value={amount}
            min="0"
            onChange={e => setAmount(e.target.value)}
            onBlur={convert}
            placeholder="e.g. 100000"
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>FROM</label>
          <button className="cc-swap-btn" onClick={swap} title="Swap currencies">⇄</button>
          <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>TO</label>
        </div>
        <div className="cc-field">
          <label>From</label>
          <select value={from} onChange={e => setFrom(e.target.value)}>
            {CURRENCIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="cc-field" style={{ marginBottom: 16 }}>
        <label>To Currency</label>
        <select value={to} onChange={e => setTo(e.target.value)}>
          {CURRENCIES.filter(c => c !== from).map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {error && <p className="cc-error">⚠ {error}</p>}

      {loading ? (
        <div className="cc-loading">
          <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite', display: 'inline' }} /> Fetching live rates…
        </div>
      ) : result && (
        <div className="cc-result">
          <div>
            <div className="cc-result-amount">{parseFloat(result).toLocaleString()} {to}</div>
            <div className="cc-result-label">{parseFloat(amount).toLocaleString()} {from} at live rate</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>1 {from}</div>
            <div style={{ fontSize: '0.82rem', opacity: 0.8 }}>= {rate?.toFixed(4)} {to}</div>
          </div>
        </div>
      )}
      {lastUpdated && <p className="cc-rate-info">🕐 Last updated: {lastUpdated}</p>}

      <button className="modal-trigger-btn" style={{ marginTop: 16 }} onClick={convert}>
        <RefreshCw size={16} /> Refresh Rates
      </button>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ═══════════════════════════════════
   2. LIVE CHARACTER COUNTER
   For interview answer practice
═══════════════════════════════════ */
const CHAR_LIMIT = 500;

function CharacterCounter() {
  const [text, setText] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const textareaRef = useRef(null);

  const handleChange = (e) => {
    const val = e.target.value;
    if (val.length <= CHAR_LIMIT) {
      setText(val);
      setWordCount(val.trim() === '' ? 0 : val.trim().split(/\s+/).length);
    }
  };

  const used = text.length;
  const pct = (used / CHAR_LIMIT) * 100;
  const fillColor = pct < 60 ? '#10b981' : pct < 85 ? '#f59e0b' : '#f43f5e';
  const countColor = pct < 60 ? '#10b981' : pct < 85 ? '#f59e0b' : '#f43f5e';

  return (
    <div className="tool-card">
      <div className="tool-card-header">
        <div className="tool-icon" style={{ background: 'rgba(99,102,241,0.12)', color: 'var(--primary)' }}>
          <FileText size={22} />
        </div>
        <div>
          <h3 style={{ color: 'var(--text-main)', marginBottom: 2 }}>Answer Builder</h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Practice answers with live character & word count</p>
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Your Interview Answer
        </label>
      </div>

      <div className="char-counter-wrap">
        <textarea
          ref={textareaRef}
          className="char-textarea"
          placeholder="Type your answer here — e.g. 'Tell me about yourself…'"
          value={text}
          onChange={handleChange}
          rows={6}
        />
        <div className="char-counter-bar">
          <div
            className="char-counter-fill"
            style={{ width: `${pct}%`, background: fillColor }}
          />
        </div>
        <div className="char-counter-meta">
          <span className="word-count">📝 {wordCount} words</span>
          <span className="char-count-num" style={{ color: countColor }}>
            {used} / {CHAR_LIMIT} chars
          </span>
        </div>
      </div>

      {pct >= 85 && (
        <div style={{
          marginTop: 10, padding: '8px 14px', borderRadius: 8,
          background: pct === 100 ? 'rgba(244,63,94,0.1)' : 'rgba(245,158,11,0.1)',
          color: pct === 100 ? '#f43f5e' : '#f59e0b',
          fontSize: '0.8rem', fontWeight: 600,
        }}>
          {pct === 100 ? '🔴 Character limit reached! Keep answers concise.' : '🟡 Approaching limit — good interview answers are focused.'}
        </div>
      )}

      <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
        <button
          onClick={() => { setText(''); setWordCount(0); textareaRef.current?.focus(); }}
          className="btn btn-secondary"
          style={{ flex: 1, justifyContent: 'center', borderRadius: 10 }}
        >
          Clear
        </button>
        <button
          onClick={() => navigator.clipboard.writeText(text)}
          className="btn btn-primary"
          style={{ flex: 2, justifyContent: 'center', borderRadius: 10, fontSize: '0.9rem' }}
          disabled={!text}
        >
          <Sparkles size={15} /> Copy Answer
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════
   3. INTERVIEW TIPS MODAL
   Opens on button click, closes on
   outside click or close icon
═══════════════════════════════════ */
const TIPS = [
  { title: 'Use the STAR Method', body: 'Structure all behavioural answers with Situation, Task, Action, Result. Interviewers score on clarity of impact.' },
  { title: 'Think Out Loud', body: 'Walk through your reasoning before jumping to code. Senior engineers prefer process over speed.' },
  { title: '30-Second Rule', body: 'Keep every answer under 3 minutes. Start with the conclusion, then support it — never bury the lead.' },
  { title: 'Clarify Before Coding', body: 'Always ask 2–3 clarifying questions. This demonstrates engineering maturity and reduces rework.' },
  { title: 'State Complexity', body: 'Always explicitly mention time and space complexity. Even if your solution isn\'t optimal, showing awareness scores points.' },
  { title: 'Ask Good Questions Back', body: 'Prepare 3–4 smart questions for the interviewer. This signals genuine interest and strategic thinking.' },
];

function InterviewTipsModal() {
  const [open, setOpen] = useState(false);
  const overlayRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    if (open) { document.addEventListener('keydown', onKey); document.body.style.overflow = 'hidden'; }
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) setOpen(false);
  };

  return (
    <div className="tool-card">
      <div className="tool-card-header">
        <div className="tool-icon" style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b' }}>
          <Lightbulb size={22} />
        </div>
        <div>
          <h3 style={{ color: 'var(--text-main)', marginBottom: 2 }}>Interview Tips</h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Expert strategies from top engineers</p>
        </div>
      </div>

      <p style={{ color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: 4, fontSize: '0.9rem' }}>
        Six proven techniques used by engineers who cracked Google, Amazon, and Meta. Click below to reveal them before your next session.
      </p>

      <div style={{
        background: 'var(--surface-2)',
        border: '1px solid var(--card-border)',
        borderRadius: 12, padding: '14px 18px', marginBottom: 4,
        display: 'flex', gap: 12, alignItems: 'flex-start',
      }}>
        <span style={{ fontSize: '1.2rem' }}>💡</span>
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: 2 }}>Pro Tip of the Day</div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Always restate the problem in your own words before solving. This alone impresses 8 out of 10 interviewers.
          </div>
        </div>
      </div>

      <button
        className="modal-trigger-btn"
        onClick={() => setOpen(true)}
        id="openTipsModal"
      >
        <Lightbulb size={16} /> View All 6 Expert Tips
      </button>

      {/* MODAL */}
      {open && (
        <div className="modal-overlay" ref={overlayRef} onClick={handleOverlayClick}>
          <div className="modal-box">
            <button className="modal-close" onClick={() => setOpen(false)} title="Close">
              <X size={18} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div className="tool-icon" style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b' }}>
                <Lightbulb size={20} />
              </div>
              <div>
                <h3 style={{ color: 'var(--text-main)', letterSpacing: '-0.01em' }}>Expert Interview Tips</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 2 }}>Click outside or press Esc to close</p>
              </div>
            </div>

            {TIPS.map((tip, i) => (
              <div key={i} className="tip-item">
                <div className="tip-num">{i + 1}</div>
                <div className="tip-text">
                  <strong>{tip.title}:</strong> {tip.body}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════
   MAIN TOOLS PAGE
═══════════════════════════════════ */
export default function Tools() {
  return (
    <div className="tools-page">
      <div className="container">
        <div className="tools-hero">
          <div className="badge-pill animate-fade-in" style={{ marginBottom: 20 }}>
            <span className="badge-dot" /> Interview Prep Tools
          </div>
          <h1 className="animate-fade-in delay-100" style={{ fontSize: 'clamp(2rem,5vw,3rem)' }}>
            Smart tools to{' '}
            <span className="text-gradient">ace your prep</span>
          </h1>
          <p className="animate-fade-in delay-200" style={{ color: 'var(--text-muted)', maxWidth: 520, margin: '16px auto 0', fontSize: '1.05rem', lineHeight: 1.7 }}>
            Currency converter for global offers, answer builder with live counters, and expert tips modal — all in one.
          </p>
        </div>

        <div className="tools-grid">
          <CurrencyConverter />
          <CharacterCounter />
          <InterviewTipsModal />
        </div>
      </div>
    </div>
  );
}
