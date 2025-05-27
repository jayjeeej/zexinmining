import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';

// 定义接口
interface SearchResult {
  id: string;
  url: string;
  title: string;
  excerpt: string;
  category?: string;
  score: number;
  imageSrc: string;
  resultType: string;
  slug?: string; // 添加 slug 属性，用于新闻项
}

// 搜索API必须是动态路由，因为它使用request.url来获取搜索参数
export const dynamic = 'force-dynamic';
// 不使用Next.js的revalidate，而是通过Cache-Control头控制缓存
export const revalidate = false;

// 中英文术语对照表，用于跨语言搜索
const termMappings: Record<string, string[]> = {
  // 中文 -> 英文
  "颚式破碎机": ["jaw crusher", "jaw breaker"],
  "圆锥破碎机": ["cone crusher"],
  "振动筛": ["vibrating screen", "screen"],
  "圆振动筛": ["inclined vibrating screen", "circular vibrating screen"],
  "浮选机": ["flotation cell", "flotation machine"],
  "自吸式浮选机": ["self-aspirated flotation cell", "self suction flotation machine"],
  "球磨机": ["ball mill"],
  "给料机": ["feeder"],
  
  // 英文 -> 中文
  "jaw crusher": ["颚式破碎机"],
  "cone crusher": ["圆锥破碎机"],
  "vibrating screen": ["振动筛"],
  "screen": ["筛", "振动筛", "筛分设备"],
  "flotation cell": ["浮选机", "浮选设备"],
  "self-aspirated flotation cell": ["自吸式浮选机"],
  "ball mill": ["球磨机"],
  "feeder": ["给料机"],
  
  // 矿物相关术语
  "manganese": ["锰", "锰矿"],
  "锰": ["manganese"],
  "铁矿": ["iron ore"],
  "iron ore": ["铁矿"],
  "copper": ["铜", "铜矿"],
  "铜": ["copper"],
  "gold": ["金", "金矿"],
  "金": ["gold"]
};

// 矿物名称列表（用于识别矿物搜索，此时过滤产品）
const mineralKeywords = [
  "manganese", "锰", "iron", "铁", "copper", "铜", "gold", "金", 
  "silver", "银", "zinc", "锌", "lead", "铅", "tin", "锡",
  "nickel", "镍", "chromium", "铬", "tungsten", "钨", "molybdenum", "钼",
  "cobalt", "钴", "titanium", "钛", "vanadium", "钒", "ore", "矿石", 
  "mineral", "矿物", "矿产"
];

// 类别名称映射
const categoryMappings: Record<string, string[]> = {
  "crusher": ["破碎机", "破碎设备"],
  "screen": ["筛", "振动筛", "筛分设备"],
  "flotation": ["浮选", "浮选机", "浮选设备"],
  "mill": ["磨机", "研磨设备"],
  "separator": ["分选机", "选矿设备"],
  "news": ["新闻", "资讯", "动态"],
  "company": ["公司", "企业"],
  "technical": ["技术", "技术知识", "选矿知识"]
};

// 产品别名和关键字映射
const productKeywordMappings: Record<string, string[]> = {
  "jaw-crusher": ["颚破", "鄂破", "一级破碎"],
  "inclined-vibrating-screen": ["圆振筛", "圆震筛", "筛分", "振筛", "vibrating screen", "vibrating", "振动筛"],
  "self-aspirated-flotation-cell": ["自吸浮选", "自吸式浮选", "氧气浮选", "无鼓风浮选"],
  "bar-vibrating-screen": ["条形振动筛", "bar screen", "vibrating", "振动筛"],
  "linear-vibrating-screen": ["直线振动筛", "linear screen", "vibrating", "振动筛"],
  "banana-multislope-vibrating-screen": ["多斜面振动筛", "香蕉筛", "banana screen", "vibrating", "振动筛"],
  "dewatering-screen": ["脱水筛", "dewatering", "振动筛"],
  "trommel-screen": ["滚筒筛", "trommel", "振动筛"]
};

// 识别和记录技术文章的标题特征，用于过滤分类错误的内容
const articleTitleIndicators = [
  "guide", "指南", "analysis", "分析", "issues", "问题", 
  "solutions", "解决方案", "comprehensive", "全面", 
  "critical", "关键", "practical", "实用", "guide to", "指南",
  "how to", "如何", "overview", "概述", "introduction", "介绍",
  "comparison", "比较", "versus", "vs", "classification", "分类",
  "genesis", "起源", "principles", "原理", "applications", "应用"
];

// 识别和记录技术文章的标题特征，用于区分内容类型
const articleTitlePatterns = [
  // 分析类
  "analysis", "分析", "comprehensive", "全面", "detailed", "详细", 
  "in-depth", "深入", "research", "研究", "study", "探讨", "review", "综述",
  // 指南类
  "guide", "指南", "how to", "如何", "tutorial", "教程", "basics", "基础",
  "fundamentals", "基本原理", "introduction", "介绍", "primer", "入门",
  // 比较类
  "comparison", "比较", "versus", "vs", "against", "对比", "difference", "区别", 
  "similarities", "相似处", "better", "更好的", "best", "最佳",
  // 问题解决类
  "issues", "问题", "solutions", "解决方案", "challenges", "挑战",
  "troubleshooting", "故障排除", "fixing", "修复", "resolving", "解决",
  // 知识类
  "principles", "原理", "technology", "技术", "methods", "方法", 
  "techniques", "技巧", "theory", "理论", "concepts", "概念", 
  "understanding", "理解", "know-how", "诀窍",
  // 流程类
  "process", "流程", "workflow", "工作流", "steps", "步骤", 
  "procedure", "程序", "approach", "方法", "methodology", "方法论",
  // 产业类
  "industry", "行业", "market", "市场", "trends", "趋势", 
  "developments", "发展", "future", "未来", "outlook", "展望"
];

// 定义明确的产品标识词
const productIndicators = [
  "machine", "机器", "equipment", "设备", "device", "装置", "system", "系统", 
  "model", "型号", "unit", "单元", "product", "crusher", "破碎机",
  "筛", "screen", "mill", "磨机", "separator", "分选机", "feeder", "给料机",
  "浮选机", "flotation", "机", "plant", "工厂", "line", "生产线"
];

// 重写：获取图片路径，支持不同字段名称
function getItemImagePath(item: any): string {
  // 处理images数组字段 (案例研究常用)
  if (item.images && Array.isArray(item.images) && item.images.length > 0) {
    return item.images[0];
  }
  
  // 处理常见的单图片字段名
  if (item.imageSrc) return item.imageSrc; // 产品常用
  if (item.image) return item.image;       // 新闻常用
  if (item.coverImage) return item.coverImage;
  if (item.thumbnail) return item.thumbnail;
  if (item.featuredImage) return item.featuredImage;
  
  // 尝试其他可能的字段名
  const possibleFields = ['imageUrl', 'cover', 'heroImage', 'bannerImage', 'mainImage'];
  for (const field of possibleFields) {
    if (item[field]) return item[field];
  }
  
  // 无图片路径
  return '';
}

// 重写：根据图片路径确定内容类型
function determineContentTypeByImagePath(imagePath: string): string {
  if (!imagePath) return 'product'; // 默认为产品类型
  
  const path = imagePath.toLowerCase();
  
  // 根据图片路径中的目录名精确判断内容类型
  if (path.includes('/images/news/') || 
      path.includes('/news/') || 
      path.includes('/articles/') || 
      path.includes('/article/') || 
      path.includes('/blog/')) {
    return 'news';
  }
  
  if (path.includes('/images/cases/') || 
      path.includes('/case-studies/') || 
      path.includes('/cases/') || 
      path.includes('/case/')) {
    return 'case';
  }
  
  if (path.includes('/images/products/') || 
      path.includes('/product/') || 
      path.includes('/products/')) {
    return 'product';
  }
  
  // 默认为产品类型
  return 'product';
}

function debugLog(...args: any[]) {
  // 判断是否在开发环境
  const isDev = process.env.NODE_ENV === 'development';
  // 只在开发环境或显式启用调试时输出日志
  if (isDev || process.env.DEBUG === 'true') {
    console.error('[搜索API]', ...args);
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const locale = searchParams.get('locale') || 'zh';
    const subCategory = searchParams.get('sub') || '';
    const isDev = process.env.NODE_ENV === 'development';
    const isDebug = isDev ? 
      (searchParams.get('debug') !== 'false') : 
      (searchParams.get('debug') === 'true');
    const forceRefresh = searchParams.get('refresh') === 'true'; // 通过URL参数强制刷新
    
    // 添加动态路由控制
    // 如果请求包含forceRefresh参数，则使用no-store确保不缓存结果
    const cacheControlValue = forceRefresh 
      ? 'no-store'
      : 'public, max-age=600, s-maxage=1200, stale-while-revalidate=86400';
    
    // 创建正确的headers对象
    const headers: HeadersInit = { 
      'Cache-Control': cacheControlValue,
      'Content-Type': 'application/json'
    };
    
    // 强制刷新模式下输出更多信息
    if (isDebug || forceRefresh) {
      debugLog('收到搜索请求:', { 
        url: request.url,
        query, 
        locale, 
        subCategory,
        refresh: forceRefresh,
        cacheControl: cacheControlValue,
        rawParams: Object.fromEntries(searchParams.entries())
      });
    }
    
    if (!query || query.length < 2) {
      return NextResponse.json([], { status: 200 });
    }
    
    // 尝试使用预缓存数据（对于常见搜索词）
    if (!forceRefresh) {
      try {
        // 规范化查询以匹配缓存文件名
        const normalizedCacheQuery = query.toLowerCase().trim().replace(/\s+/g, '-');
        const cacheFilePath = path.join(process.cwd(), 'public', 'cache', 'search', locale, `${normalizedCacheQuery}.json`);
        
        if (fs.existsSync(cacheFilePath)) {
          if (isDebug) {
            debugLog(`使用预缓存结果: ${cacheFilePath}`);
          }
          
          const cachedResults = JSON.parse(fs.readFileSync(cacheFilePath, 'utf8'));
          return NextResponse.json(cachedResults, {
            status: 200,
            headers
          });
        }
      } catch (error) {
        if (isDebug) {
          debugLog(`读取缓存失败: ${error}`);
        }
        // 缓存读取失败，继续使用动态搜索
      }
    }

    // 振动筛搜索特殊处理
    if (query.toLowerCase().includes('vibrating screen') || query.toLowerCase().includes('振动筛')) {
      // 直接读取振动筛产品
      const vibScreenDir = path.join(process.cwd(), 'public', 'data', locale, 'vibrating-screens');
      const screenResults: SearchResult[] = [];
      
      if (fs.existsSync(vibScreenDir)) {
        try {
          const screenFiles = fs.readdirSync(vibScreenDir).filter(file => file.endsWith('.json'));
          
          for (const file of screenFiles) {
            try {
              const filePath = path.join(vibScreenDir, file);
              const content = fs.readFileSync(filePath, 'utf8');
              const product = JSON.parse(content);
              
              // 添加到结果中
              screenResults.push({
                id: product.id,
                url: product.href || `/${locale}/products/vibrating-screens/${product.id}`,
                title: product.title,
                excerpt: product.overview?.substring(0, 150) + '...',
                category: product.productCategory,
                score: 1000, // 给高优先级
                imageSrc: product.imageSrc || '',
                resultType: 'product'
              });
            } catch (error) {
              if (isDebug) debugLog(`处理振动筛文件${file}时出错: ${error}`);
            }
          }
          
          if (screenResults.length > 0) {
            // 直接返回振动筛产品
            return NextResponse.json(screenResults, {
              status: 200,
              headers: headers
            });
          }
        } catch (error) {
          if (isDebug) debugLog(`读取振动筛目录失败: ${error}`);
        }
      }
    }

    // 搜索关键词处理（规范化）
    const normalizedQuery = query.toLowerCase().trim();
    
    // 将搜索词拆分为多个关键词（按空格、逗号等分隔）
    let keywords = normalizedQuery.split(/[\s,，、]+/).filter(kw => kw.length >= 1);
    
    // 对于组合词特殊处理（比如vibrating screen）- 添加完整搜索词
    if (keywords.length > 1) {
      keywords.push(normalizedQuery);
      if (isDebug) {
        debugLog(`添加完整搜索词到关键词: ${normalizedQuery}`);
      }
    }
    
    if (isDebug) {
      debugLog(`搜索关键词: ${normalizedQuery}, 拆分后: [${keywords.join(', ')}]`);
    }
    
    // 扩展关键词 - 添加中英文映射和别名
    const expandedKeywords = [...keywords];
    
    // 添加原始查询的完整字符串（确保完整短语也能被匹配）
    if (!expandedKeywords.includes(normalizedQuery)) {
      expandedKeywords.push(normalizedQuery);
    }
    
    // 应用中英文术语映射
    keywords.forEach(kw => {
      // 查找匹配的术语
      for (const [term, translations] of Object.entries(termMappings)) {
        // 如果关键词在原文中，或者原文包含关键词
        if (kw === term.toLowerCase() || term.toLowerCase().includes(kw)) {
          // 添加所有翻译
          translations.forEach(trans => {
            if (!expandedKeywords.includes(trans.toLowerCase())) {
              expandedKeywords.push(trans.toLowerCase());
            }
          });
        }
        
        // 检查关键词是否匹配任何翻译
        if (translations.some(trans => trans.toLowerCase() === kw || trans.toLowerCase().includes(kw))) {
          // 添加原始术语
          if (!expandedKeywords.includes(term.toLowerCase())) {
            expandedKeywords.push(term.toLowerCase());
          }
        }
      }
      
      // 检查是否匹配任何分类
      for (const [category, terms] of Object.entries(categoryMappings)) {
        if (kw.includes(category) || category.includes(kw)) {
          terms.forEach(term => {
            if (!expandedKeywords.includes(term.toLowerCase())) {
              expandedKeywords.push(term.toLowerCase());
            }
          });
        }
      }
    });
    
    if (isDebug) {
      debugLog(`扩展后的关键词: [${expandedKeywords.join(', ')}]`);
    }
    
    // 在public/data目录下搜索产品数据
    const dataDir = path.join(process.cwd(), 'public', 'data', locale);
    if (isDebug) {
      debugLog(`数据目录: ${dataDir}`);
    }
    
    let categoryDirs: string[] = [];
    let fileExists = false;
    
    // 检查数据目录是否存在
    try {
      fileExists = fs.existsSync(dataDir);
      if (isDebug) {
        debugLog(`数据目录存在: ${fileExists}`);
      }
      
      if (fileExists) {
        // 获取所有产品目录
        categoryDirs = fs.readdirSync(dataDir, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory())
          .map(dirent => dirent.name);
           
        if (isDebug) {
          debugLog(`找到目录: ${categoryDirs.join(', ')}`);
        }
      } else {
        debugLog(`数据目录不存在: ${dataDir}`);
      }
    } catch (error) {
      debugLog(`读取目录错误: ${error}`);
      categoryDirs = [];
    }
    
    // 如果搜索"vibrating screen"相关，确保搜索振动筛目录
    if (normalizedQuery.includes('vibrating') || normalizedQuery.includes('screen') || 
        normalizedQuery.includes('振动筛')) {
      // 确保vibrating-screens目录被包含
      if (categoryDirs.includes('vibrating-screens')) {
        // 如果指定了子分类但不是振动筛，添加振动筛到搜索范围
        if (subCategory && subCategory !== 'vibrating-screens') {
          if (isDebug) {
            debugLog(`添加振动筛目录到搜索范围`);
          }
        }
      } else if (isDebug) {
        debugLog(`未找到振动筛目录'vibrating-screens'`);
      }
    }
      
    // 如果指定了子分类，只搜索该子分类
    let categoriesToSearch = subCategory 
      ? [...categoryDirs.filter(category => category === subCategory)]
      : [...categoryDirs];
    
    // 确保对于振动筛相关搜索，直接添加振动筛目录
    if ((normalizedQuery.includes('vibrating') || normalizedQuery.includes('screen')) && 
        categoryDirs.includes('vibrating-screens') &&
        !categoriesToSearch.includes('vibrating-screens')) {
      categoriesToSearch.push('vibrating-screens');
    }
    
    // 对于中文搜索
    if ((normalizedQuery.includes('振动') || normalizedQuery.includes('筛')) && 
        categoryDirs.includes('vibrating-screens') &&
        !categoriesToSearch.includes('vibrating-screens')) {
      categoriesToSearch.push('vibrating-screens');
    }
    
    if (isDebug) {
      debugLog(`搜索目录: ${categoriesToSearch.join(', ')}`);
    }
    
    // 搜索所有产品JSON文件
    let results: SearchResult[] = [];
    let processedFiles = 0;
    
    for (const category of categoriesToSearch) {
      const categoryPath = path.join(dataDir, category);
      if (isDebug) {
        debugLog(`处理分类: ${category}, 路径: ${categoryPath}`);
      }
      
      let files: string[] = [];
      
      try {
        files = fs.readdirSync(categoryPath)
          .filter(file => file.endsWith('.json'));
           
        if (isDebug) {
          debugLog(`${category} 分类中找到 ${files.length} 个JSON文件`);
        }
      } catch (error) {
        debugLog(`读取 ${category} 目录失败: ${error}`);
        continue;
      }
        
      for (const file of files) {
        const filePath = path.join(categoryPath, file);
        processedFiles++;
        
        try {
          if (isDebug) {
            debugLog(`处理文件: ${filePath}`);
          }
        const content = fs.readFileSync(filePath, 'utf8');
        const product = JSON.parse(content);
          const productId = product.id;
          
          // 添加产品特定关键词
          let productSpecificKeywords: string[] = [];
          if (productKeywordMappings[productId]) {
            productSpecificKeywords = productKeywordMappings[productId];
            if (isDebug) {
              debugLog(`产品${productId}的特定关键词: ${productSpecificKeywords.join(', ')}`);
            }
          }
        
        // 增强的搜索逻辑：将更多相关字段纳入搜索范围
        const searchableContent = [
          product.title,
          product.series,
          product.overview,
          product.detailedDescription,
          product.seo?.title,
          product.seo?.description,
          product.seo?.keywords,
          // 支持专用搜索关键词字段（如果存在）
          Array.isArray(product.searchKeywords) ? product.searchKeywords.join(' ') : '',
          // 支持对有嵌套的 metadata 进行搜索
          product.meta?.map((item: any) => `${item.key} ${item.displayValue}`).join(' ') || '',
          // 添加产品特定关键词
          productSpecificKeywords.join(' '),
          // 添加产品ID进行搜索（对应路径）
          product.id.replace(/-/g, ' ')
        ].filter(Boolean).join(' ').toLowerCase();

          // 调试输出所有文件的搜索内容
          if ((isDebug || forceRefresh) && 
              (normalizedQuery.includes('vibrating') || normalizedQuery.includes('screen'))) {
            debugLog(`文件 ${filePath} 的产品ID: ${productId}, 搜索内容前100字符: ${searchableContent.substring(0, 100)}...`);
          }
          
          // 如果是振动筛产品，输出更多细节
          if (category === 'vibrating-screens' || productId.includes('vibrating-screen')) {
            debugLog(`振动筛产品: ${product.title}, 内容: ${searchableContent.substring(0, 150)}...`);
          }

          // 匹配分值计算（匹配更多关键词得分越高）
        let matchScore = 0;
          let matchedKeywords = 0;
          const matchDetails: string[] = [];
          
          // 尝试精确匹配完整查询
          if (searchableContent.includes(normalizedQuery)) {
            matchScore += 50;  // 完整查询匹配的权重最高
            matchedKeywords++;
            matchDetails.push(`完整查询"${normalizedQuery}"`);
            
            // 特殊处理振动筛产品
            if ((normalizedQuery.includes('vibrating') || normalizedQuery.includes('screen')) && 
                (category === 'vibrating-screens' || productId.includes('vibrating-screen'))) {
              debugLog(`找到振动筛产品完整匹配: ${product.title}, 搜索词: ${normalizedQuery}`);
            }
          }
          
          // 检查产品ID是否直接匹配查询
          if (productId.includes(normalizedQuery.replace(/\s+/g, '-')) || 
              productId.replace(/-/g, ' ').includes(normalizedQuery)) {
            matchScore += 30;
            matchedKeywords++;
            matchDetails.push(`产品ID"${productId}"`);
          }
          
          // 计算每个扩展关键词的匹配情况
          for (const keyword of expandedKeywords) {
            if (keyword.length < 1) continue;
            
            // 标题匹配权重高
            if (product.title.toLowerCase().includes(keyword)) {
              matchScore += 10;
              matchedKeywords++;
              matchDetails.push(`标题"${keyword}"`);
            }
            
            // SEO关键词匹配
            if ((product.seo?.keywords || '').toLowerCase().includes(keyword)) {
              matchScore += 5;
              matchedKeywords++;
              matchDetails.push(`SEO关键词"${keyword}"`);
        }
            
            // 专用搜索关键词匹配
        if (Array.isArray(product.searchKeywords) && 
                product.searchKeywords.some((kw: string) => kw.toLowerCase().includes(keyword))) {
              matchScore += 8;
              matchedKeywords++;
              matchDetails.push(`搜索关键词"${keyword}"`);
            }
            
            // 类别匹配
            if (category.toLowerCase().includes(keyword) || 
                productId.includes(keyword) ||
                productSpecificKeywords.some(pk => pk.toLowerCase().includes(keyword))) {
              matchScore += 7;
              matchedKeywords++;
              matchDetails.push(`类别/ID"${keyword}"`);
            }
            
            // 其他内容匹配
            if (searchableContent.includes(keyword)) {
              matchScore += 1;
              matchedKeywords++;
              matchDetails.push(`内容"${keyword}"`);
            }
            
            // 部分关键词匹配 (例如: "破碎" 匹配 "破碎机")
            if (!searchableContent.includes(keyword) && keyword.length > 1) {
              const contentWords = searchableContent.split(/[\s,，、]+/);
              for (const word of contentWords) {
                if (word.includes(keyword) || keyword.includes(word)) {
                  if (word.length > 1) {  // 忽略单字匹配
                    matchScore += 0.5;
                    matchedKeywords += 0.5;  // 部分匹配算半个匹配
                    matchDetails.push(`部分"${keyword}"->"${word}"`);
                    break;
                  }
                }
              }
            }
          }
          
          // 调试：输出产品信息，只在调试模式时显示
          if (isDebug || forceRefresh) {
            debugLog(`产品: ${product.title} (ID: ${productId}), 匹配得分: ${matchScore}, 匹配: ${matchDetails.join(' | ')}`);
          }
          
          // 只有至少匹配一个关键词的产品才添加到结果中
          if (matchedKeywords > 0) {
            // 匹配的关键词数量也影响排序
            const keywordCoverage = Math.min(matchedKeywords / expandedKeywords.length, 1);
            const finalScore = matchScore * (0.5 + 0.5 * keywordCoverage);
            
            if (isDebug || forceRefresh) {
              debugLog(`匹配成功: ${product.title}, 最终得分: ${finalScore.toFixed(2)}, 匹配: ${matchDetails.join(' | ')}`);
            }
          
            // 确保根据文件来源和目录正确设置结果类型
            const isJigRelated = expandedKeywords.includes('jig') || normalizedQuery.includes('jig') || 
                                 expandedKeywords.includes('跳汰') || normalizedQuery.includes('跳汰');
            const isNewsFile = filePath.includes('/news/') || category === 'news';
            
            if (isJigRelated && isNewsFile) {
              // 如果是跳汰机相关搜索且文件在新闻目录中，确保设置为新闻类型
              if (isDebug || forceRefresh) {
                debugLog(`修正类型: ${product.title} 修正为新闻类型, 路径: ${filePath}`);
              }
              
              results.push({
                id: product.id,
                url: `/${locale}/news/${product.slug || product.id}`,
                title: product.title,
                excerpt: product.overview || product.summary?.substring(0, 150) + '...',
                category: product.category || 'news',
                score: finalScore,
                imageSrc: product.image || product.coverImage || product.imageSrc || '',
                resultType: 'news'
              });
            } else {
              // 普通产品结果
              results.push({
                id: product.id,
                url: product.href || `/${locale}/products/${category}/${product.id}`,
                title: product.title,
                excerpt: product.overview?.substring(0, 150) + '...',
                category: product.productCategory,
                score: finalScore,
                imageSrc: product.imageSrc || product.image || product.coverImage || '',
                resultType: 'product'
              });
            }
          }
        } catch (error) {
          debugLog(`处理文件 ${file} 时出错: ${error}`);
        }
      }
    }
    
    // 搜索新闻数据
    try {
      const newsDir = path.join(dataDir, 'news');
      if (fs.existsSync(newsDir)) {
        const newsFiles = fs.readdirSync(newsDir).filter(file => file.endsWith('.json'));
        
        if (isDebug || forceRefresh) {
          debugLog(`找到 ${newsFiles.length} 个新闻文件`);
        }
        
        for (const file of newsFiles) {
          const filePath = path.join(newsDir, file);
          processedFiles++;
          
          try {
            const content = fs.readFileSync(filePath, 'utf8');
            const news = JSON.parse(content);

            // 确保新闻项有正确的slug
            const newsSlug = news.slug || news.id;
            
            // 新闻内容的搜索范围
            const searchableContent = [
              news.title,
              news.summary,
              news.content,
              news.tags?.join(' ') || '',
              news.category || '',
              news.keywords?.join(' ') || '',
            ].filter(Boolean).join(' ').toLowerCase();
            
            // 匹配分值计算
            let matchScore = 0;
            let matchedKeywords = 0;
            const matchDetails: string[] = [];
            
            // 尝试精确匹配完整查询
            if (searchableContent.includes(normalizedQuery)) {
              matchScore += 50;
              matchedKeywords++;
              matchDetails.push(`完整查询"${normalizedQuery}"`);
            }
            
            // 计算每个扩展关键词的匹配
            for (const keyword of expandedKeywords) {
              if (keyword.length < 1) continue;
              
              // 标题匹配权重高
              if (news.title.toLowerCase().includes(keyword)) {
                matchScore += 15;
                matchedKeywords++;
                matchDetails.push(`标题"${keyword}"`);
              }
              
              // 摘要匹配
              if (news.summary && news.summary.toLowerCase().includes(keyword)) {
                matchScore += 10;
                matchedKeywords++;
                matchDetails.push(`摘要"${keyword}"`);
              }
              
              // 关键词匹配
              if (Array.isArray(news.keywords) && 
                  news.keywords.some((kw: string) => kw.toLowerCase().includes(keyword))) {
                matchScore += 8;
                matchedKeywords++;
                matchDetails.push(`关键词"${keyword}"`);
              }
              
              // 标签匹配
              if (Array.isArray(news.tags) && 
                  news.tags.some((tag: string) => tag.toLowerCase().includes(keyword))) {
                matchScore += 8;
                matchedKeywords++;
                matchDetails.push(`标签"${keyword}"`);
              }
              
              // 分类匹配
              if (news.category && news.category.toLowerCase().includes(keyword)) {
                matchScore += 5;
                matchedKeywords++;
                matchDetails.push(`分类"${keyword}"`);
              }
              
              // 内容匹配
              if (news.content && news.content.toLowerCase().includes(keyword)) {
                matchScore += 3;
                matchedKeywords++;
                matchDetails.push(`内容"${keyword}"`);
              }
            }
            
            // 调试输出
            if (isDebug || forceRefresh) {
              debugLog(`新闻: ${news.title}, 匹配得分: ${matchScore}, 匹配: ${matchDetails.join(' | ')}`);
            }
            
            // 只有至少匹配一个关键词的新闻才添加到结果中
            if (matchedKeywords > 0) {
              const keywordCoverage = Math.min(matchedKeywords / expandedKeywords.length, 1);
              const finalScore = matchScore * (0.5 + 0.5 * keywordCoverage);
              
              if (isDebug || forceRefresh) {
                debugLog(`匹配成功: ${news.title}, 最终得分: ${finalScore.toFixed(2)}, 匹配: ${matchDetails.join(' | ')}`);
              }
              
              // 确保路径和图片URL正确
              results.push({
                id: newsSlug,
                url: `/${locale}/news/${newsSlug}`,
                title: news.title,
                excerpt: news.summary?.substring(0, 150) + '...',
                category: news.category || 'news',
                score: finalScore,
                imageSrc: news.image || news.coverImage || news.imageSrc || '',
                resultType: 'news'  // 确保正确标记为news类型
              });
            }
          } catch (error) {
            debugLog(`处理新闻文件 ${file} 时出错: ${error}`);
          }
        }
      }
    } catch (error) {
      debugLog(`搜索新闻时出错: ${error}`);
    }
    
    // 搜索案例研究数据
    try {
      const caseDir = path.join(dataDir, 'case-studies');
      if (fs.existsSync(caseDir)) {
        const caseFiles = fs.readdirSync(caseDir).filter(file => file.endsWith('.json'));
        
        if (isDebug || forceRefresh) {
          debugLog(`找到 ${caseFiles.length} 个案例文件`);
        }
        
        for (const file of caseFiles) {
          const filePath = path.join(caseDir, file);
          processedFiles++;
          
          try {
            const content = fs.readFileSync(filePath, 'utf8');
            const caseStudy = JSON.parse(content);
            
            // 案例内容的搜索范围
            const searchableContent = [
              caseStudy.title,
              caseStudy.description,
              caseStudy.challenge,
              caseStudy.solution,
              caseStudy.results,
              caseStudy.category || '',
              caseStudy.client || '',
              caseStudy.location || ''
            ].filter(Boolean).join(' ').toLowerCase();
            
            // 匹配分值计算
            let matchScore = 0;
            let matchedKeywords = 0;
            const matchDetails: string[] = [];
            
            // 尝试精确匹配完整查询
            if (searchableContent.includes(normalizedQuery)) {
              matchScore += 50;
              matchedKeywords++;
              matchDetails.push(`完整查询"${normalizedQuery}"`);
            }
            
            // 计算每个扩展关键词的匹配
            for (const keyword of expandedKeywords) {
              if (keyword.length < 1) continue;
              
              // 标题匹配权重高
              if (caseStudy.title.toLowerCase().includes(keyword)) {
                matchScore += 15;
                matchedKeywords++;
                matchDetails.push(`标题"${keyword}"`);
              }
              
              // 描述匹配
              if (caseStudy.description && caseStudy.description.toLowerCase().includes(keyword)) {
                matchScore += 10;
                matchedKeywords++;
                matchDetails.push(`描述"${keyword}"`);
              }
              
              // 分类匹配
              if (caseStudy.category && caseStudy.category.toLowerCase().includes(keyword)) {
                matchScore += 8;
                matchedKeywords++;
                matchDetails.push(`分类"${keyword}"`);
              }
              
              // 客户匹配
              if (caseStudy.client && caseStudy.client.toLowerCase().includes(keyword)) {
                matchScore += 6;
                matchedKeywords++;
                matchDetails.push(`客户"${keyword}"`);
              }
              
              // 地点匹配
              if (caseStudy.location && caseStudy.location.toLowerCase().includes(keyword)) {
                matchScore += 5;
                matchedKeywords++;
                matchDetails.push(`地点"${keyword}"`);
              }
              
              // 其他内容匹配
              if (searchableContent.includes(keyword)) {
                matchScore += 3;
                matchedKeywords++;
                matchDetails.push(`内容"${keyword}"`);
              }
            }
            
            // 调试输出
            if (isDebug || forceRefresh) {
              debugLog(`案例: ${caseStudy.title}, 匹配得分: ${matchScore}, 匹配: ${matchDetails.join(' | ')}`);
            }
            
            // 只有至少匹配一个关键词的案例才添加到结果中
            if (matchedKeywords > 0) {
              const keywordCoverage = Math.min(matchedKeywords / expandedKeywords.length, 1);
              const finalScore = matchScore * (0.5 + 0.5 * keywordCoverage);
              
              if (isDebug || forceRefresh) {
                debugLog(`匹配成功: ${caseStudy.title}, 最终得分: ${finalScore.toFixed(2)}, 匹配: ${matchDetails.join(' | ')}`);
              }
              
              // 如果有images数组，取第一张作为封面图
              const coverImage = Array.isArray(caseStudy.images) && caseStudy.images.length > 0 
                ? caseStudy.images[0] 
                : (caseStudy.image || caseStudy.coverImage || caseStudy.imageSrc || '');
                
              results.push({
                id: caseStudy.id,
                url: `/${locale}/cases/${caseStudy.id}`,
                title: caseStudy.title,
                excerpt: caseStudy.description?.substring(0, 150) + '...',
                category: caseStudy.category,
                score: finalScore,
                imageSrc: coverImage,
                resultType: 'case'
              });
            }
          } catch (error) {
            debugLog(`处理案例文件 ${file} 时出错: ${error}`);
          }
        }
      }
    } catch (error) {
      debugLog(`搜索案例时出错: ${error}`);
    }
    
    // 按匹配分值排序结果
    results.sort((a, b) => b.score - a.score);

    // 完全重写的简单结果处理逻辑
    const finalResults: SearchResult[] = [];
    const processedIds = new Set<string>();

    // 简单处理每个搜索结果
    for (const item of results) {
      // 1. 获取图片路径
      const imagePath = getItemImagePath(item);
      
      // 跳过无图片项
      if (!imagePath) {
        if (isDebug) {
          debugLog(`跳过无图片项: ${item.title}`);
        }
        continue;
      }
      
      // 2. 只根据图片路径确定类型
      const contentType = determineContentTypeByImagePath(imagePath);
      
      // 3. 更新结果类型
      if (contentType !== item.resultType) {
        if (isDebug) {
          debugLog(`根据图片路径修正类型: ${item.title} 从 ${item.resultType || 'undefined'} 修正为 ${contentType}, 图片路径: ${imagePath}`);
        }
        item.resultType = contentType;
      }
      
      // 4. 确保imageSrc字段存在
      if (!item.imageSrc) {
        item.imageSrc = imagePath;
        if (isDebug) {
          debugLog(`添加缺失的图片路径: ${item.title}, 图片: ${imagePath}`);
        }
      }
      
      // 5. 根据类型调整URL
      if (contentType === 'news' && !item.url.includes('/news/')) {
        const parts = item.url.split('/');
        const contentId = parts[parts.length - 1];
        item.url = `/${locale}/news/${item.slug || contentId}`;
      } else if (contentType === 'case' && !item.url.includes('/cases/')) {
        const parts = item.url.split('/');
        const contentId = parts[parts.length - 1];
        item.url = `/${locale}/cases/${contentId}`;
      }
      
      // 6. 去重处理
      const itemId = item.id;
      if (!processedIds.has(itemId)) {
        processedIds.add(itemId);
        finalResults.push(item);
        
        if (isDebug) {
          debugLog(`添加最终结果: ${item.title}, 类型: ${item.resultType}, 图片: ${imagePath}`);
        }
      }
    }

    // 返回结果
    if (isDebug) {
      debugLog(`处理完成: 找到 ${finalResults.length} 个匹配结果`);
    }

    return NextResponse.json(finalResults, {
      status: 200,
      headers: headers
    });
  } catch (error) {
    debugLog('搜索过程中出现错误:', error);
    return NextResponse.json({ 
      error: '搜索处理失败',
      message: error instanceof Error ? error.message : String(error),
      stack: process.env.NODE_ENV !== 'production' ? (error instanceof Error ? error.stack : '') : undefined
    }, { status: 500 });
  }
}
