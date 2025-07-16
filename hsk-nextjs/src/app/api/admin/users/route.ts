import { NextRequest, NextResponse } from 'next/server';
import { connectDB, memoryDB } from '@/lib/database/connection';
import { User } from '@/lib/database/models/User';
import { getUserFromRequest, PERMISSIONS, hasPermission, getDefaultPermissions } from '@/lib/auth/jwt';

const USE_MEMORY_DB = process.env.USE_MEMORY_DB === 'true' || true;

// GET /api/admin/users - 获取用户列表
export async function GET(request: NextRequest) {
  try {
    // 验证管理员权限
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: '未授权访问' },
        { status: 401 }
      );
    }

    if (!hasPermission(user.permissions, PERMISSIONS.MANAGE_USERS)) {
      return NextResponse.json(
        { success: false, error: '权限不足' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';
    const department = searchParams.get('department') || '';
    const isActive = searchParams.get('isActive');

    // 使用内存数据库
    if (USE_MEMORY_DB) {
      const params = {
        page,
        limit,
        search,
        role: role || 'all',
        department: department || 'all',
        isActive: isActive === 'true'
      };

      const result = await memoryDB.getUsers(params);

      return NextResponse.json({
        success: true,
        data: {
          users: result.users,
          total: result.total,
          page,
          limit,
          departments: ['计算机学院', '外国语学院', '经济学院', '管理学院']
        }
      });
    }

    // 使用MongoDB
    await connectDB();

    // 构建查询条件
    const query: any = {};

    if (search) {
      query.$or = [
        { nickname: { $regex: search, $options: 'i' } },
        { 'extendedInfo.studentId': { $regex: search, $options: 'i' } },
        { 'extendedInfo.major': { $regex: search, $options: 'i' } }
      ];
    }

    if (role) query.role = role;
    if (department) query['extendedInfo.department'] = department;
    if (isActive !== null) query.isActive = isActive === 'true';

    // 分页查询
    const skip = (page - 1) * limit;
    const users = await User.find(query)
      .sort({ registerTime: -1 })
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'nickname')
      .select('-permissions') // 不返回敏感权限信息
      .lean();

    const total = await User.countDocuments(query);

    // 获取部门列表（用于筛选）
    const departments = await User.distinct('extendedInfo.department', { isActive: true });

    return NextResponse.json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        },
        filters: {
          departments
        }
      }
    });

  } catch (error) {
    console.error('获取用户列表失败:', error);
    return NextResponse.json(
      { success: false, error: '获取用户列表失败' },
      { status: 500 }
    );
  }
}

// POST /api/admin/users - 创建新用户
export async function POST(request: NextRequest) {
  try {
    // 验证管理员权限
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: '未授权访问' },
        { status: 401 }
      );
    }

    if (!hasPermission(user.permissions, PERMISSIONS.MANAGE_USERS)) {
      return NextResponse.json(
        { success: false, error: '权限不足' },
        { status: 403 }
      );
    }

    await connectDB();

    const {
      openid,
      nickname,
      avatar,
      role,
      extendedInfo,
      subjects,
      primarySubject
    } = await request.json();

    // 验证必填字段
    if (!openid || !nickname || !role || !extendedInfo) {
      return NextResponse.json(
        { success: false, error: '缺少必填字段' },
        { status: 400 }
      );
    }

    // 检查openid是否已存在
    const existingUser = await User.findOne({ openid });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: '用户已存在' },
        { status: 400 }
      );
    }

    // 创建新用户
    const newUser = new User({
      openid,
      nickname,
      avatar: avatar || '',
      role,
      extendedInfo,
      subjects: subjects || [],
      primarySubject: primarySubject || '',
      registerTime: new Date(),
      lastLoginTime: new Date(),
      totalPracticeTime: 0,
      practiceCount: 0,
      accuracy: 0,
      weakKnowledgePoints: [],
      permissions: getDefaultPermissions(role),
      isActive: true,
      createdBy: user.userId,
      lastUpdated: new Date()
    });

    await newUser.save();

    return NextResponse.json({
      success: true,
      data: { user: newUser }
    });

  } catch (error) {
    console.error('创建用户失败:', error);
    return NextResponse.json(
      { success: false, error: '创建用户失败' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/users - 批量更新用户状态
export async function PUT(request: NextRequest) {
  try {
    // 验证管理员权限
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: '未授权访问' },
        { status: 401 }
      );
    }

    if (!hasPermission(user.permissions, PERMISSIONS.MANAGE_USERS)) {
      return NextResponse.json(
        { success: false, error: '权限不足' },
        { status: 403 }
      );
    }

    await connectDB();

    const { userIds, isActive } = await request.json();

    if (!Array.isArray(userIds) || typeof isActive !== 'boolean') {
      return NextResponse.json(
        { success: false, error: '参数格式错误' },
        { status: 400 }
      );
    }

    // 批量更新
    const result = await User.updateMany(
      { _id: { $in: userIds } },
      { 
        isActive,
        lastUpdated: new Date()
      }
    );

    return NextResponse.json({
      success: true,
      data: {
        modifiedCount: result.modifiedCount,
        matchedCount: result.matchedCount
      }
    });

  } catch (error) {
    console.error('批量更新用户失败:', error);
    return NextResponse.json(
      { success: false, error: '批量更新用户失败' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/users - 批量删除用户
export async function DELETE(request: NextRequest) {
  try {
    // 验证管理员权限
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: '未授权访问' },
        { status: 401 }
      );
    }

    if (!hasPermission(user.permissions, PERMISSIONS.MANAGE_USERS)) {
      return NextResponse.json(
        { success: false, error: '权限不足' },
        { status: 403 }
      );
    }

    await connectDB();

    const { userIds } = await request.json();

    if (!Array.isArray(userIds)) {
      return NextResponse.json(
        { success: false, error: '参数格式错误' },
        { status: 400 }
      );
    }

    // 防止删除管理员自己
    if (userIds.includes(user.userId)) {
      return NextResponse.json(
        { success: false, error: '不能删除自己的账号' },
        { status: 400 }
      );
    }

    // 软删除（设置为非活跃状态）
    const result = await User.updateMany(
      { _id: { $in: userIds } },
      { 
        isActive: false,
        lastUpdated: new Date()
      }
    );

    return NextResponse.json({
      success: true,
      data: {
        deletedCount: result.modifiedCount
      }
    });

  } catch (error) {
    console.error('删除用户失败:', error);
    return NextResponse.json(
      { success: false, error: '删除用户失败' },
      { status: 500 }
    );
  }
}
