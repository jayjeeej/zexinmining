import type { Metadata } from 'next';
import { getOrganizationSchema } from '@/lib/seo';

export function generateHomeMetadata({ locale }: { locale: string }): Metadata {
  const isZh = locale === 'zh';
  
  return {
    title: 'Mining Equipment Manufacturer - Mineral Processing Solutions',
    description: isZh 
      ? '泽鑫矿山设备是专业的矿山设备供应商，提供高效可靠的矿山机械和选矿设备，包括破碎机、磨矿机、浮选机、磁选机、重选设备等。我们为全球矿业客户提供全面的矿山解决方案，实现资源高效回收和可持续矿业技术应用。' 
      : 'Premium mining equipment manufacturer with 20+ years expertise. Offering complete mineral processing solutions including crushers, grinding mills, flotation and magnetic separation equipment to maximize recovery rates.',
    keywords: isZh 
      ? '矿山设备,矿山设备供应商,选矿设备,专业矿山解决方案,破碎设备,磨矿设备,浮选设备,磁选设备,重选设备,螺旋溜槽,跳汰机,可持续矿业技术,采矿设备,矿物加工,金矿选矿,铁矿选矿,锡矿选矿,矿山机械' 
      : 'mining equipment,mineral processing,ore processing,crushing equipment,grinding mill,flotation machine,magnetic separator,gravity separator,mining EPC,Zexin Mining',
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
        : 'Zexin delivers high-quality mining equipment and turnkey mineral processing solutions. 20+ years expertise in designing efficient machinery for sustainable mining operations worldwide.',
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
        : 'Expert mining equipment manufacturer with complete mineral processing solutions. From crushers to flotation machines - maximize recovery rates with our technology.',
      images: ['https://www.zexinmining.com/images/homepage-og.jpg'],
    },
  };
} 