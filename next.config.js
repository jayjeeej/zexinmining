const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  // 提高性能的配置
  experimental: {
    // 优化包导入，指定需要优化的包名
    optimizePackageImports: ['react', 'react-dom', 'next/router']
  },
  // 性能优化配置
  reactStrictMode: true,
  productionBrowserSourceMaps: false, // 禁用生产环境的源映射以提高性能
  compiler: {
    // 移除控制台日志，提高性能
    removeConsole: {
      exclude: ['error', 'warn'],
    },
  },
  // 确保所有路由正确处理
  trailingSlash: false,
  // 图片优化配置
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.zexinmining.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      }
    ],
    // 启用图像优化
    // 设置默认图像设置值
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp', 'image/avif'],
    // 增加图片大小限制到10MB，应对高分辨率图片
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    // 禁用图片大小验证，允许任意大小的图片
    unoptimized: false
  },
  // 强制HTTPS
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          }
        ]
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/videos/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      // 优化静态资源缓存
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/data/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400'
          }
        ]
      },
      // 百度验证文件特殊处理
      {
        source: '/baidu_verify_:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate'
          }
        ]
      }
    ];
  },
  // 修复的HTTP到HTTPS重定向（避免循环重定向）
  async redirects() {
    return [
      // HTTP 到 HTTPS 重定向（仅当请求是HTTP时）
      {
        source: '/:path*',
        destination: 'https://www.zexinmining.com/:path*',
        permanent: true,
        has: [
          {
            type: 'header',
            key: 'x-forwarded-proto',
            value: 'http',
          }
        ],
        // 百度验证文件不重定向
        missing: [
          {
            type: 'query',
            key: 'baidu-site-verification',
          }
        ]
      },
      // 百度验证文件路径不重定向
      {
        source: '/baidu_verify_:code',
        destination: '/baidu_verify_:code',
        permanent: false,
      },
      // 非www到www重定向（将不带www的版本重定向到带www的版本）
      {
        source: '/:path*',
        destination: 'https://www.zexinmining.com/:path*',
        permanent: true,
        has: [
          {
            type: 'host',
            value: 'zexinmining.com',
          }
        ],
        // 百度验证文件不重定向
        missing: [
          {
            type: 'query',
            key: 'baidu-site-verification',
          }
        ]
      },
      // 百度验证文件特殊处理
      {
        source: '/baidu_verify_:code',
        destination: '/api/baidu-verify/:code',
        permanent: false,
      }
    ]
  },
  // 配置代码分割策略
  webpack: (config, { isServer }) => {
    // 修改代码分割的大小阈值，创建更多小块
    config.optimization.splitChunks = {
      chunks: 'all',
      maxInitialRequests: 25,
      minSize: 20000,
      maxSize: 60000,
      cacheGroups: {
        default: false,
        vendors: false,
        // 把react相关依赖分到一个chunk
        framework: {
          name: 'framework',
          test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
          priority: 40,
          chunks: 'all',
          enforce: true,
        },
        // 重用率高的库分到一个chunk
        lib: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
            return `npm.${packageName.replace('@', '')}`;
          },
          priority: 30,
          minChunks: 2,
          reuseExistingChunk: true,
        },
      },
    };
    return config;
  },
}

module.exports = withNextIntl(nextConfig) 