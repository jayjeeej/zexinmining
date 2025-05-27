/**
 * WebP图像转换脚本
 * 将public/images目录下的图片转换为WebP格式
 * 使用方法: node scripts/webp-converter.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

// 支持的图像格式
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];

// 图像质量
const QUALITY = 80;

// 源目录
const SOURCE_DIR = path.join(__dirname, '../public/images');

/**
 * 递归获取目录下所有文件
 */
async function getAllFiles(dir) {
  const files = await readdir(dir);
  const result = [];

  for (const file of files) {
    const filePath = path.join(dir, file);
    const fileStat = await stat(filePath);

    if (fileStat.isDirectory()) {
      const subDirFiles = await getAllFiles(filePath);
      result.push(...subDirFiles);
    } else {
      result.push(filePath);
    }
  }

  return result;
}

/**
 * 转换单个文件为WebP
 */
async function convertToWebP(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!SUPPORTED_FORMATS.includes(ext)) {
    return null; // 不支持的格式
  }

  // 已经转换过的文件跳过
  const webpPath = filePath.replace(ext, '.webp');
  if (fs.existsSync(webpPath)) {
    console.log(`已存在: ${path.relative(SOURCE_DIR, webpPath)}`);
    return null;
  }

  try {
    console.log(`处理: ${path.relative(SOURCE_DIR, filePath)}`);
    
    await sharp(filePath)
      .webp({ quality: QUALITY })
      .toFile(webpPath);
    
    console.log(`已转换: ${path.relative(SOURCE_DIR, webpPath)}`);
    return webpPath;
  } catch (error) {
    console.error(`转换失败: ${path.relative(SOURCE_DIR, filePath)}`);
    console.error(error.message);
    return null;
  }
}

/**
 * 主函数
 */
async function main() {
  try {
    // 检查源目录是否存在
    if (!fs.existsSync(SOURCE_DIR)) {
      console.error(`错误: 目录不存在: ${SOURCE_DIR}`);
      process.exit(1);
    }

    console.log(`开始处理图像...`);
    console.log(`源目录: ${SOURCE_DIR}`);
    console.log(`WebP质量: ${QUALITY}`);
    
    // 获取所有文件
    const files = await getAllFiles(SOURCE_DIR);
    console.log(`找到${files.length}个文件`);
    
    // 转换文件
    const convertPromises = files.map(convertToWebP);
    const results = await Promise.all(convertPromises);
    
    const successCount = results.filter(Boolean).length;
    console.log(`转换完成! 成功转换${successCount}个文件`);
  } catch (error) {
    console.error('处理过程中出错:', error);
    process.exit(1);
  }
}

// 运行主函数
main(); 