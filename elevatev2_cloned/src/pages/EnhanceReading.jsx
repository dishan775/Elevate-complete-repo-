import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Zap, Book, BookOpen, MoveLeft, Loader, CheckCircle, Award, Eye, Pause, Play, RotateCcw, X, ZoomIn, ZoomOut } from 'lucide-react';
import usePracticeStore from '../store/practiceStore';
import '../styles/enhance-reading.css';

export default function EnhanceReading() {
  const navigate = useNavigate();
  const [readingSubTab, setReadingSubTab] = useState('comprehension');
  const { addXP } = usePracticeStore();

  // --- Reading Comprehension States ---
  const [readingTopic, setReadingTopic] = useState('IT Security Policy Update');
  const [readingData, setReadingData] = useState(null);
  const [readingLoading, setReadingLoading] = useState(false);
  const [readingAnswers, setReadingAnswers] = useState({});
  const [readingScore, setReadingScore] = useState(null);

  // --- Fast Reading States ---
  const [frIsPlaying, setFrIsPlaying] = useState(false);
  const [frWordIndex, setFrWordIndex] = useState(0);
  const [frSpeed, setFrSpeed] = useState(250);
  const [frFinished, setFrFinished] = useState(false);
  const frIntervalRef = useRef(null);
  const frPassage = `Success is simple. Do what is right, the right way, at the right time. You know about habits. They can be hard to break and hard to create. But we are unknowingly acquiring new ones all the time. When we start and continue a way of thinking or a way of acting over a long enough period, we have created a new habit. The choice we face is whether or not we want to form habits that get us what we want from life. If we do, then the Focusing Question is the most powerful success habit we can have. For me, the Focusing Question is a way of life. I use it to find my most leveraged priority, make the most out of my time, and get the biggest bang for my buck. Whenever the outcome absolutely matters, I ask it. I ask it when I wake up and start my day. I ask it when I get to work, and again when I get home. What is the ONE Thing I can do such that by doing it everything else will be easier or unnecessary? And when I know the answer, I continue to ask it until I can see the connections and all my dominoes are lined up. Obviously, you can drive yourself nuts analyzing every little aspect of everything you might do. I do not do that, and you should not either. Start with the big-picture question and see where it takes you. Over time, you will develop your own sense of when to use the big-picture question and when to use the small-focus question. The Focusing Question is the foundational habit I use to achieve extraordinary results and lead a big life.`;
  const frWords = frPassage.split(/\s+/);

  // --- Read Books States ---
  const [bookOpen, setBookOpen] = useState(false);
  const [bookPage, setBookPage] = useState(0);
  const [bookZoom, setBookZoom] = useState(1);
  const bookPages = [
    '/images/books/one-thing-page1.png',
    '/images/books/one-thing-page2.png',
    '/images/books/one-thing-page3.png',
  ];

  const generateReading = async () => {
    setReadingLoading(true);
    setReadingData(null);
    setReadingAnswers({});
    setReadingScore(null);
    try {
      const res = await fetch('https://elevate-backend-2v69.onrender.com/api/english/generate-reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: readingTopic })
      });
      const data = await res.json();
      if(data.success) setReadingData(data.data);
    } catch (err) { console.error(err); }
    finally { setReadingLoading(false); }
  };

  const submitReadingQuiz = () => {
    if (!readingData) return;
    const total = readingData.questions.length;
    let correct = 0;
    readingData.questions.forEach((q, idx) => {
      if (readingAnswers[idx] === q.correctIndex) correct++;
    });
    const pct = Math.round((correct / total) * 100);
    setReadingScore(pct);
    if (pct === 100) addXP(25, 'Perfect Reading Score');
    else addXP(10, 'Reading Task Completion');
  };

  return (
    <div className="enhance-reading-layout">
      {/* Back Button */}
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <button className="er-back-nav" onClick={() => navigate('/home')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <MoveLeft size={16} /> Back to Home
        </button>
      </div>

      {/* Header */}
      <div className="er-header">
        <BookOpen size={48} color="#f59e0b" style={{ marginBottom: '16px' }} />
        <h1 className="er-title">Enhance <span className="er-title-highlight">Reading Skills</span></h1>
        <p className="er-subtitle">Boost comprehension and reading speed with curated content.</p>
      </div>

      {/* Tabs */}
      <div className="er-tabs">
        {[
          { id: 'comprehension', label: 'Reading Comprehension', icon: <FileText size={16}/> },
          { id: 'fastread', label: 'Fast Reading', icon: <Zap size={16}/> },
          { id: 'books', label: 'Read Books', icon: <Book size={16}/> },
        ].map(t => (
          <button 
            key={t.id} 
            className={`er-tab ${readingSubTab === t.id ? 'active' : ''}`}
            onClick={() => { 
              setReadingSubTab(t.id); 
              if(t.id === 'fastread') { 
                setFrIsPlaying(false); 
                setFrWordIndex(0); 
                setFrFinished(false); 
                clearInterval(frIntervalRef.current); 
              } 
            }}
          >
            {t.icon} <span style={{ color: readingSubTab === t.id ? '#f1f5f9' : 'inherit' }}>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="er-content-container animate-fade-in">

        {/* ═══ SUB-TAB: Comprehension ═══ */}
        {readingSubTab === 'comprehension' && (
          <div className="er-comp-card animate-fade-in">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <FileText size={18}/> Technical Passage
            </h3>
            
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ flex: '1 1 250px' }}>
                <select value={readingTopic} onChange={(e) => setReadingTopic(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', cursor: 'pointer', outline: 'none', background: '#0f172a', border: '1px solid #334155', color: '#f1f5f9' }}>
                  <option value="IT Security Policy Update">IT Security Policy Update</option>
                  <option value="Quarterly Earnings Memo">Quarterly Earnings Memo</option>
                  <option value="Technical Outage Post-Mortem">Technical Outage Post-Mortem</option>
                  <option value="HR Performance Review Guidelines">HR Performance Review Guidelines</option>
                  <option value="Client Project Kickoff">Client Project Kickoff</option>
                </select>
              </div>
              <button onClick={generateReading} disabled={readingLoading} className="er-control-btn" style={{ padding: '12px 24px', borderRadius: '8px' }}>
                {readingLoading ? <><Loader size={18} className="animate-spin" /> Generating...</> : <><Book size={18} /> Generate Passage</>}
              </button>
            </div>

            {readingData && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ borderLeft: '4px solid #a78bfa', paddingLeft: '24px' }}>
                  <h2 style={{ fontSize: '1.6rem', marginBottom: '16px', color: '#f8fafc' }}>{readingData.title}</h2>
                  <div className="er-comp-passage">{readingData.content}</div>
                </div>

                <div style={{ background: '#0f172a', padding: '24px', borderRadius: '12px', border: '1px solid #334155' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle size={18} color="#10b981"/> Comprehension Questions
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {readingData.questions.map((q, qIdx) => (
                      <div key={qIdx} style={{ paddingBottom: '24px', borderBottom: qIdx < readingData.questions.length - 1 ? '1px solid #334155' : 'none' }}>
                        <p style={{ fontWeight: '600', fontSize: '1.05rem', marginBottom: '16px', color: '#e2e8f0' }}>{qIdx + 1}. {q.question}</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {q.options.map((opt, oIdx) => {
                            const isSelected = readingAnswers[qIdx] === oIdx;
                            let bgColor = isSelected ? 'rgba(124, 58, 237, 0.1)' : '#1e293b';
                            let bdColor = isSelected ? '#a78bfa' : '#334155';
                            let textColor = isSelected ? '#c4b5fd' : '#cbd5e1';

                            if (readingScore !== null) {
                              const isCorrect = q.correctIndex === oIdx;
                              if (isCorrect) { bgColor = 'rgba(16, 185, 129, 0.1)'; bdColor = '#34d399'; textColor = '#6ee7b7'; }
                              else if (isSelected && !isCorrect) { bgColor = 'rgba(239, 68, 68, 0.1)'; bdColor = '#f87171'; textColor = '#fca5a5'; }
                            }

                            return (
                              <button key={oIdx} disabled={readingScore !== null} onClick={() => setReadingAnswers({...readingAnswers, [qIdx]: oIdx })}
                                style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderRadius: '8px', border: `1px solid ${bdColor}`, backgroundColor: bgColor, color: textColor, cursor: readingScore !== null ? 'default' : 'pointer', textAlign: 'left', transition: 'all 0.2s', fontWeight: isSelected ? '500' : '400', opacity: readingScore !== null && !isSelected && q.correctIndex !== oIdx ? 0.6 : 1 }}>
                                <div style={{ minWidth:'24px', height:'24px', borderRadius:'50%', border: `2px solid ${isSelected ? bdColor : '#64748b'}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                                  {isSelected && <div style={{ width:'12px', height:'12px', borderRadius:'50%', backgroundColor:bdColor }} />}
                                </div>
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                        {readingScore !== null && (
                          <div style={{ marginTop: '16px', padding: '16px', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', borderLeft: '4px solid #94a3b8' }}>
                            <p style={{ fontSize: '0.95rem', color: '#cbd5e1', margin: 0 }}><strong>Explanation:</strong> {q.explanation}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {Object.keys(readingAnswers).length === readingData.questions.length && readingScore === null && (
                    <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end' }}>
                      <button onClick={submitReadingQuiz} className="er-control-btn">Submit Answers <CheckCircle size={18} /></button>
                    </div>
                  )}

                  {readingScore !== null && (
                    <div className="animate-fade-in" style={{ marginTop: '32px', padding: '24px', borderRadius: '12px', backgroundColor: readingScore >= 70 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', border: `1px solid ${readingScore >= 70 ? '#10b981' : '#ef4444'}`, display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ padding: '16px', backgroundColor: '#fff', borderRadius: '50%', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}><Award size={32} color={readingScore >= 70 ? '#10b981' : '#ef4444'} /></div>
                      <div>
                        <h3 style={{ fontSize: '1.4rem', color: readingScore >= 70 ? '#34d399' : '#fca5a5', margin: 0 }}>You scored {readingScore}%!</h3>
                        <p style={{ color: readingScore >= 70 ? '#6ee7b7' : '#fecaca', marginTop: '4px', marginBottom: 0 }}>{readingScore === 100 ? "Perfect reading comprehension! Extra 25 XP awarded." : "Review the explanations above to see what you missed."}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ SUB-TAB: Fast Reading ═══ */}
        {readingSubTab === 'fastread' && (
          <div className="animate-fade-in">
            {/* Speed selection */}
            <div className="er-trainer-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #7c3aed, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Zap size={24} color="#fff" />
                </div>
                <div>
                  <h3 style={{ margin: 0, color: '#4c1d95', fontSize: '1.2rem', fontWeight: '800' }}>Speed Reading Trainer</h3>
                  <p style={{ margin: 0, color: '#7c3aed', fontSize: '0.9rem' }}>Focus on the highlighted word — train your brain to read faster</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.9rem', color: '#6b21a8', fontWeight: '700' }}>Speed:</span>
                {[{label: 'Slow (150 wpm)', ms: 400}, {label: 'Medium (240 wpm)', ms: 250}, {label: 'Fast (400 wpm)', ms: 150}].map(s => (
                  <button key={s.label} onClick={() => { setFrSpeed(s.ms); if(frIsPlaying){ clearInterval(frIntervalRef.current); frIntervalRef.current = setInterval(() => setFrWordIndex(p => p + 1), s.ms); } }}
                    className={`er-speed-btn ${frSpeed === s.ms ? 'active' : ''}`}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Reading Screen */}
            <div className="er-reader-screen">
              <div style={{ position:'absolute', top:'-40px', right:'-40px', width:'150px', height:'150px', borderRadius:'50%', background:'rgba(124, 58, 237, 0.05)' }} />
              <div style={{ position:'absolute', bottom:'-30px', left:'-30px', width:'100px', height:'100px', borderRadius:'50%', background:'rgba(236, 72, 153, 0.05)' }} />

              {!frIsPlaying && !frFinished && frWordIndex === 0 && (
                <div>
                  <div style={{ width:'90px', height:'90px', borderRadius:'50%', background:'linear-gradient(135deg,#c026d3,#e879f9)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px' }}>
                    <Eye size={40} color="#fff" />
                  </div>
                  <h2 style={{ color:'#0f172a', marginBottom:'12px', fontSize:'1.8rem', fontWeight: '800' }}>Ready to Speed Read?</h2>
                  <p style={{ color:'#64748b', fontSize:'1.05rem', maxWidth:'400px', margin: '0 auto 32px' }}>Focus on each word as it appears. Train your eyes to read without sub-vocalizing.</p>
                </div>
              )}

              {(frIsPlaying || (!frIsPlaying && frWordIndex > 0 && !frFinished)) && (
                <div style={{ zIndex: 1 }}>
                  <p style={{ fontSize:'4rem', fontWeight:'900', color:'#0f172a', letterSpacing:'-0.03em', lineHeight:'1.2', margin:'0 0 24px 0',
                    animation: 'fadeInScale 0.15s ease-out' }}>
                    {frWords[frWordIndex] || ''}
                  </p>
                  <div style={{ fontSize:'0.9rem', color:'#94a3b8', fontWeight: '600' }}>Word {frWordIndex + 1} of {frWords.length}</div>
                  {/* Progress bar */}
                  <div style={{ width:'350px', maxWidth:'100%', height:'6px', backgroundColor:'#e2e8f0', borderRadius:'3px', margin:'20px auto 0', overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${((frWordIndex+1)/frWords.length)*100}%`, background:'linear-gradient(90deg,#9333ea,#ec4899)', borderRadius:'3px', transition:'width 0.15s linear' }} />
                  </div>
                </div>
              )}

              {frFinished && (
                <div className="animate-fade-in" style={{ zIndex: 1 }}>
                  <div style={{ width:'90px', height:'90px', borderRadius:'50%', background:'linear-gradient(135deg,#10b981,#34d399)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px' }}>
                    <CheckCircle size={40} color="#fff" />
                  </div>
                  <h2 style={{ color:'#065f46', marginBottom:'12px', fontSize: '1.8rem' }}>Session Complete!</h2>
                  <p style={{ color:'#047857', fontSize:'1.1rem', marginBottom:'8px' }}>You read <strong>{frWords.length} words</strong> at <strong>{Math.round(60000/frSpeed)} wpm</strong></p>
                  <p style={{ color:'#64748b', fontSize:'0.95rem' }}>Estimated time: {((frWords.length * frSpeed)/1000).toFixed(1)}s</p>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '-24px', zIndex: 2, position: 'relative' }}>
              {!frFinished && (
                <button onClick={() => {
                  if (frIsPlaying) { clearInterval(frIntervalRef.current); setFrIsPlaying(false); }
                  else {
                    setFrIsPlaying(true); setFrFinished(false);
                    frIntervalRef.current = setInterval(() => {
                      setFrWordIndex(prev => {
                        if (prev >= frWords.length - 1) { clearInterval(frIntervalRef.current); setFrIsPlaying(false); setFrFinished(true); return prev; }
                        return prev + 1;
                      });
                    }, frSpeed);
                  }
                }} className="er-control-btn">
                  {frIsPlaying ? <><Pause size={20}/> Pause</> : <><Play size={20}/> {frWordIndex > 0 ? 'Resume' : 'Start Reading'}</>}
                </button>
              )}
              {(frWordIndex > 0 || frFinished) && (
                <button onClick={() => { clearInterval(frIntervalRef.current); setFrIsPlaying(false); setFrWordIndex(0); setFrFinished(false); }}
                  className="er-control-btn" style={{ background: '#334155', boxShadow: 'none' }}>
                  <RotateCcw size={18}/> Restart
                </button>
              )}
            </div>
          </div>
        )}

        {/* ═══ SUB-TAB: Read Books ═══ */}
        {readingSubTab === 'books' && (
          <div className="animate-fade-in">
            {!bookOpen ? (
              <div>
                {/* Book Shelf */}
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(250px, 1fr))', gap:'32px' }}>
                  <div onClick={() => { setBookOpen(true); setBookPage(0); setBookZoom(1); }} 
                    style={{ cursor:'pointer', padding:0, borderRadius: '16px', overflow:'hidden', transition:'all 0.3s ease', border:'1px solid #334155', position:'relative', background: '#1e293b' }}
                    onMouseEnter={e => { e.currentTarget.style.transform='translateY(-6px)'; e.currentTarget.style.boxShadow='0 20px 40px rgba(0,0,0,0.3)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow=''; }}>
                    {/* Book Cover */}
                    <div style={{ height:'320px', background:'linear-gradient(145deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'32px', position:'relative', overflow:'hidden' }}>
                      <div style={{ position:'absolute', top:'-50px', right:'-50px', width:'200px', height:'200px', borderRadius:'50%', background:'rgba(232,121,35,0.15)' }} />
                      <div style={{ position:'absolute', bottom:'-30px', left:'-30px', width:'140px', height:'140px', borderRadius:'50%', background:'rgba(232,121,35,0.08)' }} />
                      <div style={{ textAlign:'center', position:'relative', zIndex:1 }}>
                        <p style={{ color:'#e87923', fontSize:'0.75rem', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.15em', marginBottom:'12px' }}>Gary Keller</p>
                        <h3 style={{ color:'#ffffff', fontSize:'1.8rem', fontWeight:'800', lineHeight:'1.2', marginBottom:'4px' }}>THE</h3>
                        <h2 style={{ color:'#e87923', fontSize:'3rem', fontWeight:'900', lineHeight:'1', marginBottom:'8px', fontStyle:'italic' }}>ONE</h2>
                        <h3 style={{ color:'#ffffff', fontSize:'1.8rem', fontWeight:'800', lineHeight:'1.2', marginBottom:'16px' }}>THING</h3>
                        <div style={{ width:'50px', height:'3px', background:'#e87923', margin:'0 auto 16px' }} />
                        <p style={{ color:'#94a3b8', fontSize:'0.75rem', lineHeight:'1.5', maxWidth:'180px' }}>The surprisingly simple truth behind extraordinary results</p>
                      </div>
                    </div>
                    {/* Book Info */}
                    <div style={{ padding:'20px 24px' }}>
                      <h4 style={{ color:'#f1f5f9', fontSize:'1.1rem', marginBottom:'6px', fontWeight: '700' }}>The ONE Thing</h4>
                      <p style={{ color:'#94a3b8', fontSize:'0.85rem', marginBottom:'12px' }}>Gary Keller & Jay Papasan</p>
                      <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                        <div style={{ padding:'4px 12px', borderRadius:'20px', background:'rgba(245, 158, 11, 0.1)', fontSize:'0.75rem', fontWeight:'600', color:'#fcd34d' }}>Self-Help</div>
                        <div style={{ padding:'4px 12px', borderRadius:'20px', background:'rgba(16, 185, 129, 0.1)', fontSize:'0.75rem', fontWeight:'600', color:'#6ee7b7' }}>{bookPages.length} Pages</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="animate-fade-in" style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #334155' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 24px', background:'#1e293b', gap:'12px', flexWrap:'wrap' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
                    <button onClick={() => { setBookOpen(false); setBookZoom(1); }} style={{ width:'36px', height:'36px', borderRadius:'8px', border:'1px solid #475569', background:'rgba(255,255,255,0.05)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#f1f5f9' }} title="Close">
                      <X size={18}/>
                    </button>
                    <div style={{ color:'#f8fafc', fontSize:'1rem', fontWeight:'700' }}>📖 The ONE Thing</div>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                    <button onClick={() => setBookZoom(z => Math.max(0.5, z - 0.15))} style={{ width:'36px', height:'36px', borderRadius:'8px', border:'1px solid #475569', background:'rgba(255,255,255,0.05)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#f1f5f9' }}><ZoomOut size={16}/></button>
                    <span style={{ color:'#e2e8f0', fontSize:'0.85rem', minWidth:'45px', textAlign:'center', fontWeight: '600' }}>{Math.round(bookZoom*100)}%</span>
                    <button onClick={() => setBookZoom(z => Math.min(2, z + 0.15))} style={{ width:'36px', height:'36px', borderRadius:'8px', border:'1px solid #475569', background:'rgba(255,255,255,0.05)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#f1f5f9' }}><ZoomIn size={16}/></button>
                  </div>
                </div>

                <div style={{ background:'#0f172a', padding:'40px 0', display:'flex', justifyContent:'center', alignItems:'flex-start', minHeight:'600px', overflow:'auto' }}>
                  <div style={{ transform:`scale(${bookZoom})`, transformOrigin:'top center', transition:'transform 0.25s ease' }}>
                    <img src={bookPages[bookPage]} alt={`Page ${bookPage + 1}`} style={{ maxWidth:'700px', width:'100%', borderRadius:'8px', boxShadow:'0 10px 40px rgba(0,0,0,0.5)', display:'block' }} />
                  </div>
                </div>

                <div style={{ background:'#1e293b', padding: '24px', display:'flex', flexDirection: 'column', alignItems:'center', gap:'16px' }}>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <button disabled={bookPage === 0} onClick={() => setBookPage(p => p - 1)}
                      className="er-control-btn" style={{ padding: '12px 24px', background: bookPage === 0 ? '#334155' : '#3b82f6', color: bookPage === 0 ? '#94a3b8' : '#fff', boxShadow: 'none' }}>
                      Previous
                    </button>
                    <button disabled={bookPage === bookPages.length - 1} onClick={() => setBookPage(p => p + 1)}
                      className="er-control-btn" style={{ padding: '12px 24px', background: bookPage === bookPages.length - 1 ? '#334155' : '#3b82f6', color: bookPage === bookPages.length - 1 ? '#94a3b8' : '#fff', boxShadow: 'none' }}>
                      Next
                    </button>
                  </div>
                  <p style={{ margin: 0, color:'#94a3b8', fontSize:'0.9rem' }}>Page {bookPage + 1} of {bookPages.length}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
