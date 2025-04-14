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
  // 指定静态生成的路由 - 仅在生产环境使用
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  // 图片优化配置
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.zexinmining.com',
      },
    ],
    unoptimized: true, // 保持现有配置，避免冲突
    // 设置默认图像设置值
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp', 'image/avif'],
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
          },
        ],
      },
      // 非www到www重定向（仅当域名不是www.zexinmining.com时）
      {
        source: '/:path*',
        destination: 'https://www.zexinmining.com/:path*',
        permanent: true,
        has: [
          {
            type: 'host',
            value: 'zexinmining.com',
          },
        ],
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

module.exports = nextConfig
