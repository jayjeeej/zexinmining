import { generateHomeMetadata } from '../[locale]/metadata';
import ClientHomePage from './ClientHomePage';
import { getHomePageStructuredData, getOrganizationStructuredData, getLocalBusinessStructuredData } from '@/lib/structuredData';
import { getOrganizationSchema, getLocalBusinessSchema } from '@/lib/seo';
import { MultiStructuredData } from '@/components/StructuredData';

export const metadata = generateHomeMetadata({ locale: 'en' });

export default async function Home({ params }: { params: { locale: string } }) {
  const { locale } = await Promise.resolve(params);
  const isZh = locale === 'zh';
  
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