"use client";

import { useState, useRef, useEffect } from 'react';
import AdminAuthGuard from '../../../components/AdminAuthGuard';
import AdminSidebar from '../../../components/AdminSidebar';
import '../../../styles/admin-system-settings.css';

export default function SystemSettingsPage() {
  const [configs, setConfigs] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeCategory, setActiveCategory] = useState('basic');
  const [logoPreview, setLogoPreview] = useState('');
  const fileInputRef = useRef(null);

  const categories = [
    { id: 'basic', name: '基础设置', icon: 'ri-settings-line' },
    { id: 'login', name: '登录设置', icon: 'ri-login-box-line' },
    { id: 'notification', name: '通知设置', icon: 'ri-notification-line' },
    { id: 'ai', name: 'AI设置', icon: 'ri-robot-line' },
    { id: 'upload', name: '上传设置', icon: 'ri-upload-line' }
  ];

  // 加载配置数据
  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/settings');
      const result = await response.json();
      
      if (result.success) {
        setConfigs(result.data.configs);
      } else {
        console.error('获取配置失败:', result.error);
      }
    } catch (error) {
      console.error('获取配置失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfigChange = (configKey, value) => {
    setConfigs(prev => ({
      ...prev,
      [activeCategory]: prev[activeCategory]?.map(config => 
        config.configKey === configKey 
          ? { ...config, configValue: value }
          : config
      ) || []
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setLogoPreview(evt.target.result);
        handleConfigChange('system.logo', evt.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      
      // 收集当前分类的配置
      const currentConfigs = configs[activeCategory] || [];
      
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          configs: currentConfigs
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
        }, 2000);
      } else {
        alert('保存失败: ' + result.error);
      }
    } catch (error) {
      console.error('保存配置失败:', error);
      alert('保存失败');
    } finally {
      setSaving(false);
    }
  };

  const handleResetSettings = async () => {
    if (!confirm('确定要重置为默认设置吗？此操作不可撤销。')) {
      return;
    }

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT'
      });

      const result = await response.json();
      
      if (result.success) {
        await fetchConfigs();
        alert('设置已重置为默认值');
      } else {
        alert('重置失败: ' + result.error);
      }
    } catch (error) {
      console.error('重置设置失败:', error);
      alert('重置失败');
    }
  };

  const renderConfigInput = (config) => {
    switch (config.configType) {
      case 'boolean':
        return (
          <label className="switch">
            <input 
              type="checkbox" 
              checked={config.configValue}
              onChange={(e) => handleConfigChange(config.configKey, e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        );
      
      case 'number':
        return (
          <input 
            type="number" 
            className="form-input"
            value={config.configValue}
            onChange={(e) => handleConfigChange(config.configKey, parseInt(e.target.value))}
          />
        );
      
      case 'array':
        return (
          <input 
            type="text" 
            className="form-input"
            value={Array.isArray(config.configValue) ? config.configValue.join(', ') : ''}
            onChange={(e) => handleConfigChange(config.configKey, e.target.value.split(', '))}
            placeholder="用逗号分隔多个值"
          />
        );
      
      default: // string
        if (config.configKey === 'system.theme_color') {
          return (
            <input 
              type="color" 
              className="form-input color-input"
              value={config.configValue}
              onChange={(e) => handleConfigChange(config.configKey, e.target.value)}
            />
          );
        }
        return (
          <input 
            type="text" 
            className="form-input"
            value={config.configValue}
            onChange={(e) => handleConfigChange(config.configKey, e.target.value)}
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="admin-layout">
        <div className="main-content">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
            <div>加载中...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminAuthGuard>
      <div className="admin-layout">
        {/* 侧边栏 */}
        <AdminSidebar currentPage="system-settings" />
      
      {/* 主内容区域 */}
      <div className="main-content">
        <div className="topbar">
          <h1 className="page-title">系统设置</h1>
          <div className="topbar-actions">
            <button className="btn btn-outline" onClick={handleResetSettings}>
              <i className="ri-refresh-line btn-icon"></i>
              重置默认
            </button>
            <button 
              className="btn btn-primary" 
              onClick={handleSaveSettings}
              disabled={saving}
            >
              <i className="ri-save-line btn-icon"></i>
              {saving ? '保存中...' : '保存设置'}
            </button>
          </div>
        </div>
        
        <div className="settings-layout">
          {/* 设置分类导航 */}
          <div className="settings-nav">
            {categories.map(category => (
              <button
                key={category.id}
                className={`settings-nav-item ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.id)}
              >
                <i className={`${category.icon} settings-nav-icon`}></i>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
          
          {/* 设置内容 */}
          <div className="settings-content">
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">
                  {categories.find(c => c.id === activeCategory)?.name}
                </h2>
              </div>
              <div className="card-body">
                {configs[activeCategory]?.map(config => (
                  <div key={config.configKey} className="config-item">
                    <div className="config-info">
                      <div className="config-name">{config.configName}</div>
                      {config.description && (
                        <div className="config-description">{config.description}</div>
                      )}
                    </div>
                    <div className="config-control">
                      {renderConfigInput(config)}
                    </div>
                  </div>
                )) || (
                  <div className="empty-state">
                    <i className="ri-settings-line empty-icon"></i>
                    <div>该分类下暂无配置项</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* 成功提示 */}
        {showSuccess && (
          <div className="success-tip show">
            <i className="ri-check-line"></i>
            设置已保存！
          </div>
        )}
      </div>
    </div>
    </AdminAuthGuard>
  );
}
