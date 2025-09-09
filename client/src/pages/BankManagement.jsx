import React, { useState, useEffect } from 'react';

const BankManagement = () => {
  const [bankAccounts, setBankAccounts] = useState([]);
  const [fundFlows, setFundFlows] = useState([]);
  const [statistics, setStatistics] = useState({
    totalBalance: 0,
    totalAccounts: 0,
    bankStats: {},
    recentFlows: 0,
    totalIncome: 0,
    totalExpense: 0,
    netFlow: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('accounts');
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showFlowModal, setShowFlowModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [accountFormData, setAccountFormData] = useState({
    bankName: '',
    accountName: '',
    accountNumber: '',
    accountType: '一般账户',
    balance: '',
    currency: 'CNY',
    description: ''
  });
  const [flowFormData, setFlowFormData] = useState({
    accountId: '',
    transactionType: '收入',
    amount: '',
    description: '',
    date: '',
    reference: ''
  });

  useEffect(() => {
    fetchBankAccounts();
    fetchFundFlows();
    fetchStatistics();
  }, []);

  const fetchBankAccounts = async () => {
    try {
      const response = await fetch('/api/bank-accounts');
      const result = await response.json();
      if (result.success) {
        setBankAccounts(result.data);
      }
    } catch (error) {
      console.error('获取银行账户失败:', error);
    }
  };

  const fetchFundFlows = async () => {
    try {
      const response = await fetch('/api/fund-flows');
      const result = await response.json();
      if (result.success) {
        setFundFlows(result.data);
      }
    } catch (error) {
      console.error('获取资金流水失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await fetch('/api/fund-statistics');
      const result = await response.json();
      if (result.success) {
        setStatistics(result.data);
      }
    } catch (error) {
      console.error('获取资金统计失败:', error);
    }
  };

  const handleAccountSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingAccount ? `/api/bank-accounts/${editingAccount.id}` : '/api/bank-accounts';
      const method = editingAccount ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(accountFormData),
      });
      
      const result = await response.json();
      if (result.success) {
        fetchBankAccounts();
        fetchStatistics();
        setShowAccountModal(false);
        setEditingAccount(null);
        resetAccountForm();
      } else {
        alert(result.message || '操作失败');
      }
    } catch (error) {
      console.error('操作失败:', error);
      alert('操作失败');
    }
  };

  const handleFlowSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/fund-flows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(flowFormData),
      });
      
      const result = await response.json();
      if (result.success) {
        fetchBankAccounts();
        fetchFundFlows();
        fetchStatistics();
        setShowFlowModal(false);
        resetFlowForm();
      } else {
        alert(result.message || '操作失败');
      }
    } catch (error) {
      console.error('操作失败:', error);
      alert('操作失败');
    }
  };

  const resetAccountForm = () => {
    setAccountFormData({
      bankName: '',
      accountName: '',
      accountNumber: '',
      accountType: '一般账户',
      balance: '',
      currency: 'CNY',
      description: ''
    });
  };

  const resetFlowForm = () => {
    setFlowFormData({
      accountId: '',
      transactionType: '收入',
      amount: '',
      description: '',
      date: '',
      reference: ''
    });
  };

  const handleEditAccount = (account) => {
    setEditingAccount(account);
    setAccountFormData({
      bankName: account.bankName,
      accountName: account.accountName,
      accountNumber: account.accountNumber,
      accountType: account.accountType,
      balance: account.balance.toString(),
      currency: account.currency,
      description: account.description
    });
    setShowAccountModal(true);
  };

  const handleDeleteAccount = async (id) => {
    if (!confirm('确定要删除这个银行账户吗？')) return;
    
    try {
      const response = await fetch(`/api/bank-accounts/${id}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      if (result.success) {
        fetchBankAccounts();
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
        <h1 style={{ margin: 0, color: '#333' }}>银行资金管理</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setShowFlowModal(true)}
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
            💰 资金流水
          </button>
          <button
            onClick={() => setShowAccountModal(true)}
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
            ➕ 新增账户
          </button>
        </div>
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
            💰 总余额
          </h3>
          <h2 style={{ color: '#52c41a', margin: '0', fontSize: '2rem', fontWeight: 'bold' }}>
            {formatCurrency(statistics.totalBalance)}
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
            🏦 账户数量
          </h3>
          <h2 style={{ color: '#1890ff', margin: '0', fontSize: '2rem', fontWeight: 'bold' }}>
            {statistics.totalAccounts}
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
            📈 月收入
          </h3>
          <h2 style={{ color: '#fa8c16', margin: '0', fontSize: '2rem', fontWeight: 'bold' }}>
            {formatCurrency(statistics.totalIncome)}
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
            📉 月支出
          </h3>
          <h2 style={{ color: '#faad14', margin: '0', fontSize: '2rem', fontWeight: 'bold' }}>
            {formatCurrency(statistics.totalExpense)}
          </h2>
        </div>
      </div>

      {/* 标签页 */}
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <button
            onClick={() => setActiveTab('accounts')}
            style={{
              padding: '16px 24px',
              border: 'none',
              backgroundColor: activeTab === 'accounts' ? '#e6f7ff' : 'transparent',
              color: activeTab === 'accounts' ? '#1890ff' : '#666',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: activeTab === 'accounts' ? 'bold' : 'normal',
              borderBottom: activeTab === 'accounts' ? '2px solid #1890ff' : '2px solid transparent'
            }}
          >
            🏦 银行账户
          </button>
          <button
            onClick={() => setActiveTab('flows')}
            style={{
              padding: '16px 24px',
              border: 'none',
              backgroundColor: activeTab === 'flows' ? '#e6f7ff' : 'transparent',
              color: activeTab === 'flows' ? '#1890ff' : '#666',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: activeTab === 'flows' ? 'bold' : 'normal',
              borderBottom: activeTab === 'flows' ? '2px solid #1890ff' : '2px solid transparent'
            }}
          >
            💰 资金流水
          </button>
        </div>

        <div style={{ padding: '30px' }}>
          {activeTab === 'accounts' ? (
            /* 银行账户列表 */
            <div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '24px'
              }}>
                {bankAccounts.map((account) => (
                  <div key={account.id} style={{
                    backgroundColor: '#f8f9fa',
                    padding: '24px',
                    borderRadius: '12px',
                    border: '1px solid #e9ecef',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '16px'
                    }}>
                      <h3 style={{ margin: 0, color: '#333', fontSize: '18px' }}>
                        🏦 {account.bankName}
                      </h3>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleEditAccount(account)}
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
                          onClick={() => handleDeleteAccount(account.id)}
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
                      <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>账户名称</div>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>
                        {account.accountName}
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>账户号码</div>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#333', fontFamily: 'monospace' }}>
                        {account.accountNumber}
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>账户类型</div>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1890ff' }}>
                        {account.accountType}
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>余额</div>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#52c41a' }}>
                        {formatCurrency(account.balance)}
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>最后更新</div>
                      <div style={{ fontSize: '14px', color: '#333' }}>{account.lastUpdate}</div>
                    </div>
                    
                    {account.description && (
                      <div>
                        <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>描述</div>
                        <div style={{ fontSize: '14px', color: '#333', lineHeight: '1.5' }}>
                          {account.description}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* 资金流水列表 */
            <div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  minWidth: '800px'
                }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8f9fa' }}>
                      <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e9ecef' }}>日期</th>
                      <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e9ecef' }}>账户</th>
                      <th style={{ padding: '16px', textAlign: 'center', borderBottom: '1px solid #e9ecef' }}>类型</th>
                      <th style={{ padding: '16px', textAlign: 'right', borderBottom: '1px solid #e9ecef' }}>金额</th>
                      <th style={{ padding: '16px', textAlign: 'right', borderBottom: '1px solid #e9ecef' }}>余额</th>
                      <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e9ecef' }}>描述</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fundFlows.map((flow) => {
                      const account = bankAccounts.find(a => a.id === flow.accountId);
                      return (
                        <tr key={flow.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                          <td style={{ padding: '16px' }}>{flow.date}</td>
                          <td style={{ padding: '16px' }}>
                            <div>
                              <div style={{ fontWeight: 'bold' }}>{account?.bankName}</div>
                              <div style={{ fontSize: '12px', color: '#666' }}>{account?.accountName}</div>
                            </div>
                          </td>
                          <td style={{ padding: '16px', textAlign: 'center' }}>
                            <span style={{
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              backgroundColor: flow.transactionType === '收入' ? '#f6ffed' : '#fff2f0',
                              color: flow.transactionType === '收入' ? '#52c41a' : '#ff4d4f',
                              border: `1px solid ${flow.transactionType === '收入' ? '#b7eb8f' : '#ffccc7'}`
                            }}>
                              {flow.transactionType}
                            </span>
                          </td>
                          <td style={{ 
                            padding: '16px', 
                            textAlign: 'right', 
                            color: flow.transactionType === '收入' ? '#52c41a' : '#ff4d4f',
                            fontWeight: 'bold'
                          }}>
                            {flow.transactionType === '收入' ? '+' : '-'}{formatCurrency(flow.amount)}
                          </td>
                          <td style={{ padding: '16px', textAlign: 'right', fontWeight: 'bold' }}>
                            {formatCurrency(flow.balance)}
                          </td>
                          <td style={{ padding: '16px' }}>
                            <div>
                              <div>{flow.description}</div>
                              {flow.reference && (
                                <div style={{ fontSize: '12px', color: '#666' }}>参考: {flow.reference}</div>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 银行账户新增/编辑模态框 */}
      {showAccountModal && (
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
              {editingAccount ? '编辑银行账户' : '新增银行账户'}
            </h2>
            
            <form onSubmit={handleAccountSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    银行名称 *
                  </label>
                  <input
                    type="text"
                    value={accountFormData.bankName}
                    onChange={(e) => setAccountFormData({...accountFormData, bankName: e.target.value})}
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
                    账户名称 *
                  </label>
                  <input
                    type="text"
                    value={accountFormData.accountName}
                    onChange={(e) => setAccountFormData({...accountFormData, accountName: e.target.value})}
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
                    账户号码 *
                  </label>
                  <input
                    type="text"
                    value={accountFormData.accountNumber}
                    onChange={(e) => setAccountFormData({...accountFormData, accountNumber: e.target.value})}
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
                    账户类型
                  </label>
                  <select
                    value={accountFormData.accountType}
                    onChange={(e) => setAccountFormData({...accountFormData, accountType: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d9d9d9',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="基本账户">基本账户</option>
                    <option value="一般账户">一般账户</option>
                    <option value="专用账户">专用账户</option>
                    <option value="临时账户">临时账户</option>
                  </select>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    余额
                  </label>
                  <input
                    type="number"
                    value={accountFormData.balance}
                    onChange={(e) => setAccountFormData({...accountFormData, balance: e.target.value})}
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
                    货币
                  </label>
                  <select
                    value={accountFormData.currency}
                    onChange={(e) => setAccountFormData({...accountFormData, currency: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d9d9d9',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="CNY">人民币 (CNY)</option>
                    <option value="USD">美元 (USD)</option>
                    <option value="EUR">欧元 (EUR)</option>
                  </select>
                </div>
              </div>
              
              <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  描述
                </label>
                <textarea
                  value={accountFormData.description}
                  onChange={(e) => setAccountFormData({...accountFormData, description: e.target.value})}
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
                    setShowAccountModal(false);
                    setEditingAccount(null);
                    resetAccountForm();
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
                  {editingAccount ? '更新' : '创建'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 资金流水新增模态框 */}
      {showFlowModal && (
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
            <h2 style={{ margin: '0 0 20px 0', color: '#333' }}>新增资金流水</h2>
            
            <form onSubmit={handleFlowSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  银行账户 *
                </label>
                <select
                  value={flowFormData.accountId}
                  onChange={(e) => setFlowFormData({...flowFormData, accountId: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                >
                  <option value="">请选择账户</option>
                  {bankAccounts.map(account => (
                    <option key={account.id} value={account.id}>
                      {account.bankName} - {account.accountName}
                    </option>
                  ))}
                </select>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    交易类型 *
                  </label>
                  <select
                    value={flowFormData.transactionType}
                    onChange={(e) => setFlowFormData({...flowFormData, transactionType: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d9d9d9',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="收入">收入</option>
                    <option value="支出">支出</option>
                  </select>
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    金额 *
                  </label>
                  <input
                    type="number"
                    value={flowFormData.amount}
                    onChange={(e) => setFlowFormData({...flowFormData, amount: e.target.value})}
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
                  日期
                </label>
                <input
                  type="date"
                  value={flowFormData.date}
                  onChange={(e) => setFlowFormData({...flowFormData, date: e.target.value})}
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
                  描述 *
                </label>
                <input
                  type="text"
                  value={flowFormData.description}
                  onChange={(e) => setFlowFormData({...flowFormData, description: e.target.value})}
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
                  参考号
                </label>
                <input
                  type="text"
                  value={flowFormData.reference}
                  onChange={(e) => setFlowFormData({...flowFormData, reference: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowFlowModal(false);
                    resetFlowForm();
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
                  创建
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BankManagement;
