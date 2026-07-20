import { useEffect, useRef } from 'react';
import './Aurora.css';

/**
 * Aurora 极光背景组件
 * 基于 Canvas 的极光/北极光背景效果
 * 使用 requestAnimationFrame 实现流畅的渐变动画
 */
const Aurora = ({
  colors = ['#00ff87', '#60efff', '#a855f7', '#06b6d4', '#7c3aed'],
  speed = 0.5,
  blur = 80,
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const timeRef = useRef(0);

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

    // 解析十六进制颜色为 RGB
    const hexToRgb = (hex) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return { r, g, b };
    };

    const rgbColors = colors.map(hexToRgb);

    // 动画绘制循环
    const animate = () => {
      timeRef.current += speed * 0.005;
      const t = timeRef.current;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 绘制多层极光波浪
      for (let i = 0; i < rgbColors.length; i++) {
        const color = rgbColors[i];
        const alpha = 0.12 + Math.sin(t + i * 0.7) * 0.06;

        // 创建径向渐变
        const x = canvas.width * (0.2 + 0.6 * Math.sin(t * 0.3 + i * 1.2));
        const y = canvas.height * (0.3 + 0.4 * Math.cos(t * 0.2 + i * 0.8));
        const radius = Math.max(200, canvas.width * 0.3 + Math.sin(t + i) * 100);

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`);
        gradient.addColorStop(0.5, `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha * 0.5})`);
        gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // 添加额外的波浪线条效果
      ctx.globalCompositeOperation = 'screen';
      for (let w = 0; w < 3; w++) {
        const waveColor = rgbColors[w % rgbColors.length];
        const waveAlpha = 0.08 + Math.sin(t * 0.5 + w) * 0.04;

        ctx.beginPath();
        ctx.moveTo(0, canvas.height);

        for (let x = 0; x <= canvas.width; x += 10) {
          const baseY = canvas.height * (0.4 + w * 0.1);
          const y = baseY +
            Math.sin(x * 0.003 + t + w * 2) * 80 +
            Math.sin(x * 0.007 + t * 1.5 + w) * 40 +
            Math.cos(x * 0.001 + t * 0.8) * 60;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.closePath();

        const waveGrad = ctx.createLinearGradient(0, canvas.height * 0.3, 0, canvas.height);
        waveGrad.addColorStop(0, `rgba(${waveColor.r}, ${waveColor.g}, ${waveColor.b}, ${waveAlpha})`);
        waveGrad.addColorStop(1, `rgba(${waveColor.r}, ${waveColor.g}, ${waveColor.b}, 0)`);
        ctx.fillStyle = waveGrad;
        ctx.fill();
      }

      ctx.globalCompositeOperation = 'source-over';

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [colors, speed]);

  return (
    <canvas
      ref={canvasRef}
      className="aurora-canvas"
      style={{ filter: `blur(${blur}px)` }}
    />
  );
};

export default Aurora;
