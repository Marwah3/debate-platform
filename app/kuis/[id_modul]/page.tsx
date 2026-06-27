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
      <div className="min-h-screen bg-[#F3F3F4] text-[#334F70] flex items-center justify-center">
        <p className="text-[#334F70] font-bold animate-pulse text-lg">Menyiapkan lembar soal evaluasi bab...</p>
      </div>
    );
  }

  if (errorMsg || questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#F3F3F4] text-[#334F70] flex flex-col items-center justify-center gap-4">
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
          ⚠️ {errorMsg || 'Belum ada bank soal kuis asli yang terdaftar untuk bab ini.'}
        </div>
        <Link href="/dashboard" className="text-[#334F70] font-bold hover:underline text-sm">
          ← Kembali ke Dasbor
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F3F4] text-[#334F70] p-6 md:p-12 flex flex-col items-center">
      <div className="max-w-2xl w-full space-y-8">
        
        <div id="kuis-top" />

        {/* Header Bar */}
        <div className="border-b border-[#C8D8E8] pb-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-[#334F70] tracking-tight">📝 Evaluasi Kuis Akhir Bab {idModulUrl}</h1>
            <p className="text-xs text-slate-400 mt-1 font-medium">Selesaikan seluruh pertanyaan objektif di bawah ini untuk menguji pemahaman teorimu.</p>
          </div>
          <Link href="/dashboard" className="text-sm font-bold text-slate-400 hover:text-[#334F70] transition">
            Keluar
          </Link>
        </div>

        {/* Daftar Pertanyaan */}
        <div className="space-y-6">
          {questions.map((soal: any, index: number) => {
            const komponenSoal = soal.pertanyaan.split('|');
            const teksPertanyaanUtama = komponenSoal[0];
            const daftarOpsi = komponenSoal.slice(1);

            return (
              <div key={soal.id_quiz} className="bg-white p-6 rounded-2xl border border-[#C8D8E8] shadow-md">
                <h3 className="font-extrabold text-[#334F70] mb-4 text-base leading-relaxed">
                  {index + 1}. {teksPertanyaanUtama}
                </h3>
                
                <div className="grid grid-cols-1 gap-3">
                  {daftarOpsi.map((opsiTeks: string) => {
                    const hurufOpsi = opsiTeks.trim().charAt(0); 
                    const isSelected = jawabanTerpilih[soal.id_quiz] === hurufOpsi;
                    const isCorrect = soal.kunci_jawaban === hurufOpsi;
                    
                    // Default State: Latar belakang Ice Blue transparan lembut
                    let bgClass = "bg-[#C8D8E8]/30 border-[#C8D8E8] hover:border-[#7EA0CF] text-[#334F70] font-medium";
                    
                    // Selected State
                    if (isSelected) bgClass = "bg-[#7EA0CF]/20 border-[#334F70] text-[#334F70] font-bold";
                    
                    // Post-submission Evaluation State
                    if (sudahSubmit) {
                      if (isCorrect) bgClass = "bg-green-100 border-green-500 text-green-800 font-extrabold";
                      else if (isSelected && !isCorrect) bgClass = "bg-red-100 border-red-400 text-red-800 font-medium";
                    }

                    return (
                      <button
                        key={opsiTeks}
                        disabled={sudahSubmit}
                        onClick={() => handlePilihJawaban(soal.id_quiz, hurufOpsi)}
                        className={`w-full text-left p-3.5 rounded-xl border text-sm transition duration-150 ${bgClass}`}
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

        {/* Panel Hasil Skor - Menggunakan Butter Yellow Highlight */}
        {sudahSubmit && skor !== null && (
          <div className="bg-[#F2EBC3]/70 p-6 rounded-2xl border border-amber-300 text-center space-y-2 shadow-xs">
            <h2 className="text-lg font-extrabold text-[#334F70]">Hasil Evaluasi Bab</h2>
            <div className="text-4xl font-black text-[#334F70]">{skor} / 100</div>
            <p className="text-xs font-bold text-[#334F70]/90 max-w-md mx-auto leading-relaxed">
              {skor >= 70 
                ? "Selamat! Pemahamanmu tuntas. Gerbang bab pembelajaran selanjutnya di dasbor kini telah terbuka otomatis." 
                : "Nilai kelulusan belum mencukupi (Minimal 70). Yuk klik tombol di bawah untuk membaca ulang materinya."}
            </p>
          </div>
        )}

        {/* Panel Tombol Aksi Adaptif */}
        <div className="w-full pt-2">
          {!sudahSubmit ? (
            <button
              onClick={hitungNilai}
              className="w-full py-4 bg-linear-to-r from-[#7EA0CF] to-[#334F70] hover:opacity-95 text-white font-black rounded-xl shadow-md shadow-[#334F70]/10 text-sm transition duration-200"
            >
              Kirim Lembar Jawaban Kuis Akhir Bab ✓
            </button>
          ) : (
            <>
              {skor !== null && skor >= 70 ? (
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <Link
                    href="/dashboard"
                    className="flex-1 py-3.5 bg-white hover:bg-slate-50 border border-[#C8D8E8] text-[#334F70] font-bold rounded-xl text-center text-sm transition shadow-xs"
                  >
                    🏠 Kembali ke Dasbor
                  </Link>
                  
                  <Link
                    href="/praktik"
                    className="flex-1 py-3.5 bg-linear-to-r from-[#7EA0CF] to-[#334F70] hover:opacity-95 text-white font-black rounded-xl text-center text-sm shadow-md transition"
                  >
                    🎙️ Ruang AI (Praktik)
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <Link
                    href={`/modul/${idModulUrl}`}
                    className="flex-1 py-3.5 bg-white hover:bg-slate-50 border border-[#C8D8E8] text-[#334F70] font-bold rounded-xl text-center text-sm transition shadow-xs"
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
                    className="flex-1 py-3.5 bg-linear-to-r from-[#7EA0CF] to-[#334F70] hover:opacity-95 text-white font-black rounded-xl text-center text-sm shadow-md transition"
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