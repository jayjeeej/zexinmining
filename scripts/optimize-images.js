const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 检查是否安装了sharp
try {
  require.resolve('sharp');
} catch (error) {
  console.log('正在安装sharp图像优化库...');
  execSync('npm install sharp --save-dev');
}

const sharp = require('sharp');

// 图像优化配置
const config = {
  imageDir: path.join(__dirname, '../public/images'),
  maxWidth: 1920,
  quality: 80,
  webp: true
};

// 递归查找所有图像文件
function findImages(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findImages(filePath, fileList);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (['.jpg', '.jpeg', '.png'].includes(ext)) {
        fileList.push(filePath);
      }
    }
  });
  
  return fileList;
}

// 优化单个图像
async function optimizeImage(imagePath) {
  const ext = path.extname(imagePath).toLowerCase();
  const filename = path.basename(imagePath, ext);
  const dir = path.dirname(imagePath);
  
  // 获取图像信息
  const metadata = await sharp(imagePath).metadata();
  
  // 如果宽度超过配置的最大宽度，则调整大小
  let sharpInstance = sharp(imagePath);
  if (metadata.width > config.maxWidth) {
    sharpInstance = sharpInstance.resize(config.maxWidth);
  }
  
  // 根据图像格式选择不同的处理方式
  const outputPath = path.join(dir, `${filename}${ext}`);
  
  if (ext === '.png') {
    // 对PNG文件特殊处理，保留透明度
    await sharpInstance
      .png({ quality: config.quality, compressionLevel: 9, palette: true })
      .toFile(outputPath + '.tmp');
  } else {
    // 优化JPEG图片
    await sharpInstance
      .jpeg({ quality: config.quality, mozjpeg: true })
      .toFile(outputPath + '.tmp');
  }
  
  // 覆盖原始文件
  fs.renameSync(outputPath + '.tmp', outputPath);
  
  // 创建WebP版本（如果开启）
  if (config.webp) {
    const webpPath = path.join(dir, `${filename}.webp`);
    await sharpInstance
      .webp({ quality: config.quality, alphaQuality: 100 }) // 提高透明通道质量
      .toFile(webpPath);
  }
  
  // 返回优化结果
  const originalSize = fs.statSync(imagePath).size;
  const optimizedSize = fs.statSync(outputPath).size;
  const savings = ((originalSize - optimizedSize) / originalSize) * 100;
  
  return {
    path: imagePath,
    before: (originalSize / 1024).toFixed(2) + ' KB',
    after: (optimizedSize / 1024).toFixed(2) + ' KB',
    savings: savings.toFixed(2) + '%'
  };
}

// 主函数
async function main() {
  console.log('开始优化图像...');
  
  // 确保图像目录存在
  if (!fs.existsSync(config.imageDir)) {
    console.error(`图像目录不存在: ${config.imageDir}`);
    return;
  }
  
  // 查找所有图像
  const images = findImages(config.imageDir);
  console.log(`找到 ${images.length} 个图像文件`);
  
  // 优化每个图像
  const results = [];
  for (const imagePath of images) {
    try {
      const result = await optimizeImage(imagePath);
      results.push(result);
      console.log(`优化: ${result.path} (${result.before} -> ${result.after}, 节省 ${result.savings})`);
    } catch (error) {
      console.error(`优化失败: ${imagePath}`, error);
    }
  }
  
  // 输出结果统计
  const totalSaved = results.reduce((acc, result) => {
    const before = parseFloat(result.before);
    const after = parseFloat(result.after);
    return acc + (before - after);
  }, 0);
  
  console.log(`\n优化完成! 共优化 ${results.length} 个图像文件`);
  console.log(`总节省空间: ${totalSaved.toFixed(2)} KB`);
}

// 运行主函数
main().catch(console.error); 