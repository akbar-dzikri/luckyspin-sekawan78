import { NextResponse } from "next/server";
import { dbOperations } from "@/lib/database";

export async function GET() {
  try {
    const users = dbOperations.getAllUsers();
    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
