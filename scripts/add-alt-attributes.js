/**
 * 自动为JSON数据文件添加alt属性
 * 
 * 此脚本扫描数据文件，为图片添加合适的alt描述
 * 改进版：增强alt文本质量，扩展处理字段，改进错误处理
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

console.log('开始为图片添加alt属性...');

// 收集所有JSON数据文件
async function collectJsonFiles() {
  try {
    console.log('正在搜索JSON文件...');
    const files = await glob('public/data/**/*.json');
    console.log(`找到 ${files.length} 个JSON文件`);
    return files;
  } catch (error) {
    console.error('搜索JSON文件时出错:', error);
    return [];
  }
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
    
    // 产品页面alt文本生成
    if (fileType === 'product') {
      // 提取产品名称
      const productName = data.title || data.name || processedName;
      
      // 提取系列名称
      const seriesName = data.series || '';
      
      // 提取类别
      const category = data.productCategory || data.category || '';
      
      // 提取型号
      const model = data.model || '';
      
      // 提取特点 (从features中提取第一个或前两个特点)
      let features = '';
      if (data.features && Array.isArray(data.features) && data.features.length > 0) {
        if (typeof data.features[0] === 'object' && data.features[0].title) {
          features = data.features.slice(0, 2).map(f => f.title).join('，');
        } else if (typeof data.features[0] === 'string') {
          features = data.features.slice(0, 2).join('，');
        }
      }
      
      // 构建完整的alt文本
      let altText = '';
      
      if (locale === 'zh') {
        // 中文格式: 产品名称-系列型号-主要特点|公司名
        altText = `${productName}${seriesName ? '-' + seriesName : ''}${model ? ' ' + model : ''}${features ? '-' + features : ''}${category ? ' | ' + category : ''} | 泽鑫矿山设备`;
      } else {
        // 英文格式: Product Name - Series Model - Main Features | Category | Company
        altText = `${productName}${seriesName ? ' - ' + seriesName : ''}${model ? ' ' + model : ''}${features ? ' - ' + features : ''}${category ? ' | ' + category : ''} | Zexin Mining Equipment`;
      }
      
      return altText;
    }
    
    // 新闻页面alt文本生成
    if (fileType === 'news') {
      const title = data.title || processedName;
      const date = data.date || data.publishDate || '';
      
      if (locale === 'zh') {
        return `${title}${date ? ' - ' + date : ''} | 泽鑫矿业新闻`;
      } else {
        return `${title}${date ? ' - ' + date : ''} | Zexin Mining Industry News`;
      }
    }
    
    // 选矿工艺方案alt文本生成
    if (fileType === 'solution') {
      const mineralName = data.mineralName || '';
      const title = data.title || processedName;
      
      if (locale === 'zh') {
        return `${mineralName ? mineralName + ' - ' : ''}${title} | 泽鑫矿业选矿工艺解决方案`;
      } else {
        return `${mineralName ? mineralName + ' - ' : ''}${title} | Zexin Mining Mineral Processing Solution`;
      }
    }
    
    // 案例研究alt文本生成
    if (fileType === 'case' && data.images && Array.isArray(data.images)) {
      const title = data.title || processedName;
      const index = data.images.indexOf(imagePath) + 1;
      
      if (locale === 'zh') {
        return `${title} - 图片${index} | 泽鑫矿业案例研究`;
      } else {
        return `${title} - Image ${index} | Zexin Mining Case Study`;
      }
    }
    
    // 默认返回处理后的文件名
    if (locale === 'zh') {
      return `${processedName} | 泽鑫矿业`;
    } else {
      return `${processedName} | Zexin Mining`;
    }
  } catch (error) {
    console.error(`生成alt属性时出错: ${imagePath}`, error);
    return locale === 'zh' ? '矿山设备图片' : 'Mining equipment image';
  }
}

// 处理JSON数据文件
async function processJsonFiles() {
  const files = await collectJsonFiles();
  const updatedFiles = [];
  const errorFiles = [];
  let totalImagesProcessed = 0;
  
  for (const file of files) {
    try {
      // 解析文件内容
      const content = fs.readFileSync(file, 'utf8');
      const data = JSON.parse(content);
      let modified = false;
      let imagesProcessed = 0;
      
      // 确定数据类型和语言
      const locale = file.includes('/zh/') ? 'zh' : 'en';
      
      let fileType = 'other';
      if (file.includes('/products/') || 
          file.includes('/vibrating-screens/') || 
          file.includes('/washing-equipment/') ||
          file.includes('/stationary-crushers/') ||
          file.includes('/magnetic-separator/') ||
          file.includes('/grinding-equipment/') ||
          file.includes('/gravity-separation/') ||
          file.includes('/flotation-equipment/') ||
          file.includes('/feeding-equipment/') ||
          file.includes('/classification-equipment/')) {
        fileType = 'product';
      } else if (file.includes('/news/')) {
        fileType = 'news';
      } else if (file.includes('/case-studies/')) {
        fileType = 'case';
      } else if (file.includes('/mineral-processing-solutions/')) {
        fileType = 'solution';
      }
      
      // 扩展处理的图片字段列表
      const imageFields = [
        'imageSrc', 'image', 'coverImage', 'thumbnail', 'featuredImage', 
        'mainImage', 'heroImage', 'bannerImage', 'logoImage', 'backgroundImage',
        'applicationsImage', 'processImage', 'flowchartImage'
      ];
      
      // 处理单个图片字段
      for (const field of imageFields) {
        if (data[field] && !data[`${field}Alt`]) {
          // 生成alt描述
          const altText = generateAltDescription(data[field], data, locale, fileType);
          
          // 添加alt字段
          data[`${field}Alt`] = altText;
          modified = true;
          imagesProcessed++;
          
          console.log(`  处理 ${file} 中的 ${field}: ${altText.substring(0, 50)}...`);
        }
      }
      
      // 处理嵌套对象中的图片
      const processNestedObject = (obj, prefix = '') => {
        if (!obj || typeof obj !== 'object') return 0;
        
        let count = 0;
        for (const [key, value] of Object.entries(obj)) {
          // 检查是否为图片字段
          if (typeof value === 'string' && 
              (key.includes('image') || key.includes('Image') || key.includes('img') || key.includes('Img')) && 
              (value.includes('.jpg') || value.includes('.jpeg') || value.includes('.png') || value.includes('.gif') || value.includes('.webp')) && 
              !obj[`${key}Alt`]) {
            
            // 生成alt描述
            const altText = generateAltDescription(value, data, locale, fileType);
            
            // 添加alt字段
            obj[`${key}Alt`] = altText;
            modified = true;
            count++;
            
            console.log(`  处理 ${file} 中的嵌套图片 ${prefix}${key}: ${altText.substring(0, 50)}...`);
          }
          // 递归处理嵌套对象
          else if (value && typeof value === 'object' && !Array.isArray(value)) {
            count += processNestedObject(value, `${prefix}${key}.`);
          }
        }
        return count;
      };
      
      // 处理数组中的对象
      const processArrayObjects = (arr, arrayName) => {
        if (!arr || !Array.isArray(arr)) return 0;
        
        let count = 0;
        for (let i = 0; i < arr.length; i++) {
          if (arr[i] && typeof arr[i] === 'object') {
            count += processNestedObject(arr[i], `${arrayName}[${i}].`);
          }
        }
        return count;
      };
      
      // 处理images数组
      if (Array.isArray(data.images) && (!data.imagesAlt || !Array.isArray(data.imagesAlt) || data.imagesAlt.length !== data.images.length)) {
        // 创建alt描述数组
        data.imagesAlt = data.images.map(img => 
          generateAltDescription(img, data, locale, fileType)
        );
        modified = true;
        imagesProcessed += data.images.length;
        
        console.log(`  处理 ${file} 中的图片数组: ${data.images.length} 张图片`);
      }
      
      // 处理features, applications等常见数组字段中的图片
      const arrayFields = ['features', 'applications', 'benefits', 'specifications', 'items', 'testimonials', 'processSteps'];
      for (const field of arrayFields) {
        if (data[field] && Array.isArray(data[field])) {
          const processed = processArrayObjects(data[field], field);
          imagesProcessed += processed;
        } else if (data[field] && typeof data[field] === 'object') {
          if (data[field].items && Array.isArray(data[field].items)) {
            const processed = processArrayObjects(data[field].items, `${field}.items`);
            imagesProcessed += processed;
          }
        }
      }
      
      // 递归处理根级对象
      imagesProcessed += processNestedObject(data);
      
      // 如果有修改，写回文件
      if (modified) {
        fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
        updatedFiles.push({file, imagesProcessed});
        totalImagesProcessed += imagesProcessed;
        console.log(`✅ 更新文件 ${file}：处理了 ${imagesProcessed} 张图片`);
      }
    } catch (error) {
      console.error(`❌ 处理文件 ${file} 时出错:`, error);
      errorFiles.push(file);
    }
  }
  
  return {updatedFiles, errorFiles, totalImagesProcessed};
}

// 执行处理并生成报告
async function generateReport() {
  console.log('🔍 正在处理文件...');
  const {updatedFiles, errorFiles, totalImagesProcessed} = await processJsonFiles();
  
  console.log(`\n📊 处理完成，共更新了 ${updatedFiles.length} 个文件，处理了 ${totalImagesProcessed} 张图片:\n`);
  
  // 按目录分组
  const groupedFiles = {};
  
  if (updatedFiles.length === 0) {
    console.log('没有文件需要更新。');
  } else {
    updatedFiles.forEach(({file, imagesProcessed}) => {
      const dir = path.dirname(file);
      if (!groupedFiles[dir]) {
        groupedFiles[dir] = {files: [], count: 0};
      }
      groupedFiles[dir].files.push(path.basename(file));
      groupedFiles[dir].count += imagesProcessed;
    });
    
    // 输出分组后的文件
    Object.entries(groupedFiles).forEach(([dir, {files, count}]) => {
      console.log(`\n📁 目录: ${dir} (${count} 张图片)`);
      files.forEach(file => {
        console.log(`  - ${file}`);
      });
    });
  }
  
  if (errorFiles.length > 0) {
    console.log(`\n⚠️ ${errorFiles.length} 个文件处理失败:`);
    errorFiles.forEach(file => {
      console.log(`  - ${file}`);
    });
  }
  
  console.log('\n✨ 图片alt属性处理完成！');
  
  // 将报告写入文件
  const reportContent = `
# 图片Alt属性处理报告
生成日期: ${new Date().toLocaleString()}

## 统计信息
- 处理文件总数: ${updatedFiles.length}
- 处理图片总数: ${totalImagesProcessed}
- 失败文件数: ${errorFiles.length}

## 详细信息
${Object.entries(groupedFiles).map(([dir, {files, count}]) => `
### 目录: ${dir} (${count} 张图片)
${files.map(file => `- ${file}`).join('\n')}
`).join('\n')}

${errorFiles.length > 0 ? `
## 处理失败的文件
${errorFiles.map(file => `- ${file}`).join('\n')}
` : ''}
`;

  fs.writeFileSync('alt-attributes-report.md', reportContent, 'utf8');
  console.log('📄 详细报告已保存至 alt-attributes-report.md');
}

// 运行脚本
generateReport().catch(console.error); 