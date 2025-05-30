import { Metadata } from 'next';
import { getOrganizationStructuredData } from '@/lib/structuredData';
import { MultiStructuredData } from '@/components/StructuredData';
import AboutPageClient from './page.client';

// Vercel 优化导出指令
export const dynamic = 'force-static';        // 强制静态生成
export const revalidate = false;              // 禁用重新验证
export const fetchCache = 'force-cache';      // 强制使用缓存
export const runtime = 'nodejs';              // 使用Node.js运行时
export const preferredRegion = 'auto';        // 自动选择最佳区域

// 确保静态生成
export const generateStaticParams = () => [{}];

// 为中文页面定义元数据
export const metadata: Metadata = {
  title: '关于我们 | 泽鑫矿山设备',
  description: '了解泽鑫矿山设备公司的历史、企业文化、专业团队和全球业务，以及我们如何为矿业客户提供卓越的产品与服务。',
  alternates: {
    canonical: 'https://www.zexinmining.com/zh/about',
    languages: {
      'zh-CN': 'https://www.zexinmining.com/zh/about',
      'en-US': 'https://www.zexinmining.com/en/about'
    }
  },
  openGraph: {
    title: '关于泽鑫矿山设备',
    description: '泽鑫矿山设备是一家领先的矿业设备制造商和服务提供商，致力于为客户提供创新的矿业解决方案。',
    url: 'https://www.zexinmining.com/zh/about',
    siteName: '泽鑫矿山设备',
    locale: 'zh',
    type: 'website',
  }
};

// 使用普通函数而非async函数，避免被视为服务器组件
export default function AboutPage() {
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