import { NextRequest, NextResponse } from 'next/server';

/**
 * API路由处理百度验证文件请求
 * 通过URL参数获取验证码，并直接返回验证码内容
 * 示例：/api/baidu-verify/abc123 将返回 "abc123"
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  const { code } = params;
  
  // 记录访问日志
  console.log(`Baidu verification requested: ${code}`);
  
  // 返回纯文本验证码
  return new NextResponse(code, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
    },
  });
}

// 导出配置，禁用边缘运行时以确保在Node.js环境中运行
export const runtime = 'nodejs'; 