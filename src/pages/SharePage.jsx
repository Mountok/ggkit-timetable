import React from 'react';
import qrCodeImage from '../qrcode.png';

function SharePage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <h1 style={{
        marginBottom: '2rem',
        color: '#1e293b',
        fontSize: '1.75rem',
        fontWeight: 700
      }}>Онлайн Расписание</h1>
      
      <img src={qrCodeImage} alt="QR Code" style={{
        width: '300px',
        height: '300px',
        objectFit: 'contain',
        borderRadius: '0.75rem',
        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
        background: '#fff',
        padding: '1rem'
      }} />
    </div>
  )
}

export default SharePage


