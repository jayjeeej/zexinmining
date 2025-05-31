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
  
  // 如果是根路径，重定向到用户首选语言
  if (pathname === '/') {
    const locale = getPreferredLocale(request);
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  // 只匹配根路径，排除验证文件和其他特殊路径
  matcher: ['/', '/((?!api|_next|.*\\..*|baidu_verify_.*|baidu-site-verification.*|BingSiteAuth.*|shenma-site-verification.*|sogousiteverification.*|fc8664f68b63308b6.*|codeva-.*).*)'],
}; 