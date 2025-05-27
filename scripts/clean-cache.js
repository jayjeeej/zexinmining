const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 清理函数
async function cleanCache() {
  console.log('开始清理大型缓存文件...');
  
  // 定义要删除的目录
  const cacheDirectories = [
    path.resolve(process.cwd(), '.next/cache'),
    path.resolve(process.cwd(), 'cache')
  ];
  
  // 删除缓存目录
  cacheDirectories.forEach(dir => {
    if (fs.existsSync(dir)) {
      console.log(`删除目录: ${dir}`);
      try {
        fs.rmSync(dir, { recursive: true, force: true });
        console.log(`成功删除: ${dir}`);
      } catch (err) {
        console.error(`删除失败 ${dir}:`, err);
      }
    }
  });
  
  // 查找并删除大型文件
  const directories = ['.next', '.'];
  
  for (const dir of directories) {
    if (fs.existsSync(dir)) {
      try {
        console.log(`查找大文件在目录: ${dir}`);
        const findCommand = process.platform === 'win32' 
          ? `powershell "Get-ChildItem -Path ${dir} -Recurse -File | Where-Object { $_.Length -gt 20MB } | Select-Object FullName"`
          : `find ${dir} -type f -size +20M`;
        
        try {
          const largeFiles = execSync(findCommand, { encoding: 'utf8' }).split('\n');
          
          for (const file of largeFiles) {
            const trimmedFile = file.trim();
            if (trimmedFile && fs.existsSync(trimmedFile)) {
              console.log(`删除大文件: ${trimmedFile}`);
              fs.unlinkSync(trimmedFile);
              console.log(`成功删除: ${trimmedFile}`);
            }
          }
        } catch (e) {
          console.log(`查找失败，尝试其他方式: ${e.message}`);
          // 备用方法：遍历并检查文件大小
          walkDir(dir);
        }
      } catch (err) {
        console.error(`处理文件夹 ${dir} 出错:`, err);
      }
    }
  }
  
  console.log('缓存清理完成!');
}

// 递归遍历目录
function walkDir(dir) {
  if (!fs.existsSync(dir)) return;
  
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      walkDir(filePath); // 递归处理子目录
    } else if (stats.size > 20 * 1024 * 1024) { // 大于20MB
      console.log(`删除大文件: ${filePath} (${Math.round(stats.size / 1024 / 1024)}MB)`);
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error(`删除失败 ${filePath}:`, err);
      }
    }
  }
}

// 执行清理
cleanCache()
  .then(() => {
    console.log('清理脚本执行完成');
  })
  .catch(err => {
    console.error('清理脚本执行失败:', err);
    process.exit(1);
  }); 