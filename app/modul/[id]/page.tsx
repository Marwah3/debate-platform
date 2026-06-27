// app/modul/[id]/page.tsx
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
      <div className="min-h-screen bg-[#F3F3F4] text-[#334F70] flex items-center justify-center">
        <p className="text-[#334F70] font-bold animate-pulse text-lg">Menyiapkan materi pembelajaran...</p>
      </div>
    );
  }

  if (errorMsg || !modul || subBabList.length === 0) {
    return (
      <div className="min-h-screen bg-[#F3F3F4] text-[#334F70] flex flex-col items-center justify-center gap-4">
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          ⚠️ {errorMsg || 'Materi tidak ditemukan.'}
        </div>
        <Link href="/dashboard" className="text-[#334F70] font-bold hover:underline">
          ← Kembali ke Dasbor
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F3F4] text-[#334F70] p-6 md:p-12 flex flex-col items-center">
      <div className="max-w-3xl w-full space-y-8">
        
        {/* Navigasi Bar Atas */}
        <div className="flex justify-between items-center border-b border-[#C8D8E8] pb-4">
          <Link href="/dashboard" className="text-sm font-bold text-slate-400 hover:text-[#334F70] transition">
            ← Keluar ke Dasbor
          </Link>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-[#C8D8E8] text-[#334F70] text-xs font-bold rounded-md">
              {currentSubBab === 0 ? 'Pengantar Bab' : `Sub-bab ${currentSubBab} / ${subBabList.length - 1}`}
            </span>
            <span className="px-3 py-1 bg-[#334F70]/10 text-[#334F70] text-xs font-extrabold rounded-full border border-[#334F70]/20">
              Bab {modul?.id_modul} / {TOTAL_MODUL}
            </span>
          </div>
        </div>

        {/* Judul Bab Materi */}
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-[#334F70] tracking-tight">
            {modul?.judul}
          </h1>
          <p className="text-sm text-slate-400 font-medium">
            Cakupan Silabus: <span className="text-[#334F70] font-bold">Kurikulum Global (Multiformat AP, BP, WSD)</span>
          </p>
        </div>

        {/* Kotak Isi Konten Utama - White Base with Deep Navy Text */}
        <div className="bg-white p-8 rounded-2xl border border-[#C8D8E8] shadow-md min-h-75 flex flex-col justify-between">
          <p className="text-[#334F70] leading-relaxed whitespace-pre-line text-base font-medium transition-all duration-300">
            {subBabList[currentSubBab]}
          </p>
        </div>

        {/* INTERNAL NAVIGASI: PENGATUR PERPINDAHAN SUB-BAB */}
        <div className="flex justify-between items-center gap-4 bg-[#C8D8E8]/40 p-4 rounded-xl border border-[#C8D8E8]">
          {currentSubBab > 0 ? (
            <button
              onClick={() => setCurrentSubBab(currentSubBab - 1)}
              className="px-5 py-2 bg-white hover:bg-slate-50 border border-[#C8D8E8] rounded-xl text-sm text-[#334F70] font-bold transition"
            >
              ← Kembali
            </button>
          ) : (
            <div />
          )}

          {currentSubBab < subBabList.length - 1 ? (
            <button
              onClick={() => setCurrentSubBab(currentSubBab + 1)}
              className="px-6 py-2.5 bg-linear-to-r from-[#7EA0CF] to-[#334F70] hover:opacity-95 text-white font-black rounded-xl text-sm shadow-sm transition ml-auto"
            >
              {currentSubBab === 0 ? 'Mulai Pelajari Sub-bab →' : 'Lanjut Sub-bab Berikutnya →'}
            </button>
          ) : (
            <div />
          )}
        </div>

        {/* PANEL EVALUASI AKHIR BAB - Butter Yellow Highlight Theme */}
        {currentSubBab === subBabList.length - 1 && (
          <div className="bg-[#F2EBC3]/60 p-6 rounded-xl border border-amber-300/60 flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 animate-fadeIn">
            <div>
              <h4 className="font-black text-[#334F70] text-base">🎉 Selesai Membaca Seluruh Sub-bab!</h4>
              <p className="text-xs text-[#334F70]/80 font-medium mt-0.5">Silakan uji pemahaman komprehensif kamu khusus untuk materi pada bab ini.</p>
            </div>
            <Link 
              href={`/kuis/${currentIdNum}`} 
              className="w-full sm:w-auto px-6 py-3 bg-linear-to-r from-[#7EA0CF] to-[#334F70] text-white font-black rounded-xl text-center shadow-md transition duration-200"
            >
              Ikut Kuis Evaluasi Bab {currentIdNum} 📝
            </Link>
          </div>
        )}

        {/* Navigasi Perpindahan Antar Bab */}
        <div className="flex justify-between text-xs font-bold text-slate-400 pt-4 border-t border-[#C8D8E8]">
          {currentIdNum > 1 ? (
            <Link href={`/modul/${currentIdNum - 1}`} className="hover:text-[#334F70] transition">
              ← Lompat ke Bab {currentIdNum - 1}
            </Link>
          ) : <div />}
          {currentIdNum < TOTAL_MODUL ? (
            <Link href={`/modul/${currentIdNum + 1}`} className="hover:text-[#334F70] transition ml-auto">
              Lompat ke Bab {currentIdNum + 1} →
            </Link>
          ) : <div />}
        </div>

      </div>
    </div>
  );
}