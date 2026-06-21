'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DetailModulPage({ params }: { params: Promise<{ id: string }> }) {
  // Buka bungkus Promise params menggunakan React.use() standar Next.js 16/15
  const unwrappedParams = React.use(params);
  const targetId = unwrappedParams.id;

  const [modul, setModul] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Proteksi Halaman: Pastikan user sudah memiliki sesi login aktif
    const session = localStorage.getItem('user_session');
    if (!session) {
      alert('Silakan login terlebih dahulu.');
      window.location.href = '/login';
      return;
    }

    // Ambil data materi modul dari API yang foldernya sudah di-rename menjadi /api/modul/[id]
    const fetchDetailModul = async () => {
      try {
        const res = await fetch(`/api/modul/${targetId}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Gagal memuat materi modul.');
        }

        setModul(data.data);
      } catch (err: any) {
        setErrorMsg(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetailModul();
  }, [targetId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center">
        <p className="text-teal-400 font-semibold animate-pulse">Menyiapkan materi pembelajaran...</p>
      </div>
    );
  }

  if (errorMsg || !modul) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center gap-4">
        <div className="p-4 bg-red-900/40 border border-red-500 rounded-lg text-red-300">
          ⚠️ {errorMsg || 'Materi tidak ditemukan.'}
        </div>
        <Link href="/dashboard" className="text-teal-400 hover:underline">
          ← Kembali ke Dasbor
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-12 flex flex-col items-center">
      <div className="max-w-3xl w-full space-y-8">
        
        {/* Navigasi Atas */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <Link href="/dashboard" className="text-sm text-slate-400 hover:text-teal-400 transition">
            ← Kembali ke Dasbor
          </Link>
          <span className="px-3 py-1 bg-teal-500/10 text-teal-400 text-xs font-semibold rounded-full border border-teal-500/20">
            Modul {modul?.id_modul}
          </span>
        </div>

        {/* Judul Materi */}
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-teal-400 tracking-tight">
            {modul?.judul_modul || 'Materi Pembelajaran'}
          </h1>
          <p className="text-sm text-slate-400">
            Pelajari teori di bawah ini sebelum menguji argumen kamu di Laboratorium AI.
          </p>
        </div>

        {/* Isi Konten Utama */}
        <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 shadow-xl max-w-none">
          <p className="text-slate-300 leading-relaxed whitespace-pre-line text-base">
            {modul?.konten_materi}
          </p>
        </div>

        {/* Aksi/Tombol Lanjutan */}
        <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-slate-200 text-sm">Sudah paham materinya?</h4>
            <p className="text-xs text-slate-400">Langsung uji pemahaman struktur AREL kamu dengan mosi latihan.</p>
          </div>
          <Link 
            href="/praktik"
            className="w-full sm:w-auto px-6 py-3 bg-teal-400 hover:bg-teal-500 text-slate-950 font-bold rounded-lg text-center shadow-lg shadow-teal-500/10 transition duration-200"
          >
            Mulai Praktik Debat →
          </Link>
        </div>

      </div>
    </div>
  );
}