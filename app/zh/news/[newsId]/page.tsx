import { Metadata } from 'next';
import { getNewsById } from '@/lib/api/news';
import { getBreadcrumbConfig } from '@/lib/navigation';
import NewsDetailClient from './NewsDetailClient';
import { notFound } from 'next/navigation';
import { NewsItem } from '@/lib/api/news';
import { safelyGetRouteParams } from '@/lib/utils';
import fs from 'fs';
import path from 'path';
import { 
  getBreadcrumbStructuredData, 
  getOrganizationStructuredData, 
  getNewsArticleStructuredData 
} from '@/lib/structuredData';
// Vercel 优化导出指令
export const dynamic = 'force-static';        // 强制静态生成
export const revalidate = 3600;               // 每小时重新验证一次
export const fetchCache = 'force-cache';      // 强制使用缓存
export const runtime = 'nodejs';              // 使用Node.js运行时
export const preferredRegion = 'auto';        // 自动选择最佳区域

// 为静态导出生成所有可能的路径参数
export async function generateStaticParams() {
  const locale = 'zh';
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
    
    console.log(`Generated ${params.length} static paths for Chinese news`);
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
  const locale = 'zh';
  const { newsId } = await params;
  
  const newsItemResult = await getNewsById(newsId, locale);
  
  // 确保获取到的是单个新闻项
  const newsItem = Array.isArray(newsItemResult) ? newsItemResult[0] : newsItemResult;
  
  if (!newsItem) {
    return {
      title: '404 - 未找到',
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
  
  // 优化标题长度，确保不超过28个中文字符
  let optimizedTitle = newsItem.title;
  const siteName = '泽鑫矿山设备';
  
  // 如果标题超过24个字符，则截取前20个字符并添加省略号
  if (optimizedTitle.length > 24) {
    optimizedTitle = optimizedTitle.substring(0, 20) + '...';
    optimizedTitle = `${optimizedTitle} | ${siteName}`;
  } else {
    optimizedTitle = `${optimizedTitle} | ${siteName}`;
  }

  return {
    title: optimizedTitle,
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
      siteName: '泽鑫矿山设备',
      images: ogImages,
      locale: 'zh_CN',
      type: 'article',
      publishedTime: newsItem.date,
      authors: newsItem.author ? [newsItem.author] : undefined,
      section: newsItem.category || '新闻',
      tags: newsItem.tags || [newsItem.category || '公司新闻'],
    },
    twitter: {
      card: 'summary_large_image',
      title: newsItem.title,
      description: newsItem.summary,
      images: [`${baseUrl}${newsItem.image}`],
      creator: newsItem.author || '泽鑫矿山设备',
    },
  };
}

export default async function NewsDetailPage({ 
  params 
}: { 
  params: { newsId: string } 
}) {
  // 使用固定的locale值
  const locale = 'zh';
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
    { name: '新闻中心', href: `/${locale}/news` },
    { name: newsItem.title }
  ];
  
  // 获取相关新闻
  const relatedNewsResult = await getNewsById(newsId, locale, { related: true, limit: 3 });
  const relatedNews = Array.isArray(relatedNewsResult) ? relatedNewsResult : [];

  // 添加分类映射
  const categoryMap: Record<string, { zh: string, en: string }> = {
    'company': { zh: '公司新闻', en: 'Company News' },
    'product': { zh: '产品动态', en: 'Product Updates' },
    'industry': { zh: '行业资讯', en: 'Industry Insights' },
    'technical': { zh: '选矿知识', en: 'Beneficiation Techniques' }
  };

  // 获取基础URL
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.zexinmining.com';
  
  // 服务端生成结构化数据
  const isZh = locale === 'zh';

  // SEO结构化数据
  const breadcrumbStructuredData = getBreadcrumbStructuredData(
    breadcrumbItems.map(item => ({ name: item.name, url: item.href }))
  );
  const organizationStructuredData = getOrganizationStructuredData(isZh);
  
  // 新闻文章结构化数据
  const newsArticleStructuredData = getNewsArticleStructuredData({
    newsItem,
    locale,
    baseUrl,
    categoryMap
  });

  // 传递数据给客户端组件，不包括结构化数据
  return (
    <>
      {/* 使用独立script标签注入各结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
      />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsArticleStructuredData) }}
      />
      
      <NewsDetailClient 
        locale={locale} 
        newsItem={newsItem} 
        relatedNews={relatedNews} 
        breadcrumbItems={breadcrumbItems} 
      />
    </>
  );
}
