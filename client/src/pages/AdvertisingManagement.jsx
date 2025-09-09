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

      {/* 统计卡片 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
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
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px'
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
        <div style={{ padding: '20px', borderBottom: '1px solid #f0f0f0' }}>
          <h2 style={{ margin: 0, color: '#333' }}>📢 广告活动列表</h2>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            minWidth: '1200px'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
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
              {advertisingFees.map((advertising) => (
                <tr key={advertising.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
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
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <button
                      onClick={() => handleEdit(advertising)}
                      style={{
                        backgroundColor: '#1890ff',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        marginRight: '8px'
                      }}
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDelete(advertising.id)}
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
                      删除
                    </button>
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
            padding: '30px',
            borderRadius: '12px',
            width: '700px',
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflow: 'auto'
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
    </div>
  );
};

export default AdvertisingManagement;
