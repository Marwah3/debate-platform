import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idUserParam = searchParams.get('id_user') || '1';
    const id_user = parseInt(idUserParam);

    // 1. Ambil data user dari tabel users MySQL
    let user = await prisma.users.findUnique({
      where: { id_user: id_user }
    });

    // JIKA USER BELUM ADA, KITA BUAT DUMMY DENGAN SEMUA KOLOM WAJIB SEPERTI DI SCHEMA
    if (!user) {
      user = await prisma.users.create({
        data: {
          id_user: id_user,
          nama: 'Debater UNIDA',           // Kolom wajib 1
          email: 'student@unida.gontor.ac.id', // Kolom wajib 2
          password: 'hashedpassword123',   // Kolom wajib 3
          total_xp: 0
        }
      });
    }

    // 2. LOGIKA GAMIFIKASI: ALGORITMA LEVELING
    const xpPerLevel = 100;
    const currentXp = user.total_xp ?? 0;
    
    const levelSaatIni = Math.floor(currentXp / xpPerLevel) + 1;
    const xpDalamLevelIni = currentXp % xpPerLevel;
    const sisaXpKeLevelBerikutnya = xpPerLevel - xpDalamLevelIni;
    const persentaseProgressBar = Math.round((xpDalamLevelIni / xpPerLevel) * 100);

    return NextResponse.json({
      success: true,
      data: {
        username: user.nama, // Menggunakan properti 'nama' yang terbukti ada di tabel kamu
        total_xp: currentXp,
        level: levelSaatIni,
        xp_current_level: xpDalamLevelIni,
        xp_next_level: sisaXpKeLevelBerikutnya,
        progress_percentage: persentaseProgressBar
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error("Error pada API User Gamifikasi:", error);
    return NextResponse.json({ error: 'Terjadi kesalahan sistem internal' }, { status: 500 });
  }
}