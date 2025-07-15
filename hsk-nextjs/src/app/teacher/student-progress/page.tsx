"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import '../../../styles/teacher-student-progress.css';

export default function StudentProgressPage() {
  const [activeFilter, setActiveFilter] = useState({
    major: 'all',
    class: 'all',
    subject: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const students = [
    {
      id: 1,
      name: '王小明',
      avatar: '王',
      studentId: '2023001001',
      class: '计科2301班',
      progress: 78,
      accuracy: 91.5,
      lastPractice: '今天 14:30',
      accuracyLevel: 'high'
    },
    {
      id: 2,
      name: '李华',
      avatar: '李',
      studentId: '2023001002',
      class: '计科2301班',
      progress: 62,
      accuracy: 75.3,
      lastPractice: '昨天 16:45',
      accuracyLevel: 'medium'
    },
    {
      id: 3,
      name: '张三',
      avatar: '张',
      studentId: '2023002001',
      class: '计科2302班',
      progress: 45,
      accuracy: 58.7,
      lastPractice: '3天前',
      accuracyLevel: 'low'
    },
    {
      id: 4,
      name: '赵丽',
      avatar: '赵',
      studentId: '2023002002',
      class: '计科2302班',
      progress: 83,
      accuracy: 88.2,
      lastPractice: '今天 09:15',
      accuracyLevel: 'high'
    },
    {
      id: 5,
      name: '陈明',
      avatar: '陈',
      studentId: '2023001003',
      class: '计科2301班',
      progress: 29,
      accuracy: 42.8,
      lastPractice: '1周前',
      accuracyLevel: 'low'
    }
  ];

  const handleFilterChange = (type, value) => {
    setActiveFilter(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleStudentView = (student) => {
    setSelectedStudent(student);
  };

  const closeStudentDetail = () => {
    setSelectedStudent(null);
  };

  return (
    <div className="teacher-layout">
      {/* 侧边栏 */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">Z</div>
          <div className="sidebar-title">浙财智能考试系统</div>
        </div>
        
        <div className="sidebar-menu">
          <div className="sidebar-section">
            <div className="sidebar-section-title">教学管理</div>
            <Link href="/teacher/student-progress" className="sidebar-link active">
              <i className="ri-line-chart-line sidebar-icon"></i>
              <span>学生进度</span>
            </Link>
            <Link href="/teacher/question-review" className="sidebar-link">
              <i className="ri-file-list-3-line sidebar-icon"></i>
              <span>题目审核</span>
            </Link>
            <Link href="/teacher/paper-upload" className="sidebar-link">
              <i className="ri-upload-cloud-line sidebar-icon"></i>
              <span>试卷上传</span>
            </Link>
          </div>
          
          <div className="sidebar-section">
            <div className="sidebar-section-title">账户</div>
            <Link href="/teacher/login" className="sidebar-link">
              <i className="ri-logout-box-line sidebar-icon"></i>
              <span>退出登录</span>
            </Link>
          </div>
        </div>
        
        <div className="sidebar-footer">
          <div className="sidebar-footer-avatar">李</div>
          <div>
            <div style={{fontWeight: 500}}>李教授</div>
            <div style={{fontSize: '0.75rem', color: 'var(--text-secondary)'}}>计算机学院</div>
          </div>
        </div>
      </div>
      
      {/* 主内容区域 */}
      <div className="main-content">
        <div className="topbar">
          <h1 className="page-title">学生进度</h1>
        </div>
        
        <div className="dashboard-container">
          {/* 筛选栏 */}
          <div className="filter-section">
            <div className="filter-form">
              <div className="filter-group">
                <label className="filter-label">专业</label>
                <select 
                  className="filter-select"
                  value={activeFilter.major}
                  onChange={(e) => handleFilterChange('major', e.target.value)}
                >
                  <option value="all">全部专业</option>
                  <option value="cs">计算机科学</option>
                  <option value="finance">金融学</option>
                  <option value="accounting">会计学</option>
                  <option value="economics">经济学</option>
                </select>
              </div>
              <div className="filter-group">
                <label className="filter-label">班级</label>
                <select 
                  className="filter-select"
                  value={activeFilter.class}
                  onChange={(e) => handleFilterChange('class', e.target.value)}
                >
                  <option value="all">全部班级</option>
                  <option value="2301">2301班</option>
                  <option value="2302">2302班</option>
                  <option value="2303">2303班</option>
                </select>
              </div>
              <div className="filter-group">
                <label className="filter-label">学科</label>
                <select 
                  className="filter-select"
                  value={activeFilter.subject}
                  onChange={(e) => handleFilterChange('subject', e.target.value)}
                >
                  <option value="all">全部学科</option>
                  <option value="hsk">HSK考试</option>
                  <option value="cet4">大学英语四级</option>
                  <option value="math">高等数学</option>
                  <option value="programming">编程基础</option>
                </select>
              </div>
              <button className="filter-button">
                <i className="ri-filter-3-line"></i>
                筛选
              </button>
            </div>
          </div>
          
          {/* 统计卡片 */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{backgroundColor: 'var(--primary-light)', color: 'var(--primary)'}}>
                <i className="ri-user-line"></i>
              </div>
              <div className="stat-content">
                <div className="stat-value">125</div>
                <div className="stat-label">学生总数</div>
              </div>
              <div className="stat-change stat-up">
                <i className="ri-arrow-up-line"></i>
                <span>5.2%</span>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon" style={{backgroundColor: 'var(--success-light)', color: 'var(--success)'}}>
                <i className="ri-time-line"></i>
              </div>
              <div className="stat-content">
                <div className="stat-value">82.5%</div>
                <div className="stat-label">平均出勤率</div>
              </div>
              <div className="stat-change stat-up">
                <i className="ri-arrow-up-line"></i>
                <span>1.8%</span>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon" style={{backgroundColor: 'var(--warning-light)', color: 'var(--warning)'}}>
                <i className="ri-book-open-line"></i>
              </div>
              <div className="stat-content">
                <div className="stat-value">68.3%</div>
                <div className="stat-label">平均正确率</div>
              </div>
              <div className="stat-change stat-down">
                <i className="ri-arrow-down-line"></i>
                <span>2.1%</span>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon" style={{backgroundColor: 'var(--danger-light)', color: 'var(--danger)'}}>
                <i className="ri-error-warning-line"></i>
              </div>
              <div className="stat-content">
                <div className="stat-value">12</div>
                <div className="stat-label">需注意学生</div>
              </div>
              <div className="stat-change stat-down">
                <i className="ri-arrow-down-line"></i>
                <span>3.0%</span>
              </div>
            </div>
          </div>
          
          {/* 学生列表 */}
          <div className="progress-section">
            <div className="student-list-card">
              <div className="card-header">
                <h2 className="card-title">学生列表</h2>
                <div className="card-actions">
                  <div className="search-box">
                    <i className="ri-search-line search-icon"></i>
                    <input 
                      type="text" 
                      placeholder="搜索学生" 
                      className="search-input"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <button className="action-button">
                    <i className="ri-download-line"></i>
                    导出
                  </button>
                </div>
              </div>
              
              <div className="student-table-wrapper">
                <table className="student-table">
                  <thead>
                    <tr>
                      <th className="sortable">
                        <span>学生</span>
                        <i className="ri-arrow-up-down-line sort-icon"></i>
                      </th>
                      <th className="sortable">
                        <span>学号</span>
                        <i className="ri-arrow-up-down-line sort-icon"></i>
                      </th>
                      <th className="sortable">
                        <span>完成进度</span>
                        <i className="ri-arrow-up-down-line sort-icon"></i>
                      </th>
                      <th className="sortable">
                        <span>正确率</span>
                        <i className="ri-arrow-up-down-line sort-icon"></i>
                      </th>
                      <th className="sortable">
                        <span>最近练习</span>
                        <i className="ri-arrow-up-down-line sort-icon"></i>
                      </th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, index) => (
                      <tr key={student.id} className={index === 0 ? 'active-row' : ''}>
                        <td className="student-cell">
                          <div className="student-avatar">{student.avatar}</div>
                          <div className="student-info">
                            <div className="student-name">{student.name}</div>
                            <div className="student-class">{student.class}</div>
                          </div>
                        </td>
                        <td>{student.studentId}</td>
                        <td>
                          <div className="progress-wrapper">
                            <div className="progress-bar">
                              <div className="progress-fill" style={{width: `${student.progress}%`}}></div>
                            </div>
                            <span className="progress-text">{student.progress}%</span>
                          </div>
                        </td>
                        <td>
                          <span className={`accuracy ${student.accuracyLevel}`}>{student.accuracy}%</span>
                        </td>
                        <td>{student.lastPractice}</td>
                        <td>
                          <button 
                            className="icon-button"
                            onClick={() => handleStudentView(student)}
                          >
                            <i className="ri-eye-line"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="table-footer">
                <div className="pagination">
                  <button className="pagination-button" disabled>
                    <i className="ri-arrow-left-s-line"></i>
                  </button>
                  <button className="pagination-button active">1</button>
                  <button className="pagination-button">2</button>
                  <button className="pagination-button">3</button>
                  <span className="pagination-ellipsis">...</span>
                  <button className="pagination-button">10</button>
                  <button className="pagination-button">
                    <i className="ri-arrow-right-s-line"></i>
                  </button>
                </div>
                
                <div className="page-size">
                  <span>每页显示：</span>
                  <select 
                    className="page-size-select"
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
