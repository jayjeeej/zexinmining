import { Metadata } from 'next';
import NewsClient from './NewsClient';
import { getNews } from '@/lib/api/news';
import { getBreadcrumbConfig } from '@/lib/navigation';

// 生成元数据
export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = await params;
  const isZh = locale === 'zh';
  
  return {
    title: isZh ? '泽鑫矿山设备 - 新闻中心' : 'Zexin Mining - News Center',
    description: isZh ? 
      '了解泽鑫矿山设备的最新动态、产品发布、行业见解和企业新闻' : 
      'Stay updated with the latest news, product releases, industry insights and corporate updates from Zexin Mining Equipment',
  };
}

// 服务端组件主体
export default async function NewsPage({ params }: { params: { locale: string } }) {
  const { locale } = await params;
  
  // 获取新闻数据
  const newsItems = await getNews({ locale });
  const breadcrumbConfig = getBreadcrumbConfig(locale);
  
  // 准备面包屑导航
  const breadcrumbItems = [
    { name: breadcrumbConfig.home.name, href: breadcrumbConfig.home.href },
    { name: locale === 'zh' ? '新闻中心' : 'News' }
  ];

  // 传递数据给客户端组件
  return <NewsClient locale={locale} initialNewsItems={newsItems} breadcrumbItems={breadcrumbItems} />;
}
