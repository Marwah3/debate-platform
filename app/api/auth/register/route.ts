import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
      return NextResponse.json({ error: 'Semua kolom wajib diisi!' }, { status: 400 });
    }

    // 1. Cek apakah email atau username sudah pernah terdaftar di MySQL
    const userLama = await prisma.users.findFirst({
      where: {
        OR: [
          { email: email },
          { nama: username }
        ]
      }
    });

    if (userLama) {
      return NextResponse.json({ error: 'Username atau Email sudah terdaftar!' }, { status: 400 });
    }

    // 2. Simpan data akun mahasiswa baru ke tabel users MySQL
    const userBaru = await prisma.users.create({
      data: {
        nama: username,     // Kolom database 'nama' kita isi dengan username
        email: email,       // Kolom database 'email'
        password: password, // Kolom database 'password'
        total_xp: 0         // Default XP awal mahasiswa
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Registrasi Akun Berhasil!',
      data: {
        id_user: userBaru.id_user,
        username: userBaru.nama,
        email: userBaru.email
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error("EROR DI API REGISTER MYSQL:", error);
    return NextResponse.json({ error: 'Terjadi kesalahan sistem saat mendaftarkan akun' }, { status: 500 });
  }
}