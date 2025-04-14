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
import Script from 'next/script';
import { NavigationProvider } from './contexts/NavigationContext';

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

// 添加设置图像加载样式
const imageLoadingStyle = `
  img {
    display: block;
    contain: content;
  }
  img:not([src]) {
    visibility: hidden;
  }
  img[loading="lazy"] {
    min-height: 1px;
  }
  /* 预留图像空间减少布局偏移 */
  .img-container {
    position: relative;
    overflow: hidden;
    display: block;
    width: 100%;
  }
  .img-container > * {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    contain: paint;
  }
`;

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
        
        {/* favicon */}
        <link rel="icon" href="/favicon.ico" />
        
        {/* 预连接重要域名以提高性能 */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        
        {/* 使用更通用的方式优化CSS加载 */}
        <link rel="preconnect" href="https://www.zexinmining.com" crossOrigin="anonymous" />
        
        {/* 预加载CSS文件，避免渲染阻塞 */}
        <link rel="preload" href="https://www.zexinmining.com/_next/static/css/ec5d7e66bd3b6cb8.css" as="style" />
        <link rel="preload" href="https://www.zexinmining.com/_next/static/css/cf0024cdd6f6dce0.css" as="style" />
        <link rel="preload" href="https://www.zexinmining.com/_next/static/css/b2374641c6516a48.css" as="style" />
        
        {/* 预加载重要图像 */}
        <link rel="preload" as="image" href="/images/logo-zh.png" />
        <link rel="preload" as="image" href="/images/logo-en.png" />
        
        {/* 内联关键CSS以防止图像加载时的布局偏移 */}
        <style dangerouslySetInnerHTML={{ __html: imageLoadingStyle }} />
      </head>
      <body className={`${inter.className} ${notoSansSC.variable} ${sandvikSans.variable} antialiased`}>
        <NavigationProvider>
          <LanguageProvider>
            <DynamicTitle />
            <Header />
            {children}
            <NewsletterBanner />
            <Footer />
            <CookieConsent />
          </LanguageProvider>
        </NavigationProvider>
        
        {/* 优化输入响应性能的轻量级脚本 */}
        <Script id="input-optimization" strategy="afterInteractive">
          {`
            // 使用被动事件监听器减少输入延迟
            document.addEventListener('DOMContentLoaded', function() {
              // 使用options.passive=true优化触摸和滚动事件
              const passiveEvents = ['touchstart', 'touchmove', 'scroll', 'wheel'];
              
              function makePassive() {
                passiveEvents.forEach(event => {
                  // 为document添加被动事件监听
                  document.addEventListener(event, function() {}, { passive: true });
                  
                  // 删除重复的监听器，只保留一个有效的事件委托
                });
              }
              
              // 优化输入事件，减少延迟
              function optimizeInputEvents() {
                // 使用事件委托减少事件监听器数量
                document.addEventListener('input', function(e) {
                  if (e.target.matches('input, textarea, [contenteditable]')) {
                    e.target.dataset.changed = 'true';
                    
                    // 使用requestAnimationFrame代替setTimeout
                    if (e.target._inputRAF) cancelAnimationFrame(e.target._inputRAF);
                    e.target._inputRAF = requestAnimationFrame(function() {
                      // 输入完成后的处理逻辑
                      delete e.target.dataset.changed;
                    });
                  }
                }, { passive: true });
              }
              
              // 优化点击事件，减少点击延迟
              function optimizeClickEvents() {
                // 添加触摸反馈以提高感知性能
                document.addEventListener('touchstart', function(e) {
                  if (e.target.matches('a, button, [role="button"]')) {
                    // 立即添加活动状态
                    e.target.classList.add('active-touch');
                    
                    // 触摸结束后移除
                    const removeActive = () => {
                      e.target.classList.remove('active-touch');
                      document.removeEventListener('touchend', removeActive);
                      document.removeEventListener('touchcancel', removeActive);
                    };
                    
                    document.addEventListener('touchend', removeActive, { once: true });
                    document.addEventListener('touchcancel', removeActive, { once: true });
                  }
                }, { passive: true });
                
                // 使用事件委托处理所有点击
                document.addEventListener('mousedown', function(e) {
                  if (e.target.closest('a')) {
                    const link = e.target.closest('a');
                    if (link && link.href.startsWith(window.location.origin)) {
                      // 使用requestIdleCallback在空闲时间预加载
                      if ('requestIdleCallback' in window) {
                        requestIdleCallback(() => {
                          const prefetchLink = document.createElement('link');
                          prefetchLink.rel = 'prefetch';
                          prefetchLink.href = link.href;
                          document.head.appendChild(prefetchLink);
                        }, { timeout: 500 }); // 减少超时时间
                      }
                    }
                  }
                }, { passive: true });
              }
              
              // 添加触摸视觉反馈CSS
              (function addTouchStyles() {
                const style = document.createElement('style');
                style.textContent = \`
                  .active-touch {
                    transition: transform 0.1s ease-out !important;
                    transform: scale(0.98) !important;
                  }
                \`;
                document.head.appendChild(style);
              })();
              
              // 执行优化
              makePassive();
              optimizeInputEvents();
              optimizeClickEvents();
              
              // 预热JS引擎
              (function warmupJS() {
                // 提前编译关键函数以减少JIT延迟
                [].forEach.call([], () => {});
                [].map.call([], () => {});
                Object.keys({});
                JSON.parse(JSON.stringify({}));
                Promise.resolve().then(() => {});
                new Date().toISOString();
              })();
            });
          `}
        </Script>
        
        {/* 保留现有的Google Analytics和线程优化脚本 */}
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-EC13FTDBEK"
        />
        <Script
          id="gtag-config"
          strategy="afterInteractive"
          src="/js/analytics.js"
        />
        
        {/* 主线程优化 */}
        <Script id="thread-optimization" strategy="lazyOnload">
          {`
            // 使用requestIdleCallback优化长任务执行
            const optimizeLongTasks = () => {
              if ('requestIdleCallback' in window) {
                const longTaskObserver = new PerformanceObserver((list) => {
                  list.getEntries().forEach(entry => {
                    // 对于超过50ms的任务进行标记
                    if (entry.duration > 50) {
                      console.debug('Long task detected:', entry.duration + 'ms');
                    }
                  });
                });
                
                try {
                  longTaskObserver.observe({entryTypes: ['longtask']});
                } catch (e) {
                  // 浏览器不支持时静默失败
                }
              }
            };
            
            // 在浏览器空闲时初始化优化
            if ('requestIdleCallback' in window) {
              requestIdleCallback(() => optimizeLongTasks());
            } else {
              setTimeout(() => optimizeLongTasks(), 1000);
            }
          `}
        </Script>
        
        {/* 图像加载优化脚本 */}
        <Script id="image-optimization" strategy="afterInteractive">
          {`
            // 优化图像加载，减少布局偏移
            document.addEventListener('DOMContentLoaded', () => {
              // 为所有图片预先设置尺寸，防止布局偏移
              function presetImageDimensions() {
                const imageSelector = 'img:not([width]):not([height]):not([aspect-ratio-set])';
                const images = document.querySelectorAll(imageSelector);
                
                // 为产品页面图片添加特殊处理
                const isProductPage = window.location.pathname.includes('/products');
                if (isProductPage) {
                  document.body.setAttribute('data-page', 'products');
                }
                
                images.forEach(img => {
                  // 设置默认尺寸和比例
                  img.setAttribute('aspect-ratio-set', 'true');
                  
                  // 创建占位符，确保图像加载前有空间
                  const parent = img.parentElement;
                  if (parent && !parent.classList.contains('img-placeholder-set')) {
                    parent.classList.add('img-placeholder-set');
                    
                    // 设置最小高度，防止布局跳动
                    const minHeight = isProductPage ? '300px' : '200px';
                    if (!parent.style.minHeight || parent.style.minHeight === 'auto') {
                      parent.style.minHeight = minHeight;
                    }
                  }
                  
                  // 如果图片无尺寸但有src，则预加载获取尺寸
                  if (img.src && (!img.width || !img.height)) {
                    const tempImg = new Image();
                    tempImg.onload = function() {
                      img.width = tempImg.width;
                      img.height = tempImg.height;
                      
                      // 设置宽高比
                      const aspectRatio = tempImg.width / tempImg.height;
                      img.style.aspectRatio = \`\${aspectRatio}\`;
                      
                      // 找到父容器并调整大小
                      if (parent && parent.classList.contains('img-placeholder-set')) {
                        // 图像加载后，允许容器自然调整大小
                        parent.style.minHeight = 'auto';
                      }
                    };
                    tempImg.src = img.src;
                  }
                });
              }
              
              // 监听DOM变化，对新添加的图像应用相同的逻辑
              function observeDOMChanges() {
                if ('MutationObserver' in window) {
                  const observer = new MutationObserver(mutations => {
                    mutations.forEach(mutation => {
                      if (mutation.type === 'childList') {
                        const addedNodes = Array.from(mutation.addedNodes);
                        const hasNewImages = addedNodes.some(node => 
                          node.nodeName === 'IMG' || 
                          (node.nodeType === 1 && node.querySelector('img'))
                        );
                        
                        if (hasNewImages) {
                          presetImageDimensions();
                        }
                      }
                    });
                  });
                  
                  observer.observe(document.body, { 
                    childList: true, 
                    subtree: true 
                  });
                }
              }
              
              // 初始化布局稳定性优化
              presetImageDimensions();
              observeDOMChanges();
              
              // 在窗口调整大小时重新应用
              window.addEventListener('resize', presetImageDimensions, { passive: true });
            });
          `}
        </Script>
      </body>
    </html>
  );
}
