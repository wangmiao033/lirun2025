# 📁 项目结构说明

## 🎯 项目概述
**利润管理系统** - 企业财务数据分析与管理平台

## 📂 目录结构

```
lirn2025/
├── 📁 client/                    # 前端React应用
│   ├── 📁 src/                   # 源代码
│   │   ├── 📁 components/        # React组件
│   │   │   ├── 📁 Analytics/     # 数据分析组件
│   │   │   ├── 📁 Dashboard/     # 仪表盘组件
│   │   │   └── 📁 UI/           # 通用UI组件
│   │   ├── 📁 contexts/          # React上下文
│   │   ├── 📁 hooks/            # 自定义Hooks
│   │   ├── 📁 pages/            # 页面组件
│   │   ├── 📁 services/         # API服务
│   │   ├── 📁 styles/           # 样式文件
│   │   └── 📁 utils/            # 工具函数
│   ├── 📁 build/                # 构建输出（被忽略）
│   ├── package.json             # 前端依赖配置
│   └── vite.config.js           # Vite构建配置
├── 📁 public/                   # 静态文件目录
│   └── index.html               # 静态版本页面
├── 📁 routes/                   # API路由
├── 📁 models/                   # 数据模型
├── 📁 middleware/               # 中间件
├── 📁 scripts/                  # 脚本文件
├── 📄 server-simple.js          # 主服务器文件
├── 📄 package.json              # 项目依赖配置
├── 📄 render.yaml               # Render部署配置
├── 📄 Dockerfile                # Docker配置
└── 📄 README.md                 # 项目说明
```

## 🔧 核心文件说明

### 后端文件
- **`server-simple.js`** (71KB) - 主服务器文件，包含所有API路由
- **`routes/`** - API路由目录
  - `auth.js` - 认证相关路由
  - `profits.js` - 利润管理路由
  - `departments.js` - 部门管理路由
  - 其他业务路由
- **`models/`** - 数据模型
  - `Profit.js` - 利润数据模型
  - `Department.js` - 部门数据模型
  - 其他数据模型

### 前端文件
- **`client/src/App.jsx`** - React应用主入口
- **`client/src/pages/`** - 页面组件
  - `Dashboard.jsx` - 仪表盘页面
  - `AdvancedAnalytics.jsx` - 高级分析页面
  - `ProfitManagement.jsx` - 利润管理页面
  - 其他业务页面
- **`public/index.html`** - 静态版本页面（解决空白页面问题）

### 配置文件
- **`package.json`** - 项目依赖和脚本配置
- **`render.yaml`** - Render平台部署配置
- **`Dockerfile`** - Docker容器配置
- **`.gitignore`** - Git忽略文件配置

## 📊 数据文件
- **`【利润】2025年度公司净利润汇总表2024-12-10.xlsx`** (366KB) - 财务数据文件

## 📚 文档文件
- **`README.md`** - 项目说明文档
- **`CHANGELOG.md`** - 更新日志
- **`UPDATE_LOG.md`** - 更新记录
- **`USER_GUIDE.md`** - 用户指南
- **`项目总结.md`** - 项目总结
- **`DEPLOYMENT.md`** - 部署说明

## 🚀 部署配置
- **Render平台**: 自动从GitHub部署
- **静态文件**: 优先使用`public/index.html`
- **后端API**: Node.js + Express
- **前端**: React + Vite构建

## 🔄 最近清理
已删除的无用文件：
- 临时调试文件
- 重复的部署脚本
- 测试文件
- 备份文件
- 重复的文档文件

## 📈 项目状态
- ✅ 静态版本正常工作
- ✅ 服务器配置优化
- ✅ 项目结构清理完成
- ✅ 部署配置完善

---
**最后更新**: 2024-12-11  
**版本**: v1.8.1  
**状态**: 🟢 运行正常
