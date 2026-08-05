import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, email, password } = body;

    // 1. Validasi input
    if (!username || !email || !password) {
      return NextResponse.json(
        { message: 'Semua field wajib diisi!' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = username.trim();

    // 2. Cek apakah email atau nama sudah terdaftar
    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [
          { email: cleanEmail },
          { nama: cleanName },
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Nama/Username atau Email sudah terdaftar!' },
        { status: 400 }
      );
    }

    // 3. Hashing Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Simpan ke database dengan role 'user'
    const newUser = await prisma.users.create({
      data: {
        nama: cleanName,
        email: cleanEmail,
        password: hashedPassword,
        role: 'user' as any, // Cast 'as any' untuk mencegah konflik Enum TypeScript
        total_xp: 0,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Registrasi berhasil! Silakan login.',
      user: { 
        id_user: newUser.id_user, 
        nama: newUser.nama, 
        email: newUser.email, 
        role: newUser.role 
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error('❌ ERROR DETAIL REGISTER:', error);

    return NextResponse.json(
      { message: error?.message || 'Terjadi kesalahan sistem internal server' },
      { status: 500 }
    );
  }
}