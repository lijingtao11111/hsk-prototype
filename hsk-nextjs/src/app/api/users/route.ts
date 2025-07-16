import { NextResponse } from 'next/server'
import { userService } from '@/lib/db'

export async function GET() {
  try {
    const users = await userService.getAllUsers()

    return NextResponse.json({
      success: true,
      data: users
    })
  } catch (error) {
    console.error('获取用户列表失败:', error)
    return NextResponse.json({
      success: false,
      message: '获取用户列表失败',
      error: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password, email, phone, realName, role, department, studentId, grade, major } = body

    // 验证必填字段
    if (!username || !password) {
      return NextResponse.json({
        success: false,
        message: '用户名和密码不能为空'
      }, { status: 400 })
    }

    // 检查用户名是否已存在
    const existingUser = await userService.getUserByUsername(username)

    if (existingUser) {
      return NextResponse.json({
        success: false,
        message: '用户名已存在'
      }, { status: 400 })
    }

    // 创建新用户
    const user = await userService.createUser({
      username,
      password,
      email,
      phone,
      realName,
      role: role || 'STUDENT',
      department,
      studentId,
      grade,
      major
    })

    return NextResponse.json({
      success: true,
      data: user,
      message: '用户创建成功'
    })
  } catch (error) {
    console.error('创建用户失败:', error)
    return NextResponse.json({
      success: false,
      message: '创建用户失败',
      error: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 })
  }
}
