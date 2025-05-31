import { NextResponse } from 'next/server';

// 百度验证码
const VERIFICATION_CODE = '392bcc59a675c2926f08fcf225d21004';

export async function GET() {
  return new NextResponse(VERIFICATION_CODE, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
  });
} 