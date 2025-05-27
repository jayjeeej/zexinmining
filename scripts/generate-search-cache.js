/**
 * 搜索预缓存生成脚本
 * 此脚本为常见搜索词生成预缓存结果，提高搜索API性能
 */

const fs = require('fs');
const path = require('path');

console.log('生成搜索预缓存数据...');

// 常见搜索词列表（中英文）
const commonSearchTerms = [
  'vibrating screen', '振动筛',
  'crusher', '破碎机',
  'grinding', '研磨',
  'flotation', '浮选',
  'magnetic', '磁选',
  'mining', '矿业',
  'equipment', '设备',
  'processing', '加工',
  'iron', '铁矿',
  'iron ore', '铁矿石',
  'magnetic separator', '磁选机'
];

// 支持的语言
const locales = ['en', 'zh'];

/**
 * 模拟搜索逻辑，生成搜索结果
 * 注意：这是一个简化版本，只包含基本产品搜索
 */
function generateSearchResults(query, locale) {
  const results = [];
  const searchDir = path.join(process.cwd(), 'public', 'data', locale);
  
  // 检查目录是否存在
  if (!fs.existsSync(searchDir)) {
    console.log(`目录不存在: ${searchDir}`);
    return results;
  }
  
  // 获取所有子目录
  const categoryDirs = fs.readdirSync(searchDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  
  // 遍历所有产品类别
  for (const category of categoryDirs) {
    const categoryPath = path.join(searchDir, category);
    
    try {
      // 获取所有JSON文件
      const files = fs.readdirSync(categoryPath)
        .filter(file => file.endsWith('.json'));
      
      for (const file of files) {
        try {
          const filePath = path.join(categoryPath, file);
          const content = fs.readFileSync(filePath, 'utf8');
          const product = JSON.parse(content);
          
          // 简化版搜索逻辑
          const searchableContent = [
            product.title,
            product.overview,
            product.productCategory,
            product.id.replace(/-/g, ' ')
          ].filter(Boolean).join(' ').toLowerCase();
          
          // 检查是否匹配搜索词
          if (searchableContent.includes(query.toLowerCase())) {
            results.push({
              id: product.id,
              url: `/${locale}/products/${category}/${product.id}`,
              title: product.title,
              excerpt: product.overview?.substring(0, 150) + '...',
              category: product.productCategory,
              score: 100,
              imageSrc: product.imageSrc || '',
              resultType: 'product'
            });
          }
        } catch (error) {
          console.error(`处理文件 ${file} 时出错:`, error);
        }
      }
    } catch (error) {
      console.error(`读取目录 ${categoryPath} 时出错:`, error);
    }
  }
  
  return results;
}

/**
 * 生成并保存搜索缓存文件
 */
function generateSearchCache() {
  const cacheDir = path.join(process.cwd(), 'public', 'cache', 'search');
  
  // 创建缓存目录
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }
  
  // 生成每个语言的搜索缓存
  for (const locale of locales) {
    const localeCacheDir = path.join(cacheDir, locale);
    
    // 创建语言目录
    if (!fs.existsSync(localeCacheDir)) {
      fs.mkdirSync(localeCacheDir, { recursive: true });
    }
    
    // 生成每个搜索词的缓存
    for (const term of commonSearchTerms) {
      try {
        // 生成搜索结果
        const results = generateSearchResults(term, locale);
        
        // 保存结果到缓存文件
        const fileName = term.replace(/\s+/g, '-').toLowerCase() + '.json';
        const filePath = path.join(localeCacheDir, fileName);
        
        fs.writeFileSync(filePath, JSON.stringify(results));
        console.log(`生成缓存文件: ${filePath}, 包含 ${results.length} 个结果`);
      } catch (error) {
        console.error(`生成搜索缓存失败: ${term} (${locale}):`, error);
      }
    }
  }
}

// 执行生成
generateSearchCache();

console.log('搜索预缓存数据生成完成'); 