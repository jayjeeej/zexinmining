import { Metadata } from 'next';
import { getOrganizationSchema } from '@/lib/seo';
import { getWebPageStructuredData, getBreadcrumbStructuredData } from '@/lib/structuredData';
export const preferredRegion = 'auto';        // 自动选择最佳区域
export const runtime = 'nodejs';              // 使用Node.js运行时
export const fetchCache = 'force-cache';      // 强制使用缓存
import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import SolutionDetailClient from './page.client';
import { getBreadcrumbConfig } from '@/lib/navigation';
import { safelyGetRouteParams } from '@/lib/utils';

export const dynamic = 'force-static'; // Force static generation
export const revalidate = 3600; // Revalidate every hour

// 为静态导出生成所有可能的路径参数
export async function generateStaticParams() {
  const locale = 'en';
  const basePath = path.join(process.cwd(), 'public', 'data', locale, 'mineral-processing-solutions');
  
  try {
    // 检查目录是否存在
    if (!fs.existsSync(basePath)) {
      console.error(`Directory not found: ${basePath}`);
      return [];
    }
    
    // 获取所有分类目录
    const categories = fs.readdirSync(basePath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    // 为每个分类和解决方案生成参数
    const params = [];
    
    for (const category of categories) {
      const categoryPath = path.join(basePath, category);
      
      // 获取该分类下的所有解决方案文件
      const solutionFiles = fs.readdirSync(categoryPath)
        .filter(file => file.endsWith('.json'))
        .map(file => file.replace('.json', ''));
      
      // 为每个解决方案添加参数
      for (const solutionId of solutionFiles) {
        params.push({
          category,
          solutionId
        });
      }
    }
    
    console.log(`Generated ${params.length} static paths for mineral processing solutions`);
    return params;
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Get solution data
async function getSolutionData(locale: string, category: string, solutionId: string) {
  try {
    // Parameter validation to ensure all parameters are valid strings
    if (!locale) {
      console.error('Error: locale is undefined or empty');
      return null;
    }
    
    if (!category) {
      console.error('Error: category is undefined or empty');
      return null;
    }
    
    if (!solutionId) {
      console.error('Error: solutionId is undefined or empty');
      return null;
    }
    
    // Ensure using the correct language version file
    const filePath = path.join(process.cwd(), 'public', 'data', locale, 'mineral-processing-solutions', category, `${solutionId}.json`);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      // If English mode can't find the file, try Chinese version as fallback
      if (locale === 'en') {
        const zhFilePath = path.join(process.cwd(), 'public', 'data', 'zh', 'mineral-processing-solutions', category, `${solutionId}.json`);
        if (fs.existsSync(zhFilePath)) {
          console.log(`Using Chinese data file for ${solutionId} as English version not found`);
          const fileContent = fs.readFileSync(zhFilePath, 'utf8');
          return JSON.parse(fileContent);
        }
      }
      // If corresponding language file is not found, return null
      return null;
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Error loading solution data: ${error}`);
    return null;
  }
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
          } else if ((id.includes('magnetic') || id.includes('separator')) && !id.includes('hydrocyclone')) {
            subcategory = 'magnetic-separator';
          } else if (id.includes('flotation') || id === 'flotation-cell' || id === 'flotation-machine' || id === 'froth-flotation-cell') {
            subcategory = 'flotation-equipment';
          } else if (id.includes('jig') || id.includes('table') || id.includes('chute') || id.includes('centrifugal')) {
            subcategory = 'gravity-separation';
          } else if (id.includes('washer') || id.includes('washing')) {
            subcategory = 'washing-equipment';
          } else if (id.includes('classifier') || id.includes('hydrocyclone')) {
            subcategory = 'classification-equipment';
          }
          
          // 首先尝试从子目录加载数据
          let filePath = '';
          let fileContent = '';
          let foundCategory = '';
          
          // 如果已经确定了子类别，先尝试该子类别
          if (subcategory) {
            try {
              filePath = path.join(process.cwd(), 'public', 'data', locale, subcategory, `${id}.json`);
              fileContent = await fs.promises.readFile(filePath, 'utf8');
              foundCategory = subcategory;
              console.log(`Found product ${id} in category ${subcategory}`);
            } catch (err) {
              // 如果确定的子类别没找到，继续尝试其他可能的类别
              console.log(`Product ${id} not found in expected category ${subcategory}, trying alternatives...`);
            }
          }
          
          // 如果在预期子类别中没找到，尝试所有可能的子类别
          if (!fileContent) {
            // 定义所有可能的子类别
            const allCategories = [
              'gravity-separation',
              'magnetic-separator',
              'grinding-equipment',
              'vibrating-screens',
              'stationary-crushers',
              'flotation-equipment',
              'feeding-equipment',
              'washing-equipment',
              'classification-equipment'
            ];
            
            // 过滤掉已经尝试过的子类别
            const categoriesToTry = subcategory ? allCategories.filter(cat => cat !== subcategory) : allCategories;
            
            // 依次尝试所有可能的子类别
            for (const category of categoriesToTry) {
              try {
                filePath = path.join(process.cwd(), 'public', 'data', locale, category, `${id}.json`);
                fileContent = await fs.promises.readFile(filePath, 'utf8');
                foundCategory = category;
                console.log(`Found product ${id} in alternative category ${category}`);
                break;
              } catch (err) {
                // 继续尝试下一个类别
                continue;
              }
            }
          }
          
          // 如果仍未找到，尝试根目录
          if (!fileContent) {
            try {
              filePath = path.join(process.cwd(), 'public', 'data', locale, `${id}.json`);
              fileContent = await fs.promises.readFile(filePath, 'utf8');
              console.log(`Found product ${id} in root directory`);
            } catch (err) {
              console.error(`Product ${id} not found in any category or root directory`);
              return null;
            }
          }
          
          const data = JSON.parse(fileContent);
          
          // 构建合适的产品URL
          // 首先尝试使用数据中定义的href字段
          let href = '';
          
          if (data.href) {
            // 如果数据中有明确定义的href，优先使用
            href = data.href;
            console.log(`Using href from data file: ${href}`);
          } else if (data.subcategory) {
            // 使用数据中定义的subcategory
            href = `/${locale}/products/ore-processing/${data.subcategory}/${id}`;
            console.log(`Using subcategory from data: ${data.subcategory}`);
          } else if (foundCategory) {
            // 使用查找过程中确定的类别
            href = `/${locale}/products/ore-processing/${foundCategory}/${id}`;
            console.log(`Using found category: ${foundCategory}`);
          } else {
            // 最后的备选方案
            href = `/${locale}/products/${id}`;
            console.log(`Using fallback URL: ${href}`);
          }
          
          // 提取产品规格作为亮点显示
          let specs = [];
          // 定义meta项的接口
          interface MetaItem {
            key: string;
            displayValue: string;
          }
          
          if (data.meta && Array.isArray(data.meta) && data.meta.length > 0) {
            specs = data.meta.slice(0, 2).map((item: MetaItem) => ({
              label: item.key,
              value: item.displayValue.split(' ')[0],
              unit: item.displayValue.split(' ').slice(1).join(' ').replace(/[\(\)]/g, '')
            }));
          }
          
          return {
            id: data.id,
            title: data.title,
            imageSrc: data.imageSrc,
            href: href,
            category: data.productCategory,
            specs: specs
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

// Get solution page metadata
export async function generateMetadata({ params }: { 
  params: { category: string; solutionId: string } 
}): Promise<Metadata> {
  // 硬编码语言为英文
  const locale = 'en';
  
  if (!params) {
    console.error('Error in generateMetadata: params is undefined');
    return {
      title: 'Error',
      description: 'Invalid parameters'
    };
  }
  
  // 正确处理动态路由参数
  const resolvedParams = await params;
  const { category, solutionId } = resolvedParams;
  
  // Validate required parameters
  if (!category || !solutionId) {
    console.error(`Error in generateMetadata: Missing required parameters - category: ${category}, solutionId: ${solutionId}`);
    return {
      title: 'Error',
      description: 'Invalid parameters'
    };
  }
  
  // Load solution data
  const solutionData = await getSolutionData(locale, category, solutionId);
  
  if (!solutionData) {
    return {
      title: 'Solution Not Found',
      description: 'The requested mineral processing solution could not be found'
    };
  }
  
  const title = solutionData.title || `${solutionData.mineralName?.en || ''} Beneficiation Process`;
  const description = solutionData.description || `Zexin provides professional ${solutionData.mineralName?.en || ''} beneficiation process solutions for efficient extraction and processing of ${solutionData.mineralName?.en || ''} mineral resources`;
  
  return {
    title: title,
    description: description,
    alternates: {
      canonical: `https://www.zexinmining.com/${locale}/products/mineral-processing-solutions/${category}/${solutionId}`,
      languages: {
        'en': `https://www.zexinmining.com/en/products/mineral-processing-solutions/${category}/${solutionId}`,
        'zh': `https://www.zexinmining.com/zh/products/mineral-processing-solutions/${category}/${solutionId}`
      }
    }
  };
}

// Dynamic route detail page server component
export default async function SolutionDetailPage({ params }: { 
  params: { category: string; solutionId: string } 
}) {
  // 硬编码语言为英文
  const locale = 'en';
  const isZh = false;
  
  // 准备基本URL供结构化数据使用
  const baseUrl = 'https://www.zexinmining.com';
  
  // Validate parameters
  if (!params) {
    console.error('Error: params is undefined');
    notFound();
    return null; // Prevent further execution
  }
  
  // 正确处理动态路由参数
  const resolvedParams = await params;
  const { category, solutionId } = resolvedParams;
  
  // Validate required parameters
  if (!category || !solutionId) {
    console.error(`Error: Missing required parameters - category: ${category}, solutionId: ${solutionId}`);
    notFound();
    return null; // Prevent further execution
  }
  
  // Load solution data
  const solutionData = await getSolutionData(locale, category, solutionId);
  
  // If data doesn't exist, show 404 page
  if (!solutionData) {
    console.error(`Error: No solution data found for locale: ${locale}, category: ${category}, solutionId: ${solutionId}`);
    notFound();
    return null; // Prevent further execution
  }
  
  // 获取相关产品数据
  let relatedProducts = [];
  if (solutionData.relatedProducts) {
    // 处理两种可能的格式：ID数组或对象数组
    if (Array.isArray(solutionData.relatedProducts) && solutionData.relatedProducts.length > 0) {
      if (typeof solutionData.relatedProducts[0] === 'string') {
        // 如果是ID数组，从服务器获取完整数据
        relatedProducts = await getRelatedProductsData(solutionData.relatedProducts, locale);
      } else {
        // 如果已经是完整对象数组，直接使用
        relatedProducts = solutionData.relatedProducts;
      }
    }
  }
  
  // 获取多语言字段值的辅助函数
  const getLocalizedValue = (field: any): string => {
    if (!field) return '';
    
    // 如果是字符串，直接返回
    if (typeof field === 'string') return field;
    
    // 如果是对象，返回英文值
    if (typeof field === 'object') {
      return field['en'] || '';
    }
    
    return '';
  };

  // 获取页面标题
  const pageTitle = solutionData.title 
    ? getLocalizedValue(solutionData.title)
    : `${getLocalizedValue(solutionData.mineralName)} Beneficiation Process`;

  // 获取页面描述
  const pageDescription = solutionData.description 
    ? getLocalizedValue(solutionData.description)
    : `Zexin provides professional ${getLocalizedValue(solutionData.mineralName)} beneficiation process solutions for efficient extraction and processing of ${getLocalizedValue(solutionData.mineralName)} mineral resources`;
  
  // 获取组织架构结构化数据
  const organizationSchema = getOrganizationSchema(isZh);

  // 获取页面结构化数据
  const pageUrl = `${baseUrl}/${locale}/products/mineral-processing-solutions/${category}/${solutionId}`;
  
  const webPageStructuredData = getWebPageStructuredData({
    pageName: pageTitle,
    description: pageDescription,
    pageUrl: pageUrl,
    locale: 'en'
  });

  // 处理面包屑导航
  const breadcrumbConfig = getBreadcrumbConfig(locale);
  const breadcrumbItems = [
    { name: breadcrumbConfig.home.name, href: breadcrumbConfig.home.href },
    { name: breadcrumbConfig.products.name, href: breadcrumbConfig.products.href },
    { 
      name: 'Mineral Processing Solutions',
      href: `/${locale}/products/mineral-processing-solutions`
    },
    { 
      name: (typeof solutionData.mineralName === 'string'
            ? `${solutionData.mineralName} Beneficiation Process`
            : `${solutionData.mineralName.en} Beneficiation Process`)
    }
  ];
  
  // 生成面包屑结构化数据
  const breadcrumbStructuredData = getBreadcrumbStructuredData(
    breadcrumbItems.map(item => ({ 
      name: item.name, 
      url: item.href 
    })),
    baseUrl
  );

  // 创建技术文章结构化数据
  const technicalArticleStructuredData = {
    "@context": "https://schema.org",
    "@type": "TechnicalArticle",
    "headline": pageTitle,
    "description": pageDescription,
    "author": {
      "@type": "Organization",
      "name": "Zexin Mining Equipment"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Zexin Mining Equipment",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo/logo.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": pageUrl
    },
    "about": {
      "@type": "Thing",
      "name": getLocalizedValue(solutionData.mineralName)
    },
    "proficiencyLevel": "Expert",
    "step": solutionData.processSteps.map((step: {title: string; description: string}) => ({
      "@type": "HowToStep",
      "name": step.title,
      "text": step.description
    })),
    // 添加关键词，帮助搜索引擎更好地理解内容
    "keywords": `${getLocalizedValue(solutionData.mineralName)} beneficiation,${getLocalizedValue(solutionData.mineralName)} processing,${getLocalizedValue(solutionData.mineralName)} equipment,mineral processing,Zexin Mining Equipment`,
    // 添加矿物处理技术分类
    "articleSection": "Mineral Processing Technology",
    // 添加更新日期
    "dateModified": new Date().toISOString().split('T')[0]
  };

  // 创建服务结构化数据
  const serviceStructuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": pageTitle,
    "description": pageDescription,
    "provider": {
      "@type": "Organization",
      "name": "Zexin Mining Equipment"
    },
    "serviceType": "Mineral Processing Solution",
    "areaServed": {
      "@type": "Country",
      "name": "Global"
    }
  };

  // 创建"如何做"(HowTo)结构化数据，详细描述选矿流程
  const howToStructuredData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": `${getLocalizedValue(solutionData.mineralName)} Beneficiation Process`,
    "description": solutionData.processIntroduction || `Zexin provides professional ${getLocalizedValue(solutionData.mineralName)} beneficiation process solutions for efficient extraction and processing of ${getLocalizedValue(solutionData.mineralName)} mineral resources`,
    "totalTime": "P30D", // 估计完成整个选矿流程的时间
    "tool": solutionData.relatedProducts?.map((productId: string) => ({
      "@type": "HowToTool",
      "name": productId.replace(/-/g, ' ')
    })),
    "step": solutionData.processSteps.map((step: {title: string; description: string}, index: number) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.title,
      "itemListElement": {
        "@type": "HowToDirection",
        "text": step.description
      }
    })),
    "image": solutionData.applicationsImage ? `${baseUrl}${solutionData.applicationsImage}` : undefined
  };

  // 如果有应用图片，创建图片结构化数据
  let imageStructuredData = null;
  if (solutionData.applicationsImage) {
    imageStructuredData = {
      "@context": "https://schema.org",
      "@type": "ImageObject",
      "contentUrl": `${baseUrl}${solutionData.applicationsImage}`,
      "name": `${getLocalizedValue(solutionData.mineralName)} Beneficiation Process Flowchart`,
      "description": `${getLocalizedValue(solutionData.mineralName)} processing flowchart showing the complete process from crushing to concentrate production`,
      "representativeOfPage": true,
      "caption": solutionData.processTitle || `${getLocalizedValue(solutionData.mineralName)} Beneficiation Process`,
      "creditText": "Zexin Mining Equipment Technical Team"
    };
  }
  
  return (
    <>
      {/* JSON-LD 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageStructuredData) }}
      />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(technicalArticleStructuredData) }}
      />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceStructuredData) }}
      />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToStructuredData) }}
      />
      
      {imageStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(imageStructuredData) }}
        />
      )}
      
      {/* 解决方案详情页面 */}
      <SolutionDetailClient 
        category={category}
        solutionId={solutionId}
        solutionData={solutionData}
        breadcrumbItems={breadcrumbItems}
        relatedProducts={relatedProducts}
      />
    </>
  );
} 