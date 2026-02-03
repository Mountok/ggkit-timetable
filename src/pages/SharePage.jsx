import React from 'react';
import qrCodeMax2Image from '../qrcode_max_2.png';

function SharePage() {
  // Обычная тема
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        padding: '2rem',
        textAlign: 'center',
        position: 'relative',
      }}
    >
      <h1
        style={{
          marginBottom: '2rem',
          color: '#4a5568',
          fontSize: '1.75rem',
          fontWeight: 700,
          zIndex: 2,
          position: 'relative',
        }}
      >
        Онлайн расписание
      </h1>

      <div
        style={{
          display: 'flex',
          gap: '2rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
          zIndex: 2,
          position: 'relative',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <img
            src={qrCodeMax2Image}
            alt="QR Бот в Max"
            style={{
              width: '260px',
              height: '260px',
              objectFit: 'contain',
              borderRadius: '0.75rem',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              background: '#fff',
              padding: '1rem',
            }}
          />
          <p style={{
            fontSize: "1.5rem",
            marginTop: '0.75rem',
            color: '#4a5568',
            fontWeight: 600
          }}>
            Бот в Max
          </p>
        </div>
      </div>
    </div>
  );
}

export default SharePage;