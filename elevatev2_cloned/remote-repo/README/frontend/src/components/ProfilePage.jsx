import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit2, Save, Mail, Phone, MapPin, Calendar, Award, Flame, Star, Trophy, CheckCircle2, PlayCircle } from 'lucide-react';
import useAuthStore from '../store/authStore';
import ThemeToggle from './ThemeToggle';
import '../styles/profile.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    bio: user?.bio || '',
    dateJoined: user?.dateJoined || new Date().toLocaleDateString(),
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || '',
        dateJoined: user.dateJoined || new Date().toLocaleDateString(),
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    updateUser(profileData);
    setIsEditing(false);
  };

  const stats = [
    { icon: <Award size={20} />, label: 'Modules', value: '12' },
    { icon: <Flame size={20} />, label: 'Streak', value: '7' },
    { icon: <Star size={20} />, label: 'Points', value: '2,450' },
    { icon: <Trophy size={20} />, label: 'Awards', value: '5' },
  ];

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-header">
        <div className="profile-container">
          <div className="profile-header-bar">
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="back-button"
              onClick={() => navigate('/home')}
            >
              <ArrowLeft size={16} />
              Back
            </motion.button>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="profile-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="profile-content"
        >
          {/* Profile Card */}
          <div className="profile-card">
            <div className="profile-banner" />

            <div className="profile-info-section">
              <div className="avatar-section">
                <div className="profile-avatar-large">
                  {user?.avatar || user?.name?.charAt(0) || 'U'}
                </div>
              </div>

              <div className="profile-details">
                {!isEditing ? (
                  <>
                    <h1 className="profile-name">{profileData.name}</h1>
                    <p className="profile-bio">{profileData.bio || 'No bio added yet'}</p>

                    <div className="profile-meta">
                      {profileData.email && (
                        <div className="meta-item">
                          <Mail size={15} />
                          <span>{profileData.email}</span>
                        </div>
                      )}
                      {profileData.phone && (
                        <div className="meta-item">
                          <Phone size={15} />
                          <span>{profileData.phone}</span>
                        </div>
                      )}
                      {profileData.location && (
                        <div className="meta-item">
                          <MapPin size={15} />
                          <span>{profileData.location}</span>
                        </div>
                      )}
                      <div className="meta-item">
                        <Calendar size={15} />
                        <span>Joined {profileData.dateJoined}</span>
                      </div>
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      className="edit-profile-btn"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit2 size={14} />
                      Edit Profile
                    </motion.button>
                  </>
                ) : (
                  <div className="edit-form">
                    <div className="form-group">
                      <label>Name</label>
                      <input
                        type="text"
                        name="name"
                        value={profileData.name}
                        onChange={handleChange}
                        placeholder="Your name"
                      />
                    </div>

                    <div className="form-group">
                      <label>Bio</label>
                      <textarea
                        name="bio"
                        value={profileData.bio}
                        onChange={handleChange}
                        placeholder="Tell us about yourself"
                        rows="3"
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Email</label>
                        <input
                          type="email"
                          name="email"
                          value={profileData.email}
                          onChange={handleChange}
                          placeholder="your@email.com"
                        />
                      </div>

                      <div className="form-group">
                        <label>Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          value={profileData.phone}
                          onChange={handleChange}
                          placeholder="+1 234 567 8900"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Location</label>
                      <input
                        type="text"
                        name="location"
                        value={profileData.location}
                        onChange={handleChange}
                        placeholder="City, Country"
                      />
                    </div>

                    <div className="form-actions">
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        className="save-btn"
                        onClick={handleSave}
                      >
                        <Save size={14} />
                        Save Changes
                      </motion.button>
                      <button
                        className="cancel-btn"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="stats-grid"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.06 }}
                className="stat-card"
              >
                <div className="stat-icon">
                  {typeof stat.icon === 'string' ? stat.icon : stat.icon}
                </div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="activity-section"
          >
            <h2 className="section-title">Recent Activity</h2>
            <div className="activity-list">
              {[
                { title: 'Completed Python Basics', date: '2 hours ago', icon: <CheckCircle2 size={16} /> },
                { title: 'Started Machine Learning Course', date: '1 day ago', icon: <PlayCircle size={16} /> },
                { title: 'Earned "Quick Learner" Badge', date: '3 days ago', icon: <Star size={16} /> },
              ].map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.06 }}
                  className="activity-item"
                >
                  <div className="activity-icon">{activity.icon}</div>
                  <div className="activity-content">
                    <div className="activity-title">{activity.title}</div>
                    <div className="activity-date">{activity.date}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;