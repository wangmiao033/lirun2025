import React, { useState, useEffect } from 'react';

const ProfitManagement = () => {
  const [profits, setProfits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProfit, setEditingProfit] = useState(null);
  const [formData, setFormData] = useState({
    department: '',
    project: '',
    revenue: '',
    cost: '',
    date: '',
    description: ''
  });

  useEffect(() => {
    fetchProfits();
  }, []);

  const fetchProfits = async () => {
    try {
      const response = await fetch('/api/profits');
      const result = await response.json();
      if (result.success) {
        setProfits(result.data);
      }
    } catch (error) {
      console.error('获取利润数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingProfit ? `/api/profits/${editingProfit.id}` : '/api/profits';
      const method = editingProfit ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      if (result.success) {
        fetchProfits();
        setShowModal(false);
        setEditingProfit(null);
        setFormData({
          department: '',
          project: '',
          revenue: '',
          cost: '',
          date: '',
          description: ''
        });
      } else {
        alert(result.message || '操作失败');
      }
    } catch (error) {
      console.error('操作失败:', error);
      alert('操作失败');
    }
  };

  const handleEdit = (profit) => {
    setEditingProfit(profit);
    setFormData({
      department: profit.department,
      project: profit.project,
      revenue: profit.revenue.toString(),
      cost: profit.cost.toString(),
      date: profit.date,
      description: profit.description
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('确定要删除这条记录吗？')) return;
    
    try {
      const response = await fetch(`/api/profits/${id}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      if (result.success) {
        fetchProfits();
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
        <h1 style={{ margin: 0, color: '#333' }}>利润数据管理</h1>
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
          ➕ 新增利润记录
        </button>
      </div>

      {/* 数据表格 */}
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            minWidth: '800px'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e9ecef' }}>部门</th>
                <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e9ecef' }}>项目</th>
                <th style={{ padding: '16px', textAlign: 'right', borderBottom: '1px solid #e9ecef' }}>收入</th>
                <th style={{ padding: '16px', textAlign: 'right', borderBottom: '1px solid #e9ecef' }}>成本</th>
                <th style={{ padding: '16px', textAlign: 'right', borderBottom: '1px solid #e9ecef' }}>利润</th>
                <th style={{ padding: '16px', textAlign: 'right', borderBottom: '1px solid #e9ecef' }}>利润率</th>
                <th style={{ padding: '16px', textAlign: 'center', borderBottom: '1px solid #e9ecef' }}>日期</th>
                <th style={{ padding: '16px', textAlign: 'center', borderBottom: '1px solid #e9ecef' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {profits.map((profit) => (
                <tr key={profit.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '16px' }}>{profit.department}</td>
                  <td style={{ padding: '16px' }}>{profit.project}</td>
                  <td style={{ padding: '16px', textAlign: 'right', color: '#52c41a', fontWeight: 'bold' }}>
                    {formatCurrency(profit.revenue)}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right', color: '#fa8c16', fontWeight: 'bold' }}>
                    {formatCurrency(profit.cost)}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right', color: '#1890ff', fontWeight: 'bold' }}>
                    {formatCurrency(profit.profit)}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right', color: '#faad14', fontWeight: 'bold' }}>
                    {profit.profitRate}%
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>{profit.date}</td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <button
                      onClick={() => handleEdit(profit)}
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
                      onClick={() => handleDelete(profit.id)}
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
            width: '500px',
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h2 style={{ margin: '0 0 20px 0', color: '#333' }}>
              {editingProfit ? '编辑利润记录' : '新增利润记录'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  部门 *
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
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
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  项目 *
                </label>
                <input
                  type="text"
                  value={formData.project}
                  onChange={(e) => setFormData({...formData, project: e.target.value})}
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
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    收入 *
                  </label>
                  <input
                    type="number"
                    value={formData.revenue}
                    onChange={(e) => setFormData({...formData, revenue: e.target.value})}
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
                    成本 *
                  </label>
                  <input
                    type="number"
                    value={formData.cost}
                    onChange={(e) => setFormData({...formData, cost: e.target.value})}
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
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  日期 *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
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
                    setEditingProfit(null);
                    setFormData({
                      department: '',
                      project: '',
                      revenue: '',
                      cost: '',
                      date: '',
                      description: ''
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
                  {editingProfit ? '更新' : '创建'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfitManagement;
