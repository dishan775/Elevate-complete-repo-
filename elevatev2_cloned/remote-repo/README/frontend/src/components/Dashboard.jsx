import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Calendar, TrendingUp, Target, Clock, 
  Zap, Award, BookOpen, Code, Brain, CheckCircle,
  Activity, Flame, Star, ChevronRight
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import useAuthStore from '../store/authStore';
import '../styles/dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [currentStreak, setCurrentStreak] = useState(7);
  const [longestStreak, setLongestStreak] = useState(15);

  // Performance data
  const weeklyData = [
    { day: 'Mon', score: 65, time: 2.5 },
    { day: 'Tue', score: 72, time: 3.2 },
    { day: 'Wed', score: 68, time: 2.8 },
    { day: 'Thu', score: 80, time: 4.1 },
    { day: 'Fri', score: 85, time: 3.5 },
    { day: 'Sat', score: 82, time: 5.2 },
    { day: 'Sun', score: 90, time: 4.8 },
  ];

  const monthlyData = [
    { week: 'Week 1', score: 70, time: 15 },
    { week: 'Week 2', score: 75, time: 18 },
    { week: 'Week 3', score: 82, time: 22 },
    { week: 'Week 4', score: 88, time: 25 },
  ];

  const yearlyData = [
    { month: 'Jan', score: 70, time: 45 },
    { month: 'Feb', score: 73, time: 48 },
    { month: 'Mar', score: 78, time: 52 },
    { month: 'Apr', score: 75, time: 50 },
    { month: 'May', score: 82, time: 58 },
    { month: 'Jun', score: 85, time: 62 },
    { month: 'Jul', score: 83, time: 60 },
    { month: 'Aug', score: 88, time: 68 },
    { month: 'Sep', score: 86, time: 65 },
    { month: 'Oct', score: 90, time: 72 },
    { month: 'Nov', score: 87, time: 70 },
    { month: 'Dec', score: 92, time: 78 },
  ];

  const getChartData = () => {
    switch (selectedPeriod) {
      case 'week': return weeklyData;
      case 'month': return monthlyData;
      case 'year': return yearlyData;
      default: return weeklyData;
    }
  };

  const getXAxisKey = () => {
    switch (selectedPeriod) {
      case 'week': return 'day';
      case 'month': return 'week';
      case 'year': return 'month';
      default: return 'day';
    }
  };

  // Generate 2026 calendar data (LeetCode style - exact dates)
  const generate2026Calendar = () => {
    const data = [];
    const year = 2026;
    
    // Start from January 1, 2026 and go through December 31, 2026
    const startDate = new Date(year, 0, 1); // Jan 1, 2026
    const endDate = new Date(year, 11, 31); // Dec 31, 2026
    
    // Find the Sunday before Jan 1, 2026 to start the grid
    const firstSunday = new Date(startDate);
    firstSunday.setDate(startDate.getDate() - startDate.getDay());
    
    let currentDate = new Date(firstSunday);
    
    // Generate all days until we pass Dec 31, 2026
    while (currentDate <= endDate || currentDate.getDay() !== 0) {
      const isIn2026 = currentDate.getFullYear() === 2026;
      const dateStr = currentDate.toISOString().split('T')[0];
      
      // Simulate activity (0-4 levels)
      const level = isIn2026 ? Math.floor(Math.random() * 5) : 0;
      
      data.push({
        date: dateStr,
        count: level * 3,
        level: isIn2026 ? level : -1, // -1 for dates outside 2026
        dayOfWeek: currentDate.getDay(),
        month: currentDate.getMonth()
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
      
      // Stop after we've gone past December and filled the last week
      if (currentDate.getFullYear() > 2026 && currentDate.getDay() === 0) {
        break;
      }
    }
    
    return data;
  };

  const calendarData = generate2026Calendar();

  // Get month labels for calendar
  const getMonthLabels = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const labels = [];
    let currentMonth = -1;
    
    calendarData.forEach((day, index) => {
      if (day.month !== currentMonth && day.level !== -1) {
        currentMonth = day.month;
        labels.push({ month: months[currentMonth], index: Math.floor(index / 7) });
      }
    });
    
    return labels;
  };

  const monthLabels = getMonthLabels();

  // Recent activities
  const recentActivities = [
    { id: 1, type: 'completed', title: 'Completed React Hooks Module', time: '2 hours ago' },
    { id: 2, type: 'started', title: 'Started System Design Course', time: '5 hours ago' },
    { id: 3, type: 'achievement', title: 'Earned "Quick Learner" Badge', time: '1 day ago' },
    { id: 4, type: 'practice', title: 'Solved 5 DSA Problems', time: '2 days ago' },
    { id: 5, type: 'completed', title: 'Finished Python Basics', time: '3 days ago' },
  ];

  // Weekly goals
  const weeklyGoals = [
    { id: 1, title: 'Complete 10 Coding Problems', current: 7, target: 10, color: '#667eea' },
    { id: 2, title: 'Study 15 Hours', current: 12, target: 15, color: '#f093fb' },
    { id: 3, title: 'Finish 2 Modules', current: 1, target: 2, color: '#4facfe' },
  ];

  // Learning paths
  const learningPaths = [
    { id: 1, title: 'Web Development', progress: 75, color: '#667eea' },
    { id: 2, title: 'Data Structures', progress: 60, color: '#f093fb' },
    { id: 3, title: 'System Design', progress: 40, color: '#4facfe' },
  ];

  const stats = [
    { label: 'Study Time', value: '127h', icon: <Clock className="w-5 h-5" />, color: 'from-blue-500 to-cyan-500', change: '+12%' },
    { label: 'Problems Solved', value: '248', icon: <Code className="w-5 h-5" />, color: 'from-purple-500 to-pink-500', change: '+8%' },
    { label: 'Modules Done', value: '32', icon: <BookOpen className="w-5 h-5" />, color: 'from-green-500 to-emerald-500', change: '+15%' },
    { label: 'Avg Score', value: '87%', icon: <TrendingUp className="w-5 h-5" />, color: 'from-orange-500 to-red-500', change: '+5%' },
  ];

  const getCalendarColor = (level) => {
    if (level === -1) return '#f0f0f0'; // Outside 2026
    const colors = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'];
    return colors[level] || colors[0];
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'completed': return <CheckCircle size={16} />;
      case 'started': return <ChevronRight size={16} />;
      case 'achievement': return <Star size={16} />;
      case 'practice': return <Zap size={16} />;
      default: return <Activity size={16} />;
    }
  };

  return (
    <div className="dashboard-page">
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-container">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="back-button"
            onClick={() => navigate('/home')}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </motion.button>
        </div>
      </div>

      <div className="dashboard-container">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="welcome-section"
        >
          <div className="welcome-content">
            <h1 className="welcome-title">Dashboard</h1>
            <p className="welcome-subtitle">Track your learning progress</p>
          </div>
          
          {/* Streak Counter */}
          <div className="streak-container">
            <Flame className="streak-icon" />
            <div className="streak-info">
              <div className="streak-number">{currentStreak}</div>
              <div className="streak-label">day streak</div>
            </div>
            <div className="streak-divider"></div>
            <div className="streak-info">
              <div className="streak-number secondary">{longestStreak}</div>
              <div className="streak-label">longest</div>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="stat-card"
            >
              <div className={`stat-icon bg-gradient-to-br ${stat.color}`}>
                {stat.icon}
              </div>
              <div className="stat-content">
                <div className="stat-label">{stat.label}</div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-change">{stat.change}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="main-grid">
          {/* Left Column */}
          <div className="left-column">
            {/* Performance Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="chart-card"
            >
              <div className="card-header">
                <div>
                  <h3 className="card-title">Performance Trend</h3>
                </div>
                <div className="period-selector">
                  <button 
                    className={`period-btn ${selectedPeriod === 'week' ? 'active' : ''}`}
                    onClick={() => setSelectedPeriod('week')}
                  >
                    Week
                  </button>
                  <button 
                    className={`period-btn ${selectedPeriod === 'month' ? 'active' : ''}`}
                    onClick={() => setSelectedPeriod('month')}
                  >
                    Month
                  </button>
                  <button 
                    className={`period-btn ${selectedPeriod === 'year' ? 'active' : ''}`}
                    onClick={() => setSelectedPeriod('year')}
                  >
                    Year
                  </button>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={getChartData()}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#667eea" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#667eea" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis 
                    dataKey={getXAxisKey()} 
                    stroke="#9ca3af" 
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <YAxis 
                    stroke="#9ca3af" 
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                      fontSize: '13px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#667eea" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorScore)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Activity Calendar - LeetCode Style */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="calendar-card"
            >
              <div className="card-header">
                <div>
                  <h3 className="card-title">Activity — 2026</h3>
                  <div className="calendar-stats">
                    <span className="calendar-stat">{calendarData.filter(d => d.level > 0).length} days active</span>
                    <span className="calendar-stat-divider">•</span>
                    <span className="calendar-stat">Longest streak: {longestStreak} days</span>
                  </div>
                </div>
                <div className="calendar-legend">
                  <span className="legend-text">Less</span>
                  {[0, 1, 2, 3, 4].map(level => (
                    <div 
                      key={level} 
                      className="legend-box"
                      style={{ backgroundColor: getCalendarColor(level) }}
                    ></div>
                  ))}
                  <span className="legend-text">More</span>
                </div>
              </div>
              
              <div className="calendar-wrapper">
                {/* Month labels */}
                <div className="calendar-months">
                  {monthLabels.map((label, index) => (
                    <div 
                      key={index} 
                      className="month-label"
                      style={{ gridColumn: `${label.index + 1} / span 4` }}
                    >
                      {label.month}
                    </div>
                  ))}
                </div>
                
                {/* Day labels */}
                <div className="calendar-days-label">
                  <div>Mon</div>
                  <div>Wed</div>
                  <div>Fri</div>
                </div>
                
                {/* Calendar grid */}
                <div className="calendar-grid-container">
                  <div className="calendar-grid">
                    {calendarData.map((day, index) => (
                      <div
                        key={index}
                        className="calendar-day"
                        style={{ 
                          backgroundColor: getCalendarColor(day.level),
                          opacity: day.level === -1 ? 0.3 : 1
                        }}
                        title={`${day.date}: ${day.count} activities`}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Weekly Goals */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="goals-card"
            >
              <div className="card-header">
                <h3 className="card-title">Weekly Goals</h3>
              </div>
              
              <div className="goals-list">
                {weeklyGoals.map((goal) => (
                  <div key={goal.id} className="goal-item">
                    <div className="goal-header">
                      <span className="goal-title">{goal.title}</span>
                      <span className="goal-progress">{goal.current}/{goal.target}</span>
                    </div>
                    <div className="goal-bar-bg">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(goal.current / goal.target) * 100}%` }}
                        transition={{ duration: 1, delay: 0.6 }}
                        className="goal-bar-fill"
                        style={{ backgroundColor: goal.color }}
                      ></motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="right-column">
            {/* Learning Paths */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="learning-paths-card"
            >
              <div className="card-header">
                <h3 className="card-title">Learning Paths</h3>
              </div>
              
              <div className="learning-paths-list">
                {learningPaths.map((path) => (
                  <div key={path.id} className="learning-path-item">
                    <div className="path-progress-ring">
                      <svg width="60" height="60">
                        <circle
                          cx="30"
                          cy="30"
                          r="26"
                          fill="none"
                          stroke="#f0f0f0"
                          strokeWidth="6"
                        />
                        <motion.circle
                          cx="30"
                          cy="30"
                          r="26"
                          fill="none"
                          stroke={path.color}
                          strokeWidth="6"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 26}`}
                          initial={{ strokeDashoffset: 2 * Math.PI * 26 }}
                          animate={{ 
                            strokeDashoffset: 2 * Math.PI * 26 * (1 - path.progress / 100)
                          }}
                          transition={{ duration: 1, delay: 0.5 }}
                          transform="rotate(-90 30 30)"
                        />
                        <text
                          x="30"
                          y="34"
                          textAnchor="middle"
                          fontSize="14"
                          fontWeight="600"
                          fill="#1a1a2e"
                        >
                          {path.progress}%
                        </text>
                      </svg>
                    </div>
                    <div className="path-info">
                      <div className="path-title">{path.title}</div>
                      <div className="path-status">
                        {path.progress === 100 ? 'Completed' : 'In Progress'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="activity-card"
            >
              <div className="card-header">
                <h3 className="card-title">Recent Activity</h3>
              </div>
              
              <div className="activity-list">
                {recentActivities.map((activity, index) => (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-icon">{getActivityIcon(activity.type)}</div>
                    <div className="activity-content">
                      <div className="activity-title">{activity.title}</div>
                      <div className="activity-time">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Insights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="insights-card"
            >
              <div className="card-header">
                <h3 className="card-title">Insights</h3>
              </div>
              
              <div className="insights-list">
                <div className="insight-item">
                  <div className="insight-icon"><TrendingUp size={20} /></div>
                  <p>You're <strong>15% better</strong> than last week</p>
                </div>
                <div className="insight-item">
                  <div className="insight-icon"><Target size={20} /></div>
                  <p>Focus on <strong>System Design</strong> next</p>
                </div>
                <div className="insight-item">
                  <div className="insight-icon"><Zap size={20} /></div>
                  <p>Maintain your <strong>7-day streak</strong></p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;