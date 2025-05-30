import { Metadata } from 'next';
import MiningEpcServiceClient from './MiningEpcServiceClient';
import { getServiceStructuredData, getOrganizationStructuredData, getBreadcrumbStructuredData } from '@/lib/structuredData';
import { MultiStructuredData } from '@/components/StructuredData';
import { getBreadcrumbConfig } from '@/lib/navigation';

export const dynamic = 'force-static'; // 强制静态生成
export const revalidate = 3600; // 每小时重新验证一次

// 矿山EPC服务页面服务端组件
export default async function MiningEpcServicePage({ params }: { params: { locale: string } }) {
  // 确保在使用 params.locale 前先等待参数
  const { locale } = await Promise.resolve(params);
  const isZh = locale === 'zh';
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
  
  // 组合所有结构化数据
  const structuredDataArray = [
    serviceStructuredData,
    organizationStructuredData,
    breadcrumbStructuredData
  ];
  
  return (
    <>
      {/* 使用MultiStructuredData组件注入结构化数据 */}
      <MultiStructuredData dataArray={structuredDataArray} />
      <MiningEpcServiceClient locale={locale} />
    </>
  );
}

// 生成页面元数据
export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  // 确保在使用 params.locale 前先等待参数
  const { locale } = await Promise.resolve(params);
  const isZh = locale === 'zh';
  
  return {
    title: isZh 
      ? '矿山EPC服务 - 矿业全产业链解决方案 - 泽鑫矿山设备' 
      : 'Mining EPC Services - Full Mining Industry Chain Solutions - Zexin Mining Equipment',
    description: isZh
      ? '泽鑫提供矿山工程总承包服务，涵盖工程设计、设备采购、施工安装、运营管理，一站式EPCMO解决方案，助力矿企降本增效，打造智能化矿山。'
      : 'Complete turnkey mining solutions from Zexin: Engineering, Procurement, Construction & Operations. Expert mine design, equipment selection, and project management for successful mining projects.',
    alternates: {
      canonical: `https://www.zexinmining.com/${locale}/products/mining-epc`,
      languages: {
        'en': 'https://www.zexinmining.com/en/products/mining-epc',
        'zh': 'https://www.zexinmining.com/zh/products/mining-epc'
      }
    }
  };
} 