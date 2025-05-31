import { Metadata } from 'next';
import WashingEquipmentPageClient from './page.client';
import { getCategoryMetadata, getProductSeoKeywords } from '@/lib/seo';
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

// 洗矿设备产品数据
const washingEquipmentProducts = [
  {
    id: 'spiral-washer',
    model: 'FG Series',
    title: {
      zh: '单轴螺旋洗矿机',
      en: 'Single Shaft Screw Washer'
    }
  },
  {
    id: 'twin-shaft-log-washer',
    model: 'ZX Series',
    title: {
      zh: '双轴洗矿机',
      en: 'Twin Shaft Log Washer'
    }
  },
  {
    id: 'wheel-bucket-sand-washer',
    model: 'XS Series',
    title: {
      zh: '轮斗式洗砂机',
      en: 'Wheel Bucket Sand Washer'
    }
  },
  
  // 以下产品没有对应的JSON文件，暂时注释掉
  /*
  {
    id: 'double-spiral-washer',
    model: 'FGX Series',
    title: {
      zh: '双螺旋洗矿机',
      en: 'Double Spiral Washer'
    }
  },
  {
    id: 'drum-washer',
    model: 'GXT Series',
    title: {
      zh: '滚筒洗矿机',
      en: 'Drum Washer'
    }
  },
  {
    id: 'log-washer',
    model: 'LX Series',
    title: {
      zh: '洗矿槽',
      en: 'Log Washer'
    }
  }
  */
];

// 产品ID列表
const productIds = washingEquipmentProducts.map(p => p.id);

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
          let filePath = path.join(process.cwd(), 'public', 'data', locale, 'washing-equipment', `${id}.json`);
          
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
            const defaultImagePath = `/images/products/washing-equipment/${id}.jpg`;
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
export async function generateMetadata(): Promise<Metadata> {
  const locale = 'zh';
  try {
    const productKeywords = await getProductSeoKeywords(locale, productIds);
    // 使用通用分类元数据函数
    return getCategoryMetadata({ 
      categoryId: 'washing-equipment',
      locale: locale,
      productKeywords: productKeywords || undefined 
    });
  } catch (error) {
    // 提供默认元数据，避免渲染错误
    const isZh = locale === 'zh';
    return {
      title: isZh ? '洗矿设备 | 泽鑫矿山设备' : 'Washing Equipment | Zexin Mining',
      description: isZh 
        ? '泽鑫矿山设备专业生产各类洗矿设备，包括单轴螺旋洗矿机、双轴洗矿机、双螺旋洗矿机、滚筒洗矿机和洗矿槽等，适用于各种矿石和骨料的清洗工艺。'
        : 'Zexin Mining Equipment specializes in manufacturing various washing equipment including single shaft screw washers, twin shaft log washers, double spiral washers, drum washers and log washers.',
      keywords: isZh
        ? '洗矿设备,螺旋洗矿机,双轴洗矿机,双螺旋洗矿机,滚筒洗矿机,洗矿槽,矿石清洗设备,骨料洗选设备,泽鑫矿山设备'
        : 'washing equipment,screw washer,twin shaft log washer,double spiral washer,drum washer,log washer,mineral washing equipment,aggregate washing equipment,Zexin Mining',
      openGraph: {
        title: isZh ? '洗矿设备 | 泽鑫矿山设备' : 'Washing Equipment | Zexin Mining',
        description: isZh 
          ? '泽鑫矿山设备专业生产各类洗矿设备，适用于各种矿石和骨料的清洗工艺。'
          : 'Zexin Mining Equipment specializes in manufacturing various washing equipment for mineral processing and aggregate production applications.'
      }
    };
  }
}

export default async function WashingEquipmentPage({ params }: { params: { locale: string } }) {
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
    { name: isZh ? '洗矿设备' : 'Washing Equipment' }
  ];
  
  // 准备结构化数据
  // 1. 产品组结构化数据
  const productGroupStructuredData = getProductGroupStructuredData({
    groupName: isZh ? '洗矿设备' : 'Washing Equipment',
    groupId: 'washing-equipment',
    products: washingEquipmentProducts.map(p => ({
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
  const categoryDescription = '泽鑫提供高效洗矿设备，包括螺旋洗矿机、双轴洗矿机和轮斗洗砂机，采用耐磨材料设计，确保高效清洗性能，低水耗节能运行，矿石杂质去除率高，延长下游设备使用寿命。';
  
  const categoryStructuredData = getProductCategoryStructuredData({
    categoryId: 'washing-equipment',
    categoryName: isZh ? '洗矿设备' : 'Washing Equipment',
    description: categoryDescription,
    productCount: productIds.length,
    locale,
    baseUrl
  });
  
  // 5. WebPage结构化数据
  const pageUrl = `${baseUrl}/${locale}/products/ore-processing/washing-equipment`;
  const webPageStructuredData = getWebPageStructuredData({
    pageUrl: pageUrl,
    pageName: isZh ? '洗矿设备' : 'Washing Equipment',
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
        id="washing-equipment-data"
        type="application/json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productsData) }}
      />
      <WashingEquipmentPageClient locale={locale} initialData={productsData} />
    </>
  );
} 