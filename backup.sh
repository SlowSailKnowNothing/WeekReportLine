#!/bin/bash

echo "========================================"
echo "  💾 备份数据库"
echo "========================================"
echo ""

# 检查数据库是否存在
if [ ! -f "server/data.db" ]; then
    echo "❌ 数据库文件不存在，无需备份"
    exit 1
fi

# 创建备份目录
mkdir -p backups

# 生成备份文件名（带时间戳）
BACKUP_FILE="backups/data.db.backup-$(date +%Y%m%d-%H%M%S)"

# 复制数据库文件
cp server/data.db "$BACKUP_FILE"

# 显示结果
if [ -f "$BACKUP_FILE" ]; then
    echo "✅ 备份成功！"
    echo ""
    echo "📁 备份文件: $BACKUP_FILE"
    echo "📊 文件大小: $(du -h $BACKUP_FILE | cut -f1)"
    echo ""
    
    # 显示所有备份文件
    echo "📚 现有备份文件："
    ls -lh backups/data.db.backup-* 2>/dev/null | awk '{print "   - " $9 " (" $5 ")"}'
    echo ""
    
    # 备份数量
    BACKUP_COUNT=$(ls backups/data.db.backup-* 2>/dev/null | wc -l)
    echo "💡 共有 $BACKUP_COUNT 个备份文件"
    
    if [ $BACKUP_COUNT -gt 10 ]; then
        echo ""
        echo "⚠️  备份文件较多，建议清理旧备份："
        echo "   rm backups/data.db.backup-2024*  # 删除指定日期的备份"
    fi
else
    echo "❌ 备份失败"
    exit 1
fi

echo ""
echo "========================================"

