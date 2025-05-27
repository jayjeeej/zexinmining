import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    // 获取locale参数，默认为en
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';
    
    // 产品ID列表
    const productIds = [
      "banana-multislope-vibrating-screen",
      "inclined-vibrating-screen",
      "bar-vibrating-screen",
      "trommel-screen",
      "dewatering-screen",
    ];
    
    // 读取产品数据
    const products = await Promise.all(
      productIds.map(async (id) => {
        try {
          // 构建JSON文件路径
          const filePath = path.join(process.cwd(), 'public', 'data', locale, 'vibrating-screens', `${id}.json`);
          
          // 检查文件是否存在
          if (!fs.existsSync(filePath)) {
            // 不记录错误，静默处理
            return null;
          }
          
          // 读取文件内容
          const fileContent = fs.readFileSync(filePath, 'utf8');
          return JSON.parse(fileContent);
        } catch (error) {
          // 静默处理错误
          return null;
        }
      })
    );
    
    // 过滤掉null值并返回
    const validProducts = products.filter(p => p !== null);
    
    // 返回产品数据
    return NextResponse.json(validProducts, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400'
      }
    });
  } catch (error) {
    // 静默处理错误
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}