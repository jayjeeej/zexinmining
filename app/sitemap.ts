import { MetadataRoute } from 'next';

// 网站基础URL
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.zexinmine.com';

export default function sitemap(): MetadataRoute.Sitemap {
  // 主要页面
  const mainPages = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/solutions`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
  ];

  // 产品类别页面
  const categoryPages = [
    'stationary-crushers',
    'vibrating-screens',
    'washing-equipment',
    'feeding-equipment',
    'grinding-equipment',
    'classification-equipment',
    'gravity-separation',
    'flotation',
    'magnetic-separation',
    'tailings',
  ].map(slug => ({
    url: `${baseUrl}/products/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // 产品详情页面 - 这里列出了一些主要产品，实际项目中可能需要从API或数据库获取完整列表
  const productPages = [
    'jaw-crusher',
    'impact-crusher',
    'cone-crusher',
    'hammer-crusher',
    'vibrating-screen',
    'linear-vibrating-screen',
    'spiral-washer',
    'overflow-ball-mill',
    'wet-grid-ball-mill',
    'sag-ball-mill',
    'xcf-flotation-machine',
    'permanent-magnetic-drum-separator',
  ].map(slug => ({
    url: `${baseUrl}/products/${getProductCategory(slug)}/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // 解决方案页面
  const solutionPages = [
    'south-africa',
    'gabon',
    'changjiang',
    'abu-dhabi',
  ].map(slug => ({
    url: `${baseUrl}/solutions/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // 合并所有页面
  return [...mainPages, ...categoryPages, ...productPages, ...solutionPages];
}

/**
 * 根据产品ID获取其所属分类
 */
function getProductCategory(productId: string): string {
  if (productId.includes('crusher')) {
    return 'stationary-crushers';
  } else if (productId.includes('screen') || productId === 'vibrating-screen') {
    return 'vibrating-screens';
  } else if (productId.includes('washer')) {
    return 'washing-equipment';
  } else if (productId.includes('mill')) {
    return 'grinding-equipment';
  } else if (productId.includes('feeder')) {
    return 'feeding-equipment';
  } else if (productId.includes('classifier')) {
    return 'classification-equipment';
  } else if (productId.includes('jig') || productId.includes('shaking-table') || productId.includes('spiral-chute')) {
    return 'gravity-separation';
  } else if (productId.includes('flotation')) {
    return 'flotation';
  } else if (productId.includes('magnetic') || productId.includes('electrostatic')) {
    return 'magnetic-separation';
  }
  
  // 默认返回产品ID作为分类
  return productId;
} 