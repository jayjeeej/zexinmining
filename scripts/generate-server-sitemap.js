/**
 * 服务器站点地图生成脚本
 * 
 * 此脚本生成新闻、案例和动态页面的站点地图
 */

const fs = require('fs');
const path = require('path');

console.log('生成服务器端站点地图...');

// 支持的语言
const locales = ['en', 'zh'];

// 站点URL
const siteUrl = 'https://www.zexinmining.com';
const currentDate = new Date().toISOString();

/**
 * 获取指定目录下的所有JSON文件
 */
function getJsonFiles(dirPath) {
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
 * 生成服务器站点地图XML
 */
function generateServerSitemap() {
  let urls = [];
  
  // 添加新闻页面
  locales.forEach(locale => {
    const newsDir = path.join(process.cwd(), 'public', 'data', locale, 'news');
    const newsFiles = getJsonFiles(newsDir);
    
    newsFiles.forEach(filePath => {
      try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const newsSlug = data.slug || path.basename(filePath, '.json');
        
        urls.push({
          loc: `${siteUrl}/${locale}/news/${newsSlug}`,
          lastmod: currentDate,
          changefreq: 'weekly',
          priority: '0.6'
        });
      } catch (error) {
        console.error(`处理文件 ${filePath} 时出错:`, error);
      }
    });
  });
  
  // 添加案例页面
  locales.forEach(locale => {
    const casesDir = path.join(process.cwd(), 'public', 'data', locale, 'case-studies');
    const caseFiles = getJsonFiles(casesDir);
    
    caseFiles.forEach(filePath => {
      try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const caseSlug = data.slug || path.basename(filePath, '.json');
        
        urls.push({
          loc: `${siteUrl}/${locale}/cases/${caseSlug}`,
          lastmod: currentDate,
          changefreq: 'monthly',
          priority: '0.7'
        });
      } catch (error) {
        console.error(`处理文件 ${filePath} 时出错:`, error);
      }
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
    fs.writeFileSync(path.join(process.cwd(), 'public', 'server-sitemap.xml'), xml);
    console.log(`成功生成服务器端站点地图，包含 ${urls.length} 个URL`);
    return true;
  } catch (error) {
    console.error('写入站点地图文件时出错:', error);
    return false;
  }
}

/**
 * 更新站点地图索引
 */
function updateSitemapIndex() {
  const indexPath = path.join(process.cwd(), 'public', 'sitemap.xml');
  
  // 如果主索引不存在，尝试执行产品站点地图脚本生成
  if (!fs.existsSync(indexPath)) {
    console.log('站点地图索引不存在，尝试生成...');
    try {
      // 尝试运行产品脚本生成主索引
      const generateSitemaps = require('./generate-sitemaps');
      return;
    } catch (error) {
      console.error('无法自动生成站点地图索引:', error);
      // 继续手动创建索引
    }
  }
  
  // 如果主索引存在，确保包含server-sitemap.xml
  try {
    const sitemapFiles = [
      {
        name: 'sitemap-0.xml',
        lastmod: currentDate
      },
      {
        name: 'product-sitemap.xml',
        lastmod: currentDate
      },
      {
        name: 'server-sitemap.xml',
        lastmod: currentDate
      }
    ];
    
    // 生成XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapFiles.map(file => `  <sitemap>
    <loc>${siteUrl}/${file.name}</loc>
    <lastmod>${file.lastmod}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;

    fs.writeFileSync(indexPath, xml);
    console.log('站点地图索引已更新');
  } catch (error) {
    console.error('更新站点地图索引时出错:', error);
  }
}

// 执行生成
const serverSitemapGenerated = generateServerSitemap();

// 如果生成成功，更新索引
if (serverSitemapGenerated) {
  updateSitemapIndex();
}

console.log('服务器端站点地图生成完成'); 