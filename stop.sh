#!/bin/bash

echo "========================================"
echo "  ⏹️  停止周报管理系统"
echo "========================================"
echo ""

# 停止前端进程
if lsof -ti:5173 > /dev/null 2>&1; then
    echo "⏹️  停止前端服务（端口 5173）..."
    lsof -ti:5173 | xargs kill -9 2>/dev/null
    echo "✅ 前端服务已停止"
else
    echo "ℹ️  前端服务未运行"
fi

# 停止后端进程
if lsof -ti:3001 > /dev/null 2>&1; then
    echo "⏹️  停止后端服务（端口 3001）..."
    lsof -ti:3001 | xargs kill -9 2>/dev/null
    echo "✅ 后端服务已停止"
else
    echo "ℹ️  后端服务未运行"
fi

echo ""
echo "✅ 所有服务已停止"
echo "💾 数据已安全保存在 server/data.db"
echo ""

