'use client'

import { useState, useEffect } from 'react'

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

export default function TestUserManagementPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    realName: '',
    role: 'STUDENT' as 'ADMIN' | 'TEACHER' | 'STUDENT',
    email: '',
    department: ''
  })

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/users')
      const result = await response.json()
      if (result.success) {
        setUsers(result.data)
      } else {
        alert('获取用户失败: ' + result.message)
      }
    } catch (error) {
      alert('获取用户失败: ' + error)
    } finally {
      setLoading(false)
    }
  }

  const createUser = async () => {
    if (!formData.username || !formData.password || !formData.realName) {
      alert('请填写必填字段')
      return
    }

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        alert('用户创建成功')
        setShowModal(false)
        setFormData({
          username: '',
          password: '',
          realName: '',
          role: 'STUDENT',
          email: '',
          department: ''
        })
        fetchUsers()
      } else {
        alert('创建失败: ' + result.message)
      }
    } catch (error) {
      alert('创建失败: ' + error)
    }
  }

  const deleteUser = async (userId: number, userName: string) => {
    if (!confirm(`确定要删除用户 "${userName}" 吗？`)) {
      return
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        alert('用户删除成功')
        fetchUsers()
      } else {
        alert('删除失败: ' + result.message)
      }
    } catch (error) {
      alert('删除失败: ' + error)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <div style={{ padding: '20px' }}>
      <h1>用户管理测试页面</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setShowModal(true)} style={{ marginRight: '10px' }}>
          新增用户
        </button>
        <button onClick={fetchUsers}>
          刷新列表
        </button>
      </div>

      {loading && <p>加载中...</p>}

      <table border={1} style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>用户名</th>
            <th>真实姓名</th>
            <th>角色</th>
            <th>邮箱</th>
            <th>部门</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.realName || '-'}</td>
              <td>{user.role}</td>
              <td>{user.email || '-'}</td>
              <td>{user.department || '-'}</td>
              <td>{user.status}</td>
              <td>
                <button onClick={() => deleteUser(user.id, user.realName || user.username)}>
                  删除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '5px',
            minWidth: '400px'
          }}>
            <h3>新增用户</h3>
            
            <div style={{ marginBottom: '10px' }}>
              <label>用户名 *</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                style={{ width: '100%', padding: '5px' }}
              />
            </div>

            <div style={{ marginBottom: '10px' }}>
              <label>密码 *</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                style={{ width: '100%', padding: '5px' }}
              />
            </div>

            <div style={{ marginBottom: '10px' }}>
              <label>真实姓名 *</label>
              <input
                type="text"
                value={formData.realName}
                onChange={(e) => setFormData({...formData, realName: e.target.value})}
                style={{ width: '100%', padding: '5px' }}
              />
            </div>

            <div style={{ marginBottom: '10px' }}>
              <label>角色</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value as any})}
                style={{ width: '100%', padding: '5px' }}
              >
                <option value="STUDENT">学生</option>
                <option value="TEACHER">教师</option>
                <option value="ADMIN">管理员</option>
              </select>
            </div>

            <div style={{ marginBottom: '10px' }}>
              <label>邮箱</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                style={{ width: '100%', padding: '5px' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label>部门</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
                style={{ width: '100%', padding: '5px' }}
              />
            </div>

            <div>
              <button onClick={createUser} style={{ marginRight: '10px' }}>
                创建
              </button>
              <button onClick={() => setShowModal(false)}>
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
