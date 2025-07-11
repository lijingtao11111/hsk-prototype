"use client";

import Link from 'next/link';
import { useState } from 'react';
import '../../../styles/teacher-login.css';

export default function TeacherLoginPage() {
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
            <h1 className="info-title fadeIn">教师管理<br/>平台</h1>
            <p className="info-description fadeIn delay-1">
              为教师提供高效便捷的教学管理工具，支持题目审核、学生进度跟踪和智能教学辅助功能，让教学管理更加智能化。
            </p>
            
            <div className="info-features fadeIn delay-2">
              <div className="info-feature">
                <div className="feature-icon">
                  <i className="ri-file-list-3-line"></i>
                </div>
                <div className="feature-text">
                  <div className="feature-title">题目审核</div>
                  <div className="feature-description">审核AI生成的题目</div>
                </div>
              </div>
              
              <div className="info-feature">
                <div className="feature-icon">
                  <i className="ri-line-chart-line"></i>
                </div>
                <div className="feature-text">
                  <div className="feature-title">学生进度</div>
                  <div className="feature-description">实时监控学习情况</div>
                </div>
              </div>
              
              <div className="info-feature">
                <div className="feature-icon">
                  <i className="ri-upload-cloud-line"></i>
                </div>
                <div className="feature-text">
                  <div className="feature-title">试卷上传</div>
                  <div className="feature-description">AI解析试卷内容</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="info-footer fadeIn delay-3">
            <div>© 2023 浙江财经大学</div>
            <div className="footer-links">
              <a href="#" className="footer-link">教师手册</a>
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
            <h2 className="login-form-title">教师登录</h2>
            <p className="login-form-subtitle">访问智能考试系统教师端</p>
          </div>
          
          <form action="/teacher/student-progress" className="fadeIn delay-1">
            <div className="input-group">
              <i className="input-icon ri-user-line"></i>
              <input type="text" className="form-control" placeholder="请输入教师工号" />
            </div>
            
            <div className="input-group">
              <i className="input-icon ri-lock-line"></i>
              <input type="password" className="form-control" placeholder="请输入密码" />
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
            <div className="user-types">
              <Link href="/home" className="user-type-link">返回首页</Link>
              <span>|</span>
              <Link href="/admin/login" className="user-type-link">管理员登录</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 