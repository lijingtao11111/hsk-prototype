import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // 测试数据库连接
    await prisma.$connect()
    
    // 执行一个简单的查询
    const result = await prisma.$queryRaw`SELECT 1 as test`

    // 处理 BigInt 序列化问题
    const serializedResult = JSON.parse(JSON.stringify(result, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ))

    return NextResponse.json({
      success: true,
      message: '数据库连接成功！',
      result: serializedResult
    })
  } catch (error) {
    console.error('数据库连接失败:', error)
    return NextResponse.json({
      success: false,
      message: '数据库连接失败',
      error: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
