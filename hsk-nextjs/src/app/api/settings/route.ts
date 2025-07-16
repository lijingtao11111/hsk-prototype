import { NextResponse } from 'next/server'
import { settingService } from '@/lib/db'

export async function GET() {
  try {
    const settings = await settingService.getAllSettings()

    return NextResponse.json({
      success: true,
      data: settings
    })
  } catch (error) {
    console.error('获取系统设置失败:', error)
    return NextResponse.json({
      success: false,
      message: '获取系统设置失败',
      error: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { settings } = body

    if (!Array.isArray(settings)) {
      return NextResponse.json({
        success: false,
        message: '设置数据格式错误'
      }, { status: 400 })
    }

    // 批量更新设置
    await settingService.updateSettings(settings)

    return NextResponse.json({
      success: true,
      message: '设置更新成功'
    })
  } catch (error) {
    console.error('更新系统设置失败:', error)
    return NextResponse.json({
      success: false,
      message: '更新系统设置失败',
      error: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 })
  }
}
