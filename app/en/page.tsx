import { generateHomeMetadata } from './metadata';
import ClientHomePage from './ClientHomePage';
import { getHomePageStructuredData, getOrganizationStructuredData, getLocalBusinessStructuredData } from '@/lib/structuredData';
import { getOrganizationSchema, getLocalBusinessSchema } from '@/lib/seo';
import { MultiStructuredData } from '@/components/StructuredData';

export const metadata = generateHomeMetadata({ locale: 'en' });

export default async function Home() {
  // 使用固定的locale值
  const locale = 'en';
  const isZh = false;
  
  // 从structuredData.ts获取更新后的结构化数据
  const websiteStructuredData = getHomePageStructuredData(locale);
  const organizationStructuredData = getOrganizationStructuredData(isZh);
  const localBusinessStructuredData = getLocalBusinessStructuredData(locale);
  
  // 组合成数组供MultiStructuredData组件使用
  const structuredDataArray = [
    websiteStructuredData,
    organizationStructuredData,
    localBusinessStructuredData
  ];

  return (
    <>
      <MultiStructuredData dataArray={structuredDataArray} />
      <ClientHomePage locale={locale} />
    </>
  );
} 