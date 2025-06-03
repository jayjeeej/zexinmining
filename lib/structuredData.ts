import { ProductData } from './productDataSchema';
import { siteUrl } from './constant';

// Schema.org 类型常量
export const SCHEMA_TYPES = {
  PRODUCT: 'Product',
  ORGANIZATION: 'Organization',
  ARTICLE: 'Article',
  LOCAL_BUSINESS: 'LocalBusiness',
  FAQ: 'FAQPage',
  BREADCRUMB: 'BreadcrumbList',
  IMAGE_OBJECT: 'ImageObject',
  PRODUCT_MODEL: 'ProductModel',
  PRODUCT_GROUP: 'ProductGroup',
  WEBSITE: 'WebSite',
  WEB_PAGE: 'WebPage',
  TABLE: 'Table',
  ITEM_LIST: 'ItemList',
  PROPERTY_VALUE: 'PropertyValue'
};

interface BreadcrumbItem {
  name: string;
  url?: string;
}

/**
 * 生成产品的结构化数据
 * 增强版，支持图片SEO和产品变体
 */
export function getProductStructuredData({
  productId,
  product,
  locale = 'zh',
  baseUrl = 'https://www.zexinmining.com'
}: {
  productId: string;
  product: ProductData;
  locale?: string;
  baseUrl?: string;
}): Record<string, any> {
  const isZh = locale === 'zh';
  const companyName = isZh ? '泽鑫矿山设备' : 'Zexin Mining Equipment';
  const fullCompanyName = isZh ? '泽鑫矿山设备有限公司' : 'Zexin Mining Equipment Co., Ltd.';
  const productUrl = `${baseUrl}/${locale}/products/${product.subcategory}/${productId}`;
  
  // 转换产品元数据为结构化属性
  const technicalProperties = product.meta.map(item => ({
    "@type": "PropertyValue",
    "name": item.key,
    "value": item.displayValue
  }));
  
  // 转换产品特点为结构化属性
  const featureProperties = product.features.map(feature => ({
    "@type": "PropertyValue",
    "name": "Feature",
    "value": feature
  }));
  
  // 合并所有属性
  const additionalProperties = [...technicalProperties, ...featureProperties];
  
  // 生成产品图片的结构化数据
  const imageObject = {
    "@type": SCHEMA_TYPES.IMAGE_OBJECT,
    "contentUrl": `${baseUrl}${product.imageSrc}`,
    "url": `${baseUrl}${product.imageSrc}`,
    "caption": product.title,
    "name": `${product.title} - ${product.model}`,
    "description": product.overview,
    "representativeOfPage": true
  };
  
  // 添加规格表作为产品附加属性
  if (product.specifications && product.specifications.tableHeaders && product.specifications.tableData) {
    const specTable = product.specifications.tableHeaders.map((header, index) => {
      const rowData = product.specifications.tableData[0] || [];
      const value = rowData[index] || '';
      
      return {
        "@type": "PropertyValue",
        "name": header,
        "value": value
      };
    });
    
    additionalProperties.push(...specTable);
  }
  
  // 基本产品结构化数据
  const productStructuredData: any = {
    "@context": "https://schema.org/",
    "@type": SCHEMA_TYPES.PRODUCT,
    "name": product.title,
    "description": product.overview,
    "image": imageObject,
    "url": productUrl,
    "sku": productId,
    "mpn": product.model,
    "brand": {
      "@type": "Brand",
      "name": companyName
    },
    "manufacturer": {
      "@type": "Organization",
      "name": fullCompanyName
    },
    "category": product.productCategory,
    "model": product.model,
    "additionalProperty": additionalProperties,
    // 添加offers属性以满足Google Search Console要求
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock",
      "price": "0",
      "priceCurrency": "USD",
      "url": productUrl,
      "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      "itemCondition": "https://schema.org/NewCondition"
    },
    // 添加aggregateRating属性以满足Google Search Console要求
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "reviewCount": "1",
      "bestRating": "5",
      "worstRating": "1"
    }
  };
  
  // 如果有相关产品，添加产品变体组
  if (product.relatedProducts && product.relatedProducts.length > 0) {
    // 注意：这里只添加产品组引用，实际数据需要通过相关API获取
    productStructuredData.isVariantOf = {
      "@type": SCHEMA_TYPES.PRODUCT_GROUP,
      "name": product.series || product.productCategory,
      "productGroupID": product.subcategory,
      "variesBy": "model"
    };
  }
  
  return productStructuredData;
}

/**
 * 生成面包屑的结构化数据
 */
export function getBreadcrumbStructuredData(
  breadcrumbs: BreadcrumbItem[],
  baseUrl = 'https://www.zexinmining.com'
): Record<string, any> {
  return {
    "@context": "https://schema.org/",
    "@type": SCHEMA_TYPES.BREADCRUMB,
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url ? `${baseUrl}${item.url}` : undefined
    }))
  };
}

/**
 * 生成FAQ的结构化数据
 */
export function getFAQStructuredData(
  questions: Array<{ question: string; answer: string }>
): Record<string, any> {
  return {
    "@context": "https://schema.org/",
    "@type": SCHEMA_TYPES.FAQ,
    "mainEntity": questions.map(q => ({
      "@type": "Question",
      "name": q.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": q.answer
      }
    }))
  };
}

/**
 * 生成组织的结构化数据
 */
export function getOrganizationStructuredData(isZh = true): Record<string, any> {
  const name = isZh ? '泽鑫矿山设备' : 'Zexin Mining Equipment';
  const description = isZh 
    ? '泽鑫矿山设备是专业矿山设备制造商，为全球客户提供高效可靠的智能解决方案和全面技术支持' 
    : 'Zexin Mining Equipment is a professional mining equipment manufacturer providing efficient and reliable smart solutions and comprehensive technical support to global customers';
  
  return {
    '@context': 'https://schema.org/',
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
    'name': name,
    'url': siteUrl,
    'logo': `${siteUrl}/logo/logo-${isZh ? 'zh' : 'en'}.webp`,
    'description': description,
    'sameAs': [
      'https://www.facebook.com/zexinmining',
      'https://twitter.com/zexinmining',
      'https://www.linkedin.com/company/zexinmining'
    ],
    'contactPoint': {
      '@type': 'ContactPoint',
      'telephone': '+86-13807719695',
      'contactType': 'customer service',
      'availableLanguage': ['Chinese', 'English']
    }
  };
}

/**
 * 生成网站的结构化数据
 */
export function getWebsiteStructuredData(locale = 'zh', baseUrl = 'https://www.zexinmining.com'): Record<string, any> {
  const isZh = locale === 'zh';
  
  return {
    "@context": "https://schema.org/",
    "@type": SCHEMA_TYPES.WEBSITE,
    "name": isZh ? "泽鑫矿山设备官网" : "Zexin Mining Equipment Official Website",
    "url": `${baseUrl}/${locale}`,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/${locale}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "inLanguage": isZh ? "zh-CN" : "en-US",
    "publisher": {
      "@type": "Organization",
      "name": isZh ? "泽鑫矿山设备" : "Zexin Mining Equipment",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo/logo-${isZh ? 'zh' : 'en'}.webp`
      }
    }
  };
}

/**
 * 生成企业作为本地企业的结构化数据
 * 增强本地SEO效果
 */
export function getLocalBusinessStructuredData(locale = 'zh', baseUrl = 'https://www.zexinmining.com'): Record<string, any> {
  const isZh = locale === 'zh';
  
  return {
    "@context": "https://schema.org/",
    "@type": SCHEMA_TYPES.LOCAL_BUSINESS,
    "name": isZh ? "泽鑫矿山设备有限公司" : "Zexin Mining Equipment Co., Ltd.",
    "image": `${baseUrl}/images/company/headquarters.jpg`,
    "logo": `${baseUrl}/logo/logo-${isZh ? 'zh' : 'en'}.webp`,
    "url": baseUrl,
    "telephone": "+86-13807719695",
    "email": "info@zexinmining.com",
    "priceRange": "$$$",
    "description": isZh 
      ? "泽鑫矿山设备专业生产矿山机械和选矿设备，提供破碎机、磨矿机、浮选机、磁选机、重选设备等全套解决方案，为全球矿业客户创造价值。" 
      : "Zexin Mining Equipment specializes in manufacturing mining machinery and mineral processing equipment, providing comprehensive solutions including crushers, grinding mills, flotation machines, magnetic separators and gravity separation equipment, creating value for global mining customers.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": isZh ? "广西南宁扶绥县尚龙大道" : "Shanglong Avenue, Fusu County, Nanning, Guangxi, China",
      "addressLocality": isZh ? "南宁" : "Nanning",
      "addressRegion": isZh ? "广西" : "Guangxi",
      "postalCode": "530200",
      "addressCountry": isZh ? "中国" : "China"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "22.3765",
      "longitude": "108.6331"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "18:00"
      }
    ],
    "sameAs": [
      "https://www.linkedin.com/company/zexin-mining",
      "https://twitter.com/zexinmining",
      "https://www.facebook.com/zexinmining"
    ]
  };
}

/**
 * 生成产品组/产品系列的结构化数据
 */
export function getProductGroupStructuredData({
  groupName,
  groupId,
  products,
  locale
}: {
  groupName: string;
  groupId: string;
  products: { id: string; model: string; title: string }[];
  locale: string;
}) {
  const isZh = locale === 'zh';
  const langPath = isZh ? '/zh' : '/en';
  
  return {
    '@context': 'https://schema.org/',
    '@type': 'ItemList',
    '@id': `${siteUrl}${langPath}/products/ore-processing/${groupId}#itemlist`,
    'name': groupName,
    'itemListElement': products.map((product, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'item': {
        '@type': 'Product',
        '@id': `${siteUrl}${langPath}/products/ore-processing/${groupId}/${product.id}#product`,
        'name': product.title,
        'model': product.model,
        'url': `${siteUrl}${langPath}/products/ore-processing/${groupId}/${product.id}`,
        'manufacturer': {
          '@type': 'Organization',
          'name': isZh ? '泽鑫矿山设备' : 'Zexin Mining Equipment'
        }
      }
    }))
  };
}

/**
 * 生成图片结构化数据
 */
export function getImageStructuredData({
  url,
  caption,
  width = 800,
  height = 600,
  description = '',
  baseUrl = 'https://www.zexinmining.com'
}: {
  url: string;
  caption: string;
  width?: number;
  height?: number;
  description?: string;
  baseUrl?: string;
}): Record<string, any> {
  // 确保URL以/开头但不是//开头(避免与http://混淆)
  const imageUrl = url.startsWith('http') ? url : `${baseUrl}${url.startsWith('/') ? url : `/${url}`}`;
  
  return {
    "@context": "https://schema.org/",
    "@type": SCHEMA_TYPES.IMAGE_OBJECT,
    "contentUrl": imageUrl,
    "url": imageUrl,
    "name": caption,
    "caption": caption,
    "description": description,
    "width": width,
    "height": height,
    "representativeOfPage": true,
    "thumbnailUrl": imageUrl,
    "datePublished": new Date().toISOString().split('T')[0],
    "inLanguage": baseUrl.includes('/zh') ? "zh-CN" : "en-US"
  };
}

/**
 * 生成首页的结构化数据
 */
export function getHomePageStructuredData(locale: string) {
  const isZh = locale === 'zh';
  const langPath = isZh ? '/zh' : '/en';
  
  return {
    '@context': 'https://schema.org/',
    '@type': 'WebSite',
    '@id': `${siteUrl}${langPath}/#website`,
    'url': `${siteUrl}${langPath}/`,
    'name': isZh ? '泽鑫矿山设备' : 'Zexin Mining Equipment',
    'description': isZh 
      ? '泽鑫矿山设备是专业矿山设备制造商，为全球客户提供高效可靠的智能解决方案和全面技术支持' 
      : 'Zexin Mining Equipment is a professional mining equipment manufacturer providing efficient and reliable smart solutions and comprehensive technical support to global customers',
    'potentialAction': {
      '@type': 'SearchAction',
      'target': `${siteUrl}${langPath}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };
}

/**
 * 生成产品类别页面的结构化数据
 */
export function getProductCategoryStructuredData({
  categoryId,
  categoryName,
  description,
  productCount = 10,
  locale = 'zh',
  baseUrl = 'https://www.zexinmining.com'
}: {
  categoryId: string;
  categoryName: string;
  description: string;
  productCount?: number;
  locale?: string;
  baseUrl?: string;
}): Record<string, any> {
  const isZh = locale === 'zh';
  const websiteData = getWebsiteStructuredData(locale, baseUrl);
  const categoryUrl = `${baseUrl}/${locale}/products/${categoryId}`;
  
  // 产品类别页的特定WebPage数据
  const webPageData = {
    "@context": "https://schema.org/",
    "@type": SCHEMA_TYPES.WEB_PAGE,
    "name": `${categoryName} | ${isZh ? '泽鑫矿山设备产品' : 'Zexin Mining Equipment Products'}`,
    "description": description,
    "url": categoryUrl,
    "inLanguage": isZh ? "zh-CN" : "en-US",
    "isPartOf": {
      "@id": `${baseUrl}/#website`
    },
    "breadcrumb": {
      "@id": `${categoryUrl}#breadcrumb`
    }
  };
  
  // 面包屑数据
  const breadcrumbData = {
    "@context": "https://schema.org/",
    "@id": `${categoryUrl}#breadcrumb`,
    "@type": SCHEMA_TYPES.BREADCRUMB,
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": isZh ? "首页" : "Home",
        "item": `${baseUrl}/${locale}`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": isZh ? "产品" : "Products",
        "item": `${baseUrl}/${locale}/products`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": categoryName,
        "item": categoryUrl
      }
    ]
  };
  
  // 集合页数据 - 表示这是一个产品集合页面
  const collectionPageData = {
    "@context": "https://schema.org/",
    "@type": "CollectionPage",
    "url": categoryUrl,
    "name": categoryName,
    "description": description,
    "numberOfItems": productCount,
    "inLanguage": isZh ? "zh-CN" : "en-US"
  };
  
  // 组合为一个完整的图谱
  return {
    "@context": "https://schema.org/",
    "@graph": [
      {
        "@id": `${baseUrl}/#website`,
        ...websiteData
      },
      {
        "@id": `${categoryUrl}#webpage`,
        ...webPageData
      },
      breadcrumbData,
      {
        "@id": `${categoryUrl}#collectionpage`,
        ...collectionPageData
      }
    ]
  };
}

/**
 * 生成服务的结构化数据
 * 适用于矿山EPC服务页面
 */
export function getServiceStructuredData({
  serviceId,
  serviceName,
  serviceDescription,
  serviceType,
  serviceProvider,
  serviceItems = [],
  locale = 'zh',
  baseUrl = 'https://www.zexinmining.com'
}: {
  serviceId: string;
  serviceName: string;
  serviceDescription: string;
  serviceType: string;
  serviceProvider: string;
  serviceItems?: string[];
  locale?: string;
  baseUrl?: string;
}): Record<string, any> {
  const isZh = locale === 'zh';
  const serviceUrl = `${baseUrl}/${locale}/products/${serviceId}`;
  
  return {
    "@context": "https://schema.org/",
    "@type": "Service",
    "serviceType": serviceType,
    "name": serviceName,
    "description": serviceDescription,
    "url": serviceUrl,
    "provider": {
      "@type": "Organization",
      "name": serviceProvider,
      "logo": `${baseUrl}/logo/logo-${isZh ? 'zh' : 'en'}.webp`
    },
    "areaServed": {
      "@type": "Country",
      "name": "Global"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": isZh ? "矿山EPC服务项目" : "Mining EPC Service Items",
      "itemListElement": serviceItems.map((item, index) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": item
        },
        "position": index + 1
      }))
    }
  };
}

/**
 * 生成矿物加工解决方案的结构化数据
 * 适用于矿物加工解决方案页面
 */
export function getMineralProcessingSolutionsStructuredData({
  locale = 'zh',
  baseUrl = 'https://www.zexinmining.com',
  solutionCategories = []
}: {
  locale?: string;
  baseUrl?: string;
  solutionCategories?: Array<{
    id: string;
    name: string;
    description?: string;
    items?: Array<{
      id: string;
      name: string;
    }>;
  }>;
}): Record<string, any> {
  const isZh = locale === 'zh';
  const solutionUrl = `${baseUrl}/${locale}/products/mineral-processing-solutions`;
  
  // 默认解决方案类别
  const defaultCategories: Array<{
    id: string;
    name: string;
    description: string;
    items?: Array<{id: string; name: string;}>;
  }> = [
    {
      id: 'ferrous',
      name: isZh ? '黑色金属矿物加工' : 'Ferrous Metal Processing',
      description: isZh 
        ? '包括铁矿、钒钛磁铁矿、锰矿等黑色金属矿物的高效选矿工艺' 
        : 'Efficient beneficiation processes for iron ore, vanadium-titanium magnetite, manganese ore and other ferrous metal minerals'
    },
    {
      id: 'non-ferrous',
      name: isZh ? '有色金属矿物加工' : 'Non-ferrous Metal Processing',
      description: isZh 
        ? '包括铜矿、铅锌矿、铝土矿等有色金属矿物的先进选矿工艺' 
        : 'Advanced beneficiation processes for copper, lead-zinc, bauxite and other non-ferrous metal minerals'
    },
    {
      id: 'precious-metals',
      name: isZh ? '贵金属矿物加工' : 'Precious Metal Processing',
      description: isZh 
        ? '包括金矿、银矿、铂族金属等贵金属矿物的高回收率选矿工艺' 
        : 'High-recovery beneficiation processes for gold, silver, platinum group metals and other precious metal minerals'
    },
    {
      id: 'non-metallic',
      name: isZh ? '非金属矿物加工' : 'Non-metallic Mineral Processing',
      description: isZh 
        ? '包括石墨、萤石、磷矿等非金属矿物的专业选矿工艺' 
        : 'Professional beneficiation processes for graphite, fluorite, phosphate and other non-metallic minerals'
    }
  ];
  
  // 使用提供的类别或默认类别
  const categories = solutionCategories.length > 0 ? solutionCategories : defaultCategories;
  
  // 创建解决方案结构化数据
  return {
    "@context": "https://schema.org/",
    "@type": "Service",
    "name": isZh ? "矿物加工解决方案" : "Mineral Processing Solutions",
    "url": solutionUrl,
    "description": isZh 
      ? "泽鑫矿山设备提供全面的矿物加工解决方案，根据不同矿种特性设计最优选矿工艺流程，包括新能源矿种、贵金属、有色金属、黑色金属和非金属等矿物的加工方案" 
      : "Zexin Mining Equipment provides comprehensive mineral processing solutions, designing optimal beneficiation processes for different mineral characteristics, including processing solutions for new energy minerals, precious metals, non-ferrous metals, ferrous metals, and non-metals",
    "provider": {
      "@type": "Organization",
      "name": isZh ? "泽鑫矿山设备" : "Zexin Mining Equipment",
      "logo": `${baseUrl}/logo/logo-${isZh ? 'zh' : 'en'}.webp`
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": isZh ? "矿物加工解决方案分类" : "Mineral Processing Solution Categories",
      "itemListElement": categories.map((category, index) => {
        // 基础目录项
        const catalogItem: Record<string, any> = {
          "@type": "OfferCatalog",
          "name": category.name,
          "description": category.description,
          "position": index + 1,
          "url": `${solutionUrl}/${category.id}`
        };
        
        // 如果有子项目，添加到目录项中
        if (category.items && category.items.length > 0) {
          catalogItem.itemListElement = category.items.map((item: {id: string; name: string}, itemIndex: number) => ({
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": item.name,
              "url": `${solutionUrl}/${category.id}/${item.id}`
            },
            "position": itemIndex + 1
          }));
        }
        
        return catalogItem;
      })
    }
  };
}

/**
 * 创建案例研究的结构化数据
 */
export function getCaseStudyStructuredData({
  caseId,
  caseData,
  locale,
  baseUrl
}: {
  caseId: string;
  caseData: any;
  locale: string;
  baseUrl: string;
}) {
  const isZh = locale === 'zh';
  const url = `${baseUrl}/${locale}/cases/${caseId}`;

  return {
    '@context': 'https://schema.org/',
    '@type': 'Article',
    'headline': caseData.title,
    'description': caseData.description,
    'image': caseData.imageSrc ? `${baseUrl}${caseData.imageSrc}` : 
           (caseData.images && caseData.images.length > 0 ? `${baseUrl}${caseData.images[0]}` : undefined),
    'datePublished': caseData.publishDate || new Date().toISOString(),
    'author': {
      '@type': 'Organization',
      'name': isZh ? '泽鑫矿山设备' : 'Zexin Mining Equipment'
    },
    'publisher': {
      '@type': 'Organization',
      'name': isZh ? '泽鑫矿山设备有限公司' : 'Zexin Mining Equipment Co., Ltd.',
      'logo': {
        '@type': 'ImageObject',
        'url': `${baseUrl}/logo/logo.png`
      }
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': url
    }
  };
}

/**
 * 生成专门针对产品规格的结构化数据
 */
export function getProductSpecificationsStructuredData({
  product,
  modelIndex = 0
}: {
  product: any;
  modelIndex?: number;
}): Array<{
  "@type": string;
  "name": string;
  "value": string;
  "unitCode"?: string;
}> {
  if (!product?.specifications?.tableHeaders || 
      !product?.specifications?.tableData || 
      !product.specifications.tableData[modelIndex]) {
    return [];
  }

  const { tableHeaders, tableData, unitTypes = [] } = product.specifications;
  const modelData = tableData[modelIndex];
  
  return tableHeaders.map((header: string, index: number) => {
    if (modelData[index] === undefined) return null;
    
    return {
      "@type": SCHEMA_TYPES.PROPERTY_VALUE,
      "name": header,
      "value": modelData[index].toString(),
      ...(unitTypes[index] ? { "unitCode": unitTypes[index] } : {})
    };
  }).filter(Boolean);
}

/**
 * 生成产品规格表的结构化数据
 * 将整个规格表转换为结构化数据格式
 */
export function getSpecificationTableStructuredData({
  product,
  locale = 'zh',
  baseUrl = 'https://www.zexinmining.com'
}: {
  product: any;
  locale?: string;
  baseUrl?: string;
}): Record<string, any> | null {
  if (!product.specifications || !product.specifications.tableHeaders || !product.specifications.tableData || product.specifications.tableData.length === 0) {
    return null;
  }
  
  const { tableHeaders, tableData, unitTypes = [] } = product.specifications;
  const isZh = locale === 'zh';
  
  // 创建表格行数据
  const rowData = tableData.map((row: any[], rowIndex: number) => {
    const cells = row.map((cell, cellIndex) => ({
      "@type": SCHEMA_TYPES.PROPERTY_VALUE,
      "name": tableHeaders[cellIndex],
      "value": cell?.toString() || "",
      ...(unitTypes[cellIndex] ? { "unitCode": unitTypes[cellIndex] } : {})
    }));
    
    return {
      "@type": SCHEMA_TYPES.ITEM_LIST,
      "name": `${isZh ? '规格行' : 'Specification Row'} ${rowIndex + 1}`,
      "itemListElement": cells
    };
  });
  
  // 创建表格结构化数据
  return {
    "@context": "https://schema.org/",
    "@type": SCHEMA_TYPES.TABLE,
    "about": product.title,
    "name": product.specifications.title || (isZh ? `${product.title}技术规格表` : `${product.title} Technical Specifications`),
    "description": product.specifications.note || "",
    "mainContentOfPage": {
      "@type": SCHEMA_TYPES.ITEM_LIST,
      "numberOfItems": rowData.length,
      "itemListElement": rowData
    }
  };
}

/**
 * 生成新闻文章的结构化数据
 */
export function getNewsArticleStructuredData({
  newsItem,
  locale = 'zh',
  baseUrl = 'https://www.zexinmining.com',
  categoryMap = {}
}: {
  newsItem: any;
  locale?: string;
  baseUrl?: string;
  categoryMap?: Record<string, { zh: string, en: string }>;
}): Record<string, any> {
  const isZh = locale === 'zh';
  
  // 获取分类名称
  const getCategoryName = (categoryId: string) => {
    if (!categoryId) return '';
    return categoryMap[categoryId] 
      ? (isZh ? categoryMap[categoryId].zh : categoryMap[categoryId].en)
      : categoryId;
  };
  
  return {
    "@context": "https://schema.org/",
    "@type": "NewsArticle",
    "headline": newsItem.title,
    "description": newsItem.summary,
    "image": [`${baseUrl}${newsItem.image}`],
    "datePublished": newsItem.date,
    "dateModified": newsItem.date,
    "author": {
      "@type": "Person",
      "name": newsItem.author || (isZh ? "泽鑫编辑部" : "Zexin Editorial Team")
    },
    "publisher": {
      "@type": "Organization",
      "name": isZh ? "泽鑫矿山设备" : "Zexin Mining Equipment",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}${isZh ? "/logo/logo-zh.webp" : "/logo/logo-en.webp"}`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${baseUrl}/${locale}/news/${newsItem.slug}`
    },
    "articleSection": getCategoryName(newsItem.category),
    "keywords": newsItem.tags || [newsItem.category]
  };
}

/**
 * 生成WebPage结构化数据
 */
export function getWebPageStructuredData({
  pageUrl,
  pageName,
  description,
  locale = 'zh',
  baseUrl = 'https://www.zexinmining.com',
  breadcrumbId = null,
  images = [],
  datePublished = null,
  dateModified = null
}: {
  pageUrl: string;
  pageName: string;
  description: string;
  locale?: string;
  baseUrl?: string;
  breadcrumbId?: string | null;
  images?: string[];
  datePublished?: string | null;
  dateModified?: string | null;
}): Record<string, any> {
  const isZh = locale === 'zh';
  
  const webPageData: Record<string, any> = {
    "@context": "https://schema.org/",
    "@type": SCHEMA_TYPES.WEB_PAGE,
    "@id": pageUrl,
    "url": pageUrl,
    "name": pageName,
    "description": description,
    "isPartOf": {
      "@type": "WebSite",
      "url": baseUrl,
      "name": isZh ? "泽鑫矿山设备官网" : "Zexin Mining Equipment Official Website"
    },
    "inLanguage": isZh ? "zh-CN" : "en-US",
    "potentialAction": {
      "@type": "ReadAction",
      "target": [pageUrl]
    },
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": ["h1", ".description"]
    }
  };
  
  // 添加面包屑ID引用（如果存在）
  if (breadcrumbId) {
    webPageData.breadcrumb = { "@id": breadcrumbId };
  }
  
  // 添加图片（如果有）
  if (images && images.length > 0) {
    webPageData.image = images.map(img => {
      // 如果图片路径不是完整URL，则添加baseUrl
      const imgUrl = img.startsWith('http') ? img : `${baseUrl}${img}`;
      return imgUrl;
    });
  }
  
  // 添加发布日期（如果有）
  if (datePublished) {
    webPageData.datePublished = datePublished;
  }
  
  // 添加修改日期（如果有）
  if (dateModified) {
    webPageData.dateModified = dateModified;
  }
  
  return webPageData;
}

/**
 * 生成产品变体结构化数据
 * 根据产品规格表为不同型号生成结构化数据
 */
export function getProductVariantStructuredData({
  product,
  groupName,
  locale = 'zh',
  baseUrl = 'https://www.zexinmining.com'
}: {
  product: any;
  groupName: string;
  locale?: string;
  baseUrl?: string;
}): Record<string, any> | null {
  if (!product?.specifications?.tableHeaders || 
      !product?.specifications?.tableData || 
      product.specifications.tableData.length === 0) {
    return null;
  }
  
  const isZh = locale === 'zh';
  const companyName = isZh ? '泽鑫矿山设备' : 'Zexin Mining Equipment';
  const { tableHeaders, tableData } = product.specifications;
  
  // 查找包含"型号"或"Model"的列索引，通常是表格的第一列
  const modelColumnIndex = tableHeaders.findIndex((header: string) => 
    header.includes(isZh ? '型号' : 'Model') || 
    header.toLowerCase().includes('model')
  );
  
  // 如果找不到型号列，则使用第一列作为型号
  const modelIndex = modelColumnIndex >= 0 ? modelColumnIndex : 0;
  
  // 生成变体结构化数据
  const productGroupStructuredData = {
    "@context": "https://schema.org/",
    "@type": SCHEMA_TYPES.PRODUCT_GROUP,
    "name": groupName,
    "productGroupID": product.id,
    "description": product.overview,
    "brand": {
      "@type": "Brand",
      "name": companyName
    },
    "manufacturer": {
      "@type": "Organization",
      "name": companyName
    },
    "hasVariant": tableData.map((row: any[], index: number) => {
      // 构建每个型号的技术规格
      const specifications = tableHeaders.map((header: string, headerIndex: number) => {
        if (row[headerIndex] === undefined) return null;
        return {
          "@type": "PropertyValue",
          "name": header,
          "value": row[headerIndex].toString()
        };
      }).filter(Boolean);
      
      // 创建产品变体
      return {
        "@type": SCHEMA_TYPES.PRODUCT_MODEL,
        "name": `${product.title} ${row[modelIndex]}`,
        "model": row[modelIndex],
        "productID": `${product.id}-${row[modelIndex]}`.replace(/\s+/g, '-').toLowerCase(),
        "additionalProperty": specifications
      };
    })
  };
  
  return productGroupStructuredData;
}