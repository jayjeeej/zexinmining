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
  const locale = 'zh';
  
  const isZh = true; // 中文版固定为true
  const baseUrl = 'https://www.zexinmining.com';
  
  // 面包屑配置
  const breadcrumbConfig = getBreadcrumbConfig(locale);
  const breadcrumbItems = [
    { name: breadcrumbConfig.home.name, url: breadcrumbConfig.home.href },
    { name: breadcrumbConfig.products.name, url: breadcrumbConfig.products.href },
    { name: '矿物加工解决方案' }
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
  const locale = 'zh';
  const isZh = true; // 中文版固定为true
  
  return {
    title: '矿物加工解决方案 - 定制化选矿工艺流程 - 泽鑫矿山设备',
    description: '泽鑫提供定制选矿工艺方案，针对金属和非金属矿种优化加工流程，提高回收率，节能环保，实现矿石高值化。',
    alternates: {
      canonical: `https://www.zexinmining.com/${locale}/products/mineral-processing-solutions`,
      languages: {
        'en': 'https://www.zexinmining.com/en/products/mineral-processing-solutions',
        'zh': 'https://www.zexinmining.com/zh/products/mineral-processing-solutions'
      }
    }
  };
} 