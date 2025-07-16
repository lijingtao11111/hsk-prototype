import { connectDB } from './connection';
import { User } from './models/User';
import { getDefaultPermissions } from '../auth/jwt';

// 默认管理员账号配置
const DEFAULT_ADMIN = {
  username: 'admin',
  password: '123123', // 在实际项目中应该使用哈希密码
  nickname: '系统管理员',
  role: 'admin',
  openid: 'admin_default',
  extendedInfo: {
    grade: '系统',
    major: '系统管理',
    department: '系统管理部',
    studentId: 'admin'
  }
};

/**
 * 初始化数据库，创建默认管理员账号
 */
export async function initializeDatabase() {
  try {
    await connectDB();
    
    // 检查是否已存在默认管理员
    const existingAdmin = await User.findOne({ 
      openid: DEFAULT_ADMIN.openid,
      role: 'admin' 
    });

    if (!existingAdmin) {
      console.log('创建默认管理员账号...');
      
      // 创建默认管理员用户
      const adminUser = new User({
        openid: DEFAULT_ADMIN.openid,
        nickname: DEFAULT_ADMIN.nickname,
        avatar: '',
        role: DEFAULT_ADMIN.role,
        extendedInfo: DEFAULT_ADMIN.extendedInfo,
        subjects: [],
        primarySubject: '',
        registerTime: new Date(),
        lastLoginTime: new Date(),
        totalPracticeTime: 0,
        practiceCount: 0,
        accuracy: 0,
        weakKnowledgePoints: [],
        permissions: getDefaultPermissions('admin'),
        isActive: true,
        createdBy: null,
        lastUpdated: new Date()
      });

      await adminUser.save();
      
      console.log('默认管理员账号创建成功:');
      console.log(`用户名: ${DEFAULT_ADMIN.username}`);
      console.log(`密码: ${DEFAULT_ADMIN.password}`);
      console.log(`昵称: ${DEFAULT_ADMIN.nickname}`);
      console.log(`角色: ${DEFAULT_ADMIN.role}`);
      
      return {
        success: true,
        message: '默认管理员账号创建成功',
        admin: {
          username: DEFAULT_ADMIN.username,
          password: DEFAULT_ADMIN.password,
          nickname: DEFAULT_ADMIN.nickname,
          role: DEFAULT_ADMIN.role
        }
      };
    } else {
      console.log('默认管理员账号已存在');
      return {
        success: true,
        message: '默认管理员账号已存在',
        admin: {
          username: DEFAULT_ADMIN.username,
          password: DEFAULT_ADMIN.password,
          nickname: existingAdmin.nickname,
          role: existingAdmin.role
        }
      };
    }
    
  } catch (error) {
    console.error('数据库初始化失败:', error);
    return {
      success: false,
      error: '数据库初始化失败'
    };
  }
}

/**
 * 验证管理员账号密码
 */
export function validateAdminCredentials(username: string, password: string): boolean {
  return username === DEFAULT_ADMIN.username && password === DEFAULT_ADMIN.password;
}

/**
 * 获取默认管理员配置
 */
export function getDefaultAdminConfig() {
  return {
    username: DEFAULT_ADMIN.username,
    password: DEFAULT_ADMIN.password,
    nickname: DEFAULT_ADMIN.nickname,
    role: DEFAULT_ADMIN.role,
    openid: DEFAULT_ADMIN.openid,
    extendedInfo: DEFAULT_ADMIN.extendedInfo
  };
}
