import {getRequestConfig} from 'next-intl/server';

// 支持的语言列表
export const locales = ['en', 'zh'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale = 'en' as const;

export default getRequestConfig(async ({locale}) => {
  // 验证 locale 是否有效，无效则使用默认值
  const validatedLocale = locales.includes(locale as Locale) ? locale : defaultLocale;
  
  return {
    locale: validatedLocale as string,
    messages: (await import(`../messages/${validatedLocale}.json`)).default,
    timeZone: 'Asia/Shanghai',
    now: new Date()
  };
}); 