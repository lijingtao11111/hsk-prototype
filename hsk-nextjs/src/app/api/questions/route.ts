import { NextResponse } from 'next/server'
import { PrismaClient } from '../../../../generated/prisma'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const subjectId = searchParams.get('subjectId')
    const type = searchParams.get('type')
    const difficulty = searchParams.get('difficulty')

    // 构建查询条件
    const where: any = {}

    if (subjectId) {
      where.subjectId = parseInt(subjectId)
    }

    if (type) {
      where.type = type
    }

    if (difficulty) {
      where.difficulty = parseInt(difficulty)
    }

    // 从数据库获取题目数据
    const questions = await prisma.question.findMany({
      where,
      include: {
        subject: {
          select: {
            id: true,
            name: true,
            code: true
          }
        }
      },
      orderBy: {
        id: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      data: questions
    })
  } catch (error) {
    console.error('获取题目列表失败:', error)
    return NextResponse.json({
      success: false,
      message: '获取题目列表失败',
      error: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { subjectId } = body

    // 验证必填字段
    if (!subjectId) {
      return NextResponse.json({
        success: false,
        message: '学科不能为空'
      }, { status: 400 })
    }

    // 验证学科是否存在
    const subject = await prisma.subject.findUnique({
      where: { id: parseInt(subjectId) }
    })

    if (!subject) {
      return NextResponse.json({
        success: false,
        message: '指定的学科不存在'
      }, { status: 400 })
    }

    // 创建题目 - 使用数据库实际字段
    const newQuestion = await prisma.question.create({
      data: {
        stem: '新题目', // 提供默认的题干内容
        answer: 'A', // 提供默认答案
        subjectId: parseInt(subjectId)
      },
      include: {
        subject: {
          select: {
            id: true,
            name: true,
            code: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: newQuestion,
      message: '题目创建成功'
    })
  } catch (error) {
    console.error('创建题目失败:', error)
    return NextResponse.json({
      success: false,
      message: '创建题目失败',
      error: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 })
  }
}
