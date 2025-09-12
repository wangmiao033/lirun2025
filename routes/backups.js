const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// 备份目录
const BACKUP_DIR = path.join(__dirname, '../backups');

// 确保备份目录存在
const ensureBackupDir = async () => {
  try {
    await fs.access(BACKUP_DIR);
  } catch {
    await fs.mkdir(BACKUP_DIR, { recursive: true });
  }
};

// 获取所有备份
router.get('/', async (req, res) => {
  try {
    await ensureBackupDir();
    const files = await fs.readdir(BACKUP_DIR);
    const backups = [];
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(BACKUP_DIR, file);
        const stats = await fs.stat(filePath);
        const backupId = file.replace('.json', '');
        
        backups.push({
          id: backupId,
          filename: file,
          createdAt: stats.birthtime,
          size: stats.size,
          status: 'success'
        });
      }
    }
    
    // 按创建时间倒序排列
    backups.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json({
      success: true,
      data: backups
    });
  } catch (error) {
    console.error('获取备份列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取备份列表失败'
    });
  }
});

// 创建备份
router.post('/', async (req, res) => {
  try {
    await ensureBackupDir();
    
    // 这里应该从数据库导出所有数据
    // 为了演示，我们创建一个示例备份
    const backupData = {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      data: {
        message: '这是一个示例备份数据',
        // 在实际应用中，这里应该包含所有业务数据
        profits: [],
        departments: [],
        research: [],
        channels: []
      }
    };
    
    const backupId = `backup_${Date.now()}`;
    const filename = `${backupId}.json`;
    const filePath = path.join(BACKUP_DIR, filename);
    
    await fs.writeFile(filePath, JSON.stringify(backupData, null, 2));
    
    const stats = await fs.stat(filePath);
    
    res.json({
      success: true,
      data: {
        id: backupId,
        filename,
        createdAt: stats.birthtime,
        size: stats.size,
        status: 'success'
      },
      message: '备份创建成功'
    });
  } catch (error) {
    console.error('创建备份失败:', error);
    res.status(500).json({
      success: false,
      message: '创建备份失败'
    });
  }
});

// 下载备份
router.get('/:id/download', async (req, res) => {
  try {
    const { id } = req.params;
    const filename = `${id}.json`;
    const filePath = path.join(BACKUP_DIR, filename);
    
    // 检查文件是否存在
    try {
      await fs.access(filePath);
    } catch {
      return res.status(404).json({
        success: false,
        message: '备份文件不存在'
      });
    }
    
    res.download(filePath, filename);
  } catch (error) {
    console.error('下载备份失败:', error);
    res.status(500).json({
      success: false,
      message: '下载备份失败'
    });
  }
});

// 恢复备份
router.post('/:id/restore', async (req, res) => {
  try {
    const { id } = req.params;
    const filename = `${id}.json`;
    const filePath = path.join(BACKUP_DIR, filename);
    
    // 检查文件是否存在
    try {
      await fs.access(filePath);
    } catch {
      return res.status(404).json({
        success: false,
        message: '备份文件不存在'
      });
    }
    
    // 读取备份数据
    const backupData = JSON.parse(await fs.readFile(filePath, 'utf8'));
    
    // 这里应该将备份数据恢复到数据库
    // 为了演示，我们只是返回成功消息
    console.log('恢复备份数据:', backupData);
    
    res.json({
      success: true,
      message: '备份恢复成功'
    });
  } catch (error) {
    console.error('恢复备份失败:', error);
    res.status(500).json({
      success: false,
      message: '恢复备份失败'
    });
  }
});

// 删除备份
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const filename = `${id}.json`;
    const filePath = path.join(BACKUP_DIR, filename);
    
    // 检查文件是否存在
    try {
      await fs.access(filePath);
    } catch {
      return res.status(404).json({
        success: false,
        message: '备份文件不存在'
      });
    }
    
    await fs.unlink(filePath);
    
    res.json({
      success: true,
      message: '备份删除成功'
    });
  } catch (error) {
    console.error('删除备份失败:', error);
    res.status(500).json({
      success: false,
      message: '删除备份失败'
    });
  }
});

module.exports = router;
