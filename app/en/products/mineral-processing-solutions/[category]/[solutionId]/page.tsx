import { Metadata } from 'next';







export const preferredRegion = 'auto';        // 自动选择最佳区域
export const runtime = 'nodejs';              // 使用Node.js运行时
export const fetchCache = 'force-cache';      // 强制使用缓存
import { getOrganizationSchema } from '@/lib/seo';
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
  params: { locale: string; category: string; solutionId: string } 
}): Promise<Metadata> {
  // Validate parameters
  if (!params) {
    console.error('Error in generateMetadata: params is undefined');
    return {
      title: 'Error',
      description: 'Invalid parameters'
    };
  }
  
  // Ensure parameters are awaited before using
  const resolvedParams = await Promise.resolve(params);
  const { locale = 'en', category, solutionId } = resolvedParams;
  
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
  
  const isZh = locale === 'zh';
  const title = solutionData.title || (isZh ? `${solutionData.mineralName?.zh || ''}选矿工艺` : `${solutionData.mineralName?.en || ''} Beneficiation Process`);
  const description = solutionData.description || (isZh ? 
    `泽鑫提供专业的${solutionData.mineralName?.zh || ''}选矿工艺解决方案，高效提取和加工${solutionData.mineralName?.zh || ''}矿物资源` : 
    `Zexin provides professional ${solutionData.mineralName?.en || ''} beneficiation process solutions for efficient extraction and processing of ${solutionData.mineralName?.en || ''} mineral resources`);
  
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
  params: { locale: string; category: string; solutionId: string } 
}) {
  // Validate parameters
  if (!params) {
    console.error('Error: params is undefined');
    notFound();
    return null; // Prevent further execution
  }
  
  // Ensure parameters are awaited before using
  const resolvedParams = await Promise.resolve(params);
  const { locale = 'en', category, solutionId } = resolvedParams;
  
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
  
  const isZh = locale === 'zh';
  
  // 获取组织架构结构化数据
  const organizationSchema = getOrganizationSchema(isZh);

  // 获取分类名称
  function getCategoryName(category: string, isZh: boolean): string {
    const categoryNames: Record<string, {zh: string, en: string}> = {
      'new-energy': {zh: '新能源矿种', en: 'New Energy Minerals'},
      'precious-metals': {zh: '贵金属', en: 'Precious Metals'},
      'non-ferrous': {zh: '有色金属', en: 'Non-ferrous Metals'},
      'ferrous': {zh: '黑色金属', en: 'Ferrous Metals'},
      'non-metallic': {zh: '非金属', en: 'Non-metallic Minerals'}
    };
    
    return isZh ? categoryNames[category]?.zh || category : categoryNames[category]?.en || category;
  }

  // 处理面包屑导航
  const breadcrumbConfig = getBreadcrumbConfig(locale);
  const breadcrumbItems = [
    { name: breadcrumbConfig.home.name, href: breadcrumbConfig.home.href },
    { name: breadcrumbConfig.products.name, href: breadcrumbConfig.products.href },
    { 
      name: isZh ? '选矿解决方案' : 'Mineral Processing Solutions',
      href: `/${locale}/products/mineral-processing-solutions`
    },
    { 
      name: isZh 
        ? (typeof solutionData.mineralName === 'string' 
            ? `${solutionData.mineralName}选矿工艺` 
            : `${solutionData.mineralName.zh}选矿工艺`)
        : (typeof solutionData.mineralName === 'string'
            ? `${solutionData.mineralName} Beneficiation Process`
            : `${solutionData.mineralName.en} Beneficiation Process`)
    }
  ];
  
  return (
    <>
      {/* JSON-LD 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      
      {/* 解决方案详情页面 */}
      <SolutionDetailClient 
        locale={locale}
        category={category}
        solutionId={solutionId}
        solutionData={solutionData}
        breadcrumbItems={breadcrumbItems}
        relatedProducts={relatedProducts}
      />
    </>
  );
} 