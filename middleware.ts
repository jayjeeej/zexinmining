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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get('user-agent') || '';
  const isBaiduBot = userAgent.includes('Baiduspider') || userAgent.includes('baidu');
  
  // 检查是否是百度验证文件
  if (pathname.startsWith('/baidu_verify_') || 
      pathname.includes('baidu-site-verification') || 
      pathname.includes('shenma-site-verification') ||
      pathname.includes('sogousiteverification')) {
    console.log('Search engine verification file requested:', pathname);
    // 直接放行验证文件请求，不做任何重定向
    return NextResponse.next();
  }
  
  // 如果是百度爬虫且访问首页，直接返回首页内容而不重定向
  if (isBaiduBot && (pathname === '/' || pathname === '/zh' || pathname === '/en')) {
    console.log('Baidu spider accessing homepage:', pathname);
    // 如果是根路径，不进行重定向
    if (pathname === '/') {
      // 默认返回中文版，因为百度主要抓取中文内容
      return NextResponse.rewrite(new URL('/zh', request.url));
    }
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