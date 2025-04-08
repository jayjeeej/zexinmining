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
      }
    ]
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
  }
}

module.exports = nextConfig
