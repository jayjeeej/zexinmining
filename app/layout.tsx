import type { Metadata, Viewport } from 'next';
import './globals.css'; // Import global styles
import '../styles/performance.css'; // 引入性能优化全局样式
import StructuredData from '../components/StructuredData';
import { getOrganizationStructuredData } from '../lib/structuredData';

export const metadata: Metadata = {
  title: {
    template: '%s',
    default: '泽鑫矿山设备 - 专业选矿设备制造商'
  },
  description: '泽鑫矿山设备是专业矿山设备制造商，为全球客户提供高效可靠的智能解决方案和全面技术支持',
  keywords: ['矿山设备', '泽鑫', '采矿设备', '高效解决方案', '钻机', '采矿技术', '工业装备'],
  generator: 'Next.js',
  applicationName: '泽鑫矿山设备',
  authors: [{ name: '泽鑫矿山设备技术团队' }],
  creator: '泽鑫矿山设备',
  publisher: '泽鑫矿山设备有限公司',
  metadataBase: new URL('https://www.zexinmining.com'),
  alternates: {
    canonical: '/',
    languages: {
      'zh': '/zh',
      'en': '/en',
    },
  },
  openGraph: {
    type: 'website',
    title: '泽鑫矿山设备 - 专业矿山设备制造商', 
    description: '为全球客户提供高效可靠的智能解决方案和全面技术支持',
    siteName: '泽鑫矿山设备',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '泽鑫矿山设备 - 专业矿山设备制造商',
      }
    ],
    locale: 'zh_CN',
  },
  twitter: {
    card: 'summary_large_image',
    title: '泽鑫矿山设备 - 专业矿山设备制造商',
    description: '为全球客户提供高效可靠的智能解决方案和全面技术支持',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'rvOFxT0dkAmX13xPiyte-guHg1A4uE2JmEwTo6JYz-A', // 替换为您的验证码
    // 百度站长需要使用自定义验证，这里注释掉
    // baidu: 'your-baidu-site-verification-code',
    other: {
      // 如需百度站长验证，请替换为实际的验证码
      // baidu: 'your-baidu-site-verification-code', 
    }
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    other: [
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '192x192',
        url: '/android-chrome-192x192.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '512x512',
        url: '/android-chrome-512x512.png',
      },
    ],
  },
};

// 视口配置
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 2,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1b78e2' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 获取组织结构化数据
  const organizationStructuredData = getOrganizationStructuredData(true);
  
  return (
    <html lang="zh" suppressHydrationWarning>
      <head>
        {/* 百度站点验证 */}
        <meta name="baidu-site-verification" content="codeva-rq96ZYqafE" />
        {/* 预连接到重要资源 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* 全站组织结构化数据 */}
        <StructuredData data={organizationStructuredData} id="organization-schema" />
        {/* 性能优化脚本 */}
        <script src="/js/lazyLoading.js" defer></script>
        {/* 添加字体CSS引用 */}
        <link rel="stylesheet" href="/css/fonts.css" />
      </head>
      <body className="overflow-x-hidden font-text flex flex-col min-h-screen">
        {children}
      </body>
    </html>
  );
} 