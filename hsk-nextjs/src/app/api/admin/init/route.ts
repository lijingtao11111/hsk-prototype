import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/database/init';

// GET /api/admin/init - 初始化数据库
export async function GET(request: NextRequest) {
  try {
    const result = await initializeDatabase();
    
    return NextResponse.json({
      success: result.success,
      message: result.message,
      data: result.admin || null,
      error: result.error || null
    });
    
  } catch (error) {
    console.error('数据库初始化API错误:', error);
    return NextResponse.json(
      { success: false, error: '数据库初始化失败' },
      { status: 500 }
    );
  }
}

// POST /api/admin/init - 强制重新初始化数据库
export async function POST(request: NextRequest) {
  try {
    // 这里可以添加强制重新创建管理员账号的逻辑
    const result = await initializeDatabase();
    
    return NextResponse.json({
      success: result.success,
      message: '数据库重新初始化完成',
      data: result.admin || null,
      error: result.error || null
    });
    
  } catch (error) {
    console.error('数据库重新初始化API错误:', error);
    return NextResponse.json(
      { success: false, error: '数据库重新初始化失败' },
      { status: 500 }
    );
  }
}
