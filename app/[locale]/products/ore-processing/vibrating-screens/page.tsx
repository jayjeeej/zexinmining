import { Metadata } from 'next';
import VibratingScreensPageClient from './page.client';
import { getVibratingScreensMetadata } from '@/lib/seo';
import { 
  getProductGroupStructuredData, 
  getOrganizationStructuredData, 
  getBreadcrumbStructuredData,
  getProductCategoryStructuredData
} from '@/lib/structuredData';
import { MultiStructuredData } from '@/components/StructuredData';
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
  // 等待params解析完成
  const resolvedParams = await Promise.resolve(params);
  const locale = resolvedParams.locale;
  return getVibratingScreensMetadata({ locale });
}

export default async function VibratingScreensPage({ params }: { params: { locale: string } }) {
  // 等待params解析完成
  const resolvedParams = await Promise.resolve(params);
  const locale = resolvedParams.locale;
  
  // 如果没有locale，使用默认值
  if (!locale) {
    return <div>Error loading content</div>;
  }
  
  // 直接从文件系统读取产品数据
  const productsData = await fetchProductsDataDirect(locale);
  
  const isZh = locale === 'zh';
  const baseUrl = 'https://zexinmining.com';
  
  // 面包屑配置
  const breadcrumbConfig = getBreadcrumbConfig(locale);
  const breadcrumbItems = [
    { name: breadcrumbConfig.home.name, url: breadcrumbConfig.home.href },
    { name: breadcrumbConfig.products.name, url: breadcrumbConfig.products.href },
    { name: isZh ? '选矿设备' : 'Ore Processing Equipment', url: '/products/ore-processing' },
    { name: isZh ? '振动筛设备' : 'Vibrating Screen Equipment' }
  ];
  
  // 准备结构化数据
  // 1. 产品组结构化数据
  const productGroupStructuredData = getProductGroupStructuredData({
    groupName: isZh ? '固定式振动筛' : 'Stationary Vibrating Screens',
    groupId: 'vibrating-screens',
    products: vibratingScreenProducts.map(p => ({
      id: p.id,
      model: p.model,
      title: locale === 'zh' ? p.title.zh : p.title.en
    })),
    locale: locale
  });
  
  // 2. 组织结构化数据
  const organizationStructuredData = getOrganizationStructuredData(isZh);
  
  // 3. 面包屑结构化数据
  const breadcrumbStructuredData = getBreadcrumbStructuredData(breadcrumbItems, baseUrl);
  
  // 4. 产品类别结构化数据
  const categoryStructuredData = getProductCategoryStructuredData({
    categoryId: 'vibrating-screens',
    categoryName: isZh ? '振动筛设备' : 'Vibrating Screen Equipment',
    description: isZh 
      ? '泽鑫矿山设备提供高效振动筛设备，包括香蕉筛、直线振动筛、圆振动筛、脱水筛等系列产品，满足各种筛分需求' 
      : 'Zexin Mining Equipment offers efficient vibrating screen equipment, including banana screens, linear vibrating screens, circular vibrating screens, dewatering screens and other series products to meet various screening requirements',
    productCount: productIds.length,
    locale,
    baseUrl
  });
  
  // 组合所有结构化数据
  const structuredDataArray = [
    productGroupStructuredData,
    organizationStructuredData,
    breadcrumbStructuredData,
    categoryStructuredData
  ];

  return (
    <>
      {/* 使用MultiStructuredData组件注入结构化数据 */}
      <MultiStructuredData dataArray={structuredDataArray} />
      
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