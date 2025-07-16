import { NextRequest, NextResponse } from 'next/server';
import { connectDB, memoryDB } from '@/lib/database/connection';
import { User } from '@/lib/database/models/User';
import { Subject } from '@/lib/database/models/Subject';
import { Question } from '@/lib/database/models/Question';
import { PracticeRecord } from '@/lib/database/models/PracticeRecord';
import { getUserFromRequest, PERMISSIONS, hasPermission } from '@/lib/auth/jwt';

const USE_MEMORY_DB = process.env.USE_MEMORY_DB === 'true' || true;

// GET /api/admin/dashboard - 获取系统概览数据
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

    if (!hasPermission(user.permissions, PERMISSIONS.VIEW_ALL_DATA)) {
      return NextResponse.json(
        { success: false, error: '权限不足' },
        { status: 403 }
      );
    }

    // 使用内存数据库或MongoDB
    if (USE_MEMORY_DB) {
      const dashboardData = await memoryDB.getDashboardData();
      return NextResponse.json({
        success: true,
        data: dashboardData
      });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '7d'; // 7d, 30d, 90d

    // 计算时间范围
    const now = new Date();
    let startDate: Date;

    switch (timeRange) {
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default: // 7d
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    // 并行获取统计数据
    const [
      userStats,
      subjectStats,
      questionStats,
      practiceStats,
      recentActivities,
      userTrends,
      subjectDistribution
    ] = await Promise.all([
      getUserStats(),
      getSubjectStats(),
      getQuestionStats(),
      getPracticeStats(startDate),
      getRecentActivities(),
      getUserTrends(startDate),
      getSubjectDistribution()
    ]);

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          userStats,
          subjectStats,
          questionStats,
          practiceStats
        },
        trends: {
          userTrends,
          timeRange
        },
        distribution: {
          subjectDistribution
        },
        activities: recentActivities
      }
    });

  } catch (error) {
    console.error('获取系统概览数据失败:', error);
    return NextResponse.json(
      { success: false, error: '获取系统概览数据失败' },
      { status: 500 }
    );
  }
}

// 获取用户统计
async function getUserStats() {
  const [totalUsers, activeUsers, newUsers, usersByRole] = await Promise.all([
    User.countDocuments({ isActive: true }),
    User.countDocuments({ 
      isActive: true, 
      lastLoginTime: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    }),
    User.countDocuments({ 
      isActive: true,
      registerTime: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    }),
    User.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ])
  ]);

  const roleStats = usersByRole.reduce((acc: any, item: any) => {
    acc[item._id] = item.count;
    return acc;
  }, {});

  return {
    total: totalUsers,
    active: activeUsers,
    new: newUsers,
    students: roleStats.student || 0,
    teachers: roleStats.teacher || 0,
    admins: roleStats.admin || 0
  };
}

// 获取学科统计
async function getSubjectStats() {
  const [totalSubjects, activeSubjects, subjectsByCategory] = await Promise.all([
    Subject.countDocuments({}),
    Subject.countDocuments({ isActive: true }),
    Subject.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ])
  ]);

  const categoryStats = subjectsByCategory.reduce((acc: any, item: any) => {
    acc[item._id] = item.count;
    return acc;
  }, {});

  return {
    total: totalSubjects,
    active: activeSubjects,
    categories: categoryStats
  };
}

// 获取题目统计
async function getQuestionStats() {
  const [totalQuestions, activeQuestions, pendingReview, questionsByDifficulty] = await Promise.all([
    Question.countDocuments({}),
    Question.countDocuments({ isActive: true, reviewStatus: 'approved' }),
    Question.countDocuments({ reviewStatus: 'pending' }),
    Question.aggregate([
      { $match: { isActive: true, reviewStatus: 'approved' } },
      { $group: { _id: '$difficulty', count: { $sum: 1 } } }
    ])
  ]);

  const difficultyStats = questionsByDifficulty.reduce((acc: any, item: any) => {
    acc[`level${item._id}`] = item.count;
    return acc;
  }, {});

  // 计算平均正确率
  const accuracyResult = await Question.aggregate([
    { 
      $match: { 
        isActive: true, 
        reviewStatus: 'approved',
        'statistics.attemptCount': { $gt: 0 }
      }
    },
    {
      $group: {
        _id: null,
        avgAccuracy: { $avg: '$statistics.accuracy' }
      }
    }
  ]);

  const avgAccuracy = accuracyResult.length > 0 ? 
    Math.round(accuracyResult[0].avgAccuracy * 100) / 100 : 0;

  return {
    total: totalQuestions,
    active: activeQuestions,
    pendingReview,
    avgAccuracy,
    difficulty: difficultyStats
  };
}

// 获取练习统计
async function getPracticeStats(startDate: Date) {
  const practiceData = await PracticeRecord.aggregate([
    {
      $match: {
        createTime: { $gte: startDate },
        'session.status': 'completed'
      }
    },
    {
      $group: {
        _id: null,
        totalPractices: { $sum: 1 },
        totalQuestions: { $sum: '$session.totalQuestions' },
        totalCorrect: { $sum: '$session.correctCount' },
        avgAccuracy: { $avg: '$session.accuracy' },
        totalUsers: { $addToSet: '$userId' }
      }
    },
    {
      $project: {
        totalPractices: 1,
        totalQuestions: 1,
        totalCorrect: 1,
        avgAccuracy: { $round: ['$avgAccuracy', 2] },
        activeUsers: { $size: '$totalUsers' }
      }
    }
  ]);

  return practiceData.length > 0 ? practiceData[0] : {
    totalPractices: 0,
    totalQuestions: 0,
    totalCorrect: 0,
    avgAccuracy: 0,
    activeUsers: 0
  };
}

// 获取最近活动
async function getRecentActivities() {
  const [recentUsers, recentPractices, recentQuestions] = await Promise.all([
    User.find({ isActive: true })
      .sort({ registerTime: -1 })
      .limit(5)
      .select('nickname registerTime role extendedInfo.department'),
    
    PracticeRecord.find({ 'session.status': 'completed' })
      .sort({ createTime: -1 })
      .limit(5)
      .populate('userId', 'nickname')
      .select('userId subjectName session.accuracy createTime'),
    
    Question.find({ reviewStatus: 'pending' })
      .sort({ createTime: -1 })
      .limit(5)
      .select('questionId subject.subjectName createTime reviewStatus')
  ]);

  const activities = [
    ...recentUsers.map(user => ({
      type: 'user_register',
      time: user.registerTime,
      description: `新用户 ${user.nickname} 注册 (${user.role})`,
      details: user.extendedInfo?.department || ''
    })),
    ...recentPractices.map(practice => ({
      type: 'practice_completed',
      time: practice.createTime,
      description: `${(practice.userId as any)?.nickname || '用户'} 完成 ${practice.subjectName} 练习`,
      details: `正确率: ${Math.round(practice.session.accuracy)}%`
    })),
    ...recentQuestions.map(question => ({
      type: 'question_pending',
      time: question.createTime,
      description: `题目 ${question.questionId} 待审核`,
      details: question.subject.subjectName
    }))
  ];

  return activities
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 10);
}

// 获取用户趋势
async function getUserTrends(startDate: Date) {
  const trends = await User.aggregate([
    {
      $match: {
        registerTime: { $gte: startDate },
        isActive: true
      }
    },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: '%Y-%m-%d', date: '$registerTime' } }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.date': 1 } }
  ]);

  return trends.map(item => ({
    date: item._id.date,
    count: item.count
  }));
}

// 获取学科分布
async function getSubjectDistribution() {
  return await Subject.aggregate([
    { $match: { isActive: true } },
    {
      $lookup: {
        from: 'questions',
        localField: 'subjectId',
        foreignField: 'subject.subjectId',
        as: 'questions'
      }
    },
    {
      $project: {
        name: 1,
        category: 1,
        questionCount: { 
          $size: {
            $filter: {
              input: '$questions',
              cond: { 
                $and: [
                  { $eq: ['$$this.isActive', true] },
                  { $eq: ['$$this.reviewStatus', 'approved'] }
                ]
              }
            }
          }
        }
      }
    },
    { $sort: { questionCount: -1 } }
  ]);
}
