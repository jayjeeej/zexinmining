import { Metadata } from 'next';
import { getOrganizationStructuredData, getWebPageStructuredData, getLocalBusinessStructuredData } from '@/lib/structuredData';
import AboutPageClient from './page.client';

// Vercel 优化导出指令
export const dynamic = 'force-static';        // 强制静态生成
export const revalidate = false;              // 禁用重新验证
export const fetchCache = 'force-cache';      // 强制使用缓存
export const runtime = 'nodejs';              // 使用Node.js运行时
export const preferredRegion = 'auto';        // 自动选择最佳区域

// 确保静态生成
export const generateStaticParams = () => [{}];

// 为英文页面定义元数据
export const metadata: Metadata = {
  title: 'About Us | Zexin Mining Equipment',
  description: 'Learn about Zexin Mining Equipment company history, culture, professional team and global operations, and how we provide outstanding products and services to mining clients.',
  alternates: {
    canonical: 'https://www.zexinmining.com/en/about',
    languages: {
      'zh-CN': 'https://www.zexinmining.com/zh/about',
      'en-US': 'https://www.zexinmining.com/en/about'
    }
  },
    openGraph: {
    title: 'About Zexin Mining Equipment',
    description: 'Zexin Mining Equipment is a leading mining equipment manufacturer and service provider dedicated to delivering innovative mining solutions to our clients.',
    url: 'https://www.zexinmining.com/en/about',
    siteName: 'Zexin Mining Equipment',
    locale: 'en',
      type: 'website',
    }
  };

// 使用普通函数而非async函数，避免被视为服务器组件
export default function AboutPage() {
  // 使用固定的locale值
  const locale = 'en';
  const isZh = false;
  const baseUrl = 'https://www.zexinmining.com';
  const pageUrl = `${baseUrl}/${locale}/about`;
  
  // 获取结构化数据
  const organizationStructuredData = getOrganizationStructuredData(isZh);
  
  // 添加WebPage结构化数据
  const webPageStructuredData = getWebPageStructuredData({
    pageUrl,
    pageName: 'About Us | Zexin Mining Equipment',
    description: 'Learn about Zexin Mining Equipment company history, culture, professional team and global operations, and how we provide outstanding products and services to mining clients.',
    locale,
    baseUrl,
    images: [
      '/images/about/about-company.jpg',
      '/images/about/team-founder.jpg',
      '/images/about/team-ceo.jpg'
    ]
  });
  
  // 添加LocalBusiness结构化数据
  const localBusinessStructuredData = getLocalBusinessStructuredData(locale, baseUrl);

  return (
    <>
      {/* 使用独立script标签注入结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
      />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageStructuredData) }}
      />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessStructuredData) }}
      />
      
      <AboutPageClient />
    </>
  );
} 