

import React, { useState } from 'react';
import Tesseract from 'tesseract.js';



const KYCUpload = () => {
  const [ocrResult, setOcrResult] = useState({ panName: '', aadhaarName: '', aadhaar: '', pan: '' });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState({ name: '', aadhaar: '', pan: '' });

  
  const handlePanUpload = async (e) => {
    const selectedFile = e.target.files[0];
    setStatus('');
    setOcrResult((prev) => ({ ...prev, panName: '', pan: '' }));
    if (selectedFile) {
      setLoading(true);
      const { data: { text } } = await Tesseract.recognize(selectedFile, 'eng');
      const panMatch = text.match(/[A-Z]{5}[0-9]{4}[A-Z]/);
      
      let panName = '';
      if (panMatch) {
        const lines = text.split('\n');
        const panIndex = lines.findIndex(line => line.includes(panMatch[0]));
        
        for (let i = panIndex + 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line && /^[A-Z ]{5,}$/.test(line) && line.split(' ').length >= 2 && !/[0-9]/.test(line)) {
            panName = line;
            break;
          }
        }
        
        if (!panName) {
          for (let i = panIndex - 1; i >= 0; i--) {
            const line = lines[i].trim();
            if (/^[A-Z ]{5,}$/.test(line) && line.split(' ').length >= 2 && !/[0-9]/.test(line)) {
              panName = line;
              break;
            }
          }
        }
      }
      setOcrResult((prev) => ({ ...prev, pan: panMatch ? panMatch[0] : '', panName }));
      setLoading(false);
    }
  };

  
  const handleAadhaarUpload = async (e) => {
    const selectedFile = e.target.files[0];
    setStatus('');
    setOcrResult((prev) => ({ ...prev, aadhaarName: '', aadhaar: '' }));
    if (selectedFile) {
      setLoading(true);
      const { data: { text } } = await Tesseract.recognize(selectedFile, 'eng');
      const aadhaarMatch = text.match(/\b\d{4}\s?\d{4}\s?\d{4}\b/);
      
      let aadhaarName = '';
      const lines = text.split('\n');
      for (let line of lines) {
        if (/^[A-Z][a-z]+(\s[A-Z][a-z]+)+$/.test(line.trim())) {
          aadhaarName = line.trim();
          break;
        }
      }
      setOcrResult((prev) => ({ ...prev, aadhaar: aadhaarMatch ? aadhaarMatch[0].replace(/\s/g, '') : '', aadhaarName }));
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInput((prev) => ({ ...prev, [name]: value }));
  };


  const handleValidate = () => {
    let valid = true;
    let msg = '';
    if (userInput.aadhaar && ocrResult.aadhaar && userInput.aadhaar !== ocrResult.aadhaar) {
      valid = false;
      msg += 'Aadhaar does not match. ';
    }
    if (userInput.pan && ocrResult.pan && userInput.pan !== ocrResult.pan) {
      valid = false;
      msg += 'PAN does not match. ';
    }
    
    if (
      !ocrResult.panName || !ocrResult.aadhaarName ||
      userInput.name.toLowerCase() !== ocrResult.panName.toLowerCase() ||
      userInput.name.toLowerCase() !== ocrResult.aadhaarName.toLowerCase()
    ) {
      valid = false;
      msg += 'Name does not match both PAN and Aadhaar, or name missing. ';
    }
    setStatus(valid ? 'KYC Validated Successfully!' : `Validation Failed: ${msg}`);
  };



  return (
    <div className="kyc-bg" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8eaff 0%, #eaf6ff 100%)' }}>
      <div className="kyc-center" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div className="kyc-card animate__animated animate__fadeInUp" style={{ background: 'rgba(255,255,255,0.95)', borderRadius: '18px', boxShadow: '0 4px 24px rgba(200,200,255,0.12)', padding: '2rem', minWidth: '340px' }}>
          <h2 className="kyc-title" style={{ color: '#2575fc', fontWeight: 700, textAlign: 'center', marginBottom: '1.5rem' }}>KYC Document Upload</h2>
          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <div>
              <label style={{ fontWeight: 500, color: '#ff69b4' }}>Upload PAN Card</label><br />
              <input type="file" accept="image/*,.pdf" onChange={handlePanUpload} />
              {ocrResult.pan && <div style={{ marginTop: '0.5rem', color: '#2575fc' }}>PAN: {ocrResult.pan}</div>}
              {ocrResult.panName && <div style={{ color: '#2575fc' }}>Name (PAN): {ocrResult.panName}</div>}
            </div>
            <div>
              <label style={{ fontWeight: 500, color: '#ff69b4' }}>Upload Aadhaar Card</label><br />
              <input type="file" accept="image/*,.pdf" onChange={handleAadhaarUpload} />
              {ocrResult.aadhaar && <div style={{ marginTop: '0.5rem', color: '#2575fc' }}>Aadhaar: {ocrResult.aadhaar}</div>}
              {ocrResult.aadhaarName && <div style={{ color: '#2575fc' }}>Name (Aadhaar): {ocrResult.aadhaarName}</div>}
            </div>
          </div>
          <div style={{ marginTop: '1rem', marginBottom: '1rem', textAlign: 'center' }}>
            <input type="text" name="aadhaar" placeholder="Enter Aadhaar" value={userInput.aadhaar} onChange={handleInputChange} style={{ margin: '0.3rem', padding: '0.5rem', borderRadius: '8px', border: '1px solid #eaf6ff' }} />
            <input type="text" name="pan" placeholder="Enter PAN" value={userInput.pan} onChange={handleInputChange} style={{ margin: '0.3rem', padding: '0.5rem', borderRadius: '8px', border: '1px solid #eaf6ff' }} />
            <input type="text" name="name" placeholder="Enter Name" value={userInput.name} onChange={handleInputChange} style={{ margin: '0.3rem', padding: '0.5rem', borderRadius: '8px', border: '1px solid #eaf6ff' }} />
            <button onClick={handleValidate} style={{ marginLeft: '1rem', background: '#ff69b4', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, padding: '0.5rem 1.2rem' }}>Validate</button>
          </div>
          {loading && <div style={{ textAlign: 'center', color: '#2575fc' }}>Processing document...</div>}
          {status && <div className={status.includes('Failed') ? 'error' : 'success'} style={{ textAlign: 'center', fontWeight: 600, color: status.includes('Failed') ? '#d32f2f' : '#43cea2', marginTop: '1rem' }}>{status}</div>}
        </div>
      </div>
    </div>
  );
};

export default KYCUpload;
