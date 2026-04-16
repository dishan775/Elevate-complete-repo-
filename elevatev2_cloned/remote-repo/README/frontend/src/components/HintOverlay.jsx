import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';

const HintOverlay = ({ hint, isActive }) => {
  const getHintIcon = (level) => {
    switch (level) {
      case 1: return <AlertCircle className="w-5 h-5" />;
      case 2: return <Lightbulb className="w-5 h-5" />;
      case 3: return <TrendingUp className="w-5 h-5" />;
      case 4: return <CheckCircle className="w-5 h-5" />;
      default: return <Lightbulb className="w-5 h-5" />;
    }
  };

  const getHintColor = (level) => {
    switch (level) {
      case 1: return 'from-yellow-500 to-orange-500';
      case 2: return 'from-blue-500 to-cyan-500';
      case 3: return 'from-purple-500 to-pink-500';
      case 4: return 'from-green-500 to-emerald-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 h-full"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">AI Guidance</h3>
        <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
      </div>

      <AnimatePresence mode="wait">
        {hint ? (
          <motion.div
            key={hint.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Hint Level Indicator */}
            <div className={`flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-r ${getHintColor(hint.level)}`}>
              {getHintIcon(hint.level)}
              <span className="text-white font-semibold">
                Level {hint.level} Hint
              </span>
            </div>

            {/* Topic */}
            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Detected Topic</p>
              <p className="text-white font-semibold">{hint.topic}</p>
            </div>

            {/* Hint Content */}
            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-2">Guidance</p>
              <p className="text-white leading-relaxed">{hint.content}</p>
            </div>

            {/* Key Concepts */}
            {hint.concepts && hint.concepts.length > 0 && (
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-2">Key Concepts</p>
                <div className="flex flex-wrap gap-2">
                  {hint.concepts.map((concept, index) => (
                    <span
                      key={index}
                      className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm"
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Approach Suggestion */}
            {hint.approach && (
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-2">Suggested Approach</p>
                <ol className="list-decimal list-inside text-white space-y-1">
                  {hint.approach.map((step, index) => (
                    <li key={index} className="text-sm">{step}</li>
                  ))}
                </ol>
              </div>
            )}

            {/* Pitfalls */}
            {hint.pitfalls && hint.pitfalls.length > 0 && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <p className="flex items-center gap-2 text-red-300 text-sm font-semibold mb-2">
                  <AlertCircle size={14} /> Common Pitfalls
                </p>
                <ul className="list-disc list-inside text-red-200 space-y-1 text-sm">
                  {hint.pitfalls.map((pitfall, index) => (
                    <li key={index}>{pitfall}</li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-64 text-center"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center mb-4">
              <Lightbulb className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-400 mb-2">No active hints</p>
            <p className="text-gray-500 text-sm">
              {isActive 
                ? 'Start solving a problem to receive guidance' 
                : 'Start a session to enable AI assistance'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default HintOverlay;