import { Metadata } from 'next';
import { getOrganizationStructuredData } from '@/lib/structuredData';
import { MultiStructuredData } from '@/components/StructuredData';
import AboutPageClient from './page.client';

// Vercel 优化导出指令
export const dynamic = 'force-static';        // 强制静态生成
export const revalidate = 3600;               // 每小时重新验证一次
export const fetchCache = 'force-cache';      // 强制使用缓存
export const runtime = 'nodejs';              // 使用Node.js运行时
export const preferredRegion = 'auto';        // 自动选择最佳区域
export const generateStaticParams = () => [{}];

// 为英文页面定义元数据
export const metadata: Metadata = {
  title: 'About Us | Zexin Mining Equipment',
  description: 'Learn about Zexin Mining Equipment company history, culture, professional team and global operations, and how we provide outstanding products and services to mining clients.',
    openGraph: {
    title: 'About Zexin Mining Equipment',
    description: 'Zexin Mining Equipment is a leading mining equipment manufacturer and service provider dedicated to delivering innovative mining solutions to our clients.',
    url: `https://www.zexinmining.com/en/about`,
    siteName: 'Zexin Mining Equipment',
    locale: 'en',
      type: 'website',
    }
  };

// 主页面组件
export default function AboutPage() {
  // 使用固定的locale值
  const locale = 'en';
  const isZh = false;
  
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