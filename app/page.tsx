import { redirect } from 'next/navigation';

// 使用异步组件以支持服务器端重定向
export default async function RootPage() {
  // 注意：这里的重定向会在middleware.ts已经处理后才执行
  // 由于middleware已经通过rewrite处理了根路径访问，这里的代码通常不会被执行
  // 但保留作为后备方案，确保用户总能看到内容
  redirect('/en');
} 