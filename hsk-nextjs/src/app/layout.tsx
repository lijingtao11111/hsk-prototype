import '../styles/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

// 选择适合中文显示的字体
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '多专业智能考试系统',
  description: '浙江财经大学多专业智能考试系统，提供多学科多专业考试练习',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        {/* 添加Remix图标 */}
        <link href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css" rel="stylesheet" />
        
        {/* 添加防闪烁脚本，确保样式加载一致 */}
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              // 关键CSS变量系统初始化
              document.documentElement.style.setProperty('--base-font-size', '16px');
              document.documentElement.style.setProperty('--card-base-size', '320px');
              document.documentElement.style.setProperty('--container-width', '1280px');

              // 设置页面加载状态，防止闪烁
              document.documentElement.classList.add('js-loading');
              
              // 尺寸标准化脚本，修复刷新和跳转时的样式问题
              function stabilizeLayout() {
                // 添加全局样式修复
                var style = document.createElement('style');
                style.innerHTML = \`
                  * { box-sizing: border-box !important; }
                  
                  /* 确保所有页面容器一致 */
                  .home-container, .subjects-container, .wrong-questions-container,
                  .profile-container, .history-container, .practice-container,
                  .subject-detail-container, .practice-result-container {
                    width: 100% !important;
                    max-width: 100% !important;
                    box-sizing: border-box !important;
                    min-height: 100vh !important;
                    display: flex !important;
                    flex-direction: column !important;
                  }
                  
                  /* 确保卡片布局一致 */
                  .subject-card-inner {
                    height: 100% !important;
                    width: 100% !important;
                    box-sizing: border-box !important;
                    padding: var(--spacing-6) !important;
                  }
                  
                  /* 确保网格布局一致 */
                  .subject-grid {
                    grid-template-columns: repeat(auto-fill, minmax(var(--card-base-size), 1fr)) !important;
                    gap: var(--spacing-6) !important;
                    width: 100% !important;
                  }
                  
                  /* 确保容器尺寸一致 */
                  .container {
                    width: 100% !important;
                    max-width: var(--container-width) !important;
                    margin-left: auto !important;
                    margin-right: auto !important;
                    padding-left: var(--spacing-6) !important;
                    padding-right: var(--spacing-6) !important;
                    box-sizing: border-box !important;
                  }
                  
                  /* 确保导航栏样式一致 */
                  .navbar {
                    width: 100% !important;
                    box-sizing: border-box !important;
                    position: sticky !important;
                    top: 0 !important;
                    z-index: var(--z-sticky) !important;
                    background-color: var(--bg-white) !important;
                    box-shadow: var(--shadow) !important;
                  }
                  
                  /* 确保移动导航栏样式一致 */
                  .mobile-navbar {
                    position: fixed !important;
                    bottom: 0 !important;
                    left: 0 !important;
                    width: 100% !important;
                    z-index: var(--z-sticky) !important;
                    background-color: var(--bg-white) !important;
                    box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.1) !important;
                  }
                  
                  /* 确保卡片样式一致 */
                  .card {
                    background-color: var(--bg-white) !important;
                    border-radius: var(--radius-lg) !important;
                    box-shadow: var(--shadow) !important;
                    padding: var(--spacing-6) !important;
                    border: 1px solid var(--border-light) !important;
                    box-sizing: border-box !important;
                  }
                  
                  /* 确保进度条样式一致 */
                  .progress-container {
                    background-color: var(--border) !important;
                    height: 0.5rem !important;
                    border-radius: var(--radius-full) !important;
                    overflow: hidden !important;
                  }
                  
                  .progress-bar {
                    height: 100% !important;
                    background-color: var(--primary) !important;
                    border-radius: var(--radius-full) !important;
                  }
                  
                  /* 确保按钮样式一致 */
                  .btn {
                    display: inline-flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    font-weight: 500 !important;
                    transition: all var(--transition) !important;
                    text-decoration: none !important;
                    cursor: pointer !important;
                  }
                  
                  /* 响应式修复 */
                  @media (max-width: 768px) {
                    .container {
                      padding-left: var(--spacing-4) !important;
                      padding-right: var(--spacing-4) !important;
                    }
                    
                    body {
                      padding-bottom: calc(var(--footer-height) + env(safe-area-inset-bottom, 0px)) !important;
                    }
                  }
                \`;
                document.head.appendChild(style);
                
                // 移除加载状态
                setTimeout(function() {
                  document.documentElement.classList.remove('js-loading');
                }, 50);
              }

              // 页面加载时执行
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', stabilizeLayout);
              } else {
                stabilizeLayout();
              }
              
              // 页面完全加载后再次确认样式
              window.addEventListener('load', function() {
                document.documentElement.classList.remove('js-loading');
                // 再次应用样式修复，确保一致性
                stabilizeLayout();
              });
            })();
          `
        }} />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
} 