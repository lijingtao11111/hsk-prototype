'use client'

import { useState, useEffect } from 'react'

export default function TestPrismaPage() {
  const [users, setUsers] = useState([])
  const [settings, setSettings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // 获取用户列表
      const usersResponse = await fetch('/api/users')
      const usersData = await usersResponse.json()
      
      // 获取系统设置
      const settingsResponse = await fetch('/api/settings')
      const settingsData = await settingsResponse.json()
      
      if (usersData.success) {
        setUsers(usersData.data)
      }
      
      if (settingsData.success) {
        setSettings(settingsData.data)
      }
      
    } catch (err) {
      setError('获取数据失败: ' + (err instanceof Error ? err.message : '未知错误'))
    } finally {
      setLoading(false)
    }
  }

  const testLogin = async () => {
    try {
      const response = await fetch('/api/auth/simple-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: 'admin',
          password: '123123'
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        alert('登录成功！用户信息：' + JSON.stringify(data.data.user, null, 2))
      } else {
        alert('登录失败：' + data.message)
      }
    } catch (err) {
      alert('登录请求失败：' + (err instanceof Error ? err.message : '未知错误'))
    }
  }

  if (loading) {
    return <div className="p-8">加载中...</div>
  }

  if (error) {
    return <div className="p-8 text-red-500">错误: {error}</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Prisma 数据库测试</h1>
      
      <div className="mb-8">
        <button 
          onClick={testLogin}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          测试管理员登录 (admin/123123)
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">用户列表</h2>
          <div className="bg-gray-100 p-4 rounded">
            {users.length > 0 ? (
              <ul className="space-y-2">
                {users.map((user: any) => (
                  <li key={user.id} className="border-b pb-2">
                    <div><strong>用户名:</strong> {user.username}</div>
                    <div><strong>真实姓名:</strong> {user.realName || '未设置'}</div>
                    <div><strong>角色:</strong> {user.role}</div>
                    <div><strong>状态:</strong> {user.status}</div>
                    <div><strong>部门:</strong> {user.department || '未设置'}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>暂无用户数据</p>
            )}
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">系统设置</h2>
          <div className="bg-gray-100 p-4 rounded">
            {settings.length > 0 ? (
              <ul className="space-y-2">
                {settings.map((setting: any) => (
                  <li key={setting.id} className="border-b pb-2">
                    <div><strong>键:</strong> {setting.key}</div>
                    <div><strong>值:</strong> {setting.value}</div>
                    <div><strong>描述:</strong> {setting.description || '无'}</div>
                    <div><strong>分类:</strong> {setting.category}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>暂无设置数据</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
