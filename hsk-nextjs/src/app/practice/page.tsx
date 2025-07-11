"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import '../../styles/practice.css';

export default function PracticePage() {
  const searchParams = useSearchParams();
  const subject = searchParams.get('subject') || 'hsk4';
  const mode = searchParams.get('mode') || 'quick';
  
  // 状态
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(string | string[] | null)[]>(Array(10).fill(null));
  const [timeLeft, setTimeLeft] = useState(3600); // 60分钟
  
  // 模拟题目数据
  const questions = [
    {
      id: 1,
      type: 'single_choice',
      stem: '他已经把这本书<strong>看完了</strong>，现在正在看下一本。',
      options: [
        { value: 'A', text: '读过' },
        { value: 'B', text: '用过' },
        { value: 'C', text: '听过' },
        { value: 'D', text: '写过' }
      ]
    },
    {
      id: 2,
      type: 'single_choice',
      stem: '这个问题很<strong>复杂</strong>，我们需要更多时间来解决。',
      options: [
        { value: 'A', text: '简单' },
        { value: 'B', text: '困难' },
        { value: 'C', text: '清楚' },
        { value: 'D', text: '明白' }
      ]
    },
    {
      id: 3,
      type: 'multiple_choice',
      stem: '下列哪些词语可以用来形容一个人很忙碌？（选择两个）',
      options: [
        { value: 'A', text: '手忙脚乱' },
        { value: 'B', text: '无忧无虑' },
        { value: 'C', text: '悠闲自在' },
        { value: 'D', text: '争分夺秒' }
      ]
    },
    {
      id: 4,
      type: 'single_choice',
      stem: '他<strong>突然</strong>想起来今天是朋友的生日。',
      options: [
        { value: 'A', text: '慢慢地' },
        { value: 'B', text: '一下子' },
        { value: 'C', text: '经常' },
        { value: 'D', text: '总是' }
      ]
    },
    {
      id: 5,
      type: 'fill_blank',
      stem: '请将下面的句子补充完整：<br>春节是中国最重要的________，家人团聚在一起吃________，看春晚。',
      blanks: 2
    },
    {
      id: 6,
      type: 'single_choice',
      stem: '这种茶很<strong>香</strong>，你可以尝尝。',
      options: [
        { value: 'A', text: '苦' },
        { value: 'B', text: '甜' },
        { value: 'C', text: '有味道' },
        { value: 'D', text: '没味道' }
      ]
    },
    {
      id: 7,
      type: 'single_choice',
      stem: '这个城市的交通很<strong>便利</strong>，到处都可以坐公交车。',
      options: [
        { value: 'A', text: '方便' },
        { value: 'B', text: '拥挤' },
        { value: 'C', text: '复杂' },
        { value: 'D', text: '危险' }
      ]
    },
    {
      id: 8,
      type: 'multiple_choice',
      stem: '下列哪些词语可以用来形容天气很热？（选择两个）',
      options: [
        { value: 'A', text: '寒冷' },
        { value: 'B', text: '炎热' },
        { value: 'C', text: '酷暑' },
        { value: 'D', text: '凉爽' }
      ]
    },
    {
      id: 9,
      type: 'fill_blank',
      stem: '请将下面的句子补充完整：<br>学习汉语需要多________，多________，这样才能提高得快。',
      blanks: 2
    },
    {
      id: 10,
      type: 'single_choice',
      stem: '他<strong>认真</strong>地完成了所有作业。',
      options: [
        { value: 'A', text: '仔细' },
        { value: 'B', text: '随便' },
        { value: 'C', text: '马虎' },
        { value: 'D', text: '粗心' }
      ]
    }
  ];
  
  // 计时器
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitAnswers();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // 格式化时间
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // 处理选项点击
  const handleOptionClick = (questionIndex: number, optionValue: string) => {
    const question = questions[questionIndex];
    
    if (question.type === 'single_choice') {
      // 单选题逻辑
      setUserAnswers(prev => {
        const newAnswers = [...prev];
        newAnswers[questionIndex] = optionValue;
        return newAnswers;
      });
    } else if (question.type === 'multiple_choice') {
      // 多选题逻辑
      setUserAnswers(prev => {
        const newAnswers = [...prev];
        const currentAnswer = newAnswers[questionIndex] as string[] || [];
        
        if (Array.isArray(currentAnswer)) {
          if (currentAnswer.includes(optionValue)) {
            newAnswers[questionIndex] = currentAnswer.filter(v => v !== optionValue);
          } else {
            newAnswers[questionIndex] = [...currentAnswer, optionValue];
          }
        } else {
          newAnswers[questionIndex] = [optionValue];
        }
        
        return newAnswers;
      });
    }
  };
  
  // 处理填空题输入
  const handleBlankInput = (questionIndex: number, blankIndex: number, value: string) => {
    setUserAnswers(prev => {
      const newAnswers = [...prev];
      const currentAnswer = newAnswers[questionIndex] as string[] || [];
      
      if (Array.isArray(currentAnswer)) {
        const newBlankAnswers = [...currentAnswer];
        newBlankAnswers[blankIndex] = value;
        newAnswers[questionIndex] = newBlankAnswers;
      } else {
        const newBlankAnswers = Array(questions[questionIndex].blanks).fill('');
        newBlankAnswers[blankIndex] = value;
        newAnswers[questionIndex] = newBlankAnswers;
      }
      
      return newAnswers;
    });
  };
  
  // 处理题目导航点击
  const handleNavClick = (index: number) => {
    setCurrentQuestionIndex(index);
  };
  
  // 处理上一题按钮点击
  const handlePrevClick = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  // 处理下一题按钮点击
  const handleNextClick = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmitAnswers();
    }
  };
  
  // 处理提交答案
  const handleSubmitAnswers = () => {
    const completedCount = userAnswers.filter(answer => answer !== null).length;
    alert(`练习完成！\n您完成了 ${completedCount} 道题目，即将跳转到结果页面。`);
    window.location.href = '/practice-result';
  };
  
  // 计算进度
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  
  // 获取当前问题的类型文本
  const getQuestionTypeText = (type: string) => {
    switch (type) {
      case 'single_choice': return '单选题';
      case 'multiple_choice': return '多选题';
      case 'fill_blank': return '填空题';
      default: return '题目';
    }
  };
  
  // 检查选项是否被选中
  const isOptionSelected = (questionIndex: number, optionValue: string) => {
    const answer = userAnswers[questionIndex];
    
    if (Array.isArray(answer)) {
      return answer.includes(optionValue);
    }
    
    return answer === optionValue;
  };
  
  // 获取填空题答案
  const getBlankAnswer = (questionIndex: number, blankIndex: number) => {
    const answer = userAnswers[questionIndex];
    
    if (Array.isArray(answer) && answer[blankIndex]) {
      return answer[blankIndex];
    }
    
    return '';
  };
  
  // 获取模式名称
  const getModeTitle = () => {
    switch (mode) {
      case 'real_exam': return '真题练习';
      case 'knowledge': return '知识点练习';
      case 'mock_exam': return '模拟考试';
      case 'ai_recommend': return 'AI智能推荐';
      case 'weakness': return '薄弱环节练习';
      case 'quick': return '快速练习';
      default: return '练习';
    }
  };
  
  return (
    <>
      {/* 练习头部 */}
      <header className="practice-header">
        <div className="container">
          <div className="practice-header-content">
            <div>
              <h1 className="practice-title">HSK四级{getModeTitle()}</h1>
              <p className="practice-subtitle">2023年6月真题卷 - 共{questions.length}题</p>
            </div>
            
            <div className="timer-container" id="exam-timer">
              <i className="ri-time-line"></i>
              <span>{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>
      </header>
      
      <div className="container practice-content">
        {/* 题目导航 */}
        <div className="question-navigation" id="question-navigation">
          {questions.map((question, index) => (
            <div 
              key={question.id}
              className={`question-nav-item ${index === currentQuestionIndex ? 'active' : ''} ${userAnswers[index] ? 'answered' : ''}`}
              onClick={() => handleNavClick(index)}
            >
              {index + 1}
            </div>
          ))}
        </div>
        
        {/* 题目容器 */}
        <form id="submit-exam-form">
          {questions.map((question, index) => (
            <div 
              key={question.id}
              className="question-card fade-in"
              id={`question-${question.id}`}
              data-type={question.type}
              style={{display: index === currentQuestionIndex ? 'block' : 'none'}}
            >
              <div className="question-header">
                <div className="question-type">{getQuestionTypeText(question.type)}</div>
                <div className="question-number">第 {index + 1} 题 / 共 {questions.length} 题</div>
              </div>
              
              <div className="question-stem" dangerouslySetInnerHTML={{ __html: question.stem }}></div>
              
              {question.type === 'fill_blank' ? (
                <div style={{marginTop: 'var(--spacing-4)'}}>
                  {Array.from({ length: question.blanks }).map((_, blankIndex) => (
                    <input
                      key={blankIndex}
                      type="text"
                      className="fill-blank-input"
                      placeholder={`请输入第${blankIndex + 1}个空的答案`}
                      value={getBlankAnswer(index, blankIndex)}
                      onChange={(e) => handleBlankInput(index, blankIndex, e.target.value)}
                    />
                  ))}
                </div>
              ) : (
                <ul className="question-options">
                  {question.options?.map((option) => (
                    <li
                      key={option.value}
                      className={`question-option ${isOptionSelected(index, option.value) ? 'selected' : ''}`}
                      data-value={option.value}
                      onClick={() => handleOptionClick(index, option.value)}
                    >
                      <div className="question-option-letter">{option.value}</div>
                      <div>{option.text}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </form>
      </div>
      
      {/* 练习底部 */}
      <footer className="practice-footer">
        <div className="container">
          <div className="practice-footer-content">
            <div className="practice-progress">
              <div className="progress-container" style={{width: '120px'}}>
                <div className="progress-bar" id="progress-bar" style={{width: `${progress}%`}}></div>
              </div>
              <span id="progress-text">{currentQuestionIndex + 1}/{questions.length} 题</span>
            </div>
            
            <div className="practice-actions">
              <button 
                className="nav-button outline" 
                id="prev-button" 
                disabled={currentQuestionIndex === 0}
                onClick={handlePrevClick}
              >
                <i className="ri-arrow-left-line"></i>
                上一题
              </button>
              <button 
                className="nav-button primary" 
                id="next-button"
                onClick={handleNextClick}
              >
                {currentQuestionIndex === questions.length - 1 ? '提交' : (
                  <>
                    下一题
                    <i className="ri-arrow-right-line"></i>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
} 