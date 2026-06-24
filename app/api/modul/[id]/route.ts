import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // 1. Ubah tipe data params menjadi Promise
) {
  try {
    // 2. PERBAIKAN UTAMA: Tunggu Promise params selesai dibuka bungkusnya
    const unwrappedParams = await params;
    const id_modul = Number(unwrappedParams.id);

    if (isNaN(id_modul)) {
      return NextResponse.json({ error: 'ID Modul tidak valid' }, { status: 400 });
    }

    // Ambil data modul spesifik dari MySQL
    const modul = await prisma.moduls.findUnique({
      where: { id_modul: id_modul },
    });

    if (!modul) {
      return NextResponse.json({ error: 'Modul tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ data: modul }, { status: 200 });
  } catch (error: any) {
    console.error("EROR GET DETAIL MODUL:", error);
    return NextResponse.json({ error: 'Terjadi kesalahan internal server' }, { status: 500 });
  }
}