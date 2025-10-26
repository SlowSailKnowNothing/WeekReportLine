# 安装指南

## ⚠️ 遇到权限问题？

如果你看到 npm 权限错误（EACCES），请先运行：

```bash
sudo chown -R $(whoami) ~/.npm
```

输入你的系统密码后继续。

## 📦 安装步骤

### 1. 安装根目录和服务端依赖

```bash
cd /Users/sailslow/aigc_project/WeekReport

# 安装根目录依赖
npm install

# 安装服务端依赖
cd server
npm install
cd ..
```

### 2. 安装客户端依赖

```bash
cd client
npm install --legacy-peer-deps
cd ..
```

> **注意**：客户端使用 `--legacy-peer-deps` 是因为某些依赖的 peer dependency 版本兼容性问题，这是正常的。

### 3. 配置环境变量

```bash
cd server

# 如果 .env 文件不存在，创建它
if [ ! -f .env ]; then
  cat > .env << 'EOF'
PORT=3001
JWT_SECRET=change-this-to-a-random-secret-key-in-production
NODE_ENV=development
EOF
fi

cd ..
```

### 4. 注册管理员账号

首先启动服务器：

```bash
cd server
npm start
```

保持这个终端运行，**打开新的终端窗口**，执行注册命令：

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

你应该看到类似这样的响应：
```json
{"message":"注册成功","userId":1}
```

### 5. 启动完整应用

回到第一个终端，按 `Ctrl+C` 停止服务器，然后：

```bash
cd /Users/sailslow/aigc_project/WeekReport
npm run dev
```

这会同时启动前端和后端服务。

### 6. 访问应用

- 🌐 前端：打开浏览器访问 http://localhost:5173
- 🔌 后端 API：http://localhost:3001
- 👤 登录账号：admin / admin123（使用你注册时设置的密码）

## 🐛 常见问题

### Q: 端口被占用怎么办？

**找出占用端口的进程：**
```bash
# 检查 3001 端口
lsof -ti:3001

# 检查 5173 端口  
lsof -ti:5173
```

**结束进程：**
```bash
kill -9 $(lsof -ti:3001)
kill -9 $(lsof -ti:5173)
```

### Q: npm 权限问题无法解决？

尝试使用 npx 来运行命令：
```bash
npx npm@latest install --legacy-peer-deps
```

或者使用 yarn：
```bash
# 安装 yarn
npm install -g yarn

# 使用 yarn 安装依赖
cd client
yarn install
```

### Q: 数据库文件在哪里？

数据库文件位于：`server/data.db`

第一次启动服务器时会自动创建。

### Q: 如何重置所有数据？

删除数据库文件即可：
```bash
rm server/data.db
```

下次启动服务器会创建一个新的空数据库，你需要重新注册账号。

## ✅ 验证安装

访问 http://localhost:3001/api/health 应该返回：
```json
{"status":"ok","message":"服务运行正常"}
```

如果看到这个响应，说明后端安装成功！

