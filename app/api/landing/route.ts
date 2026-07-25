import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 💡 Paksa Next.js agar API selalu bersifat dinamis & tidak menggunakan static caching
export const dynamic = 'force-dynamic';

// GET: Mengambil semua data konten landing page secara real-time
export async function GET() {
  try {
    const stats = await prisma.landing_stats.findFirst();
    const anggotaList = await prisma.anggota.findMany({ orderBy: { id_anggota: 'asc' } });
    const prestasiList = await prisma.prestasi.findMany({ orderBy: { id_prestasi: 'desc' } });
    const beritaList = await prisma.berita_acara.findMany({ orderBy: { id_berita: 'desc' } });
    const lombaList = await prisma.lomba.findMany({ orderBy: { id_lomba: 'desc' } });

    return NextResponse.json(
      {
        success: true,
        data: {
          stats: stats || { total_anggota: "48+", total_prestasi: "12", total_lomba: "20+" },
          anggota: anggotaList,
          prestasi: prestasiList,
          berita: beritaList,
          lomba: lombaList,
        },
      },
      {
        status: 200,
        headers: {
          // 💡 Matikan browser & server caching sepenuhnya
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  } catch (error: any) {
    console.error("Error fetching landing data:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data landing page", error: error.message },
      { status: 500 }
    );
  }
}