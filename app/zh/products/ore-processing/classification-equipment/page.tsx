import { Metadata } from 'next';
import ClassificationEquipmentPageClient from './page.client';
import { getClassificationEquipmentMetadata, getProductSeoKeywords } from '@/lib/seo';
import { 
  getProductGroupStructuredData, 
  getOrganizationStructuredData, 
  getBreadcrumbStructuredData,
  getProductCategoryStructuredData
} from '@/lib/structuredData';
import { MultiStructuredData } from '@/components/StructuredData';
import { getBreadcrumbConfig } from '@/lib/navigation';
import{ getCategoryMetadata } from '@/lib/seo';
import fs from 'fs';
import path from 'path';

// 分级设备产品数据
const classificationEquipmentProducts = [
  {
    id: 'cone-classifier',
    model: 'FD Series',
    title: {
      zh: '选矿分泥斗',
      en: 'Cone Classifier'
    }
  },
  {
    id: 'high-weir-spiral-classifier',
    model: 'FLG/2FLG Series',
    title: {
      zh: '高堰式螺旋分级机',
      en: 'High Weir Spiral Classifier'
    }
  },
  {
    id: 'submerged-spiral-classifier',
    model: 'FLC/2FLC Series',
    title: {
      zh: '沉没式螺旋分级机',
      en: 'Submerged Spiral Classifier'
    }
  },
  {
    id: 'hydrocyclone-separator',
    model: 'FX Series',
    title: {
      zh: '矿山水力旋流器分离器',
      en: 'Mining Hydrocyclone Separator'
    }
  }
];

// 产品ID列表
const productIds = classificationEquipmentProducts.map(p => p.id);

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
          let filePath = path.join(process.cwd(), 'public', 'data', locale, 'classification-equipment', `${id}.json`);
          
          // 检查文件是否存在
          if (!fs.existsSync(filePath)) {
            // 尝试从根目录加载
            filePath = path.join(process.cwd(), 'public', 'data', locale, `${id}.json`);
            
            if (!fs.existsSync(filePath)) {
              // 如果找不到文件，创建一个基本数据对象
              const fallbackTitle = classificationEquipmentProducts.find(p => p.id === id)?.title;
              return {
                id: id,
                title: locale === 'zh' ? fallbackTitle?.zh || id : fallbackTitle?.en || id,
                imageSrc: `/images/products/classification-equipment/${id}.jpg`,
                productCategory: locale === 'zh' ? '分级设备' : 'Classification Equipment',
                href: `/${locale}/products/ore-processing/classification-equipment/${id}`,
                meta: []
              };
            }
          }
          
          // 读取文件内容
          const fileContent = fs.readFileSync(filePath, 'utf8');
          
          try {
          const data = JSON.parse(fileContent);
          
          // 确保imageSrc存在，没有则添加默认图片路径
          if (!data.imageSrc) {
            const defaultImagePath = `/images/products/classification-equipment/${id}.jpg`;
            data.imageSrc = defaultImagePath;
          }
          
          return data;
          } catch (jsonError) {
            return null;
          }
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
  return getClassificationEquipmentMetadata({ locale });
}

export default async function ClassificationEquipmentPage({ params }: { params: { locale: string } }) {
  // 静态路由下直接指定locale而不是从params获取
  // (在/zh/目录下，不需要从params获取，直接使用'zh')
  const locale = 'zh';
  
  // 直接从文件系统读取产品数据
  try {
  const productsData = await fetchProductsDataDirect(locale);
  
  const isZh = locale === 'zh';
  const baseUrl = 'https://www.zexinmining.com';
  
  // 面包屑配置
  const breadcrumbConfig = getBreadcrumbConfig(locale);
  const breadcrumbItems = [
      { name: breadcrumbConfig.home.name, href: `/${locale}` },
      { name: breadcrumbConfig.products.name, href: `/${locale}/products` },
      { name: isZh ? '选矿设备' : 'Ore Processing Equipment', href: `/${locale}/products/ore-processing` },
    { name: isZh ? '分级设备' : 'Classification Equipment' }
  ];
  
  // 准备结构化数据
  // 1. 产品组结构化数据
  const productGroupStructuredData = getProductGroupStructuredData({
    groupName: isZh ? '分级设备' : 'Classification Equipment',
    groupId: 'classification-equipment',
    products: classificationEquipmentProducts.map(p => ({
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
    categoryId: 'classification-equipment',
    categoryName: isZh ? '分级设备' : 'Classification Equipment',
    description: isZh 
      ? '泽鑫矿山设备提供高性能分级设备，包括螺旋分级机、水力旋流器和分泥斗等，用于根据颗粒大小和密度对矿物进行精确分级' 
      : 'Zexin Mining Equipment offers high-performance classification equipment including spiral classifiers, hydrocyclones, and cone classifiers for precise mineral classification by particle size and density',
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
        id="classification-equipment-data"
        type="application/json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productsData) }}
      />
      <ClassificationEquipmentPageClient locale={locale} initialData={productsData} />
    </>
  );
  } catch (error) {
    // 出错时返回基本错误页面
    return (
      <div style={{padding: '20px', fontFamily: 'system-ui'}}>
        <h1>Error loading content</h1>
        <p>There was an error loading the content. Please try again later.</p>
      </div>
    );
  }
} 