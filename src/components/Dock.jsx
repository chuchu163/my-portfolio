import { useState, useRef, useCallback } from 'react';
import './Dock.css';

/**
 * Dock macOS 风格导航栏组件
 * 固定在页面底部的悬浮 Dock 栏
 * 鼠标悬停时图标放大，使用 CSS transform 实现
 */

// Dock 导航项配置
const dockItems = [
  { id: 'github', label: 'GitHub', icon: '🐙', href: 'https://github.com' },
  { id: 'email', label: '邮箱', icon: '📧', href: 'mailto:hello@example.com' },
  { id: 'linkedin', label: 'LinkedIn', icon: '💼', href: 'https://linkedin.com' },
  { id: 'twitter', label: 'X / Twitter', icon: '✦', href: 'https://x.com' },
  { id: 'resume', label: '简历', icon: '📄', href: '#resume' },
];

const Dock = () => {
  const dockRef = useRef(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [mouseX, setMouseX] = useState(0);

  const handleMouseMove = useCallback((e) => {
    if (dockRef.current) {
      const rect = dockRef.current.getBoundingClientRect();
      setMouseX(e.clientX - rect.left);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredIndex(null);
  }, []);

  // 计算每个图标的缩放比例（基于鼠标距离）
  const getScale = (index) => {
    if (hoveredIndex === null) return 1;
    const itemWidth = 56; // 图标容器宽度
    const centerX = hoveredIndex * itemWidth + itemWidth / 2;
    const distance = Math.abs(mouseX - centerX);
    const maxDistance = itemWidth * 2.5;
    const scale = Math.max(1, 1.6 - (distance / maxDistance) * 0.6);
    return scale;
  };

  return (
    <div className="dock-wrapper">
      <nav
        ref={dockRef}
        className="dock"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {dockItems.map((item, index) => {
          const scale = getScale(index);
          return (
            <a
              key={item.id}
              href={item.href}
              className="dock-item"
              style={{
                transform: `scale(${scale}) translateY(${(scale - 1) * -10}px)`,
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              aria-label={item.label}
              title={item.label}
              target={item.href.startsWith('http') ? '_blank' : undefined}
              rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              <span className="dock-icon">{item.icon}</span>
              <span className="dock-tooltip">{item.label}</span>
            </a>
          );
        })}
      </nav>
    </div>
  );
};

export default Dock;
