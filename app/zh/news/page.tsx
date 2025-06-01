import { Metadata } from 'next';
import NewsClient from './NewsClient';
import { getNews } from '@/lib/api/news';
import { getBreadcrumbConfig } from '@/lib/navigation';
import { getBreadcrumbStructuredData, getOrganizationStructuredData, getWebPageStructuredData } from '@/lib/structuredData';

// 生成元数据
export const metadata: Metadata = {
  title: '矿山设备资讯-选矿技术文章矿业新闻 | 泽鑫矿山设备',
  description: '了解矿山设备行业动态、选矿技术创新、产品发布和泽鑫最新工程案例，为您提供专业矿业资讯。',
  keywords: '矿山设备资讯,选矿技术文章,矿业新闻,选矿工艺,矿山设备技术,泽鑫矿山',
  alternates: {
    canonical: 'https://www.zexinmining.com/zh/news',
    languages: {
      'zh': 'https://www.zexinmining.com/zh/news',
      'en': 'https://www.zexinmining.com/en/news',
    },
  },
};

// 服务端组件主体
export default async function NewsPage() {
  // 使用固定的locale值
  const locale = 'zh';
  const baseUrl = 'https://www.zexinmining.com';
  const pageUrl = `${baseUrl}/${locale}/news`;
  
  // 获取新闻数据
  const newsItems = await getNews({ locale });
  const breadcrumbConfig = getBreadcrumbConfig(locale);
  
  // 准备面包屑导航
  const breadcrumbItems = [
    { name: breadcrumbConfig.home.name, href: breadcrumbConfig.home.href },
    { name: '新闻中心' }
  ];

  // SEO结构化数据 - 在服务端生成
  const isZh = true;
  
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
    pageName: '矿山设备资讯-选矿技术文章矿业新闻 | 泽鑫矿山设备',
    description: '了解矿山设备行业动态、选矿技术创新、产品发布和泽鑫最新工程案例，为您提供专业矿业资讯。',
    locale,
    baseUrl,
    breadcrumbId: `${pageUrl}#breadcrumb`,
    images: newsItems.slice(0, 3).map(news => news.image)
  });
  
  // 新闻列表页结构化数据
  const newsListStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "headline": "新闻中心",
    "description": "了解泽鑫矿山设备的最新动态、产品发布和企业新闻",
    "url": pageUrl,
    "publisher": {
      "@type": "Organization",
      "name": "泽鑫矿山设备",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo/logo-zh.webp`
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
