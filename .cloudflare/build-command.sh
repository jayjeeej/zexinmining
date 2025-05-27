#!/bin/bash

# 运行正常的构建命令
npm run build

# 构建完成后删除所有webpack缓存文件
rm -rf .next/cache
rm -rf cache

# 检查缓存文件是否存在并删除
find .next -name "*.pack" -size +20M -exec rm -f {} \;
find . -name "*.pack" -size +20M -exec rm -f {} \;

# 输出构建信息
echo "Build completed and all large cache files removed!" 