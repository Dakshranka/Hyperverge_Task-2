import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api';
import './AuthForm.css';

const AuthForm = ({ type = 'login', onAuth }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
  const url = type === 'login' ? '/api/login' : '/api/register';
  const res = await axios.post(url, form);
      if (type === 'login' && res.data.token) {
        localStorage.setItem('token', res.data.token);
        if (onAuth) onAuth(res.data.token);
        navigate('/apply');
      }
      setError('');
      if (type === 'register') {
        setForm({ email: '', password: '' });
        setSuccess('Registration successful! You can now log in.');
      } else {
        setSuccess('');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed');
    }
    setLoading(false);
  };

  return (
    <div className="auth-bg">
      <div className="auth-center">
        <div className="auth-card animate__animated animate__fadeInUp">
          <h2 className="auth-title">{type === 'login' ? 'Login' : 'Register'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label>Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required />
            </div>
            <div className="auth-field">
              <label>Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} required />
            </div>
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Processing...' : type === 'login' ? 'Login' : 'Register'}
            </button>
          </form>
          {error && <div className="auth-error animate__animated animate__shakeX">{error}</div>}
          {success && <div className="auth-success animate__animated animate__fadeInDown">{success}</div>}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
