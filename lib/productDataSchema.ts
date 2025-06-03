// 定义产品数据的类型接口，参考山特维克网站的数据结构
export interface ProductData {
  id: string;
  title: string;
  series: string;
  imageSrc: string;
  imageSrcAlt?: string; // 添加图片alt属性
  productCategory: string;
  subcategory: string;
  model: string;
  // 主要参数，显示在产品头部
  meta: Array<{
    key: string;
    displayValue: string;
    imperialValue?: string; // 英制单位值
  }>;
  unitConversion?: {
    enabled: boolean;
    units?: {
      [unitType: string]: Array<{
        unit: string;
        conversionFactor: number;
        label: string;
      }>
    };
    defaultUnit?: 'metric' | 'imperial';
    uiConfig?: {
      showUnitToggle?: boolean;
      position?: 'top-right' | 'top-left';
      labels?: {
        toggle?: string;
        metric?: string;
        imperial?: string;
      }
    }
  };
  href: string;
  overview: string;
  detailedDescription?: string;
  // 技术规格
  specifications: {
    title?: string;
    note?: string;
    tableHeaders: string[];
    tableHeadersImperial?: string[];
    tableData: string[][];
    tableDataImperial?: string[][];
    unitTypes?: string[];
  };
  // 产品特点
  features: string[];
  // 应用领域
  applications: {
    title?: string;
    items: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  };
  // SEO相关信息
  seo?: {
    title?: string;
    keywords: string;
    description: string;
    metaDescription?: string;
  };
  // 搜索关键词数组
  searchKeywords?: string[];
  // 相关产品
  relatedProducts: string[];
  // 可选字段
  technicalAdvantages?: {
    title?: string;
    items: Array<{
      title: string;
      description: string;
      iconSrc?: string;
    }>;
  };
  // 常见问题
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
  // 案例研究
  caseStudies?: Array<{
    id: string;
    title: string;
    summary: string;
    imageSrc: string;
    href: string;
  }>;
}

// 定义产品接口的响应类型
export interface ProductResponse {
  product: ProductData;
  isSuccess: boolean;
  message?: string;
}

// 精简版产品类型，用于列表和概要展示
export interface Product {
  id: string;
  title: string;
  series?: string;
  model?: string;
  imageSrc: string;
  imageSrcAlt?: string; // 添加图片alt属性
  productCategory: string;
  subcategory?: string;
  metaData?: Array<{
    key: string;
    value: string;
    unit?: string;
  }>;
  overview?: string;
  href: string;
  seoDescription?: string;
  specifications?: ProductSpecification[];
  features?: string[] | Array<{ title: string; description: string }>;
  applications?: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  technicalAdvantages?: Array<{
    title: string;
    description: string;
    iconSrc?: string;
  }>;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
  caseStudies?: Array<{
    id: string;
    title: string;
    summary: string;
    imageSrc: string;
    href: string;
  }>;
}

// 产品规格类型
export interface ProductSpecification {
  name: string;
  value: string;
  unit?: string;
  category?: string;
  imperialValue?: string;
  imperialUnit?: string;
  description?: string;
  isHighlight?: boolean;
  imperialName?: string;
} 