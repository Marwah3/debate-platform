import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // 1. Hitung total mahasiswa riil (role: user)
    const totalMahasiswa = await prisma.users.count({
      where: { role: 'user' }
    });

    // 2. Hitung total mosi debat terdaftar
    const totalMosi = await prisma.motions.count();

    // 3. Hitung rata-rata skor AREL seluruh mahasiswa dari tabel argumens
    const agregatSkor = await prisma.argumens.aggregate({
      _avg: {
        skor_AREL: true
      }
    });

    // Jika belum ada latihan, default nilai rata-rata adalah 0
    const rataSkorArel = agregatSkor._avg.skor_AREL 
      ? Math.round(agregatSkor._avg.skor_AREL) 
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        totalMahasiswa,
        totalMosi,
        rataSkorArel
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error("ERROR GET ADMIN DASHBOARD STATS:", error);
    return NextResponse.json({ error: 'Gagal memuat statistik dasbor.' }, { status: 500 });
  }
}