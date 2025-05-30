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
        // 增强排除逻辑 - 排除所有与Mineral Processing Solutions相关的内容
        // 排除方案(mineral-processing-solutions)相关文件 - 基于路径
        if (file.toLowerCase().includes('mineral-processing-solutions') || 
            file.startsWith('mineral-processing-solutions/') || 
            file.includes('/mineral-processing-solutions/')) {
          console.log(`⏭️ 跳过解决方案相关文件: ${file}`);
          continue;
        }
        
        const filePath = path.join(dataDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const item = JSON.parse(content);
        
        // 跳过没有标题的项目
        if (!item.title) {
          console.log(`⚠️ 跳过没有标题的项目: ${file}`);
          continue;
        }
        
        // 基于类别和标题排除解决方案相关内容
        if (item.category && 
            (item.category.toLowerCase().includes('mineral processing solutions') || 
             item.category.toLowerCase().includes('选矿解决方案'))) {
          console.log(`⏭️ 跳过解决方案相关类别: ${item.category}`);
          continue;
        }
        
        // 获取图片并确保路径正确
        let imageSrc = '';
        if (item.images && item.images.length > 0) {
          imageSrc = item.images[0];
        } else if (item.coverImage) {
          imageSrc = item.coverImage;
        } else if (item.image) {
          imageSrc = item.image;
        } else if (item.imageSrc) {
          imageSrc = item.imageSrc;
        }
        
        // 确保图片路径以/开头
        if (imageSrc && !imageSrc.startsWith('/')) {
          imageSrc = `/${imageSrc}`;
        }
        
        // 确保图片路径没有多余的斜杠
        imageSrc = imageSrc ? imageSrc.replace(/\/+/g, '/') : '';
        
        // 按图片路径进行分类 - 简化版本
        let resultType = 'product'; // 默认为产品
        
        // 根据图片路径判断类型
        if (imageSrc) {
          if (imageSrc.includes('/news/') || 
              imageSrc.includes('/blog/') || 
              imageSrc.includes('/article/') ||
              imageSrc.includes('/technical/')) {
            resultType = 'news';
            console.log(`  - 根据图片路径(${imageSrc})识别为news类型`);
          } else if (imageSrc.includes('/case/') || 
                     imageSrc.includes('/cases/') || 
                     imageSrc.includes('/project/')) {
            resultType = 'case'; 
            console.log(`  - 根据图片路径(${imageSrc})识别为case类型`);
          } else {
            // 特殊处理：确保振动筛相关产品都被正确标识
            if (item.title && (item.title.includes('振动筛') || item.title.includes('筛分') || 
                item.title.includes('筛机') || item.title.includes('筛') && item.title.includes('振动'))) {
              console.log(`  - 特殊处理：振动筛相关产品: ${item.title}`);
              // 确保是产品类型
              resultType = 'product';
            } else {
              console.log(`  - 根据图片路径(${imageSrc})识别为product类型`);
            }
          }
        }
        // 文件路径作为备选判断标准
        else if (file) {
          // 特殊处理：确保振动筛相关产品都被正确标识
          if (file.includes('vibrating-screens') || file.includes('screen') ||
              (item.title && (item.title.includes('振动筛') || item.title.includes('筛分') || 
              item.title.includes('筛机') || (item.title.includes('筛') && item.title.includes('振动'))))) {
            console.log(`  - 特殊处理：振动筛相关产品（来自文件路径）: ${file}`);
            resultType = 'product';
          }
          else if (file.includes('news/') || file.includes('blog/') || file.includes('technical/')) {
            resultType = 'news';
            console.log(`  - 根据文件路径(${file})识别为news类型`);
          } else if (file.includes('case') || file.includes('cases/')) {
            resultType = 'case';
            console.log(`  - 根据文件路径(${file})识别为case类型`);
          } else {
            console.log(`  - 根据文件路径(${file})识别为默认product类型`);
          }
        }
        
        // 检查标题关键词
        if (resultType === 'product' && item.title) {
          const titleLower = item.title.toLowerCase();
          if (titleLower.includes('技术') || titleLower.includes('分析') || 
              titleLower.includes('解析') || titleLower.includes('研究') || 
              titleLower.includes('指南') || titleLower.includes('进展') || 
              titleLower.includes('工艺') || titleLower.includes('突破') ||
              titleLower.includes('technology') || titleLower.includes('analysis') || 
              titleLower.includes('guide') || titleLower.includes('research') ||
              titleLower.includes('progress') || titleLower.includes('breakthrough')) {
            resultType = 'news';
            console.log(`  - 根据标题关键词识别为news类型: ${item.title}`);
          }
        }
        
        // 处理URL - 根据识别的类型生成URL
        let url = '';
        
        // 优先使用item.href
        if (item.href) {
          url = item.href;
          console.log(`  - 使用item.href: ${url}`);
        } 
        // 如果是新闻项或技术文章
        else if (resultType === 'news') {
          // 处理技术文章和新闻URL
          const slug = item.slug || item.id || path.basename(file, '.json');
          url = `/${locale}/news/${slug}`;
          console.log(`  - 生成新闻URL: ${url}`);
        } 
        // 如果是案例项
        else if (resultType === 'case') {
          const caseId = item.slug || item.id || path.basename(file, '.json');
          url = `/${locale}/cases/${caseId}`;
          console.log(`  - 生成案例URL: ${url}`);
        } 
        // 如果是产品项
        else {
          // 根据文件路径和分类构建产品URL
          const itemId = item.id || path.basename(file, '.json');
          
          // 从文件路径提取产品类别
          const parts = file.split('/');
          if (parts.length > 1) {
            const category = parts[0]; // 主分类，如"gravity-separation"
            url = `/${locale}/products/${category}/${itemId}`;
            console.log(`  - 生成产品URL: ${url}`);
          } else {
            // 如果没有分类路径，使用简单的URL
            url = `/${locale}/products/${itemId}`;
            console.log(`  - 生成无分类产品URL: ${url}`);
          }
        }
        
        // 确保URL以语言前缀开头
        if (!url.startsWith(`/${locale}/`)) {
          url = `/${locale}/${url.replace(/^\//, '')}`;
          console.log(`  - 修正URL添加语言前缀: ${url}`);
        }
        
        // 统一格式化URL，去除多余的斜杠
        url = url.replace(/\/+/g, '/');
        
        // 移除任何可能的.json扩展名
        url = url.replace(/\.json(\/|$)/g, '$1');
        
        // 检查并修复URL末尾重复的路径部分
        const urlParts = url.split('/').filter(Boolean);
        if (urlParts.length >= 2 && urlParts[urlParts.length - 1] === urlParts[urlParts.length - 2]) {
          // 删除最后一部分以避免重复
          urlParts.pop();
          url = '/' + urlParts.join('/');
          console.log(`  - 修复URL路径重复: ${url}`);
        }
        
        // 处理摘要内容
        const excerpt = item.overview || item.description || item.excerpt || item.summary || '';
        
        // 获取更精确的分类信息
        let category = '';
        
        // 优先使用明确的分类字段
        if (item.productCategory) {
          category = item.productCategory;
          console.log(`  - 使用productCategory: ${category}`);
        } else if (item.category) {
          category = item.category;
          console.log(`  - 使用category: ${category}`);
        } else if (item.equipment_type) {
          category = item.equipment_type;
          console.log(`  - 使用equipment_type: ${category}`);
        } else if (item.equipmentCategory) {
          category = item.equipmentCategory;
          console.log(`  - 使用equipmentCategory: ${category}`);
        } else if (item.productType) {
          category = item.productType;
          console.log(`  - 使用productType: ${category}`);
        } else {
          // 根据文件路径推断分类
          const parts = file.split('/');
          if (parts.length > 0) {
            // 将路径转换为更人性化的分类名称
            const pathCategory = parts[0]
              .replace(/-/g, ' ')
              .replace(/\b\w/g, l => l.toUpperCase());
            
            // 根据文件路径在特定目录下确定设备类型
            if (pathCategory === 'Vibrating Screens' || 
                pathCategory === 'Washing Equipment' || 
                pathCategory === 'Gravity Separation') {
              category = locale === 'zh' ? 
                `${pathCategory}设备` : 
                `${pathCategory} Equipment`;
              console.log(`  - 推断特殊分类: ${category} (来自路径: ${parts[0]})`);
            } else {
              category = pathCategory;
              console.log(`  - 推断普通分类: ${category} (来自路径: ${parts[0]})`);
            }
          } else if (resultType === 'news') {
            // 新闻分类
            category = locale === 'zh' ? '新闻' : 'News';
            console.log(`  - 默认新闻分类: ${category}`);
          } else if (resultType === 'case') {
            // 案例分类
            category = locale === 'zh' ? '案例' : 'Case Studies';
            console.log(`  - 默认案例分类: ${category}`);
          }
        }
        
        // 再次检查分类，确保不包含解决方案相关内容
        if (category && 
            (category.toLowerCase().includes('mineral processing solutions') || 
             category.toLowerCase().includes('选矿解决方案') ||
             category.toLowerCase().includes('mineral-processing-solutions'))) {
          console.log(`⏭️ 最终检查排除解决方案相关类别: ${category}`);
          continue;
        }
        
        // URL路径最终检查
        if (url.toLowerCase().includes('mineral-processing-solutions') ||
            url.toLowerCase().includes('/solutions/')) {
          console.log(`⏭️ 最终检查排除解决方案相关URL: ${url}`);
          continue;
        }
        
        // 添加到索引中
        searchIndex.push({
          id: item.id || path.basename(file, '.json'),
          url,
          title: item.title,
          excerpt: excerpt.substring(0, 200), // 限制摘要长度
          category: category || '',
          imageSrc,
          resultType
        });
        
        console.log(`✅ 索引项添加: ${item.title} (${resultType})`);
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