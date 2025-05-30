const fs = require('fs');
const path = require('path');
const glob = require('glob');

// 生成搜索索引文件
function generateSearchIndex() {
  console.log('🔍 开始生成搜索索引...');
  
  // 支持的语言
  const locales = ['zh', 'en'];
  
  for (const locale of locales) {
    console.log(`📑 处理 ${locale} 语言...`);
    
    // 数据目录
    const dataDir = path.join(process.cwd(), 'public', 'data', locale);
    
    // 确保目录存在
    if (!fs.existsSync(dataDir)) {
      console.log(`⚠️ 数据目录不存在: ${dataDir}`);
      continue;
    }
    
    // 查找所有JSON文件
    const jsonFiles = glob.sync('**/*.json', { cwd: dataDir });
    console.log(`🗂️ 找到 ${jsonFiles.length} 个JSON文件`);
    
    // 搜索结果数组
    const searchIndex = [];
    
    // 处理所有JSON文件
    for (const file of jsonFiles) {
      try {
        const filePath = path.join(dataDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const item = JSON.parse(content);
        
        // 确定结果类型
        let resultType = 'product';
        if (file.includes('news') || file.includes('blog')) {
          resultType = 'news';
        } else if (file.includes('case')) {
          resultType = 'case';
        }
        
        // 获取图片并确保路径正确
        let imageSrc = '';
        if (item.images && item.images.length > 0) {
          imageSrc = item.images[0];
        } else if (item.coverImage) {
          imageSrc = item.coverImage;
        } else if (item.image) {
          imageSrc = item.image;
        }
        
        // 确保图片路径以/开头
        if (imageSrc && !imageSrc.startsWith('/')) {
          imageSrc = `/${imageSrc}`;
        }
        
        // 确保图片路径没有多余的斜杠
        imageSrc = imageSrc ? imageSrc.replace(/\/+/g, '/') : '';
        
        // 处理URL，优先使用item.href
        let url = '';
        
        if (item.href) {
          url = item.href;
        } else {
          // 根据文件路径和类型构建合适的URL
          const parts = file.split('/');
          const filename = parts.pop().replace('.json', '');
          
          if (resultType === 'news') {
            url = `/${locale}/news/${filename}`;
          } else if (resultType === 'case') {
            url = `/${locale}/cases/${filename}`;
          } else {
            // 产品URL - 考虑产品目录层级
            // 检查是否是具体产品类别下的产品
            if (parts.length > 0) {
              const category = parts[parts.length - 1];
              url = `/${locale}/products/ore-processing/${category}/${filename}`;
            } else {
              url = `/${locale}/products/${filename}`;
            }
          }
        }
        
        // 确保URL以语言前缀开头
        if (!url.startsWith(`/${locale}/`)) {
          url = `/${locale}/${url.replace(/^\//, '')}`;
        }
        
        // 统一格式化URL，去除多余的斜杠
        url = url.replace(/\/+/g, '/');
        
        // 添加到索引中
        searchIndex.push({
          id: item.id || path.basename(file, '.json'),
          url,
          title: item.title || '',
          excerpt: item.overview || item.description || item.excerpt || '',
          category: item.productCategory || item.category || '',
          imageSrc,
          resultType
        });
      } catch (error) {
        console.error(`❌ 处理文件 ${file} 时出错:`, error);
      }
    }
    
    // 输出目录
    const outputDir = path.join(process.cwd(), 'public', 'data');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // 保存索引文件
    const outputPath = path.join(outputDir, `search-index-${locale}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(searchIndex, null, 2));
    console.log(`✅ 生成搜索索引文件: ${outputPath}`);
    console.log(`   索引包含 ${searchIndex.length} 项内容`);
  }
  
  console.log('✅ 搜索索引生成完成!');
}

// 执行函数
generateSearchIndex(); 