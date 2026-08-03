'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RedirectToAuthPage() {
  const router = useRouter();

  useEffect(() => {
    // Otomatis lempar pengguna ke halaman login saat mencoba mengakses /register manual
    // replace() digunakan agar pengguna tidak bisa menekan tombol 'kembali' ke halaman kosong ini
    router.replace('/login');
  }, [router]);

  // Tampilkan layar loading sederhana saat proses pengalihan berlangsung
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center space-y-4">
        {/* Spinner Loading Animasi (Tailwind) */}
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#334F70] mx-auto"></div>
        <p className="text-sm text-slate-500 font-medium">Memuat halaman masuk...</p>
      </div>
    </div>
  );
}