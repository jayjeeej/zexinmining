/**
 * 安全地获取路由参数，确保在开发和生产环境中都能正常工作
 * 对于静态路由，可能不需要等待params解析
 */
export async function safelyGetRouteParams<T extends Record<string, any>>(params: T): Promise<T> {
  // 添加详细日志以调试问题
  console.log('[DEBUG] safelyGetRouteParams input:', JSON.stringify(params));
  
  try {
    // 如果params为null或undefined，返回空对象
    if (!params) {
      console.error('[ERROR] Route params is null or undefined');
      return {} as T;
    }
    
    // 如果params已经是解析好的对象（不是Promise），直接返回
    if (params && typeof params === 'object' && !('then' in params)) {
      return params;
    }
    
    // 否则尝试等待Promise解析
    const resolvedParams = await Promise.resolve(params);
    return resolvedParams;
  } catch (error) {
    console.error('[ERROR] Failed to resolve route params:', error);
    // 发生错误时返回原始params，确保某种程度的向后兼容性
    return params;
  }
} 

/**
 * 生成静态产品ID列表，用于Next.js静态生成
 * 这是一个通用函数，可被不同产品类别的页面复用
 * 
 * @param category 产品类别 (如'flotation-equipment', 'vibrating-screens')
 * @returns 产品ID列表，格式为 [{ locale: string, productId: string }]
 */
export async function generateProductStaticParams(category: string) {
  try {
    const fs = require('fs');
    const path = require('path');
    const { promises: fsPromises } = fs;
    
    // 从文件系统读取所有产品数据文件
    const dataDir = path.join(process.cwd(), 'public', 'data', 'en', category);
    
    // 检查目录是否存在
    try {
      await fsPromises.access(dataDir);
    } catch (error) {
      console.warn(`${category}目录不存在，使用默认值`);
      return getDefaultParams(category);
    }
    
    const files = await fsPromises.readdir(dataDir);
    const productJsonFiles = files.filter((file: string) => file.endsWith('.json'));
    
    // 提取所有产品ID
    const productIds = productJsonFiles.map((file: string) => file.replace('.json', ''));
    
    const locales = ['en', 'zh'];
    
    // 为每个语言和产品ID生成参数
    return productIds.flatMap((productId: string) => 
      locales.map(locale => ({
        productId,
        locale
      }))
    );
  } catch (error) {
    console.error(`生成${category}静态参数失败:`, error);
    return getDefaultParams(category);
  }
}

/**
 * 根据产品类别获取默认的产品ID参数
 * 用于在目录不存在或发生错误时提供后备方案
 * 
 * @param category 产品类别
 * @returns 默认参数列表
 */
function getDefaultParams(category: string) {
  const defaultIds: {[key: string]: string} = {
    'flotation-equipment': 'pneumatic-flotation-cell',
    'gravity-separation': 'shaking-table',
    'vibrating-screens': 'inclined-vibrating-screen',
    'stationary-crushers': 'jaw-crusher',
    'magnetic-separator': 'magnetic-separator',
    'feeding-equipment': 'apron-feeder',
    'washing-equipment': 'log-washer',
    'classification-equipment': 'hydrocyclone'
  };
  
  const defaultId = defaultIds[category] || 'default-product';
  
  return [
    { locale: 'en', productId: defaultId },
    { locale: 'zh', productId: defaultId }
  ];
} 