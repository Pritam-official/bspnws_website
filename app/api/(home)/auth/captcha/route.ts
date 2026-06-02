import { NextResponse } from 'next/server';
import { generateCaptcha } from '@/lib/captcha';

// Set this endpoint to be dynamic, ensuring we don't cache responses
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const captcha = generateCaptcha();
    return NextResponse.json(captcha);
  } catch (error: any) {
    console.error('Error generating captcha:', error);
    return NextResponse.json(
      { error: 'Failed to generate captcha' },
      { status: 500 }
    );
  }
}
