import React, { useState, useEffect } from 'react';

const ResearchManagement = () => {
  const [researchProjects, setResearchProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    projectCode: '',
    projectName: '',
    manager: '',
    projectType: '',
    budget: '',
    startDate: '',
    endDate: '',
    status: '',
    description: ''
  });
  
  // 搜索和筛选状态
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    fetchResearchProjects();
  }, []);

  const fetchResearchProjects = async () => {
    try {
      const response = await fetch('/api/research-projects');
      const result = await response.json();
      if (result.success) {
        setResearchProjects(result.data);
      }
    } catch (error) {
      console.error('获取研发项目数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingProject ? `/api/research-projects/${editingProject.id}` : '/api/research-projects';
      const method = editingProject ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      if (result.success) {
        fetchResearchProjects();
        setShowModal(false);
        setEditingProject(null);
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
      projectCode: '',
      projectName: '',
      manager: '',
      projectType: '',
      budget: '',
      startDate: '',
      endDate: '',
      status: '',
      description: ''
    });
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      projectCode: project.projectCode,
      projectName: project.projectName,
      manager: project.manager,
      projectType: project.projectType,
      budget: project.budget?.toString() || '',
      startDate: project.startDate,
      endDate: project.endDate,
      status: project.status,
      description: project.description
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('确定要删除这个研发项目吗？')) return;
    
    try {
      const response = await fetch(`/api/research-projects/${id}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      if (result.success) {
        fetchResearchProjects();
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
      case 'planning': return '#1890ff';
      case 'active': return '#52c41a';
      case 'completed': return '#52c41a';
      case 'suspended': return '#faad14';
      case 'cancelled': return '#ff4d4f';
      default: return '#666';
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      'planning': '规划中',
      'active': '进行中',
      'completed': '已完成',
      'suspended': '暂停',
      'cancelled': '已取消'
    };
    return statusMap[status] || status;
  };

  const getTypeText = (type) => {
    const typeMap = {
      'basic': '基础研究',
      'applied': '应用研究',
      'development': '开发研究',
      'innovation': '创新研究'
    };
    return typeMap[type] || type;
  };

  // 筛选逻辑
  const filteredProjects = researchProjects.filter(project => {
    const matchesSearch = !searchTerm || 
      project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.projectCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.manager.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !filterStatus || project.status === filterStatus;
    const matchesType = !filterType || project.projectType === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // 获取唯一的状态和类型
  const uniqueStatuses = [...new Set(researchProjects.map(p => p.status))];
  const uniqueTypes = [...new Set(researchProjects.map(p => p.projectType))];

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
        <h1 style={{ margin: 0, color: '#333' }}>🔬 研发管理</h1>
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
          ➕ 新增项目
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
              placeholder="搜索项目名称、编号、负责人..."
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

      {/* 项目列表 */}
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
          <h2 style={{ margin: 0, color: '#333' }}>🔬 研发项目列表</h2>
          <div style={{ 
            fontSize: '14px', 
            color: '#666',
            backgroundColor: '#f8f9fa',
            padding: '8px 16px',
            borderRadius: '20px',
            border: '1px solid #e9ecef'
          }}>
            显示 {filteredProjects.length} / {researchProjects.length} 条记录
          </div>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            minWidth: '1000px'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e9ecef' }}>项目编号</th>
                <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e9ecef' }}>项目名称</th>
                <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e9ecef' }}>负责人</th>
                <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e9ecef' }}>类型</th>
                <th style={{ padding: '16px', textAlign: 'right', borderBottom: '1px solid #e9ecef' }}>预算</th>
                <th style={{ padding: '16px', textAlign: 'center', borderBottom: '1px solid #e9ecef' }}>状态</th>
                <th style={{ padding: '16px', textAlign: 'center', borderBottom: '1px solid #e9ecef' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => (
                <tr key={project.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontWeight: 'bold', color: '#1890ff' }}>{project.projectCode}</div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{project.projectName}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        {project.startDate} - {project.endDate}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>{project.manager}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      backgroundColor: '#e6f7ff',
                      color: '#1890ff',
                      border: '1px solid #91d5ff'
                    }}>
                      {getTypeText(project.projectType)}
                    </span>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right', fontWeight: 'bold', color: '#52c41a' }}>
                    ¥{project.budget?.toLocaleString()}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      backgroundColor: '#f0f0f0',
                      color: getStatusColor(project.status),
                      border: `1px solid ${getStatusColor(project.status)}`
                    }}>
                      {getStatusText(project.status)}
                    </span>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button
                        onClick={() => handleEdit(project)}
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
                        onClick={() => handleDelete(project.id)}
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
            width: '700px',
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h2 style={{ margin: '0 0 20px 0', color: '#333' }}>
              {editingProject ? '编辑研发项目' : '新增研发项目'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    项目编号 *
                  </label>
                  <input
                    type="text"
                    value={formData.projectCode}
                    onChange={(e) => setFormData({...formData, projectCode: e.target.value})}
                    required
                    placeholder="如：RD2025001"
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
                    项目名称 *
                  </label>
                  <input
                    type="text"
                    value={formData.projectName}
                    onChange={(e) => setFormData({...formData, projectName: e.target.value})}
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
                    项目类型 *
                  </label>
                  <select
                    value={formData.projectType}
                    onChange={(e) => setFormData({...formData, projectType: e.target.value})}
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
                    <option value="basic">基础研究</option>
                    <option value="applied">应用研究</option>
                    <option value="development">开发研究</option>
                    <option value="innovation">创新研究</option>
                  </select>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    预算
                  </label>
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
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
                    <option value="planning">规划中</option>
                    <option value="active">进行中</option>
                    <option value="completed">已完成</option>
                    <option value="suspended">暂停</option>
                    <option value="cancelled">已取消</option>
                  </select>
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
                  项目描述
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
                    setEditingProject(null);
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
                  {editingProject ? '更新' : '创建'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResearchManagement;
