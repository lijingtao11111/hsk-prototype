import { NextResponse } from 'next/server'
import { userService } from '@/lib/db'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json({
        success: false,
        message: '用户名和密码不能为空'
      }, { status: 400 })
    }

    // 查找用户
    const user = await userService.getUserByUsername(username)
    
    if (!user) {
      return NextResponse.json({
        success: false,
        message: '用户名或密码错误'
      }, { status: 401 })
    }

    // 检查用户状态
    if (user.status !== 'ACTIVE') {
      return NextResponse.json({
        success: false,
        message: '账户已被禁用'
      }, { status: 401 })
    }

    // 验证密码
    const isValidPassword = await userService.verifyPassword(password, user.password)
    
    if (!isValidPassword) {
      return NextResponse.json({
        success: false,
        message: '用户名或密码错误'
      }, { status: 401 })
    }

    // 生成 JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    // 返回用户信息（不包含密码）
    const userInfo = {
      id: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      realName: user.realName,
      role: user.role,
      status: user.status,
      department: user.department
    }

    return NextResponse.json({
      success: true,
      message: '登录成功',
      data: {
        user: userInfo,
        token
      }
    })
  } catch (error) {
    console.error('登录失败:', error)
    return NextResponse.json({
      success: false,
      message: '登录失败',
      error: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 })
  }
}
