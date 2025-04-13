'use client';

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "../contexts/LanguageContext";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  // 使用语言上下文
  const { isZh } = useLanguage();

  // 页脚导航链接
  const footerLinks = [
    { nameZh: "关于我们", nameEn: "About Us", href: "/about" },
    { nameZh: "产品中心", nameEn: "Products", href: "/products" },
    { nameZh: "矿山总承包", nameEn: "Mining EPC", href: "/solutions" },
    { nameZh: "新闻动态", nameEn: "News", href: "/news" },
    { nameZh: "联系我们", nameEn: "Contact Us", href: "/contact" }
  ];

  // 社交媒体链接
  const socialLinks = [
    { name: "LinkedIn", icon: "/images/social/linkedin.png", href: "https://www.linkedin.com/in/yutao-wu-41b05335a" },
    { name: "Facebook", icon: "/images/social/facebook.png", href: "https://www.facebook.com/share/1FRL7hFLwn/" },
    { name: "X", icon: "/images/social/twitter.png", href: "https://x.com/zexinmining" },
    { name: "WhatsApp", icon: "/images/social/whatsapp.png", href: "https://wa.me/639654706775" }
  ];

  return (
    <footer className="bg-[#222222] text-white pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-[1200px]">
        {/* 页脚顶部 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">
          {/* 公司信息 */}
          <div className="md:col-span-4">
            <div className="flex flex-col items-start">
              <Link href="/" className="block mb-8">
                <div className="relative w-auto h-auto">
                  <Image
                    src={isZh ? "/images/footer-logo-zh.png" : "/images/footer-logo-en.png"}
                    alt={isZh ? "泽鑫矿山设备" : "Zexin Mining"}
                    width={80}
                    height={28}
                    style={{ objectFit: "contain", maxWidth: "80px", height: "auto" }}
                    className="max-w-full"
                    priority
                  />
                </div>
              </Link>
            </div>
          </div>

          {/* 空白区域 */}
          <div className="hidden md:block md:col-span-5"></div>

          {/* 导航链接 */}
          <div className="md:col-span-3">
            <div className="flex justify-end">
              <ul className="space-y-4">
                {footerLinks.map((link) => (
                  <li key={isZh ? link.nameZh : link.nameEn}>
                    <Link 
                      href={link.href}
                      className="text-[#666666] hover:text-white text-base font-['Sandvik_Sans_Text',_sans-serif] transition-colors"
                    >
                      {isZh ? link.nameZh : link.nameEn}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 社交媒体链接 */}
        <div className="mb-0 mt-6 flex">
          {socialLinks.map((link) => (
            <a 
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mr-6 hover:opacity-80 transition-opacity"
              aria-label={link.name}
            >
              <div className="w-8 h-8 relative flex items-center justify-center">
                <Image
                  src={link.icon}
                  alt={link.name}
                  width={24}
                  height={24}
                  className="max-w-full"
                />
              </div>
            </a>
          ))}
        </div>

        {/* 页脚底部 */}
        <div className="pt-8 border-t-2 border-[#444444] flex flex-col md:flex-row justify-between items-center">
          <p className="text-[#666666] text-sm mb-4 md:mb-0">
            &copy; {currentYear} {isZh ? "泽鑫矿山设备有限公司" : "Zexin Mining Equipment Co., Ltd."} {isZh ? "版权所有" : "All Rights Reserved"}
          </p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="text-[#666666] hover:text-white text-sm transition-colors">
              {isZh ? "隐私政策" : "Privacy Policy"}
            </Link>
            <Link href="/terms" className="text-[#666666] hover:text-white text-sm transition-colors">
              {isZh ? "使用条款" : "Terms of Use"}
            </Link>
            <Link href="/sitemap" className="text-[#666666] hover:text-white text-sm transition-colors">
              {isZh ? "网站地图" : "Sitemap"}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 