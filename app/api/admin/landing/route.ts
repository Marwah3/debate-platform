import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { normalizeImageUrl } from '@/lib/imageUrl';

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
      const heroImage = normalizeImageUrl(payload.hero_img);
      const aboutImage = normalizeImageUrl(payload.about_img);
      const groupImage = normalizeImageUrl(payload.group_img);
      const ctaImage = normalizeImageUrl(payload.cta_img);
      const invalidImage = [heroImage, aboutImage, groupImage, ctaImage].find((image) => image.error);
      if (invalidImage?.error) {
        return NextResponse.json({ success: false, message: invalidImage.error }, { status: 400 });
      }

      const imageData = {
        hero_img: heroImage.url,
        about_img: aboutImage.url,
        group_img: groupImage.url,
        cta_img: ctaImage.url,
      };
      const existingStats = await prisma.landing_stats.findFirst();

      if (existingStats) {
        await prisma.$executeRaw`
          UPDATE landing_stats
          SET hero_img = ${imageData.hero_img},
              about_img = ${imageData.about_img},
              group_img = ${imageData.group_img},
              cta_img = ${imageData.cta_img}
          WHERE id_stats = ${existingStats.id_stats}
        `;
        return NextResponse.json({ success: true, data: { ...existingStats, ...imageData } });
      } else {
        const created = await prisma.landing_stats.create({
          data: { hero_img: imageData.hero_img },
        });
        await prisma.$executeRaw`
          UPDATE landing_stats
          SET about_img = ${imageData.about_img},
              group_img = ${imageData.group_img},
              cta_img = ${imageData.cta_img}
          WHERE id_stats = ${created.id_stats}
        `;
        return NextResponse.json({ success: true, data: { ...created, ...imageData } });
      }
    }

    // 2. TAMBAH BERITA ACARA
    if (type === 'berita') {
      const image = normalizeImageUrl(payload.img_url);
      if (image.error) {
        return NextResponse.json({ success: false, message: image.error }, { status: 400 });
      }

      const newBerita = await prisma.berita_acara.create({
        data: {
          title: payload.title,
          date: payload.date,
          tag: payload.tag || 'Seminar',
          desc: payload.desc || '',
          img_url: image.url || '',
        },
      });
      return NextResponse.json({ success: true, data: newBerita });
    }

    // 3. TAMBAH PRESTASI
    if (type === 'prestasi') {
      const image = normalizeImageUrl(payload.img_url);
      if (image.error) {
        return NextResponse.json({ success: false, message: image.error }, { status: 400 });
      }

      const newPrestasi = await prisma.prestasi.create({
        data: {
          juara: payload.juara,
          lomba: payload.lomba,
          tahun: payload.tahun,
          penyelenggara: payload.penyelenggara,
          img_url: image.url || '',
        },
      });
      return NextResponse.json({ success: true, data: newPrestasi });
    }

    
    // 4. TAMBAH LOMBA DIIKUTI
    if (type === 'lomba') {
      const image = normalizeImageUrl(payload.image_url);
      if (image.error) {
        return NextResponse.json({ success: false, message: image.error }, { status: 400 });
      }

      const newLomba = await prisma.lomba.create({
        data: {
          nama_lomba: payload.nama_lomba,
          kategori: payload.kategori || 'Nasional',
          lokasi: payload.lokasi,
          image_url: image.url || '',
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