import mongoose, { Schema, Document } from 'mongoose';

// 用户扩展信息接口
interface IExtendedInfo {
  grade: string;        // 年级
  major: string;        // 专业
  department: string;   // 部门
  studentId: string;    // 学号/工号
  class?: string;       // 班级
}

// 学习科目接口
interface ISubject {
  subjectId: string;    // 科目ID
  subjectName: string;  // 科目名称
  level: string;        // 当前等级/水平
  targetLevel?: string; // 目标等级
  isActive: boolean;    // 是否正在学习
}

// 用户文档接口
export interface IUser extends Document {
  openid: string;                    // 企业微信用户标识
  nickname: string;                  // 昵称
  avatar: string;                    // 头像
  role: 'student' | 'teacher' | 'admin'; // 用户角色
  extendedInfo: IExtendedInfo;       // 企业微信扩展信息
  subjects: ISubject[];              // 学习的专业/科目
  primarySubject: string;            // 主要学习科目
  registerTime: Date;                // 注册时间
  lastLoginTime: Date;               // 最后登录时间
  totalPracticeTime: number;         // 总练习时长(分钟)
  practiceCount: number;             // 练习次数
  accuracy: number;                  // 总体正确率
  weakKnowledgePoints: string[];     // 薄弱知识点
  permissions: string[];             // 权限列表
  isActive: boolean;                 // 账号状态
  createdBy?: mongoose.Types.ObjectId; // 创建者(管理员)
  lastUpdated: Date;                 // 最后更新时间
}

// 扩展信息Schema
const ExtendedInfoSchema = new Schema<IExtendedInfo>({
  grade: { type: String, required: true },
  major: { type: String, required: true },
  department: { type: String, required: true },
  studentId: { type: String, required: true },
  class: { type: String }
}, { _id: false });

// 学习科目Schema
const SubjectSchema = new Schema<ISubject>({
  subjectId: { type: String, required: true },
  subjectName: { type: String, required: true },
  level: { type: String, required: true },
  targetLevel: { type: String },
  isActive: { type: Boolean, default: true }
}, { _id: false });

// 用户Schema
const UserSchema = new Schema<IUser>({
  openid: { 
    type: String, 
    required: true, 
    unique: true,
    index: true 
  },
  nickname: { 
    type: String, 
    required: true 
  },
  avatar: { 
    type: String, 
    default: '' 
  },
  role: { 
    type: String, 
    enum: ['student', 'teacher', 'admin'], 
    default: 'student',
    index: true
  },
  extendedInfo: { 
    type: ExtendedInfoSchema, 
    required: true 
  },
  subjects: [SubjectSchema],
  primarySubject: { 
    type: String, 
    default: '' 
  },
  registerTime: { 
    type: Date, 
    default: Date.now 
  },
  lastLoginTime: { 
    type: Date, 
    default: Date.now 
  },
  totalPracticeTime: { 
    type: Number, 
    default: 0 
  },
  practiceCount: { 
    type: Number, 
    default: 0 
  },
  accuracy: { 
    type: Number, 
    default: 0,
    min: 0,
    max: 100
  },
  weakKnowledgePoints: [{ 
    type: String 
  }],
  permissions: [{ 
    type: String 
  }],
  isActive: { 
    type: Boolean, 
    default: true,
    index: true
  },
  createdBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  },
  lastUpdated: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 索引
UserSchema.index({ role: 1, isActive: 1 });
UserSchema.index({ 'extendedInfo.department': 1 });
UserSchema.index({ 'extendedInfo.major': 1 });
UserSchema.index({ primarySubject: 1 });

// 中间件：更新lastUpdated字段
UserSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// 虚拟字段：用户显示名称
UserSchema.virtual('displayName').get(function() {
  return this.nickname || this.extendedInfo?.studentId || this.openid;
});

// 实例方法：添加学习科目
UserSchema.methods.addSubject = function(subject: ISubject) {
  const existingIndex = this.subjects.findIndex(
    (s: ISubject) => s.subjectId === subject.subjectId
  );
  
  if (existingIndex >= 0) {
    this.subjects[existingIndex] = subject;
  } else {
    this.subjects.push(subject);
  }
  
  return this.save();
};

// 实例方法：移除学习科目
UserSchema.methods.removeSubject = function(subjectId: string) {
  this.subjects = this.subjects.filter(
    (s: ISubject) => s.subjectId !== subjectId
  );
  
  if (this.primarySubject === subjectId) {
    this.primarySubject = this.subjects.length > 0 ? this.subjects[0].subjectId : '';
  }
  
  return this.save();
};

// 静态方法：按角色查找用户
UserSchema.statics.findByRole = function(role: string) {
  return this.find({ role, isActive: true });
};

// 静态方法：按部门查找用户
UserSchema.statics.findByDepartment = function(department: string) {
  return this.find({ 
    'extendedInfo.department': department, 
    isActive: true 
  });
};

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
