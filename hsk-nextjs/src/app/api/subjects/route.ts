import { NextResponse } from 'next/server'
import { PrismaClient } from '../../../../generated/prisma'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const subjects = await prisma.subject.findMany({
      include: {
        _count: {
          select: { questions: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

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
    const { name, code, description, category } = body

    // 验证必填字段
    if (!name || !code) {
      return NextResponse.json({
        success: false,
        message: '学科名称和代码不能为空'
      }, { status: 400 })
    }

    // 检查代码是否已存在
    const existingSubject = await prisma.subject.findUnique({
      where: { code }
    })

    if (existingSubject) {
      return NextResponse.json({
        success: false,
        message: '学科代码已存在'
      }, { status: 400 })
    }

    // 创建新学科
    const newSubject = await prisma.subject.create({
      data: {
        name,
        code,
        description: description || '',
        category: category || '其他'
      },
      include: {
        _count: {
          select: { questions: true }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: newSubject,
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


