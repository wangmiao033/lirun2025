import React, { useState, useEffect } from 'react';

const SupplierManagement = () => {
  const [suppliers, setSuppliers] = useState([]);
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
    research: false,
    channels: false
  });
  
  // 搜索和筛选状态
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    fetchSuppliers();
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
        <h1 style={{ margin: 0, color: '#333' }}>🏢 供应商管理</h1>
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

      {/* 供应商列表 */}
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        marginBottom: '30px'
      }}>
        <div style={{ 
          padding: '20px', 
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ margin: 0, color: '#333' }}>🏢 供应商列表</h2>
          <div style={{ 
            fontSize: '14px', 
            color: '#666',
            backgroundColor: '#f8f9fa',
            padding: '8px 16px',
            borderRadius: '20px',
            border: '1px solid #e9ecef'
          }}>
            显示 {filteredSuppliers.length} / {suppliers.length} 条记录
          </div>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            minWidth: '800px'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e9ecef' }}>供应商名称</th>
                <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e9ecef' }}>类型</th>
                <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e9ecef' }}>联系人</th>
                <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e9ecef' }}>电话</th>
                <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e9ecef' }}>邮箱</th>
                <th style={{ padding: '16px', textAlign: 'center', borderBottom: '1px solid #e9ecef' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.map((supplier) => (
                <tr key={supplier.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '16px' }}>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{supplier.name}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>{supplier.address}</div>
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
                      {supplier.type}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>{supplier.contact}</td>
                  <td style={{ padding: '16px' }}>{supplier.phone}</td>
                  <td style={{ padding: '16px' }}>{supplier.email}</td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button
                        onClick={() => handleEdit(supplier)}
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
                        onClick={() => handleDelete(supplier.id)}
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
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '20px' 
            }}>
              {researchProjects.map((project) => (
                <div key={project.id} style={{
                  padding: '20px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  border: '1px solid #e9ecef'
                }}>
                  <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{project.name}</h3>
                  <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                    <div>负责人: {project.manager}</div>
                    <div>预算: ¥{project.budget?.toLocaleString()}</div>
                    <div>状态: {project.status}</div>
                  </div>
                  <div style={{ fontSize: '12px', color: '#999' }}>
                    {project.description}
                  </div>
                </div>
              ))}
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
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '20px' 
            }}>
              {channels.map((channel) => (
                <div key={channel.id} style={{
                  padding: '20px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  border: '1px solid #e9ecef'
                }}>
                  <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{channel.name}</h3>
                  <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                    <div>类型: {channel.type}</div>
                    <div>负责人: {channel.manager}</div>
                    <div>状态: {channel.status}</div>
                  </div>
                  <div style={{ fontSize: '12px', color: '#999' }}>
                    {channel.description}
                  </div>
                </div>
              ))}
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
