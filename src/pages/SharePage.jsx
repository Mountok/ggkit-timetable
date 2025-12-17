import React, { useEffect, useState, useRef } from 'react';
import qrCodeImage from '../qrcode.png';

function SharePage() {
  const [loading, setLoading] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 12000);
    return () => clearTimeout(timer);
  }, []);

  // Генерируем снежинки (статично, 120 шт — достаточно для плавного эффекта)
  const snowflakes = Array.from({ length: 120 }, (_, i) => {
    const size = 8 + Math.random() * 12; // px
    const duration = 8 + Math.random() * 12; // секунд
    const delay = Math.random() * 10;
    const x = Math.random() * 100; // % от ширины

    return (
      <div
        key={i}
        className="snowflake"
        style={{
          left: `${x}%`,
          fontSize: `${size}px`,
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
          opacity: 0.6 + Math.random() * 0.4,
        }}
      >
        ❄
      </div>
    );
  });

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: loading
          ? 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
          : 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)',
        padding: '2rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Падающий снег — бесконечно, без накопления */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        {snowflakes}
      </div>

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
            background: 'transparent',
          }}
          loop
          muted
          playsInline
          autoPlay
        />
      ) : (
        <>
          <h1
            style={{
              marginBottom: '2rem',
              color: '#e2e8f0',
              fontSize: '1.75rem',
              fontWeight: 700,
              zIndex: 2,
              position: 'relative',
            }}
          >
            Онлайн Расписание
          </h1>
          <img
            src={qrCodeImage}
            alt="QR Code"
            style={{
              width: '300px',
              height: '300px',
              objectFit: 'contain',
              borderRadius: '0.75rem',
              boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
              background: '#fff',
              padding: '1rem',
              zIndex: 2,
              position: 'relative',
            }}
          />
        </>
      )}

      {/* Стили для снега */}
      <style jsx>{`
        @keyframes snowfall {
          0% {
            transform: translateY(-20px) translateX(0);
            opacity: 0;
          }
          10%,
          90% {
            opacity: var(--opacity, 0.8);
          }
          100% {
            transform: translateY(100vh) translateX(calc(var(--drift, 0px)));
            opacity: 0;
          }
        }
        .snowflake {
          position: absolute;
          top: -20px;
          color: white;
          user-select: none;
          animation: snowfall linear infinite;
          --drift: ${Math.random() > 0.5 ? `${5 + Math.random() * 20}px` : `-${5 + Math.random() * 20}px`};
          --opacity: ${0.5 + Math.random() * 0.5};
        }
      `}</style>
    </div>
  );
}

export default SharePage;