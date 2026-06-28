import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Menarik seluruh data pengguna dengan role 'user' (Mahasiswa)
    // digabung secara relasional dengan riwayat latihan argumen mereka
    const daftarMahasiswa = await prisma.users.findMany({
      where: {
        role: 'user'
      },
      include: {
        argumens: {
          select: {
            id_argumen: true,
            teks_argumen: true,
            skor_AREL: true,
            feedback_ai: true,
            timestamp: true
          },
          orderBy: {
            timestamp: 'desc'
          }
        }
      },
      orderBy: {
        total_xp: 'desc' // Urutkan berdasarkan XP tertinggi (Leaderboard View)
      }
    });

    // Melakukan transformasi data untuk menghitung total latihan dan rata-rata skor secara dinamis
    const dataTerformat = daftarMahasiswa.map((mhs) => {
      const totalLatihan = mhs.argumens.length;
      const totalSkor = mhs.argumens.reduce((acc, curr) => acc + (curr.skor_AREL || 0), 0);
      const rataRataSkor = totalLatihan > 0 ? Math.round(totalSkor / totalLatihan) : 0;

      return {
        id_user: mhs.id_user,
        nama: mhs.nama,
        email: mhs.email,
        current_level: mhs.current_level || 1,
        total_xp: mhs.total_xp || 0,
        total_latihan: totalLatihan,
        rata_rata_skor: rataRataSkor,
        riwayat_argumen: mhs.argumens
      };
    });

    return NextResponse.json({
      success: true,
      data: dataTerformat
    }, { status: 200 });

  } catch (error: any) {
    console.error("ERROR GET ADMIN USERS API:", error);
    return NextResponse.json({ error: 'Gagal memuat ringkasan data progres anggota.' }, { status: 500 });
  }
  
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idStr = searchParams.get('id');

    if (!idStr) {
      return NextResponse.json({ error: 'Parameter ID anggota tidak ditemukan.' }, { status: 400 });
    }

    const idUser = Number(idStr);

    // Eksekusi penghapusan di database MySQL via Prisma
    await prisma.users.delete({
      where: {
        id_user: idUser,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Akun anggota berhasil dihapus dari sistem.',
    }, { status: 200 });

  } catch (error: any) {
    console.error("ERROR DELETE USER API:", error);
    return NextResponse.json({ error: 'Gagal menghapus anggota dari database.' }, { status: 500 });
  }
}