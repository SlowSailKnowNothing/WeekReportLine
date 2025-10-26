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
- **Node.js**: 20.19+ 或 22.12+ ([下载地址](https://nodejs.org/))
- **npm**: 通常随 Node.js 一起安装
- **Git**: 用于克隆项目 ([下载地址](https://git-scm.com/))

### 一键安装（推荐）

项目提供了自动化安装脚本：

```bash
# 克隆项目
git clone <your-repo-url>
cd WeekReport

# 运行安装脚本
chmod +x setup.sh
./setup.sh
```

安装脚本会自动：
- 安装所有依赖
- 创建数据库
- 注册默认管理员账号
- 启动服务

### 手动安装

如果自动安装遇到问题，可以手动执行以下步骤：

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

# 结束进程（将PID替换为实际进程ID）
kill -9 <PID>
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
cd /path/to/WeekReport
npm run dev
```

#### 7. 访问应用
- 🌐 **公开展示页面**：http://localhost:5173
- 🔐 **管理后台**：http://localhost:5173/dashboard（需登录）
- 🔌 **后端API**：http://localhost:3001

### 使用便捷脚本

项目提供了多个便捷脚本：

```bash
# 启动开发环境（前端+后端）
./start.sh

# 停止服务
./stop.sh

# 备份数据库
./backup.sh

# 恢复数据库
./restore.sh
```

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

## 🔧 二次开发与维护

### 项目结构说明

```
WeekReport/
├── client/                 # 前端 React 应用
│   ├── src/
│   │   ├── components/     # 可复用组件
│   │   ├── pages/         # 页面组件
│   │   ├── contexts/      # React Context
│   │   └── assets/        # 静态资源
│   ├── package.json
│   └── vite.config.ts     # Vite 配置
├── server/                 # 后端 Node.js 应用
│   ├── auth.js            # 认证逻辑
│   ├── database.js       # 数据库初始化
│   ├── routes.js          # API 路由
│   ├── index.js           # 服务器入口
│   └── data.db           # SQLite 数据库（运行时生成）
├── scripts/               # 便捷脚本
│   ├── setup.sh          # 一键安装
│   ├── start.sh          # 启动服务
│   ├── stop.sh           # 停止服务
│   ├── backup.sh         # 备份数据库
│   └── restore.sh        # 恢复数据库
└── README.md
```

### 开发环境设置

#### 1. 克隆并安装
```bash
git clone <your-repo-url>
cd WeekReport
./setup.sh
```

#### 2. 开发模式启动
```bash
# 方式1：使用脚本
./start.sh

# 方式2：手动启动
npm run dev
```

#### 3. 代码修改流程
1. 修改前端代码：编辑 `client/src/` 下的文件
2. 修改后端代码：编辑 `server/` 下的文件
3. 修改数据库结构：编辑 `server/database.js`
4. 测试修改：访问 http://localhost:5173

### 数据库维护

#### 查看数据库内容
```bash
# 进入 SQLite 命令行
sqlite3 server/data.db

# 查看所有表
.tables

# 查看表结构
.schema weekly_reports

# 查看数据
SELECT * FROM weekly_reports LIMIT 5;

# 退出
.quit
```

#### 数据库备份与恢复
```bash
# 备份
./backup.sh

# 恢复（替换 YYYYMMDD 为实际日期）
cp server/data.db.backup-YYYYMMDD server/data.db
```

#### 重置数据库
```bash
# 删除现有数据库
rm server/data.db

# 重启服务器（会自动重新创建）
cd server
npm start
```

### 自定义开发

#### 添加新的API接口
1. 在 `server/routes.js` 中添加新路由
2. 如需新表，在 `server/database.js` 中添加表结构
3. 重启服务器测试

#### 添加新的前端页面
1. 在 `client/src/pages/` 下创建新组件
2. 在 `client/src/App.tsx` 中添加路由
3. 如需API调用，在组件中使用 axios

#### 修改样式
- 全局样式：编辑 `client/src/index.css`
- 组件样式：使用 Tailwind CSS 类名
- 自定义样式：编辑 `client/tailwind.config.js`

### 性能优化

#### 前端优化
```bash
# 构建生产版本
cd client
npm run build

# 分析打包大小
npm run build -- --analyze
```

#### 后端优化
- 数据库查询优化：在 `server/routes.js` 中使用索引
- 缓存策略：添加 Redis 缓存（可选）
- 日志记录：添加 winston 日志库（可选）

### 安全加固

#### 生产环境配置
1. **修改默认密码**：
```bash
# 注册新管理员账号
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"your-username","password":"strong-password"}'
```

2. **设置强JWT密钥**：
编辑 `server/.env`：
```env
JWT_SECRET=your-very-strong-secret-key-here
```

3. **启用HTTPS**：在生产环境使用反向代理（如 Nginx）

#### 数据安全
- 定期备份数据库
- 限制数据库文件访问权限
- 监控异常登录

## 🚀 生产部署建议

### 前端部署
```bash
cd client
npm run build
# 将 dist 目录部署到静态文件服务器（如 Nginx）
```

### 后端部署
1. 设置环境变量（特别是 JWT_SECRET）
2. 使用 PM2 运行：
```bash
npm install -g pm2
cd server
pm2 start index.js --name week-report-api
pm2 save
pm2 startup
```

### Docker 部署（可选）
创建 `Dockerfile`：
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

### 反向代理配置（Nginx）
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # 前端静态文件
    location / {
        root /path/to/client/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # API 代理
    location /api {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🔧 故障排除

### 安装问题

#### Q: npm 权限错误？
```bash
sudo chown -R $(whoami) ~/.npm
```

#### Q: 依赖安装失败？
```bash
# 清理缓存
npm cache clean --force

# 客户端使用 legacy-peer-deps
cd client
npm install --legacy-peer-deps

# 如果还是失败，删除 node_modules 重新安装
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

#### Q: Node.js 版本不兼容？
```bash
# 检查版本
node --version

# 使用 nvm 管理版本
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20
```

### 运行问题

#### Q: 端口被占用？
```bash
# 查找占用进程
lsof -ti:3001
lsof -ti:5173

# 结束进程
kill -9 <PID>

# 或者使用脚本
./stop.sh
```

#### Q: 数据库初始化失败？
```bash
# 删除旧数据库
rm server/data.db

# 重启服务器（会自动重新创建）
cd server
npm start
```

#### Q: 前端页面空白？
1. 检查浏览器控制台错误
2. 确认后端服务运行正常：http://localhost:3001
3. 检查网络请求是否成功

#### Q: 登录失败？
1. 确认已注册账号
2. 检查用户名密码是否正确
3. 查看服务器日志是否有错误

### 数据问题

#### Q: 数据丢失？
```bash
# 恢复备份
cp server/data.db.backup-YYYYMMDD server/data.db

# 重启服务
./restart.sh
```

#### Q: 数据库损坏？
```bash
# 检查数据库完整性
sqlite3 server/data.db "PRAGMA integrity_check;"

# 如果损坏，恢复备份或重新初始化
rm server/data.db
cd server
npm start
```

### 性能问题

#### Q: 页面加载慢？
1. 检查网络连接
2. 查看浏览器开发者工具的 Network 面板
3. 检查服务器资源使用情况

#### Q: 数据库查询慢？
```bash
# 查看数据库大小
ls -lh server/data.db

# 优化查询（在 routes.js 中添加索引）
```

### 开发问题

#### Q: 代码修改不生效？
1. 重启开发服务器
2. 清除浏览器缓存
3. 检查文件保存状态

#### Q: TypeScript 错误？
```bash
# 检查类型定义
cd client
npx tsc --noEmit
```

#### Q: 样式不生效？
1. 检查 Tailwind CSS 配置
2. 确认类名拼写正确
3. 重启开发服务器

### 生产环境问题

#### Q: PM2 进程异常？
```bash
# 查看进程状态
pm2 status

# 重启进程
pm2 restart week-report-api

# 查看日志
pm2 logs week-report-api
```

#### Q: Nginx 配置问题？
```bash
# 测试配置
nginx -t

# 重新加载配置
nginx -s reload
```

### 获取帮助

如果遇到其他问题：

1. **查看日志**：
   - 前端：浏览器开发者工具 Console
   - 后端：终端输出或 PM2 logs

2. **检查环境**：
   - Node.js 版本：`node --version`
   - npm 版本：`npm --version`
   - 系统信息：`uname -a`

3. **重新安装**：
   ```bash
   # 完全重新安装
   rm -rf node_modules client/node_modules server/node_modules
   ./setup.sh
   ```

4. **提交 Issue**：在 GitHub 仓库中提交问题报告，包含：
   - 操作系统和版本
   - Node.js 版本
   - 错误信息截图
   - 复现步骤

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
