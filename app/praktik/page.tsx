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

  // State tambahan untuk kontrol Bahasa & Speech-to-Text
  const [bahasaPilihan, setBahasaPilihan] = useState('id'); // 'id', 'en', atau 'ar'
  const [sedangMerekam, setSedangMerekam] = useState(false);

  // FUNGSI: Mengacak mosi berdasarkan filter bahasa yang aktif
  const handleAcakMosi = useCallback((bahasaTarget = bahasaPilihan) => {
    if (allMotions.length === 0) return;
    
    // Filter mosi dari database yang sesuai dengan bahasa pilihan
    const mosiSesuaiBahasa = allMotions.filter(m => m.bahasa === bahasaTarget);
    
    if (mosiSesuaiBahasa.length === 0) {
      setMosiAktif({ teks: "Belum ada mosi terdaftar untuk bahasa ini.", jenis: "Kosong" });
      return;
    }

    // Hindari mosi yang sama muncul berturut-turut
    const daftarMosiTersedia = mosiSesuaiBahasa.filter(m => m.teks !== mosiAktif?.teks);
    const mosiTeksPilihan = daftarMosiTersedia.length > 0 ? daftarMosiTersedia : mosiSesuaiBahasa;
    
    const mosiRandom = mosiTeksPilihan[Math.floor(Math.random() * mosiTeksPilihan.length)];
    setMosiAktif(mosiRandom);
    setTeksArgumen(''); 
    setHasilEvaluasi(null); 
    setErrorMsg('');
  }, [allMotions, mosiAktif, bahasaPilihan]);

  // Efek samping untuk mengacak mosi baru secara otomatis saat user mengganti pilihan bahasa
  const handleGantiBahasa = (bahasaBaru: string) => {
    setBahasaPilihan(bahasaBaru);
    handleAcakMosi(bahasaBaru);
  };

  useEffect(() => {
    const session = localStorage.getItem('user_session');
    if (session) {
      setUserSession(JSON.parse(session));
    }

    const fetchMotionsFromDb = async () => {
      try {
        setLoadingMosi(true);
        const res = await fetch('/api/motions');
        const resData = await res.json();
        if (res.ok && resData.data && resData.data.length > 0) {
          setAllMotions(resData.data);
          
          // Mengambil mosi pertama kali sesuai default bahasa 'id'
          const mosiAwal = resData.data.filter((m: any) => m.bahasa === 'id');
          if (mosiAwal.length > 0) {
            setMosiAktif(mosiAwal[Math.floor(Math.random() * mosiAwal.length)]);
          } else {
            setMosiAktif(resData.data[0]);
          }
        } else {
          // Fallback lokal jika tabel database masih kosong
          const fallbackMosi = { teks: "Dewan ini menyesali tren budaya kerja berlebihan (hustle culture).", jenis: "Mosi Penilaian/Evaluasi (Value Motion)", bahasa: "id" };
          setAllMotions([fallbackMosi]);
          setMosiAktif(fallbackMosi);
        }
      } catch (err) {
        console.warn("Gagal mengambil mosi dari DB:", err);
      } finally {
        setLoadingMosi(false);
      }
    };

    fetchMotionsFromDb();
  }, []);

  // FUNGSI: Eksekusi Input Suara Otomatis Adaptif (Speech-to-Text)
  const tanganiInputSuara = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Maaf, browser Anda tidak mendukung fitur pengenalan suara (Speech Recognition). Silakan gunakan Google Chrome atau Microsoft Edge terbaru.");
      return;
    }

    if (sedangMerekam) {
      setSedangMerekam(false);
      return;
    }

    const recognition = new SpeechRecognition();
    
    // PEMETAAN BAHASA ADAPTIF: Otomatis mengenali aksen ucapan sesuai bahasa mosi
    if (bahasaPilihan === 'en') recognition.lang = 'en-US';
    else if (bahasaPilihan === 'ar') recognition.lang = 'ar-SA';
    else recognition.lang = 'id-ID';

    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setSedangMerekam(true);
    };

    recognition.onend = () => {
      setSedangMerekam(false);
    };

    recognition.onerror = (event: any) => {
      console.warn("Speech Recognition Error:", event.error);
      setSedangMerekam(false);
    };

    recognition.onresult = (event: any) => {
      const hasilTeksSuara = event.results[0][0].transcript;
      setTeksArgumen((prev) => prev ? `${prev} ${hasilTeksSuara}` : hasilTeksSuara);
    };

    recognition.start();
  };

  const handleKirimArgumen = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teksArgumen.trim()) {
      alert("Harap ketikkan atau dikte kerangka argumen debat kamu terlebih dahulu!");
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
          bahasa: bahasaPilihan // ← Parameter bahasa adaptif dikirim langsung ke Prompt Gemini di Backend
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

        {/* ================= PENGATURAN PILIHAN BAHASA ADAPTIF ================= */}
        <div className="flex justify-center md:justify-start items-center gap-2 bg-[#C8D8E8]/50 p-1.5 rounded-xl w-fit border border-[#C8D8E8]">
          <button
            type="button"
            onClick={() => handleGantiBahasa('id')}
            className={`px-4 py-2 text-xs font-black rounded-lg transition ${bahasaPilihan === 'id' ? 'bg-[#334F70] text-white shadow-xs' : 'text-[#334F70] hover:bg-white/50'}`}
          >
            🇮🇩 Indonesia
          </button>
          <button
            type="button"
            onClick={() => handleGantiBahasa('en')}
            className={`px-4 py-2 text-xs font-black rounded-lg transition ${bahasaPilihan === 'en' ? 'bg-[#334F70] text-white shadow-xs' : 'text-[#334F70] hover:bg-white/50'}`}
          >
            🇬🇧 English
          </button>
          <button
            type="button"
            onClick={() => handleGantiBahasa('ar')}
            className={`px-4 py-2 text-xs font-black rounded-lg transition ${bahasaPilihan === 'ar' ? 'bg-[#334F70] text-white shadow-xs' : 'text-[#334F70] hover:bg-white/50'}`}
          >
            🇦🇪 العربية
          </button>
        </div>

        {/* PANEL CARD MOSI DINAMIS */}
        <div 
          dir={bahasaPilihan === 'ar' ? 'rtl' : 'ltr'} 
          className="bg-[#C8D8E8] p-6 rounded-2xl border border-[#7EA0CF]/30 space-y-4 shadow-md transition-all duration-300"
        >
          <div className={`flex justify-between items-center ${bahasaPilihan === 'ar' ? 'flex-row-reverse' : ''}`}>
            <span className="px-3 py-1 bg-white text-[#334F70] text-xs font-bold rounded-md border border-[#7EA0CF]/20 shadow-xs">
              {loadingMosi ? '⏳ Membuka bank data...' : `📌 ${mosiAktif?.jenis || 'Mosi Latihan'}`}
            </span>
            {!loadingMosi && allMotions.length > 0 && mosiAktif?.jenis !== "Kosong" && (
              <button
                type="button"
                onClick={() => handleAcakMosi(bahasaPilihan)}
                className="text-xs font-black text-[#334F70] hover:text-[#7EA0CF] flex items-center gap-1 transition outline-hidden"
              >
                🔄 {bahasaPilihan === 'ar' ? 'تغيير القضية' : 'Acak Mosi Latihan Baru'}
              </button>
            )}
          </div>
          <p className={`text-[#334F70] font-black text-xl leading-relaxed ${bahasaPilihan === 'ar' ? 'text-right font-semibold' : ''}`}>
            {loadingMosi ? 'Menyiapkan tantangan mosi baru...' : `"${mosiAktif?.teks || 'Belum ada mosi terdaftar.'}"`}
          </p>
          <p className="text-xs text-[#334F70]/70 font-semibold">
            {bahasaPilihan === 'ar' 
              ? '*إرشادات: قم ببناء هيكل الحجة الخاص بك بناءً على منطق AREL الكامل للقضية أعلاه.'
              : '*Instruksi: Susun struktur kasus tim pro/kontra kamu merujuk pada penalaran logika utuh AREL untuk mosi di atas.'}
          </p>
        </div>

        {/* Form Penginputan Teks & Kontrol Fitur Suara */}
        <form onSubmit={handleKirimArgumen} className="space-y-4">
          <div className="flex flex-col space-y-2">
            <div className={`flex justify-between items-center ${bahasaPilihan === 'ar' ? 'flex-row-reverse' : ''}`}>
              <label className="text-sm font-bold text-[#334F70]">
                {bahasaPilihan === 'ar' ? 'اكتب أو أملِ حجة المناظرة الخاصة بك:' : 'Ketikan Struktur Argumen Konstruksi Kasus Kamu:'}
              </label>
              
              <button
                type="button"
                disabled={loading || loadingMosi || mosiAktif?.jenis === "Kosong"}
                onClick={tanganiInputSuara}
                className={`px-4 py-2 text-xs font-black rounded-xl transition flex items-center gap-2 shadow-xs disabled:opacity-50 ${
                  sedangMerekam 
                    ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                    : 'bg-[#C8D8E8] hover:bg-[#b8c8d8] text-[#334F70]'
                }`}
              >
                {sedangMerekam ? (
                  <>
                    <span className="inline-block w-2 h-2 rounded-full bg-white animate-ping"></span>
                    {bahasaPilihan === 'ar' ? 'جاري الاستماع...' : 'Mendengarkan...'}
                  </>
                ) : (
                  <>🎙️ {bahasaPilihan === 'ar' ? 'ابدأ التحدث (الإملاء الصوتي)' : 'Mulai Bicara (Dikte Suara)'}</>
                )}
              </button>
            </div>

            <textarea
              disabled={loading || loadingMosi || mosiAktif?.jenis === "Kosong"}
              value={teksArgumen}
              onChange={(e) => setTeksArgumen(e.target.value)}
              dir={bahasaPilihan === 'ar' ? 'rtl' : 'ltr'}
              placeholder={bahasaPilihan === 'ar' 
                ? '...Assertion) أنا أؤيد هذه القضية لأن) :مثال' 
                : 'Contoh: (Assertion) Saya setuju dengan mosi ini karena... (Reasoning) Hubungan sebab-akibatnya adalah... (Evidence) Contoh nyata di status quo...'}
              className="w-full h-48 p-4 bg-white border border-[#C8D8E8] rounded-2xl focus:outline-hidden focus:border-[#7EA0CF] text-[#334F70] font-medium placeholder-slate-400 shadow-sm text-sm leading-relaxed transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading || loadingMosi || sedangMerekam || mosiAktif?.jenis === "Kosong"}
            className="w-full py-4 bg-linear-to-r from-[#7EA0CF] to-[#334F70] hover:opacity-95 text-white font-black rounded-xl shadow-md shadow-[#334F70]/10 text-sm transition duration-200 disabled:opacity-50"
          >
            {loading ? (
              <span className="animate-pulse">
                {bahasaPilihan === 'ar' ? '⏳ جاري تحليل الحجة من قبل الذكاء الاصطناعي...' : '⏳ Juri AI Sedang Membedah Argumenmu...'}
              </span>
            ) : (
              <>{bahasaPilihan === 'ar' ? '🚀 إرسال إلى المحكم الآلي' : '🚀 Kirim ke Juri AI Evaluator'}</>
            )}
          </button>
        </form>

        {errorMsg && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* BOX HASIL PENILAIAN JURI AI */}
        {hasilEvaluasi && (
          <div 
            dir={bahasaPilihan === 'ar' ? 'rtl' : 'ltr'} 
            className="bg-white rounded-2xl border border-[#C8D8E8] overflow-hidden shadow-xl space-y-6 p-6 animate-fadeIn"
          >
            <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#F3F3F4] pb-4 gap-2 ${bahasaPilihan === 'ar' ? 'sm:flex-row-reverse' : ''}`}>
              <div>
                <h3 className="text-lg font-black text-[#334F70]">
                  {bahasaPilihan === 'ar' ? '📊 نتيجة تحليل المحكم الآلي' : '📊 Skor Hasil Analisis Juri AI'}
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  {bahasaPilihan === 'ar' ? 'تم الحساب بناءً على تطابق البيانات مع Chroma DB.' : 'Dihitung real-time berdasarkan keselarasan petaan Chroma DB.'}
                </p>
              </div>
              <div className="text-center px-5 py-2.5 bg-[#F3F3F4] rounded-xl border border-[#C8D8E8]">
                <span className="text-3xl font-black text-[#334F70]">{hasilEvaluasi.skor_AREL}</span>
                <span className="text-slate-400 text-xs font-bold block mt-0.5">{bahasaPilihan === 'ar' ? 'درجة AREL' : 'Skor AREL'}</span>
              </div>
            </div>

            {/* Bonus Hadiah XP Panel */}
            <div className={`p-4 bg-[#F2EBC3]/60 border border-amber-300/50 rounded-xl flex items-center justify-between text-xs text-[#334F70] font-bold ${bahasaPilihan === 'ar' ? 'flex-row-reverse' : ''}`}>
              <span>{bahasaPilihan === 'ar' ? '✨ تهانينا! لقد زادت خبرتك من خلال هذه الممارسة.' : '✨ Selamat! Kompetensimu meningkat dari latihan mandiri ini.'}</span>
              <span className="font-black bg-[#334F70] text-white px-2.5 py-1 rounded-md">+{hasilEvaluasi.xp_diperoleh} XP</span>
            </div>

            {/* Konten Feedback Tulisan */}
            <div className="space-y-2">
              <h4 className={`text-sm font-black text-[#334F70] flex items-center gap-1 ${bahasaPilihan === 'ar' ? 'flex-row-reverse' : ''}`}>
                <span>📝</span> {bahasaPilihan === 'ar' ? 'تقرير الملاحظات الأكاديمية (المراجعة):' : 'Lembar Umpan Balik Akademik (Ulasan):'}
              </h4>
              <p className={`text-[#334F70] text-sm leading-relaxed whitespace-pre-line bg-[#F3F3F4] p-4 rounded-xl border border-[#C8D8E8] font-mono font-medium ${bahasaPilihan === 'ar' ? 'text-right' : ''}`}>
                {hasilEvaluasi.feedback_ai}
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}