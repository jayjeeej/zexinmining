import { NextIntlClientProvider } from 'next-intl';
import ClientCookieConsent from '@/components/ClientCookieConsent';

export default async function EnglishLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 使用固定的locale值
  const locale = 'en';
  
  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    throw new Error(`Failed to load messages for locale: ${locale}`);
  }

  return (
    <NextIntlClientProvider 
      locale={locale} 
      messages={messages} 
      timeZone="Asia/Shanghai"
      now={new Date()}
    >
      {children}
      <ClientCookieConsent locale={locale} />
    </NextIntlClientProvider>
  );
} 