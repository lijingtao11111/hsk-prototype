// 内存数据库 - 用于开发测试
interface MemoryUser {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  department: string;
  departmentName: string;
  idNumber: string;
  phone: string;
  status: 'active' | 'inactive';
  registerDate: string;
  avatar: string;
  isActive: boolean;
  permissions: string[];
}

interface MemorySubject {
  id: number;
  subjectId: string;
  name: string;
  category: string;
  description: string;
  questionCount: number;
  activeQuestions: number;
  difficulty: string;
  status: 'active' | 'inactive';
  isActive: boolean;
  createTime: string;
  updateTime: string;
}

interface MemoryQuestion {
  id: string;
  stem: string;
  subject: string;
  type: string;
  difficulty: string;
  status: 'active' | 'inactive' | 'pending';
  reviewStatus: 'approved' | 'pending' | 'rejected';
  isActive: boolean;
  createTime: string;
}

interface MemorySystemConfig {
  id: string;
  category: string;
  key: string;
  value: any;
  description: string;
  type: 'string' | 'number' | 'boolean' | 'object';
  isActive: boolean;
  lastUpdated: string;
}

interface DashboardStats {
  totalUsers: number;
  activeSubjects: number;
  totalQuestions: number;
  averageAccuracy: number;
  userGrowth: number;
  subjectGrowth: number;
  questionGrowth: number;
  accuracyGrowth: number;
}

interface RecentActivity {
  id: number;
  user: { name: string; role: string; avatar: string };
  activity: string;
  status: 'completed' | 'pending' | 'failed';
  statusText: string;
  time: string;
}

class MemoryDatabase {
  private users: MemoryUser[] = [
    {
      id: '1',
      username: 'admin',
      fullName: '系统管理员',
      email: 'admin@zjufe.edu.cn',
      role: 'admin',
      department: 'admin',
      departmentName: '系统管理',
      idNumber: 'ADMIN001',
      phone: '13800000000',
      status: 'active',
      registerDate: '2024-01-01',
      avatar: '管',
      isActive: true,
      permissions: ['VIEW_ALL_DATA', 'MANAGE_USERS', 'MANAGE_SUBJECTS', 'MANAGE_QUESTIONS', 'MANAGE_SYSTEM']
    }
  ];

  private subjects: MemorySubject[] = [
    {
      id: 1,
      subjectId: 'hsk4',
      name: 'HSK四级',
      category: '语言类',
      description: 'HSK四级中文考试',
      questionCount: 0,
      activeQuestions: 0,
      difficulty: '中级',
      status: 'active',
      isActive: true,
      createTime: '2024-01-10 10:30',
      updateTime: '2024-01-20 14:15'
    }
  ];

  private questions: MemoryQuestion[] = [];

  private systemConfigs: MemorySystemConfig[] = [
    {
      id: '1',
      category: 'system',
      key: 'site_name',
      value: '浙江财经大学智能考试系统',
      description: '系统名称',
      type: 'string',
      isActive: true,
      lastUpdated: '2024-01-01T00:00:00.000Z'
    }
  ];

  // 用户相关方法
  async getUsers(params: any = {}) {
    let filteredUsers = [...this.users];
    
    if (params.search) {
      const search = params.search.toLowerCase();
      filteredUsers = filteredUsers.filter(user => 
        user.fullName.toLowerCase().includes(search) ||
        user.username.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search)
      );
    }
    
    if (params.role && params.role !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.role === params.role);
    }
    
    if (params.isActive !== undefined) {
      filteredUsers = filteredUsers.filter(user => user.isActive === params.isActive);
    }
    
    const page = parseInt(params.page) || 1;
    const limit = parseInt(params.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return {
      users: filteredUsers.slice(startIndex, endIndex),
      total: filteredUsers.length,
      page,
      limit
    };
  }

  async getUserByUsername(username: string) {
    return this.users.find(user => user.username === username);
  }

  // 学科相关方法
  async getSubjects(params: any = {}) {
    let filteredSubjects = [...this.subjects];
    
    if (params.category && params.category !== 'all') {
      filteredSubjects = filteredSubjects.filter(subject => subject.category === params.category);
    }
    
    if (params.isActive !== undefined) {
      filteredSubjects = filteredSubjects.filter(subject => subject.isActive === params.isActive);
    }
    
    return {
      subjects: filteredSubjects,
      total: filteredSubjects.length
    };
  }

  // 题目相关方法
  async getQuestions(params: any = {}) {
    let filteredQuestions = [...this.questions];
    
    if (params.search) {
      const search = params.search.toLowerCase();
      filteredQuestions = filteredQuestions.filter(question => 
        question.stem.toLowerCase().includes(search) ||
        question.id.toLowerCase().includes(search)
      );
    }
    
    if (params.subjectId && params.subjectId !== 'all') {
      filteredQuestions = filteredQuestions.filter(question => question.subject === params.subjectId);
    }
    
    if (params.type && params.type !== 'all') {
      filteredQuestions = filteredQuestions.filter(question => question.type === params.type);
    }
    
    if (params.difficulty && params.difficulty !== 'all') {
      filteredQuestions = filteredQuestions.filter(question => question.difficulty === params.difficulty);
    }
    
    if (params.reviewStatus && params.reviewStatus !== 'all') {
      filteredQuestions = filteredQuestions.filter(question => question.reviewStatus === params.reviewStatus);
    }
    
    const page = parseInt(params.page) || 1;
    const limit = parseInt(params.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return {
      questions: filteredQuestions.slice(startIndex, endIndex),
      total: filteredQuestions.length,
      page,
      limit
    };
  }

  // 系统配置相关方法
  async getSystemConfigs() {
    return this.systemConfigs;
  }

  async updateSystemConfig(key: string, value: any) {
    const config = this.systemConfigs.find(c => c.key === key);
    if (config) {
      config.value = value;
      config.lastUpdated = new Date().toISOString();
    }
    return config;
  }

  // 仪表板数据
  async getDashboardData(): Promise<{
    stats: DashboardStats;
    recentActivities: RecentActivity[];
    systemStatus: any;
  }> {
    return {
      stats: {
        totalUsers: this.users.filter(u => u.isActive).length,
        activeSubjects: this.subjects.filter(s => s.isActive).length,
        totalQuestions: this.questions.filter(q => q.isActive).length,
        averageAccuracy: 0,
        userGrowth: 0,
        subjectGrowth: 0,
        questionGrowth: 0,
        accuracyGrowth: 0
      },
      recentActivities: [],
      systemStatus: {
        serverStatus: 'normal',
        databaseStatus: 'normal',
        cacheStatus: 'normal',
        storageUsage: 0
      }
    };
  }
}

export const memoryDB = new MemoryDatabase();
