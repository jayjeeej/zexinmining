import { MetadataRoute } from 'next';

// 添加静态导出配置
export const dynamic = 'force-static';
export const revalidate = 3600; // 每小时重新验证一次

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.zexinmining.com';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/_next/'],
    },
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/product-sitemap.xml`
    ],
  };
} 