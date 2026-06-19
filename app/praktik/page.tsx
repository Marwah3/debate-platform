'use client';

import { useState, useEffect } from 'react';

export default function PraktikDebatPage() {
  const [argumen, setArgumen] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasilEvaluasi, setHasilEvaluasi] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
  const session = localStorage.getItem('user_session');
  if (!session) {
    alert('Akses ditolak! Silakan login untuk memulai praktik debat.');
    window.location.href = '/login';
  }
}, []);

  const handleKirimArgumen = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!argumen.trim()) return;

    setLoading(true);
    setErrorMsg('');
    setHasilEvaluasi(null);

    try {
      // MODIFIKASI LANGKAH 3: Ambil data session user yang sedang aktif login dari localStorage
      const session = localStorage.getItem('user_session');
      const loggedInUser = session ? JSON.parse(session) : null;

      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Jika loggedInUser ada, gunakan id_user aslinya. Jika tidak ada, fallback aman ke 1.
          id_user: loggedInUser ? loggedInUser.id_user : 1, 
          teks_argumen: argumen,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Terjadi kesalahan saat mengevaluasi.');
      }

      setHasilEvaluasi(data.data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal terhubung ke server AI.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8 flex flex-col items-center">
      <div className="max-w-3xl w-full space-y-8">
        
        {/* Header Halaman */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-teal-400 mb-2">Laboratorium Evaluator Debat AI</h1>
          <p className="text-slate-400">Uji kemampuan parameter AREL kamu secara real-time dipandu oleh Juri AI RAG.</p>
        </div>

        {/* Form Input Teks Mahasiswa */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl">
          <form onSubmit={handleKirimArgumen} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Mosi Latihan: "Dewan ini mendukung pembatasan penggunaan media sosial bagi pelajar."
              </label>
              <textarea
                value={argumen}
                onChange={(e) => setArgumen(e.target.value)}
                rows={5}
                className="w-full p-4 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-teal-500 transition duration-200 placeholder-slate-500"
                placeholder="Ketik susunan argumen AREL kamu di sini secara detail..."
                disabled={loading}
              />
            </div>
            
            <button
              type="submit"
              disabled={loading || !argumen.trim()}
              className={`w-full py-3 rounded-lg font-bold text-slate-950 transition duration-200 ${
                loading || !argumen.trim()
                  ? 'bg-slate-600 cursor-not-allowed text-slate-400'
                  : 'bg-teal-400 hover:bg-teal-500 shadow-lg shadow-teal-500/20'
              }`}
            >
              {loading ? 'Juri AI Sedang Menganalisis Struktur AREL...' : 'Kirim Argumen Ke Juri AI'}
            </button>
          </form>

          {errorMsg && (
            <div className="mt-4 p-3 bg-red-900/40 border border-red-500 rounded-lg text-red-300 text-sm">
              ⚠️ {errorMsg}
            </div>
          )}
        </div>

        {/* Panel Hasil Evaluasi & Poin Gamifikasi */}
        {hasilEvaluasi && (
          <div className="space-y-6 animate-fade-in">
            {/* Kartu Skor Gamifikasi */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 text-center">
                <span className="block text-sm text-slate-400 font-semibold uppercase tracking-wider">Skor Parameter AREL</span>
                <span className="text-4xl font-extrabold text-teal-400">{hasilEvaluasi.skor_AREL} / 100</span>
              </div>
              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 text-center">
                <span className="block text-sm text-slate-400 font-semibold uppercase tracking-wider">Reward Pengalaman</span>
                <span className="text-4xl font-extrabold text-amber-400">+{hasilEvaluasi.xp_diperoleh} XP</span>
              </div>
            </div>

            {/* Kotak Umpan Balik Akademik */}
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl space-y-3">
              <h3 className="text-lg font-bold text-teal-400 flex items-center gap-2">
                <span>📋</span> Catatan Koreksi Juri AI:
              </h3>
              <p className="text-slate-300 leading-relaxed text-sm whitespace-pre-line bg-slate-950 p-4 rounded-lg border border-slate-800">
                {hasilEvaluasi.feedback_ai}
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}