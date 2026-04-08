import React from 'react';
import siteQrCodeImage from '../qrcode.png';
import qrCodeMax2Image from '../qrcode_max_2.png';

function SharePage() {
  const updatePoints = [
    'На сайте ggkit-timetable.vercel.app расписание теперь доступно и преподавателям, и студентам.',
    'Можно быстро открыть свою страницу и посмотреть актуальные пары в любое время.',
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
        padding: '1rem',
        textAlign: 'center',
        position: 'relative',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '1rem',
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
            padding: '1.1rem',
            boxShadow: '0 18px 45px rgba(36, 50, 74, 0.12)',
            backdropFilter: 'blur(10px)',
            flex: '1 1 320px',
            maxWidth: '300px',
          }}
        >
          <img
            src={qrCodeMax2Image}
            alt="QR Бот в Max"
            style={{
              width: '100%',
              maxWidth: '220px',
              height: 'auto',
              objectFit: 'contain',
              borderRadius: '0.75rem',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              background: '#fff',
              padding: '0.75rem',
            }}
          />
          <p
            style={{
              fontSize: '1.1rem',
              marginTop: '0.45rem',
              marginBottom: '0.2rem',
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
              fontSize: '0.84rem',
              lineHeight: 1.4,
            }}
          >
            Отсканируйте QR-код, чтобы быстро открыть бота и подключить расписание.
          </p>
        </div>

        <div
          style={{
            flex: '1 1 420px',
            maxWidth: '470px',
            background: 'linear-gradient(135deg, #1f3a5f 0%, #2f5b96 100%)',
            color: '#fff',
            borderRadius: '1.75rem',
            padding: '1rem',
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
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.03em',
              marginBottom: '0.55rem',
            }}
          >
            Новое обновление
          </div>

          <h2
            style={{
              margin: '0 0 0.5rem',
              fontSize: 'clamp(1.15rem, 1.8vw, 1.55rem)',
              lineHeight: 1.15,
            }}
          >
            Теперь на сайте можно смотреть расписание и студентам, и преподавателям
          </h2>

          <div
            style={{
              display: 'grid',
              gap: '0.45rem',
            }}
          >
            {updatePoints.map((point) => (
              <div
                key={point}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.65rem',
                  padding: '0.55rem 0.65rem',
                  borderRadius: '1rem',
                  background: 'rgba(255, 255, 255, 0.08)',
                }}
              >
                <div
                  style={{
                    width: '0.55rem',
                    height: '0.55rem',
                    borderRadius: '50%',
                    background: '#8ee3ff',
                    marginTop: '0.38rem',
                    flexShrink: 0,
                  }}
                />
                <p
                  style={{
                    margin: 0,
                    fontSize: '0.83rem',
                    lineHeight: 1.4,
                    color: '#f8fbff',
                  }}
                >
                  {point}
                </p>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: '0.65rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              padding: '0.55rem 0.65rem',
              borderRadius: '1rem',
              background: 'rgba(255, 255, 255, 0.12)',
            }}
          >
            <img
              src={siteQrCodeImage}
              alt="QR-код на сайт ggkit-timetable.vercel.app"
              style={{
                width: '68px',
                height: '68px',
                objectFit: 'contain',
                borderRadius: '0.7rem',
                background: '#fff',
                padding: '0.35rem',
                flexShrink: 0,
              }}
            />

            <div>
              <p
                style={{
                  margin: '0 0 0.15rem',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: '#f8fbff',
                }}
              >
                QR-код на сайт
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: '0.78rem',
                  lineHeight: 1.35,
                  color: 'rgba(255, 255, 255, 0.88)',
                }}
              >
                Откройте расписание на телефоне:
                <br />
                ggkit-timetable.vercel.app
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SharePage;
