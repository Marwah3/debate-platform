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
  
  // State manajemen bank mosi dari database MySQL
  const [allMotions, setAllMotions] = useState<any[]>([]);
  const [mosiAktif, setMosiAktif] = useState<any>(null);

  // FUNGSI: Mengacak mosi dari data yang sukses ditarik dari database
  const handleAcakMosi = useCallback(() => {
    if (allMotions.length === 0) return;
    
    // Filter agar mosi yang sama tidak muncul berturut-turut jika total mosi > 1
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

    // Mengambil data mosi dari database MySQL
    const fetchMotionsFromDb = async () => {
      try {
        setLoadingMosi(true);
        const res = await fetch('/api/motions');
        const resData = await res.json();
        if (res.ok && resData.data && resData.data.length > 0) {
          setAllMotions(resData.data);
          // Set acak mosi pertama kali
          const firstRandom = resData.data[Math.floor(Math.random() * resData.data.length)];
          setMosiAktif(firstRandom);
        } else {
          // Fallback jika database mosi benar-benar masih kosong
          const fallbackMosi = { teks: "Dewan ini menyesali tren budaya kerja berlebihan (hustle culture).", jenis: "Mosi Penilaian/Evaluasi (Value Motion)" };
          setAllMotions([fallbackMosi]);
          setMosiAktif(fallbackMosi);
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
      if (!res.ok) throw new Error(resData.error || 'Gagal memproses penilaian AI.');

      setHasilEvaluasi(resData.data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Terjadi gangguan jaringan dengan Juri AI.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F3F4] text-[#334F70] p-6 md:p-12 flex flex-col items-center">
      <div className="max-w-3xl w-full space-y-8">
        
        {/* Header Bar */}
        <div className="border-b border-[#C8D8E8] pb-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-[#334F70] tracking-tight">🎙️ Laboratorium Evaluator Debat AI (RAG)</h1>
            <p className="text-xs text-slate-400 mt-1 font-medium">Uji kekuatan model penalaran AREL kamu secara objektif di sini.</p>
          </div>
          <Link href="/dashboard" className="text-sm font-bold text-slate-400 hover:text-[#334F70] transition">
            🏠 Kembali ke Dasbor
          </Link>
        </div>

        {/* PANEL CARD MOSI DINAMIS (Ice Blue Background Theme) */}
        <div className="bg-[#C8D8E8] p-6 rounded-2xl border border-[#7EA0CF]/30 space-y-4 shadow-md">
          <div className="flex justify-between items-center">
            <span className="px-3 py-1 bg-white text-[#334F70] text-xs font-bold rounded-md border border-[#7EA0CF]/20 shadow-xs">
              {loadingMosi ? '⏳ Membuka bank data...' : `📌 ${mosiAktif?.jenis || 'Mosi Latihan'}`}
            </span>
            {!loadingMosi && allMotions.length > 1 && (
              <button
                type="button"
                onClick={handleAcakMosi}
                className="text-xs font-black text-[#334F70] hover:text-[#7EA0CF] flex items-center gap-1 transition outline-hidden"
              >
                🔄 Acak Mosi Latihan Baru
              </button>
            )}
          </div>
          <p className="text-[#334F70] font-black text-xl leading-relaxed">
            {loadingMosi ? 'Menyiapkan tantangan mosi baru...' : `"${mosiAktif?.teks || 'Belum ada mosi terdaftar.'}"`}
          </p>
          <p className="text-xs text-[#334F70]/70 font-semibold">
            *Instruksi: Susun struktur kasus tim pro/kontra kamu merujuk pada penalaran logika utuh AREL untuk mosi di atas.
          </p>
        </div>

        {/* Form Penginputan Teks */}
        <form onSubmit={handleKirimArgumen} className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-bold text-[#334F70]">
              Ketikan Struktur Argumen Konstruksi Kasus Kamu:
            </label>
            <textarea
              disabled={loading || loadingMosi}
              value={teksArgumen}
              onChange={(e) => setTeksArgumen(e.target.value)}
              placeholder="Contoh: (Assertion) Saya setuju dengan mosi ini karena... (Reasoning) Hubungan sebab-akibatnya adalah... (Evidence) Contoh nyata di status quo..."
              className="w-full h-48 p-4 bg-white border border-[#C8D8E8] rounded-2xl focus:outline-hidden focus:border-[#7EA0CF] text-[#334F70] font-medium placeholder-slate-400 shadow-sm text-sm leading-relaxed transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading || loadingMosi}
            className="w-full py-4 bg-linear-to-r from-[#7EA0CF] to-[#334F70] hover:opacity-95 text-white font-black rounded-xl shadow-md shadow-[#334F70]/10 text-sm transition duration-200"
          >
            {loading ? (
              <span className="animate-pulse">⏳ Juri AI Sedang Membedah Argumenmu...</span>
            ) : (
              <>🚀 Kirim ke Juri AI Evaluator</>
            )}
          </button>
        </form>

        {errorMsg && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* BOX HASIL PENILAIAN JURI AI (White Base with Butter Yellow Highlight) */}
        {hasilEvaluasi && (
          <div className="bg-white rounded-2xl border border-[#C8D8E8] overflow-hidden shadow-xl space-y-6 p-6 animate-fadeIn">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#F3F3F4] pb-4 gap-2">
              <div>
                <h3 className="text-lg font-black text-[#334F70]">📊 Skor Hasil Analisis Juri AI</h3>
                <p className="text-xs text-slate-400 font-medium">Dihitung real-time berdasarkan keselarasan petaan Chroma DB.</p>
              </div>
              <div className="text-center px-5 py-2.5 bg-[#F3F3F4] rounded-xl border border-[#C8D8E8]">
                <span className="text-3xl font-black text-[#334F70]">{hasilEvaluasi.skor_AREL}</span>
                <span className="text-slate-400 text-xs font-bold block mt-0.5">Skor AREL</span>
              </div>
            </div>

            {/* Bonus Hadiah XP Panel - Butter Yellow Custom Theme */}
            <div className="p-4 bg-[#F2EBC3]/60 border border-amber-300/50 rounded-xl flex items-center justify-between text-xs text-[#334F70] font-bold">
              <span>✨ Selamat! Kompetensimu meningkat dari latihan mandiri ini.</span>
              <span className="font-black bg-[#334F70] text-white px-2.5 py-1 rounded-md">+{hasilEvaluasi.xp_diperoleh} XP</span>
            </div>

            {/* Konten Feedback Tulisan */}
            <div className="space-y-2">
              <h4 className="text-sm font-black text-[#334F70] flex items-center gap-1">
                <span>📝</span> Lembar Umpan Balik Akademik (Ulasan):
              </h4>
              <p className="text-[#334F70] text-sm leading-relaxed whitespace-pre-line bg-[#F3F3F4] p-4 rounded-xl border border-[#C8D8E8] font-mono font-medium">
                {hasilEvaluasi.feedback_ai}
              </p>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}