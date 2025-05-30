import { Metadata } from 'next';
import { getOrganizationStructuredData } from '@/lib/structuredData';
import { MultiStructuredData } from '@/components/StructuredData';
import AboutPageClient from './page.client';

// 为英文页面定义元数据
export const metadata: Metadata = {
  title: 'About Us | Zexin Mining Equipment',
  description: 'Learn about Zexin Mining Equipment company history, culture, professional team and global operations, and how we provide outstanding products and services to mining clients.',
    openGraph: {
    title: 'About Zexin Mining Equipment',
    description: 'Zexin Mining Equipment is a leading mining equipment manufacturer and service provider dedicated to delivering innovative mining solutions to our clients.',
    url: `/en/about`,
    siteName: 'Zexin Mining Equipment',
    locale: 'en',
      type: 'website',
    }
  };

// 主页面组件
export default async function AboutPage() {
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