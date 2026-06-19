import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    // Sekarang frontend mengirim username (bukan email lagi) dan password
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username dan password wajib diisi' }, { status: 400 });
    }

    // 1. Cari user di MySQL berdasarkan kolom 'nama' (yang kita fungsikan sebagai username)
    let user = await prisma.users.findFirst({
      where: { nama: username },
    });

    // 2. Jika user tidak ditemukan, otomatis buatkan akun dummy (biar demo skripsi lancar)
    if (!user) {
      user = await prisma.users.create({
        data: {
          nama: username,
          email: `${username}@unida.gontor.ac.id`, // Email otomatis buatan untuk memenuhi kolom wajib
          password: password,
          total_xp: 0,
        },
      });
    } else {
      // 3. Jika user ketemu, validasi password-nya
      if (user.password !== password) {
        return NextResponse.json({ error: 'Password yang Anda masukkan salah' }, { status: 401 });
      }
    }

    // Login Sukses! Kirim data sesi ke frontend
    return NextResponse.json({
      success: true,
      message: 'Login Berhasil',
      user: {
        id_user: user.id_user,
        nama: user.nama, // Ini username-nya
        email: user.email,
        total_xp: user.total_xp,
      },
    }, { status: 200 });

  } catch (error: any) {
    console.error("EROR API LOGIN:", error);
    return NextResponse.json({ error: 'Terjadi kesalahan pada sistem login internal' }, { status: 500 });
  }
}