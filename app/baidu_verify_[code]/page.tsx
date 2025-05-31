import { Metadata } from 'next';
import { notFound } from 'next/navigation';

// 禁用静态生成，确保每次请求都能正确处理
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// 设置元数据
export async function generateMetadata({ 
  params 
}: { 
  params: { code: string } 
}): Promise<Metadata> {
  return {
    title: `Baidu Verification`,
    robots: 'noindex, nofollow',
  };
}

// 百度验证页面组件
export default function BaiduVerifyPage({ 
  params 
}: { 
  params: { code: string } 
}) {
  const { code } = params;
  
  // 如果没有验证码参数，返回404
  if (!code) {
    notFound();
  }
  
  // 返回纯文本验证码
  return (
    <div style={{ display: 'none' }}>
      {code}
    </div>
  );
}

// 导出特殊的内容类型头信息
export const contentType = 'text/plain'; 