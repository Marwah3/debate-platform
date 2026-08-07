import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Helper Function: Kalkulasi Level Berdasarkan Total XP (Level 1 - 10)
function calculateLevel(totalXp: number): number {
  if (totalXp >= 3000) return 10;
  if (totalXp >= 2600) return 9;
  if (totalXp >= 2200) return 8;
  if (totalXp >= 1800) return 7;
  if (totalXp >= 1400) return 6;
  if (totalXp >= 1000) return 5;
  if (totalXp >= 700)  return 4;
  if (totalXp >= 400)  return 3;
  if (totalXp >= 150)  return 2;
  return 1;
}

// 1. MENGAMBIL DAFTAR SOAL KUIS (GET)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id_modul: string }> }
) {
  try {
    const unwrappedParams = await params;
    const idModulNum = Number(unwrappedParams?.id_modul);

    if (isNaN(idModulNum)) {
      return NextResponse.json({ error: 'ID Modul tidak valid' }, { status: 400 });
    }

    // Ambil semua bank soal kuis yang terikat dengan ID Modul ini
    const bankSoal = await prisma.quizzes.findMany({
      where: { id_modul: idModulNum },
    });

    return NextResponse.json({ success: true, data: bankSoal }, { status: 200 });
  } catch (error: any) {
    console.error("❌ GAGAL GET BANK SOAL KUIS:", error.message || error);
    return NextResponse.json({ error: 'Gagal memuat bank soal kuis dari database' }, { status: 500 });
  }
}

// 2. PROSES EVALUASI SKOR, XP, LEVEL, UNLOCK MODUL, DAN LOG (POST)
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id_modul: string }> }
) {
  try {
    const unwrappedParams = await params;
    const idModulNum = Number(unwrappedParams?.id_modul);
    
    // Ambil data skor dan id_user yang dikirim oleh frontend kuis
    const { skor, id_user } = await request.json();

    if (!id_user || isNaN(idModulNum)) {
      return NextResponse.json({ error: 'Data evaluasi kompetensi tidak lengkap' }, { status: 400 });
    }

    const userIdNum = Number(id_user);
    const skorNum = Number(skor) || 0;
    const isLulus = skorNum >= 70; // Standar kelulusan minimum 70

    let xpBonus = 0;
    let isRepeatCompletion = false;

    // Evaluasi Kelulusan
    if (isLulus) {
      // A. UNLOCK MODUL SELANJUTNYA: Cari urutan modul saat ini
      const currentModul = await prisma.moduls.findUnique({
        where: { id_modul: idModulNum }
      });

      if (currentModul) {
        const urutanBerikutnya = (currentModul.urutan ?? 0) + 1;

        // Ubah status_lock modul berikutnya menjadi false
        await prisma.moduls.updateMany({
          where: { urutan: urutanBerikutnya },
          data: { status_lock: false }
        });
      }

      // B. CEK PROTEKSI SPAM XP: Cek apakah user sudah PERNAH LULUS kuis modul ini sebelumnya
      let existingLog: any = null;
      try {
        existingLog = await (prisma as any).log_kuis.findFirst({
          where: {
            id_user: userIdNum,
            id_modul: idModulNum,
            is_lulus: true,
          }
        });
      } catch (err) {
        console.warn("⚠️ Warning: log_kuis belum terdeteksi saat pengecekan riwayat.");
      }

      // C. HANYA BERIKAN XP JIKA PERTAMA KALI LULUS
      if (!existingLog) {
        xpBonus = 50; // Bonus +50 XP per modul yang baru lulus
      } else {
        isRepeatCompletion = true;
      }

      // D. CATAT KE TABEL LOG_KUIS
      try {
        await (prisma as any).log_kuis.create({
          data: {
            id_user: userIdNum,
            id_modul: idModulNum,
            nilai: skorNum,
            is_lulus: true,
            xp_diperoleh: xpBonus,
          }
        });
      } catch (err) {
        console.warn("⚠️ Warning: Gagal membuat record di log_kuis.");
      }

      // E. UPDATE GAMIFIKASI USER (TOTAL XP & CURRENT LEVEL) HANYA JIKA MENDAPAT XP BARU
      if (xpBonus > 0) {
        const userLama = await prisma.users.findUnique({ 
          where: { id_user: userIdNum } 
        });

        if (userLama) {
          const xpLama = userLama.total_xp || 0;
          const totalXpBaru = xpLama + xpBonus; 
          const levelBaru = calculateLevel(totalXpBaru);

          await prisma.users.update({
            where: { id_user: userIdNum },
            data: {
              total_xp: totalXpBaru,
              current_level: levelBaru
            }
          });
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      is_lulus: isLulus,
      xp_diperoleh: xpBonus,
      is_repeat: isRepeatCompletion,
      message: isLulus 
        ? (isRepeatCompletion 
            ? 'Kuis selesai dikerjakan kembali! (XP tidak bertambah karena modul sudah pernah lulus).' 
            : `Selamat! Kamu lulus kuis dan memperoleh +${xpBonus} XP!`)
        : 'Nilai kuis belum memenuhi batas minimum kelulusan (70).'
    }, { status: 200 });

  } catch (error: any) {
    console.error("❌ GAGAL MEMPROSES POST UNLOCK KUIS:", error.message || error);
    return NextResponse.json({ error: 'Terjadi kesalahan sistem sinkronisasi backend' }, { status: 500 });
  }
}