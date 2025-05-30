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
        
        // 获取图片
        let imageSrc = '';
        if (item.images && item.images.length > 0) {
          imageSrc = item.images[0];
        } else if (item.coverImage) {
          imageSrc = item.coverImage;
        } else if (item.image) {
          imageSrc = item.image;
        }
        
        // 处理URL
        let url = item.href;
        if (!url) {
          // 根据文件路径生成URL
          const parts = file.split('/');
          const filename = parts.pop().replace('.json', '');
          url = `/${locale}/${parts.join('/')}/${filename}`;
          
          // 标准化URL
          url = url.replace(/\/+/g, '/');
        }
        
        // 添加到索引中
        searchIndex.push({
          id: item.id || path.basename(file, '.json'),
          url,
          title: item.title,
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