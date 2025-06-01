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
  getOrganizationStructuredData,
  getProductSpecificationsStructuredData,
  getSpecificationTableStructuredData,
  getProductVariantStructuredData,
  getWebPageStructuredData
} from '@/lib/structuredData';
import ProductDataInjection from '@/components/ProductDetail/ProductDataInjection';
import ClientFlotationEquipmentDetail from './page.client';
import { ProductSpecification } from '@/lib/productDataSchema';
import fs from 'fs';
import { promises as fsPromises } from 'fs';
import path from 'path';
import { getProductDetailBreadcrumbConfig } from '@/lib/navigation';
import { safelyGetRouteParams } from '@/lib/utils';
import fsSync from 'fs';

// Vercel 优化导出指令
export const dynamic = 'force-static';        // 强制静态生成
export const revalidate = 3600;               // 每小时重新验证一次
export const fetchCache = 'force-cache';      // 强制使用缓存
export const runtime = 'nodejs';              // 使用Node.js运行时
export const preferredRegion = 'auto';        // 自动选择最佳区域

// 获取所有浮选设备产品ID用于静态生成
export async function generateStaticParams() {
  const locale = 'en';
  const category = 'flotation-equipment';
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
    const canonicalUrl = `/${locale}/products/ore-processing/flotation-equipment/${productId}`;
    
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
    const seoTitle = `${product.title} - ${mainFeature}${model ? ' ' + model + ' Series' : ''} | Zexin Mining Equipment`;
    
    // 优先使用产品数据中的SEO配置
    if (product.seo) {
      return {
        title: product.seo.title || seoTitle,
        description: product.seo.description || product.overview,
        keywords: product.seo.keywords || `${product.title},${product.productCategory}`,
        alternates: {
          canonical: canonicalUrl,
          languages: {
            'zh-CN': `/zh/products/ore-processing/flotation-equipment/${productId}`,
            'en-US': `/en/products/ore-processing/flotation-equipment/${productId}`,
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
                       ? `${product.title},${product.productCategory},泽鑫矿山设备,矿山设备,浮选设备,浮选机` 
                       : `${product.title},${product.productCategory},Zexin Mining Equipment,mining equipment,flotation equipment,flotation machine`;
    
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
          'zh-CN': `/zh/products/ore-processing/flotation-equipment/${productId}`,
          'en-US': `/en/products/ore-processing/flotation-equipment/${productId}`,
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
          // 根据产品ID判断子类别
          let subcategory = '';
          
          if (id.includes('flotation') || id.includes('cell')) {
            subcategory = 'flotation-equipment';
          } else if (id.includes('feeder')) {
            subcategory = 'feeding-equipment';
          } else if (id.includes('mill') || id.includes('grinding')) {
            subcategory = 'grinding-equipment';
          } else if (id.includes('screen')) {
            subcategory = 'vibrating-screens';
          } else if (id.includes('crusher')) {
            subcategory = 'stationary-crushers';
          } else if (id.includes('magnetic') || id.includes('separator')) {
            subcategory = 'magnetic-separator';
          } else if (id.includes('jig') || id.includes('table') || id.includes('chute') || id.includes('centrifugal')) {
            subcategory = 'gravity-separation';
          } else if (id.includes('washer') || id.includes('washing')) {
            subcategory = 'washing-equipment';
          } else if (id.includes('classifier')) {
            subcategory = 'classification-equipment';
          }
          
          // 在确定的子目录和备选子目录中查找文件
          const primaryCategories = [subcategory, 'flotation-equipment'].filter(Boolean);
          
          let filePath = '';
          let fileContent = '';
          let foundFile = false;
          
          // 先尝试主要子目录
          for (const category of primaryCategories) {
            try {
              filePath = path.join(process.cwd(), 'public', 'data', locale, category, `${id}.json`);
              fileContent = await fsPromises.readFile(filePath, 'utf8');
              foundFile = true;
              break;
            } catch (err) {
              // 继续尝试下一个子目录
              continue;
            }
          }
          
          // 如果还没找到且ID确实存在于相关产品列表中，则跳过
          if (!foundFile) {
            console.warn(`无法找到产品 ${id} 的数据文件，从相关产品中移除`);
            return null;
          }
          
          const data = JSON.parse(fileContent);
          
          // 确保URL路径正确
          const productSubcategory = data.subcategory || subcategory || '';
          let href = data.href; // 优先使用数据中的href
          
          // 如果没有预定义href，根据子类目构建链接
          if (!href) {
            href = `/${locale}/products/ore-processing/${productSubcategory}/${id}`;
          }
          
          return {
            id: data.id,
            title: data.title,
            imageSrc: data.imageSrc,
            href: href,
            category: data.productCategory
          };
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
        const spec: any = {
          name: header,
          value: String(value),
          unit: ''
        };
        
        // 尝试提取单位（通常包含在括号中）
        const unitMatch = header.match(/\(([^)]+)\)/);
        if (unitMatch) {
          spec.unit = unitMatch[1];
        }
        
        // 添加英制单位数据（如果存在）
        if (tableHeadersImperial && tableDataImperial?.[0]?.[index]) {
          spec.imperial = {
            value: String(tableDataImperial[0][index]),
            unit: ''
          };
        }
        
        result.push(spec);
      }
    });
  }
  
  return result;
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
    const { product, isSuccess } = await getProductData(productId, locale);
    if (!isSuccess || !product) return notFound();
    
    // 验证产品是否属于浮选设备类别
    if (product.subcategory !== 'flotation-equipment') {
      // 静默处理
    }
    
    const isZh = false;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.zexinmining.com';
    
    // 使用统一函数构建面包屑导航
    const breadcrumbConfig = getProductDetailBreadcrumbConfig({
      locale,
      productId,
      productTitle: product.title,
      category: 'flotation-equipment'
    });
    
    // 定义面包屑项目用于结构化数据
    const breadcrumbItems = [
      { name: 'Home', url: '/en' },
      { name: 'Products', url: '/en/products' },
      { name: 'Ore Processing', url: '/en/products/ore-processing' },
      { name: 'Flotation Equipment', url: '/en/products/ore-processing/flotation-equipment' },
      { name: product.title, url: `/en/products/ore-processing/flotation-equipment/${productId}` }
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
    const specificationProperties = getProductSpecificationsStructuredData({
      product,
      modelIndex: 0
    });
    
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
    
    // 创建面包屑结构化数据
    const breadcrumbStructuredData = getBreadcrumbStructuredData(breadcrumbItems, baseUrl);
    
    // 创建FAQ结构化数据
    const faqStructuredData = faqs.length > 0 
      ? getFAQStructuredData(faqs)
      : null;
    
    // 创建图片结构化数据
    const imageStructuredData = getImageStructuredData({
      url: product.imageSrc,
      caption: product.title,
      description: product.overview || "",
      baseUrl
    });
    
    // 创建产品类别结构化数据
    const categoryStructuredData = getProductCategoryStructuredData({
      categoryId: 'flotation-equipment',
      categoryName: 'Flotation Equipment',
      description: 'Zexin Mining Equipment offers efficient flotation equipment including pneumatic flotation cells, self-aspirated flotation cells, coarse flotation cells and air inflation flotation cells for non-ferrous, precious and non-metallic mineral separation',
      locale: locale,
      baseUrl: baseUrl
    });
    
    // 创建组织结构化数据
    const organizationStructuredData = getOrganizationStructuredData(isZh);
    
    // 创建规格表结构化数据
    const specTableStructuredData = getSpecificationTableStructuredData({
      product,
      locale
    });
    
    // 创建WebPage结构化数据
    const pageUrl = `${baseUrl}/${locale}/products/ore-processing/flotation-equipment/${productId}`;
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
          "description": cs.description,
          "image": cs.imageSrc ? `${baseUrl}${cs.imageSrc}` : undefined,
          "author": {
            "@type": "Organization",
            "name": "Zexin Mining Equipment"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Zexin Mining Equipment",
            "logo": {
              "@type": "ImageObject",
              "url": `${baseUrl}/logo/logo-en.webp`
            }
          },
          "datePublished": new Date().toISOString().split('T')[0]
        };
      }
      return null;
    }).filter(Boolean);
    
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(categoryStructuredData) }}
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
          {/* 注入产品数据 */}
          <ProductDataInjection product={product} locale={locale}>
            <ClientFlotationEquipmentDetail
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
    console.error('Error in ProductDetailPage:', error);
    return notFound();
  }
} 