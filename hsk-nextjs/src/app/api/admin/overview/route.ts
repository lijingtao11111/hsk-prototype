import { NextResponse } from 'next/server'
import { statsService } from '@/lib/db'

export async function GET() {
  try {
    const [overview, roleDistribution, subjectDistribution] = await Promise.all([
      statsService.getSystemOverview(),
      statsService.getUserRoleDistribution(),
      statsService.getSubjectQuestionDistribution()
    ])

    return NextResponse.json({
      success: true,
      data: {
        overview,
        roleDistribution,
        subjectDistribution
      }
    })
  } catch (error) {
    console.error('获取系统概览失败:', error)
    return NextResponse.json({
      success: false,
      message: '获取系统概览失败',
      error: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 })
  }
}
