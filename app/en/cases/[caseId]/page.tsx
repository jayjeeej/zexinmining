import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBreadcrumbConfig } from '@/lib/navigation';
import { 
  getBreadcrumbStructuredData, 
  getOrganizationStructuredData,
  getWebsiteStructuredData,
  getCaseStudyStructuredData,
  getImageStructuredData
} from '@/lib/structuredData';
import { MultiStructuredData } from '@/components/StructuredData';
import CaseDetailClient from './CaseDetailClient';
import { safelyGetRouteParams } from '@/lib/utils';
import fs from 'fs';
import { promises as fsPromises } from 'fs';
import path from 'path';
// Vercel 优化导出指令
export const dynamic = 'force-static';        // 强制静态生成
export const revalidate = 3600;               // 每小时重新验证一次
export const fetchCache = 'force-cache';      // 强制使用缓存
export const runtime = 'nodejs';              // 使用Node.js运行时
export const preferredRegion = 'auto';        // 自动选择最佳区域


// 获取所有案例ID用于静态生成
export async function generateStaticParams() {
  try {
    const locales = ['en', 'zh'];
    const allCaseIds = new Set<string>();
    
    // 遍历每种语言的目录
    for (const locale of locales) {
      // 1. 检查新的正确路径 - 语言特定的案例研究目录
      const caseStudiesDirPath = path.join(process.cwd(), 'public', 'data', locale, 'case-studies');
      try {
        await fsPromises.access(caseStudiesDirPath);
        const files = await fsPromises.readdir(caseStudiesDirPath);
        const jsonFiles = files.filter(file => file.endsWith('.json'));
        
        // 提取所有案例ID并添加到集合中
        jsonFiles.forEach(file => {
          allCaseIds.add(file.replace('.json', ''));
        });
      } catch (error) {
        // 目录不存在，继续检查其他位置
        console.log(`Directory ${caseStudiesDirPath} does not exist`);
      }
    }
    
    // 2. 检查通用案例研究目录
    const commonCaseStudiesDirPath = path.join(process.cwd(), 'public', 'data', 'case-studies');
    try {
      await fsPromises.access(commonCaseStudiesDirPath);
      const commonFiles = await fsPromises.readdir(commonCaseStudiesDirPath);
      const commonJsonFiles = commonFiles.filter(file => file.endsWith('.json'));
      
      // 提取所有案例ID并添加到集合中
      commonJsonFiles.forEach(file => {
        allCaseIds.add(file.replace('.json', ''));
      });
    } catch (error) {
      // 目录不存在，继续检查其他位置
      console.log(`Directory ${commonCaseStudiesDirPath} does not exist`);
    }
    
    // 3. 检查旧目录 - 案例目录
    const casesDirPath = path.join(process.cwd(), 'public', 'data', 'cases');
    try {
      await fsPromises.access(casesDirPath);
      const casesFiles = await fsPromises.readdir(casesDirPath);
      const casesJsonFiles = casesFiles.filter(file => file.endsWith('.json'));
      
      // 提取所有案例ID并添加到集合中
      casesJsonFiles.forEach(file => {
        allCaseIds.add(file.replace('.json', ''));
      });
      
      // 检查每个语言的子目录
      for (const locale of locales) {
        const localeDir = path.join(casesDirPath, locale);
        try {
          await fsPromises.access(localeDir);
          const localeCasesFiles = await fsPromises.readdir(localeDir);
          const localeCasesJsonFiles = localeCasesFiles.filter(file => file.endsWith('.json'));
          
          // 提取所有案例ID并添加到集合中
          localeCasesJsonFiles.forEach(file => {
            allCaseIds.add(file.replace('.json', ''));
          });
        } catch (error) {
          // 子目录不存在，继续
        }
      }
    } catch (error) {
      // 目录不存在，继续
    }
    
    // 如果没有找到任何案例，返回默认案例
    if (allCaseIds.size === 0) {
      return [
        { locale: 'en', caseId: 'hainan-iron-tailings' },
        { locale: 'zh', caseId: 'hainan-iron-tailings' }
      ];
    }
    
    // 为每个语言和案例ID生成参数
    const caseStudyIds = Array.from(allCaseIds);
    return caseStudyIds.flatMap(caseId => 
      locales.map(locale => ({
        caseId,
        locale
      }))
    );
  } catch (error) {
    // 静默处理错误
    // 返回基本的静态参数，确保构建不会失败
    return [
      { locale: 'en', caseId: 'hainan-iron-tailings' },
      { locale: 'zh', caseId: 'hainan-iron-tailings' }
    ];
  }
}

// 获取案例数据
export async function getCaseData(locale: string, caseId: string) {
  try {
    // 1. 首先尝试从语言特定的案例研究目录中获取 (新的正确路径)
    const caseStudiesDirPath = path.join(process.cwd(), 'public', 'data', locale, 'case-studies');
    const caseStudiesPath = path.join(caseStudiesDirPath, `${caseId}.json`);
    
    // 检查案例研究文件是否存在
    if (fs.existsSync(caseStudiesPath)) {
      const data = await fsPromises.readFile(caseStudiesPath, 'utf8');
      return JSON.parse(data);
    }
    
    // 2. 尝试从通用案例研究目录中获取
    const commonCaseStudiesPath = path.join(process.cwd(), 'public', 'data', 'case-studies', `${caseId}.json`);
    if (fs.existsSync(commonCaseStudiesPath)) {
      const data = await fsPromises.readFile(commonCaseStudiesPath, 'utf8');
      const jsonData = JSON.parse(data);
      
      // 如果JSON包含多语言数据，返回对应语言的数据
      if (jsonData[locale]) {
        return jsonData[locale];
      }
      
      return jsonData;
    }
    
    // 3. 尝试从语言特定子目录中获取 (旧的实现)
    const localeDirPath = path.join(process.cwd(), 'public', 'data', 'cases', locale);
    const localePath = path.join(localeDirPath, `${caseId}.json`);
    
    // 检查语言特定文件是否存在
    if (fs.existsSync(localePath)) {
      const data = await fsPromises.readFile(localePath, 'utf8');
      return JSON.parse(data);
    }
    
    // 4. 如果语言特定文件不存在，尝试从根目录获取 (旧的实现)
    const rootPath = path.join(process.cwd(), 'public', 'data', 'cases', `${caseId}.json`);
    
    // 检查根目录文件是否存在
    if (fs.existsSync(rootPath)) {
      const data = await fsPromises.readFile(rootPath, 'utf8');
      const jsonData = JSON.parse(data);
      
      // 如果JSON包含多语言数据，返回对应语言的数据
      if (jsonData[locale]) {
        return jsonData[locale];
      }
      
      return jsonData;
    }
    
    // 文件不存在，返回null
    return null;
  } catch (error) {
    console.error(`Error reading case data for ${caseId}:`, error);
    // 捕获所有错误，返回null
    return null;
  }
}

// 动态生成案例详情页面元数据
export async function generateMetadata({ 
  params 
}: { 
  params: { caseId: string } 
}): Promise<Metadata> {
  // 使用固定的locale值
  const locale = 'en';
  const { caseId  } = await safelyGetRouteParams(params);
  
  // 获取案例数据
  const caseData = await getCaseData(locale, caseId);
  if (!caseData) {
    // 如果找不到数据，返回基本元数据
    return {
      title: 'Case Not Found | Zexin Mining Equipment',
      description: 'Sorry, the case you requested does not exist.',
    };
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.zexinmining.com';
  
  // 构建规范链接URL
  const canonicalUrl = `/${locale}/cases/${caseId}`;
  
  // 优先使用案例数据中的SEO配置
  if (caseData.seo) {
    return {
      title: caseData.seo.title || `${caseData.title} | Zexin Mining Equipment`,
      description: caseData.seo.description || caseData.description,
      keywords: caseData.seo.keywords || `${caseData.title},${caseData.category}`,
      alternates: {
        canonical: canonicalUrl,
        languages: {
          'zh-CN': `/zh/cases/${caseId}`,
          'en-US': `/en/cases/${caseId}`,
        },
      },
      openGraph: {
        title: caseData.seo.title || caseData.title,
        description: caseData.seo.description || caseData.description,
        url: `${baseUrl}${canonicalUrl}`,
        siteName: 'Zexin Mining Equipment',
        images: [
          {
            url: `${baseUrl}${caseData.imageSrc || caseData.images[0]}`,
            width: 1200,
            height: 630,
            alt: caseData.title,
          },
        ],
        locale: 'en_US',
        type: 'article',
      },
    };
  }
  
  // 为SEO描述和关键词提供默认值
  const seoDescription = caseData.description || `${caseData.title} - Zexin Mining Equipment Case Study`;
  const seoKeywords = `${caseData.title},${caseData.category},Zexin Mining Equipment,mining equipment,case study`;
  
  return {
    title: `${caseData.title} | Zexin Mining Equipment`,
    description: seoDescription,
    keywords: seoKeywords,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'zh-CN': `/zh/cases/${caseId}`,
        'en-US': `/en/cases/${caseId}`,
      },
    },
    openGraph: {
      title: caseData.title,
      description: caseData.description || seoDescription,
      url: `${baseUrl}${canonicalUrl}`,
      siteName: 'Zexin Mining Equipment',
      images: [
        {
          url: `${baseUrl}${caseData.imageSrc || caseData.images[0]}`,
          width: 1200,
          height: 630,
          alt: caseData.title,
        },
      ],
      locale: 'en_US',
      type: 'article',
    },
  };
}

export default async function CaseDetailPage({
  params
}: {
  params: { caseId: string }
}) {
  // 使用固定的locale值
  const locale = 'en';
  const { caseId  } = await safelyGetRouteParams(params);
  
  // 获取案例数据
  const caseData = await getCaseData(locale, caseId);
  
  // 如果找不到数据，返回404
  if (!caseData) {
    notFound();
  }
  
  // 获取面包屑配置
  const breadcrumbConfig = getBreadcrumbConfig(locale);
  
  // 准备面包屑导航  
  const breadcrumbItems = [
    { name: breadcrumbConfig.home.name, href: breadcrumbConfig.home.href },
    { name: 'Case Studies', href: `/${locale}/cases` },
    { name: caseData.title }
  ];
  
  // Base URL
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.zexinmining.com';
  
  // 结构化数据
  const breadcrumbStructuredData = getBreadcrumbStructuredData(
    breadcrumbItems.map(item => ({
      name: item.name,
      url: item.href || ''
    })),
    baseUrl
  );
  
  // 组织结构化数据
  const organizationStructuredData = getOrganizationStructuredData(false);
  
  // 网站结构化数据
  const websiteStructuredData = getWebsiteStructuredData(locale, baseUrl);
  
  // 案例结构化数据
  const caseStudyStructuredData = getCaseStudyStructuredData({
    caseId,
    caseData,
    locale,
    baseUrl
  });
  
  // 图片结构化数据
  const mainImage = caseData.imageSrc || (caseData.images && caseData.images[0]);
  const imageStructuredData = mainImage ? getImageStructuredData({
    url: mainImage,
    caption: caseData.title,
    description: caseData.description,
    baseUrl
  }) : null;
  
  // 组合所有结构化数据
  const structuredDataArray = [
    breadcrumbStructuredData,
    organizationStructuredData,
    websiteStructuredData,
    caseStudyStructuredData
  ];
  
  if (imageStructuredData) {
    structuredDataArray.push(imageStructuredData);
  }
  
  return (
    <>
      <MultiStructuredData dataArray={structuredDataArray} />
      <CaseDetailClient 
        locale={locale}
        breadcrumbItems={breadcrumbItems}
        caseDetail={caseData}
      />
    </>
  );
} 