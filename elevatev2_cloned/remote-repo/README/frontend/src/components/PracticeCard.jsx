import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Clock, TrendingUp, Play } from 'lucide-react';

const PracticeCard = ({ module, index }) => {
  const navigate = useNavigate();

  const handleStart = () => {
    // Navigate to specific practice module
    navigate('/dashboard', { state: { module: module.title } });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="practice-card"
      style={{ '--card-gradient': module.color }}
    >
      <div className="card-gradient-bg"></div>
      
      <div className="card-header">
        <div className="card-icon">{module.icon}</div>
        <div className="card-badge">{module.difficulty}</div>
      </div>

      <h3 className="card-title">{module.title}</h3>
      <p className="card-description">{module.description}</p>

      <div className="card-meta">
        <div className="meta-item">
          <Clock size={16} />
          <span>{module.duration}</span>
        </div>
        <div className="meta-item">
          <TrendingUp size={16} />
          <span>{module.category}</span>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="card-start-btn"
        onClick={handleStart}
      >
        <Play size={20} fill="currentColor" />
        <span>Start Practice</span>
      </motion.button>
    </motion.div>
  );
};

export default PracticeCard;