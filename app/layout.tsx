import type { Metadata, Viewport } from 'next';
import './globals.css'; // Import global styles
import '../styles/performance.css'; // 引入性能优化全局样式
import '../styles/menu.css'; // 引入移动菜单样式
import StructuredData from '../components/StructuredData';
import { getOrganizationStructuredData } from '../lib/structuredData';
import BaiduVerificationTag from './components/BaiduVerificationTag';

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
    other: {
      'baidu-site-verification': ['codeva-rq96ZYqafE', 'codeva-nbtCgXOQHG'], // 添加百度验证码
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
        {/* 百度站点验证 - 静态标签 */}
        <meta name="baidu-site-verification" content="codeva-rq96ZYqafE" />
        <meta name="baidu-site-verification" content="codeva-nbtCgXOQHG" />
        {/* 百度站点验证 - 动态组件（针对爬虫） */}
        <BaiduVerificationTag />
        {/* 预连接到重要资源 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* 全站组织结构化数据 */}
        <StructuredData data={organizationStructuredData} id="organization-schema" />
        
        {/* 防止闪黑的即时执行脚本 */}
        <script dangerouslySetInnerHTML={{
          __html: `
            document.documentElement.classList.add('js');
            document.documentElement.style.backgroundColor = '#ffffff';
            document.documentElement.style.visibility = 'visible';
          `
        }} />
        
        {/* 性能优化脚本 */}
        <script src="/js/pageStabilizer.js" />
        <script src="/js/lazyLoading.js" defer />
        {/* 添加字体CSS引用 */}
        <link rel="stylesheet" href="/css/fonts.css" />

        {/* 预加载关键图片 - 提高首屏加载性能，避免闪黑 */}
        <link 
          rel="preload" 
          href="/images/og-image.jpg" 
          as="image" 
          fetchPriority="high"
          type="image/jpeg" 
        />
        {/* 预加载首页Hero图片 */}
        <link 
          rel="preload" 
          href="/images/Homepage/hero.jpg" 
          as="image" 
          fetchPriority="high"
          type="image/jpeg" 
        />
        
        {/* 设置页面背景色，确保一致性 */}
        <style dangerouslySetInnerHTML={{
          __html: `
            html, body {
              background-color: #ffffff !important;
              visibility: visible !important;
            }
            html:not(.js) {
              visibility: visible !important;
            }
            /* 移除所有页面过渡效果 */
            * {
              transition: none !important;
            }
          `
        }} />
        
        {/* 为非JS环境提供样式 */}
        <noscript id="no-js-styles">
          <style>
            {`
              html {
                visibility: visible !important;
                background-color: #ffffff !important;
              }
              body {
                background-color: #ffffff !important;
                visibility: visible !important;
            }
          `}
        </style>
        </noscript>
      </head>
      <body className="overflow-x-hidden font-text flex flex-col min-h-screen bg-white">
        {/* 页面跳转到主内容的链接 */}
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:p-4 focus:bg-white z-50">
          跳到主要内容
        </a>
        {children}
      </body>
    </html>
  );
} 