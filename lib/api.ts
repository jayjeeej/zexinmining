import { ProductData, ProductResponse, Product, ProductSpecification } from './productDataSchema';

// 内存缓存
const dataCache = new Map<string, { data: any; timestamp: number }>();
const metadataCache = new Map<string, { data: any; timestamp: number }>();
const DEFAULT_CACHE_DURATION = 30 * 60 * 1000; // 增加到30分钟缓存
const METADATA_CACHE_DURATION = 60 * 60 * 1000; // 元数据缓存1小时
const LOCALSTORAGE_CACHE_DURATION = 24 * 60 * 60 * 1000; // localStorage缓存1天

// 全局预加载队列
let preloadQueue: Array<{locale: string, productId: string}> = [];
let isPreloading = false;

// 产品缓存对象
const productCache: {
  [locale: string]: {
    [productId: string]: {
      product: Product;
      timestamp: number;
    }
  }
} = {};

// 缓存持续时间
const CACHE_DURATION = 30 * 60 * 1000; // 30分钟

/**
 * 从localStorage获取缓存数据
 */
function getLocalStorageCache(key: string): any {
  if (typeof window === 'undefined') return null;
  
  try {
    const cacheJson = localStorage.getItem(`product_cache_${key}`);
    if (!cacheJson) return null;
    
    const cache = JSON.parse(cacheJson);
    const now = Date.now();
    
    // 检查缓存是否过期
    if (now - cache.timestamp > LOCALSTORAGE_CACHE_DURATION) {
      localStorage.removeItem(`product_cache_${key}`);
      return null;
    }
    
    return cache.data;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
}

/**
 * 设置localStorage缓存
 */
function setLocalStorageCache(key: string, data: any): void {
  if (typeof window === 'undefined') return;
  
  try {
    // 检查可用空间
    const isStorageFull = checkStorageQuota();
    if (isStorageFull) {
      cleanupOldCache();
    }
    
    const cache = {
      data,
      timestamp: Date.now()
    };
    
    localStorage.setItem(`product_cache_${key}`, JSON.stringify(cache));
  } catch (error) {
    console.error('Error writing to localStorage:', error);
  }
}

/**
 * 检查localStorage存储配额
 */
function checkStorageQuota(): boolean {
  try {
    // 假设localStorage限制大约是5MB
    const testKey = '_quota_test_';
    const testStr = '0'.repeat(1024 * 100); // 测试100KB
    
    localStorage.setItem(testKey, testStr);
    localStorage.removeItem(testKey);
    return false; // 存储未满
  } catch (e) {
    return true; // 存储已满
  }
}

/**
 * 清理旧缓存数据
 */
function cleanupOldCache(): void {
  if (typeof window === 'undefined') return;
  
  const cacheKeys = [];
  
  // 收集所有产品缓存键和时间戳
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('product_cache_')) {
      try {
        const data = JSON.parse(localStorage.getItem(key) || '{}');
        cacheKeys.push({
          key,
          timestamp: data.timestamp || 0
        });
      } catch (e) {
        // 如果JSON解析失败，直接删除
        localStorage.removeItem(key);
      }
    }
  }
  
  // 按时间戳排序，删除最旧的25%缓存
  if (cacheKeys.length > 0) {
    cacheKeys.sort((a, b) => a.timestamp - b.timestamp);
    
    const deleteCount = Math.max(1, Math.floor(cacheKeys.length * 0.25));
    for (let i = 0; i < deleteCount; i++) {
      localStorage.removeItem(cacheKeys[i].key);
    }
  }
}

/**
 * 加载产品基本元数据
 * 仅加载产品的基本信息，不包含详细规格和说明
 * @param productId 产品ID
 * @param locale 语言
 */
export async function getProductMetadata(
  productId: string,
  locale: string
): Promise<any> {
  const cacheKey = `metadata:${locale}:${productId}`;
  
  // 检查内存缓存
  const cached = metadataCache.get(cacheKey);
  const now = Date.now();
  
  if (cached && (now - cached.timestamp < METADATA_CACHE_DURATION)) {
    return cached.data;
  }
  
  // 检查localStorage缓存
  const localData = getLocalStorageCache(cacheKey);
  if (localData) {
    // 更新内存缓存
    metadataCache.set(cacheKey, {
      data: localData,
      timestamp: now
    });
    return localData;
  }
  
  try {
    // 从完整数据中提取元数据
    const { product, isSuccess } = await getProductData(productId, locale);
    
    if (!isSuccess || !product) {
      return null;
    }
    
    // 只保留基本元数据
    const metadata = {
      id: product.id,
      title: product.title,
      series: product.series,
      imageSrc: product.imageSrc,
      productCategory: product.productCategory,
      subcategory: product.subcategory,
      model: product.model,
      meta: product.meta,
      href: product.href,
      overview: product.overview
    };
    
    // 添加到内存缓存
    metadataCache.set(cacheKey, {
      data: metadata,
      timestamp: now
    });
    
    // 添加到localStorage缓存
    setLocalStorageCache(cacheKey, metadata);
    
    return metadata;
  } catch (error) {
    console.error('Error loading product metadata:', error);
    return null;
  }
}

/**
 * 加载产品数据
 * @param productId 产品ID
 * @param locale 语言
 * @param options 加载选项
 */
export async function getProductData(
  productId: string, 
  locale: string,
  options: {
    skipCache?: boolean;
    cacheDuration?: number;
  } = {}
): Promise<ProductResponse> {
  const { skipCache = false, cacheDuration = DEFAULT_CACHE_DURATION } = options;
  const cacheKey = `product:${locale}:${productId}`;
  
  // 检查内存缓存
  if (!skipCache) {
    const cached = dataCache.get(cacheKey);
    const now = Date.now();
    
    if (cached && (now - cached.timestamp < cacheDuration)) {
      return cached.data;
    }
    
    // 检查localStorage缓存
    const localData = getLocalStorageCache(cacheKey);
    if (localData) {
      // 将数据也更新到内存缓存
      const result = {
        product: localData,
        isSuccess: true
      };
      
      dataCache.set(cacheKey, {
        data: result,
        timestamp: now
      });
      
      return result;
    }
  }
  
  try {
    // 首先检查客户端是否有预加载数据
    if (typeof window !== 'undefined') {
      const preloadedData = getPreloadedProductData(productId, locale);
      if (preloadedData) {
        const result = {
          product: preloadedData,
          isSuccess: true
        };
        
        // 添加到内存缓存
        dataCache.set(cacheKey, {
          data: result,
          timestamp: Date.now()
        });
        
        // 添加到localStorage缓存
        setLocalStorageCache(cacheKey, preloadedData);
        
        return result;
      }
    }
    
    // 否则从JSON文件加载数据 - 使用绝对URL
    const baseUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : process.env.NEXT_PUBLIC_SITE_URL || 'https://www.zexinmining.com';
    
    // 完整产品类别映射表
    const productCategoryMap: Record<string, string[]> = {
      'gravity-separation': [
        'centrifugal-separator', 'spiral-chute', 'sawtooth-wave-jig', 
        'synchronous-counter-directional-jig', 'synchronous-counter-directional-jig-small', 'shaking-table'
      ],
      'classification-equipment': [
        'hydrocyclone-separator', 'cone-classifier', 'high-weir-spiral-classifier', 'submerged-spiral-classifier'
      ],
      'magnetic-separator': [
        'plate-high-intensity-magnetic-separator', 'wet-high-intensity-magnetic-roll-separator',
        'double-roll-permanent-magnetic-zircon-separator', 'four-roll-high-voltage-electrostatic-separator',
        'triple-disc-belt-magnetic-separator', 'permanent-drum-magnetic-separator'
      ],
      'vibrating-screens': [
        'trommel-screen', 'inclined-vibrating-screen', 'banana-multislope-vibrating-screen',
        'bar-vibrating-screen', 'dewatering-screen', 'linear-vibrating-screen'
      ],
      'stationary-crushers': [
        'jaw-crusher', 'cone-crusher', 'impact-crusher', 'hammer-crusher', 'hp-cone-crusher', 'double-roller-crusher'
      ],
      'grinding-equipment': [
        'dry-ball-mill', 'wet-grid-ball-mill', 'dry-rod-mill', 
        'wet-energy-saving-grid-ball-mill', 'wet-rod-mill', 'wet-overflow-ball-mill'
      ],
      'flotation-equipment': [
        'pneumatic-flotation-cell', 'coarse-flotation-cell', 'xfc-air-inflation-flotation-cell',
        'self-aspirated-flotation-cell'
      ],
      'feeding-equipment': [
        'vibratory-feeder', 'grizzly-feeder', 'apron-feeder'
      ],
      'washing-equipment': [
        'twin-shaft-log-washer', 'wheel-bucket-sand-washer', 'spiral-washer'
      ]
    };
    
    // 通过映射表查找产品类别
    let subcategory = '';
    for (const [category, productIds] of Object.entries(productCategoryMap)) {
      if (productIds.includes(productId) || productIds.some(id => productId.includes(id))) {
        subcategory = category;
        break;
      }
    }
    
    // 如果映射表未找到，使用一般规则推断
    if (!subcategory) {
      if (productId.includes('feeder')) {
        subcategory = 'feeding-equipment';
      } else if (productId.includes('mill') || productId.includes('grinding')) {
        subcategory = 'grinding-equipment';
      } else if (productId.includes('screen')) {
        subcategory = 'vibrating-screens';
      } else if (productId.includes('crusher')) {
        subcategory = 'stationary-crushers';
      } else if (productId.includes('classifier') || productId.includes('cyclone')) {
        subcategory = 'classification-equipment';
      } else if (productId.includes('magnetic') || productId.includes('separator') || productId.includes('electrostatic')) {
        subcategory = 'magnetic-separator';
      } else if (productId.includes('flotation')) {
        subcategory = 'flotation-equipment';
      } else if (productId.includes('jig') || productId.includes('table') || productId.includes('chute') || productId.includes('centrifugal')) {
        subcategory = 'gravity-separation';
      } else if (productId.includes('washer') || productId.includes('washing')) {
        subcategory = 'washing-equipment';
      }
    }
    
    // 声明响应变量
    let response;
    let productUrl = '';
    
    // 构建所有可能的子类别列表，确保先尝试确定的子类别
    const allCategories = [
      'gravity-separation',
      'magnetic-separator',
      'grinding-equipment',
      'vibrating-screens',
      'stationary-crushers',
      'flotation-equipment',
      'feeding-equipment',
      'washing-equipment',
      'classification-equipment'
    ];
    
    // 将确定的子类别排在最前面
    const possibleCategories = subcategory 
      ? [subcategory, ...allCategories.filter(c => c !== subcategory)]
      : allCategories;
    
    // 在服务器端：尝试直接从文件系统读取数据
    if (typeof window === 'undefined') {
      try {
        // 在服务器端使用fs模块
        const fs = require('fs').promises;
        const path = require('path');
        
        // 依次尝试所有可能的类别
        for (const category of possibleCategories) {
          try {
            const filePath = path.join(process.cwd(), 'public', 'data', locale, category, `${productId}.json`);
            console.log(`[API] 尝试从文件系统加载: ${filePath}`);
            
            const fileContent = await fs.readFile(filePath, 'utf8');
            const productData = JSON.parse(fileContent);
            
            // 添加到内存缓存
            const result = {
              product: productData,
              isSuccess: true
            };
            
            dataCache.set(cacheKey, {
              data: result,
              timestamp: Date.now()
            });
            
            return result;
          } catch (fsError) {
            // 继续尝试下一个类别
            continue;
          }
        }
        
        // 最后尝试从根目录加载
        try {
          const filePath = path.join(process.cwd(), 'public', 'data', locale, `${productId}.json`);
          console.log(`[API] 尝试从根目录加载: ${filePath}`);
          
          const fileContent = await fs.readFile(filePath, 'utf8');
          const productData = JSON.parse(fileContent);
          
          // 添加到内存缓存
          const result = {
            product: productData,
            isSuccess: true
          };
          
          dataCache.set(cacheKey, {
            data: result,
            timestamp: Date.now()
          });
          
          return result;
        } catch (rootFsError) {
          console.error(`[API] 错误: 无法从根目录加载产品数据: ${productId}, 回退到HTTP请求`);
          // 继续尝试HTTP请求
        }
      } catch (nodeError) {
        console.error(`[API] 错误: 服务器端文件读取失败: ${nodeError instanceof Error ? nodeError.message : String(nodeError)}, 回退到HTTP请求`);
        // 继续尝试HTTP请求
      }
    }
    
    // 依次尝试所有可能的类别
    for (const category of possibleCategories) {
      productUrl = `${baseUrl}/data/${locale}/${category}/${productId}.json`;
      console.log(`[API] 尝试加载产品数据: ${productUrl}`);
      
      try {
        response = await fetch(productUrl, {
          headers: {
            'Cache-Control': 'max-age=3600',
            'Pragma': 'cache'
          },
          next: { revalidate: 3600 }
        });
        
        // 如果找到了数据，停止循环
        if (response.ok) {
          break;
        }
      } catch (fetchError) {
        // 继续尝试下一个类别
        continue;
      }
    }
    
    // 如果所有类别都尝试失败，最后尝试根目录
    if (!response || !response.ok) {
      productUrl = `${baseUrl}/data/${locale}/${productId}.json`;
      console.log(`[API] 尝试从根目录加载数据: ${productUrl}`);
      
      try {
        response = await fetch(productUrl, {
          headers: {
            'Cache-Control': 'max-age=3600',
            'Pragma': 'cache'
          },
          next: { revalidate: 3600 }
        });
      } catch (fetchError: any) {
        console.error(`[API] 网络请求失败 (${productUrl}): ${fetchError.message}`);
        
        return {
          product: null as unknown as ProductData,
          isSuccess: false,
          message: `Network request failed: ${fetchError.message}`
        };
      }
    }
    
    // 处理响应
    if (response && response.ok) {
      try {
        // 检查响应类型，确保是JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          console.error(`[API] 无效内容类型: ${contentType}`);
          return {
            product: null as unknown as ProductData,
            isSuccess: false,
            message: `Invalid content type: ${contentType}, expected application/json`
          };
        }
        
        const productData: ProductData = await response.json();
        
        // 添加到内存缓存
        const result = {
          product: productData,
          isSuccess: true
        };
        
        dataCache.set(cacheKey, {
          data: result,
          timestamp: Date.now()
        });
        
        // 添加到localStorage缓存
        setLocalStorageCache(cacheKey, productData);
        
        return result;
      } catch (jsonError: any) {
        console.error(`[API] JSON解析失败: ${jsonError.message}`);
        return {
          product: null as unknown as ProductData,
          isSuccess: false,
          message: `JSON parsing failed: ${jsonError.message}`
        };
      }
    } else {
      console.error(`[API] 产品数据API请求失败: ${response ? `${response.status} ${response.statusText}` : 'No response'}`);
      return {
        product: null as unknown as ProductData,
        isSuccess: false,
        message: response ? `Failed to load product data: ${response.statusText} (${response.status})` : 'Failed to load product data: No response'
      };
    }
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[API] 加载产品数据时发生错误: ${errorMessage}`, error);
    
    return {
      product: null as unknown as ProductData,
      isSuccess: false,
      message: `Error loading product data: ${errorMessage}`
    };
  }
}

/**
 * 从预加载的脚本标签获取产品数据
 */
export function getPreloadedProductData(productId: string, locale: string): ProductData | null {
  if (typeof window === 'undefined') return null; // 服务器端不执行
  
  const script = document.getElementById(`preloaded_${productId}`);
  if (!script || script.getAttribute('data-locale') !== locale) return null;
  
  try {
    return JSON.parse(script.textContent || '');
  } catch (error) {
    console.error('Error parsing preloaded product data:', error);
    return null;
  }
}

/**
 * 预加载产品数据
 * 类似于山特维克网站的预加载策略
 */
export function preloadProductData(productId: string, locale: string): void {
  if (typeof document === 'undefined') return; // 服务器端不执行
  
  // 创建一个隐藏的JSON脚本标签
  const existingScript = document.getElementById(`preloaded_${productId}`);
  if (existingScript) return; // 已经预加载过
  
  const baseUrl = window.location.origin;
  const script = document.createElement('script');
  script.id = `preloaded_${productId}`;
  script.type = 'application/json';
  script.setAttribute('data-product-id', productId);
  script.setAttribute('data-locale', locale);
  
  // 添加到缓存key以便后续查找
  script.setAttribute('data-cache-key', `product:${locale}:${productId}`);
  
  // 尝试确定产品的子类别
  let subcategory = '';
  
  // 根据产品ID判断可能的子类别
  if (productId.includes('feeder')) {
    subcategory = 'feeding-equipment';
  } else if (productId.includes('mill') || productId.includes('grinding')) {
    subcategory = 'grinding-equipment';
  } else if (productId.includes('screen')) {
    subcategory = 'vibrating-screens';
  } else if (productId.includes('crusher')) {
    subcategory = 'stationary-crushers';
  } else if (productId === 'hydrocyclone-separator' || productId === 'cone-classifier' || productId.includes('classifier')) {
    subcategory = 'classification-equipment';
  } else if (productId === 'centrifugal-separator') {
    subcategory = 'gravity-separation';
  } else if (
    productId.includes('magnetic') || 
    (productId.includes('electrostatic') && productId.includes('separator')) ||
    (productId.includes('separator') && 
     (productId.includes('drum') || 
      productId.includes('roll') || 
      productId.includes('disc') || 
      productId.includes('belt') || 
      productId.includes('zircon')))
  ) {
    subcategory = 'magnetic-separator';
  } else if (productId.includes('flotation')) {
    subcategory = 'flotation-equipment';
  } else if (productId.includes('jig') || productId.includes('table') || productId.includes('chute') || productId.includes('centrifugal')) {
    subcategory = 'gravity-separation';
  } else if (productId.includes('washer') || productId.includes('washing')) {
    subcategory = 'washing-equipment';
  }
  
  // 首先尝试子目录
  let url = subcategory ? `${baseUrl}/data/${locale}/${subcategory}/${productId}.json` : `${baseUrl}/data/${locale}/${productId}.json`;
  
  // 加载JSON数据
  fetch(url)
    .then(response => {
      if (!response.ok) {
        // 如果子目录请求失败，尝试根目录
        if (subcategory) {
          console.log(`[Preload] Product not found in subcategory, trying root directory: ${productId}`);
          return fetch(`${baseUrl}/data/${locale}/${productId}.json`);
        }
        throw new Error(`Failed to preload product data: ${response.statusText}`);
      }
      return response;
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to preload product data: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      script.textContent = JSON.stringify(data);
      document.head.appendChild(script);
      
      // 同时更新内存缓存
      dataCache.set(`product:${locale}:${productId}`, {
        data: {
          product: data,
          isSuccess: true
        },
        timestamp: Date.now()
      });
    })
    .catch(error => {
      console.error(`Failed to preload product data for ${productId}:`, error);
    });
}

/**
 * 预加载相关产品的元数据
 * 只预加载轻量级的产品元数据
 */
export function preloadRelatedProductsMetadata(productIds: string[], locale: string): void {
  if (typeof document === 'undefined') return; // 服务器端不执行
  
  // 限制最多预加载3个相关产品
  const limitedIds = productIds.slice(0, 3);
  
  limitedIds.forEach(id => {
    // 仅在数据不存在缓存中时预加载
    if (!metadataCache.has(`metadata:${locale}:${id}`)) {
      getProductMetadata(id, locale).catch(err => 
        console.error(`Failed to preload metadata for ${id}:`, err)
      );
    }
  });
}

/**
 * 清除特定产品的缓存
 */
export function clearProductCache(productId: string, locale: string): void {
  const cacheKey = `product:${locale}:${productId}`;
  dataCache.delete(cacheKey);
  
  const metadataKey = `metadata:${locale}:${productId}`;
  metadataCache.delete(metadataKey);
  
  // 同时移除预加载脚本标签(如果存在)
  if (typeof document !== 'undefined') {
    const script = document.getElementById(`preloaded_${productId}`);
    if (script) script.remove();
  }
  
  // 清除产品缓存对象中的数据
  if (productCache[locale]?.[productId]) {
    delete productCache[locale][productId];
  }
}

/**
 * 清除特定语言的所有产品缓存
 */
export function clearLocaleProductCache(locale: string): void {
  // 清除产品数据缓存
  Array.from(dataCache.keys()).forEach(key => {
    if (key.startsWith(`product:${locale}:`)) {
      dataCache.delete(key);
    }
  });
  
  // 清除元数据缓存
  Array.from(metadataCache.keys()).forEach(key => {
    if (key.startsWith(`metadata:${locale}:`)) {
      metadataCache.delete(key);
    }
  });
  
  // 清除预加载脚本标签
  if (typeof document !== 'undefined') {
    document.querySelectorAll(`script[data-locale="${locale}"]`).forEach(script => {
      script.remove();
    });
  }
  
  // 清除产品缓存对象
  if (productCache[locale]) {
    delete productCache[locale];
  }
}

/**
 * 清除所有产品缓存
 */
export function clearAllProductCache(): void {
  dataCache.clear();
  metadataCache.clear();
  
  // 清除所有预加载脚本标签
  if (typeof document !== 'undefined') {
    document.querySelectorAll('script[data-product-id]').forEach(script => {
      script.remove();
    });
  }
  
  // 清除产品缓存对象
  Object.keys(productCache).forEach(key => {
    delete productCache[key];
  });
}

/**
 * 获取缓存使用统计
 * 用于调试和性能监控
 */
export function getCacheStats(): { 
  productCacheSize: number; 
  metadataCacheSize: number;
  productCacheKeys: string[];
  metadataCacheKeys: string[];
} {
  return {
    productCacheSize: dataCache.size,
    metadataCacheSize: metadataCache.size,
    productCacheKeys: Array.from(dataCache.keys()),
    metadataCacheKeys: Array.from(metadataCache.keys())
  };
}

/**
 * 获取产品规格数据
 * @param product 产品数据
 * @returns 结构化的产品规格
 */
export function getProductSpecifications(product: Product): ProductSpecification[] {
  if (!product || !product.specifications) {
    return [];
  }
  
  // 如果规格已经是数组格式，直接返回
  if (Array.isArray(product.specifications)) {
    return product.specifications;
  }
  
  // 如果规格是对象格式，转换为数组
  try {
    const specArray: ProductSpecification[] = [];
    
    for (const [key, value] of Object.entries(product.specifications)) {
      specArray.push({
        name: key,
        value: value as string,
        unit: undefined // 修复类型错误，使用undefined替代null
      });
    }
    
    return specArray;
  } catch (error) {
    console.error('Error parsing product specifications:', error);
    return [];
  }
}

/**
 * 格式化产品功能/特点
 * @param product 产品数据
 * @returns 功能/特点数组
 */
export function getProductFeatures(product: Product): { title: string; description: string; }[] {
  if (!product || !product.features) {
    return [];
  }
  
  // 处理对象数组格式
  if (Array.isArray(product.features) && 
      product.features.length > 0 && 
      typeof product.features[0] === 'object') {
    // 类型断言确保返回正确类型
    return product.features as { title: string; description: string; }[];
  }
  
  // 处理字符串数组格式
  if (Array.isArray(product.features) && 
      product.features.length > 0 && 
      typeof product.features[0] === 'string') {
    // 转换字符串数组为所需的格式
    return (product.features as string[]).map(feature => ({
      title: 'Feature',
      description: feature
    }));
  }
  
  // 处理对象格式
  try {
    const featuresArray: { title: string; description: string; }[] = [];
    
    // 安全地转换对象
    const featuresObj = product.features as unknown as Record<string, string>;
    
    for (const [title, description] of Object.entries(featuresObj)) {
      featuresArray.push({
        title,
        description
      });
    }
    
    return featuresArray;
  } catch (error) {
    console.error('Error parsing product features:', error);
    return [];
  }
}

/**
 * 处理预加载队列
 */
async function processPreloadQueue(): Promise<void> {
  if (preloadQueue.length === 0 || isPreloading) {
    return;
  }
  
  isPreloading = true;
  
  while (preloadQueue.length > 0) {
    const {locale, productId} = preloadQueue.shift()!;
    console.log(`[Preload] Preloading ${productId} (${locale})`);
    
    try {
      await getProductData(productId, locale);
      // 每个请求间隔100ms，避免同时发送过多请求
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`[Preload] Error preloading ${productId}:`, error);
    }
  }
  
  isPreloading = false;
} 