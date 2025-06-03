import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 获取用户首选的语言
function getPreferredLocale(request: NextRequest): string {
  // 1. 尝试从cookie获取
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && ['en', 'zh'].includes(cookieLocale)) {
    return cookieLocale;
  }
  
  // 2. 尝试从Accept-Language头获取
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    if (acceptLanguage.includes('zh')) return 'zh';
  }
  
  // 3. 默认返回英文
  return 'en';
}

// 检查是否是产品页面（有重定向错误的页面）
function isProductPage(pathname: string): boolean {
  const productPatterns = [
    '/zh/products/ore-processing/classification-equipment/',
    '/zh/products/mineral-processing-solutions/',
    '/zh/products/ore-processing/grinding-equipment/',
    '/zh/products/ore-processing/stationary-crushers/',
    '/zh/products/ore-processing/vibrating-screens/',
    '/zh/products/ore-processing/washing-equipment/',
    '/zh/products/ore-processing/magnetic-separator/'
  ];
  
  return productPatterns.some(pattern => pathname.startsWith(pattern));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get('user-agent') || '';
  const isBaiduBot = userAgent.includes('Baiduspider') || userAgent.includes('baidu');
  const is360Bot = userAgent.includes('360Spider');
  const isSearchBot = isBaiduBot || 
                     is360Bot ||
                     userAgent.includes('Googlebot') || 
                     userAgent.includes('bingbot') || 
                     userAgent.includes('YandexBot');
  
  // 检查是否是产品页面（有重定向错误的页面）
  if (isProductPage(pathname)) {
    console.log('Product page detected, skipping middleware:', pathname);
    // 为这些页面添加特殊标记，防止在next.config.js中再次重定向
    const response = NextResponse.next();
    response.headers.set('x-no-redirect', 'true');
    return response;
  }
  
  // 检查是否是搜索引擎验证文件
  if (pathname.startsWith('/baidu_verify_') || 
      pathname.includes('baidu-site-verification') || 
      pathname.includes('shenma-site-verification') ||
      pathname.includes('sogousiteverification') ||
      pathname.includes('BingSiteAuth')) {
    console.log('Search engine verification file requested:', pathname);
    // 直接放行验证文件请求，不做任何重定向
    return NextResponse.next();
  }
  
  // 如果是搜索引擎爬虫访问根路径
  if (isSearchBot && pathname === '/') {
    console.log('Search bot accessing root path:', pathname);
    // 百度爬虫和360爬虫默认返回中文版，其他爬虫返回英文版
    if (isBaiduBot || is360Bot) {
      console.log('Baidu/360 bot detected, rewriting to /zh');
      return NextResponse.rewrite(new URL('/zh', request.url));
    } else {
      return NextResponse.rewrite(new URL('/en', request.url));
    }
  }
  
  // 如果是搜索引擎爬虫访问语言路径，直接返回内容
  if (isSearchBot && (pathname === '/zh' || pathname === '/en')) {
    console.log('Search bot accessing language path:', pathname);
    return NextResponse.next();
  }
  
  // 如果是根路径，重定向到用户首选语言
  if (pathname === '/') {
    const locale = getPreferredLocale(request);
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  // 只匹配根路径和语言路径，排除验证文件和其他特殊路径
  matcher: ['/', '/((?!api|_next|.*\\..*|baidu_verify_.*|baidu-site-verification.*|BingSiteAuth.*|shenma-site-verification.*|sogousiteverification.*|fc8664f68b63308b6.*|codeva-.*).*)'],
}; 