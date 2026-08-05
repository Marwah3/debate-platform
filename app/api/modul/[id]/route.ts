import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// [GET] Mengambil Detail 1 Modul Berdasarkan ID (/api/modul/[id])
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const id_user = searchParams.get('id_user');

    const unwrappedParams = await params;
    const id_modul = Number(unwrappedParams.id);

    if (isNaN(id_modul)) {
      return NextResponse.json(
        { success: false, error: 'ID Modul tidak valid' },
        { status: 400 }
      );
    }

    // Ambil data modul beserta kuisnya
    const modul = await prisma.moduls.findUnique({
      where: { id_modul: id_modul },
      include: {
        quizzes: true,
      },
    });

    if (!modul) {
      return NextResponse.json(
        { success: false, error: 'Materi modul tidak ditemukan' },
        { status: 404 }
      );
    }

    // Cek status pengerjaan kuis dari tabel log_kuis
    let isCompleted = false;
    if (id_user) {
      const userLog = await prisma.log_kuis.findFirst({
        where: {
          id_user: Number(id_user),
          id_modul: id_modul,
          is_lulus: true,
        },
      });
      isCompleted = !!userLog;
    }

    return NextResponse.json({
      success: true,
      data: {
        ...modul,
        is_completed: isCompleted,
      },
    }, { status: 200 });
  } catch (error: any) {
    console.error("❌ ERROR GET DETAIL MODUL BY ID:", error.message || error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan internal server' },
      { status: 500 }
    );
  }
}