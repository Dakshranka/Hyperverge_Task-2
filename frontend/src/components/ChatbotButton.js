import React, { useState, useRef, useEffect } from 'react';
import './ChatbotButton.css';

const ChatbotButton = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! I am your LoanAI assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages(msgs => [...msgs, { sender: 'user', text: input }]);
    const userMessage = input;
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });
      const data = await res.json();
      if (data.reply) {
        setMessages(msgs => [...msgs, { sender: 'bot', text: data.reply }]);
      } else {
        setMessages(msgs => [...msgs, { sender: 'bot', text: 'Sorry, I could not get a response.' }]);
      }
    } catch (err) {
      setMessages(msgs => [...msgs, { sender: 'bot', text: 'Error connecting to AI assistant.' }]);
    }
    setLoading(false);
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  return (
    <>
      <button className="chatbot-float-btn" onClick={() => setOpen(!open)}>
        <span role="img" aria-label="chat">💬</span>
      </button>
      {open && (
        <div className="chatbot-popup">
          <div className="chatbot-header">LoanAI Assistant <button onClick={() => setOpen(false)} className="chatbot-close">×</button></div>
          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={msg.sender === 'bot' ? 'chatbot-msg-bot' : 'chatbot-msg-user'}>{msg.text}</div>
            ))}
            {loading && (
              <div className="chatbot-msg-bot chatbot-loading">
                <span className="chatbot-loader"></span> LoanAI is thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="chatbot-input-row">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type your question..."
              className="chatbot-input"
              disabled={loading}
              onKeyDown={e => {
                if (e.key === 'Enter' && input.trim() && !loading) handleSend();
              }}
            />
            <button
              onClick={handleSend}
              className="chatbot-send"
              disabled={!input.trim() || loading}
            >{loading ? '...' : 'Send'}</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotButton;
