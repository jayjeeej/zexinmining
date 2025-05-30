import { Metadata } from 'next';
import NewsClient from './NewsClient';
import { getNews } from '@/lib/api/news';
import { getBreadcrumbConfig } from '@/lib/navigation';

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
