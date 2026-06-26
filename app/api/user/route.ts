import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    // Ambil parameter id_user dari URL query string
    const { searchParams } = new URL(request.url);
    const id_user = searchParams.get('id_user');

    if (!id_user) {
      return NextResponse.json({ error: 'ID User wajib disertakan' }, { status: 400 });
    }

    // Ambil data profil user real-time dari MySQL
    const user = await prisma.users.findUnique({
      where: { id_user: Number(id_user) },
    });

    if (!user) {
      return NextResponse.json({ error: 'Akun debater tidak ditemukan' }, { status: 404 });
    }

    // Hitung persentase progress menuju level selanjutnya untuk komponen progress bar Tailwind
    const currentXp = user.total_xp || 0;
    const xpCurrentLevel = currentXp % 100; // Sisa XP di level sekarang
    const xpNextLevel = 100 - xpCurrentLevel; // Sisa XP yang dibutuhkan untuk naik level
    const progressPercentage = xpCurrentLevel; // Karena kelipatan per 100 XP, sisa poin langsung menjadi persen

    return NextResponse.json({
      success: true,
      data: {
        id_user: user.id_user,
        nama: user.nama,
        email: user.email,
        current_level: user.current_level,
        total_xp: user.total_xp,
        xp_current_level: xpCurrentLevel,
        xp_next_level: xpNextLevel,
        progress_percentage: progressPercentage
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error("❌ GAGAL GET API USER GAMIFIKASI:", error.message || error);
    return NextResponse.json({ error: 'Gagal memuat status kompetensi user' }, { status: 500 });
  }
}