import { Metadata } from 'next';
import { getNewsById } from '@/lib/api/news';
import { getBreadcrumbConfig } from '@/lib/navigation';
import NewsDetailClient from './NewsDetailClient';
import { notFound } from 'next/navigation';
import { NewsItem } from '@/lib/api/news';

// 动态生成元数据
export async function generateMetadata({ 
  params 
}: { 
  params: { locale: string, newsId: string } 
}): Promise<Metadata> {
  const { locale, newsId } = await params;
  
  const newsItemResult = await getNewsById(newsId, locale);
  
  // 确保获取到的是单个新闻项
  const newsItem = Array.isArray(newsItemResult) ? newsItemResult[0] : newsItemResult;
  
  if (!newsItem) {
    return {
      title: '404 - Not Found',
    };
  }

  return {
    title: newsItem.title,
    description: newsItem.summary,
    openGraph: {
      title: newsItem.title,
      description: newsItem.summary,
      images: [newsItem.image],
      type: 'article',
      publishedTime: newsItem.date,
    },
  };
}

export default async function NewsDetailPage({ 
  params 
}: { 
  params: { locale: string, newsId: string } 
}) {
  const { locale, newsId } = await params;
  
  const newsItemResult = await getNewsById(newsId, locale);
  
  // 确保获取到的是单个新闻项
  const newsItem = Array.isArray(newsItemResult) ? newsItemResult[0] : newsItemResult;
  
  if (!newsItem) {
    notFound();
  }

  const breadcrumbConfig = getBreadcrumbConfig(locale);
  const isZh = locale === 'zh';

  // 准备面包屑导航  
  const breadcrumbItems = [
    { name: breadcrumbConfig.home.name, href: breadcrumbConfig.home.href },
    { name: isZh ? '新闻中心' : 'News', href: `/${locale}/news` },
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
