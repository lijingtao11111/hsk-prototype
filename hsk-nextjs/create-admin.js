const { PrismaClient } = require('./generated/prisma')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    console.log('正在创建admin用户...')

    // 删除现有的admin用户（如果存在）
    await prisma.user.deleteMany({
      where: { username: 'admin' }
    })

    // 创建新的admin用户
    const hashedPassword = await bcrypt.hash('123123', 10)
    const admin = await prisma.user.create({
      data: {
        username: 'admin',
        password: hashedPassword,
        email: 'admin@example.com',
        realName: '系统管理员',
        role: 'ADMIN',
        status: 'ACTIVE',
        department: '系统管理部'
      }
    })

    console.log('Admin用户创建成功!')
    console.log('用户名: admin')
    console.log('密码: 123123')
    console.log('角色:', admin.role)

    // 验证密码
    const isValid = await bcrypt.compare('123123', admin.password)
    console.log('密码验证:', isValid ? '成功' : '失败')

  } catch (error) {
    console.error('创建admin用户失败:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()
