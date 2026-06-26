'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LembarKuisDinamisPage({ params }: { params: Promise<{ id_modul: string }> }) {
  const unwrappedParams = React.use(params);
  const idModulUrl = unwrappedParams.id_modul;

  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [jawabanTerpilih, setJawabanTerpilih] = useState<{ [key: number]: string }>({});
  const [skor, setSkor] = useState<number | null>(null);
  const [sudahSubmit, setSudahSubmit] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem('user_session');
    if (!session) {
      window.location.href = '/login';
      return;
    }

    if (!idModulUrl) return;

    const fetchKuisData = async () => {
      try {
        setLoading(true);
        setErrorMsg('');
        const res = await fetch(`/api/kuis/${idModulUrl}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Gagal memuat bank soal kuis.');
        }

        if (!data.data || data.data.length === 0) {
          throw new Error('Bank soal untuk bab ini masih kosong di database.');
        }

        setQuestions(data.data);
      } catch (err: any) {
        console.error("❌ Gagal memuat kuis:", err);
        setErrorMsg(err.message || 'Terjadi kesalahan koneksi database.');
      } finally {
        setLoading(false);
      }
    };

    fetchKuisData();
  }, [idModulUrl]);

  const handlePilihJawaban = (soalId: number, hurufOpsi: string) => {
    if (sudahSubmit) return;
    setJawabanTerpilih({ ...jawabanTerpilih, [soalId]: hurufOpsi });
  };

  const hitungNilai = async () => {
    if (Object.keys(jawabanTerpilih).length < questions.length) {
      alert("Harap jawab semua soal evaluasi bab terlebih dahulu!");
      return;
    }

    let benar = 0;
    questions.forEach((soal) => {
      if (jawabanTerpilih[soal.id_quiz] === soal.kunci_jawaban) {
        benar++;
      }
    });

    const nilaiAkhir = Math.round((benar / questions.length) * 100);
    setSkor(nilaiAkhir);
    setSudahSubmit(true);

    try {
      const session = localStorage.getItem('user_session');
      const user = session ? JSON.parse(session) : null;

      await fetch(`/api/kuis/${idModulUrl}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skor: nilaiAkhir,
          id_user: user?.id_user
        })
      });
    } catch (err) {
      console.error("Gagal menyinkronkan status kelulusan kuis:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center">
        <p className="text-amber-400 font-semibold animate-pulse">Menyiapkan lembar soal evaluasi bab...</p>
      </div>
    );
  }

  if (errorMsg || questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center gap-4">
        <div className="p-4 bg-red-900/40 border border-red-500 rounded-lg text-red-300 text-sm">
          ⚠️ {errorMsg || 'Belum ada bank soal kuis asli yang terdaftar untuk bab ini.'}
        </div>
        <Link href="/dashboard" className="text-teal-400 hover:underline text-sm">
          ← Kembali ke Dasbor
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-12 flex flex-col items-center">
      <div className="max-w-2xl w-full space-y-8">
        
        {/* Penanda Atas untuk Reset Scroll Logis */}
        <div id="kuis-top" />

        <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-amber-400 tracking-tight">📝 Evaluasi Kuis Akhir Bab {idModulUrl}</h1>
            <p className="text-xs text-slate-400 mt-1">Selesaikan seluruh pertanyaan objektif di bawah ini untuk menguji pemahaman teorimu.</p>
          </div>
          <Link href="/dashboard" className="text-sm text-slate-400 hover:text-teal-400 transition">
            Keluar
          </Link>
        </div>

        <div className="space-y-6">
          {questions.map((soal: any, index: number) => {
            const komponenSoal = soal.pertanyaan.split('|');
            const teksPertanyaanUtama = komponenSoal[0];
            const daftarOpsi = komponenSoal.slice(1);

            return (
              <div key={soal.id_quiz} className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                <h3 className="font-bold text-slate-200 mb-4 text-base leading-relaxed">
                  {index + 1}. {teksPertanyaanUtama}
                </h3>
                
                <div className="grid grid-cols-1 gap-3">
                  {daftarOpsi.map((opsiTeks: string) => {
                    const hurufOpsi = opsiTeks.trim().charAt(0); 
                    const isSelected = jawabanTerpilih[soal.id_quiz] === hurufOpsi;
                    const isCorrect = soal.kunci_jawaban === hurufOpsi;
                    
                    let bgClass = "bg-slate-900/50 border-slate-700 hover:border-slate-500 text-slate-300";
                    if (isSelected) bgClass = "bg-amber-500/10 border-amber-400 text-amber-300";
                    
                    if (sudahSubmit) {
                      if (isCorrect) bgClass = "bg-green-500/20 border-green-500 text-green-300 font-semibold";
                      else if (isSelected && !isCorrect) bgClass = "bg-red-500/20 border-red-500 text-red-300";
                    }

                    return (
                      <button
                        key={opsiTeks}
                        disabled={sudahSubmit}
                        onClick={() => handlePilihJawaban(soal.id_quiz, hurufOpsi)}
                        className={`w-full text-left p-3 rounded-lg border text-sm transition duration-200 ${bgClass}`}
                      >
                        {opsiTeks}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {sudahSubmit && skor !== null && (
          <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-center space-y-3">
            <h2 className="text-xl font-bold text-slate-200">Hasil Evaluasi Bab</h2>
            <div className="text-4xl font-black text-amber-400">{skor} / 100</div>
            <p className="text-xs text-slate-400">
              {skor >= 70 
                ? "Selamat! Pemahamanmu tuntas. Gerbang bab pembelajaran selanjutnya di dasbor kini telah terbuka." 
                : "Nilai kelulusan belum mencukupi (Minimal 70). Yuk pelajari kembali sub-bab materinya."}
            </p>
          </div>
        )}

        {/* PANEL TOMBOL AKSI ADAPTIF */}
        <div className="w-full pt-2">
          {!sudahSubmit ? (
            <button
              onClick={hitungNilai}
              className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-lg shadow-lg shadow-amber-500/10 text-sm transition duration-200"
            >
              Kirim Lembar Jawaban Kuis Akhir Bab ✓
            </button>
          ) : (
            <>
              {skor !== null && skor >= 70 ? (
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <Link
                    href="/dashboard"
                    className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold rounded-lg text-center text-sm transition"
                  >
                    🏠 Kembali ke Dasbor
                  </Link>
                  
                  <Link
                    href="/praktik"
                    className="flex-1 py-3 bg-linear-to-r from-teal-500 to-cyan-500 hover:opacity-90 text-slate-950 font-black rounded-lg text-center text-sm shadow-md transition"
                  >
                    🎙️ Ruang AI (Praktik)
                  </Link>

                  {Number(idModulUrl) < 4 ? (
                    <Link
                      href={`/modul/${Number(idModulUrl) + 1}`}
                      className="flex-1 py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-lg text-center text-sm shadow-md transition"
                    >
                      📖 Lanjut Bab {Number(idModulUrl) + 1} →
                    </Link>
                  ) : (
                    <div className="flex-1 py-3 bg-green-500/10 border border-green-500/30 text-green-400 font-bold rounded-lg text-center text-sm flex items-center justify-center">
                      🎓 Silabus Tuntas!
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <Link
                    href={`/modul/${idModulUrl}`}
                    className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold rounded-lg text-center text-sm transition"
                  >
                    📖 Baca Ulang Materi
                  </Link>
                  
                  <button
                    onClick={() => {
                      setJawabanTerpilih({});
                      setSkor(null);
                      setSudahSubmit(false);
                      document.getElementById('kuis-top')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="flex-1 py-3 bg-linear-to-r from-amber-500 to-orange-500 hover:opacity-90 text-white font-black rounded-lg text-center text-sm shadow-lg transition"
                  >
                    🔄 Ulangi Evaluasi Kuis
                  </button>
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
}