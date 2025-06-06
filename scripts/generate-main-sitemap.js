/**
 * 主站点地图生成脚本
 * 
 * 此脚本生成包含主要页面的站点地图，不包含产品、新闻和案例详情页
 */

const fs = require('fs');
const path = require('path');

console.log('生成主站点地图...');

// 支持的语言
const locales = ['en', 'zh'];

// 站点URL
const siteUrl = 'https://www.zexinmining.com';
const currentDate = new Date().toISOString();

/**
 * 生成主要页面站点地图XML
 */
function generateMainSitemap() {
  // 主页面URL配置
  const mainUrls = [
    // 首页 - 更高优先级
    { path: '', changefreq: 'daily', priority: '1.0' },
    // 产品主页和分类页面
    { path: '/products', changefreq: 'weekly', priority: '0.8' },
    { path: '/products/ore-processing', changefreq: 'weekly', priority: '0.8' },
    { path: '/products/mineral-processing-solutions', changefreq: 'weekly', priority: '0.8' },
    { path: '/products/mining-epc', changefreq: 'weekly', priority: '0.8' },
    { path: '/products/ore-processing/vibrating-screens', changefreq: 'weekly', priority: '0.7' },
    { path: '/products/ore-processing/stationary-crushers', changefreq: 'weekly', priority: '0.7' },
    { path: '/products/ore-processing/grinding-equipment', changefreq: 'weekly', priority: '0.7' },
    { path: '/products/ore-processing/flotation-equipment', changefreq: 'weekly', priority: '0.7' },
    { path: '/products/ore-processing/gravity-separation', changefreq: 'weekly', priority: '0.7' },
    { path: '/products/ore-processing/magnetic-separator', changefreq: 'weekly', priority: '0.7' },
    { path: '/products/ore-processing/washing-equipment', changefreq: 'weekly', priority: '0.7' },
    { path: '/products/ore-processing/classification-equipment', changefreq: 'weekly', priority: '0.7' },
    { path: '/products/ore-processing/feeding-equipment', changefreq: 'weekly', priority: '0.7' },
    // 矿物处理解决方案二级页面
    { path: '/products/mineral-processing-solutions/ferrous/chrome', changefreq: 'weekly', priority: '0.7' },
    { path: '/products/mineral-processing-solutions/ferrous/hematite', changefreq: 'weekly', priority: '0.7' },
    { path: '/products/mineral-processing-solutions/ferrous/magnetite', changefreq: 'weekly', priority: '0.7' },
    { path: '/products/mineral-processing-solutions/ferrous/manganese', changefreq: 'weekly', priority: '0.7' },
    { path: '/products/mineral-processing-solutions/non-ferrous/antimony', changefreq: 'weekly', priority: '0.7' },
    { path: '/products/mineral-processing-solutions/non-ferrous/black-tungsten', changefreq: 'weekly', priority: '0.7' },
    { path: '/products/mineral-processing-solutions/non-ferrous/copper-lead-zinc', changefreq: 'weekly', priority: '0.7' },
    { path: '/products/mineral-processing-solutions/non-ferrous/molybdenum', changefreq: 'weekly', priority: '0.7' },
    { path: '/products/mineral-processing-solutions/non-ferrous/tin', changefreq: 'weekly', priority: '0.7' },
    { path: '/products/mineral-processing-solutions/non-metallic/barite', changefreq: 'weekly', priority: '0.7' },
    { path: '/products/mineral-processing-solutions/non-metallic/feldspar', changefreq: 'weekly', priority: '0.7' },
    { path: '/products/mineral-processing-solutions/non-metallic/fluorite', changefreq: 'weekly', priority: '0.7' },
    { path: '/products/mineral-processing-solutions/non-metallic/graphite', changefreq: 'weekly', priority: '0.7' },
    { path: '/products/mineral-processing-solutions/non-metallic/phosphorite', changefreq: 'weekly', priority: '0.7' },
    { path: '/products/mineral-processing-solutions/precious-metals/gold', changefreq: 'weekly', priority: '0.7' },
    { path: '/products/mineral-processing-solutions/precious-metals/placer-gold', changefreq: 'weekly', priority: '0.7' },
    { path: '/products/mineral-processing-solutions/precious-metals/silver', changefreq: 'weekly', priority: '0.7' },
    // 新闻和案例页面
    { path: '/news', changefreq: 'weekly', priority: '0.8' },
    { path: '/cases', changefreq: 'weekly', priority: '0.8' },
    // 关于我们
    { path: '/about', changefreq: 'monthly', priority: '0.6' },
  ];
  
  let urls = [];
  
  // 为每种语言生成URL
  locales.forEach(locale => {
    mainUrls.forEach(({ path, changefreq, priority }) => {
      urls.push({
        loc: `${siteUrl}/${locale}${path}`,
        lastmod: currentDate,
        changefreq,
        priority
      });
    });
  });
  
  // 添加根域名
  urls.push({
    loc: siteUrl,
    lastmod: currentDate,
    changefreq: 'daily',
    priority: '1.0'
  });
  
  // 添加robots.txt文件
  urls.push({
    loc: `${siteUrl}/robots.txt`,
    lastmod: currentDate,
    changefreq: 'weekly',
    priority: '0.5'
  });
  
  // 生成XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urls.map(url => `<url><loc>${url.loc}</loc><lastmod>${url.lastmod}</lastmod><changefreq>${url.changefreq}</changefreq><priority>${url.priority}</priority></url>`).join('\n')}
</urlset>`;

  // 写入文件
  try {
    fs.writeFileSync(path.join(process.cwd(), 'public', 'sitemap-0.xml'), xml);
    console.log(`成功生成主站点地图，包含 ${urls.length} 个URL`);
    return true;
  } catch (error) {
    console.error('写入站点地图文件时出错:', error);
    return false;
  }
}

// 执行生成
const mainSitemapGenerated = generateMainSitemap();
console.log('主站点地图生成完成'); 