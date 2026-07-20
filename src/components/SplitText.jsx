import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './SplitText.css';

// 注册 GSAP 插件
gsap.registerPlugin(ScrollTrigger);

/**
 * SplitText 拆分文字动画组件
 * 将文字拆分为单个字符，使用 GSAP ScrollTrigger 实现滚动触发的逐字显示动画
 */
const SplitText = ({
  text = '',
  className = '',
  delay = 0.03,
  duration = 0.5,
  ease = 'power3.out',
  tag: Tag = 'div',
  triggerOnScroll = true,
  staggerFrom = 'start',
}) => {
  const containerRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const chars = container.querySelectorAll('.split-char');
    if (chars.length === 0) return;

    // 检查是否是反向 stagger
    const staggerArray = staggerFrom === 'end'
      ? Array.from({ length: chars.length }, (_, i) => (chars.length - 1 - i) * delay)
      : delay;

    // 设置初始状态
    gsap.set(chars, {
      opacity: 0,
      y: 40,
      rotateX: -30,
    });

    const animConfig = {
      opacity: 1,
      y: 0,
      rotateX: 0,
      duration: duration,
      ease: ease,
      stagger: staggerArray,
      onStart: () => {
        hasAnimated.current = true;
      },
    };

    if (triggerOnScroll) {
      gsap.to(chars, {
        ...animConfig,
        scrollTrigger: {
          trigger: container,
          start: 'top 85%',
          end: 'top 50%',
          toggleActions: 'play none none none',
        },
      });
    } else {
      // 不基于滚动，直接播放
      gsap.to(chars, {
        ...animConfig,
        delay: 0.5,
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === container) {
          trigger.kill();
        }
      });
    };
  }, [text, delay, duration, ease, triggerOnScroll, staggerFrom]);

  // 将文字拆分为单个字符，保留空格
  const splitText = () => {
    return text.split('').map((char, index) => {
      if (char === ' ') {
        return <span key={index} className="split-char split-space">&nbsp;</span>;
      }
      return (
        <span key={index} className="split-char" style={{ display: 'inline-block' }}>
          {char}
        </span>
      );
    });
  };

  return (
    <Tag ref={containerRef} className={`split-text-container ${className}`}>
      {splitText()}
    </Tag>
  );
};

export default SplitText;
