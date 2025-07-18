"use client";

import { useState, useEffect } from 'react';
import AdminAuthGuard from '../../../components/AdminAuthGuard';
import AdminSidebar from '../../../components/AdminSidebar';
import '../../../styles/admin-user-management.css';
import { useToast } from '../../../hooks/use-toast';
import { useConfirmDialog } from '../../../components/ui/confirm-dialog';

export default function SubjectManagementPage() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { toast } = useToast();
  const { confirm, ConfirmDialog } = useConfirmDialog();

  // 获取学科列表
  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/subjects');
      const result = await response.json();

      if (result.success) {
        setSubjects(result.data || []);
      } else {
        console.error('获取学科列表失败:', result.error);
        setSubjects([]);
      }
    } catch (error) {
      console.error('获取学科列表失败:', error);
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, [categoryFilter, statusFilter]);

  // 表单数据状态
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    category: ''
  })

  // 处理表单输入
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // 新增学科
  const handleAdd = () => {
    setEditingSubject(null)
    setFormData({
      name: '',
      code: '',
      description: '',
      category: ''
    })
    setShowModal(true)
  }

  // 编辑学科
  const handleEdit = (subject) => {
    setEditingSubject(subject)
    setFormData({
      name: subject.name,
      code: subject.code,
      description: subject.description || '',
      category: subject.category || ''
    })
    setShowModal(true)
  }

  // 提交表单
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name || !formData.code) {
      console.log('Toast called with duration:', 3000)
      toast({
        title: "表单验证失败",
        description: "请填写学科名称和代码",
        variant: "destructive",
        duration: 3000
      })
      return
    }

    try {
      setSubmitting(true)

      const url = editingSubject ? `/api/subjects/${editingSubject.id}` : '/api/subjects'
      const method = editingSubject ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "操作成功",
          description: editingSubject ? '学科更新成功' : '学科创建成功',
          variant: "success"
        })
        setShowModal(false)
        fetchSubjects()
      } else {
        toast({
          title: "操作失败",
          description: result.message || '操作失败',
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('提交失败:', error)
      toast({
        title: "操作失败",
        description: '操作失败',
        variant: "destructive"
      })
    } finally {
      setSubmitting(false)
    }
  }

  // 删除学科
  const deleteSubject = async (id: number, name: string) => {
    confirm({
      title: '确认删除',
      description: `确定要删除学科 "${name}" 吗？此操作不可恢复。`,
      variant: 'destructive',
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/subjects/${id}`, {
            method: 'DELETE',
          })

          const result = await response.json()

          if (result.success) {
            toast({
              title: "删除成功",
              description: '学科删除成功',
              variant: "success"
            })
            fetchSubjects()
          } else {
            toast({
              title: "删除失败",
              description: result.message || '删除失败',
              variant: "destructive"
            })
          }
        } catch (error) {
          console.error('删除失败:', error)
          toast({
            title: "删除失败",
            description: '删除失败',
            variant: "destructive"
          })
        }
      }
    })
  }

  // 筛选学科
  const filteredSubjects = subjects.filter(subject => {
    const matchesSearch = subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subject.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (subject.description && subject.description.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = categoryFilter === 'all' || subject.category === categoryFilter

    const matchesStatus = statusFilter === 'all' ||
                         (statusFilter === 'active' ? subject.isActive : !subject.isActive)

    return matchesSearch && matchesCategory && matchesStatus
  })

  return (
    <AdminAuthGuard>
      <div className="admin-layout">
        <AdminSidebar currentPage="subject-management" />
        
        <div className="main-content">
          <div className="topbar">
            <h1 className="page-title">学科管理</h1>
            <button className="btn btn-primary" onClick={handleAdd}>
              <i className="ri-add-line btn-icon"></i>
              新增学科
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
                    <th style={{width: '25%'}}>学科信息</th>
                    <th style={{width: '15%'}}>类别</th>
                    <th style={{width: '15%'}}>题目数量</th>
                    <th style={{width: '25%'}}>描述</th>
                    <th style={{width: '10%'}}>状态</th>
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
                  ) : filteredSubjects.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)'}}>
                        暂无学科数据
                      </td>
                    </tr>
                  ) : (
                    filteredSubjects.map((subject) => (
                      <tr key={subject.id}>
                        <td>
                          <div className="user-info">
                            <div className="user-avatar">{subject.name.charAt(0)}</div>
                            <div className="user-details">
                              <div className="user-name">{subject.name}</div>
                              <div className="user-meta">{subject.code}</div>
                            </div>
                          </div>
                        </td>
                        <td>{subject.category || '未分类'}</td>
                        <td>
                          <span className="question-count">
                            {subject._count?.questions || 0} 道题目
                          </span>
                        </td>
                        <td>
                          <div className="subject-description" style={{
                            maxWidth: '200px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {subject.description || '暂无描述'}
                          </div>
                        </td>
                        <td>
                          <span className={`status-badge ${subject.isActive ? 'status-active' : 'status-inactive'}`}>
                            {subject.isActive ? '启用' : '禁用'}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="action-btn"
                              title="编辑"
                              onClick={() => handleEdit(subject)}
                            >
                              <i className="ri-edit-line"></i>
                            </button>
                            <button
                              className="action-btn"
                              title="删除"
                              onClick={() => deleteSubject(subject.id, subject.name)}
                            >
                              <i className="ri-delete-bin-line"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 学科编辑/新增模态框 */}
          {showModal && (
            <div className="modal-overlay show">
              <div className="modal">
                <div className="modal-header">
                  <h3 className="modal-title">
                    {editingSubject ? '编辑学科' : '新增学科'}
                  </h3>
                  <button className="modal-close" onClick={() => setShowModal(false)}>
                    <i className="ri-close-line"></i>
                  </button>
                </div>

                <div className="modal-body">
                  <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                      <div className="form-group">
                        <label htmlFor="name" className="form-label">学科名称 *</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          className="form-input"
                          placeholder="请输入学科名称"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="code" className="form-label">学科代码 *</label>
                        <input
                          type="text"
                          id="code"
                          name="code"
                          className="form-input"
                          placeholder="请输入学科代码"
                          value={formData.code}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="category" className="form-label">学科分类</label>
                      <select
                        id="category"
                        name="category"
                        className="form-select"
                        value={formData.category}
                        onChange={handleInputChange}
                      >
                        <option value="">选择分类</option>
                        <option value="语言">语言</option>
                        <option value="数学">数学</option>
                        <option value="科学">科学</option>
                        <option value="文化">文化</option>
                        <option value="其他">其他</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="description" className="form-label">学科描述</label>
                      <textarea
                        id="description"
                        name="description"
                        className="form-input"
                        placeholder="请输入学科描述"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={3}
                      />
                    </div>
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
                    {submitting ? '保存中...' : (editingSubject ? '更新' : '保存')}
                  </button>
                </div>
              </div>
            </div>
          )}
          <ConfirmDialog />
        </div>
      </div>
    </AdminAuthGuard>
  );
}
