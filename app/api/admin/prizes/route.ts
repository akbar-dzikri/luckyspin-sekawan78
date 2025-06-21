import { NextRequest, NextResponse } from "next/server";
import { dbOperations } from "@/lib/database";

export async function GET() {
  try {
    const prizes = dbOperations.getAllPrizes();
    return NextResponse.json({ prizes });
  } catch (error) {
    console.error("Error fetching prizes:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, quantity, category } = await request.json();

    if (!name || quantity === undefined) {
      return NextResponse.json(
        { error: "Nama hadiah dan kuantitas harus diisi" },
        { status: 400 }
      );
    }

    const result = dbOperations.addPrize(
      name,
      description || "",
      parseInt(quantity),
      category || 'hadiah'
    );

    return NextResponse.json({
      success: true,
      message: "Hadiah berhasil ditambahkan",
      id: result.lastInsertRowid,
    });
  } catch (error) {
    console.error("Error adding prize:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, name, description, quantity, category } = await request.json();

    if (!id || !name || quantity === undefined) {
      return NextResponse.json(
        { error: "ID, nama hadiah dan kuantitas harus diisi" },
        { status: 400 }
      );
    }

    dbOperations.updatePrize(
      parseInt(id),
      name,
      description || "",
      parseInt(quantity),
      category || 'hadiah'
    );

    return NextResponse.json({
      success: true,
      message: "Hadiah berhasil diperbarui",
    });
  } catch (error) {
    console.error("Error updating prize:", error);
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
        { error: "ID hadiah harus diisi" },
        { status: 400 }
      );
    }

    dbOperations.deletePrize(parseInt(id));

    return NextResponse.json({
      success: true,
      message: "Hadiah berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting prize:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
