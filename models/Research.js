const mongoose = require('mongoose');

const researchSchema = new mongoose.Schema({
  // 基本信息
  projectCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  projectName: {
    type: String,
    required: true,
    trim: true
  },
  manager: {
    type: String,
    required: true,
    trim: true
  },
  projectType: {
    type: String,
    required: true,
    enum: ['basic', 'applied', 'development', 'innovation'],
    default: 'development'
  },
  
  // 财务信息
  budget: {
    type: Number,
    required: true,
    min: 0
  },
  actualCost: {
    type: Number,
    default: 0,
    min: 0
  },
  remainingBudget: {
    type: Number,
    default: function() {
      return this.budget - this.actualCost;
    }
  },
  
  // 时间信息
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  plannedDuration: {
    type: Number, // 计划工期（天）
    min: 0
  },
  actualDuration: {
    type: Number, // 实际工期（天）
    min: 0
  },
  
  // 项目状态
  status: {
    type: String,
    enum: ['planning', 'active', 'completed', 'suspended', 'cancelled'],
    default: 'planning'
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  
  // 团队信息
  teamMembers: [{
    name: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true
    },
    email: String
  }],
  
  // 技术信息
  technologies: [String],
  deliverables: [String],
  
  // 描述和备注
  description: {
    type: String,
    trim: true
  },
  objectives: [String], // 项目目标
  risks: [String], // 风险点
  notes: {
    type: String,
    trim: true
  },
  
  // 元数据
  createdBy: {
    type: String,
    required: true
  },
  lastModifiedBy: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// 计算剩余预算
researchSchema.pre('save', function(next) {
  this.remainingBudget = this.budget - this.actualCost;
  next();
});

// 索引
researchSchema.index({ projectCode: 1 });
researchSchema.index({ projectName: 1 });
researchSchema.index({ manager: 1 });
researchSchema.index({ status: 1 });
researchSchema.index({ projectType: 1 });
researchSchema.index({ startDate: 1, endDate: 1 });
researchSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Research', researchSchema);
