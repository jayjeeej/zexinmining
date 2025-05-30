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
const staticOutputDir = path.join(process.cwd(), '.vercel/output/static');
if (!fs.existsSync(staticOutputDir)) {
  console.log('创建Vercel静态输出目录...');
  fs.mkdirSync(staticOutputDir, { recursive: true });
}

// 确保.vercel/output/functions目录存在
const functionsOutputDir = path.join(process.cwd(), '.vercel/output/functions');
if (!fs.existsSync(functionsOutputDir)) {
  console.log('创建Vercel函数输出目录...');
  fs.mkdirSync(functionsOutputDir, { recursive: true });
}

// 处理特定的问题页面
const problematicRoutes = [
  { source: '/en/about', dir: 'en/about', func: 'en/about.func' },
  { source: '/zh/about', dir: 'zh/about', func: 'zh/about.func' }
];

// 获取构建ID
const buildId = fs.readFileSync(path.join(process.cwd(), '.next/BUILD_ID'), 'utf8').trim();
console.log(`当前构建ID: ${buildId}`);

// 创建基本的Lambda函数内容
const createBasicLambdaFunction = (route) => `
module.exports = (req, res) => {
  // 设置头部和内容类型
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  
  // 创建HTML内容
  const html = \`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta http-equiv="refresh" content="0;url=${route.source}">
        <title>${route.source.includes('/en/') ? 'About Us' : '关于我们'} | Zexin Mining</title>
      </head>
      <body>
        <p>Redirecting to <a href="${route.source}">${route.source}</a>...</p>
      </body>
    </html>
  \`;
  
  // 响应状态码和内容
  res.statusCode = 200;
  res.end(html);
};
`;

problematicRoutes.forEach(route => {
  console.log(`处理路由: ${route.source}`);
  
  // 1. 创建静态HTML文件
  // 创建目标目录
  const targetStaticDir = path.join(staticOutputDir, route.dir);
  if (!fs.existsSync(targetStaticDir)) {
    fs.mkdirSync(targetStaticDir, { recursive: true });
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
  fs.writeFileSync(path.join(targetStaticDir, 'index.html'), pageContent);
  console.log(`为 ${route.source} 创建了静态HTML文件`);
  
  // 2. 创建Lambda函数
  const funcDir = path.join(functionsOutputDir, route.func);
  if (!fs.existsSync(funcDir)) {
    fs.mkdirSync(funcDir, { recursive: true });
  }
  
  // 写入Lambda函数文件
  const lambdaContent = createBasicLambdaFunction(route);
  fs.writeFileSync(path.join(funcDir, 'index.js'), lambdaContent);
  
  // 创建基本的function配置
  const funcConfig = {
    "runtime": "nodejs18.x",
    "handler": "index.js",
    "memory": 128
  };
  fs.writeFileSync(path.join(funcDir, '.vc-config.json'), JSON.stringify(funcConfig, null, 2));
  console.log(`为 ${route.source} 创建了Lambda函数`);
});

// 确保.vercel/output/config.json存在
const configOutputPath = path.join(process.cwd(), '.vercel/output/config.json');
let outputConfig = {
  "version": 3,
  "routes": []
};

// 如果已存在配置文件，读取它
if (fs.existsSync(configOutputPath)) {
  try {
    outputConfig = JSON.parse(fs.readFileSync(configOutputPath, 'utf8'));
    if (!outputConfig.routes) {
      outputConfig.routes = [];
    }
  } catch (err) {
    console.warn(`读取配置文件失败: ${err.message}，将使用默认配置`);
  }
}

// 添加路由配置
problematicRoutes.forEach(route => {
  // 检查是否已存在相同的路由
  const routeExists = outputConfig.routes.some(r => 
    (r.src === route.source) || (r.source === route.source)
  );
  
  if (!routeExists) {
    // 优先使用Lambda函数
    outputConfig.routes.unshift({
      "src": route.source,
      "dest": `/${route.func}/index.js`,
      "check": true
    });
    // 作为备份，也添加静态文件路由
    outputConfig.routes.push({
      "src": route.source,
      "dest": `/${route.dir}/index.html`,
      "status": 200,
      "check": false
    });
  }
});

// 写入配置文件
fs.writeFileSync(configOutputPath, JSON.stringify(outputConfig, null, 2));
console.log('已更新Vercel输出配置');

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
  "dest": `/${route.func}/index.js`,
  "check": true
}));

// 写入vercel.json
try {
  fs.writeFileSync(vercelJsonPath, JSON.stringify(vercelConfig, null, 2));
  console.log('已更新vercel.json配置');
} catch (err) {
  console.error(`更新vercel.json失败: ${err.message}`);
}

console.log('修复脚本执行完成！'); 