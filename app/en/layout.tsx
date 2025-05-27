import { NextIntlClientProvider } from 'next-intl';

// 强制使用静态生成
export const dynamic = 'force-static';
export const revalidate = 3600; // 每小时重新验证

export default async function EnglishLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 确定语言为英文
  const locale = 'en';
  
  // 导入英文消息文件
  const messages = (await import(`../../messages/${locale}.json`)).default;

  return (
    <NextIntlClientProvider 
      locale={locale} 
      messages={messages} 
      timeZone="Asia/Shanghai"
      now={new Date()}
    >
      {children}
    </NextIntlClientProvider>
  );
} 