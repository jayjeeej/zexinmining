'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import LayoutWithTransition from '@/components/layouts/LayoutWithTransition';
import OptimizedImage from '@/components/layouts/OptimizedImage';
import { useRouter } from 'next/navigation';
import CardAnimationProvider from '@/components/CardAnimationProvider';

// 定义 BreadcrumbItem 接口以匹配 LayoutWithTransition 组件预期
interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface SearchResult {
  id: string;
  url: string;
  title: string;
  excerpt: string;
  category?: string;
  score?: number;
  imageSrc?: string;
  resultType?: 'product' | 'news' | 'case';  // 添加结果类型字段
}

interface SearchResultsClientProps {
  locale: string;
  query: string;
}

export default function SearchResultsClient({ locale, query }: SearchResultsClientProps) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(6); // 初始显示6个结果
  const [activeTab, setActiveTab] = useState<'all' | 'product' | 'news' | 'case'>('all'); // 添加当前活动的Tab
  const isZh = locale === 'zh';
  const router = useRouter();
  
  // 添加用于状态恢复的引用
  const initialLoadRef = useRef(true); // 用于追踪是否是首次加载
  const didRestoreScrollRef = useRef(false); // 追踪是否已恢复滚动位置
  
  // 如果没有查询词，重定向到首页
  useEffect(() => {
    if (!query || query.trim() === '') {
      router.push(`/${locale}`);
    }
  }, [query, locale, router]);
  
  // 前端额外的去重处理，防止显示相同标题的内容
  const performLocalDeduplication = (searchResults: SearchResult[] | any): SearchResult[] => {
    // 处理API在debug模式下返回的对象格式
    let resultsArray: SearchResult[] = [];
    
    // 检查searchResults是否为数组
    if (Array.isArray(searchResults)) {
      resultsArray = searchResults;
    } 
    // 如果是对象且有results属性(debug模式)
    else if (searchResults && typeof searchResults === 'object' && 'results' in searchResults) {
      resultsArray = Array.isArray(searchResults.results) ? searchResults.results : [];
    }
    // 如果不是数组也不是包含results的对象，返回空数组
    else {
      return [];
    }
    
    const uniqueTitles = new Set<string>();
    const uniqueResults: SearchResult[] = [];
    
    for (const result of resultsArray) {
      const normalizedTitle = result.title.trim().toLowerCase();
      
      if (!uniqueTitles.has(normalizedTitle)) {
        uniqueTitles.add(normalizedTitle);
        uniqueResults.push(result);
      }
    }
    
    return uniqueResults;
  };
  
  // 保存当前状态到history和sessionStorage
  const saveStateToHistory = () => {
    const currentState = {
      query,
      activeTab,
      displayCount,
      results,
      scrollPosition: window.scrollY
    };
    
    try {
      history.replaceState(currentState, '');
      sessionStorage.setItem('searchPageState', JSON.stringify(currentState));
    } catch (error) {
      console.error('Failed to save search state:', error);
    }
  };
  
  // 恢复状态函数 - 改进版本
  const restoreState = (state: any, isRecentBack = false) => {
    if (!state) return;
    
    try {
      // 首先确保查询词一致，否则不恢复状态
      if (state.query !== query) {
        console.log('Saved state is for a different query, not restoring');
        return;
      }
      
      console.log('Restoring search state:', state);
      
      // 恢复Tab状态
      if (state.activeTab) {
        setActiveTab(state.activeTab);
      }
      
      // 恢复显示数量
      if (state.displayCount) {
        setDisplayCount(state.displayCount);
      }
      
      // 恢复搜索结果，并确保应用去重
      if (state.results && state.results.length > 0) {
        const dedupedResults = performLocalDeduplication(state.results);
        setResults(dedupedResults);
        setIsLoading(false);
      }
      
      // 延迟恢复滚动位置以确保内容已渲染
      if (typeof state.scrollPosition === 'number' && !didRestoreScrollRef.current) {
        didRestoreScrollRef.current = true;
        
        // 使用更长的延时确保DOM完全渲染
        setTimeout(() => {
          // 使用多层RAF嵌套来确保DOM完全更新后再滚动
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              // 记录恢复的位置
              console.log('Restoring scroll to:', state.scrollPosition);
              // 根据来源决定是否使用平滑滚动
              window.scrollTo({
                top: state.scrollPosition,
                behavior: isRecentBack ? 'smooth' : 'auto'
              });
            });
          });
        }, 100); // 增加延时，确保DOM完全更新
      }
    } catch (error) {
      console.error('Failed to restore search state:', error);
    }
  };
  
  // 首次加载：尝试从history.state或sessionStorage恢复状态
  useEffect(() => {
    // 控制浏览器的滚动恢复行为
    if ('scrollRestoration' in history) {
      // 禁用浏览器默认的滚动位置恢复，让我们自己控制
      history.scrollRestoration = 'manual';
    }
    
    // 只在有查询参数时尝试恢复状态
    if (initialLoadRef.current && query) {
      initialLoadRef.current = false;
      
      // 首先尝试从history.state恢复
      if (history.state) {
        restoreState(history.state, false);
      } 
      // 否则从sessionStorage恢复
      else {
        const savedState = sessionStorage.getItem('searchPageState');
        if (savedState) {
          try {
            const state = JSON.parse(savedState);
            // 只恢复相同查询词的状态
            if (state.query === query) {
              restoreState(state, false);
              
              // 同时更新history.state
              history.replaceState(state, '');
              
              // 如果已经有缓存的搜索结果，跳过重新加载
              if (state.results && state.results.length > 0) {
                return;
              }
            }
          } catch (error) {
            console.error('Failed to parse saved search state:', error);
          }
        }
      }
    }
    
    // 如果没有恢复状态或恢复的状态不包含搜索结果，则执行搜索
    const fetchResults = async () => {
      if (!query) return;
      
      setIsLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&locale=${locale}`);
        const data = await response.json();
        
        // 应用额外的前端去重处理
        const dedupedResults = performLocalDeduplication(data);
        
        setResults(dedupedResults);
        
        // 保存新获取的状态
        setTimeout(saveStateToHistory, 300);
      } catch (error) {
        console.error('搜索失败:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchResults();
    
    return () => {
      // 恢复默认行为
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'auto';
      }
    };
  }, [query, locale]);
  
  // 监听页面滚动，持续更新状态
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    
    const handleScroll = () => {
      // 使用防抖，避免频繁更新
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        saveStateToHistory();
      }, 200);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // 清理函数
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [query, activeTab, displayCount, results]);
  
  // 监听popstate事件 (浏览器后退/前进按钮) - 改进版本
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // 检查是否是从详情页返回
      const isBackFromDetail = sessionStorage.getItem('backFromSearchDetail') === 'true';
      const backTimestamp = sessionStorage.getItem('backTimestamp');
      
      // 无论是否从详情页返回，都尝试获取并恢复状态
      if (isBackFromDetail) {
        console.log('Back from search detail detected');
        // 清除标记
        sessionStorage.removeItem('backFromSearchDetail');
        sessionStorage.removeItem('backTimestamp');
        
        // 检查返回时间，如果刚刚返回就使用平滑滚动
        const isRecentBack = backTimestamp ? (Date.now() - parseInt(backTimestamp)) < 1000 : false;
        
        // 确保页面有足够时间更新DOM
        setTimeout(() => {
          if (event.state && event.state.query === query) {
            // 确保滚动恢复更平滑
            restoreState(event.state, isRecentBack);
          } else {
            // 尝试从sessionStorage获取
            const savedState = sessionStorage.getItem('searchPageState');
            if (savedState) {
              try {
                const state = JSON.parse(savedState);
                // 只恢复匹配当前查询的状态
                if (state.query === query) {
                  restoreState(state, isRecentBack);
                }
              } catch (error) {
                console.error('Failed to parse saved search state:', error);
              }
            }
          }
        }, 150); // 增加延时确保DOM更新
      } else if (event.state && event.state.query === query) {
        // 正常的浏览器后退/前进操作
        console.log('Normal popstate with matching query');
        restoreState(event.state, false);
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [query]); // 添加query作为依赖，确保当查询变化时重新绑定事件
  
  // 处理加载更多
  const handleLoadMore = () => {
    setDisplayCount(prev => Math.min(prev + 6, filteredResults.length));
    // 更新状态
    setTimeout(saveStateToHistory, 100);
  };
  
  // 根据当前选择的Tab筛选结果
  const filteredResults = activeTab === 'all' 
    ? results 
    : results.filter(result => result.resultType === activeTab);
  
  // 当前显示的结果 - 确保不超过筛选后结果的总数
  const displayedResults = filteredResults.slice(0, Math.min(displayCount, filteredResults.length));
  
  // 计算进度百分比 - 确保不超过100%
  const progressPercentage = filteredResults.length > 0 
    ? (Math.min(displayCount, filteredResults.length) / filteredResults.length) * 100 
    : 0;
  
  // 面包屑导航
  const breadcrumbItems: BreadcrumbItem[] = [
    { name: isZh ? '首页' : 'Home', href: `/${locale}` },
    { name: isZh ? '搜索结果' : 'Search Results' }
  ];

  // 标签切换处理函数，增加保存状态
  const handleTabChange = (tab: 'all' | 'product' | 'news' | 'case', count: number) => {
    setActiveTab(tab);
    setDisplayCount(Math.min(6, count));
    
    // 滚动到页面顶部
    window.scrollTo({ top: 0, behavior: 'auto' });
    
    // 保存状态
    setTimeout(saveStateToHistory, 100);
  };
  
  // 当用户离开页面或点击搜索结果项时保存状态 - 改进版本
  useEffect(() => {
    // 在DOM更新完成后设置事件监听器
    const setupEventListeners = () => {
      // 保存当前状态的函数
      const saveState = () => {
        console.log('Saving search state');
        saveStateToHistory();
      };
      
      // 为所有搜索结果链接添加点击事件监听器 - 确保选择更广泛的链接
      const resultLinks = document.querySelectorAll('.contain .product-card');
      console.log('Found result links:', resultLinks.length);
      
      resultLinks.forEach(link => {
        // 移除旧事件监听器(如果有)
        link.removeEventListener('click', handleLinkClick);
        // 添加新的事件监听器
        link.addEventListener('click', handleLinkClick);
      });
      
      // 当用户离开页面时保存状态
      window.removeEventListener('beforeunload', saveStateToHistory);
      window.addEventListener('beforeunload', saveState);
      
      // 确保保存状态
      saveState();
    };
    
    // 处理链接点击
    function handleLinkClick() {
      console.log('Search result link clicked');
      // 设置标记表示从搜索结果页离开
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem('backFromSearchDetail', 'true');
        sessionStorage.setItem('backTimestamp', Date.now().toString());
        
        // 直接保存当前状态到sessionStorage
        const currentState = {
          query,
          activeTab,
          displayCount,
          results,
          scrollPosition: window.scrollY
        };
        
        try {
          sessionStorage.setItem('searchPageState', JSON.stringify(currentState));
        } catch (error) {
          console.error('Failed to save search state to sessionStorage:', error);
        }
      }
    }
    
    // 确保DOM已完全更新后再设置事件监听器
    if (!isLoading && results.length > 0) {
      // 给DOM一些时间完成渲染
      setTimeout(setupEventListeners, 100);
    }
    
    // 清理函数
    return () => {
      const resultLinks = document.querySelectorAll('.contain .product-card');
      resultLinks.forEach(link => {
        link.removeEventListener('click', handleLinkClick);
      });
      
      window.removeEventListener('beforeunload', saveStateToHistory);
    };
  }, [query, activeTab, displayCount, results, isLoading]); // 依赖包含isLoading

  // 在每次渲染后调用的效果，确保滚动恢复只发生一次
  useEffect(() => {
    // 如果页面已加载且存在从sessionStorage恢复的状态
    if (!isLoading && !didRestoreScrollRef.current && sessionStorage.getItem('backFromSearchDetail') === 'true') {
      const savedState = sessionStorage.getItem('searchPageState');
      if (savedState) {
        try {
          const state = JSON.parse(savedState);
          if (state.query === query) {
            // 检查是否需要恢复滚动位置
            const backTimestamp = sessionStorage.getItem('backTimestamp');
            const isRecentBack = backTimestamp ? (Date.now() - parseInt(backTimestamp)) < 1000 : false;
            
            // 清除标记
            sessionStorage.removeItem('backFromSearchDetail');
            sessionStorage.removeItem('backTimestamp');
            
            // 恢复状态
            restoreState(state, isRecentBack);
          }
        } catch (error) {
          console.error('Error restoring state after load:', error);
        }
      }
    }
  }, [isLoading, query]);
  
  return (
    <LayoutWithTransition
      locale={locale}
      breadcrumbItems={breadcrumbItems}
    >
      <CardAnimationProvider />
      <div className="bg-white">
        <div className="contain py-10 max-w-screen-xl mx-auto">
          {/* 极简搜索表单 */}
          <div className="mb-10 text-center">
            <h1 className="text-xl font-light text-gray-800 mb-1">
              {isZh ? '搜索结果' : 'Search Results'} <span className="font-normal">"{query}"</span>
            </h1>
            {!isLoading && (
              <p className="text-sm text-gray-500">
                {isZh 
                  ? `找到 ${results.length} 个结果` 
                  : `Found ${results.length} results`}
              </p>
            )}
          </div>
          
          {/* 重新设计搜索表单：更好的移动端响应式 */}
          <form 
            className="mb-8 max-w-2xl mx-auto px-4 sm:px-0" 
            action={`/${locale}/search`} 
            method="get" 
            onSubmit={(e) => {
              const searchInput = e.currentTarget.querySelector('input[name="q"]') as HTMLInputElement;
              const searchValue = searchInput?.value?.trim() || '';
              
              // 阻止单个特殊字符或过短的搜索
              if (!searchValue || searchValue.length < 2 || /^[^\w\u4e00-\u9fa5]+$/.test(searchValue)) {
                e.preventDefault();
                
                if (searchInput) {
                  // 添加输入验证视觉反馈
                  searchInput.classList.add('border-red-500');
                  searchInput.focus();
                  
                  // 显示错误提示
                  const errorMsg = document.getElementById('search-error');
                  if (errorMsg) {
                    errorMsg.textContent = isZh ? 
                      "请输入至少2个字符的有效搜索词" : 
                      "Please enter a valid search term (min. 2 characters)";
                    errorMsg.style.display = 'block';
                  }
                }
                return false;
              }
              
              // 移除错误状态
              const errorMsg = document.getElementById('search-error');
              if (errorMsg) errorMsg.style.display = 'none';
            }}
          >
            <div className="flex border-b border-black focus-within:border-orange-500 pb-2 w-full">
              <input 
                type="text" 
                name="q" 
                defaultValue={query}
                autoComplete="off" 
                className="w-full bg-transparent text-black focus:outline-none text-base sm:text-lg"
                placeholder={isZh ? "输入搜索关键词" : "Enter search term"}
                required
                onChange={(e) => {
                  // 移除错误状态
                  e.target.classList.remove('border-red-500');
                  const errorMsg = document.getElementById('search-error');
                  if (errorMsg) errorMsg.style.display = 'none';
                }}
              />
              <button 
                type="submit" 
                className="text-orange-500 hover:text-orange-600 focus:outline-none ml-2 flex-shrink-0"
                aria-label={isZh ? "搜索" : "Search"}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <p id="search-error" className="text-red-500 text-sm mt-2" style={{display: 'none'}}></p>
          </form>
          
          {/* 添加分类Tab - 改进响应式设计 */}
          {!isLoading && results.length > 0 && (
            <div className="border-b border-gray-200 mb-6">
              <div className="flex justify-center">
              <button
                  onClick={() => handleTabChange('all', results.length)}
                  className={`px-3 sm:px-4 md:px-6 py-3 text-sm font-medium ${
                  activeTab === 'all' 
                    ? 'text-orange-500 border-b-2 border-orange-500' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {isZh ? '全部' : 'All'}
                <span className="ml-1 text-xs">({results.length})</span>
              </button>
              
              {/* 只有存在对应类型的结果时才显示该Tab */}
              {results.some(r => r.resultType === 'product') && (
                <button
                  onClick={() => {
                    const productResults = results.filter(r => r.resultType === 'product');
                      handleTabChange('product', productResults.length);
                  }}
                    className={`px-3 sm:px-4 md:px-6 py-3 text-sm font-medium ${
                    activeTab === 'product' 
                      ? 'text-orange-500 border-b-2 border-orange-500' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {isZh ? '产品' : 'Products'}
                  <span className="ml-1 text-xs">
                    ({results.filter(r => r.resultType === 'product').length})
                  </span>
                </button>
              )}
              
              {results.some(r => r.resultType === 'news') && (
                <button
                  onClick={() => {
                    const newsResults = results.filter(r => r.resultType === 'news');
                      handleTabChange('news', newsResults.length);
                  }}
                    className={`px-3 sm:px-4 md:px-6 py-3 text-sm font-medium ${
                    activeTab === 'news' 
                      ? 'text-orange-500 border-b-2 border-orange-500' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {isZh ? '新闻' : 'News'}
                  <span className="ml-1 text-xs">
                    ({results.filter(r => r.resultType === 'news').length})
                  </span>
                </button>
              )}
              
              {results.some(r => r.resultType === 'case') && (
                <button
                  onClick={() => {
                    const caseResults = results.filter(r => r.resultType === 'case');
                      handleTabChange('case', caseResults.length);
                  }}
                    className={`px-3 sm:px-4 md:px-6 py-3 text-sm font-medium ${
                    activeTab === 'case' 
                      ? 'text-orange-500 border-b-2 border-orange-500' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {isZh ? '案例' : 'Cases'}
                  <span className="ml-1 text-xs">
                    ({results.filter(r => r.resultType === 'case').length})
                  </span>
                </button>
              )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="contain py-6 max-w-screen-xl mx-auto">
        {/* 搜索结果 */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-6 h-6 border-2 border-t-orange-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
        ) : results.length > 0 ? (
          <>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {displayedResults.map((result, index) => {
                // 确保结果有效URL
                let url = result.url || '';
                
                // 确保以 /locale/ 开头
                if (!url.startsWith(`/${locale}/`)) {
                  url = `/${locale}/${url.replace(/^\//, '')}`;
                }
                
                // 确保路径规范化
                url = url.replace(/\/+/g, '/');
                
                return (
                  <Link 
                    href={url} 
                    key={`${result.id}-${index}`}
                    className="product-card block rounded-xs pb-6 bg-white"
                  >
                    {result.imageSrc && (
                      <div className="mb-2 overflow-hidden">
                        <div className="relative h-64 overflow-hidden bg-gray-50">
                          <OptimizedImage
                            src={result.imageSrc}
                            alt={result.title}
                            className="w-full h-full object-cover"
                            objectFit="cover"
                            unoptimized={true}
                          />
                        </div>
                      </div>
                    )}
                    <div className="px-4">
                      {result.category && (
                        <p className="text-xs text-gray-400 mb-1">{result.category}</p>
                      )}
                      <h2 className="text-base font-medium text-black transition-colors duration-300">
                        {result.title}
                      </h2>
                    </div>
                  </Link>
                );
              })}
            </div>
            
            {/* 进度指示器和加载更多按钮 */}
            {filteredResults.length > 6 && (
              <div className="mt-20 flex flex-col items-center gap-y-8">
                <div className="text-center">
                  <div className="relative mb-2 h-[2px] w-[200px] bg-gray-100">
                    <span 
                      className="absolute left-0 top-0 h-[2px] bg-orange-500" 
                      style={{width: `${progressPercentage}%`}}
                    ></span>
                  </div>
                  <p>{displayCount} / {filteredResults.length}</p>
                </div>
                
                {displayCount < filteredResults.length && (
                  <button 
                    type="button" 
                    className="group inline-flex items-center text-sm gap-3 transition-colors no-underline bg-gray-100 px-6 py-3 hover:bg-gray-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    onClick={handleLoadMore}
                  >
                    <span className="w-full">{isZh ? '加载更多' : 'Load more'}</span>
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="py-20 text-center">
            <div className="inline-flex p-4 rounded-full bg-gray-50 mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 6L14 14" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="text-lg text-black mb-2">
              {isZh ? (
                <>
                  未找到与 <span className="text-orange-500">"{query}"</span> 相关的内容
                </>
              ) : (
                <>
                  No results found for <span className="text-orange-500">"{query}"</span>
                </>
              )}
            </h2>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              {isZh ? "请尝试使用其他关键词" : "Please try with different keywords"}
            </p>
          </div>
        )}
      </div>
    </LayoutWithTransition>
  );
}
