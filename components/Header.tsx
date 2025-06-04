'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { languages, HeaderNavItem, HeaderLogo, HeaderSubItem, HeaderColumn } from '../lib/navigation';
import OptimizedImage from './layouts/OptimizedImage';
import CardAnimationProvider from './CardAnimationProvider';

// 添加CSS样式定义，用于控制导航菜单的过渡效果
const styles = {
  mobileMenu: `
    .mobile-menu {
      transition: opacity 0.3s ease, transform 0.3s ease;
      opacity: 0;
      transform: translateY(-10px);
      visibility: hidden;
      will-change: opacity, transform;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      transform-style: preserve-3d;
    }
    
    .mobile-menu.open {
      opacity: 1;
      transform: translateY(0);
      visibility: visible;
    }
    
    /* 为了支持刷新和返回导航时的状态恢复 */
    @media (max-width: 1023px) {
      html[data-menu-open="true"] body {
        overflow: hidden;
      }
    }

    /* 防止页面过渡期间闪烁 */
    body.navigation-transition {
      animation: none !important;
      transition: none !important;
    }
    
    body.navigation-transition * {
      animation: none !important;
      transition: none !important;
    }

    /* 当组件即将卸载时，使用这个类避免闪烁 */
    .no-transition {
      transition: none !important;
    }

    /* 针对不同浏览器的返回导航优化 */
    .backface-fix {
      -webkit-backface-visibility: hidden;
      backface-visibility: hidden;
      transform: translateZ(0);
      perspective: 1000px;
    }
  `,
  globalStyles: `
    /* 通用的防闪烁样式 */
    .render-blocker {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: transparent;
      z-index: 9999;
      pointer-events: none;
      display: none;
    }
    
    /* 在导航返回时显示 */
    html[data-navigating-back="true"] .render-blocker {
      display: block;
    }
  `
};

// Debounce function (can be moved to a utils file later)
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

// Component props interface definition
export interface HeaderProps {
  logo: HeaderLogo;
  items: HeaderNavItem[];
}

// Search result type
interface SearchResult {
  url: string;
  title: string;
  excerpt: string;
}

// Delete the NavItem component that has errors - we'll simplify the approach
// Memoize the icon components for better performance
const SearchIcon = React.memo(() => (
  <svg focusable="false" fill="currentColor" width="24" height="24" aria-hidden="true">
    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
  </svg>
));

const CloseIcon = React.memo(() => (
  <svg focusable="false" fill="currentColor" width="24" height="24" aria-hidden="true">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
  </svg>
));

const MenuIcon = React.memo(() => (
  <svg focusable="false" fill="currentColor" width="28" height="24" aria-hidden="true" viewBox="0 0 28 24">
    <rect y="4" width="28" height="1.5" rx="0.75" />
    <rect y="11" width="28" height="1.5" rx="0.75" />
    <rect y="18" width="28" height="1.5" rx="0.75" />
  </svg>
));

const ArrowIcon = React.memo(() => (
  <svg focusable="false" fill="currentColor" width="16" height="16" aria-hidden="true" viewBox="0 0 24 24">
    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z"></path>
  </svg>
));

const ChevronIcon = React.memo(({ className = '' }: { className?: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" className={className}>
    <path d="M7 10l5 5 5-5z" fill="currentColor" />
  </svg>
));

// Give names to components for better debugging
SearchIcon.displayName = 'SearchIcon';
CloseIcon.displayName = 'CloseIcon';
MenuIcon.displayName = 'MenuIcon';
ArrowIcon.displayName = 'ArrowIcon';
ChevronIcon.displayName = 'ChevronIcon';

// Suggested searches (can be replaced with API call)
const suggestedSearches = [];

// Language Switcher Component
interface LanguageSwitcherProps {
  locale: string;
  onChangeLanguage: (langCode: string) => void;
  isMobile?: boolean;
}

const LanguageSwitcher = React.memo(({ locale, onChangeLanguage, isMobile = false }: LanguageSwitcherProps) => {
  return (
    <div 
      className={isMobile ? "flex items-center space-x-4" : "flex items-center"} 
      aria-label="Language selector"
      role="navigation"
    >
      {languages.map((language) => (
        <button 
          key={language.code}
          className={`px-2 py-1 text-sm font-text whitespace-nowrap ${locale === language.code ? 'font-bold' : ''}`}
          onClick={() => onChangeLanguage(language.code)}
          aria-current={locale === language.code ? 'true' : 'false'}
          lang={language.code}
          aria-label={`Switch to ${language.name}`}
          type="button"
        >
          {language.name}
        </button>
      ))}
    </div>
  );
});

LanguageSwitcher.displayName = 'LanguageSwitcher';

// Mobile Menu Component
interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  logo: HeaderLogo;
  items: HeaderNavItem[];
  locale: string;
  openMenuIndex: number | null;
  setOpenMenuIndex: React.Dispatch<React.SetStateAction<number | null>>;
  onChangeLanguage: (langCode: string) => void;
  onOpenSearch: () => void;
}

const MobileMenu = React.memo(({ 
  isOpen, 
  onClose, 
  logo, 
  items, 
  locale, 
  openMenuIndex, 
  setOpenMenuIndex,
  onChangeLanguage,
  onOpenSearch 
}: MobileMenuProps) => {
  // 获取当前路径用于语言切换
  const currentPath = usePathname();
  
  // 状态用于跟踪当前展开的菜单层级结构
  const [activeMenuStack, setActiveMenuStack] = useState<Array<{
    itemIndex: number, 
    parentUrl?: string, 
    title?: string,
    isCategory?: boolean
  }>>([]);
  
  // 添加菜单引用
  const menuRef = useRef<HTMLElement>(null);
  
  // 使用状态跟踪过渡状态
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // 直接控制可见性
  useEffect(() => {
    const menu = menuRef.current;
        if (menu) {
      if (isOpen) {
        // 当菜单打开时，立即移除invisible类并设置可见性
        menu.classList.remove('invisible');
        menu.style.visibility = 'visible';
        setIsTransitioning(true);
        
        // 使用RAF确保浏览器有时间应用初始状态
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            menu.classList.add('open');
            
            // 设置一个定时器，确保过渡完成后更新状态
            const transitionDuration = 300; // 匹配CSS中的过渡时间
            setTimeout(() => {
              setIsTransitioning(false);
            }, transitionDuration);
          });
        });
      } else {
        // 开始关闭过渡
        setIsTransitioning(true);
        menu.classList.remove('open');
        
        // 等待过渡效果完成后再添加invisible类
        const transitionEndHandler = () => {
          if (!isOpen && menu) {
            menu.classList.add('invisible');
            menu.style.visibility = 'hidden';
            setIsTransitioning(false);
      }
        };
        
        menu.addEventListener('transitionend', transitionEndHandler, { once: true });
    return () => {
          menu.removeEventListener('transitionend', transitionEndHandler);
    };
      }
    }
  }, [isOpen]);
  
  // 添加菜单状态持久化
  useEffect(() => {
    // 当菜单状态改变时，存储到sessionStorage
    if (typeof window !== 'undefined') {
      if (isOpen) {
        sessionStorage.setItem('mobileMenuOpen', 'true');
        sessionStorage.setItem('mobileMenuStack', JSON.stringify(activeMenuStack));
        
        // 设置HTML属性用于CSS选择器
        document.documentElement.setAttribute('data-menu-open', 'true');
        
        // 确保菜单可见并有正确的样式
        if (menuRef.current) {
          menuRef.current.style.visibility = 'visible';
          menuRef.current.style.opacity = '1';
          menuRef.current.style.transform = 'translateY(0)';
        }
      } else {
        sessionStorage.setItem('mobileMenuOpen', 'false');
        document.documentElement.removeAttribute('data-menu-open');
      }
    }
  }, [isOpen, activeMenuStack]);
  
  // 在页面加载或导航返回时恢复菜单状态
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 监听页面性能导航事件，用于检测返回导航
      const handleNavigationEvent = (event: any) => {
        // 如果是通过后退按钮返回的
        if (event.type === 'navigate' && event.navigationType === 'back') {
          // 为文档添加一个返回导航标记，用于CSS选择器
          document.documentElement.setAttribute('data-navigating-back', 'true');
          
          // 检查菜单状态
      const savedState = sessionStorage.getItem('mobileMenuOpen');
          if (savedState === 'true') {
            const menu = menuRef.current;
            if (menu) {
              // 在应用任何过渡之前，先添加no-transition类
              menu.classList.add('no-transition');
              menu.classList.add('open');
              menu.style.visibility = 'visible';
              menu.style.opacity = '1';
              menu.style.transform = 'translateY(0)';
              
              // 强制重绘
              void menu.offsetWidth;
              
              // 恢复过渡
              setTimeout(() => {
                menu.classList.remove('no-transition');
                document.documentElement.removeAttribute('data-navigating-back');
              }, 100);
            }
          } else {
            setTimeout(() => {
              document.documentElement.removeAttribute('data-navigating-back');
            }, 100);
          }
        }
      };
      
      // 尝试从sessionStorage恢复菜单状态
      const savedState = sessionStorage.getItem('mobileMenuOpen');
      
      if (savedState === 'true') {
        // 如果有保存的菜单状态，恢复它
        try {
          // 恢复子菜单层级结构
          const savedStack = sessionStorage.getItem('mobileMenuStack');
          if (savedStack) {
            setActiveMenuStack(JSON.parse(savedStack));
          }
          
          // 确保菜单可见并有正确的样式
          if (menuRef.current) {
            // 在初始渲染时不使用过渡效果
            menuRef.current.classList.add('no-transition');
            menuRef.current.classList.add('open', 'backface-fix');
            menuRef.current.style.visibility = 'visible';
            menuRef.current.style.opacity = '1';
            menuRef.current.style.transform = 'translateY(0)';
            
            // 强制重绘后移除no-transition类
            void menuRef.current.offsetWidth;
            setTimeout(() => {
              if (menuRef.current) {
                menuRef.current.classList.remove('no-transition');
              }
            }, 50);
          }
          
          // 设置HTML属性用于CSS选择器
          document.documentElement.setAttribute('data-menu-open', 'true');
        } catch (e) {
          console.error('Failed to parse saved menu stack', e);
      }
    }
    
    // 添加页面可见性变化监听
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // 页面从后台恢复时，检查菜单状态
        const savedState = sessionStorage.getItem('mobileMenuOpen');
        if (savedState === 'true' && menuRef.current) {
            // 避免过渡动画
            menuRef.current.classList.add('no-transition');
            menuRef.current.classList.add('open', 'backface-fix');
          menuRef.current.style.visibility = 'visible';
          menuRef.current.style.opacity = '1';
          menuRef.current.style.transform = 'translateY(0)';
            
            // 强制重绘后移除no-transition类
            void menuRef.current.offsetWidth;
            setTimeout(() => {
              if (menuRef.current) {
                menuRef.current.classList.remove('no-transition');
              }
            }, 50);
            
            document.documentElement.setAttribute('data-menu-open', 'true');
        }
      }
    };
    
      // 监听性能导航事件（如果浏览器支持）
      if ('PerformanceNavigationTiming' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach(handleNavigationEvent);
        });
        
        observer.observe({ type: 'navigation', buffered: true });
      }
      
      // 添加可见性事件监听
    document.addEventListener('visibilitychange', handleVisibilityChange);
      
      // 监听popstate事件（后退按钮）
      const handlePopState = () => {
        // 添加导航返回标记
        document.documentElement.setAttribute('data-navigating-back', 'true');
        
        // 检查菜单状态
        const savedState = sessionStorage.getItem('mobileMenuOpen');
        if (savedState === 'true') {
          // 恢复菜单状态
          setTimeout(() => {
            if (menuRef.current) {
              menuRef.current.classList.add('no-transition', 'backface-fix');
              menuRef.current.classList.add('open');
              menuRef.current.style.visibility = 'visible';
              menuRef.current.style.opacity = '1';
              menuRef.current.style.transform = 'translateY(0)';
              
              // 强制重绘
              void menuRef.current.offsetWidth;
              
              // 恢复过渡
              setTimeout(() => {
                if (menuRef.current) {
                  menuRef.current.classList.remove('no-transition');
                }
                document.documentElement.removeAttribute('data-navigating-back');
              }, 100);
            }
          }, 0);
        } else {
          setTimeout(() => {
            document.documentElement.removeAttribute('data-navigating-back');
          }, 100);
        }
      };
      
      window.addEventListener('popstate', handlePopState);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('popstate', handlePopState);
    };
    }
  }, []);
  
  // 处理菜单打开逻辑
  const openSubMenu = (index: number, url?: string, isCategory: boolean = false) => {
    setActiveMenuStack(prev => [...prev, { itemIndex: index, parentUrl: url, isCategory }]);
  };
  
  // 返回上一级菜单
  const goBack = () => {
    setActiveMenuStack(prev => prev.slice(0, -1));
  };
  
  // 返回到主菜单
  const backToMainMenu = () => {
    setActiveMenuStack([]);
  };
  
  // 判断当前显示的菜单级别
  const menuLevel = activeMenuStack.length;
  
  // 获取当前需要显示的项目
  const getCurrentItems = () => {
    if (menuLevel === 0) {
      // 主菜单
      return { items: items, title: null, parentUrl: undefined };
    } else if (menuLevel === 1) {
      // 二级菜单
      const { itemIndex } = activeMenuStack[0];
      const menuItem = items[itemIndex];
      const columns = menuItem?.columns || [];
      // 合并所有列中的项目
      const allItems = columns.reduce((acc, col) => [...acc, ...col.items], [] as HeaderSubItem[]);
      return { items: allItems, title: menuItem.label, parentUrl: menuItem.url };
    } else if (menuLevel === 2) {
      // 三级菜单
      const { itemIndex: parentIndex } = activeMenuStack[0];
      const { itemIndex: childIndex, parentUrl } = activeMenuStack[1];
      
      const parentItem = items[parentIndex];
      const columns = parentItem?.columns || [];
      const allSecondLevelItems = columns.reduce((acc, col) => [...acc, ...col.items], [] as HeaderSubItem[]);
      const currentItem = allSecondLevelItems[childIndex];
      
      if (!currentItem?.columns) return { items: [], title: currentItem?.label, parentUrl };
      
      // 合并所有列中的项目
      const allThirdLevelItems = currentItem.columns.reduce(
        (acc, col) => [...acc, ...col.items], 
        [] as HeaderSubItem[]
      );
      
      return { 
        items: allThirdLevelItems, 
        title: currentItem.label, 
        parentUrl: currentItem.url === parentUrl ? parentUrl : currentItem.url 
      };
    }
    
    return { items: [], title: null, parentUrl: undefined };
  };
  
  const { items: currentItems, title: currentTitle, parentUrl: currentParentUrl } = getCurrentItems();
  
  return (
    <nav 
      ref={menuRef}
      className={`mobile-menu fixed left-0 z-20 w-full bg-white ${isOpen ? 'open' : ''}`}
      style={{ top: '90px' }}
      role="navigation"
      aria-label={locale === 'zh' ? "移动端导航菜单" : "Mobile navigation menu"}
      itemScope
      itemType="https://schema.org/SiteNavigationElement"
    >
      <div className="contain pb-8 pt-8 px-4 mobile-menu-content overflow-y-auto max-h-[calc(100dvh_-_90px)]">
        {/* 返回按钮 */}
        {menuLevel > 0 && (
            <button 
            className="mb-8 flex items-center font-bold no-underline"
            onClick={menuLevel === 1 ? backToMainMenu : goBack}
            aria-label={menuLevel === 1 ? (locale === 'zh' ? '返回主菜单' : 'Back to main menu') : (locale === 'zh' ? '返回上级菜单' : 'Back')}
            >
            <span className="mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </span>
            {menuLevel === 1 ? (locale === 'zh' ? '主菜单' : 'Main menu') : (locale === 'zh' ? '返回' : 'Back')}
            </button>
        )}
        
        {/* 当前菜单标题和链接 - 添加面包屑结构 */}
        {currentTitle && (
          <div className="mb-6" role="navigation" aria-label={locale === 'zh' ? "当前位置" : "Current location"}>
            <a
              href={currentParentUrl || '#'}
              className="text-[20px] mb-8 font-bold block no-underline"
              onClick={(e) => {
                if (!currentParentUrl || currentParentUrl === '#') {
                  e.preventDefault();
                }
              }}
              title={currentTitle}
              itemProp="name"
            >
              {currentTitle}
            </a>
          </div>
        )}
        
        {/* 主菜单 */}
        {menuLevel === 0 && (
          <ul className="list-none p-0 m-0" role="menu">
            {(currentItems as HeaderNavItem[]).map((item, index) => (
              <li key={index} className="mb-6" role="menuitem" itemScope itemProp="itemListElement" itemType="https://schema.org/ListItem">
                <div className="flex w-full justify-between">
                  <a 
                    href={item.url}
                    className="text-[20px] flex-grow no-underline"
                    onClick={(e) => {
                      if (item.columns && item.columns.length > 0) {
                        e.preventDefault();
                        openSubMenu(index, item.url);
                      }
                    }}
                    title={item.label}
                    itemProp="url"
                    aria-label={`${item.label}${item.columns && item.columns.length > 0 ? (locale === 'zh' ? ' - 展开子菜单' : ' - Expand submenu') : ''}`}
                  >
                    <span itemProp="name">{item.label}</span>
                    <meta itemProp="position" content={`${index + 1}`} />
                  </a>
                  {item.columns && item.columns.length > 0 && (
                      <button
                      className="ml-4 text-current p-1"
                      aria-label={locale === 'zh' ? `打开${item.label}子菜单` : `Open ${item.label} submenu`}
                      onClick={() => openSubMenu(index, item.url)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      </button>
                                      )}
                                    </div>
              </li>
            ))}
          </ul>
        )}
        
        {/* 子菜单项 */}
        {menuLevel > 0 && (
          <ul className="list-none p-0 m-0" role="menu">
            {(currentItems as HeaderSubItem[]).map((item, index) => {
              // 检查是否为分类标题 (没有URL或URL与父级相同)
              const isCategory = !item.url || item.url === '#' || item.url === currentParentUrl || item.noLink;
              const hasSubItems = item.columns && item.columns.length > 0;
              
              return (
                <li key={index} className="mb-6" role="menuitem" itemScope itemProp="itemListElement" itemType="https://schema.org/ListItem">
                  <div className="flex w-full justify-between">
                    {isCategory ? (
                      // 分类标题也使用<a>标签以便于SEO，但链接到父级页面
                      <a 
                        href={currentParentUrl || '#'}
                        className="text-[20px] font-medium flex-grow no-underline"
                        onClick={(e) => {
                          if (hasSubItems) {
                            e.preventDefault();
                            openSubMenu(index, currentParentUrl, true);
                          }
                        }}
                        title={item.label}
                        itemProp="url"
                        aria-label={`${item.label}${hasSubItems ? (locale === 'zh' ? ' - 展开子菜单' : ' - Expand submenu') : ''}`}
                      >
                        <span itemProp="name">{item.label}</span>
                        <meta itemProp="position" content={`${index + 1}`} />
                      </a>
                  ) : (
                      // 常规链接处理
                      <a 
                      href={item.url}
                        className="text-[20px] flex-grow no-underline"
                        onClick={(e) => {
                          if (hasSubItems) {
                            e.preventDefault();
                            openSubMenu(index, item.url);
                          }
                        }}
                        title={item.label}
                        itemProp="url"
                        aria-label={`${item.label}${hasSubItems ? (locale === 'zh' ? ' - 展开子菜单' : ' - Expand submenu') : ''}`}
                      >
                        <span itemProp="name">{item.label}</span>
                        <meta itemProp="position" content={`${index + 1}`} />
                      </a>
                    )}
                    
                    {hasSubItems && (
            <button 
                        className="ml-4 text-current p-1"
                        aria-label={locale === 'zh' ? `打开${item.label}子菜单` : `Open ${item.label} submenu`}
                        onClick={() => openSubMenu(index, isCategory ? currentParentUrl : item.url, isCategory)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
            </button>
                    )}
          </div>
                </li>
              );
            })}
          </ul>
        )}
        </div>
    </nav>
  );
});

MobileMenu.displayName = 'MobileMenu';

// Search Overlay Component
interface SearchOverlayProps {
  isOpen: boolean;
  onClose: (event?: React.MouseEvent) => void;
  logo: HeaderLogo;
  locale: string;
}

// 拆分搜索表单组件，使其独立渲染，避免输入时影响整个SearchOverlay组件
const SearchForm = React.memo(({ 
  searchQuery, 
  onSearchChange, 
  onSearchSubmit, 
  isSearchLoading,
  searchInputRef,
  langTexts,
  locale
}: { 
  searchQuery: string; 
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: (e?: React.FormEvent<HTMLFormElement>) => void;
  isSearchLoading: boolean;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  langTexts: { search: string; cancel: string };
  locale: string;
}) => (
  <form 
    onSubmit={onSearchSubmit}
    className="flex w-full max-w-2xl flex-col items-end gap-y-4 md:mx-auto xl:flex-row xl:items-stretch"
    role="search"
  >
    {/* Search Input Group */}
    <div className="flex w-full flex-1 items-center rounded-sm border border-gray-300 bg-white px-3 py-2 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-1">
      <label className="sr-only" htmlFor="header__search">{locale === 'zh' ? "搜索网站" : "Search the site"}</label>
      <span className="text-current mr-3" aria-hidden="true">
        <SearchIcon />
      </span>
      
      <input
        type="search"
        id="header__search"
        ref={searchInputRef}
        className="text-lg flex-1 border-none p-0 shadow-none outline-none bg-transparent"
        placeholder={locale === 'zh' ? "搜索..." : "Search..."}
        value={searchQuery}
        onChange={onSearchChange}
        autoComplete="off"
      />
    </div>
    
    {/* Search Button - 使用多语言文本 */}
    <button
      type="submit"
      className={`ml-4 group inline-flex items-center text-sm gap-3 transition-colors ease-hover no-underline rounded-xs px-6 py-3 focus:outline focus:outline-2 focus:outline-offset-2 ${
        searchQuery.trim() 
        ? 'bg-secondary hover:bg-secondary-200 text-white disabled:bg-gray-100 disabled:text-gray-500' 
        : 'bg-gray-100 text-gray-500 cursor-not-allowed'
      }`}
      disabled={!searchQuery.trim() || isSearchLoading}
    >
      <span className="w-full">{langTexts.search}</span>
    </button>
  </form>
));

SearchForm.displayName = 'SearchForm';

// Logo组件分离，避免搜索输入时重新渲染
const LogoComponent = React.memo(({ logo }: { logo: HeaderLogo }) => (
  <div className="flex items-center shrink-0" data-header-logo="">
    <a href={logo.url} className="shrink-0">
      <img 
        src={logo.src}
        alt={logo.alt}
        width={logo.width}
        height={logo.height}
        className="h-10 sm:h-12 lg:h-[48px] w-auto shrink-0"
        style={{ objectFit: 'contain' }}
      />
    </a>
  </div>
));

LogoComponent.displayName = 'LogoComponent';

const SearchOverlay = React.memo(({ isOpen, onClose, logo, locale }: SearchOverlayProps) => {
  // 使用useRef存储searchQuery，避免每次输入都触发组件重新渲染
  const [searchQuery, setSearchQuery] = useState('');
  const searchQueryRef = useRef(searchQuery);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]); 
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // --- Search Functions ---
  const fetchSearchResults = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      setIsSearchLoading(false);
      return;
    }
    setIsSearchLoading(true);
    
    try {
      // 移除即时搜索结果功能 - 用户必须点击搜索按钮
      setSearchResults([]);
      
      // 记录搜索事件
      if (typeof window !== 'undefined' && 'dataLayer' in window) {
        // @ts-ignore - Google Tag Manager dataLayer
        window.dataLayer.push({
          event: 'search_attempt',
          searchTerm: query
        });
      }
    } catch (error) {
      console.error("Search processing failed:", error);
      setSearchResults([]);
    } finally {
      setIsSearchLoading(false);
    }
  }, []);

  // Optimized debounce function call
  const debouncedFetchSearch = useCallback(debounce(fetchSearchResults, 350), [fetchSearchResults]);

  // 使用useCallback优化处理函数，避免不必要的重新渲染
  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation(); // Prevent event bubbling
    const query = event.target.value;
    searchQueryRef.current = query; // 使用ref存储当前值
    setSearchQuery(query);
    
    // 不再根据输入即时搜索，用户需要点击搜索按钮
    setSearchResults([]);
  }, []);

  const handleSearchSubmit = useCallback((event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault(); // Prevent default form submission if used
    event?.stopPropagation(); // Prevent event bubbling to overlay
    const currentQuery = searchQueryRef.current || searchQuery;
    if (currentQuery.trim().length > 0) {
        // Navigate to a search results page
        window.location.href = `/${locale}/search?q=${encodeURIComponent(currentQuery.trim())}`;
    }
  }, [searchQuery, locale]);

  // Add event bubbling closing function
  const closeSearchOverlayWithoutBubbling = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    onClose(event);
  }, [onClose]);

  // Focus input on open
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      // Short timeout to ensure DOM is ready
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Reset search state when closed
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      searchQueryRef.current = '';
      setSearchResults([]);
    }
  }, [isOpen]);

  // 搜索按钮和取消按钮文本的多语言支持
  const buttonText = {
    en: { search: 'Search', cancel: 'Cancel' },
    zh: { search: '搜索', cancel: '取消' }
  };

  // 使用当前语言获取按钮文本，如果不支持则默认使用英文
  const currentLang = locale as keyof typeof buttonText;
  const langTexts = buttonText[currentLang] || buttonText.en;
  
  // 使用useMemo优化渲染，防止不必要的重新渲染
  const memoizedLogo = useMemo(() => <LogoComponent logo={logo} />, [logo]);
  const memoizedCancelButton = useMemo(() => (
    <button 
      className="absolute right-0 top-4 py-4 pl-16 pr-6 xl:static xl:px-6 xl:py-3 xl:ml-4 text-gray-600 hover:text-gray-900 transition-all duration-300 search-cancel-button"
      onClick={closeSearchOverlayWithoutBubbling}
      aria-label={locale === 'zh' ? "取消搜索" : "Cancel search"}
    >
      {langTexts.cancel}
    </button>
  ), [locale, langTexts.cancel, closeSearchOverlayWithoutBubbling]);

  // 添加动画完成事件处理
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // 动画结束事件处理
  useEffect(() => {
    const handleAnimationEnd = (event: AnimationEvent) => {
      // 只处理关闭动画结束事件
      if (!isOpen && event.animationName === 'search-slide-up') {
        // 动画完成后，确保所有元素处于正确的终态
        if (dropdownRef.current) {
          dropdownRef.current.style.visibility = 'hidden';
        }
      }
    };
    
    const dropdown = dropdownRef.current;
    if (dropdown) {
      dropdown.addEventListener('animationend', handleAnimationEnd);
      
      // 确保打开时设为可见
      if (isOpen) {
        dropdown.style.visibility = 'visible';
      }
    }
    
    return () => {
      if (dropdown) {
        dropdown.removeEventListener('animationend', handleAnimationEnd);
      }
    };
  }, [isOpen]);

  return (
    <>
      {/* Search Overlay Background */}
      <div
        className={`fixed inset-0 z-40 bg-black search-overlay-bg ${isOpen ? 'open' : ''}`}
        onClick={closeSearchOverlayWithoutBubbling}
        aria-hidden="true"
      />
      
      {/* Search Dropdown */}
      <div 
        ref={dropdownRef}
        id="search-dropdown"
        className={`fixed top-0 left-0 right-0 z-50 bg-white shadow-lg search-dropdown ${isOpen ? 'open' : ''}`}
        role="dialog" 
        aria-labelledby="search-heading"
        aria-modal="true"
        aria-hidden={!isOpen}
      >
        <div className="contain pb-12 pt-8 xl:pt-4 min-h-[280px] sm:min-h-[320px] lg:min-h-[350px] flex flex-col search-content">
          <div className="mb-6 flex flex-col gap-8 md:justify-between xl:flex-row xl:items-center xl:gap-16">
            {/* Logo - 使用记忆化组件，防止重新渲染 */}
            {memoizedLogo}

            {/* Search Form Section - 使用独立组件 */}
            <SearchForm 
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              onSearchSubmit={handleSearchSubmit}
              isSearchLoading={isSearchLoading}
              searchInputRef={searchInputRef}
              langTexts={langTexts}
              locale={locale}
            />

            {/* Cancel Button - 使用记忆化组件，防止重新渲染 */}
            {memoizedCancelButton}
          </div>
 
          {/* 搜索说明区域 */}
          <div className="flex justify-center items-center flex-grow">
            <div className="w-full md:max-w-2xl text-center">
              <p className="text-gray-500 text-base sm:text-lg">
                {locale === 'zh' 
                  ? '输入搜索词并点击"搜索"按钮以查看结果' 
                  : 'Enter search terms and click "Search" button to see results'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

SearchOverlay.displayName = 'SearchOverlay';

// Add interfaces definitions
// Dropdown Menu Component interface
interface DropdownMenuProps {
  item: HeaderNavItem;
  index: number;
  isOpen: boolean;
  setOpenMenuIndex: React.Dispatch<React.SetStateAction<number | null>>;
}

// Memoize the dropdown menu components
const DropdownMenu = React.memo(({ 
  item, 
  index,
  isOpen,
  setOpenMenuIndex 
}: DropdownMenuProps) => {
  const router = useRouter();

  return (
    <div
      id={`menu_id-${index}`}
      aria-labelledby={`menu_button_id-${index}`} 
      aria-hidden={!isOpen}
      role="region"
      className={`absolute left-0 z-[40] max-h-[calc(100dvh_-_90px)] w-full overflow-y-auto bg-white text-left shadow-md dropdown-menu dropdown-menu-container ${isOpen ? 'open' : ''}`}
      style={{ 
        top: '90px'
      }}
    >
      <div 
        className="dropdown-menu-content max-w-[90%] sm:max-w-[92%] lg:max-w-[94%] 2xl:max-w-[95%] mx-auto px-4 sm:px-5 lg:px-6 py-6 sm:py-8 lg:py-10 mt-0 sm:mt-2"
      >
        <div className="mb-4 sm:mb-6 flex justify-between">
          <h2 className="text-base sm:text-lg flex items-center">
            <a 
              href={item.url} 
              className="flex items-center gap-x-2 underline decoration-gray-200 underline-offset-8" 
              aria-current="page"
            >
              {item.label}
              <span className="text-[#ff6633]">
                <ArrowIcon />
              </span>
            </a>
          </h2>
          <button 
            tabIndex={-1}
            className="flex items-center"
            onClick={(e) => {
              e.stopPropagation();
              setOpenMenuIndex(null);
            }}
            aria-label={`Close ${item.label} menu`}
          >
            <span className="text-current">
              <CloseIcon />
            </span>
          </button>
        </div>
        
        <div className="flex w-full flex-col sm:flex-row">
          {item.columns?.map((column, colIndex) => (
            <React.Fragment key={colIndex}>
              <div className="flex-1 px-2 sm:px-4">
                <div className="mb-6">
                  <div className="flex-1">
                    {column.items.map((subItem, subIndex) => (
                      <div 
                        key={subIndex} 
                        className="flex flex-col no-underline mb-4 sm:mb-6"
                      >
                        {subItem.isTeaser && subItem.img && (
                          <div className="mb-2 sm:mb-4">
                            <OptimizedImage 
                              className="w-full rounded" 
                              src={subItem.img}
                              alt={subItem.imgAlt || ''}
                              width={320}
                              height={180}
                              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 320px"
                              priority
                              loading={undefined}
                              unoptimized={true}
                            />
                          </div>
                        )}
                        <div className="flex flex-col items-start">
                          {subItem.noLink ? (
                            <div className="no-underline">
                              <h3 className="font-bold text-[20px]">
                                {subItem.label}
                              </h3>
                              {subItem.text && (
                                <div className="text-gray-600 text-sm mt-1">
                                  <p>{subItem.text}</p>
                                </div>
                              )}
                            </div>
                          ) : (
                          <a
                            href={subItem.url}
                            className="no-underline"
                            onClick={() => {
                              setOpenMenuIndex(null);
                            }}
                          >
                            <h3 className="font-bold text-[20px]">
                              {subItem.label}
                            </h3>
                            {subItem.text && (
                              <div className="text-gray-600 text-sm mt-1">
                                <p>{subItem.text}</p>
                              </div>
                            )}
                          </a>
                          )}
                        </div>
                        
                        {/* Render submenu items (if they exist) */}
                        {subItem.columns && subItem.columns.length > 0 && (
                          <div className="mt-2">
                            {subItem.columns.map((subColumn, subColIndex) => (
                              <div key={subColIndex} className="pt-2">
                                {subColumn.items.map((nestedItem: HeaderSubItem, nestedIndex: number) => (
                                  <a
                                    key={nestedIndex}
                                    href={nestedItem.url}
                                    className="block py-1 text-sm font-normal text-gray-700 hover:text-[#ff6633]"
                                    onClick={() => {
                                      setOpenMenuIndex(null);
                                    }}
                                  >
                                    <span className="mr-2 text-lg align-middle">·</span>{nestedItem.label}
                                  </a>
                                ))}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {colIndex < (item.columns?.length || 0) - 1 && (
                <>
                  <div className="w-px bg-gray-200 mx-4 md:mx-6 hidden sm:block"></div>
                  <div className="h-px w-full bg-gray-200 my-3 sm:my-4 block sm:hidden"></div>
                </>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
});

DropdownMenu.displayName = 'DropdownMenu';

// Main Header Component with enhanced semantic structure
export default function Header({ logo, items }: HeaderProps) {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  
  const locale = useLocale();
  const currentPath = usePathname();
  const router = useRouter();
  
  // 添加动画和菜单样式
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 添加菜单样式
      const styleEl = document.createElement('style');
      styleEl.innerHTML = styles.mobileMenu + styles.globalStyles;
      document.head.appendChild(styleEl);
      
      // 添加防闪烁遮罩层
      const blocker = document.createElement('div');
      blocker.className = 'render-blocker';
      document.body.appendChild(blocker);
      
      // 添加animation-ready类
      document.documentElement.classList.add('animation-ready');
      document.documentElement.classList.add('backface-fix');
      
      // 清理函数
      return () => {
        document.documentElement.classList.remove('animation-ready');
        document.documentElement.classList.remove('backface-fix');
        document.head.removeChild(styleEl);
        if (document.body.contains(blocker)) {
          document.body.removeChild(blocker);
        }
      };
    }
  }, []);
  
  // 检测滚动条宽度
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 计算滚动条宽度
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
    }
  }, []);

  // 监听全局点击事件
  useEffect(() => {
    // 捕获阶段监听
    const captureListener = (e: MouseEvent) => {
      if (e.target instanceof HTMLAnchorElement) {
        console.log('捕获阶段检测到链接点击:', e.target.href);
        
        // 如果链接导航到其他页面，添加导航标记
        if (!e.target.href.includes('#') && !e.defaultPrevented) {
          sessionStorage.setItem('isNavigating', 'true');
        }
      }
    };
    
    // 冒泡阶段监听
    const bubbleListener = (e: MouseEvent) => {
      if (e.target instanceof HTMLAnchorElement) {
        console.log('冒泡阶段检测到链接点击:', e.target.href);
        console.log('defaultPrevented:', e.defaultPrevented);
      }
    };
    
    // 添加监听器
    document.addEventListener('click', captureListener, true);
    document.addEventListener('click', bubbleListener, false);
    
    return () => {
      // 移除监听器
      document.removeEventListener('click', captureListener, true);
      document.removeEventListener('click', bubbleListener, false);
    };
  }, []);

  // 使用useEffect保存搜索框状态到sessionStorage
  useEffect(() => {
    // 当搜索框状态改变时，存储到sessionStorage
    if (typeof window !== 'undefined') {
      if (isSearchOverlayOpen) {
        sessionStorage.setItem('searchOverlayOpen', 'true');
      } else {
        sessionStorage.setItem('searchOverlayOpen', 'false');
      }
    }
  }, [isSearchOverlayOpen]);

  // 在页面加载时恢复搜索框状态
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedState = sessionStorage.getItem('searchOverlayOpen');
      if (savedState === 'true') {
        setIsSearchOverlayOpen(true);
        document.body.classList.add('overflow-hidden');
      }
    }
  }, []);

  const openSearchOverlay = () => {
    setIsSearchOverlayOpen(true);
    document.body.classList.add('overflow-hidden');
  };

  const closeSearchOverlay = () => {
    setIsSearchOverlayOpen(false);
    document.body.classList.remove('overflow-hidden');
  };

  // Function to toggle desktop dropdown menu
  const toggleDesktopMenu = (index: number) => {
    setOpenMenuIndex(prevIndex => (prevIndex === index ? null : index));
  };

  // Effect to close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setOpenMenuIndex(null); // Close the dropdown
      }
    };

    if (openMenuIndex !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuIndex]);

  // Effect for Escape key (close search or dropdown)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isSearchOverlayOpen) {
          closeSearchOverlay();
        } else if (openMenuIndex !== null) {
          setOpenMenuIndex(null);
        }
      }
    };
    // Attach listener if any overlay or menu is open
    if (isSearchOverlayOpen || openMenuIndex !== null) {
       document.addEventListener('keydown', handleKeyDown);
    } else {
       document.removeEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSearchOverlayOpen, openMenuIndex]); // Remove isLangDropdownOpen dependency

  // Get current language on page load (improved: get from path or localStorage)
  useEffect(() => {
    // Add null check
    if (!currentPath) return;
    
    // Logic to determine initial language (e.g., from URL path)
    const pathParts = currentPath.split('/');
    const pathLang = pathParts.length > 1 ? pathParts[1] : ''; // Assuming URL structure like /en/about
    
    // No longer need to set currentLang, as we are using locale
    // Only store user language preference when needed
    if (pathLang && languages.find(l => l.code === pathLang)) {
      localStorage.setItem('zexin-lang', pathLang);
    }
  }, [currentPath]); // Re-run when path changes

  // Language switch function (preserving current path)
  const changeLanguage = (langCode: string) => {
    if (langCode === locale) {
      return; // Do nothing if language is the same
    }
    
    // 确保currentPath不为空
    if (!currentPath) {
      // 如果currentPath为空，使用根路径
      router.push(`/${langCode}`);
      return;
    }
    
    // 路径格式样例: /zh/products 或 /en/products
    // 将路径分割为数组并过滤掉空字符串
    const segments = currentPath.split('/').filter(segment => segment.length > 0);
    
    // 确保语言代码有效
    if (!languages.some(lang => lang.code === langCode)) {
      console.error(`Invalid language code: ${langCode}`);
      return;
    }
    
    // 检查第一段是否是语言代码
    const firstSegmentIsLang = segments.length > 0 && languages.some(lang => lang.code === segments[0]);
    
    let newPath = '';
    
    if (firstSegmentIsLang && segments.length > 0) {
      // 直接替换语言部分
      // 例如：/zh/products -> /en/products
      newPath = `/${langCode}/${segments.slice(1).join('/')}`;
    } else {
      // 如果第一段不是语言代码，添加新的语言代码到开头
      newPath = `/${langCode}/${segments.join('/')}`;
    }
    
    // 搜索页面特殊处理：保留搜索参数
    if (typeof window !== 'undefined') {
      // 如果是搜索页面，保留查询参数
      if (currentPath.includes('/search')) {
        const searchParams = new URL(window.location.href).searchParams;
        // 如果有查询参数，添加到新路径
        if (searchParams.toString()) {
          newPath += `?${searchParams.toString()}`;
        } else {
          // 如果是搜索页面但没有参数，重定向到首页
          newPath = `/${langCode}`;
        }
      }
    }
    
    // 导航到新URL
    router.push(newPath);
  };

  // 打开/关闭移动菜单
  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setMobileMenuOpen(newState);
    
    // 控制body滚动
    if (newState) {
      // 打开菜单时禁止body滚动
      document.body.classList.add('overflow-hidden');
      document.documentElement.setAttribute('data-menu-open', 'true');
      // 确保搜索框已关闭
      setIsSearchOverlayOpen(false);
    } else {
      // 关闭菜单时恢复body滚动
      document.body.classList.remove('overflow-hidden');
      document.documentElement.removeAttribute('data-menu-open');
      // 关闭子菜单
      setOpenMenuIndex(null);
    }
    
    // 更新会话存储状态
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('mobileMenuOpen', newState ? 'true' : 'false');
    }
  };

  // 关闭移动菜单
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setOpenMenuIndex(null);
    document.body.classList.remove('overflow-hidden');
    document.documentElement.removeAttribute('data-menu-open');
    
    // 更新会话存储状态
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('mobileMenuOpen', 'false');
    }
  };

  // 恢复移动菜单状态
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMobileMenuState = sessionStorage.getItem('mobileMenuOpen');
      if (savedMobileMenuState === 'true') {
        setMobileMenuOpen(true);
        document.body.classList.add('overflow-hidden');
      }
    }
  }, []);

  return (
    <>
      <CardAnimationProvider />
      
      {/* 添加样式标签 - 确保CSS样式被应用 */}
      <style jsx global>{`
        ${styles.mobileMenu}
        ${styles.globalStyles}
      `}</style>
      
      {/* 防闪烁遮罩层 */}
      <div className="render-blocker" aria-hidden="true" />
      
      <header
        ref={headerRef}
        className="w-full bg-[#ffffff] h-[90px] backface-fix"
        style={{ height: '90px' }}
        role="banner"
        aria-label="Site header"
        suppressHydrationWarning
      >
        <div className="max-w-[90%] sm:max-w-[92%] lg:max-w-[94%] 2xl:max-w-[95%] mx-auto px-4 sm:px-5 lg:px-6 h-full">
          <div className="flex h-full items-center justify-between border-b border-gray-100 py-3 lg:py-0">
            {/* Logo */}
            <div className="flex items-center shrink-0" data-header-logo="">
              <a 
                href={logo.url} 
                className="shrink-0"
              >
                <img 
                  src={logo.src}
                  alt={logo.alt}
                  width={logo.width}
                  height={logo.height}
                  className="h-10 sm:h-12 lg:h-[48px] w-auto shrink-0"
                  style={{ objectFit: 'contain' }}
                />
              </a>
            </div>

            {/* Desktop Navigation */}
            <nav 
              className="hidden w-full items-center gap-8 lg:flex"
              aria-label="Main navigation"
            >
              <ul className="flex w-full flex-grow justify-center gap-6 xl:gap-8 xl:pl-16">
                {items.map((item, index) => (
                  <li key={index}>
                    {item.columns ? (
                      <>
                        <button
                          id={`menu_button_id-${index}`}
                          className="flex whitespace-nowrap font-text underline-offset-8 hover:underline hover:decoration-[#ff6633] focus:underline focus:decoration-[#ff6633] bg-transparent border-0 cursor-pointer"
                          aria-expanded={openMenuIndex === index}
                          aria-controls={`menu_id-${index}`}
                          aria-haspopup="true"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDesktopMenu(index);
                          }}
                        >
                          {item.label}
                        </button>
                        <DropdownMenu 
                          item={item} 
                          index={index} 
                          isOpen={openMenuIndex === index} 
                          setOpenMenuIndex={setOpenMenuIndex} 
                        />
                        </>
                      ) : (
                        <a
                          href={item.url}
                          className={`flex whitespace-nowrap underline-offset-8 focus:underline focus:decoration-[#ff6633] py-2 sm:py-0 ${
                            currentPath && (currentPath === item.url || currentPath.startsWith(item.url + '/')) ? 'underline decoration-[#ff6633]' : ''
                          }`}
                        aria-current={currentPath && (currentPath === item.url || currentPath.startsWith(item.url + '/')) ? 'page' : undefined}
                        >
                          {item.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
              
            {/* Right Side Actions */}
            <div className="flex items-center gap-x-2">
              {/* Language Switcher */}
              <LanguageSwitcher locale={locale} onChangeLanguage={changeLanguage} />
                
              {/* Divider */}
              <div className="hidden sm:block h-5 w-[1px] bg-gray-100"></div>
                
              {/* Search Button */}
              <div className="flex items-center">
                <button 
                  id="search-init-button" 
                  className="flex items-center p-2 hover:bg-gray-50 rounded-full transition-colors"
                  onClick={openSearchOverlay}
                  aria-label="Open search"
                aria-haspopup="dialog"
                >
                  <span className="text-current">
                  <SearchIcon />
                  </span>
              </button>
              </div>

              {/* Mobile Menu Button */}
              <button 
                className="flex items-center justify-center w-10 h-10 lg:hidden hover:bg-gray-50 rounded-full"
                id="menubutton"
                aria-haspopup="true"
                aria-controls="mobile-menu"
                aria-label="Toggle menu"
                aria-expanded={isMobileMenuOpen}
                onClick={toggleMobileMenu}
              >
                <span className="text-current">
                  {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 移动菜单遮罩层 - 添加遮罩防止滚动条出现 */}
      {isMobileMenuOpen && (
        <div 
          className="fixed left-0 z-10 h-full w-full bg-gray-800 bg-opacity-50" 
          style={{ top: '90px' }}
          onClick={closeMobileMenu}
        />
      )}

        {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen}
          onClose={closeMobileMenu}
        logo={logo}
        items={items}
        locale={locale}
        openMenuIndex={openMenuIndex}
        setOpenMenuIndex={setOpenMenuIndex}
        onChangeLanguage={changeLanguage}
        onOpenSearch={openSearchOverlay}
      />

      {/* Search Overlay */}
      <SearchOverlay 
        isOpen={isSearchOverlayOpen}
        onClose={closeSearchOverlay}
        logo={logo}
        locale={locale}
      />
    </>
  );
}
