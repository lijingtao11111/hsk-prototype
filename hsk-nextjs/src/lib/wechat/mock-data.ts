// 企业微信用户扩展信息接口
export interface MockUserExtendedInfo {
  grade: string;        // 年级，如 "2023级"
  major: string;        // 专业，如 "计算机科学与技术"
  department: string;   // 院系，如 "计算机学院"
  studentId: string;    // 学号，如 "2023001001"
  class?: string;       // 班级，如 "计科2301班"
}

// 模拟数据配置
const MOCK_DATA_CONFIG = {
  grades: ['2021级', '2022级', '2023级', '2024级'],
  majors: [
    '计算机科学与技术',
    '软件工程',
    '人工智能',
    '数据科学与大数据技术',
    '网络工程',
    '信息安全',
    '数字媒体技术',
    '物联网工程'
  ],
  departments: [
    '计算机学院',
    '软件学院',
    '信息学院',
    '数据科学学院'
  ],
  // 经济类专业
  economicMajors: [
    '经济学',
    '国际经济与贸易',
    '金融学',
    '投资学',
    '保险学',
    '金融工程',
    '经济统计学'
  ],
  economicDepartments: [
    '经济学院',
    '金融学院',
    '国际经贸学院'
  ],
  // 管理类专业
  managementMajors: [
    '工商管理',
    '市场营销',
    '会计学',
    '财务管理',
    '人力资源管理',
    '审计学',
    '资产评估',
    '物流管理'
  ],
  managementDepartments: [
    '工商管理学院',
    '会计学院',
    '财政税务学院'
  ],
  // 文法类专业
  liberalArtsMajors: [
    '汉语言文学',
    '英语',
    '日语',
    '法学',
    '社会工作',
    '新闻学',
    '广告学'
  ],
  liberalArtsDepartments: [
    '人文学院',
    '外国语学院',
    '法学院',
    '马克思主义学院'
  ]
};

// 生成随机学号
function generateStudentId(grade: string, department: string): string {
  const year = grade.substring(0, 4);
  
  // 根据学院生成学院代码
  const departmentCodes: { [key: string]: string } = {
    '计算机学院': '01',
    '软件学院': '02',
    '信息学院': '03',
    '数据科学学院': '04',
    '经济学院': '05',
    '金融学院': '06',
    '国际经贸学院': '07',
    '工商管理学院': '08',
    '会计学院': '09',
    '财政税务学院': '10',
    '人文学院': '11',
    '外国语学院': '12',
    '法学院': '13',
    '马克思主义学院': '14'
  };
  
  const deptCode = departmentCodes[department] || '99';
  const randomNum = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0');
  
  return `${year}${deptCode}${randomNum}`;
}

// 生成班级名称
function generateClassName(major: string, grade: string): string {
  const year = grade.substring(2, 4); // 取年份后两位
  const majorShort = getMajorShortName(major);
  const classNum = String(Math.floor(Math.random() * 3) + 1).padStart(2, '0');
  
  return `${majorShort}${year}${classNum}班`;
}

// 获取专业简称
function getMajorShortName(major: string): string {
  const shortNames: { [key: string]: string } = {
    '计算机科学与技术': '计科',
    '软件工程': '软工',
    '人工智能': '人工',
    '数据科学与大数据技术': '数科',
    '网络工程': '网工',
    '信息安全': '信安',
    '数字媒体技术': '数媒',
    '物联网工程': '物联',
    '经济学': '经济',
    '国际经济与贸易': '国贸',
    '金融学': '金融',
    '投资学': '投资',
    '保险学': '保险',
    '金融工程': '金工',
    '经济统计学': '经统',
    '工商管理': '工管',
    '市场营销': '市营',
    '会计学': '会计',
    '财务管理': '财管',
    '人力资源管理': '人资',
    '审计学': '审计',
    '资产评估': '资评',
    '物流管理': '物流',
    '汉语言文学': '中文',
    '英语': '英语',
    '日语': '日语',
    '法学': '法学',
    '社会工作': '社工',
    '新闻学': '新闻',
    '广告学': '广告'
  };
  
  return shortNames[major] || major.substring(0, 2);
}

// 根据专业类型选择对应的数据
function getDataByMajorType(majorType: 'tech' | 'economic' | 'management' | 'liberal') {
  switch (majorType) {
    case 'tech':
      return {
        majors: MOCK_DATA_CONFIG.majors,
        departments: MOCK_DATA_CONFIG.departments
      };
    case 'economic':
      return {
        majors: MOCK_DATA_CONFIG.economicMajors,
        departments: MOCK_DATA_CONFIG.economicDepartments
      };
    case 'management':
      return {
        majors: MOCK_DATA_CONFIG.managementMajors,
        departments: MOCK_DATA_CONFIG.managementDepartments
      };
    case 'liberal':
      return {
        majors: MOCK_DATA_CONFIG.liberalArtsMajors,
        departments: MOCK_DATA_CONFIG.liberalArtsDepartments
      };
    default:
      return {
        majors: MOCK_DATA_CONFIG.majors,
        departments: MOCK_DATA_CONFIG.departments
      };
  }
}

// 主要的模拟数据生成函数
export function generateMockUserInfo(openid: string): MockUserExtendedInfo {
  // 使用openid作为种子来确保同一用户总是生成相同的信息
  const seed = openid.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // 随机选择专业类型
  const majorTypes: ('tech' | 'economic' | 'management' | 'liberal')[] = 
    ['tech', 'economic', 'management', 'liberal'];
  const majorType = majorTypes[seed % majorTypes.length];
  
  const { majors, departments } = getDataByMajorType(majorType);
  
  const grade = MOCK_DATA_CONFIG.grades[seed % MOCK_DATA_CONFIG.grades.length];
  const major = majors[Math.floor(seed / 2) % majors.length];
  const department = departments[Math.floor(seed / 3) % departments.length];
  const studentId = generateStudentId(grade, department);
  const className = generateClassName(major, grade);

  return {
    grade,
    major,
    department,
    studentId,
    class: className
  };
}

// 企业微信API适配器（当前使用模拟数据）
export class WeChatWorkAPIAdapter {
  private apiKey?: string;
  private corpId?: string;
  private agentId?: string;

  constructor(config?: {
    apiKey?: string;
    corpId?: string;
    agentId?: string;
  }) {
    this.apiKey = config?.apiKey || process.env.WECHAT_WORK_API_KEY;
    this.corpId = config?.corpId || process.env.WECHAT_WORK_CORP_ID;
    this.agentId = config?.agentId || process.env.WECHAT_WORK_AGENT_ID;
  }

  // 获取用户扩展信息（当前返回模拟数据）
  async getUserExtendedInfo(openid: string): Promise<MockUserExtendedInfo | null> {
    try {
      // TODO: 实现真实的企业微信API调用
      // 当前返回模拟数据
      return generateMockUserInfo(openid);
    } catch (error) {
      console.error('获取用户扩展信息失败:', error);
      return null;
    }
  }

  // 预留的真实API接口（待客户提供API格式后实现）
  async fetchRealUserInfo(openid: string): Promise<any> {
    if (!this.apiKey || !this.corpId) {
      throw new Error('企业微信API配置不完整');
    }

    // TODO: 实现真实的企业微信API调用
    // 示例代码结构：
    /*
    const response = await fetch(`https://qyapi.weixin.qq.com/cgi-bin/user/get`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
      // 添加必要的参数
    });
    
    if (!response.ok) {
      throw new Error('企业微信API调用失败');
    }
    
    return response.json();
    */
    
    throw new Error('真实API尚未实现，请联系管理员配置');
  }

  // OAuth授权URL生成
  generateOAuthURL(redirectUri: string, state?: string): string {
    if (!this.corpId || !this.agentId) {
      // 返回模拟的授权URL
      return `/api/auth/login?mock=true&redirect=${encodeURIComponent(redirectUri)}`;
    }

    const params = new URLSearchParams({
      appid: this.corpId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'snsapi_base',
      agentid: this.agentId,
      state: state || 'STATE'
    });

    return `https://open.weixin.qq.com/connect/oauth2/authorize?${params.toString()}#wechat_redirect`;
  }
}

// 导出默认实例
export const wechatWorkAPI = new WeChatWorkAPIAdapter();
