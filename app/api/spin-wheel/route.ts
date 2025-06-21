import { NextRequest, NextResponse } from "next/server";
import { dbOperations } from "@/lib/database";

// Define types for better type safety
interface Prize {
  id: number;
  name: string;
  description: string;
  quantity: number;
  category: 'hadiah' | 'zonk';
  created_at: string;
}

interface UseCouponResult {
  couponResult: { changes: number; lastInsertRowid: number | bigint };
  userResult: { changes: number; lastInsertRowid: number | bigint };
}

export async function POST(request: NextRequest) {
  try {
    const { username, couponCode, prizeName } = await request.json();

    if (!username || !couponCode || !prizeName) {
      return NextResponse.json(
        { error: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    // Validate coupon again
    const coupon = dbOperations.validateCoupon(couponCode);
    if (!coupon) {
      return NextResponse.json(
        { error: "Kode kupon tidak valid atau sudah digunakan" },
        { status: 404 }
      );
    }

    // Get all prizes to find the won prize ID
    const prizes = dbOperations.getAllPrizes();
    const wonPrize = (prizes as Prize[]).find(
      (prize: Prize) => prize.name === prizeName
    );

    if (!wonPrize) {
      return NextResponse.json(
        { error: "Hadiah tidak ditemukan" },
        { status: 404 }
      );
    }

    // Use the coupon and record the win
    const result: UseCouponResult = dbOperations.useCoupon(
      couponCode,
      username,
      wonPrize.id
    );

    // Log the result for debugging purposes
    console.log("Coupon usage result:", result);

    return NextResponse.json({
      success: true,
      message: wonPrize.category === 'hadiah' 
        ? `Selamat ${username}! Anda memenangkan ${prizeName}`
        : `Maaf ${username}, ${prizeName}. Silakan coba lagi!`,
      prize: {
        name: wonPrize.name,
        description: wonPrize.description,
        category: wonPrize.category,
      },
    });
  } catch (error) {
    console.error("Error processing spin:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
