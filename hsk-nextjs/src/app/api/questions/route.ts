import { NextResponse } from 'next/server'
import { questionService } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    const filters = {
      subjectId: searchParams.get('subjectId') ? parseInt(searchParams.get('subjectId')!) : undefined,
      type: searchParams.get('type') as any,
      difficulty: searchParams.get('difficulty') as any,
      status: searchParams.get('status') as any,
      search: searchParams.get('search') || undefined
    }

    const questions = await questionService.getAllQuestions(filters)

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
    const { stem, subjectId, type, difficulty, options, answer, explanation } = body

    // 验证必填字段
    if (!stem || !subjectId || !type || !difficulty || !answer) {
      return NextResponse.json({
        success: false,
        message: '题干、学科、题型、难度和答案不能为空'
      }, { status: 400 })
    }

    // 创建新题目
    const question = await questionService.createQuestion({
      stem,
      subjectId: parseInt(subjectId),
      type,
      difficulty,
      options,
      answer,
      explanation
    })

    return NextResponse.json({
      success: true,
      data: question,
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
