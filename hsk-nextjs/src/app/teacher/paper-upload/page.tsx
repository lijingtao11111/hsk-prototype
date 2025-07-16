"use client";

import { useState, useRef } from 'react';
import Link from 'next/link';
import '../../../styles/teacher-paper-upload.css';

export default function PaperUploadPage() {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [formData, setFormData] = useState({
    paperName: '',
    subject: '',
    paperType: '',
    description: '',
    autoParse: true,
    autoTag: true
  });
  const fileInputRef = useRef(null);

  const recentFiles = [
    {
      id: 1,
      name: '2023年6月HSK四级真题.pdf',
      size: '2.4MB',
      date: '2023-06-15',
      status: 'success',
      icon: 'ri-file-pdf-line'
    },
    {
      id: 2,
      name: '2023年5月HSK五级模拟题.docx',
      size: '1.8MB',
      date: '2023-05-20',
      status: 'success',
      icon: 'ri-file-word-line'
    },
    {
      id: 3,
      name: '大学英语四级练习题.pdf',
      size: '3.1MB',
      date: '2023-04-10',
      status: 'success',
      icon: 'ri-file-pdf-line'
    }
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files) => {
    const fileArray = Array.from(files);
    setUploadedFiles(prev => [...prev, ...fileArray]);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (uploadedFiles.length === 0) {
      alert('请先上传文件');
      return;
    }

    try {
      const formDataToSend = new FormData();

      // 添加文件
      uploadedFiles.forEach(fileItem => {
        formDataToSend.append('files', fileItem.file);
      });

      // 添加处理方式和考试信息
      formDataToSend.append('processingType', formData.autoParse ? 'auto' : 'manual');
      formDataToSend.append('examInfo', JSON.stringify({
        name: formData.paperName,
        subjectName: formData.subject,
        description: formData.description
      }));

      const response = await fetch('/api/teacher/upload', {
        method: 'POST',
        body: formDataToSend
      });

      const result = await response.json();

      if (result.success) {
        alert('试卷上传成功！');
        // 重置表单
        setUploadedFiles([]);
        setFormData({
          paperName: '',
          subject: '',
          paperType: '',
          description: '',
          autoParse: true,
          autoTag: true
        });
      } else {
        alert('上传失败: ' + result.error);
      }
    } catch (error) {
      console.error('上传失败:', error);
      alert('上传失败');
    }
  };

  const handleUploadAreaClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="teacher-layout">
      {/* 侧边栏 */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">Z</div>
          <div className="sidebar-title">浙财智能考试系统</div>
        </div>
        
        <div className="sidebar-menu">
          <div className="sidebar-section">
            <div className="sidebar-section-title">教学管理</div>
            <Link href="/teacher/student-progress" className="sidebar-link">
              <i className="ri-line-chart-line sidebar-icon"></i>
              <span>学生进度</span>
            </Link>
            <Link href="/teacher/question-review" className="sidebar-link">
              <i className="ri-file-list-3-line sidebar-icon"></i>
              <span>题目审核</span>
            </Link>
            <Link href="/teacher/paper-upload" className="sidebar-link active">
              <i className="ri-upload-cloud-line sidebar-icon"></i>
              <span>试卷上传</span>
            </Link>
          </div>
          
          <div className="sidebar-section">
            <div className="sidebar-section-title">账户</div>
            <Link href="/teacher/login" className="sidebar-link">
              <i className="ri-logout-box-line sidebar-icon"></i>
              <span>退出登录</span>
            </Link>
          </div>
        </div>
        
        <div className="sidebar-footer">
          <div className="sidebar-footer-avatar">李</div>
          <div>
            <div style={{fontWeight: 500}}>李教授</div>
            <div style={{fontSize: '0.75rem', color: 'var(--text-secondary)'}}>计算机学院</div>
          </div>
        </div>
      </div>
      
      {/* 主内容区域 */}
      <div className="main-content">
        <div className="topbar">
          <h1 className="page-title">试卷上传</h1>
        </div>
        
        <div className="upload-container">
          {/* 上传区域 */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <i className="ri-upload-cloud-line" style={{marginRight: '0.5rem'}}></i>
                上传试卷
              </div>
            </div>
            <div className="card-body">
              <div 
                className={`upload-area ${dragActive ? 'drag-active' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={handleUploadAreaClick}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleChange}
                  accept=".pdf,.doc,.docx,.txt"
                  style={{display: 'none'}}
                />
                <div className="upload-icon">
                  <i className="ri-upload-cloud-2-line"></i>
                </div>
                <div className="upload-text">
                  <div className="upload-title">点击上传或拖拽文件到此区域</div>
                  <div className="upload-subtitle">
                    支持 PDF、Word、TXT 格式，单个文件不超过 10MB
                  </div>
                </div>
              </div>
              
              {uploadedFiles.length > 0 && (
                <div className="uploaded-files">
                  <h4>已选择文件：</h4>
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="uploaded-file">
                      <i className="ri-file-line"></i>
                      <span>{file.name}</span>
                      <span className="file-size">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* 表单区域 */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <i className="ri-settings-3-line" style={{marginRight: '0.5rem'}}></i>
                试卷信息
              </div>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="paper-name">试卷名称</label>
                  <input 
                    type="text" 
                    id="paper-name" 
                    name="paperName"
                    className="form-control" 
                    placeholder="请输入试卷名称"
                    value={formData.paperName}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label" htmlFor="subject">学科</label>
                  <select 
                    id="subject" 
                    name="subject"
                    className="form-select"
                    value={formData.subject}
                    onChange={handleInputChange}
                  >
                    <option value="">请选择学科</option>
                    <option value="hsk">HSK考试</option>
                    <option value="cet4">大学英语四级</option>
                    <option value="math">高等数学</option>
                    <option value="prog">程序设计</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label" htmlFor="paper-type">试卷类型</label>
                  <select 
                    id="paper-type" 
                    name="paperType"
                    className="form-select"
                    value={formData.paperType}
                    onChange={handleInputChange}
                  >
                    <option value="">请选择试卷类型</option>
                    <option value="real_exam">真题试卷</option>
                    <option value="mock_exam">模拟试卷</option>
                    <option value="practice">练习题</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label" htmlFor="paper-description">试卷描述</label>
                  <textarea 
                    id="paper-description" 
                    name="description"
                    className="form-control" 
                    rows="3" 
                    placeholder="请输入试卷的简要描述..."
                    value={formData.description}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
                
                <div className="form-group">
                  <label className="form-label">AI解析设置</label>
                  <div className="checkbox-group">
                    <label className="custom-checkbox">
                      <input 
                        type="checkbox" 
                        name="autoParse"
                        checked={formData.autoParse}
                        onChange={handleInputChange}
                      />
                      <span className="checkmark"></span>
                    </label>
                    <span>上传后自动进行AI解析</span>
                  </div>
                  <div className="checkbox-group">
                    <label className="custom-checkbox">
                      <input 
                        type="checkbox" 
                        name="autoTag"
                        checked={formData.autoTag}
                        onChange={handleInputChange}
                      />
                      <span className="checkmark"></span>
                    </label>
                    <span>自动标注知识点</span>
                  </div>
                </div>
                
                <div style={{display: 'flex', justifyContent: 'flex-end', gap: '0.75rem'}}>
                  <button type="button" className="btn btn-outline">取消</button>
                  <button type="submit" className="btn btn-primary">
                    <i className="ri-upload-2-line btn-icon"></i>
                    开始上传
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          {/* 最近上传 */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <i className="ri-history-line" style={{marginRight: '0.5rem'}}></i>
                最近上传
              </div>
            </div>
            <div className="card-body">
              <div className="file-list">
                {recentFiles.map((file) => (
                  <div key={file.id} className="file-item">
                    <div className="file-icon">
                      <i className={file.icon}></i>
                    </div>
                    <div className="file-info">
                      <div className="file-name">{file.name}</div>
                      <div className="file-meta">
                        <div className="file-size">
                          <i className="ri-file-list-line"></i>
                          <span>{file.size}</span>
                        </div>
                        <div className="file-date">
                          <i className="ri-time-line"></i>
                          <span>上传于 {file.date}</span>
                        </div>
                        <span className={`upload-status status-${file.status}`}>已解析</span>
                      </div>
                      <div className="progress-container">
                        <div className="progress-bar" style={{width: '100%'}}></div>
                      </div>
                    </div>
                    <div className="file-actions">
                      <button className="file-action" title="查看详情">
                        <i className="ri-eye-line"></i>
                      </button>
                      <button className="file-action" title="下载文件">
                        <i className="ri-download-line"></i>
                      </button>
                      <button className="file-action" title="删除文件">
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
