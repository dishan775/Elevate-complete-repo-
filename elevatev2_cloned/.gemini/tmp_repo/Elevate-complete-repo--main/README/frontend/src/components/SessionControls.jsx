import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Square, Terminal, Cpu, Timer, 
  ChevronRight, Radio, Box, Zap 
} from 'lucide-react';

const SessionControls = ({ isSessionActive, onStartSession, onStopSession }) => {
  const [time, setTime] = useState(0);
  const [logs, setLogs] = useState([
    { id: 1, text: 'System initialized. Ready for input.', type: 'info' }
  ]);

  // Timer logic
  useEffect(() => {
    let interval;
    if (isSessionActive) {
      interval = setInterval(() => setTime((prev) => prev + 1), 1000);
      addLog('Session connection established. Monitoring data...', 'success');
    } else {
      clearInterval(interval);
      if (time > 0) {
        addLog(`Session terminated. Total duration: ${formatTime(time)}`, 'info');
      }
      setTime(0);
    }
    return () => clearInterval(interval);
  }, [isSessionActive]);

  const addLog = (text, type) => {
    setLogs(prev => [{ id: Date.now(), text, type }, ...prev].slice(0, 5));
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Terminal Display */}
      <div className="bg-[#09090b] border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="px-4 py-2 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
            </div>
            <span className="text-[10px] font-mono text-zinc-500 ml-4 uppercase tracking-widest">Compiler.v1.0.4</span>
          </div>
          {isSessionActive && (
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-mono text-emerald-500">LIVE_RECORDING</span>
            </div>
          )}
        </div>

        <div className="p-6 flex flex-col md:flex-row gap-8 items-center justify-between">
          {/* Timer Section */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center space-x-2 text-zinc-500 mb-1">
              <Timer className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase font-bold tracking-tighter">Session Duration</span>
            </div>
            <div className="text-5xl font-mono font-bold text-white tracking-tighter">
              {formatTime(time)}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            {!isSessionActive ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onStartSession}
                className="group relative px-8 py-3 bg-white text-black rounded-lg font-bold flex items-center space-x-3 overflow-hidden"
              >
                <div className="absolute inset-0 bg-indigo-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <Play className="w-4 h-4 relative z-10 fill-current" />
                <span className="relative z-10 group-hover:text-white transition-colors">Start Session</span>
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onStopSession}
                className="px-8 py-3 bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg font-bold flex items-center space-x-3 hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/10"
              >
                <Square className="w-4 h-4 fill-current" />
                <span>Stop Session</span>
              </motion.button>
            )}
          </div>
        </div>

        {/* Live Activity Logs */}
        <div className="px-6 py-4 bg-black/40 border-t border-zinc-800/50 min-h-[100px]">
          <div className="flex items-center space-x-2 mb-2">
            <Terminal className="w-3 h-3 text-zinc-600" />
            <span className="text-[10px] font-mono text-zinc-600 uppercase">Process Logs</span>
          </div>
          <div className="space-y-1 font-mono text-[11px]">
            <AnimatePresence mode="popLayout">
              {logs.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center space-x-2"
                >
                  <ChevronRight className="w-3 h-3 text-zinc-700" />
                  <span className={log.type === 'success' ? 'text-emerald-500/80' : 'text-zinc-500'}>
                    [{new Date(log.id).toLocaleTimeString([], { hour12: false })}]
                  </span>
                  <span className="text-zinc-300">{log.text}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Grid Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Topic Focus', val: 'Binary Search', icon: <Box className="w-4 h-4" /> },
          { label: 'Environment', val: 'Node.js 20', icon: <Cpu className="w-4 h-4" /> },
          { label: 'Mode', val: 'AI-Assisted', icon: <Radio className="w-4 h-4" /> },
        ].map((item, i) => (
          <div key={i} className="p-3 bg-zinc-900/40 border border-zinc-800 rounded-lg flex items-center space-x-3">
            <div className="p-2 bg-zinc-800 rounded text-zinc-400">
              {item.icon}
            </div>
            <div>
              <p className="text-[10px] text-zinc-500 uppercase font-bold">{item.label}</p>
              <p className="text-sm font-semibold text-zinc-200">{item.val}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SessionControls;