import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST / PUT: Update Statistik atau Tambah Berita/Prestasi Baru
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, payload } = body;

    // 1. Simpan/Update Statistik Hero
    if (type === 'stats') {
      const existingStats = await prisma.landing_stats.findFirst();
      if (existingStats) {
        await prisma.landing_stats.update({
          where: { id_stats: existingStats.id_stats },
          data: {
            total_anggota: payload.total_anggota,
            total_prestasi: payload.total_prestasi,
            total_lomba: payload.total_lomba,
            hero_img: payload.hero_img || existingStats.hero_img,
          },
        });
      } else {
        await prisma.landing_stats.create({
          data: {
            total_anggota: payload.total_anggota,
            total_prestasi: payload.total_prestasi,
            total_lomba: payload.total_lomba,
            hero_img: payload.hero_img || null,
          },
        });
      }
      return NextResponse.json({ success: true, message: 'Statistik berhasil diperbarui!' });
    }

    // 2. Tambah Berita Acara Baru
    if (type === 'berita') {
      await prisma.berita_acara.create({
        data: {
          title: payload.title,
          date: payload.date,
          tag: payload.tag,
          desc: payload.desc,
          img_url: payload.img_url || null,
        },
      });
      return NextResponse.json({ success: true, message: 'Berita acara berhasil ditambahkan!' });
    }

    // 3. Tambah Prestasi Baru
    if (type === 'prestasi') {
      await prisma.prestasi.create({
        data: {
          juara: payload.juara,
          lomba: payload.lomba,
          tahun: payload.tahun,
          penyelenggara: payload.penyelenggara,
          img_url: payload.img_url || null,
        },
      });
      return NextResponse.json({ success: true, message: 'Prestasi berhasil ditambahkan!' });
    }

    return NextResponse.json({ success: false, message: 'Tipe aksi tidak valid' }, { status: 400 });
  } catch (error) {
    console.error("Error saving admin landing data:", error);
    return NextResponse.json({ success: false, message: 'Gagal menyimpan data ke database' }, { status: 500 });
  }
}

// DELETE: Hapus Item Berita atau Prestasi
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const id = Number(searchParams.get('id'));

    if (!type || !id) {
      return NextResponse.json({ success: false, message: 'ID atau type tidak ditemukan' }, { status: 400 });
    }

    if (type === 'berita') {
      await prisma.berita_acara.delete({ where: { id_berita: id } });
      return NextResponse.json({ success: true, message: 'Berita berhasil dihapus!' });
    }

    if (type === 'prestasi') {
      await prisma.prestasi.delete({ where: { id_prestasi: id } });
      return NextResponse.json({ success: true, message: 'Prestasi berhasil dihapus!' });
    }

    return NextResponse.json({ success: false, message: 'Tipe tidak valid' }, { status: 400 });
  } catch (error) {
    console.error("Error deleting landing item:", error);
    return NextResponse.json({ success: false, message: 'Gagal menghapus data' }, { status: 500 });
  }
}