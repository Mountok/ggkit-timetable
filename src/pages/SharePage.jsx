import React, { useState, useEffect } from 'react';
import qrCodeImage from '../qrcode.png';
import qrCodeMaxImage from '../qrcode_max.png';
import qrCodeMax2Image from '../qrcode_max_2.png';

function SharePage() {
  const [isStrangerThingsMode, setIsStrangerThingsMode] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Переключение тем каждые 20 секунд
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isStrangerThingsMode) {
        // Переход только с обычной темы на Stranger Things
        setIsTransitioning(true);
        setTimeout(() => {
          setIsStrangerThingsMode(true);
          setIsTransitioning(false);
        }, 3000); // Увеличил до 3 секунд для медленного появления трещин
      } else {
        // С Stranger Things на обычную - без перехода
        setIsStrangerThingsMode(false);
      }
    }, 20000); // 20 секунд

    return () => clearInterval(interval);
  }, [isStrangerThingsMode]);

  // Генерация дальнего пепла (мелкие частицы)
  const ashParticles = Array.from({ length: 300 }, (_, i) => {
    const size = 4 + Math.random() * 20;
    const duration = 6 + Math.random() * 25;
    const delay = Math.random() * 25;
    const x = Math.random() * 120 - 10; // немного за пределами экрана
    const windStrength = Math.random() * 40 - 20; // ветер влево/вправо
    const ashType = Math.floor(Math.random() * 4);
    const opacity = 0.15 + Math.random() * 0.4;

    return (
      <div
        key={i}
        className={`ash-particle ash-type-${ashType}`}
        style={{
          left: `${x}%`,
          fontSize: `${size}px`,
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
          opacity: opacity,
          '--wind-strength': `${windStrength}px`,
        }}
      >
        •
      </div>
    );
  });

  // Генерация ближнего пепла (квадратики)
  const largeAshParticles = Array.from({ length: 25 }, (_, i) => {
    const size = 8 + Math.random() * 18;
    const duration = 12 + Math.random() * 25;
    const delay = Math.random() * 40;
    const x = Math.random() * 120 - 10; // немного за пределами экрана
    const windStrength = Math.random() * 50 - 25; // ветер влево/вправо
    const opacity = 0.25 + Math.random() * 0.5;

    return (
      <div
        key={`large-${i}`}
        className="large-ash-particle foreground-ash"
        style={{
          left: `${x}%`,
          fontSize: `${size}px`,
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
          opacity: opacity,
          '--wind-strength': `${windStrength}px`,
          '--rotation-speed': `${Math.random() * 360}deg`,
        }}
      >
        ■
      </div>
    );
  });

  // Обычная тема (как было в начале)
  const renderNormalTheme = () => (
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

  // Stranger Things тема
  const renderStrangerThingsTheme = () => (
    <div
      className="stranger-things-border"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a0a0a 0%, #0d0404 100%)',
        padding: '2rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Пепел */}
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
        {ashParticles}
      </div>

      {/* Ближний пепел (большие квадратики) */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      >
        {largeAshParticles}
      </div>

      {/* Отсылка к Stranger Things - верхний правый угол */}
      <div
        style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          zIndex: 3,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            textAlign: 'right',
            fontFamily: 'Arial Black, Arial, sans-serif',
            fontSize: '2.5rem',
            fontWeight: 900,
            color: 'rgba(139, 0, 0, 0.08)',
            textShadow: '0 0 20px rgba(139, 0, 0, 0.05)',
            lineHeight: '0.9',
            letterSpacing: '2px',
            userSelect: 'none',
          }}
        >
          STRANGER<br />
          THINGS
        </div>
      </div>

      <h1
        className="flickering-title"
        style={{
          marginBottom: '2rem',
          color: '#ff6b6b',
          fontSize: '1.75rem',
          fontWeight: 700,
          zIndex: 2,
          position: 'relative',
          transform: 'rotate(180deg)',
          textShadow: '0 0 10px rgba(255, 107, 107, 0.5)',
          animationDelay: `${Math.random() * 3}s`,
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
        {/* Бот в Max */}
        <div style={{ textAlign: 'center' }}>
          <img
            src={qrCodeMaxImage}
            alt="QR Бот в Max"
            style={{
              width: '260px',
              height: '260px',
              objectFit: 'contain',
              borderRadius: '0.75rem',
              background: '#2a0000',
              padding: '1rem',
              transform: 'rotate(180deg)',
              filter: 'sepia(0.3) hue-rotate(330deg) saturate(1.5)',
            }}
          />
          <p style={{
            fontSize: "1.5rem",
            marginTop: '0.75rem',
            color: '#ff4444',
            fontWeight: 600,
            transform: 'rotate(180deg)',
            textShadow: '0 0 8px rgba(255, 68, 68, 0.7)'
          }}>
            Бот в Max
          </p>
        </div>
      </div>

      {/* CSS для пепла */}
      <style jsx>{`
        @keyframes ashfall {
          0% {
            transform: translateY(-20px) translateX(var(--wind-strength, 0px)) rotate(0deg) scale(1);
            opacity: 0;
          }
          5% {
            opacity: var(--opacity, 0.4);
          }
          15% {
            transform: translateY(20vh) translateX(var(--wind-strength, 0px)) rotate(45deg) scale(0.9);
            opacity: 0.4;
          }
          30% {
            transform: translateY(40vh) translateX(calc(var(--wind-strength, 0px) + 10px)) rotate(90deg) scale(0.8);
            opacity: 0.3;
          }
          50% {
            transform: translateY(60vh) translateX(calc(var(--wind-strength, 0px) + 20px)) rotate(135deg) scale(0.7);
            opacity: 0.25;
          }
          70% {
            transform: translateY(75vh) translateX(calc(var(--wind-strength, 0px) + 30px)) rotate(160deg) scale(0.6);
            opacity: 0.2;
          }
          90% {
            transform: translateY(90vh) translateX(calc(var(--wind-strength, 0px) + 40px)) rotate(175deg) scale(0.5);
            opacity: 0.1;
          }
          100% {
            transform: translateY(110vh) translateX(calc(var(--wind-strength, 0px) + 50px)) rotate(180deg) scale(0.3);
            opacity: 0;
          }
        }

        .ash-particle {
          position: absolute;
          top: -20px;
          user-select: none;
          animation: ashfall linear infinite;
          font-weight: bold;
        }

        /* Разные типы пепла */
        .ash-type-0 { color: #654321; } /* Темный пепел */
        .ash-type-1 { color: #8b4513; } /* Коричневый */
        .ash-type-2 { color: #a0522d; } /* Рыжий */
        .ash-type-3 {
          background: linear-gradient(45deg, #654321, #8b4513);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        } /* Градиентный пепел */

        /* Анимация для больших кусков пепла */
        @keyframes largeAshfall {
          0% {
            transform: translateY(-30px) translateX(var(--wind-strength, 0px)) rotate(var(--rotation-speed, 0deg)) scale(1.2);
            opacity: 0;
          }
          10% {
            opacity: var(--opacity, 0.5);
          }
          20% {
            transform: translateY(15vh) translateX(calc(var(--wind-strength, 0px) + 8px)) rotate(calc(var(--rotation-speed, 0deg) + 90deg)) scale(1.1);
            opacity: 0.5;
          }
          40% {
            transform: translateY(35vh) translateX(calc(var(--wind-strength, 0px) + 18px)) rotate(calc(var(--rotation-speed, 0deg) + 180deg)) scale(1);
            opacity: 0.4;
          }
          60% {
            transform: translateY(55vh) translateX(calc(var(--wind-strength, 0px) + 28px)) rotate(calc(var(--rotation-speed, 0deg) + 270deg)) scale(0.9);
            opacity: 0.35;
          }
          80% {
            transform: translateY(75vh) translateX(calc(var(--wind-strength, 0px) + 38px)) rotate(calc(var(--rotation-speed, 0deg) + 360deg)) scale(0.8);
            opacity: 0.25;
          }
          100% {
            transform: translateY(110vh) translateX(calc(var(--wind-strength, 0px) + 48px)) rotate(calc(var(--rotation-speed, 0deg) + 540deg)) scale(0.6);
            opacity: 0;
          }
        }

        .large-ash-particle {
          position: absolute;
          top: -30px;
          user-select: none;
          animation: largeAshfall linear infinite;
          font-weight: bold;
          background: linear-gradient(135deg, #666666, #333333, #000000);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 3px rgba(0, 0, 0, 0.5));
          z-index: 1;
        }

        .foreground-ash {
          z-index: 5 !important;
        }

        /* Эффекты по краям */
        .stranger-things-border::before,
        .stranger-things-border::after {
          content: '';
          position: fixed;
          top: 0;
          bottom: 0;
          width: 50px;
          background: linear-gradient(90deg,
            rgba(139, 0, 0, 0.8) 0%,
            rgba(139, 0, 0, 0.4) 50%,
            transparent 100%);
          z-index: 5;
          pointer-events: none;
        }

        .stranger-things-border::before {
          left: 0;
        }

        .stranger-things-border::after {
          right: 0;
          transform: scaleX(-1);
        }

        .stranger-things-border {
          position: relative;
        }

        .stranger-things-border::before,
        .stranger-things-border::after {
          animation: flicker 3s infinite alternate;
        }

        @keyframes flicker {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 0.4; }
        }

        /* Мигание заголовка как лампы */
        @keyframes titleFlicker {
          0%, 100% {
            opacity: 1;
            text-shadow: 0 0 10px rgba(255, 107, 107, 0.5), 0 0 20px rgba(255, 107, 107, 0.3);
          }
          2%, 4%, 6%, 8%, 10%, 12%, 14%, 16%, 18% {
            opacity: 0.3;
            text-shadow: 0 0 2px rgba(255, 107, 107, 0.2);
          }
          3%, 5%, 7%, 9%, 11%, 13%, 15%, 17% {
            opacity: 0.8;
            text-shadow: 0 0 5px rgba(255, 107, 107, 0.4);
          }
          50% {
            opacity: 1;
            text-shadow: 0 0 15px rgba(255, 107, 107, 0.6), 0 0 30px rgba(255, 107, 107, 0.4);
          }
        }

        .flickering-title {
          animation: titleFlicker 4s infinite;
        }
      `}</style>
    </div>
  );

  // Условный рендеринг в зависимости от темы
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Эффект перехода - мощные трещины */}
      {isTransitioning && (
        <div className="transition-overlay">
          <svg className="cracks-svg" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
            {/* Трещина 1 - основная вертикальная */}
            <path
              d="M950,0 Q945,150 960,300 Q955,450 970,600 Q965,750 980,900 Q975,1050 990,1080"
              className="crack-path crack-1"
              stroke="rgba(139, 0, 0, 0.9)"
              strokeWidth="8"
              fill="none"
            />
            {/* Ветвление от трещины 1 */}
            <path
              d="M960,300 Q1000,320 1050,280 Q1100,300 1080,350"
              className="crack-path crack-1-branch"
              stroke="rgba(139, 0, 0, 0.7)"
              strokeWidth="6"
              fill="none"
            />

            {/* Трещина 2 - диагональная слева */}
            <path
              d="M200,100 Q250,200 300,250 Q350,300 250,400 Q200,500 300,600 Q350,700 250,800 Q200,900 300,1000"
              className="crack-path crack-2"
              stroke="rgba(139, 0, 0, 0.9)"
              strokeWidth="10"
              fill="none"
            />

            {/* Трещина 3 - зигзаг справа */}
            <path
              d="M1600,200 Q1550,300 1600,400 Q1550,500 1620,600 Q1570,700 1650,800 Q1600,900 1670,1000"
              className="crack-path crack-3"
              stroke="rgba(139, 0, 0, 0.8)"
              strokeWidth="8"
              fill="none"
            />

            {/* Трещина 4 - горизонтальная с изгибом */}
            <path
              d="M100,600 Q200,580 400,620 Q600,580 800,600 Q1000,620 1200,580 Q1400,600 1600,620 Q1700,600 1800,580"
              className="crack-path crack-4"
              stroke="rgba(139, 0, 0, 0.9)"
              strokeWidth="12"
              fill="none"
            />

            {/* Трещина 5 - спиралевидная */}
            <path
              d="M800,300 Q850,350 800,400 Q750,450 800,500 Q850,550 800,600 Q750,650 800,700 Q850,750 800,800"
              className="crack-path crack-5"
              stroke="rgba(139, 0, 0, 0.8)"
              strokeWidth="8"
              fill="none"
            />

            {/* Трещина 6 - V-образная */}
            <path
              d="M500,400 Q550,450 600,400 Q650,350 700,400 Q750,450 800,400"
              className="crack-path crack-6"
              stroke="rgba(139, 0, 0, 0.9)"
              strokeWidth="8"
              fill="none"
            />

            {/* Трещина 7 - хаотичная */}
            <path
              d="M1300,100 Q1350,150 1300,200 Q1250,250 1350,300 Q1400,350 1300,400 Q1250,450 1400,500 Q1450,550 1300,600"
              className="crack-path crack-7"
              stroke="rgba(139, 0, 0, 0.8)"
              strokeWidth="6"
              fill="none"
            />

            {/* Маленькие трещинки для атмосферы */}
            <path d="M300,200 Q320,220 300,240" className="crack-path small-crack" stroke="rgba(139, 0, 0, 0.6)" strokeWidth="4" fill="none" />
            <path d="M1500,800 Q1520,820 1500,840" className="crack-path small-crack" stroke="rgba(139, 0, 0, 0.6)" strokeWidth="4" fill="none" />
            <path d="M700,900 Q720,920 700,940" className="crack-path small-crack" stroke="rgba(139, 0, 0, 0.6)" strokeWidth="4" fill="none" />
            <path d="M1200,300 Q1220,320 1200,340" className="crack-path small-crack" stroke="rgba(139, 0, 0, 0.6)" strokeWidth="4" fill="none" />

            {/* Большая красная область для покрытия экрана */}
            <rect
              x="0"
              y="0"
              width="1920"
              height="1080"
              className="screen-fill"
              fill="rgba(139, 0, 0, 0.3)"
            />
          </svg>
        </div>
      )}

      {/* Основной контент */}
      {isStrangerThingsMode ? renderStrangerThingsTheme() : renderNormalTheme()}

      {/* CSS для переходов */}
      <style jsx>{`
        .transition-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 1000;
          pointer-events: none;
          animation: transitionFade 3s ease-out forwards;
        }

        @keyframes transitionFade {
          0% { opacity: 0; }
          5% { opacity: 1; }
          95% { opacity: 1; }
          100% { opacity: 0; }
        }

        .cracks-svg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 10;
        }

        .crack-path {
          stroke-linecap: square;
          stroke-linejoin: miter;
          fill: none;
          opacity: 0;
          animation: drawCrack 3s ease-out forwards;
        }

        .screen-fill {
          opacity: 0;
          animation: fillScreen 3s ease-out forwards;
          animation-delay: 1.5s;
        }

        .crack-1 {
          animation-delay: 0.1s;
        }

        .crack-2 {
          animation-delay: 0.3s;
        }

        .crack-3 {
          animation-delay: 0.6s;
        }

        .crack-4 {
          animation-delay: 0.9s;
        }

        .crack-5 {
          animation-delay: 1.2s;
        }

        .crack-6 {
          animation-delay: 1.5s;
        }

        .crack-7 {
          animation-delay: 1.8s;
        }

        .small-crack {
          animation-delay: 2.1s;
        }

        .crack-1-branch {
          animation-delay: 0.4s;
        }

        @keyframes drawCrack {
          0% {
            opacity: 0;
            stroke-dasharray: 0, 1000;
            stroke-dashoffset: 0;
          }
          10% {
            opacity: 0.8;
          }
          80% {
            opacity: 0.9;
            stroke-dasharray: 1000, 0;
            stroke-dashoffset: 0;
          }
          100% {
            opacity: 0.3;
            stroke-dasharray: 1000, 0;
            stroke-dashoffset: 0;
          }
        }

        @keyframes fillScreen {
          0% {
            opacity: 0;
          }
          30% {
            opacity: 0.1;
          }
          70% {
            opacity: 0.3;
          }
          100% {
            opacity: 0.4;
          }
        }
      `}</style>
    </div>
  );
}

export default SharePage;