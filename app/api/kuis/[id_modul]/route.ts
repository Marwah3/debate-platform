import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id_modul: string }> }
) {
  try {
    // 1. Unbox parameter ID Modul dari Promise Next.js 16
    const unwrappedParams = await params;
    const idModulNum = Number(unwrappedParams.id_modul);

    if (isNaN(idModulNum)) {
      return NextResponse.json({ error: 'ID Modul kuis tidak valid' }, { status: 400 });
    }

    // 2. Ambil seluruh daftar soal yang memiliki relasi id_modul tersebut
    const daftarQuiz = await prisma.quizzes.findMany({
      where: {
        id_modul: idModulNum
      }
    });

    return NextResponse.json({ success: true, data: daftarQuiz }, { status: 200 });

  } catch (error: any) {
    console.error("❌ EROR GET QUIZ DATABASE:", error.message || error);
    return NextResponse.json({ error: 'Terjadi kesalahan internal pada server kuis' }, { status: 500 });
  }
}