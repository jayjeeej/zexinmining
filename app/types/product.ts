// 面包屑导航项
export interface BreadcrumbItem {
  label: {
    zh: string;
    en: string;
  };
  href?: string;
}

// 参数范围类型
export interface ParameterRange {
  min: number;
  max: number;
  unit?: string;
}

// 技术参数表格列定义
export interface SpecsColumn {
  key: string;
  title: {
    zh: string;
    en: string;
  };
  unit?: string;
}

// 技术参数表格注释项
export interface SpecsNote {
  content: {
    zh: string;
    en: string;
  };
}

// 应用场景项
export interface ApplicationItem {
  title: {
    zh: string;
    en: string;
  };
  description: {
    zh: string;
    en: string;
  };
}

// 相关产品项
export interface RelatedProductItem {
  id: string;
  series: {
    zh: string;
    en: string;
  };
  model?: string;
  image: string;
}

// 格式化后的相关产品项（用于前端显示）
export interface FormattedRelatedProductItem extends RelatedProductItem {
  url?: string;
  fullImageUrl?: string;
}

// 自定义章节（用于产品详情页中的自定义内容）
export interface CustomSection {
  title: {
    zh: string;
    en: string;
  };
  content: {
    zh: string;
    en: string;
  };
}

// 产品详情数据类型
export interface ProductDetailData {
  id: string;
  model: string;
  category: string;
  subcategory: string;
  series: {
    zh: string;
    en: string;
  };
  imagePath: string;
  capacity?: ParameterRange;
  screenSize?: ParameterRange;
  maxFeedSize?: ParameterRange;
  motorPower?: ParameterRange;
  effectiveVolume?: ParameterRange;
  overview?: {
    zh: string;
    en: string;
  };
  specifications: {
    title: {
      zh: string;
      en: string;
    };
    columns: SpecsColumn[];
    data: Array<{[key: string]: string | number}>;
    notes?: SpecsNote[];
  };
  features?: Array<{
    zh: string;
    en: string;
  }>;
  applications?: {
    title?: {
      zh: string;
      en: string;
    };
    items: ApplicationItem[];
  };
  relatedProducts?: {
    title?: {
      zh: string;
      en: string;
    };
    basePath: string;
    items: RelatedProductItem[];
  };
  customSections?: CustomSection[];
}

// 产品卡片数据类型（用于产品列表页）
export interface ProductCardData {
  id: string;
  series: {
    zh: string;
    en: string;
  } | string;
  model?: string;
  image?: string;
  imagePath?: string;
  capacity?: ParameterRange | string;
  screenSize?: ParameterRange | string;
  maxFeedSize?: ParameterRange | string;
  motorPower?: ParameterRange | string;
  type?: string;
  category?: string;
  subcategory?: string;
} 