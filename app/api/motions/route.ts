import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 1. [GET] Mengambil seluruh mosi dari database MySQL
export async function GET() {
  try {
    const daftarMosi = await prisma.motions.findMany({
      orderBy: {
        created_at: 'desc'
      }
    });
    return NextResponse.json({ success: true, data: daftarMosi }, { status: 200 });
  } catch (error: any) {
    console.warn("❌ API GET MOTIONS ERROR:", error.message || error);
    return NextResponse.json({ error: 'Gagal mengambil data mosi dari database' }, { status: 500 });
  }
}

// 2. [POST] Menyimpan mosi baru dari input Admin
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { teks, jenis, bahasa } = body;

    if (!teks?.trim() || !jenis?.trim()) {
      return NextResponse.json({ error: 'Teks mosi dan jenis mosi wajib diisi.' }, { status: 400 });
    }

    const bahasaValid = bahasa && ['id', 'en', 'ar'].includes(bahasa) ? bahasa : 'id';

    const mosiBaru = await prisma.motions.create({
      data: {
        teks: teks.trim(),
        jenis: jenis.trim(),
        bahasa: bahasaValid
      }
    });

    return NextResponse.json({ success: true, data: mosiBaru }, { status: 201 });
  } catch (error: any) {
    console.warn("❌ API POST MOTIONS ERROR:", error.message || error);
    return NextResponse.json({ error: 'Gagal menyimpan mosi baru ke database' }, { status: 500 });
  }
}

// 3. [DELETE] Menghapus mosi berdasarkan ID parameter URL
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID mosi diperlukan.' }, { status: 400 });
    }

    await prisma.motions.delete({
      where: {
        id_motion: Number(id)
      }
    });

    return NextResponse.json({ success: true, message: 'Mosi berhasil dihapus' }, { status: 200 });
  } catch (error: any) {
    console.warn("❌ API DELETE MOTIONS ERROR:", error.message || error);
    return NextResponse.json({ error: 'Gagal menghapus mosi dari database' }, { status: 500 });
  }
}