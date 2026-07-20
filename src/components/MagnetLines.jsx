import { useEffect, useRef, useCallback, useState } from 'react';
import './MagnetLines.css';

/**
 * MagnetLines 磁力线组件
 * SVG 实现的动态磁力线效果
 * 线条会朝鼠标位置弯曲，使用平滑插值
 */
const MagnetLines = ({
  lineCount = 20,
  color = 'rgba(168, 85, 247, 0.3)',
  width = 800,
  height = 400,
}) => {
  const svgRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const targetRef = useRef({ x: 0.5, y: 0.5 });
  const currentRef = useRef({ x: 0.5, y: 0.5 });
  const animationRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      targetRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };
    }
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    svg.addEventListener('mousemove', handleMouseMove);

    // 平滑插值动画循环
    const animate = () => {
      const lerp = (a, b, t) => a + (b - a) * t;
      currentRef.current.x = lerp(currentRef.current.x, targetRef.current.x, 0.08);
      currentRef.current.y = lerp(currentRef.current.y, targetRef.current.y, 0.08);

      setMousePos({ ...currentRef.current });
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      svg.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [handleMouseMove]);

  // 生成磁力线路径
  const generatePaths = () => {
    const paths = [];
    for (let i = 0; i < lineCount; i++) {
      const t = i / (lineCount - 1);
      // 起点：均匀分布在左侧
      const startX = 0;
      const startY = t;
      // 终点：均匀分布在右侧
      const endX = 1;
      const endY = t;

      // 计算朝鼠标弯曲的控制点
      const midX = 0.5;
      const midY = startY + (endY - startY) * 0.5;

      // 鼠标对控制点的影响
      const influence = 0.3;
      const cp1x = 0.25 + (mousePos.x - 0.5) * influence;
      const cp1y = startY + (mousePos.y - midY) * influence;
      const cp2x = 0.75 + (mousePos.x - 0.5) * influence;
      const cp2y = endY + (mousePos.y - midY) * influence;

      // SVG 路径
      const sx = startX * width;
      const sy = startY * height;
      const cp1sx = cp1x * width;
      const cp1sy = cp1y * height;
      const cp2sx = cp2x * width;
      const cp2sy = cp2y * height;
      const ex = endX * width;
      const ey = endY * height;

      // 线条透明度随距离鼠标的远近变化
      const distToMouse = Math.sqrt(
        Math.pow((mousePos.x - 0.5) * 2, 2) +
        Math.pow((mousePos.y - midY) * 2, 2)
      );
      const opacity = 0.15 + (1 - Math.min(1, distToMouse)) * 0.35;

      paths.push(
        <path
          key={i}
          d={`M ${sx} ${sy} C ${cp1sx} ${cp1sy}, ${cp2sx} ${cp2sy}, ${ex} ${ey}`}
          fill="none"
          stroke={color}
          strokeWidth={0.8 + Math.sin(t * Math.PI) * 1.2}
          strokeOpacity={opacity}
          strokeLinecap="round"
        />
      );
    }
    return paths;
  };

  return (
    <svg
      ref={svgRef}
      className="magnet-lines-svg"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid slice"
    >
      {generatePaths()}
    </svg>
  );
};

export default MagnetLines;
