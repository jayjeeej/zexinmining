'use client';

import Link from 'next/link'
import { useLocale } from 'next-intl'

export default function NotFound() {
  const locale = useLocale();
  const isZh = locale === 'zh';
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {isZh ? "404 - 页面未找到" : "404 - Page Not Found"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isZh ? "您访问的页面不存在或已被移除。" : "The page you are looking for does not exist or has been removed."}
          </p>
          <p className="mt-4 text-sm text-gray-600">
            {isZh ? "您可以尝试以下操作：" : "You can try the following:"}
          </p>
          <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
            <li>{isZh ? "检查网址是否正确" : "Check if the URL is correct"}</li>
            <li>{isZh ? "返回上一页" : "Go back to the previous page"}</li>
            <li>{isZh ? "访问首页" : "Visit the homepage"}</li>
          </ul>
        </div>
        <div className="flex justify-center space-x-4">
          <button 
            onClick={() => window.history.back()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff6633]"
          >
            {isZh ? "返回上一页" : "Go Back"}
          </button>
          <Link
            href={`/${locale}`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#ff6633] hover:bg-[#ff5522] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff6633]"
          >
            {isZh ? "返回首页" : "Go to Homepage"}
          </Link>
        </div>
      </div>
    </div>
  )
} 