import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
      return NextResponse.json({ error: 'Semua kolom formulir wajib diisi' }, { status: 400 });
    }

    // Cek apakah user sudah terdaftar
    const userExist = await prisma.users.findFirst({
      where: { nama: username }
    });

    if (userExist) {
      return NextResponse.json({ error: 'Username sudah digunakan' }, { status: 400 });
    }

    // LOGIKA OTOMATIS: Deteksi kata kunci nama untuk hak akses admin
    const namaLow = username.toLowerCase().trim();
    const roleOtomatis = (namaLow === 'admin' || namaLow === 'pengurus' || namaLow.startsWith('admin')) ? 'admin' : 'user';

    const newUser = await prisma.users.create({
      data: {
        nama: username,
        email: email,
        password: password,
        role: roleOtomatis as any, // ← Mengunci hak akses admin secara otomatis di MySQL saat register
        total_xp: 0,
        current_level: 1
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Akun berhasil terdaftar',
      user: newUser
    }, { status: 201 });

  } catch (error: any) {
    console.error("ERROR REGISTRASI:", error);
    return NextResponse.json({ error: 'Gagal memproses pendaftaran internal' }, { status: 500 });
  }
}