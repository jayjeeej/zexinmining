import { NextRequest, NextResponse } from 'next/server';
import { getNews, getNewsCount } from '@/lib/api/news';

// 更改为动态路由，因为它使用了searchParams
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const locale = searchParams.get('locale') || 'en';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const filter = searchParams.get('filter') || 'all';
  const limit = parseInt(searchParams.get('limit') || '100', 10);
  
  try {
    const news = await getNews({ 
      locale, 
      page, 
      filter: filter !== 'all' ? filter : undefined,
      limit
    });
    
    const total = await getNewsCount({
      locale,
      filter: filter !== 'all' ? filter : undefined
    });
    
    return NextResponse.json({ news, total });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news data' }, 
      { status: 500 }
    );
  }
}
