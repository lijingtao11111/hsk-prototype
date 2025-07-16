import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/database/connection';
import { signJWT, getDefaultPermissions } from '@/lib/auth/jwt';

// 简化的默认管理员配置
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: '123123'
};

// POST /api/admin/login - 管理员登录
export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: '请输入用户名和密码' },
        { status: 400 }
      );
    }

    // 验证默认管理员账号
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      // 生成JWT token（使用模拟的管理员信息）
      const adminUser = {
        _id: 'admin_default_id',
        openid: 'admin_default',
        nickname: '系统管理员',
        avatar: '',
        role: 'admin' as const,
        extendedInfo: {
          grade: '系统',
          major: '系统管理',
          department: '系统管理部',
          studentId: 'admin'
        },
        permissions: getDefaultPermissions('admin')
      };

      const token = await signJWT({
        userId: adminUser._id,
        openid: adminUser.openid,
        role: adminUser.role,
        permissions: adminUser.permissions
      });

      return NextResponse.json({
        success: true,
        data: {
          user: {
            id: adminUser._id,
            openid: adminUser.openid,
            nickname: adminUser.nickname,
            avatar: adminUser.avatar,
            role: adminUser.role,
            extendedInfo: adminUser.extendedInfo,
            permissions: adminUser.permissions
          },
          token
        }
      });
    }

    // 如果不是默认管理员账号，返回错误
    return NextResponse.json(
      { success: false, error: '用户名或密码错误' },
      { status: 401 }
    );

  } catch (error) {
    console.error('管理员登录失败:', error);
    return NextResponse.json(
      { success: false, error: '登录失败，请重试' },
      { status: 500 }
    );
  }
}
