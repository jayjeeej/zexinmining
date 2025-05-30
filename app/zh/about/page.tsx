import { Metadata } from 'next';
import { getOrganizationStructuredData } from '@/lib/structuredData';
import { MultiStructuredData } from '@/components/StructuredData';
import AboutPageClient from './page.client';

// 为中文页面定义元数据
export const metadata: Metadata = {
  title: '关于我们 | 泽鑫矿山设备',
  description: '了解泽鑫矿山设备公司的历史、企业文化、专业团队和全球业务，以及我们如何为矿业客户提供卓越的产品与服务。',
    openGraph: {
    title: '关于泽鑫矿山设备',
    description: '泽鑫矿山设备是一家领先的矿业设备制造商和服务提供商，致力于为客户提供创新的矿业解决方案。',
    url: `/zh/about`,
    siteName: '泽鑫矿山设备',
    locale: 'zh',
      type: 'website',
    }
  };

// 主页面组件
export default async function AboutPage() {
  // 使用固定的locale值
  const locale = 'zh';
  const isZh = true;
  
  // 获取结构化数据
  const organizationStructuredData = getOrganizationStructuredData(isZh);
  
  // 组合成数组供MultiStructuredData组件使用
  const structuredDataArray = [
    organizationStructuredData
  ];

  return (
    <>
      <MultiStructuredData dataArray={structuredDataArray} />
      <AboutPageClient locale={locale} />
    </>
  );
} 