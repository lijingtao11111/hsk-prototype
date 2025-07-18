'use client'

import { useState, useEffect } from 'react'
import AdminAuthGuard from '../../../components/AdminAuthGuard'
import AdminSidebar from '../../../components/AdminSidebar'
import '../../../styles/admin-user-management.css'
import { useToast } from '../../../hooks/use-toast'
import { useConfirmDialog } from '../../../components/ui/confirm-dialog'

interface Question {
  id: number
  title: string
  content: string
  type: string
  difficulty: number
  options?: string
  answer: string
  explanation?: string
  subjectId: number
  subject: {
    id: number
    name: string
    code: string
  }
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface Subject {
  id: number
  name: string
  code: string
}

export default function QuestionManagementPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [difficultyFilter, setDifficultyFilter] = useState('all')

  const { toast } = useToast()
  const { confirm, ConfirmDialog } = useConfirmDialog()

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'SINGLE_CHOICE',
    difficulty: 1,
    options: ['', '', '', ''],
    answer: '',
    explanation: '',
    subjectId: ''
  })

  // 题目类型选项
  const questionTypes = [
    { value: 'SINGLE_CHOICE', label: '单选题' },
    { value: 'MULTIPLE_CHOICE', label: '多选题' },
    { value: 'TRUE_FALSE', label: '判断题' },
    { value: 'FILL_BLANK', label: '填空题' },
    { value: 'SHORT_ANSWER', label: '简答题' }
  ]

  // 获取题目列表
  const fetchQuestions = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/questions')
      const result = await response.json()
      
      if (result.success) {
        setQuestions(result.data || [])
      } else {
        console.error('获取题目失败:', result.error)
        setQuestions([])
      }
    } catch (error) {
      console.error('获取题目失败:', error)
      setQuestions([])
    } finally {
      setLoading(false)
    }
  }

  // 获取学科列表
  const fetchSubjects = async () => {
    try {
      const response = await fetch('/api/subjects')
      const result = await response.json()
      
      if (result.success) {
        setSubjects(result.data || [])
      } else {
        console.error('获取学科失败:', result.error)
        setSubjects([])
      }
    } catch (error) {
      console.error('获取学科失败:', error)
      setSubjects([])
    }
  }

  useEffect(() => {
    fetchQuestions()
    fetchSubjects()
  }, [])

  // 处理表单输入
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name === 'difficulty') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  // 处理选项输入
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options]
    newOptions[index] = value
    setFormData(prev => ({ ...prev, options: newOptions }))
  }

  // 新增题目
  const handleAdd = () => {
    setEditingQuestion(null)
    setFormData({
      title: '',
      content: '',
      type: 'SINGLE_CHOICE',
      difficulty: 1,
      options: ['', '', '', ''],
      answer: '',
      explanation: '',
      subjectId: ''
    })
    setShowModal(true)
  }

  // 编辑题目
  const handleEdit = (question: Question) => {
    setEditingQuestion(question)
    const options = question.options ? JSON.parse(question.options) : ['', '', '', '']
    setFormData({
      title: question.title,
      content: question.content,
      type: question.type,
      difficulty: question.difficulty,
      options: Array.isArray(options) ? options : ['', '', '', ''],
      answer: question.answer,
      explanation: question.explanation || '',
      subjectId: question.subjectId.toString()
    })
    setShowModal(true)
  }

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.content || !formData.answer || !formData.subjectId) {
      toast({
        title: "表单验证失败",
        description: "请填写必填字段",
        variant: "destructive"
      })
      return
    }

    try {
      setSubmitting(true)
      
      const url = editingQuestion ? `/api/questions/${editingQuestion.id}` : '/api/questions'
      const method = editingQuestion ? 'PUT' : 'POST'
      
      const submitData = {
        ...formData,
        options: ['SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'TRUE_FALSE'].includes(formData.type) 
          ? formData.options.filter(opt => opt.trim()) 
          : null
      }
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "操作成功",
          description: editingQuestion ? '题目更新成功' : '题目创建成功',
          variant: "success"
        })
        setShowModal(false)
        fetchQuestions()
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

  // 删除题目
  const deleteQuestion = async (id: number, title: string) => {
    confirm({
      title: '确认删除',
      description: `确定要删除题目 "${title}" 吗？此操作不可恢复。`,
      variant: 'destructive',
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/questions/${id}`, {
            method: 'DELETE',
          })

          const result = await response.json()

          if (result.success) {
            toast({
              title: "删除成功",
              description: '题目删除成功',
              variant: "success"
            })
            fetchQuestions()
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

  // 筛选题目
  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubject = subjectFilter === 'all' || question.subjectId.toString() === subjectFilter
    const matchesType = typeFilter === 'all' || question.type === typeFilter
    const matchesDifficulty = difficultyFilter === 'all' || question.difficulty.toString() === difficultyFilter
    
    return matchesSearch && matchesSubject && matchesType && matchesDifficulty
  })

  return (
    <AdminAuthGuard>
      <div className="admin-layout">
        <AdminSidebar currentPage="question-management" />
        
        <div className="main-content">
          <div className="topbar">
            <h1 className="page-title">题库管理</h1>
            <div className="topbar-actions">
              <button className="btn btn-primary" onClick={handleAdd}>
                <i className="ri-add-line btn-icon"></i>
                新增题目
              </button>
            </div>
          </div>

          {/* 筛选区域 */}
          <div className="filter-area">
            <div className="search-box">
              <i className="ri-search-line search-icon"></i>
              <input
                type="text"
                placeholder="搜索题目标题或内容..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
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
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id.toString()}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-item">
                <span className="filter-label">类型:</span>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">全部类型</option>
                  {questionTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
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
                  <option value="1">1星</option>
                  <option value="2">2星</option>
                  <option value="3">3星</option>
                  <option value="4">4星</option>
                  <option value="5">5星</option>
                </select>
              </div>

              <button
                className="btn btn-outline"
                onClick={() => {
                  setSearchTerm('')
                  setSubjectFilter('all')
                  setTypeFilter('all')
                  setDifficultyFilter('all')
                }}
              >
                重置筛选
              </button>
            </div>
          </div>

          {/* 题目列表 */}
          <div className="card">
            <div className="card-content">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>题目信息</th>
                    <th>学科</th>
                    <th>类型</th>
                    <th>难度</th>
                    <th>状态</th>
                    <th>创建时间</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>
                        加载中...
                      </td>
                    </tr>
                  ) : filteredQuestions.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>
                        暂无题目数据
                      </td>
                    </tr>
                  ) : (
                    filteredQuestions.map((question) => (
                      <tr key={question.id}>
                        <td>
                          <div className="user-info">
                            <div className="user-avatar">{question.title.charAt(0)}</div>
                            <div className="user-details">
                              <div className="user-name">{question.title}</div>
                              <div className="user-meta" style={{ 
                                maxWidth: '300px', 
                                overflow: 'hidden', 
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}>
                                {question.content}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>{question.subject.name}</td>
                        <td>
                          {questionTypes.find(t => t.value === question.type)?.label || question.type}
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            {'★'.repeat(question.difficulty)}
                            {'☆'.repeat(5 - question.difficulty)}
                          </div>
                        </td>
                        <td>
                          <span className={`status-badge ${question.isActive ? 'status-active' : 'status-inactive'}`}>
                            {question.isActive ? '启用' : '禁用'}
                          </span>
                        </td>
                        <td>{new Date(question.createdAt).toLocaleDateString()}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="action-btn"
                              title="编辑"
                              onClick={() => handleEdit(question)}
                            >
                              <i className="ri-edit-line"></i>
                            </button>
                            <button
                              className="action-btn"
                              title="删除"
                              onClick={() => deleteQuestion(question.id, question.title)}
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

          {/* 题目编辑/新增模态框 */}
          {showModal && (
            <div className="modal-overlay show">
              <div className="modal">
                <div className="modal-header">
                  <h3 className="modal-title">
                    {editingQuestion ? '编辑题目' : '新增题目'}
                  </h3>
                  <button className="modal-close" onClick={() => setShowModal(false)}>
                    <i className="ri-close-line"></i>
                  </button>
                </div>

                <div className="modal-body">
                  <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                      <div className="form-group">
                        <label htmlFor="title" className="form-label">题目标题 *</label>
                        <input
                          type="text"
                          id="title"
                          name="title"
                          className="form-input"
                          placeholder="请输入题目标题"
                          value={formData.title}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="subjectId" className="form-label">所属学科 *</label>
                        <select
                          id="subjectId"
                          name="subjectId"
                          className="form-select"
                          value={formData.subjectId}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">选择学科</option>
                          {subjects.map(subject => (
                            <option key={subject.id} value={subject.id.toString()}>
                              {subject.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="content" className="form-label">题目内容 *</label>
                      <textarea
                        id="content"
                        name="content"
                        className="form-input"
                        placeholder="请输入题目内容"
                        value={formData.content}
                        onChange={handleInputChange}
                        rows={3}
                        required
                      />
                    </div>

                    <div className="form-grid">
                      <div className="form-group">
                        <label htmlFor="type" className="form-label">题目类型 *</label>
                        <select
                          id="type"
                          name="type"
                          className="form-select"
                          value={formData.type}
                          onChange={handleInputChange}
                          required
                        >
                          {questionTypes.map(type => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label htmlFor="difficulty" className="form-label">难度等级 *</label>
                        <select
                          id="difficulty"
                          name="difficulty"
                          className="form-select"
                          value={formData.difficulty}
                          onChange={handleInputChange}
                          required
                        >
                          <option value={1}>1星 (简单)</option>
                          <option value={2}>2星 (较易)</option>
                          <option value={3}>3星 (中等)</option>
                          <option value={4}>4星 (较难)</option>
                          <option value={5}>5星 (困难)</option>
                        </select>
                      </div>
                    </div>

                    {/* 选择题选项 */}
                    {['SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'TRUE_FALSE'].includes(formData.type) && (
                      <div className="form-group">
                        <label className="form-label">选项设置 *</label>
                        {formData.type === 'TRUE_FALSE' ? (
                          <div className="form-grid">
                            <div className="form-group">
                              <input
                                type="text"
                                className="form-input"
                                value="正确"
                                disabled
                              />
                            </div>
                            <div className="form-group">
                              <input
                                type="text"
                                className="form-input"
                                value="错误"
                                disabled
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="options-container">
                            {formData.options.map((option, index) => (
                              <div key={index} className="option-item">
                                <span className="option-label">{String.fromCharCode(65 + index)}:</span>
                                <input
                                  type="text"
                                  className="form-input"
                                  placeholder={`选项${String.fromCharCode(65 + index)}`}
                                  value={option}
                                  onChange={(e) => handleOptionChange(index, e.target.value)}
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="form-group">
                      <label htmlFor="answer" className="form-label">正确答案 *</label>
                      <input
                        type="text"
                        id="answer"
                        name="answer"
                        className="form-input"
                        placeholder="请输入正确答案"
                        value={formData.answer}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="explanation" className="form-label">答案解析</label>
                      <textarea
                        id="explanation"
                        name="explanation"
                        className="form-input"
                        placeholder="请输入答案解析"
                        value={formData.explanation}
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
                    {submitting ? '保存中...' : (editingQuestion ? '更新' : '保存')}
                  </button>
                </div>
              </div>
            </div>
          )}
          <ConfirmDialog />
        </div>
      </div>
    </AdminAuthGuard>
  )
}
