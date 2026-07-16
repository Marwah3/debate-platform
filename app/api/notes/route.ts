import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 1. [GET] Mengambil seluruh catatan milik user tertentu
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id_user = searchParams.get('id_user');

    if (!id_user || id_user === 'undefined' || id_user === 'null') {
      return NextResponse.json({ error: 'ID User tidak valid atau kosong' }, { status: 400 });
    }

    // Pemanggilan objek 'notes' kini aman dan dikenali oleh TypeScript
    const kumpulanCatatan = await prisma.notes.findMany({
      where: { 
        id_user: Number(id_user) 
      },
      orderBy: { 
        created_at: 'desc' 
      },
    });

    return NextResponse.json({ success: true, data: kumpulanCatatan }, { status: 200 });
  } catch (error: any) {
    console.error("❌ BACKEND GET ERROR:", error.message || error);
    return NextResponse.json({ error: 'Gagal memuat data dari database', details: error.message }, { status: 500 });
  }
}

// 2. [POST] Menyimpan catatan baru ke database
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id_user, judul_catatan, isi_catatan } = body;

    if (!id_user) {
      return NextResponse.json({ error: 'Gagal menyimpan: ID User kosong.' }, { status: 400 });
    }
    if (!judul_catatan?.trim() || !isi_catatan?.trim()) {
      return NextResponse.json({ error: 'Judul dan isi catatan wajib diisi.' }, { status: 400 });
    }

    // Eksekusi insert langsung ke tabel notes menggunakan skema relasi baru
    const catatanBaru = await prisma.notes.create({
      data: {
        id_user: Number(id_user),
        judul_catatan: judul_catatan.trim(),
        isi_catatan: isi_catatan.trim(),
      },
    });

    return NextResponse.json({ success: true, data: catatanBaru }, { status: 201 });
  } catch (error: any) {
    console.error("❌ BACKEND POST ERROR:", error.message || error);
    return NextResponse.json({ error: 'Gagal memproses penyimpanan ke database', details: error.message }, { status: 500 });
  }
}

// 3. [DELETE] Menghapus catatan
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id_note = searchParams.get('id_note');

    if (!id_note) {
      return NextResponse.json({ error: 'ID Note diperlukan' }, { status: 400 });
    }

    await prisma.notes.delete({
      where: { 
        id_note: Number(id_note) 
      },
    });

    return NextResponse.json({ success: true, message: 'Catatan berhasil dihapus' }, { status: 200 });
  } catch (error: any) {
    console.error("❌ BACKEND DELETE ERROR:", error.message || error);
    return NextResponse.json({ error: 'Gagal menghapus catatan', details: error.message }, { status: 500 });
  }
}