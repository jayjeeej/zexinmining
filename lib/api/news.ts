// 定义类型
import fs from 'fs';
import path from 'path';
import { promises as fsPromises } from 'fs';

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  category: string;
  image: string;
  author?: string;
  slug: string;
  imageAlt?: string;
  tags?: string[];
}

interface GetNewsOptions {
  locale?: string;
  limit?: number;
  page?: number;
  filter?: string;
}

interface GetNewsByIdOptions {
  related?: boolean;
  limit?: number;
}

interface GetNewsCountOptions {
  locale?: string;
  filter?: string;
}

// 添加内存缓存，避免重复读取文件系统
const newsCache: Record<string, {data: NewsItem[], timestamp: number}> = {};
const CACHE_TTL = 60 * 1000; // 缓存有效期：1分钟

// 从文件系统读取新闻数据
async function readNewsData(locale = 'en'): Promise<NewsItem[]> {
  try {
    // 检查缓存
    const cacheKey = `news_${locale}`;
    const now = Date.now();
    
    // 如果缓存存在且未过期，则使用缓存数据
    if (newsCache[cacheKey] && (now - newsCache[cacheKey].timestamp) < CACHE_TTL) {
      return newsCache[cacheKey].data;
    }
    
    const newsDir = path.join(process.cwd(), 'public/data', locale, 'news');
    
    // 检查目录是否存在
    if (!fs.existsSync(newsDir)) {
      console.warn(`News directory not found for locale ${locale}`);
      return [];
    }
    
    // 读取目录中的所有JSON文件
    const files = await fsPromises.readdir(newsDir);
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    
    // 优化：使用批处理读取文件，而不是一个个读取
    // 限制并发数，避免文件系统负载过高
    const batchSize = 5;
    let newsItems: (NewsItem | null)[] = [];
    
    for (let i = 0; i < jsonFiles.length; i += batchSize) {
      const batch = jsonFiles.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(async (file) => {
        const filePath = path.join(newsDir, file);
          try {
        const fileContent = await fsPromises.readFile(filePath, 'utf8');
          return JSON.parse(fileContent) as NewsItem;
        } catch (e) {
            console.error(`Error reading/parsing ${file}:`, e);
          return null;
        }
      })
    );
      
      newsItems = [...newsItems, ...batchResults];
    }
    
    // 过滤掉无效数据并按日期排序
    const validNewsItems = newsItems
      .filter((item): item is NewsItem => item !== null)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    // 更新缓存
    newsCache[cacheKey] = {
      data: validNewsItems,
      timestamp: now
    };
    
    return validNewsItems;
      
  } catch (error) {
    console.error('Error reading news data:', error);
    
    // 如果出错但有缓存，使用过期的缓存也比返回空数组好
    const cacheKey = `news_${locale}`;
    if (newsCache[cacheKey]) {
      console.log('Using stale cache data due to error');
      return newsCache[cacheKey].data;
    }
    
    return [];
  }
}

// 获取新闻列表
export async function getNews({
  locale = 'en',
  limit = 100,
  page = 1,
  filter
}: GetNewsOptions = {}): Promise<NewsItem[]> {
  try {
  const newsItems = await readNewsData(locale);
  
  // 应用过滤器
  const filteredNews = filter && filter !== 'all' 
    ? newsItems.filter(news => news.category === filter)
    : newsItems;
  
  // 分页
  return filteredNews.slice((page - 1) * limit, page * limit);
  } catch (error) {
    console.error('Error in getNews:', error);
    return [];
  }
}

// 通过ID获取新闻
export async function getNewsById(
  slug: string, 
  locale: string,
  options: GetNewsByIdOptions = {}
): Promise<NewsItem | NewsItem[] | null> {
  try {
  const { related = false, limit = 3 } = options;
  const newsItems = await readNewsData(locale);
  
  if (related) {
      // 获取当前新闻
      const currentNews = newsItems.find(news => news.slug === slug);
      
      if (!currentNews) {
        return [];
      }
      
      // 排除当前新闻
      const otherNews = newsItems.filter(news => news.slug !== slug);
      
      // 优化推荐逻辑：
      // 1. 首先优先选择同类别的新闻
      // 2. 然后按发布日期相近程度排序
      const currentDate = new Date(currentNews.date).getTime();
      
      // 计算相关度评分
      const scoredNews = otherNews.map(news => {
        let score = 0;
        
        // 相同类别加分
        if (news.category === currentNews.category) {
          score += 50;
        }
        
        // 日期接近度计算（时间越近分数越高）
        const dateDiff = Math.abs(new Date(news.date).getTime() - currentDate);
        const dayDiff = dateDiff / (1000 * 60 * 60 * 24); // 转换为天数差
        score += Math.max(30 - dayDiff, 0); // 最多30天的加分
        
        return { news, score };
      });
      
      // 按分数降序排列并返回前limit条
      return scoredNews
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(item => item.news);
  }
  
  // 返回单个新闻
  return newsItems.find(news => news.slug === slug) || null;
  } catch (error) {
    console.error('Error in getNewsById:', error);
    return null;
  }
}

// 获取新闻总数
export async function getNewsCount({
  locale = 'en',
  filter
}: GetNewsCountOptions = {}): Promise<number> {
  try {
  const newsItems = await readNewsData(locale);
  
  // 应用过滤器
    const filteredNews = filter && filter !== 'all'
    ? newsItems.filter(news => news.category === filter)
    : newsItems;
  
  return filteredNews.length;
  } catch (error) {
    console.error('Error in getNewsCount:', error);
    return 0;
  }
}

// 添加缓存管理功能
export function clearNewsCache(locale?: string): void {
  if (locale) {
    const cacheKey = `news_${locale}`;
    delete newsCache[cacheKey];
  } else {
    // 清除所有缓存
    Object.keys(newsCache).forEach(key => {
      delete newsCache[key];
    });
  }
}
