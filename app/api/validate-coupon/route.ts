import { NextRequest, NextResponse } from 'next/server';
import { dbOperations } from '@/lib/database';

// Type definitions
interface ValidatedCoupon {
  id: number;
  code: string;
  prize_id: number;
  is_used: boolean;
  created_at: string;
  prize_name: string;
  prize_description: string;
}

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code || typeof code !== 'string' || code.length !== 5) {
      return NextResponse.json(
        { error: 'Kode kupon harus 5 karakter alfanumerik' },
        { status: 400 }
      );
    }

    const coupon = dbOperations.validateCoupon(code) as ValidatedCoupon | undefined;

    if (!coupon) {
      return NextResponse.json(
        { error: 'Kode kupon tidak valid atau sudah digunakan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        prize_id: coupon.prize_id,
        prize_name: coupon.prize_name,
        prize_description: coupon.prize_description
      }
    });
  } catch (error) {
    console.error('Error validating coupon:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}