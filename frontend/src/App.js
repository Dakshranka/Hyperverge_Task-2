import React from 'react';
import LoanApplicationForm from './components/LoanApplicationForm';
import KYCUpload from './components/KYCUpload';
import LoanAssistant from './components/LoanAssistant';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './components/HomePage';
import AuthForm from './components/AuthForm';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ChatbotButton from './components/ChatbotButton';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<AuthForm type="login" />} />
          <Route path="/register" element={<AuthForm type="register" />} />
          <Route path="/apply" element={
            <ProtectedRoute>
              <LoanApplicationForm />
            </ProtectedRoute>
          } />
          <Route path="/kyc" element={<ProtectedRoute><KYCUpload /></ProtectedRoute>} />
          <Route path="/assistant" element={<LoanAssistant />} />
        </Routes>
        <ChatbotButton />
      </div>
    </Router>
  );
}

export default App;
