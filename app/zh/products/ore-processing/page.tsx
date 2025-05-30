import { Metadata } from 'next';
import { getCategoryMetadata, getMineralProcessingMetadata } from '@/lib/seo';
import { getOrganizationStructuredData, getProductCategoryStructuredData, getBreadcrumbStructuredData } from '@/lib/structuredData';
import { MultiStructuredData } from '@/components/StructuredData';
import OreProcessingPageClient from './OreProcessingPageClient';
import { getBreadcrumbConfig } from '@/lib/navigation';

// 生成元数据
export async function generateMetadata() {
  // 使用固定的locale值
  const locale = 'zh';
  
  return getMineralProcessingMetadata({ locale });
}

// 使用静态生成
export const dynamic = 'force-static'; 
export const revalidate = 3600; // 每小时重新验证一次

// 选矿设备页面服务端组件
export default async function OreProcessingPage() {
  // 使用固定的locale值
  const locale = 'zh';
  const isZh = true;
  const baseUrl = 'https://www.zexinmining.com';
  
  // 面包屑配置
  const breadcrumbConfig = getBreadcrumbConfig(locale);
  const breadcrumbItems = [
    { name: breadcrumbConfig.home.name, url: breadcrumbConfig.home.href },
    { name: breadcrumbConfig.products.name, url: breadcrumbConfig.products.href },
    { name: '选矿设备' }
  ];
  
  // 准备结构化数据
  // 1. 组织结构化数据
  const organizationStructuredData = getOrganizationStructuredData(isZh);
  
  // 2. 产品类别结构化数据
  const categoryStructuredData = getProductCategoryStructuredData({
    categoryId: 'ore-processing',
    categoryName: '选矿设备',
    description: '泽鑫矿山设备提供全方位选矿设备与解决方案，包括破碎、磨矿、分级、选别、脱水等系列设备，高效处理各类矿石',
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