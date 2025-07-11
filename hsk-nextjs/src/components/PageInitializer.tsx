"use client";

import { useEffect, useRef, useState } from 'react';

interface PageInitializerProps {
  cssPath?: string;
}

export default function PageInitializer({ cssPath }: PageInitializerProps) {
  const initializedRef = useRef(false);
  const [stylesProcessed, setStylesProcessed] = useState(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    
    // 确保CSS路径格式正确
    const processedCssPath = cssPath?.startsWith('/')
      ? `/_next/static/css${cssPath}`
      : cssPath;
    
    // 加载关键CSS变量到根元素
    const root = document.documentElement;
    if (!root.style.getPropertyValue('--card-base-size')) {
      root.style.setProperty('--card-base-size', '320px');
    }
    if (!root.style.getPropertyValue('--container-width')) {
      root.style.setProperty('--container-width', '1280px');
    }
    
    // 预加载和规范化所有样式
    const normalizeStyles = () => {
      // 1. 防止闪烁：暂时隐藏内容但保持布局结构
      document.body.style.visibility = 'hidden';
      
      // 2. 确保所有关键样式表已加载
      if (processedCssPath) {
        const existingLink = document.querySelector(`link[href*="${processedCssPath}"]`);
        if (!existingLink) {
          const linkEl = document.createElement('link');
          linkEl.rel = 'stylesheet';
          linkEl.href = processedCssPath;
          linkEl.onload = () => {
            // 注入强制样式修复，确保所有布局尺寸一致
            injectStyleFixes();
          };
          document.head.appendChild(linkEl);
        } else {
          // 已存在样式表，直接注入修复
          injectStyleFixes();
        }
      } else {
        injectStyleFixes();
      }
      
      // 3. 确保图标字体已加载
      const iconLink = document.querySelector('link[href*="remixicon"]');
      if (!iconLink) {
        const newIconLink = document.createElement('link');
        newIconLink.rel = 'stylesheet';
        newIconLink.href = 'https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css';
        document.head.appendChild(newIconLink);
      }
      
      // 4. 短暂延迟后恢复可见性，确保样式已应用
      setTimeout(() => {
        document.body.style.visibility = '';
        setStylesProcessed(true);
      }, 50);
    };
    
    // 注入强制样式修复，确保所有页面组件尺寸一致
    const injectStyleFixes = () => {
      // 创建样式元素并注入必要的CSS修复
      const styleEl = document.createElement('style');
      styleEl.textContent = `
        /* 强制布局稳定性 */
        *, *::before, *::after {
          box-sizing: border-box !important;
        }
        
        /* 学科卡片尺寸控制 */
        .subject-card {
          height: 100% !important;
          width: 100% !important;
          box-sizing: border-box !important;
        }
        
        .subject-card-inner {
          height: 100% !important;
          width: 100% !important;
          box-sizing: border-box !important;
          padding: var(--spacing-6) !important;
        }
        
        /* 页面容器尺寸控制 */
        .subjects-container,
        .wrong-questions-container,
        .home-container,
        .practice-container,
        .history-container,
        .profile-container,
        .subject-detail-container,
        .practice-result-container {
          width: 100% !important;
          max-width: 100% !important;
          overflow-x: hidden !important;
          min-height: 100vh !important;
          display: flex !important;
          flex-direction: column !important;
        }
        
        /* 网格布局控制 */
        .subject-grid {
          grid-template-columns: repeat(auto-fill, minmax(var(--card-base-size), 1fr)) !important;
          gap: var(--spacing-6) !important;
        }
        
        /* 错题本布局控制 */
        .wrong-questions-col {
          width: 60% !important;
        }
        
        .ai-analysis-col {
          width: 40% !important;
        }
        
        /* 首页卡片布局控制 */
        .feature-card {
          height: 100% !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          text-align: center !important;
        }
        
        .feature-grid {
          display: grid !important;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)) !important;
          gap: var(--spacing-6) !important;
        }
        
        /* 确保一致的容器尺寸 */
        .container {
          width: 100% !important;
          max-width: var(--container-width) !important;
          margin-left: auto !important;
          margin-right: auto !important;
          padding-left: var(--spacing-6) !important;
          padding-right: var(--spacing-6) !important;
        }
        
        /* 确保错题本卡片一致 */
        .question-card {
          width: 100% !important;
          box-sizing: border-box !important;
          margin-bottom: 1.5rem !important;
        }
        
        /* 确保AI分析卡片一致 */
        .ai-insight-card {
          background-color: #f0f4ff !important;
          border-radius: 0.5rem !important;
          border: 1px solid rgba(79, 70, 229, 0.2) !important;
          padding: 1.5rem !important;
        }
        
        /* 导航栏样式修复 */
        .navbar {
          background-color: var(--bg-white) !important;
          box-shadow: var(--shadow) !important;
          position: sticky !important;
          top: 0 !important;
          z-index: var(--z-sticky) !important;
          padding: var(--spacing-3) 0 !important;
          border-bottom: 1px solid var(--border-light) !important;
          width: 100% !important;
          height: var(--navbar-height) !important;
        }
        
        .navbar-container {
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          width: 100% !important;
          height: 100% !important;
        }
        
        .navbar-brand {
          font-weight: 600 !important;
          font-size: 1.25rem !important;
          color: var(--primary) !important;
          text-decoration: none !important;
          display: flex !important;
          align-items: center !important;
        }
        
        .navbar-menu {
          display: flex !important;
          list-style: none !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        
        .navbar-item {
          margin-left: var(--spacing-6) !important;
        }
        
        .navbar-link {
          color: var(--text-secondary) !important;
          text-decoration: none !important;
          font-weight: 500 !important;
          padding: var(--spacing-2) 0 !important;
          position: relative !important;
          transition: color var(--transition) !important;
        }
        
        .navbar-link:hover {
          color: var(--primary) !important;
        }
        
        .navbar-link.active {
          color: var(--primary) !important;
        }
        
        .navbar-link.active::after {
          content: '' !important;
          position: absolute !important;
          bottom: -3px !important;
          left: 0 !important;
          width: 100% !important;
          height: 2px !important;
          background-color: var(--primary) !important;
          border-radius: 2px !important;
        }
        
        /* 确保移动端导航栏一致 */
        .mobile-navbar {
          position: fixed !important;
          bottom: 0 !important;
          left: 0 !important;
          right: 0 !important;
          z-index: 100 !important;
          background-color: white !important;
          box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.1) !important;
          height: var(--footer-height) !important;
          padding-bottom: env(safe-area-inset-bottom, 0) !important;
        }
        
        .mobile-navbar-menu {
          display: flex !important;
          list-style: none !important;
          margin: 0 !important;
          padding: 0 !important;
          height: 100% !important;
        }
        
        .mobile-navbar-item {
          flex: 1 !important;
        }
        
        .mobile-navbar-link {
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          padding: var(--spacing-2) 0 !important;
          color: var(--text-secondary) !important;
          text-decoration: none !important;
          font-size: 0.75rem !important;
          height: 100% !important;
          transition: color var(--transition) !important;
        }
        
        .mobile-navbar-icon {
          font-size: 1.25rem !important;
          margin-bottom: var(--spacing-1) !important;
        }
        
        .mobile-navbar-link.active {
          color: var(--primary) !important;
        }
        
        .mobile-navbar-link.active .mobile-navbar-icon {
          color: var(--primary) !important;
        }
        
        /* 防止页面闪动 */
        .subjects-container.loading,
        .wrong-questions-container.loading,
        .home-container.loading {
          visibility: hidden !important;
        }
        
        .subjects-container.loaded,
        .wrong-questions-container.loaded,
        .home-container.loaded {
          animation: fadeIn 0.3s ease-in-out !important;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @media (max-width: 640px) {
          .container {
            padding-left: var(--spacing-4) !important;
            padding-right: var(--spacing-4) !important;
          }
          
          .row {
            flex-direction: column !important;
          }
          
          .wrong-questions-col,
          .ai-analysis-col {
            width: 100% !important;
          }
          
          .feature-grid {
            grid-template-columns: 1fr !important;
            padding-bottom: 80px !important;
          }
        }
        
        /* 确保在页面切换时不会闪动 */
        @media (max-width: 768px) {
          .navbar-menu {
            display: none !important; /* 移动端完全隐藏导航菜单 */
          }
          
          .mobile-navbar {
            display: block !important;
          }
          
          body {
            padding-bottom: calc(var(--footer-height) + env(safe-area-inset-bottom, 0px)) !important;
          }
          
          /* 移动端导航栏标题优化 */
          .navbar {
            padding: var(--spacing-2) 0 !important;
            height: auto !important;
            min-height: 50px !important;
          }
          
          .navbar-container {
            justify-content: center !important; /* 确保标题居中 */
          }
          
          .navbar-brand {
            font-size: 1.125rem !important;
            padding: 0.5rem 0 !important;
          }
          
          /* 移动端个人中心优化 */
          .profile-header {
            padding: 1.5rem 0 !important;
          }
          
          .avatar {
            width: 3.5rem !important;
            height: 3.5rem !important;
          }
          
          .profile-container .container {
            padding-top: 1rem !important;
            padding-bottom: 0 !important; /* 移除底部内边距 */
          }
          
          /* 移动端个人中心标签内容区域优化 */
          .profile-container .tab-content {
            padding-bottom: 100px !important; /* 确保有足够空间但不过多 */
          }
          
          /* 移动端页面间距优化 */
          .page-header {
            margin-bottom: 1.5rem !important;
          }
          
          .page-title {
            font-size: 1.5rem !important;
          }
          
          .card {
            padding: 1rem !important;
            margin-bottom: 1rem !important;
          }
        }
      `;
      document.head.appendChild(styleEl);
    };
    
    // 执行样式处理
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', normalizeStyles);
    } else {
      normalizeStyles();
    }
    
    // 清理函数
    return () => {
      document.removeEventListener('DOMContentLoaded', normalizeStyles);
    };
  }, [cssPath]);

  // 不渲染可见内容
  return null;
} 