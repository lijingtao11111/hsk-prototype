import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/lib/db';

// GET /api/admin/dashboard - 获取系统概览数据
export async function GET(request: NextRequest) {
  try {
    // 简化版本 - 暂时跳过权限验证，直接返回数据
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '30d';

    // 获取用户统计
    const users = await userService.getAllUsers();
    const totalUsers = users.length;
    const adminUsers = users.filter(u => u.role === 'ADMIN').length;
    const teacherUsers = users.filter(u => u.role === 'TEACHER').length;
    const studentUsers = users.filter(u => u.role === 'STUDENT').length;
    const activeUsers = users.filter(u => u.status === 'ACTIVE').length;

    // 计算增长率（模拟数据）
    const userGrowth = Math.floor(Math.random() * 10) + 1;
    const subjectGrowth = Math.floor(Math.random() * 5) + 1;
    const questionGrowth = Math.floor(Math.random() * 20) + 5;
    const accuracyGrowth = Math.floor(Math.random() * 5) + 1;

    // 模拟最近活动
    const recentActivities = users.slice(0, 5).map((user, index) => ({
      id: user.id,
      user: {
        avatar: (user.realName || user.username).charAt(0).toUpperCase(),
        name: user.realName || user.username,
        role: user.role === 'ADMIN' ? '管理员' : user.role === 'TEACHER' ? '教师' : '学生'
      },
      activity: index % 3 === 0 ? '登录系统' : index % 3 === 1 ? '完成练习' : '创建题目',
      status: 'success',
      statusText: '成功',
      time: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toLocaleString()
    }));

    const dashboardData = {
      stats: {
        totalUsers,
        activeSubjects: 12, // 模拟数据
        totalQuestions: 1580, // 模拟数据
        averageAccuracy: 78.5, // 模拟数据
        userGrowth,
        subjectGrowth,
        questionGrowth,
        accuracyGrowth
      },
      recentActivities,
      systemStatus: {
        serverStatus: 'healthy',
        databaseStatus: 'healthy',
        cacheStatus: 'healthy',
        storageUsage: 45.2
      },
      userStats: {
        total: totalUsers,
        active: activeUsers,
        admins: adminUsers,
        teachers: teacherUsers,
        students: studentUsers
      }
    };

    return NextResponse.json({
      success: true,
      data: dashboardData
    });

  } catch (error) {
    console.error('获取系统概览数据失败:', error);
    return NextResponse.json(
      { success: false, error: '获取系统概览数据失败' },
      { status: 500 }
    );
  }
}
