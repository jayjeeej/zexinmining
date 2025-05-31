import { Metadata } from 'next';
import GrindingEquipmentPageClient from './page.client';
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

// 磨矿设备产品数据
const grindingEquipmentProducts = [
  {
    id: 'wet-overflow-ball-mill',
    model: 'ZMQY Series',
    title: {
      zh: '湿式溢流球磨机',
      en: 'Wet Overflow Ball Mill'
    }
  },
  {
    id: 'wet-energy-saving-grid-ball-mill',
    model: 'ZMQG Series',
    title: {
      zh: '湿式节能格子型球磨机',
      en: 'Wet Energy-Saving Grid Ball Mill'
    }
  },
  {
    id: 'wet-rod-mill',
    model: 'MBY Series',
    title: {
      zh: '湿式棒磨机',
      en: 'Wet Rod Mill'
    }
  },
  {
    id: 'wet-grid-ball-mill',
    model: 'ZMGQ Series',
    title: {
      zh: '湿式格子型球磨机',
      en: 'Wet Grid Ball Mill'
    }
  },
  {
    id: 'dry-ball-mill',
    model: 'ZMQ Series',
    title: {
      zh: '干式球磨机',
      en: 'Dry Ball Mill'
    }
  },
  {
    id: 'dry-rod-mill',
    model: 'MBS Series',
    title: {
      zh: '干式棒磨机',
      en: 'Dry Rod Mill'
    }
  }
];

// 产品ID列表
const productIds = grindingEquipmentProducts.map(p => p.id);

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
          let filePath = path.join(process.cwd(), 'public', 'data', locale, 'grinding-equipment', `${id}.json`);
          
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
            const defaultImagePath = `/images/products/grinding-equipment/${id}.jpg`;
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
  
  // 尝试从产品JSON中提取关键词
  const productKeywords = await getProductSeoKeywords(locale, productIds);
  
  // 使用通用分类元数据函数
  return getCategoryMetadata({ 
    categoryId: 'grinding-equipment',
    locale: locale,
    productKeywords: productKeywords || undefined 
  });
}

export default async function GrindingEquipmentPage({ params }: { params: { locale: string } }) {
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
    { name: 'Grinding Equipment' }
  ];
  
  // 准备结构化数据
  // 1. 产品组结构化数据
  const productGroupStructuredData = getProductGroupStructuredData({
    groupName: 'Grinding Equipment',
    groupId: 'grinding-equipment',
    products: grindingEquipmentProducts.map(p => ({
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
    categoryId: 'grinding-equipment',
    categoryName: 'Grinding Equipment',
    description: 'Zexin offers high-efficiency grinding equipment including wet overflow ball mills, energy-saving grid ball mills and rod mills, featuring advanced design and wear-resistant materials for precise particle control and low energy consumption.',
    productCount: productIds.length,
    locale,
    baseUrl
  });
  
  // 5. WebPage结构化数据
  const pageUrl = `${baseUrl}/${locale}/products/ore-processing/grinding-equipment`;
  const webPageStructuredData = getWebPageStructuredData({
    pageUrl: pageUrl,
    pageName: 'Grinding Equipment',
    description: 'Zexin offers high-efficiency grinding equipment including wet overflow ball mills, energy-saving grid ball mills and rod mills, featuring advanced design and wear-resistant materials for precise particle control and low energy consumption.',
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
        id="grinding-equipment-data"
        type="application/json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productsData) }}
      />
      <GrindingEquipmentPageClient locale={locale} initialData={productsData} />
    </>
  );
} 