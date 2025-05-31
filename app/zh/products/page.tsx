import { Metadata } from 'next';
import ProductsPageClient from './ProductsPageClient';
import { getProductCategoryStructuredData, getOrganizationStructuredData, getWebPageStructuredData } from '@/lib/structuredData';
import { getProductsPageMetadata } from '@/lib/seo';

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
  const baseUrl = 'https://www.zexinmining.com';
  
  // 获取产品页面结构化数据
  const productCategoryStructuredData = getProductCategoryStructuredData({
    categoryId: 'all-products',
    categoryName: '所有产品',
    description: '泽鑫矿山设备提供全系列矿山设备和选矿解决方案',
    productCount: 30,
    locale: locale,
    baseUrl: baseUrl
  });
  
  // 获取组织结构化数据
  const organizationStructuredData = getOrganizationStructuredData(isZh);
  
  // 获取网页结构化数据
  const pageUrl = `${baseUrl}/${locale}/products`;
  const webPageStructuredData = getWebPageStructuredData({
    pageUrl,
    pageName: '产品与服务 - 泽鑫矿山设备',
    description: '泽鑫矿山设备提供全系列高效智能的矿山解决方案，包括选矿设备和矿山EPC服务，满足您的各种需求。',
    locale,
    baseUrl,
    images: [
      '/images/products/mineral-processing-equipment.jpg',
      '/images/products/mining-epc-contract.jpg'
    ]
  });
  
  // 产品列表结构化数据
  const itemListStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "item": {
          "@type": "Product",
          "name": "选矿设备",
          "description": "高效先进的选矿设备，融合创新技术与专业工程，实现矿物资源的最优回收率",
          "image": `${baseUrl}/images/products/mineral-processing-equipment.jpg`,
          "url": `${baseUrl}/${locale}/products/ore-processing`
        }
      },
      {
        "@type": "ListItem",
        "position": 2,
        "item": {
          "@type": "Service",
          "name": "矿山EPC服务",
          "description": "提供矿业全产业链服务（EPCMO），集成矿山技术咨询、设计、设备制造与采购、工程施工及运营管理",
          "image": `${baseUrl}/images/products/mining-epc-contract.jpg`,
          "url": `${baseUrl}/${locale}/products/mining-epc`
        }
      }
    ]
  };

  return (
    <>
      {/* 使用独立script标签注入各结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productCategoryStructuredData) }}
      />
      
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListStructuredData) }}
      />
      
      <ProductsPageClient />
    </>
  );
}