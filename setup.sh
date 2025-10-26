#!/bin/bash

echo "======================================"
echo "  个人指标管理系统 - 项目初始化"
echo "======================================"
echo ""

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null
then
    echo "❌ Node.js 未安装，请先安装 Node.js (v20.19+ 或 v22.12+)"
    exit 1
fi

echo "✅ Node.js 版本: $(node --version)"
echo ""

# 安装根目录依赖
echo "📦 安装根目录依赖..."
npm install

# 安装服务端依赖
echo ""
echo "📦 安装服务端依赖..."
cd server
npm install

# 创建 .env 文件
if [ ! -f .env ]; then
    echo ""
    echo "📝 创建服务端配置文件..."
    cat > .env << EOF
PORT=3001
JWT_SECRET=$(openssl rand -base64 32)
NODE_ENV=development
EOF
    echo "✅ 已创建 server/.env 文件"
else
    echo "⚠️  server/.env 文件已存在，跳过创建"
fi

cd ..

# 安装客户端依赖
echo ""
echo "📦 安装客户端依赖..."
cd client
npm install
cd ..

echo ""
echo "======================================"
echo "  ✅ 项目初始化完成！"
echo "======================================"
echo ""
echo "📌 下一步："
echo ""
echo "1. 注册管理员账号："
echo "   # 先启动服务器（在新终端）"
echo "   cd server && npm start"
echo ""
echo "   # 然后执行注册命令"
echo "   curl -X POST http://localhost:3001/api/auth/register \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"username\":\"admin\",\"password\":\"your-password\"}'"
echo ""
echo "2. 启动项目："
echo "   npm run dev"
echo ""
echo "3. 访问应用："
echo "   前端: http://localhost:5173"
echo "   后端: http://localhost:3001"
echo ""
echo "详细使用说明请查看 README.md"
echo ""

