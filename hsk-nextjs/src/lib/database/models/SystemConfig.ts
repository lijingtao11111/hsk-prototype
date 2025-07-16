import mongoose, { Schema, Document } from 'mongoose';

// 登录配置接口
interface ILoginConfig {
  wechatLogin: boolean;         // 企业微信登录
  accountLogin: boolean;        // 账号密码登录
  autoRegister: boolean;        // 自动注册
}

// 通知配置接口
interface INotificationConfig {
  emailNotify: boolean;         // 邮件通知
  smsNotify: boolean;          // 短信通知
  systemNotify: boolean;       // 系统内通知
  emailSettings?: {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPassword: string;
    fromEmail: string;
  };
}

// AI配置接口
interface IAIConfig {
  enabled: boolean;             // 是否启用AI功能
  agentApiUrl: string;         // Agent API地址
  agentApiKey: string;         // Agent API密钥
  paperParseAgentId: string;   // 试卷解析Agent ID
  errorAnalysisAgentId: string; // 错题分析Agent ID
  questionGenAgentId: string;   // 题目生成Agent ID
  maxTokens: number;           // 最大Token数
  temperature: number;         // 温度参数
}

// 文件上传配置接口
interface IUploadConfig {
  maxFileSize: number;         // 最大文件大小(MB)
  allowedTypes: string[];      // 允许的文件类型
  uploadPath: string;          // 上传路径
  enableCompression: boolean;  // 启用压缩
}

// 系统配置文档接口
export interface ISystemConfig extends Document {
  configKey: string;                    // 配置键名
  configName: string;                   // 配置名称
  configValue: any;                     // 配置值
  configType: string;                   // 配置类型
  description: string;                  // 配置描述
  category: string;                     // 配置分类
  isActive: boolean;                    // 是否启用
  isSystem: boolean;                    // 是否系统配置
  updatedBy: mongoose.Types.ObjectId;   // 更新者
  updateTime: Date;                     // 更新时间
  createTime: Date;                     // 创建时间
}

// 系统配置Schema
const SystemConfigSchema = new Schema<ISystemConfig>({
  configKey: { 
    type: String, 
    required: true, 
    unique: true,
    index: true
  },
  configName: { 
    type: String, 
    required: true 
  },
  configValue: { 
    type: Schema.Types.Mixed, 
    required: true 
  },
  configType: { 
    type: String, 
    required: true,
    enum: ['string', 'number', 'boolean', 'object', 'array']
  },
  description: { 
    type: String, 
    default: '' 
  },
  category: { 
    type: String, 
    required: true,
    enum: ['basic', 'login', 'notification', 'ai', 'upload', 'security'],
    index: true
  },
  isActive: { 
    type: Boolean, 
    default: true,
    index: true
  },
  isSystem: { 
    type: Boolean, 
    default: false 
  },
  updatedBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  updateTime: { 
    type: Date, 
    default: Date.now 
  },
  createTime: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 索引
SystemConfigSchema.index({ category: 1, isActive: 1 });
SystemConfigSchema.index({ configKey: 1, isActive: 1 });

// 中间件：更新updateTime字段
SystemConfigSchema.pre('save', function(next) {
  this.updateTime = new Date();
  next();
});

// 静态方法：获取配置值
SystemConfigSchema.statics.getConfig = async function(configKey: string, defaultValue?: any) {
  const config = await this.findOne({ configKey, isActive: true });
  return config ? config.configValue : defaultValue;
};

// 静态方法：设置配置值
SystemConfigSchema.statics.setConfig = async function(
  configKey: string, 
  configValue: any, 
  updatedBy: string,
  options?: {
    configName?: string;
    description?: string;
    category?: string;
  }
) {
  const updateData: any = {
    configValue,
    updatedBy: new mongoose.Types.ObjectId(updatedBy),
    updateTime: new Date()
  };

  if (options) {
    if (options.configName) updateData.configName = options.configName;
    if (options.description) updateData.description = options.description;
    if (options.category) updateData.category = options.category;
  }

  return this.findOneAndUpdate(
    { configKey },
    updateData,
    { 
      upsert: true, 
      new: true,
      setDefaultsOnInsert: true
    }
  );
};

// 静态方法：获取分类配置
SystemConfigSchema.statics.getConfigsByCategory = function(category: string) {
  return this.find({ category, isActive: true }).sort({ configKey: 1 });
};

// 静态方法：批量设置配置
SystemConfigSchema.statics.setBatchConfigs = async function(
  configs: Array<{
    configKey: string;
    configValue: any;
    configName?: string;
    description?: string;
    category?: string;
  }>,
  updatedBy: string
) {
  const operations = configs.map(config => ({
    updateOne: {
      filter: { configKey: config.configKey },
      update: {
        configValue: config.configValue,
        configName: config.configName || config.configKey,
        description: config.description || '',
        category: config.category || 'basic',
        configType: typeof config.configValue,
        updatedBy: new mongoose.Types.ObjectId(updatedBy),
        updateTime: new Date()
      },
      upsert: true
    }
  }));

  return this.bulkWrite(operations);
};

// 静态方法：初始化默认配置
SystemConfigSchema.statics.initDefaultConfigs = async function(adminUserId: string) {
  const defaultConfigs = [
    // 基础配置
    {
      configKey: 'system.name',
      configName: '系统名称',
      configValue: '浙江财经大学智能考试系统',
      configType: 'string',
      category: 'basic',
      description: '系统显示名称'
    },
    {
      configKey: 'system.version',
      configName: '系统版本',
      configValue: '1.0.0',
      configType: 'string',
      category: 'basic',
      description: '当前系统版本'
    },
    {
      configKey: 'system.theme_color',
      configName: '主题色',
      configValue: '#4f46e5',
      configType: 'string',
      category: 'basic',
      description: '系统主题颜色'
    },
    
    // 登录配置
    {
      configKey: 'login.wechat_enabled',
      configName: '企业微信登录',
      configValue: true,
      configType: 'boolean',
      category: 'login',
      description: '是否启用企业微信登录'
    },
    {
      configKey: 'login.account_enabled',
      configName: '账号密码登录',
      configValue: true,
      configType: 'boolean',
      category: 'login',
      description: '是否启用账号密码登录'
    },
    
    // 通知配置
    {
      configKey: 'notification.email_enabled',
      configName: '邮件通知',
      configValue: true,
      configType: 'boolean',
      category: 'notification',
      description: '是否启用邮件通知'
    },
    {
      configKey: 'notification.sms_enabled',
      configName: '短信通知',
      configValue: false,
      configType: 'boolean',
      category: 'notification',
      description: '是否启用短信通知'
    },
    
    // AI配置
    {
      configKey: 'ai.enabled',
      configName: 'AI功能',
      configValue: true,
      configType: 'boolean',
      category: 'ai',
      description: '是否启用AI功能'
    },
    {
      configKey: 'ai.max_tokens',
      configName: '最大Token数',
      configValue: 4000,
      configType: 'number',
      category: 'ai',
      description: 'AI调用最大Token数'
    },
    
    // 上传配置
    {
      configKey: 'upload.max_file_size',
      configName: '最大文件大小',
      configValue: 50,
      configType: 'number',
      category: 'upload',
      description: '文件上传最大大小(MB)'
    },
    {
      configKey: 'upload.allowed_types',
      configName: '允许的文件类型',
      configValue: ['pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png'],
      configType: 'array',
      category: 'upload',
      description: '允许上传的文件类型'
    }
  ];

  const operations = defaultConfigs.map(config => ({
    updateOne: {
      filter: { configKey: config.configKey },
      update: {
        ...config,
        updatedBy: new mongoose.Types.ObjectId(adminUserId),
        isSystem: true,
        isActive: true,
        createTime: new Date(),
        updateTime: new Date()
      },
      upsert: true
    }
  }));

  return this.bulkWrite(operations);
};

export const SystemConfig = mongoose.models.SystemConfig || 
  mongoose.model<ISystemConfig>('SystemConfig', SystemConfigSchema);
