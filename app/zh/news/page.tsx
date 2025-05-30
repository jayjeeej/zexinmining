import { Metadata } from 'next';
import NewsClient from './NewsClient';
import { getNews } from '@/lib/api/news';
import { getBreadcrumbConfig } from '@/lib/navigation';

// 生成元数据
export const metadata: Metadata = {
  title: '泽鑫矿山设备 - 新闻中心',
  description: '了解泽鑫矿山设备的最新动态、产品发布、行业见解和企业新闻',
  };

// 服务端组件主体
export default async function NewsPage() {
  // 使用固定的locale值
  const locale = 'zh';
  
  // 获取新闻数据
  const newsItems = await getNews({ locale });
  const breadcrumbConfig = getBreadcrumbConfig(locale);
  
  // 准备面包屑导航
  const breadcrumbItems = [
    { name: breadcrumbConfig.home.name, href: breadcrumbConfig.home.href },
    { name: '新闻中心' }
  ];

  // 传递数据给客户端组件
  return <NewsClient locale={locale} initialNewsItems={newsItems} breadcrumbItems={breadcrumbItems} />;
}
