import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/request';

// 创建中间件
export default createMiddleware({
  // 支持的语言列表
  locales: ['en', 'zh'],
  // 默认语言
  defaultLocale: 'en',
  // 设置将语言信息存储在 cookie 中，并自动检测用户的首选语言
  localeDetection: true,
  localePrefix: 'always'
});

export const config = {
  // 匹配所有路径，除了 /api, /_next, /public 等系统路径
  matcher: ['/((?!api|_next|.*\\..*).*)']
}; 