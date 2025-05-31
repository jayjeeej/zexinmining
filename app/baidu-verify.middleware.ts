import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * 百度验证专用中间件
 * 处理百度验证文件请求，确保返回200状态码和正确内容
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get('user-agent') || '';
  const isBaiduBot = userAgent.includes('Baiduspider') || userAgent.includes('baidu');
  
  console.log(`百度验证中间件处理: ${pathname}, User-Agent: ${userAgent.substring(0, 50)}...`);
  
  // 如果是百度验证文件请求
  if (pathname.startsWith('/baidu_verify_')) {
    // 从路径中提取验证码
    const code = pathname.replace('/baidu_verify_', '').replace('.html', '');
    
    // 返回纯文本响应
    return new NextResponse(code, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      },
    });
  }
  
  // 其他百度相关请求直接放行
  return NextResponse.next();
}

// 配置匹配路径，只处理百度验证相关请求
export const config = {
  matcher: [
    '/baidu_verify_:code*',
    '/baidu-site-verification:path*',
    '/shenma-site-verification:path*',
    '/sogousiteverification:path*'
  ],
}; 