import { Metadata } from "next";

/**
 * 生成产品页面的SEO元数据
 * @param params 产品SEO参数
 * @returns Metadata对象
 */
export function generateProductMetadata(params: {
  titleZh: string;
  titleEn: string;
  descriptionZh: string;
  descriptionEn: string;
  keywords: string[];
  slug: string;
  category?: string;
}): Metadata {
  const { titleZh, titleEn, descriptionZh, descriptionEn, keywords, slug, category } = params;
  
  // 构建规范路径
  const path = category 
    ? `/products/${category}/${slug}` 
    : `/products/${slug}`;
  
  // 构建标题：中文标题 | 英文标题
  const title = `${titleZh} | ${titleEn}`;
  
  // 构建描述：合并中英文描述
  const description = `${descriptionZh} | ${descriptionEn}`;
  
  return {
    title: title,
    description: description,
    keywords: keywords,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: title,
      description: description,
      url: path,
      siteName: "泽鑫矿山设备 | Zexin Mining Equipment",
      locale: "zh_CN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
    },
  };
}

/**
 * 生成产品分类页面的SEO元数据
 */
export function generateCategoryMetadata(params: {
  titleZh: string;
  titleEn: string;
  descriptionZh: string;
  descriptionEn: string;
  keywords: string[];
  slug: string;
}): Metadata {
  const { titleZh, titleEn, descriptionZh, descriptionEn, keywords, slug } = params;
  
  // 构建规范路径
  const path = `/products/${slug}`;
  
  // 构建标题：中文标题 | 英文标题
  const title = `${titleZh} | ${titleEn}`;
  
  // 构建描述：合并中英文描述
  const description = `${descriptionZh} | ${descriptionEn}`;
  
  return {
    title: title,
    description: description,
    keywords: keywords,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: title,
      description: description,
      url: path,
      siteName: "泽鑫矿山设备 | Zexin Mining Equipment",
      locale: "zh_CN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
    },
  };
} 