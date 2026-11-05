import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

const SparklesBackground = () => {
  const canvasRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Neon futuristic color palette
    const darkPalette = [
      '#00E5FF', // Cyan
      '#5865F2', // Electric Blue
      '#A855F7', // Neon Purple
      '#C084FC', // Soft Purple
      '#38BDF8', // Sky Blue
      '#FFFFFF', // Starlight
    ];

    const lightPalette = [
      '#5865F2', // Electric Blue
      '#7C3AED', // Violet
      '#8B5CF6', // Purple
      '#0284C7', // Sky
      '#EC4899', // Pink
      '#F59E0B', // Amber
    ];

    // Particle pool
    const particleCount = 55;
    const particles = [];

    const createParticle = (initialY) => {
      const types = ['cross-star', 'diamond', 'glow-dot'];
      return {
        x: Math.random() * width,
        y: initialY !== undefined ? initialY : Math.random() * height,
        size: Math.random() * 2.5 + 1.2,
        baseSize: Math.random() * 2.5 + 1.2,
        type: types[Math.floor(Math.random() * types.length)],
        vx: (Math.random() - 0.5) * 0.2,
        vy: -(Math.random() * 0.3 + 0.1),
        colorIndex: Math.floor(Math.random() * 6),
        phase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.025 + 0.012,
        rotation: Math.random() * Math.PI,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
      };
    };

    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle());
    }

    const drawParticle = (p, color, opacity) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = opacity;
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = p.size * 3;

      if (p.type === 'cross-star') {
        const s = p.size;
        ctx.beginPath();
        ctx.moveTo(0, -s * 2);
        ctx.lineTo(s * 0.3, -s * 0.3);
        ctx.lineTo(s * 2, 0);
        ctx.lineTo(s * 0.3, s * 0.3);
        ctx.lineTo(0, s * 2);
        ctx.lineTo(-s * 0.3, s * 0.3);
        ctx.lineTo(-s * 2, 0);
        ctx.lineTo(-s * 0.3, -s * 0.3);
        ctx.closePath();
        ctx.fill();
      } else if (p.type === 'diamond') {
        const s = p.size * 1.3;
        ctx.beginPath();
        ctx.moveTo(0, -s);
        ctx.lineTo(s * 0.8, 0);
        ctx.lineTo(0, s);
        ctx.lineTo(-s * 0.8, 0);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const palette = isDark ? darkPalette : lightPalette;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.phase += p.twinkleSpeed;

        const twinkle = Math.sin(p.phase);
        const opacity = Math.max(0.15, Math.min(0.85, (twinkle + 1) / 2));
        p.size = p.baseSize * (0.8 + 0.3 * twinkle);

        if (p.y < -20) {
          particles[i] = createParticle(height + 10);
        }
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;

        drawParticle(p, palette[p.colorIndex], opacity);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden transition-colors duration-500"
      style={{
        backgroundColor: isDark ? '#080B16' : '#F8FAFC',
      }}
      aria-hidden="true"
    >
      {/* Animated Drifting Gradient Orbs */}
      <div
        className="absolute rounded-full filter blur-[120px] will-change-transform pointer-events-none opacity-40 dark:opacity-50"
        style={{
          width: '550px',
          height: '550px',
          background: 'radial-gradient(circle, rgba(88, 101, 242, 0.45) 0%, rgba(168, 85, 247, 0.25) 60%, transparent 100%)',
          top: '-150px',
          left: '-100px',
          animation: 'driftOrb1 20s ease-in-out infinite alternate',
        }}
      />

      <div
        className="absolute rounded-full filter blur-[130px] will-change-transform pointer-events-none opacity-35 dark:opacity-45"
        style={{
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(0, 229, 255, 0.4) 0%, rgba(88, 101, 242, 0.25) 65%, transparent 100%)',
          bottom: '5%',
          right: '-150px',
          animation: 'driftOrb2 24s ease-in-out infinite alternate',
        }}
      />

      <div
        className="absolute rounded-full filter blur-[110px] will-change-transform pointer-events-none opacity-30 dark:opacity-40"
        style={{
          width: '450px',
          height: '450px',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.35) 0%, rgba(0, 229, 255, 0.15) 70%, transparent 100%)',
          top: '35%',
          left: '30%',
          animation: 'driftOrb3 28s ease-in-out infinite alternate',
        }}
      />

      {/* Futuristic Cyber Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-60 dark:opacity-80"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(88, 101, 242, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(88, 101, 242, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.85) 0%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.85) 0%, transparent 80%)',
        }}
      />

      {/* Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* CSS Keyframe Injections for Orbs */}
      <style>{`
        @keyframes driftOrb1 {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(100px, 80px) scale(1.12); }
          100% { transform: translate(50px, 130px) scale(0.95); }
        }
        @keyframes driftOrb2 {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-90px, -70px) scale(1.15); }
          100% { transform: translate(-30px, -110px) scale(0.92); }
        }
        @keyframes driftOrb3 {
          0% { transform: translate(0, 0) scale(0.95); }
          50% { transform: translate(-70px, 80px) scale(1.1); }
          100% { transform: translate(60px, -40px) scale(1.02); }
        }
      `}</style>
    </div>
  );
};

export default SparklesBackground;
