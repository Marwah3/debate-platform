import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 1. MENGAMBIL DAFTAR SOAL KUIS (GET)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id_modul: string }> }
) {
  try {
    const unwrappedParams = await params;
    const idModulNum = Number(unwrappedParams.id_modul);

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

// 2. PROSES EVALUASI SKOR, XP, LEVEL, DAN UNLOCK MODUL (POST)
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id_modul: string }> }
) {
  try {
    const unwrappedParams = await params;
    const idModulNum = Number(unwrappedParams.id_modul);
    
    // Ambil data skor dan id_user yang dikirim oleh frontend kuis
    const { skor, id_user } = await request.json();

    if (!id_user || isNaN(idModulNum)) {
      return NextResponse.json({ error: 'Data evaluasi kompetensi tidak lengkap' }, { status: 400 });
    }

    // Evaluasi Kelulusan: Jika skor mahasiswa mencapai batas minimal lulus (70)
    if (skor >= 70) {
      // A. Cari urutan dari modul yang baru saja dikerjakan kuisnya
      const currentModul = await prisma.moduls.findUnique({
        where: { id_modul: idModulNum }
      });

      if (currentModul) {
        const urutanBerikutnya = currentModul.urutan + 1;

        // B. UNLOCK MODUL SELANJUTNYA: Ubah status_lock menjadi false di MySQL
        await prisma.moduls.updateMany({
          where: { urutan: urutanBerikutnya },
          data: { status_lock: false }
        });
      }

      // C. UPDATE GAMIFIKASI USER: Ambil status XP saat ini di database
        const userLama = await prisma.users.findUnique({ 
        where: { id_user: Number(id_user) } 
      });

      if (userLama) {
        //'|| 0' untuk mengantisipasi jika total_xp berstatus null di database
        const xpLama = userLama.total_xp || 0;
        const totalXpBaru = xpLama + 100; 
        
        // Logika naik level berkelanjutan secara objektif: 1 Level tiap kelipatan 100 XP
        const levelBaru = Math.floor(totalXpBaru / 100) + 1; 

        // Simpan akumulasi kompetensi baru ke dalam database tabel users
        await prisma.users.update({
          where: { id_user: Number(id_user) },
          data: {
            total_xp: totalXpBaru,
            current_level: levelBaru
          }
        });
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Sinkronisasi gamifikasi dan status lock ke MySQL sukses!' 
    }, { status: 200 });

  } catch (error: any) {
    console.error("❌ GAGAL MEMPROSES POST UNLOCK KUIS:", error.message || error);
    return NextResponse.json({ error: 'Terjadi kesalahan sistem sinkronisasi backend' }, { status: 500 });
  }
}