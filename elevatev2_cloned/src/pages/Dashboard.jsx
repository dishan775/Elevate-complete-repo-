import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Award, Calendar } from 'lucide-react';
import AnalyticsDashboard from '../components/AnalyticsDashboard';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#050510] text-zinc-100 p-8 pb-32">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5"
        >
          <div>
            <h1 className="text-3xl md:text-5xl font-bold font-playfair bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-indigo-400 to-pink-400 mb-2">
              My Growth Dashboard
            </h1>
            <p className="text-zinc-400 text-lg">
              Track your stats, progress, and recent learning streaks.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl px-5 py-3 flex items-center gap-3">
              <div className="p-2 bg-indigo-500/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Total XP</p>
                <p className="text-xl font-bold text-white">4,250</p>
              </div>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl px-5 py-3 flex items-center gap-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Award className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Current Streak</p>
                <p className="text-xl font-bold text-white">12 Days</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Analytics Component */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.2 }}
        >
          <AnalyticsDashboard />
        </motion.div>
      </div>
    </div>
  );
}
