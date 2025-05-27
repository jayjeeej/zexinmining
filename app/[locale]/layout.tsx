import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import ClientCookieConsent from '@/components/ClientCookieConsent';

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'zh' }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // 等待并解构params以确保它已完全加载
  const resolvedParams = await Promise.resolve(params);
  const locale = resolvedParams.locale;
  
  if (!locale || !['en', 'zh'].includes(locale)) {
    notFound();
  }
  
  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
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