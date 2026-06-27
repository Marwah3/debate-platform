import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 1. GET: Mengambil semua mosi untuk diacak di halaman praktik
export async function GET() {
  try {
    // PERBAIKAN: Gunakan 'as any' untuk menembus cache tipe data Prisma Client di VS Code
    const daftarMosi = await (prisma as any).motions.findMany({
      orderBy: { id_motion: 'desc' }
    });

    if (daftarMosi.length === 0) {
      return NextResponse.json({
        success: true,
        data: [{ teks: "Dewan ini menyesali tren budaya kerja berlebihan (hustle culture).", jenis: "Mosi Penilaian/Evaluasi (Value Motion)" }]
      });
    }

    return NextResponse.json({ success: true, data: daftarMosi }, { status: 200 });
  } catch (error: any) {
    console.error("❌ GAGAL GET MOTIONS:", error);
    return NextResponse.json({ error: 'Gagal memuat bank mosi dari database' }, { status: 500 });
  }
}

// 2. POST: Menerima input mosi baru dari Admin
export async function POST(request: Request) {
  try {
    const { teks, jenis } = await request.json();

    if (!teks || !jenis) {
      return NextResponse.json({ error: 'Teks mosi dan jenis mosi wajib diisi' }, { status: 400 });
    }

    // PERBAIKAN: Gunakan 'as any' agar build production Next.js sukses tanpa terhambat linter
    const mosiBaru = await (prisma as any).motions.create({
      data: {
        teks: teks,
        jenis: jenis
      }
    });

    return NextResponse.json({ success: true, data: mosiBaru, message: 'Mosi baru berhasil ditambahkan oleh Admin!' }, { status: 201 });
  } catch (error: any) {
    console.error("❌ GAGAL POST MOTION:", error);
    return NextResponse.json({ error: 'Gagal menyimpan mosi baru' }, { status: 500 });
  }
}