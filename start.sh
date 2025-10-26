#!/bin/bash

echo "========================================"
echo "  🚀 启动周报管理系统"
echo "========================================"
echo ""

# 检查端口是否被占用
if lsof -ti:3001 > /dev/null 2>&1; then
    echo "⚠️  端口 3001 已被占用，正在停止旧进程..."
    lsof -ti:3001 | xargs kill -9 2>/dev/null
    sleep 1
fi

if lsof -ti:5173 > /dev/null 2>&1; then
    echo "⚠️  端口 5173 已被占用，正在停止旧进程..."
    lsof -ti:5173 | xargs kill -9 2>/dev/null
    sleep 1
fi

echo "✅ 端口检查完成"
echo ""

# 检查数据库文件
if [ -f "server/data.db" ]; then
    echo "✅ 数据库文件存在"
    DB_SIZE=$(du -h server/data.db | cut -f1)
    echo "   数据库大小: $DB_SIZE"
else
    echo "⚠️  数据库文件不存在，将自动创建"
fi

echo ""
echo "🔄 正在启动服务..."
echo ""
echo "📊 前端地址: http://localhost:5173"
echo "🔌 后端API: http://localhost:3001"
echo ""
echo "💡 提示："
echo "   - 管理后台: http://localhost:5173/dashboard"
echo "   - 时间轴: http://localhost:5173"
echo "   - 按 Ctrl+C 可以停止服务"
echo ""
echo "========================================"
echo ""

# 启动服务
npm run dev

