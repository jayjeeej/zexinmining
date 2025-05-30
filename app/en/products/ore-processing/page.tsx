import { Metadata } from 'next';
import { getCategoryMetadata, getMineralProcessingMetadata } from '@/lib/seo';
import { getOrganizationStructuredData, getProductCategoryStructuredData, getBreadcrumbStructuredData } from '@/lib/structuredData';
import { MultiStructuredData } from '@/components/StructuredData';
import OreProcessingPageClient from './OreProcessingPageClient';
import { getBreadcrumbConfig } from '@/lib/navigation';

// 生成元数据
export async function generateMetadata() {
  // 使用固定的locale值
  const locale = 'en';
  
  return getMineralProcessingMetadata({ locale });
}

// 使用静态生成
export const dynamic = 'force-static'; 
export const revalidate = 3600; // 每小时重新验证一次

// 选矿设备页面服务端组件
export default async function OreProcessingPage() {
  // 使用固定的locale值
  const locale = 'en';
  const isZh = false;
  const baseUrl = 'https://www.zexinmining.com';
  
  // 面包屑配置
  const breadcrumbConfig = getBreadcrumbConfig(locale);
  const breadcrumbItems = [
    { name: breadcrumbConfig.home.name, url: breadcrumbConfig.home.href },
    { name: breadcrumbConfig.products.name, url: breadcrumbConfig.products.href },
    { name: 'Ore Processing Equipment' }
  ];
  
  // 准备结构化数据
  // 1. 组织结构化数据
  const organizationStructuredData = getOrganizationStructuredData(isZh);
  
  // 2. 产品类别结构化数据
  const categoryStructuredData = getProductCategoryStructuredData({
    categoryId: 'ore-processing',
    categoryName: 'Ore Processing Equipment',
    description: 'Zexin Mining Equipment offers comprehensive mineral processing equipment and solutions, including crushing, grinding, classification, separation, dewatering and other series of equipment for efficient processing of various ores',
    productCount: 50,
    locale,
    baseUrl
  });
  
  // 3. 面包屑结构化数据
  const breadcrumbStructuredData = getBreadcrumbStructuredData(breadcrumbItems, baseUrl);
  
  // 组合所有结构化数据
  const structuredDataArray = [
    organizationStructuredData,
    categoryStructuredData,
    breadcrumbStructuredData
  ];
  
  return (
    <>
      {/* 使用MultiStructuredData组件注入结构化数据 */}
      <MultiStructuredData dataArray={structuredDataArray} />
      
      {/* 客户端组件 */}
      <OreProcessingPageClient locale={locale} />
    </>
  );
} 