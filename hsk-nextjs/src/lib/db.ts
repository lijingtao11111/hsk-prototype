import { prisma } from './prisma'
import bcrypt from 'bcryptjs'
import {
  UserRole,
  UserStatus,
  SubjectStatus,
  QuestionType,
  QuestionDifficulty,
  QuestionStatus
} from '../../generated/prisma'

// 用户相关操作
const userService = {
  // 获取所有用户
  async getAllUsers() {
    return await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        realName: true,
        role: true,
        status: true,
        department: true,
        studentId: true,
        grade: true,
        major: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  },

  // 根据ID获取用户
  async getUserById(id: number) {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        realName: true,
        role: true,
        status: true,
        department: true,
        studentId: true,
        grade: true,
        major: true,
        createdAt: true,
        updatedAt: true
      }
    })
  },

  // 根据用户名获取用户（用于登录）
  async getUserByUsername(username: string) {
    return await prisma.user.findUnique({
      where: { username }
    })
  },

  // 创建用户
  async createUser(data: {
    username: string
    password: string
    email?: string
    phone?: string
    realName?: string
    role?: UserRole
    department?: string
    studentId?: string
    grade?: string
    major?: string
  }) {
    const hashedPassword = await bcrypt.hash(data.password, 10)

    return await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword
      },
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        realName: true,
        role: true,
        status: true,
        department: true,
        studentId: true,
        grade: true,
        major: true,
        createdAt: true,
        updatedAt: true
      }
    })
  },

  // 更新用户
  async updateUser(id: number, data: {
    email?: string
    phone?: string
    realName?: string
    role?: UserRole
    status?: UserStatus
    department?: string
    studentId?: string
    grade?: string
    major?: string
    lastLoginTime?: Date
  }) {
    return await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        realName: true,
        role: true,
        status: true,
        department: true,
        studentId: true,
        grade: true,
        major: true,
        lastLoginTime: true,
        createdAt: true,
        updatedAt: true
      }
    })
  },

  // 删除用户
  async deleteUser(id: number) {
    return await prisma.user.delete({
      where: { id }
    })
  },

  // 验证密码
  async verifyPassword(plainPassword: string, hashedPassword: string) {
    return await bcrypt.compare(plainPassword, hashedPassword)
  },

  // 更新密码
  async updatePassword(id: number, newPassword: string) {
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    return await prisma.user.update({
      where: { id },
      data: { password: hashedPassword }
    })
  }
}

// 系统设置相关操作
export const settingService = {
  // 获取所有设置
  async getAllSettings() {
    return await prisma.systemSetting.findMany({
      orderBy: {
        category: 'asc'
      }
    })
  },

  // 根据key获取设置
  async getSettingByKey(key: string) {
    return await prisma.systemSetting.findUnique({
      where: { key }
    })
  },

  // 根据分类获取设置
  async getSettingsByCategory(category: string) {
    return await prisma.systemSetting.findMany({
      where: { category },
      orderBy: {
        key: 'asc'
      }
    })
  },

  // 创建或更新设置
  async upsertSetting(data: {
    key: string
    value: string
    description?: string
    category: string
  }) {
    return await prisma.systemSetting.upsert({
      where: { key: data.key },
      update: {
        value: data.value,
        description: data.description
      },
      create: data
    })
  },

  // 批量更新设置
  async updateSettings(settings: Array<{
    key: string
    value: string
  }>) {
    const promises = settings.map(setting =>
      prisma.systemSetting.update({
        where: { key: setting.key },
        data: { value: setting.value }
      })
    )
    
    return await Promise.all(promises)
  }
}

// 学科相关操作
const subjectService = {
  // 获取所有学科
  async getAllSubjects() {
    return await prisma.subject.findMany({
      include: {
        createdBy: {
          select: {
            id: true,
            username: true,
            realName: true
          }
        },
        _count: {
          select: {
            userSubjects: true,
            questions: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  },

  // 根据ID获取学科
  async getSubjectById(id: number) {
    return await prisma.subject.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            username: true,
            realName: true
          }
        },
        _count: {
          select: {
            userSubjects: true,
            questions: true
          }
        }
      }
    })
  },

  // 创建学科
  async createSubject(data: {
    name: string
    code: string
    description?: string
    createdById: number
  }) {
    return await prisma.subject.create({
      data,
      include: {
        createdBy: {
          select: {
            id: true,
            username: true,
            realName: true
          }
        }
      }
    })
  },

  // 更新学科
  async updateSubject(id: number, data: {
    name?: string
    code?: string
    description?: string
    status?: SubjectStatus
  }) {
    return await prisma.subject.update({
      where: { id },
      data,
      include: {
        createdBy: {
          select: {
            id: true,
            username: true,
            realName: true
          }
        }
      }
    })
  },

  // 删除学科
  async deleteSubject(id: number) {
    return await prisma.subject.delete({
      where: { id }
    })
  }
}

// 题目相关操作
const questionService = {
  // 获取所有题目
  async getAllQuestions(filters?: {
    subjectId?: number
    type?: QuestionType
    difficulty?: QuestionDifficulty
    status?: QuestionStatus
    search?: string
  }) {
    const where: any = {}

    if (filters?.subjectId) {
      where.subjectId = filters.subjectId
    }

    if (filters?.type) {
      where.type = filters.type
    }

    if (filters?.difficulty) {
      where.difficulty = filters.difficulty
    }

    if (filters?.status) {
      where.status = filters.status
    }

    if (filters?.search) {
      where.OR = [
        { stem: { contains: filters.search } },
        { answer: { contains: filters.search } }
      ]
    }

    return await prisma.question.findMany({
      where,
      include: {
        subject: {
          select: {
            id: true,
            name: true,
            code: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  },

  // 根据ID获取题目
  async getQuestionById(id: number) {
    return await prisma.question.findUnique({
      where: { id },
      include: {
        subject: {
          select: {
            id: true,
            name: true,
            code: true
          }
        }
      }
    })
  },

  // 创建题目
  async createQuestion(data: {
    stem: string
    subjectId: number
    type: QuestionType
    difficulty: QuestionDifficulty
    options?: any
    answer: string
    explanation?: string
  }) {
    return await prisma.question.create({
      data,
      include: {
        subject: {
          select: {
            id: true,
            name: true,
            code: true
          }
        }
      }
    })
  },

  // 更新题目
  async updateQuestion(id: number, data: {
    stem?: string
    subjectId?: number
    type?: QuestionType
    difficulty?: QuestionDifficulty
    status?: QuestionStatus
    options?: any
    answer?: string
    explanation?: string
  }) {
    return await prisma.question.update({
      where: { id },
      data,
      include: {
        subject: {
          select: {
            id: true,
            name: true,
            code: true
          }
        }
      }
    })
  },

  // 删除题目
  async deleteQuestion(id: number) {
    return await prisma.question.delete({
      where: { id }
    })
  }
}

// 统计相关操作
const statsService = {
  // 获取系统概览统计
  async getSystemOverview() {
    const [
      totalUsers,
      totalSubjects,
      totalQuestions,
      totalPracticeRecords,
      activeUsers,
      recentUsers
    ] = await Promise.all([
      // 总用户数
      prisma.user.count(),

      // 总学科数
      prisma.subject.count(),

      // 总题目数
      prisma.question.count(),

      // 总练习记录数
      prisma.practiceRecord.count(),

      // 活跃用户数（最近7天有登录）
      prisma.user.count({
        where: {
          lastLoginTime: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      }),

      // 最近注册用户
      prisma.user.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          id: true,
          username: true,
          realName: true,
          role: true,
          createdAt: true
        }
      })
    ])

    return {
      totalUsers,
      totalSubjects,
      totalQuestions,
      totalPracticeRecords,
      activeUsers,
      recentUsers
    }
  },

  // 获取用户角色分布
  async getUserRoleDistribution() {
    const roleStats = await prisma.user.groupBy({
      by: ['role'],
      _count: {
        role: true
      }
    })

    return roleStats.map(stat => ({
      role: stat.role,
      count: stat._count.role
    }))
  },

  // 获取学科题目分布
  async getSubjectQuestionDistribution() {
    const subjectStats = await prisma.subject.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            questions: true
          }
        }
      }
    })

    return subjectStats.map(subject => ({
      subjectId: subject.id,
      subjectName: subject.name,
      questionCount: subject._count.questions
    }))
  }
}

export { userService, subjectService, questionService, statsService };
