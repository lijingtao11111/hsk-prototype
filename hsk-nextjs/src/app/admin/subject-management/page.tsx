"use client";

import { useState, useEffect } from 'react';
import AdminAuthGuard from '../../../components/AdminAuthGuard';
import AdminSidebar from '../../../components/AdminSidebar';
import { adminApiRequest } from '../../../lib/auth/client';
import '../../../styles/admin-subject-management.css';
import '../../../styles/admin-filters.css';

export default function SubjectManagementPage() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);

  // 获取学科列表
  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (categoryFilter !== 'all') params.append('category', categoryFilter);
      if (statusFilter !== 'all') params.append('isActive', (statusFilter === 'active').toString());

      const response = await adminApiRequest(`/api/subjects?${params}`);
      const result = await response.json();

      if (result.success) {
        setSubjects(result.data.subjects);
      } else {
        console.error('获取学科列表失败:', result.error);
        // API失败时设置为空数组
        setSubjects([]);
      }
    } catch (error) {
      console.error('获取学科列表失败:', error);
      // API失败时设置为空数组
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, [categoryFilter, statusFilter]);

  // 模拟数据
  const mockSubjects = [
    {
      id: 1,
      subjectId: 'hsk4',
      name: 'HSK四级',
      category: '语言类',
      description: 'HSK四级中文考试',
      questionCount: 1250,
      activeQuestions: 1180,
      difficulty: '中级',
      status: 'active',
      createTime: '2024-01-10 10:30',
      updateTime: '2024-01-20 14:15'
    },
    {
      id: 2,
      subjectId: 'cet4',
      name: '大学英语四级',
      category: '语言类',
      description: '大学英语四级考试',
      questionCount: 2100,
      activeQuestions: 1950,
      difficulty: '中级',
      status: 'active',
      createTime: '2024-01-08 09:20',
      updateTime: '2024-01-18 16:45'
    }
  ];

  const [formData, setFormData] = useState({
    subjectId: '',
    name: '',
    category: '',
    description: '',
    difficulty: '中级',
    status: 'active'
  });

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
      subjectId: '',
      name: '',
      category: '',
      description: '',
      difficulty: '中级',
      status: 'active'
    });
    setShowModal(true);
  };

  const handleEditSubject = (subject) => {
    setEditingSubject(subject);
    setFormData({
      subjectId: subject.subjectId,
      name: subject.name,
      category: subject.category,
      description: subject.description,
      difficulty: subject.difficulty,
      status: subject.status
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Save subject:', formData);
    setShowModal(false);
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: { class: 'status-active', text: '已启用' },
      inactive: { class: 'status-inactive', text: '已停用' }
    };
    return badges[status] || badges.active;
  };

  const getCategoryName = (category) => {
    const categories = {
      language: '语言类',
      math: '数学类',
      science: '理科类',
      liberal: '文科类',
      computer: '计算机类'
    };
    return categories[category] || category;
  };

  const filteredSubjects = subjects.filter(subject => {
    const matchesSearch = subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subject.subjectId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subject.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || 
                           subject.category === getCategoryName(categoryFilter);
    
    const matchesStatus = statusFilter === 'all' || subject.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <AdminAuthGuard>
      <div className="admin-layout">
        <AdminSidebar currentPage="subject-management" />
        
        <div className="main-content">
          <div className="topbar">
            <h1 className="page-title">学科管理</h1>
            <button className="btn btn-primary" onClick={handleAddSubject}>
              <i className="ri-add-line btn-icon"></i>
              添加学科
            </button>
          </div>
          
          <div className="filter-area">
            <div className="search-box">
              <i className="ri-search-line search-icon"></i>
              <input
                type="text"
                placeholder="搜索学科ID、名称或描述..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-group">
              <div className="filter-item">
                <span className="filter-label">分类:</span>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">全部分类</option>
                  <option value="language">语言类</option>
                  <option value="math">数学类</option>
                  <option value="science">理科类</option>
                  <option value="liberal">文科类</option>
                  <option value="computer">计算机类</option>
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
                </select>
              </div>

              <button
                className="filter-clear"
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('all');
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
                    <th style={{width: '15%'}}>学科ID</th>
                    <th style={{width: '20%'}}>名称</th>
                    <th style={{width: '15%'}}>类别</th>
                    <th style={{width: '15%'}}>题型</th>
                    <th style={{width: '20%'}}>描述</th>
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
                  ) : filteredSubjects.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)'}}>
                        暂无学科数据
                      </td>
                    </tr>
                  ) : (
                    filteredSubjects.map((subject) => {
                      const statusBadge = getStatusBadge(subject.status);
                      return (
                        <tr key={subject.id}>
                          <td>
                            <div className="subject-id">{subject.subjectId}</div>
                          </td>
                          <td>
                            <div className="subject-name">{subject.name}</div>
                          </td>
                          <td>
                            <div className="subject-category">{subject.category}</div>
                          </td>
                          <td>
                            <div className="question-types">
                              <span className="question-type-badge">单选</span>
                              <span className="question-type-badge">多选</span>
                              <span className="question-type-badge">填空</span>
                            </div>
                          </td>
                          <td>
                            <div className="subject-description">{subject.description}</div>
                          </td>
                          <td>
                            <span className={`status-badge ${statusBadge.class}`}>
                              {statusBadge.text}
                            </span>
                          </td>
                          <td>
                            <div className="actions-cell">
                              <button className="action-btn" title="编辑" onClick={() => handleEditSubject(subject)}>
                                <i className="ri-edit-line"></i>
                              </button>
                              <button className="action-btn" title="删除">
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
