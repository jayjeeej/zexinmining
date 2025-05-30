/**
 * Vercel兼容性自动修复工具
 * 为动态路由页面添加必要的Vercel优化导出指令和安全参数处理
 */

const fs = require('fs');
const path = require('path');
const { verifyVercelCompatibility } = require('./verify-vercel-compatibility');
const glob = require('glob');

// Vercel优化导出指令模板
const VERCEL_EXPORTS_TEMPLATE = `
// Vercel 优化导出指令
export const dynamic = 'force-static';        // 强制静态生成
export const revalidate = 3600;               // 每小时重新验证一次
export const fetchCache = 'force-cache';      // 强制使用缓存
export const runtime = 'nodejs';              // 使用Node.js运行时
export const preferredRegion = 'auto';        // 自动选择最佳区域
`;

// 安全参数处理模式的正则表达式
const UNSAFE_PARAMS_REGEX = /const\s*\{\s*([a-zA-Z0-9_,\s]+)\s*\}\s*=\s*params/g;
const SAFE_PARAMS_TEMPLATE = (captured) => `const { ${captured} } = await safelyGetRouteParams(params)`;

// 检查并确保导入safelyGetRouteParams
function ensureSafelyGetRouteParamsImport(content) {
  if (!content.includes('safelyGetRouteParams')) {
    // 检查是否有其他导入
    if (content.includes('import {') && content.includes('} from \'@/lib/utils\';')) {
      // 在现有的utils导入中添加safelyGetRouteParams
      return content.replace(/import\s*\{\s*([^}]*)\s*\}\s*from\s*['"]@\/lib\/utils['"];/, 
        (match, captured) => {
          const existingImports = captured.split(',').map(imp => imp.trim());
          if (!existingImports.includes('safelyGetRouteParams')) {
            existingImports.push('safelyGetRouteParams');
          }
          return `import { ${existingImports.join(', ')} } from '@/lib/utils';`;
        });
    } else if (content.includes('import') && content.includes('from \'@/lib/utils\';')) {
      // 有utils导入但不是使用{}格式
      return content.replace(/import\s+([^{}\s]+)\s+from\s+['"]@\/lib\/utils['"];/, 
        (match, captured) => {
          return `import ${captured}, { safelyGetRouteParams } from '@/lib/utils';`;
        });
    } else {
      // 没有任何utils导入，添加一个新的导入语句
      // 找到最后一个导入语句
      const lastImportIndex = content.lastIndexOf('import');
      if (lastImportIndex !== -1) {
        const endOfImportIndex = content.indexOf(';', lastImportIndex);
        if (endOfImportIndex !== -1) {
          return content.slice(0, endOfImportIndex + 1) + 
                 '\nimport { safelyGetRouteParams } from \'@/lib/utils\';' + 
                 content.slice(endOfImportIndex + 1);
        }
      }
      
      // 如果找不到导入语句，添加到文件开头
      return 'import { safelyGetRouteParams } from \'@/lib/utils\';\n' + content;
    }
  }
  
  return content;
}

// 添加Vercel优化导出指令
function addVercelExports(content) {
  // 检查是否已有任何导出指令
  if (content.includes('export const dynamic') || 
      content.includes('export const revalidate') || 
      content.includes('export const fetchCache') ||
      content.includes('export const runtime') ||
      content.includes('export const preferredRegion')) {
    // 已有部分导出指令，进行逐个检查和添加
    let updatedContent = content;
    
    if (!content.includes('export const dynamic')) {
      updatedContent = updatedContent.replace(/import.*?;(\s*)/m, 
        (match, captured) => match + captured + 'export const dynamic = \'force-static\';        // 强制静态生成\n');
    }
    
    if (!content.includes('export const revalidate')) {
      updatedContent = updatedContent.replace(/import.*?;(\s*)/m, 
        (match, captured) => match + captured + 'export const revalidate = 3600;               // 每小时重新验证一次\n');
    }
    
    if (!content.includes('export const fetchCache')) {
      updatedContent = updatedContent.replace(/import.*?;(\s*)/m, 
        (match, captured) => match + captured + 'export const fetchCache = \'force-cache\';      // 强制使用缓存\n');
    }
    
    if (!content.includes('export const runtime')) {
      updatedContent = updatedContent.replace(/import.*?;(\s*)/m, 
        (match, captured) => match + captured + 'export const runtime = \'nodejs\';              // 使用Node.js运行时\n');
    }
    
    if (!content.includes('export const preferredRegion')) {
      updatedContent = updatedContent.replace(/import.*?;(\s*)/m, 
        (match, captured) => match + captured + 'export const preferredRegion = \'auto\';        // 自动选择最佳区域\n');
    }
    
    return updatedContent;
  }
  
  // 没有任何导出指令，添加完整的模板
  // 查找最后一个导入语句位置
  const lastImportIndex = content.lastIndexOf('import');
  if (lastImportIndex !== -1) {
    const endOfImportIndex = content.indexOf(';', lastImportIndex);
    if (endOfImportIndex !== -1) {
      return content.slice(0, endOfImportIndex + 1) + 
             VERCEL_EXPORTS_TEMPLATE + 
             content.slice(endOfImportIndex + 1);
    }
  }
  
  // 如果找不到导入语句，添加到文件开头
  return VERCEL_EXPORTS_TEMPLATE + content;
}

// 修复不安全的参数解构
function fixUnsafeParams(content) {
  return content.replace(UNSAFE_PARAMS_REGEX, (match, captured) => {
    return SAFE_PARAMS_TEMPLATE(captured);
  });
}

// 修复单个文件
function fixSingleFile(filePath) {
  console.log(`修复文件: ${filePath}`);
  
  try {
    // 读取文件内容
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // 1. 确保导入safelyGetRouteParams
    const withImport = ensureSafelyGetRouteParamsImport(content);
    if (withImport !== content) {
      content = withImport;
      modified = true;
      console.log('  - 已添加 safelyGetRouteParams 导入');
    }
    
    // 2. 添加Vercel优化导出指令
    const withExports = addVercelExports(content);
    if (withExports !== content) {
      content = withExports;
      modified = true;
      console.log('  - 已添加 Vercel 优化导出指令');
    }
    
    // 3. 修复不安全的参数解构
    const withSafeParams = fixUnsafeParams(content);
    if (withSafeParams !== content) {
      content = withSafeParams;
      modified = true;
      console.log('  - 已修复不安全的参数解构');
    }
    
    // 保存修改
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('  ✓ 文件已更新');
      return true;
    } else {
      console.log('  ✓ 文件已符合标准，无需修改');
      return false;
    }
  } catch (error) {
    console.error(`  ✗ 修复文件失败: ${error.message}`);
    return false;
  }
}

// 主函数：修复所有不符合标准的动态路由页面
async function fixVercelCompatibility() {
  console.log('开始修复Vercel兼容性问题...');
  
  // 获取验证结果
  const verification = await verifyVercelCompatibility();
  const { details } = verification;
  
  // 过滤出需要修复的文件
  const filesToFix = details.filter(detail => detail.status === 'fail')
    .map(detail => path.join(process.cwd(), detail.path));
  
  console.log(`\n发现 ${filesToFix.length} 个需要修复的文件`);
  
  // 修复每个文件
  let fixedCount = 0;
  for (const filePath of filesToFix) {
    const success = fixSingleFile(filePath);
    if (success) {
      fixedCount++;
    }
  }
  
  console.log(`\n修复完成: ${fixedCount}/${filesToFix.length} 个文件已更新`);
  
  // 再次验证
  console.log('\n正在验证修复结果...');
  const afterVerification = await verifyVercelCompatibility();
  
  return {
    before: {
      total: verification.total,
      passed: verification.passed,
      failed: verification.failed
    },
    after: {
      total: afterVerification.total,
      passed: afterVerification.passed,
      failed: afterVerification.failed
    },
    fixed: fixedCount
  };
}

// 执行修复
fixVercelCompatibility()
  .then(result => {
    console.log(`\n修复前: 通过 ${result.before.passed}/${result.before.total} (${Math.round(result.before.passed/result.before.total*100)}%)`);
    console.log(`修复后: 通过 ${result.after.passed}/${result.after.total} (${Math.round(result.after.passed/result.after.total*100)}%)`);
    console.log(`成功修复 ${result.fixed} 个文件`);
  })
  .catch(err => console.error('修复过程中出错:', err));

// 定义要查找和替换的模式
const patterns = [
  {
    search: /const breadcrumbItems = getProductDetailBreadcrumbConfig\(/g,
    replace: 'const breadcrumbConfig = getProductDetailBreadcrumbConfig('
  },
  {
    search: /const breadcrumbStructuredData = getBreadcrumbStructuredData\(breadcrumbItems, baseUrl\);/g,
    replace: 'const breadcrumbStructuredData = getBreadcrumbStructuredData(breadcrumbConfig, baseUrl);'
  },
  {
    search: /breadcrumbItems={breadcrumbItems}/g,
    replace: 'breadcrumbItems={breadcrumbConfig}'
  },
  {
    search: /breadcrumbItems={breadcrumbsForLayout}/g,
    replace: 'breadcrumbItems={breadcrumbConfig}'
  },
  {
    search: /href: `\/products\/ore-processing\//g,
    replace: 'href: `/${locale}/products/ore-processing/'
  }
];

// 查找所有动态路由产品详情页
const productDetailPages = glob.sync('app/**/products/ore-processing/**/[productId]/page.tsx');

console.log(`找到 ${productDetailPages.length} 个产品详情页面`);

// 修复每个文件
let fixedFiles = 0;

productDetailPages.forEach(filePath => {
  try {
    // 读取文件内容
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    
    // 应用所有替换模式
    patterns.forEach(pattern => {
      content = content.replace(pattern.search, pattern.replace);
    });
    
    // 如果内容有变化，写回文件
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✓ 修复了 ${filePath}`);
      fixedFiles++;
    }
  } catch (error) {
    console.error(`处理 ${filePath} 时出错:`, error);
  }
});

console.log(`\n总结: 修复了 ${fixedFiles}/${productDetailPages.length} 个文件`);

module.exports = {
  fixVercelCompatibility
}; 