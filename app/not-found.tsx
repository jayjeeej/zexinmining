import Link from 'next/link'
import { useLocale } from 'next-intl'

export const dynamic = 'force-static';

export default function NotFound() {
  const locale = useLocale();
  
  // 中英文错误信息
  const translations = {
    en: {
      title: "404 - Page Not Found",
      message: "The page you are looking for does not exist.",
      homeButton: "Go back home"
    },
    zh: {
      title: "404 - 页面未找到",
      message: "您正在寻找的页面不存在。",
      homeButton: "返回首页"
    }
  };
  
  // 使用当前语言或默认英文
  const t = translations[locale as keyof typeof translations] || translations.en;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">{t.title}</h2>
          <p className="mt-2 text-sm text-gray-600">
            {t.message}
          </p>
        </div>
        <div>
          <Link
            href={`/${locale}`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#ff6633] hover:bg-[#ff5522] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff6633]"
          >
            {t.homeButton}
          </Link>
        </div>
      </div>
    </div>
  )
} 