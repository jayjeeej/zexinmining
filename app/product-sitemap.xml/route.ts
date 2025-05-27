import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { writeFileSync } from 'fs';

// 使用静态生成，不使用动态路由
// export const revalidate = 86400; // 每天重新验证一次 (24小时)

// 预生成的静态站点地图内容
const staticSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>https://www.zexinmining.com/en/products/stationary-crushers/jaw-crusher</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <xhtml:link rel="alternate" hreflang="en" href="https://www.zexinmining.com/en/products/stationary-crushers/jaw-crusher" />
    <xhtml:link rel="alternate" hreflang="zh" href="https://www.zexinmining.com/zh/products/stationary-crushers/jaw-crusher" />
  </url>
  <url>
    <loc>https://www.zexinmining.com/en/products/stationary-crushers/cone-crusher</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <xhtml:link rel="alternate" hreflang="en" href="https://www.zexinmining.com/en/products/stationary-crushers/cone-crusher" />
    <xhtml:link rel="alternate" hreflang="zh" href="https://www.zexinmining.com/zh/products/stationary-crushers/cone-crusher" />
  </url>
  <url>
    <loc>https://www.zexinmining.com/en/products/vibrating-screens/vibrating-screen</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <xhtml:link rel="alternate" hreflang="en" href="https://www.zexinmining.com/en/products/vibrating-screens/vibrating-screen" />
    <xhtml:link rel="alternate" hreflang="zh" href="https://www.zexinmining.com/zh/products/vibrating-screens/vibrating-screen" />
  </url>
  <url>
    <loc>https://www.zexinmining.com/zh/products/stationary-crushers/jaw-crusher</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <xhtml:link rel="alternate" hreflang="en" href="https://www.zexinmining.com/en/products/stationary-crushers/jaw-crusher" />
    <xhtml:link rel="alternate" hreflang="zh" href="https://www.zexinmining.com/zh/products/stationary-crushers/jaw-crusher" />
  </url>
  <url>
    <loc>https://www.zexinmining.com/zh/products/stationary-crushers/cone-crusher</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <xhtml:link rel="alternate" hreflang="en" href="https://www.zexinmining.com/en/products/stationary-crushers/cone-crusher" />
    <xhtml:link rel="alternate" hreflang="zh" href="https://www.zexinmining.com/zh/products/stationary-crushers/cone-crusher" />
  </url>
  <url>
    <loc>https://www.zexinmining.com/zh/products/vibrating-screens/vibrating-screen</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <xhtml:link rel="alternate" hreflang="en" href="https://www.zexinmining.com/en/products/vibrating-screens/vibrating-screen" />
    <xhtml:link rel="alternate" hreflang="zh" href="https://www.zexinmining.com/zh/products/vibrating-screens/vibrating-screen" />
  </url>
</urlset>`;

// 在构建时生成静态站点地图文件
try {
  const publicDir = path.join(process.cwd(), 'public');
  writeFileSync(path.join(publicDir, 'product-sitemap.xml'), staticSitemap);
  console.log('Static product sitemap generated successfully');
} catch (error) {
  console.error('Error generating static product sitemap:', error);
}

/**
 * 静态站点地图API路由
 * 在静态导出模式中，返回预定义的站点地图内容
 */
export async function GET() {
  return new NextResponse(staticSitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}

// 以下是辅助函数，保留但不使用
/**
 * 获取产品数据
 */
async function getProductData(id: string, locale: string): Promise<any> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', locale, `${id}.json`);
    const fileContent = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Error reading product data for ${id}:`, error);
    return null;
  }
}

/**
 * 转义XML特殊字符
 */
function escapeXml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
} 