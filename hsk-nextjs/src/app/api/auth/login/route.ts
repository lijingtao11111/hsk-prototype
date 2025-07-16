import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: '用户名和密码不能为空' },
        { status: 400 }
      );
    }

    // 查找用户
    const user = await userService.getUserByUsername(username);

    if (!user) {
      return NextResponse.json(
        { success: false, error: '用户名或密码错误' },
        { status: 401 }
      );
    }

    // 检查用户状态
    if (user.status !== 'ACTIVE') {
      return NextResponse.json(
        { success: false, error: '账户已被禁用' },
        { status: 401 }
      );
    }

    // 验证密码
    const isValidPassword = await userService.verifyPassword(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: '用户名或密码错误' },
        { status: 401 }
      );
    }

    // 更新最后登录时间
    await userService.updateUser(user.id, {
      lastLoginTime: new Date()
    });

    // 生成JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // 返回用户信息（不包含密码）
    const userInfo = {
      id: user.id,
      username: user.username,
      nickname: user.realName || user.username,
      avatar: user.avatar || '',
      role: user.role,
      extendedInfo: {
        grade: user.grade || '',
        major: user.major || '',
        department: user.department || '',
        studentId: user.studentId || ''
      },
      permissions: user.role === 'ADMIN' ? ['admin'] : []
    };

    return NextResponse.json({
      success: true,
      data: {
        user: userInfo,
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: '登录失败' },
      { status: 500 }
    );
  }
}

// 企业微信OAuth回调处理
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code) {
      return NextResponse.json(
        { success: false, error: '授权码缺失' },
        { status: 400 }
      );
    }

    // TODO: 实现真实的企业微信OAuth流程
    // 当前返回模拟数据
    const mockUserInfo = {
      openid: `mock_${Date.now()}`,
      nickname: '测试用户',
      avatar: '',
      role: 'student'
    };

    // 重定向到前端登录处理页面
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('userInfo', JSON.stringify(mockUserInfo));
    
    return NextResponse.redirect(redirectUrl);

  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.json(
      { success: false, error: 'OAuth回调处理失败' },
      { status: 500 }
    );
  }
}
