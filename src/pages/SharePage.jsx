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

  // Генерируем "снежинки" для анимации
  const generateSnowflakes = () => {
    const flakes = [];
    for (let i = 0; i < 100; i++) {
      flakes.push(
        <div
          key={i}
          className="snowflake"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${5 + Math.random() * 10}s`,
            fontSize: `${8 + Math.random() * 12}px`,
          }}
        >
          ❄
        </div>
      );
    }
    return flakes;
  };

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
          : 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)', // темнее после загрузки
        padding: '2rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Гирлянда (сверху, по центру) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '40px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 100,
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1000 40"
          preserveAspectRatio="none"
          style={{ pointerEvents: 'none' }}
        >
          {/* Верёвка гирлянды */}
          <line
            x1="0"
            y1="20"
            x2="1000"
            y2="20"
            stroke="#94a3b8"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
          {/* Лампочки */}
          {[...Array(15)].map((_, i) => {
            const x = 50 + i * 70;
            return (
              <circle
                key={i}
                cx={x}
                cy="20"
                r="6"
                fill="#fff"
                style={{
                  filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.8))',
                  animation: `twinkle ${2 + Math.random() * 3}s infinite alternate`,
                }}
              />
            );
          })}
        </svg>
      </div>

      {/* Снег */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      >
        {generateSnowflakes()}
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
              color: '#e2e8f0', // светлый текст на тёмном фоне
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

      {/* Глобальные стили для снега и гирлянды (можно вынести в CSS-файл, но для простоты — инлайн через <style>) */}
      <style jsx>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) translateX(${Math.random() > 0.5 ? '10px' : '-10px'});
          }
        }
        @keyframes twinkle {
          0% {
            opacity: 0.3;
            filter: drop-shadow(0 0 2px rgba(255,255,255,0.3));
          }
          100% {
            opacity: 1;
            filter: drop-shadow(0 0 8px rgba(255,200,100,0.8));
          }
        }
        .snowflake {
          position: absolute;
          top: -20px;
          color: rgba(255, 255, 255, 0.8);
          user-select: none;
          animation: fall linear forwards;
          opacity: 0.7;
          text-shadow: 0 0 5px rgba(255,255,255,0.6);
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}

export default SharePage;