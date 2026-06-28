import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// =========================================================================
// 1. GET: MENAMPILKAN SEMUA MOSI
// =========================================================================
export async function GET() {
  try {
    // PERBAIKAN: Menggunakan prisma.motion (singular) sesuai generate client
    const allMotions = await prisma.motions.findMany({
      orderBy: {
        id_motion: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: allMotions,
    }, { status: 200 });

  } catch (error: any) {
    console.error("ERROR GET MOTIONS API:", error);
    return NextResponse.json({ error: 'Gagal memuat daftar mosi dari database internal.' }, { status: 500 });
  }
}

// =========================================================================
// 2. POST: MENAMBAH MOSI BARU
// =========================================================================
export async function POST(request: Request) {
  try {
    const { teks, jenis } = await request.json();

    if (!teks || !jenis) {
      return NextResponse.json({ error: 'Teks mosi dan jenis kategori wajib diisi!' }, { status: 400 });
    }

    // PERBAIKAN: Menggunakan prisma.motion
    const newMotion = await prisma.motions.create({
      data: {
        teks: teks.trim(),
        jenis: jenis,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Mosi latihan berhasil disimpan.',
      data: newMotion,
    }, { status: 201 });

  } catch (error: any) {
    console.error("ERROR POST MOTION API:", error);
    return NextResponse.json({ error: 'Gagal menyimpan mosi baru ke database.' }, { status: 500 });
  }
}

// =========================================================================
// 3. DELETE: MENGHAPUS MOSI
// =========================================================================
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idStr = searchParams.get('id');

    if (!idStr) {
      return NextResponse.json({ error: 'Parameter ID mosi tidak ditemukan.' }, { status: 400 });
    }

    const idMotion = Number(idStr);

    // PERBAIKAN: Menggunakan prisma.motion
    await prisma.motions.delete({
      where: {
        id_motion: idMotion,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Mosi berhasil dihapus dari sistem database.',
    }, { status: 200 });

  } catch (error: any) {
    console.error("ERROR DELETE MOTION API:", error);
    return NextResponse.json({ error: 'Gagal menghapus mosi. Pastikan ID valid.' }, { status: 500 });
  }
}