'use client';

/**
 * 视频结构化数据组件 - 生成视频相关的JSON-LD结构化数据
 * 这将帮助搜索引擎更好地理解视频内容并可能在视频搜索结果中显示
 */

interface VideoStructuredDataProps {
  name: string;
  description: string;
  thumbnailUrl?: string;
  contentUrl: string;
  uploadDate: string;
  duration?: string;
  embedUrl?: string;
}

export default function VideoStructuredData({
  name,
  description,
  thumbnailUrl,
  contentUrl,
  uploadDate,
  duration,
  embedUrl,
}: VideoStructuredDataProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.zexinmining.com";
  const videoUrl = contentUrl.startsWith('http') ? contentUrl : `${baseUrl}${contentUrl}`;
  const thumbnailFullUrl = thumbnailUrl ? (thumbnailUrl.startsWith('http') ? thumbnailUrl : `${baseUrl}${thumbnailUrl}`) : undefined;
  const embedFullUrl = embedUrl ? (embedUrl.startsWith('http') ? embedUrl : `${baseUrl}${embedUrl}`) : undefined;

  // 构建结构化数据对象
  const structuredData = {
    "@context": "https://schema.org/",
    "@type": "VideoObject",
    name: name,
    description: description,
    thumbnailUrl: thumbnailFullUrl,
    contentUrl: videoUrl,
    uploadDate: uploadDate,
    ...(duration && { duration: duration }),
    ...(embedFullUrl && { embedUrl: embedFullUrl }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
} 