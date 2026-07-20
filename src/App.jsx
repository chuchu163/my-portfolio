import { useEffect, useRef } from 'react';
import Aurora from './components/Aurora';
import ShinyText from './components/ShinyText';
import SplitText from './components/SplitText';
import Dock from './components/Dock';
import SplashCursor from './components/SplashCursor';
import MagnetLines from './components/MagnetLines';
import './App.css';

/**
 * 项目数据配置
 */
const projects = [
  {
    title: '智能数据仪表盘',
    description: '基于 React 和 D3.js 构建的实时数据可视化平台，支持多种图表类型和自定义主题。',
    tags: ['React', 'D3.js', 'WebSocket', 'Node.js'],
    link: '#',
  },
  {
    title: 'AI 图像生成工具',
    description: '利用深度学习模型实现文本到图像的生成，提供友好的 Web 界面和批量处理能力。',
    tags: ['Python', 'TensorFlow', 'Flask', 'Docker'],
    link: '#',
  },
  {
    title: '在线协作编辑器',
    description: '支持多人实时协作的富文本编辑器，基于 CRDT 算法实现冲突解决。',
    tags: ['Vue.js', 'Yjs', 'Express', 'MongoDB'],
    link: '#',
  },
  {
    title: '个人博客系统',
    description: '极简风格的静态博客生成器，支持 Markdown 写作、代码高亮和暗色主题。',
    tags: ['Next.js', 'MDX', 'Tailwind', 'Vercel'],
    link: '#',
  },
];

/**
 * 技能标签配置
 */
const skills = [
  'React', 'Vue.js', 'TypeScript', 'JavaScript',
  'Node.js', 'Python', 'Go', 'Docker',
  'PostgreSQL', 'MongoDB', 'Redis', 'GraphQL',
  'Figma', 'Git', 'AWS', 'Three.js',
];

/**
 * 项目卡片组件
 * 使用 IntersectionObserver 实现滚动淡入效果
 */
const ProjectCard = ({ project, index }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('card-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className="project-card"
      style={{ transitionDelay: `${index * 0.15}s` }}
    >
      {/* 卡片顶部装饰渐变条 */}
      <div className="card-gradient-bar" />

      <div className="card-content">
        <h3 className="card-title">{project.title}</h3>
        <p className="card-description">{project.description}</p>

        {/* 技术标签 */}
        <div className="card-tags">
          {project.tags.map((tag) => (
            <span key={tag} className="card-tag">
              {tag}
            </span>
          ))}
        </div>

        {/* 查看链接 */}
        <a
          href={project.link}
          className="card-link"
          onClick={(e) => e.preventDefault()}
        >
          查看项目 →
        </a>
      </div>
    </div>
  );
};

/**
 * 滚动指示箭头组件
 */
const ScrollIndicator = () => {
  const handleClick = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <button className="scroll-indicator" onClick={handleClick} aria-label="向下滚动">
      <span className="scroll-arrow" />
      <span className="scroll-arrow" />
      <span className="scroll-text">向下探索</span>
    </button>
  );
};

/**
 * App 主应用组件
 * 包含 Hero / About / Projects / Contact 四个主要板块
 */
function App() {
  return (
    <div className="app">
      {/* ===== 全局背景层 ===== */}
      <Aurora
        colors={['#00ff87', '#60efff', '#a855f7', '#06b6d4', '#7c3aed']}
        speed={0.4}
        blur={80}
      />

      {/* ===== Hero 首屏区域 ===== */}
      <section className="hero-section">
        {/* 磁力线装饰背景 */}
        <div className="magnet-lines-wrapper">
          <MagnetLines lineCount={15} color="rgba(168, 85, 247, 0.25)" />
        </div>

        {/* 光标拖尾特效 */}
        <SplashCursor />

        <div className="hero-content">
          {/* 主标题：逐字动画 */}
          <h1 className="hero-title">
            <SplitText
              text="你好，我是旅行者"
              triggerOnScroll={false}
              delay={0.04}
              duration={0.6}
              className="hero-split-title"
            />
          </h1>

          {/* 副标题：闪烁文字效果 */}
          <div className="hero-subtitle">
            <ShinyText
              text="全栈开发者 & 创意设计师"
              color="#e4e4e7"
              shineColor="#a855f7"
              speed={3}
              spread={60}
              className="hero-shiny"
            />
          </div>

          {/* 简短描述 */}
          <p className="hero-desc">
            热衷于用代码构建优雅的数字体验
          </p>
        </div>

        {/* 滚动指示 */}
        <ScrollIndicator />
      </section>

      {/* ===== About 关于我板块 ===== */}
      <section id="about" className="about-section">
        <div className="section-container">
          <div className="about-layout">
            {/* 左侧：头像占位 */}
            <div className="about-avatar">
              <div className="avatar-circle">
                <span className="avatar-emoji">✦</span>
              </div>
            </div>

            {/* 右侧：个人介绍 */}
            <div className="about-info">
              <h2 className="section-heading">
                <SplitText text="关于我" triggerOnScroll delay={0.05} />
              </h2>

              <div className="about-text">
                <SplitText
                  text="我是一名充满热情的全栈开发者，拥有超过五年的 Web 开发经验。"
                  triggerOnScroll
                  delay={0.02}
                  duration={0.4}
                  tag="p"
                />
              </div>
              <div className="about-text">
                <SplitText
                  text="擅长使用 React、Vue.js 和 Node.js 构建高性能的 Web 应用。"
                  triggerOnScroll
                  delay={0.02}
                  duration={0.4}
                  tag="p"
                />
              </div>
              <div className="about-text">
                <SplitText
                  text="在追求技术卓越的同时，我也注重用户体验和视觉美学。"
                  triggerOnScroll
                  delay={0.02}
                  duration={0.4}
                  tag="p"
                />
              </div>

              {/* 技能标签 */}
              <div className="skills-grid">
                {skills.map((skill, index) => (
                  <span
                    key={skill}
                    className="skill-badge"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Projects 项目展示板块 ===== */}
      <section id="projects" className="projects-section">
        <div className="section-container">
          <h2 className="section-heading section-heading-center">
            <SplitText text="精选项目" triggerOnScroll delay={0.05} />
          </h2>

          <div className="projects-grid">
            {projects.map((project, index) => (
              <ProjectCard key={project.title} project={project} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== Contact 联系板块 ===== */}
      <section id="contact" className="contact-section">
        <div className="section-container">
          <h2 className="section-heading section-heading-center contact-heading">
            <ShinyText
              text="让我们建立联系"
              color="#e4e4e7"
              shineColor="#06b6d4"
              speed={4}
              spread={50}
            />
          </h2>

          <p className="contact-desc">
            无论是项目合作、技术交流还是简单的问候，我都很乐意收到你的消息。
          </p>

          <div className="contact-links">
            <a href="mailto:hello@example.com" className="contact-link">
              <span className="contact-icon">📧</span>
              <span>hello@example.com</span>
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="contact-link">
              <span className="contact-icon">🐙</span>
              <span>GitHub</span>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="contact-link">
              <span className="contact-icon">💼</span>
              <span>LinkedIn</span>
            </a>
          </div>

          {/* 页脚 */}
          <footer className="footer">
            <p>© 2024 旅行者. 用热爱和代码构建。</p>
          </footer>
        </div>
      </section>

      {/* ===== Dock 底部导航 ===== */}
      <Dock />
    </div>
  );
}

export default App;
