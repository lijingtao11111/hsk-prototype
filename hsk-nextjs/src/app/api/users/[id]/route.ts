import { NextResponse } from 'next/server'
import { userService } from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id)
    
    if (isNaN(userId)) {
      return NextResponse.json({
        success: false,
        message: '无效的用户ID'
      }, { status: 400 })
    }

    const user = await userService.getUserById(userId)

    if (!user) {
      return NextResponse.json({
        success: false,
        message: '用户不存在'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: user
    })
  } catch (error) {
    console.error('获取用户详情失败:', error)
    return NextResponse.json({
      success: false,
      message: '获取用户详情失败',
      error: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id)
    
    if (isNaN(userId)) {
      return NextResponse.json({
        success: false,
        message: '无效的用户ID'
      }, { status: 400 })
    }

    const body = await request.json()
    const { email, phone, realName, role, status, department, studentId, grade, major } = body

    const user = await userService.updateUser(userId, {
      email,
      phone,
      realName,
      role,
      status,
      department,
      studentId,
      grade,
      major
    })

    return NextResponse.json({
      success: true,
      data: user,
      message: '用户更新成功'
    })
  } catch (error) {
    console.error('更新用户失败:', error)
    return NextResponse.json({
      success: false,
      message: '更新用户失败',
      error: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id)
    
    if (isNaN(userId)) {
      return NextResponse.json({
        success: false,
        message: '无效的用户ID'
      }, { status: 400 })
    }

    await userService.deleteUser(userId)

    return NextResponse.json({
      success: true,
      message: '用户删除成功'
    })
  } catch (error) {
    console.error('删除用户失败:', error)
    return NextResponse.json({
      success: false,
      message: '删除用户失败',
      error: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 })
  }
}
