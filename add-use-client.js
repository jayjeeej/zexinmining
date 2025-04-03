const fs = require('fs');
const path = require('path');
const glob = require('glob');

// 查找所有产品页面文件
const productFiles = glob.sync('app/products/**/*.tsx');

let modifiedCount = 0;

// 处理每个文件
productFiles.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // 如果文件已经有'use client'声明，则跳过
  if (content.includes("'use client'") || content.includes('"use client"')) {
    console.log(`跳过 ${filePath} - 已有'use client'声明`);
    return;
  }
  
  // 添加'use client'声明到文件顶部
  const newContent = "'use client';\n\n" + content;
  fs.writeFileSync(filePath, newContent);
  
  console.log(`已修改: ${filePath}`);
  modifiedCount++;
});

// 处理solutions目录
const solutionFiles = glob.sync('app/solutions/**/*.tsx');
solutionFiles.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes("'use client'") || content.includes('"use client"')) {
    console.log(`跳过 ${filePath} - 已有'use client'声明`);
    return;
  }
  
  const newContent = "'use client';\n\n" + content;
  fs.writeFileSync(filePath, newContent);
  
  console.log(`已修改: ${filePath}`);
  modifiedCount++;
});

console.log(`总共修改了 ${modifiedCount} 个文件`); 