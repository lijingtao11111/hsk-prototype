"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import '../../styles/home.css';
import Navbar from '../../components/Navbar';
import PageInitializer from '../../components/PageInitializer';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 添加关键CSS变量确保尺寸一致
    document.documentElement.style.setProperty('--card-base-size', '320px');
    document.documentElement.style.setProperty('--container-width', '1280px');
    
    // 强制应用内联样式，确保关键元素尺寸一致
    const applyForcedStyles = () => {
      // 确保卡片尺寸一致
      document.querySelectorAll('.feature-card').forEach((card: any) => {
        card.style.height = '100%';
        card.style.width = '100%';
        card.style.boxSizing = 'border-box';
        card.style.transition = 'all 0.2s';
      });

      // 确保网格布局一致
      const featureGrid = document.querySelector('.feature-grid');
      if (featureGrid) {
        (featureGrid as HTMLElement).style.display = 'grid';
        (featureGrid as HTMLElement).style.gridTemplateColumns = 'repeat(auto-fill, minmax(250px, 1fr))';
        (featureGrid as HTMLElement).style.gap = 'var(--spacing-6)';
      }
    };

    // 延迟设置mounted状态，确保样式加载
    setTimeout(() => {
      setMounted(true);
      // 在内容显示后应用强制样式
      setTimeout(applyForcedStyles, 0);
    }, 10);

    // 添加resize监听器，确保响应式布局一致
    window.addEventListener('resize', applyForcedStyles);
    return () => window.removeEventListener('resize', applyForcedStyles);
  }, []);

  // 如果组件还没挂载完成，显示占位内容但保持完整结构
  if (!mounted) {
    return (
      <div className="home-container" style={{ visibility: 'hidden' }}>
        <PageInitializer cssPath="/home.css" />
        <Navbar />
        <div className="min-h-screen">
          <section className="welcome-section">
            <div className="welcome-pattern"></div>
            <div className="container welcome-content"></div>
          </section>
          <section className="main-content">
            <div className="container"></div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* 确保页面样式正确加载 */}
      <PageInitializer cssPath="/home.css" />
      
      {/* 使用共享导航栏组件 */}
      <Navbar />
      
      <div className="min-h-screen">
        {/* 欢迎区域 */}
        <section className="welcome-section">
          <div className="welcome-pattern"></div>
          
          <div className="container welcome-content">
            <div className="welcome-title fade-in">欢迎回来，李同学</div>
            <div className="welcome-subtitle fade-in delay-1">继续你的学习之旅，探索多专业智能考试系统</div>
            
            <div className="welcome-stats">
              <div className="welcome-stat fade-in delay-1">
                <div className="stat-number">85%</div>
                <div className="stat-label">知识点掌握率</div>
              </div>
              <div className="welcome-stat fade-in delay-2">
                <div className="stat-number">12</div>
                <div className="stat-label">今日练习题数</div>
              </div>
              <div className="welcome-stat fade-in delay-3">
                <div className="stat-number">78%</div>
                <div className="stat-label">正确率</div>
              </div>
            </div>
          </div>
        </section>
        
        {/* 学习进度 */}
        <section className="main-content">
          <div className="container">
            <h2 className="section-title">近期学习科目</h2>
            
            <div className="row mb-6">
              <div className="col">
                <div className="subject-progress-card">
                  <div className="subject-header">
                    <div>
                      <h3 className="subject-title">HSK四级</h3>
                      <div className="subject-meta">上次学习: 今天</div>
                    </div>
                    <div className="subject-progress">75%</div>
                  </div>
                  
                  <div className="progress-container">
                    <div className="progress-bar" style={{width: '75%'}}></div>
                  </div>
                  
                  <div className="text-right">
                    <Link href="/practice?subject=hsk4" className="btn btn-primary btn-icon continue-btn">
                      <i className="ri-play-line"></i> 继续学习
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="col">
                <div className="subject-progress-card">
                  <div className="subject-header">
                    <div>
                      <h3 className="subject-title">大学英语四级</h3>
                      <div className="subject-meta">上次学习: 昨天</div>
                    </div>
                    <div className="subject-progress">45%</div>
                  </div>
                  
                  <div className="progress-container">
                    <div className="progress-bar" style={{width: '45%'}}></div>
                  </div>
                  
                  <div className="text-right">
                    <Link href="/practice?subject=cet4" className="btn btn-primary btn-icon continue-btn">
                      <i className="ri-play-line"></i> 继续学习
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 功能模块 */}
            <h2 className="section-title">功能导航</h2>
            
            <div className="feature-grid">
              <Link href="/subjects" className="feature-card fade-in">
                <div className="feature-icon">
                  <i className="ri-book-open-line"></i>
                </div>
                <h3 className="fw-semibold mb-2">学科选择</h3>
                <p className="text-muted fs-sm">
                  浏览所有支持的学科和专业，开始新的学习
                </p>
              </Link>
              
              <Link href="/wrong-questions" className="feature-card fade-in delay-1">
                <div className="feature-icon">
                  <i className="ri-error-warning-line"></i>
                </div>
                <h3 className="fw-semibold mb-2">错题本</h3>
                <p className="text-muted fs-sm">
                  查看AI智能分析的错题和薄弱知识点
                </p>
              </Link>
              
              <Link href="/practice?type=real_exam" className="feature-card fade-in delay-2">
                <div className="feature-icon">
                  <i className="ri-file-list-3-line"></i>
                </div>
                <h3 className="fw-semibold mb-2">真题练习</h3>
                <p className="text-muted fs-sm">
                  历年真题练习，模拟考试环境
                </p>
              </Link>
              
              <Link href="/history" className="feature-card fade-in delay-3">
                <div className="feature-icon">
                  <i className="ri-history-line"></i>
                </div>
                <h3 className="fw-semibold mb-2">练习记录</h3>
                <p className="text-muted fs-sm">
                  查看历史练习记录和学习统计
                </p>
              </Link>
            </div>
          </div>
        </section>
      </div>
      
      {/* 移动端底部导航 */}
      <nav className="mobile-navbar">
        <ul className="mobile-navbar-menu">
          <li className="mobile-navbar-item">
            <Link href="/home" className="mobile-navbar-link active">
              <i className="ri-home-5-line mobile-navbar-icon"></i>
              <span>首页</span>
            </Link>
          </li>
          <li className="mobile-navbar-item">
            <Link href="/subjects" className="mobile-navbar-link">
              <i className="ri-book-open-line mobile-navbar-icon"></i>
              <span>学科</span>
            </Link>
          </li>
          <li className="mobile-navbar-item">
            <Link href="/wrong-questions" className="mobile-navbar-link">
              <i className="ri-error-warning-line mobile-navbar-icon"></i>
              <span>错题本</span>
            </Link>
          </li>
          <li className="mobile-navbar-item">
            <Link href="/profile" className="mobile-navbar-link">
              <i className="ri-user-line mobile-navbar-icon"></i>
              <span>我的</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
} 