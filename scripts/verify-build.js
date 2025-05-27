const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 启用彩色输出
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

console.log(`${colors.blue}开始验证构建输出...${colors.reset}`);

// 检查构建目录是否存在
const buildDir = path.join(process.cwd(), '.next');
if (!fs.existsSync(buildDir)) {
  console.error(`${colors.red}错误: .next 目录不存在，请先运行 'npm run build'${colors.reset}`);
  process.exit(1);
}

// 检查重要路由是否已经生成
const importantRoutes = [
  '.next/server/app/en/page.html',
  '.next/server/app/zh/page.html',
  '.next/server/app/en/about/page.html',
  '.next/server/app/zh/about/page.html'
];

const missingRoutes = importantRoutes.filter(route => {
  const exists = fs.existsSync(path.join(process.cwd(), route));
  if (!exists) {
    console.log(`Missing route: ${route}`);
  } else {
    console.log(`Found route: ${route}`);
  }
  return !exists;
});

if (missingRoutes.length > 0) {
  console.warn('Warning: Some important routes are missing from the build.');
  console.warn('You might want to check your route configuration.');
} else {
  console.log('All important routes are present in the build.');
}

// 检查serverless函数是否被正确生成
const lambdaDir = path.join(process.cwd(), '.next/server/pages');
if (fs.existsSync(lambdaDir)) {
  const lambdaFiles = fs.readdirSync(lambdaDir);
  console.log('Found lambda functions:', lambdaFiles);
} else {
  console.log('No lambda functions directory found.');
}

// 输出Next.js构建信息
const buildManifest = path.join(process.cwd(), '.next/build-manifest.json');
if (fs.existsSync(buildManifest)) {
  const manifest = JSON.parse(fs.readFileSync(buildManifest, 'utf8'));
  console.log('Build manifest pages:', Object.keys(manifest.pages));
} else {
  console.log('Build manifest not found.');
}

// 检查路由配置
console.log(`${colors.blue}检查国际化路由配置...${colors.reset}`);

try {
  // 使用 next-routes-manifest 获取路由清单
  const manifest = require('../.next/routes-manifest.json');
  console.log(`${colors.green}成功加载路由清单${colors.reset}`);

  // 检查特定路由是否存在
  const routesToCheck = ['/en/about', '/zh/about'];

  // 在动态路由中查找
  const dynamicRoutes = manifest.dynamicRoutes || [];
  const dynamicMatches = dynamicRoutes.filter(route => 
    routesToCheck.some(pathToCheck => {
      const regex = new RegExp(route.regex.slice(1, -1));
      return regex.test(pathToCheck);
    })
  );

  if (dynamicMatches.length > 0) {
    console.log(`${colors.green}找到了匹配的动态路由配置：${colors.reset}`);
    dynamicMatches.forEach(route => {
      console.log(`- 路由规则: ${route.page}`);
    });
  } else {
    console.log(`${colors.yellow}警告: 未在动态路由中找到 '/en/about' 和 '/zh/about' 路径${colors.reset}`);
  }

  // 查找中间件是否正确配置
  if (fs.existsSync(path.join(buildDir, 'server', 'middleware.js'))) {
    console.log(`${colors.green}中间件存在，这对国际化路由很重要${colors.reset}`);
  } else {
    console.log(`${colors.yellow}警告: 中间件文件可能不存在，这可能影响国际化路由${colors.reset}`);
  }

  // 检查缺失的lambda函数
  console.log(`${colors.blue}检查缺失的Lambda函数...${colors.reset}`);
  const buildOutput = fs.readFileSync(path.join(buildDir, 'build-manifest.json'), 'utf8');
  const buildManifest = JSON.parse(buildOutput);

  // 检查about页面的客户端构建文件
  const aboutPageFiles = Object.keys(buildManifest.pages).filter(page => 
    page.includes('/about')
  );

  if (aboutPageFiles.length > 0) {
    console.log(`${colors.green}在构建清单中找到About页面文件:${colors.reset}`);
    aboutPageFiles.forEach(file => {
      console.log(`- ${file}`);
    });
  } else {
    console.log(`${colors.yellow}警告: 在构建清单中未找到About页面文件${colors.reset}`);
  }

  // 检查服务器组件的存在
  console.log(`${colors.blue}检查服务器组件...${colors.reset}`);
  
  // Next.js 15可能使用不同的目录结构
  const possibleServerDirs = [
    path.join(buildDir, 'server', 'app'),
    path.join(buildDir, 'server', 'pages'),
    path.join(buildDir, 'server', 'chunks', 'app')
  ];

  let aboutServerComponents = [];
  
  // 搜索多个可能的位置
  for (const dir of possibleServerDirs) {
    if (fs.existsSync(dir)) {
      try {
        const serverFiles = searchFilesRecursive(dir, []);
        const aboutFiles = serverFiles.filter(file => 
          file.includes('about') && 
          (file.includes('page') || file.includes('route'))
        );
        aboutServerComponents = [...aboutServerComponents, ...aboutFiles];
      } catch (err) {
        console.log(`${colors.yellow}搜索目录 ${dir} 时出错: ${err.message}${colors.reset}`);
      }
    }
  }

  if (aboutServerComponents.length > 0) {
    console.log(`${colors.green}找到About页面的服务器组件:${colors.reset}`);
    aboutServerComponents.forEach(file => {
      console.log(`- ${file}`);
    });
  } else {
    console.log(`${colors.yellow}警告: 未找到About页面的服务器组件${colors.reset}`);
  }

  // 查找与问题路由相关的lambda函数
  const serverOutputPath = path.join(buildDir, 'server', 'app');
  if (fs.existsSync(serverOutputPath)) {
    console.log(`${colors.blue}检查Lambda函数文件...${colors.reset}`);

    // 看看是否有专门针对 /en/about 的配置
    const enAboutPath = path.join(serverOutputPath, 'en', 'about');
    if (fs.existsSync(enAboutPath)) {
      console.log(`${colors.green}/en/about 路径存在${colors.reset}`);
      const files = fs.readdirSync(enAboutPath);
      console.log(`文件: ${files.join(', ')}`);
    } else {
      console.log(`${colors.yellow}/en/about 路径不存在，可能使用了动态路由${colors.reset}`);
    }
  }
  
  console.log(`${colors.green}验证完成!${colors.reset}`);
  
} catch (err) {
  console.error(`${colors.red}验证构建输出时出错: ${err.message}${colors.reset}`);
  process.exit(1);
}

// 递归搜索文件辅助函数
function searchFilesRecursive(dir, fileList = []) {
  try {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      if (fs.statSync(filePath).isDirectory()) {
        searchFilesRecursive(filePath, fileList);
      } else {
        fileList.push(filePath);
      }
    });
  } catch (err) {
    console.log(`${colors.yellow}无法读取目录 ${dir}: ${err.message}${colors.reset}`);
  }
  
  return fileList;
} 