import { Metadata } from 'next';
import { notFound } from 'next/navigation';
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
import ClientGravitySeparationDetail from './page.client';
import { ProductSpecification } from '@/lib/productDataSchema';
import fs from 'fs/promises';
import * as fsSync from 'fs'; // 使用fsSync代替fs
import path from 'path';
import { getProductDetailBreadcrumbConfig } from '@/lib/navigation';
import { safelyGetRouteParams } from '@/lib/utils';
import { getCategoryMetadata } from '@/lib/seo';

// Vercel 优化导出指令
export const dynamic = 'force-static';        // 强制静态生成
export const revalidate = 3600;               // 每小时重新验证一次
export const fetchCache = 'force-cache';      // 强制使用缓存
export const runtime = 'nodejs';              // 使用Node.js运行时
export const preferredRegion = 'auto';        // 自动选择最佳区域

// 为静态导出生成所有可能的路径参数
export async function generateStaticParams() {
  const locale = 'en';
  const category = 'gravity-separation';
  const basePath = path.join(process.cwd(), 'public', 'data', locale, category);
  
  try {
    // 检查目录是否存在
    if (!fsSync.existsSync(basePath)) {
      console.error(`Directory not found: ${basePath}`);
      return [];
    }
    
    // 获取所有产品文件
    const productFiles = fsSync.readdirSync(basePath)
      .filter((file: string) => file.endsWith('.json'))
      .map((file: string) => file.replace('.json', ''));
    
    // 为每个产品添加参数
    const params = productFiles.map((productId: string) => ({
      productId
    }));
    
    console.log(`Generated ${params.length} static paths for ${category} products`);
    return params;
  } catch (error) {
    console.error(`Error generating static params for ${category}:`, error);
    return [];
  }
}

// 生成元数据
export async function generateMetadata({ 
  params 
}: { 
  params: { productId: string; locale: string } 
}): Promise<Metadata> {
  try {
    // 静态路由下直接指定locale而不是从params获取
    const locale = 'en';
    const productId = (await params).productId;
    
    // 获取产品数据
    const { product, isSuccess } = await getProductData(productId, locale);
    if (!isSuccess || !product) return notFoundMetadata();
    
    const isZh = false;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.zexinmining.com';
    
    // 构建规范链接URL - 注意这里的路径结构与目录结构一致
    const canonicalUrl = `/${locale}/products/ore-processing/gravity-separation/${productId}`;
    
    // 优先使用产品数据中的SEO配置
    if (product.seo) {
      return {
        title: product.seo.title || `${product.title} | ${isZh ? '泽鑫矿山设备' : 'Zexin Mining Equipment'}`,
        description: product.seo.description || product.overview,
        keywords: product.seo.keywords || `${product.title},${product.productCategory}`,
        alternates: {
          canonical: canonicalUrl,
          languages: {
            'zh-CN': `/zh/products/ore-processing/gravity-separation/${productId}`,
            'en-US': `/en/products/ore-processing/gravity-separation/${productId}`,
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
                       ? `${product.title},${product.productCategory},泽鑫矿山设备,矿山设备,重选设备,重力分选` 
                       : `${product.title},${product.productCategory},Zexin Mining Equipment,mining equipment,gravity separation equipment`;
    
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
          'zh-CN': `/zh/products/ore-processing/gravity-separation/${productId}`,
          'en-US': `/en/products/ore-processing/gravity-separation/${productId}`,
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
    // 静默处理错误
    return notFoundMetadata();
  }
}

// 404元数据
function notFoundMetadata(): Metadata {
  // 英文版页面，硬编码isZh为false
  const isZh = false;
  return {
    title: isZh ? '产品未找到 | 泽鑫矿山设备' : 'Product Not Found | Zexin Mining Equipment',
    description: isZh ? '抱歉，您请求的产品不存在。' : 'Sorry, the product you requested does not exist.',
  };
}

// 获取相关产品数据
async function getRelatedProductsData(relatedIds: string[], locale: string) {
  try {
    const relatedProducts = await Promise.all(
      relatedIds.map(async (id) => {
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
          } else if (id.includes('magnetic') || id.includes('separator')) {
            subcategory = 'magnetic-separator';
          } else if (id.includes('flotation')) {
            subcategory = 'flotation-equipment';
          } else if (id.includes('jig') || id.includes('table') || id.includes('chute') || id.includes('centrifugal')) {
            subcategory = 'gravity-separation';
          } else if (id.includes('washer') || id.includes('washing')) {
            subcategory = 'washing-equipment';
          } else if (id.includes('classifier')) {
            subcategory = 'classification-equipment';
          }
          
          // 创建可能的子目录列表
          const possibleSubcategories = [
            subcategory, 
            'gravity-separation',
            'magnetic-separator', 
            'grinding-equipment', 
            'vibrating-screens', 
            'stationary-crushers',
            'flotation-equipment',
            'feeding-equipment',
            'washing-equipment',
            'classification-equipment'
          ].filter(Boolean);
          
          // 尝试从所有可能的子目录加载数据
          let filePath = '';
          let fileContent = '';
          let foundFile = false;
          
          for (const subcat of possibleSubcategories) {
            try {
              filePath = path.join(process.cwd(), 'public', 'data', locale, subcat, `${id}.json`);
              fileContent = await fs.readFile(filePath, 'utf8');
              foundFile = true;
              // 找到文件后记录子类别
              subcategory = subcat;
              break;
            } catch (err) {
              // 继续尝试下一个子目录
              continue;
            }
          }
          
              // 如果子目录中未找到，尝试根目录
          if (!foundFile) {
            try {
              filePath = path.join(process.cwd(), 'public', 'data', locale, `${id}.json`);
              fileContent = await fs.readFile(filePath, 'utf8');
              foundFile = true;
              subcategory = '';
            } catch (err) {
              // 如果无法找到文件，跳过该产品
              return null;
          }
          }
          
          // 解析JSON数据
          const data = JSON.parse(fileContent);
          
          // 使用数据中的子类别或推断的子类别
          const productSubcategory = data.subcategory || subcategory || '';
          let href;
          
          // 如果存在子类别，使用子类别路径
          if (productSubcategory) {
            href = `/${locale}/products/ore-processing/${productSubcategory}/${id}`;
          } else if (data.href) {
            // 如果数据中有预定义的href，则使用
            href = data.href;
          } else {
            // 兜底路径
            href = `/${locale}/products/${id}`;
          }
          
          return {
            id: data.id,
            title: data.title,
            imageSrc: data.imageSrc,
            href: href,
            category: data.productCategory
          };
        } catch (error) {
          // 静默处理错误
          return null;
        }
      })
    );
    
    return relatedProducts.filter(Boolean);
  } catch (error) {
    // 静默处理错误
    return [];
  }
}

// 格式化规格数据为统一格式
function formatSpecifications(product: any): ProductSpecification[] {
  if (!product.specifications || !product.specifications.tableHeaders || !product.specifications.tableData) {
    return [];
  }
  
  const result: ProductSpecification[] = [];
  const { tableHeaders, tableData, tableHeadersImperial, tableDataImperial } = product.specifications;
  
  // 获取第一行数据（通常是唯一的一行数据）
  if (tableData[0]) {
    tableHeaders.forEach((header: string, index: number) => {
      const value = tableData[0][index];
      if (value !== undefined) {
        const spec: ProductSpecification = {
          name: header,
          value: String(value) // 确保值是字符串
        };
        
        // 如果有英制单位数据，添加到规格对象
        if (tableHeadersImperial && tableDataImperial && tableDataImperial[0]) {
          spec.imperialName = tableHeadersImperial[index];
          spec.imperialValue = String(tableDataImperial[0][index]); // 确保值是字符串
        }
        
        result.push(spec);
      }
    });
  }
  
  return result;
}

// 获取产品数据
export async function getGravitySeparationProductData(locale: string, productId: string) {
  try {
    const dataPath = path.join(process.cwd(), 'public', 'data', locale, 'gravity-separation', `${productId}.json`);
    
    // 检查文件是否存在
    if (!fsSync.existsSync(dataPath)) {
      // 如果子目录不存在，尝试从根目录获取
      const rootDataPath = path.join(process.cwd(), 'public', 'data', locale, `${productId}.json`);
      
      if (!fsSync.existsSync(rootDataPath)) {
        // 文件不存在，返回null
        return null;
      }
      
      // 从根目录读取
      const data = await fs.readFile(rootDataPath, 'utf8');
      return JSON.parse(data);
    }
    
    // 从子目录读取
    const data = await fs.readFile(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // 捕获所有错误，返回null
    return null;
  }
}

export default async function ProductDetailPage({ 
  params 
}: { 
  params: { productId: string; locale: string } 
}) {
  try {
    // 静态路由下直接指定locale而不是从params获取
    const locale = 'en';
    const productId = (await params).productId;
    
    // 获取产品数据
    const product = await getGravitySeparationProductData(locale, productId);
    if (!product) return <div>Product not found</div>;
    
    // 验证产品是否属于重力分离设备类别
    if (product.subcategory !== 'gravity-separation') {
      // 静默处理
    }
    
    const isZh = false;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.zexinmining.com';
    
    // 使用统一函数构建面包屑导航
    const breadcrumbConfig = getProductDetailBreadcrumbConfig({
      locale,
      productId,
      productTitle: product.title,
      category: 'gravity-separation'
    });
    
    // 构建结构化数据
    const productStructuredData = getProductStructuredData({
      productId,
      product,
      locale,
      baseUrl
    });
    
    const breadcrumbItems = [
      { name: 'Home', url: '/en' },
      { name: 'Products', url: '/en/products' },
      { name: 'Ore Processing', url: '/en/products/ore-processing' },
      { name: 'Gravity Separation', url: '/en/products/ore-processing/gravity-separation' },
      { name: product.title, url: `/en/products/ore-processing/gravity-separation/${productId}` }
    ];
    
    const breadcrumbStructuredData = getBreadcrumbStructuredData(breadcrumbItems, baseUrl);
    
    const faqStructuredData = product.faqs && Array.isArray(product.faqs) && product.faqs.length > 0
      ? getFAQStructuredData(product.faqs.map((faq: any) => ({
          question: faq.question,
          answer: faq.answer
        })))
      : null;
    
    const imageStructuredData = product.imageSrc ? getImageStructuredData({
      url: product.imageSrc,
      caption: product.title,
      description: product.overview,
      baseUrl
    }) : null;
    
    const categoryStructuredData = getProductCategoryStructuredData({
      categoryId: 'gravity-separation',
      categoryName: isZh ? '重力分选设备' : 'Gravity Separation',
      description: isZh ? '高效率重力分选设备，满足不同矿石分选需求' : 'High-efficiency gravity separation equipment for various ore separation requirements',
      locale,
      baseUrl
    });
    
    const organizationStructuredData = getOrganizationStructuredData(isZh);
    
    const structuredDataArray = [
      productStructuredData,
      breadcrumbStructuredData,
      categoryStructuredData,
      organizationStructuredData,
      ...(imageStructuredData ? [imageStructuredData] : []),
      ...(faqStructuredData ? [faqStructuredData] : [])
    ];
    
    // 准备客户端组件所需的数据
    const specifications = formatSpecifications(product);
    
    // 获取相关产品数据
    let relatedProducts: any[] = [];
    if (product.relatedProducts && Array.isArray(product.relatedProducts)) {
      relatedProducts = await getRelatedProductsData(product.relatedProducts, locale);
    }
    
    // 应用领域格式化
    const applications = Array.isArray(product.applications) 
      ? product.applications.map((app: any) => ({
          icon: app.icon || '/icons/application.svg',
          title: app.title || '',
          description: app.description || ''
        }))
      : [];
    
    // 技术优势格式化
    const technicalAdvantages = Array.isArray(product.technicalAdvantages)
      ? product.technicalAdvantages.map((adv: any) => ({
          title: adv.title || '',
          description: adv.description || ''
        }))
      : [];
    
    // 案例研究格式化
    const caseStudies = Array.isArray(product.caseStudies)
      ? product.caseStudies.map((cs: any) => ({
          title: cs.title || '',
          description: cs.description || cs.summary || '',
          results: cs.results || '',
          imageSrc: cs.imageSrc || null
        }))
      : [];
    
    // FAQ格式化
    const faqs = Array.isArray(product.faqs)
      ? product.faqs.map((faq: any) => ({
          question: faq.question || '',
          answer: faq.answer || ''
        }))
      : [];
    
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
            <ClientGravitySeparationDetail
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
    // 显性记录错误，帮助调试
    console.error("Product detail page rendering error:", error);
    // 静默处理错误
    return notFound();
  }
} 