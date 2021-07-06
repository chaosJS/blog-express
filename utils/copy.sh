#!/bin/sh
cd /Users/lichao/projects/node-doc/logs
cp -R access.log $(date +%Y-%m-%d).access.log
# 清空
echo "" > access.log