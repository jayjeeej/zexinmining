/**
 * 修复Vercel部署中的Lambda路由问题
 * 这个脚本在部署后运行，确保所有路由都有正确的Lambda函数
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('开始执行Vercel部署修复脚本...');

// 检查.next目录是否存在
if (!fs.existsSync(path.join(process.cwd(), '.next'))) {
  console.error('错误: .next目录不存在，请先运行next build');
  process.exit(1);
}

// 确保.vercel/output/static目录存在
const vercelOutputDir = path.join(process.cwd(), '.vercel/output/static');
if (!fs.existsSync(vercelOutputDir)) {
  console.log('创建Vercel输出目录...');
  fs.mkdirSync(path.join(process.cwd(), '.vercel/output/static'), { recursive: true });
}

// 处理特定的问题页面
const problematicRoutes = [
  { source: '/en/about', dir: 'en/about' },
  { source: '/zh/about', dir: 'zh/about' }
];

// 获取构建ID
const buildId = fs.readFileSync(path.join(process.cwd(), '.next/BUILD_ID'), 'utf8').trim();
console.log(`当前构建ID: ${buildId}`);

problematicRoutes.forEach(route => {
  console.log(`处理路由: ${route.source}`);
  
  // 创建目标目录
  const targetDir = path.join(vercelOutputDir, route.dir);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  // 获取原始页面内容（如果可能）
  let pageContent = '';
  const nextPagePath = path.join(process.cwd(), '.next/server/app', route.dir, 'page.html');
  if (fs.existsSync(nextPagePath)) {
    try {
      pageContent = fs.readFileSync(nextPagePath, 'utf8');
      console.log(`找到原始页面HTML: ${nextPagePath}`);
    } catch (err) {
      console.warn(`无法读取原始页面HTML: ${err.message}`);
    }
  } else {
    console.warn(`原始页面HTML不存在: ${nextPagePath}`);
  }
  
  // 如果无法获取原始页面，创建一个简单的重定向页面
  if (!pageContent) {
    pageContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta http-equiv="refresh" content="0;url=${route.source}" />
          <title>${route.source.includes('/en/') ? 'About Us' : '关于我们'} | Zexin Mining</title>
        </head>
        <body>
          <p>Redirecting to <a href="${route.source}">${route.source}</a>...</p>
        </body>
      </html>
    `;
    console.log(`为 ${route.source} 创建了简单的重定向HTML`);
  }
  
  // 写入index.html
  fs.writeFileSync(path.join(targetDir, 'index.html'), pageContent);
  console.log(`为 ${route.source} 创建了静态HTML文件`);
});

// 创建vercel.json，如果它不存在的话
const vercelJsonPath = path.join(process.cwd(), 'vercel.json');
const vercelConfig = {
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["iad1"]
};

// 添加路由配置
vercelConfig.routes = problematicRoutes.map(route => ({
  "src": route.source,
  "dest": `/.vercel/output/static/${route.dir}/index.html`,
  "status": 200
}));

// 写入vercel.json
try {
  fs.writeFileSync(vercelJsonPath, JSON.stringify(vercelConfig, null, 2));
  console.log('已更新vercel.json配置');
} catch (err) {
  console.error(`更新vercel.json失败: ${err.message}`);
}

console.log('修复脚本执行完成！'); 