'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function KuisDinamisPage({ params }: { params: Promise<{ id_modul: string }> }) {
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

    // Fetch data soal kuis dari API secara dinamis berdasarkan ID Modul
    const fetchKuisData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/kuis/${idModulUrl}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Gagal memuat bank soal kuis.');
        }

        setQuestions(data.data);
      } catch (err: any) {
        setErrorMsg(err.message);
      } {
        setLoading(false);
      }
    };

    fetchKuisData();
  }, [idModulUrl]);

  const handlePilihJawaban = (soalId: number, opsi: string) => {
    if (sudahSubmit) return;
    setJawabanTerpilih({ ...jawabanTerpilih, [soalId]: opsi });
  };

  const hitungNilai = () => {
    if (Object.keys(jawabanTerpilih).length < questions.length) {
      alert("Harap isi semua soal evaluasi terlebih dahulu!");
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
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center">
        <p className="text-amber-400 font-semibold animate-pulse">Menyiapkan lembar soal evaluasi...</p>
      </div>
    );
  }

  if (errorMsg || questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center gap-4">
        <div className="p-4 bg-red-900/40 border border-red-500 rounded-lg text-red-300 text-sm">
          ⚠️ {errorMsg || 'Belum ada bank soal kuis yang terdaftar untuk modul ini.'}
        </div>
        <Link href="/dashboard" className="text-teal-400 hover:underline text-sm">
          ← Kembali ke Dasbor
        </Link>
      </div>
    );
  }

  // Opsi Pilihan Ganda Statis A, B, C, D (Karena di DB kita simpan teks jawaban murninya)
  const PILIHAN_ABC = (soalId: number) => {
    if (soalId === 1) return ["Menjatuhkan lawan bicara", "Mencari hiburan semata", "Menguji dan mempertahankan argumen secara logis", "Membuat audiens tertawa"];
    if (soalId === 2) return ["Debat politik", "Debat akademik", "Debat parlementer", "Debat hukum/peradilan"];
    return ["Oposisi", "Moderator", "Afirmatif", "Audiens"];
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-12 flex flex-col items-center">
      <div className="max-w-2xl w-full space-y-8">
        
        <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-amber-400 tracking-tight">📝 Evaluasi Kuis Modul {idModulUrl}</h1>
            <p className="text-xs text-slate-400 mt-1">Jawablah pertanyaan di bawah ini untuk membuka akses materi selanjutnya.</p>
          </div>
          <Link href="/dashboard" className="text-sm text-slate-400 hover:text-teal-400 transition">
            Keluar
          </Link>
        </div>

        <div className="space-y-6">
          {questions.map((soal, index) => (
            <div key={soal.id_quiz} className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
              <h3 className="font-bold text-slate-200 mb-4 text-base">
                {index + 1}. {soal.pertanyaan}
              </h3>
              
              <div className="grid grid-cols-1 gap-3">
                {PILIHAN_ABC(index + 1).map((opsi) => {
                  const isSelected = jawabanTerpilih[soal.id_quiz] === opsi;
                  const isCorrect = soal.kunci_jawaban === opsi;
                  
                  let bgClass = "bg-slate-900/50 border-slate-700 hover:border-slate-500 text-slate-300";
                  if (isSelected) bgClass = "bg-amber-500/10 border-amber-400 text-amber-300";
                  
                  if (sudahSubmit) {
                    if (isCorrect) bgClass = "bg-green-500/20 border-green-500 text-green-300 font-medium";
                    else if (isSelected && !isCorrect) bgClass = "bg-red-500/20 border-red-500 text-red-300";
                  }

                  return (
                    <button
                      key={opsi}
                      disabled={sudahSubmit}
                      onClick={() => handlePilihJawaban(soal.id_quiz, opsi)}
                      className={`w-full text-left p-3 rounded-lg border text-sm transition duration-200 ${bgClass}`}
                    >
                      {opsi}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {sudahSubmit && skor !== null && (
          <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-center space-y-3">
            <h2 className="text-xl font-bold text-slate-200">Hasil Evaluasi</h2>
            <div className="text-4xl font-black text-amber-400">{skor} / 100</div>
            <p className="text-xs text-slate-400">
              {skor >= 70 ? "Selamat! Gerbang modul pembelajaran berikutnya sekarang telah terbuka." : "Nilai belum mencukupi. Yuk pelajari kembali teks materinya."}
            </p>
          </div>
        )}

        <div className="flex gap-4">
          {!sudahSubmit ? (
            <button
              onClick={hitungNilai}
              className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-lg shadow-lg text-sm"
            >
              Kirim Lembar Jawaban Kuis ✓
            </button>
          ) : (
            <Link
              href="/dashboard"
              className="w-full py-3 bg-teal-400 hover:bg-teal-500 text-slate-950 font-bold rounded-lg text-center text-sm shadow-lg shadow-teal-500/10 transition"
            >
              Kembali Ke Dasbor Utama
            </Link>
          )}
        </div>

      </div>
    </div>
  );
}