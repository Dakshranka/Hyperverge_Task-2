import React, { useState } from 'react';
import axios from '../api';

const LoanAssistant = () => {
  const [messages, setMessages] = useState([
    { sender: 'assistant', text: 'Hi! I am your Loan Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { sender: 'user', text: input }]);
    setLoading(true);
    try {
      
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/loan-assistant', { message: input }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(msgs => [...msgs, { sender: 'assistant', text: res.data.reply }]);
    } catch (err) {
      setMessages(msgs => [...msgs, { sender: 'assistant', text: 'Sorry, I could not process your request.' }]);
    }
    setInput('');
    setLoading(false);
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg p-4">
            <h3 className="mb-3 text-center">Loan Assistant</h3>
            <div className="chat-box mb-3" style={{ maxHeight: '300px', overflowY: 'auto', background: '#f8f9fa', borderRadius: '8px', padding: '1rem' }}>
              {messages.map((msg, idx) => (
                <div key={idx} className={`mb-2 text-${msg.sender === 'user' ? 'end' : 'start'}`}
                  style={{ color: msg.sender === 'assistant' ? '#185a9d' : '#636e72', fontWeight: msg.sender === 'assistant' ? 600 : 400 }}>
                  {msg.text}
                </div>
              ))}
            </div>
            <form onSubmit={sendMessage} className="d-flex">
              <input
                type="text"
                className="form-control me-2"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type your question..."
                disabled={loading}
                autoFocus
              />
              <button type="submit" className="btn btn-primary" disabled={loading || !input.trim()}>
                {loading ? '...' : 'Send'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanAssistant;
