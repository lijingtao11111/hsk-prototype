"use client";

import { useState } from 'react';
import Link from 'next/link';
import '../../../styles/admin-index.css';

export default function AdminIndexPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('过去30天');

  const statsData = [
    {
      icon: 'ri-user-line',
      iconClass: 'users',
      value: '528',
      label: '总用户数',
      change: '+15%',
      changeType: 'positive',
      changeText: '较上周'
    },
    {
      icon: 'ri-book-open-line',
      iconClass: 'subjects',
      value: '12',
      label: '活跃学科',
      change: '+2',
      changeType: 'positive',
      changeText: '较上周'
    },
    {
      icon: 'ri-question-answer-line',
      iconClass: 'questions',
      value: '4,382',
      label: '题库规模',
      change: '+324',
      changeType: 'positive',
      changeText: '较上周'
    },
    {
      icon: 'ri-line-chart-line',
      iconClass: 'accuracy',
      value: '76%',
      label: '平均正确率',
      change: '+3%',
      changeType: 'positive',
      changeText: '较上周'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      user: { name: '王老师', role: '教师', avatar: '王' },
      activity: '上传了HSK四级试卷',
      status: 'completed',
      statusText: '已完成',
      time: '10分钟前'
    },
    {
      id: 2,
      user: { name: '李明', role: '学生', avatar: '李' },
      activity: '完成了HSK四级模拟考试',
      status: 'completed',
      statusText: '已完成',
      time: '35分钟前'
    },
    {
      id: 3,
      user: { name: '周教授', role: '教师', avatar: '周' },
      activity: '审核了15道AI生成题目',
      status: 'pending',
      statusText: '进行中',
      time: '1小时前'
    },
    {
      id: 4,
      user: { name: '张同学', role: '学生', avatar: '张' },
      activity: '提交了错题反馈',
      status: 'completed',
      statusText: '已完成',
      time: '2小时前'
    },
    {
      id: 5,
      user: { name: '系统', role: '系统', avatar: '系' },
      activity: 'AI自动生成了50道新题目',
      status: 'failed',
      statusText: '需审核',
      time: '3小时前'
    }
  ];

  return (
    <div className="admin-layout">
      {/* 侧边栏 */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">Z</div>
          <div className="sidebar-title">浙财智能考试系统</div>
        </div>
        
        <div className="sidebar-menu">
          <div className="sidebar-section">
            <div className="sidebar-section-title">系统管理</div>
            <Link href="/admin/index" className="sidebar-link active">
              <i className="ri-dashboard-line sidebar-icon"></i>
              <span>系统概览</span>
            </Link>
            <Link href="/admin/user-management" className="sidebar-link">
              <i className="ri-user-settings-line sidebar-icon"></i>
              <span>用户管理</span>
            </Link>
            <Link href="/admin/subject-management" className="sidebar-link">
              <i className="ri-book-open-line sidebar-icon"></i>
              <span>学科管理</span>
            </Link>
            <Link href="/admin/question-bank" className="sidebar-link">
              <i className="ri-question-answer-line sidebar-icon"></i>
              <span>题库管理</span>
            </Link>
          </div>
          
          <div className="sidebar-section">
            <Link href="/admin/login" className="sidebar-link">
              <i className="ri-logout-box-line sidebar-icon"></i>
              <span>退出登录</span>
            </Link>
          </div>
        </div>
        
        <div className="sidebar-footer">
          <div className="sidebar-footer-avatar">管</div>
          <div>
            <div style={{fontWeight: 500}}>系统管理员</div>
            <div style={{fontSize: '0.75rem', color: 'var(--text-secondary)'}}>超级管理员</div>
          </div>
        </div>
      </div>
      
      {/* 主内容区域 */}
      <div className="main-content">
        <div className="topbar">
          <h1 className="page-title">系统概览</h1>
        </div>
        
        {/* 统计卡片 */}
        <div className="stats-grid">
          {statsData.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className={`stat-icon ${stat.iconClass}`}>
                <i className={stat.icon}></i>
              </div>
              <div className="stat-value">{stat.value}</div>
              <span className="stat-label">{stat.label}</span>
              <div className={`stat-change ${stat.changeType}`}>
                <i className="ri-arrow-up-line" style={{marginRight: '0.25rem'}}></i>
                <span>{stat.change} {stat.changeText}</span>
              </div>
            </div>
          ))}
        </div>
        
        {/* 图表和活动区域 */}
        <div className="charts-grid">
          {/* 用户活动图表 */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">用户活动趋势</div>
                <div className="card-subtitle">过去30天内的活动统计</div>
              </div>
              <div>
                <select 
                  className="form-select"
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  style={{
                    padding: '0.5rem',
                    border: '1px solid var(--border)',
                    borderRadius: '0.375rem'
                  }}
                >
                  <option>过去30天</option>
                  <option>过去7天</option>
                  <option>过去90天</option>
                </select>
              </div>
            </div>
            <div className="card-content">
              <div style={{
                height: '300px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)'
              }}>
                图表区域 - 在实际应用中这里将显示用户活动趋势图表
              </div>
            </div>
          </div>
          
          {/* 最近活动 */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">最近系统活动</div>
            </div>
            <div className="card-content" style={{padding: 0}}>
              <table className="activity-table">
                <thead>
                  <tr>
                    <th>用户</th>
                    <th>活动</th>
                    <th>状态</th>
                    <th>时间</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivities.map((activity) => (
                    <tr key={activity.id}>
                      <td>
                        <div className="activity-user">
                          <div className="activity-avatar">{activity.user.avatar}</div>
                          <div>
                            <div className="activity-name">{activity.user.name}</div>
                            <div className="activity-role">{activity.user.role}</div>
                          </div>
                        </div>
                      </td>
                      <td>{activity.activity}</td>
                      <td>
                        <span className={`activity-status ${activity.status}`}>
                          {activity.statusText}
                        </span>
                      </td>
                      <td className="activity-time">{activity.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
