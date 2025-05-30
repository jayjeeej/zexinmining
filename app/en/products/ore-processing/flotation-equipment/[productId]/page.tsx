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
    const { productId } = await safelyGetRouteParams(params);
    
    // 获取产品数据
    const { product, isSuccess } = await getProductData(productId, locale);
    if (!isSuccess || !product) return notFoundMetadata();
    
    // 在英文版中，直接使用固定值而不是比较
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.zexinmining.com';
    
    // 构建规范链接URL - 注意这里的路径结构与目录结构一致
    const canonicalUrl = `/${locale}/products/ore-processing/flotation-equipment/${productId}`;
    
    // 优先使用产品数据中的SEO配置
    if (product.seo) {
      return {
        title: product.seo.title || `${product.title} | Zexin Mining Equipment`,
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
          title: product.seo.title || product.title,
          description: product.seo.description || product.overview,
          url: `${baseUrl}${canonicalUrl}`,
          siteName: 'Zexin Mining Equipment',
          images: [
            {
              url: `${baseUrl}${product.imageSrc}`,
              width: 1200,
              height: 630,
              alt: product.title,
            },
          ],
          locale: 'en_US',
          type: 'website',
        },
      };
    }
    
    // 为SEO描述和关键词提供默认值
    const seoDescription = product.overview || 
                        `${product.title} - Professional ${product.productCategory} solutions by Zexin Mining Equipment`;
    
    const seoKeywords = `${product.title},${product.productCategory},Zexin Mining Equipment,mining equipment,flotation equipment`;
    
    // 如果产品数据中存在searchKeywords数组，使用它来增强关键词
    const enhancedKeywords = product.searchKeywords && Array.isArray(product.searchKeywords) 
      ? `${seoKeywords},${product.searchKeywords.join(',')}` 
      : seoKeywords;
    
    return {
      title: `${product.title} | Zexin Mining Equipment`,
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
        title: product.title,
        description: product.overview || seoDescription,
        url: `${baseUrl}${canonicalUrl}`,
        siteName: 'Zexin Mining Equipment',
        images: [
          {
            url: `${baseUrl}${product.imageSrc}`,
            width: 1200,
            height: 630,
            alt: product.title,
          },
        ],
        locale: 'en_US',
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
    const { productId } = await safelyGetRouteParams(params);
    
    // 获取产品数据
    const { product, isSuccess } = await getProductData(productId, locale);
    if (!isSuccess || !product) return <div>Product not found</div>;
    
    // 格式化规格数据
    const specifications = formatSpecifications(product);
    
    // 获取应用数据
    const applications = product.applications && Array.isArray(product.applications.items) 
      ? product.applications.items.map((app: any) => ({
          icon: app.icon || '/icons/application-default.svg',
          title: app.title || '',
          description: app.description || ''
        }))
      : [];
    
    // 技术优势数据
    const technicalAdvantages = product.technicalAdvantages && Array.isArray(product.technicalAdvantages.items) 
      ? product.technicalAdvantages.items.map((adv: any) => ({
          title: adv.title || '',
          description: adv.description || ''
        }))
      : [];
    
    // 案例研究数据
    const caseStudies = product.caseStudies || [];
    
    // 常见问题数据
    const faqs = product.faqs || [];
    
    // 相关产品数据
    const relatedProductIds = product.relatedProducts || [];
    const relatedProducts = await getRelatedProductsData(relatedProductIds, locale);
    
    // 获取面包屑导航
    const breadcrumbConfig = getProductDetailBreadcrumbConfig({
      locale,
      productId,
      productTitle: product.title,
      category: 'flotation-equipment'
    });
    
    // 构建结构化数据
    const structuredDataItems = [
      // 产品结构化数据
      getProductStructuredData({
        productId,
        product,
        locale
      }),
      // 面包屑结构化数据
      getBreadcrumbStructuredData(breadcrumbConfig.map(item => ({ name: item.name, url: item.href }))),
      // 产品分类结构化数据
      getProductCategoryStructuredData({
        categoryId: 'flotation-equipment',
        categoryName: 'Flotation Equipment',
        description: 'Zexin Mining offers efficient flotation equipment',
        locale
      }),
      // 组织结构化数据
      getOrganizationStructuredData()
    ];
    
    // 如果有FAQ，添加FAQ结构化数据
    if (faqs.length > 0) {
      structuredDataItems.push(
        getFAQStructuredData(faqs)
      );
    }
    
    // 如果有产品图片，添加图片结构化数据
    if (product.imageSrc) {
      structuredDataItems.push(
        getImageStructuredData({
          url: product.imageSrc,
          caption: product.title, // 使用caption而不是alt
          width: 800,
          height: 600
        })
      );
    }
    
    return (
      <>
        {/* 结构化数据 */}
        <MultiStructuredData dataArray={structuredDataItems} />
        
        <ProductLayout
          locale={locale}
          breadcrumbItems={breadcrumbConfig}
        >
          {/* 产品数据注入 - 用于客户端组件访问 */}
          <ProductDataInjection
            product={product}
            locale={locale}
          >
            {/* 客户端产品详情组件 */}
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
    // 显性记录错误，帮助调试
    console.error("Product detail page rendering error:", error);
    // 静默处理错误
    return notFound();
  }
} 