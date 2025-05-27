import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import OptimizedImage from './layouts/OptimizedImage';
import Image from 'next/image';

interface FooterProps {
  logoAlt: string;
}

export default function Footer({ logoAlt }: FooterProps) {
  const t = useTranslations();
  const locale = useLocale();
    
  // 确保 locale 始终有一个安全的默认值
  const safeLocale = locale || 'zh';
  
  // 使用不同于header的logo路径
  const logoSrc = `/logo/footer-logo-${safeLocale}.webp`;
  
  // 根据当前语言环境选择合适的内容
  const footerContent = {
    productsServices: safeLocale === 'zh' ? "产品与服务" : "Products & Services",
    solutions: safeLocale === 'zh' ? "解决方案" : "Our Solutions",
    miningEPC: safeLocale === 'zh' ? "矿山EPC服务" : "Mining EPC Services",
    globalCases: safeLocale === 'zh' ? "全球案例" : "Global Cases",
    newsMedia: safeLocale === 'zh' ? "新闻与媒体" : "News & Media",
    aboutUs: safeLocale === 'zh' ? "关于我们" : "About us",
    contactUs: safeLocale === 'zh' ? "联系我们" : "Contact Us",
    contactName: safeLocale === 'zh' ? "吴宇涛, 国际业务总监" : "Cassian Wu, International Business Director",
    copyright: safeLocale === 'zh' 
      ? `版权所有 © 泽鑫矿业有限公司; 广西省南宁市扶绥县尚龙大道东盟青年产业园, 中国` 
      : `Copyright © Zexin Mining Equipment Co., Ltd; Shanglong Avenue, ASEAN Youth Industrial Park, Fusui County, Nanning City, Guangxi Province, China`
  };

  return (
    <footer className="pt-8 sm:pt-10 md:pt-12 lg:pt-16 pb-8 bg-gray-800 text-white">
      <div className="max-w-[90%] sm:max-w-[92%] lg:max-w-[94%] 2xl:max-w-[95%] mx-auto px-4 sm:px-5 lg:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-x-16">
          {/* Logo区域 */}
          <div className="col-span-1 sm:col-span-2 pb-8 sm:pb-12 lg:pb-16">
            <figure aria-label="Logotype">
              <Link href={`/${safeLocale}`}>
                <OptimizedImage 
                  src={logoSrc}
                  alt={logoAlt}
                  width={160}
                  height={40}
                  className="h-10 sm:h-12 lg:h-[48px] w-auto"
                  priority
                  unoptimized={true}
                />
              </Link>
            </figure>
          </div>

          {/* 主导航菜单 */}
          <div className="col-span-1">
            <nav aria-label="Left footer navigation" className="text-base text-white pb-6 sm:pb-8 lg:pb-16">
              <ul className="flex flex-col gap-2 sm:gap-1">
                <li><Link href={`/${safeLocale}/products`} className="text-white no-underline hover:text-[#ff6633] transition-colors font-text inline-block py-1">{footerContent.productsServices}</Link></li>
                <li><Link href={`/${safeLocale}/products/mineral-processing-solutions`} className="text-white no-underline hover:text-[#ff6633] transition-colors font-text inline-block py-1">{footerContent.solutions}</Link></li>
                <li><Link href={`/${safeLocale}/products/mining-epc`} className="text-white no-underline hover:text-[#ff6633] transition-colors font-text inline-block py-1">{footerContent.miningEPC}</Link></li>
                <li><Link href={`/${safeLocale}/cases`} className="text-white no-underline hover:text-[#ff6633] transition-colors font-text inline-block py-1">{footerContent.globalCases}</Link></li>
                <li><Link href={`/${safeLocale}/news`} className="text-white no-underline hover:text-[#ff6633] transition-colors font-text inline-block py-1">{footerContent.newsMedia}</Link></li>
                <li><Link href={`/${safeLocale}/about`} className="text-white no-underline hover:text-[#ff6633] transition-colors font-text inline-block py-1">{footerContent.aboutUs}</Link></li>
              </ul>
            </nav>
          </div>

          {/* 社交媒体图标和联系人区域 */}
          <div className="col-span-1">
            <div className="flex flex-col gap-12">
              {/* 社交媒体图标区域 */}
              <nav aria-label="Social Media Links" className="text-base text-white">
                <div className="flex flex-row gap-4 items-center">
                  {/* Facebook */}
                  <Link href="#" aria-label="Facebook" className="text-white hover:text-[#ff6633] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                    </svg>
                  </Link>
                  {/* X (Twitter) */}
                  <Link href="https://x.com/XindiMining" aria-label="X (Twitter)" className="text-white hover:text-[#ff6633] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </Link>
                  {/* YouTube */}
                  <Link href="https://www.youtube.com/@zexinmining" aria-label="YouTube" className="text-white hover:text-[#ff6633] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                    </svg>
                  </Link>
                  {/* LinkedIn */}
                  <Link href="#" aria-label="LinkedIn" className="text-white hover:text-[#ff6633] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
                    </svg>
                  </Link>
                </div>
              </nav>
              
              {/* 联系人信息区域 */}
              <div className="flex flex-col gap-3 mt-6">
                <h3 className="text-sm font-bold">
                  {footerContent.contactUs}
                </h3>
                
                <div className="flex items-center gap-4">
                  {/* 联系人照片 */}
                  <div className="relative w-20 h-20 rounded-md overflow-hidden">
                    <Image 
                      src="/images/about/team-intl.jpg"
                      alt={safeLocale === 'zh' ? "吴宇涛" : "Cassian Wu"}
                      width={80}
                      height={80}
                      className="object-cover"
                      unoptimized={true}
                    />
                  </div>
                  
                  {/* 联系信息 */}
                  <div className="flex flex-col gap-1">
                    <p className="text-sm leading-tight">
                      {footerContent.contactName}
                    </p>
                    <p className="text-sm text-gray-300 leading-tight">
                      Email: <Link href="mailto:zexinminingequipment@hotmail.com" className="text-white hover:text-[#ff6633] transition-colors no-underline">zexinminingequipment@hotmail.com</Link>
                    </p>
                    <p className="text-sm text-gray-300 leading-tight">
                      Phone: +86 13807719695
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        
          {/* 社交媒体和语言切换 */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-full pt-6 sm:pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <section aria-label="Locale" className="pb-6 sm:pb-0 text-sm order-first sm:order-last mb-4 sm:mb-0">
                {/* 语言切换控件可以在这里添加 */}
              </section>
            </div>
          </div>

          {/* 版权信息 */}
          <div className="col-span-full pt-4">
            <div className="border-t border-[#ff6633] pt-4">
              <p className="text-xs text-gray-300 font-text leading-normal">
                © {new Date().getFullYear()} {footerContent.copyright}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 