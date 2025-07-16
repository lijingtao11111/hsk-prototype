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
        // 使用默认空数据作为fallback
        setDashboardData(getDefaultDashboardData());
      }
    } catch (error) {
      console.error('获取仪表板数据失败:', error);
      // 使用默认空数据作为fallback
      setDashboardData(getDefaultDashboardData());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [selectedPeriod]);

  // 默认空数据函数 - 当API失败时使用
  const getDefaultDashboardData = () => ({
    stats: {
      totalUsers: 0,
      activeSubjects: 0,
      totalQuestions: 0,
      averageAccuracy: 0,
      userGrowth: 0,
      subjectGrowth: 0,
      questionGrowth: 0,
      accuracyGrowth: 0
    },
    recentActivities: [],
    systemStatus: {
      serverStatus: 'error',
      databaseStatus: 'error',
      cacheStatus: 'error',
      storageUsage: 0
    }
  });

  // 从API数据中获取统计信息
  const getStatsData = () => {
    if (!dashboardData) return [];

    const { stats } = dashboardData;

    return [
      {
        icon: 'ri-user-line',
        iconClass: 'users',
        value: stats.totalUsers ? stats.totalUsers.toLocaleString() : '0',
        label: '总用户数',
        change: stats.userGrowth > 0 ? `+${stats.userGrowth}%` : '0%',
        changeType: stats.userGrowth > 0 ? 'positive' : 'neutral',
        changeText: '较上周'
      },
      {
        icon: 'ri-book-open-line',
        iconClass: 'subjects',
        value: stats.activeSubjects ? stats.activeSubjects.toString() : '0',
        label: '活跃学科',
        change: stats.subjectGrowth > 0 ? `+${stats.subjectGrowth}` : '0',
        changeType: stats.subjectGrowth > 0 ? 'positive' : 'neutral',
        changeText: '较上周'
      },
      {
        icon: 'ri-question-answer-line',
        iconClass: 'questions',
        value: stats.totalQuestions ? stats.totalQuestions.toLocaleString() : '0',
        label: '题库规模',
        change: stats.questionGrowth > 0 ? `+${stats.questionGrowth}` : '0',
        changeType: stats.questionGrowth > 0 ? 'positive' : 'neutral',
        changeText: '较上周'
      },
      {
        icon: 'ri-line-chart-line',
        iconClass: 'accuracy',
        value: stats.averageAccuracy ? `${stats.averageAccuracy}%` : '0%',
        label: '平均正确率',
        change: stats.accuracyGrowth > 0 ? `+${stats.accuracyGrowth}%` : '0%',
        changeType: stats.accuracyGrowth > 0 ? 'positive' : 'neutral',
        changeText: '较上周'
      }
    ];
  };

  // 从API数据中获取最近活动
  const getRecentActivities = () => {
    if (!dashboardData || !dashboardData.recentActivities || dashboardData.recentActivities.length === 0) {
      return [];
    }
    return dashboardData.recentActivities;
  };
  
  // 计算出实际使用的数据
  const statsData = dashboardData ? getStatsData() : [];
  const recentActivities = dashboardData ? getRecentActivities() : [];

  return (
    <AdminAuthGuard>
      <div className="admin-layout">
        <AdminSidebar currentPage="index" />
        
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
                    value={selectedPeriod} 
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="period-selector"
                  >
                    <option value="过去7天">过去7天</option>
                    <option value="过去30天">过去30天</option>
                    <option value="过去90天">过去90天</option>
                  </select>
                </div>
              </div>
              <div className="card-content">
                <div className="chart-placeholder" style={{
                  height: '200px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: '8px',
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
                          </td>
                          <td>{activity.activity}</td>
                          <td>
                            <span className={`activity-status ${activity.status}`}>
                              {activity.statusText}
                            </span>
                          </td>
                          <td className="activity-time">{activity.time}</td>
                        </tr>
                      ))
                    )}
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
