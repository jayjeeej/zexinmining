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
import ClientMagneticSeparatorDetail from './page.client';
import { ProductSpecification } from '@/lib/productDataSchema';
import fs from 'fs/promises';
import path from 'path';
import { getProductDetailBreadcrumbConfig } from '@/lib/navigation';
import { safelyGetRouteParams } from '@/lib/utils';

// 获取所有磁选设备产品ID用于静态生成
export async function generateStaticParams() {
  try {
    // 从文件系统读取所有产品数据文件
    const dataDir = path.join(process.cwd(), 'public', 'data', 'en', 'magnetic-separator'); // 使用英文磁选设备子目录
    
    // 检查目录是否存在
    try {
      await fs.access(dataDir);
    } catch (error) {
      // 静默处理错误
      return [
        { locale: 'en', productId: 'double-roller-permanent-magnetic-zircon-separator' },
        { locale: 'zh', productId: 'double-roller-permanent-magnetic-zircon-separator' }
      ];
    }
    
    const files = await fs.readdir(dataDir);
    const productJsonFiles = files.filter(file => file.endsWith('.json'));
    
    // 提取所有磁选设备产品ID
    const magneticSeparatorProducts = productJsonFiles.map(file => file.replace('.json', ''));
    
    const locales = ['en', 'zh'];
    
    // 为每个语言和产品ID生成参数
    return magneticSeparatorProducts.flatMap(productId => 
      locales.map(locale => ({
        productId,
        locale
      }))
    );
  } catch (error) {
    // 静默处理错误
    // 返回基本的静态参数，确保构建不会失败
    return [
      { locale: 'en', productId: 'double-roller-permanent-magnetic-zircon-separator' },
      { locale: 'zh', productId: 'double-roller-permanent-magnetic-zircon-separator' }
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
    const canonicalUrl = `/${locale}/products/ore-processing/magnetic-separator/${productId}`;
    
    // 优先使用产品数据中的SEO配置
    if (product.seo) {
      return {
        title: product.seo.title || `${product.title} | ${isZh ? '泽鑫矿山设备' : 'Zexin Mining Equipment'}`,
        description: product.seo.description || product.overview,
        keywords: product.seo.keywords || `${product.title},${product.productCategory}`,
        alternates: {
          canonical: canonicalUrl,
          languages: {
            'zh-CN': `/zh/products/ore-processing/magnetic-separator/${productId}`,
            'en-US': `/en/products/ore-processing/magnetic-separator/${productId}`,
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
                       ? `${product.title},${product.productCategory},泽鑫矿山设备,矿山设备,磁选设备,磁选机` 
                       : `${product.title},${product.productCategory},Zexin Mining Equipment,mining equipment,magnetic separator,magnetic separation equipment`;
    
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
          'zh-CN': `/zh/products/ore-processing/magnetic-separator/${productId}`,
          'en-US': `/en/products/ore-processing/magnetic-separator/${productId}`,
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
          
          // 先检查特定产品ID
          if (id === 'four-roll-high-voltage-electrostatic-separator') {
            subcategory = 'magnetic-separator';
          } else if (id.includes('feeder')) {
            subcategory = 'feeding-equipment';
          } else if (id.includes('mill') || id.includes('grinding')) {
            subcategory = 'grinding-equipment';
          } else if (id.includes('screen')) {
            subcategory = 'vibrating-screens';
          } else if (id.includes('crusher')) {
            subcategory = 'stationary-crushers';
          } else if (id.includes('magnetic') || id.includes('separator') || id.includes('electrostatic')) {
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
          
          // 尝试加载数据从子目录
          let filePath = '';
          let fileContent = '';
          
          // 创建可能的子目录列表
          const possibleSubcategories = [
            subcategory, 
            'magnetic-separator', 
            'grinding-equipment', 
            'vibrating-screens', 
            'stationary-crushers',
            'flotation-equipment',
            'gravity-separation',
            'feeding-equipment',
            'washing-equipment',
            'classification-equipment'
          ].filter(Boolean);
          
          // 尝试从各个可能的子目录加载数据
          let foundFile = false;
          for (const category of possibleSubcategories) {
            try {
              filePath = path.join(process.cwd(), 'public', 'data', locale, category, `${id}.json`);
              fileContent = await fs.readFile(filePath, 'utf8');
              foundFile = true;
              break;
            } catch (err) {
              // 继续尝试下一个子目录
              continue;
            }
          }
          
          // 如果在所有子目录都未找到，尝试根目录
          if (!foundFile) {
            try {
              filePath = path.join(process.cwd(), 'public', 'data', locale, `${id}.json`);
              fileContent = await fs.readFile(filePath, 'utf8');
              foundFile = true;
            } catch (rootErr) {
              // 尝试英文目录
              try {
                const enFilePath = path.join(process.cwd(), 'public', 'data', 'en', subcategory, `${id}.json`);
                fileContent = await fs.readFile(enFilePath, 'utf8');
                foundFile = true;
              } catch (enErr) {
                try {
                  const enRootPath = path.join(process.cwd(), 'public', 'data', 'en', `${id}.json`);
                  fileContent = await fs.readFile(enRootPath, 'utf8');
                  foundFile = true;
                } catch (enRootErr) {
                  // 静默处理错误
                  return null;
                }
              }
            }
          }
          
          const data = JSON.parse(fileContent);
          
          // 根据subcategory构建子类目结构URL
          const productSubcategory = data.subcategory || subcategory || '';
          let href;
          
          // 构建唯一正确的URL格式
          if (productSubcategory) {
            href = `/${locale}/products/ore-processing/${productSubcategory}/${id}`;
          } else if (data.href) {
            // 如果有预定义的href使用预定义的
            href = data.href;
          } else {
            // 兜底 - 为未分类产品提供备用链接
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
          // 静默处理错误
          return null;
        }
      })
    );
    
    const filteredProducts = relatedProducts.filter(Boolean);
    return filteredProducts;
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

export default async function ProductDetailPage({ 
  params 
}: { 
  params: { productId: string; locale: string } 
}) {
  // 确保在使用 params 前先等待参数
  const safeParams = await safelyGetRouteParams(params);
  const { productId, locale } = safeParams;
  
  try {
    const { product, isSuccess } = await getProductData(productId, locale);
    if (!isSuccess || !product) notFound();
    
    // 验证产品是否属于磁选设备类别
    if (product.subcategory !== 'magnetic-separator') {
      // 静默处理，不输出警告
    }
    
    const isZh = locale === 'zh';
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://zexinmining.com';
    
    // 使用统一函数构建面包屑导航
    const breadcrumbItems = getProductDetailBreadcrumbConfig({
      locale,
      productId,
      productTitle: product.title,
      category: 'magnetic-separator'
    });
    
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
      categoryId: 'magnetic-separator',
      categoryName: isZh ? '磁选设备' : 'Magnetic Separation Equipment',
      description: isZh ? '高效率磁选设备，满足不同矿石磁选需求' : 'High-efficiency magnetic separation equipment for various ore separation requirements',
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
        breadcrumbItems={breadcrumbItems}
      >
          {/* 注入产品数据 */}
        <ProductDataInjection product={product} locale={locale}>
            {/* 磁选设备专用客户端组件 */}
          <ClientMagneticSeparatorDetail
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