'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">出错了</h2>
          <p className="mt-2 text-sm text-gray-600">
            抱歉，页面加载时出现错误。
          </p>
        </div>
        <div>
          <button
            onClick={() => reset()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#ff6633] hover:bg-[#ff5522] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff6633]"
          >
            重试
          </button>
        </div>
      </div>
    </div>
  );
} 