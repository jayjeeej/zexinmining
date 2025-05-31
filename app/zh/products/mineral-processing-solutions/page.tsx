import { Metadata } from 'next';
import { getOrganizationStructuredData, getMineralProcessingSolutionsStructuredData, getBreadcrumbStructuredData, getWebPageStructuredData, getProductCategoryStructuredData } from '@/lib/structuredData';
import MineralProcessingSolutionsClient from './MineralProcessingSolutionsClient';
import { getBreadcrumbConfig } from '@/lib/navigation';

export const dynamic = 'force-static'; // 强制静态生成
export const revalidate = 3600; // 每小时重新验证一次

// 选矿解决方案页面服务端组件
export default async function MineralProcessingSolutionsPage() {
  // 静态路由下直接指定locale
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
  
  // 页面描述内容
  const pageDescription = '泽鑫提供定制选矿工艺方案，针对金属和非金属矿种优化加工流程，提高回收率，节能环保，实现矿石高值化。';
  
  // 基本结构化数据
  const organizationStructuredData = getOrganizationStructuredData(isZh);
  const solutionsStructuredData = getMineralProcessingSolutionsStructuredData({ locale });
  const breadcrumbStructuredData = getBreadcrumbStructuredData(breadcrumbItems, baseUrl);
  
  // 网页结构化数据
  const pageUrl = `${baseUrl}/${locale}/products/mineral-processing-solutions`;
  const webPageStructuredData = getWebPageStructuredData({
    pageUrl,
    pageName: '矿物加工解决方案 - 定制化选矿工艺流程',
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
    categoryName: '矿物加工解决方案',
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
  const locale = 'zh';
  
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