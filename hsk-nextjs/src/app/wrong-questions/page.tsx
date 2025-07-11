"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import '../../styles/wrong-questions.css';
import Navbar from '../../components/Navbar';
import PageInitializer from '../../components/PageInitializer';

export default function WrongQuestionsPage() {
  const [activeFilter, setActiveFilter] = useState('全部错题');
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    // 添加关键CSS变量确保尺寸一致
    document.documentElement.style.setProperty('--card-base-size', '320px');
    document.documentElement.style.setProperty('--container-width', '1280px');
    
    // 强制应用内联样式，确保关键元素尺寸一致
    const applyForcedStyles = () => {
      // 确保卡片尺寸一致
      document.querySelectorAll('.question-card').forEach((card: any) => {
        card.style.width = '100%';
        card.style.boxSizing = 'border-box';
        card.style.margin = '0 0 1.5rem 0';
      });

      // 确保列布局一致
      const columns = document.querySelectorAll('.col');
      columns.forEach((col: any) => {
        if (col.classList.contains('wrong-questions-col')) {
          col.style.width = '60%';
        } else if (col.classList.contains('ai-analysis-col')) {
          col.style.width = '40%';
        }
      });

      // 确保AI分析卡片样式一致
      const aiCard = document.querySelector('.ai-insight-card');
      if (aiCard) {
        (aiCard as HTMLElement).style.backgroundColor = '#f0f4ff';
        (aiCard as HTMLElement).style.borderRadius = '0.5rem';
        (aiCard as HTMLElement).style.border = '1px solid rgba(79, 70, 229, 0.2)';
        (aiCard as HTMLElement).style.padding = '1.5rem';
      }
    };

    // 延迟设置mounted状态，确保样式加载
    setTimeout(() => {
      setMounted(true);
      // 在内容显示后应用强制样式
      setTimeout(applyForcedStyles, 0);
    }, 10);

    // 添加resize监听器，确保响应式布局一致
    window.addEventListener('resize', applyForcedStyles);
    return () => window.removeEventListener('resize', applyForcedStyles);
  }, []);

  // 如果组件还没挂载完成，显示占位内容但保持完整结构
  if (!mounted) {
    return (
      <div className="wrong-questions-container" style={{ visibility: 'hidden' }}>
        <PageInitializer cssPath="/wrong-questions.css" />
        <Navbar />
        <section className="error-header">
          <div className="error-pattern"></div>
          <div className="container error-content"></div>
        </section>
        <div className="container">
          <div className="filter-tabs"></div>
          <div className="row">
            <div className="col wrong-questions-col"></div>
            <div className="col ai-analysis-col"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wrong-questions-container">
      {/* 确保页面样式正确加载 */}
      <PageInitializer cssPath="/wrong-questions.css" />
      
      {/* 使用共享导航栏组件 */}
      <Navbar />
      
      {/* 错题本头部 */}
      <section className="error-header">
        <div className="error-pattern"></div>
        
        <div className="container error-content">
          <h1 className="error-title">错题本</h1>
          <p className="error-subtitle">AI智能分析你的错题，提供针对性练习</p>
          
          <div className="error-stats">
            <div className="error-stat-card">
              <div className="error-stat-label">总错题数</div>
              <div className="error-stat-value">32</div>
            </div>
            
            <div className="error-stat-card">
              <div className="error-stat-label">已掌握</div>
              <div className="error-stat-value">18</div>
            </div>
            
            <div className="error-stat-card">
              <div className="error-stat-label">学科数</div>
              <div className="error-stat-value">3</div>
            </div>
          </div>
        </div>
      </section>
      
      <div className="container" style={{padding: '2rem 0 5rem 0'}}>
        {/* 过滤栏 */}
        <div className="filter-tabs">
          <div 
            className={`filter-tab ${activeFilter === '全部错题' ? 'active' : ''}`}
            onClick={() => setActiveFilter('全部错题')}
          >
            全部错题
          </div>
          <div 
            className={`filter-tab ${activeFilter === 'HSK四级' ? 'active' : ''}`}
            onClick={() => setActiveFilter('HSK四级')}
          >
            HSK四级 <span className="error-count">21</span>
          </div>
          <div 
            className={`filter-tab ${activeFilter === 'HSK五级' ? 'active' : ''}`}
            onClick={() => setActiveFilter('HSK五级')}
          >
            HSK五级 <span className="error-count">8</span>
          </div>
          <div 
            className={`filter-tab ${activeFilter === '大学英语四级' ? 'active' : ''}`}
            onClick={() => setActiveFilter('大学英语四级')}
          >
            大学英语四级 <span className="error-count">3</span>
          </div>
        </div>
        
        <div className="row">
          {/* 错题列表 */}
          <div className="col wrong-questions-col">
            <div className="wrong-question-list">
              {/* 错题1 */}
              <div className="question-card">
                <div className="question-header">
                  <div className="question-type">单选题</div>
                  <div>HSK四级</div>
                </div>
                
                <div className="question-stem">
                  他已经把这本书<strong>看完了</strong>，现在正在看下一本。
                </div>
                
                <div style={{marginBottom: '1rem'}}>
                  <div className="answer-label">你的答案：</div>
                  <div className="question-option wrong-option">
                    <div className="question-option-letter">B</div>
                    <div>用过</div>
                  </div>
                  
                  <div className="answer-label">正确答案：</div>
                  <div className="question-option correct-option">
                    <div className="question-option-letter">A</div>
                    <div>读过</div>
                  </div>
                </div>
                
                <div className="tag-list">
                  <span className="knowledge-tag">动词补语</span>
                  <span className="knowledge-tag">词语搭配</span>
                </div>
                
                <div className="question-footer">
                  <div className="question-meta">
                    错误次数: 2 次 · 最近错误: 2023-06-15
                  </div>
                  
                  <div className="question-actions">
                    <button className="btn btn-outline btn-sm">
                      <i className="ri-error-warning-line" style={{marginRight: '0.25rem'}}></i>
                      查看分析
                    </button>
                    <button className="btn btn-primary btn-sm" style={{marginLeft: '0.5rem'}}>
                      <i className="ri-check-line" style={{marginRight: '0.25rem'}}></i>
                      已掌握
                    </button>
                  </div>
                </div>
              </div>
              
              {/* 错题2 */}
              <div className="question-card">
                <div className="question-header">
                  <div className="question-type">多选题</div>
                  <div>HSK四级</div>
                </div>
                
                <div className="question-stem">
                  下列哪些词语可以用来形容一个人很忙碌？（选择两个）
                </div>
                
                <div style={{marginBottom: '1rem'}}>
                  <div className="answer-label">你的答案：</div>
                  <div className="question-option correct-option">
                    <div className="question-option-letter">A</div>
                    <div>手忙脚乱</div>
                  </div>
                  <div className="question-option wrong-option">
                    <div className="question-option-letter">B</div>
                    <div>无忧无虑</div>
                  </div>
                  
                  <div className="answer-label">正确答案：</div>
                  <div className="question-option correct-option">
                    <div className="question-option-letter">A</div>
                    <div>手忙脚乱</div>
                  </div>
                  <div className="question-option correct-option">
                    <div className="question-option-letter">D</div>
                    <div>争分夺秒</div>
                  </div>
                </div>
                
                <div className="tag-list">
                  <span className="knowledge-tag">成语理解</span>
                  <span className="knowledge-tag">词语辨析</span>
                </div>
                
                <div className="question-footer">
                  <div className="question-meta">
                    错误次数: 1 次 · 最近错误: 2023-06-18
                  </div>
                  
                  <div className="question-actions">
                    <button className="btn btn-outline btn-sm">
                      <i className="ri-error-warning-line" style={{marginRight: '0.25rem'}}></i>
                      查看分析
                    </button>
                    <button className="btn btn-primary btn-sm" style={{marginLeft: '0.5rem'}}>
                      <i className="ri-check-line" style={{marginRight: '0.25rem'}}></i>
                      已掌握
                    </button>
                  </div>
                </div>
              </div>
              
              {/* 错题3 */}
              <div className="question-card">
                <div className="question-header">
                  <div className="question-type">填空题</div>
                  <div>HSK四级</div>
                </div>
                
                <div className="question-stem">
                  请将下面的句子补充完整：<br/>
                  我昨天在图书馆学习了 <u>三</u> 个小时，然后去 <u>食堂</u> 吃了晚饭。
                </div>
                
                <div style={{marginBottom: '1rem'}}>
                  <div className="answer-label">你的答案：</div>
                  <p>我昨天在图书馆学习了 <span className="correct-text">三</span> 个小时，然后去 <span className="wrong-text">餐厅</span> 吃了晚饭。</p>
                  
                  <div className="answer-label">正确答案：</div>
                  <p>我昨天在图书馆学习了 <span className="correct-text">三</span> 个小时，然后去 <span className="correct-text">食堂</span> 吃了晚饭。</p>
                </div>
                
                <div className="tag-list">
                  <span className="knowledge-tag">词语选用</span>
                  <span className="knowledge-tag">场景词汇</span>
                </div>
                
                <div className="question-footer">
                  <div className="question-meta">
                    错误次数: 1 次 · 最近错误: 2023-06-20
                  </div>
                  
                  <div className="question-actions">
                    <button className="btn btn-outline btn-sm">
                      <i className="ri-error-warning-line" style={{marginRight: '0.25rem'}}></i>
                      查看分析
                    </button>
                    <button className="btn btn-primary btn-sm" style={{marginLeft: '0.5rem'}}>
                      <i className="ri-check-line" style={{marginRight: '0.25rem'}}></i>
                      已掌握
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 分页 */}
            <div className="pagination">
              <button className="pagination-btn">
                <i className="ri-arrow-left-s-line"></i>
              </button>
              
              <span className="pagination-info">第 1 页 / 共 2 页</span>
              
              <button className="pagination-btn">
                <i className="ri-arrow-right-s-line"></i>
              </button>
            </div>
          </div>
          
          {/* AI分析 */}
          <div className="col ai-analysis-col">
            <div className="ai-insight-card">
              <div className="ai-header">
                <div className="ai-icon">
                  <i className="ri-robot-line"></i>
                </div>
                
                <div>
                  <h2 className="ai-title">AI智能分析</h2>
                  <p className="ai-subtitle">
                    基于你的错题模式进行智能分析
                  </p>
                </div>
              </div>
              
              <div className="ai-section">
                <h3 className="ai-section-title">知识点掌握情况</h3>
                
                <div className="mastery-item">
                  <div className="mastery-header">
                    <span>动词补语</span>
                    <span className="mastery-level needs-work">需要加强</span>
                  </div>
                  <div className="mastery-progress">
                    <div className="mastery-bar mastery-needs-work"></div>
                  </div>
                </div>
                
                <div className="mastery-item">
                  <div className="mastery-header">
                    <span>成语理解</span>
                    <span className="mastery-level moderate">一般</span>
                  </div>
                  <div className="mastery-progress">
                    <div className="mastery-bar mastery-moderate"></div>
                  </div>
                </div>
                
                <div className="mastery-item">
                  <div className="mastery-header">
                    <span>词语选用</span>
                    <span className="mastery-level good">良好</span>
                  </div>
                  <div className="mastery-progress">
                    <div className="mastery-bar mastery-good"></div>
                  </div>
                </div>
                
                <div className="mastery-item">
                  <div className="mastery-header">
                    <span>语法结构</span>
                    <span className="mastery-level excellent">优秀</span>
                  </div>
                  <div className="mastery-progress">
                    <div className="mastery-bar mastery-excellent"></div>
                  </div>
                </div>
              </div>
              
              <div className="ai-section">
                <h3 className="ai-section-title">错误模式</h3>
                
                <p className="ai-text">
                  你的错题主要集中在词语搭配和成语理解方面，尤其是对于动词与宾语的正确搭配以及成语的具体含义理解不够深入。
                </p>
                
                <div className="ai-suggestion">
                  <p className="ai-suggestion-title">建议：</p>
                  <ul className="ai-suggestion-list">
                    <li>加强动词与不同类型宾语的搭配练习</li>
                    <li>系统性学习HSK四级常用成语的具体含义和使用场景</li>
                    <li>注意具体语境中的词语选择，特别是相近词语的辨析</li>
                  </ul>
                </div>
              </div>
              
              <div className="ai-section">
                <h3 className="ai-section-title">个性化学习计划</h3>
                
                <div className="study-plan">
                  <div className="plan-step">
                    <div className="step-number">1</div>
                    <div className="step-content">
                      <h4 className="step-title">动词补语专项练习</h4>
                      <p className="step-description">
                        完成30道动词与宾语搭配练习题
                      </p>
                    </div>
                  </div>
                  
                  <div className="plan-step">
                    <div className="step-number">2</div>
                    <div className="step-content">
                      <h4 className="step-title">成语辨析训练</h4>
                      <p className="step-description">
                        学习HSK四级常见成语的具体含义和使用场景
                      </p>
                    </div>
                  </div>
                  
                  <div className="plan-step">
                    <div className="step-number">3</div>
                    <div className="step-content">
                      <h4 className="step-title">场景词汇练习</h4>
                      <p className="step-description">
                        针对特定场景下的词语选择进行训练
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="ai-action">
                  <Link href="/practice?mode=ai_recommend" className="btn btn-primary btn-ai-practice">
                    <i className="ri-robot-line" style={{marginRight: '0.5rem'}}></i>
                    开始AI推荐练习
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 移动端底部导航 */}
      <nav className="mobile-navbar">
        <ul className="mobile-navbar-menu">
          <li className="mobile-navbar-item">
            <Link href="/home" className="mobile-navbar-link">
              <i className="ri-home-4-line mobile-navbar-icon"></i>
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
            <Link href="/wrong-questions" className="mobile-navbar-link active">
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
    </div>
  );
} 