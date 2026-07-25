import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Tangkap 'username' dari request frontend, lalu petakan ke field 'nama'
    const { username, email, password } = body;

    // 1. Validasi input
    if (!username || !email || !password) {
      return NextResponse.json(
        { message: 'Semua field wajib diisi!' },
        { status: 400 }
      );
    }

    // 2. Cek apakah email atau nama sudah terdaftar di database
    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [
          { email: email },
          { nama: username }, // 💡 Gunakan 'nama', bukan 'username'
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Nama/Username atau Email sudah terdaftar!' },
        { status: 400 }
      );
    }

    // 3. Simpan user baru ke database
    const newUser = await prisma.users.create({
      data: {
        nama: username, // 💡 Petakan ke kolom 'nama' di skema Prisma
        email: email,
        password: password,
        role: 'user',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Registrasi berhasil! Silakan login.',
      user: { id: newUser.id_user, nama: newUser.nama, email: newUser.email },
    });
  } catch (error) {
    console.error('Error register:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan internal server' },
      { status: 500 }
    );
  }
}