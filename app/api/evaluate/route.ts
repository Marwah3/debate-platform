import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { teks_argumen, id_user } = body;

    // 1. Validasi input awal
    if (!teks_argumen || teks_argumen.trim() === "") {
      return NextResponse.json({ error: 'Teks argumen tidak boleh kosong' }, { status: 400 });
    }

    // =========================================================================
    // SIMULASI PROSES EVALUATOR JURI AI RAG (Struktur Kriteria Penilaian AREL)
    // =========================================================================
    const skor_assertion = 85;
    const skor_reasoning = 78;
    const skor_evidence = 70;
    const skor_linkback = 80;
    const total_skor_arel = Math.round((skor_assertion + skor_reasoning + skor_evidence + skor_linkback) / 4);
    
    const catatan_koreksi = "Argumen Assertion kamu sudah cukup tegas menyampaikan posisi. Namun, bagian Evidence (bukti) masih berupa klaim sepihak; disarankan menyertakan data riset atau studi kasus riil tentang dampak media sosial pada pelajar untuk memperkuat basis argumen. Pada Link-back, pastikan kesimpulan ditarik lurus kembali ke mosi utama.";

    // 2. Simpan hasil penilaian Juri AI ke MySQL dengan kolom yang SESUAI skema kamu
    const argumenBaru = await prisma.argumens.create({
      data: {
        id_user: id_user ? Number(id_user) : null, // Menerima id_user atau null jika anonim
        teks_argumen: teks_argumen,                // Sesuai field @db.Text di skema
        skor_AREL: total_skor_arel,                // Menggunakan huruf kapital AREL sesuai skema
        feedback_ai: catatan_koreksi,              // Sesuai field feedback_ai di skema
        xp_diperoleh: 50,                          // Memberikan reward 50 XP ke user setelah praktik
      },
    });

    // 3. Jika user login, kita secara otomatis tambahkan total_xp miliknya di tabel users
    if (id_user) {
      await prisma.users.update({
        where: { id_user: Number(id_user) },
        data: {
          total_xp: {
            increment: 50
          }
        }
      });
    }

    // 4. Kirim respon sukses ke frontend
    return NextResponse.json({
      success: true,
      message: 'Evaluasi argumen juri AI berhasil disimpan!',
      data: {
        skor: total_skor_arel,
        detail_skor: {
          assertion: skor_assertion,
          reasoning: skor_reasoning,
          evidence: skor_evidence,
          linkback: skor_linkback
        },
        catatan: catatan_koreksi,
        xp_masuk: 50
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error("❌ EROR UTAMA INTERNAL SERVER 500:", error.message || error);
    return NextResponse.json({ 
      error: 'Terjadi kegagalan sistem internal pada server evaluator AI.',
      detail: error.message 
    }, { status: 500 });
  }
}