import { PrismaClient } from '../generated/prisma'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // 创建管理员账户
  const hashedPassword = await bcrypt.hash('123123', 10)

  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      email: 'admin@example.com',
      realName: '系统管理员',
      role: 'ADMIN',
      status: 'ACTIVE',
      department: '系统管理部',
      isActive: true
    }
  })

  console.log('管理员账户创建成功:', admin)

  // 创建示例教师账户
  const teacherPassword = await bcrypt.hash('123123', 10)
  const teacher = await prisma.user.upsert({
    where: { username: 'teacher' },
    update: {},
    create: {
      username: 'teacher',
      password: teacherPassword,
      email: 'teacher@example.com',
      realName: '张老师',
      role: 'TEACHER',
      status: 'ACTIVE',
      department: '计算机学院',
      isActive: true
    }
  })

  console.log('教师账户创建成功:', teacher)

  // 创建示例学生账户
  const studentPassword = await bcrypt.hash('123123', 10)
  const student = await prisma.user.upsert({
    where: { username: 'student' },
    update: {},
    create: {
      username: 'student',
      password: studentPassword,
      email: 'student@example.com',
      realName: '李同学',
      role: 'STUDENT',
      status: 'ACTIVE',
      department: '计算机学院',
      studentId: '2024001',
      grade: '2024级',
      major: '计算机科学与技术',
      isActive: true
    }
  })

  console.log('学生账户创建成功:', student)

  // 创建示例学科
  const subjects = [
    {
      name: 'Java编程',
      code: 'JAVA001',
      description: 'Java程序设计基础课程',
      createdById: admin.id
    },
    {
      name: '高等数学',
      code: 'MATH001',
      description: '高等数学基础课程',
      createdById: admin.id
    },
    {
      name: 'HSK中文考试',
      code: 'HSK001',
      description: 'HSK中文水平考试',
      createdById: admin.id
    },
    {
      name: '大学英语四级',
      code: 'CET4001',
      description: '大学英语四级考试',
      createdById: admin.id
    }
  ]

  const createdSubjects = []
  for (const subjectData of subjects) {
    const subject = await prisma.subject.upsert({
      where: { code: subjectData.code },
      update: {},
      create: subjectData
    })
    createdSubjects.push(subject)
    console.log('学科创建成功:', subject.name)
  }

  // 创建示例题目
  const questions = [
    {
      stem: '下列哪项不是Java的基本数据类型？',
      subjectId: createdSubjects[0].id, // Java编程
      type: 'SINGLE_CHOICE' as const,
      difficulty: 'MEDIUM' as const,
      options: {
        A: 'int',
        B: 'float',
        C: 'String',
        D: 'boolean'
      },
      answer: 'C',
      explanation: 'String是引用数据类型，不是基本数据类型'
    },
    {
      stem: '已知集合A={1,2,3},B={2,3,4},则A∩B=?',
      subjectId: createdSubjects[1].id, // 高等数学
      type: 'SINGLE_CHOICE' as const,
      difficulty: 'EASY' as const,
      options: {
        A: '{1,2,3,4}',
        B: '{2,3}',
        C: '{1,4}',
        D: '∅'
      },
      answer: 'B',
      explanation: '集合的交集是两个集合共同的元素'
    },
    {
      stem: '请写出"你好"的拼音',
      subjectId: createdSubjects[2].id, // HSK中文考试
      type: 'FILL_BLANK' as const,
      difficulty: 'EASY' as const,
      answer: 'nǐ hǎo',
      explanation: '"你好"是最基本的中文问候语'
    }
  ]

  for (const questionData of questions) {
    // 检查题目是否已存在
    const existingQuestion = await prisma.question.findFirst({
      where: {
        stem: questionData.stem,
        subjectId: questionData.subjectId
      }
    })

    if (!existingQuestion) {
      const question = await prisma.question.create({
        data: questionData
      })
      console.log('题目创建成功:', question.stem.substring(0, 20) + '...')
    }
  }

  // 创建一些系统设置
  const systemSettings = [
    {
      key: 'site_name',
      value: 'HSK考试系统',
      description: '网站名称',
      category: 'general'
    },
    {
      key: 'site_description',
      value: 'HSK中文水平考试在线系统',
      description: '网站描述',
      category: 'general'
    },
    {
      key: 'max_login_attempts',
      value: '5',
      description: '最大登录尝试次数',
      category: 'security'
    },
    {
      key: 'session_timeout',
      value: '3600',
      description: '会话超时时间（秒）',
      category: 'security'
    }
  ]

  for (const setting of systemSettings) {
    await prisma.systemSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting
    })
  }

  console.log('系统设置初始化完成')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
