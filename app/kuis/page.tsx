'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// Data Soal Kuis Pilihan Ganda Mengenai Struktur AREL
const SOAL_KUIS = [
  {
    id: 1,
    pertanyaan: "Di dalam metode AREL, bagian yang berisi pernyataan atau argumen utama yang ingin disampaikan disebut...",
    pilihan: [
      "A. Reasoning",
      "B. Evidence",
      "C. Assertion",
      "D. Link-back"
    ],
    jawabanBenar: "C. Assertion"
  },
  {
    id: 2,
    pertanyaan: "Mengapa unsur 'Evidence' sangat krusial dalam menyusun argumen debat?",
    pilihan: [
      "A. Untuk sekadar memperpanjang durasi bicara pembicara.",
      "B. Memberikan bukti nyata berupa data, fakta, atau studi kasus untuk memperkuat klaim.",
      "C. Untuk menjelaskan logika berpikir tanpa dasar empiris.",
      "D. Membantu membingungkan tim lawan saat sesi interupsi."
    ],
    jawabanBenar: "B. Memberikan bukti nyata berupa data, fakta, atau studi kasus untuk memperkuat klaim."
  },
  {
    id: 3,
    pertanyaan: "Bagian 'Link-back' pada akhir struktur argumen berfungsi untuk...",
    pilihan: [
      "A. Menyimpulkan argumen dan menegaskan kembali mengapa argumen tersebut membuktikan mosi.",
      "B. Meminta maaf kepada dewan juri atas kesalahan kata.",
      "C. Memberikan sanggahan langsung kepada pembicara pertama lawan.",
      "D. Mengalihkan topik pembicaran ke isu mosi yang baru."
    ],
    jawabanBenar: "A. Menyimpulkan argumen dan menegaskan kembali mengapa argumen tersebut membuktikan mosi."
  }
];

export default function KuisPage() {
  const [jawabanTerpilih, setJawabanTerpilih] = useState<{ [key: number]: string }>({});
  const [skor, setSkor] = useState<number | null>(null);
  const [sudahSubmit, setSudahSubmit] = useState(false);

  const handlePilihJawaban = (soalId: number, opsi: string) => {
    if (sudahSubmit) return; // Kunci jawaban kalau sudah dinilai
    setJawabanTerpilih({
      ...jawabanTerpilih,
      [soalId]: opsi
    });
  };

  const hitungNilai = () => {
    // Pastikan semua soal diisi
    if (Object.keys(jawabanTerpilih).length < SOAL_KUIS.length) {
      alert("Harap jawab semua soal kuis terlebih dahulu!");
      return;
    }

    let benar = 0;
    SOAL_KUIS.forEach((soal) => {
      if (jawabanTerpilih[soal.id] === soal.jawabanBenar) {
        benar++;
      }
    });

    const nilaiAkhir = Math.round((benar / SOAL_KUIS.length) * 100);
    setSkor(nilaiAkhir);
    setSudahSubmit(true);
  };

  const resetKuis = () => {
    setJawabanTerpilih({});
    setSkor(null);
    setSudahSubmit(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-12 flex flex-col items-center">
      <div className="max-w-2xl w-full space-y-8">
        
        {/* Header Kuis */}
        <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-amber-400 tracking-tight">📝 Evaluasi Kuis Akhir</h1>
            <p className="text-xs text-slate-400 mt-1">Uji pemahaman komprehensif kamu mengenai struktur dasar AREL.</p>
          </div>
          <Link href="/dashboard" className="text-sm text-slate-400 hover:text-teal-400 transition">
            Kembali
          </Link>
        </div>

        {/* Daftar Soal */}
        <div className="space-y-6">
          {SOAL_KUIS.map((soal, index) => (
            <div key={soal.id} className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
              <h3 className="font-bold text-slate-200 mb-4 text-base">
                {index + 1}. {soal.pertanyaan}
              </h3>
              
              <div className="grid grid-cols-1 gap-3">
                {soal.pilihan.map((opsi) => {
                  const isSelected = jawabanTerpilih[soal.id] === opsi;
                  const isCorrect = soal.jawabanBenar === opsi;
                  
                  let bgClass = "bg-slate-900/50 border-slate-700 hover:border-slate-500 text-slate-300";
                  if (isSelected) bgClass = "bg-teal-500/10 border-teal-400 text-teal-300";
                  
                  // Efek warna kalau sudah ditekan tombol Koreksi/Submit
                  if (sudahSubmit) {
                    if (isCorrect) bgClass = "bg-green-500/20 border-green-500 text-green-300 font-medium";
                    else if (isSelected && !isCorrect) bgClass = "bg-red-500/20 border-red-500 text-red-300";
                  }

                  return (
                    <button
                      key={opsi}
                      disabled={sudahSubmit}
                      onClick={() => handlePilihJawaban(soal.id, opsi)}
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

        {/* Kotak Hasil Skor */}
        {sudahSubmit && skor !== null && (
          <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-center space-y-3 animate-fade-in">
            <h2 className="text-xl font-bold text-slate-200">Hasil Evaluasi Kamu</h2>
            <div className="text-4xl font-black text-amber-400">{skor} / 100</div>
            <p className="text-xs text-slate-400">
              {skor >= 70 
                ? "Luar biasa! Kamu sudah siap menggunakan Laboratorium AI untuk menyusun argumen." 
                : "Yuk coba pelajari kembali materi modul agar pemahaman struktur argumenmu makin matang."}
            </p>
          </div>
        )}

        {/* Tombol Aksi Bawah */}
        <div className="flex gap-4">
          {!sudahSubmit ? (
            <button
              onClick={hitungNilai}
              className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-lg shadow-lg shadow-amber-500/10 transition duration-200 text-sm"
            >
              Kirim Jawaban Kuis ✓
            </button>
          ) : (
            <>
              <button
                onClick={resetKuis}
                className="w-1/2 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 font-semibold rounded-lg text-sm transition"
              >
                Ulangi Kuis
              </button>
              <Link
                href="/praktik"
                className="w-1/2 py-3 bg-teal-400 hover:bg-teal-500 text-slate-950 font-bold rounded-lg text-center text-sm shadow-lg shadow-teal-500/10 transition"
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