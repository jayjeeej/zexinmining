'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/app/contexts/LanguageContext';
import PageSection from '@/app/components/PageSection';

// 定义搜索结果类型
interface SearchResult {
  id: string;
  title: string;
  description: string;
  image: string;
  url: string;
}

// 搜索内容组件
function SearchContent() {
  const searchParams = useSearchParams();
  const { isZh } = useLanguage();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<string>('');

  const query = searchParams.get('q') || '';

  useEffect(() => {
    if (query) {
      setIsLoading(true);
      
      const fetchResults = async () => {
        try {
          // 硬编码产品文件列表，确保能搜索所有产品
          const productFiles = [
            'sawtooth-wave-jig',
            'synchronous-counter-directional-jig',
            'synchronous-counter-directional-jig-small',
            'shaking-table',
            'spiral-chute',
            'centrifugal-separator',
            'carpet-hooking-machine',
            'xcf-flotation-machine',
            'self-priming-flotation-machine',
            'flotation-cell',
            'bar-flotation-machine',
            'aeration-flotation-machine',
            'coarse-particle-flotation-machine',
            'permanent-magnetic-drum-separator',
            'plate-type-high-intensity-wet-magnetic-separator',
            'roller-type-high-intensity-wet-magnetic-separator',
            'three-disc-belt-magnetic-separator',
            'double-roller-permanent-magnetic-zircon-separator',
            'four-roller-variable-frequency-electrostatic-separator',
            'jaw-crusher',
            'impact-crusher',
            'cone-crusher',
            'hammer-crusher',
            'double-roller-crusher',
            'heavy-duty-double-roller-crusher',
            'vibrating-screen',
            'linear-vibrating-screen',
            'ya-circular-vibrating-screen',
            'banana-vibrating-screen',
            'bar-vibrating-screen',
            'drum-screen',
            'high-weir-spiral-classifier',
            'double-spiral-classifier',
            'xdg-vibrating-feeder',
            'plate-feeder',
            'belt-feeder',
            'disc-feeder',
            'electromagnetic-vibrating-feeder',
            'overflow-ball-mill',
            'wet-grid-ball-mill',
            'dry-grid-ball-mill',
            'rod-mill',
            'spiral-washer',
            'drum-washer',
            'double-spiral-washer'
          ];
          
          // 搜索结果数组
          const searchResults: SearchResult[] = [];
          const debugMessages: string[] = [`搜索关键词: "${query}"`];
          
          // 遍历所有产品文件进行搜索
          for (const productId of productFiles) {
            try {
              const response = await fetch(`/data/products/${productId}.json`);
              if (!response.ok) {
                debugMessages.push(`文件 ${productId}.json 加载失败: ${response.status}`);
                continue;
              }
              
              const data = await response.json();
              
              // 在产品名称中搜索
              const nameZh = data.nameZh || '';
              const nameEn = data.nameEn || '';
              const seriesZh = data.series?.zh || '';
              const seriesEn = data.series?.en || '';
              const overviewZh = data.overview?.zh || data.descriptionZh || '';
              const overviewEn = data.overview?.en || data.descriptionEn || '';
              
              // 检查是否是中文搜索
              const isChinese = /[\u4e00-\u9fa5]/.test(query);
              
              // 如果是中文搜索，优先匹配中文内容
              let titleMatch = false;
              let overviewMatch = false;
              
              if (isChinese) {
                // 中文搜索时匹配中文内容
                const searchTerms = [query];
                // 添加常见变体
                if (query.includes('给料')) {
                  searchTerms.push(query.replace('给料机', '给料设备'));
                  searchTerms.push(query.replace('给料设备', '给料机'));
                }
                
                titleMatch = searchTerms.some(term => 
                  (nameZh && nameZh.includes(term)) ||
                  (seriesZh && seriesZh.includes(term))
                );
                overviewMatch = searchTerms.some(term =>
                  overviewZh && overviewZh.includes(term)
                );
              } else {
                // 英文搜索时匹配所有内容，不区分大小写
                const lowerQuery = query.toLowerCase();
                titleMatch = 
                  (nameEn && nameEn.toLowerCase().includes(lowerQuery)) ||
                  (seriesEn && seriesEn.toLowerCase().includes(lowerQuery)) ||
                  (nameZh && nameZh.includes(query)) || 
                  (seriesZh && seriesZh.includes(query));
                overviewMatch = 
                  (overviewEn && overviewEn.toLowerCase().includes(lowerQuery)) ||
                  (overviewZh && overviewZh.includes(query));
              }
              
              // 调试信息
              debugMessages.push(`检查 ${data.id}:`);
              debugMessages.push(`- 名称(zh): ${nameZh}`);
              debugMessages.push(`- 名称(en): ${nameEn}`);
              debugMessages.push(`- 系列(zh): ${seriesZh}`);
              debugMessages.push(`- 系列(en): ${seriesEn}`);
              debugMessages.push(`- 描述(zh): ${overviewZh}`);
              debugMessages.push(`- 标题匹配: ${titleMatch}`);
              debugMessages.push(`- 描述匹配: ${overviewMatch}`);
              
              if (productId === 'sawtooth-wave-jig') {
                debugMessages.push(`检查 ${productId}: 标题匹配=${titleMatch}, 概述匹配=${overviewMatch}`);
                debugMessages.push(`名称(zh): ${seriesZh}`);
                debugMessages.push(`名称(en): ${seriesEn}`);
              }
                
              // 如果有匹配，添加到结果中
              if (titleMatch || overviewMatch) {
                debugMessages.push(`找到匹配: ${productId}`);
                
                // 根据产品类型确定正确的URL路径
                let url = '/products';
                if (data.id.includes('crusher')) {
                  url += `/stationary-crushers/${data.id}`;
                } else if (data.id === 'vibrating-screen' || data.id.includes('screen') || data.id.includes('vibrating-screen')) {
                  // 所有筛分设备都在 vibrating-screens 目录下
                  url += `/vibrating-screens/${data.id}`;
                } else if (data.id.includes('washer') || data.id.includes('washing')) {
                  url += `/washing-equipment/${data.id}`;
                } else if (data.id.includes('mill')) {
                  url += `/grinding-equipment/${data.id}`;
                } else if (data.id.includes('feeder')) {
                  url += `/feeding-equipment/${data.id}`;
                } else if (data.id.includes('classifier')) {
                  url += `/classification-equipment/${data.id}`;
                } else if (data.id.includes('jig') || data.id.includes('shaking-table') || data.id.includes('spiral-chute')) {
                  url += `/gravity-separation/${data.id}`;
                } else if (data.id.includes('flotation')) {
                  url += `/flotation/${data.id}`;
                } else if (data.id.includes('magnetic') || data.id.includes('electrostatic')) {
                  url += `/magnetic-separation/${data.id}`;
                } else if (data.subcategory) {
                  url += `/${data.subcategory}/${data.id}`;
                } else {
                  url += `/${data.id}`;
                }
                
                // 确定正确的图片路径
                let imagePath = '';
                if (data.id.includes('crusher')) {
                  imagePath = `/images/products/crushers/${data.id}.png`;
                } else if (data.id === 'vibrating-screen' || data.id.includes('screen') || data.id.includes('vibrating-screen')) {
                  // 所有筛分设备图片都在 screens 目录下
                  const screenId = data.id === 'vibrating-screen' ? 'xd-vibrating-screen' : data.id;
                  imagePath = `/images/products/screens/${screenId}.png`;
                } else if (data.id.includes('washer') || data.id.includes('washing')) {
                  imagePath = `/images/products/washers/${data.id}.png`;
                } else if (data.id.includes('mill')) {
                  imagePath = `/images/products/grinding/${data.id}.png`;
                } else if (data.id.includes('feeder')) {
                  imagePath = `/images/products/feeders/${data.id}.png`;
                } else if (data.id.includes('classifier')) {
                  imagePath = `/images/products/classification-equipment/${data.id}.png`;
                } else if (data.id.includes('jig')) {
                  imagePath = `/images/products/gravity-separation/${data.id}.png`;
                } else if (data.subcategory) {
                  imagePath = `/images/products/${data.subcategory}/${data.id}.png`;
                } else {
                  imagePath = `/images/products/${data.id}.png`;
                }
                
                // 调试信息
                debugMessages.push(`产品ID: ${data.id}, 图片路径: ${imagePath}, 跳转路径: ${url}`);
                
                searchResults.push({
                  id: data.id,
                  title: isChinese 
                    ? (data.nameZh || data.series?.zh || data.id) 
                    : (isZh ? data.nameZh || data.series?.zh || data.id : data.nameEn || data.series?.en || data.id),
                  description: isChinese
                    ? (data.overview?.zh || data.descriptionZh || '')
                    : (isZh ? data.overview?.zh || data.descriptionZh || '' : data.overview?.en || data.descriptionEn || ''),
                  image: imagePath,
                  url: url
                });
              }
            } catch (error) {
              // 忽略单个文件的加载错误，继续处理其他文件
              debugMessages.push(`Error loading ${productId}: ${error}`);
              console.error(`Error loading product data for ${productId}:`, error);
            }
          }
          
          setDebugInfo(debugMessages.join('\n'));
          setResults(searchResults);
        } catch (error) {
          console.error('搜索出错:', error);
          setResults([]);
          setDebugInfo(`搜索过程出错: ${error}`);
        } finally {
          setIsLoading(false);
        }
      };

      fetchResults();
    } else {
      setResults([]);
      setIsLoading(false);
    }
  }, [query]);

  // 搜索分类数据
  const searchCategories = [
    {
      id: "all",
      name: isZh ? "全部内容" : "All content",
    },
    {
      id: "about",
      name: isZh ? "关于我们" : "About us",
    },
    {
      id: "products",
      name: isZh ? "产品中心" : "Products",
    },
    {
      id: "solutions",
      name: isZh ? "解决方案" : "Solutions",
    },
    {
      id: "cases",
      name: isZh ? "成功案例" : "Case Studies",
    },
    {
      id: "news",
      name: isZh ? "新闻资讯" : "News",
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* 搜索标题 */}
      <section className="pt-16 mb-8 lg:mb-16">
        <div className="container mx-auto px-4 max-w-[1200px]">
          <div className="lg:col-span-3">
            <h1 className="text-3xl font-bold text-[#333333]">
              {isZh ? "搜索结果" : "Search Results"}
            </h1>
          </div>
        </div>
      </section>

      {/* 搜索表单 */}
      <form action="/search" method="get" className="mb-12">
        <div className="container mx-auto px-4 max-w-[1200px]">
          <div className="flex flex-col md:flex-row gap-4 md:items-center">
            <div className="relative flex-grow">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg focusable="false" fill="currentColor" width="24" height="24" aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
                </svg>
              </span>
              <input 
                type="search" 
                name="q" 
                defaultValue={query}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#333333]"
                placeholder={isZh ? "请输入搜索关键词" : "Enter search term"}
              />
            </div>
            <button 
              type="submit"
              className="px-8 py-3 bg-[#1441F5] text-white rounded-lg hover:bg-[#1031C0] transition-colors duration-300 md:w-auto w-full"
            >
              {isZh ? "搜索" : "Search"}
            </button>
          </div>
        </div>
      </form>

      {/* 搜索分类 */}
      <section className="mb-12">
        <div className="container mx-auto px-4 max-w-[1200px]">
          <nav className="flex flex-wrap gap-3 pb-8 border-b border-gray-100">
            {searchCategories.map((category) => (
              <a
                key={category.id}
                href={`/search?q=${query}&category=${category.id}`}
                className={`px-6 py-2 rounded-full transition-colors duration-300 ${
                  category.id === "all"
                    ? "bg-[#333333] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                }`}
              >
                {category.name}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* 搜索结果 */}
      <section className="mb-0">
        <div className="container mx-auto px-4 max-w-[1200px]">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1441F5]"></div>
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-1 gap-8">
              {results.map((result) => (
                <div key={result.id} className="bg-white p-6 rounded-lg shadow-sm flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3 relative h-64 md:h-[280px]">
                    <Image
                      src={result.image}
                      alt={result.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      style={{ objectFit: 'contain' }}
                      className="rounded-md"
                    />
                  </div>
                  <div className="md:w-2/3">
                    <h2 className="text-2xl font-bold text-[#333333] mb-3">
                      <Link href={result.url} className="hover:text-[#1441F5] transition-colors">
                        {result.title}
                      </Link>
                    </h2>
                    <p className="text-gray-600 mb-4">{result.description}</p>
                    <Link 
                      href={result.url}
                      className="group inline-flex items-center text-sm md:text-base gap-3 transition-colors ease-hover text-current underline-offset-4 hover:text-current focus:text-current active:text-current"
                    >
                      <span className="underline group-hover:opacity-80 group-focus:opacity-80 group-active:opacity-80 transition-opacity">
                        {isZh ? "查看详情" : "View Details"}
                      </span>
                      <span className="text-[#BFA46C] -translate-x-1 transition-transform ease-hover group-hover:translate-x-0.5 group-focus:translate-x-0.5 group-active:translate-x-0.5">
                        <svg focusable="false" fill="currentColor" width="32" height="32" aria-hidden="true" viewBox="0 0 24 24">
                          <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"></path>
                        </svg>
                      </span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : query ? (
            <div className="text-center">
              <h2 className="text-xl mb-4">
                {isZh ? (
                  <>未找到与 <span className="text-gray-400">"{query}"</span> 相关的内容</>
                ) : (
                  <>We could not find anything for <span className="text-gray-400">"{query}"</span></>
                )}
              </h2>
              <p className="text-gray-600">
                {isZh 
                  ? "请检查拼写或尝试使用不同的关键词" 
                  : "Please check your spelling or try again with a less specific keyword"}
              </p>
            </div>
          ) : null}
        </div>
      </section>

      {/* 分页 */}
      <nav className="bg-gray-100 py-12 mt-auto">
        <div className="container mx-auto px-4 max-w-[1200px]">
          <ul className="flex justify-center gap-4">
            {/* 分页内容 */}
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">正在加载搜索结果...</div>}>
      <SearchContent />
    </Suspense>
  );
} 