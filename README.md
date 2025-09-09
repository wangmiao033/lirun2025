# 公司内部利润管理系统

一个功能完整的公司内部利润管理系统，支持利润数据的录入、管理、分析和报表生成。

## 功能特性

### 📊 核心功能
- **利润管理**: 支持利润数据的增删改查
- **部门管理**: 管理公司各部门信息
- **数据导入**: 支持Excel文件批量导入利润数据
- **数据导出**: 支持将数据导出为Excel报表
- **图表分析**: 多种图表展示利润趋势和部门分布
- **报表生成**: 自动生成利润分析报表

### 🎯 主要页面
- **仪表盘**: 总览利润统计和趋势图表
- **利润管理**: 利润记录的列表和编辑
- **部门管理**: 部门信息的维护
- **数据导入**: Excel文件上传和解析
- **报表分析**: 详细的数据分析和报表

### 💼 技术栈
- **后端**: Node.js + Express + MongoDB
- **前端**: React + TypeScript + Ant Design
- **图表**: Recharts
- **状态管理**: React Query
- **文件处理**: Multer + XLSX

## 快速开始

### 环境要求
- Node.js >= 16.0.0
- MongoDB >= 4.4.0
- npm 或 yarn

### 安装步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd profit-management-system
```

2. **安装后端依赖**
```bash
npm install
```

3. **安装前端依赖**
```bash
cd client
npm install
cd ..
```

4. **配置环境变量**
创建 `.env` 文件：
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/profit_management
JWT_SECRET=your_jwt_secret_key_here
```

5. **启动MongoDB**
确保MongoDB服务正在运行

6. **启动应用**
```bash
# 启动后端服务
npm start

# 启动前端服务（新终端窗口）
cd client
npm start
```

7. **访问应用**
- 前端应用: http://localhost:3000
- 后端API: http://localhost:5000

## 使用说明

### 数据导入
1. 进入"数据导入"页面
2. 下载Excel模板文件
3. 按照模板格式填写数据
4. 上传Excel文件完成导入

### Excel模板格式
| 字段名 | 说明 | 必填 | 示例 |
|--------|------|------|------|
| department | 部门名称 | 是 | 销售部 |
| project | 项目名称 | 是 | 项目A |
| period | 期间 | 是 | 2025-01 |
| revenue | 收入 | 是 | 100000 |
| cost | 成本 | 是 | 80000 |
| materialCost | 材料成本 | 否 | 40000 |
| laborCost | 人工成本 | 否 | 25000 |
| overheadCost | 管理费用 | 否 | 10000 |
| otherCost | 其他成本 | 否 | 5000 |
| description | 描述 | 否 | 项目描述 |

### API接口

#### 利润管理
- `GET /api/profits` - 获取利润列表
- `POST /api/profits` - 创建利润记录
- `PUT /api/profits/:id` - 更新利润记录
- `DELETE /api/profits/:id` - 删除利润记录
- `GET /api/profits/stats/summary` - 获取汇总统计
- `GET /api/profits/stats/by-department` - 获取部门统计
- `GET /api/profits/stats/trend` - 获取趋势数据

#### 部门管理
- `GET /api/departments` - 获取部门列表
- `POST /api/departments` - 创建部门
- `PUT /api/departments/:id` - 更新部门
- `DELETE /api/departments/:id` - 删除部门

#### 文件处理
- `POST /api/upload/excel` - 上传Excel文件
- `GET /api/upload/template` - 下载Excel模板
- `POST /api/upload/export` - 导出Excel数据

## 项目结构

```
profit-management-system/
├── client/                 # 前端React应用
│   ├── public/            # 静态资源
│   ├── src/
│   │   ├── components/    # 通用组件
│   │   ├── pages/         # 页面组件
│   │   ├── services/      # API服务
│   │   └── App.tsx        # 主应用组件
│   └── package.json
├── models/                # 数据库模型
├── routes/                # API路由
├── server.js              # 服务器入口
└── package.json           # 后端依赖
```

## 开发说明

### 添加新功能
1. 在后端 `routes/` 目录添加新的路由文件
2. 在 `models/` 目录定义数据模型
3. 在前端 `pages/` 目录添加新页面
4. 在 `services/api.ts` 中添加API调用

### 数据库设计
- **Profit**: 利润记录表
- **Department**: 部门信息表

### 安全特性
- 请求频率限制
- 文件上传类型验证
- 数据验证和清理
- CORS配置

## 部署说明

### 生产环境部署
1. 设置环境变量
2. 构建前端应用: `cd client && npm run build`
3. 启动后端服务: `npm start`

### Docker部署（可选）
```dockerfile
# 可以添加Dockerfile进行容器化部署
```

## 常见问题

### Q: 如何修改端口？
A: 修改 `.env` 文件中的 `PORT` 变量

### Q: 如何连接其他数据库？
A: 修改 `.env` 文件中的 `MONGODB_URI` 变量

### Q: 导入Excel文件失败？
A: 检查文件格式是否符合模板要求，确保必填字段完整

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request来改进这个项目。
