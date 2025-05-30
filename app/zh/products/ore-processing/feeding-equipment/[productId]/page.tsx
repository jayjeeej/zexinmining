import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ProductLayout from '@/components/layouts/ProductLayout';
import { getProductData } from '@/lib/api';
import { 
  getProductStructuredData, 
  getBreadcrumbStructuredData, 
  getFAQStructuredData, 
  getImageStructuredData,
  getProductCategoryStructuredData,
  getOrganizationStructuredData
} from '@/lib/structuredData';
import StructuredData, { MultiStructuredData } from '@/components/StructuredData';
import ProductDataInjection from '@/components/ProductDetail/ProductDataInjection';
import ClientFeedingEquipmentDetail from './page.client';
import { ProductSpecification } from '@/lib/productDataSchema';
import fs from 'fs/promises';
import path from 'path';
import { getProductDetailBreadcrumbConfig } from '@/lib/navigation';
import { safelyGetRouteParams } from '@/lib/utils';
// Vercel 优化导出指令
export const dynamic = 'force-static';        // 强制静态生成
export const revalidate = 3600;               // 每小时重新验证一次
export const fetchCache = 'force-cache';      // 强制使用缓存
export const runtime = 'nodejs';              // 使用Node.js运行时
export const preferredRegion = 'auto';        // 自动选择最佳区域


// 获取所有给料设备产品ID用于静态生成
export async function generateStaticParams() {
  try {
    // 从文件系统读取所有产品数据文件
    const dataDir = path.join(process.cwd(), 'public', 'data', 'en', 'feeding-equipment'); // 使用英文给料设备子目录
    
    // 检查目录是否存在
    try {
      await fs.access(dataDir);
    } catch (error) {
      return [
        { locale: 'en', productId: 'vibratory-feeder' },
        { locale: 'zh', productId: 'vibratory-feeder' }
      ];
    }
    
    const files = await fs.readdir(dataDir);
    const productJsonFiles = files.filter(file => file.endsWith('.json'));
    
    // 提取所有给料设备产品ID
    const feedingEquipmentProducts = productJsonFiles.map(file => file.replace('.json', ''));
    
    const locales = ['en', 'zh'];
    
    // 为每个语言和产品ID生成参数
    return feedingEquipmentProducts.flatMap(productId => 
      locales.map(locale => ({
        productId,
        locale
      }))
    );
  } catch (error) {
    // 返回基本的静态参数，确保构建不会失败
    return [
      { locale: 'en', productId: 'vibratory-feeder' },
      { locale: 'zh', productId: 'vibratory-feeder' }
    ];
  }
}

// 生成元数据
export async function generateMetadata({ 
  params 
}: { 
  params: { productId: string; locale: string } 
}): Promise<Metadata> {
  // 静态路由下直接指定locale而不是从params获取
  const locale = 'zh';
  // 确保正确await params
  const safeParams = await safelyGetRouteParams(params);
  const { productId } = safeParams;
  
  // 获取产品数据
  try {
    const { product, isSuccess } = await getProductData(productId, locale);
    if (!isSuccess || !product) return notFoundMetadata('zh');
    
    const isZh = true; // 中文版，固定为true
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.zexinmining.com';
    
    // 构建规范链接URL - 注意这里的路径结构与目录结构一致
    const canonicalUrl = `/${locale}/products/ore-processing/feeding-equipment/${productId}`;
    
    // 优先使用产品数据中的SEO配置
    if (product.seo) {
      return {
        title: product.seo.title || `${product.title} | ${isZh ? '泽鑫矿山设备' : 'Zexin Mining Equipment'}`,
        description: product.seo.description || product.overview,
        keywords: product.seo.keywords || `${product.title},${product.productCategory}`,
        alternates: {
          canonical: canonicalUrl,
          languages: {
            'zh-CN': `/zh/products/ore-processing/feeding-equipment/${productId}`,
            'en-US': `/en/products/ore-processing/feeding-equipment/${productId}`,
          },
        },
        openGraph: {
          title: product.seo.title || product.title,
          description: product.seo.description || product.overview,
          url: `${baseUrl}${canonicalUrl}`,
          siteName: isZh ? '泽鑫矿山设备' : 'Zexin Mining Equipment',
          images: [
            {
              url: `${baseUrl}${product.imageSrc}`,
              width: 1200,
              height: 630,
              alt: product.title,
            },
          ],
          locale: isZh ? 'zh_CN' : 'en_US',
          type: 'website',
        },
      };
    }
    
    // 为SEO描述和关键词提供默认值
    const seoDescription = product.overview || 
                        (isZh 
                          ? `${product.title} - 泽鑫矿山设备提供专业的${product.productCategory}解决方案` 
                          : `${product.title} - Professional ${product.productCategory} solutions by Zexin Mining Equipment`);
    
    const seoKeywords = isZh 
                       ? `${product.title},${product.productCategory},泽鑫矿山设备,矿山设备,给料设备` 
                       : `${product.title},${product.productCategory},Zexin Mining Equipment,mining equipment,feeding equipment`;
    
    // 如果产品数据中存在searchKeywords数组，使用它来增强关键词
    const enhancedKeywords = product.searchKeywords && Array.isArray(product.searchKeywords) 
      ? `${seoKeywords},${product.searchKeywords.join(',')}` 
      : seoKeywords;
    
    return {
      title: `${product.title} | ${isZh ? '泽鑫矿山设备' : 'Zexin Mining Equipment'}`,
      description: seoDescription,
      keywords: enhancedKeywords,
      alternates: {
        canonical: canonicalUrl,
        languages: {
          'zh-CN': `/zh/products/ore-processing/feeding-equipment/${productId}`,
          'en-US': `/en/products/ore-processing/feeding-equipment/${productId}`,
        },
      },
      openGraph: {
        title: product.title,
        description: product.overview || seoDescription,
        url: `${baseUrl}${canonicalUrl}`,
        siteName: isZh ? '泽鑫矿山设备' : 'Zexin Mining Equipment',
        images: [
          {
            url: `${baseUrl}${product.imageSrc}`,
            width: 1200,
            height: 630,
            alt: product.title,
          },
        ],
        locale: isZh ? 'zh_CN' : 'en_US',
        type: 'website',
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return notFoundMetadata('zh');
  }
}

// 404元数据
function notFoundMetadata(locale: string): Metadata {
  const isZh = locale === 'zh';
  return {
    title: isZh ? '产品未找到 | 泽鑫矿山设备' : 'Product Not Found | Zexin Mining Equipment',
    description: isZh ? '抱歉，您请求的产品不存在。' : 'Sorry, the product you requested does not exist.',
  };
}

// 规范化产品ID，确保格式正确
function normalizeProductId(id: string): string {
  // 移除可能的文件扩展名
  if (id.endsWith('.json')) {
    id = id.substring(0, id.length - 5);
  }
  
  // 移除可能的路径前缀
  const lastSlashIndex = id.lastIndexOf('/');
  if (lastSlashIndex !== -1) {
    id = id.substring(lastSlashIndex + 1);
  }
  
  return id;
}

// 获取相关产品数据
async function getRelatedProductsData(relatedIds: string[], locale: string) {
  try {
    const relatedProducts = await Promise.all(
      relatedIds.map(async (productId) => {
        // 规范化产品ID
        const id = normalizeProductId(productId);
        
        try {
          // 根据产品ID判断可能的子类别
          let subcategory = '';
          
          if (id.includes('feeder')) {
            subcategory = 'feeding-equipment';
          } else if (id.includes('mill') || id.includes('grinding')) {
            subcategory = 'grinding-equipment';
          } else if (id.includes('screen')) {
            subcategory = 'vibrating-screens';
          } else if (id.includes('crusher')) {
            subcategory = 'stationary-crushers';
          } else if (id === 'hydrocyclone-separator' || id.includes('classifier')) {
            subcategory = 'classification-equipment';
          } else if (id.includes('magnetic') || (id.includes('separator') && 
              id !== 'hydrocyclone-separator' && 
              !id.includes('centrifugal'))) {
            subcategory = 'magnetic-separator';
          } else if (id.includes('flotation')) {
            subcategory = 'flotation-equipment';
          } else if (id.includes('jig') || id.includes('table') || id.includes('chute') || id.includes('centrifugal')) {
            subcategory = 'gravity-separation';
          } else if (id.includes('washer') || id.includes('washing')) {
            subcategory = 'washing-equipment';
          }
          
          // 首先尝试从子目录加载数据
          let filePath = '';
          let fileContent = '';
          
          if (subcategory) {
            filePath = path.join(process.cwd(), 'public', 'data', locale, subcategory, `${id}.json`);
            try {
              fileContent = await fs.readFile(filePath, 'utf8');
            } catch (err) {
              // 如果子目录中未找到，尝试根目录
              filePath = path.join(process.cwd(), 'public', 'data', locale, `${id}.json`);
              fileContent = await fs.readFile(filePath, 'utf8');
            }
          } else {
            // 如果无法确定子目录，直接尝试根目录
            filePath = path.join(process.cwd(), 'public', 'data', locale, `${id}.json`);
            fileContent = await fs.readFile(filePath, 'utf8');
          }
          
          // 检查文件内容是否为JSON
          if (fileContent.trim().startsWith('{')) {
            try {
              const data = JSON.parse(fileContent);
              
              // 根据subcategory构建子类目结构URL
              const productSubcategory = data.subcategory || subcategory || '';
              let href;
              
              // 构建唯一正确的URL格式 - 始终使用子类目路径
              if (productSubcategory === 'grinding-equipment') {
                href = `/${locale}/products/ore-processing/grinding-equipment/${id}`;
              } else if (productSubcategory === 'gravity-separation') {
                href = `/${locale}/products/ore-processing/gravity-separation/${id}`;
              } else if (productSubcategory === 'vibrating-screens') {
                href = `/${locale}/products/ore-processing/vibrating-screens/${id}`;
              } else if (productSubcategory === 'stationary-crushers') {
                href = `/${locale}/products/ore-processing/stationary-crushers/${id}`;
              } else if (productSubcategory === 'magnetic-separator') {
                href = `/${locale}/products/ore-processing/magnetic-separator/${id}`;
              } else if (productSubcategory === 'flotation-equipment' || productSubcategory === 'flotation') {
                href = `/${locale}/products/ore-processing/flotation-equipment/${id}`;
              } else if (productSubcategory === 'feeding-equipment') {
                href = `/${locale}/products/ore-processing/feeding-equipment/${id}`;
              } else if (productSubcategory === 'washing-equipment') {
                href = `/${locale}/products/ore-processing/washing-equipment/${id}`;
              } else if (productSubcategory === 'classification-equipment') {
                href = `/${locale}/products/ore-processing/classification-equipment/${id}`;
              } else if (data.href) {
                // 如果有预定义的href使用预定义的
                href = data.href;
              } else {
                // 兜底 - 此处应该很少触发，为未分类产品提供备用链接
                console.warn(`Product ${id} has no subcategory and no href, using fallback path structure`);
                // 这里使用的是子类目结构下的一个通用分类，而不是直接/products/[id]
                href = `/${locale}/products/ore-processing/other/${id}`;
              }
              
              return {
                id: data.id || id, // 如果data.id不存在，使用传入的id作为备用
                title: data.title,
                imageSrc: data.imageSrc,
                href: href,
                category: data.productCategory
              };
            } catch (parseError) {
              console.error(`Error parsing JSON for related product ${id}:`, parseError);
              return null;
            }
          } else {
            console.error(`Invalid JSON content for related product ${id}, content starts with: ${fileContent.substring(0, 50)}...`);
            return null;
          }
        } catch (error) {
          console.error(`Error loading related product data for ${id}:`, error);
          return null;
        }
      })
    );
    
    return relatedProducts.filter(Boolean);
  } catch (error) {
    console.error('Failed to load related products data:', error);
    return [];
  }
}

// 格式化规格数据为统一格式，按型号分组
function formatSpecifications(product: any): any[] {
  if (!product.specifications || !product.specifications.tableHeaders || !product.specifications.tableData) {
    return [];
  }
  
  const { tableHeaders, tableData, tableHeadersImperial, tableDataImperial } = product.specifications;
  
  // 将数据按型号分组，每个型号一个对象
  const modelSpecs = tableData.map((row: any[], rowIndex: number) => {
    // 创建当前型号的规格对象
    const modelSpec: Record<string, any> = {};
    
    // 填充规格数据
    tableHeaders.forEach((header: string, index: number) => {
      const value = row[index];
      if (value !== undefined) {
        // 创建规格对象，包含公制和英制值
        const spec: any = {
          value: String(value),
          unit: '' // 如果需要单位，可以从数据中提取
        };
        
        // 如果有英制单位数据，添加英制值
        if (tableHeadersImperial && tableDataImperial && tableDataImperial[rowIndex]) {
          spec.imperialValue = String(tableDataImperial[rowIndex][index]);
          spec.imperialUnit = ''; // 如果需要英制单位，可以从数据中提取
        }
        
        // 使用表头作为键
        modelSpec[header] = spec;
      }
    });
  
    return modelSpec;
  });
  
  return modelSpecs;
}

export default async function ProductDetailPage({ 
  params 
}: { 
  params: { productId: string; locale: string } 
}) {
  // 静态路由下直接指定locale为中文
  const locale = 'zh';
  // 确保正确await params
  const safeParams = await safelyGetRouteParams(params);
  const { productId } = safeParams;
  
  try {
    const { product, isSuccess } = await getProductData(productId, locale);
    if (!isSuccess || !product) notFound();
    
    // 验证产品是否属于给料设备类别
    if (product.subcategory !== 'feeding-equipment') {
      console.warn(`Product ${productId} is not a feeding equipment but was accessed via feeding equipment route`);
      // 可以选择重定向到正确的类别或者显示错误页面
    }
    
    const isZh = true; // 中文版，固定为true
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.zexinmining.com';
    
    // 使用统一函数构建面包屑导航
    const breadcrumbConfig = getProductDetailBreadcrumbConfig({
      locale,
      productId,
      productTitle: product.title,
      category: 'feeding-equipment'
    });
    
    // 定义面包屑项目用于结构化数据
    const breadcrumbItems = [
      { name: '首页', url: '/zh' },
      { name: '产品中心', url: '/zh/products' },
      { name: '选矿设备', url: '/zh/products/ore-processing' },
      { name: '给料设备', url: '/zh/products/ore-processing/feeding-equipment' },
      { name: product.title, url: `/zh/products/ore-processing/feeding-equipment/${productId}` }
    ];
    
    // 构建结构化数据
    const productStructuredData = getProductStructuredData({
      productId,
      product,
      locale,
      baseUrl
    });
    
    // 为结构化数据构建面包屑格式 - 这里可以重用同一格式
    const breadcrumbStructuredData = getBreadcrumbStructuredData(breadcrumbItems, baseUrl);
    
    const faqStructuredData = product.faqs ? getFAQStructuredData(product.faqs) : null;
    
    const imageStructuredData = product.imageSrc ? getImageStructuredData({
      url: product.imageSrc,
      caption: product.title,
      description: product.overview,
      baseUrl
    }) : null;
    
    const categoryStructuredData = getProductCategoryStructuredData({
      categoryId: 'feeding-equipment',
      categoryName: isZh ? '给料设备' : 'Feeding Equipment',
      description: isZh ? '泽鑫矿山设备的给料设备包括振动给料机、板式给料机等，专为矿石和骨料处理而设计' : 'Zexin Mining\'s feeding equipment includes vibratory feeders, apron feeders and more, designed for ore and aggregate handling',
      productCount: 6,
      locale,
      baseUrl
    });
    
    const organizationStructuredData = getOrganizationStructuredData(isZh);
    
    const structuredDataArray = [
      productStructuredData,
      breadcrumbStructuredData,
      ...(faqStructuredData ? [faqStructuredData] : []),
      ...(imageStructuredData ? [imageStructuredData] : []),
      categoryStructuredData,
      organizationStructuredData
    ];

    // 准备客户端组件所需的数据
    const specifications = formatSpecifications(product);
    
    // 获取相关产品数据
    const relatedProducts = product.relatedProducts 
      ? await getRelatedProductsData(product.relatedProducts, locale)
      : [];
    
    // 应用领域 - 确保格式正确
    const applications = product.applications && Array.isArray(product.applications.items)
      ? product.applications.items
      : Array.isArray(product.applications) 
        ? product.applications 
        : [];
    
    // 技术优势 - 字符串数组或对象数组
    let technicalAdvantages: any[] = [];
    if (Array.isArray(product.technicalAdvantages)) {
      // 检查第一个元素确定是字符串数组还是对象数组
      technicalAdvantages = product.technicalAdvantages;
    } else if (product.technicalAdvantages && Array.isArray(product.technicalAdvantages.items)) {
      technicalAdvantages = product.technicalAdvantages.items;
    }
    
    // 案例研究
    const caseStudies = product.caseStudies && Array.isArray(product.caseStudies)
      ? product.caseStudies
      : [];
    
    // 常见问题
    const faqs = product.faqs || [];
    
    // 创建合并的结构化数据
    const combinedStructuredData = {
      "@context": "https://schema.org",
      "@graph": structuredDataArray
    };

    return (
      <>
        {/* SEO结构化数据 - 使用组件方式 */}
        <MultiStructuredData dataArray={structuredDataArray} />
        
        <ProductLayout
          locale={locale}
          breadcrumbItems={breadcrumbConfig}
        >
          {/* 注入产品数据 */}
          <ProductDataInjection product={product} locale={locale}>
            {/* 给料设备专用客户端组件 */}
            <ClientFeedingEquipmentDetail
              locale={locale}
              productData={product}
              specifications={specifications}
              applications={applications}
              technicalAdvantages={technicalAdvantages}
              caseStudies={caseStudies}
              faqs={faqs}
              relatedProducts={relatedProducts}
            />
          </ProductDataInjection>
        </ProductLayout>
      </>
    );
  } catch (error) {
    console.error('Error loading feeding equipment product:', error);
    return notFound();
  }
} 