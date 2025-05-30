import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import SearchResultsClient from './page.client';

// 添加类型定义
type SearchPageProps = {
  searchParams: { q?: string };
}

// 创建并导出客户端组件
export default async function SearchPage({ searchParams }: SearchPageProps) {
  // 使用固定的locale值
  const locale = 'en';
  const query = (await Promise.resolve(searchParams)).q || '';
  
  // 如果没有搜索词，重定向到首页
  if (!query) {
    return redirect(`/${locale}`);
  }
  
  return (
    <Suspense fallback={<div className="contain py-16">Loading...</div>}>
      <SearchResultsClient locale={locale} query={query} />
    </Suspense>
  );
}
