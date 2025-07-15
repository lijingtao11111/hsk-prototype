"use client";

import Link from 'next/link';
import { useState } from 'react';
import '../../styles/login.css';

export default function StudentLoginPage() {
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <div className="login-container">
      {/* 左侧信息区域 */}
      <div className="login-info">
        <div className="info-background"></div>
        <div className="wave"></div>
        
        <div className="info-content">
          <div className="info-header">
            <div className="logo">浙财</div>
            <div className="brand-name">智能考试系统</div>
          </div>
          
          <div className="info-main">
            <h1 className="info-title fadeIn">多专业智能<br/>考试练习系统</h1>
            <p className="info-description fadeIn delay-1">
              基于AI技术驱动的智能考试系统，支持多专业多学科，集成浙江财经大学Agent平台AI能力进行试卷解析、错题分析和题目生成，为您的学习提供全方位的智能辅助。
            </p>
            
            <div className="info-features fadeIn delay-2">
              <div className="info-feature">
                <div className="feature-icon">
                  <i className="ri-file-list-3-line"></i>
                </div>
                <div className="feature-text">
                  <div className="feature-title">真题练习</div>
                  <div className="feature-description">历年真题模拟训练</div>
                </div>
              </div>
              
              <div className="info-feature">
                <div className="feature-icon">
                  <i className="ri-error-warning-line"></i>
                </div>
                <div className="feature-text">
                  <div className="feature-title">智能错题本</div>
                  <div className="feature-description">AI分析薄弱知识点</div>
                </div>
              </div>
              
              <div className="info-feature">
                <div className="feature-icon">
                  <i className="ri-robot-line"></i>
                </div>
                <div className="feature-text">
                  <div className="feature-title">AI题目生成</div>
                  <div className="feature-description">个性化练习题定制</div>
                </div>
              </div>
              
              <div className="info-feature">
                <div className="feature-icon">
                  <i className="ri-bar-chart-grouped-line"></i>
                </div>
                <div className="feature-text">
                  <div className="feature-title">学习分析</div>
                  <div className="feature-description">详细数据统计报告</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="info-footer fadeIn delay-3">
            <div>© 2023 浙江财经大学</div>
            <div className="footer-links">
              <a href="#" className="footer-link">关于我们</a>
              <a href="#" className="footer-link">使用帮助</a>
              <a href="#" className="footer-link">联系我们</a>
            </div>
          </div>
        </div>
      </div>
      
      {/* 右侧登录表单 */}
      <div className="login-form-container">
        <div className="login-form-wrapper">
          <div className="login-form-header fadeIn">
            <h2 className="login-form-title">欢迎使用</h2>
            <p className="login-form-subtitle">请登录您的账号继续</p>
          </div>
          
          <form action="/home" className="fadeIn delay-1">
            <div className="input-group">
              <i className="input-icon ri-user-line"></i>
              <input type="text" className="form-control" placeholder="学号/工号" />
            </div>
            
            <div className="input-group">
              <i className="input-icon ri-lock-line"></i>
              <input type="password" className="form-control" placeholder="密码" />
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
            
            <button type="submit" className="btn btn-primary fadeIn delay-2">登 录</button>
          </form>
          
          <div className="login-footer fadeIn delay-3">
            <div>其他身份登录</div>
            <div className="user-types">
              <Link href="/teacher/login" className="user-type-link">教师登录</Link>
              <span>|</span>
              <Link href="/admin/login" className="user-type-link">管理员登录</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
