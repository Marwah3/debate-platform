import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 1. [GET] Mengambil semua daftar materi silabus diurutkan berdasarkan bab
export async function GET() {
  try {
    const daftarMateri = await prisma.moduls.findMany({
      orderBy: {
        urutan: 'asc' // Diurutkan berdasarkan kolom 'urutan' di database
      }
    });
    return NextResponse.json({ success: true, data: daftarMateri }, { status: 200 });
  } catch (error: any) {
    console.warn("❌ API GET MODUL ERROR:", error.message || error);
    return NextResponse.json({ error: 'Gagal memuat materi pembelajaran' }, { status: 500 });
  }
}

// 2. [POST] Menambahkan bab materi baru dari halaman Admin
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, order_num, language } = body;

    if (!title?.trim() || !content?.trim() || !order_num) {
      return NextResponse.json({ error: 'Judul, konten materi, dan nomor urut bab wajib diisi.' }, { status: 400 });
    }

    const materiBaru = await prisma.moduls.create({
      data: {
        judul: title.trim(),
        konten_materi: content.trim(),
        urutan: Number(order_num),
        //@ts-ignore
        bahasa: language || 'id',
        status_lock: true // Default terkunci untuk user baru sebelum lulus kuis bab sebelumnya
      }
    });

    return NextResponse.json({ success: true, data: materiBaru }, { status: 201 });
  } catch (error: any) {
    console.warn("❌ API POST MODUL ERROR:", error.message || error);
    return NextResponse.json({ error: 'Gagal menyimpan materi baru ke database' }, { status: 500 });
  }
}