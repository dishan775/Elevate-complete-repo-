import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Search, Send, Phone, Video, MoreVertical, Users, User,
  Hash, Plus, Smile, Paperclip, Mic, CheckCheck
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import '../styles/community.css';

// ─── Demo Data ───
const groups = [
  {
    id: 'g1', name: 'DSA Warriors',type: 'group', icon: '🗡️',
    members: 128, lastMsg: 'Can someone explain Dijkstra\'s algorithm?', time: '2:34 PM', unread: 5,
    online: 42,
  },
  {
    id: 'g2', name: 'ML Study Group', type: 'group', icon: '🧠',
    members: 89, lastMsg: 'Just shared Random Forest notes in the files section!', time: '1:15 PM', unread: 2,
    online: 18,
  },
  {
    id: 'g3', name: 'Placement Prep 2026', type: 'group', icon: '🎯',
    members: 245, lastMsg: 'Mock interview schedule for next week is out', time: '12:30 PM', unread: 12,
    online: 67,
  },
  {
    id: 'g4', name: 'Web Dev Hub', type: 'group', icon: '🌐',
    members: 156, lastMsg: 'React 19 just released! Anyone tried it?', time: '11:20 AM', unread: 0,
    online: 34,
  },
  {
    id: 'g5', name: 'Gen AI Explorers', type: 'group', icon: '✨',
    members: 73, lastMsg: 'Check out this new paper on reasoning models', time: 'Yesterday', unread: 8,
    online: 12,
  },
];

const contacts = [
  { id: 'c1', name: 'Arjun Sharma', type: 'dm', avatar: 'A', lastMsg: 'Thanks for the notes!', time: '3:00 PM', unread: 1, online: true },
  { id: 'c2', name: 'Priya Mehta', type: 'dm', avatar: 'P', lastMsg: 'See you in the mock interview.', time: '2:45 PM', unread: 0, online: true },
  { id: 'c3', name: 'Rahul Kumar', type: 'dm', avatar: 'R', lastMsg: 'Did you solve that DP problem?', time: '1:30 PM', unread: 3, online: false },
  { id: 'c4', name: 'Sneha Patel', type: 'dm', avatar: 'S', lastMsg: 'The OS notes are amazing!', time: '12:15 PM', unread: 0, online: true },
  { id: 'c5', name: 'Vikram Singh', type: 'dm', avatar: 'V', lastMsg: 'Can we discuss CNNs tomorrow?', time: 'Yesterday', unread: 0, online: false },
];

const demoMessages = {
  g1: [
    { id: 1, sender: 'Arjun S.', text: 'Hey everyone! Has anyone implemented Dijkstra using a priority queue?', time: '2:20 PM', isOwn: false },
    { id: 2, sender: 'Priya M.', text: 'Yes! Using a min-heap makes it O((V+E)logV). I can share my code.', time: '2:22 PM', isOwn: false },
    { id: 3, sender: 'You', text: 'That would be great Priya! Also, how does it differ from Bellman-Ford?', time: '2:25 PM', isOwn: true },
    { id: 4, sender: 'Rahul K.', text: 'Bellman-Ford handles negative weights but is slower at O(VE). Dijkstra fails with negative edges.', time: '2:28 PM', isOwn: false },
    { id: 5, sender: 'Arjun S.', text: 'Great explanation! Here\'s a comparison table I made 📊', time: '2:30 PM', isOwn: false },
    { id: 6, sender: 'Sneha P.', text: 'Can someone explain Dijkstra\'s algorithm step by step? I\'m confused about the relaxation part.', time: '2:34 PM', isOwn: false },
  ],
  g2: [
    { id: 1, sender: 'Vikram S.', text: 'Just shared Random Forest notes in the files section!', time: '1:10 PM', isOwn: false },
    { id: 2, sender: 'You', text: 'Thanks Vikram! These are really detailed. 🙌', time: '1:12 PM', isOwn: true },
    { id: 3, sender: 'Priya M.', text: 'Has anyone tried implementing it from scratch in Python?', time: '1:15 PM', isOwn: false },
  ],
  c1: [
    { id: 1, sender: 'Arjun Sharma', text: 'Hey! Did you finish the assignment?', time: '2:50 PM', isOwn: false },
    { id: 2, sender: 'You', text: 'Almost done! Just the last 2 questions left.', time: '2:52 PM', isOwn: true },
    { id: 3, sender: 'Arjun Sharma', text: 'Thanks for the notes!', time: '3:00 PM', isOwn: false },
  ],
};

const CommunityPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('groups');
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);

  const allChats = activeTab === 'groups' ? groups : contacts;
  const filteredChats = allChats.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedChat]);

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    if (!messages[chat.id]) {
      setMessages(prev => ({ ...prev, [chat.id]: demoMessages[chat.id] || [] }));
    }
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedChat) return;
    const newMsg = {
      id: Date.now(),
      sender: 'You',
      text: messageInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
    };
    setMessages(prev => ({
      ...prev,
      [selectedChat.id]: [...(prev[selectedChat.id] || []), newMsg],
    }));
    setMessageInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const currentMessages = selectedChat ? (messages[selectedChat.id] || []) : [];

  return (
    <div className="community-page">
      {/* ─── Left Panel: Chat List ─── */}
      <div className="community-sidebar">
        <div className="community-sidebar-header">
          <button className="comm-back-btn" onClick={() => navigate('/home')}>
            <ArrowLeft size={18} />
          </button>
          <h2>Community</h2>
          <button className="comm-add-btn">
            <Plus size={18} />
          </button>
        </div>

        {/* Search */}
        <div className="comm-search-bar">
          <Search size={16} className="comm-search-icon" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Tabs */}
        <div className="comm-tabs">
          <button className={`comm-tab ${activeTab === 'groups' ? 'active' : ''}`} onClick={() => { setActiveTab('groups'); setSelectedChat(null); }}>
            <Users size={15} /> Groups
          </button>
          <button className={`comm-tab ${activeTab === 'dms' ? 'active' : ''}`} onClick={() => { setActiveTab('dms'); setSelectedChat(null); }}>
            <User size={15} /> Direct Messages
          </button>
        </div>

        {/* Chat List */}
        <div className="comm-chat-list">
          {filteredChats.map((chat) => (
            <motion.div
              key={chat.id}
              whileHover={{ x: 4 }}
              className={`comm-chat-item ${selectedChat?.id === chat.id ? 'active' : ''}`}
              onClick={() => handleSelectChat(chat)}
            >
              <div className="comm-chat-avatar">
                {chat.type === 'group' ? (
                  <span className="group-icon-emoji">{chat.icon}</span>
                ) : (
                  <div className="dm-avatar">
                    {chat.avatar}
                    {chat.online && <span className="online-dot"></span>}
                  </div>
                )}
              </div>
              <div className="comm-chat-info">
                <div className="comm-chat-name-row">
                  <span className="comm-chat-name">{chat.name}</span>
                  <span className="comm-chat-time">{chat.time}</span>
                </div>
                <div className="comm-chat-preview-row">
                  <span className="comm-chat-preview">{chat.lastMsg}</span>
                  {chat.unread > 0 && <span className="comm-unread-badge">{chat.unread}</span>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ─── Right Panel: Chat Area ─── */}
      <div className="community-chat-area">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="comm-chat-header">
              <div className="comm-chat-header-info">
                <div className="comm-chat-header-avatar">
                  {selectedChat.type === 'group' ? (
                    <span className="group-icon-emoji">{selectedChat.icon}</span>
                  ) : (
                    <div className="dm-avatar sm">
                      {selectedChat.avatar}
                      {selectedChat.online && <span className="online-dot"></span>}
                    </div>
                  )}
                </div>
                <div>
                  <strong>{selectedChat.name}</strong>
                  <span className="comm-header-sub">
                    {selectedChat.type === 'group'
                      ? `${selectedChat.members} members · ${selectedChat.online} online`
                      : selectedChat.online ? 'Online' : 'Last seen recently'
                    }
                  </span>
                </div>
              </div>
              <div className="comm-chat-header-actions">
                <button className="comm-action-btn"><Phone size={18} /></button>
                <button className="comm-action-btn"><Video size={18} /></button>
                <button className="comm-action-btn"><MoreVertical size={18} /></button>
              </div>
            </div>

            {/* Messages */}
            <div className="comm-messages-area">
              <div className="comm-date-divider">
                <span>Today</span>
              </div>
              {currentMessages.map((msg) => (
                <div key={msg.id} className={`comm-message ${msg.isOwn ? 'own' : ''}`}>
                  {!msg.isOwn && selectedChat.type === 'group' && (
                    <span className="comm-msg-sender">{msg.sender}</span>
                  )}
                  <div className="comm-msg-bubble">
                    <span className="comm-msg-text">{msg.text}</span>
                    <span className="comm-msg-meta">
                      <span className="comm-msg-time">{msg.time}</span>
                      {msg.isOwn && <CheckCheck size={14} className="comm-msg-read" />}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="comm-input-area">
              <button className="comm-input-action"><Smile size={20} /></button>
              <button className="comm-input-action"><Paperclip size={20} /></button>
              <input
                type="text"
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                className={`comm-send-btn ${messageInput.trim() ? 'active' : ''}`}
                onClick={handleSendMessage}
                disabled={!messageInput.trim()}
              >
                {messageInput.trim() ? <Send size={18} /> : <Mic size={18} />}
              </button>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="comm-empty-state">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="comm-empty-content"
            >
              <div className="comm-empty-icon">
                <Users size={48} strokeWidth={1} />
              </div>
              <h2>Welcome to Community</h2>
              <p>Select a group or conversation to start chatting with fellow students.</p>
              <div className="comm-empty-features">
                <div className="comm-feature">
                  <Hash size={16} /> <span>Join study groups</span>
                </div>
                <div className="comm-feature">
                  <User size={16} /> <span>Direct message peers</span>
                </div>
                <div className="comm-feature">
                  <Video size={16} /> <span>Video study sessions</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityPage;
