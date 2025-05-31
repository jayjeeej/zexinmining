import { Metadata } from 'next';
import FeedingEquipmentPageClient from './page.client';
import { getFeedingEquipmentMetadata } from '@/lib/seo';
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

// 给料设备产品数据
const feedingEquipmentProducts = [
  {
    id: 'vibratory-feeder',
    model: 'ZG Series',
    title: {
      zh: '矿用振动给料机',
      en: 'Mining Vibratory Feeder'
    }
  },
  {
    id: 'apron-feeder',
    model: 'GBH Series',
    title: {
      zh: '重型板式给料机',
      en: 'Heavy Duty Apron Feeder'
    }
  },
  {
    id: 'grizzly-feeder',
    model: 'VF Series',
    title: {
      zh: '棒条振动给料机',
      en: 'Vibrating Grizzly Feeder'
    }
  }
];

// 产品ID列表
const productIds = feedingEquipmentProducts.map(p => p.id);

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
          let filePath = path.join(process.cwd(), 'public', 'data', locale, 'feeding-equipment', `${id}.json`);
          
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
            const defaultImagePath = `/images/products/feeding-equipment/${id}.jpg`;
            data.imageSrc = defaultImagePath;
          }
          
          return data;
        } catch (err) {
          return null;
        }
      })
    );
    
    const validResults = results.filter(p => p !== null);
    return validResults;
  } catch (error) {
    return [];
  }
}

// 生成元数据
export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  // 静态路由下直接指定locale而不是从params获取
  const locale = 'zh';
  
  return getFeedingEquipmentMetadata({ locale });
}

export default async function FeedingEquipmentPage({ params }: { params: { locale: string } }) {
  // 静态路由下直接指定locale而不是从params获取
  // (在/zh/目录下，不需要从params获取，直接使用'zh')
  const locale = 'zh';
  
  // 直接从文件系统读取产品数据
  const productsData = await fetchProductsDataDirect(locale);
  
  const isZh = locale === 'zh';
  const baseUrl = 'https://www.zexinmining.com';
  
  // 面包屑配置
  const breadcrumbConfig = getBreadcrumbConfig(locale);
  const breadcrumbItems = [
    { name: breadcrumbConfig.home.name, href: `/${locale}` },
    { name: breadcrumbConfig.products.name, href: `/${locale}/products` },
    { name: isZh ? '选矿设备' : 'Ore Processing Equipment', href: `/${locale}/products/ore-processing` },
    { name: isZh ? '给料设备' : 'Feeding Equipment' }
  ];
  
  // 准备结构化数据
  // 1. 产品组结构化数据
  const productGroupStructuredData = getProductGroupStructuredData({
    groupName: isZh ? '给料设备' : 'Feeding Equipment',
    groupId: 'feeding-equipment',
    products: feedingEquipmentProducts.map(p => ({
      id: p.id,
      model: p.model,
      title: locale === 'zh' ? p.title.zh : p.title.en
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
    categoryId: 'feeding-equipment',
    categoryName: isZh ? '给料设备' : 'Feeding Equipment',
    description: isZh 
      ? '泽鑫给料设备包括振动给料机、板式给料机、带式给料机等，精确流量控制，耐磨结构设计，应用于采矿、建材行业，提高生产效率，降低物料损耗，延长设备使用寿命。' 
      : 'Zexin Mining Equipment offers reliable feeding solutions including vibrating feeders, electromagnetic feeders, mechanical feeders, plate feeders and more, ensuring stable and efficient material feeding for mineral processing lines',
    productCount: productIds.length,
    locale,
    baseUrl
  });
  
  // 5. WebPage结构化数据
  const pageUrl = `${baseUrl}/${locale}/products/ore-processing/feeding-equipment`;
  const webPageStructuredData = getWebPageStructuredData({
    pageUrl: pageUrl,
    pageName: isZh ? '给料设备' : 'Feeding Equipment',
    description: isZh 
      ? '泽鑫给料设备包括振动给料机、板式给料机、带式给料机等，精确流量控制，耐磨结构设计，应用于采矿、建材行业，提高生产效率，降低物料损耗，延长设备使用寿命。' 
      : 'Zexin Mining Equipment offers reliable feeding solutions including vibrating feeders, electromagnetic feeders, mechanical feeders, plate feeders and more, ensuring stable and efficient material feeding for mineral processing lines',
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageStructuredData) }}
      />
      
      {/* 将数据预先嵌入页面，避免客户端重新获取 */}
      <script
        id="feeding-equipment-data"
        type="application/json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productsData) }}
      />
      <FeedingEquipmentPageClient locale={locale} initialData={productsData} />
    </>
  );
} 
