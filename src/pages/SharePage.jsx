import React, { useEffect, useState, useRef } from 'react';
import qrCodeImage from '../qrcode.png';

function SharePage() {
  const [loading, setLoading] = useState(true);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef();

  // Параметры снежинок
  const snowflakes = useRef([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 12000);
    return () => clearTimeout(timer);
  }, []);

  // Инициализация снега
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Создаем снежинки
    const createSnowflakes = () => {
      snowflakes.current = [];
      for (let i = 0; i < 80; i++) {
        snowflakes.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height - canvas.height,
          size: Math.random() * 4 + 2,
          speed: Math.random() * 1 + 0.5,
          opacity: Math.random() * 0.5 + 0.3,
          sway: Math.random() * 0.02 + 0.01
        });
      }
    };

    createSnowflakes();

    const animateSnow = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      snowflakes.current.forEach((flake, index) => {
        // Движение вниз и покачивание
        flake.y += flake.speed;
        flake.x += Math.sin(flake.y * flake.sway) * 2;
        
        // Перезапуск сверху
        if (flake.y > canvas.height) {
          flake.y = -flake.size;
          flake.x = Math.random() * canvas.width;
        }

        // Рисуем снежинку
        ctx.save();
        ctx.globalAlpha = flake.opacity;
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.restore();
      });

      animationRef.current = requestAnimationFrame(animateSnow);
    };

    animateSnow();

    // Обработка изменения размера окна
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createSnowflakes();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />
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
        zIndex: 2
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
              fontWeight: 700,
              zIndex: 3,
              position: 'relative'
            }}>Онлайн Расписание</h1>
            <img 
              src={qrCodeImage} 
              alt="QR Code" 
              style={{
                width: '300px',
                height: '300px',
                objectFit: 'contain',
                borderRadius: '0.75rem',
                boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                background: '#fff',
                padding: '1rem',
                zIndex: 3,
                position: 'relative'
              }} 
            />
          </>
        )}
      </div>
    </>
  );
}

export default SharePage;