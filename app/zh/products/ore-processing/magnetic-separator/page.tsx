import { Metadata } from 'next';
import MagneticSeparatorPageClient from './page.client';
import { getMagneticSeparatorMetadata } from '@/lib/seo';
import { 
  getProductGroupStructuredData,
  getOrganizationStructuredData,
  getBreadcrumbStructuredData,
  getProductCategoryStructuredData,
  getWebPageStructuredData
} from '@/lib/structuredData';
import fs from 'fs';
import path from 'path';
import { getBreadcrumbConfig } from '@/lib/navigation';

// 磁选设备产品数据
const magneticSeparatorProducts = [
  {
    id: 'permanent-drum-magnetic-separator',
    model: 'CTB Series',
    title: {
      zh: '永磁滚筒磁选机',
      en: 'Permanent Drum Magnetic Separator'
    }
  },
  {
    id: 'wet-high-intensity-magnetic-roll-separator',
    model: 'SLon Series',
    title: {
      zh: '湿式高强度磁辊选机',
      en: 'Wet High-Intensity Magnetic Roll Separator'
    }
  },
  {
    id: 'plate-high-intensity-magnetic-separator',
    model: 'CYG Series',
    title: {
      zh: '平板高强度磁选机',
      en: 'Plate High-Intensity Magnetic Separator'
    }
  },
  {
    id: 'triple-disc-belt-magnetic-separator',
    model: 'CSD Series',
    title: {
      zh: '三盘带式磁选机',
      en: 'Triple-Disc Belt Magnetic Separator'
    }
  },
  {
    id: 'four-roll-high-voltage-electrostatic-separator',
    model: 'HFES Series',
    title: {
      zh: '四辊高压电选机',
      en: 'Four-Roll High-Voltage Electrostatic Separator'
    }
  },
  {
    id: 'double-roll-permanent-magnetic-zircon-separator',
    model: 'CTZ Series',
    title: {
      zh: '双辊永磁锆英磁选机',
      en: 'Double Roll Permanent Magnetic Zircon Separator'
    }
  }
];

// 产品ID列表
const productIds = magneticSeparatorProducts.map(p => p.id);

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
          let filePath = path.join(process.cwd(), 'public', 'data', locale, 'magnetic-separator', `${id}.json`);
          
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
            data.imageSrc = `/images/products/magnetic-separator/${id}.jpg`;
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
  const locale = 'zh';
  return getMagneticSeparatorMetadata({ locale });
}

export default async function MagneticSeparatorPage({ params }: { params: { locale: string } }) {
  // 静态路由下直接指定locale而不是从params获取
  // (在/zh/目录下，不需要从params获取，直接使用'zh')
  const locale = 'zh';
  
  // 直接从文件系统读取产品数据
  const productsData = await fetchProductsDataDirect(locale);
  
  const isZh = true; // 中文页面
  const baseUrl = 'https://www.zexinmining.com';
  
  // 面包屑配置
  const breadcrumbConfig = getBreadcrumbConfig(locale);
  const breadcrumbItems = [
    { name: breadcrumbConfig.home.name, href: `/${locale}` },
    { name: breadcrumbConfig.products.name, href: `/${locale}/products` },
    { name: '选矿设备', href: `/${locale}/products/ore-processing` },
    { name: '磁选机' }
  ];
  
  // 准备结构化数据
  // 1. 产品组结构化数据
  const productGroupStructuredData = getProductGroupStructuredData({
    groupName: '磁选机',
    groupId: 'magnetic-separator',
    products: magneticSeparatorProducts.map(p => ({
      id: p.id,
      model: p.model,
      title: p.title.zh
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
    categoryId: 'magnetic-separator',
    categoryName: '磁选机',
    description: '泽鑫矿山设备提供高性能磁选机系列，包括干式磁选机、湿式磁选机、强磁选机、弱磁选机等，适用于各类磁性矿物的高效分离',
    productCount: productIds.length,
    locale,
    baseUrl
  });
  
  // 5. 网页结构化数据
  const pageUrl = `${baseUrl}/${locale}/products/ore-processing/magnetic-separator`;
  const webPageStructuredData = getWebPageStructuredData({
    pageUrl: pageUrl,
    pageName: '磁选机-永磁滚筒磁选机湿式强磁机干式磁选机 | 泽鑫矿山设备',
    description: '泽鑫提供永磁滚筒磁选机和湿式强磁机，专业铁矿石磁选设备，铁精矿品位65%，磁场可调，节能高效。',
    locale: locale,
    baseUrl: baseUrl,
    images: ['/images/products/ore-processing/magnetic-separator.jpg']
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
        id="magnetic-separator-data"
        type="application/json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productsData) }}
      />
      <MagneticSeparatorPageClient locale={locale} initialData={productsData} />
    </>
  );
} 