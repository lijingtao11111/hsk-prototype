"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import '../../styles/profile.css';
import '../../styles/profile-override.css'; // 引入覆盖样式
import Navbar from '../../components/Navbar';
import PageInitializer from '../../components/PageInitializer';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('info');
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    document.documentElement.style.setProperty('--avatar-size', '2.2rem');
    document.documentElement.style.setProperty('--avatar-margin', '0.6rem');
    document.documentElement.style.setProperty('--title-font-size', '0.95rem');
    document.documentElement.style.setProperty('--title-margin', '0.15rem');
    document.documentElement.style.setProperty('--subtitle-font-size', '0.7rem');
    document.documentElement.style.setProperty('--subtitle-margin', '0.1rem');
    document.documentElement.style.setProperty('--role-font-size', '0.65rem');
    document.documentElement.style.setProperty('--role-padding', '0.1rem 0.3rem');
    
    const applyForcedStyles = () => {
      if (window.innerWidth <= 768) {
        // 添加强制样式到CSS
        const styleEl = document.createElement('style');
        styleEl.id = 'profile-forced-styles';
        // 移除旧样式（如果存在）
        const oldStyle = document.getElementById('profile-forced-styles');
        if (oldStyle) {
          oldStyle.remove();
        }
        
        // 添加新样式
        document.head.appendChild(styleEl);
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
    
    // 监听路由变化，确保在页面切换后样式保持一致
    const handleRouteChange = () => {
      setTimeout(applyForcedStyles, 0);
    };
    
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('resize', applyForcedStyles);
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);
  
  // 添加标签切换处理函数，确保在切换标签时也应用样式
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  // 如果组件还没挂载完成，显示占位内容但保持完整结构
  if (!mounted) {
    return (
      <div className="profile-container" style={{ visibility: 'hidden' }}>
        <PageInitializer cssPath="/profile.css" />
        <Navbar />
        <section className="profile-header">
          <div className="profile-pattern"></div>
          <div className="container profile-content"></div>
        </section>
        <div className="container">
          <div className="profile-tabs"></div>
          <div className="tab-content"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* 确保页面样式正确加载 */}
      <PageInitializer cssPath="/profile.css" />
      
      {/* 使用全局导航栏 */}
      <Navbar />
      
      {/* 个人资料头部 */}
      <section className="profile-header">
        <div className="profile-pattern"></div>
        
        <div className="container profile-content">
          <div className="avatar">
            <img src="https://api.dicebear.com/7.x/lorelei/svg?seed=John" alt="头像" />
          </div>
          
          <div>
            <h1 style={{fontSize: isMobile ? '0.95rem' : '1.75rem', fontWeight: 'bold', marginBottom: isMobile ? '0.15rem' : '0.25rem'}}>李明</h1>
            <p style={{opacity: 0.9, marginBottom: isMobile ? '0.1rem' : '0.25rem', fontSize: isMobile ? '0.7rem' : 'inherit'}}>学号: 2023001001</p>
            <span className="user-role" style={{fontSize: isMobile ? '0.65rem' : '0.75rem', padding: isMobile ? '0.1rem 0.3rem' : '0.25rem 0.75rem'}}>学生用户</span>
          </div>
        </div>
      </section>
      
      {/* 主体内容 */}
      <div className="container" style={{paddingBottom: isMobile ? 0 : ''}}>
        {/* 个人中心标签 */}
        <div className="profile-tabs">
          <div 
            className={`profile-tab ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => handleTabChange('info')}
          >
            个人信息
          </div>
          <div 
            className={`profile-tab ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => handleTabChange('stats')}
          >
            学习统计
          </div>
          <div 
            className={`profile-tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => handleTabChange('settings')}
          >
            系统设置
          </div>
        </div>
        
        {/* 个人信息标签页 */}
        <div className={`tab-content ${activeTab === 'info' ? 'active' : ''}`} id="info" style={{paddingBottom: isMobile ? '100px' : ''}}>
          <div className="card">
            <h2 style={{fontSize: isMobile ? '1rem' : '1.25rem', fontWeight: 600, marginBottom: isMobile ? '0.5rem' : '1.5rem'}}>基本信息</h2>
            
            <div className="row">
              <div className="col">
                <div className="form-group">
                  <label className="form-label" style={{fontSize: isMobile ? '0.75rem' : '0.875rem', marginBottom: isMobile ? '0.25rem' : '0.5rem'}}>姓名</label>
                  <input type="text" className="form-control" value="李明" disabled style={{padding: isMobile ? '0.5rem 0.75rem' : '0.75rem 1rem', fontSize: isMobile ? '0.875rem' : '1rem'}} />
                </div>
              </div>
              
              <div className="col">
                <div className="form-group">
                  <label className="form-label" style={{fontSize: isMobile ? '0.75rem' : '0.875rem', marginBottom: isMobile ? '0.25rem' : '0.5rem'}}>学号</label>
                  <input type="text" className="form-control" value="2023001001" disabled style={{padding: isMobile ? '0.5rem 0.75rem' : '0.75rem 1rem', fontSize: isMobile ? '0.875rem' : '1rem'}} />
                </div>
              </div>
            </div>
            
            <div className="row">
              <div className="col">
                <div className="form-group">
                  <label className="form-label" style={{fontSize: isMobile ? '0.75rem' : '0.875rem', marginBottom: isMobile ? '0.25rem' : '0.5rem'}}>专业</label>
                  <input type="text" className="form-control" value="计算机科学与技术" disabled style={{padding: isMobile ? '0.5rem 0.75rem' : '0.75rem 1rem', fontSize: isMobile ? '0.875rem' : '1rem'}} />
                </div>
              </div>
              
              <div className="col">
                <div className="form-group">
                  <label className="form-label" style={{fontSize: isMobile ? '0.75rem' : '0.875rem', marginBottom: isMobile ? '0.25rem' : '0.5rem'}}>年级</label>
                  <input type="text" className="form-control" value="2023级" disabled style={{padding: isMobile ? '0.5rem 0.75rem' : '0.75rem 1rem', fontSize: isMobile ? '0.875rem' : '1rem'}} />
                </div>
              </div>
            </div>
            
            <div className="row">
              <div className="col">
                <div className="form-group">
                  <label className="form-label" style={{fontSize: isMobile ? '0.75rem' : '0.875rem', marginBottom: isMobile ? '0.25rem' : '0.5rem'}}>学院</label>
                  <input type="text" className="form-control" value="计算机学院" disabled style={{padding: isMobile ? '0.5rem 0.75rem' : '0.75rem 1rem', fontSize: isMobile ? '0.875rem' : '1rem'}} />
                </div>
              </div>
              
              <div className="col">
                <div className="form-group">
                  <label className="form-label" style={{fontSize: isMobile ? '0.75rem' : '0.875rem', marginBottom: isMobile ? '0.25rem' : '0.5rem'}}>班级</label>
                  <input type="text" className="form-control" value="计科2301班" disabled style={{padding: isMobile ? '0.5rem 0.75rem' : '0.75rem 1rem', fontSize: isMobile ? '0.875rem' : '1rem'}} />
                </div>
              </div>
            </div>
          </div>
          
          <div className="card" style={{marginTop: isMobile ? '0.5rem' : '1.5rem'}}>
            <h2 style={{fontSize: isMobile ? '1rem' : '1.25rem', fontWeight: 600, marginBottom: isMobile ? '0.5rem' : '1.5rem'}}>学习专业</h2>
            
            <div className="row" style={{marginBottom: isMobile ? '0.5rem' : '1rem'}}>
              <div className="col">
                <div style={{display: 'flex', alignItems: 'center', padding: isMobile ? '0.5rem' : '1rem', border: '1px solid var(--border)', borderRadius: '0.5rem'}}>
                  <div style={{width: isMobile ? '2rem' : '3rem', height: isMobile ? '2rem' : '3rem', backgroundColor: '#e0e7ff', borderRadius: '0.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: isMobile ? '0.5rem' : '1rem', color: 'var(--primary)'}}>
                    <i className="ri-translate" style={{fontSize: isMobile ? '1rem' : '1.5rem'}}></i>
                  </div>
                  
                  <div style={{flex: 1}}>
                    <h3 style={{fontWeight: 600, marginBottom: isMobile ? '0.15rem' : '0.25rem', fontSize: isMobile ? '0.875rem' : 'inherit'}}>HSK四级</h3>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <span style={{color: 'var(--text-secondary)', fontSize: isMobile ? '0.7rem' : '0.875rem'}}>主要学科</span>
                      <span style={{color: 'var(--primary)', fontSize: isMobile ? '0.7rem' : '0.875rem', fontWeight: 600}}>75% 完成</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col">
                <div style={{display: 'flex', alignItems: 'center', padding: isMobile ? '0.5rem' : '1rem', border: '1px solid var(--border)', borderRadius: '0.5rem'}}>
                  <div style={{width: isMobile ? '2rem' : '3rem', height: isMobile ? '2rem' : '3rem', backgroundColor: '#e0e7ff', borderRadius: '0.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: isMobile ? '0.5rem' : '1rem', color: 'var(--primary)'}}>
                    <i className="ri-english-input" style={{fontSize: isMobile ? '1rem' : '1.5rem'}}></i>
                  </div>
                  
                  <div style={{flex: 1}}>
                    <h3 style={{fontWeight: 600, marginBottom: isMobile ? '0.15rem' : '0.25rem', fontSize: isMobile ? '0.875rem' : 'inherit'}}>大学英语四级</h3>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <span style={{color: 'var(--text-secondary)', fontSize: isMobile ? '0.7rem' : '0.875rem'}}>次要学科</span>
                      <span style={{color: 'var(--primary)', fontSize: isMobile ? '0.7rem' : '0.875rem', fontWeight: 600}}>45% 完成</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <Link href="/subjects" className="btn btn-outline" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '0.35rem 0.5rem' : '0.5rem 0.75rem', fontSize: isMobile ? '0.8rem' : '0.875rem'}}>
              <i className="ri-add-line" style={{marginRight: '0.5rem'}}></i> 添加学习专业
            </Link>
          </div>
        </div>
        
        {/* 学习统计标签页 */}
        <div className={`tab-content ${activeTab === 'stats' ? 'active' : ''}`} id="stats" style={{paddingBottom: isMobile ? '100px' : ''}}>
          <div className="row">
            <div className="col">
              <div className="card">
                <h3 style={{fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem'}}>学习时长统计</h3>
                
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem'}}>
                  <div>
                    <span style={{color: 'var(--text-secondary)', fontSize: '0.875rem'}}>本周学习时长</span>
                    <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)'}}>7.5小时</div>
                  </div>
                  
                  <div>
                    <span style={{color: 'var(--text-secondary)', fontSize: '0.875rem'}}>较上周</span>
                    <div style={{fontSize: '1rem', fontWeight: 'bold', color: '#10b981', display: 'flex', alignItems: 'center'}}>
                      <i className="ri-arrow-up-line" style={{marginRight: '0.25rem'}}></i> 15%
                    </div>
                  </div>
                </div>
                
                <div className="chart-container">
                  <div className="chart-placeholder">
                    <div style={{textAlign: 'center'}}>
                      <i className="ri-line-chart-line" style={{fontSize: '3rem', marginBottom: '0.5rem'}}></i>
                      <div>每日学习时长图表</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col">
              <div className="card">
                <h3 style={{fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem'}}>练习题量统计</h3>
                
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem'}}>
                  <div>
                    <span style={{color: 'var(--text-secondary)', fontSize: '0.875rem'}}>本周练习题量</span>
                    <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)'}}>320题</div>
                  </div>
                  
                  <div>
                    <span style={{color: 'var(--text-secondary)', fontSize: '0.875rem'}}>准确率</span>
                    <div style={{fontSize: '1rem', fontWeight: 'bold', color: '#3b82f6'}}>78%</div>
                  </div>
                </div>
                
                <div className="chart-container">
                  <div className="chart-placeholder">
                    <div style={{textAlign: 'center'}}>
                      <i className="ri-bar-chart-grouped-line" style={{fontSize: '3rem', marginBottom: '0.5rem'}}></i>
                      <div>每日练习量统计图表</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="card" style={{marginTop: '1.5rem'}}>
            <h3 style={{fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem'}}>学科进度</h3>
            
            <div style={{marginBottom: '1.5rem'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                <div>
                  <span style={{fontWeight: 500}}>HSK四级</span>
                  <span style={{color: 'var(--text-secondary)', fontSize: '0.875rem', marginLeft: '0.5rem'}}>1875 / 2500 题</span>
                </div>
                <span style={{fontWeight: 500}}>75%</span>
              </div>
              
              <div className="progress-container">
                <div className="progress-bar" style={{width: '75%'}}></div>
              </div>
            </div>
            
            <div style={{marginBottom: '1.5rem'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                <div>
                  <span style={{fontWeight: 500}}>大学英语四级</span>
                  <span style={{color: 'var(--text-secondary)', fontSize: '0.875rem', marginLeft: '0.5rem'}}>2250 / 5000 题</span>
                </div>
                <span style={{fontWeight: 500}}>45%</span>
              </div>
              
              <div className="progress-container">
                <div className="progress-bar" style={{width: '45%'}}></div>
              </div>
            </div>
            
            <div>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                <div>
                  <span style={{fontWeight: 500}}>高等数学</span>
                  <span style={{color: 'var(--text-secondary)', fontSize: '0.875rem', marginLeft: '0.5rem'}}>360 / 1800 题</span>
                </div>
                <span style={{fontWeight: 500}}>20%</span>
              </div>
              
              <div className="progress-container">
                <div className="progress-bar" style={{width: '20%'}}></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 系统设置标签页 */}
        <div className={`tab-content ${activeTab === 'settings' ? 'active' : ''}`} id="settings" style={{paddingBottom: isMobile ? '100px' : ''}}>
          <div className="card">
            <h3 style={{fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem'}}>应用设置</h3>
            
            <div className="settings-item">
              <div>
                <div style={{fontWeight: 500}}>深色模式</div>
                <div style={{color: 'var(--text-secondary)', fontSize: '0.875rem'}}>切换应用的显示主题</div>
              </div>
              <div className="toggle-switch">
                <input type="checkbox" id="theme-toggle" />
                <label htmlFor="theme-toggle"></label>
              </div>
            </div>
            
            <div className="settings-item">
              <div>
                <div style={{fontWeight: 500}}>推送通知</div>
                <div style={{color: 'var(--text-secondary)', fontSize: '0.875rem'}}>接收学习提醒和新内容通知</div>
              </div>
              <div className="toggle-switch">
                <input type="checkbox" id="notification-toggle" checked />
                <label htmlFor="notification-toggle"></label>
              </div>
            </div>
            
            <div className="settings-item">
              <div>
                <div style={{fontWeight: 500}}>学习目标提醒</div>
                <div style={{color: 'var(--text-secondary)', fontSize: '0.875rem'}}>设置每日学习目标完成提醒</div>
              </div>
              <div className="toggle-switch">
                <input type="checkbox" id="goal-toggle" checked />
                <label htmlFor="goal-toggle"></label>
              </div>
            </div>
          </div>
          
          <div className="card" style={{marginTop: '1.5rem'}}>
            <h3 style={{fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem'}}>账号设置</h3>
            
            <div className="settings-item">
              <div>
                <div style={{fontWeight: 500}}>修改密码</div>
                <div style={{color: 'var(--text-secondary)', fontSize: '0.875rem'}}>更新您的账号密码</div>
              </div>
              <button className="btn btn-sm btn-outline">修改</button>
            </div>
            
            <div className="settings-item">
              <div>
                <div style={{fontWeight: 500}}>绑定手机</div>
                <div style={{color: 'var(--text-secondary)', fontSize: '0.875rem'}}>已绑定：138****5678</div>
              </div>
              <button className="btn btn-sm btn-outline">更换</button>
            </div>
            
            <div className="settings-item">
              <div>
                <div style={{fontWeight: 500}}>退出登录</div>
                <div style={{color: 'var(--text-secondary)', fontSize: '0.875rem'}}>安全退出当前账号</div>
              </div>
              <button className="btn btn-sm btn-outline" style={{color: '#ef4444', borderColor: '#ef4444'}}>退出</button>
            </div>
          </div>
        </div>
      </div>
      
      {/* 移动端底部导航 */}
      <nav className="mobile-navbar">
        <ul className="mobile-navbar-menu">
          <li className="mobile-navbar-item">
            <Link href="/home" className="mobile-navbar-link">
              <i className="mobile-navbar-icon ri-home-4-line"></i>
              <span>首页</span>
            </Link>
          </li>
          <li className="mobile-navbar-item">
            <Link href="/subjects" className="mobile-navbar-link">
              <i className="mobile-navbar-icon ri-book-open-line"></i>
              <span>学科</span>
            </Link>
          </li>
          <li className="mobile-navbar-item">
            <Link href="/wrong-questions" className="mobile-navbar-link">
              <i className="mobile-navbar-icon ri-error-warning-line"></i>
              <span>错题本</span>
            </Link>
          </li>
          <li className="mobile-navbar-item">
            <Link href="/profile" className="mobile-navbar-link active">
              <i className="mobile-navbar-icon ri-user-line"></i>
              <span>我的</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
} 