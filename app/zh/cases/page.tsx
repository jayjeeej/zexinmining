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
  title: '矿山工程案例-金矿铁矿铜矿选矿项目 | 泽鑫矿山设备',
  description: '查看泽鑫全球矿山工程案例，展示金矿、铁矿、铜矿选矿工程技术实力，提供定制化矿山解决方案。',
  keywords: '矿山工程案例,金矿选矿项目,铁矿选矿项目,铜矿选矿项目,选矿工程,矿山设备,泽鑫矿山',
    alternates: {
    canonical: 'https://www.zexinmining.com/zh/cases',
      languages: {
        'en': 'https://www.zexinmining.com/en/cases',
        'zh': 'https://www.zexinmining.com/zh/cases'
      }
    }
  };

export default async function CasesPage() {
  // 使用固定的locale值
  const locale = 'zh';
  const isZh = true;
  const baseUrl = 'https://www.zexinmining.com';
  
  // 获取面包屑配置
  const breadcrumbConfig = getBreadcrumbConfig(locale);
  const breadcrumbItems = [
    { name: breadcrumbConfig.home.name, href: breadcrumbConfig.home.href },
    { name: '成功案例' }
  ];
  
  // 页面标题和描述
  const pageTitle = '成功案例';
  const pageDescription = '浏览泽鑫矿山设备在全球范围内完成的矿山工程项目案例，展示我们在采矿、选矿和尾矿处理领域的专业经验和技术实力。';
  
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
    pageName: '矿山工程案例 - 成功项目展示',
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
    'name': '矿山工程案例集',
    'description': pageDescription,
    'inLanguage': 'zh-CN',
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
        'name': '泽鑫矿山设备'
      },
      'publisher': {
        '@type': 'Organization',
        'name': '泽鑫矿山设备',
        'logo': {
          '@type': 'ImageObject',
          'url': `${baseUrl}/images/logo-zh.png`
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