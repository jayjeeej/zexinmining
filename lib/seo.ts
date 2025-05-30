import { Metadata } from 'next';
import { siteUrl } from './constant';

// 默认SEO配置
export const defaultSEO = {
  titleTemplate: '%s',
  defaultTitle: '泽鑫矿山设备 - 专业矿山设备制造商',
  description: '泽鑫矿山设备是专业矿山设备制造商，为全球客户提供高效可靠的智能解决方案和全面技术支持',
  keywords: '矿山设备,采矿设备,泽鑫,采矿解决方案,采矿技术,工业装备,钻机,露天矿',
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://www.zexinmining.com/',
    siteName: '泽鑫矿山设备',
    images: [
      {
        url: 'https://www.zexinmining.com/images/og-image.jpg',
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
  titleTemplate: '%s',
  defaultTitle: 'Zexin Mining - Professional Mineral Processing Equipment',
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
  const siteUrl = 'https://www.zexinmining.com';
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
export * from '../lib/metadata';

// 组织架构数据
export function getOrganizationSchema(isZh: boolean) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": isZh ? "泽鑫矿山设备" : "Zexin Mining Equipment",
    "alternateName": isZh ? "泽鑫矿业有限公司" : "Zexin Mining Equipment Co., Ltd.",
    "url": "https://www.zexinmining.com",
    "logo": "https://www.zexinmining.com/logo/logo-social.png",
    "sameAs": [
      "https://www.linkedin.com/company/zexinmining",
      "https://twitter.com/zexinmining",
      "https://www.facebook.com/zexinmining"
    ],
    "description": isZh 
      ? "泽鑫矿山设备有限公司成立于2012年，是一家专注于矿山设备的综合服务提供商，涵盖设计、研发、制造、安装、维护及售后服务。厂区占地90亩，经过多年的发展，公司已形成完整的矿山设备产品线，能够为客户提供从矿山开采到矿物加工的全套解决方案。" 
      : "Zexin Mining Equipment Co., Ltd., established in 2012, is a comprehensive service provider focused on mining equipment, covering design, research and development, manufacturing, installation, maintenance, and after-sales service. With a factory area of 60,000 square meters (approximately 15 acres), after years of development, the company has formed a complete mining equipment product line, providing customers with complete solutions from mining to mineral processing.",
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+86 18577086999",
        "contactType": "sales",
        "availableLanguage": ["Chinese", "English"],
        "name": "Eddie Wang"
      },
      {
        "@type": "ContactPoint",
        "telephone": "+86 13807719695",
        "contactType": "customer service",
        "availableLanguage": ["Chinese", "English"],
        "name": "Cassian Wu"
      }
    ],
    "email": "zexinminingequipment@hotmail.com",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "China",
      "addressLocality": isZh ? "扶绥县" : "Fusui County",
      "addressRegion": isZh ? "南宁市, 广西省" : "Nanning City, Guangxi Province",
      "streetAddress": isZh ? "尚龙大道东盟青年产业园" : "Shanglong Avenue, ASEAN Youth Industrial Park"
    },
    "foundingDate": "2012",
    "numberOfEmployees": {
      "@type": "QuantitativeValue",
      "value": "20+"
    },
    "areaServed": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": 22.2452,
        "longitude": 107.9043
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
      zh: '球磨机-湿式溢流球磨机节能格子型球磨机 | 泽鑫矿山设备',
      en: 'Ball Mills - Wet Overflow & Energy-saving Grid Type | Zexin Mining'
    },
    'mineral-processing-solutions': {
      zh: '选矿工艺方案-金属矿非金属矿专业选矿流程 | 泽鑫矿山设备',
      en: 'Mineral Processing Solutions - Gold, Copper & Iron Ore Beneficiation | Zexin Mining'
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
    // 检查参数是否有效
    if (!locale || !productIds || productIds.length === 0) {
      console.warn("getProductSeoKeywords: Missing required parameters", { locale, productIdsLength: productIds?.length });
      return getDefaultKeywords(locale);
    }
    
    // 返回默认关键词，避免文件系统读取
    return getDefaultKeywords(locale);
  } catch (error) {
    console.error("Error extracting SEO keywords from products:", error);
    return getDefaultKeywords(locale);
  }
}

// 获取默认关键词
function getDefaultKeywords(locale: string): string {
  const isZh = locale === 'zh';
  
  if (isZh) {
    return "矿山设备,选矿设备,破碎机,球磨机,浮选机,泽鑫矿山,磁选机,摇床,跳汰机,螺旋溜槽,矿山解决方案";
  }
  
  return "mining equipment,mineral processing,crusher,ball mill,flotation machine,zexin mining,magnetic separator,shaking table,jig machine,spiral chute,mining solutions";
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
      zh: '振动筛-直线振动筛香蕉筛高频筛系列 | 泽鑫矿山设备',
      en: 'Vibrating Screens - Linear, Banana & High-frequency Series | Zexin Mining'
    },
    description: {
      zh: '泽鑫振动筛系列包括直线振动筛、香蕉筛、脱水筛、高频筛等，筛分精度高，多层筛分设计，处理量50-800t/h，维护简便，适用于矿石、砂石、煤炭等物料的高效分级。',
      en: 'Zexin vibrating screens: linear screens, banana screens, dewatering screens & high-frequency screens with multi-deck design. High precision, capacity of 50-800t/h, easy maintenance for efficient classification of minerals, aggregates & coal.'
    },
    defaultKeywords: {
      zh: '振动筛,直线振动筛,香蕉筛,脱水筛,高频筛,泽鑫矿山设备,矿石筛分,砂石筛分,煤炭筛分,多层筛分,筛分精度,大型振动筛',
      en: 'vibrating screens,linear vibrating screens,banana screens,dewatering screens,high-frequency screens,Zexin Mining Equipment,ore screening,aggregate screening,coal screening,multi-deck screening,screening precision,large vibrating screens'
    },
    path: '/products/ore-processing/vibrating-screens'
  },
  'classification-equipment': {
    title: {
      zh: '分级机-螺旋分级机水力旋流器系列 | 泽鑫矿山设备',
      en: 'Classifiers - Spiral Classifiers & Hydrocyclones Series | Zexin Mining'
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
      zh: '球磨机-湿式溢流球磨机格子型球磨机系列 | 泽鑫矿山设备',
      en: 'Ball Mills - Wet Overflow & Grid Type Ball Mill Series | Zexin Mining'
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
      zh: '破碎机-颚式破碎机圆锥破碎机反击式破碎机系列 | 泽鑫矿山设备',
      en: 'Crushers - Jaw, Cone & Impact Crusher Series | Zexin Mining'
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
      zh: '磁选设备-铁矿选矿永磁滚筒磁选机系列 | 泽鑫矿山设备',
      en: 'Magnetic Separation - Iron Ore Processing Magnetic Separator Series | Zexin Mining'
    },
    description: {
      zh: '泽鑫矿山设备提供专业磁选设备系列，包括干式和湿式磁选机、永磁和电磁磁选机，适用于铁矿、锰矿、赤铁矿等各类磁性矿物的高效分选，磁场强度可调，能耗低，分选精度高，回收率高。',
      en: 'Zexin Mining Equipment provides professional magnetic separation series including dry and wet magnetic separators, permanent magnetic and electromagnetic separators, suitable for efficient separation of iron ore, manganese ore, hematite and various magnetic minerals, with adjustable magnetic field intensity, low energy consumption, high separation precision and high recovery rate.'
    },
    path: '/products/ore-processing/magnetic'
  },
  'gravity-separation': {
    title: {
      zh: '重力选矿设备-螺旋溜槽跳汰机摇床系列 | 泽鑫矿山设备',
      en: 'Gravity Separation Equipment - Spiral Chutes, Jigs & Shaking Tables | Zexin Mining'
    },
    description: {
      zh: '泽鑫重力选矿设备包括螺旋溜槽、跳汰机、摇床、离心选矿机等，专为金矿、锡矿、钨矿等密度差选矿设计，回收率高达98%，能耗低，维护简便，提供定制化重选解决方案。',
      en: 'Zexin gravity separation equipment: spiral chutes, jig machines, shaking tables & centrifugal concentrators. High-efficiency density-based separation for gold, tin & tungsten ores with 98% recovery rates. Low energy, easy maintenance, custom solutions.'
    },
    defaultKeywords: {
      zh: '重力选矿设备,重选设备,螺旋溜槽,跳汰机,摇床,离心选矿机,金矿选矿,锡矿选矿,钨矿选矿,重力分选,比重选矿,矿物分选,密度分选',
      en: 'gravity separation equipment,gravity concentrators,spiral chute,jig machine,shaking table,centrifugal concentrator,gold ore processing,tin ore processing,tungsten ore processing,gravity concentration,specific gravity separation,mineral sorting,density separation'
    },
    path: '/products/ore-processing/gravity-separation'
  },
  'magnetic-separator': {
    title: {
      zh: '磁选机-永磁滚筒湿式强磁干式磁选机系列 | 泽鑫矿山设备',
      en: 'Magnetic Separators - Permanent Drum & High-intensity Separator Series | Zexin Mining'
    },
    description: {
      zh: '泽鑫磁选设备包括永磁滚筒磁选机、湿式强磁机、干式磁选机等，适用于铁矿、锰矿、赤铁矿高效分选，磁场强度可调，分选精度高，铁精矿品位可达65%以上，能耗低，处理量大。',
      en: 'Zexin magnetic separators: permanent drum, wet high-intensity & dry magnetic separators with adjustable field strength. Process iron, manganese & hematite ores with 65%+ concentrate grade. Low energy consumption, high capacity & precision sorting.'
    },
    defaultKeywords: {
      zh: '磁选设备,磁选机,永磁磁选机,高强度磁选机,湿式磁选机,干式磁选机,滚筒磁选机,磁辊选机,平板磁选机,带式磁选机,锆英砂磁选机,电选机,弱磁选机,强磁选机,选矿设备',
      en: 'magnetic separation equipment,magnetic separator,permanent magnetic separator,high-intensity magnetic separator,wet magnetic separator,dry magnetic separator,drum magnetic separator,roll magnetic separator,plate magnetic separator,belt magnetic separator,zircon magnetic separator,electrostatic separator,mineral processing equipment'
    },
    path: '/products/ore-processing/magnetic-separator'
  },
  'flotation-equipment': {
    title: {
      zh: '浮选机-气动浮选机自吸式浮选机XJK系列 | 泽鑫矿山设备',
      en: 'Flotation Machines - Pneumatic & Self-aspirated Flotation Cell Series | Zexin Mining'
    },
    description: {
      zh: '泽鑫浮选设备包括气动浮选机、自吸式浮选机、粗颗粒浮选机等，适用于铜铅锌矿石高效分选，回收率高达95%，节能环保，为全球矿企提供一站式浮选解决方案。',
      en: 'Zexin flotation equipment includes pneumatic cells, self-aspirated machines & coarse particle flotation cells. High-efficiency separation for copper, lead & zinc ores with 95% recovery rates. Energy-saving design with expert support.'
    },
    defaultKeywords: {
      zh: '浮选设备,浮选机,气动浮选机,自吸式浮选机,粗颗粒浮选机,充气式浮选机,矿物浮选设备,浮选分离,矿物浮选,选矿浮选设备,浮选槽,浮选系统,浮选工艺',
      en: 'flotation equipment,flotation cell,pneumatic flotation cell,self-aspirated flotation cell,coarse flotation cell,air inflation flotation cell,mineral flotation equipment,flotation separation,mineral flotation,ore flotation equipment,flotation tank,flotation system,flotation process'
    },
    path: '/products/ore-processing/flotation-equipment'
  },
  'feeding-equipment': {
    title: {
      zh: '给料机-振动给料机板式给料机带式给料机系列 | 泽鑫矿山设备',
      en: 'Feeders - Vibratory, Apron & Belt Feeder Series | Zexin Mining'
    },
    description: {
      zh: '泽鑫给料设备包括振动给料机、板式给料机、带式给料机等，精确流量控制，耐磨结构设计，应用于采矿、建材行业，提高生产效率30%，降低物料损耗，延长设备使用寿命。',
      en: 'Zexin feeding equipment includes vibratory, apron & belt feeders with precise flow control & wear-resistant design. Boosts mining & construction productivity by 30%, reduces material waste & extends equipment lifespan. Custom solutions available.'
    },
    defaultKeywords: {
      zh: '给料设备,给料机,振动给料机,板式给料机,带式给料机,圆盘给料机,棒条振动给料机,电磁振动给料机,矿用给料设备,物料输送设备,连续给料设备,泽鑫矿山设备',
      en: 'feeding equipment,feeder,vibratory feeder,apron feeder,belt feeder,disc feeder,grizzly feeder,electromagnetic vibrating feeder,mining feeding equipment,material handling equipment,continuous feeding equipment,Zexin Mining Equipment'
    },
    path: '/products/ore-processing/feeding-equipment'
  },
  'washing-equipment': {
    title: {
      zh: '洗矿机-螺旋洗矿机双轴洗矿机滚筒洗矿机系列 | 泽鑫矿山设备',
      en: 'Washing Machines - Screw, Log & Drum Washer Series | Zexin Mining'
    },
    description: {
      zh: '泽鑫洗矿设备包括螺旋洗矿机、双轴洗矿机、滚筒洗矿机等，高效去除矿石表面泥沙杂质，水资源循环利用率达90%，提升产品品位，适用于各类砂石、金属矿石和非金属矿物的清洗。',
      en: 'Zexin washing equipment: screw washers, log washers & drum washers for efficient removal of clay & impurities. 90% water recycling system, improved product grade & capacity up to 450t/h. Perfect for sand, metal & non-metal minerals.'
    },
    defaultKeywords: {
      zh: '洗矿设备,螺旋洗矿机,双轴洗矿机,双螺旋洗矿机,滚筒洗矿机,洗矿槽,矿石清洗设备,骨料洗选设备,砂石洗矿机,泥沙分离设备,洗砂机,洗石机,泽鑫矿山设备',
      en: 'washing equipment,screw washer,twin shaft log washer,double spiral washer,drum washer,log washer,mineral washing equipment,aggregate washing equipment,sand washing machine,silt separation equipment,sand washer,stone washer,Zexin Mining Equipment'
    },
    path: '/products/ore-processing/washing-equipment'
  },
  'ore-processing': {
    title: {
      zh: '选矿设备-破碎机球磨机浮选机磁选机系列 | 泽鑫矿山设备',
      en: 'Mineral Processing Equipment - Crushers, Mills & Separation Series | Zexin Mining'
    },
    description: {
      zh: '泽鑫提供全套高效选矿设备，包括破碎筛分、磨矿、浮选、磁选、重选设备，满足金矿、铁矿、铜矿等各类矿石处理需求，提高回收率，降低运营成本，实现矿产资源高效利用。',
      en: 'Zexin offers complete mineral processing equipment: crushers, grinding mills, flotation cells, magnetic & gravity separators. Maximize recovery rates for gold, iron & copper ores while reducing operational costs with our efficient solutions.'
    },
    defaultKeywords: {
      zh: '选矿设备,矿物加工设备,选矿工艺,矿石破碎,磨矿设备,浮选设备,磁选设备,重选设备,筛分设备,分级设备,脱水设备,金矿选矿,铁矿选矿,铜矿选矿,泽鑫矿山设备',
      en: 'mineral processing equipment,ore processing equipment,mineral processing technology,ore crushing,grinding equipment,flotation equipment,magnetic separation equipment,gravity separation equipment,screening equipment,classification equipment,dewatering equipment,gold processing,iron ore processing,copper processing,Zexin Mining Equipment'
    },
    path: '/products/ore-processing'
  },
  'mineral-processing-solutions': {
    title: {
      zh: '选矿工艺方案-金属矿非金属矿选矿流程设计 | 泽鑫矿山设备',
      en: 'Mineral Processing Solutions - Metal & Non-metal Ore Beneficiation | Zexin Mining'
    },
    description: {
      zh: '泽鑫提供全面的矿物加工解决方案，根据不同矿种特性设计最优选矿工艺流程，包括新能源矿种、贵金属、有色金属、黑色金属和非金属等矿物的加工方案',
      en: 'Zexin provides comprehensive mineral processing solutions, designing optimal beneficiation processes for different mineral characteristics, including processing solutions for new energy minerals, precious metals, non-ferrous metals, ferrous metals, and non-metals'
    },
    defaultKeywords: {
      zh: '选矿工艺方案,金属矿非金属矿专业选矿流程,泽鑫矿山设备',
      en: 'mineral processing solutions,gold,copper,iron ore beneficiation,Zexin Mining'
    },
    path: '/products/ore-processing/mineral-processing-solutions'
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
  return getCategoryMetadata({ categoryId: 'vibrating-screens', locale });
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
    "image": `https://www.zexinmining.com${product.imageSrc}`,
    "description": product.fullDescription,
    "category": product.category,
    "sku": productId,
    "mpn": productId,
    "brand": {
      "@type": "Brand",
      "name": isZh ? "泽鑫矿山设备" : "Zexin Mining Equipment",
      "logo": "https://www.zexinmining.com/logo/logo-zh.webp"
    },
    "manufacturer": {
      "@type": "Organization",
      "name": isZh ? "泽鑫矿山设备有限公司" : "Zexin Mining Equipment Co., Ltd.",
      "url": "https://www.zexinmining.com"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://www.zexinmining.com/${locale}/products/${productId}`,
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
    'item': breadcrumb.url ? `https://www.zexinmining.com${breadcrumb.url}` : undefined
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
  'image': 'https://www.zexinmining.com/images/company/headquarters.jpg',
  'telephone': '+86-123-4567-8901',
  'email': 'info@zexinmining.com',
  'url': 'https://www.zexinmining.com',
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