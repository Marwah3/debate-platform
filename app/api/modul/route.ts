import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 1. [GET] Mengambil semua daftar materi silabus diurutkan berdasarkan bab
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id_user = searchParams.get('id_user');

    // Ambil daftar modul utama
    const daftarMateri = await prisma.moduls.findMany({
      orderBy: {
        urutan: 'asc',
      },
    });

    let completedModulIds: number[] = [];

    // Jika id_user dikirim, cek modul mana saja yang sudah LULUS di tabel log_kuis
    if (id_user) {
      const userLogs = await prisma.log_kuis.findMany({
        where: {
          id_user: Number(id_user),
          is_lulus: true,
        },
        select: {
          id_modul: true,
        },
      });
      completedModulIds = userLogs.map((log) => log.id_modul);
    }

    // Petakan data untuk menyertakan bendera `is_completed`
    const formattedData = daftarMateri.map((m) => ({
      ...m,
      is_completed: completedModulIds.includes(m.id_modul),
    }));

    return NextResponse.json({ success: true, data: formattedData }, { status: 200 });
  } catch (error: any) {
    console.error("❌ API GET MODUL ERROR:", error.message || error);
    return NextResponse.json({ error: 'Gagal memuat materi pembelajaran' }, { status: 500 });
  }
}

// 2. [POST] Menambahkan bab materi baru dari halaman Admin
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, order_num, language, status_lock } = body;

    if (!title?.trim() || !content?.trim() || order_num === undefined || order_num === null) {
      return NextResponse.json({ error: 'Judul, konten materi, dan nomor urut bab wajib diisi.' }, { status: 400 });
    }

    const materiBaru = await prisma.moduls.create({
      data: {
        judul: title.trim(),
        konten_materi: content.trim(),
        urutan: Number(order_num),
        // @ts-ignore
        bahasa: language || 'id',
        status_lock: status_lock !== undefined ? Boolean(status_lock) : true,
      },
    });

    return NextResponse.json({ success: true, data: materiBaru }, { status: 201 });
  } catch (error: any) {
    console.error("❌ API POST MODUL ERROR:", error.message || error);
    return NextResponse.json({ error: 'Gagal menyimpan materi baru ke database' }, { status: 500 });
  }
}

// 3. [PUT] Mengedit / memperbarui bab materi silabus yang ada
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id_modul, title, content, order_num, language, status_lock } = body;

    if (!id_modul) {
      return NextResponse.json({ error: 'ID Modul wajib disertakan.' }, { status: 400 });
    }

    if (!title?.trim() || !content?.trim() || order_num === undefined || order_num === null) {
      return NextResponse.json({ error: 'Judul, konten materi, dan nomor urut bab wajib diisi.' }, { status: 400 });
    }

    const materiUpdated = await prisma.moduls.update({
      where: { id_modul: Number(id_modul) },
      data: {
        judul: title.trim(),
        konten_materi: content.trim(),
        urutan: Number(order_num),
        // @ts-ignore
        bahasa: language || 'id',
        status_lock: Boolean(status_lock),
      },
    });

    return NextResponse.json({ success: true, data: materiUpdated }, { status: 200 });
  } catch (error: any) {
    console.error("❌ API PUT MODUL ERROR:", error.message || error);
    return NextResponse.json({ error: 'Gagal memperbarui materi di database' }, { status: 500 });
  }
}

// 4. [DELETE] Menghapus bab materi dari silabus
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID Modul tidak ditemukan.' }, { status: 400 });
    }

    await prisma.moduls.delete({
      where: { id_modul: Number(id) },
    });

    return NextResponse.json({
      success: true,
      message: 'Materi silabus berhasil dihapus!',
    }, { status: 200 });
  } catch (error: any) {
    console.error("❌ API DELETE MODUL ERROR:", error.message || error);
    return NextResponse.json({ success: false, error: 'Gagal menghapus materi dari database' }, { status: 500 });
  }
}