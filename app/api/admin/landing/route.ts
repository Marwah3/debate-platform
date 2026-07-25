import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// POST: Menambah data (Stats, Berita, Prestasi, Lomba)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, payload } = body;

    if (!type || !payload) {
      return NextResponse.json({ success: false, message: 'Type dan payload wajib diisi' }, { status: 400 });
    }

    // 1. UPDATE STATISTIK HERO
    if (type === 'stats') {
      const existingStats = await prisma.landing_stats.findFirst();

      if (existingStats) {
        const updated = await prisma.landing_stats.update({
          where: { id_stats: existingStats.id_stats },
          data: {
            total_anggota: payload.total_anggota,
            total_prestasi: payload.total_prestasi,
            total_lomba: payload.total_lomba,
            hero_img: payload.hero_img || null,
          },
        });
        return NextResponse.json({ success: true, data: updated });
      } else {
        const created = await prisma.landing_stats.create({
          data: {
            total_anggota: payload.total_anggota,
            total_prestasi: payload.total_prestasi,
            total_lomba: payload.total_lomba,
            hero_img: payload.hero_img || null,
          },
        });
        return NextResponse.json({ success: true, data: created });
      }
    }

    // 2. TAMBAH BERITA ACARA
    if (type === 'berita') {
      const newBerita = await prisma.berita_acara.create({
        data: {
          title: payload.title,
          date: payload.date,
          tag: payload.tag || 'Seminar',
          desc: payload.desc || '',
          img_url: payload.img_url || '',
        },
      });
      return NextResponse.json({ success: true, data: newBerita });
    }

    // 3. TAMBAH PRESTASI
    if (type === 'prestasi') {
      const newPrestasi = await prisma.prestasi.create({
        data: {
          juara: payload.juara,
          lomba: payload.lomba,
          tahun: payload.tahun,
          penyelenggara: payload.penyelenggara,
          img_url: payload.img_url || '',
        },
      });
      return NextResponse.json({ success: true, data: newPrestasi });
    }

    
    // 4. TAMBAH LOMBA DIIKUTI
    if (type === 'lomba') {
      const newLomba = await prisma.lomba.create({
        data: {
          nama_lomba: payload.nama_lomba,
          kategori: payload.kategori || 'Nasional',
          lokasi: payload.lokasi,
          image_url: payload.image_url || '',
        },
      });
      return NextResponse.json({ success: true, data: newLomba });
    }
      
    return NextResponse.json({ success: false, message: 'Type tidak dikenali' }, { status: 400 });
  } catch (error: any) {
    console.error('Error Admin Landing POST:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE: Menghapus data (Berita, Prestasi, Lomba)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (!type || !id) {
      return NextResponse.json({ success: false, message: 'Type dan ID wajib disertakan' }, { status: 400 });
    }

    const numericId = Number(id);

    // Hapus Berita
    if (type === 'berita') {
      await prisma.berita_acara.delete({ where: { id_berita: numericId } });
      return NextResponse.json({ success: true, message: 'Berita berhasil dihapus' });
    }

    // Hapus Prestasi
    if (type === 'prestasi') {
      await prisma.prestasi.delete({ where: { id_prestasi: numericId } });
      return NextResponse.json({ success: true, message: 'Prestasi berhasil dihapus' });
    }

    // Hapus Lomba
    if (type === 'lomba') {
      await prisma.lomba.delete({ where: { id_lomba: numericId } });
      return NextResponse.json({ success: true, message: 'Lomba berhasil dihapus' });
    }

    return NextResponse.json({ success: false, message: 'Type tidak valid' }, { status: 400 });
  } catch (error: any) {
    console.error('Error Admin Landing DELETE:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}