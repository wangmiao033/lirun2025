import React, { useState, useEffect } from 'react';

const AdvertisingManagement = () => {
  const [advertisingFees, setAdvertisingFees] = useState([]);
  const [statistics, setStatistics] = useState({
    totalCampaigns: 0,
    totalBudget: 0,
    totalSpent: 0,
    totalRemaining: 0,
    platformStats: {},
    statusStats: {},
    totalImpressions: 0,
    totalClicks: 0,
    totalConversions: 0,
    avgCtr: 0,
    avgCpc: 0,
    avgCpa: 0
  });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAdvertising, setEditingAdvertising] = useState(null);
  const [formData, setFormData] = useState({
    campaignName: '',
    platform: '',
    adType: '',
    targetAudience: '',
    budget: '',
    startDate: '',
    endDate: '',
    project: '',
    description: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterProject, setFilterProject] = useState('');
  const [showEffectsModal, setShowEffectsModal] = useState(false);
  const [editingEffects, setEditingEffects] = useState(null);
  const [effectsData, setEffectsData] = useState({
    impressions: '',
    clicks: '',
    conversions: '',
    spent: ''
  });
  const [selectedItems, setSelectedItems] = useState([]);
  const [showBatchActions, setShowBatchActions] = useState(false);

  useEffect(() => {
    fetchAdvertisingFees();
    fetchStatistics();
  }, []);

  const fetchAdvertisingFees = async () => {
    try {
      const response = await fetch('/api/advertising-fees');
      const result = await response.json();
      if (result.success) {
        setAdvertisingFees(result.data);
      }
    } catch (error) {
      console.error('获取广告费数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await fetch('/api/advertising-statistics');
      const result = await response.json();
      if (result.success) {
        setStatistics(result.data);
      }
    } catch (error) {
      console.error('获取广告费统计失败:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingAdvertising ? `/api/advertising-fees/${editingAdvertising.id}` : '/api/advertising-fees';
      const method = editingAdvertising ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      if (result.success) {
        fetchAdvertisingFees();
        fetchStatistics();
        setShowModal(false);
        setEditingAdvertising(null);
        resetForm();
      } else {
        alert(result.message || '操作失败');
      }
    } catch (error) {
      console.error('操作失败:', error);
      alert('操作失败');
    }
  };

  const resetForm = () => {
    setFormData({
      campaignName: '',
      platform: '',
      adType: '',
      targetAudience: '',
      budget: '',
      startDate: '',
      endDate: '',
      project: '',
      description: ''
    });
  };

  const handleEdit = (advertising) => {
    setEditingAdvertising(advertising);
    setFormData({
      campaignName: advertising.campaignName,
      platform: advertising.platform,
      adType: advertising.adType,
      targetAudience: advertising.targetAudience,
      budget: advertising.budget.toString(),
      startDate: advertising.startDate,
      endDate: advertising.endDate,
      project: advertising.project,
      description: advertising.description
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('确定要删除这个广告活动吗？')) return;
    
    try {
      const response = await fetch(`/api/advertising-fees/${id}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      if (result.success) {
        fetchAdvertisingFees();
        fetchStatistics();
      } else {
        alert(result.message || '删除失败');
      }
    } catch (error) {
      console.error('删除失败:', error);
      alert('删除失败');
    }
  };

  const handleStatusUpdate = async (advertising) => {
    const newStatus = advertising.status === '未开始' ? '进行中' : '已完成';
    const confirmMessage = newStatus === '进行中' 
      ? '确定要开始这个广告活动吗？' 
      : '确定要完成这个广告活动吗？';
    
    if (!confirm(confirmMessage)) return;
    
    try {
      const response = await fetch(`/api/advertising-fees/${advertising.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...advertising,
          status: newStatus
        }),
      });
      
      const result = await response.json();
      if (result.success) {
        fetchAdvertisingFees();
        fetchStatistics();
      } else {
        alert(result.message || '状态更新失败');
      }
    } catch (error) {
      console.error('状态更新失败:', error);
      alert('状态更新失败');
    }
  };

  const handleEditEffects = (advertising) => {
    setEditingEffects(advertising);
    setEffectsData({
      impressions: advertising.impressions.toString(),
      clicks: advertising.clicks.toString(),
      conversions: advertising.conversions.toString(),
      spent: advertising.spent.toString()
    });
    setShowEffectsModal(true);
  };

  const handleEffectsSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const impressions = parseInt(effectsData.impressions) || 0;
      const clicks = parseInt(effectsData.clicks) || 0;
      const conversions = parseInt(effectsData.conversions) || 0;
      const spent = parseFloat(effectsData.spent) || 0;
      
      // 计算CTR、CPC、CPA
      const ctr = impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) : 0;
      const cpc = clicks > 0 ? (spent / clicks).toFixed(2) : 0;
      const cpa = conversions > 0 ? (spent / conversions).toFixed(2) : 0;
      
      const response = await fetch(`/api/advertising-fees/${editingEffects.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...editingEffects,
          impressions,
          clicks,
          conversions,
          spent,
          ctr: parseFloat(ctr),
          cpc: parseFloat(cpc),
          cpa: parseFloat(cpa),
          remaining: editingEffects.budget - spent
        }),
      });
      
      const result = await response.json();
      if (result.success) {
        fetchAdvertisingFees();
        fetchStatistics();
        setShowEffectsModal(false);
        setEditingEffects(null);
        setEffectsData({
          impressions: '',
          clicks: '',
          conversions: '',
          spent: ''
        });
      } else {
        alert(result.message || '效果数据更新失败');
      }
    } catch (error) {
      console.error('效果数据更新失败:', error);
      alert('效果数据更新失败');
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch('/api/advertising-fees/export', {
        method: 'GET',
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `广告费数据_${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('导出失败，请稍后重试');
      }
    } catch (error) {
      console.error('导出失败:', error);
      alert('导出失败，请稍后重试');
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(filteredAdvertisingFees.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id, checked) => {
    if (checked) {
      setSelectedItems([...selectedItems, id]);
    } else {
      setSelectedItems(selectedItems.filter(item => item !== id));
    }
  };

  const handleBatchDelete = async () => {
    if (selectedItems.length === 0) {
      alert('请选择要删除的广告活动');
      return;
    }
    
    if (!confirm(`确定要删除选中的 ${selectedItems.length} 个广告活动吗？`)) return;
    
    try {
      const deletePromises = selectedItems.map(id => 
        fetch(`/api/advertising-fees/${id}`, { method: 'DELETE' })
      );
      
      await Promise.all(deletePromises);
      setSelectedItems([]);
      fetchAdvertisingFees();
      fetchStatistics();
      alert('批量删除成功');
    } catch (error) {
      console.error('批量删除失败:', error);
      alert('批量删除失败');
    }
  };

  const handleBatchStatusUpdate = async (newStatus) => {
    if (selectedItems.length === 0) {
      alert('请选择要更新状态的广告活动');
      return;
    }
    
    const statusText = newStatus === '进行中' ? '开始' : '完成';
    if (!confirm(`确定要将选中的 ${selectedItems.length} 个广告活动状态更新为"${statusText}"吗？`)) return;
    
    try {
      const updatePromises = selectedItems.map(id => {
        const advertising = advertisingFees.find(ad => ad.id === id);
        if (advertising) {
          return fetch(`/api/advertising-fees/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...advertising, status: newStatus })
          });
        }
        return Promise.resolve();
      });
      
      await Promise.all(updatePromises);
      setSelectedItems([]);
      fetchAdvertisingFees();
      fetchStatistics();
      alert(`批量${statusText}成功`);
    } catch (error) {
      console.error('批量状态更新失败:', error);
      alert('批量状态更新失败');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case '未开始': return '#666';
      case '进行中': return '#1890ff';
      case '已完成': return '#52c41a';
      default: return '#666';
    }
  };

  // 筛选和搜索逻辑
  const filteredAdvertisingFees = advertisingFees.filter(advertising => {
    const matchesSearch = !searchTerm || 
      advertising.campaignName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      advertising.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
      advertising.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPlatform = !filterPlatform || advertising.platform === filterPlatform;
    const matchesStatus = !filterStatus || advertising.status === filterStatus;
    const matchesProject = !filterProject || advertising.project === filterProject;
    
    return matchesSearch && matchesPlatform && matchesStatus && matchesProject;
  });

  // 获取唯一的平台列表
  const uniquePlatforms = [...new Set(advertisingFees.map(ad => ad.platform))];
  // 获取唯一的项目列表
  const uniqueProjects = [...new Set(advertisingFees.map(ad => ad.project).filter(Boolean))];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div style={{ fontSize: '18px', color: '#666' }}>加载中...</div>
      </div>
    );
  }

  return (
    <div>
      {/* 页面头部 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1 style={{ margin: 0, color: '#333' }}>广告费管理</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleExport}
            style={{
              backgroundColor: '#52c41a',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            📊 导出数据
          </button>
          <button
            onClick={() => setShowModal(true)}
            style={{
              backgroundColor: '#1890ff',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            ➕ 新增广告活动
          </button>
        </div>
      </div>

      {/* 搜索和筛选区域 */}
      <div style={{
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '15px',
          alignItems: 'end'
        }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>
              🔍 搜索
            </label>
            <input
              type="text"
              placeholder="搜索活动名称、项目或描述..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>
              📱 平台
            </label>
            <select
              value={filterPlatform}
              onChange={(e) => setFilterPlatform(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              <option value="">全部平台</option>
              {uniquePlatforms.map(platform => (
                <option key={platform} value={platform}>{platform}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>
              📊 状态
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              <option value="">全部状态</option>
              <option value="未开始">未开始</option>
              <option value="进行中">进行中</option>
              <option value="已完成">已完成</option>
            </select>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>
              🎮 项目
            </label>
            <select
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              <option value="">全部项目</option>
              {uniqueProjects.map(project => (
                <option key={project} value={project}>{project}</option>
              ))}
            </select>
          </div>
          
          <div>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterPlatform('');
                setFilterStatus('');
                setFilterProject('');
              }}
              style={{
                backgroundColor: '#f5f5f5',
                color: '#333',
                border: '1px solid #d9d9d9',
                padding: '10px 20px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                width: '100%'
              }}
            >
              🔄 重置筛选
            </button>
          </div>
        </div>
      </div>

      {/* 统计卡片 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '15px',
        marginBottom: '30px'
      }}>
        <div style={{
          padding: '20px',
          backgroundColor: '#f6ffed',
          border: '2px solid #b7eb8f',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#52c41a', margin: '0 0 10px 0', fontSize: '1rem' }}>
            📢 活动总数
          </h3>
          <h2 style={{ color: '#52c41a', margin: '0', fontSize: '1.5rem', fontWeight: 'bold' }}>
            {statistics.totalCampaigns}
          </h2>
        </div>

        <div style={{
          padding: '20px',
          backgroundColor: '#e6f7ff',
          border: '2px solid #91d5ff',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#1890ff', margin: '0 0 10px 0', fontSize: '1rem' }}>
            💰 总预算
          </h3>
          <h2 style={{ color: '#1890ff', margin: '0', fontSize: '1.5rem', fontWeight: 'bold' }}>
            {formatCurrency(statistics.totalBudget)}
          </h2>
        </div>

        <div style={{
          padding: '20px',
          backgroundColor: '#fff2e8',
          border: '2px solid #ffbb96',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#fa8c16', margin: '0 0 10px 0', fontSize: '1rem' }}>
            💸 已花费
          </h3>
          <h2 style={{ color: '#fa8c16', margin: '0', fontSize: '1.5rem', fontWeight: 'bold' }}>
            {formatCurrency(statistics.totalSpent)}
          </h2>
        </div>

        <div style={{
          padding: '20px',
          backgroundColor: '#fffbe6',
          border: '2px solid #ffe58f',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#faad14', margin: '0 0 10px 0', fontSize: '1rem' }}>
            📊 剩余预算
          </h3>
          <h2 style={{ color: '#faad14', margin: '0', fontSize: '1.5rem', fontWeight: 'bold' }}>
            {formatCurrency(statistics.totalRemaining)}
          </h2>
        </div>

        <div style={{
          padding: '20px',
          backgroundColor: '#f0f8ff',
          border: '2px solid #87ceeb',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#4169e1', margin: '0 0 10px 0', fontSize: '1rem' }}>
            👁️ 总曝光
          </h3>
          <h2 style={{ color: '#4169e1', margin: '0', fontSize: '1.5rem', fontWeight: 'bold' }}>
            {(statistics.totalImpressions / 10000).toFixed(1)}万
          </h2>
        </div>

        <div style={{
          padding: '20px',
          backgroundColor: '#f0fff0',
          border: '2px solid #90ee90',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#228b22', margin: '0 0 10px 0', fontSize: '1rem' }}>
            🖱️ 总点击
          </h3>
          <h2 style={{ color: '#228b22', margin: '0', fontSize: '1.5rem', fontWeight: 'bold' }}>
            {(statistics.totalClicks / 1000).toFixed(1)}k
          </h2>
        </div>

        <div style={{
          padding: '20px',
          backgroundColor: '#fff0f5',
          border: '2px solid #ffb6c1',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#dc143c', margin: '0 0 10px 0', fontSize: '1rem' }}>
            🎯 总转化
          </h3>
          <h2 style={{ color: '#dc143c', margin: '0', fontSize: '1.5rem', fontWeight: 'bold' }}>
            {statistics.totalConversions}
          </h2>
        </div>

        <div style={{
          padding: '20px',
          backgroundColor: '#f5f5dc',
          border: '2px solid #daa520',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#b8860b', margin: '0 0 10px 0', fontSize: '1rem' }}>
            📈 平均CTR
          </h3>
          <h2 style={{ color: '#b8860b', margin: '0', fontSize: '1.5rem', fontWeight: 'bold' }}>
            {statistics.avgCtr}%
          </h2>
        </div>
      </div>

      {/* 按平台统计 */}
      <div style={{
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <h2 style={{ margin: '0 0 30px 0', color: '#333' }}>📱 按平台统计</h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '15px'
        }}>
          {Object.entries(statistics.platformStats).map(([platform, stats]) => (
            <div key={platform} style={{
              padding: '20px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              border: '1px solid #e9ecef'
            }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>{platform}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#666' }}>活动数</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1890ff' }}>
                    {stats.count}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#666' }}>预算</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#52c41a' }}>
                    {formatCurrency(stats.budget)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#666' }}>已花费</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#fa8c16' }}>
                    {formatCurrency(stats.spent)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 广告活动列表 */}
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <div style={{ 
          padding: '20px', 
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <h2 style={{ margin: 0, color: '#333' }}>📢 广告活动列表</h2>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={selectedItems.length === filteredAdvertisingFees.length && filteredAdvertisingFees.length > 0}
                onChange={(e) => handleSelectAll(e.target.checked)}
                style={{ transform: 'scale(1.2)' }}
              />
              <span style={{ fontSize: '14px', color: '#666' }}>全选</span>
            </label>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ 
              fontSize: '14px', 
              color: '#666',
              backgroundColor: '#f8f9fa',
              padding: '8px 16px',
              borderRadius: '20px',
              border: '1px solid #e9ecef'
            }}>
              显示 {filteredAdvertisingFees.length} / {advertisingFees.length} 条记录
            </div>
            
            {selectedItems.length > 0 && (
              <div style={{ 
                fontSize: '14px', 
                color: '#1890ff',
                backgroundColor: '#e6f7ff',
                padding: '8px 16px',
                borderRadius: '20px',
                border: '1px solid #91d5ff'
              }}>
                已选择 {selectedItems.length} 项
              </div>
            )}
          </div>
        </div>
        
        {selectedItems.length > 0 && (
          <div style={{
            padding: '15px 20px',
            backgroundColor: '#f0f8ff',
            borderBottom: '1px solid #e9ecef',
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '14px', color: '#333', fontWeight: 'bold' }}>批量操作：</span>
            <button
              onClick={() => handleBatchStatusUpdate('进行中')}
              style={{
                backgroundColor: '#52c41a',
                color: 'white',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              批量开始
            </button>
            <button
              onClick={() => handleBatchStatusUpdate('已完成')}
              style={{
                backgroundColor: '#1890ff',
                color: 'white',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              批量完成
            </button>
            <button
              onClick={handleBatchDelete}
              style={{
                backgroundColor: '#ff4d4f',
                color: 'white',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              批量删除
            </button>
            <button
              onClick={() => setSelectedItems([])}
              style={{
                backgroundColor: '#f5f5f5',
                color: '#333',
                border: '1px solid #d9d9d9',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              取消选择
            </button>
          </div>
        )}
        
        <div style={{ 
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch'
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            minWidth: '1000px'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '16px', textAlign: 'center', borderBottom: '1px solid #e9ecef', width: '50px' }}>
                  <input
                    type="checkbox"
                    checked={selectedItems.length === filteredAdvertisingFees.length && filteredAdvertisingFees.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    style={{ transform: 'scale(1.2)' }}
                  />
                </th>
                <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e9ecef' }}>活动名称</th>
                <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e9ecef' }}>平台</th>
                <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e9ecef' }}>项目</th>
                <th style={{ padding: '16px', textAlign: 'right', borderBottom: '1px solid #e9ecef' }}>预算</th>
                <th style={{ padding: '16px', textAlign: 'right', borderBottom: '1px solid #e9ecef' }}>已花费</th>
                <th style={{ padding: '16px', textAlign: 'right', borderBottom: '1px solid #e9ecef' }}>剩余</th>
                <th style={{ padding: '16px', textAlign: 'center', borderBottom: '1px solid #e9ecef' }}>CTR</th>
                <th style={{ padding: '16px', textAlign: 'center', borderBottom: '1px solid #e9ecef' }}>CPC</th>
                <th style={{ padding: '16px', textAlign: 'center', borderBottom: '1px solid #e9ecef' }}>状态</th>
                <th style={{ padding: '16px', textAlign: 'center', borderBottom: '1px solid #e9ecef' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdvertisingFees.map((advertising) => (
                <tr key={advertising.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(advertising.id)}
                      onChange={(e) => handleSelectItem(advertising.id, e.target.checked)}
                      style={{ transform: 'scale(1.2)' }}
                    />
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{advertising.campaignName}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        {advertising.startDate} - {advertising.endDate}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div>
                      <div>{advertising.platform}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>{advertising.adType}</div>
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>{advertising.project}</td>
                  <td style={{ padding: '16px', textAlign: 'right', color: '#1890ff', fontWeight: 'bold' }}>
                    {formatCurrency(advertising.budget)}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right', color: '#fa8c16', fontWeight: 'bold' }}>
                    {formatCurrency(advertising.spent)}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right', color: '#52c41a', fontWeight: 'bold' }}>
                    {formatCurrency(advertising.remaining)}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center', fontWeight: 'bold' }}>
                    {advertising.ctr}%
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center', fontWeight: 'bold' }}>
                    ¥{advertising.cpc}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        backgroundColor: '#f0f0f0',
                        color: getStatusColor(advertising.status),
                        border: `1px solid ${getStatusColor(advertising.status)}`
                      }}>
                        {advertising.status}
                      </span>
                      {advertising.status !== '已完成' && (
                        <button
                          onClick={() => handleStatusUpdate(advertising)}
                          style={{
                            backgroundColor: '#52c41a',
                            color: 'white',
                            border: 'none',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '10px'
                          }}
                        >
                          {advertising.status === '未开始' ? '开始' : '完成'}
                        </button>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center', minWidth: '120px' }}>
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '4px',
                      '@media (max-width: 768px)': {
                        flexDirection: 'row',
                        flexWrap: 'wrap'
                      }
                    }}>
                      <button
                        onClick={() => handleEdit(advertising)}
                        style={{
                          backgroundColor: '#1890ff',
                          color: 'white',
                          border: 'none',
                          padding: '6px 8px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '11px',
                          width: '100%',
                          minWidth: '60px'
                        }}
                      >
                        编辑
                      </button>
                      <button
                        onClick={() => handleEditEffects(advertising)}
                        style={{
                          backgroundColor: '#52c41a',
                          color: 'white',
                          border: 'none',
                          padding: '6px 8px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '11px',
                          width: '100%',
                          minWidth: '60px'
                        }}
                      >
                        效果
                      </button>
                      <button
                        onClick={() => handleDelete(advertising.id)}
                        style={{
                          backgroundColor: '#ff4d4f',
                          color: 'white',
                          border: 'none',
                          padding: '6px 8px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '11px',
                          width: '100%',
                          minWidth: '60px'
                        }}
                      >
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 新增/编辑模态框 */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            width: '700px',
            maxWidth: '95vw',
            maxHeight: '90vh',
            overflow: 'auto',
            margin: '10px'
          }}>
            <h2 style={{ margin: '0 0 20px 0', color: '#333' }}>
              {editingAdvertising ? '编辑广告活动' : '新增广告活动'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    活动名称 *
                  </label>
                  <input
                    type="text"
                    value={formData.campaignName}
                    onChange={(e) => setFormData({...formData, campaignName: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d9d9d9',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    平台 *
                  </label>
                  <select
                    value={formData.platform}
                    onChange={(e) => setFormData({...formData, platform: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d9d9d9',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="">请选择平台</option>
                    <option value="腾讯广告">腾讯广告</option>
                    <option value="字节跳动">字节跳动</option>
                    <option value="百度推广">百度推广</option>
                    <option value="阿里巴巴">阿里巴巴</option>
                    <option value="快手">快手</option>
                    <option value="小红书">小红书</option>
                  </select>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    广告类型
                  </label>
                  <select
                    value={formData.adType}
                    onChange={(e) => setFormData({...formData, adType: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d9d9d9',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="">请选择类型</option>
                    <option value="信息流广告">信息流广告</option>
                    <option value="视频广告">视频广告</option>
                    <option value="搜索广告">搜索广告</option>
                    <option value="展示广告">展示广告</option>
                    <option value="原生广告">原生广告</option>
                  </select>
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    目标受众
                  </label>
                  <input
                    type="text"
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d9d9d9',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    预算 *
                  </label>
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d9d9d9',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    项目
                  </label>
                  <input
                    type="text"
                    value={formData.project}
                    onChange={(e) => setFormData({...formData, project: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d9d9d9',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    开始日期
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d9d9d9',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    结束日期
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d9d9d9',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>
              
              <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  描述
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '6px',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingAdvertising(null);
                    resetForm();
                  }}
                  style={{
                    backgroundColor: '#f5f5f5',
                    color: '#333',
                    border: '1px solid #d9d9d9',
                    padding: '12px 24px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  取消
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#1890ff',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                >
                  {editingAdvertising ? '更新' : '创建'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 效果数据编辑模态框 */}
      {showEffectsModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            width: '500px',
            maxWidth: '95vw',
            maxHeight: '90vh',
            overflow: 'auto',
            margin: '10px'
          }}>
            <h2 style={{ margin: '0 0 20px 0', color: '#333' }}>
              📊 编辑效果数据 - {editingEffects?.campaignName}
            </h2>
            
            <form onSubmit={handleEffectsSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    曝光量 *
                  </label>
                  <input
                    type="number"
                    value={effectsData.impressions}
                    onChange={(e) => setEffectsData({...effectsData, impressions: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d9d9d9',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    点击量 *
                  </label>
                  <input
                    type="number"
                    value={effectsData.clicks}
                    onChange={(e) => setEffectsData({...effectsData, clicks: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d9d9d9',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    转化量 *
                  </label>
                  <input
                    type="number"
                    value={effectsData.conversions}
                    onChange={(e) => setEffectsData({...effectsData, conversions: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d9d9d9',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    已花费 *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={effectsData.spent}
                    onChange={(e) => setEffectsData({...effectsData, spent: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d9d9d9',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>
              
              <div style={{ 
                backgroundColor: '#f8f9fa', 
                padding: '15px', 
                borderRadius: '6px', 
                marginBottom: '20px',
                border: '1px solid #e9ecef'
              }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>自动计算结果：</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', fontSize: '14px' }}>
                  <div>
                    <span style={{ color: '#666' }}>CTR:</span>
                    <span style={{ fontWeight: 'bold', marginLeft: '5px' }}>
                      {effectsData.impressions > 0 ? 
                        ((effectsData.clicks / effectsData.impressions) * 100).toFixed(2) : 0}%
                    </span>
                  </div>
                  <div>
                    <span style={{ color: '#666' }}>CPC:</span>
                    <span style={{ fontWeight: 'bold', marginLeft: '5px' }}>
                      ¥{effectsData.clicks > 0 ? 
                        (effectsData.spent / effectsData.clicks).toFixed(2) : 0}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: '#666' }}>CPA:</span>
                    <span style={{ fontWeight: 'bold', marginLeft: '5px' }}>
                      ¥{effectsData.conversions > 0 ? 
                        (effectsData.spent / effectsData.conversions).toFixed(2) : 0}
                    </span>
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowEffectsModal(false);
                    setEditingEffects(null);
                    setEffectsData({
                      impressions: '',
                      clicks: '',
                      conversions: '',
                      spent: ''
                    });
                  }}
                  style={{
                    backgroundColor: '#f5f5f5',
                    color: '#333',
                    border: '1px solid #d9d9d9',
                    padding: '12px 24px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  取消
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#52c41a',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                >
                  更新效果数据
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvertisingManagement;
