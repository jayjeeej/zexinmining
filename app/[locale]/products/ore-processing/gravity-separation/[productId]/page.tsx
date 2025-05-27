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
import fs from 'fs';
import { promises as fsPromises } from 'fs';
import path from 'path';
import { getProductDetailBreadcrumbConfig } from '@/lib/navigation';
import { safelyGetRouteParams } from '@/lib/utils';
import { getCategoryMetadata } from '@/lib/seo';

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
export async function generateMetadata({ 
  params 
}: { 
  params: { productId: string; locale: string } 
}): Promise<Metadata> {
  // 确保在使用 params 前先等待参数
  const safeParams = await safelyGetRouteParams(params);
  const { productId, locale } = safeParams;
  
  // 获取产品数据
  try {
    const { product, isSuccess } = await getProductData(productId, locale);
    if (!isSuccess || !product) return notFoundMetadata(locale);
    
    const isZh = locale === 'zh';
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://zexinmining.com';
    
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
    return notFoundMetadata(locale);
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

export default async function ProductDetailPage({ 
  params 
}: { 
  params: { productId: string; locale: string } 
}) {
  // 安全获取路由参数
  const { locale, productId } = await safelyGetRouteParams(params);
  
  // 如果没有locale或productId，显示错误状态
  if (!locale || !productId) {
    return <div>Error: Missing required parameters</div>;
  }
  
  // 获取产品数据
  const product = await getGravitySeparationProductData(locale, productId);
  
  // 如果产品不存在，显示404
  if (!product) {
    return <div>Product not found</div>;
  }
  
  try {
    // 验证产品是否属于重力分离设备类别
    if (product.subcategory !== 'gravity-separation') {
      // 静默处理，不输出警告
    }
    
    const isZh = locale === 'zh';
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://zexinmining.com';
    
    // 使用统一函数构建面包屑导航
    const breadcrumbItems = getProductDetailBreadcrumbConfig({
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
    
    const breadcrumbStructuredData = getBreadcrumbStructuredData(breadcrumbItems, baseUrl);
    
    const faqStructuredData = product.faqs ? getFAQStructuredData(product.faqs) : null;
    
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
    
    return (
      <>
        {/* SEO结构化数据 */}
        <MultiStructuredData dataArray={structuredDataArray} />
        
      <ProductLayout
        locale={locale}
        breadcrumbItems={breadcrumbsForLayout}
      >
          {/* 注入产品数据 */}
        <ProductDataInjection product={product} locale={locale}>
            {/* 重力分离设备专用客户端组件 */}
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
    // 静默处理错误
    return notFound();
  }
} 