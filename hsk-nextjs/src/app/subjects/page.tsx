"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import '../../styles/subjects.css';
import Navbar from '../../components/Navbar';
import PageInitializer from '../../components/PageInitializer';

export default function SubjectsPage() {
  const [activeFilter, setActiveFilter] = useState('全部');
  const [searchTerm, setSearchTerm] = useState('');
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 添加关键CSS变量确保尺寸一致
    document.documentElement.style.setProperty('--card-base-size', '320px');
    document.documentElement.style.setProperty('--container-width', '1280px');
    
    // 预设内联样式防止布局跳动
    const style = document.createElement('style');
    style.textContent = `
      /* 强制覆盖导航栏样式 */
      .navbar {
        box-shadow: none !important;
        -webkit-box-shadow: none !important;
        border-bottom: none !important;
        border: none !important;
      }
      
      /* 强制覆盖所有可能的阴影和下划线效果 */
      .subject-card,
      .subject-card-inner,
      .subject-card:hover .subject-card-inner,
      .subject-card a,
      .subject-card * {
        box-shadow: none !important;
        text-decoration: none !important;
        border-bottom: none !important;
        -webkit-box-shadow: none !important;
        -moz-box-shadow: none !important;
        outline: none !important;
      }
      
      a.subject-card {
        text-decoration: none !important;
      }
      
      .subject-card-inner {
        height: 100% !important;
        width: 100% !important;
        box-sizing: border-box !important;
        padding: var(--spacing-6) !important;
        box-shadow: none !important;
        text-decoration: none !important;
        border-bottom: none !important;
      }
      .subject-card {
        text-decoration: none !important;
        border-bottom: none !important;
      }
      .subject-grid {
        grid-template-columns: repeat(auto-fill, minmax(var(--card-base-size), 1fr)) !important;
        gap: var(--spacing-6) !important;
      }
      
      /* 防止页面闪动 */
      .subjects-container.loading {
        visibility: hidden;
      }
      .subjects-container.loaded {
        animation: fadeIn 0.3s ease-in-out;
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    
    // 首先设置mounted状态
    setMounted(true);
    
    // 等待样式和资源加载完成
    const timer1 = setTimeout(() => {
      setIsLoading(false);
      
      // 直接修改DOM，移除所有可能的阴影和下划线效果
      const removeAllShadowsAndUnderlines = () => {
        // 获取所有学科卡片和内部元素
        const cards = document.querySelectorAll('.subject-card, .subject-card-inner, .subject-card a, .subject-card *');
        
        // 为每个元素应用内联样式
        cards.forEach(card => {
          if (card instanceof HTMLElement) {
            card.style.boxShadow = 'none';
            card.style.webkitBoxShadow = 'none';
            card.style.textDecoration = 'none';
            card.style.borderBottom = 'none';
            card.style.outline = 'none';
          }
        });
      };
      
      // 执行清除函数
      removeAllShadowsAndUnderlines();
      
      // 监听DOM变化，持续移除阴影和下划线
      const observer = new MutationObserver(removeAllShadowsAndUnderlines);
      observer.observe(document.body, { childList: true, subtree: true });
      
      return () => {
        observer.disconnect();
      };
    }, 100);
    
    return () => {
      clearTimeout(timer1);
    };
  }, []);

  // 模拟学科数据
  const subjects = [
    {
      id: 'hsk4',
      title: 'HSK四级',
      category: '语言类',
      description: 'HSK（汉语水平考试）四级词汇与语法练习，适合具有一定汉语基础的学习者',
      icon: 'ri-translate',
      questionCount: '2500+',
    },
    {
      id: 'hsk5',
      title: 'HSK五级',
      category: '语言类',
      description: 'HSK（汉语水平考试）五级词汇与语法练习，适合中高级汉语学习者',
      icon: 'ri-translate',
      questionCount: '3200+',
    },
    {
      id: 'cet4',
      title: '大学英语四级',
      category: '语言类',
      description: 'CET-4英语听力、阅读、写作练习，提升大学英语四级应试能力',
      icon: 'ri-english-input',
      questionCount: '5000+',
    },
    {
      id: 'math',
      title: '高等数学',
      category: '理工类',
      description: '大学高等数学微积分、线性代数练习，帮助理解数学概念和解题技巧',
      icon: 'ri-functions',
      questionCount: '1800+',
    },
    {
      id: 'prog',
      title: '程序设计',
      category: '技能类',
      description: '计算机程序设计基础知识与算法练习，提升编程能力和算法思维',
      icon: 'ri-code-s-slash-line',
      questionCount: '1200+',
    },
    {
      id: 'econ',
      title: '经济学原理',
      category: '文史类',
      description: '经济学基本原理与应用练习，帮助理解微观和宏观经济学概念',
      icon: 'ri-line-chart-line',
      questionCount: '1500+',
    },
  ];

  // 过滤学科
  const filteredSubjects = subjects.filter(subject => {
    // 类别过滤
    const categoryMatch = activeFilter === '全部' || subject.category === activeFilter;
    
    // 搜索过滤
    const searchMatch = 
      subject.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      subject.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return categoryMatch && searchMatch;
  });

  // 页面内容
  const pageContent = (
    <div className={`subjects-container ${isLoading ? 'loading' : 'loaded'}`}>
      {/* 确保页面样式正确加载 */}
      <PageInitializer cssPath="/subjects.css" />
      
      {/* 使用共享导航栏组件 */}
      <Navbar />
      
      <div className="container" style={{paddingTop: 'var(--spacing-8)', paddingBottom: 'var(--spacing-16)'}}>
        {/* 页面标题 */}
        <div className="page-header">
          <h1 className="page-title fade-in">
            <i className="ri-book-open-line"></i>
            <span>学科选择</span>
          </h1>
          <p className="page-description fade-in delay-1">
            浏览并选择您想要学习的学科，我们提供多种专业领域的智能练习系统
          </p>
        </div>
        
        {/* 过滤栏 */}
        <div className="filter-bar fade-in delay-2">
          <div className="filter-buttons">
            {['全部', '语言类', '理工类', '文史类', '技能类'].map(filter => (
              <button 
                key={filter}
                className={`filter-button ${activeFilter === filter ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
          
          <div className="search-box">
            <i className="ri-search-line"></i>
            <input 
              type="text" 
              placeholder="搜索学科..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {/* 学科网格 */}
        <div className="subject-grid" style={{
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredSubjects.map((subject, index) => (
            <div 
              key={subject.id}
              className={`fade-in delay-${(index % 3) + 1}`}
              style={{
                height: '100%',
                width: '100%',
                boxSizing: 'border-box',
              }}
            >
              <Link 
                href={`/subject-detail?subject=${subject.id}`}
                className="subject-card"
                style={{
                  display: 'block',
                  height: '100%',
                  width: '100%',
                  boxSizing: 'border-box',
                  textDecoration: 'none',
                  borderBottom: 'none',
                  boxShadow: 'none',
                  outline: 'none'
                }}
              >
                <div className="subject-card-inner" style={{
                  height: '100%',
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '1.5rem',
                  boxShadow: 'none',
                  textDecoration: 'none',
                  borderBottom: 'none',
                  outline: 'none'
                }}>
                  <div className="subject-icon">
                    <i className={subject.icon}></i>
                  </div>
                  <h3 className="subject-card-title">{subject.title}</h3>
                  <div className="subject-card-badge">{subject.category}</div>
                  <p className="subject-card-description">
                    {subject.description}
                  </p>
                  <div className="subject-card-footer">
                    <div className="subject-card-stats">
                      <i className="ri-question-line mr-1"></i>题目: <span>{subject.questionCount}</span>
                    </div>
                    <div className="subject-card-action">
                      <span>开始学习</span>
                      <i className="ri-arrow-right-line"></i>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // 如果组件还没挂载完成，显示占位内容但保持完整结构
  if (!mounted) {
    return (
      <div className="subjects-container" style={{ visibility: 'hidden' }}>
        <PageInitializer cssPath="/subjects.css" />
        <div className="container" style={{paddingTop: 'var(--spacing-8)', paddingBottom: 'var(--spacing-16)'}}>
          <div className="page-header">
            <h1 className="page-title"></h1>
            <p className="page-description"></p>
          </div>
          <div className="filter-bar"></div>
          <div className="subject-grid" style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem'
          }}>
            {/* 添加占位卡片确保初始布局尺寸正确 */}
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} style={{height: "420px", width: "100%"}}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return pageContent;
} 