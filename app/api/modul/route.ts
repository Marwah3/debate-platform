import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Mengambil seluruh modul silabus dari database MySQL murni
    const daftarModul = await prisma.moduls.findMany({
      orderBy: {
        urutan: 'asc',
      },
    });

    return NextResponse.json({ success: true, data: daftarModul }, { status: 200 });
  } catch (error: any) {
    console.error("❌ EROR GET DAFTAR MODUL:", error.message || error);
    return NextResponse.json({ error: 'Gagal memuat daftar modul dari database' }, { status: 500 });
  }
}