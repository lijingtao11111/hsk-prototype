"use client";

import { useState, useEffect } from 'react';
import AdminAuthGuard from '../../../components/AdminAuthGuard';
import AdminSidebar from '../../../components/AdminSidebar';
import { adminApiRequest } from '../../../lib/auth/client';
import '../../../styles/admin-index.css';

export default function AdminIndexPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('过去30天');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 获取仪表板数据
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await adminApiRequest('/api/admin/dashboard');
      const result = await response.json();

      if (result.success) {
        setDashboardData(result.data);
      } else {
        console.error('获取仪表板数据失败:', result.error);
        // 使用模拟数据作为fallback
        setDashboardData(getMockDashboardData());
      }
    } catch (error) {
      console.error('获取仪表板数据失败:', error);
      // 使用模拟数据作为fallback
      setDashboardData(getMockDashboardData());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [selectedPeriod]);

  // 模拟数据函数
  const getMockDashboardData = () => ({
    stats: {
      totalUsers: 528,
      activeSubjects: 12,
      totalQuestions: 4382,
      averageAccuracy: 76,
      userGrowth: 15,
      subjectGrowth: 2,
      questionGrowth: 324,
      accuracyGrowth: 3
    },
    recentActivities: [
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
      }
    ],
    systemStatus: {
      serverStatus: 'normal',
      databaseStatus: 'normal',
      cacheStatus: 'normal',
      storageUsage: 68
    }
  });

  // 从API数据或模拟数据中获取统计信息
  const getStatsData = () => {
    if (!dashboardData) return [];

    const { stats } = dashboardData;

    return [
      {
        icon: 'ri-user-line',
        iconClass: 'users',
        value: stats.totalUsers.toLocaleString(),
        label: '总用户数',
        change: `+${stats.userGrowth}%`,
        changeType: 'positive',
        changeText: '较上周'
      },
      {
        icon: 'ri-book-open-line',
        iconClass: 'subjects',
        value: stats.activeSubjects.toString(),
        label: '活跃学科',
        change: `+${stats.subjectGrowth}`,
        changeType: 'positive',
        changeText: '较上周'
      },
      {
        icon: 'ri-question-answer-line',
        iconClass: 'questions',
        value: stats.totalQuestions.toLocaleString(),
        label: '题库规模',
        change: `+${stats.questionGrowth}`,
        changeType: 'positive',
        changeText: '较上周'
      },
      {
        icon: 'ri-line-chart-line',
        iconClass: 'accuracy',
        value: `${stats.averageAccuracy}%`,
        label: '平均正确率',
        change: `+${stats.accuracyGrowth}%`,
        changeType: 'positive',
        changeText: '较上周'
      }
    ];
  };

  const statsData = dashboardData ? getStatsData() : [];

  // 从API数据或模拟数据中获取最近活动
  const getRecentActivities = () => {
    if (!dashboardData) return [];
    return dashboardData.recentActivities;
  };

  // 获取系统状态
  const getSystemStatus = () => {
    if (!dashboardData) return { serverStatus: 'normal', databaseStatus: 'normal', cacheStatus: 'normal', storageUsage: 0 };
    return dashboardData.systemStatus;
  };

  // 计算出实际使用的数据
  const recentActivities = dashboardData ? getRecentActivities() : [];
  const systemStatus = dashboardData ? getSystemStatus() : {};

  return (
    <AdminAuthGuard>
      <div className="admin-layout">
        {/* 侧边栏 */}
        <AdminSidebar currentPage="index" />

        {/* 主内容区域 */}
        <div className="main-content">
          <div className="topbar">
            <h1 className="page-title">系统概览</h1>
          </div>
        
        {/* 统计卡片 */}
        <div className="stats-grid">
          {loading ? (
            // 加载状态
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="stat-card">
                <div className="stat-icon loading">
                  <div className="loading-placeholder"></div>
                </div>
                <div className="stat-value loading">加载中...</div>
                <span className="stat-label">数据加载中</span>
                <div className="stat-change">
                  <span>--</span>
                </div>
              </div>
            ))
          ) : (
            // 实际数据
            statsData.map((stat, index) => (
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
            ))
          )}
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
                  {loading ? (
                    // 加载状态
                    Array.from({ length: 3 }).map((_, index) => (
                      <tr key={index}>
                        <td>
                          <div className="activity-user">
                            <div className="activity-avatar loading">-</div>
                            <div>
                              <div className="activity-name loading">加载中...</div>
                              <div className="activity-role loading">--</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="activity-description loading">数据加载中...</div>
                        </td>
                        <td>
                          <span className="activity-status loading">--</span>
                        </td>
                        <td>
                          <div className="activity-time loading">--</div>
                        </td>
                      </tr>
                    ))
                  ) : recentActivities.length === 0 ? (
                    // 无数据状态
                    <tr>
                      <td colSpan={4} style={{textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)'}}>
                        暂无最近活动
                      </td>
                    </tr>
                  ) : (
                    // 实际数据
                    recentActivities.map((activity: any) => (
                      <tr key={activity.id}>
                        <td>
                          <div className="activity-user">
                            <div className="activity-avatar">{activity.user.avatar}</div>
                            <div>
                              <div className="activity-name">{activity.user.name}</div>
                              <div className="activity-role">{activity.user.role}</div>
                            </div>
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
                  )))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    </AdminAuthGuard>
  );
}
