"use client";

import { useState } from 'react';
import Link from 'next/link';
import '../../../styles/teacher-question-review.css';

export default function QuestionReviewPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [activeTab, setActiveTab] = useState('answer');

  const questions = [
    {
      id: 1,
      title: '阅读理解 - 现代科技对生活的影响',
      status: 'pending',
      subject: 'HSK考试',
      submittedBy: 'AI系统',
      submittedAt: '2024-01-15 14:30',
      type: 'multiple-choice',
      content: '随着科技的快速发展，人工智能已经深入到我们生活的方方面面。从智能手机到自动驾驶汽车，从语音助手到智能家居，科技正在改变着我们的生活方式。请根据以下材料回答问题：',
      question: '根据文章内容，以下哪项最能概括科技对现代生活的影响？',
      options: [
        'A. 科技使生活变得更加复杂',
        'B. 科技全面渗透并改变了现代生活方式',
        'C. 科技只在特定领域发挥作用',
        'D. 科技的影响主要体现在工作中'
      ],
      correctAnswer: 'B',
      analysis: '根据文章开头"人工智能已经深入到我们生活的方方面面"以及后续举例，可以看出科技全面渗透并改变了现代生活方式，因此答案是B。'
    },
    {
      id: 2,
      title: '语法填空 - 中国传统文化',
      status: 'approved',
      subject: 'HSK考试',
      submittedBy: 'AI系统',
      submittedAt: '2024-01-14 16:45',
      type: 'fill-blank',
      content: '中国传统文化源远流长，_____(1)_____着深厚的历史底蕴。从古代的诗词歌赋到现代的文学作品，都_____(2)_____着中华民族的智慧和情感。',
      question: '请在空白处填入合适的词语',
      options: [
        '(1) A. 包含  B. 蕴含  C. 含有  D. 包括',
        '(2) A. 体现  B. 表现  C. 显现  D. 反映'
      ],
      correctAnswer: '(1) B  (2) A',
      analysis: '第一空应该用"蕴含"，表示深层次的包含；第二空用"体现"，表示通过具体事物显示出抽象的内容。'
    },
    {
      id: 3,
      title: '听力理解 - 校园生活对话',
      status: 'rejected',
      subject: 'HSK考试',
      submittedBy: 'AI系统',
      submittedAt: '2024-01-13 10:20',
      type: 'listening',
      content: '音频材料：两名学生在讨论即将到来的期末考试安排...',
      question: '根据对话内容，男学生对期末考试的态度是什么？',
      options: [
        'A. 非常紧张和担心',
        'B. 充满信心和期待',
        'C. 无所谓的态度',
        'D. 希望推迟考试'
      ],
      correctAnswer: 'A',
      analysis: '从对话中男学生的语气和用词可以判断出他对考试感到紧张和担心。',
      rejectionReason: '音频材料不够清晰，建议重新录制'
    }
  ];

  const getStatusBadge = (status) => {
    const badges = {
      pending: { text: '待审核', class: 'pending' },
      approved: { text: '已通过', class: 'approved' },
      rejected: { text: '已拒绝', class: 'rejected' }
    };
    return badges[status] || badges.pending;
  };

  const getFilteredQuestions = () => {
    let filtered = questions;
    
    if (activeFilter !== 'all') {
      filtered = filtered.filter(q => q.status === activeFilter);
    }
    
    if (selectedSubject !== 'all') {
      filtered = filtered.filter(q => q.subject === selectedSubject);
    }
    
    return filtered;
  };

  const handleApprove = (questionId) => {
    console.log('Approve question:', questionId);
  };

  const handleReject = (questionId) => {
    console.log('Reject question:', questionId);
  };

  const filteredQuestions = getFilteredQuestions();
  const statusCounts = {
    all: questions.length,
    pending: questions.filter(q => q.status === 'pending').length,
    approved: questions.filter(q => q.status === 'approved').length,
    rejected: questions.filter(q => q.status === 'rejected').length
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
            <Link href="/teacher/student-progress" className="sidebar-link">
              <i className="ri-line-chart-line sidebar-icon"></i>
              <span>学生进度</span>
            </Link>
            <Link href="/teacher/question-review" className="sidebar-link active">
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
          <h1 className="page-title">题目审核</h1>
        </div>
        
        <div className="review-container">
          {/* 筛选栏 */}
          <div className="filter-container">
            <div className="filter-buttons">
              <button 
                className={`filter-button ${activeFilter === 'all' ? 'active' : ''}`}
                onClick={() => setActiveFilter('all')}
              >
                全部 <span className="filter-count">{statusCounts.all}</span>
              </button>
              <button 
                className={`filter-button ${activeFilter === 'pending' ? 'active' : ''}`}
                onClick={() => setActiveFilter('pending')}
              >
                待审核 <span className="filter-count">{statusCounts.pending}</span>
              </button>
              <button 
                className={`filter-button ${activeFilter === 'approved' ? 'active' : ''}`}
                onClick={() => setActiveFilter('approved')}
              >
                已通过 <span className="filter-count">{statusCounts.approved}</span>
              </button>
              <button 
                className={`filter-button ${activeFilter === 'rejected' ? 'active' : ''}`}
                onClick={() => setActiveFilter('rejected')}
              >
                已拒绝 <span className="filter-count">{statusCounts.rejected}</span>
              </button>
            </div>
            
            <div className="filter-dropdown">
              <select 
                className="filter-select"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                <option value="all">全部学科</option>
                <option value="HSK考试">HSK考试</option>
                <option value="大学英语四级">大学英语四级</option>
                <option value="高等数学">高等数学</option>
                <option value="编程基础">编程基础</option>
              </select>
              <button className="btn btn-outline">
                <i className="ri-download-line"></i>
                导出报告
              </button>
            </div>
          </div>
          
          {/* 题目列表 */}
          {filteredQuestions.length === 0 ? (
            <div className="empty-state">
              <i className="ri-file-list-3-line empty-icon"></i>
              <h3 className="empty-title">暂无题目需要审核</h3>
              <p className="empty-description">当前筛选条件下没有找到相关题目</p>
            </div>
          ) : (
            filteredQuestions.map((question) => {
              const badge = getStatusBadge(question.status);
              return (
                <div key={question.id} className="review-item">
                  <div className="review-item-header">
                    <div className="review-item-title">
                      {question.title}
                      <span className={`review-badge ${badge.class}`}>
                        {badge.text}
                      </span>
                    </div>
                    <div className="review-item-meta">
                      {question.subject} • {question.submittedBy} • {question.submittedAt}
                    </div>
                  </div>
                  
                  <div className="review-item-content">
                    <div className="question-content">
                      <p className="question-text">{question.content}</p>
                      <h4 className="question-title">{question.question}</h4>
                      
                      <div className="question-options">
                        {question.options.map((option, index) => (
                          <div 
                            key={index} 
                            className={`question-option ${option.startsWith(question.correctAnswer) || option.includes(question.correctAnswer) ? 'correct-option' : ''}`}
                          >
                            <span className="question-option-letter">
                              {option.charAt(0)}
                            </span>
                            <span>{option}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="answer-tabs">
                        <div 
                          className={`answer-tab ${activeTab === 'answer' ? 'active' : ''}`}
                          onClick={() => setActiveTab('answer')}
                        >
                          正确答案
                        </div>
                        <div 
                          className={`answer-tab ${activeTab === 'analysis' ? 'active' : ''}`}
                          onClick={() => setActiveTab('analysis')}
                        >
                          解析说明
                        </div>
                        {question.rejectionReason && (
                          <div 
                            className={`answer-tab ${activeTab === 'rejection' ? 'active' : ''}`}
                            onClick={() => setActiveTab('rejection')}
                          >
                            拒绝原因
                          </div>
                        )}
                      </div>
                      
                      <div className="answer-content">
                        {activeTab === 'answer' && (
                          <div className="answer-analysis">
                            <p><strong>正确答案：</strong>{question.correctAnswer}</p>
                          </div>
                        )}
                        {activeTab === 'analysis' && (
                          <div className="answer-analysis">
                            <p>{question.analysis}</p>
                          </div>
                        )}
                        {activeTab === 'rejection' && question.rejectionReason && (
                          <div className="answer-analysis">
                            <p>{question.rejectionReason}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {question.status === 'pending' && (
                    <div className="review-item-footer">
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => handleReject(question.id)}
                      >
                        拒绝
                      </button>
                      <button 
                        className="btn btn-success btn-sm"
                        onClick={() => handleApprove(question.id)}
                      >
                        通过
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
