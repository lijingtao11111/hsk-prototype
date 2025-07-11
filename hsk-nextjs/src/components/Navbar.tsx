"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  
  useEffect(() => {
    // 设置导航栏活动状态
    const setActiveLinks = () => {
      document.querySelectorAll('.navbar-link, .mobile-navbar-link').forEach(link => {
        const href = link.getAttribute('href');
        link.classList.remove('active');
        
        if (href === pathname || 
            (href && pathname.includes(href) && href !== '/') ||
            (pathname === '/' && href === '/home') ||
            (pathname.includes('/subject-detail') && href === '/subjects')) {
          link.classList.add('active');
        }
      });
    };
    
    setActiveLinks();
    
    // 添加导航栏样式修复
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      /* PC端导航栏样式 */
      .navbar {
        background-color: var(--bg-white);
        box-shadow: none !important;
        position: sticky;
        top: 0;
        z-index: var(--z-sticky);
        padding: var(--spacing-3) 0;
        border-bottom: none !important;
        width: 100%;
        height: var(--navbar-height);
      }
      
      .navbar-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 100%;
      }
      
      .navbar-brand {
        font-weight: 600;
        font-size: 1.25rem;
        color: var(--primary);
        text-decoration: none;
        display: flex;
        align-items: center;
      }
      
      .navbar-menu {
        display: flex;
        list-style: none;
        margin: 0;
        padding: 0;
      }
      
      .navbar-item {
        margin-left: var(--spacing-6);
      }
      
      .navbar-link {
        color: var(--text-secondary);
        text-decoration: none;
        font-weight: 500;
        padding: var(--spacing-2) 0;
        position: relative;
        transition: color var(--transition);
      }
      
      .navbar-link:hover {
        color: var(--primary);
      }
      
      .navbar-link.active {
        color: var(--primary);
      }
      
      .navbar-link.active::after {
        content: '';
        position: absolute;
        bottom: -3px;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: var(--primary);
        border-radius: 2px;
      }
      
      /* 移动端导航栏优化 - 全局统一 */
      @media (max-width: 768px) {
        .navbar {
          background-color: var(--bg-white) !important;
          padding: 0.35rem 1rem !important;
          width: 100% !important;
          box-sizing: border-box !important;
          height: auto !important;
          min-height: auto !important;
          box-shadow: none !important;
          border-bottom: none !important;
          position: sticky !important;
          top: 0 !important;
          z-index: var(--z-sticky) !important;
        }

        .navbar-container {
          justify-content: flex-start !important;
          padding: 0 !important;
        }
        
        .navbar-brand {
          font-size: 1rem !important;
          font-weight: 600 !important;
          color: var(--text-primary) !important;
        }
        
        .navbar-brand .brand-icon {
          display: none !important;
        }
        
        .navbar-menu {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(styleEl);
    
  }, [pathname]);
  
  // 根据当前路径确定哪个链接应该激活
  const isActive = (path: string) => {
    if (path === pathname) return true;
    if (path === '/home' && pathname === '/') return true;
    if (path === '/subjects' && pathname.includes('/subject-detail')) return true;
    if (path !== '/' && pathname.includes(path)) return true;
    return false;
  };

  return (
    <>
      <nav className="navbar">
        <div className="container navbar-container">
          <Link href="/home" className="navbar-brand">
            <i className="ri-graduation-cap-line mr-2 brand-icon"></i>
            <span>智能考试系统</span>
          </Link>
          
          <ul className="navbar-menu">
            <li className="navbar-item">
              <Link href="/home" className={`navbar-link ${isActive('/home') ? 'active' : ''}`}>
                首页
              </Link>
            </li>
            <li className="navbar-item">
              <Link href="/subjects" className={`navbar-link ${isActive('/subjects') ? 'active' : ''}`}>
                学科选择
              </Link>
            </li>
            <li className="navbar-item">
              <Link href="/wrong-questions" className={`navbar-link ${isActive('/wrong-questions') ? 'active' : ''}`}>
                错题本
              </Link>
            </li>
            <li className="navbar-item">
              <Link href="/profile" className={`navbar-link ${isActive('/profile') ? 'active' : ''}`}>
                个人中心
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      
      {/* 移动端底部导航 */}
      <nav className="mobile-navbar">
        <ul className="mobile-navbar-menu">
          <li className="mobile-navbar-item">
            <Link 
              href="/home" 
              className={`mobile-navbar-link ${isActive('/home') ? 'active' : ''}`}
            >
              <i className="ri-home-5-line mobile-navbar-icon"></i>
              <span>首页</span>
            </Link>
          </li>
          <li className="mobile-navbar-item">
            <Link 
              href="/subjects" 
              className={`mobile-navbar-link ${isActive('/subjects') ? 'active' : ''}`}
            >
              <i className="ri-book-open-line mobile-navbar-icon"></i>
              <span>学科</span>
            </Link>
          </li>
          <li className="mobile-navbar-item">
            <Link 
              href="/wrong-questions" 
              className={`mobile-navbar-link ${isActive('/wrong-questions') ? 'active' : ''}`}
            >
              <i className="ri-error-warning-line mobile-navbar-icon"></i>
              <span>错题本</span>
            </Link>
          </li>
          <li className="mobile-navbar-item">
            <Link 
              href="/profile" 
              className={`mobile-navbar-link ${isActive('/profile') ? 'active' : ''}`}
            >
              <i className="ri-user-line mobile-navbar-icon"></i>
              <span>我的</span>
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
} 