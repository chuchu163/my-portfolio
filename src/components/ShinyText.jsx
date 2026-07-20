import { useState } from 'react';
import './ShinyText.css';

/**
 * ShinyText 闪烁文字组件
 * CSS 实现的闪光扫过文字效果
 * 使用 background-clip: text 配合移动的线性渐变
 */
const ShinyText = ({
  text = '',
  color = '#ffffff',
  shineColor = '#a855f7',
  speed = 3,
  spread = 60,
  direction = 'left',
  className = '',
  pauseOnHover = true,
}) => {
  const [paused, setPaused] = useState(false);

  // 动态注入动画样式（根据 speed 和 direction）
  const animationName = `shiny-sweep-${speed}-${direction}`;
  const spreadDeg = `${spread}deg`;

  const styleSheet = `
    @keyframes ${animationName} {
      0% { background-position: 200% center; }
      100% { background-position: -200% center; }
    }
  `;

  return (
    <>
      <style>{styleSheet}</style>
      <span
        className={`shiny-text ${className}`}
        style={{
          '--shine-color': shineColor,
          '--base-color': color,
          '--animation-speed': `${speed}s`,
          '--animation-name': animationName,
          '--paused': paused ? 'paused' : 'running',
          '--spread': spreadDeg,
        }}
        onMouseEnter={() => pauseOnHover && setPaused(true)}
        onMouseLeave={() => pauseOnHover && setPaused(false)}
      >
        {text}
      </span>
    </>
  );
};

export default ShinyText;
