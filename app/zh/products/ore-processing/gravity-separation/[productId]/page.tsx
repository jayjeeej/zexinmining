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
  getOrganizationStructuredData,
  getSpecificationTableStructuredData,
  getProductVariantStructuredData,
  getWebPageStructuredData
} from '@/lib/structuredData';
import ProductDataInjection from '@/components/ProductDetail/ProductDataInjection';
import ClientGravitySeparationDetail from './page.client';
import { ProductSpecification } from '@/lib/productDataSchema';
import fs from 'fs';
import { promises as fsPromises } from 'fs';
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

// 获取所有重力分离设备产品ID用于静态生成
export async function generateStaticParams() {
  try {
    // 从文件系统读取所有产品数据文件
    const dataDir = path.join(process.cwd(), 'public', 'data', 'en', 'gravity-separation'); // 使用英文重力分选设备子目录
    
    // 检查目录是否存在
    try {
      await fsPromises.access(dataDir);
    } catch (error) {
      // 静默处理错误
      return [
        { locale: 'en', productId: 'shaking-table' },
        { locale: 'zh', productId: 'shaking-table' }
      ];
    }
    
    const files = await fsPromises.readdir(dataDir);
    const productJsonFiles = files.filter(file => file.endsWith('.json'));
    
    // 提取所有重力分选设备产品ID
    const gravitySeparationProducts = productJsonFiles.map(file => file.replace('.json', ''));
    
    const locales = ['en', 'zh'];
    
    // 为每个语言和产品ID生成参数
    return gravitySeparationProducts.flatMap(productId => 
      locales.map(locale => ({
        productId,
        locale
      }))
    );
  } catch (error) {
    // 静默处理错误
    // 返回基本的静态参数，确保构建不会失败
    return [
      { locale: 'en', productId: 'shaking-table' },
      { locale: 'zh', productId: 'shaking-table' }
    ];
  }
}

// 生成元数据
export async function generateMetadata({ params }: { params: { productId: string; locale: string } }): Promise<Metadata> {
  try {
    // 静态路由下直接指定locale而不是从params获取
    const locale = 'zh';
    const { productId } = await params;
    
    // 获取产品数据
    const { product, isSuccess } = await getProductData(productId, locale);
    if (!isSuccess || !product) return notFoundMetadata('zh');
    
    const isZh = true;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.zexinmining.com';
    
    // 构建规范链接URL - 注意这里的路径结构与目录结构一致
    const canonicalUrl = `/${locale}/products/ore-processing/gravity-separation/${productId}`;
    
    // 确定主要关键特性
    let mainFeature = '';
    if (product.features && Array.isArray(product.features) && product.features.length > 0) {
      const firstFeature = product.features[0] as any;
      if (firstFeature && typeof firstFeature.title === 'string') {
        mainFeature = firstFeature.title.replace(/[,，、]/g, '');
      }
    }
    
    // 获取型号
    const model = product.model || '';
    
    // 构建SEO友好的标题
    const seoTitle = `${product.title}-${mainFeature}${model ? model + '系列' : ''} | 泽鑫矿山设备`;
    
    // 优先使用产品数据中的SEO配置
    if (product.seo) {
      return {
        title: product.seo.title || seoTitle,
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
          title: product.seo.title || seoTitle,
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
      title: seoTitle,
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
        title: seoTitle,
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
              fileContent = await fsPromises.readFile(filePath, 'utf8');
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
              fileContent = await fsPromises.readFile(filePath, 'utf8');
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
  // 基础验证
  if (
    !product || 
    !product.specifications || 
    !product.specifications.tableHeaders || 
    !product.specifications.tableData ||
    product.specifications.tableData.length === 0
  ) {
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
          value: value.toString(),
          unit: '',
          // 根据ProductSpecification接口添加正确的属性
          imperialValue: tableDataImperial && tableDataImperial[0] ? 
                        tableDataImperial[0][index]?.toString() : '',
          imperialUnit: ''
        };
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
    if (!fs.existsSync(dataPath)) {
      // 如果子目录不存在，尝试从根目录获取
      const rootDataPath = path.join(process.cwd(), 'public', 'data', locale, `${productId}.json`);
      
      if (!fs.existsSync(rootDataPath)) {
        // 文件不存在，返回null
        return null;
      }
      
      // 从根目录读取
      const data = await fsPromises.readFile(rootDataPath, 'utf8');
      return JSON.parse(data);
    }
    
    // 从子目录读取
    const data = await fsPromises.readFile(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // 捕获所有错误，返回null
    return null;
  }
}

export default async function ProductDetailPage({ params }: { params: { productId: string; locale: string } }) {
  try {
    // 静态路由下直接指定locale而不是从params获取
    const locale = 'zh';
    const isZh = true; // 中文版，固定为true
    // 确保正确await params
    const safeParams = await safelyGetRouteParams(params);
    const { productId } = safeParams;
    
    const { product, isSuccess } = await getProductData(productId, locale);
    if (!isSuccess || !product) return notFound();
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.zexinmining.com';
    
    // 使用统一函数构建面包屑导航
    const breadcrumbConfig = getProductDetailBreadcrumbConfig({
      locale,
      productId,
      productTitle: product.title,
      category: 'gravity-separation'
    });
    
    // 定义面包屑项目用于结构化数据
    const breadcrumbItems = [
      { name: '首页', url: '/zh' },
      { name: '产品中心', url: '/zh/products' },
      { name: '选矿设备', url: '/zh/products/ore-processing' },
      { name: '重力选矿设备', url: '/zh/products/ore-processing/gravity-separation' },
      { name: product.title, url: `/zh/products/ore-processing/gravity-separation/${productId}` }
    ];
    
    // 格式化规格数据
    const specifications = formatSpecifications(product);
    
    // 应用领域格式化
    let applications: any[] = [];
    if (product.applications) {
      if (Array.isArray(product.applications)) {
        applications = product.applications.map((app: any) => ({
          icon: app.icon || '/icons/application-default.svg',
          title: app.title || '',
          description: app.description || ''
        }));
      } else if (product.applications.items && Array.isArray(product.applications.items)) {
        applications = product.applications.items.map((app: any) => ({
          icon: app.icon || '/icons/application-default.svg',
          title: app.title || '',
          description: app.description || ''
        }));
      }
    }
    
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
    
    // 获取相关产品数据
    let relatedProducts: any[] = [];
    if (product.relatedProducts && Array.isArray(product.relatedProducts)) {
      relatedProducts = await getRelatedProductsData(product.relatedProducts, locale);
    }
    
    // 创建技术规格的结构化数据属性
    const specificationProperties: Array<{
      "@type": string;
      "name": string;
      "value": string;
      "unitCode"?: string;
    }> = [];
    
    if (product.specifications && product.specifications.tableHeaders && product.specifications.tableData) {
      const { tableHeaders, tableData, unitTypes = [] } = product.specifications;
      
      // 使用第一行数据（典型型号）创建技术规格
      if (tableData[0]) {
        tableHeaders.forEach((header: string, index: number) => {
          if (tableData[0][index] !== undefined) {
            specificationProperties.push({
              "@type": "PropertyValue",
              "name": header,
              "value": tableData[0][index].toString(),
              ...(unitTypes[index] ? { "unitCode": unitTypes[index] } : {})
            });
          }
        });
      }
    }
    
    // 构建增强的产品结构化数据
    const productStructuredData = getProductStructuredData({
      productId,
      product,
      locale,
      baseUrl
    });
    
    // 增强产品结构化数据
    const enhancedProductStructuredData = {
      ...productStructuredData,
      additionalProperty: specificationProperties,
      isRelatedTo: [] as Array<{
        "@type": string;
        "name": string;
        "url": string;
      }>
    };
    
    // 如果有相关产品，添加到结构化数据
    if (relatedProducts && relatedProducts.length > 0) {
      enhancedProductStructuredData.isRelatedTo = relatedProducts.map(related => ({
        "@type": "Product",
        "name": related.title,
        "url": `${baseUrl}${related.href}`
      }));
    }
    
    // 构建产品变体结构化数据（如果有多个型号）
    const productVariantStructuredData = getProductVariantStructuredData({
      product,
      groupName: product.series || product.title,
      locale,
      baseUrl
    });
    
    const breadcrumbStructuredData = getBreadcrumbStructuredData(
      breadcrumbItems,
      baseUrl
    );
    
    const faqStructuredData = faqs.length > 0 
      ? getFAQStructuredData(faqs.map(faq => ({ 
          question: faq.question, 
          answer: faq.answer 
        })))
      : null;
    
    const imageStructuredData = getImageStructuredData({
      url: product.imageSrc,
      caption: product.title,
      description: product.overview || "",
      baseUrl
    });
    
    const productCategoryStructuredData = getProductCategoryStructuredData({
      categoryId: 'gravity-separation',
      categoryName: '重力选矿设备',
      description: '重力选矿设备用于根据矿物密度差进行选别，提供高效的重选工艺和设备。',
      locale,
      baseUrl
    });
    
    const organizationStructuredData = getOrganizationStructuredData(isZh);
    
    // 创建规格表结构化数据
    const specTableStructuredData = getSpecificationTableStructuredData({
      product,
      locale,
      baseUrl
    });
    
    // 创建WebPage结构化数据
    const pageUrl = `${baseUrl}/${locale}/products/ore-processing/gravity-separation/${productId}`;
    const webPageStructuredData = getWebPageStructuredData({
      pageUrl: pageUrl,
      pageName: product.title,
      description: product.overview || "",
      locale: locale,
      baseUrl: baseUrl,
      images: [product.imageSrc],
      breadcrumbId: null
    });
    
    // 创建案例研究结构化数据
    const caseStudyStructuredData = caseStudies.map((cs, index) => {
      if (cs.title && cs.description) {
        return {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": cs.title,
          "description": cs.description || "",
          "image": cs.imageSrc ? `${baseUrl}${cs.imageSrc}` : undefined,
          "author": {
            "@type": "Organization",
            "name": "泽鑫矿山设备"
          },
          "publisher": {
            "@type": "Organization",
            "name": "泽鑫矿山设备",
            "logo": {
              "@type": "ImageObject",
              "url": `${baseUrl}/logo/logo-zh.webp`
            }
          },
          "datePublished": new Date().toISOString().split('T')[0]
        };
      }
      return null;
    }).filter(Boolean);
    
    // 将数据传递给产品布局组件
    return (
      <>
        {/* 使用独立script标签注入各结构化数据 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(enhancedProductStructuredData) }}
        />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
        />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(imageStructuredData) }}
        />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productCategoryStructuredData) }}
        />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
        />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageStructuredData) }}
        />
        
        {specTableStructuredData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(specTableStructuredData) }}
          />
        )}
        
        {productVariantStructuredData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(productVariantStructuredData) }}
          />
        )}
        
        {faqStructuredData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
          />
        )}
        
        {caseStudyStructuredData.map((csData, index) => (
          <script
            key={`case-study-${index}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(csData) }}
          />
        ))}
        
        <ProductLayout
          locale={locale}
          breadcrumbItems={breadcrumbConfig}
        >
          <ProductDataInjection
            product={product}
            locale={locale}
          >
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
    console.error('[ERROR] 重力选矿设备详情页加载失败:', error);
    return notFound();
  }
} 