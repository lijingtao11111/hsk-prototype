"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import '../../styles/history.css';

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState('all');
  
  // 处理移动端底部导航激活状态
  useEffect(() => {
    const currentPath = window.location.pathname;
    
    document.querySelectorAll('.mobile-navbar-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPath) {
        link.classList.add('active');
      }
    });
  }, []);

  // 模拟历史记录数据
  const historyData = {
    stats: {
      totalPractices: 45,
      totalHours: 12.5,
      averageAccuracy: '78%',
      streak: 5,
      weeklyHours: 4.5,
      weeklyQuestions: 218,
      weeklyAccuracy: '82%'
    },
    records: [
      {
        id: '202306150001',
        title: 'HSK四级 - 2023年6月真题',
        date: '2023-06-15 10:30',
        subject: { name: 'HSK四级', type: 'hsk' },
        score: '85/100',
        time: '45分钟',
        questions: '50题',
        accuracy: '85%'
      },
      {
        id: '202306140002',
        title: '大学英语四级 - 词汇专项训练',
        date: '2023-06-14 15:45',
        subject: { name: 'CET-4', type: 'cet' },
        score: '72/100',
        time: '30分钟',
        questions: '40题',
        accuracy: '72%'
      },
      {
        id: '202306120003',
        title: '高等数学 - 微积分基础',
        date: '2023-06-12 20:15',
        subject: { name: '数学', type: 'math' },
        score: '68/100',
        time: '60分钟',
        questions: '25题',
        accuracy: '68%'
      }
    ]
  };

  return (
    <>
      {/* 导航栏 */}
      <nav className="navbar">
        <div className="container navbar-container">
          <Link href="/home" className="navbar-brand">智能考试系统</Link>
          
          <ul className="navbar-menu">
            <li className="navbar-item"><Link href="/home" className="navbar-link">首页</Link></li>
            <li className="navbar-item"><Link href="/subjects" className="navbar-link">学科选择</Link></li>
            <li className="navbar-item"><Link href="/wrong-questions" className="navbar-link">错题本</Link></li>
            <li className="navbar-item"><Link href="/profile" className="navbar-link">个人中心</Link></li>
          </ul>
        </div>
      </nav>
      
      {/* 练习记录头部 */}
      <section className="history-header">
        <div className="history-pattern"></div>
        
        <div className="container history-content">
          <h1 style={{fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.5rem'}}>练习记录</h1>
          <p style={{opacity: 0.9}}>查看你的练习历史和学习统计</p>
          
          <div style={{display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1.5rem'}}>
            <div style={{backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', backdropFilter: 'blur(4px)'}}>
              <div style={{fontSize: '0.875rem', opacity: 0.8}}>总练习次数</div>
              <div style={{fontSize: '1.5rem', fontWeight: 'bold'}}>{historyData.stats.totalPractices}</div>
            </div>
            
            <div style={{backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', backdropFilter: 'blur(4px)'}}>
              <div style={{fontSize: '0.875rem', opacity: 0.8}}>总练习时长</div>
              <div style={{fontSize: '1.5rem', fontWeight: 'bold'}}>{historyData.stats.totalHours}小时</div>
            </div>
            
            <div style={{backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', backdropFilter: 'blur(4px)'}}>
              <div style={{fontSize: '0.875rem', opacity: 0.8}}>平均正确率</div>
              <div style={{fontSize: '1.5rem', fontWeight: 'bold'}}>{historyData.stats.averageAccuracy}</div>
            </div>
          </div>
        </div>
      </section>
      
      <div className="container" style={{padding: '2rem 0 5rem 0'}}>
        {/* 练习统计 */}
        <h2 style={{fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem'}}>练习统计</h2>
        
        <div className="history-stats">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="ri-calendar-check-line"></i>
            </div>
            <div className="stat-label">连续练习</div>
            <div className="stat-value">{historyData.stats.streak}天</div>
            <div style={{fontSize: '0.875rem', color: 'var(--success)'}}>+2天</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <i className="ri-time-line"></i>
            </div>
            <div className="stat-label">本周练习时长</div>
            <div className="stat-value">{historyData.stats.weeklyHours}小时</div>
            <div style={{fontSize: '0.875rem', color: 'var(--success)'}}>+20%</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <i className="ri-question-line"></i>
            </div>
            <div className="stat-label">本周题量</div>
            <div className="stat-value">{historyData.stats.weeklyQuestions}题</div>
            <div style={{fontSize: '0.875rem', color: 'var(--success)'}}>+15%</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <i className="ri-percent-line"></i>
            </div>
            <div className="stat-label">本周正确率</div>
            <div className="stat-value">{historyData.stats.weeklyAccuracy}</div>
            <div style={{fontSize: '0.875rem', color: 'var(--success)'}}>+4%</div>
          </div>
        </div>
        
        {/* 练习趋势图 */}
        <div className="card" style={{marginBottom: '2rem'}}>
          <h3 style={{fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem'}}>练习趋势</h3>
          <div className="chart-container">
            {/* 这里实际项目中会使用图表库，这里用占位符 */}
            <div style={{width: '100%', height: '100%', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)'}}>
              图表区域 - 显示每日练习时长和正确率趋势
            </div>
          </div>
        </div>
        
        {/* 练习记录过滤器 */}
        <div className="filter-tabs">
          <div 
            className={`filter-tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            所有记录
          </div>
          <div 
            className={`filter-tab ${activeTab === 'real' ? 'active' : ''}`}
            onClick={() => setActiveTab('real')}
          >
            真题练习
          </div>
          <div 
            className={`filter-tab ${activeTab === 'specialized' ? 'active' : ''}`}
            onClick={() => setActiveTab('specialized')}
          >
            专项练习
          </div>
          <div 
            className={`filter-tab ${activeTab === 'mock' ? 'active' : ''}`}
            onClick={() => setActiveTab('mock')}
          >
            模拟考试
          </div>
        </div>
        
        {/* 练习记录列表 */}
        <div className="history-list">
          {historyData.records.map((record) => (
            <div className="history-card" key={record.id}>
              <div className="history-card-header">
                <div>
                  <h3 style={{fontWeight: 600, fontSize: '1.125rem'}}>{record.title}</h3>
                  <div style={{color: 'var(--text-secondary)', fontSize: '0.875rem'}}>完成于 {record.date}</div>
                </div>
                <div className={`subject-tag ${record.subject.type}`}>{record.subject.name}</div>
              </div>
              
              <div className="history-card-body">
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '2rem'}}>
                  <div>
                    <div style={{color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem'}}>得分</div>
                    <div style={{fontSize: '1.25rem', fontWeight: 600}}>{record.score}</div>
                  </div>
                  
                  <div>
                    <div style={{color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem'}}>用时</div>
                    <div style={{fontSize: '1.25rem', fontWeight: 600}}>{record.time}</div>
                  </div>
                  
                  <div>
                    <div style={{color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem'}}>题量</div>
                    <div style={{fontSize: '1.25rem', fontWeight: 600}}>{record.questions}</div>
                  </div>
                  
                  <div>
                    <div style={{color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem'}}>正确率</div>
                    <div style={{fontSize: '1.25rem', fontWeight: 600}}>{record.accuracy}</div>
                  </div>
                </div>
              </div>
              
              <div className="history-card-footer">
                <Link href={`/practice-result?id=${record.id}`} className="btn btn-outline">查看详情</Link>
                <Link href={`/practice?type=repeat&id=${record.id}`} className="btn btn-primary">重新练习</Link>
              </div>
            </div>
          ))}
        </div>
        
        {/* 分页按钮 */}
        <div style={{display: 'flex', justifyContent: 'center', marginTop: '2rem'}}>
          <div className="filter-button">上一页</div>
          <div className="filter-button active">1</div>
          <div className="filter-button">2</div>
          <div className="filter-button">3</div>
          <div className="filter-button">下一页</div>
        </div>
      </div>
      
      {/* 移动端底部导航 */}
      <nav className="mobile-navbar">
        <ul className="mobile-navbar-menu">
          <li className="mobile-navbar-item">
            <Link href="/home" className="mobile-navbar-link">
              <i className="ri-home-5-line mobile-navbar-icon"></i>
              <span>首页</span>
            </Link>
          </li>
          <li className="mobile-navbar-item">
            <Link href="/subjects" className="mobile-navbar-link">
              <i className="ri-book-open-line mobile-navbar-icon"></i>
              <span>学科</span>
            </Link>
          </li>
          <li className="mobile-navbar-item">
            <Link href="/wrong-questions" className="mobile-navbar-link">
              <i className="ri-error-warning-line mobile-navbar-icon"></i>
              <span>错题本</span>
            </Link>
          </li>
          <li className="mobile-navbar-item">
            <Link href="/profile" className="mobile-navbar-link">
              <i className="ri-user-line mobile-navbar-icon"></i>
              <span>我的</span>
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
} 