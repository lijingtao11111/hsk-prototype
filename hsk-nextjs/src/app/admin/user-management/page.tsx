"use client";

import { useState } from 'react';
import Link from 'next/link';
import '../../../styles/admin-user-management.css';

export default function UserManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deptFilter, setDeptFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [formData, setFormData] = useState({
    username: '',
    userRole: '',
    fullName: '',
    department: '',
    idNumber: '',
    phone: '',
    email: '',
    userStatus: 'active',
    permissions: []
  });

  const mockUsers = [
    {
      id: 1,
      username: 'zhangsan',
      fullName: '张三',
      email: 'zhangsan@zjufe.edu.cn',
      role: 'student',
      department: 'computer',
      departmentName: '计算机学院',
      idNumber: '2023001001',
      phone: '13800138001',
      status: 'active',
      registerDate: '2023-09-01',
      avatar: '张'
    },
    {
      id: 2,
      username: 'lisi',
      fullName: '李四',
      email: 'lisi@zjufe.edu.cn',
      role: 'teacher',
      department: 'foreign',
      departmentName: '外国语学院',
      idNumber: 'T2023001',
      phone: '13800138002',
      status: 'active',
      registerDate: '2023-08-15',
      avatar: '李'
    },
    {
      id: 3,
      username: 'wangwu',
      fullName: '王五',
      email: 'wangwu@zjufe.edu.cn',
      role: 'student',
      department: 'economics',
      departmentName: '经济学院',
      idNumber: '2023002001',
      phone: '13800138003',
      status: 'pending',
      registerDate: '2023-09-10',
      avatar: '王'
    },
    {
      id: 4,
      username: 'admin',
      fullName: '系统管理员',
      email: 'admin@zjufe.edu.cn',
      role: 'admin',
      department: 'management',
      departmentName: '管理学院',
      idNumber: 'A001',
      phone: '13800138004',
      status: 'active',
      registerDate: '2023-01-01',
      avatar: '管'
    }
  ];

  const getRoleName = (role) => {
    const roles = {
      student: '学生',
      teacher: '教师',
      admin: '管理员'
    };
    return roles[role] || role;
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: { text: '已激活', class: 'status-active' },
      inactive: { text: '未激活', class: 'status-inactive' },
      pending: { text: '待审核', class: 'status-pending' }
    };
    return badges[status] || badges.active;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      if (name === 'permissions') {
        setFormData(prev => ({
          ...prev,
          permissions: checked 
            ? [...prev.permissions, value]
            : prev.permissions.filter(p => p !== value)
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({
      username: '',
      userRole: '',
      fullName: '',
      department: '',
      idNumber: '',
      phone: '',
      email: '',
      userStatus: 'active',
      permissions: []
    });
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      userRole: user.role,
      fullName: user.fullName,
      department: user.department,
      idNumber: user.idNumber,
      phone: user.phone,
      email: user.email,
      userStatus: user.status,
      permissions: []
    });
    setShowModal(true);
  };

  const handleDeleteUser = (userId) => {
    if (confirm('确定要删除这个用户吗？')) {
      console.log('Delete user:', userId);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Save user:', formData);
    setShowModal(false);
  };

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesDept = deptFilter === 'all' || user.department === deptFilter;
    
    return matchesSearch && matchesRole && matchesStatus && matchesDept;
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
            <Link href="/admin/user-management" className="sidebar-link active">
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
          <h1 className="page-title">用户管理</h1>
          <button className="btn btn-primary" onClick={handleAddUser}>
            <i className="ri-add-line btn-icon"></i>
            添加用户
          </button>
        </div>
        
        {/* 筛选区域 */}
        <div className="filter-area">
          <div className="search-box">
            <i className="ri-search-line search-icon"></i>
            <input 
              type="text" 
              className="search-input" 
              placeholder="搜索用户..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select 
            className="filter-select"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">所有角色</option>
            <option value="student">学生</option>
            <option value="teacher">教师</option>
            <option value="admin">管理员</option>
          </select>
          
          <select 
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">所有状态</option>
            <option value="active">已激活</option>
            <option value="inactive">未激活</option>
            <option value="pending">待审核</option>
          </select>
          
          <select 
            className="filter-select"
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
          >
            <option value="all">所有院系</option>
            <option value="computer">计算机学院</option>
            <option value="foreign">外国语学院</option>
            <option value="economics">经济学院</option>
            <option value="management">管理学院</option>
          </select>
          
          <button className="btn btn-outline">
            <i className="ri-filter-3-line btn-icon"></i>
            筛选
          </button>
        </div>
        
        {/* 用户列表卡片 */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">用户列表</h2>
          </div>
          
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th width="30%">用户信息</th>
                  <th width="15%">角色</th>
                  <th width="15%">院系</th>
                  <th width="15%">状态</th>
                  <th width="15%">注册日期</th>
                  <th width="10%">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  const statusBadge = getStatusBadge(user.status);
                  return (
                    <tr key={user.id}>
                      <td>
                        <div className="user-info">
                          <div className="user-avatar">{user.avatar}</div>
                          <div>
                            <div className="user-name">{user.fullName}</div>
                            <div className="user-email">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>{getRoleName(user.role)}</td>
                      <td>{user.departmentName}</td>
                      <td>
                        <span className={`status-badge ${statusBadge.class}`}>
                          {statusBadge.text}
                        </span>
                      </td>
                      <td>{user.registerDate}</td>
                      <td>
                        <div style={{display: 'flex', gap: '0.25rem'}}>
                          <button 
                            className="action-btn"
                            onClick={() => handleEditUser(user)}
                            title="编辑"
                          >
                            <i className="ri-edit-line"></i>
                          </button>
                          <button 
                            className="action-btn"
                            onClick={() => handleDeleteUser(user.id)}
                            title="删除"
                          >
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <div className="pagination">
            <div className="pagination-info">显示 1-{filteredUsers.length}，共 {filteredUsers.length} 条</div>
            <div className="pagination-controls">
              <button className="page-btn" disabled>
                <i className="ri-arrow-left-s-line"></i>
              </button>
              <button className="page-btn active">1</button>
              <button className="page-btn">2</button>
              <button className="page-btn">3</button>
              <button className="page-btn">...</button>
              <button className="page-btn">26</button>
              <button className="page-btn">
                <i className="ri-arrow-right-s-line"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* 添加/编辑用户模态框 */}
      {showModal && (
        <div className="modal-overlay show">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">
                {editingUser ? '编辑用户' : '添加新用户'}
              </h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <i className="ri-close-line"></i>
              </button>
            </div>
            
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="username" className="form-label">用户名</label>
                    <input 
                      type="text" 
                      id="username" 
                      name="username"
                      className="form-input" 
                      placeholder="请输入用户名" 
                      value={formData.username}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="userRole" className="form-label">用户角色</label>
                    <select 
                      id="userRole" 
                      name="userRole"
                      className="form-select" 
                      value={formData.userRole}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">选择角色</option>
                      <option value="student">学生</option>
                      <option value="teacher">教师</option>
                      <option value="admin">管理员</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="fullName" className="form-label">姓名</label>
                    <input 
                      type="text" 
                      id="fullName" 
                      name="fullName"
                      className="form-input" 
                      placeholder="请输入真实姓名"
                      value={formData.fullName}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="department" className="form-label">院系</label>
                    <select 
                      id="department" 
                      name="department"
                      className="form-select"
                      value={formData.department}
                      onChange={handleInputChange}
                    >
                      <option value="">选择院系</option>
                      <option value="computer">计算机学院</option>
                      <option value="foreign">外国语学院</option>
                      <option value="economics">经济学院</option>
                      <option value="management">管理学院</option>
                      <option value="other">其他</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="idNumber" className="form-label">学号/工号</label>
                    <input 
                      type="text" 
                      id="idNumber" 
                      name="idNumber"
                      className="form-input" 
                      placeholder="请输入学号或工号"
                      value={formData.idNumber}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="phone" className="form-label">手机号码</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      name="phone"
                      className="form-input" 
                      placeholder="请输入手机号码"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="email" className="form-label">邮箱</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email"
                    className="form-input" 
                    placeholder="请输入邮箱地址"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="userStatus" className="form-label">状态</label>
                  <select 
                    id="userStatus" 
                    name="userStatus"
                    className="form-select"
                    value={formData.userStatus}
                    onChange={handleInputChange}
                  >
                    <option value="active">已激活</option>
                    <option value="inactive">未激活</option>
                    <option value="pending">待审核</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">额外权限</label>
                  <div style={{display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap'}}>
                    <label style={{display: 'flex', alignItems: 'center', gap: '0.375rem'}}>
                      <input 
                        type="checkbox" 
                        name="permissions" 
                        value="upload_papers"
                        checked={formData.permissions.includes('upload_papers')}
                        onChange={handleInputChange}
                      /> 上传试卷
                    </label>
                    <label style={{display: 'flex', alignItems: 'center', gap: '0.375rem'}}>
                      <input 
                        type="checkbox" 
                        name="permissions" 
                        value="manage_users"
                        checked={formData.permissions.includes('manage_users')}
                        onChange={handleInputChange}
                      /> 用户管理
                    </label>
                    <label style={{display: 'flex', alignItems: 'center', gap: '0.375rem'}}>
                      <input 
                        type="checkbox" 
                        name="permissions" 
                        value="review_questions"
                        checked={formData.permissions.includes('review_questions')}
                        onChange={handleInputChange}
                      /> 题目审核
                    </label>
                    <label style={{display: 'flex', alignItems: 'center', gap: '0.375rem'}}>
                      <input 
                        type="checkbox" 
                        name="permissions" 
                        value="edit_questions"
                        checked={formData.permissions.includes('edit_questions')}
                        onChange={handleInputChange}
                      /> 编辑题目
                    </label>
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
