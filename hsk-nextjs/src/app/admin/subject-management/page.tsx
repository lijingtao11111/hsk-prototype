"use client";

import { useState } from 'react';
import Link from 'next/link';
import '../../../styles/admin-subject-management.css';

export default function SubjectManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);

  const [subjects, setSubjects] = useState([
    {
      id: 'hsk',
      name: 'HSK中文考试',
      category: '语言类',
      types: '单选/多选/填空',
      description: '国际中文能力标准考试',
      status: 'active'
    },
    {
      id: 'cet4',
      name: '大学英语四级',
      category: '语言类',
      types: '单选/完形/阅读',
      description: '全国大学英语四级考试',
      status: 'active'
    },
    {
      id: 'math_advanced',
      name: '高等数学',
      category: '理工类',
      types: '单选/填空/计算',
      description: '高等院校理工基础课程',
      status: 'inactive'
    },
    {
      id: 'programming_java',
      name: 'Java编程',
      category: '技能类',
      types: '编程/选择/填空',
      description: 'Java语言程序设计',
      status: 'active'
    },
    {
      id: 'economics',
      name: '经济学基础',
      category: '文史类',
      types: '单选/简答/论述',
      description: '经济学原理与应用',
      status: 'active'
    },
    {
      id: 'accounting',
      name: '会计学',
      category: '文史类',
      types: '单选/填空/计算',
      description: '基础会计理论与实务',
      status: 'inactive'
    }
  ]);

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    category: '',
    types: '',
    description: '',
    status: 'active'
  });

  const getStatusBadge = (status) => {
    return status === 'active' 
      ? { class: 'status-active', text: '已启用' }
      : { class: 'status-inactive', text: '未启用' };
  };

  const getCategoryName = (category) => {
    const categories = {
      'language': '语言类',
      'science': '理工类',
      'arts': '文史类',
      'skills': '技能类'
    };
    return categories[category] || category;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSubject = () => {
    setEditingSubject(null);
    setFormData({
      id: '',
      name: '',
      category: '',
      types: '',
      description: '',
      status: 'active'
    });
    setShowModal(true);
  };

  const handleEditSubject = (subject) => {
    setEditingSubject(subject);
    setFormData({
      id: subject.id,
      name: subject.name,
      category: subject.category,
      types: subject.types,
      description: subject.description,
      status: subject.status
    });
    setShowModal(true);
  };

  const handleDeleteSubject = (subjectId) => {
    const subject = subjects.find(s => s.id === subjectId);
    if (subject && confirm(`确定要删除学科 ${subject.name} 吗？`)) {
      setSubjects(prev => prev.filter(s => s.id !== subjectId));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.id || !formData.name || !formData.category || !formData.types) {
      alert('请填写所有必填项');
      return;
    }

    if (editingSubject) {
      // 编辑
      setSubjects(prev => prev.map(s => 
        s.id === editingSubject.id ? { ...formData } : s
      ));
    } else {
      // 新增
      if (subjects.some(s => s.id === formData.id)) {
        alert('学科ID已存在');
        return;
      }
      setSubjects(prev => [...prev, { ...formData }]);
    }
    
    setShowModal(false);
  };

  const filteredSubjects = subjects.filter(subject => {
    const matchesSearch = subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subject.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || 
                           subject.category === getCategoryName(categoryFilter);
    
    const matchesStatus = statusFilter === 'all' || subject.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
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
            <Link href="/admin/subject-management" className="sidebar-link active">
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
          <h1 className="page-title">学科管理</h1>
          <button className="btn btn-primary" onClick={handleAddSubject}>
            <i className="ri-add-line btn-icon"></i>
            添加学科
          </button>
        </div>
        
        {/* 筛选区域 */}
        <div className="filter-area">
          <div className="search-box">
            <i className="ri-search-line search-icon"></i>
            <input 
              type="text" 
              className="search-input" 
              placeholder="搜索学科..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select 
            className="filter-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">所有类别</option>
            <option value="language">语言类</option>
            <option value="science">理工类</option>
            <option value="arts">文史类</option>
            <option value="skills">技能类</option>
          </select>
          
          <select 
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">所有状态</option>
            <option value="active">已启用</option>
            <option value="inactive">未启用</option>
          </select>
          
          <button className="btn btn-outline">
            <i className="ri-filter-3-line btn-icon"></i>
            筛选
          </button>
        </div>
        
        {/* 学科列表卡片 */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">学科列表</h2>
          </div>
          
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th width="15%">学科ID</th>
                  <th width="20%">名称</th>
                  <th width="15%">类别</th>
                  <th width="15%">题型</th>
                  <th width="20%">描述</th>
                  <th width="10%">状态</th>
                  <th width="10%">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubjects.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)'}}>
                      <i className="ri-file-search-line" style={{fontSize: '2rem'}}></i><br />
                      没有找到匹配的学科
                    </td>
                  </tr>
                ) : (
                  filteredSubjects.map((subject) => {
                    const statusBadge = getStatusBadge(subject.status);
                    return (
                      <tr key={subject.id}>
                        <td>{subject.id}</td>
                        <td>{subject.name}</td>
                        <td>{subject.category}</td>
                        <td>{subject.types}</td>
                        <td>{subject.description}</td>
                        <td>
                          <span className={`status-badge ${statusBadge.class}`}>
                            {statusBadge.text}
                          </span>
                        </td>
                        <td>
                          <div className="actions-cell">
                            <button 
                              className="action-btn"
                              onClick={() => handleEditSubject(subject)}
                              title="编辑"
                            >
                              <i className="ri-edit-line"></i>
                            </button>
                            <button 
                              className="action-btn"
                              onClick={() => handleDeleteSubject(subject.id)}
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
            <div className="pagination-info">显示 1-{filteredSubjects.length}，共 {filteredSubjects.length} 条</div>
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
      
      {/* 添加/编辑学科模态框 */}
      {showModal && (
        <div className="modal-overlay show">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">
                {editingSubject ? `编辑学科: ${editingSubject.name}` : '添加新学科'}
              </h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <i className="ri-close-line"></i>
              </button>
            </div>
            
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="id" className="form-label">学科ID</label>
                    <input 
                      type="text" 
                      id="id" 
                      name="id"
                      className="form-input" 
                      placeholder="如 hsk" 
                      value={formData.id}
                      onChange={handleInputChange}
                      disabled={!!editingSubject}
                      required 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">名称</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name"
                      className="form-input" 
                      placeholder="如 HSK中文考试" 
                      value={formData.name}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                </div>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="category" className="form-label">类别</label>
                    <select 
                      id="category" 
                      name="category"
                      className="form-select" 
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">选择类别</option>
                      <option value="语言类">语言类</option>
                      <option value="理工类">理工类</option>
                      <option value="文史类">文史类</option>
                      <option value="技能类">技能类</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="types" className="form-label">题型</label>
                    <input 
                      type="text" 
                      id="types" 
                      name="types"
                      className="form-input" 
                      placeholder="如 单选/多选/填空" 
                      value={formData.types}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="description" className="form-label">描述</label>
                  <input 
                    type="text" 
                    id="description" 
                    name="description"
                    className="form-input" 
                    placeholder="学科简介"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
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
                  </select>
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
