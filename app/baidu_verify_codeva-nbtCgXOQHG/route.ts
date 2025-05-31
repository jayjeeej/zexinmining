import { NextResponse } from 'next/server';

// 百度验证码
const VERIFICATION_CODE = 'codeva-nbtCgXOQHG';

export async function GET() {
  return new NextResponse(VERIFICATION_CODE, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
  });
} 