import mongoose, { Schema, Document } from 'mongoose';

// 答题记录接口
interface IAnswerRecord {
  questionId: string;           // 题目ID
  userAnswer: string[];         // 用户答案
  correctAnswer: string[];      // 正确答案
  isCorrect: boolean;           // 是否正确
  timeSpent: number;            // 答题用时(秒)
  difficulty: number;           // 题目难度
  knowledgePoints: string[];    // 涉及知识点
}

// 练习会话接口
interface IPracticeSession {
  sessionId: string;            // 会话ID
  startTime: Date;              // 开始时间
  endTime?: Date;               // 结束时间
  totalQuestions: number;       // 总题数
  completedQuestions: number;   // 已完成题数
  correctCount: number;         // 正确数量
  accuracy: number;             // 正确率
  totalTimeSpent: number;       // 总用时(秒)
  avgTimePerQuestion: number;   // 平均每题用时
  status: 'in_progress' | 'completed' | 'abandoned'; // 状态
}

// 练习记录文档接口
export interface IPracticeRecord extends Document {
  userId: mongoose.Types.ObjectId;     // 用户ID
  subjectId: string;                   // 学科ID
  subjectName: string;                 // 学科名称
  practiceType: string;                // 练习类型
  session: IPracticeSession;           // 练习会话信息
  answers: IAnswerRecord[];            // 答题记录
  weakKnowledgePoints: string[];       // 薄弱知识点
  masteryLevel: number;                // 掌握程度(0-100)
  aiAnalysis?: {                       // AI分析结果
    errorPattern: string;              // 错误模式
    suggestions: string[];             // 学习建议
    nextRecommendations: string[];     // 下次推荐
  };
  createTime: Date;                    // 创建时间
  updateTime: Date;                    // 更新时间
}

// 答题记录Schema
const AnswerRecordSchema = new Schema<IAnswerRecord>({
  questionId: { type: String, required: true },
  userAnswer: { type: [String], required: true },
  correctAnswer: { type: [String], required: true },
  isCorrect: { type: Boolean, required: true },
  timeSpent: { type: Number, required: true, min: 0 },
  difficulty: { type: Number, required: true, min: 1, max: 5 },
  knowledgePoints: { type: [String], required: true }
}, { _id: false });

// 练习会话Schema
const PracticeSessionSchema = new Schema<IPracticeSession>({
  sessionId: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  totalQuestions: { type: Number, required: true, min: 0 },
  completedQuestions: { type: Number, required: true, min: 0 },
  correctCount: { type: Number, required: true, min: 0 },
  accuracy: { type: Number, required: true, min: 0, max: 100 },
  totalTimeSpent: { type: Number, required: true, min: 0 },
  avgTimePerQuestion: { type: Number, required: true, min: 0 },
  status: { 
    type: String, 
    enum: ['in_progress', 'completed', 'abandoned'],
    required: true 
  }
}, { _id: false });

// AI分析结果Schema
const AIAnalysisSchema = new Schema({
  errorPattern: { type: String, required: true },
  suggestions: { type: [String], required: true },
  nextRecommendations: { type: [String], required: true }
}, { _id: false });

// 练习记录Schema
const PracticeRecordSchema = new Schema<IPracticeRecord>({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true
  },
  subjectId: { 
    type: String, 
    required: true,
    index: true
  },
  subjectName: { 
    type: String, 
    required: true 
  },
  practiceType: { 
    type: String, 
    required: true,
    enum: ['random', 'chapter', 'wrong_questions', 'ai_recommended'],
    index: true
  },
  session: { 
    type: PracticeSessionSchema, 
    required: true 
  },
  answers: [AnswerRecordSchema],
  weakKnowledgePoints: { 
    type: [String], 
    default: [] 
  },
  masteryLevel: { 
    type: Number, 
    default: 0, 
    min: 0, 
    max: 100 
  },
  aiAnalysis: AIAnalysisSchema,
  createTime: { 
    type: Date, 
    default: Date.now,
    index: true
  },
  updateTime: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 复合索引
PracticeRecordSchema.index({ userId: 1, subjectId: 1, createTime: -1 });
PracticeRecordSchema.index({ subjectId: 1, 'session.status': 1 });
PracticeRecordSchema.index({ userId: 1, practiceType: 1 });

// 中间件：更新updateTime字段
PracticeRecordSchema.pre('save', function(next) {
  this.updateTime = new Date();
  next();
});

// 虚拟字段：练习时长（分钟）
PracticeRecordSchema.virtual('durationMinutes').get(function() {
  return Math.round(this.session.totalTimeSpent / 60);
});

// 虚拟字段：错题数量
PracticeRecordSchema.virtual('wrongCount').get(function() {
  return this.session.totalQuestions - this.session.correctCount;
});

// 实例方法：添加答题记录
PracticeRecordSchema.methods.addAnswer = function(answerRecord: IAnswerRecord) {
  this.answers.push(answerRecord);
  this.session.completedQuestions = this.answers.length;
  this.session.correctCount = this.answers.filter(a => a.isCorrect).length;
  this.session.accuracy = (this.session.correctCount / this.session.completedQuestions) * 100;
  this.session.totalTimeSpent = this.answers.reduce((sum, a) => sum + a.timeSpent, 0);
  this.session.avgTimePerQuestion = this.session.totalTimeSpent / this.session.completedQuestions;
  
  return this.save();
};

// 实例方法：完成练习
PracticeRecordSchema.methods.completePractice = function() {
  this.session.status = 'completed';
  this.session.endTime = new Date();
  
  // 计算薄弱知识点
  const wrongAnswers = this.answers.filter(a => !a.isCorrect);
  const knowledgePointCounts: { [key: string]: number } = {};
  
  wrongAnswers.forEach(answer => {
    answer.knowledgePoints.forEach(point => {
      knowledgePointCounts[point] = (knowledgePointCounts[point] || 0) + 1;
    });
  });
  
  this.weakKnowledgePoints = Object.entries(knowledgePointCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([point]) => point);
  
  // 计算掌握程度
  this.masteryLevel = Math.max(0, this.session.accuracy - (wrongAnswers.length * 5));
  
  return this.save();
};

// 静态方法：获取用户练习统计
PracticeRecordSchema.statics.getUserStats = function(userId: string, subjectId?: string) {
  const match: any = { 
    userId: new mongoose.Types.ObjectId(userId),
    'session.status': 'completed'
  };
  
  if (subjectId) {
    match.subjectId = subjectId;
  }
  
  return this.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalPractices: { $sum: 1 },
        totalQuestions: { $sum: '$session.totalQuestions' },
        totalCorrect: { $sum: '$session.correctCount' },
        totalTimeSpent: { $sum: '$session.totalTimeSpent' },
        avgAccuracy: { $avg: '$session.accuracy' },
        avgMasteryLevel: { $avg: '$masteryLevel' }
      }
    }
  ]);
};

// 静态方法：获取学科练习统计
PracticeRecordSchema.statics.getSubjectStats = function(subjectId: string) {
  return this.aggregate([
    { 
      $match: { 
        subjectId,
        'session.status': 'completed'
      }
    },
    {
      $group: {
        _id: null,
        totalUsers: { $addToSet: '$userId' },
        totalPractices: { $sum: 1 },
        totalQuestions: { $sum: '$session.totalQuestions' },
        avgAccuracy: { $avg: '$session.accuracy' },
        avgTimePerQuestion: { $avg: '$session.avgTimePerQuestion' }
      }
    },
    {
      $project: {
        totalUsers: { $size: '$totalUsers' },
        totalPractices: 1,
        totalQuestions: 1,
        avgAccuracy: 1,
        avgTimePerQuestion: 1
      }
    }
  ]);
};

export const PracticeRecord = mongoose.models.PracticeRecord || 
  mongoose.model<IPracticeRecord>('PracticeRecord', PracticeRecordSchema);
