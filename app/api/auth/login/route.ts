import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username dan password wajib diisi' }, { status: 400 });
    }

    // 1. Cari user di MySQL berdasarkan kolom 'nama'
    const user = await prisma.users.findFirst({
      where: { nama: username },
    });

    // 2. PERBAIKAN: Jika user tidak ditemukan, TOLAK akses dan suruh mendaftar dahulu
    if (!user) {
      return NextResponse.json({ 
        error: 'Username belum terdaftar. Silakan lakukan registrasi akun terlebih dahulu.' 
      }, { status: 404 });
    }

    // 3. Jika user ditemukan, validasi apakah password-nya cocok
    if (user.password !== password) {
      return NextResponse.json({ error: 'Password yang Anda masukkan salah' }, { status: 401 });
    }

    // Login Sukses! Kirim data sesi beserta ROLE asli ke frontend
    return NextResponse.json({
      success: true,
      message: 'Login Berhasil',
      user: {
        id_user: user.id_user,
        nama: user.nama,
        email: user.email,
        role: user.role, 
        total_xp: user.total_xp,
        current_level: user.current_level
      },
    }, { status: 200 });

  } catch (error: any) {
    console.error("EROR API LOGIN:", error);
    return NextResponse.json({ error: 'Terjadi kesalahan pada sistem login internal' }, { status: 500 });
  }
}