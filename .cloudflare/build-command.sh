#!/bin/bash

# 运行正常的构建命令
npm run build

# 构建完成后删除webpack缓存文件
rm -rf .next/cache/webpack

# 输出构建信息
echo "Build completed and cache files removed!" 