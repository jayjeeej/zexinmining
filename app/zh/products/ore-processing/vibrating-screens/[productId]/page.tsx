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
import ClientVibratingScreenDetail from './page.client';
import { ProductSpecification } from '@/lib/productDataSchema';
import fs from 'fs';
import path from 'path';
import { promises as fsPromises } from 'fs';
import { getProductDetailBreadcrumbConfig } from '@/lib/navigation';
import { safelyGetRouteParams } from '@/lib/utils';

// Vercel 优化导出指令
export const dynamic = 'force-static';        // 强制静态生成
export const revalidate = 3600;               // 每小时重新验证一次
export const fetchCache = 'force-cache';      // 强制使用缓存
export const runtime = 'nodejs';              // 使用Node.js运行时
export const preferredRegion = 'auto';        // 自动选择最佳区域

// 获取所有振动筛设备产品ID用于静态生成
export async function generateStaticParams() {
  try {
    // 从文件系统读取所有产品数据文件
    const dataDir = path.join(process.cwd(), 'public', 'data', 'en', 'vibrating-screens'); // 使用英文振动筛设备子目录
    
    // 检查目录是否存在
    try {
      await fs.promises.access(dataDir);
    } catch (error) {
      return [
        { locale: 'en', productId: 'inclined-vibrating-screen' },
        { locale: 'zh', productId: 'inclined-vibrating-screen' }
      ];
    }
    
    const files = await fs.promises.readdir(dataDir);
    const productJsonFiles = files.filter(file => file.endsWith('.json'));
    
    // 提取所有振动筛设备产品ID
    const vibratingScreenProducts = productJsonFiles.map(file => file.replace('.json', ''));
    
    const locales = ['en', 'zh'];
    
    // 为每个语言和产品ID生成参数
    return vibratingScreenProducts.flatMap(productId => 
      locales.map(locale => ({
        productId,
        locale
      }))
    );
  } catch (error) {
    // 返回基本的静态参数，确保构建不会失败
    return [
      { locale: 'en', productId: 'inclined-vibrating-screen' },
      { locale: 'zh', productId: 'inclined-vibrating-screen' }
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
    const canonicalUrl = `/${locale}/products/ore-processing/vibrating-screens/${productId}`;
    
    // 优先使用产品数据中的SEO配置
    if (product.seo) {
      return {
        title: product.seo.title || `${product.title} | ${isZh ? '泽鑫矿山设备' : 'Zexin Mining Equipment'}`,
        description: product.seo.description || product.overview,
        keywords: product.seo.keywords || `${product.title},${product.productCategory}`,
        alternates: {
          canonical: canonicalUrl,
          languages: {
            'zh-CN': `/zh/products/ore-processing/vibrating-screens/${productId}`,
            'en-US': `/en/products/ore-processing/vibrating-screens/${productId}`,
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
                       ? `${product.title},${product.productCategory},泽鑫矿山设备,矿山设备,振动筛设备,筛分设备` 
                       : `${product.title},${product.productCategory},Zexin Mining Equipment,mining equipment,vibrating screen equipment`;
    
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
          'zh-CN': `/zh/products/ore-processing/vibrating-screens/${productId}`,
          'en-US': `/en/products/ore-processing/vibrating-screens/${productId}`,
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

// 获取相关产品数据
async function getRelatedProducts(locale: string, productId: string) {
  try {
    // 首先尝试从子目录加载数据
    let filePath = path.join(process.cwd(), 'public', 'data', locale, 'vibrating-screens', `${productId}.json`);
    
    // 检查文件是否存在，如果不存在则尝试从根目录读取
    if (!fs.existsSync(filePath)) {
      filePath = path.join(process.cwd(), 'public', 'data', locale, `${productId}.json`);
      
      // 如果根目录也不存在此文件，则返回空数组
      if (!fs.existsSync(filePath)) {
        return [];
      }
    }
    
    // 读取主产品数据并获取相关产品ID
    const fileContent = await fsPromises.readFile(filePath, 'utf8');
    const productData = JSON.parse(fileContent);
    
    // 如果产品数据中没有relatedProducts属性，则返回空数组
    if (!productData.relatedProducts || !Array.isArray(productData.relatedProducts)) {
      return [];
    }
    
    // 获取相关产品数据
    const relatedProductsData = await Promise.all(
      productData.relatedProducts.map(async (relatedId: string) => {
        try {
          // 尝试从子目录读取相关产品数据
          let relatedFilePath = path.join(process.cwd(), 'public', 'data', locale, 'vibrating-screens', `${relatedId}.json`);
          
          // 如果子目录不存在，尝试从根目录读取
          if (!fs.existsSync(relatedFilePath)) {
            relatedFilePath = path.join(process.cwd(), 'public', 'data', locale, `${relatedId}.json`);
            
            // 如果根目录也不存在，则跳过此相关产品
            if (!fs.existsSync(relatedFilePath)) {
              return null;
            }
          }
          
          // 读取相关产品数据
          const relatedContent = await fsPromises.readFile(relatedFilePath, 'utf8');
          const relatedData = JSON.parse(relatedContent);
          
          return {
            id: relatedId,
            title: relatedData.title,
            imageSrc: relatedData.imageSrc || `/images/products/vibrating-screens/${relatedId}.jpg`,
            href: `/${locale}/products/ore-processing/vibrating-screens/${relatedId}`
          };
        } catch (err) {
          // 如果读取相关产品数据出错，则跳过此产品
          return null;
        }
      })
    );
    
    // 过滤掉null值（读取失败的相关产品）
    return relatedProductsData.filter(item => item !== null);
  } catch (error) {
    // 捕获所有错误，返回空数组，确保构建不会中断
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
    
    // 验证产品是否属于振动筛设备类别
    if (product.subcategory !== 'vibrating-screens') {
      // 不输出警告，静默处理
    }
    
    const isZh = true; // 中文版，固定为true
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.zexinmining.com';
    
    // 使用统一函数构建面包屑导航
    const breadcrumbConfig = getProductDetailBreadcrumbConfig({
      locale,
      productId,
      productTitle: product.title,
      category: 'vibrating-screens'
    });
    
    // 定义面包屑项目用于结构化数据
    const breadcrumbItems = [
      { name: '首页', url: '/zh' },
      { name: '产品中心', url: '/zh/products' },
      { name: '选矿设备', url: '/zh/products/ore-processing' },
      { name: '振动筛', url: '/zh/products/ore-processing/vibrating-screens' },
      { name: product.title, url: `/zh/products/ore-processing/vibrating-screens/${productId}` }
    ];
    
    // 构建结构化数据
    const productStructuredData = getProductStructuredData({
      productId,
      product,
      locale,
      baseUrl
    });
    
    const breadcrumbStructuredData = getBreadcrumbStructuredData(breadcrumbItems, baseUrl);
    
    const faqStructuredData = product.faqs ? getFAQStructuredData(product.faqs) : null;
    
    const imageStructuredData = product.imageSrc ? getImageStructuredData({
      url: product.imageSrc,
      caption: product.title,
      description: product.overview,
      baseUrl
    }) : null;
    
    const categoryStructuredData = getProductCategoryStructuredData({
      categoryId: 'vibrating-screens',
      categoryName: isZh ? '振动筛设备' : 'Vibrating Screen Equipment',
      description: isZh ? '高效率振动筛设备，满足不同物料筛分需求' : 'High-efficiency vibrating screen equipment for various material screening requirements',
      productCount: 10,
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

    // 使用ProductLayout组件需要的面包屑格式
    const breadcrumbsForLayout = breadcrumbItems;

    // 准备客户端组件所需的数据
    const specifications = formatSpecifications(product);
    
    // 获取相关产品数据
    const relatedProducts = product.relatedProducts 
      ? await getRelatedProducts(locale, productId)
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
        {/* SEO结构化数据 */}
        <MultiStructuredData dataArray={structuredDataArray} />
        
      <ProductLayout
        locale={locale}
        breadcrumbItems={breadcrumbConfig}
      >
          {/* 注入产品数据 */}
          <ProductDataInjection product={product} locale={locale}>
            {/* 振动筛设备专用客户端组件 */}
          <ClientVibratingScreenDetail
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
    return notFound();
  }
} 