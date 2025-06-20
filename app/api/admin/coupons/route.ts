import { NextRequest, NextResponse } from "next/server";
import { dbOperations } from "@/lib/database";

export async function GET() {
  try {
    const coupons = dbOperations.getAllCoupons();
    return NextResponse.json({ coupons });
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { code, prizeId } = await request.json();

    if (!code || code.length !== 5) {
      return NextResponse.json(
        { error: "Kode kupon harus 5 karakter" },
        { status: 400 }
      );
    }

    // Check if code already exists
    const existingCoupons = dbOperations.getAllCoupons();
    const codeExists = existingCoupons.some(
      (coupon: any) => coupon.code === code
    );

    if (codeExists) {
      return NextResponse.json(
        { error: "Kode kupon sudah ada" },
        { status: 400 }
      );
    }

    const result = dbOperations.addCoupon(
      code,
      prizeId ? parseInt(prizeId) : undefined
    );

    return NextResponse.json({
      success: true,
      message: "Kupon berhasil ditambahkan",
      id: result.lastInsertRowid,
    });
  } catch (error) {
    console.error("Error adding coupon:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, code, prizeId } = await request.json();

    if (!id || !code || code.length !== 5) {
      return NextResponse.json(
        { error: "ID dan kode kupon (5 karakter) harus diisi" },
        { status: 400 }
      );
    }

    // Check if code already exists (excluding current coupon)
    const existingCoupons = dbOperations.getAllCoupons();
    const codeExists = existingCoupons.some(
      (coupon: any) => coupon.code === code && coupon.id !== parseInt(id)
    );

    if (codeExists) {
      return NextResponse.json(
        { error: "Kode kupon sudah ada" },
        { status: 400 }
      );
    }

    dbOperations.updateCoupon(
      parseInt(id),
      code,
      prizeId ? parseInt(prizeId) : undefined
    );

    return NextResponse.json({
      success: true,
      message: "Kupon berhasil diperbarui",
    });
  } catch (error) {
    console.error("Error updating coupon:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID kupon harus diisi" },
        { status: 400 }
      );
    }

    dbOperations.deleteCoupon(parseInt(id));

    return NextResponse.json({
      success: true,
      message: "Kupon berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting coupon:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
