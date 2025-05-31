import { Metadata } from 'next';
import { getCategoryMetadata, getMineralProcessingMetadata } from '@/lib/seo';
import { getOrganizationStructuredData, getProductCategoryStructuredData, getBreadcrumbStructuredData, getWebPageStructuredData } from '@/lib/structuredData';
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
  
  // 预处理设备数据（用于生成结构化数据）
  const preProcessingEquipment = [
    {
      title: "固定式破碎机",
      description: "高效率的矿石破碎设备，包括颚式破碎机、圆锥破碎机等，适用于各种硬度矿石。",
      imageSrc: "/images/mineral-processing/stationary-crusher.jpg",
      linkUrl: `/${locale}/products/ore-processing/stationary-crushers`,
    },
    {
      title: "固定式振动筛",
      description: "高精度筛分设备，用于矿石的分级和分选，确保后续加工的粒度要求。",
      imageSrc: "/images/mineral-processing/vibrating-screen.jpg",
      linkUrl: `/${locale}/products/ore-processing/vibrating-screens`,
    },
    // 其他预处理设备...
  ];
  
  // 分选设备数据（用于生成结构化数据）
  const separationEquipment = [
    {
      title: "重力选矿设备",
      description: "采用先进的跳汰技术，适用于金、锡、钨等重选矿物的高效分选。",
      imageSrc: "/images/mineral-processing/gravity-separator.jpg",
      linkUrl: `/${locale}/products/ore-processing/gravity-separation`,
    },
    {
      title: "磁选设备",
      description: "专业磁选设备系列，包括干式和湿式磁选机，适用于铁矿、锰矿、赤铁矿等各类磁性矿物的高效分选。",
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
    categoryName: '选矿设备',
    description: '泽鑫矿山设备提供全方位选矿设备与解决方案，包括破碎、磨矿、分级、选别、脱水等系列设备，高效处理各类矿石',
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
    pageName: '选矿设备 - 高效矿物分选与预处理解决方案',
    description: '泽鑫提供全方位选矿设备与解决方案，包括破碎、磨矿、浮选、磁选、重选、分级、脱水等工艺设备，实现矿物资源的高效分选和最优回收率',
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