import type { Metadata } from "next";
import { Inter, Noto_Sans_SC } from "next/font/google";
import localFont from 'next/font/local';
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import NewsletterBanner from "./components/NewsletterBanner";
import { LanguageProvider } from "./contexts/LanguageContext";
import CookieConsent from './components/CookieConsent'
import DynamicTitle from './components/DynamicTitle';

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: '--font-inter',
});

const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ['400', '500', '700', '900'],
  display: "swap",
  variable: '--font-noto-sans',
});

// 添加Sandvik Sans Text Wolf Bold字体
const sandvikSans = localFont({
  src: '../public/fonts/SandvikSansText-Bold.woff2',
  display: 'swap',
  variable: '--font-sandvik-sans',
});

// 多语言元数据
export const metadata: Metadata = {
  // 使用语言无关的元数据，以防止构建时出现问题
  // 客户端将动态根据当前语言设置正确的标题
  title: {
    template: "%s | 泽鑫矿山设备 | Zexin Mining Equipment",
    default: "泽鑫矿山设备 - 专业矿山设备制造商 | Zexin Mining Equipment - Professional Mining Equipment Manufacturer"
  },
  description: "泽鑫矿山设备有限公司是一家专业从事矿山设备研发、生产和销售的高新技术企业 | Zexin Mining Equipment Co., Ltd. is a high-tech enterprise specializing in R&D, production and sales of mining equipment",
  generator: "Next.js",
  applicationName: "Zexin Mining Equipment",
  keywords: ["矿山设备", "破碎机", "球磨机", "浮选机", "磁选机", "重选设备", "mining equipment", "crusher", "ball mill", "flotation machine", "magnetic separator", "gravity equipment"],
  authors: [{ name: "Zexin Mining Equipment Co., Ltd", url: "https://www.zexinmining.com" }],
  // 根据实际网站地址修改基本 URL
  metadataBase: new URL("https://www.zexinmining.com"), 
  robots: { index: true, follow: true },
};

// 分离 viewport 配置
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <head>
        {/* Google Search Console 验证标签 - 请替换为您实际的验证代码 */}
        <meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />
      </head>
      <body className={`${inter.className} ${notoSansSC.variable} ${sandvikSans.variable} antialiased`}>
        <LanguageProvider>
          <DynamicTitle />
          <Header />
          {children}
          <NewsletterBanner />
          <Footer />
          <CookieConsent />
        </LanguageProvider>
      </body>
    </html>
  );
}
