import { MetadataRoute } from 'next';
import fs from 'fs/promises';
import path from 'path';

// 添加静态导出配置
export const dynamic = 'force-static';
export const revalidate = 3600; // 每小时重新验证一次

// 产品类别定义
const productCategories = [
  { id: 'drilling', name: 'Drilling Equipment' },
  { id: 'loading', name: 'Loading Equipment' },
  { id: 'crushing', name: 'Crushing Equipment' },
  { id: 'screening', name: 'Screening Equipment' },
  { id: 'conveying', name: 'Conveying Equipment' },
  { id: 'processing', name: 'Mineral Processing Equipment' },
  { id: 'gravity-separation', name: 'Gravity Separation Equipment' },
];

// 获取所有产品IDs
async function getAllProductIds(): Promise<{ id: string, locale: string, lastModified: Date }[]> {
  const results: { id: string, locale: string, lastModified: Date }[] = [];
  const locales = ['en', 'zh'];
  
  try {
    // 遍历语言文件夹
    for (const locale of locales) {
      const dataDir = path.join(process.cwd(), 'public', 'data', locale);
      
      try {
        const files = await fs.readdir(dataDir);
        
        // 只处理JSON文件
        const jsonFiles = files.filter(file => file.endsWith('.json'));
        
        for (const file of jsonFiles) {
          try {
            const filePath = path.join(dataDir, file);
            const stats = await fs.stat(filePath);
            
            // 验证产品数据的合法性
            const productData = JSON.parse(await fs.readFile(filePath, 'utf8'));
            
            // 跳过任何不符合要求的产品数据
            if (!productData.title || !productData.productCategory) {
              console.warn(`Warning: Product data missing critical fields: ${file}`);
              continue;
            }
            
            results.push({
              id: file.replace('.json', ''),
              locale,
              lastModified: stats.mtime
            });
          } catch (fileError) {
            console.error(`Error processing file ${file}:`, fileError);
          }
        }
      } catch (localeError) {
        console.error(`Error reading directory for locale ${locale}:`, localeError);
      }
    }
  } catch (error) {
    console.error('Error generating product sitemap entries:', error);
  }
  
  return results;
}

// 获取所有新闻IDs
async function getAllNewsIds(): Promise<{ id: string, slug: string, locale: string, lastModified: Date }[]> {
  const results: { id: string, slug: string, locale: string, lastModified: Date }[] = [];
  const locales = ['en', 'zh'];
  
  try {
    // 遍历语言文件夹
    for (const locale of locales) {
      const newsDir = path.join(process.cwd(), 'public', 'data', locale, 'news');
      
      try {
        // 检查目录是否存在
        const dirExists = await fs.access(newsDir).then(() => true).catch(() => false);
        if (!dirExists) {
          console.error(`News directory not found for locale ${locale}: ${newsDir}`);
          continue;
        }
        
        const files = await fs.readdir(newsDir);
        
        // 只处理JSON文件
        const jsonFiles = files.filter(file => file.endsWith('.json'));
        
        for (const file of jsonFiles) {
          try {
            const filePath = path.join(newsDir, file);
            const stats = await fs.stat(filePath);
            
            // 读取文件内容获取slug
            const fileContent = await fs.readFile(filePath, 'utf8');
            const newsData = JSON.parse(fileContent);
            const slug = newsData.slug || file.replace('.json', '');
            
            results.push({
              id: file.replace('.json', ''),
              slug,
              locale,
              lastModified: stats.mtime
            });
          } catch (fileError) {
            console.error(`Error processing news file ${file}:`, fileError);
          }
        }
      } catch (localeError) {
        console.error(`Error reading news directory for locale ${locale}:`, localeError);
      }
    }
  } catch (error) {
    console.error('Error generating news sitemap entries:', error);
  }
  
  return results;
}

// 获取产品数据，包括类别信息
async function getProductWithCategory(id: string, locale: string): Promise<any> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', locale, `${id}.json`);
    const fileContent = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Error reading product data for ${id}:`, error);
    return null;
  }
}

// 禁用Next.js内置的sitemap生成器
// 我们使用自定义脚本生成sitemap：
// - generate-sitemaps.js
// - generate-server-sitemap.js
// - generate-main-sitemap.js

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 返回空数组，实际上禁用这个生成器
  return [];
} 