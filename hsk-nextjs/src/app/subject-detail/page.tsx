"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import '../../styles/subject-detail.css';
import Navbar from '../../components/Navbar';
import PageInitializer from '../../components/PageInitializer';

export default function SubjectDetailPage() {
  const searchParams = useSearchParams();
  const subjectId = searchParams.get('subject') || 'hsk4';
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 模拟学科数据 - 根据subjectId获取对应数据
  const subjectData = getSubjectData(subjectId);

  if (!mounted) {
    return null; // 避免客户端和服务端渲染不匹配导致的闪烁
  }

  return (
    <div className="subject-detail-container">
      {/* 确保页面样式正确加载 */}
      <PageInitializer cssPath="/_next/static/css/subject-detail.css" />
      
      {/* 使用共享导航栏组件 */}
      <Navbar />
      
      {/* 学科英雄区 */}
      <section className="hero-section">
        <div className="hero-pattern"></div>
        
        <div className="container hero-content">
          <div className="subject-info">
            <div className="subject-icon-large">
              <i className={subjectData.icon}></i>
            </div>
            
            <div>
              <h1 style={{fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem'}}>{subjectData.title}</h1>
              <p style={{opacity: 0.9, fontSize: '1.125rem'}}>{subjectData.description}</p>
            </div>
          </div>
          
          <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
            <Link href={`/practice?subject=${subjectId}&mode=quick`} className="btn btn-primary" style={{display: 'inline-flex', alignItems: 'center'}}>
              <i className="ri-rocket-line" style={{marginRight: '0.5rem'}}></i>
              快速练习
            </Link>
            
            <a href="#practice-modes" className="btn btn-outline" style={{background: 'rgba(255, 255, 255, 0.2)', color: 'white', borderColor: 'rgba(255, 255, 255, 0.3)', display: 'inline-flex', alignItems: 'center'}}>
              <i className="ri-list-check" style={{marginRight: '0.5rem'}}></i>
              浏览练习模式
            </a>
          </div>
        </div>
      </section>
      
      {/* 学科统计 */}
      <section className="container" style={{paddingTop: '2rem'}}>
        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-number">{subjectData.stats.masteryRate}</div>
            <div style={{color: 'var(--text-secondary)'}}>知识点掌握率</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-number">{subjectData.stats.questionCount}</div>
            <div style={{color: 'var(--text-secondary)'}}>题目数量</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-number">{subjectData.stats.practiceCount}</div>
            <div style={{color: 'var(--text-secondary)'}}>已练习次数</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-number">{subjectData.stats.accuracy}</div>
            <div style={{color: 'var(--text-secondary)'}}>平均正确率</div>
          </div>
        </div>
        
        <div className="section-divider"></div>
        
        {/* 练习模式 */}
        <div id="practice-modes">
          <h2 className="section-title">
            <i className="ri-book-mark-line"></i>
            <span>练习模式</span>
          </h2>
          
          <div className="row" style={{marginBottom: '2rem'}}>
            <div className="col">
              <Link href={`/practice?subject=${subjectId}&mode=real_exam`} className="practice-card">
                <div className="practice-card-inner">
                  <div className="practice-icon">
                    <i className="ri-file-list-3-line"></i>
                  </div>
                  
                  <div className="practice-content">
                    <h3 style={{fontWeight: 600, marginBottom: '0.25rem'}}>真题练习</h3>
                    <p style={{color: 'var(--text-secondary)', fontSize: '0.875rem'}}>
                      历年{subjectData.title}真题，模拟考试环境
                    </p>
                  </div>
                  
                  <i className="ri-arrow-right-s-line" style={{color: 'var(--text-secondary)', fontSize: '1.5rem', marginLeft: '1rem'}}></i>
                </div>
              </Link>
            </div>
            
            <div className="col">
              <Link href={`/practice?subject=${subjectId}&mode=knowledge`} className="practice-card">
                <div className="practice-card-inner">
                  <div className="practice-icon">
                    <i className="ri-mental-health-line"></i>
                  </div>
                  
                  <div className="practice-content">
                    <h3 style={{fontWeight: 600, marginBottom: '0.25rem'}}>知识点练习</h3>
                    <p style={{color: 'var(--text-secondary)', fontSize: '0.875rem'}}>
                      按照知识点分类进行练习
                    </p>
                  </div>
                  
                  <i className="ri-arrow-right-s-line" style={{color: 'var(--text-secondary)', fontSize: '1.5rem', marginLeft: '1rem'}}></i>
                </div>
              </Link>
            </div>
          </div>
          
          <div className="row" style={{marginBottom: '2rem'}}>
            <div className="col">
              <Link href={`/practice?subject=${subjectId}&mode=mock_exam`} className="practice-card">
                <div className="practice-card-inner">
                  <div className="practice-icon">
                    <i className="ri-timer-line"></i>
                  </div>
                  
                  <div className="practice-content">
                    <h3 style={{fontWeight: 600, marginBottom: '0.25rem'}}>模拟考试</h3>
                    <p style={{color: 'var(--text-secondary)', fontSize: '0.875rem'}}>
                      完整模拟{subjectData.title}考试流程，限时作答
                    </p>
                  </div>
                  
                  <i className="ri-arrow-right-s-line" style={{color: 'var(--text-secondary)', fontSize: '1.5rem', marginLeft: '1rem'}}></i>
                </div>
              </Link>
            </div>
            
            <div className="col">
              <Link href={`/practice?subject=${subjectId}&mode=ai_recommend`} className="practice-card">
                <div className="practice-card-inner">
                  <div className="practice-icon">
                    <i className="ri-robot-line"></i>
                  </div>
                  
                  <div className="practice-content">
                    <h3 style={{fontWeight: 600, marginBottom: '0.25rem'}}>AI智能推荐</h3>
                    <p style={{color: 'var(--text-secondary)', fontSize: '0.875rem'}}>
                      基于你的薄弱环节，AI智能推荐练习题
                    </p>
                  </div>
                  
                  <i className="ri-arrow-right-s-line" style={{color: 'var(--text-secondary)', fontSize: '1.5rem', marginLeft: '1rem'}}></i>
                </div>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="section-divider"></div>
        
        {/* 薄弱知识点 */}
        <div>
          <h2 className="section-title">
            <i className="ri-error-warning-line"></i>
            <span>薄弱知识点</span>
          </h2>
          
          <div className="row">
            <div className="col">
              <div className="card">
                <h3 style={{fontWeight: 600, marginBottom: '1rem'}}>近期错题分析</h3>
                
                {subjectData.weaknesses.map((weakness, index) => (
                  <div style={{marginBottom: '1.5rem'}} key={index}>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                      <span>{weakness.name}</span>
                      <span>{weakness.mastery}% 掌握</span>
                    </div>
                    <div className="progress-container">
                      <div className="progress-bar" style={{width: `${weakness.mastery}%`}}></div>
                    </div>
                  </div>
                ))}
                
                <Link href={`/wrong-questions?subject=${subjectId}`} className="btn btn-outline w-full">查看完整错题分析</Link>
              </div>
            </div>
            
            <div className="col">
              <div className="card">
                <h3 style={{fontWeight: 600, marginBottom: '1rem'}}>AI学习建议</h3>
                
                <p style={{marginBottom: '1rem', color: 'var(--text-secondary)'}}>基于你的学习情况，AI助手建议你重点关注以下内容：</p>
                
                <ul style={{listStyle: 'none', padding: 0}}>
                  {subjectData.aiSuggestions.map((suggestion, index) => (
                    <li style={{display: 'flex', alignItems: 'center', marginBottom: '1rem'}} key={index}>
                      <i className="ri-checkbox-circle-line" style={{color: 'var(--primary)', marginRight: '0.5rem'}}></i>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
                
                <Link href={`/practice?subject=${subjectId}&mode=weakness`} className="btn btn-primary w-full">针对性练习</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// 根据学科ID获取学科数据的辅助函数
function getSubjectData(subjectId) {
  const subjectDataMap = {
    'hsk4': {
      id: 'hsk4',
      title: 'HSK四级',
      description: '汉语水平考试四级备考练习',
      icon: 'ri-translate',
      stats: {
        masteryRate: '85%',
        questionCount: '2500+',
        practiceCount: '15',
        accuracy: '80%'
      },
      weaknesses: [
        { name: '动词补语', mastery: 65 },
        { name: '离合词用法', mastery: 45 },
        { name: '复句连接词', mastery: 58 }
      ],
      aiSuggestions: [
        '加强离合词的词汇积累和用法练习',
        '复习具有方向性的补语结构',
        '练习复句类型辨别和连接词选择'
      ]
    },
    'hsk5': {
      id: 'hsk5',
      title: 'HSK五级',
      description: '汉语水平考试五级备考练习',
      icon: 'ri-translate',
      stats: {
        masteryRate: '72%',
        questionCount: '3200+',
        practiceCount: '8',
        accuracy: '75%'
      },
      weaknesses: [
        { name: '书面表达', mastery: 60 },
        { name: '成语运用', mastery: 40 },
        { name: '高级语法', mastery: 55 }
      ],
      aiSuggestions: [
        '增加成语的学习和应用场景练习',
        '加强书面表达的逻辑性和连贯性',
        '系统学习高级语法结构'
      ]
    },
    'cet4': {
      id: 'cet4',
      title: '大学英语四级',
      description: 'CET-4英语听力、阅读、写作练习',
      icon: 'ri-english-input',
      stats: {
        masteryRate: '78%',
        questionCount: '5000+',
        practiceCount: '12',
        accuracy: '82%'
      },
      weaknesses: [
        { name: '听力理解', mastery: 60 },
        { name: '长篇阅读', mastery: 75 },
        { name: '写作表达', mastery: 65 }
      ],
      aiSuggestions: [
        '每天进行15分钟的英语听力训练',
        '提高长篇阅读的速度和理解能力',
        '积累常用写作模板和表达'
      ]
    },
    'math': {
      id: 'math',
      title: '高等数学',
      description: '大学高等数学微积分、线性代数练习',
      icon: 'ri-functions',
      stats: {
        masteryRate: '70%',
        questionCount: '1800+',
        practiceCount: '10',
        accuracy: '75%'
      },
      weaknesses: [
        { name: '多元微分', mastery: 55 },
        { name: '定积分应用', mastery: 60 },
        { name: '微分方程', mastery: 45 }
      ],
      aiSuggestions: [
        '加强微分方程的解题思路训练',
        '多做定积分应用题目',
        '复习多元微分的基本概念和计算方法'
      ]
    },
    'prog': {
      id: 'prog',
      title: '程序设计',
      description: '计算机程序设计基础知识与算法练习',
      icon: 'ri-code-s-slash-line',
      stats: {
        masteryRate: '80%',
        questionCount: '1200+',
        practiceCount: '20',
        accuracy: '85%'
      },
      weaknesses: [
        { name: '递归算法', mastery: 70 },
        { name: '动态规划', mastery: 50 },
        { name: '高级数据结构', mastery: 65 }
      ],
      aiSuggestions: [
        '系统学习动态规划的思想和应用',
        '多做递归算法的练习题',
        '学习和实现高级数据结构'
      ]
    },
    'econ': {
      id: 'econ',
      title: '经济学原理',
      description: '经济学基本原理与应用练习',
      icon: 'ri-line-chart-line',
      stats: {
        masteryRate: '75%',
        questionCount: '1500+',
        practiceCount: '8',
        accuracy: '78%'
      },
      weaknesses: [
        { name: '宏观经济政策', mastery: 65 },
        { name: '市场均衡分析', mastery: 70 },
        { name: '国际贸易理论', mastery: 55 }
      ],
      aiSuggestions: [
        '深入理解国际贸易理论的核心概念',
        '练习市场均衡分析的图形推导',
        '学习宏观经济政策的实际应用案例'
      ]
    }
  };
  
  return subjectDataMap[subjectId] || subjectDataMap['hsk4'];
} 