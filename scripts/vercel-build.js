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

// 在App Router目录创建特定的静态页面占位文件
// 这可以帮助Vercel正确识别这些路径
const createStaticPageFile = (dirPath, locale) => {
  // 创建page.html文件
  const htmlPath = path.join(dirPath, 'page.html');
  if (!fs.existsSync(htmlPath)) {
    const pageContent = `
<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${locale === 'zh' ? '关于我们' : 'About Us'} | Zexin Mining</title>
  <meta name="description" content="Static placeholder for ${locale === 'zh' ? '关于我们' : 'About Us'} page">
  <meta http-equiv="refresh" content="0;url=/${locale}/about">
</head>
<body>
  <p>Redirecting to <a href="/${locale}/about">/${locale}/about</a></p>
</body>
</html>`;
    
    fs.writeFileSync(htmlPath, pageContent, 'utf8');
    console.log(`创建静态页面文件: ${htmlPath}`);
  }
  
  // 创建route.js文件来处理服务端请求
  const routePath = path.join(dirPath, 'route.js');
  if (!fs.existsSync(routePath)) {
    const routeContent = `
// 自动生成的路由处理程序
export function GET(request) {
  return new Response(null, {
    status: 307,
    headers: {
      'Location': '/${locale}/about'
    }
  });
}

export const dynamic = 'force-static';
export const revalidate = 3600;
`;
    
    fs.writeFileSync(routePath, routeContent, 'utf8');
    console.log(`创建路由处理文件: ${routePath}`);
  }
};

// 为App Router目录创建静态页面文件
createStaticPageFile(path.join(buildDir, 'server/app/en/about'), 'en');
createStaticPageFile(path.join(buildDir, 'server/app/zh/about'), 'zh');

// 在旧的Pages Router目录创建路由处理程序
const createPagesRouteHandler = (dirPath, locale) => {
  const indexPath = path.join(dirPath, 'index.js');
  if (!fs.existsSync(indexPath)) {
    const handlerContent = `
// 自动生成的Pages Router处理程序
export default function AboutPage(req, res) {
  res.statusCode = 307;
  res.setHeader('Location', '/${locale}/about');
  res.end();
}

// 确保这是一个静态页面
export const config = {
  runtime: 'edge',
};
`;
    
    fs.writeFileSync(indexPath, handlerContent, 'utf8');
    console.log(`创建Pages路由处理文件: ${indexPath}`);
  }
};

// 为Pages Router目录创建路由处理程序
createPagesRouteHandler(path.join(buildDir, 'server/pages/en/about'), 'en');
createPagesRouteHandler(path.join(buildDir, 'server/pages/zh/about'), 'zh');

// 复制中间件配置
try {
  const middlewareSource = path.join(process.cwd(), 'middleware.ts');
  const middlewareJS = path.join(process.cwd(), 'middleware.js');
  const middlewareDest = path.join(buildDir, 'server/middleware.js');
  
  // 先尝试TS文件，再尝试JS文件
  if (fs.existsSync(middlewareSource)) {
    console.log(`从${middlewareSource}复制中间件`);
    fs.copyFileSync(middlewareSource, middlewareDest);
  } else if (fs.existsSync(middlewareJS)) {
    console.log(`从${middlewareJS}复制中间件`);
    fs.copyFileSync(middlewareJS, middlewareDest);
  } else {
    console.log('未找到中间件文件');
  }
} catch (err) {
  console.error(`复制中间件时出错: ${err.message}`);
}

console.log('Vercel构建钩子完成!');

// 显示构建输出目录的结构，方便调试
console.log('\n检查重要目录结构:');
const checkDirectory = (dir, level = 0) => {
  if (level > 3) return; // 限制递归深度
  if (!fs.existsSync(dir)) return;
  
  const indent = '  '.repeat(level);
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stats = fs.statSync(fullPath);
    if (stats.isDirectory()) {
      console.log(`${indent}[目录] ${file}/`);
      checkDirectory(fullPath, level + 1);
    } else {
      console.log(`${indent}[文件] ${file} (${stats.size}字节)`);
    }
  });
};

// 检查关键目录
[
  path.join(buildDir, 'server/app/en/about'),
  path.join(buildDir, 'server/app/zh/about')
].forEach(dir => {
  console.log(`\n检查目录: ${dir}`);
  checkDirectory(dir);
}); 