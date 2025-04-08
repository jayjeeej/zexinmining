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
  // 添加HTTP到HTTPS的重定向
  async redirects() {
    return [
      {
        source: '/:path*',
        destination: 'https://www.zexinmining.com/:path*',
        permanent: true,
        basePath: false,
      }
    ]
  }
}

module.exports = nextConfig
