import { Metadata } from 'next';
import { getCategoryMetadata, getMineralProcessingMetadata } from '@/lib/seo';
import { getOrganizationStructuredData, getProductCategoryStructuredData, getBreadcrumbStructuredData, getWebPageStructuredData } from '@/lib/structuredData';
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
  
  // 预处理设备数据（用于生成结构化数据）
  const preProcessingEquipment = [
    {
      title: "Stationary Crusher",
      description: "High-efficiency ore crushing equipment, including jaw crushers, cone crushers, etc., suitable for various hardness ores.",
      imageSrc: "/images/mineral-processing/stationary-crusher.jpg",
      linkUrl: `/${locale}/products/ore-processing/stationary-crushers`,
    },
    {
      title: "Stationary Vibrating Screen",
      description: "High-precision screening equipment, used for ore classification and separation, ensuring the particle size requirements for subsequent processing.",
      imageSrc: "/images/mineral-processing/vibrating-screen.jpg",
      linkUrl: `/${locale}/products/ore-processing/vibrating-screens`,
    },
    // 其他预处理设备...
  ];
  
  // 分选设备数据（用于生成结构化数据）
  const separationEquipment = [
    {
      title: "Gravity Separation Equipment",
      description: "Adopting advanced jigging technology, suitable for efficient separation of gold, tin, tungsten and other gravity-selected minerals.",
      imageSrc: "/images/mineral-processing/gravity-separator.jpg",
      linkUrl: `/${locale}/products/ore-processing/gravity-separation`,
    },
    {
      title: "Magnetic Separator",
      description: "Professional magnetic separation series including dry and wet magnetic separators, suitable for efficient separation of iron ore, manganese ore, hematite.",
      imageSrc: "/images/mineral-processing/magnetic-separator.jpg",
      linkUrl: `/${locale}/products/ore-processing/magnetic-separator`,
    },
    // 其他分选设备...
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
  
  // 4. 网页结构化数据
  const pageUrl = `${baseUrl}/${locale}/products/ore-processing`;
  const webPageStructuredData = getWebPageStructuredData({
    pageUrl,
    pageName: 'Mineral Processing Equipment - Efficient Mineral Separation & Pre-Treatment Solutions',
    description: 'Zexin provides comprehensive mineral processing equipment and solutions, including crushing, grinding, flotation, magnetic separation, gravity separation, classification, dewatering and other process equipment, achieving efficient mineral separation and optimal recovery rates',
    locale,
    baseUrl,
    images: [
      '/images/mineral-processing/crushing-equipment.jpg',
      '/images/mineral-processing/magnetic-separator.jpg',
      '/images/mineral-processing/gravity-separator.jpg'
    ],
    breadcrumbId: `${pageUrl}#breadcrumb`
  });
  
  // 5. 产品集合结构化数据
  const itemListStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": [
      ...preProcessingEquipment.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": item.title,
          "description": item.description,
          "image": `${baseUrl}${item.imageSrc}`,
          "url": `${baseUrl}${item.linkUrl}`
        }
      })),
      ...separationEquipment.map((item, index) => ({
        "@type": "ListItem",
        "position": index + preProcessingEquipment.length + 1,
        "item": {
          "@type": "Product",
          "name": item.title,
          "description": item.description,
          "image": `${baseUrl}${item.imageSrc}`,
          "url": `${baseUrl}${item.linkUrl}`
        }
      }))
    ]
  };
  
  return (
    <>
      {/* 使用独立script标签注入各结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
      />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categoryStructuredData) }}
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListStructuredData) }}
      />
      
      {/* 客户端组件 - 不再传递locale参数 */}
      <OreProcessingPageClient />
    </>
  );
} 