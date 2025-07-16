import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/database/connection';
import { User } from '@/lib/database/models/User';
import { PracticeRecord } from '@/lib/database/models/PracticeRecord';
import { getUserFromRequest, PERMISSIONS, hasPermission, getDefaultPermissions } from '@/lib/auth/jwt';

// GET /api/admin/users/[id] - 获取单个用户详情
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const userId = params.id;

    // 获取用户基本信息
    const userInfo = await User.findById(userId)
      .populate('createdBy', 'nickname')
      .lean();

    if (!userInfo) {
      return NextResponse.json(
        { success: false, error: '用户不存在' },
        { status: 404 }
      );
    }

    // 获取用户练习统计
    const practiceStats = await PracticeRecord.aggregate([
      {
        $match: {
          userId: userInfo._id,
          'session.status': 'completed'
        }
      },
      {
        $group: {
          _id: null,
          totalPractices: { $sum: 1 },
          totalQuestions: { $sum: '$session.totalQuestions' },
          totalCorrect: { $sum: '$session.correctCount' },
          totalTimeSpent: { $sum: '$session.totalTimeSpent' },
          avgAccuracy: { $avg: '$session.accuracy' },
          avgMasteryLevel: { $avg: '$masteryLevel' }
        }
      }
    ]);

    // 获取学科练习分布
    const subjectStats = await PracticeRecord.aggregate([
      {
        $match: {
          userId: userInfo._id,
          'session.status': 'completed'
        }
      },
      {
        $group: {
          _id: '$subjectId',
          subjectName: { $first: '$subjectName' },
          practiceCount: { $sum: 1 },
          totalQuestions: { $sum: '$session.totalQuestions' },
          avgAccuracy: { $avg: '$session.accuracy' }
        }
      },
      { $sort: { practiceCount: -1 } }
    ]);

    // 获取最近练习记录
    const recentPractices = await PracticeRecord.find({
      userId: userInfo._id,
      'session.status': 'completed'
    })
      .sort({ createTime: -1 })
      .limit(10)
      .select('subjectName session.accuracy session.totalQuestions createTime')
      .lean();

    // 获取薄弱知识点统计
    const weaknessStats = await PracticeRecord.aggregate([
      {
        $match: {
          userId: userInfo._id,
          'session.status': 'completed'
        }
      },
      { $unwind: '$weakKnowledgePoints' },
      {
        $group: {
          _id: '$weakKnowledgePoints',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const stats = practiceStats.length > 0 ? practiceStats[0] : {
      totalPractices: 0,
      totalQuestions: 0,
      totalCorrect: 0,
      totalTimeSpent: 0,
      avgAccuracy: 0,
      avgMasteryLevel: 0
    };

    return NextResponse.json({
      success: true,
      data: {
        user: userInfo,
        statistics: {
          ...stats,
          avgTimePerQuestion: stats.totalQuestions > 0 ? 
            Math.round(stats.totalTimeSpent / stats.totalQuestions) : 0,
          totalTimeHours: Math.round(stats.totalTimeSpent / 3600 * 100) / 100
        },
        subjectStats,
        recentPractices,
        weaknessStats: weaknessStats.map(item => ({
          knowledgePoint: item._id,
          count: item.count
        }))
      }
    });

  } catch (error) {
    console.error('获取用户详情失败:', error);
    return NextResponse.json(
      { success: false, error: '获取用户详情失败' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/users/[id] - 更新用户信息
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const userId = params.id;
    const updateData = await request.json();

    // 验证用户是否存在
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: '用户不存在' },
        { status: 404 }
      );
    }

    // 如果更新角色，需要更新权限
    if (updateData.role && updateData.role !== existingUser.role) {
      updateData.permissions = getDefaultPermissions(updateData.role);
    }

    // 更新用户信息
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...updateData,
        lastUpdated: new Date()
      },
      { new: true, runValidators: true }
    ).populate('createdBy', 'nickname');

    return NextResponse.json({
      success: true,
      data: { user: updatedUser }
    });

  } catch (error) {
    console.error('更新用户信息失败:', error);
    return NextResponse.json(
      { success: false, error: '更新用户信息失败' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/users/[id] - 删除单个用户
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const userId = params.id;

    // 防止删除管理员自己
    if (userId === user.userId) {
      return NextResponse.json(
        { success: false, error: '不能删除自己的账号' },
        { status: 400 }
      );
    }

    // 验证用户是否存在
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: '用户不存在' },
        { status: 404 }
      );
    }

    // 软删除（设置为非活跃状态）
    await User.findByIdAndUpdate(userId, {
      isActive: false,
      lastUpdated: new Date()
    });

    return NextResponse.json({
      success: true,
      data: { message: '用户删除成功' }
    });

  } catch (error) {
    console.error('删除用户失败:', error);
    return NextResponse.json(
      { success: false, error: '删除用户失败' },
      { status: 500 }
    );
  }
}
