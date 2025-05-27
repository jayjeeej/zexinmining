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
      canonical: `https://zexinmining.com/${locale}`,
      languages: {
        'en': 'https://zexinmining.com/en',
        'zh': 'https://zexinmining.com/zh',
      },
    },
    openGraph: {
      title: isZh ? '泽鑫矿山设备 - 专业矿山设备供应商 | 全面矿山解决方案' : 'Zexin Mining Equipment - Professional Mining Equipment Supplier | Comprehensive Mining Solutions',
      description: isZh 
        ? '泽鑫矿山设备是专业的矿山设备供应商，提供高效可靠的矿山机械和专业矿山解决方案，实现资源高效回收和可持续矿业技术应用。' 
        : 'Zexin Mining Equipment is a professional mining equipment supplier offering high-efficiency machinery and comprehensive mining solutions with sustainable mining technologies for global customers.',
      url: `https://zexinmining.com/${locale}`,
      siteName: isZh ? '泽鑫矿山设备' : 'Zexin Mining Equipment',
      images: [
        {
          url: 'https://zexinmining.com/images/homepage-og.jpg',
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
      images: ['https://zexinmining.com/images/homepage-og.jpg'],
    },
  };
} 