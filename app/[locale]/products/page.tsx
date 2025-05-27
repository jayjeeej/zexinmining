import { Metadata } from 'next';
import ProductsPageClient from './ProductsPageClient';
import { getProductCategoryStructuredData, getOrganizationStructuredData } from '@/lib/structuredData';
import { getProductsPageMetadata } from '@/lib/seo';
import { MultiStructuredData } from '@/components/StructuredData';

// 生成元数据
export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = await Promise.resolve(params);
  return getProductsPageMetadata({ locale: locale });
}

// 使用静态渲染并设置重验证时间
export const dynamic = 'force-static';
export const revalidate = 3600; // 每小时重新验证一次

// 产品页面服务端组件
export default async function ProductsPage({ params }: { params: { locale: string } }) {
  const { locale } = await Promise.resolve(params);
  const isZh = locale === 'zh';
  
  // 获取产品页面结构化数据
  const productCategoryStructuredData = getProductCategoryStructuredData({
    categoryId: 'all-products',
    categoryName: isZh ? '所有产品' : 'All Products',
    description: isZh ? '泽鑫矿山设备提供全系列矿山设备和选矿解决方案' : 'Zexin Mining Equipment offers a complete range of mining equipment and mineral processing solutions',
    productCount: 30,
    locale: locale,
    baseUrl: 'https://zexinmining.com'
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