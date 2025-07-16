"use client";

import { useEffect, useState } from 'react';
import { isAdminLoggedIn } from '@/lib/auth/client';
import ClientOnly from './ClientOnly';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

function AuthGuardContent({ children }: AdminAuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = isAdminLoggedIn();

      if (!loggedIn) {
        // 未登录，跳转到登录页
        window.location.href = '/admin/login';
        return;
      }

      setIsAuthenticated(true);
      setIsLoading(false);
    };

    // 延迟检查，确保localStorage可用
    const timer = setTimeout(checkAuth, 100);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #4f46e5',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <div style={{
            color: '#6b7280',
            fontSize: '0.875rem'
          }}>
            验证登录状态...
          </div>
        </div>

        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // 正在跳转到登录页
  }

  return <>{children}</>;
}

export default function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  return (
    <ClientOnly
      fallback={
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#f9fafb'
        }}>
          <div style={{
            color: '#6b7280',
            fontSize: '0.875rem'
          }}>
            加载中...
          </div>
        </div>
      }
    >
      <AuthGuardContent>{children}</AuthGuardContent>
    </ClientOnly>
  );
}
