#!/bin/bash
# 一键归档、提交并发布
echo "正在整理所有艺术作品..."
mkdir -p daily_arts
cp -rn /home/onez/.openclaw/workspace/daily_art/* daily_arts/
echo "正在提交到 GitHub..."
git add .
git commit -m "Auto-deploy all daily art works: $(date)"
git push
echo "发布完成！请检查 https://onezgames.com/generative"
