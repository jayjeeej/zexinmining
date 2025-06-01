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
import ClientClassificationEquipmentDetail from './page.client';
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


// 获取所有分级设备产品ID用于静态生成
export async function generateStaticParams() {
  try {
    // 从文件系统读取所有产品数据文件
    const dataDir = path.join(process.cwd(), 'public', 'data', 'en', 'classification-equipment'); // 使用英文分级设备子目录
    
    // 检查目录是否存在
    try {
      await fs.access(dataDir);
    } catch (error) {
      console.error(`Directory ${dataDir} does not exist or cannot be accessed:`, error);
      return [
        { locale: 'en', productId: 'high-weir-spiral-classifier' },
        { locale: 'zh', productId: 'high-weir-spiral-classifier' },
        { locale: 'en', productId: 'submerged-spiral-classifier' },
        { locale: 'zh', productId: 'submerged-spiral-classifier' },
        { locale: 'en', productId: 'hydrocyclone-separator' },
        { locale: 'zh', productId: 'hydrocyclone-separator' }
      ];
    }
    
    const files = await fs.readdir(dataDir);
    const productJsonFiles = files.filter(file => file.endsWith('.json'));
    
    // 提取所有分级设备产品ID
    const classificationEquipmentProducts = productJsonFiles.map(file => file.replace('.json', ''));
    
    const locales = ['en', 'zh'];
    
    console.log(`Generated static paths for ${classificationEquipmentProducts.length} classification equipment products`);
    
    // 为每个语言和产品ID生成参数
    return classificationEquipmentProducts.flatMap(productId => 
      locales.map(locale => ({
        productId,
        locale
      }))
    );
  } catch (error) {
    console.error('Error generating static params for classification equipment:', error);
    // 返回基本的静态参数，确保构建不会失败
    return [
      { locale: 'en', productId: 'high-weir-spiral-classifier' },
      { locale: 'zh', productId: 'high-weir-spiral-classifier' },
      { locale: 'en', productId: 'submerged-spiral-classifier' },
      { locale: 'zh', productId: 'submerged-spiral-classifier' },
      { locale: 'en', productId: 'hydrocyclone-separator' },
      { locale: 'zh', productId: 'hydrocyclone-separator' }
    ];
  }
}

// 生成元数据
export async function generateMetadata({ params }: { params: { productId: string; locale: string } }): Promise<Metadata> {
  // 静态路由下直接指定locale而不是从params获取
  const locale = 'zh';
  const { productId } = await params;
  
  // 获取产品数据
  const { product, isSuccess } = await getProductData(productId, locale);
  if (!isSuccess || !product) return notFoundMetadata('zh');
  
  const isZh = true; // 中文版，固定为true
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.zexinmining.com';
  
  // 构建规范链接URL - 注意这里的路径结构与目录结构一致
  const canonicalUrl = `/${locale}/products/ore-processing/classification-equipment/${productId}`;
  
  // 优先使用产品数据中的SEO配置
  if (product.seo) {
    return {
      title: product.seo.title || `${product.title} | ${isZh ? '泽鑫矿山设备' : 'Zexin Mining Equipment'}`,
      description: product.seo.description || product.overview,
      keywords: product.seo.keywords || `${product.title},${product.productCategory}`,
      alternates: {
        canonical: canonicalUrl,
        languages: {
          'zh-CN': `/zh/products/ore-processing/classification-equipment/${productId}`,
          'en-US': `/en/products/ore-processing/classification-equipment/${productId}`,
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
                     ? `${product.title},${product.productCategory},泽鑫矿山设备,矿山设备,分级设备` 
                     : `${product.title},${product.productCategory},Zexin Mining Equipment,mining equipment,classification equipment`;
  
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
        'zh-CN': `/zh/products/ore-processing/classification-equipment/${productId}`,
        'en-US': `/en/products/ore-processing/classification-equipment/${productId}`,
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
          
          const data = JSON.parse(fileContent);
          
          // 根据subcategory构建子类目结构URL
          const productSubcategory = data.subcategory || subcategory || '';
          let href;
          
          // 构建唯一正确的URL格式 - 始终使用子类目路径
          if (productSubcategory === 'classification-equipment') {
            href = `/${locale}/products/ore-processing/classification-equipment/${id}`;
          } else if (productSubcategory === 'grinding-equipment') {
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
          value: value,
          unit: '',
          imperialValue: tableDataImperial && tableDataImperial[0] ? tableDataImperial[0][index] : undefined,
          imperialUnit: '',
        };
        result.push(spec);
      }
    });
  }
  
  return result;
}

export default async function ProductDetailPage({ params }: { params: { productId: string; locale: string } }) {
  try {
    // 静态路由下直接指定locale而不是从params获取
    const locale = 'zh';
    const { productId } = await params;
    
    const { product, isSuccess } = await getProductData(productId, locale);
    if (!isSuccess || !product) notFound();
    
    // 验证产品是否属于分级设备类别
    if (product.subcategory !== 'classification-equipment') {
      console.log(`[DEBUG] Product ${productId} category: ${product.subcategory || 'undefined'}`);
    }
    
    const isZh = true; // 中文版，固定为true
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.zexinmining.com';
    
    // 使用统一函数构建面包屑导航
    const breadcrumbConfig = getProductDetailBreadcrumbConfig({
      locale,
      productId,
      productTitle: product.title,
      category: 'classification-equipment'
    });
    
    // 定义面包屑项目用于结构化数据
    const breadcrumbItems = [
      { name: '首页', url: '/zh' },
      { name: '产品中心', url: '/zh/products' },
      { name: '选矿设备', url: '/zh/products/ore-processing' },
      { name: '分级设备', url: '/zh/products/ore-processing/classification-equipment' },
      { name: product.title, url: `/zh/products/ore-processing/classification-equipment/${productId}` }
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
    
    // 构建面包屑结构化数据
    const breadcrumbStructuredData = getBreadcrumbStructuredData(
      breadcrumbItems,
      baseUrl
    );
    
    // 构建FAQ结构化数据
    const faqStructuredData = faqs.length > 0 
      ? getFAQStructuredData(faqs)
      : null;
    
    // 构建图片结构化数据
    const imageStructuredData = getImageStructuredData({
      url: product.imageSrc,
      caption: product.title,
      description: product.overview || "",
      baseUrl
    });
    
    // 构建产品类别结构化数据
    const productCategoryStructuredData = getProductCategoryStructuredData({
      categoryId: 'classification-equipment',
      categoryName: isZh ? '分级设备' : 'Classification Equipment',
      description: isZh 
        ? '分级设备用于矿石颗粒的分级与分选，提高选矿效率和精度。'
        : 'Classification equipment for the classification and separation of ore particles, improving the efficiency and accuracy of mineral processing.',
      locale,
      baseUrl
    });
    
    // 构建组织结构化数据
    const organizationStructuredData = getOrganizationStructuredData(isZh);
    
    // 创建规格表结构化数据（如果有）
    const specTableStructuredData = getSpecificationTableStructuredData({
      product,
      locale,
      baseUrl
    });
    
    // 创建WebPage结构化数据
    const pageUrl = `${baseUrl}/${locale}/products/ore-processing/classification-equipment/${productId}`;
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
            "publisher": {
              "@type": "Organization",
              "name": "泽鑫矿山设备",
              "logo": {
                "@type": "ImageObject",
                "url": `${baseUrl}/logo/logo-zh.webp`
              }
            }
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
          <ProductDataInjection product={product} locale={locale}>
            <ClientClassificationEquipmentDetail
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
    console.error('Error rendering product detail page:', error);
    return notFound();
  }
} 