import { Metadata } from 'next';
import { getOrganizationStructuredData, getMineralProcessingSolutionsStructuredData, getBreadcrumbStructuredData } from '@/lib/structuredData';
import { MultiStructuredData } from '@/components/StructuredData';
import MineralProcessingSolutionsClient from './MineralProcessingSolutionsClient';
import { getBreadcrumbConfig } from '@/lib/navigation';

export const dynamic = 'force-static'; // 强制静态生成
export const revalidate = 3600; // 每小时重新验证一次

// 选矿解决方案页面服务端组件
export default async function MineralProcessingSolutionsPage({ params }: { params: { locale: string } }) {
  // 确保在使用 params.locale 前先等待参数
  const { locale } = await Promise.resolve(params);
  
  const isZh = locale === 'zh';
  const baseUrl = 'https://zexinmining.com';
  
  // 面包屑配置
  const breadcrumbConfig = getBreadcrumbConfig(locale);
  const breadcrumbItems = [
    { name: breadcrumbConfig.home.name, url: breadcrumbConfig.home.href },
    { name: breadcrumbConfig.products.name, url: breadcrumbConfig.products.href },
    { name: isZh ? '矿物加工解决方案' : 'Mineral Processing Solutions' }
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
  // 确保在使用 params.locale 前先等待参数
  const { locale } = await Promise.resolve(params);
  const isZh = locale === 'zh';
  
  return {
    title: isZh 
      ? '矿物加工解决方案 - 定制化选矿工艺流程 - 泽鑫矿山设备' 
      : 'Mineral Processing Solutions - Customized Beneficiation Processes - Zexin Mining Equipment',
    description: isZh
      ? '泽鑫提供全面的矿物加工解决方案，根据不同矿种特性设计最优选矿工艺流程，包括新能源矿种、贵金属、有色金属、黑色金属和非金属等矿物的加工方案'
      : 'Zexin provides comprehensive mineral processing solutions, designing optimal beneficiation processes for different mineral characteristics, including processing solutions for new energy minerals, precious metals, non-ferrous metals, ferrous metals, and non-metals',
    alternates: {
      canonical: `https://zexinmining.com/${locale}/products/mineral-processing-solutions`,
      languages: {
        'en': 'https://zexinmining.com/en/products/mineral-processing-solutions',
        'zh': 'https://zexinmining.com/zh/products/mineral-processing-solutions'
      }
    }
  };
} 