/**
 * 产品数据加载器
 * 用于优化产品数据的加载和缓存
 */
(function() {
  // 内存缓存
  const dataCache = {};
  const metadataCache = {};
  const CACHE_DURATION = 30 * 60 * 1000; // 30分钟

  // 当前语言
  const locale = document.documentElement.lang || 'en';
  
  // 预加载队列
  let preloadQueue = [];
  let isProcessingQueue = false;
  
  /**
   * 从预加载脚本中获取产品数据
   * @param {string} productId 产品ID
   * @returns {Object|null} 产品数据或null
   */
  function getPreloadedData(productId) {
    const script = document.getElementById(`preloaded_${productId}`);
    if (!script) return null;
    
    try {
      return JSON.parse(script.textContent || '');
    } catch (error) {
      console.error(`Error parsing preloaded data for ${productId}:`, error);
      return null;
    }
  }
  
  /**
   * 获取产品数据
   * @param {string} productId 产品ID
   * @returns {Promise<Object>} 产品数据
   */
  async function getProductData(productId) {
    try {
      // 尝试解析预加载的数据
      const preloadedData = getPreloadedData(productId);
      
      if (preloadedData) {
        return preloadedData;
      }
      
      // 检查内存缓存
    if (dataCache[productId] && (Date.now() - dataCache[productId].timestamp < CACHE_DURATION)) {
      return dataCache[productId].data;
    }
    
      // 根据产品ID判断可能的子类别
      let subcategory = '';
      
      if (productId.includes('feeder')) {
        subcategory = 'feeding-equipment';
      } else if (productId.includes('mill') || productId.includes('grinding')) {
        subcategory = 'grinding-equipment';
      } else if (productId.includes('screen')) {
        subcategory = 'vibrating-screens';
      } else if (productId.includes('crusher')) {
        subcategory = 'stationary-crushers';
      } else if (productId === 'hydrocyclone-separator') {
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
      } else if (productId.includes('classifier')) {
        subcategory = 'classification-equipment';
      }
      
      // 优先尝试从子目录加载
      let url = subcategory ? `/data/${locale}/${subcategory}/${productId}.json` : `/data/${locale}/${productId}.json`;
      let response = await fetch(url);
      
      // 如果子目录未找到，尝试从根目录加载
      if (!response.ok && subcategory) {
        url = `/data/${locale}/${productId}.json`;
        response = await fetch(url);
      }
      
      if (!response.ok) {
        throw new Error(`Failed to load product data: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // 保存到缓存
      dataCache[productId] = {
        data,
        timestamp: Date.now()
      };
      
      return data;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * 获取产品元数据（轻量版产品数据）
   * @param {string} productId 产品ID
   * @returns {Promise<Object>} 产品元数据
   */
  async function getProductMetadata(productId) {
    // 检查缓存
    if (metadataCache[productId] && (Date.now() - metadataCache[productId].timestamp < CACHE_DURATION)) {
      return metadataCache[productId].data;
    }
    
    try {
      // 尝试从完整数据中提取
      const fullData = await getProductData(productId);
      
      // 只提取需要的字段作为元数据
      const metadata = {
        id: fullData.id,
        title: fullData.title,
        series: fullData.series,
        model: fullData.model,
        imageSrc: fullData.imageSrc,
        productCategory: fullData.productCategory,
        subcategory: fullData.subcategory,
        meta: fullData.meta,
        href: fullData.href,
        overview: fullData.overview
      };
      
      // 缓存元数据
      metadataCache[productId] = {
        data: metadata,
        timestamp: Date.now()
      };
      
      return metadata;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * 预加载产品数据
   * @param {string} productId 产品ID
   */
  function preloadProductData(productId) {
    // 如果已经在缓存中或者已经有预加载脚本，则不重复加载
    if (dataCache[productId] || document.getElementById(`preloaded_${productId}`)) {
      return;
    }
    
    // 创建预加载脚本
    const script = document.createElement('script');
    script.id = `preloaded_${productId}`;
    script.type = 'application/json';
    script.setAttribute('data-product-id', productId);
    
    // 根据产品ID判断可能的子类别
    let subcategory = '';
    
    if (productId.includes('feeder')) {
      subcategory = 'feeding-equipment';
    } else if (productId.includes('mill') || productId.includes('grinding')) {
      subcategory = 'grinding-equipment';
    } else if (productId.includes('screen')) {
      subcategory = 'vibrating-screens';
    } else if (productId.includes('crusher')) {
      subcategory = 'stationary-crushers';
    } else if (productId === 'hydrocyclone-separator') {
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
    } else if (productId.includes('classifier')) {
      subcategory = 'classification-equipment';
    }
    
    // 优先尝试从子目录加载
    let url = subcategory ? `/data/${locale}/${subcategory}/${productId}.json` : `/data/${locale}/${productId}.json`;
    
    // 加载数据
    fetch(url)
      .then(response => {
        if (!response.ok && subcategory) {
          // 如果子目录请求失败，尝试根目录
          return fetch(`/data/${locale}/${productId}.json`);
        }
        return response;
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to preload product data for ${productId}: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        script.textContent = JSON.stringify(data);
        document.head.appendChild(script);
        
        // 添加到缓存
        dataCache[productId] = {
          data,
          timestamp: Date.now()
        };
      })
      .catch(error => {
        // 错误处理
      });
  }
  
  /**
   * 预加载相关产品元数据
   * @param {Array<string>} productIds 产品ID数组
   */
  function preloadRelatedProductsMetadata(productIds) {
    if (!Array.isArray(productIds) || productIds.length === 0) {
      return;
    }
    
    // 限制最多预加载3个相关产品
    const limitedIds = productIds.slice(0, 3);
    
    // 将产品添加到预加载队列
    limitedIds.forEach(id => {
      if (!dataCache[id] && !metadataCache[id] && !preloadQueue.includes(id)) {
        preloadQueue.push(id);
      }
    });
    
    // 启动队列处理
    if (!isProcessingQueue) {
      processPreloadQueue();
    }
  }
  
  /**
   * 处理预加载队列
   */
  function processPreloadQueue() {
    if (preloadQueue.length === 0 || isProcessingQueue) {
      isProcessingQueue = false;
      return;
    }
    
    isProcessingQueue = true;
    
    // 从队列中取出一个产品
    const productId = preloadQueue.shift();
    
    // 加载产品元数据
    getProductMetadata(productId)
      .catch(() => {})
      .finally(() => {
        // 每隔100ms处理下一个产品，避免同时发送太多请求
        setTimeout(() => {
          processPreloadQueue();
        }, 100);
      });
  }
  
  /**
   * 清除所有缓存
   */
  function clearCache() {
    Object.keys(dataCache).forEach(key => {
      delete dataCache[key];
    });
    
    Object.keys(metadataCache).forEach(key => {
      delete metadataCache[key];
    });
    
    // 移除所有预加载脚本
    document.querySelectorAll('script[data-product-id]').forEach(script => {
      script.remove();
    });
  }
  
  // 公开API
  window.ProductDataLoader = {
    getProductData,
    getProductMetadata,
    preloadProductData,
    preloadRelatedProductsMetadata,
    clearCache
  };
})(); 