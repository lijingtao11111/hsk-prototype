"use client";

import Link from 'next/link';
import { useEffect } from 'react';
import '../../styles/practice-result.css';

// 定义类型
interface Option {
  value: string;
  text: string;
}

interface WrongQuestion {
  stem: string;
  userAnswer: Option | Option[] | string[];
  correctAnswer: Option | Option[] | string[];
  knowledgePoints: string[];
  aiAnalysis: string;
}

interface AiSuggestion {
  title: string;
  description: string;
}

interface Resource {
  title: string;
  description: string;
  icon: string;
}

interface ResultData {
  score: number;
  examName: string;
  stats: {
    correctCount: string;
    accuracy: string;
    timeSpent: string;
    evaluation: string;
  };
  wrongQuestions: WrongQuestion[];
  aiSuggestions: AiSuggestion[];
  recommendedResources: Resource[];
}

export default function PracticeResultPage() {
  // 处理移动端底部导航激活状态
  useEffect(() => {
    const currentPath = window.location.pathname;
    
    document.querySelectorAll('.mobile-navbar-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPath) {
        link.classList.add('active');
      }
    });
  }, []);

  // 模拟结果数据
  const resultData: ResultData = {
    score: 85,
    examName: 'HSK四级 - 2023年6月真题卷',
    stats: {
      correctCount: '17/20',
      accuracy: '85%',
      timeSpent: '38分钟',
      evaluation: '优秀'
    },
    wrongQuestions: [
      {
        stem: '他已经把这本书<strong>看完了</strong>，现在正在看下一本。',
        userAnswer: { value: 'B', text: '用过' },
        correctAnswer: { value: 'A', text: '读过' },
        knowledgePoints: ['动词补语', '词语搭配'],
        aiAnalysis: '这道题测试的是动词与宾语的搭配关系。"看完"表示对书籍的阅读完成，应选择与"看"语义相近的"读过"。"用过"通常与工具类宾语搭配；"听过"与音频、声音类宾语搭配；"写过"表示创作行为，与"看完"语义方向不符。'
      },
      {
        stem: '下列哪些词语可以用来形容一个人很忙碌？（选择两个）',
        userAnswer: [
          { value: 'A', text: '手忙脚乱' },
          { value: 'B', text: '无忧无虑' }
        ],
        correctAnswer: [
          { value: 'A', text: '手忙脚乱' },
          { value: 'D', text: '争分夺秒' }
        ],
        knowledgePoints: ['成语理解', '词语辨析'],
        aiAnalysis: '"手忙脚乱"描述的是忙碌慌张的状态；"争分夺秒"表示珍惜时间、抓紧时间，这两个成语都可以用来形容一个人很忙。而"无忧无虑"表示没有忧愁和顾虑，形容轻松愉快的状态；"悠闲自在"表示自由、舒适，两者都与"忙碌"的含义相反。'
      },
      {
        stem: '请将下面的句子补充完整：<br/>我昨天在图书馆学习了 <u>三</u> 个小时，然后去 <u>食堂</u> 吃了晚饭。',
        userAnswer: ['三', '餐厅'],
        correctAnswer: ['三', '食堂'],
        knowledgePoints: ['词语选用', '场景词汇'],
        aiAnalysis: '"餐厅"和"食堂"都可以表示吃饭的场所，但在中国大学语境下，通常使用"食堂"指代学校内的就餐场所，而"餐厅"多指社会上的商业性场所。根据上下文是学校场景，应该选择"食堂"更为恰当。'
      }
    ],
    aiSuggestions: [
      { title: '词语搭配', description: '动词与宾语的正确搭配关系' },
      { title: '成语理解', description: '更准确地把握成语含义和使用场景' },
      { title: '场景词汇', description: '特定场合下的词语选择' }
    ],
    recommendedResources: [
      {
        title: 'HSK四级词语搭配专项练习',
        description: '50道精选题目，帮你掌握常见动词宾语搭配',
        icon: 'ri-book-open-line'
      },
      {
        title: 'HSK四级常用成语100例',
        description: 'HSK常考成语详解及练习',
        icon: 'ri-book-mark-line'
      }
    ]
  };

  // 检查答案是否为选项类型
  const isOption = (answer: any): answer is Option => {
    return answer && typeof answer === 'object' && 'value' in answer && 'text' in answer;
  };

  // 检查答案是否为选项数组类型
  const isOptionArray = (answer: any): answer is Option[] => {
    return Array.isArray(answer) && answer.length > 0 && 
      typeof answer[0] === 'object' && 'value' in answer[0] && 'text' in answer[0];
  };

  // 检查答案是否为字符串数组类型
  const isStringArray = (answer: any): answer is string[] => {
    return Array.isArray(answer) && answer.length > 0 && typeof answer[0] === 'string';
  };

  return (
    <>
      {/* 导航栏 */}
      <nav className="navbar">
        <div className="container navbar-container">
          <Link href="/home" className="navbar-brand">智能考试系统</Link>
          
          <ul className="navbar-menu">
            <li className="navbar-item"><Link href="/home" className="navbar-link">首页</Link></li>
            <li className="navbar-item"><Link href="/subjects" className="navbar-link">学科选择</Link></li>
            <li className="navbar-item"><Link href="/wrong-questions" className="navbar-link">错题本</Link></li>
            <li className="navbar-item"><Link href="/profile" className="navbar-link">个人中心</Link></li>
          </ul>
        </div>
      </nav>
      
      <div className="container" style={{padding: '2rem 0 5rem 0'}}>
        {/* 结果总览 */}
        <div className="result-card">
          <div className="result-header">
            <div className="score-circle">
              <div className="score-number">{resultData.score}</div>
              <div className="score-text">分</div>
            </div>
            
            <h1 style={{fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem'}}>练习完成！</h1>
            <p style={{color: 'var(--text-secondary)'}}>{resultData.examName}</p>
          </div>
          
          <div className="result-stats">
            <div className="stat-box">
              <div className="stat-value">{resultData.stats.correctCount}</div>
              <div className="stat-label">答对题目</div>
            </div>
            
            <div className="stat-box">
              <div className="stat-value">{resultData.stats.accuracy}</div>
              <div className="stat-label">正确率</div>
            </div>
            
            <div className="stat-box">
              <div className="stat-value">{resultData.stats.timeSpent}</div>
              <div className="stat-label">耗时</div>
            </div>
            
            <div className="stat-box">
              <div className="stat-value">{resultData.stats.evaluation}</div>
              <div className="stat-label">评价</div>
            </div>
          </div>
          
          <div className="result-action">
            <Link href="/practice?subject=hsk4&mode=review" className="btn btn-outline" style={{marginRight: '1rem'}}>
              <i className="ri-file-list-3-line" style={{marginRight: '0.5rem'}}></i>
              查看详情
            </Link>
            
            <Link href="/subject-detail?subject=hsk4" className="btn btn-primary">
              <i className="ri-arrow-go-back-line" style={{marginRight: '0.5rem'}}></i>
              返回学科
            </Link>
          </div>
        </div>
        
        {/* 错题分析 */}
        <div style={{marginTop: '2rem'}}>
          <h2 className="section-title">
            <i className="ri-error-warning-line"></i>
            <span>错题分析</span>
          </h2>
          
          <div className="result-card">
            {resultData.wrongQuestions.map((question, index) => (
              <div className="wrong-question" key={index}>
                <div className="question-stem" style={{marginBottom: '0.75rem'}} dangerouslySetInnerHTML={{ __html: question.stem }}></div>
                
                <div style={{marginBottom: '1rem'}}>
                  <div style={{color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem'}}>你的答案：</div>
                  {isStringArray(question.userAnswer) ? (
                    // 填空题答案展示
                    <p>
                      我昨天在图书馆学习了 <span style={{color: 'var(--primary)'}}>{question.userAnswer[0]}</span> 个小时，
                      然后去 <span style={{color: 'var(--danger)'}}>{question.userAnswer[1]}</span> 吃了晚饭。
                    </p>
                  ) : isOptionArray(question.userAnswer) ? (
                    // 多选题答案展示
                    question.userAnswer.map((option, optionIndex) => (
                      <div 
                        key={optionIndex}
                        className={`question-option ${
                          isOptionArray(question.correctAnswer) && 
                          question.correctAnswer.some(correct => correct.value === option.value) 
                            ? 'correct-option' 
                            : 'wrong-option'
                        }`} 
                        style={{marginBottom: '0.5rem'}}
                      >
                        <div className="question-option-letter">{option.value}</div>
                        <div>{option.text}</div>
                      </div>
                    ))
                  ) : isOption(question.userAnswer) ? (
                    // 单选题答案展示
                    <div className="question-option wrong-option" style={{marginBottom: '0.5rem'}}>
                      <div className="question-option-letter">{question.userAnswer.value}</div>
                      <div>{question.userAnswer.text}</div>
                    </div>
                  ) : null}
                  
                  <div style={{color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem'}}>正确答案：</div>
                  {isOptionArray(question.correctAnswer) ? (
                    // 多选题正确答案展示
                    question.correctAnswer.map((option, optionIndex) => (
                      <div 
                        key={optionIndex}
                        className="question-option correct-option" 
                        style={{marginBottom: optionIndex < (isOptionArray(question.correctAnswer) ? question.correctAnswer.length - 1 : 0) ? '0.5rem' : '0'}}
                      >
                        <div className="question-option-letter">{option.value}</div>
                        <div>{option.text}</div>
                      </div>
                    ))
                  ) : isStringArray(question.correctAnswer) ? (
                    // 填空题正确答案展示
                    <p>
                      我昨天在图书馆学习了 <span style={{color: 'var(--primary)'}}>{question.correctAnswer[0]}</span> 个小时，
                      然后去 <span style={{color: 'var(--primary)'}}>{question.correctAnswer[1]}</span> 吃了晚饭。
                    </p>
                  ) : isOption(question.correctAnswer) ? (
                    // 单选题正确答案展示
                    <div className="question-option correct-option">
                      <div className="question-option-letter">{question.correctAnswer.value}</div>
                      <div>{question.correctAnswer.text}</div>
                    </div>
                  ) : null}
                </div>
                
                <div style={{marginBottom: '1rem'}}>
                  <div style={{color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem'}}>知识点：</div>
                  <div>
                    {question.knowledgePoints.map((point, pointIndex) => (
                      <span className="knowledge-tag" key={pointIndex}>{point}</span>
                    ))}
                  </div>
                </div>
                
                <div className="ai-analysis">
                  <div className="ai-badge">
                    <i className="ri-robot-line"></i>
                    <span>AI分析</span>
                  </div>
                  
                  <p>{question.aiAnalysis}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* AI学习推荐 */}
        <div style={{marginTop: '2rem'}}>
          <h2 className="section-title">
            <i className="ri-robot-line"></i>
            <span>AI学习建议</span>
          </h2>
          
          <div className="result-card">
            <div style={{marginBottom: '2rem'}}>
              <p style={{marginBottom: '1rem'}}>
                根据你的练习情况，AI分析出你可能在以下知识点方面需要加强：
              </p>
              
              <ul style={{listStyle: 'none', padding: 0}}>
                {resultData.aiSuggestions.map((suggestion, index) => (
                  <li style={{display: 'flex', alignItems: 'center', marginBottom: '1rem'}} key={index}>
                    <i className="ri-checkbox-circle-line" style={{color: 'var(--primary)', marginRight: '0.5rem'}}></i>
                    <span><strong>{suggestion.title}</strong>：{suggestion.description}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <h3 style={{fontWeight: 600, marginBottom: '1rem'}}>推荐学习资源</h3>
            
            <div className="row" style={{marginBottom: '1.5rem'}}>
              {resultData.recommendedResources.map((resource, index) => (
                <div className="col" key={index}>
                  <a href="#" className="practice-card">
                    <div className="practice-card-inner">
                      <div className="practice-icon">
                        <i className={resource.icon}></i>
                      </div>
                      
                      <div className="practice-content">
                        <h3 style={{fontWeight: 600, marginBottom: '0.25rem'}}>{resource.title}</h3>
                        <p style={{color: 'var(--text-secondary)', fontSize: '0.875rem'}}>
                          {resource.description}
                        </p>
                      </div>
                      
                      <i className="ri-arrow-right-s-line" style={{color: 'var(--text-secondary)', fontSize: '1.5rem', marginLeft: '1rem'}}></i>
                    </div>
                  </a>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <Link href="/practice?subject=hsk4&mode=recommend" className="btn btn-primary">
                开始针对性练习
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* 移动端底部导航 */}
      <nav className="mobile-navbar">
        <ul className="mobile-navbar-menu">
          <li className="mobile-navbar-item">
            <Link href="/home" className="mobile-navbar-link">
              <i className="ri-home-5-line mobile-navbar-icon"></i>
              <span>首页</span>
            </Link>
          </li>
          <li className="mobile-navbar-item">
            <Link href="/subjects" className="mobile-navbar-link">
              <i className="ri-book-open-line mobile-navbar-icon"></i>
              <span>学科</span>
            </Link>
          </li>
          <li className="mobile-navbar-item">
            <Link href="/wrong-questions" className="mobile-navbar-link">
              <i className="ri-error-warning-line mobile-navbar-icon"></i>
              <span>错题本</span>
            </Link>
          </li>
          <li className="mobile-navbar-item">
            <Link href="/profile" className="mobile-navbar-link">
              <i className="ri-user-line mobile-navbar-icon"></i>
              <span>我的</span>
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
} 