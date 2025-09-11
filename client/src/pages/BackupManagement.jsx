import React, { useState, useEffect } from 'react';
import { useApiError } from '../hooks/useApiError';
import { useNotification } from '../contexts/NotificationContext';
import './BackupManagement.css';

const BackupManagement = () => {
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(false);
  const { handleApiCall } = useApiError();
  const { success, error } = useNotification();

  useEffect(() => {
    loadBackups();
  }, []);

  const loadBackups = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/backups');
      const data = await response.json();
      if (data.success) {
        setBackups(data.data);
      }
    } catch (err) {
      error('加载备份列表失败');
    } finally {
      setLoading(false);
    }
  };

  const createBackup = async () => {
    await handleApiCall(async () => {
      const response = await fetch('/api/backups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (data.success) {
        success('备份创建成功');
        loadBackups();
      }
    }, { errorMessage: '创建备份失败' });
  };

  const restoreBackup = async (backupId) => {
    if (!window.confirm('确定要恢复此备份吗？这将覆盖当前数据。')) return;

    await handleApiCall(async () => {
      const response = await fetch(`/api/backups/${backupId}/restore`, {
        method: 'POST'
      });
      const data = await response.json();
      if (data.success) {
        success('数据恢复成功');
        loadBackups();
      }
    }, { errorMessage: '恢复备份失败' });
  };

  const deleteBackup = async (backupId) => {
    if (!window.confirm('确定要删除此备份吗？')) return;

    await handleApiCall(async () => {
      const response = await fetch(`/api/backups/${backupId}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        success('备份删除成功');
        loadBackups();
      }
    }, { errorMessage: '删除备份失败' });
  };

  const downloadBackup = async (backupId) => {
    try {
      const response = await fetch(`/api/backups/${backupId}/download`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup_${backupId}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      success('备份下载成功');
    } catch (err) {
      error('下载备份失败');
    }
  };

  return (
    <div className="backup-management">
      <div className="backup-header">
        <h1>数据备份管理</h1>
        <button className="create-backup-btn" onClick={createBackup}>
          创建备份
        </button>
      </div>

      <div className="backup-content">
        {loading ? (
          <div className="loading">加载中...</div>
        ) : (
          <div className="backup-list">
            {backups.length === 0 ? (
              <div className="empty-state">
                <p>暂无备份数据</p>
                <button onClick={createBackup}>创建第一个备份</button>
              </div>
            ) : (
              backups.map(backup => (
                <div key={backup.id} className="backup-item">
                  <div className="backup-info">
                    <h3>备份 #{backup.id}</h3>
                    <p>创建时间: {new Date(backup.createdAt).toLocaleString()}</p>
                    <p>大小: {(backup.size / 1024).toFixed(2)} KB</p>
                    <p>状态: <span className={`status ${backup.status}`}>{backup.status}</span></p>
                  </div>
                  <div className="backup-actions">
                    <button onClick={() => downloadBackup(backup.id)}>
                      下载
                    </button>
                    <button onClick={() => restoreBackup(backup.id)}>
                      恢复
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => deleteBackup(backup.id)}
                    >
                      删除
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BackupManagement;
