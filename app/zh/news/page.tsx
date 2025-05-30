import { Metadata } from 'next';
import NewsClient from './NewsClient';
import { getNews } from '@/lib/api/news';
import { getBreadcrumbConfig } from '@/lib/navigation';

// 生成元数据
export const metadata: Metadata = {
  title: '矿山设备资讯-选矿技术文章矿业新闻 | 泽鑫矿山设备',
  description: '了解矿山设备行业动态、选矿技术创新、产品发布和泽鑫最新工程案例，为您提供专业矿业资讯。',
  keywords: '矿山设备资讯,选矿技术文章,矿业新闻,选矿工艺,矿山设备技术,泽鑫矿山',
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
