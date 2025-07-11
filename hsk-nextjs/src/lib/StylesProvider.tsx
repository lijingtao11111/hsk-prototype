"use client";

import React, { useEffect, useState } from 'react';

interface StylesProviderProps {
  children: React.ReactNode;
}

export default function StylesProvider({ children }: StylesProviderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 确保样式在客户端挂载时正确加载
    setMounted(true);
    
    // 确保重新加载图标库
    const linkEl = document.querySelector('link[href*="remixicon"]');
    if (linkEl) {
      const newLinkEl = document.createElement('link');
      newLinkEl.rel = 'stylesheet';
      newLinkEl.href = 'https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css';
      document.head.appendChild(newLinkEl);
      
      // 添加事件监听器以确保样式加载
      newLinkEl.onload = () => {
        // 可选：移除旧的链接元素
        // linkEl.remove();
      };
    }
    
    // 添加额外的类以确保正确样式
    document.body.classList.add('styles-loaded');
  }, []);

  // 在客户端渲染之前返回占位符，避免水合不匹配
  if (!mounted) {
    return (
      <div style={{ visibility: 'hidden' }}>
        {children}
      </div>
    );
  }

  return <>{children}</>;
} 