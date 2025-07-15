"use client";

import { useState } from 'react';
import Link from 'next/link';
import '../../../styles/admin-question-bank.css';

export default function QuestionBankPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

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
    },
    {
      id: 'Q1003',
      stem: '请写出"经济学"英文单词。',
      subject: '大学英语四级',
      type: '填空题',
      difficulty: '易',
      status: 'inactive'
    },
    {
      id: 'Q1004',
      stem: '"中国的首都是哪里？"的正确答案是？',
      subject: 'HSK中文考试',
      type: '单选题',
      difficulty: '易',
      status: 'active'
    },
    {
      id: 'Q1005',
      stem: '请简述会计的基本假设。',
      subject: '会计学',
      type: '简答题',
      difficulty: '中',
      status: 'pending'
    },
    {
      id: 'Q1006',
      stem: '下列哪个不是经济学的基本问题？',
      subject: '经济学基础',
      type: '单选题',
      difficulty: '难',
      status: 'active'
    }
  ]);

  const [formData, setFormData] = useState({
    id: '',
    stem: '',
    subject: '',
    type: '',
    difficulty: '',
    status: 'active'
  });

  const getStatusBadge = (status) => {
    const badges = {
      active: { class: 'status-active', text: '已启用' },
      inactive: { class: 'status-inactive', text: '未启用' },
      pending: { class: 'status-pending', text: '待审核' }
    };
    return badges[status] || badges.active;
  };

  const getDifficultyBadge = (difficulty) => {
    const badges = {
      '易': { class: 'difficulty-easy', text: '易' },
      '中': { class: 'difficulty-medium', text: '中' },
      '难': { class: 'difficulty-hard', text: '难' }
    };
    return badges[difficulty] || badges['中'];
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddQuestion = () => {
    setEditingQuestion(null);
    setFormData({
      id: '',
      stem: '',
      subject: '',
      type: '',
      difficulty: '',
      status: 'active'
    });
    setShowModal(true);
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    setFormData({
      id: question.id,
      stem: question.stem,
      subject: question.subject,
      type: question.type,
      difficulty: question.difficulty,
      status: question.status
    });
    setShowModal(true);
  };

  const handleDeleteQuestion = (questionId) => {
    const question = questions.find(q => q.id === questionId);
    if (question && confirm(`确定要删除题目 ${question.id} 吗？`)) {
      setQuestions(prev => prev.filter(q => q.id !== questionId));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.id || !formData.stem || !formData.subject || !formData.type || !formData.difficulty) {
      alert('请填写所有必填项');
      return;
    }

    if (editingQuestion) {
      // 编辑
      setQuestions(prev => prev.map(q => 
        q.id === editingQuestion.id ? { ...formData } : q
      ));
    } else {
      // 新增
      if (questions.some(q => q.id === formData.id)) {
        alert('题目ID已存在');
        return;
      }
      setQuestions(prev => [...prev, { ...formData }]);
    }
    
    setShowModal(false);
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
            <Link href="/admin/index" className="sidebar-link">
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
            <Link href="/admin/question-bank" className="sidebar-link active">
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
          <h1 className="page-title">题库管理</h1>
          <button className="btn btn-primary" onClick={handleAddQuestion}>
            <i className="ri-add-line btn-icon"></i>
            添加题目
          </button>
        </div>
        
        {/* 筛选区域 */}
        <div className="filter-area">
          <div className="search-box">
            <i className="ri-search-line search-icon"></i>
            <input 
              type="text" 
              className="search-input" 
              placeholder="搜索题目..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select 
            className="filter-select"
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
          >
            <option value="all">所有学科</option>
            <option value="HSK中文考试">HSK中文考试</option>
            <option value="大学英语四级">大学英语四级</option>
            <option value="高等数学">高等数学</option>
            <option value="Java编程">Java编程</option>
            <option value="经济学基础">经济学基础</option>
            <option value="会计学">会计学</option>
          </select>
          
          <select 
            className="filter-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">所有题型</option>
            <option value="单选题">单选题</option>
            <option value="多选题">多选题</option>
            <option value="填空题">填空题</option>
            <option value="简答题">简答题</option>
            <option value="计算题">计算题</option>
          </select>
          
          <select 
            className="filter-select"
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
          >
            <option value="all">所有难度</option>
            <option value="易">易</option>
            <option value="中">中</option>
            <option value="难">难</option>
          </select>
          
          <select 
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">所有状态</option>
            <option value="active">已启用</option>
            <option value="inactive">未启用</option>
            <option value="pending">待审核</option>
          </select>
          
          <button className="btn btn-outline">
            <i className="ri-filter-3-line btn-icon"></i>
            筛选
          </button>
        </div>
        
        {/* 题目列表卡片 */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">题目列表</h2>
          </div>
          
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th width="10%">题目ID</th>
                  <th width="35%">题干摘要</th>
                  <th width="15%">学科</th>
                  <th width="10%">题型</th>
                  <th width="10%">难度</th>
                  <th width="10%">状态</th>
                  <th width="10%">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuestions.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)'}}>
                      <i className="ri-file-search-line" style={{fontSize: '2rem'}}></i><br />
                      没有找到匹配的题目
                    </td>
                  </tr>
                ) : (
                  filteredQuestions.map((question) => {
                    const statusBadge = getStatusBadge(question.status);
                    const difficultyBadge = getDifficultyBadge(question.difficulty);
                    return (
                      <tr key={question.id}>
                        <td>{question.id}</td>
                        <td>{question.stem}</td>
                        <td>{question.subject}</td>
                        <td>{question.type}</td>
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
                            <button 
                              className="action-btn"
                              onClick={() => handleEditQuestion(question)}
                              title="编辑"
                            >
                              <i className="ri-edit-line"></i>
                            </button>
                            <button 
                              className="action-btn"
                              onClick={() => handleDeleteQuestion(question.id)}
                              title="删除"
                            >
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
          
          <div className="pagination">
            <div className="pagination-info">显示 1-{filteredQuestions.length}，共 {filteredQuestions.length} 条</div>
            <div className="pagination-controls">
              <button className="page-btn" disabled>
                <i className="ri-arrow-left-s-line"></i>
              </button>
              <button className="page-btn active">1</button>
              <button className="page-btn">2</button>
              <button className="page-btn">3</button>
              <button className="page-btn">...</button>
              <button className="page-btn">5</button>
              <button className="page-btn">
                <i className="ri-arrow-right-s-line"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* 添加/编辑题目模态框 */}
      {showModal && (
        <div className="modal-overlay show">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">
                {editingQuestion ? `编辑题目: ${editingQuestion.stem}` : '添加新题目'}
              </h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <i className="ri-close-line"></i>
              </button>
            </div>
            
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="id" className="form-label">题目ID</label>
                    <input 
                      type="text" 
                      id="id" 
                      name="id"
                      className="form-input" 
                      placeholder="如 Q1001" 
                      value={formData.id}
                      onChange={handleInputChange}
                      disabled={!!editingQuestion}
                      required 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="stem" className="form-label">题干摘要</label>
                    <input 
                      type="text" 
                      id="stem" 
                      name="stem"
                      className="form-input" 
                      placeholder="题目内容摘要" 
                      value={formData.stem}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                </div>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="subject" className="form-label">学科</label>
                    <select 
                      id="subject" 
                      name="subject"
                      className="form-select" 
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">选择学科</option>
                      <option value="HSK中文考试">HSK中文考试</option>
                      <option value="大学英语四级">大学英语四级</option>
                      <option value="高等数学">高等数学</option>
                      <option value="Java编程">Java编程</option>
                      <option value="经济学基础">经济学基础</option>
                      <option value="会计学">会计学</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="type" className="form-label">题型</label>
                    <select 
                      id="type" 
                      name="type"
                      className="form-select" 
                      value={formData.type}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">选择题型</option>
                      <option value="单选题">单选题</option>
                      <option value="多选题">多选题</option>
                      <option value="填空题">填空题</option>
                      <option value="简答题">简答题</option>
                      <option value="计算题">计算题</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="difficulty" className="form-label">难度</label>
                    <select 
                      id="difficulty" 
                      name="difficulty"
                      className="form-select" 
                      value={formData.difficulty}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">选择难度</option>
                      <option value="易">易</option>
                      <option value="中">中</option>
                      <option value="难">难</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="status" className="form-label">状态</label>
                    <select 
                      id="status" 
                      name="status"
                      className="form-select"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <option value="active">已启用</option>
                      <option value="inactive">未启用</option>
                      <option value="pending">待审核</option>
                    </select>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>取消</button>
              <button className="btn btn-primary" onClick={handleSubmit}>保存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
