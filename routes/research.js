const express = require('express');
const router = express.Router();
const Research = require('../models/Research');

// 获取所有研发项目
router.get('/', async (req, res) => {
  try {
    const { status, projectType, manager, page = 1, limit = 10 } = req.query;
    const query = { isActive: true };
    
    if (status) query.status = status;
    if (projectType) query.projectType = projectType;
    if (manager) query.manager = new RegExp(manager, 'i');
    
    const skip = (page - 1) * limit;
    const researchProjects = await Research.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Research.countDocuments(query);
    
    res.json({
      data: researchProjects,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 获取单个研发项目
router.get('/:id', async (req, res) => {
  try {
    const researchProject = await Research.findById(req.params.id);
    if (!researchProject) {
      return res.status(404).json({ message: '研发项目未找到' });
    }
    res.json(researchProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 创建新研发项目
router.post('/', async (req, res) => {
  try {
    const researchProject = new Research(req.body);
    await researchProject.save();
    res.status(201).json(researchProject);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: '项目编号已存在' });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
});

// 更新研发项目
router.put('/:id', async (req, res) => {
  try {
    const researchProject = await Research.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!researchProject) {
      return res.status(404).json({ message: '研发项目未找到' });
    }
    res.json(researchProject);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: '项目编号已存在' });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
});

// 删除研发项目（软删除）
router.delete('/:id', async (req, res) => {
  try {
    const researchProject = await Research.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!researchProject) {
      return res.status(404).json({ message: '研发项目未找到' });
    }
    res.json({ message: '研发项目已删除' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 获取研发项目统计
router.get('/stats/summary', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { isActive: true };
    
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const stats = await Research.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalProjects: { $sum: 1 },
          totalBudget: { $sum: '$budget' },
          totalActualCost: { $sum: '$actualCost' },
          avgProgress: { $avg: '$progress' },
          activeProjects: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
          },
          completedProjects: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          }
        }
      }
    ]);
    
    const typeStats = await Research.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$projectType',
          count: { $sum: 1 },
          totalBudget: { $sum: '$budget' }
        }
      }
    ]);
    
    res.json({
      summary: stats[0] || {
        totalProjects: 0,
        totalBudget: 0,
        totalActualCost: 0,
        avgProgress: 0,
        activeProjects: 0,
        completedProjects: 0
      },
      byType: typeStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
