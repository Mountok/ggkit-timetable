import React from 'react';
import qrCodeMax2Image from '../qrcode_max_2.png';

function SharePage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        padding: '1rem',
        textAlign: 'center',
        position: 'relative',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          zIndex: 2,
          position: 'relative',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.85)',
            borderRadius: '1.5rem',
            padding: '1.1rem',
            boxShadow: '0 18px 45px rgba(36, 50, 74, 0.12)',
            backdropFilter: 'blur(10px)',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          <h1
            style={{
              margin: '0 0 1rem',
              color: '#24324a',
              fontSize: 'clamp(1.5rem, 5vw, 2rem)',
              lineHeight: 1.2,
            }}
          >
            Онлайн-расписание
          </h1>

          <img
            src={qrCodeMax2Image}
            alt="QR-код для перехода в бот"
            style={{
              width: '100%',
              maxWidth: '320px',
              height: 'auto',
              objectFit: 'contain',
              display: 'block',
              margin: '0 auto',
              boxSizing: 'border-box',
              borderRadius: '0.75rem',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              background: '#fff',
              padding: '0.75rem',
            }}
          />
          <p
            style={{
              margin: '1rem 0 0',
              color: '#5b6474',
              fontSize: '1rem',
              lineHeight: 1.4,
            }}
          >
            Отсканируйте QR-код, чтобы открыть бота.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SharePage;
