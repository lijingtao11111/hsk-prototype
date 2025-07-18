import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '../../../../../generated/prisma'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        message: '无效的题目ID'
      }, { status: 400 })
    }

    const question = await prisma.question.findUnique({
      where: { id },
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

    if (!question) {
      return NextResponse.json({
        success: false,
        message: '题目不存在'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: question
    })
  } catch (error) {
    console.error('获取题目失败:', error)
    return NextResponse.json({
      success: false,
      message: '获取题目失败'
    }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const body = await request.json()
    const { title, content, type, difficulty, options, answer, explanation, subjectId } = body

    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        message: '无效的题目ID'
      }, { status: 400 })
    }

    // 验证必填字段
    if (!title || !content || !type || !answer || !subjectId) {
      return NextResponse.json({
        success: false,
        message: '题目标题、内容、类型、答案和学科不能为空'
      }, { status: 400 })
    }

    // 检查题目是否存在
    const existingQuestion = await prisma.question.findUnique({
      where: { id }
    })

    if (!existingQuestion) {
      return NextResponse.json({
        success: false,
        message: '题目不存在'
      }, { status: 404 })
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

    // 更新题目
    const updatedQuestion = await prisma.question.update({
      where: { id },
      data: {
        title,
        content,
        type,
        difficulty: difficulty || 1,
        options: options ? JSON.stringify(options) : null,
        answer,
        explanation: explanation || '',
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
      data: updatedQuestion,
      message: '题目更新成功'
    })
  } catch (error) {
    console.error('更新题目失败:', error)
    return NextResponse.json({
      success: false,
      message: '更新题目失败'
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        message: '无效的题目ID'
      }, { status: 400 })
    }

    // 检查题目是否存在
    const existingQuestion = await prisma.question.findUnique({
      where: { id }
    })

    if (!existingQuestion) {
      return NextResponse.json({
        success: false,
        message: '题目不存在'
      }, { status: 404 })
    }

    // 删除题目
    await prisma.question.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: '题目删除成功'
    })
  } catch (error) {
    console.error('删除题目失败:', error)
    return NextResponse.json({
      success: false,
      message: '删除题目失败'
    }, { status: 500 })
  }
}
