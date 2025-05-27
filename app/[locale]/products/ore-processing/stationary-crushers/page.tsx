import { Metadata } from 'next';
import StationaryCrushersPageClient from './page.client';
import { getStationaryCrushersMetadata, getProductSeoKeywords } from '@/lib/seo';
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

// 固定式破碎机产品数据
const stationaryCrusherProducts = [
  {
    id: 'hp-cone-crusher',
    model: 'HP Series',
    title: {
      zh: 'HP系列液压圆锥破碎机',
      en: 'HP Series Hydraulic Cone Crusher'
    }
  },
  {
    id: 'cone-crusher',
    model: 'ZYP Series',
    title: {
      zh: '圆锥破碎机',
      en: 'Cone Crusher'
    }
  },
  {
    id: 'jaw-crusher',
    model: 'ZPE Series',
    title: {
      zh: '颚式破碎机',
      en: 'Jaw Crusher'
    }
  },
  {
    id: 'impact-crusher',
    model: 'ZPF Series',
    title: {
      zh: '反击式破碎机',
      en: 'Impact Crusher'
    }
  },
  {
    id: 'hammer-crusher',
    model: 'ZPC Series',
    title: {
      zh: '锤式破碎机',
      en: 'Hammer Crusher'
    }
  },
  {
    id: 'double-roller-crusher',
    model: '2PG Series',
    title: {
      zh: '对辊式破碎机',
      en: 'Double Roller Crusher'
    }
  }
];

// 产品ID列表
const productIds = stationaryCrusherProducts.map(p => p.id);

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
          let filePath = path.join(process.cwd(), 'public', 'data', locale, 'stationary-crushers', `${id}.json`);
          
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
            const defaultImagePath = `/images/products/stationary-crushers/${id}.jpg`;
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
  return getStationaryCrushersMetadata({ locale });
}

export default async function StationaryCrushersPage({ params }: { params: { locale: string } }) {
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
    { name: isZh ? '固定式破碎机' : 'Stationary Crushers' }
  ];
  
  // 准备结构化数据
  // 1. 产品组结构化数据
  const productGroupStructuredData = getProductGroupStructuredData({
    groupName: isZh ? '固定式破碎机' : 'Stationary Crushers',
    groupId: 'stationary-crushers',
    products: stationaryCrusherProducts.map(p => ({
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
    categoryId: 'stationary-crushers',
    categoryName: isZh ? '固定式破碎机' : 'Stationary Crushers',
    description: isZh 
      ? '泽鑫矿山设备提供各种类型的固定式破碎机，包括颚式破碎机、圆锥破碎机、反击式破碎机、锤式破碎机等，用于矿石和岩石的高效破碎' 
      : 'Zexin Mining Equipment offers various types of stationary crushers, including jaw crushers, cone crushers, impact crushers, hammer crushers, etc., for efficient crushing of ores and rocks',
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
        id="stationary-crushers-data"
        type="application/json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productsData) }}
      />
      <StationaryCrushersPageClient locale={locale} initialData={productsData} />
    </>
  );
} 