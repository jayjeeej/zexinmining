import { Metadata } from 'next';
import VibratingScreensPageClient from './page.client';
import { getVibratingScreensMetadata } from '@/lib/seo';
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

// 振动筛产品数据
const vibratingScreenProducts = [
  {
    id: 'banana-multislope-vibrating-screen',
    model: 'MSBS Series',
    title: {
      zh: '香蕉振动筛',
      en: 'Banana Multi-slope Vibrating Screen'
    }
  },
  {
    id: 'trommel-screen',
    model: '"GT Series',
    title: {
      zh: '滚筒筛',
      en: 'trommel screen'
    }
  },
  {
    id: 'inclined-vibrating-screen',
    model: 'ZSG Series',
    title: {
      zh: '圆振动筛',
      en: 'Inclined Vibrating Screen'
    }
  },
  {
    id: 'dewatering-screen',
    model: 'ZDWS Series',
    title: {
      zh: '脱水筛',
      en: 'Dewatering Screen'
    }
  },
  {
    id: 'bar-vibrating-screen',
    model: 'ZGS Series',
    title: {
      zh: '棒条筛振动筛',
      en: 'Grizzly Screen'
    }
  },
  {
    id: 'linear-vibrating-screen',
    model: 'ZDS/ZKR Series',
    title: {
      zh: '直线振动筛',
      en: 'Linear Vibrating Screen'
    }
  }
];

// 产品ID列表 - 与public/data目录中实际存在的文件匹配
const productIds = [
  "banana-multislope-vibrating-screen",
  "inclined-vibrating-screen",
  "bar-vibrating-screen",
  "trommel-screen",
  "dewatering-screen",
  "linear-vibrating-screen",
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
          let filePath = path.join(process.cwd(), 'public', 'data', locale, 'vibrating-screens', `${id}.json`);
          
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
            const defaultImagePath = `/images/products/vibrating-screens/${id}.jpg`;
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
  const locale = 'en';
  return getVibratingScreensMetadata({ locale });
}

export default async function VibratingScreensPage({ params }: { params: { locale: string } }) {
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
    { name: 'Vibrating Screen Equipment' }
  ];
  
  // 准备结构化数据
  // 1. 产品组结构化数据
  const productGroupStructuredData = getProductGroupStructuredData({
    groupName: 'Stationary Vibrating Screens',
    groupId: 'vibrating-screens',
    products: vibratingScreenProducts.map(p => ({
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
  const categoryDescription = 'Zexin vibrating screens: linear screens, banana screens, dewatering screens & high-frequency screens with multi-deck design. High precision, easy maintenance for efficient classification of minerals, aggregates & coal.';

  const categoryStructuredData = getProductCategoryStructuredData({
    categoryId: 'vibrating-screens',
    categoryName: 'Vibrating Screen Equipment',
    description: categoryDescription,
    productCount: productIds.length,
    locale,
    baseUrl
  });
  
  // 5. WebPage结构化数据
  const pageUrl = `${baseUrl}/${locale}/products/ore-processing/vibrating-screens`;
  const webPageStructuredData = getWebPageStructuredData({
    pageUrl: pageUrl,
    pageName: 'Vibrating Screens - Linear, Banana & High-frequency Series | Zexin Mining',
    description: categoryDescription,
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
        id="vibrating-screens-data"
        type="application/json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productsData) }}
      />
      <VibratingScreensPageClient locale={locale} initialData={productsData} />
    </>
  );
} 