import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, Code, Cpu, BookOpen, User, Folder, LayoutDashboard, LogOut,
  Target, Facebook, Twitter, Linkedin, Bot, Mic, MicOff, BarChart3, Flame,
  Bookmark, Trophy, Send, X, ArrowRight, Clock, ChevronRight,
  BrainCircuit, Database, Binary, Layers, Globe, HardDrive,
  Sparkles, Users, Play, Pause, RotateCcw, CheckCircle, Timer, ArrowLeft
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import ThemeToggle from '../components/ThemeToggle';
import '../styles/home.css';

// ─── CS Subject Data with images ───
const csSubjects = [
  {
    id: 'ml', title: 'Machine Learning', icon: <BrainCircuit size={28} strokeWidth={1.5} />, color: '#8B5CF6',
    image: '/images/cs-topics/ml.png',
    tagline: 'Teach machines to learn from data',
    overview: 'Machine Learning is a subset of Artificial Intelligence that enables systems to automatically learn and improve from experience without being explicitly programmed.',
    theory: [
      { heading: 'What is Machine Learning?', content: 'Machine Learning focuses on developing algorithms that can access data and use it to learn for themselves. Rather than following strict static program instructions, ML systems build mathematical models from sample data (training data) to make predictions or decisions.' },
      { heading: 'Types of Machine Learning', content: 'Supervised Learning uses labeled data (e.g., spam detection). Unsupervised Learning discovers hidden patterns in unlabeled data (e.g., customer segmentation). Reinforcement Learning learns through trial and reward (e.g., game-playing AI). Semi-supervised and Self-supervised learning combine elements.' },
      { heading: 'Core Algorithms', content: 'Linear Regression for continuous prediction, Logistic Regression for classification, Decision Trees for interpretable models, Random Forests for ensemble accuracy, SVMs for margin-based classification, K-Means for clustering, and Neural Networks for complex pattern recognition.' },
      { heading: 'Real-World Applications', content: 'Recommendation engines (Netflix, Spotify), fraud detection in banking, medical diagnosis, autonomous vehicles, natural language processing, voice assistants, and predictive maintenance in manufacturing.' },
    ],
    concepts: ['Supervised vs Unsupervised', 'Feature Engineering', 'Bias-Variance Tradeoff', 'Cross Validation', 'Gradient Descent', 'Ensemble Methods', 'Overfitting & Regularization', 'Model Evaluation Metrics'],
  },
  {
    id: 'dsa', title: 'Data Structures & Algorithms', icon: <Binary size={28} strokeWidth={1.5} />, color: '#EC4899',
    image: '/images/cs-topics/dsa.png',
    tagline: 'The foundation of efficient code',
    overview: 'Data Structures organize and store data efficiently, while Algorithms are step-by-step procedures for solving problems. Together, they are the backbone of computer science.',
    theory: [
      { heading: 'Why DSA Matters', content: 'Every software system relies on efficient data organization and problem solving. Understanding DSA helps write faster code, ace technical interviews, and build scalable systems. Companies like Google, Amazon, and Meta heavily test DSA skills.' },
      { heading: 'Essential Data Structures', content: 'Arrays for indexed access, Linked Lists for dynamic insertion, Stacks (LIFO) for undo operations, Queues (FIFO) for scheduling, Hash Tables for O(1) lookup, Trees for hierarchical data, Graphs for networks, and Heaps for priority queues.' },
      { heading: 'Key Algorithms', content: 'Sorting: QuickSort (O(n log n) avg), MergeSort (stable), HeapSort. Searching: Binary Search (O(log n)). Graph: BFS, DFS, Dijkstra, Bellman-Ford. Dynamic Programming for optimal substructure problems. Greedy algorithms for local optimal choices.' },
      { heading: 'Complexity Analysis', content: 'Big-O notation measures worst-case time/space complexity. O(1) constant, O(log n) logarithmic, O(n) linear, O(n log n) linearithmic, O(n²) quadratic, O(2ⁿ) exponential. Understanding complexity is crucial for choosing the right approach.' },
    ],
    concepts: ['Big-O Notation', 'Arrays & Linked Lists', 'Trees & Graphs', 'Dynamic Programming', 'Sorting Algorithms', 'Hash Maps', 'BFS & DFS', 'Recursion & Backtracking'],
  },
  {
    id: 'dl', title: 'Deep Learning', icon: <Layers size={28} strokeWidth={1.5} />, color: '#F59E0B',
    image: '/images/cs-topics/dl.png',
    tagline: 'Neural networks that mimic the brain',
    overview: 'Deep Learning uses multi-layered neural networks to model complex patterns. Inspired by the human brain, it powers image recognition, language translation, and self-driving cars.',
    theory: [
      { heading: 'Neural Network Fundamentals', content: 'A neural network consists of layers of interconnected nodes (neurons). Each connection has a weight. Data flows forward through the network (forward propagation), and errors flow backward to update weights (backpropagation). Activation functions add non-linearity.' },
      { heading: 'Key Architectures', content: 'CNNs (Convolutional Neural Networks) excel at image processing using convolution layers and pooling. RNNs (Recurrent Neural Networks) handle sequential data like text and time series. LSTMs solve the vanishing gradient problem. Transformers use attention mechanisms for parallel processing.' },
      { heading: 'Training Deep Networks', content: 'Training requires large datasets, GPU computation, and careful hyperparameter tuning. Techniques include batch normalization, dropout for regularization, learning rate scheduling, data augmentation, and transfer learning (using pre-trained models like ResNet, BERT).' },
      { heading: 'Applications', content: 'Computer vision (face recognition, medical imaging), NLP (ChatGPT, translation), speech recognition (Siri, Alexa), autonomous driving, drug discovery, art generation (DALL-E), and game playing (AlphaGo).' },
    ],
    concepts: ['Neural Network Basics', 'CNNs for Vision', 'RNNs & LSTMs', 'Backpropagation', 'Transfer Learning', 'Attention Mechanism', 'GANs', 'Batch Normalization'],
  },
  {
    id: 'toc', title: 'Theory of Computation', icon: <Cpu size={28} strokeWidth={1.5} />, color: '#10B981',
    image: '/images/cs-topics/toc.png',
    tagline: 'What computers can and cannot solve',
    overview: 'Theory of Computation studies the fundamental capabilities and limitations of computers — what problems can be solved algorithmically and how efficiently.',
    theory: [
      { heading: 'Automata Theory', content: 'Finite Automata (DFA/NFA) recognize regular languages and power tools like regex. Pushdown Automata add a stack to handle context-free languages (used in programming language parsers). Turing Machines can simulate any computation possible.' },
      { heading: 'Formal Languages', content: 'The Chomsky hierarchy classifies languages: Type 3 (Regular) — recognized by finite automata, Type 2 (Context-Free) — by pushdown automata, Type 1 (Context-Sensitive), Type 0 (Recursively Enumerable) — by Turing machines.' },
      { heading: 'Computability', content: 'The Halting Problem proves that no algorithm can determine if an arbitrary program will halt. The Church-Turing thesis states that Turing machines capture the intuitive notion of computability. Some problems are fundamentally undecidable.' },
      { heading: 'Complexity Theory', content: 'P contains problems solvable in polynomial time. NP contains problems verifiable in polynomial time. The P vs NP question asks whether every easily verifiable problem is also easily solvable — one of the greatest unsolved problems in CS.' },
    ],
    concepts: ['Finite Automata (DFA/NFA)', 'Context-Free Grammars', 'Turing Machines', 'P vs NP Problem', 'Decidability', 'Church-Turing Thesis', 'Regular Expressions', 'Chomsky Hierarchy'],
  },
  {
    id: 'genai', title: 'Generative AI', icon: <Sparkles size={28} strokeWidth={1.5} />, color: '#6366F1',
    image: '/images/cs-topics/genai.png',
    tagline: 'AI that creates new content',
    overview: 'Generative AI creates new content — text, images, music, code. Built on foundation models like GPTs and diffusion models, GenAI has revolutionized technology.',
    theory: [
      { heading: 'Foundation Models', content: 'Large Language Models (LLMs) like GPT-4, Claude, and Gemini are trained on vast text corpora using the Transformer architecture. They predict the next token in a sequence, enabling human-like text generation, reasoning, and code writing.' },
      { heading: 'Transformer Architecture', content: 'Transformers use self-attention to process all tokens simultaneously (unlike sequential RNNs). Multi-head attention captures different relationship types. Positional encoding preserves word order. This architecture powers both text (GPT) and image (ViT) models.' },
      { heading: 'Prompt Engineering & RAG', content: 'Prompt engineering crafts effective instructions for AI models. Techniques include few-shot examples, chain-of-thought reasoning, and system prompts. RAG (Retrieval-Augmented Generation) grounds responses in external knowledge bases for accuracy.' },
      { heading: 'Image & Video Generation', content: 'Diffusion models (Stable Diffusion, DALL-E 3) generate images by learning to reverse a noise-adding process. GANs pit a generator against a discriminator. These power text-to-image, image editing, video synthesis, and creative tools.' },
    ],
    concepts: ['Large Language Models', 'Transformers', 'Prompt Engineering', 'RAG', 'Fine-Tuning & RLHF', 'Diffusion Models', 'Tokenization', 'Embeddings'],
  },
  {
    id: 'os', title: 'Operating Systems', icon: <HardDrive size={28} strokeWidth={1.5} />, color: '#EF4444',
    image: '/images/cs-topics/os.png',
    tagline: 'Managing hardware and software resources',
    overview: 'An OS manages computer hardware and software resources, acting as an intermediary between users and hardware. It handles processes, memory, files, and I/O.',
    theory: [
      { heading: 'Process Management', content: 'A process is a running program. The OS handles process creation, scheduling (FCFS, SJF, Round Robin, Priority), synchronization (semaphores, mutexes), and inter-process communication (pipes, shared memory, message passing).' },
      { heading: 'Memory Management', content: 'Virtual memory maps logical addresses to physical addresses. Paging divides memory into fixed-size blocks. Segmentation divides by logical sections. Page replacement algorithms (LRU, FIFO, Optimal) handle when physical memory is full. Thrashing occurs with excessive page faults.' },
      { heading: 'Deadlocks', content: 'Deadlock occurs when processes wait circularly for resources. Four conditions: mutual exclusion, hold and wait, no preemption, circular wait. Prevention breaks one condition. Avoidance uses Banker\'s algorithm. Detection uses resource allocation graphs.' },
      { heading: 'File Systems', content: 'File systems organize data on storage devices. FAT, NTFS, ext4, APFS each have tradeoffs. Concepts include inodes, directory structures, disk scheduling (SCAN, C-SCAN), and RAID levels for reliability.' },
    ],
    concepts: ['Process Scheduling', 'Memory & Paging', 'Deadlock Prevention', 'File Systems', 'Virtual Memory', 'Threads & Concurrency', 'System Calls', 'Disk Scheduling'],
  },
  {
    id: 'cn', title: 'Computer Networks', icon: <Globe size={28} strokeWidth={1.5} />, color: '#0EA5E9',
    image: '/images/cs-topics/cn.png',
    tagline: 'How computers communicate globally',
    overview: 'Computer Networks enable communication between devices worldwide. The layered architecture provides a framework for understanding how data travels from one machine to another.',
    theory: [
      { heading: 'OSI & TCP/IP Models', content: 'The OSI model has 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, Application. The TCP/IP model simplifies to 4 layers: Network Access, Internet, Transport, Application. Each layer adds headers (encapsulation) as data moves down.' },
      { heading: 'Transport Layer', content: 'TCP provides reliable, ordered delivery with three-way handshake, flow control, and congestion control. UDP provides fast, connectionless delivery for real-time applications (video calls, gaming). Port numbers identify specific services.' },
      { heading: 'Network Layer', content: 'IP addressing (IPv4: 32-bit, IPv6: 128-bit) identifies devices. Subnetting divides networks. Routing protocols (RIP, OSPF, BGP) determine packet paths. NAT translates private to public addresses. ARP maps IP to MAC addresses.' },
      { heading: 'Security', content: 'Firewalls filter traffic by rules. SSL/TLS encrypts data in transit. HTTPS secures web browsing. VPNs create encrypted tunnels. Common attacks include DDoS, man-in-the-middle, DNS spoofing. Defense includes encryption, authentication, and intrusion detection.' },
    ],
    concepts: ['OSI & TCP/IP Models', 'TCP vs UDP', 'IP Addressing & Subnetting', 'DNS & HTTP', 'Routing Protocols', 'Network Security', 'Socket Programming', 'Wireless Networks'],
  },
  {
    id: 'dbms', title: 'Database Management', icon: <Database size={28} strokeWidth={1.5} />, color: '#14B8A6',
    image: '/images/cs-topics/dbms.png',
    tagline: 'Organizing and querying data efficiently',
    overview: 'A DBMS enables creating, managing, and querying databases. It provides the interface between data and applications, ensuring data integrity, security, and performance.',
    theory: [
      { heading: 'Relational Model', content: 'Data is organized in tables (relations) with rows (tuples) and columns (attributes). Primary keys uniquely identify rows. Foreign keys create relationships between tables. ER diagrams model entity relationships before implementation.' },
      { heading: 'SQL Mastery', content: 'DDL (CREATE, ALTER, DROP) defines structure. DML (SELECT, INSERT, UPDATE, DELETE) manipulates data. Joins (INNER, LEFT, RIGHT, FULL) combine tables. Subqueries, GROUP BY, HAVING, and window functions enable complex analysis.' },
      { heading: 'Normalization', content: '1NF: atomic values, no repeating groups. 2NF: no partial dependencies. 3NF: no transitive dependencies. BCNF: every determinant is a candidate key. Normalization reduces redundancy but may impact read performance (denormalization is the trade-off).' },
      { heading: 'Transactions & NoSQL', content: 'ACID properties ensure reliability: Atomicity (all or nothing), Consistency (valid states), Isolation (concurrent safety), Durability (permanent once committed). NoSQL databases (MongoDB, Redis, Cassandra) handle unstructured data with horizontal scaling.' },
    ],
    concepts: ['Relational Model & SQL', 'Normalization (1NF-BCNF)', 'ACID Properties', 'Indexing & Optimization', 'Joins & Subqueries', 'NoSQL Databases', 'Transactions', 'ER Diagrams'],
  },
];

// ─── Chatbot ───
const chatbotResponses = {
  greetings: ["Hi! 👋 I'm your AI Study Buddy. Ask me about any CS topic!"],
  ml: "ML involves training models on data to make predictions. Start with Linear Regression, then Neural Networks. Want to explore a specific algorithm?",
  dsa: "DSA is the backbone of coding interviews! Start with Arrays, then Trees, Graphs, and DP. Practice daily on LeetCode!",
  dl: "Deep Learning uses neural networks with multiple layers. Start with perceptrons, then CNNs and RNNs. TensorFlow & PyTorch are key frameworks!",
  python: "Python is perfect for beginners! Start with variables, loops, OOP. For Data Science: NumPy, Pandas. For Web: Django/Flask.",
  interview: "For tech interviews: 1) DSA fundamentals 2) System Design 3) Behavioral (STAR method) 4) Mock interviews. Need specific tips?",
  default: "Great question! Check the Core CS section for detailed theory, or try our Voice Interview feature! 🎯",
};
function getChatResponse(msg) {
  const l = msg.toLowerCase();
  if (l.match(/\b(hi|hello|hey)\b/)) return chatbotResponses.greetings[0];
  if (l.match(/\b(machine learning|ml|regression)\b/)) return chatbotResponses.ml;
  if (l.match(/\b(dsa|data structure|algorithm|array|tree|graph)\b/)) return chatbotResponses.dsa;
  if (l.match(/\b(deep learning|neural|cnn|rnn)\b/)) return chatbotResponses.dl;
  if (l.match(/\b(python|numpy|pandas)\b/)) return chatbotResponses.python;
  if (l.match(/\b(interview|placement|job)\b/)) return chatbotResponses.interview;
  return chatbotResponses.default;
}

// ─── Sidebar Item ───
const SidebarItem = ({ icon, label, badge, active, onClick }) => (
  <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.97 }} className={`sidebar-item ${active ? 'active' : ''}`} onClick={onClick}>
    <span className="sidebar-item-icon">{icon}</span>
    <span className="sidebar-item-label">{label}</span>
    {badge && <span className="sidebar-item-badge">{badge}</span>}
  </motion.div>
);

// ─── Focus Timer ───
const FocusTimer = () => {
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const intervalRef = useRef(null);
  const presetTimes = [15, 25, 30, 45, 60];

  const startTimer = useCallback(() => {
    const secs = focusMinutes * 60;
    setTotalSeconds(secs);
    setTimeLeft(secs);
    setIsRunning(true);
    setIsCompleted(false);
  }, [focusMinutes]);

  const resetTimer = () => { setIsRunning(false); setTimeLeft(null); setIsCompleted(false); clearInterval(intervalRef.current); };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => { if (prev <= 1) { clearInterval(intervalRef.current); setIsRunning(false); setIsCompleted(true); return 0; } return prev - 1; });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const progress = totalSeconds > 0 && timeLeft !== null ? ((totalSeconds - timeLeft) / totalSeconds) * 100 : 0;
  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  if (isCompleted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="focus-card focus-completed">
        <div className="focus-completed-inner">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.2 }} className="completion-check"><CheckCircle size={56} strokeWidth={1.5} /></motion.div>
          <h2>Focus Session Complete! 🎉</h2>
          <p>You stayed focused for <strong>{focusMinutes} minutes</strong>. Great discipline!</p>
          <div className="completion-stats">
            <div className="comp-stat"><span className="comp-stat-value">{focusMinutes}m</span><span className="comp-stat-label">Duration</span></div>
            <div className="comp-stat"><span className="comp-stat-value">1st</span><span className="comp-stat-label">Session Today</span></div>
            <div className="comp-stat"><span className="comp-stat-value">🔥</span><span className="comp-stat-label">Streak +1</span></div>
          </div>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="btn-glow" onClick={resetTimer}>Start Another Session</motion.button>
        </div>
      </motion.div>
    );
  }
  if (timeLeft !== null) {
    return (
      <div className="focus-card focus-active">
        <div className="focus-timer-display">
          <div className="timer-ring-container">
            <svg className="timer-ring" viewBox="0 0 200 200">
              <circle className="timer-ring-bg" cx="100" cy="100" r="90" fill="none" strokeWidth="6" />
              <motion.circle className="timer-ring-progress" cx="100" cy="100" r="90" fill="none" strokeWidth="6" strokeLinecap="round" strokeDasharray={circumference} animate={{ strokeDashoffset }} transition={{ duration: 0.5 }} transform="rotate(-90 100 100)" />
            </svg>
            <div className="timer-center-text"><span className="timer-time">{formatTime(timeLeft)}</span><span className="timer-label">remaining</span></div>
          </div>
        </div>
        <div className="focus-timer-info">
          <h2>Focus Mode</h2>
          <p>Stay concentrated. You're doing great!</p>
          <div className="timer-controls">
            {isRunning ? (
              <motion.button whileHover={{ scale: 1.05 }} className="timer-ctrl-btn pause" onClick={() => setIsRunning(false)}><Pause size={18} /> Pause</motion.button>
            ) : (
              <motion.button whileHover={{ scale: 1.05 }} className="timer-ctrl-btn resume" onClick={() => setIsRunning(true)}><Play size={18} /> Resume</motion.button>
            )}
            <motion.button whileHover={{ scale: 1.05 }} className="timer-ctrl-btn reset" onClick={resetTimer}><RotateCcw size={16} /> Reset</motion.button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="focus-card focus-setup">
      <div className="focus-setup-left">
        <div className="focus-icon-wrap"><Timer size={32} strokeWidth={1.5} /></div>
        <h2>Focus Session</h2>
        <p>Set a timer, block distractions, and deep-dive into your studies.</p>
      </div>
      <div className="focus-setup-right">
        <div className="focus-presets">{presetTimes.map(t => (<button key={t} className={`preset-btn ${focusMinutes === t ? 'active' : ''}`} onClick={() => setFocusMinutes(t)}>{t}m</button>))}</div>
        <div className="focus-custom-input">
          <input type="number" min="1" max="120" value={focusMinutes} onChange={(e) => setFocusMinutes(Math.max(1, Math.min(120, parseInt(e.target.value) || 1)))} />
          <span>minutes</span>
        </div>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="btn-glow" onClick={startTimer}><Play size={18} /> Begin {focusMinutes}min Session</motion.button>
      </div>
    </div>
  );
};


// ═══════════════════════════════════════
// ELEVATEV2 — TYPEWRITER HOOK
// ═══════════════════════════════════════
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

// ═══════════════════════════════════════
// ELEVATEV2 — MOCK INTERVIEW CARD
// ═══════════════════════════════════════
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
    <div className="ev2-interview-card">
      <div className="ev2-interview-header">
        <div className="ev2-interview-dot" style={{ background: '#f43f5e' }} />
        <div className="ev2-interview-dot" style={{ background: '#f59e0b' }} />
        <div className="ev2-interview-dot" style={{ background: '#10b981' }} />
        <span className="ev2-interview-label">🤖 Elevate AI Interview — Live Session</span>
      </div>
      <div className="ev2-interview-body">
        {mockMessages.slice(0, shown).map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`ev2-msg ${m.role}`}>
            {m.role === 'ai' && <div className="ev2-msg-avatar">AI</div>}
            <div className="ev2-msg-bubble">{m.text}</div>
          </motion.div>
        ))}
        {shown < mockMessages.length && (
          <div className="ev2-typing-dots">
            <div className="ev2-typing-dot" />
            <div className="ev2-typing-dot" />
            <div className="ev2-typing-dot" />
          </div>
        )}
      </div>
      <div className="ev2-interview-footer">
        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Session Score</span>
        <div className="ev2-score-bars">
          {[1,2,3,4,5].map(s => (
            <div key={s} className="ev2-score-bar" style={{ background: s <= 4 ? '#10b981' : 'var(--color-border)' }} />
          ))}
        </div>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981' }}>80%</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// ELEVATEV2 — MODULE PREVIEW WIDGETS
// ═══════════════════════════════════════
const englishPreviewPhrases = ['Professional tone ✅', 'Grammar corrected ✅', 'Confidence score: 92%'];

function EnglishPreview() {
  const word = useTypewriter(englishPreviewPhrases, 45);
  return (
    <div className="ev2-preview" style={{ background: 'var(--color-surface-raised, var(--surface-2))', border: '1px solid var(--color-border)' }}>
      <div className="ev2-preview-label">💬 AI FEEDBACK</div>
      <div style={{
        background: 'rgba(99,102,241,0.08)', borderRadius: 8, padding: '10px 12px',
        fontSize: '0.8rem', color: '#818cf8', fontFamily: 'monospace', minHeight: 36,
        border: '1px solid rgba(99,102,241,0.2)',
      }}>
        {word}<span style={{ borderRight: '2px solid #818cf8', animation: 'blink 0.9s step-end infinite', marginLeft: 1 }} />
      </div>
      <div className="ev2-preview-bars">
        {['Clarity','Tone','Impact'].map((l,i) => (
          <div key={l} className="ev2-preview-bar">
            <div className="ev2-preview-bar-label">{l}</div>
            <div className="ev2-preview-bar-track">
              <div className="ev2-preview-bar-fill" style={{ background: '#818cf8', width: `${[85,70,90][i]}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProgrammingPreview() {
  return (
    <div className="ev2-code-preview">
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
      <div className="ev2-code-footer">
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
    <div className="ev2-flashcard">
      <div className="ev2-flashcard-inner" style={{
        background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(251,191,36,0.06))',
        border: '1px solid rgba(245,158,11,0.25)',
      }}>
        <div className="ev2-flashcard-top">
          <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#f59e0b', background: 'rgba(245,158,11,0.15)', padding: '2px 8px', borderRadius: 4 }}>{card.tag}</span>
          <span style={{ fontSize: '0.65rem', color: 'var(--color-text-tertiary)' }}>Flash card</span>
        </div>
        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: 8 }}>{card.q}</div>
        <div style={{ height: 1, background: 'var(--color-border)', margin: '8px 0' }} />
        <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>Tap to reveal answer →</div>
      </div>
      <div className="ev2-flashcard-dots">
        {cards.map((_, i) => (
          <div key={i} className="ev2-flashcard-dot" style={{ width: i === (flip?1:0) ? 16 : 6, background: i === (flip?1:0) ? '#f59e0b' : 'var(--color-border)' }} />
        ))}
      </div>
    </div>
  );
}

function ReadingPreview() {
  return (
    <div className="ev2-reading-preview">
      <div className="ev2-preview-label">📄 TECHNICAL PASSAGE</div>
      {[90, 75, 60].map((w, i) => (
        <div key={i} className="ev2-reading-line" style={{ background: `rgba(99,102,241,${0.08 + i*0.03})`, width: `${w}%` }} />
      ))}
      <div className="ev2-reading-stat">
        <div style={{ fontSize: '0.7rem', color: '#f43f5e', fontWeight: 600 }}>⚡ Reading speed: 240 wpm</div>
        <div style={{ fontSize: '0.68rem', color: 'var(--color-text-secondary)', marginTop: 2 }}>Comprehension: 88% ↑</div>
      </div>
    </div>
  );
}

// ─── Module Data ───
const EV2_MODULES = [
  { title: 'Practice Professional English', emoji: '💬', tag: 'COMMUNICATION', tagColor: '#818cf8', tagBg: 'rgba(129,140,248,0.12)', desc: 'AI scores your tone, clarity and grammar in real-time.', path: '/practice/english', Preview: EnglishPreview },
  { title: 'Learn Programming', emoji: '⌨️', tag: 'CODING', tagColor: '#10b981', tagBg: 'rgba(16,185,129,0.12)', desc: 'Solve DSA challenges with syntax hints and complexity analysis.', path: '/practice/programming', Preview: ProgrammingPreview },
  { title: 'Core Computer Science', emoji: '🧠', tag: 'CS THEORY', tagColor: '#f59e0b', tagBg: 'rgba(245,158,11,0.12)', desc: 'OS, DBMS, Networks — flashcards and mock Q&A.', path: '/practice/cs', Preview: CSPreview },
  { title: 'Enhance Reading Ability', emoji: '📖', tag: 'READING', tagColor: '#f43f5e', tagBg: 'rgba(244,63,94,0.12)', desc: 'Speed-read technical docs with comprehension tracking.', path: '/practice/reading', Preview: ReadingPreview },
];

const EV2_STEPS = [
  { icon: '🎯', label: 'Choose a Module', sub: 'Pick English, Coding, CS, or Reading' },
  { icon: '🤖', label: 'AI Interviews You', sub: 'Adaptive questions, real interview style' },
  { icon: '📊', label: 'Get Instant Feedback', sub: 'Scores, corrections, improvement tips' },
  { icon: '🏆', label: 'Land the Offer', sub: 'Confidence-tested, interview-ready' },
];

const EV2_STATS = [
  { num: '10K+', label: 'Sessions Done',   icon: '⚡' },
  { num: '95%',  label: 'Confidence Rate', icon: '🏆' },
  { num: '4',    label: 'Core Modules',    icon: '🎯' },
  { num: '24/7', label: 'AI Available',    icon: '🤖' },
];

// ═══════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════
const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([{ from: 'bot', text: "Hi! 👋 I'm your AI Study Buddy. Ask me anything about CS!" }]);
  const [chatInput, setChatInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [csModalOpen, setCsModalOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatMessages]);

  const handleChatSend = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { from: 'user', text: userMsg }]);
    setChatInput('');
    setTimeout(() => { setChatMessages(prev => [...prev, { from: 'bot', text: getChatResponse(userMsg) }]); }, 600);
  };

  const learningCards = [
    { id: 1, title: 'Practice Professional English', desc: 'Improve communication skills for interviews & workplace settings.', icon: <MessageSquare size={28} strokeWidth={1.5} />, buttonText: 'Resume', color: '#6366F1', action: () => navigate('/practice/english') },
    { id: 2, title: 'Learn Programming', desc: 'Master Python, JavaScript, and more with hands-on coding exercises.', icon: <Code size={28} strokeWidth={1.5} />, buttonText: 'Continue', color: '#EC4899', action: () => navigate('/practice/programming') },
    { id: 3, title: 'Core Computer Science', desc: 'Explore 8 essential CS topics — ML, DSA, Deep Learning, OS & more.', icon: <Cpu size={28} strokeWidth={1.5} />, buttonText: 'Explore', color: '#10B981', action: () => setCsModalOpen(true) },
    { id: 4, title: 'Enhance Reading Skills', desc: 'Boost comprehension and reading speed with curated content.', icon: <BookOpen size={28} strokeWidth={1.5} />, buttonText: 'Start', color: '#F59E0B', action: () => navigate('/practice/reading') },
  ];

  return (
    <div className="home-page-new">
      <div className="bg-shape shape-1"></div>
      <div className="bg-shape shape-2"></div>
      <div className="bg-shape shape-3"></div>

      {/* ─── Header ─── */}
      <header className="home-header">
        <div className="home-container-full">
          <nav className="home-nav">
            <div className="home-logo" onClick={() => navigate('/home')}><div className="home-logo-icon">E</div>Elevate</div>
            <ul className="home-nav-links">
              <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('/home'); }}>Home</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('/portfolio'); }}>Portfolio</a></li>
              <li><a href="#" className="nav-community-link" onClick={(e) => { e.preventDefault(); navigate('/community'); }}><Users size={16} /> Community</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('/dashboard'); }}>Dashboard</a></li>
              <li className="nav-item"><a href="#" onClick={(e) => e.preventDefault()}>Notifications</a><span className="notification-badge">3</span></li>
            </ul>
            <div className="nav-header-right">
              <ThemeToggle />
              <div className="user-profile" onClick={() => setShowUserMenu(!showUserMenu)}>
                <div className="user-avatar">{user?.avatar || 'U'}</div>
                <div><div className="user-welcome">Welcome,</div><div className="user-name">{user?.name || 'User'}</div></div>
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="user-dropdown">
                      <div className="dropdown-item" onClick={() => navigate('/profile')}><User size={16} /> Profile</div>
                      <div className="dropdown-item" onClick={() => navigate('/portfolio')}><Folder size={16} /> Portfolio</div>
                      <div className="dropdown-item" onClick={() => navigate('/community')}><Users size={16} /> Community</div>
                      <div className="dropdown-item" onClick={() => navigate('/dashboard')}><LayoutDashboard size={16} /> Dashboard</div>
                      <div className="dropdown-divider" />
                      <div className="dropdown-item logout" onClick={() => { useAuthStore.getState().logout(); navigate('/login'); }}><LogOut size={16} /> Logout</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* ─── Layout ─── */}
      <div className="home-layout">
        {/* SIDEBAR */}
        <aside className="home-sidebar">
          <div className="sidebar-section">
            <div className="sidebar-section-title">Quick Actions</div>
            <SidebarItem icon={<Bot size={18} />} label="AI Study Buddy" badge="AI" onClick={() => navigate('/ai-study-buddy')} />
            <SidebarItem icon={<Mic size={18} />} label="Voice Interview" onClick={() => { setIsRecording(true); setTimeout(() => setIsRecording(false), 3000); }} />
            <SidebarItem icon={<Users size={18} />} label="Community Chat" badge="5" onClick={() => navigate('/community')} />
          </div>
          <div className="sidebar-section">
            <div className="sidebar-section-title">My Progress</div>
            <div className="sidebar-stats-card">
              <div className="stat-row"><Flame size={16} className="stat-icon fire" /><span className="stat-label">7 Day Streak</span><span className="stat-fire">🔥</span></div>
              <div className="stat-row"><Target size={16} className="stat-icon" /><span className="stat-label">3/5 Daily Goals</span></div>
              <div className="mini-progress-bar"><div className="mini-progress-fill" style={{ width: '60%' }}></div></div>
            </div>
          </div>
          <div className="sidebar-section">
            <div className="sidebar-section-title">Study Tools</div>
            <SidebarItem icon={<BarChart3 size={18} />} label="Analytics" onClick={() => navigate('/dashboard')} />
            <SidebarItem icon={<Bookmark size={18} />} label="Saved Notes" badge="12" />
            <SidebarItem icon={<Trophy size={18} />} label="Leaderboard" />
            <SidebarItem icon={<Clock size={18} />} label="Study Planner" />
          </div>
          <div className="sidebar-section">
            <div className="sidebar-section-title">Leaderboard</div>
            <div className="sidebar-leaderboard">
              {[{ name: 'Arjun S.', score: 2840, rank: 1 }, { name: 'Priya M.', score: 2650, rank: 2 }, { name: 'Rahul K.', score: 2480, rank: 3 }].map(e => (
                <div key={e.rank} className="leaderboard-entry"><span className={`rank rank-${e.rank}`}>#{e.rank}</span><span className="lb-name">{e.name}</span><span className="lb-score">{e.score}</span></div>
              ))}
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <main className="home-main">
          <AnimatePresence>
            {isRecording && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="voice-interview-banner">
                <div className="voice-pulse-ring"></div>
                <Mic size={22} className="voice-mic-icon" />
                <div className="voice-info"><strong>Voice Interview Active</strong><span>Listening... Speak your answer clearly</span></div>
                <button className="voice-stop-btn" onClick={() => setIsRecording(false)}><MicOff size={16} /> Stop</button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Learning Cards */}
          <section className="section-block">
            <div className="section-header"><h2 className="section-title">Your Learning Paths</h2></div>
            <div className="learning-grid">
              {learningCards.map((card, i) => {
                const ev2 = EV2_MODULES.find(m => m.title.startsWith(card.title.split(' ')[0]));
                return (
                <motion.div key={card.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08 }} className="learning-card" onClick={card.action} style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', marginBottom: '16px' }}>
                    <div className="card-icon" style={{ background: `${card.color}15`, color: card.color, margin: 0 }}>{card.icon}</div>
                    {ev2 && <span className="ev2-module-tag" style={{ color: ev2.tagColor, background: ev2.tagBg, border: `1px solid ${ev2.tagColor}30`, margin: 0 }}>{ev2.tag}</span>}
                  </div>
                  <h3>{card.title}</h3>
                  <p className="card-desc" style={{ marginBottom: '16px' }}>{card.desc}</p>

                  {ev2 && ev2.Preview && (
                    <div style={{ flexGrow: 1, marginBottom: '20px', width: '100%' }}>
                      <ev2.Preview />
                    </div>
                  )}

                  <button className="btn-glow-sm" style={{ '--glow-color': card.color, marginTop: 'auto', alignSelf: 'flex-start' }}>{card.buttonText} <ArrowRight size={14} /></button>
                </motion.div>
                );
              })}
            </div>
          </section>

          {/* Recommendations */}
          <section className="section-block recommendations">
            <div className="section-header"><h2 className="section-title">Recommended for you</h2><a href="#" onClick={e => e.preventDefault()} className="view-all-link">View all</a></div>
            <div className="recommendation-cards">
              {[
                { title: 'Mastering Python Data Structures', desc: 'Deepen your understanding of lists, dictionaries, and sets.', icon: <Code size={20} />, dur: '45 min' },
                { title: 'Effective Communication Strategies', desc: 'Build confidence in professional conversations.', icon: <MessageSquare size={20} />, dur: '30 min' },
              ].map((r, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.08 }} className="recommendation-card">
                  <div className="rec-icon-wrapper">{r.icon}</div>
                  <div className="rec-content"><h3>{r.title}</h3><p>{r.desc}</p><span className="rec-duration"><Clock size={12} /> {r.dur}</span></div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ═══ ELEVATEV2 MERGED SECTIONS ═══ */}

          {/* Mock Interview Preview */}
          <div className="ev2-interview-banner">
            <MockInterviewCard />
          </div>




          <div className="ev2-divider" />

          {/* Focus Timer — Navigate to full-screen Focus Session */}
          <section className="section-block focus-session">
            <div className="section-header"><h2 className="section-title"><Timer size={24} /> Focus Session</h2></div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="focus-card focus-setup"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/focus-session')}
            >
              <div className="focus-setup-left">
                <div className="focus-icon-wrap"><Timer size={32} strokeWidth={1.5} /></div>
                <h2>Focus Sanctuary</h2>
                <p>Enter a calming, nature-inspired space with Pomodoro timers, ambient sounds, and floating petals.</p>
              </div>
              <div className="focus-setup-right">
                <div className="focus-presets">
                  {[{label: '🧠 Deep Work', t: '90m'}, {label: '📚 Study', t: '50m'}, {label: '⚡ Sprint', t: '25m'}].map(m => (
                    <span key={m.t} className="preset-btn" style={{ pointerEvents: 'none' }}>{m.label} {m.t}</span>
                  ))}
                </div>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="btn-glow" onClick={(e) => { e.stopPropagation(); navigate('/focus-session'); }}>
                  <Play size={18} /> Start Focus Session
                </motion.button>
              </div>
            </motion.div>
          </section>

          {/* Footer */}
          <footer className="home-footer">
            <div className="footer-content">
              <div className="footer-left">
                <div className="footer-logo"><div className="home-logo-icon">E</div><span>Elevate</span></div>
                <p className="footer-desc">Building the future of education, one student at a time.</p>
              </div>
              <div className="footer-center">
                <div className="footer-col"><h4>Platform</h4><a href="#" onClick={e => { e.preventDefault(); navigate('/dashboard'); }}>Dashboard</a><a href="#" onClick={e => { e.preventDefault(); navigate('/community'); }}>Community</a><a href="#" onClick={e => { e.preventDefault(); navigate('/portfolio'); }}>Portfolio</a></div>
                <div className="footer-col"><h4>Resources</h4><a href="#" onClick={e => { e.preventDefault(); navigate('/blog'); }}>Blog</a><a href="#" onClick={e => e.preventDefault()}>Help Center</a><a href="#" onClick={e => e.preventDefault()}>Documentation</a></div>
                <div className="footer-col"><h4>Legal</h4><a href="#" onClick={e => e.preventDefault()}>Privacy</a><a href="#" onClick={e => e.preventDefault()}>Terms</a><a href="#" onClick={e => e.preventDefault()}>Contact</a></div>
              </div>
              <div className="footer-bottom-full">
                <span className="footer-copyright">© 2026 Elevate. All rights reserved.</span>
                <div className="social-links">
                  <a href="#" className="social-icon"><Facebook size={18} /></a>
                  <a href="#" className="social-icon"><Twitter size={18} /></a>
                  <a href="#" className="social-icon"><Linkedin size={18} /></a>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>

      {/* ═══════════════════════════════════════ */}
      {/* CS TOPICS FULL-PAGE MODAL */}
      {/* ═══════════════════════════════════════ */}
      <AnimatePresence>
        {csModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="cs-modal-overlay" onClick={() => { setCsModalOpen(false); setSelectedTopic(null); }}>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} transition={{ type: 'spring', stiffness: 250, damping: 25 }} className="cs-modal" onClick={e => e.stopPropagation()}>

              {/* Modal Header */}
              <div className="cs-modal-header">
                <button className="cs-modal-back" onClick={() => selectedTopic ? setSelectedTopic(null) : setCsModalOpen(false)}>
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h2>{selectedTopic ? csSubjects.find(s => s.id === selectedTopic)?.title : 'Core Computer Science'}</h2>
                  <span className="cs-modal-sub">{selectedTopic ? 'In-depth theory & concepts' : '8 essential topics to master'}</span>
                </div>
                <button className="cs-modal-close" onClick={() => { setCsModalOpen(false); setSelectedTopic(null); }}><X size={20} /></button>
              </div>

              {/* Topic Grid or Detail View */}
              <div className="cs-modal-body">
                {!selectedTopic ? (
                  // ─── Topic Grid ───
                  <div className="cs-topic-grid">
                    {csSubjects.map((subject, i) => (
                      <motion.div
                        key={subject.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="cs-topic-card"
                        onClick={() => setSelectedTopic(subject.id)}
                      >
                        <div className="cs-topic-img-wrap">
                          <img src={subject.image} alt={subject.title} className="cs-topic-img" />
                          <div className="cs-topic-img-overlay" style={{ background: `linear-gradient(135deg, ${subject.color}CC, ${subject.color}88)` }}>
                            <span className="cs-topic-icon-float">{subject.icon}</span>
                          </div>
                        </div>
                        <div className="cs-topic-card-body">
                          <h3>{subject.title}</h3>
                          <p>{subject.tagline}</p>
                          <div className="cs-topic-meta">
                            <span className="cs-meta-tag">{subject.concepts.length} concepts</span>
                            <span className="cs-meta-tag">{subject.theory.length} chapters</span>
                          </div>
                          <button className="btn-glow-sm" style={{ '--glow-color': subject.color }}>Learn <ArrowRight size={14} /></button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  // ─── Topic Detail View ───
                  (() => {
                    const topic = csSubjects.find(s => s.id === selectedTopic);
                    return (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="cs-detail">
                        {/* Hero Banner */}
                        <div className="cs-detail-hero" style={{ background: `linear-gradient(135deg, ${topic.color}18, ${topic.color}08)` }}>
                          <div className="cs-detail-hero-text">
                            <div className="cs-detail-icon" style={{ background: `${topic.color}20`, color: topic.color }}>{topic.icon}</div>
                            <h2>{topic.title}</h2>
                            <p className="cs-detail-overview">{topic.overview}</p>
                            <div className="cs-detail-stats">
                              <span><BookOpen size={14} /> {topic.theory.length} Chapters</span>
                              <span><Sparkles size={14} /> {topic.concepts.length} Key Concepts</span>
                            </div>
                          </div>
                          <div className="cs-detail-hero-img">
                            <img src={topic.image} alt={topic.title} />
                          </div>
                        </div>

                        {/* Theory Sections */}
                        <div className="cs-detail-chapters">
                          {topic.theory.map((ch, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08 }} className="cs-chapter">
                              <div className="cs-chapter-num" style={{ background: `${topic.color}15`, color: topic.color }}>{String(i + 1).padStart(2, '0')}</div>
                              <div className="cs-chapter-content">
                                <h3>{ch.heading}</h3>
                                <p>{ch.content}</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>

                        {/* Concepts */}
                        <div className="cs-detail-concepts">
                          <h3>Key Concepts to Master</h3>
                          <div className="concept-tags-lg">
                            {topic.concepts.map((c, i) => (
                              <motion.span key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + i * 0.04 }} className="concept-tag-lg" style={{ borderColor: `${topic.color}50`, color: topic.color, background: `${topic.color}08` }}>
                                {c}
                              </motion.span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })()
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chatbot */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} className="chatbot-panel">
            <div className="chatbot-header">
              <div className="chatbot-header-info"><div className="chatbot-avatar"><Bot size={20} /></div><div><strong>AI Study Buddy</strong><span className="chatbot-status">Online</span></div></div>
              <button className="chatbot-close" onClick={() => setChatOpen(false)}><X size={18} /></button>
            </div>
            <div className="chatbot-messages">
              {chatMessages.map((msg, i) => (<div key={i} className={`chat-msg ${msg.from}`}>{msg.from === 'bot' && <div className="chat-msg-avatar"><Bot size={14} /></div>}<div className="chat-msg-bubble">{msg.text}</div></div>))}
              <div ref={chatEndRef} />
            </div>
            <div className="chatbot-suggestions">
              {['What is ML?', 'DSA tips', 'Interview prep'].map((s, i) => (<button key={i} className="suggestion-chip" onClick={() => setChatInput(s)}>{s}</button>))}
            </div>
            <div className="chatbot-input-area">
              <input type="text" placeholder="Ask me anything..." value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleChatSend(); } }} />
              <button className="chat-send-btn" onClick={handleChatSend} disabled={!chatInput.trim()}><Send size={18} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!chatOpen && (
        <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} whileHover={{ scale: 1.1 }} className="chatbot-fab" onClick={() => setChatOpen(true)}>
          <Bot size={24} /><span className="fab-pulse"></span>
        </motion.button>
      )}
    </div>
  );
};

export default HomePage;