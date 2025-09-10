import React, { useState, useEffect } from 'react';

const ResearchManagement = () => {
  const [researchProjects, setResearchProjects] = useState([]);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    gameId: '',
    prepayment: '',
    status: '',
    revenueShare: '',
    channelFee: '',
    startDate: '',
    endDate: '',
    description: ''
  });
  
  // 搜索和筛选状态
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchResearchProjects();
    fetchGames();
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

  const fetchGames = async () => {
    try {
      const response = await fetch('/api/games');
      const result = await response.json();
      if (result.success) {
        setGames(result.data);
      }
    } catch (error) {
      console.error('获取游戏列表失败:', error);
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
      gameId: '',
      prepayment: '',
      status: '',
      revenueShare: '',
      channelFee: '',
      startDate: '',
      endDate: '',
      description: ''
    });
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      gameId: project.gameId?.toString() || '',
      prepayment: project.prepayment?.toString() || '',
      status: project.status,
      revenueShare: project.revenueShare?.toString() || '',
      channelFee: project.channelFee?.toString() || '',
      startDate: project.startDate || '',
      endDate: project.endDate || '',
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

  // 筛选逻辑
  const filteredProjects = researchProjects.filter(project => {
    const matchesSearch = !searchTerm || 
      (project.game && project.game.gameName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = !filterStatus || project.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // 获取唯一的状态
  const uniqueStatuses = [...new Set(researchProjects.map(p => p.status))];

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
        marginBottom: '24px',
        padding: '20px 24px',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <div>
          <h1 style={{ 
            margin: '0 0 4px 0', 
            color: '#2c3e50',
            fontSize: '28px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            🎮 游戏研发管理
          </h1>
          <p style={{ 
            margin: 0, 
            color: '#7f8c8d', 
            fontSize: '14px',
            fontWeight: '400'
          }}>
            管理游戏项目的预付款、分成比例和通道费
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
          }}
        >
          ➕ 新增游戏项目
        </button>
      </div>

      {/* 搜索和筛选区域 */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
        backdropFilter: 'blur(10px)',
        padding: '20px',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        marginBottom: '24px',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          alignItems: 'end'
        }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>
              🔍 搜索
            </label>
            <input
              type="text"
              placeholder="搜索游戏项目名称..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid rgba(102, 126, 234, 0.2)',
                borderRadius: '12px',
                fontSize: '14px',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)';
                e.target.style.boxShadow = 'none';
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
                padding: '12px 16px',
                border: '1px solid rgba(102, 126, 234, 0.2)',
                borderRadius: '12px',
                fontSize: '14px',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                outline: 'none',
                cursor: 'pointer'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <option value="">全部状态</option>
              {uniqueStatuses.map(status => (
                <option key={status} value={status}>{getStatusText(status)}</option>
              ))}
            </select>
          </div>
          
          
          <div>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('');
              }}
              style={{
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                color: '#495057',
                border: '1px solid rgba(102, 126, 234, 0.2)',
                padding: '12px 20px',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                width: '100%',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              🔄 重置筛选
            </button>
          </div>
        </div>
      </div>

      {/* 项目列表 */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <div style={{ 
          padding: '20px 24px', 
          borderBottom: '1px solid rgba(102, 126, 234, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)'
        }}>
          <h2 style={{ 
            margin: 0, 
            color: '#2c3e50',
            fontSize: '20px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            🎮 游戏项目列表
          </h2>
          <div style={{ 
            fontSize: '13px', 
            color: '#667eea',
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            padding: '6px 12px',
            borderRadius: '20px',
            border: '1px solid rgba(102, 126, 234, 0.2)',
            fontWeight: '500'
          }}>
            显示 {filteredProjects.length} / {researchProjects.length} 条记录
          </div>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            minWidth: '900px'
          }}>
            <thead>
              <tr style={{ 
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)'
              }}>
                <th style={{ 
                  padding: '16px 20px', 
                  textAlign: 'left', 
                  borderBottom: '1px solid rgba(102, 126, 234, 0.2)',
                  color: '#2c3e50',
                  fontWeight: '600',
                  fontSize: '14px'
                }}>项目名称</th>
                <th style={{ 
                  padding: '16px 20px', 
                  textAlign: 'right', 
                  borderBottom: '1px solid rgba(102, 126, 234, 0.2)',
                  color: '#2c3e50',
                  fontWeight: '600',
                  fontSize: '14px'
                }}>预付款</th>
                <th style={{ 
                  padding: '16px 20px', 
                  textAlign: 'center', 
                  borderBottom: '1px solid rgba(102, 126, 234, 0.2)',
                  color: '#2c3e50',
                  fontWeight: '600',
                  fontSize: '14px'
                }}>状态</th>
                <th style={{ 
                  padding: '16px 20px', 
                  textAlign: 'right', 
                  borderBottom: '1px solid rgba(102, 126, 234, 0.2)',
                  color: '#2c3e50',
                  fontWeight: '600',
                  fontSize: '14px'
                }}>分成比例</th>
                <th style={{ 
                  padding: '16px 20px', 
                  textAlign: 'right', 
                  borderBottom: '1px solid rgba(102, 126, 234, 0.2)',
                  color: '#2c3e50',
                  fontWeight: '600',
                  fontSize: '14px'
                }}>通道费</th>
                <th style={{ 
                  padding: '16px 20px', 
                  textAlign: 'center', 
                  borderBottom: '1px solid rgba(102, 126, 234, 0.2)',
                  color: '#2c3e50',
                  fontWeight: '600',
                  fontSize: '14px'
                }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project, index) => (
                <tr 
                  key={project.id} 
                  style={{ 
                    borderBottom: '1px solid rgba(102, 126, 234, 0.1)',
                    background: index % 2 === 0 ? 'rgba(255, 255, 255, 0.5)' : 'rgba(102, 126, 234, 0.02)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(102, 126, 234, 0.08)';
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = index % 2 === 0 ? 'rgba(255, 255, 255, 0.5)' : 'rgba(102, 126, 234, 0.02)';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ 
                      fontWeight: '600', 
                      color: '#2c3e50',
                      fontSize: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span style={{ fontSize: '18px' }}>{project.game?.icon || '🎮'}</span>
                      <div>
                        <div style={{ fontWeight: '600' }}>{project.game?.gameName || '未知游戏'}</div>
                        <div style={{ fontSize: '12px', color: '#7f8c8d' }}>
                          {project.game?.category} | {project.game?.platform}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <div style={{ 
                      fontWeight: '700', 
                      color: '#27ae60',
                      fontSize: '15px',
                      background: 'rgba(39, 174, 96, 0.1)',
                      padding: '4px 8px',
                      borderRadius: '8px',
                      display: 'inline-block'
                    }}>
                      ¥{project.prepayment?.toLocaleString() || '0'}
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '500',
                      backgroundColor: getStatusColor(project.status) + '20',
                      color: getStatusColor(project.status),
                      border: `1px solid ${getStatusColor(project.status)}40`,
                      display: 'inline-block'
                    }}>
                      {getStatusText(project.status)}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <div style={{ 
                      fontWeight: '700', 
                      color: '#667eea',
                      fontSize: '15px',
                      background: 'rgba(102, 126, 234, 0.1)',
                      padding: '4px 8px',
                      borderRadius: '8px',
                      display: 'inline-block'
                    }}>
                      {project.revenueShare || '0'}%
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <div style={{ 
                      fontWeight: '700', 
                      color: '#e67e22',
                      fontSize: '15px',
                      background: 'rgba(230, 126, 34, 0.1)',
                      padding: '4px 8px',
                      borderRadius: '8px',
                      display: 'inline-block'
                    }}>
                      ¥{project.channelFee?.toLocaleString() || '0'}
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button
                        onClick={() => handleEdit(project)}
                        style={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '500',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.3)';
                        }}
                      >
                        编辑
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        style={{
                          background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '500',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 2px 8px rgba(255, 107, 107, 0.3)'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 4px 12px rgba(255, 107, 107, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = '0 2px 8px rgba(255, 107, 107, 0.3)';
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
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
            backdropFilter: 'blur(20px)',
            padding: '32px',
            borderRadius: '20px',
            width: '700px',
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            animation: 'slideUp 0.3s ease'
          }}>
            <div style={{ 
              marginBottom: '24px',
              paddingBottom: '16px',
              borderBottom: '1px solid rgba(102, 126, 234, 0.1)'
            }}>
              <h2 style={{ 
                margin: '0 0 8px 0', 
                color: '#2c3e50',
                fontSize: '24px',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                🎮 {editingProject ? '编辑游戏项目' : '新增游戏项目'}
              </h2>
              <p style={{ 
                margin: 0, 
                color: '#7f8c8d', 
                fontSize: '14px' 
              }}>
                {editingProject ? '修改游戏项目信息' : '创建新的游戏项目'}
              </p>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontWeight: '600',
                    color: '#2c3e50',
                    fontSize: '14px'
                  }}>
                    选择游戏 *
                  </label>
                  <select
                    value={formData.gameId}
                    onChange={(e) => setFormData({...formData, gameId: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '1px solid rgba(102, 126, 234, 0.2)',
                      borderRadius: '12px',
                      fontSize: '14px',
                      background: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#667eea';
                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <option value="">请选择游戏</option>
                    {games.map(game => (
                      <option key={game.id} value={game.id}>
                        {game.icon} {game.gameName} - {game.category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontWeight: '600',
                    color: '#2c3e50',
                    fontSize: '14px'
                  }}>
                    预付款
                  </label>
                  <input
                    type="number"
                    value={formData.prepayment}
                    onChange={(e) => setFormData({...formData, prepayment: e.target.value})}
                    placeholder="0"
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '1px solid rgba(102, 126, 234, 0.2)',
                      borderRadius: '12px',
                      fontSize: '14px',
                      background: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#667eea';
                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontWeight: '600',
                    color: '#2c3e50',
                    fontSize: '14px'
                  }}>
                    状态 *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '1px solid rgba(102, 126, 234, 0.2)',
                      borderRadius: '12px',
                      fontSize: '14px',
                      background: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#667eea';
                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)';
                      e.target.style.boxShadow = 'none';
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
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontWeight: '600',
                    color: '#2c3e50',
                    fontSize: '14px'
                  }}>
                    开始日期
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '1px solid rgba(102, 126, 234, 0.2)',
                      borderRadius: '12px',
                      fontSize: '14px',
                      background: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#667eea';
                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontWeight: '600',
                    color: '#2c3e50',
                    fontSize: '14px'
                  }}>
                    结束日期
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '1px solid rgba(102, 126, 234, 0.2)',
                      borderRadius: '12px',
                      fontSize: '14px',
                      background: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#667eea';
                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontWeight: '600',
                    color: '#2c3e50',
                    fontSize: '14px'
                  }}>
                    分成比例
                  </label>
                  <input
                    type="number"
                    value={formData.revenueShare}
                    onChange={(e) => setFormData({...formData, revenueShare: e.target.value})}
                    placeholder="0"
                    min="0"
                    max="100"
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '1px solid rgba(102, 126, 234, 0.2)',
                      borderRadius: '12px',
                      fontSize: '14px',
                      background: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#667eea';
                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontWeight: '600',
                    color: '#2c3e50',
                    fontSize: '14px'
                  }}>
                    通道费
                  </label>
                  <input
                    type="number"
                    value={formData.channelFee}
                    onChange={(e) => setFormData({...formData, channelFee: e.target.value})}
                    placeholder="0"
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '1px solid rgba(102, 126, 234, 0.2)',
                      borderRadius: '12px',
                      fontSize: '14px',
                      background: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#667eea';
                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>
              
              
              <div style={{ marginBottom: '32px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '600',
                  color: '#2c3e50',
                  fontSize: '14px'
                }}>
                  游戏项目描述
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
                  placeholder="描述游戏项目的基本信息、特色玩法等..."
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: '1px solid rgba(102, 126, 234, 0.2)',
                    borderRadius: '12px',
                    fontSize: '14px',
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              
              <div style={{ 
                display: 'flex', 
                gap: '16px', 
                justifyContent: 'flex-end',
                paddingTop: '20px',
                borderTop: '1px solid rgba(102, 126, 234, 0.1)'
              }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingProject(null);
                    resetForm();
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                    color: '#495057',
                    border: '1px solid rgba(102, 126, 234, 0.2)',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  ❌ 取消
                </button>
                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                  }}
                >
                  {editingProject ? '✅ 更新项目' : '➕ 创建项目'}
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
