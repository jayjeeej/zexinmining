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

// 检查关键词是否在内容中彼此接近，返回接近度分数
function checkKeywordProximity(content: string, keywords: string[]): number {
  // 只对多个关键词进行检查
  if (keywords.length <= 1) return 0;
  
  // 过滤掉太短的关键词和完整搜索词（数组最后一个元素）
  const filteredKeywords = keywords.slice(0, -1).filter(kw => kw.length >= 2);
  if (filteredKeywords.length <= 1) return 0;
  
  // 记录每个关键词在内容中的位置
  const positions: Record<string, number[]> = {};
  
  // 查找每个关键词的所有位置
  for (const keyword of filteredKeywords) {
    positions[keyword] = [];
    let pos = content.indexOf(keyword);
    while (pos !== -1) {
      positions[keyword].push(pos);
      pos = content.indexOf(keyword, pos + 1);
    }
    
    // 如果某个关键词不存在，返回0
    if (positions[keyword].length === 0) {
      return 0;
    }
  }
  
  // 计算关键词之间的最小距离
  let minDistance = content.length;
  
  // 获取第一个关键词的位置
  const firstKw = filteredKeywords[0];
  const firstPositions = positions[firstKw];
  
  // 对于第一个关键词的每个位置
  for (const pos1 of firstPositions) {
    // 初始最大距离
    let maxDistForThisPos = 0;
    
    // 检查与其他每个关键词的最小距离
    for (let i = 1; i < filteredKeywords.length; i++) {
      const kw = filteredKeywords[i];
      let minDistForThisKw = content.length;
      
      // 找到当前关键词与pos1最近的位置
      for (const pos2 of positions[kw]) {
        const dist = Math.abs(pos2 - pos1);
        if (dist < minDistForThisKw) {
          minDistForThisKw = dist;
        }
      }
      
      // 更新这个位置的最大距离
      if (minDistForThisKw > maxDistForThisPos) {
        maxDistForThisPos = minDistForThisKw;
      }
    }
    
    // 更新整体最小距离
    if (maxDistForThisPos < minDistance) {
      minDistance = maxDistForThisPos;
    }
  }
  
  // 距离越小，关键词越接近，得分越高
  // 距离在100字符内视为非常相关
  if (minDistance <= 50) return 15;
  if (minDistance <= 100) return 10;
  if (minDistance <= 200) return 5;
  if (minDistance <= 500) return 2;
  
  return 0;
}

// 新增：统一图片路径获取和类型判定
function getItemImageAndType(item: any): { image: string, type: string } {
  let image = '';
  if (item.images && Array.isArray(item.images) && item.images.length > 0) {
    image = item.images[0];
  } else if (item.imageSrc) {
    image = item.imageSrc;
  } else if (item.image) {
    image = item.image;
  } else if (item.coverImage) {
    image = item.coverImage;
  }
  let type = 'product';
  if (image.includes('/news/') || image.includes('/images/news/')) {
    type = 'news';
  } else if (image.includes('/case-studies/') || image.includes('/images/cases/') || image.includes('/cases/')) {
    type = 'case';
  }
  return { image, type };
}

function debugLog(...args: any[]) {
  // 判断是否在开发环境
  const isDev = process.env.NODE_ENV === 'development';
  // 只在开发环境或显式启用调试时输出日志
  if (isDev || process.env.DEBUG === 'true') {
    console.error('[搜索API]', ...args);
  }
}

// 在结果中确保URL使用静态路径
function ensureStaticUrls(results: SearchResult[], locale: string): SearchResult[] {
  return results.map(result => {
    // 确保URL是静态路径
    if (!result.url) {
      debugLog(`警告: 结果没有URL: ${result.title}`);
      return result;
    }
    
    // 调试输出
    if (process.env.NODE_ENV === 'development') {
      debugLog(`格式化URL前: ${result.url}`);
    }
    
    // 修复常见的URL错误
    let fixedUrl = result.url;
    
    // 修复错误的路径组合，如/products/news/
    if (fixedUrl.includes('/products/news/')) {
      fixedUrl = fixedUrl.replace('/products/news/', '/news/');
    }
    
    // 如果URL不以/zh/或/en/开头，添加语言前缀
    if (!fixedUrl.startsWith('/zh/') && !fixedUrl.startsWith('/en/')) {
      // 将动态URL替换为静态URL
      fixedUrl = `/${locale === 'zh' ? 'zh' : 'en'}/${fixedUrl.replace(/^\/[a-z]{2}\//, '').replace(/^\//, '')}`;
    }
    
    // 修复可能的case-studies错误路径
    if (fixedUrl.includes('/case-studies/')) {
      fixedUrl = fixedUrl.replace('/case-studies/', '/cases/');
    }
    
    // 调试输出
    if (process.env.NODE_ENV === 'development') {
      debugLog(`格式化URL后: ${fixedUrl}`);
    }
    
    // 更新结果URL
    result.url = fixedUrl;
    
    return result;
  });
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
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };
    
    if (isDebug) {
      debugLog('收到搜索请求:', { 
        url: request.url,
        query, 
        locale, 
        subCategory,
        rawParams: Object.fromEntries(searchParams.entries())
      });
    }
    
    if (!query || query.length < 2) {
      return NextResponse.json([], { status: 200 });
    }
    
    // 禁止跨语言搜索，若关键词与locale语言不一致，直接返回空结果
    const isZhLocale = locale === 'zh';
    const isQueryZh = /[\u4e00-\u9fa5]/.test(query);
    const isQueryEn = /[a-zA-Z]/.test(query);
    // 恢复跨语言搜索限制
    if ((isZhLocale && isQueryEn) || (!isZhLocale && isQueryZh)) {
      if (isDebug) debugLog('禁止跨语言搜索，直接返回空结果');
      return NextResponse.json([], { status: 200 });
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
              const { image, type } = getItemImageAndType(product);
              if (!image) continue;
              screenResults.push({
                id: product.id,
                url: product.href || `/${locale}/products/ore-processing/vibrating-screens/${product.id}`,
                title: product.title,
                excerpt: product.overview?.substring(0, 150) + '...',
                category: product.productCategory,
                score: 1000, // 给高优先级
                imageSrc: image,
                resultType: type
              });
            } catch (error) {
              if (isDebug) debugLog(`处理振动筛文件${file}时出错: ${error}`);
            }
          }
          
          if (screenResults.length > 0) {
            // 直接返回振动筛产品
            return NextResponse.json(screenResults, {
              status: 200,
              headers
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
    
    if (isDebug) {
      debugLog(`搜索关键词: ${normalizedQuery}, 拆分后: [${keywords.join(', ')}]`);
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
      
    // 如果指定了子分类，只搜索该子分类
    let categoriesToSearch = subCategory 
      ? [...categoryDirs.filter(category => category === subCategory)]
      : [...categoryDirs];
    
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
          
          // ========== 简化匹配逻辑：只检查标题是否包含搜索词 ==========
          // 标题必须包含搜索词（至少包含一个关键词）
          const titleLower = product.title ? product.title.toLowerCase() : '';
          
          // 1. 检查是否包含完整搜索词
          const hasFullQueryInTitle = titleLower.includes(normalizedQuery);
          
          // 2. 如果不包含完整搜索词，检查是否包含所有拆分的关键词
          let hasAllKeywordsInTitle = true;
          for (const keyword of keywords) {
            if (!titleLower.includes(keyword)) {
              hasAllKeywordsInTitle = false;
              break;
            }
          }
          
          // 调试信息
          if (isDebug) {
            debugLog(`文件: ${productId}, 标题: "${product.title}", 包含完整查询: ${hasFullQueryInTitle}, 包含所有关键词: ${hasAllKeywordsInTitle}`);
          }
          
          // 只有标题包含完整搜索词或所有关键词的内容才添加到结果中
          if (hasFullQueryInTitle || hasAllKeywordsInTitle) {
            const { image, type } = getItemImageAndType(product);
            if (!image) continue; // 必须有图片
            
            if (isDebug) {
              debugLog(`匹配成功: ${product.title}, 类型: ${type}, 图片: ${image}`);
            }
          
            // 根据类型构建正确的URL
            let url = '';
            switch (type) {
              case 'news':
                url = `/${locale === 'zh' ? 'zh' : 'en'}/news/${product.slug || product.id}`;
                break;
              case 'case':
                url = `/${locale === 'zh' ? 'zh' : 'en'}/cases/${product.id}`;
                break;
              default: // 产品
                // 从href属性获取正确URL或构建包含ore-processing的URL
                if (product.href) {
                  url = product.href;
                } else {
                  url = `/${locale === 'zh' ? 'zh' : 'en'}/products/ore-processing/${category}/${product.id}`;
                }
                break;
            }
            
            // 添加到结果中 - 分值固定为10
              results.push({
                id: product.id,
              url: url,
                title: product.title,
              excerpt: product.overview?.substring(0, 150) + '...' || product.summary?.substring(0, 150) + '...' || '',
              category: product.productCategory || product.category || category,
              score: 10,
                imageSrc: image,
                resultType: type
              });
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
        
        if (isDebug) {
          debugLog(`找到 ${newsFiles.length} 个新闻文件`);
        }
        
        for (const file of newsFiles) {
          const filePath = path.join(newsDir, file);
          processedFiles++;
          
          try {
            const content = fs.readFileSync(filePath, 'utf8');
            const news = JSON.parse(content);
            const newsSlug = news.slug || news.id;
            
            // ========== 简化匹配逻辑：只检查标题是否包含搜索词 ==========
            // 标题必须包含搜索词（至少包含一个关键词）
            const titleLower = news.title ? news.title.toLowerCase() : '';
            
            // 1. 检查是否包含完整搜索词
            const hasFullQueryInTitle = titleLower.includes(normalizedQuery);
            
            // 2. 如果不包含完整搜索词，检查是否包含所有拆分的关键词
            let hasAllKeywordsInTitle = true;
            for (const keyword of keywords) {
              if (!titleLower.includes(keyword)) {
                hasAllKeywordsInTitle = false;
                break;
              }
            }
            
            // 调试信息
            if (isDebug) {
              debugLog(`新闻: "${news.title}", 包含完整查询: ${hasFullQueryInTitle}, 包含所有关键词: ${hasAllKeywordsInTitle}`);
            }
            
            // 只有标题包含完整搜索词或所有关键词的内容才添加到结果中
            if (hasFullQueryInTitle || hasAllKeywordsInTitle) {
              const { image, type } = getItemImageAndType(news);
              if (!image) continue; // 必须有图片
              
              if (isDebug) {
                debugLog(`匹配成功: ${news.title}, 类型: ${type}, 图片: ${image}`);
              }
              
              // 添加到结果中 - 分值固定为10
              results.push({
                id: newsSlug,
                url: news.href || `/${locale === 'zh' ? 'zh' : 'en'}/news/${newsSlug}`,
                title: news.title,
                excerpt: news.summary?.substring(0, 150) + '...' || '',
                category: news.category || 'news',
                score: 10,
                imageSrc: image,
                resultType: type
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
        
        if (isDebug) {
          debugLog(`找到 ${caseFiles.length} 个案例文件`);
        }
        
        for (const file of caseFiles) {
          const filePath = path.join(caseDir, file);
          processedFiles++;
          
          try {
            const content = fs.readFileSync(filePath, 'utf8');
            const caseStudy = JSON.parse(content);
            
            // ========== 简化匹配逻辑：只检查标题是否包含搜索词 ==========
            // 标题必须包含搜索词（至少包含一个关键词）
            const titleLower = caseStudy.title ? caseStudy.title.toLowerCase() : '';
            
            // 1. 检查是否包含完整搜索词
            const hasFullQueryInTitle = titleLower.includes(normalizedQuery);
            
            // 2. 如果不包含完整搜索词，检查是否包含所有拆分的关键词
            let hasAllKeywordsInTitle = true;
            for (const keyword of keywords) {
              if (!titleLower.includes(keyword)) {
                hasAllKeywordsInTitle = false;
                break;
              }
            }
            
            // 调试信息
            if (isDebug) {
              debugLog(`案例: "${caseStudy.title}", 包含完整查询: ${hasFullQueryInTitle}, 包含所有关键词: ${hasAllKeywordsInTitle}`);
            }
            
            // 只有标题包含完整搜索词或所有关键词的内容才添加到结果中
            if (hasFullQueryInTitle || hasAllKeywordsInTitle) {
              const { image, type } = getItemImageAndType(caseStudy);
              if (!image) continue; // 必须有图片
              
              if (isDebug) {
                debugLog(`匹配成功: ${caseStudy.title}, 类型: ${type}, 图片: ${image}`);
              }
              
              // 确保使用正确的URL路径 - 网站使用/cases/而不是/case-studies/
              const caseUrl = caseStudy.href || `/${locale === 'zh' ? 'zh' : 'en'}/cases/${caseStudy.id}`;
              
              // 添加到结果中 - 分值固定为10
              results.push({
                id: caseStudy.id,
                url: caseUrl,
                title: caseStudy.title,
                excerpt: caseStudy.description?.substring(0, 150) + '...' || '',
                category: caseStudy.category || 'case',
                score: 10,
                imageSrc: image,
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
    
    // 应用静态URL处理 - 确保URL格式正确
    results = ensureStaticUrls(results, locale);
    
    // 返回结果
    if (isDebug) {
      debugLog(`处理完成: 找到 ${results.length} 个匹配结果`);
      
      // 在开发环境或明确要求调试时，包含调试信息
      if (isDev || searchParams.get('debug') === 'true') {
        return NextResponse.json({
          results: results,
          debug: {
            query,
            locale,
            processedFiles,
            resultCount: results.length,
            urls: results.map(r => r.url)
          }
        }, {
          status: 200,
          headers: headers
        });
      }
    }

    return NextResponse.json(results, {
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
