'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DetailModulPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = React.use(params);
  const targetId = unwrappedParams.id;
  const currentIdNum = Number(targetId);

  const [modul, setModul] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Asumsi jumlah total modul kamu di MySQL
  const TOTAL_MODUL = 3; 

  useEffect(() => {
    const session = localStorage.getItem('user_session');
    if (!session) {
      alert('Silakan login terlebih dahulu.');
      window.location.href = '/login';
      return;
    }

    if (!targetId) return;

    const fetchDetailModul = async () => {
      try {
        setLoading(true);
        setErrorMsg('');
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
            Modul {modul?.id_modul} / {TOTAL_MODUL}
          </span>
        </div>

        {/* Judul Materi */}
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-teal-400 tracking-tight">
            {/* PERBAIKAN: Menggunakan properti .judul sesuai isi database MySQL */}
            {modul?.judul || 'Materi Pembelajaran'}
          </h1>
          <p className="text-sm text-slate-400">
              Cakupan Silabus: <span className="text-teal-400 font-semibold">Kurikulum Global (Multiformat AP, BP, WSD)</span>
        </p>
        </div>

        {/* Isi Konten Utama */}
        <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 shadow-xl max-w-none">
          <p className="text-slate-300 leading-relaxed whitespace-pre-line text-base">
            {modul?.konten_materi}
          </p>
        </div>

        {/* PENGATUR NAVIGASI MATERI (PREV / NEXT) */}
        <div className="flex justify-between items-center gap-4 pt-2">
          {currentIdNum > 1 ? (
            <Link 
              href={`/modul/${currentIdNum - 1}`}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm transition"
            >
              ← Materi Sebelumnya
            </Link>
          ) : <div />}

          {currentIdNum < TOTAL_MODUL ? (
            <Link 
              href={`/modul/${currentIdNum + 1}`}
              className="px-4 py-2 bg-slate-800 hover:bg-teal-500 hover:text-slate-950 border border-slate-700 rounded-lg text-sm transition ml-auto"
            >
              Materi Selanjutnya →
            </Link>
          ) : <div />}
        </div>

        {/* PANEL AKSI BAWAH: DINAMIS JIKA MODUL TERAKHIR MAKA TAMPILKAN TOMBOL KUIS */}
        <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
          {currentIdNum === TOTAL_MODUL ? (
            <>
              <div>
                <h4 className="font-bold text-amber-400 text-sm">🎉 Selamat! Kamu telah menyelesaikan semua materi.</h4>
                <p className="text-xs text-slate-400">Uji seluruh pemahaman komprehensif kamu lewat evaluasi kuis akhir.</p>
              </div>
              {/* PERBAIKAN: Mengubah rute statis /kuis menjadi dinamis /kuis/[id_modul] */}
              <Link 
                href={`/kuis/${currentIdNum}`} 
                className="w-full sm:w-auto px-6 py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-lg text-center shadow-lg shadow-amber-500/10 transition duration-200"
              >
                Ikut Kuis Modul Akhir →
              </Link>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>

      </div>
    </div>
  );
}