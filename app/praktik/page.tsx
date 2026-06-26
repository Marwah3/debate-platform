'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

export default function RuangPraktikPage() {
  const [userSession, setUserSession] = useState<any>(null);
  const [teksArgumen, setTeksArgumen] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMosi, setLoadingMosi] = useState(true);
  const [hasilEvaluasi, setHasilEvaluasi] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');
  
  // State untuk menampung bank mosi dari database MySQL
  const [allMotions, setAllMotions] = useState<any[]>([]);
  const [mosiAktif, setMosiAktif] = useState<any>(null);

  // FUNGSI: Mengacak mosi dari daftar mosi yang sukses diambil dari database
  const handleAcakMosi = useCallback(() => {
    if (allMotions.length === 0) return;
    
    // Filter agar mosi yang sama tidak muncul dua kali berturut-turut jika mosi > 1
    const daftarMosiTersedia = allMotions.filter(m => m.teks !== mosiAktif?.teks);
    const mosiTeksPilihan = daftarMosiTersedia.length > 0 ? daftarMosiTersedia : allMotions;
    
    const mosiRandom = mosiTeksPilihan[Math.floor(Math.random() * mosiTeksPilihan.length)];
    setMosiAktif(mosiRandom);
    setTeksArgumen(''); 
    setHasilEvaluasi(null); 
    setErrorMsg('');
  }, [allMotions, mosiAktif]);

  useEffect(() => {
    const session = localStorage.getItem('user_session');
    if (session) {
      setUserSession(JSON.parse(session));
    }

    // Ambil data mosi dari database MySQL saat komponen pertama kali dimuat
    const fetchMotionsFromDb = async () => {
      try {
        setLoadingMosi(true);
        const res = await fetch('/api/motions');
        const resData = await res.json();
        if (res.ok && resData.data) {
          setAllMotions(resData.data);
          // Set mosi acak pertama kali
          const firstRandom = resData.data[Math.floor(Math.random() * resData.data.length)];
          setMosiAktif(firstRandom);
        }
      } catch (err) {
        console.error("Gagal mengambil mosi dari DB:", err);
      } finally {
        setLoadingMosi(false);
      }
    };

    fetchMotionsFromDb();
  }, []);

  const handleKirimArgumen = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teksArgumen.trim()) {
      alert("Harap ketikkan kerangka argumen debat kamu terlebih dahulu!");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');
      setHasilEvaluasi(null);

      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_user: userSession?.id_user || null,
          teks_argumen: `[Mosi: ${mosiAktif?.teks}] - Argumen Mahasiswa: ${teksArgumen}`
        })
      });

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.error || 'Gagal memproses penilaian AI.');
      }

      setHasilEvaluasi(resData.data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Terjadi gangguan jaringan dengan Juri AI.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-12 flex flex-col items-center">
      <div className="max-w-3xl w-full space-y-8">
        
        {/* Header Bar */}
        <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-teal-400 tracking-tight">🎙️ Laboratorium Evaluator Debat AI (RAG)</h1>
            <p className="text-xs text-slate-400 mt-1">Uji kekuatan model penalaran AREL kamu secara objektif di sini.</p>
          </div>
          <Link href="/dashboard" className="text-sm text-slate-400 hover:text-teal-400 transition">
            🏠 Kembali ke Dasbor
          </Link>
        </div>

        {/* PANEL DOCK MOSI FROM DATABASE */}
        <div className="bg-slate-950 p-6 rounded-xl border-2 border-teal-500/20 space-y-4 shadow-inner">
          <div className="flex justify-between items-center">
            <span className="px-2.5 py-0.5 bg-teal-500/10 text-teal-400 text-xs font-bold rounded-md border border-teal-500/20">
              {loadingMosi ? '⏳ Membuka bank data...' : `📌 ${mosiAktif?.jenis || 'Mosi Latihan'}`}
            </span>
            {!loadingMosi && (
              <button
                type="button"
                onClick={handleAcakMosi}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition outline-hidden"
              >
                🔄 Acak Mosi Latihan Baru
              </button>
            )}
          </div>
          <p className="text-slate-100 font-extrabold text-lg leading-relaxed">
            {loadingMosi ? 'Menyiapkan tantangan mosi baru...' : `"${mosiAktif?.teks || 'Belum ada mosi terdaftar.'}"`}
          </p>
          <p className="text-xs text-slate-500">
            *Instruksi: Susun struktur kasus tim pro/kontra kamu merujuk pada penalaran logika utuh AREL untuk mosi di atas.
          </p>
        </div>

        {/* Form Penginputan Teks */}
        <form onSubmit={handleKirimArgumen} className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-semibold text-slate-300">
              Ketikan Struktur Argumen Konstruksi Kasus Kamu:
            </label>
            <textarea
              disabled={loading || loadingMosi}
              value={teksArgumen}
              onChange={(e) => setTeksArgumen(e.target.value)}
              placeholder="Contoh: (Assertion) Saya setuju dengan mosi ini karena... (Reasoning) Hubungan sebab-akibatnya adalah... (Evidence) Contoh nyata di status quo..."
              className="w-full h-48 p-4 bg-slate-950 border border-slate-800 rounded-xl focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-slate-200 outline-hidden transition text-sm leading-relaxed"
            />
          </div>

          <button
            type="submit"
            disabled={loading || loadingMosi}
            className="w-full py-3 bg-linear-to-r from-teal-400 to-cyan-500 hover:opacity-90 text-slate-950 font-black rounded-xl shadow-lg text-sm transition duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="animate-pulse">⏳ Juri AI Sedang Membedah Argumenmu...</span>
            ) : (
              <>🚀 Kirim ke Juri AI Evaluator</>
            )}
          </button>
        </form>

        {errorMsg && (
          <div className="p-4 bg-red-950/40 border border-red-500/30 rounded-xl text-red-400 text-sm">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Box Hasil Penilaian Juri AI */}
        {hasilEvaluasi && (
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-2xl space-y-6 p-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-700 pb-4 gap-2">
              <div>
                <h3 className="text-lg font-bold text-slate-200">📊 Skor Hasil Analisis Juri AI</h3>
                <p className="text-xs text-slate-400">Dihitung real-time berdasarkan keselarasan petaan Chroma DB.</p>
              </div>
              <div className="text-center px-4 py-2 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-3xl font-black text-teal-400">{hasilEvaluasi.skor_AREL}</span>
                <span className="text-slate-500 text-xs block">Skor AREL</span>
              </div>
            </div>

            <div className="p-4 bg-amber-400/10 border border-amber-500/20 rounded-xl flex items-center justify-between text-xs text-amber-300">
              <span>✨ Selamat! Kompetensimu meningkat dari latihan mandiri ini.</span>
              <span className="font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded">+{hasilEvaluasi.xp_diperoleh} XP</span>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-bold text-slate-300 flex items-center gap-1">
                <span>📝</span> Lembar Umpan Balik Akademik (Ulasan):
              </h4>
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line bg-slate-950 p-4 rounded-xl border border-slate-900 font-mono">
                {hasilEvaluasi.feedback_ai}
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}