'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "../contexts/LanguageContext";

// 导航链接数据
const navLinks = [
  { href: "/", labelZh: "首页", labelEn: "Home" },
  { href: "/about", labelZh: "关于我们", labelEn: "About" },
  { href: "/products", labelZh: "产品中心", labelEn: "Products" },
  { href: "/solutions", labelZh: "矿山总承包服务", labelEn: "Mining EPC Services" },
  { href: "/news", labelZh: "新闻动态", labelEn: "News" },
  { href: "/contact", labelZh: "联系我们", labelEn: "Contact" }
];

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchAnimation, setSearchAnimation] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // 使用语言上下文
  const { isZh, toggleLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [headerAnimation, setHeaderAnimation] = useState('');
  const headerHeight = 96; // 头部高度 (h-24 = 6rem = 96px)

  // 确保只在客户端渲染
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // 滚动处理函数优化
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const scrollingDown = currentScrollY > lastScrollY;
          
          // 微小阈值，防止轻微滚动时触发状态变化
          if (Math.abs(currentScrollY - lastScrollY) < 3) {
            ticking = false;
            return;
          }
          
          // 使用阈值判断是否应该固定导航栏
          if (currentScrollY > headerHeight) {
            if (!isScrolled && scrollingDown) {
              setIsScrolled(true);
              setHeaderAnimation('header-appear');
            } 
          } else if (isScrolled || currentScrollY <= 5) {
            setIsScrolled(false);
            setHeaderAnimation('');
          }
          
          lastScrollY = currentScrollY;
          ticking = false;
        });
        
        ticking = true;
      }
    };
    
    // 使用passive选项优化滚动性能
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isScrolled]);

  // 检查当前页面是否活跃
  const isActive = (path: string) => pathname === path;

  // 处理搜索框的打开和关闭动画
  useEffect(() => {
    if (isSearchOpen) {
      setSearchAnimation('animate-slideDown');
      // 聚焦搜索框
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 300);
      
      return () => clearTimeout(timer);
    } else {
      setSearchAnimation('animate-slideUp');
    }
  }, [isSearchOpen]);
  
  // 处理搜索框的打开和关闭
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const searchTerm = searchInputRef.current?.value;
    if (searchTerm && searchTerm.trim() !== '') {
      // 跳转到搜索结果页面，将搜索词作为查询参数
      window.location.href = `/search?q=${encodeURIComponent(searchTerm.trim())}`;
    }
  };

  // 处理移动菜单的切换
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <header className={`w-full z-50 ${
        isScrolled 
          ? `fixed top-0 bg-white shadow-md ${headerAnimation}` 
          : 'relative bg-white'
        } will-change-transform`}>
        <div className="container mx-auto px-4 max-w-[1200px]">
          <div className="flex items-center justify-between h-24">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <Image
                  src={isZh ? "/images/logo-zh.png" : "/images/logo-en.png"}
                  width={275}
                  height={62}
                  alt={isZh ? "泽鑫矿山设备" : "Zexin Mining Equipment"}
                  className="h-14 w-auto"
                  priority={true}
                />
              </Link>
            </div>

            {/* 桌面导航 */}
            <nav className="hidden md:flex space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-base font-medium transition-colors ${
                    isActive(link.href) 
                      ? "text-[#1441F5] border-b-2 border-[#1441F5]" 
                      : "text-gray-700 hover:text-[#1441F5]"
                  }`}
                >
                  {isZh ? link.labelZh : link.labelEn}
                </Link>
              ))}
            </nav>

            {/* 右侧功能区 */}
            <div className="flex items-center space-x-6">
              {/* 语言切换 */}
              <div className="flex space-x-3">
                <button 
                  onClick={toggleLanguage} 
                  className={`font-medium ${isZh ? "text-[#1441F5]" : "text-gray-700 hover:text-[#1441F5]"}`}
                >
                  中文
                </button>
                <button 
                  onClick={toggleLanguage} 
                  className={`font-medium ${!isZh ? "text-[#1441F5]" : "text-gray-700 hover:text-[#1441F5]"}`}
                >
                  English
                </button>
              </div>
              
              {/* 搜索按钮 */}
              <button
                onClick={toggleSearch}
                className="text-gray-600 hover:text-gray-900"
                aria-label={isZh ? "搜索" : "Search"}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              
              {/* 移动菜单按钮 */}
              <button
                className="md:hidden text-gray-700 hover:text-[#1441F5]"
                onClick={toggleMobileMenu}
                aria-label={isMobileMenuOpen ? (isZh ? "关闭菜单" : "Close Menu") : (isZh ? "打开菜单" : "Open Menu")}
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* 分隔线 */}
        <div className="h-px bg-gray-300" />
        
        {/* 搜索弹窗 - 使用固定定位和动画 */}
        {isSearchOpen && (
          <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby="search-heading">
            <div 
              className="absolute inset-0 backdrop-blur-sm bg-white/95 transition-opacity duration-300"
              onClick={toggleSearch}
            />
            
            <div className={`relative w-full bg-white shadow-md ${searchAnimation}`}>
              <div className="container mx-auto h-24">
                <div className="flex items-center h-full px-4" onClick={(e) => e.stopPropagation()}>
                  {/* 保持Logo在搜索框中的显示 */}
                  <div className="flex-shrink-0 mr-8">
                    <Link href="/" className="flex items-center" onClick={(e) => e.preventDefault()}>
                      <Image
                        src={isZh ? "/images/logo-zh.png" : "/images/logo-en.png"}
                        width={275}
                        height={62}
                        alt={isZh ? "泽鑫矿山设备" : "Zexin Mining Equipment"}
                        className="h-14 w-auto"
                        priority={true}
                      />
                    </Link>
                  </div>

                  {/* 搜索输入区域 */}
                  <form onSubmit={handleSearch} className="flex-1 flex items-center gap-4">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                        <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <input
                        ref={searchInputRef}
                        type="text"
                        className="w-full h-12 pl-10 pr-4 border-2 border-gray-300 rounded focus:outline-none focus:border-black"
                        placeholder={isZh ? "搜索..." : "Search..."}
                        autoFocus
                      />
                    </div>
                    
                    <button 
                      type="submit"
                      className="inline-block bg-blue-600 border border-blue-600 text-white hover:bg-blue-700 hover:border-blue-700 py-3 px-8 transition duration-300"
                    >
                      {isZh ? "搜索" : "Search"}
                    </button>
                    
                    <button 
                      type="button"
                      onClick={toggleSearch}
                      className="text-gray-700 hover:text-gray-900"
                    >
                      {isZh ? "取消" : "Cancel"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 移动菜单 */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-300">
            <nav className="p-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block py-2 ${
                    isActive(link.href) 
                      ? "text-[#1441F5] font-medium" 
                      : "text-gray-700 hover:text-[#1441F5]"
                  }`}
                >
                  {isZh ? link.labelZh : link.labelEn}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-200 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{isZh ? "语言:" : "Language:"}</span>
                  <div className="flex space-x-4">
                    <button 
                      onClick={toggleLanguage} 
                      className={`font-medium ${isZh ? "text-[#1441F5]" : "text-gray-700 hover:text-[#1441F5]"}`}
                    >
                      中文
                    </button>
                    <button 
                      onClick={toggleLanguage} 
                      className={`font-medium ${!isZh ? "text-[#1441F5]" : "text-gray-700 hover:text-[#1441F5]"}`}
                    >
                      English
                    </button>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        )}
      </header>
      {/* 当导航栏固定时，添加占位区域防止内容跳动 */}
      <div className={`header-spacer ${isScrolled ? 'active' : ''}`}></div>
    </>
  );
} 