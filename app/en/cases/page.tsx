import { Metadata } from 'next';
import { getBreadcrumbConfig } from '@/lib/navigation';
import { 
  getBreadcrumbStructuredData, 
  getOrganizationStructuredData,
  getWebsiteStructuredData,
  getWebPageStructuredData
} from '@/lib/structuredData';
import CasesPageClient from './CasesPageClient';
import fs from 'fs';
import path from 'path';

// 获取所有案例研究数据
export async function getAllCaseStudies(locale: string) {
  const casesList = [];
  
  try {
    // 1. 检查语言特定的案例研究目录
    const caseStudiesDirPath = path.join(process.cwd(), 'public', 'data', locale, 'case-studies');
    
    if (fs.existsSync(caseStudiesDirPath)) {
      const files = await fs.promises.readdir(caseStudiesDirPath);
      const jsonFiles = files.filter(file => file.endsWith('.json'));
      
      for (const file of jsonFiles) {
        try {
          const filePath = path.join(caseStudiesDirPath, file);
          const data = await fs.promises.readFile(filePath, 'utf8');
          const caseData = JSON.parse(data);
          
          // 添加slug字段
          caseData.slug = file.replace('.json', '');
          
          casesList.push(caseData);
        } catch (error) {
          console.error(`Error reading case study file ${file}:`, error);
        }
      }
    }
    
    // 2. 如果需要，可以考虑添加其他目录的检查
    
    return casesList;
  } catch (error) {
    console.error('Error reading case studies:', error);
    return [];
  }
}

// 案例页面元数据
export const metadata: Metadata = {
  title: 'Mining Project Cases - Gold, Iron & Copper Processing Plants | Zexin Mining',
  description: 'Explore our global mining project portfolio showcasing successful mineral processing solutions for gold, iron and copper mines. Custom engineering expertise delivering superior recovery rates and efficiency.',
  keywords: 'mining project cases,gold processing plant,iron ore project,copper processing plant,mineral processing,mining equipment,Zexin Mining',
  alternates: {
    canonical: 'https://www.zexinmining.com/en/cases',
    languages: {
      'en': 'https://www.zexinmining.com/en/cases',
      'zh': 'https://www.zexinmining.com/zh/cases'
    }
  }
};

export default async function CasesPage() {
  // 使用固定的locale值
  const locale = 'en';
  const isZh = false;
  const baseUrl = 'https://www.zexinmining.com';
  
  // 获取面包屑配置
  const breadcrumbConfig = getBreadcrumbConfig(locale);
  const breadcrumbItems = [
    { name: breadcrumbConfig.home.name, href: breadcrumbConfig.home.href },
    { name: 'Case Studies' }
  ];
  
  // 页面标题和描述
  const pageTitle = 'Case Studies';
  const pageDescription = 'Browse through Zexin Mining Equipment\'s completed mining engineering projects worldwide, showcasing our expertise in mining, mineral processing, and tailings management.';
  
  // 获取所有案例研究数据
  const casesList = await getAllCaseStudies(locale);
  
  // 结构化数据
  // 1. 面包屑结构化数据
  const breadcrumbStructuredData = getBreadcrumbStructuredData(
    breadcrumbItems.map(item => ({
      name: item.name,
      url: item.href
    })),
    baseUrl
  );
  
  // 2. 组织结构化数据
  const organizationStructuredData = getOrganizationStructuredData(isZh);
  
  // 3. 网站结构化数据
  const websiteStructuredData = getWebsiteStructuredData(locale, baseUrl);
  
  // 4. 网页结构化数据
  const pageUrl = `${baseUrl}/${locale}/cases`;
  const webPageStructuredData = getWebPageStructuredData({
    pageUrl,
    pageName: 'Mining Project Cases - Success Stories',
    description: pageDescription,
    locale,
    baseUrl,
    images: casesList.slice(0, 3).map(caseItem => caseItem.imageSrc || `/images/cases/${caseItem.slug}/plant-layout.jpg`),
    breadcrumbId: `${pageUrl}#breadcrumb`
  });
  
  // 5. 集合页面结构化数据（针对案例集合）
  const collectionPageStructuredData = {
    '@context': 'https://schema.org/',
    '@type': 'CollectionPage',
    '@id': `${pageUrl}#collectionpage`,
    'url': pageUrl,
    'name': 'Mining Project Case Studies',
    'description': pageDescription,
    'inLanguage': 'en-US',
    'isPartOf': {
      '@id': `${baseUrl}/#website`
    },
    'breadcrumb': {
      '@id': `${pageUrl}#breadcrumb`
    },
    'numberOfItems': casesList.length,
    'itemListElement': casesList.map((caseItem, index) => ({
      '@type': 'Article',
      'position': index + 1,
      'url': `${baseUrl}/${locale}/cases/${caseItem.slug}`,
      'name': caseItem.title,
      'description': caseItem.summary || caseItem.description || '',
      'image': caseItem.imageSrc || `/images/cases/${caseItem.slug}/plant-layout.jpg`,
      'author': {
        '@type': 'Organization',
        'name': 'Zexin Mining Equipment'
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'Zexin Mining Equipment',
        'logo': {
          '@type': 'ImageObject',
          'url': `${baseUrl}/images/logo-en.png`
        }
      }
    }))
  };
  
  return (
    <>
      {/* 使用独立script标签注入各结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
      />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }}
      />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageStructuredData) }}
      />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageStructuredData) }}
      />
      
      {/* 客户端组件 - 不再传递locale参数 */}
      <CasesPageClient 
        breadcrumbItems={breadcrumbItems}
        pageTitle={pageTitle}
        pageDescription={pageDescription}
        casesList={casesList}
      />
    </>
  );
} 