import { Metadata } from 'next';
import { getNewsById } from '@/lib/api/news';
import { getBreadcrumbConfig } from '@/lib/navigation';
import NewsDetailClient from './NewsDetailClient';
import { notFound } from 'next/navigation';
import { NewsItem } from '@/lib/api/news';
import { safelyGetRouteParams } from '@/lib/utils';
import fs from 'fs';
import path from 'path';
// Vercel 优化导出指令
export const dynamic = 'force-static';        // 强制静态生成
export const revalidate = 3600;               // 每小时重新验证一次
export const fetchCache = 'force-cache';      // 强制使用缓存
export const runtime = 'nodejs';              // 使用Node.js运行时
export const preferredRegion = 'auto';        // 自动选择最佳区域

// 为静态导出生成所有可能的路径参数
export async function generateStaticParams() {
  const locale = 'en';
  const basePath = path.join(process.cwd(), 'public', 'data', locale, 'news');
  
  try {
    // 检查目录是否存在
    if (!fs.existsSync(basePath)) {
      console.error(`Directory not found: ${basePath}`);
      return [];
    }
    
    // 获取所有新闻文件
    const newsFiles = fs.readdirSync(basePath)
      .filter((file: string) => file.endsWith('.json'))
      .map((file: string) => file.replace('.json', ''));
    
    // 为每个新闻ID添加参数
    const params = newsFiles.map((newsId: string) => ({
      newsId
    }));
    
    console.log(`Generated ${params.length} static paths for English news`);
    return params;
  } catch (error) {
    console.error(`Error generating static params for news:`, error);
    return [];
  }
}

// 动态生成元数据
export async function generateMetadata({ 
  params 
}: { 
  params: { newsId: string } 
}): Promise<Metadata> {
  // 使用固定的locale值
  const locale = 'en';
  const { newsId } = await params;
  
  const newsItemResult = await getNewsById(newsId, locale);
  
  // 确保获取到的是单个新闻项
  const newsItem = Array.isArray(newsItemResult) ? newsItemResult[0] : newsItemResult;
  
  if (!newsItem) {
    return {
      title: '404 - Not Found',
    };
  }

  // 获取基本URL
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.zexinmining.com';
  
  // 构建规范链接URL
  const canonicalUrl = `/${locale}/news/${newsId}`;

  // 准备OG图像数组
  const ogImages = [
    // 主图像 - 标准宽屏格式 (1200x630)
    {
      url: `${baseUrl}${newsItem.image}`,
      width: 1200,
      height: 630,
      alt: newsItem.imageAlt || newsItem.title,
    }
  ];

  return {
    title: newsItem.title,
    description: newsItem.summary,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'zh-CN': `/zh/news/${newsId}`,
        'en-US': `/en/news/${newsId}`,
      },
    },
    openGraph: {
      title: newsItem.title,
      description: newsItem.summary,
      url: `${baseUrl}${canonicalUrl}`,
      siteName: 'Zexin Mining Equipment',
      images: ogImages,
      locale: 'en_US',
      type: 'article',
      publishedTime: newsItem.date,
      authors: newsItem.author ? [newsItem.author] : undefined,
      section: newsItem.category || 'news',
      tags: newsItem.tags || [newsItem.category || 'company news'],
    },
    twitter: {
      card: 'summary_large_image',
      title: newsItem.title,
      description: newsItem.summary,
      images: [`${baseUrl}${newsItem.image}`],
      creator: newsItem.author || 'Zexin Mining Equipment',
    },
  };
}

export default async function NewsDetailPage({ 
  params 
}: { 
  params: { newsId: string } 
}) {
  // 使用固定的locale值
  const locale = 'en';
  const { newsId } = await params;
  
  const newsItemResult = await getNewsById(newsId, locale);
  
  // 确保获取到的是单个新闻项
  const newsItem = Array.isArray(newsItemResult) ? newsItemResult[0] : newsItemResult;
  
  if (!newsItem) {
    notFound();
  }

  const breadcrumbConfig = getBreadcrumbConfig(locale);

  // 准备面包屑导航  
  const breadcrumbItems = [
    { name: breadcrumbConfig.home.name, href: breadcrumbConfig.home.href },
    { name: 'News', href: `/${locale}/news` },
    { name: newsItem.title }
  ];
  
  // 获取相关新闻
  const relatedNewsResult = await getNewsById(newsId, locale, { related: true, limit: 3 });
  const relatedNews = Array.isArray(relatedNewsResult) ? relatedNewsResult : [];

  // 传递数据给客户端组件
  return (
    <NewsDetailClient 
      locale={locale} 
      newsItem={newsItem} 
      relatedNews={relatedNews} 
      breadcrumbItems={breadcrumbItems} 
    />
  );
}
