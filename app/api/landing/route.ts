import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 💡 Paksa Next.js agar API selalu bersifat dinamis & tidak menggunakan static caching
export const dynamic = 'force-dynamic';

// GET: Mengambil semua data konten landing page secara real-time
export async function GET() {
  try {
    const [statsRows, totalAnggota, anggotaList, prestasiList, beritaList, lombaList] = await Promise.all([
      prisma.$queryRaw<Array<{
        total_anggota: string;
        total_prestasi: string;
        total_lomba: string;
        hero_img: string | null;
        about_img: string | null;
        group_img: string | null;
        cta_img: string | null;
        about_content: string | null;
      }>>`
        SELECT total_anggota, total_prestasi, total_lomba, hero_img, about_img, group_img, cta_img, about_content
        FROM landing_stats
        ORDER BY id_stats ASC
        LIMIT 1
      `,
      prisma.users.count({ where: { role: 'user' } }),
      prisma.anggota.findMany({ orderBy: { id_anggota: 'asc' } }),
      prisma.prestasi.findMany({ orderBy: { id_prestasi: 'desc' } }),
      prisma.berita_acara.findMany({ orderBy: { id_berita: 'desc' } }),
      prisma.lomba.findMany({ orderBy: { id_lomba: 'desc' } }),
    ]);

    const stats = statsRows[0] ?? {
      total_anggota: '0',
      total_prestasi: '0',
      total_lomba: '0',
      hero_img: null,
      about_img: null,
      group_img: null,
      cta_img: null,
      about_content: null,
    };

    const liveStats = {
      ...stats,
      total_anggota: String(totalAnggota),
      total_prestasi: String(prestasiList.length),
      total_lomba: String(lombaList.length),
    };

    return NextResponse.json(
      {
        success: true,
        data: {
          stats: liveStats,
          anggota: anggotaList,
          prestasi: prestasiList,
          berita: beritaList,
          lomba: lombaList.map((item) => ({
            ...item,
            nama: item.nama_lomba,
            level: item.kategori || 'Kompetisi',
            kota: item.lokasi,
            img_url: item.image_url,
          })),
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