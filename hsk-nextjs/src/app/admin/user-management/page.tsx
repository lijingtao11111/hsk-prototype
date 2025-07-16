"use client";

import { useState, useEffect } from 'react';
import AdminAuthGuard from '../../../components/AdminAuthGuard';
import AdminSidebar from '../../../components/AdminSidebar';
import '../../../styles/admin-user-management.css';
import '../../../styles/admin-filters.css';

interface User {
  id: number;
  username: string;
  email?: string;
  phone?: string;
  realName?: string;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  department?: string;
  studentId?: string;
  grade?: string;
  major?: string;
  createdAt: string;
  updatedAt: string;
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deptFilter, setDeptFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    phone: '',
    realName: '',
    role: 'STUDENT' as 'ADMIN' | 'TEACHER' | 'STUDENT',
    department: '',
    studentId: '',
    grade: '',
    major: ''
  });

  // 获取用户列表
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users');
      const result = await response.json();

      if (result.success) {
        setUsers(result.data);
      } else {
        console.error('获取用户列表失败:', result.message);
        setUsers([]);
      }
    } catch (error) {
      console.error('获取用户列表失败:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // 创建用户
  const createUser = async (userData: typeof formData) => {
    try {
      setSubmitting(true);
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (result.success) {
        alert('用户创建成功');
        setShowModal(false);
        resetForm();
        fetchUsers(); // 重新获取用户列表
      } else {
        alert('创建失败: ' + result.message);
      }
    } catch (error) {
      console.error('创建用户失败:', error);
      alert('创建失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  // 更新用户
  const updateUser = async (userId: number, userData: Partial<typeof formData>) => {
    try {
      setSubmitting(true);
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (result.success) {
        alert('用户更新成功');
        setShowModal(false);
        setEditingUser(null);
        resetForm();
        fetchUsers(); // 重新获取用户列表
      } else {
        alert('更新失败: ' + result.message);
      }
    } catch (error) {
      console.error('更新用户失败:', error);
      alert('更新失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  // 删除用户
  const deleteUser = async (userId: number, userName: string) => {
    if (!confirm(`确定要删除用户 "${userName}" 吗？此操作不可恢复。`)) {
      return;
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        alert('用户删除成功');
        fetchUsers(); // 重新获取用户列表
      } else {
        alert('删除失败: ' + result.message);
      }
    } catch (error) {
      console.error('删除用户失败:', error);
      alert('删除失败，请重试');
    }
  };

  // 重置表单
  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      email: '',
      phone: '',
      realName: '',
      role: 'STUDENT',
      department: '',
      studentId: '',
      grade: '',
      major: ''
    });
  };

  // 新增用户
  const handleAdd = () => {
    setEditingUser(null);
    resetForm();
    setShowModal(true);
  };

  // 编辑用户
  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      password: '', // 编辑时不显示密码
      email: user.email || '',
      phone: user.phone || '',
      realName: user.realName || '',
      role: user.role,
      department: user.department || '',
      studentId: user.studentId || '',
      grade: user.grade || '',
      major: user.major || ''
    });
    setShowModal(true);
  };

  // 表单输入处理
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 表单提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username || !formData.realName) {
      alert('用户名和真实姓名不能为空');
      return;
    }

    if (!editingUser && !formData.password) {
      alert('新用户密码不能为空');
      return;
    }

    if (editingUser) {
      // 编辑模式，不传递密码字段（除非用户填写了新密码）
      const updateData = { ...formData };
      if (!updateData.password) {
        delete (updateData as any).password;
      }
      updateUser(editingUser.id, updateData);
    } else {
      // 新增模式
      createUser(formData);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 工具函数
  const getRoleName = (role: string) => {
    const roles: Record<string, string> = {
      ADMIN: '管理员',
      TEACHER: '教师',
      STUDENT: '学生'
    };
    return roles[role] || role;
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { text: string; class: string }> = {
      ACTIVE: { text: '已激活', class: 'status-active' },
      INACTIVE: { text: '未激活', class: 'status-inactive' },
      SUSPENDED: { text: '已暂停', class: 'status-suspended' }
    };
    return badges[status] || badges.ACTIVE;
  };

  // 筛选用户
  const filteredUsers = users.filter(user => {
    const matchesSearch = (user.realName || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesDept = deptFilter === 'all' || (user.department || '').includes(deptFilter);

    return matchesSearch && matchesRole && matchesStatus && matchesDept;
  });

  return (
    <AdminAuthGuard>
      <div className="admin-layout">
        <AdminSidebar currentPage="user-management" />
        
        <div className="main-content">
          <div className="topbar">
            <h1 className="page-title">用户管理</h1>
            <div className="topbar-actions">
              <button className="btn btn-primary" onClick={handleAdd}>
                <i className="ri-add-line btn-icon"></i>
                新增用户
              </button>
            </div>
          </div>
          
          <div className="filter-area">
            <div className="search-box">
              <i className="ri-search-line search-icon"></i>
              <input
                type="text"
                placeholder="搜索姓名..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-group">
              <div className="filter-item">
                <span className="filter-label">角色:</span>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">全部角色</option>
                  <option value="STUDENT">学生</option>
                  <option value="TEACHER">教师</option>
                  <option value="ADMIN">管理员</option>
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
                  <option value="ACTIVE">已激活</option>
                  <option value="INACTIVE">未激活</option>
                  <option value="SUSPENDED">已暂停</option>
                </select>
              </div>

              <div className="filter-item">
                <span className="filter-label">院系:</span>
                <select
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">全部院系</option>
                  <option value="computer">计算机学院</option>
                  <option value="foreign">外国语学院</option>
                  <option value="economics">经济学院</option>
                  <option value="management">管理学院</option>
                </select>
              </div>

              <button
                className="filter-clear"
                onClick={() => {
                  setSearchTerm('');
                  setRoleFilter('all');
                  setStatusFilter('all');
                  setDeptFilter('all');
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
                    <th style={{width: '30%'}}>用户信息</th>
                    <th style={{width: '15%'}}>角色</th>
                    <th style={{width: '15%'}}>院系</th>
                    <th style={{width: '15%'}}>状态</th>
                    <th style={{width: '15%'}}>注册日期</th>
                    <th style={{width: '10%'}}>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} style={{textAlign: 'center', padding: '2rem'}}>
                        加载中...
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{textAlign: 'center', padding: '2rem'}}>
                        暂无用户数据
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => {
                      const statusBadge = getStatusBadge(user.status);
                      return (
                        <tr key={user.id}>
                          <td>
                            <div className="user-info">
                              <div className="user-avatar">{(user.realName || user.username).charAt(0).toUpperCase()}</div>
                              <div className="user-details">
                                <div className="user-name">{user.realName || user.username}</div>
                                <div className="user-meta">{user.username}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className={`role-badge role-${user.role.toLowerCase()}`}>
                              {getRoleName(user.role)}
                            </span>
                          </td>
                          <td>
                            <div className="department-name">{user.department || '未设置'}</div>
                          </td>
                          <td>
                            <span className={`status-badge ${statusBadge.class}`}>
                              {statusBadge.text}
                            </span>
                          </td>
                          <td>
                            <div className="register-date">{new Date(user.createdAt).toLocaleDateString()}</div>
                          </td>
                          <td>
                            <div className="actions-cell">
                              <button
                                className="action-btn"
                                title="编辑"
                                onClick={() => handleEdit(user)}
                              >
                                <i className="ri-edit-line"></i>
                              </button>
                              <button
                                className="action-btn"
                                title="删除"
                                onClick={() => deleteUser(user.id, user.realName || user.username)}
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
          </div>
        </div>

        {/* 用户编辑/新增模态框 */}
        {showModal && (
          <div className="modal-overlay show">
            <div className="modal">
              <div className="modal-header">
                <h3 className="modal-title">
                  {editingUser ? '编辑用户' : '新增用户'}
                </h3>
                <button className="modal-close" onClick={() => setShowModal(false)}>
                  <i className="ri-close-line"></i>
                </button>
              </div>

              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="username" className="form-label">用户名 *</label>
                      <input
                        type="text"
                        id="username"
                        name="username"
                        className="form-input"
                        placeholder="请输入用户名"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                        disabled={editingUser !== null}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="role" className="form-label">用户角色 *</label>
                      <select
                        id="role"
                        name="role"
                        className="form-select"
                        value={formData.role}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">选择角色</option>
                        <option value="STUDENT">学生</option>
                        <option value="TEACHER">教师</option>
                        <option value="ADMIN">管理员</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="realName" className="form-label">真实姓名 *</label>
                      <input
                        type="text"
                        id="realName"
                        name="realName"
                        className="form-input"
                        placeholder="请输入真实姓名"
                        value={formData.realName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="password" className="form-label">
                        {editingUser ? '新密码（留空不修改）' : '密码 *'}
                      </label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        className="form-input"
                        placeholder={editingUser ? '留空不修改密码' : '请输入密码'}
                        value={formData.password}
                        onChange={handleInputChange}
                        required={!editingUser}
                      />
                    </div>
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="email" className="form-label">邮箱</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-input"
                        placeholder="请输入邮箱"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="phone" className="form-label">电话</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className="form-input"
                        placeholder="请输入电话号码"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="department" className="form-label">部门/院系</label>
                      <input
                        type="text"
                        id="department"
                        name="department"
                        className="form-input"
                        placeholder="请输入部门或院系"
                        value={formData.department}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="studentId" className="form-label">学号/工号</label>
                      <input
                        type="text"
                        id="studentId"
                        name="studentId"
                        className="form-input"
                        placeholder="请输入学号或工号"
                        value={formData.studentId}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  {formData.role === 'STUDENT' && (
                    <div className="form-grid">
                      <div className="form-group">
                        <label htmlFor="grade" className="form-label">年级</label>
                        <input
                          type="text"
                          id="grade"
                          name="grade"
                          className="form-input"
                          placeholder="请输入年级"
                          value={formData.grade}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="major" className="form-label">专业</label>
                        <input
                          type="text"
                          id="major"
                          name="major"
                          className="form-input"
                          placeholder="请输入专业"
                          value={formData.major}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  )}

                </form>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? '保存中...' : (editingUser ? '更新' : '保存')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminAuthGuard>
  );
}
