import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

function toDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export async function GET() {
  try {
    const startOfWeek = new Date();
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(startOfWeek.getDate() - 6);

    const [
      totalMahasiswa,
      totalLatihan,
      totalMosi,
      agregatSkor,
      totalLayakSparing,
      totalLayakLomba,
      aktivitasTerbaru,
      leaderboard,
      latihanMingguan,
    ] = await Promise.all([
      prisma.users.count({ where: { role: 'user' } }),
      prisma.argumens.count(),
      prisma.motions.count(),
      prisma.argumens.aggregate({ _avg: { skor_AREL: true } }),
      prisma.users.count({ where: { role: 'user', current_level: { gte: 5 } } }),
      prisma.users.count({ where: { role: 'user', current_level: { gte: 10 } } }),
      prisma.argumens.findMany({
        where: { id_user: { not: null } },
        orderBy: [{ timestamp: 'desc' }, { id_argumen: 'desc' }],
        take: 5,
        select: {
          id_argumen: true,
          teks_argumen: true,
          skor_AREL: true,
          timestamp: true,
          users: { select: { nama: true } },
        },
      }),
      prisma.users.findMany({
        where: { role: 'user' },
        orderBy: [{ total_xp: 'desc' }, { id_user: 'asc' }],
        take: 3,
        select: { id_user: true, nama: true, total_xp: true, current_level: true },
      }),
      prisma.argumens.findMany({
        where: { timestamp: { gte: startOfWeek } },
        select: { timestamp: true },
      }),
    ]);

    const trend = Array.from({ length: 7 }, (_, index) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + index);
      return {
        date: toDateKey(day),
        jumlah: 0,
      };
    });
    const trendByDate = new Map(trend.map((item) => [item.date, item]));

    for (const latihan of latihanMingguan) {
      if (!latihan.timestamp) continue;
      const bucket = trendByDate.get(toDateKey(new Date(latihan.timestamp)));
      if (bucket) bucket.jumlah += 1;
    }

    const rataSkorArel = agregatSkor._avg.skor_AREL;

    return NextResponse.json(
      {
        success: true,
        data: {
          totalMahasiswa,
          totalLatihan,
          totalMosi,
          rataSkorArel: rataSkorArel === null ? 0 : Math.round(rataSkorArel),
          tingkatKelayakanSparing: totalMahasiswa === 0
            ? 0
            : Math.round((totalLayakSparing / totalMahasiswa) * 100),
          totalLayakSparing,
          tingkatKelayakanLomba: totalMahasiswa === 0
            ? 0
            : Math.round((totalLayakLomba / totalMahasiswa) * 100),
          totalLayakLomba,
          aktivitasTerbaru: aktivitasTerbaru.map((aktivitas) => ({
            id: aktivitas.id_argumen,
            nama: aktivitas.users?.nama ?? 'Anggota',
            ringkasan: aktivitas.teks_argumen,
            skor: aktivitas.skor_AREL ?? 0,
            waktu: aktivitas.timestamp,
          })),
          leaderboard: leaderboard.map((user) => ({
            id: user.id_user,
            nama: user.nama,
            xp: user.total_xp ?? 0,
            level: user.current_level ?? 1,
          })),
          trenMingguan: trend,
        },
      },
      {
        status: 200,
        headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
      }
    );
  } catch (error: unknown) {
    console.error('ERROR GET ADMIN DASHBOARD STATS:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal memuat statistik dasbor.' },
      { status: 500 }
    );
  }
}
