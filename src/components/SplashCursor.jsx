import { useEffect, useRef, useCallback } from 'react';
import './SplashCursor.css';

/**
 * SplashCursor 光标飞溅特效组件
 * 基于 Canvas 的彩虹色光标拖尾效果
 * 轻量级版本，使用 requestAnimationFrame 实现流畅动画
 */
const SplashCursor = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: -100, y: -100 });

  // 粒子类
  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 8 + 4;
      this.life = 1;
      this.decay = Math.random() * 0.02 + 0.015;
      this.vx = (Math.random() - 0.5) * 2;
      this.vy = (Math.random() - 0.5) * 2;
      // 彩虹色相
      this.hue = (Date.now() * 0.05 + Math.random() * 60) % 360;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life -= this.decay;
      this.size *= 0.98;
    }

    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.life * 0.6);
      ctx.fillStyle = `hsla(${this.hue}, 80%, 65%, ${this.life})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, Math.max(0.1, this.size), 0, Math.PI * 2);
      ctx.fill();

      // 发光效果
      ctx.globalAlpha = Math.max(0, this.life * 0.2);
      ctx.shadowBlur = 20;
      ctx.shadowColor = `hsla(${this.hue}, 80%, 65%, ${this.life})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, Math.max(0.1, this.size * 0.5), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  const handleMouseMove = useCallback((e) => {
    mouseRef.current = { x: e.clientX, y: e.clientY };

    // 每次鼠标移动生成新粒子
    for (let i = 0; i < 2; i++) {
      particlesRef.current.push(new Particle(e.clientX, e.clientY));
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // 设置画布尺寸
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // 监听鼠标移动
    window.addEventListener('mousemove', handleMouseMove);

    // 动画循环
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 更新和绘制粒子
      particlesRef.current = particlesRef.current.filter((p) => p.life > 0);
      particlesRef.current.forEach((p) => {
        p.update();
        p.draw(ctx);
      });

      // 限制粒子数量，避免性能问题
      if (particlesRef.current.length > 150) {
        particlesRef.current = particlesRef.current.slice(-150);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [handleMouseMove]);

  return <canvas ref={canvasRef} className="splash-cursor-canvas" />;
};

export default SplashCursor;
