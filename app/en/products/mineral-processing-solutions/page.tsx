import { Metadata } from 'next';
import { getOrganizationStructuredData, getMineralProcessingSolutionsStructuredData, getBreadcrumbStructuredData, getWebPageStructuredData, getProductCategoryStructuredData } from '@/lib/structuredData';
import MineralProcessingSolutionsClient from './MineralProcessingSolutionsClient';
import { getBreadcrumbConfig } from '@/lib/navigation';

export const dynamic = 'force-static'; // 强制静态生成
export const revalidate = 3600; // 每小时重新验证一次

// 选矿解决方案页面服务端组件
export default async function MineralProcessingSolutionsPage() {
  // 静态路由下直接指定locale
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
  
  // 页面描述内容
  const pageDescription = 'Tailored mineral processing solutions for precious, non-ferrous, ferrous and non-metallic ores. Our optimized beneficiation processes maximize recovery rates while reducing energy consumption and environmental impact.';
  
  // 基本结构化数据
  const organizationStructuredData = getOrganizationStructuredData(isZh);
  const solutionsStructuredData = getMineralProcessingSolutionsStructuredData({ locale });
  const breadcrumbStructuredData = getBreadcrumbStructuredData(breadcrumbItems, baseUrl);
  
  // 网页结构化数据
  const pageUrl = `${baseUrl}/${locale}/products/mineral-processing-solutions`;
  const webPageStructuredData = getWebPageStructuredData({
    pageUrl,
    pageName: 'Mineral Processing Solutions - Customized Beneficiation Processes',
    description: pageDescription,
    locale,
    baseUrl,
    images: [
      '/images/products/mineral-processing-solutions/mineral-plant.jpg',
      '/images/products/mineral-processing-solutions/precious-metals.jpg',
      '/images/products/mineral-processing-solutions/non-ferrous-metals.jpg',
      '/images/products/mineral-processing-solutions/ferrous-metals.jpg'
    ],
    breadcrumbId: `${pageUrl}#breadcrumb`
  });
  
  // 产品类别结构化数据 - 补充页面上展示的矿物类别信息
  const productCategoryStructuredData = getProductCategoryStructuredData({
    categoryId: 'mineral-processing-solutions',
    categoryName: 'Mineral Processing Solutions',
    description: pageDescription,
    productCount: 4, // 页面上展示的4个主要矿物类别
    locale,
    baseUrl
  });
  
  return (
    <>
      {/* 使用独立script标签注入各结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
      />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(solutionsStructuredData) }}
      />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageStructuredData) }}
      />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productCategoryStructuredData) }}
      />
      
      {/* 客户端组件 - 不再传递locale参数 */}
      <MineralProcessingSolutionsClient />
    </>
  );
}

// 生成页面元数据
export async function generateMetadata(): Promise<Metadata> {
  // 静态路由下直接指定locale
  const locale = 'en';
  
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