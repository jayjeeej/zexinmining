import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// 移除force-dynamic，使用增量静态生成
export const revalidate = 86400; // 每天重新验证一次 (24小时)

/**
 * 生成产品专用网站地图
 * 按照产品类别组织，提高搜索引擎抓取效率
 */
export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.zexinmining.com';
  
  try {
    // 构建XML头部
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;
    
    // 获取按类别组织的产品URL
    const productUrlsByCategoryAndLocale = await getProductUrlsByCategory();
    
    // 添加产品页URL到XML
    for (const categoryKey in productUrlsByCategoryAndLocale) {
      const category = productUrlsByCategoryAndLocale[categoryKey];
      
      // 添加类别页面
      for (const locale of ['en', 'zh']) {
        xml += `
  <url>
    <loc>${baseUrl}/${locale}/products/ore-processing/${categoryKey}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en/products/ore-processing/${categoryKey}" />
    <xhtml:link rel="alternate" hreflang="zh" href="${baseUrl}/zh/products/ore-processing/${categoryKey}" />
  </url>`;
      }
      
      // 添加产品详情页
      for (const locale in category) {
        const products = category[locale];
        
        for (const product of products) {
          // 使用完整的SEO友好URL格式: /locale/products/ore-processing/subcategory/productId
          const productUrl = `${baseUrl}/${locale}/products/ore-processing/${categoryKey}/${product.id}`;
          
          const alternateLinks = Object.keys(category)
            .filter(l => category[l].some(p => p.id === product.id))
            .map(l => `    <xhtml:link rel="alternate" hreflang="${l}" href="${baseUrl}/${l}/products/ore-processing/${categoryKey}/${product.id}" />`);
          
          // 获取产品信息以添加图片
          const productData = await getProductData(product.id, locale);
          const imageTag = productData?.imageSrc ? 
            `
    <image:image>
      <image:loc>${baseUrl}${productData.imageSrc}</image:loc>
      <image:title>${escapeXml(productData.title)}</image:title>
      <image:caption>${escapeXml(productData.overview || productData.title)}</image:caption>
    </image:image>` : '';
          
          xml += `
  <url>
    <loc>${productUrl}</loc>
    <lastmod>${product.lastModified.toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
${alternateLinks.join('\n')}${imageTag}
  </url>`;
        }
      }
    }
    
    // 关闭XML
    xml += `
</urlset>`;
    
    // 返回XML响应
    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  } catch (error) {
    console.error('Error generating product sitemap:', error);
    return new NextResponse(`Error generating sitemap: ${error}`, {
      status: 500,
    });
  }
}

/**
 * 按类别和语言获取所有产品URL
 */
async function getProductUrlsByCategory(): Promise<Record<string, Record<string, Array<{ id: string; lastModified: Date; }> >>> {
  const results: Record<string, Record<string, Array<{ id: string; lastModified: Date; }>>> = {};
  const locales = ['en', 'zh'];
  
  try {
    // 遍历语言文件夹
    for (const locale of locales) {
      const dataDir = path.join(process.cwd(), 'public', 'data', locale);
      
      try {
        const files = await fs.readdir(dataDir);
        const jsonFiles = files.filter(file => file.endsWith('.json'));
        
        for (const file of jsonFiles) {
          try {
            const filePath = path.join(dataDir, file);
            const stats = await fs.stat(filePath);
            const productId = file.replace('.json', '');
            
            // 获取产品数据以确定类别
            const productData = await getProductData(productId, locale);
            
            if (!productData || !productData.subcategory) {
              continue;
            }
            
            const category = productData.subcategory;
            
            // 初始化类别和语言条目
            if (!results[category]) {
              results[category] = {};
            }
            
            if (!results[category][locale]) {
              results[category][locale] = [];
            }
            
            // 添加产品
            results[category][locale].push({
              id: productId,
              lastModified: stats.mtime
            });
          } catch (fileError) {
            console.error(`Error processing file ${file}:`, fileError);
          }
        }
      } catch (localeError) {
        console.error(`Error reading directory for locale ${locale}:`, localeError);
      }
    }
  } catch (error) {
    console.error('Error generating product sitemap entries:', error);
  }
  
  return results;
}

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