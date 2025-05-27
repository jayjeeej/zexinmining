// Vercel构建钩子脚本
// 这个脚本会在Vercel构建过程中自动运行

const fs = require('fs');
const path = require('path');

console.log('运行Vercel构建钩子...');

// 检查构建目录
const buildDir = path.join(process.cwd(), '.next');
if (!fs.existsSync(buildDir)) {
  console.error('构建目录不存在!');
  process.exit(1);
}

// 确保关键路由目录存在
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`创建目录: ${dirPath}`);
  }
};

// 添加特殊处理的路由
const specialRoutes = [
  path.join(buildDir, 'server/app/en/about'),
  path.join(buildDir, 'server/app/zh/about'),
  path.join(buildDir, 'server/pages/en/about'),
  path.join(buildDir, 'server/pages/zh/about')
];

// 确保这些目录存在
specialRoutes.forEach(ensureDirectoryExists);

// 创建一个标记文件，表示此路由应该由Vercel处理
const createRouteMarker = (dirPath) => {
  const markerPath = path.join(dirPath, '.vercel_route_marker');
  fs.writeFileSync(markerPath, '// This file helps Vercel identify this as a valid route', 'utf8');
  console.log(`创建路由标记: ${markerPath}`);
};

// 为每个特殊路由创建标记
specialRoutes.forEach(createRouteMarker);

console.log('Vercel构建钩子完成!'); 