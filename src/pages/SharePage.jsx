import React, { useEffect, useState, useRef } from 'react';
import qrCodeImage from '../qrcode.png';

function SharePage() {
  const [loading, setLoading] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 12000); // Показываем видео 12 сек
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '2rem',
      textAlign: 'center',
      position: 'relative',
    }}>
      {loading ? (
        <video
          ref={videoRef}
          src="/output.webm"
          style={{
            display: 'block',
            width: 320,
            height: 320,
            position: 'absolute',
            zIndex: 10,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            borderRadius: '1.2rem',
            background: 'transparent'
          }}
          loop
          muted
          playsInline
          autoPlay
        />
      ) : (
        <>
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
            padding: '1rem',
            zIndex: 1
          }} />
        </>
      )}
    </div>
  );
}

export default SharePage;


