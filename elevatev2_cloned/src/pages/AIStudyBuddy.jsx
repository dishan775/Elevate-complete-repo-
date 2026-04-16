import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, User, Sparkles } from 'lucide-react';
import '../styles/aistudybuddy.css';

export default function AIStudyBuddy() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: "Hi! 👋 I'm your AI Study Buddy. I can help you with Computer Science concepts, debugging, and theory. What's on your mind today?" }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = { id: Date.now(), sender: 'user', text: inputText.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:3001/api/chat/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMessage.text })
      });

      const data = await response.json();
      
      setIsTyping(false);
      setMessages((prev) => [...prev, { id: Date.now(), sender: 'bot', text: data.answer }]);
    } catch (err) {
      console.error("Chat error:", err);
      setIsTyping(false);
      setMessages((prev) => [...prev, { id: Date.now(), sender: 'bot', text: "Oops! I'm having trouble connecting to my brain right now. Please try again later." }]);
    }
  };

  return (
    <div className="ai-study-buddy-page">
      {/* Header */}
      <header className="ai-chat-header">
        <div className="ai-header-info">
          <div className="ai-avatar">
            <Bot size={28} />
          </div>
          <div className="ai-header-text">
            <h1>AI Study Buddy</h1>
            <p><span className="status-dot"></span> Online & Ready to help</p>
          </div>
        </div>
        <div>
          <Sparkles className="text-indigo-400 opacity-50" size={24} />
        </div>
      </header>

      {/* Chat Messages */}
      <div className="ai-chat-container">
        {messages.map((msg) => (
          <div key={msg.id} className={`msg-wrapper ${msg.sender}`}>
            <div className="msg-avatar">
              {msg.sender === 'bot' ? <Bot size={20} /> : <User size={20} />}
            </div>
            <div className="msg-bubble">
              {msg.text.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i !== msg.text.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="msg-wrapper bot">
            <div className="msg-avatar"><Bot size={20} /></div>
            <div className="msg-bubble message-typing">
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="ai-input-area">
        <form className="ai-input-wrapper" onSubmit={handleSend}>
          <input
            type="text"
            className="ai-chat-input"
            placeholder="Ask a computer science question..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isTyping}
          />
          <button 
            type="submit" 
            className="ai-send-btn" 
            disabled={!inputText.trim() || isTyping}
            title="Send Message"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
