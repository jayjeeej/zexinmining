const fs = require('fs');
const path = require('path');
const glob = require('glob');
const http = require('http');
const { execSync } = require('child_process');

// 获取所有产品页面
const productPages = glob.sync('app/**/products/ore-processing/**/**/page.tsx');

// 从页面路径提取URL
function getUrlFromPagePath(pagePath) {
  // 将app/zh/products/... 转换为 /zh/products/...
  let urlPath = pagePath
    .replace(/^app/, '')
    .replace(/\/page\.tsx$/, '')
    .replace(/\\/g, '/'); // 将反斜杠替换为正斜杠
  
  // 移除末尾的page.tsx
  urlPath = urlPath.replace(/\/page\.tsx$/, '');
  
  // 为不同分类选择合适的产品ID
  if (urlPath.includes('[productId]')) {
    let productId = 'inclined-vibrating-screen'; // 默认ID
    
    if (urlPath.includes('flotation-equipment')) {
      productId = 'self-aspirated-flotation-cell';
    } else if (urlPath.includes('gravity-separation')) {
      productId = 'shaking-table';
    } else if (urlPath.includes('magnetic-separator')) {
      productId = 'drum-magnetic-separator';
    } else if (urlPath.includes('grinding-equipment')) {
      productId = 'ball-mill';
    } else if (urlPath.includes('stationary-crushers')) {
      productId = 'jaw-crusher';
    } else if (urlPath.includes('feeding-equipment')) {
      productId = 'vibrating-feeder';
    } else if (urlPath.includes('classification-equipment')) {
      productId = 'hydrocyclone-separator';
    } else if (urlPath.includes('washing-equipment')) {
      productId = 'spiral-washer';
    }
    
    urlPath = urlPath.replace(/\[productId\]/, productId);
  }
  
  return `http://localhost:3003${urlPath}`;
}

// 测试URL是否可访问
async function testUrl(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      resolve({
        url,
        status: res.statusCode,
        success: res.statusCode === 200
      });
    }).on('error', (err) => {
      resolve({
        url,
        status: 'error',
        success: false,
        error: err.message
      });
    });
  });
}

// 检查开发服务器是否运行
function checkServerRunning() {
  try {
    // 使用Windows兼容的方式检查服务器
    const result = execSync('curl -s -I http://localhost:3003', { encoding: 'utf8' });
    return result.includes('HTTP/1.1');
  } catch (error) {
    console.error('检查服务器状态时出错:', error.message);
    return false;
  }
}

// 主函数
async function main() {
  // 检查服务器是否运行
  if (!checkServerRunning()) {
    console.log('开发服务器未运行，请先运行 npm run dev');
    return;
  }
  
  const urls = productPages.map(getUrlFromPagePath);
  console.log(`测试 ${urls.length} 个产品页面...`);
  
  // 测试所有URL
  const results = await Promise.all(urls.map(testUrl));
  
  // 显示结果
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`\n测试结果: ${successful.length}/${results.length} 页面可访问`);
  
  if (failed.length > 0) {
    console.log('\n失败的页面:');
    failed.forEach(result => {
      console.log(`❌ ${result.url} - 状态: ${result.status}`);
    });
  }
  
  if (successful.length > 0) {
    console.log('\n成功的页面:');
    successful.forEach(result => {
      console.log(`✓ ${result.url}`);
    });
  }
}

main().catch(console.error); 