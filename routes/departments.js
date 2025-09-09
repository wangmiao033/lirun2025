const express = require('express');
const router = express.Router();
const Department = require('../models/Department');

// 获取所有部门
router.get('/', async (req, res) => {
  try {
    const departments = await Department.find({ isActive: true }).sort({ name: 1 });
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 获取单个部门
router.get('/:id', async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: '部门未找到' });
    }
    res.json(department);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 创建新部门
router.post('/', async (req, res) => {
  try {
    const department = new Department(req.body);
    await department.save();
    res.status(201).json(department);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: '部门名称或代码已存在' });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
});

// 更新部门
router.put('/:id', async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!department) {
      return res.status(404).json({ message: '部门未找到' });
    }
    res.json(department);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: '部门名称或代码已存在' });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
});

// 删除部门（软删除）
router.delete('/:id', async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!department) {
      return res.status(404).json({ message: '部门未找到' });
    }
    res.json({ message: '部门已删除' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
