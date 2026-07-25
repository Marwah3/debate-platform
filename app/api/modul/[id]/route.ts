import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// [GET] Mengambil Detail 1 Modul Berdasarkan ID (/api/modul/[id])
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Unwrap params (Next.js App Router Terbaru)
    const unwrappedParams = await params;
    const id_modul = Number(unwrappedParams.id);

    if (isNaN(id_modul)) {
      return NextResponse.json(
        { success: false, error: 'ID Modul tidak valid' },
        { status: 400 }
      );
    }

    // 2. Cari data modul spesifik berdasarkan id_modul di MySQL via Prisma
    const modul = await prisma.moduls.findUnique({
      where: { id_modul: id_modul },
    });

    if (!modul) {
      return NextResponse.json(
        { success: false, error: 'Materi modul tidak ditemukan' },
        { status: 404 }
      );
    }

    // 3. Kembalikan data modul tunggal
    return NextResponse.json({ success: true, data: modul }, { status: 200 });
  } catch (error: any) {
    console.error("❌ ERROR GET DETAIL MODUL BY ID:", error.message || error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan internal server' },
      { status: 500 }
    );
  }
}