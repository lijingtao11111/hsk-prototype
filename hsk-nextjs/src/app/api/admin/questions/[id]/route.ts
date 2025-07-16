import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/database/connection';
import { Question } from '@/lib/database/models/Question';
import { Subject } from '@/lib/database/models/Subject';
import { getUserFromRequest, PERMISSIONS, hasPermission } from '@/lib/auth/jwt';

// GET /api/admin/questions/[id] - 获取单个题目详情
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const questionId = params.id;

    // 获取题目详情
    const question = await Question.findOne({ questionId })
      .populate('reviewedBy', 'nickname')
      .populate('editHistory.editedBy', 'nickname')
      .lean();

    if (!question) {
      return NextResponse.json(
        { success: false, error: '题目不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { question }
    });

  } catch (error) {
    console.error('获取题目详情失败:', error);
    return NextResponse.json(
      { success: false, error: '获取题目详情失败' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/questions/[id] - 更新题目信息
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const questionId = params.id;
    const updateData = await request.json();

    // 验证题目是否存在
    const existingQuestion = await Question.findOne({ questionId });
    if (!existingQuestion) {
      return NextResponse.json(
        { success: false, error: '题目不存在' },
        { status: 404 }
      );
    }

    // 如果更新学科，验证学科是否存在
    if (updateData.subject && updateData.subject.subjectId) {
      const subjectExists = await Subject.findOne({ 
        subjectId: updateData.subject.subjectId, 
        isActive: true 
      });
      if (!subjectExists) {
        return NextResponse.json(
          { success: false, error: '学科不存在' },
          { status: 400 }
        );
      }
    }

    // 记录编辑历史
    const changes = {};
    const fieldsToTrack = ['content', 'answer', 'difficulty', 'category', 'knowledgePoints'];
    
    fieldsToTrack.forEach(field => {
      if (updateData[field] && JSON.stringify(updateData[field]) !== JSON.stringify(existingQuestion[field])) {
        (changes as any)[field] = {
          from: existingQuestion[field],
          to: updateData[field]
        };
      }
    });

    // 如果有变更，添加到编辑历史
    if (Object.keys(changes).length > 0) {
      await existingQuestion.addEditHistory(
        user.userId,
        changes,
        updateData.editReason || '管理员编辑'
      );
    }

    // 更新题目信息
    const updatedQuestion = await Question.findOneAndUpdate(
      { questionId },
      {
        ...updateData,
        updateTime: new Date()
      },
      { new: true, runValidators: true }
    ).populate('reviewedBy', 'nickname');

    return NextResponse.json({
      success: true,
      data: { question: updatedQuestion }
    });

  } catch (error) {
    console.error('更新题目信息失败:', error);
    return NextResponse.json(
      { success: false, error: '更新题目信息失败' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/questions/[id] - 删除单个题目
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const questionId = params.id;

    // 验证题目是否存在
    const existingQuestion = await Question.findOne({ questionId });
    if (!existingQuestion) {
      return NextResponse.json(
        { success: false, error: '题目不存在' },
        { status: 404 }
      );
    }

    // 软删除（设置为非活跃状态）
    await Question.findOneAndUpdate(
      { questionId },
      {
        isActive: false,
        updateTime: new Date()
      }
    );

    return NextResponse.json({
      success: true,
      data: { message: '题目删除成功' }
    });

  } catch (error) {
    console.error('删除题目失败:', error);
    return NextResponse.json(
      { success: false, error: '删除题目失败' },
      { status: 500 }
    );
  }
}
