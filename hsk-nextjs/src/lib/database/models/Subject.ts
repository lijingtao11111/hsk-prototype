import mongoose, { Schema, Document } from 'mongoose';

// 等级/年级定义接口
interface ISubjectLevel {
  levelId: string;      // 等级ID
  levelName: string;    // 等级名称
  description: string;  // 等级描述
  order: number;        // 排序
}

// 统计信息接口
interface ISubjectStatistics {
  totalQuestions: number;  // 总题目数
  totalUsers: number;      // 学习用户数
  avgAccuracy: number;     // 平均正确率
}

// 学科文档接口
export interface ISubject extends Document {
  subjectId: string;                    // 学科唯一标识
  name: string;                         // 学科名称
  category: string;                     // 学科类别
  description: string;                  // 学科描述
  levels: ISubjectLevel[];              // 等级/年级定义
  categories: string[];                 // 题目分类列表
  questionTypes: string[];              // 支持的题型
  isActive: boolean;                    // 是否启用
  createdBy: mongoose.Types.ObjectId;   // 创建者
  createTime: Date;                     // 创建时间
  updateTime: Date;                     // 更新时间
  statistics: ISubjectStatistics;       // 统计信息
}

// 等级Schema
const SubjectLevelSchema = new Schema<ISubjectLevel>({
  levelId: { type: String, required: true },
  levelName: { type: String, required: true },
  description: { type: String, default: '' },
  order: { type: Number, required: true }
}, { _id: false });

// 统计信息Schema
const SubjectStatisticsSchema = new Schema<ISubjectStatistics>({
  totalQuestions: { type: Number, default: 0 },
  totalUsers: { type: Number, default: 0 },
  avgAccuracy: { type: Number, default: 0, min: 0, max: 100 }
}, { _id: false });

// 学科Schema
const SubjectSchema = new Schema<ISubject>({
  subjectId: { 
    type: String, 
    required: true, 
    unique: true,
    index: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String, 
    required: true,
    enum: ['语言类', '理工类', '文史类', '技能类', '经济类', '管理类'],
    index: true
  },
  description: { 
    type: String, 
    default: '' 
  },
  levels: [SubjectLevelSchema],
  categories: [{ 
    type: String 
  }],
  questionTypes: [{ 
    type: String,
    enum: [
      'single_choice', 'multiple_choice', 'fill_blank', 
      'comprehensive', 'listening_choice', 'listening_reading', 
      'essay', 'calculation'
    ]
  }],
  isActive: { 
    type: Boolean, 
    default: true,
    index: true
  },
  createdBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  createTime: { 
    type: Date, 
    default: Date.now 
  },
  updateTime: { 
    type: Date, 
    default: Date.now 
  },
  statistics: { 
    type: SubjectStatisticsSchema,
    default: () => ({
      totalQuestions: 0,
      totalUsers: 0,
      avgAccuracy: 0
    })
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 复合索引
SubjectSchema.index({ category: 1, isActive: 1 });
SubjectSchema.index({ name: 'text', description: 'text' });

// 中间件：更新updateTime字段
SubjectSchema.pre('save', function(next) {
  this.updateTime = new Date();
  next();
});

// 虚拟字段：活跃题目数量
SubjectSchema.virtual('activeQuestionCount', {
  ref: 'Question',
  localField: 'subjectId',
  foreignField: 'subject.subjectId',
  count: true,
  match: { isActive: true, reviewStatus: 'approved' }
});

// 实例方法：添加等级
SubjectSchema.methods.addLevel = function(level: ISubjectLevel) {
  const existingIndex = this.levels.findIndex(
    (l: ISubjectLevel) => l.levelId === level.levelId
  );
  
  if (existingIndex >= 0) {
    this.levels[existingIndex] = level;
  } else {
    this.levels.push(level);
    // 按order排序
    this.levels.sort((a: ISubjectLevel, b: ISubjectLevel) => a.order - b.order);
  }
  
  return this.save();
};

// 实例方法：移除等级
SubjectSchema.methods.removeLevel = function(levelId: string) {
  this.levels = this.levels.filter(
    (l: ISubjectLevel) => l.levelId !== levelId
  );
  return this.save();
};

// 实例方法：添加题目分类
SubjectSchema.methods.addCategory = function(category: string) {
  if (!this.categories.includes(category)) {
    this.categories.push(category);
  }
  return this.save();
};

// 实例方法：移除题目分类
SubjectSchema.methods.removeCategory = function(category: string) {
  this.categories = this.categories.filter(c => c !== category);
  return this.save();
};

// 实例方法：更新统计信息
SubjectSchema.methods.updateStatistics = async function() {
  const Question = mongoose.model('Question');
  
  // 统计题目数量
  const totalQuestions = await Question.countDocuments({
    'subject.subjectId': this.subjectId,
    isActive: true,
    reviewStatus: 'approved'
  });
  
  // 统计平均正确率
  const accuracyResult = await Question.aggregate([
    {
      $match: {
        'subject.subjectId': this.subjectId,
        isActive: true,
        reviewStatus: 'approved',
        'statistics.attemptCount': { $gt: 0 }
      }
    },
    {
      $group: {
        _id: null,
        avgAccuracy: { $avg: '$statistics.accuracy' }
      }
    }
  ]);
  
  const avgAccuracy = accuracyResult.length > 0 ? accuracyResult[0].avgAccuracy : 0;
  
  // 统计学习用户数（需要从用户表中统计）
  const User = mongoose.model('User');
  const totalUsers = await User.countDocuments({
    'subjects.subjectId': this.subjectId,
    isActive: true
  });
  
  this.statistics = {
    totalQuestions,
    totalUsers,
    avgAccuracy: Math.round(avgAccuracy * 100) / 100
  };
  
  return this.save();
};

// 静态方法：按类别查找学科
SubjectSchema.statics.findByCategory = function(category: string) {
  return this.find({ category, isActive: true });
};

// 静态方法：搜索学科
SubjectSchema.statics.search = function(keyword: string) {
  return this.find({
    $or: [
      { name: { $regex: keyword, $options: 'i' } },
      { description: { $regex: keyword, $options: 'i' } }
    ],
    isActive: true
  });
};

// 静态方法：获取所有类别
SubjectSchema.statics.getCategories = function() {
  return this.distinct('category', { isActive: true });
};

// 静态方法：批量更新状态
SubjectSchema.statics.updateStatus = function(subjectIds: string[], isActive: boolean) {
  return this.updateMany(
    { subjectId: { $in: subjectIds } },
    { isActive, updateTime: new Date() }
  );
};

export const Subject = mongoose.models.Subject || mongoose.model<ISubject>('Subject', SubjectSchema);
