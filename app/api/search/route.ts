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

// 移除dynamic和revalidate配置，使其可以静态导出
// export const dynamic = 'force-dynamic';
// export const revalidate = false;

// 预先生成的搜索结果
const preGeneratedResults: Record<string, any> = {
  "zh": {
    "破碎机": [
      {
        "id": "jaw-crusher",
        "url": "/products/stationary-crushers/jaw-crusher",
        "title": "颚式破碎机",
        "excerpt": "颚式破碎机是最常用的初级破碎设备，适用于各种矿石的初级破碎。",
        "category": "破碎设备",
        "score": 100,
        "imageSrc": "/images/products/crushers/jaw-crusher.png",
        "resultType": "product"
      },
      {
        "id": "cone-crusher",
        "url": "/products/stationary-crushers/cone-crusher",
        "title": "圆锥破碎机",
        "excerpt": "圆锥破碎机广泛应用于矿山、冶炼、建材、公路、铁路、水利和化学工业等众多行业。",
        "category": "破碎设备",
        "score": 95,
        "imageSrc": "/images/products/crushers/cone-crusher.png",
        "resultType": "product"
      }
    ],
    "筛分": [
      {
        "id": "vibrating-screen",
        "url": "/products/vibrating-screens/vibrating-screen",
        "title": "振动筛",
        "excerpt": "振动筛是矿山、建材、交通、能源等部门最常用的筛分设备。",
        "category": "筛分设备",
        "score": 100,
        "imageSrc": "/images/products/screens/vibrating-screen.png",
        "resultType": "product"
      }
    ],
    "磨矿": [
      {
        "id": "ball-mill",
        "url": "/products/grinding-equipment/ball-mill",
        "title": "球磨机",
        "excerpt": "球磨机是物料被破碎之后，再进行粉碎的关键设备。",
        "category": "磨矿设备",
        "score": 90,
        "imageSrc": "/images/products/grinding/ball-mill.png",
        "resultType": "product"
      }
    ]
  },
  "en": {
    "crusher": [
      {
        "id": "jaw-crusher",
        "url": "/products/stationary-crushers/jaw-crusher",
        "title": "Jaw Crusher",
        "excerpt": "Jaw crusher is the most commonly used primary crushing equipment, suitable for primary crushing of various ores.",
        "category": "Crushing Equipment",
        "score": 100,
        "imageSrc": "/images/products/crushers/jaw-crusher.png",
        "resultType": "product"
      },
      {
        "id": "cone-crusher",
        "url": "/products/stationary-crushers/cone-crusher",
        "title": "Cone Crusher",
        "excerpt": "Cone crusher is widely used in mining, metallurgy, construction, road, railway, water conservancy and chemical industries.",
        "category": "Crushing Equipment",
        "score": 95,
        "imageSrc": "/images/products/crushers/cone-crusher.png",
        "resultType": "product"
      }
    ],
    "screen": [
      {
        "id": "vibrating-screen",
        "url": "/products/vibrating-screens/vibrating-screen",
        "title": "Vibrating Screen",
        "excerpt": "Vibrating screen is the most commonly used screening equipment in mining, building materials, transportation, energy and other departments.",
        "category": "Screening Equipment",
        "score": 100,
        "imageSrc": "/images/products/screens/vibrating-screen.png",
        "resultType": "product"
      }
    ],
    "mill": [
      {
        "id": "ball-mill",
        "url": "/products/grinding-equipment/ball-mill",
        "title": "Ball Mill",
        "excerpt": "Ball mill is a key equipment for grinding materials after being crushed.",
        "category": "Grinding Equipment",
        "score": 90,
        "imageSrc": "/images/products/grinding/ball-mill.png",
        "resultType": "product"
      }
    ]
  }
};

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

// 搜索处理函数 - 在静态导出模式下使用预生成的结果
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const locale = searchParams.get('locale') || 'zh';
    
    // 如果查询为空，返回空结果
    if (!query || query.length < 2) {
      return NextResponse.json([], { status: 200 });
    }
    
    // 检查预生成的搜索结果
    if (preGeneratedResults[locale]) {
      // 尝试精确匹配
      if (preGeneratedResults[locale][query]) {
        return NextResponse.json(preGeneratedResults[locale][query], { 
          status: 200,
          headers: { 'Cache-Control': 'public, max-age=86400' }
        });
      }
      
      // 尝试部分匹配
      for (const key in preGeneratedResults[locale]) {
        if (query.includes(key) || key.includes(query)) {
          return NextResponse.json(preGeneratedResults[locale][key], { 
            status: 200,
            headers: { 'Cache-Control': 'public, max-age=86400' }
          });
        }
      }
    }
    
    // 如果没有匹配，返回空结果
    return NextResponse.json([], { 
      status: 200,
      headers: { 'Cache-Control': 'public, max-age=3600' }
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
