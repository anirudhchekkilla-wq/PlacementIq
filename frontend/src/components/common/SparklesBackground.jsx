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

    // Color palettes tuned for dark & light mode
    const darkPalette = [
      '#a855f7', // purple-500
      '#c084fc', // purple-400
      '#818cf8', // indigo-400
      '#38bdf8', // sky-400
      '#fbbf24', // amber-400
      '#ffffff', // bright white
    ];

    const lightPalette = [
      '#7c3aed', // violet-600
      '#8b5cf6', // purple-500
      '#6366f1', // indigo-500
      '#0ea5e9', // sky-500
      '#f59e0b', // amber-500
      '#ec4899', // pink-500
    ];

    // Particle pool
    const particleCount = 65;
    const particles = [];

    const createParticle = (initialY) => {
      const types = ['cross-star', 'diamond', 'glow-dot'];
      return {
        x: Math.random() * width,
        y: initialY !== undefined ? initialY : Math.random() * height,
        size: Math.random() * 2.8 + 1.2,
        baseSize: Math.random() * 2.8 + 1.2,
        type: types[Math.floor(Math.random() * types.length)],
        // Slow gentle upward and sideways drifting motion
        vx: (Math.random() - 0.5) * 0.25,
        vy: -(Math.random() * 0.35 + 0.15),
        colorIndex: Math.floor(Math.random() * 6),
        // Sparkling phase
        phase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.03 + 0.015,
        rotation: Math.random() * Math.PI,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
      };
    };

    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle());
    }

    // Helper: draw a 4-point sparkling star
    const drawStar = (cx, cy, spikes, outerRadius, innerRadius, rotation, color, alpha) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation);
      ctx.beginPath();

      const step = Math.PI / spikes;
      let rot = (Math.PI / 2) * 3;

      ctx.moveTo(0, -outerRadius);
      for (let i = 0; i < spikes; i++) {
        // Curve to inner radius
        let x = Math.cos(rot) * outerRadius;
        let y = Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = Math.cos(rot) * innerRadius;
        y = Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(0, -outerRadius);
      ctx.closePath();

      ctx.fillStyle = color;
      ctx.globalAlpha = alpha;
      ctx.shadowColor = color;
      ctx.shadowBlur = outerRadius * 2.5;
      ctx.fill();
      ctx.restore();
    };

    // Helper: draw diamond sparkle
    const drawDiamond = (cx, cy, size, rotation, color, alpha) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation);
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.lineTo(size * 0.6, 0);
      ctx.lineTo(0, size);
      ctx.lineTo(-size * 0.6, 0);
      ctx.closePath();

      ctx.fillStyle = color;
      ctx.globalAlpha = alpha;
      ctx.shadowColor = color;
      ctx.shadowBlur = size * 2;
      ctx.fill();
      ctx.restore();
    };

    // Helper: draw soft glowing circular dot
    const drawGlowDot = (cx, cy, size, color, alpha) => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, size, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.globalAlpha = alpha;
      ctx.shadowColor = color;
      ctx.shadowBlur = size * 3;
      ctx.fill();
      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const palette = isDark ? darkPalette : lightPalette;
      const baseAlpha = isDark ? 0.85 : 0.65;

      particles.forEach((p) => {
        // Update sparkle motion (slow drifting)
        p.x += p.vx;
        p.y += p.vy;
        p.phase += p.twinkleSpeed;
        p.rotation += p.rotationSpeed;

        // Twinkle effect (sinusoidal pulse)
        const pulse = (Math.sin(p.phase) + 1) / 2; // 0 to 1
        const currentAlpha = (pulse * 0.65 + 0.25) * baseAlpha;
        const currentSize = p.baseSize * (pulse * 0.5 + 0.75);

        // Boundary wrap-around
        if (p.y < -30) {
          p.y = height + 20;
          p.x = Math.random() * width;
        }
        if (p.x < -30) p.x = width + 20;
        if (p.x > width + 30) p.x = -20;

        const color = palette[p.colorIndex % palette.length];

        if (p.type === 'cross-star') {
          drawStar(
            p.x,
            p.y,
            4,
            currentSize * 2.2,
            currentSize * 0.5,
            p.rotation,
            color,
            currentAlpha
          );
        } else if (p.type === 'diamond') {
          drawDiamond(p.x, p.y, currentSize * 1.8, p.rotation, color, currentAlpha);
        } else {
          drawGlowDot(p.x, p.y, currentSize, color, currentAlpha);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1] transition-opacity duration-700"
      aria-hidden="true"
    />
  );
};

export default SparklesBackground;
