import { Metadata } from 'next';
import { getOrganizationStructuredData } from '@/lib/structuredData';
import { MultiStructuredData } from '@/components/StructuredData';
import AboutPageClient from '@/app/[locale]/about/page.client';

// 告诉Next.js这是一个静态页面
export const dynamic = 'force-static';
export const revalidate = 3600; // 每小时重新验证一次

// 为每个语言定义元数据
export async function generateMetadata(): Promise<Metadata> {
  const locale = 'zh';
  
  return {
    title: '关于我们 | 泽鑫矿山设备',
    description: '了解泽鑫矿山设备公司的历史、企业文化、专业团队和全球业务，以及我们如何为矿业客户提供卓越的产品与服务。',
    openGraph: {
      title: '关于泽鑫矿山设备',
      description: '泽鑫矿山设备是一家领先的矿业设备制造商和服务提供商，致力于为客户提供创新的矿业解决方案。',
      url: `/zh/about`,
      siteName: '泽鑫矿山设备',
      locale: locale,
      type: 'website',
    }
  };
}

// 主页面组件
export default function AboutPage() {
  const locale = 'zh';
  
  // 获取结构化数据
  const organizationStructuredData = getOrganizationStructuredData(true);
  
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