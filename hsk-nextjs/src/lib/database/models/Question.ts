import mongoose, { Schema, Document } from 'mongoose';

// 学科信息接口
interface ISubjectInfo {
  subjectId: string;    // 学科ID
  subjectName: string;  // 学科名称
  level: string;        // 难度等级/年级
  chapter?: string;     // 章节
  section?: string;     // 小节
}

// 题目内容接口
interface IQuestionContent {
  stem: string;         // 题干
  options?: string[];   // 选项(选择题)
  blanks?: string[];    // 填空(填空题)
  audio?: string;       // 音频URL(听力题)
  images?: string[];    // 图片URL
  materials?: string;   // 阅读材料(阅读题)
  formulas?: string[];  // 公式(理科题目)
}

// 答案信息接口
interface IAnswer {
  correct: string[];    // 正确答案
  explanation: string;  // 答案解析
  keyPoints: string[];  // 关键知识点
  steps?: string[];     // 解题步骤(理科题目)
}

// 统计信息接口
interface IStatistics {
  attemptCount: number; // 被练习次数
  correctCount: number; // 正确次数
  accuracy: number;     // 正确率
}

// 编辑历史接口
interface IEditHistory {
  editedBy: mongoose.Types.ObjectId; // 编辑者ID
  editTime: Date;                    // 编辑时间
  changes: any;                      // 修改内容
  reason: string;                    // 修改原因
}

// 题目文档接口
export interface IQuestion extends Document {
  questionId: string;                // 题目唯一标识
  type: string;                      // 题型
  subject: ISubjectInfo;             // 学科信息
  difficulty: number;                // 难度等级(1-5)
  category: string;                  // 题目分类
  knowledgePoints: string[];         // 知识点标签
  content: IQuestionContent;         // 题目内容
  answer: IAnswer;                   // 答案信息
  statistics: IStatistics;           // 统计信息
  source: string;                    // 题目来源
  sourceExam?: string;               // 来源考试
  createTime: Date;                  // 创建时间
  updateTime: Date;                  // 更新时间
  aiGenerated: boolean;              // 是否AI生成
  parentQuestionId?: string;         // 基于哪道题生成
  reviewStatus: string;              // 审核状态
  reviewedBy?: mongoose.Types.ObjectId; // 审核人员ID
  reviewTime?: Date;                 // 审核时间
  reviewComments?: string;           // 审核意见
  editHistory: IEditHistory[];       // 编辑历史
  isActive: boolean;                 // 是否激活使用
  qualityScore: number;              // 题目质量评分(0-100)
}

// 学科信息Schema
const SubjectInfoSchema = new Schema<ISubjectInfo>({
  subjectId: { type: String, required: true, index: true },
  subjectName: { type: String, required: true },
  level: { type: String, required: true },
  chapter: { type: String },
  section: { type: String }
}, { _id: false });

// 题目内容Schema
const QuestionContentSchema = new Schema<IQuestionContent>({
  stem: { type: String, required: true },
  options: [{ type: String }],
  blanks: [{ type: String }],
  audio: { type: String },
  images: [{ type: String }],
  materials: { type: String },
  formulas: [{ type: String }]
}, { _id: false });

// 答案Schema
const AnswerSchema = new Schema<IAnswer>({
  correct: { type: [String], required: true },
  explanation: { type: String, required: true },
  keyPoints: { type: [String], required: true },
  steps: [{ type: String }]
}, { _id: false });

// 统计信息Schema
const StatisticsSchema = new Schema<IStatistics>({
  attemptCount: { type: Number, default: 0 },
  correctCount: { type: Number, default: 0 },
  accuracy: { type: Number, default: 0, min: 0, max: 100 }
}, { _id: false });

// 编辑历史Schema
const EditHistorySchema = new Schema<IEditHistory>({
  editedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  editTime: { type: Date, default: Date.now },
  changes: { type: Schema.Types.Mixed, required: true },
  reason: { type: String, required: true }
}, { _id: false });

// 题目Schema
const QuestionSchema = new Schema<IQuestion>({
  questionId: { 
    type: String, 
    required: true, 
    unique: true,
    index: true 
  },
  type: { 
    type: String, 
    required: true,
    enum: [
      'single_choice', 'multiple_choice', 'fill_blank', 
      'comprehensive', 'listening_choice', 'listening_reading', 
      'essay', 'calculation'
    ]
  },
  subject: { 
    type: SubjectInfoSchema, 
    required: true 
  },
  difficulty: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5,
    index: true
  },
  category: { 
    type: String, 
    required: true,
    index: true
  },
  knowledgePoints: { 
    type: [String], 
    required: true,
    index: true
  },
  content: { 
    type: QuestionContentSchema, 
    required: true 
  },
  answer: { 
    type: AnswerSchema, 
    required: true 
  },
  statistics: { 
    type: StatisticsSchema, 
    default: () => ({
      attemptCount: 0,
      correctCount: 0,
      accuracy: 0
    })
  },
  source: { 
    type: String, 
    required: true,
    enum: ['real_exam', 'practice', 'ai_generated'],
    default: 'practice'
  },
  sourceExam: { type: String },
  createTime: { 
    type: Date, 
    default: Date.now 
  },
  updateTime: { 
    type: Date, 
    default: Date.now 
  },
  aiGenerated: { 
    type: Boolean, 
    default: false,
    index: true
  },
  parentQuestionId: { type: String },
  reviewStatus: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'modified'],
    default: 'pending',
    index: true
  },
  reviewedBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  },
  reviewTime: { type: Date },
  reviewComments: { type: String },
  editHistory: [EditHistorySchema],
  isActive: { 
    type: Boolean, 
    default: true,
    index: true
  },
  qualityScore: { 
    type: Number, 
    default: 0, 
    min: 0, 
    max: 100 
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 复合索引
QuestionSchema.index({ 'subject.subjectId': 1, isActive: 1 });
QuestionSchema.index({ knowledgePoints: 1, difficulty: 1 });
QuestionSchema.index({ reviewStatus: 1, createTime: -1 });
QuestionSchema.index({ category: 1, 'subject.subjectId': 1 });

// 中间件：更新updateTime字段
QuestionSchema.pre('save', function(next) {
  this.updateTime = new Date();
  next();
});

// 实例方法：更新统计信息
QuestionSchema.methods.updateStatistics = function(isCorrect: boolean) {
  this.statistics.attemptCount += 1;
  if (isCorrect) {
    this.statistics.correctCount += 1;
  }
  this.statistics.accuracy = (this.statistics.correctCount / this.statistics.attemptCount) * 100;
  return this.save();
};

// 实例方法：添加编辑历史
QuestionSchema.methods.addEditHistory = function(editedBy: string, changes: any, reason: string) {
  this.editHistory.push({
    editedBy: new mongoose.Types.ObjectId(editedBy),
    editTime: new Date(),
    changes,
    reason
  });
  return this.save();
};

// 静态方法：按学科查找题目
QuestionSchema.statics.findBySubject = function(subjectId: string, filters?: any) {
  const query: any = { 
    'subject.subjectId': subjectId, 
    isActive: true 
  };
  
  if (filters) {
    if (filters.difficulty) query.difficulty = filters.difficulty;
    if (filters.category) query.category = filters.category;
    if (filters.reviewStatus) query.reviewStatus = filters.reviewStatus;
  }
  
  return this.find(query);
};

// 静态方法：按知识点查找题目
QuestionSchema.statics.findByKnowledgePoints = function(knowledgePoints: string[]) {
  return this.find({ 
    knowledgePoints: { $in: knowledgePoints }, 
    isActive: true,
    reviewStatus: 'approved'
  });
};

export const Question = mongoose.models.Question || mongoose.model<IQuestion>('Question', QuestionSchema);
