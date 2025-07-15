"use client";

import Link from 'next/link';
import { useState } from 'react';
import '../../../styles/admin-login.css';

export default function AdminLoginPage() {
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <div className="login-container">
      {/* 左侧信息区域 */}
      <div className="login-info">
        <div className="info-background"></div>
        <div className="wave"></div>
        <div className="security-badge">
          <i className="ri-shield-check-line"></i> 管理员安全区域
        </div>
        
        <div className="info-content">
          <div className="info-header">
            <div className="logo">浙财</div>
            <div className="brand-name">智能考试系统</div>
          </div>
          
          <div className="info-main">
            <h1 className="info-title fadeIn">系统管理<br/>控制中心</h1>
            <p className="info-description fadeIn delay-1">
              管理员控制中心提供全面的系统管理功能，包括用户管理、题库管理、系统配置和数据分析等核心功能，确保系统安全稳定运行。
            </p>
            
            <div className="info-features fadeIn delay-2">
              <div className="info-feature">
                <div className="feature-icon">
                  <i className="ri-user-settings-line"></i>
                </div>
                <div className="feature-text">
                  <div className="feature-title">用户管理</div>
                  <div className="feature-description">统一管理系统用户</div>
                </div>
              </div>
              
              <div className="info-feature">
                <div className="feature-icon">
                  <i className="ri-database-2-line"></i>
                </div>
                <div className="feature-text">
                  <div className="feature-title">题库管理</div>
                  <div className="feature-description">维护系统题库资源</div>
                </div>
              </div>
              
              <div className="info-feature">
                <div className="feature-icon">
                  <i className="ri-settings-line"></i>
                </div>
                <div className="feature-text">
                  <div className="feature-title">系统配置</div>
                  <div className="feature-description">配置系统核心参数</div>
                </div>
              </div>
              
              <div className="info-feature">
                <div className="feature-icon">
                  <i className="ri-computer-line"></i>
                </div>
                <div className="feature-text">
                  <div className="feature-title">系统监控</div>
                  <div className="feature-description">确保系统稳定运行</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="info-footer fadeIn delay-3">
            <div>© 2023 浙江财经大学</div>
            <div className="footer-links">
              <a href="#" className="footer-link">管理员手册</a>
              <a href="#" className="footer-link">技术支持</a>
              <a href="#" className="footer-link">联系我们</a>
            </div>
          </div>
        </div>
      </div>
      
      {/* 右侧登录表单 */}
      <div className="login-form-container">
        <div className="login-form-wrapper">
          <div className="login-form-header fadeIn">
            <h2 className="login-form-title">管理员登录</h2>
            <p className="login-form-subtitle">访问系统管理控制中心</p>
          </div>
          
          <form action="/admin/index" className="fadeIn delay-1">
            <div className="input-group">
              <i className="input-icon ri-user-line"></i>
              <input type="text" className="form-control" placeholder="管理员账号" />
            </div>
            
            <div className="input-group">
              <i className="input-icon ri-lock-line"></i>
              <input type="password" className="form-control" placeholder="管理员密码" />
            </div>
            
            <div className="input-group">
              <i className="input-icon ri-shield-keyhole-line"></i>
              <input type="text" className="form-control" placeholder="安全验证码" />
            </div>
            
            <div className="login-options">
              <div className="remember-me">
                <input 
                  type="checkbox" 
                  id="remember" 
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <label htmlFor="remember">记住我</label>
              </div>
              
              <a href="#" className="forgot-password">忘记密码?</a>
            </div>
            
            <button type="submit" className="btn btn-primary fadeIn delay-2">安全登录</button>
          </form>
          
          <div className="login-footer fadeIn delay-3">
            <div className="user-types">
              <Link href="/login" className="user-type-link">学生登录</Link>
              <span>|</span>
              <Link href="/teacher/login" className="user-type-link">教师登录</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 