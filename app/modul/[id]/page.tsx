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
  
  const [currentSubBab, setCurrentSubBab] = useState(0); 
  const [subBabList, setSubBabList] = useState<string[]>([]);

  const TOTAL_MODUL = 4; 

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

        const materiMentah = data.data.konten_materi;
        
        // SINKRONISASI TOTAL: Memotong sub-bab murni berbasis token eksplisit agar rincian internal poin langkah tidak terpecah
        const parts = materiMentah.includes('---SUBBAB---')
          ? materiMentah.split('---SUBBAB---').map((p: string) => p.trim()).filter(Boolean)
          : materiMentah.split(/\n(?=[1-4]\.\s)/).map((p: string) => p.trim()).filter(Boolean);
        
        setModul(data.data);
        setSubBabList(parts);
        setCurrentSubBab(0); 
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

  if (errorMsg || !modul || subBabList.length === 0) {
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
        
        {/* Navigasi Bar Atas */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <Link href="/dashboard" className="text-sm text-slate-400 hover:text-teal-400 transition">
            ← Keluar ke Dasbor
          </Link>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-slate-800 text-slate-400 text-xs font-medium rounded-md border border-slate-700">
              {currentSubBab === 0 ? 'Pengantar Bab' : `Sub-bab ${currentSubBab} / ${subBabList.length - 1}`}
            </span>
            <span className="px-3 py-1 bg-teal-500/10 text-teal-400 text-xs font-semibold rounded-full border border-teal-500/20">
              Bab {modul?.id_modul} / {TOTAL_MODUL}
            </span>
          </div>
        </div>

        {/* Judul Bab Materi */}
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-teal-400 tracking-tight">
            {modul?.judul}
          </h1>
          <p className="text-sm text-slate-400">
            Cakupan Silabus: <span className="text-teal-400 font-semibold">Kurikulum Global (Multiformat AP, BP, WSD)</span>
          </p>
        </div>

        {/* Kotak Isi Konten Utama */}
        <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 shadow-xl min-h-75 flex flex-col justify-between">
          <p className="text-slate-300 leading-relaxed whitespace-pre-line text-base transition-all duration-300">
            {subBabList[currentSubBab]}
          </p>
        </div>

        {/* INTERNAL NAVIGASI: PENGATUR PERPINDAHAN SUB-BAB */}
        <div className="flex justify-between items-center gap-4 bg-slate-950/50 p-4 rounded-xl border border-slate-800">
          {currentSubBab > 0 ? (
            <button
              onClick={() => setCurrentSubBab(currentSubBab - 1)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm text-slate-300 font-medium transition"
            >
              ← Kembali
            </button>
          ) : (
            <div />
          )}

          {currentSubBab < subBabList.length - 1 ? (
            <button
              onClick={() => setCurrentSubBab(currentSubBab + 1)}
              className="px-5 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-lg text-sm shadow-md transition ml-auto"
            >
              {currentSubBab === 0 ? 'Mulai Pelajari Sub-bab →' : 'Lanjut Sub-bab Berikutnya →'}
            </button>
          ) : (
            <div />
          )}
        </div>

        {/* PANEL EVALUASI AKHIR BAB */}
        {currentSubBab === subBabList.length - 1 && (
          <div className="bg-slate-950 p-6 rounded-xl border-2 border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 animate-fadeIn">
            <div>
              <h4 className="font-bold text-amber-400 text-sm">🎉 Selesai Membaca Seluruh Sub-bab!</h4>
              <p className="text-xs text-slate-400">Silakan uji pemahaman komprehensif kamu khusus untuk materi pada bab ini.</p>
            </div>
            <Link 
              href={`/kuis/${currentIdNum}`} 
              className="w-full sm:w-auto px-6 py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-lg text-center shadow-lg shadow-amber-500/20 transition duration-200"
            >
              Ikut Kuis Evaluasi Bab {currentIdNum} 📝
            </Link>
          </div>
        )}

        {/* Navigasi Perpindahan Antar Bab */}
        <div className="flex justify-between text-xs text-slate-500 pt-4 border-t border-slate-800">
          {currentIdNum > 1 ? (
            <Link href={`/modul/${currentIdNum - 1}`} className="hover:text-teal-400">
              ← Lompat ke Bab {currentIdNum - 1}
            </Link>
          ) : <div />}
          {currentIdNum < TOTAL_MODUL ? (
            <Link href={`/modul/${currentIdNum + 1}`} className="hover:text-teal-400 ml-auto">
              Lompat ke Bab {currentIdNum + 1} →
            </Link>
          ) : <div />}
        </div>

      </div>
    </div>
  );
}