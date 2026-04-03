import React from 'react';
import qrCodeMax2Image from '../qrcode_max_2.png';

function SharePage() {
  const updatePoints = [
    'Студенты могут добавить бота прямо в группу в MAX.',
    'Бот автоматически присылает актуальное расписание.',
    'Не нужно каждый раз открывать сайт и искать нужную пару.',
  ];

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
          marginBottom: '2.5rem',
          color: '#24324a',
          fontSize: 'clamp(1.9rem, 3vw, 2.8rem)',
          fontWeight: 700,
          zIndex: 2,
          position: 'relative',
        }}
      >
        Онлайн расписание в MAX
      </h1>

      <div
        style={{
          display: 'flex',
          gap: '2rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'stretch',
          width: '100%',
          maxWidth: '1080px',
          zIndex: 2,
          position: 'relative',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.85)',
            borderRadius: '1.5rem',
            padding: '1.75rem',
            boxShadow: '0 18px 45px rgba(36, 50, 74, 0.12)',
            backdropFilter: 'blur(10px)',
            flex: '1 1 320px',
            maxWidth: '360px',
          }}
        >
          <img
            src={qrCodeMax2Image}
            alt="QR Бот в Max"
            style={{
              width: '100%',
              maxWidth: '260px',
              height: 'auto',
              objectFit: 'contain',
              borderRadius: '0.75rem',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              background: '#fff',
              padding: '1rem',
            }}
          />
          <p
            style={{
              fontSize: '1.5rem',
              marginTop: '0.75rem',
              marginBottom: '0.4rem',
              color: '#24324a',
              fontWeight: 700,
            }}
          >
            Бот в Max
          </p>
          <p
            style={{
              margin: 0,
              color: '#5b6474',
              fontSize: '1rem',
              lineHeight: 1.5,
            }}
          >
            Отсканируйте QR-код, чтобы быстро открыть бота и подключить расписание.
          </p>
        </div>

        <div
          style={{
            flex: '1 1 420px',
            maxWidth: '560px',
            background: 'linear-gradient(135deg, #1f3a5f 0%, #2f5b96 100%)',
            color: '#fff',
            borderRadius: '1.75rem',
            padding: '2rem',
            boxShadow: '0 22px 55px rgba(31, 58, 95, 0.22)',
            textAlign: 'left',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.45rem 0.85rem',
              borderRadius: '999px',
              background: 'rgba(255, 255, 255, 0.16)',
              fontSize: '0.9rem',
              fontWeight: 700,
              letterSpacing: '0.03em',
              marginBottom: '1rem',
            }}
          >
            Большое обновление
          </div>

          <h2
            style={{
              margin: '0 0 1rem',
              fontSize: 'clamp(1.6rem, 2.6vw, 2.3rem)',
              lineHeight: 1.15,
            }}
          >
            Теперь бота можно добавить в группу в MAX и получать расписание автоматически
          </h2>

          <p
            style={{
              margin: '0 0 1.5rem',
              fontSize: '1.05rem',
              lineHeight: 1.7,
              color: 'rgba(255, 255, 255, 0.88)',
            }}
          >
            Мы обновили сервис: бот помогает следить за занятиями прямо внутри группового чата,
            чтобы важные пары и изменения приходили без лишних действий.
          </p>

          <div
            style={{
              display: 'grid',
              gap: '0.9rem',
            }}
          >
            {updatePoints.map((point) => (
              <div
                key={point}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.85rem',
                  padding: '0.95rem 1rem',
                  borderRadius: '1rem',
                  background: 'rgba(255, 255, 255, 0.08)',
                }}
              >
                <div
                  style={{
                    width: '0.7rem',
                    height: '0.7rem',
                    borderRadius: '50%',
                    background: '#8ee3ff',
                    marginTop: '0.45rem',
                    flexShrink: 0,
                  }}
                />
                <p
                  style={{
                    margin: 0,
                    fontSize: '1rem',
                    lineHeight: 1.6,
                    color: '#f8fbff',
                  }}
                >
                  {point}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SharePage;
