import Link from 'next/link';
import { adminLogout, getAdminUser } from '@/lib/auth/client';
import { useEffect, useState } from 'react';
import ClientOnly from './ClientOnly';

interface AdminSidebarProps {
  currentPage: string;
}

function SidebarContent({ currentPage }: AdminSidebarProps) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getAdminUser());
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    if (confirm('确定要退出登录吗？')) {
      adminLogout();
    }
  };

  const menuItems = [
    {
      section: '系统管理',
      items: [
        {
          href: '/admin/index',
          icon: 'ri-dashboard-line',
          label: '系统概览',
          key: 'index'
        },
        {
          href: '/admin/user-management',
          icon: 'ri-user-settings-line',
          label: '用户管理',
          key: 'user-management'
        },
        {
          href: '/admin/subject-management',
          icon: 'ri-book-open-line',
          label: '学科管理',
          key: 'subject-management'
        },
        {
          href: '/admin/question-bank',
          icon: 'ri-question-answer-line',
          label: '题库管理',
          key: 'question-bank'
        }
      ]
    },
    {
      section: '系统设置',
      items: [
        {
          href: '/admin/system-settings',
          icon: 'ri-settings-3-line',
          label: '系统设置',
          key: 'system-settings'
        },
        {
          href: '#',
          icon: 'ri-logout-box-line',
          label: '退出登录',
          key: 'logout',
          onClick: handleLogout
        }
      ]
    }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">Z</div>
        <div className="sidebar-title">浙财智能考试系统</div>
      </div>
      
      <div className="sidebar-menu">
        {menuItems.map((section, sectionIndex) => (
          <div key={sectionIndex} className="sidebar-section">
            <div className="sidebar-section-title">{section.section}</div>
            {section.items.map((item) => (
              item.onClick ? (
                <a
                  key={item.key}
                  href={item.href}
                  onClick={item.onClick}
                  className={`sidebar-link ${currentPage === item.key ? 'active' : ''}`}
                >
                  <i className={`${item.icon} sidebar-icon`}></i>
                  <span>{item.label}</span>
                </a>
              ) : (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`sidebar-link ${currentPage === item.key ? 'active' : ''}`}
                >
                  <i className={`${item.icon} sidebar-icon`}></i>
                  <span>{item.label}</span>
                </Link>
              )
            ))}
          </div>
        ))}
      </div>
      
      <div className="sidebar-footer">
        <div className="sidebar-footer-avatar">
          {user?.nickname?.charAt(0) || '管'}
        </div>
        <div>
          <div style={{fontWeight: 500}}>{user?.nickname || '系统管理员'}</div>
          <div style={{fontSize: '0.75rem', color: 'var(--text-secondary)'}}>
            {user?.extendedInfo?.department || '超级管理员'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminSidebar({ currentPage }: AdminSidebarProps) {
  return (
    <ClientOnly
      fallback={
        <div className="sidebar">
          <div className="sidebar-header">
            <div className="sidebar-logo">Z</div>
            <div className="sidebar-title">浙财智能考试系统</div>
          </div>
          <div className="sidebar-menu">
            <div style={{ padding: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
              加载中...
            </div>
          </div>
          <div className="sidebar-footer">
            <div className="sidebar-footer-avatar">管</div>
            <div>
              <div style={{fontWeight: 500}}>加载中...</div>
            </div>
          </div>
        </div>
      }
    >
      <SidebarContent currentPage={currentPage} />
    </ClientOnly>
  );
}
