// 浙江财经大学Agent平台集成客户端

export interface AgentMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AgentResponse {
  success: boolean;
  data?: any;
  error?: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface ParsePaperRequest {
  documentUrl: string;
  documentType: 'pdf' | 'word' | 'image';
  examInfo: {
    name: string;
    date: string;
    subjectId: string;
    subjectName: string;
    level?: string;
    chapter?: string;
  };
}

export interface AnalyzeWrongQuestionsRequest {
  userId: string;
  wrongQuestions: any[];
  userProfile: any;
  subject: {
    subjectId: string;
    subjectName: string;
  };
}

export interface GenerateQuestionsRequest {
  baseQuestion: any;
  requirements: {
    subjectId: string;
    difficulty: number;
    count: number;
    knowledgePoints: string[];
  };
}

export class ZJCFAgentClient {
  private apiKey: string;
  private baseURL: string;
  private paperParseAgentId: string;
  private errorAnalysisAgentId: string;
  private questionGenerationAgentId: string;

  constructor() {
    this.apiKey = process.env.ZJCF_AGENT_API_KEY || '';
    this.baseURL = process.env.ZJCF_AGENT_API_URL || 'http://localhost:3000';
    this.paperParseAgentId = process.env.ZJCF_PAPER_PARSE_AGENT_ID || 'paper-parse-agent';
    this.errorAnalysisAgentId = process.env.ZJCF_ERROR_ANALYSIS_AGENT_ID || 'error-analysis-agent';
    this.questionGenerationAgentId = process.env.ZJCF_QUESTION_GENERATION_AGENT_ID || 'question-generation-agent';

    if (!this.apiKey) {
      console.warn('⚠️ ZJCF Agent API Key未配置，将使用模拟数据');
    }
  }

  // 通用Agent调用方法
  private async callAgent(
    agentId: string, 
    messages: AgentMessage[], 
    variables?: Record<string, any>
  ): Promise<AgentResponse> {
    try {
      if (!this.apiKey) {
        // 返回模拟数据
        return this.getMockResponse(agentId, messages, variables);
      }

      const response = await fetch(`${this.baseURL}/api/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatId: `chat_${Date.now()}`,
          stream: false,
          detail: false,
          variables: variables || {},
          messages: messages
        })
      });

      if (!response.ok) {
        throw new Error(`Agent API调用失败: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result,
        usage: result.usage
      };

    } catch (error) {
      console.error(`Agent ${agentId} 调用失败:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      };
    }
  }

  // 试卷解析Agent
  async parseDocument(request: ParsePaperRequest): Promise<AgentResponse> {
    const messages: AgentMessage[] = [
      {
        role: 'user',
        content: `请解析以下试卷文档：${request.documentUrl}`
      }
    ];

    const variables = {
      document_url: request.documentUrl,
      document_type: request.documentType,
      subject_id: request.examInfo.subjectId,
      subject_name: request.examInfo.subjectName,
      exam_name: request.examInfo.name,
      exam_date: request.examInfo.date,
      level: request.examInfo.level || '',
      chapter: request.examInfo.chapter || ''
    };

    return this.callAgent(this.paperParseAgentId, messages, variables);
  }

  // 错题分析Agent
  async analyzeWrongQuestions(request: AnalyzeWrongQuestionsRequest): Promise<AgentResponse> {
    const messages: AgentMessage[] = [
      {
        role: 'user',
        content: '请分析用户的错题情况并提供学习建议'
      }
    ];

    const variables = {
      user_id: request.userId,
      wrong_questions: JSON.stringify(request.wrongQuestions),
      user_profile: JSON.stringify(request.userProfile),
      subject_id: request.subject.subjectId,
      subject_name: request.subject.subjectName
    };

    return this.callAgent(this.errorAnalysisAgentId, messages, variables);
  }

  // 题目生成Agent
  async generateQuestions(request: GenerateQuestionsRequest): Promise<AgentResponse> {
    const messages: AgentMessage[] = [
      {
        role: 'user',
        content: '请基于用户错题生成相似的练习题目'
      }
    ];

    const variables = {
      base_question: JSON.stringify(request.baseQuestion),
      subject_id: request.requirements.subjectId,
      difficulty: request.requirements.difficulty,
      count: request.requirements.count,
      knowledge_points: JSON.stringify(request.requirements.knowledgePoints)
    };

    return this.callAgent(this.questionGenerationAgentId, messages, variables);
  }

  // 模拟数据响应（开发阶段使用）
  private getMockResponse(
    agentId: string, 
    messages: AgentMessage[], 
    variables?: Record<string, any>
  ): AgentResponse {
    console.log(`🤖 模拟Agent响应 - ${agentId}`);

    switch (agentId) {
      case this.paperParseAgentId:
        return {
          success: true,
          data: {
            questions: [
              {
                questionId: `Q${Date.now()}`,
                type: 'single_choice',
                subject: {
                  subjectId: variables?.subject_id || 'hsk',
                  subjectName: variables?.subject_name || 'HSK中文考试',
                  level: variables?.level || 'HSK4',
                  chapter: variables?.chapter || '第一章',
                  section: '1.1'
                },
                difficulty: 2,
                category: '词汇',
                knowledgePoints: ['词汇理解', '语境分析'],
                content: {
                  stem: '下列词语中，哪个最适合填入空白处？',
                  options: ['选项A', '选项B', '选项C', '选项D']
                },
                answer: {
                  correct: ['A'],
                  explanation: '这是模拟的答案解析',
                  keyPoints: ['关键知识点1', '关键知识点2']
                }
              }
            ],
            metadata: {
              examName: variables?.exam_name || '模拟考试',
              examDate: variables?.exam_date || new Date().toISOString(),
              subjectId: variables?.subject_id || 'hsk',
              subjectName: variables?.subject_name || 'HSK中文考试',
              totalQuestions: 1,
              analysisTime: new Date().toISOString()
            }
          }
        };

      case this.errorAnalysisAgentId:
        return {
          success: true,
          data: {
            analysis: {
              errorPattern: '用户在词汇理解方面存在困难',
              weaknessAreas: ['词汇理解', '语法应用'],
              knowledgeGaps: ['近义词辨析', '语境理解'],
              masteryLevel: 65,
              errorTypes: ['概念混淆', '理解偏差'],
              subjectSpecificIssues: '在HSK考试中，词汇量不足是主要问题'
            },
            suggestions: {
              studyPlan: '建议加强词汇练习，每天学习20个新词汇',
              practiceMethod: '通过语境练习加深理解',
              focusPoints: ['高频词汇', '近义词辨析'],
              difficultyAdjustment: '建议从简单题目开始，逐步提高难度',
              learningPath: ['基础词汇巩固', '语境理解训练', '综合应用练习'],
              timeAllocation: '建议每天练习30-45分钟'
            },
            generationHints: {
              similarQuestionTypes: ['single_choice', 'fill_blank'],
              knowledgePointsToFocus: ['词汇理解', '语境分析'],
              difficultyRange: [1, 3],
              questionCount: 5
            }
          }
        };

      case this.questionGenerationAgentId:
        return {
          success: true,
          data: {
            generatedQuestions: [
              {
                questionId: `GQ${Date.now()}`,
                type: 'single_choice',
                subject: {
                  subjectId: variables?.subject_id || 'hsk',
                  subjectName: 'HSK中文考试',
                  level: 'HSK4',
                  chapter: '第一章',
                  section: '1.1'
                },
                difficulty: parseInt(variables?.difficulty) || 2,
                category: '词汇',
                knowledgePoints: ['词汇理解', '语境分析'],
                content: {
                  stem: '根据语境，选择最合适的词语填空：',
                  options: ['生成选项A', '生成选项B', '生成选项C', '生成选项D']
                },
                answer: {
                  correct: ['B'],
                  explanation: 'AI生成的详细解析',
                  keyPoints: ['关键知识点1', '关键知识点2']
                },
                parentQuestionId: variables?.base_question ? JSON.parse(variables.base_question).questionId : null,
                generationReason: '基于用户错题生成的相似练习',
                aiGenerated: true
              }
            ],
            metadata: {
              generationTime: new Date().toISOString(),
              totalGenerated: parseInt(variables?.count) || 1,
              subjectId: variables?.subject_id || 'hsk',
              subjectName: 'HSK中文考试',
              targetKnowledgePoints: variables?.knowledge_points ? JSON.parse(variables.knowledge_points) : [],
              difficultyLevel: parseInt(variables?.difficulty) || 2
            }
          }
        };

      default:
        return {
          success: false,
          error: `未知的Agent ID: ${agentId}`
        };
    }
  }

  // 健康检查
  async healthCheck(): Promise<boolean> {
    try {
      if (!this.apiKey) {
        console.log('🤖 使用模拟模式，Agent服务健康');
        return true;
      }

      const response = await fetch(`${this.baseURL}/health`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
        timeout: 5000
      } as any);

      return response.ok;
    } catch (error) {
      console.error('Agent服务健康检查失败:', error);
      return false;
    }
  }
}

// 导出默认实例
export const zjcfAgentClient = new ZJCFAgentClient();
