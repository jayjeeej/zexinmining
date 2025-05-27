import { Metadata } from 'next';
import { getOrganizationStructuredData } from '@/lib/structuredData';
import { MultiStructuredData } from '@/components/StructuredData';
import AboutPageClient from './page.client';
import { locales } from '@/i18n/request';

// 告诉Next.js这是一个静态页面
export const dynamic = 'force-static';
export const revalidate = 3600; // 每小时重新验证一次

// 为About页面生成静态路径参数
export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// 为每个语言定义元数据
export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = await Promise.resolve(params);
  const isZh = locale === 'zh';
  
  return {
    title: isZh ? '关于我们 | 泽鑫矿山设备' : 'About Us | Zexin Mining Equipment',
    description: isZh 
      ? '了解泽鑫矿山设备公司的历史、企业文化、专业团队和全球业务，以及我们如何为矿业客户提供卓越的产品与服务。'
      : 'Learn about Zexin Mining Equipment company history, culture, professional team and global operations, and how we provide outstanding products and services to mining clients.',
    openGraph: {
      title: isZh ? '关于泽鑫矿山设备' : 'About Zexin Mining Equipment',
      description: isZh 
        ? '泽鑫矿山设备是一家领先的矿业设备制造商和服务提供商，致力于为客户提供创新的矿业解决方案。'
        : 'Zexin Mining Equipment is a leading mining equipment manufacturer and service provider dedicated to delivering innovative mining solutions to our clients.',
      url: `/${locale}/about`,
      siteName: isZh ? '泽鑫矿山设备' : 'Zexin Mining Equipment',
      locale: locale,
      type: 'website',
    }
  };
}

// 主页面组件
export default async function AboutPage({ params }: { params: { locale: string } }) {
  const { locale } = await Promise.resolve(params);
  const isZh = locale === 'zh';
  
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