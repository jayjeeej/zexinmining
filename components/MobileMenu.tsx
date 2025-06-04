import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

// 定义菜单项接口
interface MenuItem {
  label: string;
  url?: string;
  columns?: Array<{
    items: MenuItem[];
  }>;
  noLink?: boolean;
  text?: string;
  img?: string;
  imgAlt?: string;
  isTeaser?: boolean;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  items: MenuItem[];
  locale: string;
  logo?: any;
  openMenuIndex?: number | null;
  setOpenMenuIndex?: React.Dispatch<React.SetStateAction<number | null>>;
  onChangeLanguage?: (langCode: string) => void;
  onOpenSearch?: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ 
  isOpen, 
  onClose, 
  items, 
  locale
}) => {
  // 获取当前路径用于导航
  const currentPath = usePathname();
  
  // 状态用于跟踪当前展开的菜单层级结构
  const [activeMenuStack, setActiveMenuStack] = useState<Array<{
    itemIndex: number, 
    parentUrl?: string, 
    title?: string,
    isCategory?: boolean
  }>>([]);
  
  // 添加菜单引用和动画处理
  const menuRef = useRef<HTMLElement>(null);
  
  // 处理动画结束事件
  useEffect(() => {
    const menu = menuRef.current;
    
    // 添加动画结束事件处理函数
    const handleAnimationEnd = (event: AnimationEvent) => {
      // 只处理关闭动画结束事件(mobile-fade-out动画)
      if (!isOpen && event.animationName === 'mobile-fade-out') {
        // 动画完成后，确保元素处于正确的终态
        if (menu) {
          menu.style.visibility = 'hidden';
        }
      }
    };
    
    if (menu) {
      menu.addEventListener('animationend', handleAnimationEnd);
      
      // 确保菜单打开时设置正确的可见性
      if (isOpen) {
        menu.style.visibility = 'visible';
      }
    }
    
    return () => {
      // 清理事件监听器
      if (menu) {
        menu.removeEventListener('animationend', handleAnimationEnd);
      }
    };
  }, [isOpen]);
  
  // 添加菜单状态持久化
  useEffect(() => {
    // 当菜单状态改变时，存储到sessionStorage
    if (typeof window !== 'undefined') {
      if (isOpen) {
        sessionStorage.setItem('mobileMenuOpen', 'true');
        sessionStorage.setItem('mobileMenuStack', JSON.stringify(activeMenuStack));
      } else {
        sessionStorage.setItem('mobileMenuOpen', 'false');
      }
    }
  }, [isOpen, activeMenuStack]);
  
  // 在页面加载或导航返回时恢复菜单状态
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 从sessionStorage恢复菜单状态
      const restoreMenuState = () => {
        const savedState = sessionStorage.getItem('mobileMenuOpen');
        if (savedState === 'true') {
          // 如果有保存的菜单状态，恢复它
          try {
            const savedStack = sessionStorage.getItem('mobileMenuStack');
            if (savedStack) {
              setActiveMenuStack(JSON.parse(savedStack));
            }
            
            // 通知父组件菜单应该打开
            if (!isOpen) {
              // 这里我们通过一个特殊的事件通知父组件
              const event = new CustomEvent('restoreMobileMenu', { 
                detail: { 
                  open: true,
                  fromBfcache: true
                } 
              });
              window.dispatchEvent(event);
            }
          } catch (e) {
            console.error('Failed to parse saved menu stack', e);
          }
        }
      };
      
      // 初始加载时恢复状态
      restoreMenuState();
      
      // 监听菜单恢复事件
      const handleRestoreMenuStack = (event: Event) => {
        const customEvent = event as CustomEvent;
        if (customEvent.detail?.stack) {
          console.log('从事件中恢复菜单堆栈:', customEvent.detail.stack);
          setActiveMenuStack(customEvent.detail.stack);
        }
      };
      
      // 监听关闭菜单事件
      const handleCloseMenu = () => {
        if (onClose) {
          onClose();
        }
      };
      
      // 注册pageshow事件处理程序 - 关键是这个事件在bfcache恢复时会触发
      const handlePageShow = (event: PageTransitionEvent) => {
        if (event.persisted) {
          console.log('页面从bfcache恢复 - MobileMenu组件');
          // 从sessionStorage恢复菜单状态
          restoreMenuState();
        }
      };
      
      window.addEventListener('restoreMobileMenu', handleRestoreMenuStack);
      window.addEventListener('closeMobileMenu', handleCloseMenu);
      window.addEventListener('pageshow', handlePageShow);
      
      return () => {
        window.removeEventListener('restoreMobileMenu', handleRestoreMenuStack);
        window.removeEventListener('closeMobileMenu', handleCloseMenu);
        window.removeEventListener('pageshow', handlePageShow);
      };
    }
  }, [isOpen, onClose]);
  
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
      const allItems = columns.reduce((acc: MenuItem[], col: {items: MenuItem[]}) => [...acc, ...col.items], [] as MenuItem[]);
      return { items: allItems, title: menuItem.label, parentUrl: menuItem.url };
    } else if (menuLevel >= 2) {
      // 三级及更深层级菜单
      const { itemIndex: parentIndex } = activeMenuStack[0];
      const { itemIndex: childIndex, parentUrl } = activeMenuStack[1];
      
      const parentItem = items[parentIndex];
      const columns = parentItem?.columns || [];
      const allSecondLevelItems = columns.reduce((acc: MenuItem[], col: {items: MenuItem[]}) => [...acc, ...col.items], [] as MenuItem[]);
      const currentItem = allSecondLevelItems[childIndex];
      
      if (!currentItem?.columns) return { items: [], title: currentItem?.label, parentUrl };
      
      // 合并所有列中的项目
      const allThirdLevelItems = currentItem.columns.reduce(
        (acc: MenuItem[], col: {items: MenuItem[]}) => [...acc, ...col.items], 
        [] as MenuItem[]
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
    >
      <div className="mobile-menu-content overflow-y-auto max-h-[calc(100dvh_-_90px)] p-6">
        {/* 返回按钮 */}
        {menuLevel > 0 && (
          <button 
            className="mb-6 flex items-center font-bold"
            onClick={menuLevel === 1 ? backToMainMenu : goBack}
            aria-label={menuLevel === 1 ? (locale === 'zh' ? '返回主菜单' : 'Back to main menu') : (locale === 'zh' ? '返回上级菜单' : 'Back')}
          >
            <span className="mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </span>
            {menuLevel === 1 ? (locale === 'zh' ? '主菜单' : 'Main menu') : (locale === 'zh' ? '返回' : 'Back')}
          </button>
        )}
        
        {/* 当前菜单标题 */}
        {currentTitle && (
          <div className="mb-6">
            <h2 className="text-xl font-bold">{currentTitle}</h2>
          </div>
        )}
        
        {/* 菜单项列表 */}
        <ul className="list-none p-0 m-0">
          {(currentItems as MenuItem[]).map((item: MenuItem, index: number) => (
            <li key={index} className="mb-4">
              <div className="flex justify-between items-center">
                <a 
                  href={item.url || '#'}
                  className="text-lg flex-grow"
                  onClick={(e) => {
                    // 如果有子菜单，则打开子菜单而不是导航
                    if (item.columns && item.columns.length > 0) {
                      e.preventDefault();
                      openSubMenu(index, item.url);
                    }
                  }}
                >
                  {item.label}
                </a>
                
                {/* 如果有子菜单，显示展开按钮 */}
                {item.columns && item.columns.length > 0 && (
                  <button 
                    className="ml-2 p-1"
                    aria-label={locale === 'zh' ? `展开${item.label}子菜单` : `Expand ${item.label} submenu`}
                    onClick={() => openSubMenu(index, item.url)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default MobileMenu; 