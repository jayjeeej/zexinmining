import { Metadata } from 'next';
import MiningEpcServiceClient from './MiningEpcServiceClient';
import { getServiceStructuredData, getOrganizationStructuredData, getBreadcrumbStructuredData } from '@/lib/structuredData';
import { getBreadcrumbConfig } from '@/lib/navigation';

export const dynamic = 'force-static'; // 强制静态生成
export const revalidate = 3600; // 每小时重新验证一次

// 矿山EPC服务页面服务端组件
export default async function MiningEpcServicePage({ params }: { params: { locale: string } }) {
  // 硬编码为英文版
  const locale = 'en';
  const isZh = false;
  const baseUrl = 'https://www.zexinmining.com';
  
  // 面包屑配置
  const breadcrumbConfig = getBreadcrumbConfig(locale);
  const breadcrumbItems = [
    { name: breadcrumbConfig.home.name, url: breadcrumbConfig.home.href },
    { name: breadcrumbConfig.products.name, url: breadcrumbConfig.products.href },
    { name: isZh ? '矿山EPC服务' : 'Mining EPC Services' }
  ];
  
  // 准备结构化数据
  // 1. 服务结构化数据
  const serviceStructuredData = getServiceStructuredData({
    serviceId: 'mining-epc',
    serviceName: isZh ? '矿山EPC服务' : 'Mining EPC Services',
    serviceDescription: isZh
      ? '泽鑫矿山设备提供从设计到运营的一站式矿业产业链服务，包括咨询、设计、设备制造与采购、施工、运营管理等全方位EPCMO服务。'
      : 'Zexin Mining Equipment provides one-stop mining industry chain services from design to operation, including consulting, design, equipment manufacturing and procurement, construction, operation management, and other comprehensive EPCMO services.',
    serviceType: isZh ? '矿业工程总承包' : 'Mining Engineering, Procurement and Construction',
    serviceProvider: isZh ? '泽鑫矿山设备' : 'Zexin Mining Equipment',
    serviceItems: isZh 
      ? ['矿山工程设计', '选矿厂设计与建设', '采矿工程', '设备选型与采购', '调试与运营维护', '技术支持与培训'] 
      : ['Mine Engineering Design', 'Mineral Processing Plant Design and Construction', 'Mining Engineering', 'Equipment Selection and Procurement', 'Commissioning and Operation Maintenance', 'Technical Support and Training'],
    locale,
    baseUrl
  });
  
  // 2. 组织结构化数据
  const organizationStructuredData = getOrganizationStructuredData(isZh);
  
  // 3. 面包屑结构化数据
  const breadcrumbStructuredData = getBreadcrumbStructuredData(breadcrumbItems, baseUrl);
  
  // 4. 网页结构化数据
  const webPageStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${baseUrl}/${locale}/products/mining-epc`,
    "url": `${baseUrl}/${locale}/products/mining-epc`,
    "name": isZh ? '矿山EPC服务 - 矿业全产业链解决方案' : 'Mining EPC Services - Full Mining Industry Chain Solutions',
    "description": isZh
      ? '泽鑫矿山设备提供从设计到运营的一站式矿业产业链服务，包括咨询、设计、设备制造与采购、施工、运营管理等全方位EPCMO服务。'
      : 'Complete turnkey mining solutions from Zexin: Engineering, Procurement, Construction & Operations. Expert mine design, equipment selection, and project management for successful mining projects.',
    "isPartOf": {
      "@type": "WebSite",
      "url": baseUrl,
      "name": isZh ? "泽鑫矿山设备官网" : "Zexin Mining Equipment Official Website"
    },
    "inLanguage": isZh ? "zh-CN" : "en-US",
    "potentialAction": {
      "@type": "ReadAction",
      "target": [
        `${baseUrl}/${locale}/products/mining-epc`
      ]
    },
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": ["h1", ".description"]
    }
  };
  
  return (
    <>
      {/* 使用独立script标签注入各结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceStructuredData) }}
      />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
      />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageStructuredData) }}
      />
      
      <MiningEpcServiceClient />
    </>
  );
}

// 生成页面元数据
export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  // 硬编码为英文版
  const locale = 'en';
  const isZh = false;
  
  // 优化标题长度，确保不超过70个字符
  const optimizedTitle = isZh 
    ? '矿山EPC服务 - 泽鑫矿山设备' 
    : 'Mining EPC Services - Zexin Mining Equipment';
  
  return {
    title: optimizedTitle,
    description: isZh
      ? '泽鑫矿山设备提供从设计到运营的一站式矿业产业链服务，包括咨询、设计、设备制造与采购、施工、运营管理等全方位EPCMO服务。'
      : 'Complete turnkey mining solutions from Zexin: Engineering, Procurement, Construction & Operations. Expert mine design, equipment selection, and project management for successful mining projects.',
    alternates: {
      canonical: `https://www.zexinmining.com/${locale}/products/mining-epc`,
      languages: {
        'en': 'https://www.zexinmining.com/en/products/mining-epc',
        'zh': 'https://www.zexinmining.com/zh/products/mining-epc'
      }
    },
    openGraph: {
      title: isZh 
        ? '矿山EPC服务 - 矿业全产业链解决方案 - 泽鑫矿山设备' 
        : 'Mining EPC Services - Full Mining Industry Chain Solutions - Zexin Mining Equipment',
      description: isZh
        ? '泽鑫矿山设备提供从设计到运营的一站式矿业产业链服务，包括咨询、设计、设备制造与采购、施工、运营管理等全方位EPCMO服务。'
        : 'Complete turnkey mining solutions from Zexin: Engineering, Procurement, Construction & Operations. Expert mine design, equipment selection, and project management for successful mining projects.',
      url: `https://www.zexinmining.com/${locale}/products/mining-epc`,
      siteName: isZh ? '泽鑫矿山设备' : 'Zexin Mining Equipment',
      locale: isZh ? 'zh_CN' : 'en_US',
      type: 'website',
      images: [
        {
          url: 'https://www.zexinmining.com/images/products/mining-epc-contract-hero.jpg',
          width: 1200,
          height: 630,
          alt: isZh ? '矿山EPC服务' : 'Mining EPC Services'
        }
      ]
    }
  };
} 