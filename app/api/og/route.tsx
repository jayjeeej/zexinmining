import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';
// 添加缓存控制，减少重复渲染
export const fetchCache = 'force-cache';
export const revalidate = 86400; // 24小时缓存

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // 获取动态参数
    const title = searchParams.get('title') || '泽鑫矿山设备';
    const subtitle = searchParams.get('subtitle') || '专业矿山设备制造商';
    const locale = searchParams.get('locale') || 'zh';
    
    // 构建OG图像内容
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ffffff',
            backgroundImage: 'linear-gradient(to bottom right, #1b78e2, #ffffff)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '100%',
              padding: '50px',
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: 60,
                fontWeight: 'bold',
                color: '#ffffff',
                marginBottom: 20,
                textAlign: 'center',
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: 30,
                color: '#ffffff',
                textAlign: 'center',
                maxWidth: '80%',
              }}
            >
              {subtitle}
            </div>
            <div
              style={{
                marginTop: 40,
                display: 'flex',
                fontSize: 20,
                color: '#ffffff',
                opacity: 0.8,
              }}
            >
              {locale === 'zh' ? '泽鑫矿山设备' : 'Zexin Mining Equipment'} © {new Date().getFullYear()}
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
} 