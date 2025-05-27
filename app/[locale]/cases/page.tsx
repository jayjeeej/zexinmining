import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBreadcrumbConfig } from '@/lib/navigation';
import { 
  getBreadcrumbStructuredData, 
  getOrganizationStructuredData,
  getWebsiteStructuredData 
} from '@/lib/structuredData';
import { MultiStructuredData } from '@/components/StructuredData';
import CasesPageClient from './CasesPageClient';
import { safelyGetRouteParams } from '@/lib/utils';
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

// 案例页面元数据生成
export async function generateMetadata({ 
  params 
}: { 
  params: { locale: string } 
}): Promise<Metadata> {
  // 安全获取路由参数
  const safeParams = await safelyGetRouteParams(params);
  const { locale } = safeParams;
  const isZh = locale === 'zh';
  
  const title = isZh ? '成功案例 | 泽鑫矿山设备' : 'Case Studies | Zexin Mining Equipment';
  const description = isZh 
    ? '泽鑫矿山设备成功案例展示 - 查看我们在全球范围内完成的矿山工程项目，展示我们在采矿、选矿和尾矿处理领域的专业经验和技术实力。'
    : 'Zexin Mining Equipment Case Studies - Explore our completed mining engineering projects worldwide, showcasing our expertise in mining, mineral processing, and tailings management.';
  
  return {
    title,
    description,
    alternates: {
      canonical: `https://zexinmining.com/${locale}/cases`,
      languages: {
        'en': 'https://zexinmining.com/en/cases',
        'zh': 'https://zexinmining.com/zh/cases'
      }
    }
  };
}

export default async function CasesPage({ 
  params 
}: { 
  params: { locale: string } 
}) {
  // 安全获取路由参数
  const safeParams = await safelyGetRouteParams(params);
  const { locale } = safeParams;
  
  // 确保locale参数有效
  if (locale !== 'en' && locale !== 'zh') {
    return notFound();
  }
  
  const isZh = locale === 'zh';
  
  // 获取面包屑配置
  const breadcrumbConfig = getBreadcrumbConfig(locale);
  const breadcrumbItems = [
    { name: breadcrumbConfig.home.name, href: breadcrumbConfig.home.href },
    { name: isZh ? '成功案例' : 'Case Studies' }
  ];
  
  // 页面标题和描述
  const pageTitle = isZh ? '成功案例' : 'Case Studies';
  const pageDescription = isZh 
    ? '浏览泽鑫矿山设备在全球范围内完成的矿山工程项目案例，展示我们在采矿、选矿和尾矿处理领域的专业经验和技术实力。'
    : 'Browse through Zexin Mining Equipment\'s completed mining engineering projects worldwide, showcasing our expertise in mining, mineral processing, and tailings management.';
  
  // 获取所有案例研究数据
  const casesList = await getAllCaseStudies(locale);
  
  // 结构化数据
  const baseUrl = 'https://zexinmining.com';
  const breadcrumbStructuredData = getBreadcrumbStructuredData(
    breadcrumbItems.map(item => ({
      name: item.name,
      url: item.href
    })),
    baseUrl
  );
  
  const organizationStructuredData = getOrganizationStructuredData(isZh);
  
  const websiteStructuredData = getWebsiteStructuredData(locale, baseUrl);
  
  const structuredDataArray = [
    breadcrumbStructuredData,
    organizationStructuredData,
    websiteStructuredData
  ];
  
  return (
    <>
      {/* SEO结构化数据 */}
      <MultiStructuredData dataArray={structuredDataArray} />
      
      {/* 客户端组件 */}
      <CasesPageClient 
        locale={locale}
        breadcrumbItems={breadcrumbItems}
        pageTitle={pageTitle}
        pageDescription={pageDescription}
        casesList={casesList}
      />
    </>
  );
} 