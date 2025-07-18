import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '../../../../../generated/prisma'

const prisma = new PrismaClient()

// GET /api/subjects/[id] - 获取单个学科
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        message: '无效的学科ID'
      }, { status: 400 })
    }

    const subject = await prisma.subject.findUnique({
      where: { id },
      include: {
        _count: {
          select: { questions: true }
        }
      }
    })

    if (!subject) {
      return NextResponse.json({
        success: false,
        message: '学科不存在'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: subject
    })
  } catch (error) {
    console.error('获取学科失败:', error)
    return NextResponse.json({
      success: false,
      message: '获取学科失败'
    }, { status: 500 })
  }
}

// PUT /api/subjects/[id] - 更新学科
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const body = await request.json()
    const { name, code, description, category, isActive } = body

    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        message: '无效的学科ID'
      }, { status: 400 })
    }

    // 验证必填字段
    if (!name || !code) {
      return NextResponse.json({
        success: false,
        message: '学科名称和代码不能为空'
      }, { status: 400 })
    }

    // 检查学科是否存在
    const existingSubject = await prisma.subject.findUnique({
      where: { id }
    })

    if (!existingSubject) {
      return NextResponse.json({
        success: false,
        message: '学科不存在'
      }, { status: 404 })
    }

    // 如果代码发生变化，检查新代码是否已被其他学科使用
    if (code !== existingSubject.code) {
      const codeExists = await prisma.subject.findUnique({
        where: { code }
      })

      if (codeExists) {
        return NextResponse.json({
          success: false,
          message: '学科代码已存在'
        }, { status: 400 })
      }
    }

    // 更新学科
    const updatedSubject = await prisma.subject.update({
      where: { id },
      data: {
        name,
        code,
        description: description || '',
        category: category || '其他',
        isActive: isActive !== undefined ? isActive : true
      },
      include: {
        _count: {
          select: { questions: true }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedSubject,
      message: '学科更新成功'
    })
  } catch (error) {
    console.error('更新学科失败:', error)
    return NextResponse.json({
      success: false,
      message: '更新学科失败'
    }, { status: 500 })
  }
}

// DELETE /api/subjects/[id] - 删除学科
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        message: '无效的学科ID'
      }, { status: 400 })
    }

    // 检查学科是否存在
    const existingSubject = await prisma.subject.findUnique({
      where: { id }
    })

    if (!existingSubject) {
      return NextResponse.json({
        success: false,
        message: '学科不存在'
      }, { status: 404 })
    }

    // 检查是否有关联的题目
    const questionCount = await prisma.question.count({
      where: { subjectId: id }
    })

    if (questionCount > 0) {
      return NextResponse.json({
        success: false,
        message: `无法删除学科，该学科下还有 ${questionCount} 道题目`
      }, { status: 400 })
    }

    // 删除学科
    await prisma.subject.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: '学科删除成功'
    })
  } catch (error) {
    console.error('删除学科失败:', error)
    return NextResponse.json({
      success: false,
      message: '删除学科失败'
    }, { status: 500 })
  }
}
