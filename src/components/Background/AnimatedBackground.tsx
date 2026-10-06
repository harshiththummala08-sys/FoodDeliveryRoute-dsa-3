import React, { useEffect, useRef } from 'react';

export const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Subtle drifting nodes
    const particleCount = 42;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      radius: Math.random() * 1.6 + 0.6,
      alpha: Math.random() * 0.35 + 0.15,
      pulseSpeed: Math.random() * 0.02 + 0.01,
      pulsePhase: Math.random() * Math.PI * 2
    }));

    // Waypoint transit lines (simulate faint moving logistics routes)
    const routePackets = [
      { progress: 0.1, speed: 0.0018, path: [{ x: 80, y: 150 }, { x: 300, y: 400 }, { x: 600, y: 320 }] },
      { progress: 0.5, speed: 0.0012, path: [{ x: 400, y: 100 }, { x: 750, y: 250 }, { x: 950, y: 600 }] },
      { progress: 0.8, speed: 0.0015, path: [{ x: 200, y: 600 }, { x: 500, y: 700 }, { x: 850, y: 550 }] },
    ];

    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.015;

      // 1. Soft radial ambient light in corners (very dark & subtle)
      const grad1 = ctx.createRadialGradient(width * 0.15, height * 0.2, 50, width * 0.15, height * 0.2, 550);
      grad1.addColorStop(0, 'rgba(6, 182, 212, 0.035)');
      grad1.addColorStop(1, 'rgba(7, 10, 15, 0)');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      const grad2 = ctx.createRadialGradient(width * 0.85, height * 0.75, 50, width * 0.85, height * 0.75, 600);
      grad2.addColorStop(0, 'rgba(59, 130, 246, 0.03)');
      grad2.addColorStop(1, 'rgba(7, 10, 15, 0)');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // 2. Faint animated grid
      const gridSize = 64;
      const gridOpacity = 0.018 + Math.sin(time * 0.8) * 0.005;
      ctx.strokeStyle = `rgba(255, 255, 255, ${gridOpacity})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // 3. Faint moving transit route lines
      routePackets.forEach(pkt => {
        pkt.progress = (pkt.progress + pkt.speed) % 1;
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.04)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        pkt.path.forEach((pt, idx) => {
          if (idx === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        ctx.stroke();
      });

      // 4. Subtle drifting glowing dots and particle connections
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const currentAlpha = p.alpha + Math.sin(time + p.pulsePhase) * 0.1;
        ctx.fillStyle = `rgba(6, 182, 212, ${Math.max(0.05, currentAlpha)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.strokeStyle = `rgba(6, 182, 212, ${0.06 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-60"
    />
  );
};
