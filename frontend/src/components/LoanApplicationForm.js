import React, { useState } from 'react';
import axios from '../api';
import './LoanApplicationForm.css';

const initialForm = {
  name: '',
  mobile: '',
  email: '',
  address: '',
  city: '',
  state: '',
  pin: '',
  aadhaar: '',
  pan: '',
  income: '',
  incomeSource: '',
  employer: '',
  loanAmount: '',
  loanPurpose: '',
  loanDuration: '',
  documents: null,
  consent: false
};

const LoanApplicationForm = () => {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setForm({ ...form, [name]: checked });
    } else if (type === 'file') {
      setForm({ ...form, [name]: files });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      let res;
  const token = localStorage.getItem('token');

      if (form.documents && form.documents.length > 0) {
        
        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) => {
          if (key === 'documents') {
            for (let i = 0; i < value.length; i++) {
              formData.append('documents', value[i]);
            }
          } else {
            formData.append(key, value);
          }
        });

        res = await axios.post('/api/loan', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        
        const { documents, ...jsonData } = form;
        res = await axios.post('/api/loan', jsonData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }

      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Submission failed');
    }
    setLoading(false);
  };

  return (
    <div className="loan-bg animate__animated animate__fadeIn">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-10">
            <div
              className="card shadow-lg p-5 animate__animated animate__zoomIn"
              style={{
                borderRadius: '1.5rem',
                background: 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)',
                color: '#fff',
                boxShadow: '0 8px 32px rgba(44,62,80,0.15)'
              }}
            >
              <h2
                className="mb-4 text-center"
                style={{
                  color: '#ffd700',
                  fontWeight: 700,
                  textShadow: '0 2px 8px #185a9d'
                }}
              >
                Apply for Loan
              </h2>

              {/* Loan Application Form */}
              <form
                onSubmit={handleSubmit}
                className="mb-3"
                encType="multipart/form-data"
                autoComplete="off"
              >
                <div className="row g-3">
                  {/* Name */}
                  <div className="col-md-6 d-flex flex-column">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      value={form.name}
                      onChange={handleChange}
                      required
                      pattern="^[A-Za-z ]{3,}$"
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Mobile */}
                  <div className="col-md-6 d-flex flex-column">
                    <label className="form-label">Mobile Number</label>
                    <input
                      type="tel"
                      name="mobile"
                      className="form-control"
                      value={form.mobile}
                      onChange={handleChange}
                      required
                      pattern="[0-9]{10}"
                      placeholder="Enter mobile number"
                    />
                  </div>

                  {/* Email */}
                  <div className="col-md-6 d-flex flex-column">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter email address"
                    />
                  </div>

                  {/* Address */}
                  <div className="col-md-6 d-flex flex-column">
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      name="address"
                      className="form-control"
                      value={form.address}
                      onChange={handleChange}
                      required
                      placeholder="Enter address"
                    />
                  </div>

                  {/* City */}
                  <div className="col-md-4 d-flex flex-column">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      name="city"
                      className="form-control"
                      value={form.city}
                      onChange={handleChange}
                      required
                      placeholder="City"
                    />
                  </div>

                  {/* State */}
                  <div className="col-md-4 d-flex flex-column">
                    <label className="form-label">State</label>
                    <input
                      type="text"
                      name="state"
                      className="form-control"
                      value={form.state}
                      onChange={handleChange}
                      required
                      placeholder="State"
                    />
                  </div>

                  {/* PIN */}
                  <div className="col-md-4 d-flex flex-column">
                    <label className="form-label">PIN Code</label>
                    <input
                      type="text"
                      name="pin"
                      className="form-control"
                      value={form.pin}
                      onChange={handleChange}
                      required
                      pattern="[0-9]{6}"
                      placeholder="PIN Code"
                    />
                  </div>

                  {/* Aadhaar */}
                  <div className="col-md-6 d-flex flex-column">
                    <label className="form-label">Aadhaar</label>
                    <input
                      type="password"
                      name="aadhaar"
                      className="form-control"
                      value={form.aadhaar}
                      onChange={handleChange}
                      required
                      maxLength={12}
                      pattern="\d{12}"
                      placeholder="Enter 12-digit Aadhaar"
                    />
                  </div>

                  {/* PAN */}
                  <div className="col-md-6 d-flex flex-column">
                    <label className="form-label">PAN</label>
                    <input
                      type="password"
                      name="pan"
                      className="form-control"
                      value={form.pan}
                      onChange={handleChange}
                      required
                      maxLength={10}
                      pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                      placeholder="Enter 10-digit PAN"
                    />
                  </div>

                  {/* Income Source */}
                  <div className="col-md-6 d-flex flex-column">
                    <label className="form-label">Income Source</label>
                    <select
                      name="incomeSource"
                      className="form-select"
                      value={form.incomeSource}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select source</option>
                      <option value="Salaried">Salaried</option>
                      <option value="Self-Employed">Self-Employed</option>
                      <option value="Agriculture">Agriculture</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Employer */}
                  <div className="col-md-6 d-flex flex-column">
                    <label className="form-label">Employer/Business Name</label>
                    <input
                      type="text"
                      name="employer"
                      className="form-control"
                      value={form.employer}
                      onChange={handleChange}
                      placeholder="Employer/Business Name"
                    />
                  </div>

                  {/* Income */}
                  <div className="col-md-6 d-flex flex-column">
                    <label className="form-label">Annual Income (INR)</label>
                    <input
                      type="number"
                      name="income"
                      className="form-control"
                      value={form.income}
                      onChange={handleChange}
                      required
                      min={0}
                      step={1000}
                      placeholder="Annual Income"
                    />
                  </div>

                  {/* Loan Amount */}
                  <div className="col-md-6 d-flex flex-column">
                    <label className="form-label">Loan Amount (INR)</label>
                    <input
                      type="number"
                      name="loanAmount"
                      className="form-control"
                      value={form.loanAmount}
                      onChange={handleChange}
                      required
                      min={1000}
                      step={100}
                      placeholder="Loan Amount"
                    />
                  </div>

                  {/* Loan Purpose */}
                  <div className="col-md-6 d-flex flex-column">
                    <label className="form-label">Loan Purpose</label>
                    <select
                      name="loanPurpose"
                      className="form-select"
                      value={form.loanPurpose}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select purpose</option>
                      <option value="Agriculture">Agriculture</option>
                      <option value="Business">Business</option>
                      <option value="Education">Education</option>
                      <option value="Medical">Medical</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Loan Duration */}
                  <div className="col-md-6 d-flex flex-column">
                    <label className="form-label">Loan Duration (months)</label>
                    <input
                      type="number"
                      name="loanDuration"
                      className="form-control"
                      value={form.loanDuration}
                      onChange={handleChange}
                      required
                      min={6}
                      max={60}
                      placeholder="Duration in months"
                    />
                  </div>

                  {/* Upload Docs */}
                  <div className="col-md-12 d-flex flex-column">
                    <label className="form-label">Upload Documents</label>
                    <input
                      type="file"
                      name="documents"
                      className="form-control"
                      onChange={handleChange}
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                  </div>

                  {/* Consent */}
                  <div className="col-md-12 mt-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="consent"
                        id="consentCheck"
                        checked={form.consent}
                        onChange={handleChange}
                        required
                      />
                      <label className="form-check-label" htmlFor="consentCheck">
                        I agree to the <span style={{ textDecoration: 'underline' }}>terms and conditions</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="d-flex justify-content-center align-items-center mt-4">
                  <button
                    type="submit"
                    className="btn btn-lg px-5"
                    disabled={loading}
                    style={{
                      background: 'linear-gradient(90deg, #43cea2 0%, #185a9d 100%)',
                      border: 'none',
                      color: '#fff',
                      fontWeight: 600,
                      fontSize: '1.2rem',
                      boxShadow: '0 2px 8px #185a9d'
                    }}
                  >
                    {loading ? 'Processing...' : 'Submit'}
                  </button>
                </div>
              </form>

              {/* Messages */}
              <div>
                {error && (
                  <div className="alert alert-danger mt-3">{error}</div>
                )}
                {result && (
                  <div className="mt-4">
                    <div
                      className={`card border-${
                        result.decision === 'approved' ? 'success' : 'danger'
                      } mb-3`}
                      style={{ borderRadius: '1rem' }}
                    >
                      <div className="card-body text-center">
                        <h4
                          className="card-title mb-3"
                          style={{
                            color:
                              result.decision === 'approved'
                                ? '#00b894'
                                : '#d63031'
                          }}
                        >
                          {result.decision === 'approved'
                            ? 'Congratulations! Your loan is approved.'
                            : 'Sorry, your loan was not approved.'}
                        </h4>
                        <div className="mb-2">
                          <span style={{ fontWeight: 600 }}>Risk Score: </span>
                          <span className="badge bg-info">
                            {result.riskScore}
                          </span>
                        </div>
                        <div className="mb-2">
                          <span style={{ fontWeight: 600 }}>Decision: </span>
                          <span
                            className={`badge bg-${
                              result.decision === 'approved'
                                ? 'success'
                                : 'danger'
                            }`}
                          >
                            {result.decision}
                          </span>
                        </div>
                        <div className="mb-2">
                          <span style={{ fontWeight: 600 }}>
                            Why this decision?
                          </span>
                          <div className="alert alert-secondary mt-2">
                            {result.explanation}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanApplicationForm;
