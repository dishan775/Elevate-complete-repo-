import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Play, Pause, RotateCcw, CheckCircle, Timer,
  Music, Volume2, VolumeX, CloudRain, TreePine, Headphones,
  Zap, Brain, BookOpen, Settings, Flower2, Sun, Moon, Wind,
  Waves, ChevronDown, Sparkles, X
} from 'lucide-react';
import '../styles/focus-session.css';

// ═══════════════════════════════════════
// FLOWER PETAL SYSTEM
// ═══════════════════════════════════════
const PETAL_COLORS = [
  '#FFB7C5', '#FFC5D3', '#FFDEE2', '#FFE4E9', '#F8C8DC',
  '#FFD1DC', '#FFC0CB', '#FFB6C1', '#F4A7BB', '#E8909C',
  '#FFFFFF', '#FFF5F5', '#FFFAF0', '#FFF0F5', '#FFEEF2',
  '#E6B8D4', '#D4A0C0', '#F0C6E0', '#FFD5E5', '#F5B7C5'
];

const PETAL_SHAPES = [
  // Cherry blossom petals
  'M0,0 C5,-8 15,-8 20,0 C15,8 5,8 0,0 Z',
  'M0,0 C3,-10 17,-10 20,0 C17,10 3,10 0,0 Z',
  'M0,0 C8,-6 12,-12 20,-4 C16,4 12,2 8,8 C4,4 0,0 0,0 Z',
  // Daisy-like petals
  'M0,0 C2,-6 8,-12 10,-12 C12,-12 18,-6 20,0 C18,6 12,12 10,12 C8,12 2,6 0,0 Z',
  // Wider petals
  'M0,0 C4,-5 16,-5 20,0 C16,5 4,5 0,0 Z',
];

function createPetal(id) {
  const size = 10 + Math.random() * 20;
  return {
    id,
    x: Math.random() * 100,
    y: -10 - Math.random() * 20,
    size,
    rotation: Math.random() * 360,
    color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
    shape: PETAL_SHAPES[Math.floor(Math.random() * PETAL_SHAPES.length)],
    speed: 0.3 + Math.random() * 0.6,
    drift: (Math.random() - 0.5) * 2,
    wobbleAmp: 15 + Math.random() * 30,
    wobbleSpeed: 0.5 + Math.random() * 1.5,
    rotSpeed: 0.3 + Math.random() * 1.5,
    opacity: 0.5 + Math.random() * 0.5,
    delay: Math.random() * 8,
  };
}

function FloatingPetals({ count = 35 }) {
  const [petals, setPetals] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      ...createPetal(i),
      y: Math.random() * 120 - 10,
    }))
  );

  useEffect(() => {
    let animFrame;
    let lastTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const delta = (now - lastTime) / 16;
      lastTime = now;

      setPetals(prev =>
        prev.map(p => {
          let newY = p.y + p.speed * delta;
          let newX = p.x + Math.sin((now / 1000) * p.wobbleSpeed) * p.drift * 0.05 * delta;
          let newRot = p.rotation + p.rotSpeed * delta;

          if (newY > 110) {
            return { ...createPetal(p.id), y: -10 };
          }
          if (newX < -5) newX = 105;
          if (newX > 105) newX = -5;

          return { ...p, y: newY, x: newX, rotation: newRot };
        })
      );
      animFrame = requestAnimationFrame(animate);
    };

    animFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame);
  }, []);

  return (
    <div className="petals-container" aria-hidden="true">
      {petals.map(p => (
        <svg
          key={p.id}
          className="petal"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            transform: `rotate(${p.rotation}deg)`,
            opacity: p.opacity,
            filter: `drop-shadow(0 1px 2px rgba(0,0,0,0.08))`,
          }}
          viewBox="0 0 20 12"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d={p.shape} fill={p.color} />
        </svg>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════
// AMBIENT PARTICLES (Fireflies / Dust)
// ═══════════════════════════════════════
function AmbientParticles({ count = 20 }) {
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 4,
      duration: 3 + Math.random() * 6,
      delay: Math.random() * 5,
    })),
    [count]
  );

  return (
    <div className="ambient-particles" aria-hidden="true">
      {particles.map(p => (
        <div
          key={p.id}
          className="ambient-particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════
// TIMER MODES
// ═══════════════════════════════════════
const TIMER_MODES = [
  {
    id: 'deep-work',
    label: 'Deep Work',
    minutes: 90,
    icon: <Brain size={20} />,
    color: '#7C3AED',
    gradient: 'linear-gradient(135deg, #7C3AED, #A78BFA)',
    desc: 'Long uninterrupted focus for complex tasks',
    emoji: '🧠',
  },
  {
    id: 'study',
    label: 'Study Mode',
    minutes: 50,
    icon: <BookOpen size={20} />,
    color: '#059669',
    gradient: 'linear-gradient(135deg, #059669, #34D399)',
    desc: 'Balanced sessions for learning & revision',
    emoji: '📚',
  },
  {
    id: 'sprint',
    label: 'Quick Sprint',
    minutes: 25,
    icon: <Zap size={20} />,
    color: '#F59E0B',
    gradient: 'linear-gradient(135deg, #F59E0B, #FCD34D)',
    desc: 'Classic Pomodoro, intense short bursts',
    emoji: '⚡',
  },
  {
    id: 'custom',
    label: 'Custom',
    minutes: 0,
    icon: <Settings size={20} />,
    color: '#EC4899',
    gradient: 'linear-gradient(135deg, #EC4899, #F9A8D4)',
    desc: 'Set your own duration',
    emoji: '⚙️',
  },
];

// ═══════════════════════════════════════
// AMBIENT SOUNDS
// ═══════════════════════════════════════
const AMBIENT_SOUNDS = [
  {
    id: 'lofi',
    label: 'Lo-fi Beats',
    icon: <Headphones size={18} />,
    color: '#818CF8',
    emoji: '🎵',
    // Using a royalty-free lo-fi audio URL placeholder
    url: null,
  },
  {
    id: 'rain',
    label: 'Rain & Thunder',
    icon: <CloudRain size={18} />,
    color: '#60A5FA',
    emoji: '🌧️',
    url: null,
  },
  {
    id: 'forest',
    label: 'Forest',
    icon: <TreePine size={18} />,
    color: '#34D399',
    emoji: '🌲',
    url: null,
  },
];

// ═══════════════════════════════════════
// CIRCULAR TIMER SVG
// ═══════════════════════════════════════
function CircularTimer({ progress, timeLeft, totalSeconds, mode, isRunning }) {
  const radius = 130;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const modeColor = TIMER_MODES.find(m => m.id === mode)?.color || '#7C3AED';

  return (
    <div className="circular-timer-wrapper">
      {/* Glow behind */}
      <div className="timer-glow" style={{ background: `${modeColor}20` }} />
      
      <svg className="circular-timer-svg" viewBox="0 0 300 300">
        {/* Background circle */}
        <circle
          cx="150" cy="150" r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
        />
        
        {/* Progress arc */}
        <motion.circle
          cx="150" cy="150" r={radius}
          fill="none"
          stroke={modeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: 'linear' }}
          transform="rotate(-90 150 150)"
          style={{ 
            filter: `drop-shadow(0 0 8px ${modeColor}60)`,
          }}
        />

        {/* Subtle inner glow ring */}
        <circle
          cx="150" cy="150" r={radius - 20}
          fill="none"
          stroke="rgba(255,255,255,0.03)"
          strokeWidth="1"
        />
      </svg>

      <div className="timer-center-content">
        <div className="timer-time-display">
          <span className="timer-minutes">{String(minutes).padStart(2, '0')}</span>
          <span className={`timer-separator ${isRunning ? 'blinking' : ''}`}>:</span>
          <span className="timer-seconds">{String(seconds).padStart(2, '0')}</span>
        </div>
        <div className="timer-status-text">
          {isRunning ? 'Stay focused...' : 'Paused'}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// MAIN FOCUS SESSION PAGE
// ═══════════════════════════════════════
export default function FocusSession() {
  const navigate = useNavigate();
  
  // Timer state
  const [selectedMode, setSelectedMode] = useState('sprint');
  const [customMinutes, setCustomMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(null);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const intervalRef = useRef(null);

  // Sound state
  const [activeSound, setActiveSound] = useState(null);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);

  // UI state
  const [showModeSelector, setShowModeSelector] = useState(false);
  
  // Time of day for theme
  const hour = new Date().getHours();
  const isDaytime = hour >= 6 && hour < 18;

  const getCurrentMinutes = useCallback(() => {
    if (selectedMode === 'custom') return customMinutes;
    return TIMER_MODES.find(m => m.id === selectedMode)?.minutes || 25;
  }, [selectedMode, customMinutes]);

  const currentMode = TIMER_MODES.find(m => m.id === selectedMode);

  // Start timer
  const startTimer = useCallback(() => {
    const mins = getCurrentMinutes();
    const secs = mins * 60;
    setTotalSeconds(secs);
    setTimeLeft(secs);
    setIsRunning(true);
    setIsCompleted(false);
    setTimerStarted(true);
  }, [getCurrentMinutes]);

  // Reset timer
  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(null);
    setTotalSeconds(0);
    setIsCompleted(false);
    setTimerStarted(false);
    clearInterval(intervalRef.current);
  }, []);

  // Timer tick
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            setIsCompleted(true);
            setSessionsCompleted(s => s + 1);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft]);

  const progress = totalSeconds > 0 && timeLeft !== null
    ? ((totalSeconds - timeLeft) / totalSeconds) * 100
    : 0;

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  // Toggle sound
  const toggleSound = (soundId) => {
    if (activeSound === soundId) {
      setActiveSound(null);
    } else {
      setActiveSound(soundId);
    }
  };

  return (
    <div className={`focus-session-page ${isDaytime ? 'daytime' : 'nighttime'}`}>
      {/* ═══ IMMERSIVE NATURE BACKGROUND ═══ */}
      {/* Full-bleed meadow image with Ken Burns animation */}
      <div className="fs-bg-image" />
      {/* Dreamy color wash overlay */}
      <div className="fs-bg-dreamy" />
      {/* Vignette for depth focus */}
      <div className="fs-bg-vignette" />

      {/* Animated sunlight rays drifting across the scene */}
      <div className="fs-light-rays" aria-hidden="true">
        <div className="fs-light-ray" />
        <div className="fs-light-ray" />
        <div className="fs-light-ray" />
      </div>

      {/* Floating flower petals */}
      <FloatingPetals count={45} />
      <AmbientParticles count={30} />

      {/* Top Bar */}
      <header className="fs-header">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="fs-back-btn"
          onClick={() => navigate('/home')}
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </motion.button>

        <div className="fs-header-center">
          <Flower2 size={20} className="fs-header-icon" />
          <span className="fs-header-title">Focus Sanctuary</span>
        </div>

        <div className="fs-header-right">
          <div className="fs-session-count">
            <Sparkles size={14} />
            <span>{sessionsCompleted} sessions</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="fs-main">
        <AnimatePresence mode="wait">
          {isCompleted ? (
            // ═══ COMPLETION VIEW ═══
            <motion.div
              key="completed"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fs-completion"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 150, delay: 0.2 }}
                className="fs-completion-icon"
              >
                <CheckCircle size={64} strokeWidth={1.5} />
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Session Complete! 🌸
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                You stayed focused for <strong>{getCurrentMinutes()} minutes</strong>. Beautiful discipline!
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="fs-completion-stats"
              >
                <div className="fs-comp-stat">
                  <span className="fs-comp-stat-value">{getCurrentMinutes()}m</span>
                  <span className="fs-comp-stat-label">Duration</span>
                </div>
                <div className="fs-comp-stat">
                  <span className="fs-comp-stat-value">{sessionsCompleted}</span>
                  <span className="fs-comp-stat-label">Sessions Today</span>
                </div>
                <div className="fs-comp-stat">
                  <span className="fs-comp-stat-value">🔥</span>
                  <span className="fs-comp-stat-label">Streak +1</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="fs-completion-actions"
              >
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="fs-btn-primary"
                  onClick={resetTimer}
                >
                  <RotateCcw size={18} /> Start Another
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="fs-btn-secondary"
                  onClick={() => navigate('/home')}
                >
                  Back to Home
                </motion.button>
              </motion.div>
            </motion.div>

          ) : timerStarted ? (
            // ═══ ACTIVE TIMER VIEW ═══
            <motion.div
              key="active"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fs-active-layout"
            >
              {/* Timer */}
              <div className="fs-timer-section">
                <CircularTimer
                  progress={progress}
                  timeLeft={timeLeft}
                  totalSeconds={totalSeconds}
                  mode={selectedMode}
                  isRunning={isRunning}
                />

                <div className="fs-timer-controls">
                  {isRunning ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="fs-ctrl-btn pause"
                      onClick={() => setIsRunning(false)}
                    >
                      <Pause size={22} />
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="fs-ctrl-btn play"
                      onClick={() => setIsRunning(true)}
                    >
                      <Play size={22} />
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="fs-ctrl-btn reset"
                    onClick={resetTimer}
                  >
                    <RotateCcw size={18} />
                  </motion.button>
                </div>

                <div className="fs-current-mode-badge" style={{ '--mode-color': currentMode?.color }}>
                  {currentMode?.emoji} {currentMode?.label} · {getCurrentMinutes()}min
                </div>
              </div>

              {/* Ambient Sound Panel */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="fs-sound-panel"
              >
                <div className="fs-sound-header">
                  <Music size={16} />
                  <span>Ambient Sounds</span>
                </div>
                <div className="fs-sound-grid">
                  {AMBIENT_SOUNDS.map(sound => (
                    <motion.button
                      key={sound.id}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      className={`fs-sound-btn ${activeSound === sound.id ? 'active' : ''}`}
                      onClick={() => toggleSound(sound.id)}
                      style={{ '--sound-color': sound.color }}
                    >
                      <span className="fs-sound-emoji">{sound.emoji}</span>
                      <span className="fs-sound-label">{sound.label}</span>
                      {activeSound === sound.id && (
                        <motion.div
                          layoutId="soundIndicator"
                          className="fs-sound-playing"
                        >
                          <div className="sound-bar" />
                          <div className="sound-bar" />
                          <div className="sound-bar" />
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
                {activeSound && (
                  <div className="fs-volume-control">
                    <button
                      className="fs-vol-btn"
                      onClick={() => setIsMuted(!isMuted)}
                    >
                      {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={isMuted ? 0 : volume}
                      onChange={e => { setVolume(parseFloat(e.target.value)); setIsMuted(false); }}
                      className="fs-volume-slider"
                      style={{ '--volume-pct': `${(isMuted ? 0 : volume) * 100}%`, '--mode-color': AMBIENT_SOUNDS.find(s => s.id === activeSound)?.color }}
                    />
                  </div>
                )}
              </motion.div>

              {/* Motivational quote */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="fs-quote"
              >
                "The secret of getting ahead is getting started." — Mark Twain
              </motion.div>
            </motion.div>

          ) : (
            // ═══ SETUP VIEW ═══
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fs-setup-layout"
            >
              {/* Welcome Text */}
              <div className="fs-welcome">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="fs-welcome-badge"
                >
                  <Flower2 size={14} /> Focus Sanctuary
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Find Your Flow
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Choose your focus mode, set the mood, and dive deep into concentrated work
                </motion.p>
              </div>

              {/* Mode Selection Cards */}
              <div className="fs-modes-grid">
                {TIMER_MODES.map((mode, i) => (
                  <motion.div
                    key={mode.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    whileHover={{ scale: 1.03, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`fs-mode-card ${selectedMode === mode.id ? 'selected' : ''}`}
                    onClick={() => setSelectedMode(mode.id)}
                    style={{ '--mode-color': mode.color, '--mode-gradient': mode.gradient }}
                  >
                    <div className="fs-mode-card-glow" />
                    <div className="fs-mode-header">
                      <div className="fs-mode-icon">{mode.icon}</div>
                      {selectedMode === mode.id && (
                        <motion.div layoutId="modeCheck" className="fs-mode-check">
                          <CheckCircle size={16} />
                        </motion.div>
                      )}
                    </div>
                    <h3>{mode.label}</h3>
                    {mode.id !== 'custom' && (
                      <div className="fs-mode-time">{mode.minutes} min</div>
                    )}
                    {mode.id === 'custom' && selectedMode === 'custom' && (
                      <div className="fs-custom-input-wrap" onClick={e => e.stopPropagation()}>
                        <input
                          type="number"
                          min="1"
                          max="180"
                          value={customMinutes}
                          onChange={e => setCustomMinutes(Math.max(1, Math.min(180, parseInt(e.target.value) || 1)))}
                          className="fs-custom-input"
                        />
                        <span>min</span>
                      </div>
                    )}
                    {mode.id === 'custom' && selectedMode !== 'custom' && (
                      <div className="fs-mode-time">Your pace</div>
                    )}
                    <p className="fs-mode-desc">{mode.desc}</p>
                  </motion.div>
                ))}
              </div>

              {/* Sound Selection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="fs-setup-sounds"
              >
                <div className="fs-setup-sounds-header">
                  <Music size={18} />
                  <h3>Focus Music & Ambient Sounds</h3>
                </div>
                <div className="fs-setup-sound-options">
                  {AMBIENT_SOUNDS.map((sound, i) => (
                    <motion.button
                      key={sound.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.9 + i * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`fs-setup-sound-btn ${activeSound === sound.id ? 'active' : ''}`}
                      onClick={() => toggleSound(sound.id)}
                      style={{ '--sound-color': sound.color }}
                    >
                      <span className="fs-setup-sound-icon">{sound.emoji}</span>
                      {sound.icon}
                      <span>{sound.label}</span>
                      {activeSound === sound.id && (
                        <div className="fs-sound-active-indicator">
                          <div className="sound-bar" />
                          <div className="sound-bar" />
                          <div className="sound-bar" />
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Start Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="fs-start-wrap"
              >
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: `0 12px 40px ${currentMode?.color}40` }}
                  whileTap={{ scale: 0.97 }}
                  className="fs-start-btn"
                  onClick={startTimer}
                  style={{ '--mode-color': currentMode?.color, '--mode-gradient': currentMode?.gradient }}
                >
                  <Play size={22} />
                  <span>Start {getCurrentMinutes()} min {currentMode?.label} Session</span>
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
