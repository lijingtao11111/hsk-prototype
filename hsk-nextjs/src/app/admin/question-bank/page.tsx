"use client";

import { useState, useEffect } from 'react';
import AdminAuthGuard from '../../../components/AdminAuthGuard';
import AdminSidebar from '../../../components/AdminSidebar';

import '../../../styles/admin-question-bank.css';
import '../../../styles/admin-filters.css';


export default function QuestionBankPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [loading, setLoading] = useState(true);
  const [isInputFirst, setIsInputFirst] = useState(true);

  useEffect(() => {
    // 初始化时设置为 true
    setIsInputFirst(true);
    setLoading(false);
  }, []);

  const [questions, setQuestions] = useState([
    {
      id: 'Q1001',
      stem: '下列哪项不是Java的基本数据类型？',
      subject: 'Java编程',
      type: '单选题',
      difficulty: '中',
      status: 'active'
    },
    {
      id: 'Q1002',
      stem: '已知集合A={1,2,3},B={2,3,4},则A∩B=?',
      subject: '高等数学',
      type: '单选题',
      difficulty: '易',
      status: 'active'
    }
  ]);



  const getStatusBadge = (status: string) => {
    const badges: Record<string, { class: string; text: string }> = {
      active: { class: 'status-active', text: '已启用' },
      inactive: { class: 'status-inactive', text: '已停用' },
      pending: { class: 'status-pending', text: '待审核' }
    };
    return badges[status] || badges.active;
  };

  const getDifficultyBadge = (difficulty: string) => {
    const badges: Record<string, { class: string; text: string }> = {
      '易': { class: 'difficulty-easy', text: '易' },
      '中': { class: 'difficulty-medium', text: '中' },
      '难': { class: 'difficulty-hard', text: '难' }
    };
    return badges[difficulty] || badges['中'];
  };



  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.stem.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = subjectFilter === 'all' || question.subject === subjectFilter;
    const matchesType = typeFilter === 'all' || question.type === typeFilter;
    const matchesDifficulty = difficultyFilter === 'all' || question.difficulty === difficultyFilter;
    const matchesStatus = statusFilter === 'all' || question.status === statusFilter;
    
    return matchesSearch && matchesSubject && matchesType && matchesDifficulty && matchesStatus;
  });

  return (
    <AdminAuthGuard>
      <div className="admin-layout">
        <AdminSidebar currentPage="question-bank" />
        
        <div className="main-content">
          <div className="topbar">
            <h1 className="page-title">题库管理</h1>
            <div className="topbar-actions">
              <button className="btn btn-primary" onClick={() => alert('新增题目功能开发中...')}>
                <i className="ri-add-line btn-icon"></i>
                新增题目
              </button>
            </div>
          </div>
          
          <div className="filter-area">
            <div className="search-box">
              <i className="ri-search-line search-icon"></i>
              <input
                type="text"
                placeholder="搜索题目ID或题干内容..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`search-input ${isInputFirst ? 'first-input' : ''}`}
              />
            </div>

            <div className="filter-group">
              <div className="filter-item">
                <span className="filter-label">学科:</span>
                <select
                  value={subjectFilter}
                  onChange={(e) => setSubjectFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">全部学科</option>
                  <option value="Java编程">Java编程</option>
                  <option value="高等数学">高等数学</option>
                  <option value="大学英语四级">大学英语四级</option>
                  <option value="HSK中文考试">HSK中文考试</option>
                </select>
              </div>

              <div className="filter-item">
                <span className="filter-label">题型:</span>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">全部题型</option>
                  <option value="单选题">单选题</option>
                  <option value="多选题">多选题</option>
                  <option value="填空题">填空题</option>
                  <option value="简答题">简答题</option>
                </select>
              </div>

              <div className="filter-item">
                <span className="filter-label">难度:</span>
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">全部难度</option>
                  <option value="易">易</option>
                  <option value="中">中</option>
                  <option value="难">难</option>
                </select>
              </div>

              <div className="filter-item">
                <span className="filter-label">状态:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">全部状态</option>
                  <option value="active">已启用</option>
                  <option value="inactive">已停用</option>
                  <option value="pending">待审核</option>
                </select>
              </div>

              <button
                className="filter-clear"
                onClick={() => {
                  setSearchTerm('');
                  setSubjectFilter('all');
                  setTypeFilter('all');
                  setDifficultyFilter('all');
                  setStatusFilter('all');
                }}
              >
                <i className="ri-refresh-line"></i>
                重置筛选
              </button>
            </div>
          </div>
          
          <div className="card">
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{width: '10%'}}>题目ID</th>
                    <th style={{width: '35%'}}>题干摘要</th>
                    <th style={{width: '15%'}}>学科</th>
                    <th style={{width: '10%'}}>题型</th>
                    <th style={{width: '10%'}}>难度</th>
                    <th style={{width: '10%'}}>状态</th>
                    <th style={{width: '10%'}}>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} style={{textAlign: 'center', padding: '2rem'}}>
                        加载中...
                      </td>
                    </tr>
                  ) : filteredQuestions.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)'}}>
                        暂无题目数据
                      </td>
                    </tr>
                  ) : (
                    filteredQuestions.map((question) => {
                      const statusBadge = getStatusBadge(question.status);
                      const difficultyBadge = getDifficultyBadge(question.difficulty);
                      return (
                        <tr key={question.id}>
                          <td>
                            <div className="question-id">{question.id}</div>
                          </td>
                          <td>
                            <div className="question-stem">
                              {question.stem.length > 50 ? question.stem.substring(0, 50) + '...' : question.stem}
                            </div>
                          </td>
                          <td>
                            <div className="subject-name">{question.subject}</div>
                          </td>
                          <td>
                            <div className="question-type">{question.type}</div>
                          </td>
                          <td>
                            <span className={`difficulty-badge ${difficultyBadge.class}`}>
                              {difficultyBadge.text}
                            </span>
                          </td>
                          <td>
                            <span className={`status-badge ${statusBadge.class}`}>
                              {statusBadge.text}
                            </span>
                          </td>
                          <td>
                            <div className="actions-cell">
                              <button className="action-btn" title="编辑" onClick={() => alert('编辑功能开发中...')}>
                                <i className="ri-edit-line"></i>
                              </button>
                              <button className="action-btn" title="删除" onClick={() => alert('删除功能开发中...')}>
                                <i className="ri-delete-bin-line"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminAuthGuard>
  );
}
