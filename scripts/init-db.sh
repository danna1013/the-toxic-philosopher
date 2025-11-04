#!/bin/bash

# 数据库初始化脚本

echo "正在初始化数据库..."

# 检查环境变量
if [ -z "$DATABASE_URL" ]; then
  echo "错误：未设置 DATABASE_URL 环境变量"
  echo "请在 .env 文件中设置 DATABASE_URL"
  exit 1
fi

# 执行SQL初始化脚本
psql $DATABASE_URL -f server/utils/init-db.sql

if [ $? -eq 0 ]; then
  echo "✅ 数据库初始化成功！"
else
  echo "❌ 数据库初始化失败"
  exit 1
fi
