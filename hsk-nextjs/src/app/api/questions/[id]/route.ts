import { NextResponse } from 'next/server'
import { questionService } from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const questionId = parseInt(params.id)
    
    if (isNaN(questionId)) {
      return NextResponse.json({
        success: false,
        message: '无效的题目ID'
      }, { status: 400 })
    }

    const question = await questionService.getQuestionById(questionId)

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
    console.error('获取题目详情失败:', error)
    return NextResponse.json({
      success: false,
      message: '获取题目详情失败',
      error: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const questionId = parseInt(params.id)
    
    if (isNaN(questionId)) {
      return NextResponse.json({
        success: false,
        message: '无效的题目ID'
      }, { status: 400 })
    }

    const body = await request.json()
    const { stem, subjectId, type, difficulty, status, options, answer, explanation } = body

    const question = await questionService.updateQuestion(questionId, {
      stem,
      subjectId: subjectId ? parseInt(subjectId) : undefined,
      type,
      difficulty,
      status,
      options,
      answer,
      explanation
    })

    return NextResponse.json({
      success: true,
      data: question,
      message: '题目更新成功'
    })
  } catch (error) {
    console.error('更新题目失败:', error)
    return NextResponse.json({
      success: false,
      message: '更新题目失败',
      error: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const questionId = parseInt(params.id)
    
    if (isNaN(questionId)) {
      return NextResponse.json({
        success: false,
        message: '无效的题目ID'
      }, { status: 400 })
    }

    await questionService.deleteQuestion(questionId)

    return NextResponse.json({
      success: true,
      message: '题目删除成功'
    })
  } catch (error) {
    console.error('删除题目失败:', error)
    return NextResponse.json({
      success: false,
      message: '删除题目失败',
      error: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 })
  }
}
