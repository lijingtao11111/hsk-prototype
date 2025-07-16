'use client'

import { useState } from 'react'

export default function TestUserApiPage() {
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const testGetUsers = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/users')
      const data = await response.json()
      setResult(JSON.stringify(data, null, 2))
    } catch (error) {
      setResult('Error: ' + error)
    } finally {
      setLoading(false)
    }
  }

  const testCreateUser = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'testuser' + Date.now(),
          password: '123456',
          realName: '测试用户',
          role: 'STUDENT',
          email: 'test@example.com',
          department: '计算机学院'
        }),
      })
      const data = await response.json()
      setResult(JSON.stringify(data, null, 2))
    } catch (error) {
      setResult('Error: ' + error)
    } finally {
      setLoading(false)
    }
  }

  const testLogin = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'admin',
          password: '123123'
        }),
      })
      const data = await response.json()
      setResult(JSON.stringify(data, null, 2))
    } catch (error) {
      setResult('Error: ' + error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>API 测试页面</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={testGetUsers} disabled={loading} style={{ marginRight: '10px' }}>
          测试获取用户列表
        </button>
        <button onClick={testCreateUser} disabled={loading} style={{ marginRight: '10px' }}>
          测试创建用户
        </button>
        <button onClick={testLogin} disabled={loading}>
          测试登录
        </button>
      </div>

      {loading && <p>加载中...</p>}
      
      <pre style={{ 
        background: '#f5f5f5', 
        padding: '10px', 
        borderRadius: '5px',
        whiteSpace: 'pre-wrap',
        maxHeight: '500px',
        overflow: 'auto'
      }}>
        {result || '点击按钮测试 API'}
      </pre>
    </div>
  )
}
