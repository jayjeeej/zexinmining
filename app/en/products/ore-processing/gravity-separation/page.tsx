import { Metadata } from 'next';
import GravitySeparationPageClient from './page.client';
import { getGravitySeparationMetadata } from '@/lib/seo';
import { 
  getProductGroupStructuredData, 
  getOrganizationStructuredData, 
  getBreadcrumbStructuredData,
  getProductCategoryStructuredData,
  getWebPageStructuredData
} from '@/lib/structuredData';
import { getBreadcrumbConfig } from '@/lib/navigation';
import fs from 'fs';
import path from 'path';

// 重选设备产品数据
const gravityProducts = [
  {
    id: 'spiral-chute',
    model: 'SL Series',
    title: {
      zh: '螺旋溜槽',
      en: 'Spiral Chute'
    }
  },
  {
    id: 'jig-machine',
    model: 'JT Series',
    title: {
      zh: '跳汰机',
      en: 'Jig Machine'
    }
  },
  {
    id: 'shaking-table',
    model: 'ST Series',
    title: {
      zh: '摇床',
      en: 'Shaking Table'
    }
  },
  {
    id: 'centrifugal-concentrator',
    model: 'CC Series',
    title: {
      zh: '离心选矿机',
      en: 'Centrifugal Concentrator'
    }
  },
  {
    id: 'synchronous-counter-directional-jig',
    model: 'SCDJM Series',
    title: {
      zh: '同步逆向跳汰机',
      en: 'Synchronous Counter-Directional Jig'
    }
  },
  {
    id: 'synchronous-counter-directional-jig-small',
    model: 'SCDJM-2 Series',
    title: {
      zh: '小型同步逆向跳汰机',
      en: 'Small Synchronous Counter-Directional Jig'
    }
  },
  {
    id: 'sawtooth-wave-jig',
    model: 'STWJ Series',
    title: {
      zh: '锯齿波跳汰机',
      en: 'Sawtooth Wave Jig'
    }
  }
];

// 产品ID列表
const productIds = [
  'spiral-chute',
  'shaking-table',
  'centrifugal-separator', 
  'synchronous-counter-directional-jig',
  'synchronous-counter-directional-jig-small',
  'sawtooth-wave-jig'
];

// 配置静态生成和重新验证时间
export const dynamic = 'force-static';
export const revalidate = 3600; // 每小时重新验证一次
export const fetchCache = 'force-cache'; // 强制使用缓存
export const runtime = 'nodejs'; // 使用Node.js运行时提高性能
export const preferredRegion = 'auto'; // 自动选择最佳区域

// 静态生成路径参数
export function generateStaticParams() {
  return [
    { locale: 'zh' },
    { locale: 'en' }
  ];
}

// 直接从文件系统读取产品数据，避免网络请求
async function fetchProductsDataDirect(locale: string) {
  try {
    // 并行处理所有产品数据
    const results = await Promise.all(
      productIds.map(async (id) => {
        try {
          // 首先尝试从子目录加载数据
          let filePath = path.join(process.cwd(), 'public', 'data', locale, 'gravity-separation', `${id}.json`);
          
          // 检查文件是否存在
          if (!fs.existsSync(filePath)) {
            // 尝试从根目录加载
            filePath = path.join(process.cwd(), 'public', 'data', locale, `${id}.json`);
            
            if (!fs.existsSync(filePath)) {
              return null;
            }
          }
          
          // 读取文件内容
          const fileContent = fs.readFileSync(filePath, 'utf8');
          const data = JSON.parse(fileContent);
          
          // 确保imageSrc存在，没有则添加默认图片路径
          if (!data.imageSrc) {
            data.imageSrc = `/images/products/gravity-separation/${id}.jpg`;
          }
          
          return data;
        } catch (err) {
          return null;
        }
      })
    );
    
    return results.filter(p => p !== null);
  } catch (error) {
    return [];
  }
}

// 生成元数据
export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  // 静态路由下直接指定locale而不是从params获取
  const locale = 'en';
  
  return getGravitySeparationMetadata({ locale: locale });
}

export default async function GravitySeparationPage({ params }: { params: { locale: string } }) {
  // 静态路由下直接指定locale而不是从params获取
  // (在/en/目录下，不需要从params获取，直接使用'en')
  const locale = 'en';
  
  // 直接从文件系统读取产品数据
  const productsData = await fetchProductsDataDirect(locale);
  
  const isZh = false; // 英文页面
  const baseUrl = 'https://www.zexinmining.com';
  
  // 面包屑配置
  const breadcrumbConfig = getBreadcrumbConfig(locale);
  const breadcrumbItems = [
    { name: breadcrumbConfig.home.name, href: `/${locale}` },
    { name: breadcrumbConfig.products.name, href: `/${locale}/products` },
    { name: 'Ore Processing Equipment', href: `/${locale}/products/ore-processing` },
    { name: 'Gravity Separation Equipment' }
  ];
  
  // 准备结构化数据
  // 1. 产品组结构化数据
  const productGroupStructuredData = getProductGroupStructuredData({
    groupName: 'Gravity Separation Equipment',
    groupId: 'gravity-separation',
    products: gravityProducts.map(p => ({
      id: p.id,
      model: p.model,
      title: p.title.en
    })),
    locale: locale
  });
  
  // 2. 组织结构化数据
  const organizationStructuredData = getOrganizationStructuredData(isZh);
  
  // 3. 面包屑结构化数据
  const breadcrumbStructuredData = getBreadcrumbStructuredData(
    breadcrumbItems.map(item => ({ 
      name: item.name, 
      url: item.href 
    })),
    baseUrl
  );
  
  // 4. 产品类别结构化数据
  const categoryStructuredData = getProductCategoryStructuredData({
    categoryId: 'gravity-separation',
    categoryName: 'Gravity Separation Equipment',
    description: 'Zexin Mining Equipment offers efficient gravity separation equipment including jig machines, shaking tables, spiral chutes and centrifugal concentrators for precise separation based on mineral density differences',
    productCount: productIds.length,
    locale,
    baseUrl
  });
  
  // 5. 增强产品组结构化数据
  const enhancedProductGroupStructuredData = {
    "@context": "https://schema.org",
    "@type": "ProductGroup",
    "name": "Zexin Gravity Separation Equipment Series",
    "description": "Zexin gravity separation equipment series includes various models of spiral chutes, jig machines, shaking tables and centrifugal concentrators, offering comprehensive gravity separation solutions",
    "url": `${baseUrl}/${locale}/products/ore-processing/gravity-separation`,
    "category": "Mineral Processing Equipment/Gravity Separation Equipment",
    "brand": {
      "@type": "Brand",
      "name": "Zexin Mining Equipment"
    },
    "manufacturer": {
      "@type": "Organization",
      "name": "Zexin Mining Equipment Co., Ltd.",
      "url": baseUrl
    },
    "keywords": "gravity separation equipment,spiral chute,jig machine,shaking table,centrifugal concentrator,gold ore processing,tin ore processing,tungsten ore processing",
    "offers": {
      "@type": "AggregateOffer",
      "highPrice": "100000",
      "lowPrice": "10000",
      "priceCurrency": "USD",
      "offerCount": gravityProducts.length,
      "availability": "https://schema.org/InStock"
    },
    "hasVariant": gravityProducts.map(p => ({
      "@type": "Product",
      "name": p.title.en,
      "model": p.model,
      "productID": p.id,
      "url": `${baseUrl}/${locale}/products/ore-processing/gravity-separation/${p.id}`
    }))
  };
  
  // 6. WebPage结构化数据
  const pageUrl = `${baseUrl}/${locale}/products/ore-processing/gravity-separation`;
  const webPageStructuredData = getWebPageStructuredData({
    pageUrl: pageUrl,
    pageName: 'Gravity Separation Equipment',
    description: 'Zexin Mining Equipment offers efficient gravity separation equipment including jig machines, shaking tables, spiral chutes and centrifugal concentrators for precise separation based on mineral density differences',
    locale: locale,
    baseUrl: baseUrl,
    breadcrumbId: null
  });

  return (
    <>
      {/* 使用独立script标签注入各结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productGroupStructuredData) }}
      />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
      />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categoryStructuredData) }}
      />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(enhancedProductGroupStructuredData) }}
      />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageStructuredData) }}
      />
      
      {/* 将数据预先嵌入页面，避免客户端重新获取 */}
      <script
        id="gravity-separation-data"
        type="application/json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productsData) }}
      />
      <GravitySeparationPageClient locale={locale} initialData={productsData} />
    </>
  );
}