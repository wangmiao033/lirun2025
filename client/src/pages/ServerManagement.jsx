import React, { useState, useEffect } from 'react';

const ServerManagement = () => {
  const [servers, setServers] = useState([]);
  const [games, setGames] = useState([]);
  const [statistics, setStatistics] = useState({
    totalServers: 0,
    runningServers: 0,
    totalMonthlyCost: 0,
    totalAnnualCost: 0,
    gameStats: {}
  });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingServer, setEditingServer] = useState(null);
  const [formData, setFormData] = useState({
    gameId: '',
    serverName: '',
    instanceId: '',
    region: '',
    instanceType: '',
    cpu: '',
    memory: '',
    disk: '',
    bandwidth: '',
    monthlyCost: '',
    status: '运行中',
    startDate: '',
    endDate: '',
    description: ''
  });

  useEffect(() => {
    fetchServers();
    fetchStatistics();
    fetchGames();
  }, []);

  const fetchServers = async () => {
    try {
      const response = await fetch('/api/servers');
      const result = await response.json();
      if (result.success) {
        setServers(result.data);
      }
    } catch (error) {
      console.error('获取服务器数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await fetch('/api/server-statistics');
      const result = await response.json();
      if (result.success) {
        setStatistics(result.data);
      }
    } catch (error) {
      console.error('获取服务器统计失败:', error);
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
      const url = editingServer ? `/api/servers/${editingServer.id}` : '/api/servers';
      const method = editingServer ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      if (result.success) {
        fetchServers();
        fetchStatistics();
        setShowModal(false);
        setEditingServer(null);
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
      serverName: '',
      instanceId: '',
      region: '',
      instanceType: '',
      cpu: '',
      memory: '',
      disk: '',
      bandwidth: '',
      monthlyCost: '',
      status: '运行中',
      startDate: '',
      endDate: '',
      description: ''
    });
  };

  const handleEdit = (server) => {
    setEditingServer(server);
    setFormData({
      gameId: server.gameId?.toString() || '',
      serverName: server.serverName,
      instanceId: server.instanceId,
      region: server.region,
      instanceType: server.instanceType,
      cpu: server.cpu,
      memory: server.memory,
      disk: server.disk,
      bandwidth: server.bandwidth,
      monthlyCost: server.monthlyCost.toString(),
      status: server.status,
      startDate: server.startDate,
      endDate: server.endDate,
      description: server.description
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('确定要删除这台服务器吗？')) return;
    
    try {
      const response = await fetch(`/api/servers/${id}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      if (result.success) {
        fetchServers();
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
        <h1 style={{ margin: 0, color: '#333' }}>服务器管理</h1>
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
          ➕ 新增服务器
        </button>
      </div>

      {/* 统计卡片 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '24px',
        marginBottom: '30px'
      }}>
        <div style={{
          padding: '24px',
          backgroundColor: '#f6ffed',
          border: '2px solid #b7eb8f',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#52c41a', margin: '0 0 15px 0', fontSize: '1.2rem' }}>
            🖥️ 服务器总数
          </h3>
          <h2 style={{ color: '#52c41a', margin: '0', fontSize: '2rem', fontWeight: 'bold' }}>
            {statistics.totalServers}
          </h2>
        </div>

        <div style={{
          padding: '24px',
          backgroundColor: '#e6f7ff',
          border: '2px solid #91d5ff',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#1890ff', margin: '0 0 15px 0', fontSize: '1.2rem' }}>
            ✅ 运行中
          </h3>
          <h2 style={{ color: '#1890ff', margin: '0', fontSize: '2rem', fontWeight: 'bold' }}>
            {statistics.runningServers}
          </h2>
        </div>

        <div style={{
          padding: '24px',
          backgroundColor: '#fff2e8',
          border: '2px solid #ffbb96',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#fa8c16', margin: '0 0 15px 0', fontSize: '1.2rem' }}>
            💰 月成本
          </h3>
          <h2 style={{ color: '#fa8c16', margin: '0', fontSize: '2rem', fontWeight: 'bold' }}>
            {formatCurrency(statistics.totalMonthlyCost)}
          </h2>
        </div>

        <div style={{
          padding: '24px',
          backgroundColor: '#fffbe6',
          border: '2px solid #ffe58f',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#faad14', margin: '0 0 15px 0', fontSize: '1.2rem' }}>
            📊 年成本
          </h3>
          <h2 style={{ color: '#faad14', margin: '0', fontSize: '2rem', fontWeight: 'bold' }}>
            {formatCurrency(statistics.totalAnnualCost)}
          </h2>
        </div>
      </div>

      {/* 按游戏统计 */}
      <div style={{
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <h2 style={{ margin: '0 0 30px 0', color: '#333' }}>🎮 按游戏统计</h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {Object.entries(statistics.gameStats).map(([game, stats]) => (
            <div key={game} style={{
              padding: '20px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              border: '1px solid #e9ecef'
            }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>{game}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#666' }}>服务器数</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1890ff' }}>
                    {stats.count}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#666' }}>运行中</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#52c41a' }}>
                    {stats.running}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#666' }}>月成本</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#fa8c16' }}>
                    {formatCurrency(stats.monthlyCost)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 服务器列表 */}
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #f0f0f0' }}>
          <h2 style={{ margin: 0, color: '#333' }}>🖥️ 服务器列表</h2>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            minWidth: '1000px'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e9ecef' }}>服务器名称</th>
                <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e9ecef' }}>实例ID</th>
                <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e9ecef' }}>游戏</th>
                <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e9ecef' }}>配置</th>
                <th style={{ padding: '16px', textAlign: 'right', borderBottom: '1px solid #e9ecef' }}>月成本</th>
                <th style={{ padding: '16px', textAlign: 'center', borderBottom: '1px solid #e9ecef' }}>状态</th>
                <th style={{ padding: '16px', textAlign: 'center', borderBottom: '1px solid #e9ecef' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {servers.map((server) => (
                <tr key={server.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '16px' }}>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{server.serverName}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>{server.region}</div>
                    </div>
                  </td>
                  <td style={{ padding: '16px', fontFamily: 'monospace', fontSize: '12px' }}>
                    {server.instanceId}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ 
                      fontWeight: '600', 
                      color: '#2c3e50',
                      fontSize: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span style={{ fontSize: '18px' }}>{server.game?.icon || '🎮'}</span>
                      <div>
                        <div style={{ fontWeight: '600' }}>{server.game?.gameName || '未知游戏'}</div>
                        <div style={{ fontSize: '12px', color: '#7f8c8d' }}>
                          {server.game?.category} | {server.game?.platform}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontSize: '12px' }}>
                      <div>{server.instanceType}</div>
                      <div>{server.cpu} / {server.memory}</div>
                      <div>{server.disk} / {server.bandwidth}</div>
                    </div>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right', color: '#fa8c16', fontWeight: 'bold' }}>
                    {formatCurrency(server.monthlyCost)}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      backgroundColor: server.status === '运行中' ? '#f6ffed' : '#fff2f0',
                      color: server.status === '运行中' ? '#52c41a' : '#ff4d4f',
                      border: `1px solid ${server.status === '运行中' ? '#b7eb8f' : '#ffccc7'}`
                    }}>
                      {server.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <button
                      onClick={() => handleEdit(server)}
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
                      onClick={() => handleDelete(server.id)}
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
            width: '800px',
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h2 style={{ margin: '0 0 20px 0', color: '#333' }}>
              {editingServer ? '编辑服务器' : '新增服务器'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    服务器名称 *
                  </label>
                  <input
                    type="text"
                    value={formData.serverName}
                    onChange={(e) => setFormData({...formData, serverName: e.target.value})}
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
                    实例ID *
                  </label>
                  <input
                    type="text"
                    value={formData.instanceId}
                    onChange={(e) => setFormData({...formData, instanceId: e.target.value})}
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
                    选择游戏 *
                  </label>
                  <select
                    value={formData.gameId}
                    onChange={(e) => setFormData({...formData, gameId: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d9d9d9',
                      borderRadius: '6px',
                      fontSize: '14px'
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
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    地区
                  </label>
                  <input
                    type="text"
                    value={formData.region}
                    onChange={(e) => setFormData({...formData, region: e.target.value})}
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    CPU
                  </label>
                  <input
                    type="text"
                    value={formData.cpu}
                    onChange={(e) => setFormData({...formData, cpu: e.target.value})}
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
                    内存
                  </label>
                  <input
                    type="text"
                    value={formData.memory}
                    onChange={(e) => setFormData({...formData, memory: e.target.value})}
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
                    磁盘
                  </label>
                  <input
                    type="text"
                    value={formData.disk}
                    onChange={(e) => setFormData({...formData, disk: e.target.value})}
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    带宽
                  </label>
                  <input
                    type="text"
                    value={formData.bandwidth}
                    onChange={(e) => setFormData({...formData, bandwidth: e.target.value})}
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
                    月成本 *
                  </label>
                  <input
                    type="number"
                    value={formData.monthlyCost}
                    onChange={(e) => setFormData({...formData, monthlyCost: e.target.value})}
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
                    状态
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d9d9d9',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="运行中">运行中</option>
                    <option value="已停止">已停止</option>
                    <option value="维护中">维护中</option>
                  </select>
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
                    setEditingServer(null);
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
                  {editingServer ? '更新' : '创建'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServerManagement;
