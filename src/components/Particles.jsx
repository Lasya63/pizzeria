import { useEffect, useRef } from 'react';

/**
 * GoldenSparks — visible golden particles that rise continuously
 * from the bottom of the screen upward, outside the pizza boundary.
 */
export default function Particles() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    const SPARK_COUNT = 45;

    function createSpark(w, h, randomY = false) {
      // Spawn across the full width, biased toward the sides (outside the pizza boundary)
      const side = Math.random();
      let spawnX;
      if (side < 0.4) {
        // Left side
        spawnX = Math.random() * w * 0.3;
      } else if (side > 0.6) {
        // Right side
        spawnX = w * 0.7 + Math.random() * w * 0.3;
      } else {
        // Center area (some sparks here too)
        spawnX = w * 0.2 + Math.random() * w * 0.6;
      }

      return {
        x: spawnX,
        y: randomY ? Math.random() * h : h + Math.random() * 40,
        r: Math.random() * 0.8 + 0.3,
        // Warm golden hues
        hue: 38 + Math.random() * 22,
        sat: 90 + Math.random() * 10,
        light: 60 + Math.random() * 20,
        alpha: Math.random() * 0.7 + 0.3,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -(Math.random() * 0.8 + 0.3),
        flicker: Math.random() * Math.PI * 2,
      };
    }

    // Initialize with sparks spread across the screen
    const sparks = Array.from({ length: SPARK_COUNT }, () => createSpark(W, H, true));

    function draw() {
      ctx.clearRect(0, 0, W, H);

      for (const s of sparks) {
        // Flicker effect
        const flickerAlpha = Math.sin(s.flicker) * 0.2;
        const currentAlpha = Math.max(0.05, s.alpha + flickerAlpha);

        // Glow effect
        const glowR = s.r * 3;
        const gradient = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, glowR);
        gradient.addColorStop(0, `hsla(${s.hue}, ${s.sat}%, ${s.light}%, ${currentAlpha})`);
        gradient.addColorStop(0.3, `hsla(${s.hue}, ${s.sat}%, ${s.light}%, ${currentAlpha * 0.5})`);
        gradient.addColorStop(1, `hsla(${s.hue}, ${s.sat}%, ${s.light}%, 0)`);

        ctx.beginPath();
        ctx.arc(s.x, s.y, glowR, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Bright core
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${s.hue}, 100%, 85%, ${currentAlpha * 0.95})`;
        ctx.fill();

        // Update position — always moving upward
        s.x += s.vx;
        s.y += s.vy;
        s.flicker += 0.06 + Math.random() * 0.04;

        // Gentle horizontal drift
        s.vx += (Math.random() - 0.5) * 0.015;
        s.vx = Math.max(-0.5, Math.min(0.5, s.vx));

        // Reset when spark goes above the screen — respawn at bottom
        if (s.y < -20) {
          Object.assign(s, createSpark(W, H, false));
        }
      }

      animRef.current = requestAnimationFrame(draw);
    }

    draw();

    const onResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 5,
      }}
    />
  );
}
