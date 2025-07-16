import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/database/connection';
import { Question } from '@/lib/database/models/Question';
import { Subject } from '@/lib/database/models/Subject';
import { getUserFromRequest, PERMISSIONS, hasPermission } from '@/lib/auth/jwt';

// GET /api/admin/questions - 获取题目列表
export async function GET(request: NextRequest) {
  try {
    // 验证权限
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: '未授权访问' },
        { status: 401 }
      );
    }

    if (!hasPermission(user.permissions, PERMISSIONS.MANAGE_QUESTIONS)) {
      return NextResponse.json(
        { success: false, error: '权限不足' },
        { status: 403 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const subjectId = searchParams.get('subjectId') || '';
    const type = searchParams.get('type') || '';
    const difficulty = searchParams.get('difficulty') || '';
    const reviewStatus = searchParams.get('reviewStatus') || '';
    const isActive = searchParams.get('isActive');

    // 构建查询条件
    const query: any = {};
    
    if (search) {
      query.$or = [
        { questionId: { $regex: search, $options: 'i' } },
        { 'content.stem': { $regex: search, $options: 'i' } }
      ];
    }
    
    if (subjectId) query['subject.subjectId'] = subjectId;
    if (type) query.type = type;
    if (difficulty) query.difficulty = parseInt(difficulty);
    if (reviewStatus) query.reviewStatus = reviewStatus;
    if (isActive !== null) query.isActive = isActive === 'true';

    // 分页查询
    const skip = (page - 1) * limit;
    const questions = await Question.find(query)
      .sort({ createTime: -1 })
      .skip(skip)
      .limit(limit)
      .populate('reviewedBy', 'nickname')
      .lean();

    const total = await Question.countDocuments(query);

    // 获取学科列表（用于筛选）
    const subjects = await Subject.find({ isActive: true })
      .select('subjectId name')
      .lean();

    return NextResponse.json({
      success: true,
      data: {
        questions,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        },
        filters: {
          subjects
        }
      }
    });

  } catch (error) {
    console.error('获取题目列表失败:', error);
    return NextResponse.json(
      { success: false, error: '获取题目列表失败' },
      { status: 500 }
    );
  }
}

// POST /api/admin/questions - 创建新题目
export async function POST(request: NextRequest) {
  try {
    // 验证权限
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: '未授权访问' },
        { status: 401 }
      );
    }

    if (!hasPermission(user.permissions, PERMISSIONS.MANAGE_QUESTIONS)) {
      return NextResponse.json(
        { success: false, error: '权限不足' },
        { status: 403 }
      );
    }

    await connectDB();

    const {
      questionId,
      type,
      subject,
      difficulty,
      category,
      knowledgePoints,
      content,
      answer,
      source,
      sourceExam
    } = await request.json();

    // 验证必填字段
    if (!questionId || !type || !subject || !difficulty || !content || !answer) {
      return NextResponse.json(
        { success: false, error: '缺少必填字段' },
        { status: 400 }
      );
    }

    // 检查题目ID是否已存在
    const existingQuestion = await Question.findOne({ questionId });
    if (existingQuestion) {
      return NextResponse.json(
        { success: false, error: '题目ID已存在' },
        { status: 400 }
      );
    }

    // 验证学科是否存在
    const subjectExists = await Subject.findOne({ 
      subjectId: subject.subjectId, 
      isActive: true 
    });
    if (!subjectExists) {
      return NextResponse.json(
        { success: false, error: '学科不存在' },
        { status: 400 }
      );
    }

    // 创建新题目
    const question = new Question({
      questionId,
      type,
      subject,
      difficulty,
      category: category || '综合',
      knowledgePoints: knowledgePoints || [],
      content,
      answer,
      statistics: {
        attemptCount: 0,
        correctCount: 0,
        accuracy: 0
      },
      source: source || 'practice',
      sourceExam: sourceExam || '',
      createTime: new Date(),
      updateTime: new Date(),
      aiGenerated: false,
      reviewStatus: 'pending',
      editHistory: [],
      isActive: true,
      qualityScore: 0
    });

    await question.save();

    return NextResponse.json({
      success: true,
      data: { question }
    });

  } catch (error) {
    console.error('创建题目失败:', error);
    return NextResponse.json(
      { success: false, error: '创建题目失败' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/questions - 批量更新题目状态
export async function PUT(request: NextRequest) {
  try {
    // 验证权限
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: '未授权访问' },
        { status: 401 }
      );
    }

    if (!hasPermission(user.permissions, PERMISSIONS.MANAGE_QUESTIONS)) {
      return NextResponse.json(
        { success: false, error: '权限不足' },
        { status: 403 }
      );
    }

    await connectDB();

    const { questionIds, action, reviewStatus, reviewComments } = await request.json();

    if (!Array.isArray(questionIds)) {
      return NextResponse.json(
        { success: false, error: '参数格式错误' },
        { status: 400 }
      );
    }

    let updateData: any = {
      updateTime: new Date()
    };

    switch (action) {
      case 'activate':
        updateData.isActive = true;
        break;
      case 'deactivate':
        updateData.isActive = false;
        break;
      case 'review':
        if (!reviewStatus) {
          return NextResponse.json(
            { success: false, error: '缺少审核状态' },
            { status: 400 }
          );
        }
        updateData.reviewStatus = reviewStatus;
        updateData.reviewedBy = user.userId;
        updateData.reviewTime = new Date();
        if (reviewComments) updateData.reviewComments = reviewComments;
        break;
      default:
        return NextResponse.json(
          { success: false, error: '无效的操作类型' },
          { status: 400 }
        );
    }

    // 批量更新
    const result = await Question.updateMany(
      { questionId: { $in: questionIds } },
      updateData
    );

    return NextResponse.json({
      success: true,
      data: {
        modifiedCount: result.modifiedCount,
        matchedCount: result.matchedCount
      }
    });

  } catch (error) {
    console.error('批量更新题目失败:', error);
    return NextResponse.json(
      { success: false, error: '批量更新题目失败' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/questions - 批量删除题目
export async function DELETE(request: NextRequest) {
  try {
    // 验证权限
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: '未授权访问' },
        { status: 401 }
      );
    }

    if (!hasPermission(user.permissions, PERMISSIONS.MANAGE_QUESTIONS)) {
      return NextResponse.json(
        { success: false, error: '权限不足' },
        { status: 403 }
      );
    }

    await connectDB();

    const { questionIds } = await request.json();

    if (!Array.isArray(questionIds)) {
      return NextResponse.json(
        { success: false, error: '参数格式错误' },
        { status: 400 }
      );
    }

    // 软删除（设置为非活跃状态）
    const result = await Question.updateMany(
      { questionId: { $in: questionIds } },
      { 
        isActive: false,
        updateTime: new Date()
      }
    );

    return NextResponse.json({
      success: true,
      data: {
        deletedCount: result.modifiedCount
      }
    });

  } catch (error) {
    console.error('删除题目失败:', error);
    return NextResponse.json(
      { success: false, error: '删除题目失败' },
      { status: 500 }
    );
  }
}
