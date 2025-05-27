import { Metadata } from 'next';
import { getOrganizationStructuredData } from '@/lib/structuredData';
import { MultiStructuredData } from '@/components/StructuredData';
import AboutPageClient from '@/app/[locale]/about/page.client';

// 告诉Next.js这是一个静态页面
export const dynamic = 'force-static';
export const revalidate = 3600; // 每小时重新验证一次

// 为每个语言定义元数据
export async function generateMetadata(): Promise<Metadata> {
  const locale = 'en';
  
  return {
    title: 'About Us | Zexin Mining Equipment',
    description: 'Learn about Zexin Mining Equipment company history, culture, professional team and global operations, and how we provide outstanding products and services to mining clients.',
    openGraph: {
      title: 'About Zexin Mining Equipment',
      description: 'Zexin Mining Equipment is a leading mining equipment manufacturer and service provider dedicated to delivering innovative mining solutions to our clients.',
      url: `/en/about`,
      siteName: 'Zexin Mining Equipment',
      locale: locale,
      type: 'website',
    }
  };
}

// 主页面组件
export default function AboutPage() {
  const locale = 'en';
  
  // 获取结构化数据
  const organizationStructuredData = getOrganizationStructuredData(false);
  
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