import { Metadata } from 'next';
import NewsClient from './NewsClient';
import { getNews } from '@/lib/api/news';
import { getBreadcrumbConfig } from '@/lib/navigation';
import { getBreadcrumbStructuredData, getOrganizationStructuredData, getWebPageStructuredData } from '@/lib/structuredData';

// 生成元数据
export const metadata: Metadata = {
  title: 'Mining Equipment News - Mineral Processing Articles & Updates | Zexin Mining',
  description: 'Get the latest mining industry news, mineral processing innovations, equipment launches and project case studies. Expert insights on gold, iron and copper processing technologies.',
  keywords: 'mining equipment news,mineral processing articles,mining industry updates,ore processing technology,mining equipment innovation,Zexin Mining',
};

// 服务端组件主体
export default async function NewsPage() {
  // 使用固定的locale值
  const locale = 'en';
  const baseUrl = 'https://www.zexinmining.com';
  const pageUrl = `${baseUrl}/${locale}/news`;
  
  // 获取新闻数据
  const newsItems = await getNews({ locale });
  const breadcrumbConfig = getBreadcrumbConfig(locale);
  
  // 准备面包屑导航
  const breadcrumbItems = [
    { name: breadcrumbConfig.home.name, href: breadcrumbConfig.home.href },
    { name: 'News' }
  ];

  // SEO结构化数据 - 在服务端生成
  const isZh = false;
  
  // 面包屑结构化数据
  const breadcrumbStructuredData = getBreadcrumbStructuredData(
    breadcrumbItems.map(item => ({ name: item.name, url: item.href })),
    baseUrl
  );
  
  // 组织结构化数据
  const organizationStructuredData = getOrganizationStructuredData(isZh);
  
  // 网页结构化数据
  const webPageStructuredData = getWebPageStructuredData({
    pageUrl,
    pageName: 'Mining Equipment News - Mineral Processing Articles & Updates | Zexin Mining',
    description: 'Get the latest mining industry news, mineral processing innovations, equipment launches and project case studies. Expert insights on gold, iron and copper processing technologies.',
    locale,
    baseUrl,
    breadcrumbId: `${pageUrl}#breadcrumb`,
    images: newsItems.slice(0, 3).map(news => news.image)
  });
  
  // 新闻列表页结构化数据
  const newsListStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "headline": "News Center",
    "description": "Stay updated with the latest news, product releases and corporate updates from Zexin Mining Equipment",
    "url": pageUrl,
    "publisher": {
      "@type": "Organization",
      "name": "Zexin Mining Equipment",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo/logo-en.webp`
      }
    },
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": newsItems.slice(0, 10).map((news, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `${baseUrl}/${locale}/news/${news.slug}`,
        "name": news.title
      }))
    }
  };

  // 传递数据给客户端组件，移除结构化数据处理
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageStructuredData) }}
      />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsListStructuredData) }}
      />
      
      <NewsClient 
        locale={locale} 
        initialNewsItems={newsItems} 
        breadcrumbItems={breadcrumbItems} 
      />
    </>
  );
}
