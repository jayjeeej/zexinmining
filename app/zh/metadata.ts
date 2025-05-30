import type { Metadata } from 'next';
import { getOrganizationSchema } from '@/lib/seo';

export function generateHomeMetadata({ locale }: { locale: string }): Metadata {
  const isZh = locale === 'zh';
  
  return {
    title: '选矿设备制造商-矿山设备EPC服务供应商',
    description: '泽鑫矿山设备，20年专注选矿设备制造，提供破碎机、磨矿机、浮选机、磁选机等高效矿山解决方案，助力提高矿物回收率。',
    keywords: '选矿设备,矿山设备,破碎机,球磨机,浮选机,磁选机,重选设备,选矿厂设计,矿山EPC,泽鑫矿山',
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
        ? '泽鑫矿山设备，20年专注选矿设备制造，提供高效矿山解决方案，专业提高矿物回收率和资源高效利用。' 
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
        {
          url: 'https://www.zexinmining.com/images/homepage-og-square.jpg',
          width: 1080,
          height: 1080,
          alt: isZh ? '泽鑫矿山设备 - 专业矿山设备制造商' : 'Zexin Mining Equipment - Professional Mining Machinery Manufacturer',
        },
        {
          url: 'https://www.zexinmining.com/images/homepage-og-wechat.jpg',
          width: 400,
          height: 400,
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
        ? '泽鑫矿山设备提供高效选矿设备和专业矿山解决方案，助力矿物高效回收，20年行业经验。' 
        : 'Zexin Mining Equipment offers high-efficiency mining machinery and professional mining solutions with sustainable mining technologies.',
      images: ['https://www.zexinmining.com/images/homepage-og.jpg'],
    },
  };
} 