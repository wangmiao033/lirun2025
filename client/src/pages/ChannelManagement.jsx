import React, { useState, useEffect } from 'react';

const ChannelManagement = () => {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingChannel, setEditingChannel] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    manager: '',
    contact: '',
    phone: '',
    email: '',
    status: '',
    description: ''
  });
  
  // 搜索和筛选状态
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    fetchChannels();
  }, []);

  const fetchChannels = async () => {
    try {
      const response = await fetch('/api/channels');
      const result = await response.json();
      if (result.success) {
        setChannels(result.data);
      }
    } catch (error) {
      console.error('获取渠道数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingChannel ? `/api/channels/${editingChannel.id}` : '/api/channels';
      const method = editingChannel ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      if (result.success) {
        fetchChannels();
        setShowModal(false);
        setEditingChannel(null);
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
      name: '',
      type: '',
      manager: '',
      contact: '',
      phone: '',
      email: '',
      status: '',
      description: ''
    });
  };

  const handleEdit = (channel) => {
    setEditingChannel(channel);
    setFormData({
      name: channel.name,
      type: channel.type,
      manager: channel.manager,
      contact: channel.contact,
      phone: channel.phone,
      email: channel.email,
      status: channel.status,
      description: channel.description
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('确定要删除这个渠道吗？')) return;
    
    try {
      const response = await fetch(`/api/channels/${id}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      if (result.success) {
        fetchChannels();
      } else {
        alert(result.message || '删除失败');
      }
    } catch (error) {
      console.error('删除失败:', error);
      alert('删除失败');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#52c41a';
      case 'inactive': return '#faad14';
      case 'suspended': return '#ff4d4f';
      case 'testing': return '#1890ff';
      default: return '#666';
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      'active': '活跃',
      'inactive': '非活跃',
      'suspended': '暂停',
      'testing': '测试中'
    };
    return statusMap[status] || status;
  };

  const getTypeText = (type) => {
    const typeMap = {
      'app_store': '应用商店',
      'google_play': 'Google Play',
      'huawei': '华为应用市场',
      'xiaomi': '小米应用商店',
      'oppo': 'OPPO软件商店',
      'vivo': 'vivo应用商店',
      'other': '其他'
    };
    return typeMap[type] || type;
  };

  // 筛选逻辑
  const filteredChannels = channels.filter(channel => {
    const matchesSearch = !searchTerm || 
      channel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      channel.manager.toLowerCase().includes(searchTerm.toLowerCase()) ||
      channel.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !filterStatus || channel.status === filterStatus;
    const matchesType = !filterType || channel.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // 获取唯一的状态和类型
  const uniqueStatuses = [...new Set(channels.map(c => c.status))];
  const uniqueTypes = [...new Set(channels.map(c => c.type))];

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
        <h1 style={{ margin: 0, color: '#333' }}>📺 渠道管理</h1>
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
          ➕ 新增渠道
        </button>
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
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          alignItems: 'end'
        }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>
              🔍 搜索
            </label>
            <input
              type="text"
              placeholder="搜索渠道名称、负责人..."
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
              {uniqueStatuses.map(status => (
                <option key={status} value={status}>{getStatusText(status)}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>
              🏷️ 类型
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              <option value="">全部类型</option>
              {uniqueTypes.map(type => (
                <option key={type} value={type}>{getTypeText(type)}</option>
              ))}
            </select>
          </div>
          
          <div>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('');
                setFilterType('');
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

      {/* 渠道列表 */}
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
          alignItems: 'center'
        }}>
          <h2 style={{ margin: 0, color: '#333' }}>📺 渠道列表</h2>
          <div style={{ 
            fontSize: '14px', 
            color: '#666',
            backgroundColor: '#f8f9fa',
            padding: '8px 16px',
            borderRadius: '20px',
            border: '1px solid #e9ecef'
          }}>
            显示 {filteredChannels.length} / {channels.length} 条记录
          </div>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            minWidth: '900px'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e9ecef' }}>渠道名称</th>
                <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e9ecef' }}>类型</th>
                <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e9ecef' }}>负责人</th>
                <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e9ecef' }}>联系人</th>
                <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e9ecef' }}>电话</th>
                <th style={{ padding: '16px', textAlign: 'center', borderBottom: '1px solid #e9ecef' }}>状态</th>
                <th style={{ padding: '16px', textAlign: 'center', borderBottom: '1px solid #e9ecef' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredChannels.map((channel) => (
                <tr key={channel.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '16px' }}>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{channel.name}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>{channel.email}</div>
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      backgroundColor: '#e6f7ff',
                      color: '#1890ff',
                      border: '1px solid #91d5ff'
                    }}>
                      {getTypeText(channel.type)}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>{channel.manager}</td>
                  <td style={{ padding: '16px' }}>{channel.contact}</td>
                  <td style={{ padding: '16px' }}>{channel.phone}</td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      backgroundColor: '#f0f0f0',
                      color: getStatusColor(channel.status),
                      border: `1px solid ${getStatusColor(channel.status)}`
                    }}>
                      {getStatusText(channel.status)}
                    </span>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button
                        onClick={() => handleEdit(channel)}
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
                        编辑
                      </button>
                      <button
                        onClick={() => handleDelete(channel.id)}
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
            padding: '30px',
            borderRadius: '12px',
            width: '600px',
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h2 style={{ margin: '0 0 20px 0', color: '#333' }}>
              {editingChannel ? '编辑渠道' : '新增渠道'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    渠道名称 *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
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
                    类型 *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d9d9d9',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="">请选择类型</option>
                    <option value="app_store">应用商店</option>
                    <option value="google_play">Google Play</option>
                    <option value="huawei">华为应用市场</option>
                    <option value="xiaomi">小米应用商店</option>
                    <option value="oppo">OPPO软件商店</option>
                    <option value="vivo">vivo应用商店</option>
                    <option value="other">其他</option>
                  </select>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    负责人 *
                  </label>
                  <input
                    type="text"
                    value={formData.manager}
                    onChange={(e) => setFormData({...formData, manager: e.target.value})}
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
                    联系人
                  </label>
                  <input
                    type="text"
                    value={formData.contact}
                    onChange={(e) => setFormData({...formData, contact: e.target.value})}
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
                    电话
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
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
                    状态 *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d9d9d9',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="">请选择状态</option>
                    <option value="active">活跃</option>
                    <option value="inactive">非活跃</option>
                    <option value="suspended">暂停</option>
                    <option value="testing">测试中</option>
                  </select>
                </div>
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  邮箱
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
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
                    setEditingChannel(null);
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
                  {editingChannel ? '更新' : '创建'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChannelManagement;
