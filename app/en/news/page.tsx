import { Metadata } from 'next';
import NewsClient from './NewsClient';
import { getNews } from '@/lib/api/news';
import { getBreadcrumbConfig } from '@/lib/navigation';

// 生成元数据
export const metadata: Metadata = {
  title: 'Zexin Mining - News Center',
  description: 'Stay updated with the latest news, product releases, industry insights and corporate updates from Zexin Mining Equipment',
  };

// 服务端组件主体
export default async function NewsPage() {
  // 使用固定的locale值
  const locale = 'en';
  
  // 获取新闻数据
  const newsItems = await getNews({ locale });
  const breadcrumbConfig = getBreadcrumbConfig(locale);
  
  // 准备面包屑导航
  const breadcrumbItems = [
    { name: breadcrumbConfig.home.name, href: breadcrumbConfig.home.href },
    { name: 'News' }
  ];

  // 传递数据给客户端组件
  return <NewsClient locale={locale} initialNewsItems={newsItems} breadcrumbItems={breadcrumbItems} />;
}
