import { Metadata } from 'next';
import { siteUrl } from './constant';

// 默认SEO配置
export const defaultSEO = {
  titleTemplate: '%s | 泽鑫矿山设备',
  defaultTitle: '泽鑫矿山设备 - 专业矿山设备制造商',
  description: '泽鑫矿山设备是专业矿山设备制造商，为全球客户提供高效可靠的智能解决方案和全面技术支持',
  keywords: '矿山设备,采矿设备,泽鑫,采矿解决方案,采矿技术,工业装备,钻机,露天矿',
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://zexinmining.com/',
    siteName: '泽鑫矿山设备',
    images: [
      {
        url: 'https://zexinmining.com/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '泽鑫矿山设备',
      },
    ],
  },
  twitter: {
    cardType: 'summary_large_image',
  },
};

// 英文版本SEO配置
export const defaultEnglishSEO = {
  titleTemplate: '%s | Zexin Mining Equipment',
  defaultTitle: 'Zexin Mining Equipment - Professional Mining Equipment Manufacturer',
  description: 'Zexin Mining Equipment is a professional mining equipment manufacturer, providing efficient and intelligent solutions with comprehensive technical support worldwide',
  keywords: 'mining equipment,excavation,Zexin,mining solutions,mining technology,industrial equipment,drilling,open pit mining',
  openGraph: {
    locale: 'en_US',
  },
};

// Schema.org 类型常量
export const SCHEMA_TYPES = {
  PRODUCT: 'Product',
  ORGANIZATION: 'Organization',
  ARTICLE: 'Article',
  LOCAL_BUSINESS: 'LocalBusiness',
  FAQ: 'FAQPage'
};

// 产品SEO配置
export const productSEO = {
  openGraph: {
    type: 'product',
  }
};

// 文章SEO配置
export const articleSEO = {
  openGraph: {
    type: 'article',
  }
};

// 统一的构建元数据函数
export function buildMetadata({
  title,
  description,
  keywords,
  locale = 'zh',
  path = '',
  ogType = 'website' as const,
  ogImage = null,
  ogAlt = '',
  ogTitle = '',
  ogDescription = ''
}: {
  title: string;
  description: string;
  keywords: string;
  locale?: string;
  path?: string;
  ogType?: 'website' | 'article' | 'book' | 'profile' | 'music.song' | 'music.album' | 'music.playlist' | 'music.radio_station' | 'video.movie' | 'video.episode' | 'video.tv_show' | 'video.other';
  ogImage?: string | null;
  ogAlt?: string;
  ogTitle?: string;
  ogDescription?: string;
}): Metadata {
  const isZh = locale === 'zh';
  const siteUrl = 'https://zexinmining.com';
  const canonicalUrl = `${siteUrl}/${locale}${path}`;
  
  return {
    title,
    description,
    keywords,
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'zh': `${siteUrl}/zh${path}`,
        'en': `${siteUrl}/en${path}`,
      },
    },
    openGraph: {
      type: ogType,
      title: ogTitle || title,
      description: ogDescription || description,
      url: canonicalUrl,
      siteName: isZh ? '泽鑫矿山设备' : 'Zexin Mining Equipment',
      images: [
        {
          url: ogImage || `/api/og?title=${encodeURIComponent(ogTitle || title.split(' | ')[0])}&subtitle=${encodeURIComponent(isZh ? '泽鑫矿山设备' : 'Zexin Mining Equipment')}&locale=${locale}`,
          width: 1200,
          height: 630,
          alt: ogAlt || (isZh ? '泽鑫矿山设备' : 'Zexin Mining Equipment'),
        }
      ],
      locale,
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle || title,
      description: ogDescription || description,
    },
  };
}

// 添加导出函数getMineralProcessingMetadata
export * from '../app/[locale]/metadata';

// 组织架构数据
export function getOrganizationSchema(isZh: boolean) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": isZh ? "泽鑫矿山设备" : "Zexin Mining Equipment",
    "alternateName": isZh ? "泽鑫矿山设备有限公司" : "Zexin Mining Equipment Co., Ltd.",
    "url": "https://zexinmining.com",
    "logo": "https://zexinmining.com/logo/logo-social.png",
    "sameAs": [
      "https://www.linkedin.com/company/zexinmining",
      "https://twitter.com/zexinmining",
      "https://www.facebook.com/zexinmining"
    ],
    "description": isZh 
      ? "泽鑫矿山设备专业生产矿山机械和选矿设备，提供破碎机、磨矿机、浮选机、磁选机、重选设备等全套解决方案，为全球矿业客户创造价值。" 
      : "Zexin Mining Equipment specializes in manufacturing mining machinery and mineral processing equipment, providing comprehensive solutions including crushers, grinding mills, flotation machines, magnetic separators and gravity separation equipment, creating value for global mining customers.",
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+86-123-4567-8901",
        "contactType": "customer service",
        "availableLanguage": ["Chinese", "English"],
        "email": "info@zexinmining.com"
      },
      {
        "@type": "ContactPoint",
        "telephone": "+86-123-4567-8902",
        "contactType": "technical support",
        "availableLanguage": ["Chinese", "English"],
        "email": "support@zexinmining.com"
      }
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "China",
      "addressLocality": isZh ? "上海市" : "Shanghai",
      "addressRegion": isZh ? "上海" : "Shanghai",
      "postalCode": "200000",
      "streetAddress": isZh ? "浦东新区张江高科技园区" : "Zhangjiang Hi-Tech Park, Pudong New Area"
    },
    "foundingDate": "2005-01-15",
    "numberOfEmployees": {
      "@type": "QuantitativeValue",
      "value": "250+"
    },
    "areaServed": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": 31.2304,
        "longitude": 121.4737
      },
      "geoRadius": "5000 km"
    }
  };
}

// 获取关键词函数
export function getKeywords(type: string, locale: string, specificKeywords?: string): string {
  const isZh = locale === 'zh';
  
  // 基础关键词对象
  const keywordsMap: Record<string, { zh: string, en: string }> = {
    'home': {
      zh: '矿山设备,选矿设备,破碎设备,磨矿设备,浮选设备,磁选设备,重选设备,矿山解决方案,采矿设备,泽鑫',
      en: 'mining equipment,mineral processing equipment,crushing equipment,grinding equipment,flotation equipment,magnetic separation equipment,gravity separation equipment,mining solutions,mining machinery,Zexin'
    },
    'products': {
      zh: '矿山设备,选矿设备,破碎机,磨矿机,浮选机,磁选机,重选设备,筛分设备,泽鑫,选矿工艺,节能环保,矿山机械',
      en: 'mining equipment,mineral processing equipment,crushers,grinding mills,flotation machines,magnetic separators,gravity separation equipment,screening equipment,Zexin,mineral processing technology,energy-saving,mining machinery'
    },
    'ore-processing': {
      zh: '选矿设备,矿物加工设备,破碎机,磨矿机,浮选机,磁选机,重选设备,分级设备,脱水设备,选矿工艺,金矿选矿,铁矿选矿,铜矿选矿,锡矿选矿',
      en: 'mineral processing equipment,ore dressing equipment,crushers,grinding mills,flotation machines,magnetic separators,gravity separators,classifiers,dewatering equipment,mineral processing,gold ore processing,iron ore processing'
    },
    'gravity-separation': {
      zh: '重选设备,重力选矿,比重分选,金矿选矿,锡矿选矿,钨矿选矿,螺旋溜槽,跳汰机,摇床,离心选矿机,高回收率,环保选矿',
      en: 'gravity separation equipment,gravity concentration,specific gravity separation,gold ore processing,tin ore processing,tungsten ore processing,spiral chute,jig machine,shaking table,centrifugal concentrator,high recovery rate'
    },
    'magnetic-separation': {
      zh: '磁选设备,磁选机,永磁磁选机,电磁磁选机,干式磁选,湿式磁选,弱磁选,强磁选,铁矿选矿,锰矿选矿,赤铁矿选矿,钛铁矿选矿',
      en: 'magnetic separation equipment,magnetic separator,permanent magnetic separator,electromagnetic separator,dry magnetic separation,wet magnetic separation,iron ore processing,manganese ore processing,hematite processing'
    },
    'flotation': {
      zh: '浮选设备,浮选机,充气式浮选机,自吸式浮选机,机械搅拌浮选机,柱式浮选机,铜矿浮选,铅锌矿浮选,金矿浮选,选矿药剂',
      en: 'flotation equipment,flotation machine,pneumatic flotation machine,self-priming flotation machine,mechanical agitation flotation machine,column flotation machine,copper flotation,lead-zinc flotation,gold flotation'
    },
    'crusher': {
      zh: '破碎设备,破碎机,颚式破碎机,圆锥破碎机,反击式破碎机,锤式破碎机,辊式破碎机,移动破碎站,细碎,中碎,粗碎',
      en: 'crushing equipment,crusher,jaw crusher,cone crusher,impact crusher,hammer crusher,roller crusher,mobile crushing station,fine crushing,medium crushing,coarse crushing'
    },
    'grinding-equipment': {
      zh: '磨矿设备 | 高效矿石研磨解决方案 - 泽鑫矿山设备',
      en: 'Grinding Equipment | Efficient Ore Grinding Solutions - Zexin Mining'
    }
  };
  
  // 获取基础关键词
  const baseKeywords = keywordsMap[type] || keywordsMap['home'];
  const keywords = isZh ? baseKeywords.zh : baseKeywords.en;
  
  // 如果有特定关键词，添加到基础关键词
  if (specificKeywords) {
    return `${specificKeywords},${keywords}`;
  }
  
  return keywords;
}

// 从产品JSON中获取热门关键词
export async function getProductSeoKeywords(locale: string, productIds: string[]): Promise<string | null> {
  try {
    // 并行加载所有产品数据
    const promises = productIds.map(async (id) => {
      try {
        // 根据环境确定路径
        // 在服务器端运行时从文件系统读取
        if (typeof window === 'undefined') {
          const fs = require('fs');
          const path = require('path');
          const filePath = path.join(process.cwd(), 'public', 'data', locale, `${id}.json`);
          
          if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const json = JSON.parse(fileContent);
            return json.seo?.keywords || null;
          }
        } else {
          // 在客户端通过fetch获取
          const res = await fetch(`/data/${locale}/${id}.json`);
          if (res.ok) {
            const json = await res.json();
            return json.seo?.keywords || null;
          }
        }
      } catch (error) {
        console.error(`Error loading SEO keywords for ${id}:`, error);
      }
      return null;
    });
    
    const keywordsList = await Promise.all(promises);
    
    // 过滤掉null值并合并关键词（去重）
    const uniqueKeywords = new Set<string>();
    keywordsList.filter(Boolean).forEach(keywords => {
      if (keywords) {
        // 分割关键词字符串并添加到集合中（自动去重）
        keywords.split(',').forEach((keyword: string) => uniqueKeywords.add(keyword.trim()));
      }
    });
    
    // 将集合转换回字符串
    return Array.from(uniqueKeywords).join(',');
  } catch (error) {
    console.error("Error extracting SEO keywords from products:", error);
    return null;
  }
}

// 定义产品类别元数据配置接口
interface CategoryMetadataConfig {
  title: { zh: string; en: string };
  description: { zh: string; en: string };
  defaultKeywords?: { zh: string; en: string };
  path: string;
}

// 产品类别配置对象
const CATEGORY_METADATA: Record<string, CategoryMetadataConfig> = {
  'vibrating-screens': {
    title: {
      zh: '固定式振动筛 | 泽鑫矿山设备',
      en: 'Stationary Vibrating Screens | Zexin Mining Equipment'
    },
    description: {
      zh: '泽鑫固定式振动筛产品线包括直线振动筛、香蕉筛、脱水筛、高频筛等多种类型，满足您的物料筛分需求。',
      en: 'Zexin stationary vibrating screens product line includes linear vibrating screens, banana screens, dewatering screens, high-frequency screens, and more for your material screening needs.'
    },
    defaultKeywords: {
      zh: '固定式振动筛,直线振动筛,香蕉筛,脱水筛,高频筛,泽鑫矿山设备',
      en: 'stationary vibrating screens,linear vibrating screens,banana screens,dewatering screens,high-frequency screens,Zexin Mining Equipment'
    },
    path: '/products/ore-processing/vibrating-screens'
  },
  'classification-equipment': {
    title: {
      zh: '分级设备 | 高效矿物分级解决方案 - 泽鑫矿山设备',
      en: 'Classification Equipment | Efficient Mineral Classification Solutions - Zexin Mining'
    },
    description: {
      zh: '泽鑫矿山设备专业生产各类分级设备，包括高堰式螺旋分级机、沉没式螺旋分级机、水力旋流器等，用于矿石颗粒的分级与分选，提高选矿效率和精度，适用于多种矿石的精确分级处理。',
      en: 'Zexin Mining Equipment specializes in manufacturing various classification equipment including high weir spiral classifiers, submerged spiral classifiers, hydrocyclones and more, used for classification and separation of ore particles, improving the efficiency and accuracy of mineral processing, suitable for precise classification of various ores.'
    },
    defaultKeywords: {
      zh: '分级设备,螺旋分级机,高堰式螺旋分级机,沉没式螺旋分级机,水力旋流器,分级机,矿物分级,细粒分级,矿浆分级,选矿设备,泽鑫矿山设备',
      en: 'classification equipment,spiral classifier,high weir spiral classifier,submerged spiral classifier,hydrocyclone,classifier,mineral classification,fine particle classification,slurry classification,mineral processing equipment,Zexin Mining Equipment'
    },
    path: '/products/ore-processing/classification-equipment'
  },
  'grinding-equipment': {
    title: {
      zh: '磨矿设备 | 高效矿石研磨解决方案 - 泽鑫矿山设备',
      en: 'Grinding Equipment | Efficient Ore Grinding Solutions - Zexin Mining'
    },
    description: {
      zh: '泽鑫矿山设备专业生产各类磨矿设备，包括湿式溢流球磨机、湿式节能格子型球磨机、湿式棒磨机等，适用于各种矿石的研磨工艺。我们的磨矿设备采用先进的设计理念和耐磨材料，提供高效磨矿性能、精确粒度控制、低能耗运行和简便维护，为客户提供可靠的物料研磨解决方案。',
      en: 'Zexin Mining Equipment specializes in manufacturing various grinding equipment including wet overflow ball mills, wet energy-saving grid ball mills, wet rod mills and more. Our grinding equipment features efficient grinding performance, precise particle size control, low energy consumption and easy maintenance, providing reliable grinding solutions for various mineral processing applications.'
    },
    defaultKeywords: {
      zh: '磨矿设备,球磨机,棒磨机,湿式球磨机,干式球磨机,溢流球磨机,节能球磨机,格子型球磨机,磨矿机,研磨设备,矿石磨矿,选矿设备',
      en: 'grinding equipment,ball mill,rod mill,wet ball mill,dry ball mill,overflow ball mill,energy-saving ball mill,grid ball mill,grinding mill,grinding machine,ore grinding,mineral processing equipment'
    },
    path: '/products/ore-processing/grinding-equipment'
  },
  'stationary-crushers': {
    title: {
      zh: '固定式破碎设备 | 高效矿山与骨料加工设备',
      en: 'Stationary Crushers | Efficient Mining & Aggregate Processing Equipment'
    },
    description: {
      zh: '泽鑫矿山设备专业生产各类固定式破碎设备，包括颚式破碎机、圆锥破碎机、反击式破碎机、锤式破碎机和双辊破碎机等，适用于矿山、采石场、建筑材料和骨料生产的高效破碎解决方案。',
      en: 'Zexin Mining Equipment manufactures various stationary crushers including jaw crushers, cone crushers, impact crushers, hammer crushers and double roller crushers, providing efficient crushing solutions for mining, quarrying, construction materials and aggregate production.'
    },
    defaultKeywords: {
      zh: '固定式破碎机,颚式破碎机,圆锥破碎机,反击式破碎机,锤式破碎机,双辊破碎机,矿山破碎设备,石料破碎机,骨料破碎设备,采石场破碎机,建筑材料破碎设备,高效破碎机,节能破碎机,泽鑫',
      en: 'stationary crushers,jaw crusher,cone crusher,impact crusher,hammer crusher,double roller crusher,mining crushing equipment,stone crusher,aggregate crushing equipment,quarry crusher,construction material crusher,efficient crusher,energy-saving crusher,Zexin'
    },
    path: '/products/ore-processing/stationary-crushers'
  },
  'magnetic-separation': {
    title: {
      zh: '磁选设备 | 铁矿锰矿高效磁选技术与设备 - 泽鑫矿山设备',
      en: 'Magnetic Separation Equipment | Iron & Manganese Ore Processing - Zexin Mining'
    },
    description: {
      zh: '泽鑫矿山设备提供专业磁选设备系列，包括干式和湿式磁选机、永磁和电磁磁选机，适用于铁矿、锰矿、赤铁矿等各类磁性矿物的高效分选，磁场强度可调，能耗低，分选精度高，回收率高。',
      en: 'Zexin Mining Equipment provides professional magnetic separation series including dry and wet magnetic separators, permanent magnetic and electromagnetic separators, suitable for efficient separation of iron ore, manganese ore, hematite and various magnetic minerals, with adjustable magnetic field intensity, low energy consumption, high separation precision and high recovery rate.'
    },
    path: '/products/ore-processing/magnetic'
  },
  'flotation': {
    title: {
      zh: '浮选设备 | 铜铅锌矿高效浮选技术与设备 - 泽鑫矿山设备',
      en: 'Flotation Equipment | Copper Lead Zinc Ore Processing - Zexin Mining'
    },
    description: {
      zh: '泽鑫矿山设备专业生产浮选设备，包括充气式浮选机、自吸式浮选机、机械搅拌浮选机等，利用矿物表面物理化学性质差异进行分选，适用于铜、铅、锌、金等有色金属和贵金属矿物的高效分选。',
      en: 'Zexin Mining Equipment specializes in manufacturing flotation equipment, including pneumatic flotation machines, self-priming flotation machines, and mechanical agitation flotation machines. By utilizing differences in physicochemical properties of mineral surfaces, our equipment is suitable for efficient separation of copper, lead, zinc, gold and other non-ferrous and precious metal minerals.'
    },
    path: '/products/ore-processing/flotation'
  },
  'crusher': {
    title: {
      zh: '破碎设备 | 高效矿石破碎解决方案 - 泽鑫矿山设备',
      en: 'Crushing Equipment | Efficient Ore Crushing Solutions - Zexin Mining'
    },
    description: {
      zh: '泽鑫矿山设备提供全系列破碎设备，包括颚式破碎机、圆锥破碎机、反击式破碎机、锤式破碎机和辊式破碎机，适用于各种硬度矿石的粗碎、中碎和细碎作业，具有破碎比大、产量高、维护简便等特点。',
      en: 'Zexin Mining Equipment offers a complete range of crushing equipment including jaw crushers, cone crushers, impact crushers, hammer crushers and roller crushers, suitable for coarse, medium and fine crushing operations of various hardness ores, featuring large crushing ratio, high productivity and easy maintenance.'
    },
    path: '/products/ore-processing/crusher'
  },
  'gravity-separation': {
    title: {
      zh: '重选设备 | 泽鑫矿山设备',
      en: 'Gravity Separation Equipment | Zexin Mining'
    },
    description: {
      zh: '泽鑫矿山设备专业生产重选设备，包括螺旋溜槽、跳汰机、摇床、离心选矿机等，基于矿物颗粒比重差异原理进行分选。我们的设备适用于金、锡、钨、钽铌、锆、铬、锰等贵重和稀有金属矿的高效选别，具有分选精度高、回收率高、结构可靠、操作简便、能耗低等特点，是矿产资源绿色高效回收的理想选择。',
      en: 'Zexin Mining Equipment specializes in manufacturing gravity separation equipment including spiral chutes, jig machines, shaking tables and centrifugal concentrators, based on the principle of specific gravity differences between mineral particles. Our equipment is suitable for efficient separation of gold, tin, tungsten minerals based on specific gravity differences, featuring high recovery rates, low energy consumption and environmental protection.'
    },
    path: '/products/ore-processing/gravity-separation'
  },
  'magnetic-separator': {
    title: {
      zh: '磁选设备 | 高效矿物分选与提纯解决方案 - 泽鑫矿山设备',
      en: 'Magnetic Separation Equipment | Efficient Mineral Sorting Solutions - Zexin Mining'
    },
    description: {
      zh: '泽鑫矿山设备专业生产各类磁选设备，包括永磁滚筒磁选机、湿式高强度磁辊选机、平板高强度磁选机、三盘带式磁选机、四辊高压电选机和双辊永磁锆英磁选机等。我们的磁选设备采用先进的磁路设计和优质永磁材料，提供高效分选性能、精确矿物分离、低能耗运行和简便维护，为客户提供可靠的磁性物料分选解决方案。',
      en: 'Zexin Mining Equipment specializes in manufacturing various magnetic separation equipment including permanent drum magnetic separators, wet high-intensity magnetic roll separators, plate high-intensity magnetic separators, triple-disc belt magnetic separators, four-roll high-voltage electrostatic separators, and double-roll permanent magnetic zircon separators. Our magnetic separation equipment features advanced magnetic circuit design, efficient separation performance, precise mineral recovery, and low operational costs.'
    },
    defaultKeywords: {
      zh: '磁选设备,磁选机,永磁磁选机,高强度磁选机,湿式磁选机,干式磁选机,滚筒磁选机,磁辊选机,平板磁选机,带式磁选机,锆英砂磁选机,电选机,弱磁选机,强磁选机,选矿设备',
      en: 'magnetic separation equipment,magnetic separator,permanent magnetic separator,high-intensity magnetic separator,wet magnetic separator,dry magnetic separator,drum magnetic separator,roll magnetic separator,plate magnetic separator,belt magnetic separator,zircon magnetic separator,electrostatic separator,mineral processing equipment'
    },
    path: '/products/ore-processing/magnetic-separator'
  },
  'flotation-equipment': {
    title: {
      zh: '浮选设备 | 高效矿物浮选解决方案 - 泽鑫矿山设备',
      en: 'Flotation Equipment | Efficient Mineral Flotation Solutions - Zexin Mining'
    },
    description: {
      zh: '泽鑫矿山设备专业生产各类浮选设备，包括气动浮选机、自吸式浮选机、粗颗粒浮选机和XFC充气式浮选机等，适用于各种有色金属、黑色金属和非金属矿物的浮选分离工艺。我们的浮选设备具有高矿化率、能耗低、结构稳固、操作简便等特点，为客户提供高效可靠的浮选解决方案。',
      en: 'Zexin Mining Equipment specializes in manufacturing various flotation equipment including pneumatic flotation cells, self-aspirated flotation cells, coarse flotation cells, and XFC air inflation flotation cells. Our flotation equipment features high mineralization rates, low energy consumption, robust structure, and ease of operation, providing efficient and reliable flotation solutions for non-ferrous metals, ferrous metals, and non-metallic mineral beneficiation processes.'
    },
    defaultKeywords: {
      zh: '浮选设备,浮选机,气动浮选机,自吸式浮选机,粗颗粒浮选机,充气式浮选机,矿物浮选设备,浮选分离,矿物浮选,选矿浮选设备,浮选槽,浮选系统,浮选工艺',
      en: 'flotation equipment,flotation cell,pneumatic flotation cell,self-aspirated flotation cell,coarse flotation cell,air inflation flotation cell,mineral flotation equipment,flotation separation,mineral flotation,ore flotation equipment,flotation tank,flotation system,flotation process'
    },
    path: '/products/ore-processing/flotation-equipment'
  },
  'feeding-equipment': {
    title: {
      zh: '给料设备 | 高效物料输送解决方案 - 泽鑫矿山设备',
      en: 'Feeding Equipment | Efficient Material Handling Solutions - Zexin Mining'
    },
    description: {
      zh: '泽鑫矿山设备专业生产各类给料设备，包括振动给料机、板式给料机、带式给料机、圆盘给料机、棒条振动给料机和电磁振动给料机等，适用于采矿、建材、化工等行业的物料输送需求。我们的给料设备采用先进的设计理念和耐磨材料，提供高效给料性能、精确流量控制、低能耗运行和简便维护，为客户提供可靠的物料输送解决方案。',
      en: 'Zexin Mining Equipment specializes in manufacturing various feeding equipment including vibratory feeders, apron feeders, belt feeders, disc feeders, grizzly feeders and electromagnetic vibrating feeders. Our feeding equipment features efficient material handling performance, precise flow control, low energy consumption and easy maintenance, providing reliable feeding solutions for mining, construction materials, chemical industry and other applications.'
    },
    defaultKeywords: {
      zh: '给料设备,给料机,振动给料机,板式给料机,带式给料机,圆盘给料机,棒条振动给料机,电磁振动给料机,矿用给料设备,物料输送设备,连续给料设备,泽鑫矿山设备',
      en: 'feeding equipment,feeder,vibratory feeder,apron feeder,belt feeder,disc feeder,grizzly feeder,electromagnetic vibrating feeder,mining feeding equipment,material handling equipment,continuous feeding equipment,Zexin Mining Equipment'
    },
    path: '/products/ore-processing/feeding-equipment'
  },
  'washing-equipment': {
    title: {
      zh: '洗矿设备 | 高效矿物清洗解决方案 - 泽鑫矿山设备',
      en: 'Washing Equipment | Efficient Mineral Washing Solutions - Zexin Mining'
    },
    description: {
      zh: '泽鑫矿山设备专业生产各类洗矿设备，包括单轴螺旋洗矿机、双轴洗矿机、双螺旋洗矿机、滚筒洗矿机和洗矿槽等，适用于各种矿石和骨料的清洗工艺。我们的洗矿设备采用先进的设计理念和耐磨材料，提供高效清洗性能、低能耗运行和简便维护，为客户提供可靠的物料清洗解决方案。',
      en: 'Zexin Mining Equipment specializes in manufacturing various washing equipment including single shaft screw washers, twin shaft log washers, double spiral washers, drum washers and log washers. Our washing equipment features efficient cleaning performance, low water consumption, energy efficiency and easy maintenance, providing reliable washing solutions for various mineral processing and aggregate production applications.'
    },
    defaultKeywords: {
      zh: '洗矿设备,螺旋洗矿机,双轴洗矿机,双螺旋洗矿机,滚筒洗矿机,洗矿槽,矿石清洗设备,骨料洗选设备,砂石洗矿机,泥沙分离设备,洗砂机,洗石机,泽鑫矿山设备',
      en: 'washing equipment,screw washer,twin shaft log washer,double spiral washer,drum washer,log washer,mineral washing equipment,aggregate washing equipment,sand washing machine,silt separation equipment,sand washer,stone washer,Zexin Mining Equipment'
    },
    path: '/products/ore-processing/washing-equipment'
  },
  'ore-processing': {
    title: {
      zh: '选矿设备 | 高效选矿解决方案 - 泽鑫矿山设备',
      en: 'Mineral Processing Equipment | Efficient Ore Processing Solutions - Zexin Mining'
    },
    description: {
      zh: '泽鑫矿山设备提供全套选矿设备和解决方案，包括破碎筛分、磨矿分级、浮选、磁选、重选等工艺设备，满足不同矿种的加工需求，实现高效、节能、环保的矿产资源综合利用。',
      en: 'Zexin Mining Equipment offers complete mineral processing equipment and solutions, including crushing and screening, grinding and classification, flotation, magnetic separation, and gravity separation equipment, to meet the processing needs of various minerals for efficient, energy-saving, and environmentally friendly utilization of mineral resources.'
    },
    defaultKeywords: {
      zh: '选矿设备,矿物加工设备,选矿工艺,矿石破碎,磨矿设备,浮选设备,磁选设备,重选设备,筛分设备,分级设备,脱水设备,金矿选矿,铁矿选矿,铜矿选矿,泽鑫矿山设备',
      en: 'mineral processing equipment,ore processing equipment,mineral processing technology,ore crushing,grinding equipment,flotation equipment,magnetic separation equipment,gravity separation equipment,screening equipment,classification equipment,dewatering equipment,gold processing,iron ore processing,copper processing,Zexin Mining Equipment'
    },
    path: '/products/ore-processing'
  }
};

// 通用获取产品类别元数据函数
export function getCategoryMetadata({ 
  categoryId, 
  locale,
  productKeywords
}: { 
  categoryId: string; 
  locale: string;
  productKeywords?: string;
}): Metadata {
  // 检查类别是否存在于配置中
  const categoryConfig = CATEGORY_METADATA[categoryId as keyof typeof CATEGORY_METADATA];
  
  if (!categoryConfig) {
    throw new Error(`Category metadata not found for: ${categoryId}`);
  }
  
  const isZh = locale === 'zh';
  
  // 确定使用的关键词
  let keywords = '';
  
  // 从产品提取的关键词优先级最高
  if (productKeywords) {
    keywords = productKeywords;
  } 
  // 其次是配置中的默认关键词
  else if (categoryConfig.defaultKeywords) {
    keywords = isZh ? categoryConfig.defaultKeywords.zh : categoryConfig.defaultKeywords.en;
  } 
  // 最后使用基础关键词
  else {
    keywords = getKeywords(categoryId, locale);
  }
  
  return buildMetadata({
    title: isZh ? categoryConfig.title.zh : categoryConfig.title.en,
    description: isZh ? categoryConfig.description.zh : categoryConfig.description.en,
    keywords,
    locale,
    path: categoryConfig.path,
    ogTitle: isZh 
      ? categoryConfig.title.zh.split('|')[0].trim() 
      : categoryConfig.title.en.split('|')[0].trim(),
    ogDescription: isZh 
      ? categoryConfig.description.zh 
      : categoryConfig.description.en
  });
}

// 导出特定产品类别的元数据获取函数（可保持向后兼容性）
export function getVibratingScreensMetadata({ locale = 'en' }: { locale: string }): Metadata {
  const isZh = locale === 'zh';
  
  return {
    title: isZh ? '固定式振动筛设备 | 泽鑫矿山设备' : 'Stationary Vibrating Screens | Zexin Mining Equipment',
    description: isZh 
      ? '泽鑫固定式振动筛产品线包括直线振动筛、香蕉筛、脱水筛、高频筛等多种类型，满足您的物料筛分需求。'
      : 'Zexin stationary vibrating screens product line includes linear vibrating screens, banana screens, dewatering screens, high-frequency screens, and more for your material screening needs.',
    keywords: isZh 
      ? '固定式振动筛,直线振动筛,香蕉筛,脱水筛,高频筛,泽鑫矿山设备'
      : 'stationary vibrating screens,linear vibrating screens,banana screens,dewatering screens,high-frequency screens,Zexin Mining Equipment',
    alternates: {
      canonical: `/${locale}/products/ore-processing/vibrating-screens`,
      languages: {
        'zh-CN': '/zh/products/ore-processing/vibrating-screens',
        'en-US': '/en/products/ore-processing/vibrating-screens',
      },
    },
    openGraph: {
      title: isZh ? '固定式振动筛设备 | 泽鑫矿山设备' : 'Stationary Vibrating Screens | Zexin Mining Equipment',
      description: isZh 
        ? '泽鑫固定式振动筛产品线包括直线振动筛、香蕉筛、脱水筛、高频筛等多种类型，满足您的物料筛分需求。'
        : 'Zexin stationary vibrating screens product line includes linear vibrating screens, banana screens, dewatering screens, high-frequency screens, and more for your material screening needs.',
      url: `/${locale}/products/ore-processing/vibrating-screens`,
      siteName: isZh ? '泽鑫矿山设备' : 'Zexin Mining Equipment',
      images: [
        {
          url: '/images/products/vibrating-screens/overview.jpg',
          width: 1200,
          height: 630,
          alt: isZh ? '泽鑫固定式振动筛设备' : 'Zexin Stationary Vibrating Screen Equipment',
        },
      ],
      locale: isZh ? 'zh_CN' : 'en_US',
      type: 'website',
    },
  };
}

export function getStationaryCrushersMetadata({ locale, productKeywords }: { locale: string; productKeywords?: string }): Metadata {
  return getCategoryMetadata({ categoryId: 'stationary-crushers', locale, productKeywords });
}

export function getMagneticSeparationMetadata({ locale, productKeywords }: { locale: string; productKeywords?: string }): Metadata {
  return getCategoryMetadata({ categoryId: 'magnetic-separation', locale, productKeywords });
}

export function getFlotationMetadata({ locale, productKeywords }: { locale: string; productKeywords?: string }): Metadata {
  return getCategoryMetadata({ categoryId: 'flotation', locale, productKeywords });
}

export function getCrusherMetadata({ locale, productKeywords }: { locale: string; productKeywords?: string }): Metadata {
  return getCategoryMetadata({ categoryId: 'crusher', locale, productKeywords });
}

export function getGravitySeparationMetadata({ locale, productKeywords }: { locale: string; productKeywords?: string }): Metadata {
  return getCategoryMetadata({ categoryId: 'gravity-separation', locale, productKeywords });
}

export function getMagneticSeparatorMetadata({ locale, productKeywords }: { locale: string; productKeywords?: string }): Metadata {
  return getCategoryMetadata({ categoryId: 'magnetic-separator', locale, productKeywords });
}

export function getClassificationEquipmentMetadata({ locale, productKeywords }: { locale: string; productKeywords?: string }): Metadata {
  return getCategoryMetadata({ categoryId: 'classification-equipment', locale, productKeywords });
}

export function getFlotationEquipmentMetadata({ locale, productKeywords }: { locale: string; productKeywords?: string }): Metadata {
  return getCategoryMetadata({ categoryId: 'flotation-equipment', locale, productKeywords });
}

export function getFeedingEquipmentMetadata({ locale, productKeywords }: { locale: string; productKeywords?: string }): Metadata {
  return getCategoryMetadata({ categoryId: 'feeding-equipment', locale, productKeywords });
}

// 获取产品详情页的元数据
export function getProductDetailMetadata({ 
  params, 
  product
}: { 
  params: { productId: string; locale: string },
  product: { 
    name: string;
    shortDescription: string;
    category: string;
  } | null
}) {
  const isZh = params.locale === 'zh';
  const productType = params.productId.split('-')[0] || '';

  if (!product) {
    return {
      title: isZh ? '产品未找到' : 'Product Not Found',
      description: isZh ? '抱歉，您请求的产品不存在' : 'Sorry, the requested product does not exist',
    };
  }

  const keywords = getKeywords(productType, params.locale, `${product.name},${product.category}`);
  
  return buildMetadata({
    title: product.name,
    description: product.shortDescription,
    keywords,
    locale: params.locale,
    path: `/products/${params.productId}`,
    ogType: 'website',
    ogTitle: product.name,
    ogDescription: product.shortDescription
  });
}

// 获取产品结构化数据
export function getProductStructuredData({
  productId,
  product,
  locale
}: {
  productId: string;
  product: {
    name: string;
    fullDescription: string;
    category: string;
    imageSrc: string;
  };
  locale: string;
}) {
  const isZh = locale === 'zh';
  
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": `https://zexinmining.com${product.imageSrc}`,
    "description": product.fullDescription,
    "category": product.category,
    "sku": productId,
    "mpn": productId,
    "brand": {
      "@type": "Brand",
      "name": isZh ? "泽鑫矿山设备" : "Zexin Mining Equipment",
      "logo": "https://zexinmining.com/logo/logo-zh.webp"
    },
    "manufacturer": {
      "@type": "Organization",
      "name": isZh ? "泽鑫矿山设备有限公司" : "Zexin Mining Equipment Co., Ltd.",
      "url": "https://zexinmining.com"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://zexinmining.com/${locale}/products/${productId}`,
      "priceCurrency": "CNY",
      "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      "availability": "https://schema.org/InStock"
    }
  };
}

// 面包屑结构化数据
export const getBreadcrumbSchema = (breadcrumbs: {name: string, url?: string}[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  'itemListElement': breadcrumbs.map((breadcrumb, index) => ({
    '@type': 'ListItem',
    'position': index + 1,
    'name': breadcrumb.name,
    'item': breadcrumb.url ? `https://zexinmining.com${breadcrumb.url}` : undefined
  }))
});

// 添加含有FAQ的页面结构化数据
export const getFAQSchema = (questions: {question: string, answer: string}[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  'mainEntity': questions.map(q => ({
    '@type': 'Question',
    'name': q.question,
    'acceptedAnswer': {
      '@type': 'Answer',
      'text': q.answer
    }
  }))
});

// 获取本地业务结构化数据
export const getLocalBusinessSchema = (isZh: boolean) => ({
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  'name': isZh ? '泽鑫矿山设备有限公司' : 'Zexin Mining Equipment Co., Ltd.',
  'image': 'https://zexinmining.com/images/company/headquarters.jpg',
  'telephone': '+86-123-4567-8901',
  'email': 'info@zexinmining.com',
  'url': 'https://zexinmining.com',
  'address': {
    '@type': 'PostalAddress',
    'streetAddress': isZh ? '浦东新区张江高科技园区' : 'Zhangjiang Hi-Tech Park, Pudong New Area',
    'addressLocality': isZh ? '上海市' : 'Shanghai',
    'addressRegion': isZh ? '上海' : 'Shanghai',
    'postalCode': '200000',
    'addressCountry': isZh ? '中国' : 'China'
  },
  'geo': {
    '@type': 'GeoCoordinates',
    'latitude': 31.2304,
    'longitude': 121.4737
  },
  'openingHoursSpecification': [
    {
      '@type': 'OpeningHoursSpecification',
      'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      'opens': '09:00',
      'closes': '18:00'
    }
  ],
  'priceRange': '¥¥¥'
});

// 产品列表页元数据
export function getProductsPageMetadata({ locale }: { locale: string }): Metadata {
  const isZh = locale === 'zh';
  
  const title = isZh 
    ? '泽鑫矿山设备产品中心 | 专业矿山机械与选矿设备' 
    : 'Zexin Mining Equipment Products | Professional Mining Machinery & Mineral Processing Equipment';
  
  const description = isZh 
    ? '泽鑫矿山设备提供全系列矿山设备与选矿解决方案，包括破碎机、磨矿机、浮选机、磁选机、重选设备等，满足不同矿种的加工需求，实现高效、节能、环保的矿产资源综合利用。' 
    : 'Zexin Mining Equipment offers a complete range of mining machinery and mineral processing solutions, including crushers, grinding mills, flotation machines, magnetic separators and gravity separation equipment, meeting the processing needs of different minerals for efficient, energy-saving and environmentally friendly utilization of mineral resources.';
  
  const keywords = getKeywords('products', locale);
  
  return buildMetadata({
    title,
    description,
    keywords,
    locale,
    path: '/products',
    ogTitle: isZh ? '泽鑫矿山设备产品中心' : 'Zexin Mining Equipment Products',
    ogDescription: description,
    ogAlt: isZh ? '泽鑫矿山设备产品中心' : 'Zexin Mining Equipment Products'
  });
} 