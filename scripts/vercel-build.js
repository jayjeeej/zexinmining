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

// 创建Lambda函数占位符
// 这将创建一个简单的函数文件，确保Vercel能识别这个路由
const createLambdaPlaceholder = (dirPath, locale, pageName) => {
  const lambdaPath = path.join(dirPath, 'page.js');
  
  if (!fs.existsSync(lambdaPath)) {
    const placeholderContent = `
// 自动生成的Lambda函数占位符
// 用于解决Vercel找不到路由的问题
module.exports = {
  default: function(req, res) {
    // 重定向到正确的路由
    res.setHeader('Location', '/${locale}/${pageName}');
    res.statusCode = 307; // 临时重定向
    res.end();
  }
};`;
    
    fs.writeFileSync(lambdaPath, placeholderContent, 'utf8');
    console.log(`创建Lambda函数占位符: ${lambdaPath}`);
  }
};

// 为特殊路由创建Lambda函数占位符
createLambdaPlaceholder(path.join(buildDir, 'server/pages/en/about'), 'en', 'about');
createLambdaPlaceholder(path.join(buildDir, 'server/pages/zh/about'), 'zh', 'about');

// 复制国际化路由配置
try {
  // 复制中间件文件到构建目录，确保国际化路由正常工作
  const middlewarePath = path.join(process.cwd(), 'middleware.js');
  const middlewareDistPath = path.join(buildDir, 'server', 'middleware.js');
  
  if (fs.existsSync(middlewarePath) && !fs.existsSync(middlewareDistPath)) {
    fs.copyFileSync(middlewarePath, middlewareDistPath);
    console.log(`复制中间件文件到: ${middlewareDistPath}`);
  }
  
  // 确保i18n配置也被复制
  const i18nDir = path.join(process.cwd(), 'i18n');
  const i18nDistDir = path.join(buildDir, 'server', 'i18n');
  
  if (fs.existsSync(i18nDir) && !fs.existsSync(i18nDistDir)) {
    ensureDirectoryExists(i18nDistDir);
    // 复制i18n目录下的文件
    fs.readdirSync(i18nDir).forEach(file => {
      const srcPath = path.join(i18nDir, file);
      const destPath = path.join(i18nDistDir, file);
      if (fs.statSync(srcPath).isFile()) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`复制i18n文件: ${destPath}`);
      }
    });
  }
} catch (err) {
  console.warn(`警告: 复制国际化配置文件时出错: ${err.message}`);
}

console.log('Vercel构建钩子完成!'); 