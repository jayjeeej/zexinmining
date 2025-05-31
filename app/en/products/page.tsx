import { Metadata } from 'next';
import ProductsPageClient from './ProductsPageClient';
import { getProductCategoryStructuredData, getOrganizationStructuredData, getWebPageStructuredData } from '@/lib/structuredData';
import { getProductsPageMetadata } from '@/lib/seo';

// 生成元数据
export const metadata: Metadata = getProductsPageMetadata({ locale: 'en' });

// 使用静态渲染并设置重验证时间
export const dynamic = 'force-static';
export const revalidate = 3600; // 每小时重新验证一次

// 产品页面服务端组件
export default async function ProductsPage() {
  // 使用固定的locale值
  const locale = 'en';
  const isZh = false;
  const baseUrl = 'https://www.zexinmining.com';
  
  // 获取产品页面结构化数据
  const productCategoryStructuredData = getProductCategoryStructuredData({
    categoryId: 'all-products',
    categoryName: 'All Products',
    description: 'Zexin Mining Equipment offers a complete range of mining equipment and mineral processing solutions',
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
    pageName: 'Products and Services - Zexin Mining Equipment',
    description: 'Zexin Mining Equipment offers a full range of efficient and intelligent mining solutions, including mineral processing equipment and mining EPC services, to meet your various needs.',
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
          "name": "Mineral Processing Equipment",
          "description": "High-efficiency, advanced mineral processing equipment that integrates innovative technology and professional engineering",
          "image": `${baseUrl}/images/products/mineral-processing-equipment.jpg`,
          "url": `${baseUrl}/${locale}/products/ore-processing`
        }
      },
      {
        "@type": "ListItem",
        "position": 2,
        "item": {
          "@type": "Service",
          "name": "Mining EPC Services",
          "description": "Providing full mining industry chain services (EPCMO), integrating mining technical consulting, design, equipment manufacturing and procurement, engineering construction and operation management",
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