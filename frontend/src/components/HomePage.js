import React from 'react';


const HomePage = () => (
  <div className="kyc-bg" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8eaff 0%, #eaf6ff 100%)' }}>
    <div className="kyc-center" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="kyc-card animate__animated animate__fadeInUp" style={{ background: 'rgba(255,255,255,0.95)', borderRadius: '18px', boxShadow: '0 4px 24px rgba(200,200,255,0.12)', padding: '2rem', minWidth: '340px', textAlign: 'center' }}>
        <h1 style={{ color: '#2575fc', fontWeight: 700, marginBottom: '1.5rem' }}>AI Loan Underwriting Agent</h1>
        <p style={{ fontSize: '1.2rem', color: '#2575fc', marginBottom: '1.5rem' }}>Empowering rural and semi-urban India with fast, fair, and secure loan decisions.</p>
        <a href="/apply" className="btn" style={{ background: '#ff69b4', color: '#fff', fontWeight: 600, fontSize: '1.1rem', borderRadius: '8px', padding: '0.7rem 2.2rem', border: 'none', boxShadow: '0 2px 8px #eaf6ff', marginTop: '1rem' }}>Apply for Loan</a>
      </div>
    </div>
  </div>
);

export default HomePage;
