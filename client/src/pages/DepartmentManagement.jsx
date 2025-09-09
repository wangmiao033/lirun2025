import React, { useState, useEffect } from 'react';

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    manager: '',
    budget: '',
    description: ''
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await fetch('/api/departments');
      const result = await response.json();
      if (result.success) {
        setDepartments(result.data);
      }
    } catch (error) {
      console.error('获取部门数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingDepartment ? `/api/departments/${editingDepartment.id}` : '/api/departments';
      const method = editingDepartment ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      if (result.success) {
        fetchDepartments();
        setShowModal(false);
        setEditingDepartment(null);
        setFormData({
          name: '',
          manager: '',
          budget: '',
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

  const handleEdit = (department) => {
    setEditingDepartment(department);
    setFormData({
      name: department.name,
      manager: department.manager,
      budget: department.budget.toString(),
      description: department.description
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('确定要删除这个部门吗？')) return;
    
    try {
      const response = await fetch(`/api/departments/${id}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      if (result.success) {
        fetchDepartments();
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
        <h1 style={{ margin: 0, color: '#333' }}>部门管理</h1>
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
          ➕ 新增部门
        </button>
      </div>

      {/* 部门卡片列表 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '24px',
        marginBottom: '30px'
      }}>
        {departments.map((department) => (
          <div key={department.id} style={{
            backgroundColor: '#fff',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
            border: '1px solid #f0f0f0'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '16px'
            }}>
              <h3 style={{ margin: 0, color: '#333', fontSize: '18px' }}>
                🏢 {department.name}
              </h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleEdit(department)}
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
                  onClick={() => handleDelete(department.id)}
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
            </div>
            
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>负责人</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>
                👤 {department.manager}
              </div>
            </div>
            
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>预算</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#52c41a' }}>
                💰 {formatCurrency(department.budget)}
              </div>
            </div>
            
            {department.description && (
              <div>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>描述</div>
                <div style={{ fontSize: '14px', color: '#333', lineHeight: '1.5' }}>
                  {department.description}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 部门统计 */}
      <div style={{
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ margin: '0 0 20px 0', color: '#333' }}>📊 部门统计</h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px'
        }}>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>🏢</div>
            <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>部门总数</h4>
            <p style={{ color: '#666', margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
              {departments.length}
            </p>
          </div>
          
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>💰</div>
            <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>总预算</h4>
            <p style={{ color: '#52c41a', margin: 0, fontSize: '20px', fontWeight: 'bold' }}>
              {formatCurrency(departments.reduce((sum, dept) => sum + dept.budget, 0))}
            </p>
          </div>
          
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>👥</div>
            <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>平均预算</h4>
            <p style={{ color: '#1890ff', margin: 0, fontSize: '20px', fontWeight: 'bold' }}>
              {formatCurrency(departments.length > 0 ? departments.reduce((sum, dept) => sum + dept.budget, 0) / departments.length : 0)}
            </p>
          </div>
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
              {editingDepartment ? '编辑部门' : '新增部门'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  部门名称 *
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
              
              <div style={{ marginBottom: '20px' }}>
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
              
              <div style={{ marginBottom: '20px' }}>
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
                    setEditingDepartment(null);
                    setFormData({
                      name: '',
                      manager: '',
                      budget: '',
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
                  {editingDepartment ? '更新' : '创建'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentManagement;
