/**
 * 检查网站中缺少alt属性的图片
 * 
 * 此脚本收集所有产品和文章数据，检查图片是否包含alt属性
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

console.log('开始检查缺少alt属性的图片...');

// 收集所有JSON数据文件
async function collectJsonFiles() {
  const files = await glob('public/data/**/*.json');
  return files;
}

// 检查JSON数据中的图片字段
async function checkMissingAlts() {
  const files = await collectJsonFiles();
  const issues = [];
  
  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const data = JSON.parse(content);
      
      // 检查常见的图片字段
      const imageFields = ['imageSrc', 'image', 'coverImage', 'thumbnail', 'featuredImage'];
      const imagesField = data.images; // 特殊处理images数组
      
      for (const field of imageFields) {
        if (data[field] && !data[`${field}Alt`] && !data.alt) {
          issues.push({
            file,
            field,
            imagePath: data[field],
            recommendation: `添加 "${field}Alt" 字段描述图片内容`
          });
        }
      }
      
      // 处理images数组
      if (Array.isArray(imagesField)) {
        imagesField.forEach((img, index) => {
          if (typeof img === 'string' && !data.imagesAlt?.[index]) {
            issues.push({
              file,
              field: `images[${index}]`,
              imagePath: img,
              recommendation: '添加 "imagesAlt" 数组提供每张图片的描述'
            });
          }
        });
      }
      
    } catch (error) {
      console.error(`处理文件 ${file} 时出错:`, error.message);
    }
  }
  
  return issues;
}

// 生成报告
async function generateReport() {
  const issues = await checkMissingAlts();
  
  console.log(`\n检查完成，发现 ${issues.length} 个缺少alt属性的图片:\n`);
  
  if (issues.length === 0) {
    console.log('恭喜！所有图片都有适当的alt属性。');
    return;
  }
  
  // 按文件分组问题
  const groupedIssues = {};
  issues.forEach(issue => {
    const key = issue.file;
    if (!groupedIssues[key]) {
      groupedIssues[key] = [];
    }
    groupedIssues[key].push(issue);
  });
  
  // 输出分组后的问题
  Object.entries(groupedIssues).forEach(([file, fileIssues]) => {
    console.log(`\n文件: ${file}`);
    fileIssues.forEach(issue => {
      console.log(`  - 字段 "${issue.field}": ${issue.imagePath}`);
      console.log(`    建议: ${issue.recommendation}`);
    });
  });
  
  // 生成HTML报告
  const htmlReport = `
<!DOCTYPE html>
<html>
<head>
  <title>缺少Alt属性的图片报告</title>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; margin: 2rem; }
    h1 { color: #1b78e2; }
    .file { margin-bottom: 1.5rem; background: #f5f5f5; padding: 1rem; border-radius: 5px; }
    .file-path { font-weight: bold; margin-bottom: 0.5rem; }
    .issue { margin-bottom: 0.5rem; padding-left: 1rem; }
    .recommendation { color: #ff6633; }
  </style>
</head>
<body>
  <h1>缺少Alt属性的图片报告</h1>
  <p>总计 ${issues.length} 个问题</p>
  <div>
    ${Object.entries(groupedIssues).map(([file, fileIssues]) => `
      <div class="file">
        <div class="file-path">${file}</div>
        ${fileIssues.map(issue => `
          <div class="issue">
            <div>字段 "${issue.field}": ${issue.imagePath}</div>
            <div class="recommendation">建议: ${issue.recommendation}</div>
          </div>
        `).join('')}
      </div>
    `).join('')}
  </div>
</body>
</html>
`;
  
  // 保存HTML报告
  fs.writeFileSync('alt-issues-report.html', htmlReport);
  console.log('\nHTML报告已保存到: alt-issues-report.html');
}

// 运行脚本
generateReport().catch(console.error); 