import { Metadata } from 'next';
import FlotationEquipmentPageClient from './page.client';
import { getCategoryMetadata, getProductSeoKeywords } from '@/lib/seo';
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

// 浮选设备产品数据
const flotationEquipmentProducts = [
  {
    id: 'pneumatic-flotation-cell',
    model: 'FXJ Series',
    title: {
      zh: '气动浮选机',
      en: 'Pneumatic Flotation Cell'
    }
  },
  {
    id: 'self-aspirated-flotation-cell',
    model: 'KYF Series',
    title: {
      zh: '自吸式浮选机',
      en: 'Self-Aspirated Flotation Cell'
    }
  },
  {
    id: 'coarse-flotation-cell',
    model: 'CLF Series',
    title: {
      zh: '粗颗粒浮选机',
      en: 'Coarse Flotation Cell'
    }
  },
  {
    id: 'xfc-air-inflation-flotation-cell',
    model: 'XCF Series',
    title: {
      zh: 'XFC充气式浮选机',
      en: 'XFC Air Inflation Flotation Cell'
    }
  }
];

// 产品ID列表
const productIds = flotationEquipmentProducts.map(p => p.id);

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
          let filePath = path.join(process.cwd(), 'public', 'data', locale, 'flotation-equipment', `${id}.json`);
          
          // 检查文件是否存在
          if (!fs.existsSync(filePath)) {
            // 尝试备用子目录
            filePath = path.join(process.cwd(), 'public', 'data', locale, 'flotation', `${id}.json`);
            
            if (!fs.existsSync(filePath)) {
              // 尝试从根目录加载
              filePath = path.join(process.cwd(), 'public', 'data', locale, `${id}.json`);
              
              if (!fs.existsSync(filePath)) {
            return null;
              }
            }
          }
          
          // 读取文件内容
          const fileContent = fs.readFileSync(filePath, 'utf8');
          const data = JSON.parse(fileContent);
          
          // 确保imageSrc存在，没有则添加默认图片路径
          if (!data.imageSrc) {
            const defaultImagePath = `/images/products/flotation-equipment/${id}.jpg`;
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
    categoryId: 'flotation-equipment',
    locale: locale,
    productKeywords: productKeywords || undefined 
  });
}

export default async function FlotationEquipmentPage({ params }: { params: { locale: string } }) {
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
    { name: 'Flotation Equipment' }
  ];
  
  // 准备结构化数据
  // 1. 产品组结构化数据
  const productGroupStructuredData = getProductGroupStructuredData({
    groupName: 'Flotation Equipment',
    groupId: 'flotation-equipment',
    products: flotationEquipmentProducts.map(p => ({
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
    categoryId: 'flotation-equipment',
    categoryName: 'Flotation Equipment',
    description: 'Zexin Mining Equipment offers efficient flotation equipment including pneumatic flotation cells, self-aspirated flotation cells, coarse flotation cells and air inflation flotation cells for non-ferrous, precious and non-metallic mineral separation',
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
        id="flotation-equipment-data"
        type="application/json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productsData) }}
      />
      <FlotationEquipmentPageClient locale={locale} initialData={productsData} />
    </>
  );
} 