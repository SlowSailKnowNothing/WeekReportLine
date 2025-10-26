#!/bin/bash

echo "========================================"
echo "  ⚠️  恢复数据库"
echo "========================================"
echo ""

# 检查是否有备份文件
if [ ! -d "backups" ] || [ -z "$(ls -A backups/data.db.backup-* 2>/dev/null)" ]; then
    echo "❌ 没有找到备份文件"
    exit 1
fi

# 显示可用的备份文件
echo "📚 可用的备份文件："
echo ""
ls -lt backups/data.db.backup-* | nl | awk '{print "   [" $1 "]", $10, "(" $(NF-4) ")"}'
echo ""

# 获取最新的备份
LATEST_BACKUP=$(ls -t backups/data.db.backup-* | head -n1)

echo "💡 将恢复最新的备份: $(basename $LATEST_BACKUP)"
echo ""
read -p "❓ 确认恢复？这将覆盖当前数据库 (y/N): " confirm

if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
    echo "❌ 已取消恢复"
    exit 0
fi

# 备份当前数据库
if [ -f "server/data.db" ]; then
    echo ""
    echo "💾 先备份当前数据库..."
    cp server/data.db "server/data.db.before-restore-$(date +%Y%m%d-%H%M%S)"
fi

# 恢复备份
cp "$LATEST_BACKUP" server/data.db

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 数据库恢复成功！"
    echo "📁 已从 $(basename $LATEST_BACKUP) 恢复"
else
    echo ""
    echo "❌ 恢复失败"
    exit 1
fi

echo ""
echo "========================================"

