/**
 * 产品站点地图生成脚本
 * 
 * 此脚本自动为产品页面生成站点地图
 */

const fs = require('fs');
const path = require('path');

console.log('生成产品站点地图...');

// 产品类别列表
const productCategories = [
  'vibrating-screens',
  'stationary-crushers',
  'grinding-equipment',
  'flotation-equipment',
  'gravity-separation',
  'magnetic-separator',
  'washing-equipment',
  'classification-equipment',
  'feeding-equipment'
];

// 支持的语言
const locales = ['en', 'zh'];

// 站点URL
const siteUrl = 'https://www.zexinmining.com';

/**
 * 获取指定目录下的所有JSON文件
 */
function getProductFiles(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) {
      console.log(`目录不存在: ${dirPath}`);
      return [];
    }
    
    return fs.readdirSync(dirPath)
      .filter(file => file.endsWith('.json'))
      .map(file => path.join(dirPath, file));
  } catch (error) {
    console.error(`读取目录 ${dirPath} 时出错:`, error);
    return [];
  }
}

/**
 * 从产品JSON文件生成URL
 */
function generateProductUrl(locale, category, productId) {
  // 修正URL生成逻辑，确保类别路径正确
  return `${siteUrl}/${locale}/products/ore-processing/${category}/${productId}`;
}

/**
 * 生成产品站点地图XML
 */
function generateProductSitemap() {
  let urls = [];
  
  // 遍历所有类别和语言
  productCategories.forEach(category => {
    locales.forEach(locale => {
      // 直接查找产品目录，不再包含ore-processing中间路径
      const categoryDir = path.join(process.cwd(), 'public', 'data', locale, category);
      const productFiles = getProductFiles(categoryDir);
      
      productFiles.forEach(filePath => {
        try {
          // 读取产品数据
          const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          const productId = path.basename(filePath, '.json');
          
          // 添加产品URL
          urls.push({
            loc: generateProductUrl(locale, category, productId),
            lastmod: new Date().toISOString(),
            changefreq: 'monthly',
            priority: '0.7'
          });
        } catch (error) {
          console.error(`处理文件 ${filePath} 时出错:`, error);
        }
      });
    });
  });
  
  // 生成XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  // 写入文件
  try {
    fs.writeFileSync(path.join(process.cwd(), 'public', 'product-sitemap.xml'), xml);
    console.log(`成功生成产品站点地图，包含 ${urls.length} 个URL`);
  } catch (error) {
    console.error('写入站点地图文件时出错:', error);
  }
}

// 执行生成
generateProductSitemap();

console.log('产品站点地图生成完成'); 