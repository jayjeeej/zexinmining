/**
 * 自动为JSON数据文件添加alt属性
 * 
 * 此脚本扫描数据文件，为图片添加合适的alt描述
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

console.log('开始为图片添加alt属性...');

// 收集所有JSON数据文件
async function collectJsonFiles() {
  const files = await glob('public/data/**/*.json');
  return files;
}

// 为图片路径生成alt描述
function generateAltDescription(imagePath, data, locale, fileType) {
  // 如果路径为空，返回空字符串
  if (!imagePath) return '';
  
  try {
    // 提取文件名
    const fileName = imagePath.split('/').pop().split('.')[0];
    
    // 将连字符和下划线替换为空格
    const normalizedName = fileName.replace(/[-_]/g, ' ');
    
    // 首字母大写处理
    const processedName = normalizedName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    // 产品特殊处理：添加产品名和分类
    if (fileType === 'product' && data.name) {
      const productName = locale === 'zh' ? data.name.zh : data.name.en;
      const category = locale === 'zh' 
        ? (data.category?.zh || '') 
        : (data.category?.en || '');
      
      return `${productName} - ${category} | Zexin Mining Equipment`;
    }
    
    // 新闻特殊处理：添加标题
    if (fileType === 'news' && data.title) {
      const title = data.title;
      return `${title} | Zexin Mining Industry News`;
    }
    
    // 案例研究特殊处理：添加标题和序号
    if (fileType === 'case' && data.images && Array.isArray(data.images)) {
      const title = data.title || processedName;
      const index = data.images.indexOf(imagePath) + 1;
      return `${title} - Image ${index} | Zexin Mining Case Study`;
    }
    
    // 默认返回处理后的文件名
    return `${processedName} | Zexin Mining`;
  } catch (error) {
    console.error(`生成alt属性时出错:`, error);
    return 'Mining equipment image';
  }
}

// 处理JSON数据文件
async function processJsonFiles() {
  const files = await collectJsonFiles();
  const updatedFiles = [];
  
  for (const file of files) {
    try {
      // 解析文件内容
      const content = fs.readFileSync(file, 'utf8');
      const data = JSON.parse(content);
      let modified = false;
      
      // 确定数据类型和语言
      const fileType = file.includes('/products/') || 
                     file.includes('/vibrating-screens/') || 
                     file.includes('/washing-equipment/') ||
                     file.includes('/stationary-crushers/') ||
                     file.includes('/magnetic-separator/') ||
                     file.includes('/grinding-equipment/') ||
                     file.includes('/gravity-separation/') ||
                     file.includes('/flotation-equipment/') ||
                     file.includes('/feeding-equipment/') ||
                     file.includes('/classification-equipment/') ? 'product' : 
                     file.includes('/news/') ? 'news' : 
                     file.includes('/case-studies/') ? 'case' : 'other';
      
      const locale = file.includes('/zh/') ? 'zh' : 'en';
      
      // 处理常见的单图片字段
      const imageFields = ['imageSrc', 'image', 'coverImage', 'thumbnail', 'featuredImage'];
      
      for (const field of imageFields) {
        if (data[field] && !data[`${field}Alt`] && !data.alt) {
          // 生成alt描述
          const altText = generateAltDescription(data[field], data, locale, fileType);
          
          // 添加alt字段
          data[`${field}Alt`] = altText;
          modified = true;
        }
      }
      
      // 处理images数组
      if (Array.isArray(data.images) && (!data.imagesAlt || !Array.isArray(data.imagesAlt))) {
        // 创建alt描述数组
        data.imagesAlt = data.images.map(img => 
          generateAltDescription(img, data, locale, fileType)
        );
        modified = true;
      }
      
      // 如果有修改，写回文件
      if (modified) {
        fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
        updatedFiles.push(file);
      }
    } catch (error) {
      console.error(`处理文件 ${file} 时出错:`, error);
    }
  }
  
  return updatedFiles;
}

// 执行处理并生成报告
async function generateReport() {
  console.log('正在处理文件...');
  const updatedFiles = await processJsonFiles();
  
  console.log(`\n处理完成，共更新了 ${updatedFiles.length} 个文件:\n`);
  
  if (updatedFiles.length === 0) {
    console.log('没有文件需要更新。');
    return;
  }
  
  // 按目录分组
  const groupedFiles = {};
  updatedFiles.forEach(file => {
    const dir = path.dirname(file);
    if (!groupedFiles[dir]) {
      groupedFiles[dir] = [];
    }
    groupedFiles[dir].push(path.basename(file));
  });
  
  // 输出分组后的文件
  Object.entries(groupedFiles).forEach(([dir, files]) => {
    console.log(`\n目录: ${dir}`);
    files.forEach(file => {
      console.log(`  - ${file}`);
    });
  });
  
  console.log('\n所有图片的alt属性已添加完成！');
}

// 运行脚本
generateReport().catch(console.error); 