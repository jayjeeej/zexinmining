'use client';

import React, { useState, useEffect, useRef } from 'react';
import ProductLayout from '@/components/layouts/ProductLayout';
import Container from '@/components/Container';
import OptimizedImage from '@/components/layouts/OptimizedImage';
import Link from 'next/link';
import { formatDate } from '@/lib/utils/date';
import { getBreadcrumbStructuredData, getOrganizationStructuredData } from '@/lib/structuredData';
import { MultiStructuredData } from '@/components/StructuredData';
import { NewsItem } from '@/lib/api/news';

// 组件属性类型
interface NewsClientProps {
  locale: string;
  initialNewsItems: NewsItem[];
  breadcrumbItems: any[];
  totalNewsCount?: number; // 可选的总新闻数量
}

export default function NewsClient({ locale, initialNewsItems, breadcrumbItems, totalNewsCount: initialTotalCount }: NewsClientProps) {
  const isZh = locale === 'zh';
  const [newsItems, setNewsItems] = useState<NewsItem[]>(initialNewsItems);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalNewsCount, setTotalNewsCount] = useState<number>(initialTotalCount || initialNewsItems.length);
  const [displayCount, setDisplayCount] = useState(6); // 初始只显示6个新闻
  const [searchTerm, setSearchTerm] = useState(''); // 新增：搜索关键词
  const initialLoadRef = useRef(true); // 用于追踪是否是首次加载
  const didRestoreScrollRef = useRef(false); // 追踪是否已恢复滚动位置
  
  // 分类选项
  const categories = [
    { id: 'all', name: isZh ? '全部' : 'All' },
    { id: 'company', name: isZh ? '公司新闻' : 'Company News' },
    { id: 'product', name: isZh ? '产品动态' : 'Product Updates' },
    { id: 'technical', name: isZh ? '选矿知识' : 'Beneficiation Techniques' }
  ];

  // 过滤和搜索新闻
  const filteredNews = newsItems
    .filter(news => activeFilter === 'all' || news.category === activeFilter)
    .filter(news => {
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      return (
        news.title.toLowerCase().includes(term) ||
        news.summary.toLowerCase().includes(term)
      );
    });
    
  // 当前显示的新闻（确保不超过过滤后结果的总数）
  const displayedNews = filteredNews.slice(0, Math.min(displayCount, filteredNews.length));
  
  // 计算进度百分比
  const progressPercentage = filteredNews.length > 0 
    ? (Math.min(displayCount, filteredNews.length) / filteredNews.length) * 100 
    : 0;

  // 保存当前状态到history.state (用于浏览器返回按钮)
  const saveStateToHistory = () => {
    const currentState = {
      filter: activeFilter,
      page: page,
      displayCount: displayCount,
      scrollPosition: window.scrollY,
      searchTerm: searchTerm,
      progressPercentage: progressPercentage,
      newsItems: newsItems
    };
    
    // 将状态保存到history和sessionStorage
    try {
      history.replaceState(currentState, '');
      sessionStorage.setItem('newsPageState', JSON.stringify(currentState));
    } catch (error) {
      console.error('Failed to save state:', error);
    }
  };
  
  // 恢复状态
  const restoreState = (state: any, isRecentBack = false) => {
    if (!state) return;
    
    try {
      // 恢复筛选器状态
      if (state.filter) setActiveFilter(state.filter);
      
      // 恢复页码和显示数量
      if (state.page) setPage(state.page);
      if (state.displayCount) setDisplayCount(state.displayCount);
      
      // 恢复搜索词
      if (state.searchTerm) setSearchTerm(state.searchTerm);
      
      // 如果有保存的新闻列表，则恢复
      if (state.newsItems && state.newsItems.length > 0) {
        setNewsItems(state.newsItems);
      }
      
      // 延迟恢复滚动位置以确保内容已渲染
      if (state.scrollPosition && !didRestoreScrollRef.current) {
        didRestoreScrollRef.current = true;
        
        // 使用多层RAF嵌套来确保DOM完全更新后再滚动
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            // 根据来源决定是否使用平滑滚动
            window.scrollTo({
              top: state.scrollPosition,
              behavior: isRecentBack ? 'smooth' : 'auto'
            });
          });
        });
      }
    } catch (error) {
      console.error('Failed to restore state:', error);
    }
  };

  // 首次加载：尝试从history.state或sessionStorage恢复状态
  useEffect(() => {
    // 控制浏览器的滚动恢复行为
    if ('scrollRestoration' in history) {
      // 禁用浏览器默认的滚动位置恢复，让我们自己控制
      history.scrollRestoration = 'manual';
    }
    
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      
      // 首先尝试从history.state恢复
      if (history.state) {
        restoreState(history.state, false);
      } 
      // 否则从sessionStorage恢复
      else {
        const savedState = sessionStorage.getItem('newsPageState');
        if (savedState) {
          try {
            const state = JSON.parse(savedState);
            restoreState(state, false);
            
            // 同时更新history.state
            history.replaceState(state, '');
          } catch (error) {
            console.error('Failed to parse saved state:', error);
          }
        }
      }
    }
    
    return () => {
      // 恢复默认行为
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'auto';
      }
    };
  }, []);
  
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
  }, [activeFilter, page, displayCount, searchTerm, newsItems]);
  
  // 监听popstate事件 (浏览器后退/前进按钮)
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // 检查是否是从新闻详情页返回
      const isBackFromDetail = sessionStorage.getItem('backFromNewsDetail') === 'true';
      const backTimestamp = sessionStorage.getItem('backTimestamp');
      
      if (isBackFromDetail) {
        // 清除标记
        sessionStorage.removeItem('backFromNewsDetail');
        sessionStorage.removeItem('backTimestamp');
        
        // 检查返回时间，如果刚刚返回就使用平滑滚动
        const isRecentBack = backTimestamp ? (Date.now() - parseInt(backTimestamp)) < 1000 : false;
        
        // 稍微延迟恢复滚动位置，让页面有足够时间准备
        setTimeout(() => {
          if (event.state) {
            // 确保滚动恢复更平滑
            restoreState(event.state, isRecentBack);
          } else {
            // 尝试从sessionStorage获取
            const savedState = sessionStorage.getItem('newsPageState');
            if (savedState) {
              try {
                const state = JSON.parse(savedState);
                restoreState(state, isRecentBack);
              } catch (error) {
                console.error('Failed to parse saved state:', error);
              }
            }
          }
        }, 50); // 略微增加延迟以确保DOM更新
      } else if (event.state) {
        // 正常的浏览器后退/前进操作
        restoreState(event.state, false);
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // 当用户离开页面或点击某个新闻项时保存状态
  useEffect(() => {
    // 保存当前状态的函数
    const saveState = () => {
      saveStateToHistory();
    };
    
    // 为所有新闻链接添加点击事件监听器
    const newsLinks = document.querySelectorAll(`a[href^="/${locale}/news/"][href$="/"]`);
    newsLinks.forEach(link => {
      link.addEventListener('click', saveState);
    });
    
    // 当用户离开页面时保存状态
    window.addEventListener('beforeunload', saveState);
    
    // 清理函数
    return () => {
      newsLinks.forEach(link => {
        link.removeEventListener('click', saveState);
      });
      window.removeEventListener('beforeunload', saveState);
    };
  }, [activeFilter, page, displayCount, searchTerm, newsItems, locale]);
    
  // 获取分类对应的总数 - 页面初始化时获取一次总数
  useEffect(() => {
    // 只有当没有提供初始总数时才获取
    if (!initialTotalCount) {
      const fetchInitialCount = async () => {
        try {
          const response = await fetch(`/api/news?locale=${locale}&page=1&filter=${activeFilter}&limit=1`);
          const data = await response.json();
          if (data.total) {
            setTotalNewsCount(data.total);
          }
        } catch (error) {
          console.error('Failed to fetch initial news count:', error);
        }
      };
      
      fetchInitialCount();
    }
  }, [activeFilter, locale, initialTotalCount]);

  // 根据筛选器获取新闻
  const fetchNewsByFilter = async (filterId: string) => {
    setLoading(true);
    
    // 增加重试逻辑
    const maxRetries = 3;
    let retries = 0;
    
    while (retries < maxRetries) {
      try {
        const response = await fetch(`/api/news?locale=${locale}&page=1&filter=${filterId}`, {
          // 添加超时设置
          signal: AbortSignal.timeout(10000) // 10秒超时
        });
        
        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.news) {
          setNewsItems(data.news);
        }
        
        if (data.total !== undefined) {
          setTotalNewsCount(data.total);
        }
        
        // 请求成功，跳出循环
        break;
        
      } catch (error) {
        retries++;
        console.error(`Failed to fetch news (attempt ${retries}/${maxRetries}):`, error);
        
        // 最后一次尝试失败
        if (retries === maxRetries) {
          // 显示给用户一个友好的错误消息
          alert(isZh ? '获取新闻列表失败，请刷新页面重试' : 'Failed to load news, please refresh the page');
        } else {
          // 等待一段时间再重试
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
    
    setLoading(false);
  };

  // 加载更多新闻
  const loadMore = async () => {
    // 如果当前显示数量小于已加载数量，增加显示数量
    if (displayCount < newsItems.length) {
      setDisplayCount(Math.min(displayCount + 6, filteredNews.length));
      return;
    }
    
    // 否则从服务器加载更多
    setLoading(true);
    
    try {
      const nextPage = page + 1;
      const response = await fetch(`/api/news?locale=${locale}&page=${nextPage}&filter=${activeFilter}`, {
        // 添加超时设置
        signal: AbortSignal.timeout(10000) // 10秒超时
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.news && data.news.length > 0) {
        setNewsItems([...newsItems, ...data.news]);
        setDisplayCount(displayCount + data.news.length);
        setPage(nextPage);
        
        // 如果后端返回了总数，更新总数
        if (data.total !== undefined) {
          setTotalNewsCount(data.total);
        }
      }
    } catch (error) {
      console.error('Failed to load more news:', error);
      // 显示加载失败消息，但不阻止用户继续使用
      // 可以考虑显示一个轻量级的提示
    } finally {
      setLoading(false);
    }
  };

  // 更改过滤器
  const handleFilterChange = async (filterId: string) => {
    if (filterId === activeFilter) return;
    
    setActiveFilter(filterId);
    setPage(1);
    setDisplayCount(6); // 重置显示数量为6
    setSearchTerm(''); // 重置搜索词
    
    // 获取新的过滤条件下的新闻列表
    await fetchNewsByFilter(filterId);
    
    // 重置滚动位置到顶部
    window.scrollTo({
      top: 0,
      behavior: 'auto'
    });
    
    // 更新history状态
    saveStateToHistory();
  };

  // 处理搜索
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    saveStateToHistory(); // 更新状态
  };

  // SEO结构化数据
  const breadcrumbStructuredData = getBreadcrumbStructuredData(
    breadcrumbItems.map(item => ({ name: item.name, url: item.href }))
  );
  const organizationStructuredData = getOrganizationStructuredData(isZh);
  
  const newsListStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "headline": isZh ? "新闻中心" : "News Center",
    "description": isZh ? 
      "了解泽鑫矿山设备的最新动态、产品发布和企业新闻" : 
      "Stay updated with the latest news, product releases and corporate updates from Zexin Mining Equipment",
    "url": `https://zexin-mining.com/${locale}/news`,
    "publisher": {
      "@type": "Organization",
      "name": isZh ? "泽鑫矿山设备" : "Zexin Mining Equipment",
      "logo": {
        "@type": "ImageObject",
        "url": "https://zexin-mining.com/logo/logo.png"
      }
    }
  };

  // 合并所有结构化数据
  const structuredDataArray = [
    breadcrumbStructuredData,
    organizationStructuredData,
    newsListStructuredData
  ];

  return (
    <>
      {/* SEO结构化数据 */}
      <MultiStructuredData dataArray={structuredDataArray} />
    
      <ProductLayout locale={locale} breadcrumbItems={breadcrumbItems}>
        {/* 主要内容区域 - 采用左右布局 */}
        <section className="bg-white py-16 md:py-24">
          <Container>
            <div className="flex flex-col lg:flex-row gap-12">
              {/* 左侧分类导航 */}
              <div className="w-full lg:w-1/5 lg:border-r lg:border-gray-100 lg:pr-6">
                <h2 className="text-lg mb-4 font-normal text-gray-500">{isZh ? '分类' : 'Categories'}</h2>
                <div className="flex flex-col space-y-3">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleFilterChange(category.id)}
                      className={`text-left py-1 transition-colors text-base ${
                        activeFilter === category.id 
                          ? 'text-[#ff6633] font-medium' 
                          : 'text-gray-700 hover:text-[#ff6633]'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* 右侧新闻列表 */}
              <div className="w-full lg:w-4/5">
                {/* 页面标题 */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-normal text-black">
                    {isZh ? '新闻中心' : 'News Center'}
                  </h2>
                </div>
                
                {/* 搜索框 */}
                <div className="mb-8 flex justify-end">
                  <div className="relative w-full max-w-xs">
                    <input
                      type="text"
                      id="news-search"
                      name="news-search"
                      value={searchTerm}
                      onChange={handleSearch}
                      placeholder={isZh ? "搜索新闻..." : "Search news..."}
                      className="w-full px-4 py-2 border-b border-[#ff6633] pl-10 focus:outline-none focus:border-b focus:border-[#ff6633] bg-transparent"
                    />
                    <svg 
                      className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </div>
                </div>
                
                {displayedNews.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
                      {displayedNews.map((news) => (
                        <Link 
                          href={`/${locale}/news/${news.slug}`}
                          key={news.id}
                          className="group block no-underline"
                        >
                          <div className="h-full flex flex-col">
                            <div className="relative aspect-[4/3] mb-4 overflow-hidden">
                              <OptimizedImage
                                src={news.image || '/images/news/placeholder.jpg'}
                                alt={news.title}
                                fill
                                className="object-cover w-full h-full"
                                unoptimized={true}
                              />
                            </div>
                            <div className="flex-1 flex flex-col">
                              <div className="flex items-center gap-4 mb-2 text-sm">
                                <span className="text-gray-500">{formatDate(news.date, locale)}</span>
                                <span className="text-[#ff6633]">
                                  {categories.find(c => c.id === news.category)?.name || news.category}
                                </span>
                              </div>
                              <h2 className="text-xl font-normal mb-3 text-black group-hover:text-[#ff6633] transition-colors">
                                {news.title}
                              </h2>
                              <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                                {news.summary}
                              </p>
                              <div className="mt-auto">
                                <span className="inline-flex items-center text-[#ff6633] text-sm font-normal group-hover:underline">
                                  {isZh ? '阅读全文' : 'Read article'}
                                  <svg className="w-4 h-4 ml-1" viewBox="0 0 16 16" fill="none">
                                    <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>

                    {/* 进度条和加载更多按钮 - 当filteredNews数量大于6个时显示 */}
                    {filteredNews.length > 6 && (
                      <div className="mt-20 flex flex-col items-center gap-y-8">
                        {/* 进度指示器 */}
                        <div className="text-center">
                          <div className="relative mb-2 h-[2px] w-[200px] bg-gray-100">
                            <span 
                              className="absolute left-0 top-0 h-[2px] bg-orange-500" 
                              style={{width: `${progressPercentage}%`}}
                            ></span>
                          </div>
                          <p>{Math.min(displayCount, filteredNews.length)} / {filteredNews.length}</p>
                        </div>
                        
                        {/* 加载更多按钮 - 仅当未加载全部内容时显示 */}
                        {displayCount < filteredNews.length && (
                        <button
                          onClick={loadMore}
                          disabled={loading}
                            className="group inline-flex items-center text-sm gap-3 transition-colors no-underline bg-gray-100 px-6 py-3 hover:bg-gray-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                          {loading ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                                <span className="w-full">{isZh ? '加载中...' : 'Loading...'}</span>
                            </>
                          ) : (
                              <span className="w-full">{isZh ? '加载更多' : 'Load more'}</span>
                          )}
                        </button>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="py-12 text-center">
                    <p className="text-gray-500 text-lg">
                      {isZh ? '没有找到相关新闻' : 'No news found'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Container>
        </section>
      </ProductLayout>
    </>
  );
}
