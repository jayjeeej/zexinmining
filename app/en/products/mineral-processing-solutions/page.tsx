import { Metadata } from 'next';
import { getOrganizationStructuredData, getMineralProcessingSolutionsStructuredData, getBreadcrumbStructuredData } from '@/lib/structuredData';
import { MultiStructuredData } from '@/components/StructuredData';
import MineralProcessingSolutionsClient from './MineralProcessingSolutionsClient';
import { getBreadcrumbConfig } from '@/lib/navigation';

export const dynamic = 'force-static'; // 强制静态生成
export const revalidate = 3600; // 每小时重新验证一次

// 选矿解决方案页面服务端组件
export default async function MineralProcessingSolutionsPage({ params }: { params: { locale: string } }) {
  // 静态路由下直接指定locale而不是从params获取
  const locale = 'en';
  
  const isZh = false; // 英文版固定为false
  const baseUrl = 'https://www.zexinmining.com';
  
  // 面包屑配置
  const breadcrumbConfig = getBreadcrumbConfig(locale);
  const breadcrumbItems = [
    { name: breadcrumbConfig.home.name, url: breadcrumbConfig.home.href },
    { name: breadcrumbConfig.products.name, url: breadcrumbConfig.products.href },
    { name: 'Mineral Processing Solutions' }
  ];
  
  // 结构化数据
  const organizationStructuredData = getOrganizationStructuredData(isZh);
  const solutionsStructuredData = getMineralProcessingSolutionsStructuredData({ locale });
  const breadcrumbStructuredData = getBreadcrumbStructuredData(breadcrumbItems, baseUrl);
  
  const structuredDataArray = [
    organizationStructuredData,
    solutionsStructuredData,
    breadcrumbStructuredData
  ];
  
  return (
    <>
      {/* 使用MultiStructuredData组件注入结构化数据 */}
      <MultiStructuredData dataArray={structuredDataArray} />
      
      {/* 客户端组件 */}
      <MineralProcessingSolutionsClient locale={locale} />
    </>
  );
}

// 生成页面元数据
export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  // 静态路由下直接指定locale而不是从params获取
  const locale = 'en';
  const isZh = false; // 英文版固定为false
  
  return {
    title: 'Mineral Processing Solutions - Customized Beneficiation Processes - Zexin Mining Equipment',
    description: 'Tailored mineral processing solutions for precious, non-ferrous, ferrous and non-metallic ores. Our optimized beneficiation processes maximize recovery rates while reducing energy consumption and environmental impact.',
    alternates: {
      canonical: `https://www.zexinmining.com/${locale}/products/mineral-processing-solutions`,
      languages: {
        'en': 'https://www.zexinmining.com/en/products/mineral-processing-solutions',
        'zh': 'https://www.zexinmining.com/zh/products/mineral-processing-solutions'
      }
    }
  };
} 