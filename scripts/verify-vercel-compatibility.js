/**
 * Vercel兼容性验证工具
 * 检查动态路由页面是否符合Vercel最佳实践
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// 需要检查的Vercel优化导出指令
const REQUIRED_EXPORTS = [
  'dynamic',
  'revalidate',
  'fetchCache',
  'runtime',
  'preferredRegion',
];

// 需要检查的安全参数处理函数
const SAFETY_FUNCTIONS = [
  'safelyGetRouteParams',
  'await Promise.resolve',
];

// 获取动态路由页面路径
function getDynamicRoutePaths(dir, results = []) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // 如果目录名包含[xx]格式，则可能是动态路由
      if (file.includes('[') && file.includes(']')) {
        // 检查是否有page.tsx文件
        const pagePath = path.join(filePath, 'page.tsx');
        if (fs.existsSync(pagePath)) {
          results.push(pagePath);
        }
      }
      
      // 递归检查子目录
      getDynamicRoutePaths(filePath, results);
    }
  }
  
  return results;
}

// 检查文件中是否包含特定字符串
function containsString(filePath, searchStr) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content.includes(searchStr);
  } catch (error) {
    console.error(`读取文件失败: ${filePath}`, error);
    return false;
  }
}

// 检查文件是否包含所有指定的导出指令
function checkRequiredExports(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const results = [];
  
  for (const exportName of REQUIRED_EXPORTS) {
    const exportPattern = new RegExp(`export\\s+const\\s+${exportName}\\s*=`);
    const hasExport = exportPattern.test(content);
    results.push({
      name: exportName,
      present: hasExport
    });
  }
  
  return results;
}

// 检查文件是否包含安全参数处理
function checkSafetyFunctions(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const results = [];
  
  for (const func of SAFETY_FUNCTIONS) {
    const hasFunction = content.includes(func);
    results.push({
      name: func,
      present: hasFunction
    });
  }
  
  return results;
}

// 检查是否正确处理了await
function checkAwaitParams(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // 检查是否有可能的参数解构而未使用await
    const problematicPattern = /const\s*\{\s*[a-zA-Z0-9_,\s]+\s*\}\s*=\s*params/;
    return !problematicPattern.test(content);
  } catch (error) {
    console.error(`读取文件失败: ${filePath}`, error);
    return false;
  }
}

// 主函数
function verifyVercelCompatibility() {
  console.log('开始验证Vercel兼容性...');
  
  // 获取所有动态路由页面
  const appDir = path.join(process.cwd(), 'app');
  const dynamicRoutes = getDynamicRoutePaths(appDir);
  
  console.log(`找到 ${dynamicRoutes.length} 个动态路由页面`);
  
  // 分析每个页面
  const results = dynamicRoutes.map(pagePath => {
    const relativePath = path.relative(process.cwd(), pagePath);
    const exportChecks = checkRequiredExports(pagePath);
    const safetyChecks = checkSafetyFunctions(pagePath);
    const awaitParamsCorrect = checkAwaitParams(pagePath);
    
    const allExportsPresent = exportChecks.every(check => check.present);
    const anySafetyPresent = safetyChecks.some(check => check.present);
    
    const status = allExportsPresent && anySafetyPresent && awaitParamsCorrect
      ? 'pass'
      : 'fail';
    
    return {
      path: relativePath,
      status,
      exportChecks,
      safetyChecks,
      awaitParamsCorrect
    };
  });
  
  // 总结结果
  const passCount = results.filter(r => r.status === 'pass').length;
  console.log(`\n验证结果: ${passCount}/${results.length} 个页面通过`);
  
  // 显示结果
  results.forEach(result => {
    if (result.status === 'pass') {
      console.log(`✓ ${result.path}`);
    } else {
      console.log(`✗ ${result.path}`);
      
      // 显示缺失的导出
      const missingExports = result.exportChecks.filter(c => !c.present);
      if (missingExports.length > 0) {
        console.log(`  缺少导出: ${missingExports.map(e => e.name).join(', ')}`);
      }
      
      // 显示安全函数缺失
      if (!result.safetyChecks.some(c => c.present)) {
        console.log(`  缺少安全参数处理: ${SAFETY_FUNCTIONS.join(' 或 ')}`);
      }
      
      // 显示await参数问题
      if (!result.awaitParamsCorrect) {
        console.log('  可能存在参数解构而未使用await的问题');
      }
    }
  });
  
  // 提供建议
  console.log('\n优化建议:');
  console.log('1. 为所有动态路由页面添加以下导出指令:');
  console.log(`
export const dynamic = 'force-static';        // 强制静态生成
export const revalidate = 3600;               // 每小时重新验证一次
export const fetchCache = 'force-cache';      // 强制使用缓存
export const runtime = 'nodejs';              // 使用Node.js运行时
export const preferredRegion = 'auto';        // 自动选择最佳区域
`);
  
  console.log('2. 确保使用safelyGetRouteParams函数处理路由参数:');
  console.log(`
const { productId } = await safelyGetRouteParams(params);
// 而不是
const { productId } = params;
`);
  
  return {
    total: results.length,
    passed: passCount,
    failed: results.length - passCount,
    details: results
  };
}

// 执行验证
const results = verifyVercelCompatibility();
console.log(`\n总结: 通过 ${results.passed}/${results.total} (${Math.round(results.passed/results.total*100)}%)`);

module.exports = {
  verifyVercelCompatibility
}; 