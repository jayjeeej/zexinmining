import { generateHomeMetadata } from './metadata';
import ClientHomePage from './ClientHomePage';
import { getHomePageStructuredData, getOrganizationStructuredData, getLocalBusinessStructuredData } from '@/lib/structuredData';

export const metadata = generateHomeMetadata({ locale: 'en' });

export default async function Home() {
  // 使用固定的locale值
  const locale = 'en';
  const isZh = false;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.zexinmining.com';
  
  // 从structuredData.ts获取更新后的结构化数据
  const websiteStructuredData = getHomePageStructuredData(locale);
  const organizationStructuredData = getOrganizationStructuredData(isZh);
  const localBusinessStructuredData = getLocalBusinessStructuredData(locale);

  return (
    <>
      {/* 使用独立script标签注入各结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }}
      />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
      />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessStructuredData) }}
      />
      
      <ClientHomePage locale={locale} />
    </>
  );
} 