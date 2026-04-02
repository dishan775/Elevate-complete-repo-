import React from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { History, Target, TrendingUp, Calendar } from 'lucide-react';

const weeklyData = [
  { day: 'Mon', score: 65 },
  { day: 'Tue', score: 72 },
  { day: 'Wed', score: 68 },
  { day: 'Thu', score: 81 },
  { day: 'Fri', score: 85 },
  { day: 'Sat', score: 83 },
  { day: 'Sun', score: 92 },
];

const topicData = [
  { topic: 'Arrays', strength: 85, color: '#3b82f6' },
  { topic: 'Trees', strength: 78, color: '#8b5cf6' },
  { topic: 'Graphs', strength: 72, color: '#ec4899' },
  { topic: 'DP', strength: 65, color: '#f43f5e' },
  { topic: 'System Design', strength: 80, color: '#10b981' },
];

const recentSessions = [
  { id: 1, topic: 'Binary Trees', time: '45m', score: 92, date: 'Today', status: 'Optimal' },
  { id: 2, topic: 'Dynamic Programming', time: '1h 20m', score: 78, date: 'Yesterday', status: 'Improved' },
  { id: 3, topic: 'Graph Algorithms', time: '52m', score: 85, date: '2 days ago', status: 'Optimal' },
];

const AnalyticsDashboard = () => {
  return (
    <div className="space-y-8">
      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Weekly Progress - Line Chart */}
        <div className="bg-zinc-900/20 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <h3 className="text-sm font-medium text-zinc-200">Weekly Performance</h3>
            </div>
            <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded">Last 7 Days</span>
          </div>
          
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#18181b" vertical={false} />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#71717a', fontSize: 12}}
                  dy={10}
                />
                <YAxis hide domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff', fontSize: '12px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#6366f1" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#09090b' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Topic Strengths - Bar Chart */}
        <div className="bg-zinc-900/20 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-indigo-500" />
              <h3 className="text-sm font-medium text-zinc-200">Topic Proficiency</h3>
            </div>
          </div>
          
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topicData} layout="vertical" margin={{ left: -20 }}>
                <XAxis type="number" hide domain={[0, 100]} />
                <YAxis 
                  dataKey="topic" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#a1a1aa', fontSize: 11}}
                />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px' }}
                />
                <Bar dataKey="strength" radius={[0, 4, 4, 0]} barSize={18}>
                  {topicData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Sessions List */}
      <div className="bg-zinc-900/20 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-800 bg-zinc-900/40 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <History className="w-4 h-4 text-zinc-400" />
            <h3 className="text-sm font-medium text-white">Recent Activity</h3>
          </div>
          <button className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors">View All History</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-zinc-500 border-b border-zinc-800">
                <th className="px-6 py-3 font-medium">Topic</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Duration</th>
                <th className="px-6 py-3 font-medium">Accuracy</th>
                <th className="px-6 py-3 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {recentSessions.map((session) => (
                <tr key={session.id} className="hover:bg-zinc-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">
                      {session.topic}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-xs text-zinc-500">
                      <Calendar className="w-3 h-3 mr-2" />
                      {session.date}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-zinc-400 font-mono">
                    {session.time}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-12 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${session.score > 90 ? 'bg-emerald-500' : 'bg-indigo-500'}`} 
                          style={{ width: `${session.score}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-zinc-300">{session.score}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter ${
                      session.status === 'Optimal' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                    }`}>
                      {session.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;