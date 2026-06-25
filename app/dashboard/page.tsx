'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const [userData, setUserData] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // 1. Ambil data session login dari localStorage browser
    const session = localStorage.getItem('user_session');
    
    // 2. PROTEKSI Halaman: Jika data login tidak ditemukan, kembalikan ke gerbang login
    if (!session) {
      alert('Akses ditolak! Silakan masuk ke akun Anda terlebih dahulu.');
      window.location.href = '/login';
      return;
    }

    const loggedInUser = JSON.parse(session);

    // 3. Mengambil data User dan daftar Modul secara paralel dari API
    const fetchDataDasbor = async () => {
      try {
        setLoading(true);
        
        // Ambil data user dari database
        const resUser = await fetch(`/api/user?id_user=${loggedInUser.id_user}`);
        const resUserData = await resUser.json();
        if (resUserData.success) {
          setUserData(resUserData.data);
        }

        // Ambil daftar modul teoretis dari database
        const resModul = await fetch('/api/modul');
        const resModulData = await resModul.json();
        if (resModulData.success) {
          setModules(resModulData.data);
        } else {
          throw new Error(resModulData.error || 'Gagal mengambil data modul.');
        }

      } catch (err: any) {
        console.error("❌ Gagal memuat data dasbor:", err);
        setErrorMsg(err.message || 'Terjadi kesalahan jaringan.');
      } finally {
        setLoading(false);
      }
    };

    fetchDataDasbor();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center">
        <p className="text-teal-400 font-semibold animate-pulse">Memuat Status Kompetensi Debat...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Selamat Datang Banner */}
        <div className="bg-linear-to-r from-teal-600 to-cyan-700 p-6 rounded-2xl shadow-xl">
          {/* PERBAIKAN: Menggunakan .nama sesuai schema.prisma kamu */}
          <h1 className="text-2xl font-bold text-white mb-1">Ahlan Wa Sahlan, {userData?.nama || 'Debater'}! 👋</h1>
          <p className="text-teal-100 text-sm">Siap mengasah argumen AREL kamu hari ini? Tingkatkan levelmu untuk menjadi Debater Utama.</p>
        </div>

        {/* Baris Kartu Status Gamifikasi */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Kartu Pencapaian Level */}
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Peringkat Kompetensi</span>
              {/* PERBAIKAN: Menggunakan .current_level sesuai schema.prisma kamu */}
              <h2 className="text-3xl font-extrabold text-teal-400 mt-1">LEVEL {userData?.current_level || 1}</h2>
            </div>
            <p className="text-xs text-slate-400 mt-4">Setiap kenaikan level membuka tantangan mosi debat baru yang lebih kompleks.</p>
          </div>

          {/* Kartu Total Poin XP */}
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Akumulasi Pengalaman</span>
              {/* PERBAIKAN: Menggunakan .total_xp sesuai schema.prisma kamu */}
              <h2 className="text-3xl font-extrabold text-amber-400 mt-1">{userData?.total_xp || 0} <span className="text-sm font-normal text-slate-400">XP</span></h2>
            </div>
            <p className="text-xs text-slate-400 mt-4">XP didapatkan secara objektif dari kalkulasi akurasi parameter argumen oleh Juri AI.</p>
          </div>

          {/* Kartu Progress Bar Naik Level */}
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Progress Menuju Level</span>
              <div className="flex justify-between text-xs text-slate-400 mt-2 mb-1">
                {/* Perhitungan sisa batas level secara logis berkelanjutan */}
                <span>{(userData?.total_xp % 100) || 0} / 100 XP</span>
                <span>{((userData?.total_xp % 100)) || 0}%</span>
              </div>
              {/* Batang Progress Bar Dinamis */}
              <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800">
                <div 
                  className="bg-linear-to-r from-teal-400 to-cyan-400 h-full transition-all duration-500"
                  // PERBAIKAN: Menggunakan inlineSize menggantikan width agar linter CSS tidak protes
                  style={{ inlineSize: `${(userData?.total_xp % 100) || 0}%` }}
                />
              </div>
            </div>
            <p className="text-xs text-teal-400 font-medium">✨ Butuh {100 - ((userData?.total_xp % 100) || 0)} XP lagi untuk naik level!</p>
          </div>

        </div>

        {/* Section List Modul Dinamis dari Database */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-200 flex items-center gap-2">
            <span>📖</span> Alur Pembelajaran Silabus Debat
          </h2>

          {errorMsg && (
            <div className="p-4 bg-red-950/40 border border-red-500/30 rounded-xl text-red-400 text-sm">
              ⚠️ {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {modules.map((modul) => {
              const isLocked = modul.status_lock;

              return (
                <div 
                  key={modul.id_modul}
                  className={`bg-slate-800 rounded-xl border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-lg ${
                    isLocked 
                      ? 'border-slate-800/80 opacity-60' 
                      : 'border-slate-700 hover:border-teal-500/50'
                  }`}
                >
                  <div className="p-6 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-teal-400 uppercase tracking-wider bg-teal-400/10 px-2 py-0.5 rounded">
                        Kelas Teori Debat
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        Urutan {modul.urutan}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-200 line-clamp-2">
                      {modul.judul}
                    </h3>
                  </div>

                  <div className="p-6 pt-0">
                    {isLocked ? (
                      <div className="w-full py-2.5 bg-slate-900/60 border border-slate-800 rounded-lg text-center text-sm font-medium text-slate-500 flex items-center justify-center gap-2 cursor-not-allowed">
                        <span>🔒</span> Modul Terkunci
                      </div>
                    ) : (
                      <Link 
                        href={`/modul/${modul.id_modul}`}
                        className="block w-full py-2.5 bg-teal-400 hover:bg-teal-500 text-slate-950 text-center text-sm font-bold rounded-lg transition duration-200"
                      >
                        Buka Materi Pembelajaran →
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Akses Pintasan Cepat Laboratorium AI */}
        <div className="pt-2">
          <Link href="/praktik" className="block w-full bg-linear-to-r from-teal-400 to-cyan-500 hover:opacity-90 p-4 rounded-xl text-center font-bold text-slate-950 shadow-lg shadow-teal-500/5 transition">
            🎙️ Masuk Laboratorium Evaluator Debat AI (RAG)
          </Link>
        </div>

      </div>
    </div>
  );
}