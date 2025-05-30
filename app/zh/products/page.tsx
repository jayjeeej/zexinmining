import { Metadata } from 'next';
import ProductsPageClient from './ProductsPageClient';
import { getProductCategoryStructuredData, getOrganizationStructuredData } from '@/lib/structuredData';
import { getProductsPageMetadata } from '@/lib/seo';
import { MultiStructuredData } from '@/components/StructuredData';

// 生成元数据
export const metadata: Metadata = getProductsPageMetadata({ locale: 'zh' });

// 使用静态渲染并设置重验证时间
export const dynamic = 'force-static';
export const revalidate = 3600; // 每小时重新验证一次

// 产品页面服务端组件
export default async function ProductsPage() {
  // 使用固定的locale值
  const locale = 'zh';
  const isZh = true;
  
  // 获取产品页面结构化数据
  const productCategoryStructuredData = getProductCategoryStructuredData({
    categoryId: 'all-products',
    categoryName: '所有产品',
    description: '泽鑫矿山设备提供全系列矿山设备和选矿解决方案',
    productCount: 30,
    locale: locale,
    baseUrl: 'https://www.zexinmining.com'
  });
  
  // 获取组织结构化数据
  const organizationStructuredData = getOrganizationStructuredData(isZh);
  
  // 组合所有结构化数据
  const structuredDataArray = [
    productCategoryStructuredData,
    organizationStructuredData
  ];

  return (
    <>
      <MultiStructuredData dataArray={structuredDataArray} />
      <ProductsPageClient locale={locale} />
    </>
  );
}