'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

function FormattedFeedback({ text }: { text: string }) {
  if (!text) return null;

  const blocks = text.split(/\n\s*\n/).filter((b) => b.trim() !== '');

  const getStyleForTitle = (title: string) => {
    const lower = title.toLowerCase();
    if (lower.includes('assertion') || lower.includes('1.')) {
      return { borderColor: 'border-l-blue-500', badgeBg: 'bg-blue-100 text-blue-800', icon: '🔹', titleDefault: '1. Assertion (A)' };
    }
    if (lower.includes('reasoning') || lower.includes('2.')) {
      return { borderColor: 'border-l-amber-500', badgeBg: 'bg-amber-100 text-amber-800', icon: '🔸', titleDefault: '2. Reasoning (R)' };
    }
    if (lower.includes('evidence') || lower.includes('3.')) {
      return { borderColor: 'border-l-emerald-500', badgeBg: 'bg-emerald-100 text-emerald-800', icon: '📊', titleDefault: '3. Evidence (E)' };
    }
    if (lower.includes('link-back') || lower.includes('4.')) {
      return { borderColor: 'border-l-purple-500', badgeBg: 'bg-purple-100 text-purple-800', icon: '🔗', titleDefault: '4. Link-back (L)' };
    }
    return { borderColor: 'border-l-slate-400', badgeBg: 'bg-slate-200 text-slate-800', icon: '📌', titleDefault: 'Catatan Evaluasi' };
  };

  return (
    <div className="space-y-4 pt-2">
      {blocks.map((block, idx) => {
        const lines = block.split('\n').filter((l) => l.trim() !== '');
        const headerLine = lines[0] || '';
        const bodyLines = lines.slice(1);

        if (headerLine.toLowerCase().includes('saran umum')) {
          return (
            <div key={idx} className="p-5 bg-[#C8D8E8] border border-[#7EA0CF]/30 rounded-2xl space-y-2 mt-4 shadow-xs">
              <p className="font-extrabold text-[#334F70] text-sm flex items-center gap-2 border-b border-[#7EA0CF]/30 pb-2">
                <span>💡</span> Saran Umum Evaluator
              </p>
              <p className="text-xs text-[#334F70] font-semibold leading-relaxed pt-1">
                {block.replace(/saran umum:\s*/i, '').replace(/\*\*/g, '')}
              </p>
            </div>
          );
        }

        const style = getStyleForTitle(headerLine);
        let mainContent = headerLine.replace(/^(\d+\.\s*\*\*.*?\*\*|\*\*.*?\*\*)/, '').replace(/\*\*/g, '').trim();
        let recommendationText = '';

        bodyLines.forEach((line) => {
          if (line.toLowerCase().includes('rekomendasi:')) {
            recommendationText += line.replace(/^\*\s*/, '').replace(/Rekomendasi:\s*/i, '').replace(/\*\*/g, '') + ' ';
          } else {
            mainContent += ' ' + line.replace(/\*\*/g, '').trim();
          }
        });

        const titleMatch = headerLine.match(/^(\d+\.\s*\*\*.*?\*\*|\*\*.*?\*\*)/);
        const titleText = titleMatch ? titleMatch[0].replace(/\*\*/g, '') : style.titleDefault;

        return (
          <div key={idx} className={`bg-white p-5 rounded-2xl border border-[#C8D8E8] border-l-4 ${style.borderColor} shadow-xs space-y-3`}>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 text-xs font-black rounded-lg ${style.badgeBg}`}>
                {style.icon} {titleText}
              </span>
            </div>

            {mainContent.trim() && (
              <p className="text-sm font-medium text-[#334F70] leading-relaxed">
                {mainContent.trim()}
              </p>
            )}

            {recommendationText.trim() && (
              <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl space-y-1 mt-2">
                <p className="font-bold text-blue-700 text-xs flex items-center gap-1.5">
                  <span>✨</span> Rekomendasi Perbaikan:
                </p>
                <p className="text-xs font-medium text-[#334F70] leading-relaxed">
                  {recommendationText.trim()}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function RuangPraktikPage() {
  const [userSession, setUserSession] = useState<any>(null);
  const [teksArgumen, setTeksArgumen] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMosi, setLoadingMosi] = useState(true);
  const [hasilEvaluasi, setHasilEvaluasi] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [allMotions, setAllMotions] = useState<any[]>([]);
  const [mosiAktif, setMosiAktif] = useState<any>(null);
  const [bahasaPilihan, setBahasaPilihan] = useState<'id' | 'en' | 'ar'>('id');
  const [isListening, setIsListening] = useState(false);

  // Function untuk Mengacak Mosi Sesuai Bahasa
  const handleAcakMosi = useCallback((bahasaTarget = bahasaPilihan) => {
    if (allMotions.length === 0) return;
    const mosiSesuaiBahasa = allMotions.filter(m => m.bahasa === bahasaTarget);
    if (mosiSesuaiBahasa.length === 0) {
      setMosiAktif({ 
        teks: bahasaTarget === 'ar' ? 'لا توجد مواضيع مسجلة لهذه اللغة.' : bahasaTarget === 'en' ? 'No motions registered for this language.' : 'Belum ada mosi terdaftar untuk bahasa ini.', 
        jenis: 'Kosong',
        bahasa: bahasaTarget 
      });
      return;
    }
    const daftarMosiTersedia = mosiSesuaiBahasa.filter(m => m.teks !== mosiAktif?.teks);
    const mosiTeksPilihan = daftarMosiTersedia.length > 0 ? daftarMosiTersedia : mosiSesuaiBahasa;
    setMosiAktif(mosiTeksPilihan[Math.floor(Math.random() * mosiTeksPilihan.length)]);
    setTeksArgumen(''); 
    setHasilEvaluasi(null); 
    setErrorMsg('');
  }, [allMotions, mosiAktif, bahasaPilihan]);

  // Handle Perubahan Bahasa Mosi
  const handleGantiBahasa = (lang: 'id' | 'en' | 'ar') => {
    setBahasaPilihan(lang);
    handleAcakMosi(lang);
  };

  // Fitur Speech-to-Text (Dikte Suara)
  const toggleSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Browser kamu tidak mendukung Speech Recognition. Harap gunakan Google Chrome.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = bahasaPilihan === 'id' ? 'id-ID' : bahasaPilihan === 'en' ? 'en-US' : 'ar-SA';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setTeksArgumen((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };

    recognition.start();
  };

  useEffect(() => {
    const session = localStorage.getItem('user_session');
    if (session) setUserSession(JSON.parse(session));

    const fetchMotionsFromDb = async () => {
      try {
        setLoadingMosi(true);
        const res = await fetch('/api/motions');
        const resData = await res.json();
        if (res.ok && resData.data && resData.data.length > 0) {
          setAllMotions(resData.data);
          const mosiAwal = resData.data.filter((m: any) => m.bahasa === 'id');
          setMosiAktif(mosiAwal.length > 0 ? mosiAwal[Math.floor(Math.random() * mosiAwal.length)] : resData.data[0]);
        } else {
          const fallbackMosi = [
            { teks: "Dewan ini menyesali tren budaya kerja berlebihan (hustle culture).", jenis: "Mosi Penilaian (Value Motion)", bahasa: "id" },
            { teks: "This House regrets the glorification of hustle culture.", jenis: "Value Motion", bahasa: "en" },
            { teks: "هذا المجلس يأسف لانتشار ثقافة العمل المفرط.", jenis: "موقف تقييمي", bahasa: "ar" }
          ];
          setAllMotions(fallbackMosi);
          setMosiAktif(fallbackMosi[0]);
        }
      } catch (err) {
        console.warn("Gagal mengambil mosi dari DB:", err);
      } finally {
        setLoadingMosi(false);
      }
    };

    fetchMotionsFromDb();
  }, []);

  const handleKirimArgumen = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teksArgumen.trim()) {
      alert("Harap ketikkan atau masukan suara kerangka argumen kamu terlebih dahulu!");
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
          teks_argumen: teksArgumen,
          mosi: mosiAktif?.teks,
          bahasa: bahasaPilihan
        })
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Gagal memproses penilaian AI.');

      setHasilEvaluasi(resData.data);
    } catch (err: any) {
      console.warn("Detail Log Eror Evaluator:", err.message || err);
      setErrorMsg(err.message || 'Terjadi gangguan jaringan dengan Juri AI.');
    } finally {
      setLoading(false);
    }
  };

  // Helper parsing response feedback
  let evalData: any = {};
  if (hasilEvaluasi) {
    if (hasilEvaluasi.eval_data) {
      evalData = hasilEvaluasi.eval_data;
    } else {
      try {
        evalData = JSON.parse(hasilEvaluasi.feedback_ai);
      } catch (e) {
        evalData = { skor_AREL: hasilEvaluasi.skor_AREL, feedback_ai: hasilEvaluasi.feedback_ai };
      }
    }
  }

  const isLayak = (evalData.skor_AREL || 0) >= 50;

  return (
    <div className="min-h-screen bg-[#F3F3F4] text-[#334F70] p-6 md:p-12 flex flex-col items-center">
      <div className="max-w-3xl w-full space-y-6">
        
        {/* Header Bar */}
        <div className="border-b border-[#C8D8E8] pb-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-[#334F70] tracking-tight">🎙️ Laboratorium Evaluator Debat AI (RAG)</h1>
            <p className="text-xs text-slate-400 mt-1 font-medium">Uji kekuatan model penalaran AREL kamu secara objektif di sini.</p>
          </div>
          <Link href="/dashboard" className="text-xs font-bold text-slate-400 hover:text-[#334F70] transition flex items-center gap-1">
            🏫 Kembali ke Dasbor
          </Link>
        </div>

        {/* Tab Pilihan 3 Bahasa Mosi */}
        <div className="flex justify-start">
          <div className="bg-[#C8D8E8]/50 p-1 rounded-xl flex gap-1 border border-[#C8D8E8]">
            <button
              type="button"
              onClick={() => handleGantiBahasa('id')}
              className={`px-4 py-1.5 rounded-lg text-xs font-black transition ${
                bahasaPilihan === 'id' ? 'bg-[#334F70] text-white shadow-xs' : 'text-[#334F70] hover:bg-white/50'
              }`}
            >
              🇮🇩 Indonesia
            </button>
            <button
              type="button"
              onClick={() => handleGantiBahasa('en')}
              className={`px-4 py-1.5 rounded-lg text-xs font-black transition ${
                bahasaPilihan === 'en' ? 'bg-[#334F70] text-white shadow-xs' : 'text-[#334F70] hover:bg-white/50'
              }`}
            >
              🇬🇧 English
            </button>
            <button
              type="button"
              onClick={() => handleGantiBahasa('ar')}
              className={`px-4 py-1.5 rounded-lg text-xs font-black transition ${
                bahasaPilihan === 'ar' ? 'bg-[#334F70] text-white shadow-xs' : 'text-[#334F70] hover:bg-white/50'
              }`}
            >
              🇦🇪 العربية
            </button>
          </div>
        </div>

        {/* Panel Card Mosi */}
        <div className="bg-[#C8D8E8] p-6 rounded-2xl border border-[#7EA0CF]/30 space-y-4 shadow-md">
          <div className="flex justify-between items-center">
            <span className="px-3 py-1 bg-white text-[#334F70] text-xs font-bold rounded-md border border-[#7EA0CF]/20">
              📌 {mosiAktif?.jenis || 'Mosi Latihan'}
            </span>
            <button
              type="button"
              onClick={() => handleAcakMosi(bahasaPilihan)}
              className="text-xs font-black text-[#334F70] hover:text-[#7EA0CF] transition cursor-pointer flex items-center gap-1"
            >
              🔄 Acak Mosi Latihan Baru
            </button>
          </div>
          <p className={`text-[#334F70] font-black text-xl leading-relaxed ${bahasaPilihan === 'ar' ? 'text-right font-serif' : 'text-left'}`}>
            "{mosiAktif?.teks || 'Belum ada mosi terdaftar.'}"
          </p>
          <p className="text-[11px] text-slate-500 italic">
            *Instruksi: Susun struktur kasus tim pro/kontra kamu merujuk pada penalaran logika utuh AREL untuk mosi di atas.
          </p>
        </div>

        {/* Form Input Argumen dengan Tombol Voice Speech-to-Text */}
        <form onSubmit={handleKirimArgumen} className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-slate-700">
              Ketikan Struktur Argumen Konstruksi Kasus Kamu:
            </label>
            <button
              type="button"
              onClick={toggleSpeechRecognition}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer ${
                isListening
                  ? 'bg-red-500 text-white border-red-600 animate-pulse'
                  : 'bg-[#C8D8E8]/60 text-[#334F70] border-[#7EA0CF]/30 hover:bg-[#C8D8E8]'
              }`}
            >
              🎙️ {isListening ? 'Mendengarkan Suara...' : 'Mulai Bicara (Dikte Suara)'}
            </button>
          </div>

          <textarea
            disabled={loading}
            value={teksArgumen}
            onChange={(e) => setTeksArgumen(e.target.value)}
            dir={bahasaPilihan === 'ar' ? 'rtl' : 'ltr'}
            placeholder="Contoh: (Assertion) Saya setuju dengan mosi ini karena... (Reasoning) Hubungan sebab-akibatnya adalah... (Evidence) Contoh nyata di status quo..."
            className="w-full h-48 p-4 bg-white border border-[#C8D8E8] rounded-2xl focus:outline-hidden focus:border-[#7EA0CF] text-[#334F70] font-medium placeholder-slate-400 shadow-sm text-sm leading-relaxed transition"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-linear-to-r from-[#7EA0CF] to-[#334F70] hover:opacity-95 text-white font-black rounded-xl shadow-md text-sm transition cursor-pointer disabled:opacity-50"
          >
            {loading ? '⏳ Juri AI Sedang Membedah Argumenmu...' : '🚀 Kirim ke Juri AI Evaluator'}
          </button>
        </form>

        {errorMsg && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* HASIL EVALUASI JURI AI DENGAN BADGE RED/GREEN & BREAKDOWN 4 UNSUR */}
        {hasilEvaluasi && (
          <div className="bg-white rounded-2xl border border-[#C8D8E8] overflow-hidden shadow-xl space-y-6 p-6 animate-fadeIn">
            
            {/* Header Skor & Status Kelayakan Badge */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#F3F3F4] pb-5 gap-4">
              <div className="space-y-2">
                <h3 className="text-lg font-black text-[#334F70]">
                  📊 Skor Hasil Analisis Juri AI
                </h3>
                <div>
                  {isLayak ? (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-black rounded-full shadow-2xs">
                      🟢 LAYAK (Memenuhi Standar Minim)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-100 border border-rose-300 text-rose-800 text-xs font-black rounded-full shadow-2xs">
                      🔴 TIDAK LAYAK (Perlu Perbaikan)
                    </span>
                  )}
                </div>
              </div>

              <div className={`text-center px-6 py-3 rounded-2xl border ${isLayak ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
                <span className={`text-3xl font-black ${isLayak ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {evalData.skor_AREL || 0}
                </span>
                <span className="text-slate-400 text-[10px] font-bold block uppercase tracking-wider mt-0.5">Skor AREL / 100</span>
              </div>
            </div>

            {/* BREAKDOWN 4 MINI PROGRESS BAR */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-[#334F70] uppercase tracking-wider block mb-2">Rincian Nilai Komponen AREL (Maks 25 / Unsur):</span>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-blue-800">🔹 Assertion (Min. 10):</span>
                    <span>{evalData.assertion_score || 0} / 25</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{ inlineSize: `${((evalData.assertion_score || 0) / 25) * 100}%` }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-amber-800">🔸 Reasoning (Min. 15):</span>
                    <span>{evalData.reasoning_score || 0} / 25</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ inlineSize: `${((evalData.reasoning_score || 0) / 25) * 100}%` }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-emerald-800">📊 Evidence (Min. 15):</span>
                    <span>{evalData.evidence_score || 0} / 25</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ inlineSize: `${((evalData.evidence_score || 0) / 25) * 100}%` }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-purple-800">🔗 Link-back (Min. 10):</span>
                    <span>{evalData.linkback_score || 0} / 25</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full rounded-full" style={{ inlineSize: `${((evalData.linkback_score || 0) / 25) * 100}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Bonus XP */}
            <div className="p-3.5 bg-[#F2EBC3]/60 border border-amber-300/50 rounded-xl flex items-center justify-between text-xs text-[#334F70] font-bold">
              <span>✨ Perolehan Pengalaman dari Sesi Latihan Ini:</span>
              <span className="font-black bg-[#334F70] text-white px-2.5 py-1 rounded-md">+{hasilEvaluasi.xp_diperoleh || 0} XP</span>
            </div>

            {/* Konten Ulasan AREL */}
            <div className="space-y-3">
              <h4 className="text-sm font-black text-[#334F70] flex items-center gap-1.5">
                <span>📝</span> Lembar Umpan Balik Akademik (Ulasan AREL):
              </h4>
              <FormattedFeedback text={evalData.feedback_ai || ''} />
            </div>

          </div>
        )}

      </div>
    </div>
  );
}