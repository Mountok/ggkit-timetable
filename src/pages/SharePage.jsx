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

  // Инициализация снега и свечения
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Цвета для свечения (красный, желтый, синий, оранжевый, фиолетовый, зеленый)
    const glowColors = [
      '#ff1744', // красный
      '#ff8f00', // оранжевый  
      '#ffea00', // желтый
      '#00e676', // зеленый
      '#00b0ff', // синий
      '#9c27b0'  // фиолетовый
    ];

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

    let glowIndex = 0;
    const glowWidth = 120;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // === СВЕЧЕНИЕ ПО КРАЯМ ===
      const currentColor = glowColors[glowIndex % glowColors.length];
      
      // Верхний край
      const gradientTop = ctx.createLinearGradient(0, 0, 0, glowWidth);
      gradientTop.addColorStop(0, 'transparent');
      gradientTop.addColorStop(0.3, currentColor + '44');
      gradientTop.addColorStop(0.7, currentColor + '88');
      gradientTop.addColorStop(1, currentColor + '22');
      
      ctx.fillStyle = gradientTop;
      ctx.fillRect(0, 0, canvas.width, glowWidth);
      
      // Нижний край
      const gradientBottom = ctx.createLinearGradient(0, canvas.height - glowWidth, 0, canvas.height);
      gradientBottom.addColorStop(0, currentColor + '22');
      gradientBottom.addColorStop(0.3, currentColor + '88');
      gradientBottom.addColorStop(0.7, currentColor + '44');
      gradientBottom.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradientBottom;
      ctx.fillRect(0, canvas.height - glowWidth, canvas.width, glowWidth);
      
      // Левый край
      const gradientLeft = ctx.createLinearGradient(0, 0, glowWidth, 0);
      gradientLeft.addColorStop(0, 'transparent');
      gradientLeft.addColorStop(0.3, currentColor + '44');
      gradientLeft.addColorStop(0.7, currentColor + '88');
      gradientLeft.addColorStop(1, currentColor + '22');
      
      ctx.fillStyle = gradientLeft;
      ctx.fillRect(0, 0, glowWidth, canvas.height);
      
      // Правый край
      const gradientRight = ctx.createLinearGradient(canvas.width - glowWidth, 0, canvas.width, 0);
      gradientRight.addColorStop(0, currentColor + '22');
      gradientRight.addColorStop(0.3, currentColor + '88');
      gradientRight.addColorStop(0.7, currentColor + '44');
      gradientRight.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradientRight;
      ctx.fillRect(canvas.width - glowWidth, 0, glowWidth, canvas.height);

      // Переключение цвета каждые 60 кадров (~1 сек)
      glowIndex++;
      if (glowIndex % 60 === 0) {
        glowIndex++; // Плавный переход
      }

      // === СНЕГ ===
      snowflakes.current.forEach((flake) => {
        flake.y += flake.speed;
        flake.x += Math.sin(flake.y * flake.sway) * 2;
        
        if (flake.y > canvas.height) {
          flake.y = -flake.size;
          flake.x = Math.random() * canvas.width;
        }

        ctx.save();
        ctx.globalAlpha = flake.opacity;
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.restore();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    createSnowflakes();
    animate();

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
