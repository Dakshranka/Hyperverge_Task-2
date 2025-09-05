require('dotenv').config();
const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const upload = multer({ dest: path.join(__dirname, 'uploads/') });
const Tesseract = require('tesseract.js');


const app = express();
app.use(cors());
app.use(express.json());
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.delete('/api/dev/remove-all-users', async (req, res) => {
  try {
    await require('./models/User').deleteMany({});
    res.json({ message: 'All users removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}
app.get('/api/protected', authenticateJWT, (req, res) => {
  res.json({ message: 'JWT is working!', user: req.user });
});
const LoanApplication = require('./models/LoanApplication');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      console.error('Registration error: Missing email or password', req.body);
      return res.status(400).json({ error: 'Email and password required' });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      console.error('Registration error: User already exists', email);
      return res.status(400).json({ error: 'User already exists' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashed });
    await user.save();
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(400).json({ error: err.message || 'Registration failed' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User not found. Please register first.' });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ error: 'Incorrect password.' });
    }
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    res.status(400).json({ error: err.message || 'Login failed' });
  }
});

app.post('/api/loan', upload.array('documents'), async (req, res) => {
  try {
    const appData = { ...req.body };
    if (appData.income) appData.income = Number(appData.income);
    if (appData.loanAmount) appData.loanAmount = Number(appData.loanAmount);
    if (appData.loanDuration) appData.loanDuration = Number(appData.loanDuration);
    if (req.files && req.files.length > 0) {
      appData.documents = req.files.map(f => f.path);
    }
    const loanApp = new LoanApplication(appData);
    await loanApp.save();
    const riskRes = await axios.post('http://127.0.0.1:8000/risk-score', appData);
    loanApp.riskScore = riskRes.data.risk_score;
    loanApp.decision = riskRes.data.decision;
    await loanApp.save();
    const explainRes = await axios.post('http://127.0.0.1:8000/explain', appData);
    loanApp.explanation = explainRes.data.explanation;
    await loanApp.save();
    res.status(201).json({
      message: 'Loan application processed',
      id: loanApp._id,
      riskScore: loanApp.riskScore,
      decision: loanApp.decision,
      explanation: loanApp.explanation
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.post('/api/chatbot', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required.' });
    }
    const aiRes = await require('axios').post('http://127.0.0.1:8000/chat', { message });
    res.json({ reply: aiRes.data.reply });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Chatbot error.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
