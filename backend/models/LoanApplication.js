const mongoose = require('mongoose');

const LoanApplicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pin: { type: String, required: true },
  aadhaar: { type: String, required: true },
  pan: { type: String, required: true },
  income: { type: Number, required: true },
  incomeSource: { type: String, required: true },
  employer: { type: String },
  loanAmount: { type: Number, required: true },
  loanPurpose: { type: String, required: true },
  loanDuration: { type: Number, required: true },
  documents: { type: [String] }, // store file paths if needed
  status: { type: String, default: 'pending' },
  riskScore: { type: Number },
  decision: { type: String },
  explanation: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LoanApplication', LoanApplicationSchema);
