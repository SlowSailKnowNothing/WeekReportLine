# 个人成长记录系统 📊

一个现代化的个人成长追踪和展示平台，通过结构化周报记录重大事件和决策，并以美观的时间轴形式呈现。

## ✨ 核心功能

### 📝 结构化周报
一次性录入包含多个模块的周报：
- **重大事件**：可添加多条，支持分级（重大/中等/日常）
- **决策记录**：可添加多条，支持重要性标记和落地情况跟踪
- **总结和想法**：记录本周的思考和反思
- **阅读学习记录**：记录学习内容（可选）
- **不贰过**：反思错误，避免重复（可选）
- **其他指标**：自定义键值对记录（如运动次数等）

### 🌐 公开展示页面
- **个人信息卡片**：展示头像、简介、技能标签、联系方式
- **精选项目展示**：展示你的项目作品
- **智能筛选时间轴**：
  - 按事件分级筛选（多选）
  - 按决策重要性筛选（多选）
  - 按决策落地情况筛选（多选）
  - 实时筛选，流畅交互

### 🔒 管理后台
- **周报管理**：创建、编辑、删除周报
- **个人信息配置**：管理展示页面的个人信息
- **项目管理**：管理项目展示内容
- **自动公开**：所有创建的内容自动公开展示

## 🏗️ 技术架构

### 前端
- **React 18 + TypeScript** - 类型安全的现代化开发
- **Vite** - 极速的开发体验
- **Tailwind CSS** - 实用优先的CSS框架
- **React Router** - 客户端路由
- **Axios** - HTTP客户端
- **date-fns** - 日期处理

### 后端
- **Node.js + Express** - 轻量级后端服务
- **SQLite** - 嵌入式数据库
- **JWT** - 身份认证
- **bcryptjs** - 密码加密

### 数据库设计
- `users` - 用户表
- `weekly_reports` - 周报主表
- `major_events` - 事件表（关联周报）
- `major_decisions` - 决策表（关联周报）
- `profile` - 个人信息表
- `projects` - 项目表

## 📦 快速开始

### 前置条件
- Node.js 20.19+ 或 22.12+
- npm

### 安装步骤

#### 1. 修复 npm 权限（如果遇到权限问题）
```bash
sudo chown -R $(whoami) ~/.npm
```

#### 2. 安装依赖
```bash
# 根目录依赖
npm install

# 服务端依赖
cd server
npm install
cd ..

# 客户端依赖（使用 legacy-peer-deps）
cd client
npm install --legacy-peer-deps
cd ..
```

#### 3. 配置环境变量
服务端的 `.env` 文件已自动创建，位于 `server/.env`。如需修改，编辑该文件：
```env
PORT=3001
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

#### 4. 停止占用端口的进程
```bash
# 查找占用3001端口的进程
lsof -ti:3001

# 结束进程（将18114替换为实际PID）
kill -9 18114
```

#### 5. 注册管理员账号
先启动服务器：
```bash
cd server
npm start
```

**保持服务器运行**，打开新终端执行：
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

看到 `{"message":"注册成功"}` 即表示成功！

#### 6. 启动完整应用
回到第一个终端，按 `Ctrl+C` 停止服务器，然后：
```bash
cd /Users/sailslow/aigc_project/WeekReport
npm run dev
```

#### 7. 访问应用
- 🌐 **公开展示页面**：http://localhost:5173
- 🔐 **管理后台**：http://localhost:5173/dashboard（需登录）
- 🔌 **后端API**：http://localhost:3001

## 📖 使用指南

### 第一次使用

1. **登录管理后台**
   - 访问 http://localhost:5173/login
   - 使用注册的账号密码登录

2. **配置个人信息**
   - 进入"个人信息"页面
   - 填写姓名、头像、简介、技能标签、联系方式

3. **添加项目展示**
   - 进入"项目管理"页面
   - 创建你想展示的项目

4. **创建第一条周报**
   - 进入"周报管理"页面
   - 点击"新建周报"
   - 填写周报各个模块：
     - 添加本周发生的重大事件
     - 记录做出的重要决策
     - 写下总结和想法
     - （可选）记录阅读学习、不贰过、其他指标
   - 保存（内容会自动公开展示）

5. **查看公开页面**
   - 返回首页查看效果
   - 使用筛选器查看不同维度的内容

### 日常使用流程

**每周末填写周报：**
1. 登录管理后台
2. 创建新周报
3. 回顾本周，填写各个模块
4. 保存（自动公开展示）

**定期更新决策落地情况：**
1. 打开之前的周报
2. 找到相关决策
3. 更新"落地情况"字段
4. 保存

## 🎨 筛选功能说明

### 事件分级
- **重大**：人生重要转折点、重大成就
- **中等**：有意义的事件、小成就
- **日常**：日常记录

### 决策重要性
- **重要**：影响人生方向的决策
- **中等**：一般性决策
- **无关紧要**：小决定

### 落地情况
- **落地很好**：决策执行得很好，达到预期
- **落地一般**：部分执行或效果一般
- **待落地**：刚做决策，还未执行

## 📊 数据备份

### 备份数据库
数据库文件位于：`server/data.db`

定期备份：
```bash
cp server/data.db server/data.db.backup-$(date +%Y%m%d)
```

### 恢复数据库
```bash
cp server/data.db.backup-YYYYMMDD server/data.db
```

## 🚀 生产部署建议

### 前端部署
```bash
cd client
npm run build
# 将 dist 目录部署到静态文件服务器
```

### 后端部署
1. 设置环境变量（特别是 JWT_SECRET）
2. 使用 PM2 运行：
```bash
npm install -g pm2
cd server
pm2 start index.js --name week-report-api
```

## 🔧 常见问题

### Q: 端口被占用怎么办？
```bash
# 找到占用进程
lsof -ti:3001
# 结束进程
kill -9 <PID>
```

### Q: npm 权限错误？
```bash
sudo chown -R $(whoami) ~/.npm
```

### Q: 依赖安装失败？
客户端使用：
```bash
cd client
npm install --legacy-peer-deps
```

### Q: 数据库初始化失败？
删除旧数据库重新初始化：
```bash
rm server/data.db
# 重启服务器会自动创建新数据库
```

## 📝 API 接口文档

### 认证
- `POST /api/auth/register` - 注册
- `POST /api/auth/login` - 登录

### 周报（需认证）
- `GET /api/reports` - 获取所有周报
- `GET /api/reports/:id` - 获取单个周报
- `POST /api/reports` - 创建周报
- `PUT /api/reports/:id` - 更新周报
- `DELETE /api/reports/:id` - 删除周报

### 时间轴（公开）
- `GET /api/timeline/public` - 获取公开的事件和决策

### 个人信息
- `GET /api/profile` - 获取个人信息（公开）
- `PUT /api/profile` - 更新个人信息（需认证）

### 项目
- `GET /api/projects/public` - 获取可见项目（公开）
- `GET /api/projects` - 获取所有项目（需认证）
- `POST /api/projects` - 创建项目（需认证）
- `PUT /api/projects/:id` - 更新项目（需认证）
- `DELETE /api/projects/:id` - 删除项目（需认证）

## 🎯 设计理念

1. **结构化记录**：通过固定模板确保记录的完整性和一致性
2. **简单直接**：所有内容自动公开，无需复杂的权限控制
3. **长期追踪**：特别设计了决策落地情况的跟踪机制
4. **易于使用**：一个表单完成所有录入，简化操作流程
5. **美观展示**：现代化UI设计，让数据展示更加直观

## 🌟 未来计划

- [ ] 数据可视化图表（事件/决策数量趋势）
- [ ] 周报模板管理
- [ ] 数据导出（PDF/Markdown）
- [ ] 移动端响应式优化
- [ ] 图片上传功能
- [ ] 标签系统
- [ ] 全文搜索
- [ ] 年度总结生成

## 📄 许可证

MIT License

---

**开始记录你的成长旅程吧！** 🚀
