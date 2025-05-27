/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.zexinmining.com',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  exclude: ['/404', '/500'],
  alternateRefs: [
    {
      href: 'https://www.zexinmining.com/en',
      hreflang: 'en',
    },
    {
      href: 'https://www.zexinmining.com/zh',
      hreflang: 'zh',
    },
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    additionalSitemaps: [
      'https://www.zexinmining.com/server-sitemap.xml',
      'https://www.zexinmining.com/product-sitemap.xml',
    ],
  },
  transform: async (config, path) => {
    // 自定义URL优先级
    let priority = 0.7;
    
    // 首页优先级最高
    if (path === '/') {
      priority = 1.0;
    }
    // 产品页面优先级次高
    else if (path.startsWith('/products')) {
      priority = 0.8;
    }
    // 关于我们页面
    else if (path.startsWith('/about')) {
      priority = 0.6;
    }
    
    return {
      loc: path, // URL路径
      changefreq: path === '/' ? 'daily' : 'weekly', // 更新频率
      priority, // 优先级
      lastmod: new Date().toISOString(), // 最后修改日期
    };
  },
} 