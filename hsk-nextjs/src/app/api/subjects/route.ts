import { NextResponse } from 'next/server'
import { subjectService } from '@/lib/db'

export async function GET() {
  try {
    const subjects = await subjectService.getAllSubjects()

    return NextResponse.json({
      success: true,
      data: subjects
    })
  } catch (error) {
    console.error('获取学科列表失败:', error)
    return NextResponse.json({
      success: false,
      message: '获取学科列表失败',
      error: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, code, description, createdById } = body

    // 验证必填字段
    if (!name || !code || !createdById) {
      return NextResponse.json({
        success: false,
        message: '学科名称、代码和创建者不能为空'
      }, { status: 400 })
    }

    // 创建新学科
    const subject = await subjectService.createSubject({
      name,
      code,
      description,
      createdById: parseInt(createdById)
    })

    return NextResponse.json({
      success: true,
      data: subject,
      message: '学科创建成功'
    })
  } catch (error) {
    console.error('创建学科失败:', error)

    // 处理唯一约束错误
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json({
        success: false,
        message: '学科代码已存在'
      }, { status: 400 })
    }

    return NextResponse.json({
      success: false,
      message: '创建学科失败',
      error: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 })
  }
}


