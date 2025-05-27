import { redirect } from 'next/navigation';

// 使用异步组件以支持服务器端重定向
export default async function RootPage() {
  // 重定向到默认语言
  redirect('/en');
} 