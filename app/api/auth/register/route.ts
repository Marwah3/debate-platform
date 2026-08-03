import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, email, password, role } = body;

    // 1. Validasi input
    if (!username || !email || !password) {
      return NextResponse.json(
        { message: 'Semua field wajib diisi!' },
        { status: 400 }
      );
    }

    // 2. Cek apakah email atau nama sudah terdaftar
    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [
          { email: email },
          { nama: username },
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

    // 4. Tentukan Role
    const finalRole = (role === 'admin') ? 'admin' : 'user';

    // 5. Simpan user baru
    const newUser = await prisma.users.create({
      data: {
        nama: username,
        email: email,
        password: hashedPassword,
        role: finalRole as any,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Registrasi berhasil! Silakan login.',
      user: { id: newUser.id_user, nama: newUser.nama, email: newUser.email, role: newUser.role },
    });
  } catch (error) {
    console.error('Error register:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan internal server' },
      { status: 500 }
    );
  }
}