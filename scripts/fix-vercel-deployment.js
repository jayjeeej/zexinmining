/**
 * 修复Vercel部署中的Lambda路由问题
 * 这个脚本在部署后运行，确保所有路由都有正确的Lambda函数
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('开始执行Vercel部署修复脚本...');

// 确保.vercel/output/functions目录存在
const vercelOutputDir = path.join(process.cwd(), '.vercel', 'output', 'functions');
if (!fs.existsSync(vercelOutputDir)) {
  console.log('Vercel输出目录不存在，检查构建过程...');
  
  // 尝试查找可能的替代位置
  const possibleLocations = [
    path.join(process.cwd(), '.vercel', 'output', 'functions'),
    path.join(process.cwd(), '.vercel', 'functions'),
    path.join(process.cwd(), '.next', 'server', 'pages')
  ];
  
  let found = false;
  for (const location of possibleLocations) {
    if (fs.existsSync(location)) {
      console.log(`找到可能的函数目录: ${location}`);
      found = true;
      break;
    }
  }
  
  if (!found) {
    console.log('无法找到任何函数目录，创建必要的文件');
    // 创建必要的文件结构
    try {
      fs.mkdirSync(path.join(process.cwd(), '.vercel', 'output', 'functions', 'en/about.func'), { recursive: true });
      fs.mkdirSync(path.join(process.cwd(), '.vercel', 'output', 'functions', 'zh/about.func'), { recursive: true });
      // 创建基本的函数文件
      const functionContent = `
module.exports = function(req, res) {
  // 重定向到静态页面
  const url = req.url.includes('/en/about') ? '/en/about' : '/zh/about';
  res.writeHead(302, { Location: url });
  res.end();
}
      `;
      fs.writeFileSync(path.join(process.cwd(), '.vercel', 'output', 'functions', 'en/about.func', 'index.js'), functionContent);
      fs.writeFileSync(path.join(process.cwd(), '.vercel', 'output', 'functions', 'zh/about.func', 'index.js'), functionContent);
      console.log('成功创建基本函数文件');
    } catch (e) {
      console.error('创建函数文件失败:', e);
    }
  }
  process.exit(0);
}

// 检查问题路由的Lambda文件
const problematicRoutes = [
  'en/about.func',
  'zh/about.func',
  'en/products/ore-processing/stationary-crushers.func',
  'zh/products/ore-processing/stationary-crushers.func'
];

// 复制现有的Lambda函数到问题路由
const sourceFunc = path.join(vercelOutputDir, 'index.func');
if (fs.existsSync(sourceFunc)) {
  problematicRoutes.forEach(route => {
    const targetFunc = path.join(vercelOutputDir, route);
    if (!fs.existsSync(targetFunc)) {
      try {
        fs.mkdirSync(targetFunc, { recursive: true });
        // 复制源函数文件到目标路由
        console.log(`复制Lambda函数到 ${route}`);
        
        // 复制所有文件
        const files = fs.readdirSync(sourceFunc);
        files.forEach(file => {
          const sourcePath = path.join(sourceFunc, file);
          const targetPath = path.join(targetFunc, file);
          
          if (fs.statSync(sourcePath).isDirectory()) {
            // 如果是目录，递归复制
            try {
              // 在Windows上使用不同的命令
              if (process.platform === 'win32') {
                execSync(`xcopy "${sourcePath}" "${targetPath}" /E /I /Y`);
              } else {
                execSync(`cp -r "${sourcePath}" "${targetPath}"`);
              }
            } catch (e) {
              console.error(`复制目录失败:`, e);
              // 备用方案：手动创建目录并复制文件
              fs.mkdirSync(targetPath, { recursive: true });
              // 尝试复制目录内的文件
              try {
                const subFiles = fs.readdirSync(sourcePath);
                subFiles.forEach(subFile => {
                  const subSourcePath = path.join(sourcePath, subFile);
                  const subTargetPath = path.join(targetPath, subFile);
                  if (!fs.statSync(subSourcePath).isDirectory()) {
                    fs.copyFileSync(subSourcePath, subTargetPath);
                  }
                });
              } catch (subErr) {
                console.error(`复制子目录文件失败:`, subErr);
              }
            }
          } else {
            // 如果是文件，直接复制
            try {
              fs.copyFileSync(sourcePath, targetPath);
            } catch (e) {
              console.error(`复制文件失败 ${sourcePath} -> ${targetPath}:`, e);
            }
          }
        });
        
        console.log(`成功复制Lambda函数到 ${route}`);
      } catch (e) {
        console.error(`复制Lambda函数到 ${route} 失败:`, e);
      }
    } else {
      console.log(`Lambda函数 ${route} 已存在`);
    }
  });
} else {
  console.log(`源Lambda函数 index.func 不存在，尝试创建基本函数`);
  
  // 创建基本的函数文件
  problematicRoutes.forEach(route => {
    const targetFunc = path.join(vercelOutputDir, route);
    try {
      fs.mkdirSync(targetFunc, { recursive: true });
      const functionContent = `
module.exports = function(req, res) {
  // 重定向到静态页面
  const routeParts = req.url.split('/');
  const locale = routeParts[1] === 'en' ? 'en' : 'zh';
  const lastPart = routeParts[routeParts.length - 1];
  
  // 构建目标URL
  let url;
  if (req.url.includes('/about')) {
    url = \`/\${locale}/about\`;
  } else if (req.url.includes('/products/ore-processing/stationary-crushers')) {
    url = \`/\${locale}/products/ore-processing/stationary-crushers/\${lastPart || ''}\`;
  } else {
    url = req.url;
  }
  
  res.writeHead(302, { Location: url });
  res.end();
}
      `;
      fs.writeFileSync(path.join(targetFunc, 'index.js'), functionContent);
      console.log(`成功创建基本函数到 ${route}`);
    } catch (e) {
      console.error(`创建基本函数到 ${route} 失败:`, e);
    }
  });
}

// 在.vercel/output/config.json中检查和更新路由配置
const configPath = path.join(process.cwd(), '.vercel', 'output', 'config.json');
if (fs.existsSync(configPath)) {
  try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    
    // 确保routes字段存在
    if (!config.routes) {
      config.routes = [];
    }
    
    // 添加问题页面的路由规则
    const routesToAdd = [
      { src: '/en/about', dest: '/en/about/index.html' },
      { src: '/zh/about', dest: '/zh/about/index.html' },
      { src: '/en/products/ore-processing/stationary-crushers/(.*)', dest: '/en/products/ore-processing/stationary-crushers/$1' },
      { src: '/zh/products/ore-processing/stationary-crushers/(.*)', dest: '/zh/products/ore-processing/stationary-crushers/$1' }
    ];
    
    // 检查每个路由是否已存在
    routesToAdd.forEach(routeToAdd => {
      const routeExists = config.routes.some(route => 
        route.src === routeToAdd.src || route.dest === routeToAdd.dest
      );
      
      if (!routeExists) {
        config.routes.unshift(routeToAdd);
        console.log(`已添加路由规则: ${routeToAdd.src} -> ${routeToAdd.dest}`);
      }
    });
    
    // 写回配置文件
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log('成功更新.vercel/output/config.json');
  } catch (e) {
    console.error('更新config.json失败:', e);
  }
}

// 检查并创建静态HTML文件，确保dest路径有效
const staticDir = path.join(process.cwd(), '.vercel', 'output', 'static');
if (fs.existsSync(staticDir)) {
  // 确保about页面的静态HTML文件存在
  const aboutPages = [
    { src: '/en/about/index.html', content: path.join(staticDir, 'en/about/index.html') },
    { src: '/zh/about/index.html', content: path.join(staticDir, 'zh/about/index.html') }
  ];
  
  aboutPages.forEach(page => {
    const pageDir = path.dirname(page.content);
    if (!fs.existsSync(pageDir)) {
      try {
        fs.mkdirSync(pageDir, { recursive: true });
        console.log(`创建目录: ${pageDir}`);
      } catch (e) {
        console.error(`创建目录失败: ${pageDir}`, e);
      }
    }
    
    // 如果HTML文件不存在，创建一个基本的重定向文件
    if (!fs.existsSync(page.content)) {
      try {
        const locale = page.src.includes('/en/') ? 'en' : 'zh';
        const redirectContent = `
<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0;url=/${locale}/about">
  <title>${locale === 'en' ? 'About Us' : '关于我们'} | Zexin Mining</title>
</head>
<body>
  <p>${locale === 'en' ? 'Redirecting to About page...' : '正在重定向到关于我们页面...'}</p>
</body>
</html>
        `;
        fs.writeFileSync(page.content, redirectContent);
        console.log(`创建静态HTML文件: ${page.content}`);
      } catch (e) {
        console.error(`创建静态HTML文件失败: ${page.content}`, e);
      }
    }
  });
}

console.log('Vercel部署修复脚本执行完成'); 