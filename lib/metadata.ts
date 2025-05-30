import type { Metadata } from 'next';
import { getOrganizationSchema } from '@/lib/seo';

export function generateHomeMetadata({ locale }: { locale: string }): Metadata {
  const isZh = locale === 'zh';
  
  return {
    title: isZh ? '泽鑫矿山设备 - 专业矿山设备制造商 | 选矿设备解决方案供应商' : 'Zexin Mining Equipment - Professional Mining Machinery Manufacturer | Mineral Processing Solutions',
    description: isZh 
      ? '泽鑫矿山设备是专业的矿山设备供应商，提供高效可靠的矿山机械和选矿设备，包括破碎机、磨矿机、浮选机、磁选机、重选设备等。我们为全球矿业客户提供全面的矿山解决方案，实现资源高效回收和可持续矿业技术应用。' 
      : 'Zexin Mining Equipment is a professional mining equipment supplier offering high-efficiency and reliable mining machinery and mineral processing equipment. We provide comprehensive mining solutions and sustainable mining technologies for global mining customers to achieve efficient resource recovery and environmentally friendly production.',
    keywords: isZh 
      ? '矿山设备,矿山设备供应商,选矿设备,专业矿山解决方案,破碎设备,磨矿设备,浮选设备,磁选设备,重选设备,螺旋溜槽,跳汰机,可持续矿业技术,采矿设备,矿物加工,金矿选矿,铁矿选矿,锡矿选矿,矿山机械' 
      : 'mining equipment,mining equipment supplier,mineral processing equipment,professional mining solutions,crushing equipment,grinding equipment,flotation equipment,magnetic separation equipment,gravity separation equipment,spiral chute,jig machine,sustainable mining technology,mining machinery,mineral processing,gold ore processing,iron ore processing,tin ore processing',
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `https://www.zexinmining.com/${locale}`,
      languages: {
        'en': 'https://www.zexinmining.com/en',
        'zh': 'https://www.zexinmining.com/zh',
      },
    },
    openGraph: {
      title: isZh ? '泽鑫矿山设备 - 专业矿山设备供应商 | 全面矿山解决方案' : 'Zexin Mining Equipment - Professional Mining Equipment Supplier | Comprehensive Mining Solutions',
      description: isZh 
        ? '泽鑫矿山设备是专业的矿山设备供应商，提供高效可靠的矿山机械和专业矿山解决方案，实现资源高效回收和可持续矿业技术应用。' 
        : 'Zexin Mining Equipment is a professional mining equipment supplier offering high-efficiency machinery and comprehensive mining solutions with sustainable mining technologies for global customers.',
      url: `https://www.zexinmining.com/${locale}`,
      siteName: isZh ? '泽鑫矿山设备' : 'Zexin Mining Equipment',
      images: [
        {
          url: 'https://www.zexinmining.com/images/homepage-og.jpg',
          width: 1200,
          height: 630,
          alt: isZh ? '泽鑫矿山设备 - 专业矿山设备制造商' : 'Zexin Mining Equipment - Professional Mining Machinery Manufacturer',
        },
      ],
      locale: locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: isZh ? '泽鑫矿山设备 - 专业矿山设备供应商 | 可持续矿业技术' : 'Zexin Mining Equipment - Professional Mining Equipment Supplier | Sustainable Mining Technologies',
      description: isZh 
        ? '泽鑫矿山设备提供高效可靠的矿山机械和专业矿山解决方案，助力可持续矿业技术应用。' 
        : 'Zexin Mining Equipment offers high-efficiency mining machinery and professional mining solutions with sustainable mining technologies.',
      images: ['https://www.zexinmining.com/images/homepage-og.jpg'],
    },
  };
}

// 添加更多的元数据生成函数
export function getMineralProcessingMetadata({ locale }: { locale: string }): Metadata {
  const isZh = locale === 'zh';
  
  return {
    title: isZh 
      ? '矿物加工设备和解决方案 | 高效选矿工艺 - 泽鑫矿山设备' 
      : 'Mineral Processing Equipment & Solutions | Efficient Beneficiation - Zexin Mining',
    description: isZh 
      ? '泽鑫矿山设备提供全方位矿物加工解决方案和先进选矿设备，包括破碎、磨矿、浮选、磁选、重选设备，满足不同矿种选矿需求，提高回收率，降低成本。' 
      : 'Zexin Mining Equipment offers comprehensive mineral processing solutions and advanced beneficiation equipment including crushing, grinding, flotation, magnetic and gravity separation to meet various ore processing requirements, increasing recovery rates and reducing costs.',
    keywords: isZh 
      ? '矿物加工,选矿设备,矿物加工解决方案,选矿工艺,破碎设备,磨矿设备,浮选设备,磁选设备,重选设备,筛分设备,分级设备,脱水设备,高效选矿,节能环保' 
      : 'mineral processing,ore dressing equipment,mineral processing solutions,beneficiation process,crushing equipment,grinding equipment,flotation equipment,magnetic separation,gravity separation,screening equipment,classification,dewatering,efficient beneficiation,energy saving',
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `https://www.zexinmining.com/${locale}/products/ore-processing`,
      languages: {
        'en': 'https://www.zexinmining.com/en/products/ore-processing',
        'zh': 'https://www.zexinmining.com/zh/products/ore-processing',
      },
    },
    openGraph: {
      title: isZh 
        ? '矿物加工设备与解决方案 | 先进选矿工艺 - 泽鑫矿山设备' 
        : 'Mineral Processing Equipment & Solutions | Advanced Beneficiation - Zexin Mining',
      description: isZh 
        ? '泽鑫矿山设备提供专业矿物加工解决方案和先进选矿设备，提高回收率，降低成本。' 
        : 'Zexin Mining Equipment offers professional mineral processing solutions and advanced beneficiation equipment, increasing recovery rates and reducing costs.',
      url: `https://www.zexinmining.com/${locale}/products/ore-processing`,
      siteName: isZh ? '泽鑫矿山设备' : 'Zexin Mining Equipment',
      images: [
        {
          url: 'https://www.zexinmining.com/images/mineral-processing-og.jpg',
          width: 1200,
          height: 630,
          alt: isZh ? '矿物加工设备和解决方案 - 泽鑫矿山设备' : 'Mineral Processing Equipment & Solutions - Zexin Mining',
        },
      ],
      locale: locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: isZh 
        ? '矿物加工设备与解决方案 | 高效选矿工艺 - 泽鑫' 
        : 'Mineral Processing Equipment & Solutions | Efficient Beneficiation - Zexin',
      description: isZh 
        ? '泽鑫矿山设备提供专业矿物加工解决方案和先进选矿设备，满足各种矿石处理需求。' 
        : 'Zexin Mining Equipment offers professional mineral processing solutions and advanced beneficiation equipment for various ore processing requirements.',
      images: ['https://www.zexinmining.com/images/mineral-processing-og.jpg'],
    },
  };
} 