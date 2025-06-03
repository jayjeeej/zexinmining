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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.zexinmining.com';
  const sitemapEntries: MetadataRoute.Sitemap = [];
  
  // 添加首页
  sitemapEntries.push({
    url: `${baseUrl}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1.0,
  });
  
  // 添加语言首页
  sitemapEntries.push(
    {
      url: `${baseUrl}/en`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/zh`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    }
  );
  
  // 添加核心页面
  const corePages = [
    'products',
    'about',
    'contact',
    'services',
    'news', // 添加新闻列表页
  ];
  
  for (const page of corePages) {
    sitemapEntries.push(
      {
        url: `${baseUrl}/en/${page}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/zh/${page}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      }
    );
  }
  
  // 添加产品类别页面
  for (const category of productCategories) {
    sitemapEntries.push(
      {
        url: `${baseUrl}/en/products/${category.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/zh/products/${category.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      }
    );
  }
  
  // 添加产品详情页面
  const productEntries = await getAllProductIds();
  const productsByCategory: Record<string, { id: string, locale: string, lastModified: Date }[]> = {};
  
  // 按类别分组产品
  for (const entry of productEntries) {
    const productData = await getProductWithCategory(entry.id, entry.locale);
    
    if (productData && productData.subcategory) {
      const category = productData.subcategory;
      
      if (!productsByCategory[category]) {
        productsByCategory[category] = [];
      }
      
      productsByCategory[category].push(entry);
    } else {
      // 如果没有类别信息，添加到未分类组
      if (!productsByCategory['uncategorized']) {
        productsByCategory['uncategorized'] = [];
      }
      
      productsByCategory['uncategorized'].push(entry);
    }
  }
  
  // 遍历类别添加产品页面
  for (const [category, products] of Object.entries(productsByCategory)) {
    for (const product of products) {
      sitemapEntries.push({
        url: `${baseUrl}/${product.locale}/products/${category}/${product.id}`,
        lastModified: product.lastModified,
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  }
  
  // 添加新闻详情页面
  const newsEntries = await getAllNewsIds();
  for (const news of newsEntries) {
    sitemapEntries.push({
      url: `${baseUrl}/${news.locale}/news/${news.slug}`,
      lastModified: news.lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  }
  
  return sitemapEntries;
} 