'use client';

/**
 * 产品结构化数据组件 - 生成产品相关的JSON-LD结构化数据
 * 这将帮助搜索引擎更好地理解产品信息并可能在搜索结果中显示丰富的结果
 */

interface ProductStructuredDataProps {
  name: string;
  description: string;
  image?: string;
  category?: string;
  brand?: string;
  url?: string;
}

export default function ProductStructuredData({
  name,
  description,
  image,
  category = "矿山设备",
  brand = "泽鑫矿山设备",
  url,
}: ProductStructuredDataProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.zexinmine.com";
  const productUrl = url ? `${baseUrl}${url}` : undefined;
  const imageUrl = image ? `${baseUrl}${image}` : undefined;

  // 构建结构化数据对象
  const structuredData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: name,
    description: description,
    ...(brand && { brand: { "@type": "Brand", name: brand } }),
    ...(category && { category: category }),
    ...(productUrl && { url: productUrl }),
    ...(imageUrl && { image: imageUrl }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
} 