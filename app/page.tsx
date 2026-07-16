'use client';

import React from 'react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F3F3F4] text-[#334F70] flex flex-col items-center justify-center p-6 relative select-none">
      
      {/* Konten Utama */}
      <div className="max-w-2xl text-center space-y-6 animate-fadeIn">
        
        {/* Judul Utama dengan Efek Gradasi */}
        <h1 className="text-4xl font-black tracking-tight text-[#334F70] sm:text-5xl leading-tight">
          Platform Pembelajaran <br />
          <span className="bg-linear-to-r from-[#334F70] to-[#7EA0CF] bg-clip-text text-transparent">
            Debat Parlementer
          </span>
        </h1>
        
        {/* Deskripsi Sub-judul */}
        <p className="text-base text-[#334F70]/80 max-w-lg mx-auto leading-relaxed font-medium">
          Selamat datang di pusat pelatihan debat digital khusus Mahasiswa Universitas Darussalam Gontor. Asah kemampuan berpikir kritis secara interaktif.
        </p>
        
        {/* Tombol Utama Menuju Halaman Login dengan Gradasi */}
       {/* Tombol Utama Menuju Halaman Login dengan Gradasi */}
<div className="pt-4">
  <Link
    href="/dashboard"
    className="px-8 py-3.5 bg-linear-to-r from-[#7EA0CF] to-[#334F70] hover:opacity-95 text-white font-black rounded-xl inline-block shadow-md transition"
  >
    Mulai Latihan Sekarang
  </Link>
</div>

      </div>

      {/* Footer Akademik di Bagian Bawah */}
      <footer className="absolute bottom-6 text-center text-xs font-bold text-[#334F70]/60 tracking-wide">
        Teknik Informatika • Universitas Darussalam Gontor
      </footer>

    </div>
  );
}