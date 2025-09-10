import React, { useState, useEffect } from 'react';

const SupplierManagement = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [servers, setServers] = useState([]);
  const [advertisingFees, setAdvertisingFees] = useState([]);
  const [researchProjects, setResearchProjects] = useState([]);
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    contact: '',
    phone: '',
    email: '',
    address: '',
    description: ''
  });
  
  // 折叠状态管理
  const [collapsedSections, setCollapsedSections] = useState({
    servers: false,
    advertising: false,
    research: false,
    channels: false
  });
  
  // 搜索和筛选状态
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    fetchSuppliers();
    fetchServers();
    fetchAdvertisingFees();
    fetchResearchProjects();
    fetchChannels();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await fetch('/api/suppliers');
      const result = await response.json();
      if (result.success) {
        setSuppliers(result.data);
      }
    } catch (error) {
      console.error('获取供应商数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchServers = async () => {
    try {
      const response = await fetch('/api/servers');
      const result = await response.json();
      if (result.success) {
        setServers(result.data);
      }
    } catch (error) {
      console.error('获取服务器数据失败:', error);
    }
  };

  const fetchAdvertisingFees = async () => {
    try {
      const response = await fetch('/api/advertising-fees');
      const result = await response.json();
      if (result.success) {
        setAdvertisingFees(result.data);
      }
    } catch (error) {
      console.error('获取广告费数据失败:', error);
    }
  };

  const fetchResearchProjects = async () => {
    try {
      const response = await fetch('/api/research-projects');
      const result = await response.json();
      if (result.success) {
        setResearchProjects(result.data);
      }
    } catch (error) {
      console.error('获取研发项目数据失败:', error);
    }
  };

  const fetchChannels = async () => {
    try {
      const response = await fetch('/api/channels');
      const result = await response.json();
      if (result.success) {
        setChannels(result.data);
      }
    } catch (error) {
      console.error('获取渠道数据失败:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingSupplier ? `/api/suppliers/${editingSupplier.id}` : '/api/suppliers';
      const method = editingSupplier ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      if (result.success) {
        fetchSuppliers();
        setShowModal(false);
        setEditingSupplier(null);
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
      contact: '',
      phone: '',
      email: '',
      address: '',
      description: ''
    });
  };

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      name: supplier.name,
      type: supplier.type,
      contact: supplier.contact,
      phone: supplier.phone,
      email: supplier.email,
      address: supplier.address,
      description: supplier.description
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('确定要删除这个供应商吗？')) return;
    
    try {
      const response = await fetch(`/api/suppliers/${id}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      if (result.success) {
        fetchSuppliers();
      } else {
        alert(result.message || '删除失败');
      }
    } catch (error) {
      console.error('删除失败:', error);
      alert('删除失败');
    }
  };

  const toggleSection = (section) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // 筛选逻辑
  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = !searchTerm || 
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !filterType || supplier.type === filterType;
    
    return matchesSearch && matchesType;
  });

  // 获取唯一的供应商类型
  const uniqueTypes = [...new Set(suppliers.map(s => s.type))];

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
        <div>
          <h1 style={{ margin: '0 0 10px 0', color: '#333' }}>🏢 供应商管理</h1>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
            统一管理供应商、服务器、广告费、研发项目和渠道信息
          </p>
        </div>
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
          ➕ 新增供应商
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
              placeholder="搜索供应商名称、联系人..."
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
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div>
            <button
              onClick={() => {
                setSearchTerm('');
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

      {/* 服务器管理模块（可折叠） */}
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        marginBottom: '30px'
      }}>
        <div 
          style={{ 
            padding: '20px', 
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            backgroundColor: '#f8f9fa'
          }}
          onClick={() => toggleSection('servers')}
        >
          <h2 style={{ margin: 0, color: '#333', display: 'flex', alignItems: 'center', gap: '10px' }}>
            🖥️ 服务器管理
            <span style={{ fontSize: '14px', color: '#666', fontWeight: 'normal' }}>
              ({servers.length} 台服务器)
            </span>
          </h2>
          <div style={{ 
            fontSize: '20px', 
            color: '#666',
            transform: collapsedSections.servers ? 'rotate(0deg)' : 'rotate(180deg)',
            transition: 'transform 0.3s ease'
          }}>
            ▼
          </div>
        </div>
        
        {!collapsedSections.servers && (
          <div style={{ padding: '20px' }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '20px' 
            }}>
              {servers.map((server) => (
                <div key={server.id} style={{
                  padding: '20px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  border: '1px solid #e9ecef'
                }}>
                  <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{server.name}</h3>
                  <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                    <div>IP: {server.ip}</div>
                    <div>状态: {server.status}</div>
                    <div>配置: {server.config}</div>
                  </div>
                  <div style={{ fontSize: '12px', color: '#999' }}>
                    {server.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 广告费管理模块（可折叠） */}
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        marginBottom: '30px'
      }}>
        <div 
          style={{ 
            padding: '20px', 
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            backgroundColor: '#f8f9fa'
          }}
          onClick={() => toggleSection('advertising')}
        >
          <h2 style={{ margin: 0, color: '#333', display: 'flex', alignItems: 'center', gap: '10px' }}>
            📢 广告费管理
            <span style={{ fontSize: '14px', color: '#666', fontWeight: 'normal' }}>
              ({advertisingFees.length} 个广告)
            </span>
          </h2>
          <div style={{ 
            fontSize: '20px', 
            color: '#666',
            transform: collapsedSections.advertising ? 'rotate(0deg)' : 'rotate(180deg)',
            transition: 'transform 0.3s ease'
          }}>
            ▼
          </div>
        </div>
        
        {!collapsedSections.advertising && (
          <div style={{ padding: '20px' }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '20px' 
            }}>
              {advertisingFees.map((ad) => (
                <div key={ad.id} style={{
                  padding: '20px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  border: '1px solid #e9ecef'
                }}>
                  <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{ad.campaignName}</h3>
                  <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                    <div>平台: {ad.platform}</div>
                    <div>费用: ¥{ad.amount?.toLocaleString()}</div>
                    <div>状态: {ad.status}</div>
                  </div>
                  <div style={{ fontSize: '12px', color: '#999' }}>
                    {ad.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 研发管理模块（可折叠） */}
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        marginBottom: '30px'
      }}>
        <div 
          style={{ 
            padding: '20px', 
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            backgroundColor: '#f8f9fa'
          }}
          onClick={() => toggleSection('research')}
        >
          <h2 style={{ margin: 0, color: '#333', display: 'flex', alignItems: 'center', gap: '10px' }}>
            🔬 研发管理
            <span style={{ fontSize: '14px', color: '#666', fontWeight: 'normal' }}>
              ({researchProjects.length} 个项目)
            </span>
          </h2>
          <div style={{ 
            fontSize: '20px', 
            color: '#666',
            transform: collapsedSections.research ? 'rotate(0deg)' : 'rotate(180deg)',
            transition: 'transform 0.3s ease'
          }}>
            ▼
          </div>
        </div>
        
        {!collapsedSections.research && (
          <div style={{ padding: '20px' }}>
            {/* 研发项目操作栏 */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h3 style={{ margin: 0, color: '#333' }}>研发项目列表</h3>
              <button
                onClick={() => {
                  // 这里可以添加新增研发项目的逻辑
                  alert('新增研发项目功能');
                }}
                style={{
                  backgroundColor: '#52c41a',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                ➕ 新增项目
              </button>
            </div>
            
            {/* 研发项目表格 */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                minWidth: '800px'
              }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e9ecef' }}>项目编号</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e9ecef' }}>项目名称</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e9ecef' }}>负责人</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e9ecef' }}>类型</th>
                    <th style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #e9ecef' }}>预算</th>
                    <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e9ecef' }}>状态</th>
                    <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e9ecef' }}>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {researchProjects.map((project) => (
                    <tr key={project.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '12px' }}>
                        <div style={{ fontWeight: 'bold', color: '#1890ff' }}>{project.projectCode}</div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div>
                          <div style={{ fontWeight: 'bold' }}>{project.projectName}</div>
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            {project.startDate} - {project.endDate}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px' }}>{project.manager}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          backgroundColor: '#e6f7ff',
                          color: '#1890ff',
                          border: '1px solid #91d5ff'
                        }}>
                          {project.projectType === 'development' ? '开发研究' : 
                           project.projectType === 'applied' ? '应用研究' : 
                           project.projectType === 'basic' ? '基础研究' : 
                           project.projectType === 'innovation' ? '创新研究' : project.projectType}
                        </span>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', color: '#52c41a' }}>
                        ¥{project.budget?.toLocaleString()}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          backgroundColor: '#f0f0f0',
                          color: project.status === 'active' ? '#52c41a' : 
                                project.status === 'planning' ? '#1890ff' : 
                                project.status === 'completed' ? '#52c41a' : '#faad14',
                          border: `1px solid ${project.status === 'active' ? '#52c41a' : 
                                          project.status === 'planning' ? '#1890ff' : 
                                          project.status === 'completed' ? '#52c41a' : '#faad14'}`
                        }}>
                          {project.status === 'active' ? '进行中' : 
                           project.status === 'planning' ? '规划中' : 
                           project.status === 'completed' ? '已完成' : 
                           project.status === 'suspended' ? '暂停' : 
                           project.status === 'cancelled' ? '已取消' : project.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button
                            onClick={() => {
                              // 这里可以添加编辑研发项目的逻辑
                              alert('编辑研发项目功能');
                            }}
                            style={{
                              backgroundColor: '#1890ff',
                              color: 'white',
                              border: 'none',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >
                            编辑
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('确定要删除这个研发项目吗？')) {
                                // 这里可以添加删除研发项目的逻辑
                                alert('删除研发项目功能');
                              }
                            }}
                            style={{
                              backgroundColor: '#ff4d4f',
                              color: 'white',
                              border: 'none',
                              padding: '4px 8px',
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
        )}
      </div>

      {/* 渠道管理模块（可折叠） */}
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        marginBottom: '30px'
      }}>
        <div 
          style={{ 
            padding: '20px', 
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            backgroundColor: '#f8f9fa'
          }}
          onClick={() => toggleSection('channels')}
        >
          <h2 style={{ margin: 0, color: '#333', display: 'flex', alignItems: 'center', gap: '10px' }}>
            📺 渠道管理
            <span style={{ fontSize: '14px', color: '#666', fontWeight: 'normal' }}>
              ({channels.length} 个渠道)
            </span>
          </h2>
          <div style={{ 
            fontSize: '20px', 
            color: '#666',
            transform: collapsedSections.channels ? 'rotate(0deg)' : 'rotate(180deg)',
            transition: 'transform 0.3s ease'
          }}>
            ▼
          </div>
        </div>
        
        {!collapsedSections.channels && (
          <div style={{ padding: '20px' }}>
            {/* 渠道操作栏 */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h3 style={{ margin: 0, color: '#333' }}>渠道列表</h3>
              <button
                onClick={() => {
                  // 这里可以添加新增渠道的逻辑
                  alert('新增渠道功能');
                }}
                style={{
                  backgroundColor: '#52c41a',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                ➕ 新增渠道
              </button>
            </div>
            
            {/* 渠道表格 */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                minWidth: '900px'
              }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e9ecef' }}>渠道名称</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e9ecef' }}>类型</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e9ecef' }}>负责人</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e9ecef' }}>联系人</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e9ecef' }}>电话</th>
                    <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e9ecef' }}>状态</th>
                    <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e9ecef' }}>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {channels.map((channel) => (
                    <tr key={channel.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '12px' }}>
                        <div>
                          <div style={{ fontWeight: 'bold' }}>{channel.name}</div>
                          <div style={{ fontSize: '12px', color: '#666' }}>{channel.email}</div>
                        </div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          backgroundColor: '#e6f7ff',
                          color: '#1890ff',
                          border: '1px solid #91d5ff'
                        }}>
                          {channel.type === 'app_store' ? '应用商店' :
                           channel.type === 'google_play' ? 'Google Play' :
                           channel.type === 'huawei' ? '华为应用市场' :
                           channel.type === 'xiaomi' ? '小米应用商店' :
                           channel.type === 'oppo' ? 'OPPO软件商店' :
                           channel.type === 'vivo' ? 'vivo应用商店' :
                           channel.type === 'other' ? '其他' : channel.type}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>{channel.manager}</td>
                      <td style={{ padding: '12px' }}>{channel.contact}</td>
                      <td style={{ padding: '12px' }}>{channel.phone}</td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          backgroundColor: '#f0f0f0',
                          color: channel.status === 'active' ? '#52c41a' : 
                                channel.status === 'inactive' ? '#faad14' : 
                                channel.status === 'suspended' ? '#ff4d4f' : '#1890ff',
                          border: `1px solid ${channel.status === 'active' ? '#52c41a' : 
                                          channel.status === 'inactive' ? '#faad14' : 
                                          channel.status === 'suspended' ? '#ff4d4f' : '#1890ff'}`
                        }}>
                          {channel.status === 'active' ? '活跃' : 
                           channel.status === 'inactive' ? '非活跃' : 
                           channel.status === 'suspended' ? '暂停' : 
                           channel.status === 'testing' ? '测试中' : channel.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button
                            onClick={() => {
                              // 这里可以添加编辑渠道的逻辑
                              alert('编辑渠道功能');
                            }}
                            style={{
                              backgroundColor: '#1890ff',
                              color: 'white',
                              border: 'none',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >
                            编辑
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('确定要删除这个渠道吗？')) {
                                // 这里可以添加删除渠道的逻辑
                                alert('删除渠道功能');
                              }
                            }}
                            style={{
                              backgroundColor: '#ff4d4f',
                              color: 'white',
                              border: 'none',
                              padding: '4px 8px',
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
        )}
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
              {editingSupplier ? '编辑供应商' : '新增供应商'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    供应商名称 *
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
                    <option value="研发商">研发商</option>
                    <option value="渠道商">渠道商</option>
                    <option value="服务商">服务商</option>
                    <option value="供应商">供应商</option>
                  </select>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
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
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  地址
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
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
                    setEditingSupplier(null);
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
                  {editingSupplier ? '更新' : '创建'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierManagement;
