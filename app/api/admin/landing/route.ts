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

    if (type === 'about') {
      if (!payload.about_content || typeof payload.about_content !== 'object') {
        return NextResponse.json({ success: false, message: 'Konten Tentang Kami tidak valid.' }, { status: 400 });
      }

      const aboutContent = JSON.stringify(payload.about_content);
      const existingStats = await prisma.landing_stats.findFirst();
      if (existingStats) {
        await prisma.$executeRaw`
          UPDATE landing_stats
          SET about_content = ${aboutContent}
          WHERE id_stats = ${existingStats.id_stats}
        `;
        return NextResponse.json({ success: true });
      }

      await prisma.landing_stats.create({ data: { about_content: aboutContent } });
      return NextResponse.json({ success: true });
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
      const aboutContent = payload.about_content && typeof payload.about_content === 'object'
        ? JSON.stringify(payload.about_content)
        : null;

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
              cta_img = ${imageData.cta_img},
              about_content = COALESCE(${aboutContent}, about_content)
          WHERE id_stats = ${existingStats.id_stats}
        `;
        return NextResponse.json({ success: true, data: { ...existingStats, ...imageData } });
      } else {
        const created = await prisma.landing_stats.create({
          data: { hero_img: imageData.hero_img, about_content: aboutContent },
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
      const imageInputs = typeof payload.img_url === 'string'
        ? payload.img_url.split(/\r?\n/).map((image: string) => image.trim()).filter(Boolean)
        : [];
      const images: ReturnType<typeof normalizeImageUrl>[] = imageInputs.map((image: string) => normalizeImageUrl(image));
      const invalidImage = images.find((image: ReturnType<typeof normalizeImageUrl>) => image.error);
      if (invalidImage?.error) {
        return NextResponse.json({ success: false, message: invalidImage.error }, { status: 400 });
      }
      const imageUrls = images.flatMap((image: ReturnType<typeof normalizeImageUrl>) => image.url ? [image.url] : []);
      const storedImage = imageUrls.length > 1 ? JSON.stringify(imageUrls) : imageUrls[0] || '';
      const beritaData = {
        title: payload.title,
        date: payload.date,
        tag: payload.tag || 'Seminar',
        desc: payload.desc || '',
        img_url: storedImage,
      };

      if (payload.id_berita !== null && payload.id_berita !== undefined) {
        const idBerita = Number(payload.id_berita);
        if (!Number.isInteger(idBerita) || idBerita < 1) {
          return NextResponse.json({ success: false, message: 'ID berita tidak valid.' }, { status: 400 });
        }

        const updatedBerita = await prisma.berita_acara.update({
          where: { id_berita: idBerita },
          data: beritaData,
        });
        return NextResponse.json({ success: true, data: updatedBerita });
      }

      const newBerita = await prisma.berita_acara.create({ data: beritaData });
      return NextResponse.json({ success: true, data: newBerita });
    }

    if (type === 'anggota') {
      const nama = typeof payload.nama === 'string' ? payload.nama.trim() : '';
      const posisi = typeof payload.posisi === 'string' ? payload.posisi.trim() : '';
      const inisial = typeof payload.inisial === 'string' && payload.inisial.trim()
        ? payload.inisial.trim().slice(0, 10).toUpperCase()
        : nama.split(/\s+/).map((bagian: string) => bagian[0]).join('').slice(0, 3).toUpperCase();

      if (!nama || !posisi) {
        return NextResponse.json({ success: false, message: 'Nama dan posisi anggota wajib diisi.' }, { status: 400 });
      }

      const anggotaData = { nama, posisi, inisial };
      if (payload.id_anggota !== null && payload.id_anggota !== undefined) {
        const idAnggota = Number(payload.id_anggota);
        if (!Number.isInteger(idAnggota) || idAnggota < 1) {
          return NextResponse.json({ success: false, message: 'ID anggota tidak valid.' }, { status: 400 });
        }

        const updatedAnggota = await prisma.anggota.update({
          where: { id_anggota: idAnggota },
          data: anggotaData,
        });
        return NextResponse.json({ success: true, data: updatedAnggota });
      }

      const newAnggota = await prisma.anggota.create({ data: anggotaData });
      return NextResponse.json({ success: true, data: newAnggota });
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

    if (type === 'anggota') {
      await prisma.anggota.delete({ where: { id_anggota: numericId } });
      return NextResponse.json({ success: true, message: 'Anggota berhasil dihapus' });
    }

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