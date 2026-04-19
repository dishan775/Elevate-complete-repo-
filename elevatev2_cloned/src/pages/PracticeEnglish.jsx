import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { PlayCircle, Mic, FileText, ArrowRight, Loader, CheckCircle, RefreshCw, AlertCircle, TrendingUp, BookOpen, Volume2, ChevronRight, ChevronLeft, CheckSquare, Target, MessageSquare, Award, Zap, Book, Code, Brain, Terminal, Lightbulb, Eye, EyeOff, RotateCcw, Cpu, Network, Server, Database, GitBranch, Layers, Pause, Play, X, ZoomIn, ZoomOut } from 'lucide-react';
import usePracticeStore from '../store/practiceStore';

export default function PracticeEnglish() {
  const location = useLocation();
  const getInitialTab = () => {
    const p = location.pathname;
    if (p.includes('/practice/reading')) return 'reading';
    if (p.includes('/practice/programming')) return 'programming';
    if (p.includes('/practice/cs')) return 'cs';
    return 'overview';
  };
  const [activeTab, setActiveTab] = useState(getInitialTab); // resources, voice, email, vocab, analytics, mcq, lessons, chat, reading
  const [channels, setChannels] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [mcqs, setMcqs] = useState([]);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Evaluation States
  const [inputText, setInputText] = useState("");
  const [evalLoading, setEvalLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Vocab States
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // MCQ States
  const [currentMcqIdx, setCurrentMcqIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [mcqScore, setMcqScore] = useState(0);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [mcqTopic, setMcqTopic] = useState('Tenses and Verb Forms');
  const [mcqCount, setMcqCount] = useState(3);
  const [mcqLoading, setMcqLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);

  // Lesson Generator States
  const [lessonTopic, setLessonTopic] = useState("First Day at a New Job");
  const [currentLesson, setCurrentLesson] = useState(null);
  const [lessonLoading, setLessonLoading] = useState(false);

  // Reading Comprehension States
  const [readingTopic, setReadingTopic] = useState('IT Security Policy Update');
  const [readingData, setReadingData] = useState(null);
  const [readingLoading, setReadingLoading] = useState(false);
  const [readingAnswers, setReadingAnswers] = useState({});
  const [readingScore, setReadingScore] = useState(null);
  
  const [revealedAnswers, setRevealedAnswers] = useState({});

  // Reading Sub-Tab State
  const [readingSubTab, setReadingSubTab] = useState('comprehension');

  // Fast Reading States
  const [frIsPlaying, setFrIsPlaying] = useState(false);
  const [frWordIndex, setFrWordIndex] = useState(0);
  const [frSpeed, setFrSpeed] = useState(250);
  const [frFinished, setFrFinished] = useState(false);
  const frIntervalRef = useRef(null);
  const frPassage = `Success is simple. Do what is right, the right way, at the right time. You know about habits. They can be hard to break and hard to create. But we are unknowingly acquiring new ones all the time. When we start and continue a way of thinking or a way of acting over a long enough period, we have created a new habit. The choice we face is whether or not we want to form habits that get us what we want from life. If we do, then the Focusing Question is the most powerful success habit we can have. For me, the Focusing Question is a way of life. I use it to find my most leveraged priority, make the most out of my time, and get the biggest bang for my buck. Whenever the outcome absolutely matters, I ask it. I ask it when I wake up and start my day. I ask it when I get to work, and again when I get home. What is the ONE Thing I can do such that by doing it everything else will be easier or unnecessary? And when I know the answer, I continue to ask it until I can see the connections and all my dominoes are lined up. Obviously, you can drive yourself nuts analyzing every little aspect of everything you might do. I do not do that, and you should not either. Start with the big stuff and see where it takes you. Over time, you will develop your own sense of when to use the big-picture question and when to use the small-focus question. The Focusing Question is the foundational habit I use to achieve extraordinary results and lead a big life.`;
  const frWords = frPassage.split(/\s+/);

  // Book Reader States
  const [bookOpen, setBookOpen] = useState(false);
  const [bookPage, setBookPage] = useState(0);
  const [bookZoom, setBookZoom] = useState(1);
  const bookPages = [
    '/images/books/one-thing-page1.png',
    '/images/books/one-thing-page2.png',
    '/images/books/one-thing-page3.png',
  ];

  // Programming Tab States
  const [progTopic, setProgTopic] = useState('arrays');
  const [progDifficulty, setProgDifficulty] = useState('Medium');
  const [progChallenge, setProgChallenge] = useState(null);
  const [progLoading, setProgLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [userCode, setUserCode] = useState('');

  // CS Tab States
  const [csTopic, setCsTopic] = useState('databases');
  const [csQuestion, setCsQuestion] = useState(null);
  const [csLoading, setCsLoading] = useState(false);
  const [csSelected, setCsSelected] = useState(null);
  const [csStreak, setCsStreak] = useState(0);
  const [csTotal, setCsTotal] = useState(0);
  const [csCorrect, setCsCorrect] = useState(0);

  // Gamification from Store
  const { xp, level, badge: storeBadge, addXP, fetchSummary } = usePracticeStore();
  const xpThreshold = 100;
  const currentXP = xp % xpThreshold;
  
  const getBadge = () => {
    if (level < 2) return { text: "Beginner", icon: "🥉", color: "#b45309", bg: "#fef3c7" };
    if (level < 5) return { text: "Intermediate", icon: "🥈", color: "#475569", bg: "#f1f5f9" };
    if (level < 10) return { text: "Advanced", icon: "🥇", color: "#b45309", bg: "#fef08a" };
    return { text: "Pro Communicator", icon: "💎", color: "#4338ca", bg: "#e0e7ff" };
  };
  const badge = getBadge();

  // Chat States
  const [chatMessages, setChatMessages] = useState([{ role: 'assistant', content: 'Hi there! I am your AI Hiring Manager. We are practicing a Salary Negotiation today. We just extended a base offer of $105,000 for the Senior Dev role. What are your thoughts?' }]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, activeTab]);

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;
    const newMsgs = [...chatMessages, { role: 'user', content: chatInput }];
    setChatMessages(newMsgs);
    setChatInput('');
    setChatLoading(true);
    
    try {
      const res = await fetch('https://elevate-backend-2v69.onrender.com/api/english/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMsgs, scenario: 'Salary Negotiation' })
      });
      const data = await res.json();
      if(data.success) {
        setChatMessages([...newMsgs, { role: 'assistant', content: data.data }]);
        addXP(10, 'Chat Participation');
      }
    } catch(err) { console.error(err); }
    finally { setChatLoading(false); }
  };

  useEffect(() => {
    if (!isQuizActive || selectedOption !== null) return;
    if (timeLeft === 0) {
      setSelectedOption(-1); // -1 signifies a timeout
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isQuizActive, timeLeft, selectedOption]);

  // Email Scenarios
  const emailScenarios = [
    { id: 'time', label: 'Ask for more time on an offer', desc: 'Draft an email to a recruiter politely asking for more time to decide on a job offer.' },
    { id: 'decline', label: 'Decline a job offer politely', desc: 'Draft an email thanking the recruiter but declining the position because you accepted another offer.' },
    { id: 'followup', label: 'Follow up after an interview', desc: 'Draft a short email following up one week after your final technical interview.' },
    { id: 'apology', label: 'Apologize for missing a meeting', desc: 'Draft a professional apology for missing a scheduled team meeting due to a technical internet issue.' }
  ];
  const [selectedScenario, setSelectedScenario] = useState(emailScenarios[0]);
  const [selectedTone, setSelectedTone] = useState("Professional");
  const [rewriteLoading, setRewriteLoading] = useState(false);

  // Mic States
  const [isListening, setIsListening] = useState(false);
  const [micStatus, setMicStatus] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Fetch all initial data
    fetchSummary();
    Promise.all([
      fetch('https://elevate-backend-2v69.onrender.com/api/english/resources').then(res => res.json()),
      fetch('https://elevate-backend-2v69.onrender.com/api/english/flashcards').then(res => res.json()),
      fetch('https://elevate-backend-2v69.onrender.com/api/english/scores').then(res => res.json())
    ]).then(([resData, flashData, scoreData]) => {
      if(resData.success) setChannels(resData.data);
      if(flashData.success) setFlashcards(flashData.data);
      if(scoreData.success) setScores(scoreData.data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const saveScore = async (score, type) => {
    try {
      const res = await fetch('https://elevate-backend-2v69.onrender.com/api/english/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score, type })
      });
      const data = await res.json();
      if(data.success) {
        setScores(data.data);
        fetchSummary(); // Refresh summary after score
      }
    } catch(err) { console.error("Score save error", err); }
  };

  const playTTS = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95; // Slightly slower for clarity
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-Speech is not supported in this browser.");
    }
  };

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      setMicStatus("");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMicStatus("Browser NOT supported. Please use Chrome/Edge.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => { setIsListening(true); setMicStatus("Listening... Please speak now."); };
      recognition.onend = () => { setIsListening(false); if (micStatus.includes("Listening")) setMicStatus(""); };

      recognition.onerror = (event) => {
        if (event.error === 'not-allowed') setMicStatus("Error: Microphone access denied by browser.");
        else if (event.error === 'no-speech') setMicStatus("Error: No speech detected. Check your mic.");
        else setMicStatus(`Error: ${event.error}`);
        setIsListening(false);
      };
      
      recognition.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript + ' ';
        }
        if (finalTranscript) setInputText(prev => prev + finalTranscript);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error(e);
      setMicStatus("Failed to start mic process. Try typing instead.");
      setIsListening(false);
    }
  };

  const generateQuiz = async () => {
    setMcqLoading(true);
    try {
      const res = await fetch('https://elevate-backend-2v69.onrender.com/api/english/generate-mcq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: mcqTopic, count: mcqCount })
      });
      const data = await res.json();
      if(data.success && data.data.length > 0) {
        setMcqs(data.data);
        setCurrentMcqIdx(0);
        setSelectedOption(null);
        setMcqScore(0);
        setIsQuizActive(true);
        setTimeLeft(10);
        addXP(10, 'Quiz Generation');
      } else {
        alert("Failed to generate quiz. Try a different topic.");
      }
    } catch(err) { console.error(err); }
    finally { setMcqLoading(false); }
  };

  const handleEvaluate = async (type) => {
    if (!inputText) return;
    setEvalLoading(true);
    setFeedback(null);
    try {
      const res = await fetch('https://elevate-backend-2v69.onrender.com/api/english/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText, type })
      });
      const data = await res.json();
      if(data.success) {
        setFeedback(data.data);
        saveScore(data.data.score, type);
        addXP(25, 'AI Evaluation');
      }
    } catch(err) { console.error(err); } 
    finally { setEvalLoading(false); }
  };

  const handleReset = () => {
    setInputText("");
    setFeedback(null);
    setMicStatus("");
    setSelectedOption(null);
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleRewrite = async () => {
    if (!inputText) return;
    setRewriteLoading(true);
    try {
      const res = await fetch('https://elevate-backend-2v69.onrender.com/api/english/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText, tone: selectedTone })
      });
      const data = await res.json();
      if(data.success) {
        setInputText(data.data); // Replace text with AI rewrite
        setFeedback(null); // Clear previous feedback
        addXP(5, 'AI Rewrite');
      }
    } catch(err) { console.error(err); }
    finally { setRewriteLoading(false); }
  };

  const handleAutoGenerate = async () => {
    const scenarioDesc = typeof selectedScenario === 'string' ? selectedScenario : selectedScenario.desc;
    setRewriteLoading(true);
    try {
      const res = await fetch('https://elevate-backend-2v69.onrender.com/api/english/generate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario: scenarioDesc, tone: selectedTone })
      });
      const data = await res.json();
      if(data.success) {
        setInputText(data.data);
        addXP(15, 'Email Generation');
      }
    } catch(err) { console.error(err); }
    finally { setRewriteLoading(false); }
  };

  const generateLesson = async () => {
    if(!lessonTopic) return;
    setLessonLoading(true);
    try {
      const res = await fetch('https://elevate-backend-2v69.onrender.com/api/english/generate-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: lessonTopic })
      });
      const data = await res.json();
      if(data.success) {
        setCurrentLesson(data.data);
        setRevealedAnswers({});
        addXP(50, 'Lesson Generation');
      }
    } catch (err) { console.error(err); }
    finally { setLessonLoading(false); }
  };

  const toggleReveal = (key) => setRevealedAnswers(p => ({...p, [key]: !p[key]}));

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
    saveScore(pct, 'reading');
    if (pct === 100) addXP(25, 'Perfect Reading Score');
    else addXP(10, 'Reading Task Completion');
  };

  const SidebarBtn = ({ id, icon: Icon, label }) => (
    <button onClick={() => {setActiveTab(id); handleReset();}} className="btn" style={{ justifyContent: 'flex-start', padding: '14px 20px', borderRadius: '12px', backgroundColor: activeTab === id ? 'var(--primary)' : 'transparent', color: activeTab === id ? 'white' : 'var(--text-main)', boxShadow: activeTab === id ? '0 4px 14px 0 rgba(139, 92, 246, 0.39)' : 'none' }}>
      <Icon size={20} /> {label}
    </button>
  );

  return (
    <div className="container" style={{ padding: '40px 24px 40px 8px', maxWidth: '1100px', display: 'flex', gap: '40px' }}>
      
      {/* Sidebar */}
      <div style={{ width: '280px', flexShrink: 0 }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>Elevate <span className="text-gradient">Hub</span></h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <SidebarBtn id="overview" icon={Target} label="Dashboard Overview" />
          
          <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '16px', marginBottom: '4px', paddingLeft: '8px' }}>
            Professional English
          </div>
          <SidebarBtn id="resources" icon={PlayCircle} label="Learning Resources" />
          <SidebarBtn id="vocab" icon={BookOpen} label="Vocabulary Builder" />
          <SidebarBtn id="lessons" icon={Target} label="Interactive Lessons" />
          <SidebarBtn id="chat" icon={MessageSquare} label="Real-time Chat" />
          <SidebarBtn id="mcq" icon={CheckSquare} label="Grammar Quizzes" />
          <SidebarBtn id="voice" icon={Mic} label="Voice Mock Interview" />
          <SidebarBtn id="email" icon={FileText} label="Corporate Emails" />
          
          <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '16px', marginBottom: '4px', paddingLeft: '8px' }}>
            Reading & Technical
          </div>
          <SidebarBtn id="reading" icon={Book} label="Enhance Reading Ability" />
          <SidebarBtn id="programming" icon={Code} label="Learn Programming" />
          <SidebarBtn id="cs" icon={Brain} label="Core Computer Science" />
          
          <div style={{ height: '1px', backgroundColor: '#e5e7eb', margin: '16px 0 8px 0' }}></div>
          <SidebarBtn id="analytics" icon={TrendingUp} label="My Progress" />
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, minHeight: '600px', padding: '0 24px' }}>
        
        {/* GAMIFICATION HEADER */}
        <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '32px', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: badge.bg, padding: '8px 16px', borderRadius: '50px', border: `1px solid ${badge.color}`, cursor: 'help' }} title={`Level ${level} ${badge.text}`}>
            <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>{badge.icon}</span>
            <span style={{ fontWeight: 'bold', color: badge.color, fontSize: '0.9rem' }}>Lvl {level} {badge.text}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#f8fafc', padding: '8px 16px', borderRadius: '50px', border: '1px solid #e2e8f0' }}>
            <Zap size={18} fill="#d946ef" color="#d946ef" />
            <div style={{ display: 'flex', flexDirection: 'column', width: '120px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 'bold', color: '#86198f', marginBottom: '4px' }}>
                <span>XP</span><span>{currentXP} / {xpThreshold}</span>
              </div>
              <div style={{ height: '6px', backgroundColor: '#fae8ff', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(currentXP / xpThreshold) * 100}%`, backgroundColor: '#d946ef', transition: 'width 0.5s ease-out' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* OVERVIEW (NEW) */}
        {activeTab === 'overview' && (
          <div className="animate-fade-in">
            <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Main <span className="text-gradient">Dashboard</span></h1>
            <p style={{ color: '#475569', marginBottom: '32px' }}>Welcome back. Select any of your 4 primary learning tracks below.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              <div onClick={() => setActiveTab('email')} className="card" style={{ cursor: 'pointer', borderTop: '4px solid #3b82f6', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ backgroundColor: '#eff6ff', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <MessageSquare size={24} color="#3b82f6" />
                </div>
                <h3 style={{ marginBottom: '12px', color: '#0f172a' }}>Practice Professional English</h3>
                <p style={{ color: '#475569', flex: 1 }}>Master corporate communication, emails, grammar, and pronunciation with AI evaluations.</p>
              </div>
              
              <div onClick={() => setActiveTab('reading')} className="card" style={{ cursor: 'pointer', borderTop: '4px solid #ef4444', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ backgroundColor: '#fef2f2', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <Book size={24} color="#ef4444" />
                </div>
                <h3 style={{ marginBottom: '12px', color: '#0f172a' }}>Enhance Reading Ability</h3>
                <p style={{ color: '#475569', flex: 1 }}>Improve processing speed and comprehension by reading dynamic corporate memos and PRs.</p>
              </div>
              
              <div onClick={() => setActiveTab('programming')} className="card" style={{ cursor: 'pointer', borderTop: '4px solid #10b981', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ backgroundColor: '#ecfdf5', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <Code size={24} color="#10b981" />
                </div>
                <h3 style={{ marginBottom: '12px', color: '#0f172a' }}>Learn Programming</h3>
                <p style={{ color: '#475569', flex: 1 }}>Build your coding fundamentals with hands-on practice, logic puzzles, and algorithm exercises.</p>
              </div>
              
              <div onClick={() => setActiveTab('cs')} className="card" style={{ cursor: 'pointer', borderTop: '4px solid #f59e0b', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ backgroundColor: '#fffbeb', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <Brain size={24} color="#f59e0b" />
                </div>
                <h3 style={{ marginBottom: '12px', color: '#0f172a' }}>Learn Core Computer Science</h3>
                <p style={{ color: '#475569', flex: 1 }}>Deep dive into theoretical concepts like Databases, Operating Systems, and System Design patterns.</p>
              </div>
            </div>
          </div>
        )}

        {/* ═══ PROGRAMMING MODULE ══════════════════════════════════════════ */}
        {activeTab === 'programming' && (
          <div className="animate-fade-in">
            <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Learn <span className="text-gradient">Programming</span></h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Get a random coding challenge. Read the problem, attempt it, then reveal the solution.</p>

            {/* Controls Card */}
            <div className="card" style={{ marginBottom: '28px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div style={{ flex: '1 1 180px' }}>
                <label style={{ display: 'block', fontWeight: '600', fontSize: '0.85rem', marginBottom: '8px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Topic</label>
                <select value={progTopic} onChange={e => { setProgTopic(e.target.value); setProgChallenge(null); setShowHint(false); setShowSolution(false); setUserCode(''); }}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.95rem', outline: 'none', cursor: 'pointer', backgroundColor: '#fff' }}>
                  <option value="variables">Variables &amp; Types</option>
                  <option value="functions">Functions &amp; Closures</option>
                  <option value="arrays">Arrays &amp; Iteration</option>
                  <option value="objects">Objects &amp; Prototypes</option>
                  <option value="sorting">Sorting Algorithms</option>
                </select>
              </div>
              <div style={{ flex: '1 1 140px' }}>
                <label style={{ display: 'block', fontWeight: '600', fontSize: '0.85rem', marginBottom: '8px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Difficulty</label>
                <select value={progDifficulty} onChange={e => setProgDifficulty(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.95rem', outline: 'none', cursor: 'pointer', backgroundColor: '#fff' }}>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              <button
                disabled={progLoading}
                onClick={async () => {
                  setProgLoading(true); setProgChallenge(null); setShowHint(false); setShowSolution(false); setUserCode('');
                  try {
                    const res = await fetch('https://elevate-backend-2v69.onrender.com/api/programming/challenge', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic: progTopic, difficulty: progDifficulty }) });
                    const data = await res.json();
                    if (data.success) { setProgChallenge(data.data); addXP(15, 'Coding Challenge Generation'); }
                  } catch(err) { console.error(err); }
                  finally { setProgLoading(false); }
                }}
                className="btn btn-primary" style={{ flex: '0 0 auto', padding: '11px 28px', alignSelf: 'flex-end' }}>
                {progLoading ? <Loader size={18} className="animate-spin" /> : <><Terminal size={18} /> Generate Challenge</>}
              </button>
            </div>

            {!progChallenge && !progLoading && (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
                <Code size={80} color="#d1fae5" style={{ margin: '0 auto 20px' }} />
                <p style={{ fontSize: '1.1rem' }}>Select a topic and click <strong>Generate Challenge</strong> to start.</p>
              </div>
            )}

            {progChallenge && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Problem Header */}
                <div className="card" style={{ borderLeft: `5px solid ${progChallenge.difficulty === 'Easy' ? '#10b981' : progChallenge.difficulty === 'Medium' ? '#f59e0b' : '#ef4444'}`, padding: '28px 32px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                    <h2 style={{ margin: 0, fontSize: '1.6rem' }}>{progChallenge.title}</h2>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <span style={{ padding: '4px 14px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 'bold', backgroundColor: progChallenge.difficulty === 'Easy' ? '#d1fae5' : progChallenge.difficulty === 'Medium' ? '#fef3c7' : '#fee2e2', color: progChallenge.difficulty === 'Easy' ? '#065f46' : progChallenge.difficulty === 'Medium' ? '#92400e' : '#991b1b' }}>{progChallenge.difficulty}</span>
                      <span style={{ padding: '4px 14px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 'bold', backgroundColor: '#ecfdf5', color: '#065f46' }}>JavaScript</span>
                    </div>
                  </div>
                  <p style={{ fontSize: '1.05rem', lineHeight: '1.7', color: '#334155', margin: '0 0 20px 0' }}>{progChallenge.problem}</p>
                  <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px 18px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Example</span>
                    <p style={{ margin: '6px 0 0 0', fontFamily: 'monospace', fontSize: '1rem', color: '#0f172a' }}>{progChallenge.example}</p>
                  </div>
                </div>

                {/* Your Solution Editor */}
                <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                  <div style={{ padding: '14px 20px', backgroundColor: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '12px 12px 0 0' }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ef4444' }} />
                    <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                    <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#10b981' }} />
                    <span style={{ marginLeft: '8px', color: '#94a3b8', fontSize: '0.8rem', fontFamily: 'monospace' }}>solution.js</span>
                  </div>
                  <textarea
                    rows={10}
                    value={userCode}
                    onChange={e => setUserCode(e.target.value)}
                    placeholder={`// Write your JavaScript solution here...\nfunction solution() {\n  \n}`}
                    spellCheck={false}
                    style={{ width: '100%', padding: '20px', fontFamily: "'Courier New', Courier, monospace", fontSize: '0.95rem', backgroundColor: '#0f172a', color: '#e2e8f0', border: 'none', outline: 'none', resize: 'vertical', lineHeight: '1.7', display: 'block', minHeight: '200px', borderRadius: '0 0 12px 12px' }}
                  />
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button onClick={() => { setShowHint(!showHint); }} className="btn btn-secondary" style={{ backgroundColor: showHint ? '#fef3c7' : undefined, color: showHint ? '#92400e' : undefined, border: showHint ? '1px solid #f59e0b' : undefined }}>
                    <Lightbulb size={16} /> {showHint ? 'Hide Hint' : 'Show Hint'}
                  </button>
                  <button onClick={() => { setShowSolution(!showSolution); if (!showSolution) addXP(-5, 'Revealed Solution Penalty'); }} className="btn btn-secondary" style={{ backgroundColor: showSolution ? '#fee2e2' : undefined, color: showSolution ? '#991b1b' : undefined, border: showSolution ? '1px solid #ef4444' : undefined }}>
                    {showSolution ? <EyeOff size={16} /> : <Eye size={16} />} {showSolution ? 'Hide Solution' : 'Reveal Solution'}
                  </button>
                  <button onClick={() => { setProgChallenge(null); setShowHint(false); setShowSolution(false); setUserCode(''); }} className="btn btn-secondary" style={{ marginLeft: 'auto' }}>
                    <RotateCcw size={16} /> New Challenge
                  </button>
                </div>

                {showHint && (
                  <div className="animate-fade-in" style={{ padding: '18px 24px', backgroundColor: '#fffbeb', border: '1px solid #fcd34d', borderRadius: '12px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                    <Lightbulb size={22} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <p style={{ margin: 0, fontWeight: '700', color: '#92400e', marginBottom: '4px' }}>Hint</p>
                      <p style={{ margin: 0, color: '#78350f', lineHeight: '1.6' }}>{progChallenge.hint}</p>
                    </div>
                  </div>
                )}

                {showSolution && (
                  <div className="animate-fade-in" style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #ef4444' }}>
                    <div style={{ padding: '12px 20px', backgroundColor: '#7f1d1d', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Eye size={16} color="#fca5a5" />
                      <span style={{ color: '#fca5a5', fontWeight: '600', fontSize: '0.9rem' }}>Model Solution (−5 XP)</span>
                    </div>
                    <pre style={{ margin: 0, padding: '24px', backgroundColor: '#0f172a', color: '#86efac', fontFamily: "'Courier New', Courier, monospace", fontSize: '0.95rem', lineHeight: '1.7', overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{progChallenge.solution}</pre>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ═══ CORE CS MODULE ══════════════════════════════════════════════== */}
        {activeTab === 'cs' && (
          <div className="animate-fade-in">
            <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Core <span className="text-gradient">Computer Science</span></h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Deep-dive theory drills. Pick a topic and drill through interview-grade questions.</p>

            {/* Stats Bar */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '28px', flexWrap: 'wrap' }}>
              {[
                { label: 'Questions Done', value: csTotal, color: '#3b82f6', bg: '#eff6ff' },
                { label: 'Correct', value: csCorrect, color: '#10b981', bg: '#ecfdf5' },
                { label: 'Accuracy', value: csTotal === 0 ? '—' : `${Math.round((csCorrect / csTotal) * 100)}%`, color: '#8b5cf6', bg: '#f5f3ff' },
                { label: 'Current Streak', value: `${csStreak} 🔥`, color: '#f59e0b', bg: '#fffbeb' },
              ].map((stat, i) => (
                <div key={i} style={{ flex: '1 1 120px', backgroundColor: stat.bg, borderRadius: '12px', padding: '16px 20px', textAlign: 'center' }}>
                  <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', color: stat.color }}>{stat.label}</p>
                  <p style={{ margin: '6px 0 0 0', fontSize: '1.6rem', fontWeight: '800', color: stat.color }}>{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Topic Selector & Generate */}
            <div className="card" style={{ marginBottom: '28px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div style={{ flex: '1 1 200px' }}>
                <label style={{ display: 'block', fontWeight: '600', fontSize: '0.85rem', marginBottom: '8px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>CS Domain</label>
                <select value={csTopic} onChange={e => { setCsTopic(e.target.value); setCsQuestion(null); setCsSelected(null); }}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.95rem', outline: 'none', cursor: 'pointer', backgroundColor: '#fff' }}>
                  <option value="databases">🗄️  Databases &amp; SQL</option>
                  <option value="os">🖥️  Operating Systems</option>
                  <option value="networking">🌐  Networking &amp; Protocols</option>
                  <option value="systemdesign">🏗️  System Design</option>
                  <option value="datastructures">🌳  Data Structures &amp; Algorithms</option>
                </select>
              </div>
              <button
                disabled={csLoading}
                onClick={async () => {
                  setCsLoading(true); setCsQuestion(null); setCsSelected(null);
                  try {
                    const res = await fetch('https://elevate-backend-2v69.onrender.com/api/cs/question', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic: csTopic }) });
                    const data = await res.json();
                    if (data.success) setCsQuestion(data.data);
                  } catch(err) { console.error(err); }
                  finally { setCsLoading(false); }
                }}
                className="btn btn-primary" style={{ flex: '0 0 auto', padding: '11px 28px', alignSelf: 'flex-end' }}>
                {csLoading ? <Loader size={18} className="animate-spin" /> : <><Brain size={18} /> Get Question</>}
              </button>
            </div>

            {!csQuestion && !csLoading && (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
                <Brain size={80} color="#fde68a" style={{ margin: '0 auto 20px' }} />
                <p style={{ fontSize: '1.1rem' }}>Select a CS domain and click <strong>Get Question</strong> to start drilling.</p>
              </div>
            )}

            {csQuestion && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Topic Badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ padding: '5px 16px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: '700', backgroundColor: '#ede9fe', color: '#5b21b6', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{csQuestion.topic}</span>
                </div>

                {/* Question Card */}
                <div className="card" style={{ borderLeft: '5px solid #8b5cf6', padding: '28px 32px' }}>
                  <h2 style={{ fontSize: '1.4rem', lineHeight: '1.6', color: '#0f172a', margin: '0 0 28px 0' }}>{csQuestion.question}</h2>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {csQuestion.options.map((opt, i) => {
                      const isSelected = csSelected === i;
                      const isCorrect = csQuestion.correctIndex === i;
                      const revealed = csSelected !== null;

                      let bg = '#f9fafb', border = '#e5e7eb', color = '#334155';
                      if (revealed) {
                        if (isCorrect) { bg = '#ecfdf5'; border = '#10b981'; color = '#065f46'; }
                        else if (isSelected) { bg = '#fef2f2'; border = '#ef4444'; color = '#991b1b'; }
                      } else if (isSelected) { border = '#8b5cf6'; bg = '#f5f3ff'; }

                      return (
                        <button key={i} disabled={revealed}
                          onClick={() => {
                            setCsSelected(i);
                            setCsTotal(t => t + 1);
                            if (i === csQuestion.correctIndex) {
                              setCsCorrect(c => c + 1);
                              setCsStreak(s => s + 1);
                              addXP(20, 'CS Quiz Correct Answer');
                            } else {
                              setCsStreak(0);
                            }
                          }}
                          style={{ textAlign: 'left', padding: '16px 20px', borderRadius: '12px', border: `2px solid ${border}`, backgroundColor: bg, color, cursor: revealed ? 'default' : 'pointer', fontSize: '1rem', fontWeight: '500', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: 26, height: 26, borderRadius: '50%', border: `2px solid ${isSelected || (revealed && isCorrect) ? border : '#cbd5e1'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.75rem', fontWeight: 'bold', color: isSelected || (revealed && isCorrect) ? border : '#94a3b8' }}>
                            {['A','B','C','D'][i]}
                          </div>
                          {opt}
                          {revealed && isCorrect && <CheckCircle size={18} style={{ marginLeft: 'auto', flexShrink: 0 }} />}
                        </button>
                      );
                    })}
                  </div>

                  {csSelected !== null && (
                    <div className="animate-fade-in" style={{ marginTop: '24px', padding: '20px', backgroundColor: '#f8fafc', borderRadius: '12px', borderLeft: '4px solid #8b5cf6' }}>
                      <p style={{ margin: 0, fontWeight: '700', color: '#5b21b6', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {csSelected === csQuestion.correctIndex ? '✅ Correct! +20 XP' : '❌ Incorrect'}
                      </p>
                      <p style={{ margin: 0, color: '#334155', lineHeight: '1.7' }}>{csQuestion.explanation}</p>
                    </div>
                  )}
                </div>

                {csSelected !== null && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <button onClick={() => { setCsQuestion(null); setCsSelected(null); }} className="btn btn-secondary"><RotateCcw size={16} /> Different Topic</button>
                    <button
                      className="btn btn-primary"
                      onClick={async () => {
                        setCsLoading(true); setCsQuestion(null); setCsSelected(null);
                        try {
                          const res = await fetch('https://elevate-backend-2v69.onrender.com/api/cs/question', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic: csTopic }) });
                          const data = await res.json();
                          if (data.success) setCsQuestion(data.data);
                        } catch(err) { console.error(err); }
                        finally { setCsLoading(false); }
                      }}>
                      Next Question <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* RESOURCES */}
        {activeTab === 'resources' && (
          <div className="animate-fade-in">
            <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Recommended <span className="text-gradient">Channels</span></h1>
            <p style={{ color: '#475569', marginBottom: '32px' }}>Watch these curated videos to rapidly improve your corporate English skills.</p>
            {loading ? <Loader className="animate-spin" color="var(--primary)" /> : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                {channels.map((channel, i) => (
                  <div key={i} className="card animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: channel.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}><PlayCircle size={24} /></div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{channel.name}</h4>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569' }}>{channel.instructor}</p>
                      </div>
                    </div>
                    <p style={{ color: '#475569', fontSize: '0.95rem', marginBottom: '20px', flex: 1 }}>{channel.desc}</p>
                    <a href={channel.url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ width: '100%', borderRadius: '8px', padding: '10px', textDecoration: 'none', textAlign: 'center' }}>Watch on YouTube</a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VOCAB BUILDER */}
        {activeTab === 'vocab' && (
          <div className="animate-fade-in">
            <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Vocabulary <span className="text-gradient">Builder</span></h1>
            <p style={{ color: '#475569', marginBottom: '32px' }}>Master the most common jargon used in tech companies. Click to flip.</p>
            
            {flashcards.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div 
                  onClick={() => setIsFlipped(!isFlipped)}
                  style={{ width: '100%', maxWidth: '500px', height: '300px', perspective: '1000px', cursor: 'pointer', marginBottom: '32px' }}
                >
                  <div style={{ width: '100%', height: '100%', position: 'relative', transition: 'transform 0.6s', transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'none' }}>
                    
                    {/* Front */}
                    <div className="card" style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f9ff', border: '2px solid var(--primary)' }}>
                      <h2 style={{ fontSize: '3rem', color: 'var(--primary)' }}>{flashcards[currentCardIdx].term}</h2>
                      <p style={{ color: '#475569', marginTop: '20px' }}>Click to see definition</p>
                    </div>

                    {/* Back */}
                    <div className="card" style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--primary)', color: 'white', transform: 'rotateY(180deg)' }}>
                      <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Definition:</h3>
                      <p style={{ fontSize: '1.2rem', textAlign: 'center', padding: '0 20px' }}>"{flashcards[currentCardIdx].def}"</p>
                    </div>

                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                  <button className="btn btn-secondary" disabled={currentCardIdx === 0} onClick={() => {setCurrentCardIdx(prev => prev - 1); setIsFlipped(false);}}>Previous</button>
                  <span style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>{currentCardIdx + 1} / {flashcards.length}</span>
                  <button className="btn btn-primary" disabled={currentCardIdx === flashcards.length - 1} onClick={() => {setCurrentCardIdx(prev => prev + 1); setIsFlipped(false);}}>Next Word <ChevronRight size={18}/></button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* INTERACTIVE LESSONS (NEW) */}
        {activeTab === 'lessons' && (
          <div className="animate-fade-in">
            <h1 style={{ fontSize: '2.5rem', margin: 0 }}>Interactive <span className="text-gradient">Lessons</span></h1>
            <p style={{ color: '#475569', marginBottom: '32px', marginTop: '8px' }}>Generate a complete 8-step AI lesson on any professional topic.</p>
            
            <div className="card" style={{ marginBottom: '32px', display: 'flex', gap: '12px' }}>
              <input value={lessonTopic} onChange={e => setLessonTopic(e.target.value)} placeholder="E.g., Salary Negotiation, First Day, Disagreeing with a Boss..." style={{ flex: 1, padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', outline: 'none', fontSize: '1rem' }} />
              <button disabled={lessonLoading} onClick={generateLesson} className="btn btn-primary" style={{ minWidth: '160px', justifyContent: 'center' }}>
                {lessonLoading ? <Loader size={18} className="animate-spin" /> : 'Generate Lesson ✨'}
              </button>
            </div>

            {currentLesson && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', borderBottom: '2px solid #e5e7eb', paddingBottom: '12px' }}>Lesson: {currentLesson.topicTitle}</h2>
                
                {/* 1. Real-Life Conversation */}
                <div className="card">
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', margin: '0 0 16px 0' }}><MessageSquare size={20}/> 1. Real-Life Conversation</h3>
                  {currentLesson.conversation.map((line, i) => (
                    <div key={i} style={{ marginBottom: '12px', padding: '12px', borderRadius: '8px', backgroundColor: line.speaker === 'A' || i%2===0 ? '#f3f4f6' : '#ecfdf5', width: 'fit-content', maxWidth: '80%', marginLeft: line.speaker !== 'A' && i%2!==0 ? 'auto' : '0' }}>
                      <strong>{line.speaker}:</strong> {line.text}
                    </div>
                  ))}
                </div>

                {/* 2 & 5. Small Talk & Vocab */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div className="card">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8b5cf6', margin: '0 0 16px 0' }}>2. Small Talk Practice</h3>
                    {currentLesson.smallTalk.map((st, i) => (
                      <div key={i} style={{ marginBottom: '16px' }}>
                        <p style={{ fontWeight: 'bold', margin: '0 0 4px 0' }}>Q: {st.starter}</p>
                        <p style={{ margin: 0, color: '#475569' }}>A: {st.response}</p>
                      </div>
                    ))}
                  </div>
                  <div className="card">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', margin: '0 0 16px 0' }}>5. Vocabulary Upgrade</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead><tr><th style={{ textAlign: 'left', borderBottom: '2px solid #e5e7eb', padding: '8px' }}>Instead of...</th><th style={{ textAlign: 'left', borderBottom: '2px solid #e5e7eb', padding: '8px' }}>Say...</th></tr></thead>
                      <tbody>
                        {currentLesson.vocab.map((v, i) => (
                          <tr key={i}><td style={{ padding: '12px 8px', borderBottom: '1px solid #e5e7eb', color: '#ef4444' }}>{v.simple}</td><td style={{ padding: '12px 8px', borderBottom: '1px solid #e5e7eb', color: '#10b981', fontWeight: 'bold' }}>{v.professional}</td></tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 3 & 4. Mistake Correction & Sentence Builder */}
                <div className="card">
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3b82f6', margin: '0 0 16px 0' }}>3 & 4. Interactive Practice (Click to Reveal)</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {currentLesson.mistakes.map((m, i) => (
                      <div key={`m-${i}`} onClick={() => toggleReveal(`m-${i}`)} style={{ cursor: 'pointer', padding: '16px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', transition: 'all 0.2s' }}>
                        ❌ <strong>Fix this:</strong> {m.incorrect}
                        {revealedAnswers[`m-${i}`] && <div className="animate-fade-in" style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e5e7eb', color: '#10b981' }}>✅ <strong>Correction:</strong> {m.correct}</div>}
                      </div>
                    ))}
                    {currentLesson.sentenceBuilder.map((s, i) => (
                      <div key={`s-${i}`} onClick={() => toggleReveal(`s-${i}`)} style={{ cursor: 'pointer', padding: '16px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', transition: 'all 0.2s' }}>
                        🧩 <strong>Unjumble:</strong> {s.jumbled}
                        {revealedAnswers[`s-${i}`] && <div className="animate-fade-in" style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e5e7eb', color: '#10b981' }}>✅ <strong>Answer:</strong> {s.correct}</div>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 6. Speaking Challenge */}
                <div className="card" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d946ef', margin: '0 0 16px 0' }}>6. Speaking Challenge</h3>
                  <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>🎙 {currentLesson.speakingTask.task}</p>
                  <ul style={{ color: '#475569' }}>{currentLesson.speakingTask.points.map((p,i) => <li key={i}>{p}</li>)}</ul>
                  <button onClick={() => { setActiveTab('voice'); handleReset(); }} className="btn btn-primary" style={{ marginTop: '12px' }}>Go to Voice Studio <ArrowRight size={16} /></button>
                </div>

                {/* 7 & 8. Email & Rapid Fire */}
                <div className="card">
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0ea5e9', margin: '0 0 16px 0' }}>7. Email Task & Rapid Fire</h3>
                  <div style={{ marginBottom: '24px' }}>
                    <p style={{ fontWeight: '500' }}>✉️ Task: {currentLesson.emailTask.situation}</p>
                    <div onClick={() => toggleReveal('email')} style={{ cursor: 'pointer', color: 'var(--primary)', fontWeight: 'bold' }}>{revealedAnswers['email'] ? 'Hide Sample Email' : 'Show Sample Email'}</div>
                    {revealedAnswers['email'] && (
                      <pre className="animate-fade-in" style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', marginTop: '12px', whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{currentLesson.emailTask.sample}</pre>
                    )}
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 12px 0' }}>⚡ Rapid Fire Q&A</h4>
                    {currentLesson.rapidFire.map((rf, i) => (
                      <div key={i} onClick={() => toggleReveal(`rf-${i}`)} style={{ cursor: 'pointer', padding: '12px', backgroundColor: '#f1f5f9', borderRadius: '8px', marginBottom: '8px' }}>
                        ❓ <strong>{rf.question}</strong>
                        {revealedAnswers[`rf-${i}`] && <div className="animate-fade-in" style={{ marginTop: '8px', color: '#10b981', fontWeight: 'bold' }}>💡 Answer: {rf.answer}</div>}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

        {/* MCQ QUIZZES */}
        {activeTab === 'mcq' && (
          <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h1 style={{ fontSize: '2.5rem', margin: 0 }}>Grammar <span className="text-gradient">Quizzes</span></h1>
              {isQuizActive && <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--primary)' }}>Score: {mcqScore}</div>}
            </div>
            <p style={{ color: '#475569', marginBottom: '32px' }}>Test your corporate grammar and communication skills.</p>
            
            {!isQuizActive ? (
              <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', textAlign: 'center' }}>Dynamic AI Quiz Generator</h2>
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>Select Grammar Topic</label>
                  <select value={mcqTopic} onChange={(e) => setMcqTopic(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '1rem' }}>
                    <option value="Tenses and Verb Forms">Tenses & Verb Forms</option>
                    <option value="Active and Passive Voice">Active & Passive Voice</option>
                    <option value="Prepositions">Prepositions</option>
                    <option value="Articles and Determiners">Articles & Determiners</option>
                    <option value="Corporate Vocabulary & Jargon">Corporate Vocabulary & Jargon</option>
                    <option value="Polite Corporate Conflict Resolution">Polite Corporate Conflict Resolution</option>
                  </select>
                </div>

                <div style={{ marginBottom: '32px' }}>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>Number of Questions</label>
                  <select value={mcqCount} onChange={(e) => setMcqCount(Number(e.target.value))} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '1rem' }}>
                    <option value={3}>3 Questions (Quick Practice)</option>
                    <option value={5}>5 Questions (Standard)</option>
                    <option value={10}>10 Questions (Full Test)</option>
                  </select>
                </div>

                <button onClick={generateQuiz} disabled={mcqLoading} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1.1rem' }}>
                  {mcqLoading ? <Loader className="animate-spin" /> : 'Generate Custom Quiz'}
                </button>
              </div>
            ) : (
              <div className="card" style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.9rem', color: '#475569', fontWeight: 'bold' }}>QUESTION {currentMcqIdx + 1} OF {mcqs.length}</span>
                  {selectedOption === null && <span style={{ color: timeLeft <= 2 ? '#ef4444' : 'var(--primary)', fontWeight: 'bold', fontSize: '1.2rem', padding: '4px 12px', borderRadius: '50px', backgroundColor: timeLeft <= 2 ? '#fef2f2' : '#f3e8ff' }}>⏱ {timeLeft}s</span>}
                  <button onClick={() => setIsQuizActive(false)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Quit Test</button>
                </div>
                
                <h2 style={{ fontSize: '1.5rem', marginTop: '8px', marginBottom: '24px' }}>{mcqs[currentMcqIdx].question}</h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {mcqs[currentMcqIdx].options.map((opt, i) => {
                    const isSelected = selectedOption === i;
                    const isCorrect = mcqs[currentMcqIdx].correctIndex === i;
                    const showAnswer = selectedOption !== null;
                    
                    let bgColor = '#f9fafb';
                    let borderColor = '#e5e7eb';
                    let textColor = 'var(--text-main)';

                    if (showAnswer) {
                      if (isCorrect) {
                        bgColor = '#ecfdf5';
                        borderColor = '#10b981';
                        textColor = '#065f46';
                      } else if (isSelected && !isCorrect) {
                        bgColor = '#fef2f2';
                        borderColor = '#ef4444';
                        textColor = '#991b1b';
                      }
                    } else if (isSelected) {
                      borderColor = 'var(--primary)';
                    }

                    return (
                      <button 
                        key={i}
                        disabled={showAnswer}
                        onClick={() => {
                          setSelectedOption(i);
                          if (i === mcqs[currentMcqIdx].correctIndex) setMcqScore(prev => prev + 10);
                        }}
                        style={{ 
                          textAlign: 'left', padding: '16px 20px', borderRadius: '12px', cursor: showAnswer ? 'default' : 'pointer',
                          fontSize: '1.05rem', backgroundColor: bgColor, border: `2px solid ${borderColor}`, color: textColor,
                          transition: 'all 0.2s', fontWeight: '500'
                        }}
                      >
                        {opt} {showAnswer && isCorrect && <CheckCircle size={18} style={{ float: 'right' }} />}
                      </button>
                    );
                  })}
                </div>

                {selectedOption !== null && (
                  <div className="animate-fade-in" style={{ marginTop: '24px', padding: '16px', backgroundColor: '#f1f5f9', borderRadius: '12px', borderLeft: `4px solid ${selectedOption === -1 ? '#ef4444' : 'var(--primary)'}` }}>
                    {selectedOption === -1 && <p style={{ color: '#ef4444', fontWeight: 'bold', marginBottom: '8px' }}>⏱ Time's Up!</p>}
                    <p style={{ margin: 0 }}><strong>Explanation:</strong> {mcqs[currentMcqIdx].explanation}</p>
                  </div>
                )}
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                  {currentMcqIdx < mcqs.length - 1 ? (
                    <button className="btn btn-primary" disabled={selectedOption === null} onClick={() => { setCurrentMcqIdx(prev => prev + 1); setSelectedOption(null); setTimeLeft(10); }}>
                      Next Question <ChevronRight size={18} />
                    </button>
                  ) : (
                    <button className="btn btn-primary" disabled={selectedOption === null} onClick={() => { setIsQuizActive(false); addXP(10, 'Quiz Completion'); }}>
                      Finish Quiz
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* REAL-TIME CHAT (NEW) */}
        {activeTab === 'chat' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '650px' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Real-time <span className="text-gradient">Negotiation Chat</span></h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Practice corporate text messaging. Current Scenario: <strong>Salary Negotiation</strong></p>
            
            <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden', height: '500px' }}>
              {/* Chat Message History */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: '#f8fafc' }}>
                {chatMessages.map((msg, idx) => {
                  const isUser = msg.role === 'user';
                  return (
                    <div key={idx} style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
                      <div style={{
                        maxWidth: '75%', padding: '12px 16px', fontSize: '1rem', lineHeight: '1.5',
                        borderRadius: '16px',
                        borderBottomRightRadius: isUser ? '4px' : '16px',
                        borderBottomLeftRadius: !isUser ? '4px' : '16px',
                        backgroundColor: isUser ? 'var(--primary)' : 'white',
                        color: isUser ? 'white' : 'var(--text-main)',
                        boxShadow: 'var(--shadow-sm)',
                        border: isUser ? 'none' : '1px solid var(--card-border)'
                      }}>
                        {msg.content}
                      </div>
                    </div>
                  )
                })}
                {chatLoading && (
                  <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <div style={{ maxWidth: '75%', padding: '12px 16px', borderRadius: '16px', borderBottomLeftRadius: '4px', backgroundColor: 'white', border: '1px solid var(--card-border)', color: 'var(--text-muted)', boxShadow: 'var(--shadow-sm)' }}>
                      <Loader size={16} className="animate-spin" /> AI is typing...
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              
              {/* Chat Input Box */}
              <div style={{ padding: '16px 24px', backgroundColor: 'white', borderTop: '1px solid var(--card-border)', display: 'flex', gap: '12px' }}>
                <input 
                  type="text" 
                  value={chatInput} 
                  onChange={(e) => setChatInput(e.target.value)} 
                  onKeyDown={(e) => e.key === 'Enter' && sendChatMessage()}
                  placeholder="Type your message..." 
                  style={{ flex: 1, padding: '12px 16px', borderRadius: '50px', border: '1px solid var(--card-border)', fontSize: '1rem', outline: 'none', backgroundColor: '#f8fafc' }} 
                />
                <button onClick={sendChatMessage} disabled={chatLoading} className="btn btn-primary" style={{ padding: '0 24px', height: '100%', borderRadius: '50px' }}>
                  Send <ArrowRight size={18} />
                </button>
              </div>
            </div>
            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <button 
                onClick={() => setChatMessages([{ role: 'assistant', content: 'Hi there! I am your AI Hiring Manager. We are practicing a Salary Negotiation today. We just extended a base offer of $105,000 for the Senior Dev role. What are your thoughts?' }])} 
                className="btn btn-secondary" style={{ fontSize: '0.85rem', padding: '8px 16px' }}
              >
                <RefreshCw size={14} /> Restart Scenario
              </button>
            </div>
          </div>
        )}

        {/* READING COMPREHENSION */}
        {activeTab === 'reading' && (
          <div className="animate-fade-in">
            <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Enhance <span className="text-gradient">Reading Skills</span></h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Boost comprehension, reading speed, and explore curated books.</p>

            {/* ── Sub-Tab Navigation ── */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', borderBottom: '2px solid #e2e8f0', paddingBottom: '0' }}>
              {[
                { id: 'comprehension', label: 'Reading Comprehension', icon: <FileText size={16}/> },
                { id: 'fastread', label: 'Fast Reading', icon: <Zap size={16}/> },
                { id: 'books', label: 'Read Books', icon: <Book size={16}/> },
              ].map(t => (
                <button key={t.id} onClick={() => { setReadingSubTab(t.id); if(t.id === 'fastread'){ setFrIsPlaying(false); setFrWordIndex(0); setFrFinished(false); clearInterval(frIntervalRef.current); } }}
                  style={{ display:'flex', alignItems:'center', gap:'6px', padding:'12px 20px', border:'none', background:'none',
                    fontWeight: readingSubTab === t.id ? '700' : '500', fontSize:'0.92rem', cursor:'pointer',
                    color: readingSubTab === t.id ? '#7c3aed' : '#64748b',
                    borderBottom: readingSubTab === t.id ? '3px solid #7c3aed' : '3px solid transparent',
                    marginBottom:'-2px', transition:'all 0.2s' }}>
                  {t.icon} {t.label}
                </button>
              ))}
            </div>

            {/* ═══ SUB-TAB: Comprehension (original) ═══ */}
            {readingSubTab === 'comprehension' && (
              <div className="animate-fade-in">
                <div className="card" style={{ marginBottom: '32px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <div style={{ flex: '1 1 250px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.9rem' }}>Choose Scenario Topic</label>
                    <select className="card" value={readingTopic} onChange={(e) => setReadingTopic(e.target.value)}
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', cursor: 'pointer', outline: 'none' }}>
                      <option value="IT Security Policy Update">IT Security Policy Update</option>
                      <option value="Quarterly Earnings Memo">Quarterly Earnings Memo</option>
                      <option value="Technical Outage Post-Mortem">Technical Outage Post-Mortem</option>
                      <option value="HR Performance Review Guidelines">HR Performance Review Guidelines</option>
                      <option value="Client Project Kickoff">Client Project Kickoff</option>
                    </select>
                  </div>
                  <button onClick={generateReading} disabled={readingLoading} className="btn btn-primary" style={{ marginTop: '26px' }}>
                    {readingLoading ? <><Loader size={18} className="animate-spin" /> Generating Memo...</> : <><Book size={18} /> Generate Passage</>}
                  </button>
                </div>
                {readingData && (
                  <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <div className="card" style={{ backgroundColor: '#ffffff', border: '1px solid var(--card-border)', padding: '40px', boxShadow: 'var(--shadow-md)', borderLeft: '4px solid var(--primary)' }}>
                      <h2 style={{ fontSize: '1.8rem', marginBottom: '24px', color: '#0f172a', borderBottom: '1px solid var(--card-border)', paddingBottom: '16px' }}>{readingData.title}</h2>
                      <div style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#334155', whiteSpace: 'pre-wrap' }}>{readingData.content}</div>
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.3rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><BookOpen size={20} color="var(--primary)"/> Key Vocabulary</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                        {readingData.vocabulary.map((v, idx) => (
                          <div key={idx} className="card" style={{ padding: '16px', borderLeft: '3px solid #0ea5e9' }}>
                            <h4 style={{ color: '#0f172a', marginBottom: '4px', fontSize: '1.1rem' }}>{v.word}</h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{v.definition}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="card">
                      <h3 style={{ fontSize: '1.4rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}><CheckSquare size={22} color="#10b981"/> Comprehension Check</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {readingData.questions.map((q, qIdx) => (
                          <div key={qIdx} style={{ paddingBottom: '24px', borderBottom: qIdx < readingData.questions.length - 1 ? '1px solid var(--card-border)' : 'none' }}>
                            <p style={{ fontWeight: '600', fontSize: '1.1rem', marginBottom: '16px' }}>{qIdx + 1}. {q.question}</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                              {q.options.map((opt, oIdx) => {
                                const isSelected = readingAnswers[qIdx] === oIdx;
                                let bgColor = isSelected ? '#eff6ff' : '#ffffff';
                                let bdColor = isSelected ? '#3b82f6' : 'var(--card-border)';
                                let textColor = isSelected ? '#1d4ed8' : '#334155';
                                if (readingScore !== null) {
                                  const isCorrect = q.correctIndex === oIdx;
                                  if (isCorrect) { bgColor = '#ecfdf5'; bdColor = '#10b981'; textColor = '#065f46'; }
                                  else if (isSelected && !isCorrect) { bgColor = '#fef2f2'; bdColor = '#ef4444'; textColor = '#991b1b'; }
                                  else { bgColor = '#ffffff'; bdColor = 'var(--card-border)'; }
                                }
                                return (
                                  <button key={oIdx} disabled={readingScore !== null} onClick={() => setReadingAnswers({...readingAnswers, [qIdx]: oIdx })}
                                    style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderRadius: '8px', border: `1px solid ${bdColor}`, backgroundColor: bgColor, color: textColor, cursor: readingScore !== null ? 'default' : 'pointer', textAlign: 'left', transition: 'all 0.2s', fontWeight: isSelected ? '500' : '400', opacity: readingScore !== null && !isSelected && q.correctIndex !== oIdx ? 0.6 : 1 }}>
                                    <div style={{ minWidth:'24px', height:'24px', borderRadius:'50%', border: `2px solid ${isSelected ? bdColor : '#cbd5e1'}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                                      {isSelected && <div style={{ width:'12px', height:'12px', borderRadius:'50%', backgroundColor:bdColor }} />}
                                    </div>
                                    {opt}
                                  </button>
                                );
                              })}
                            </div>
                            {readingScore !== null && (
                              <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid #64748b' }}>
                                <p style={{ fontSize: '0.95rem', color: '#334155' }}><strong>Explanation:</strong> {q.explanation}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      {Object.keys(readingAnswers).length === readingData.questions.length && readingScore === null && (
                        <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end' }}>
                          <button onClick={submitReadingQuiz} className="btn btn-primary" style={{ padding: '12px 32px' }}>Submit Answers <CheckCircle size={18} /></button>
                        </div>
                      )}
                      {readingScore !== null && (
                        <div className="animate-fade-in" style={{ marginTop: '32px', padding: '24px', borderRadius: '12px', backgroundColor: readingScore >= 70 ? '#ecfdf5' : '#fef2f2', border: `1px solid ${readingScore >= 70 ? '#10b981' : '#ef4444'}`, display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div style={{ padding: '16px', backgroundColor: 'white', borderRadius: '50%', boxShadow: 'var(--shadow-sm)' }}><Award size={32} color={readingScore >= 70 ? '#10b981' : '#ef4444'} /></div>
                          <div>
                            <h3 style={{ fontSize: '1.4rem', color: readingScore >= 70 ? '#065f46' : '#991b1b', margin: 0 }}>You scored {readingScore}%!</h3>
                            <p style={{ color: readingScore >= 70 ? '#047857' : '#b91c1c', marginTop: '4px' }}>{readingScore === 100 ? "Perfect reading comprehension! Extra 25 XP awarded." : "Review the explanations above to see what you missed."}</p>
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
                {/* Info Banner */}
                <div className="card" style={{ marginBottom:'28px', background:'linear-gradient(135deg, #faf5ff 0%, #f0e7ff 100%)', border:'1px solid #e9d5ff', padding:'24px 28px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'12px' }}>
                    <div style={{ width:'40px', height:'40px', borderRadius:'10px', background:'linear-gradient(135deg,#7c3aed,#a855f7)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <Zap size={20} color="#fff" />
                    </div>
                    <div>
                      <h3 style={{ margin:0, color:'#4c1d95', fontSize:'1.15rem' }}>Speed Reading Trainer</h3>
                      <p style={{ margin:0, color:'#7c3aed', fontSize:'0.82rem' }}>Focus on the highlighted word — train your brain to read faster</p>
                    </div>
                  </div>
                  <div style={{ display:'flex', gap:'12px', alignItems:'center', flexWrap:'wrap' }}>
                    <span style={{ fontSize:'0.82rem', color:'#6b21a8', fontWeight:'600' }}>Speed:</span>
                    {[{label:'Slow', ms:400},{label:'Medium', ms:250},{label:'Fast', ms:150}].map(s => (
                      <button key={s.label} onClick={() => { setFrSpeed(s.ms); if(frIsPlaying){ clearInterval(frIntervalRef.current); frIntervalRef.current = setInterval(() => setFrWordIndex(p => p + 1), s.ms); } }}
                        style={{ padding:'6px 16px', borderRadius:'20px', border: frSpeed===s.ms ? '2px solid #7c3aed' : '1px solid #d8b4fe', background: frSpeed===s.ms ? '#7c3aed' : 'white', color: frSpeed===s.ms ? '#fff' : '#6b21a8', fontSize:'0.82rem', fontWeight:'600', cursor:'pointer', transition:'all 0.2s' }}>
                        {s.label} ({Math.round(60000/s.ms)} wpm)
                      </button>
                    ))}
                  </div>
                </div>

                {/* Word Display */}
                <div className="card" style={{ textAlign:'center', padding:'60px 32px', marginBottom:'24px', background:'linear-gradient(180deg, #fefefe 0%, #f8fafc 100%)', position:'relative', overflow:'hidden', minHeight:'260px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
                  {/* Decorative circles */}
                  <div style={{ position:'absolute', top:'-30px', right:'-30px', width:'120px', height:'120px', borderRadius:'50%', background:'rgba(139,92,246,0.06)' }} />
                  <div style={{ position:'absolute', bottom:'-20px', left:'-20px', width:'80px', height:'80px', borderRadius:'50%', background:'rgba(236,72,153,0.06)' }} />

                  {!frIsPlaying && !frFinished && frWordIndex === 0 && (
                    <div>
                      <div style={{ width:'80px', height:'80px', borderRadius:'50%', background:'linear-gradient(135deg,#7c3aed,#ec4899)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
                        <Eye size={36} color="#fff" />
                      </div>
                      <h2 style={{ color:'#1e293b', marginBottom:'8px', fontSize:'1.6rem' }}>Ready to Speed Read?</h2>
                      <p style={{ color:'#64748b', fontSize:'0.95rem', maxWidth:'400px' }}>Focus on each word as it appears. Train your eyes to read without sub-vocalizing.</p>
                    </div>
                  )}

                  {(frIsPlaying || (!frIsPlaying && frWordIndex > 0 && !frFinished)) && (
                    <div>
                      <p style={{ fontSize:'3.2rem', fontWeight:'800', color:'#0f172a', letterSpacing:'-0.02em', lineHeight:'1.2', margin:'0 0 16px 0', fontFamily:"'Inter', sans-serif",
                        animation: 'fadeInScale 0.15s ease-out' }}>
                        {frWords[frWordIndex] || ''}
                      </p>
                      <div style={{ fontSize:'0.8rem', color:'#94a3b8' }}>Word {frWordIndex + 1} of {frWords.length}</div>
                      {/* Progress bar */}
                      <div style={{ width:'300px', maxWidth:'100%', height:'4px', backgroundColor:'#e2e8f0', borderRadius:'2px', margin:'16px auto 0', overflow:'hidden' }}>
                        <div style={{ height:'100%', width:`${((frWordIndex+1)/frWords.length)*100}%`, background:'linear-gradient(90deg,#7c3aed,#ec4899)', borderRadius:'2px', transition:'width 0.15s linear' }} />
                      </div>
                    </div>
                  )}

                  {frFinished && (
                    <div className="animate-fade-in">
                      <div style={{ width:'80px', height:'80px', borderRadius:'50%', background:'linear-gradient(135deg,#10b981,#34d399)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
                        <CheckCircle size={36} color="#fff" />
                      </div>
                      <h2 style={{ color:'#065f46', marginBottom:'8px' }}>Session Complete!</h2>
                      <p style={{ color:'#047857', fontSize:'0.95rem', marginBottom:'4px' }}>You read <strong>{frWords.length} words</strong> at <strong>{Math.round(60000/frSpeed)} wpm</strong></p>
                      <p style={{ color:'#64748b', fontSize:'0.85rem' }}>Estimated time: {((frWords.length * frSpeed)/1000).toFixed(1)}s</p>
                    </div>
                  )}
                </div>

                {/* Controls */}
                <div style={{ display:'flex', gap:'12px', justifyContent:'center' }}>
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
                    }} className="btn btn-primary" style={{ padding:'14px 36px', fontSize:'1rem', borderRadius:'12px', gap:'8px', display:'flex', alignItems:'center' }}>
                      {frIsPlaying ? <><Pause size={18}/> Pause</> : <><Play size={18}/> {frWordIndex > 0 ? 'Resume' : 'Start Reading'}</>}
                    </button>
                  )}
                  {(frWordIndex > 0 || frFinished) && (
                    <button onClick={() => { clearInterval(frIntervalRef.current); setFrIsPlaying(false); setFrWordIndex(0); setFrFinished(false); }}
                      style={{ padding:'14px 28px', borderRadius:'12px', border:'1px solid #e2e8f0', background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', gap:'8px', fontWeight:'600', color:'#64748b', fontSize:'0.95rem' }}>
                      <RotateCcw size={16}/> Restart
                    </button>
                  )}
                </div>

                {/* Passage Preview */}
                <div className="card" style={{ marginTop:'28px', padding:'24px 28px', maxHeight:'180px', overflow:'auto', borderLeft:'4px solid #e9d5ff' }}>
                  <h4 style={{ fontSize:'0.82rem', textTransform:'uppercase', letterSpacing:'0.06em', color:'#7c3aed', marginBottom:'12px' }}>Full Passage Preview</h4>
                  <p style={{ fontSize:'0.9rem', lineHeight:'1.8', color:'#475569' }}>
                    {frWords.map((w, i) => (
                      <span key={i} style={{ backgroundColor: i === frWordIndex && frIsPlaying ? '#fef08a' : 'transparent', padding: i === frWordIndex && frIsPlaying ? '2px 4px' : '0', borderRadius:'4px', fontWeight: i === frWordIndex && frIsPlaying ? '700' : '400', transition:'all 0.1s' }}>{w} </span>
                    ))}
                  </p>
                </div>
              </div>
            )}

            {/* ═══ SUB-TAB: Read Books ═══ */}
            {readingSubTab === 'books' && (
              <div className="animate-fade-in">
                {!bookOpen ? (
                  <div>
                    <div className="card" style={{ marginBottom:'24px', background:'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)', border:'1px solid #fde68a', padding:'20px 24px' }}>
                      <p style={{ color:'#92400e', fontSize:'0.9rem', margin:0 }}><strong>📚 Your Library</strong> — Click on a book cover to start reading in our immersive viewer.</p>
                    </div>

                    {/* Book Shelf */}
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:'24px' }}>
                      {/* The ONE Thing Book */}
                      <div onClick={() => { setBookOpen(true); setBookPage(0); setBookZoom(1); }} className="card" style={{ cursor:'pointer', padding:0, overflow:'hidden', transition:'all 0.3s ease', border:'1px solid #e2e8f0', position:'relative' }}
                        onMouseEnter={e => { e.currentTarget.style.transform='translateY(-6px)'; e.currentTarget.style.boxShadow='0 20px 40px rgba(0,0,0,0.12)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow=''; }}>
                        {/* Book Cover */}
                        <div style={{ height:'280px', background:'linear-gradient(145deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'28px', position:'relative', overflow:'hidden' }}>
                          {/* Decorative beam */}
                          <div style={{ position:'absolute', top:'-50px', right:'-50px', width:'200px', height:'200px', borderRadius:'50%', background:'rgba(232,121,35,0.15)' }} />
                          <div style={{ position:'absolute', bottom:'-30px', left:'-30px', width:'140px', height:'140px', borderRadius:'50%', background:'rgba(232,121,35,0.08)' }} />
                          {/* Title */}
                          <div style={{ textAlign:'center', position:'relative', zIndex:1 }}>
                            <p style={{ color:'#e87923', fontSize:'0.72rem', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.15em', marginBottom:'8px' }}>Gary Keller</p>
                            <h3 style={{ color:'#ffffff', fontSize:'1.55rem', fontWeight:'800', lineHeight:'1.2', marginBottom:'4px' }}>THE</h3>
                            <h2 style={{ color:'#e87923', fontSize:'2.4rem', fontWeight:'900', lineHeight:'1', marginBottom:'4px', fontStyle:'italic' }}>ONE</h2>
                            <h3 style={{ color:'#ffffff', fontSize:'1.55rem', fontWeight:'800', lineHeight:'1.2', marginBottom:'12px' }}>THING</h3>
                            <div style={{ width:'40px', height:'2px', background:'#e87923', margin:'0 auto 12px' }} />
                            <p style={{ color:'#94a3b8', fontSize:'0.68rem', lineHeight:'1.4', maxWidth:'160px' }}>The surprisingly simple truth behind extraordinary results</p>
                          </div>
                        </div>
                        {/* Book Info */}
                        <div style={{ padding:'16px 20px' }}>
                          <h4 style={{ color:'#0f172a', fontSize:'1rem', marginBottom:'4px' }}>The ONE Thing</h4>
                          <p style={{ color:'#64748b', fontSize:'0.8rem', marginBottom:'8px' }}>Gary Keller & Jay Papasan</p>
                          <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                            <div style={{ padding:'3px 10px', borderRadius:'20px', background:'#fef3c7', fontSize:'0.72rem', fontWeight:'600', color:'#92400e' }}>Self-Help</div>
                            <div style={{ padding:'3px 10px', borderRadius:'20px', background:'#ecfdf5', fontSize:'0.72rem', fontWeight:'600', color:'#065f46' }}>{bookPages.length} Pages</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ── PDF-like Book Viewer ── */
                  <div className="animate-fade-in">
                    {/* Viewer Toolbar */}
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 20px', background:'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderRadius:'14px 14px 0 0', gap:'12px', flexWrap:'wrap' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                        <button onClick={() => { setBookOpen(false); setBookZoom(1); }} style={{ width:'34px', height:'34px', borderRadius:'8px', border:'1px solid #334155', background:'rgba(255,255,255,0.05)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#94a3b8' }} title="Close">
                          <X size={16}/>
                        </button>
                        <div style={{ color:'#f1f5f9', fontSize:'0.92rem', fontWeight:'600' }}>📖 The ONE Thing</div>
                        <div style={{ color:'#64748b', fontSize:'0.8rem' }}>— Chapter 11: The Success Habit</div>
                      </div>
                      <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                        <button onClick={() => setBookZoom(z => Math.max(0.5, z - 0.15))} style={{ width:'32px', height:'32px', borderRadius:'6px', border:'1px solid #334155', background:'rgba(255,255,255,0.05)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#94a3b8' }}><ZoomOut size={14}/></button>
                        <span style={{ color:'#94a3b8', fontSize:'0.78rem', minWidth:'40px', textAlign:'center' }}>{Math.round(bookZoom*100)}%</span>
                        <button onClick={() => setBookZoom(z => Math.min(2, z + 0.15))} style={{ width:'32px', height:'32px', borderRadius:'6px', border:'1px solid #334155', background:'rgba(255,255,255,0.05)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#94a3b8' }}><ZoomIn size={14}/></button>
                      </div>
                    </div>

                    {/* Page Display */}
                    <div style={{ background:'#374151', padding:'32px 0', display:'flex', justifyContent:'center', alignItems:'flex-start', minHeight:'600px', overflow:'auto', borderRadius:'0 0 14px 14px' }}>
                      <div style={{ transform:`scale(${bookZoom})`, transformOrigin:'top center', transition:'transform 0.25s ease' }}>
                        <img src={bookPages[bookPage]} alt={`Page ${bookPage + 1}`}
                          style={{ maxWidth:'600px', width:'100%', borderRadius:'4px', boxShadow:'0 8px 32px rgba(0,0,0,0.4)', display:'block' }} />
                      </div>
                    </div>

                    {/* Page Navigation */}
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'16px', marginTop:'20px' }}>
                      <button disabled={bookPage === 0} onClick={() => setBookPage(p => p - 1)}
                        style={{ display:'flex', alignItems:'center', gap:'6px', padding:'10px 24px', borderRadius:'10px', border:'1px solid #e2e8f0', background: bookPage === 0 ? '#f1f5f9' : '#fff', cursor: bookPage === 0 ? 'default' : 'pointer', fontWeight:'600', color: bookPage === 0 ? '#cbd5e1' : '#475569', fontSize:'0.9rem' }}>
                        <ChevronLeft size={16}/> Previous
                      </button>
                      <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                        {bookPages.map((_, i) => (
                          <button key={i} onClick={() => setBookPage(i)}
                            style={{ width: bookPage === i ? '32px' : '10px', height:'10px', borderRadius:'20px', border:'none', background: bookPage === i ? 'linear-gradient(90deg,#7c3aed,#ec4899)' : '#cbd5e1', cursor:'pointer', transition:'all 0.3s ease' }} />
                        ))}
                      </div>
                      <button disabled={bookPage === bookPages.length - 1} onClick={() => setBookPage(p => p + 1)}
                        style={{ display:'flex', alignItems:'center', gap:'6px', padding:'10px 24px', borderRadius:'10px', border:'1px solid #e2e8f0', background: bookPage === bookPages.length - 1 ? '#f1f5f9' : '#fff', cursor: bookPage === bookPages.length - 1 ? 'default' : 'pointer', fontWeight:'600', color: bookPage === bookPages.length - 1 ? '#cbd5e1' : '#475569', fontSize:'0.9rem' }}>
                        Next <ChevronRight size={16}/>
                      </button>
                    </div>
                    <p style={{ textAlign:'center', marginTop:'8px', color:'#94a3b8', fontSize:'0.82rem' }}>Page {bookPage + 1} of {bookPages.length}</p>
                  </div>
                )}
              </div>
            )}

          </div>
        )}

        {/* ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="animate-fade-in">
            <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>My <span className="text-gradient">Progress</span></h1>
            <p style={{ color: '#475569', marginBottom: '32px' }}>Track your evaluation scores over time.</p>
            
            <div className="card" style={{ marginBottom: '24px' }}>
              <h3 style={{ marginBottom: '20px' }}>Recent Scores</h3>
              {scores.length === 0 ? (
                <p style={{ color: '#475569', textAlign: 'center', padding: '40px 0' }}>Complete a Voice or Email mock test to see your analytics!</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {scores.slice().reverse().map((s, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '80px', fontSize: '0.85rem', color: '#475569' }}>{new Date(s.date).toLocaleDateString()}</div>
                      <div style={{ width: '60px', fontWeight: 'bold', color: s.type === 'voice' ? '#3b82f6' : '#8b5cf6' }}>{s.type.toUpperCase()}</div>
                      <div style={{ flex: 1, backgroundColor: '#f1f5f9', height: '12px', borderRadius: '10px', overflow: 'hidden' }}>
                        <div style={{ width: `${s.score}%`, height: '100%', backgroundColor: s.score > 80 ? '#10b981' : (s.score > 60 ? '#f59e0b' : '#ef4444'), transition: 'width 1s ease' }}></div>
                      </div>
                      <div style={{ width: '40px', textAlign: 'right', fontWeight: 'bold' }}>{s.score}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* VOICE */}
        {activeTab === 'voice' && (
          <div className="animate-fade-in">
            <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>AI Voice <span className="text-gradient">Evaluation</span></h1>
            <p style={{ color: '#475569', marginBottom: '32px' }}>Practice answering: <strong>"Tell me about a time you overcame a technical challenge."</strong></p>
            
            {(micStatus && !isListening) && (
              <div style={{ backgroundColor: '#fef2f2', color: '#ef4444', padding: '12px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                <AlertCircle size={18} /> {micStatus}
              </div>
            )}

            <div className="card" style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <label style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Your Response {isListening && <span style={{ color: '#ef4444', fontSize: '0.85rem', fontWeight: 'normal' }}>{micStatus}</span>}
                </label>
                <button onClick={toggleListening} className="btn" style={{ padding: '8px 16px', borderRadius: '50px', fontSize: '0.9rem', backgroundColor: isListening ? '#fef2f2' : '#f3f4f6', color: isListening ? '#ef4444' : 'var(--text-main)', border: isListening ? '1px solid #ef4444' : '1px solid transparent' }}>
                  <Mic size={16} className={isListening ? "animate-pulse" : ""} /> {isListening ? "Stop Recording" : "Start Recording"}
                </button>
              </div>
              <textarea rows="6" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Type or hit 'Start Recording' and speak..." style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }} />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px', gap: '12px' }}>
                <button className="btn btn-secondary" onClick={handleReset}><RefreshCw size={16} /> Reset</button>
                <button className="btn btn-primary" onClick={() => handleEvaluate('voice')} disabled={evalLoading}>
                  {evalLoading ? <Loader size={18} className="animate-spin" /> : <><CheckCircle size={18} /> Submit to AI</>}
                </button>
              </div>
            </div>

            {feedback && (
              <div className="card animate-fade-in" style={{ borderLeft: `4px solid ${feedback.score > 80 ? '#10b981' : '#f59e0b'}`, backgroundColor: '#ffffff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>Voice Analysis Score: {feedback.score}/100</h3>
                  <button onClick={() => playTTS(feedback.feedback)} className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '0.85rem' }}><Volume2 size={16} /> Listen to Feedback</button>
                </div>

                {feedback.breakdown && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                    <div style={{ backgroundColor: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', fontWeight: 'bold' }}>FLUENCY</p>
                      <p style={{ margin: '4px 0 0 0', fontSize: '1.5rem', fontWeight: 'bold', color: feedback.breakdown.fluency > 80 ? '#10b981' : '#f59e0b' }}>{feedback.breakdown.fluency}/100</p>
                    </div>
                    <div style={{ backgroundColor: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', fontWeight: 'bold' }}>VOCABULARY</p>
                      <p style={{ margin: '4px 0 0 0', fontSize: '1.5rem', fontWeight: 'bold', color: feedback.breakdown.vocabulary > 80 ? '#10b981' : '#f59e0b' }}>{feedback.breakdown.vocabulary}/100</p>
                    </div>
                    <div style={{ backgroundColor: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', fontWeight: 'bold' }}>FILLER WORDS</p>
                      <p style={{ margin: '4px 0 0 0', fontSize: '1.5rem', fontWeight: 'bold', color: feedback.breakdown.fillerWords === 0 ? '#10b981' : '#ef4444' }}>{feedback.breakdown.fillerWords} Detected</p>
                    </div>
                  </div>
                )}

                <p style={{ color: '#0f172a', lineHeight: '1.6', fontSize: '1.05rem', fontWeight: '500' }}>{feedback.feedback}</p>

                {feedback.suggestions && (
                  <div style={{ marginTop: '20px' }}>
                    <h4 style={{ marginBottom: '12px' }}>AI Coaching Output:</h4>
                    <ul style={{ paddingLeft: '20px', margin: 0, color: '#475569', lineHeight: '1.7' }}>
                      {feedback.suggestions.map((suggestion, idx) => (
                        <li key={idx}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* EMAIL */}
        {activeTab === 'email' && (
          <div className="animate-fade-in">
            <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Corporate <span className="text-gradient">Scenarios</span></h1>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '8px', color: '#475569' }}>Select a Scenario to Practice</label>
              <select value={selectedScenario.id} onChange={(e) => { setSelectedScenario(emailScenarios.find(s => s.id === e.target.value)); handleReset(); }} style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none', backgroundColor: '#ffffff', cursor: 'pointer' }}>
                {emailScenarios.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>

            <p style={{ color: 'var(--primary)', marginBottom: '32px', backgroundColor: '#f0f9ff', padding: '16px', borderRadius: '10px', fontWeight: '500' }}>
              <strong>Task:</strong> {selectedScenario.desc}
            </p>
            
            <div className="card" style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <label style={{ fontWeight: '600' }}>Your Draft</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.9rem', color: '#475569' }}>Tone:</span>
                  <select value={selectedTone} onChange={(e) => setSelectedTone(e.target.value)} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', outline: 'none', backgroundColor: '#ffffff', cursor: 'pointer' }}>
                    <option value="Professional">Professional</option>
                    <option value="Formal">Formal</option>
                    <option value="Friendly">Friendly</option>
                    <option value="Confident">Confident</option>
                    <option value="Apologetic">Apologetic</option>
                  </select>
                </div>
              </div>
              <textarea rows="8" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Dear [Name],\n\nI am writing to..." style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
                <button className="btn btn-secondary" onClick={handleReset}><RefreshCw size={16} /> Reset</button>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button className="btn btn-secondary" onClick={handleAutoGenerate} disabled={rewriteLoading} style={{ backgroundColor: '#eff6ff', color: '#2563eb', border: '1px solid #2563eb' }}>
                    {rewriteLoading ? <Loader size={18} className="animate-spin" /> : '⚡ Auto-Generate'}
                  </button>
                  <button className="btn btn-secondary" onClick={handleRewrite} disabled={rewriteLoading} style={{ backgroundColor: '#f0f9ff', color: 'var(--primary)', border: '1px solid var(--primary)' }}>
                    {rewriteLoading ? <Loader size={18} className="animate-spin" /> : '✨ Smart Rewrite'}
                  </button>
                  <button className="btn btn-primary" onClick={() => handleEvaluate('email')} disabled={evalLoading}>
                    {evalLoading ? <Loader size={18} className="animate-spin" /> : <><CheckCircle size={18} /> Evaluate Mail</>}
                  </button>
                </div>
              </div>
            </div>

            {feedback && (
              <div className="card animate-fade-in" style={{ borderLeft: `4px solid ${feedback.score > 80 ? '#10b981' : '#f59e0b'}`, backgroundColor: '#ffffff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ margin: 0 }}>Overall Score: {feedback.score}/100</h3>
                  <button onClick={() => playTTS(feedback.feedback)} className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '0.85rem' }}><Volume2 size={16} /> Listen</button>
                </div>

                {feedback.breakdown && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                    <div style={{ backgroundColor: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', fontWeight: 'bold' }}>GRAMMAR</p>
                      <p style={{ margin: '4px 0 0 0', fontSize: '1.5rem', fontWeight: 'bold', color: feedback.breakdown.grammar > 80 ? '#10b981' : '#f59e0b' }}>{feedback.breakdown.grammar}/100</p>
                    </div>
                    <div style={{ backgroundColor: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', fontWeight: 'bold' }}>PROFESSIONAL TONE</p>
                      <p style={{ margin: '4px 0 0 0', fontSize: '1.5rem', fontWeight: 'bold', color: feedback.breakdown.tone > 80 ? '#10b981' : '#f59e0b' }}>{feedback.breakdown.tone}/100</p>
                    </div>
                    <div style={{ backgroundColor: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', fontWeight: 'bold' }}>CLARITY</p>
                      <p style={{ margin: '4px 0 0 0', fontSize: '1.5rem', fontWeight: 'bold', color: feedback.breakdown.clarity > 80 ? '#10b981' : '#f59e0b' }}>{feedback.breakdown.clarity}/100</p>
                    </div>
                  </div>
                )}

                <p style={{ color: '#0f172a', lineHeight: '1.6', fontSize: '1.05rem', fontWeight: '500' }}>{feedback.feedback}</p>

                {feedback.suggestions && (
                  <div style={{ marginTop: '20px' }}>
                    <h4 style={{ marginBottom: '12px' }}>AI Suggestions for Improvement:</h4>
                    <ul style={{ paddingLeft: '20px', margin: 0, color: '#475569', lineHeight: '1.7' }}>
                      {feedback.suggestions.map((suggestion, idx) => (
                        <li key={idx}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
