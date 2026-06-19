'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Ambil data session login dari localStorage browser
    const session = localStorage.getItem('user_session');
    
    // 2. PROTEKSI Halaman: Jika data login tidak ditemukan, tendang balik ke gerbang login
    if (!session) {
      alert('Akses ditolak! Silakan masuk ke akun Anda terlebih dahulu.');
      window.location.href = '/login';
      return;
    }

    const loggedInUser = JSON.parse(session);

    // 3. Ambil data gamifikasi secara dinamis berdasarkan ID User asli yang sedang login
    fetch(`/api/user?id_user=${loggedInUser.id_user}`)
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          setUserData(resData.data);
        }
      })
      .catch((err) => console.error("Gagal memuat data dasbor:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center">
        <p className="text-teal-400 font-semibold animate-pulse">Memuat Status Kompetensi Debat...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Selamat Datang Banner */}
        <div className="bg-gradient-to-r from-teal-600 to-cyan-700 p-6 rounded-2xl shadow-xl">
          <h1 className="text-2xl font-bold text-white mb-1">Ahlan Wa Sahlan, {userData?.username || 'Debater'}! 👋</h1>
          <p className="text-teal-100 text-sm">Siap mengasah argumen AREL kamu hari ini? Tingkatkan levelmu untuk menjadi Debater Utama.</p>
        </div>

        {/* Baris Kartu Status Gamifikasi */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Kartu Pencapaian Level */}
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Peringkat Kompetensi</span>
              <h2 className="text-3xl font-extrabold text-teal-400 mt-1">LEVEL {userData?.level}</h2>
            </div>
            <p className="text-xs text-slate-400 mt-4">Setiap kenaikan level membuka tantangan mosi debat baru yang lebih kompleks.</p>
          </div>

          {/* Kartu Total Poin XP */}
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Akumulasi Pengalaman</span>
              <h2 className="text-3xl font-extrabold text-amber-400 mt-1">{userData?.total_xp} <span className="text-sm font-normal text-slate-400">XP</span></h2>
            </div>
            <p className="text-xs text-slate-400 mt-4">XP didapatkan secara objektif dari kalkulasi akurasi parameter argumen oleh Juri AI.</p>
          </div>

          {/* Kartu Progress Bar Naik Level */}
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Progress Menuju Level Selanjutnya</span>
              <div className="flex justify-between text-xs text-slate-400 mt-2 mb-1">
                <span>{userData?.xp_current_level} / 100 XP</span>
                <span>{userData?.progress_percentage}%</span>
              </div>
              {/* Batang Progress Bar Dinamis */}
              <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800">
                <div 
                  className="bg-gradient-to-r from-teal-400 to-cyan-400 h-full transition-all duration-500"
                  style={{ width: `${userData?.progress_percentage}%` }}
                />
              </div>
            </div>
            <p className="text-xs text-teal-400 font-medium">✨ Butuh {userData?.xp_next_level} XP lagi untuk naik level!</p>
          </div>

        </div>

        {/* Tombol Navigasi Menu Utama */}
        <div className="flex gap-4">
          <Link href="/modul" className="flex-1 bg-slate-800 hover:bg-slate-750 p-4 rounded-xl border border-slate-700 text-center font-bold text-slate-200 transition">
            📖 Buka Materi Modul
          </Link>
          <Link href="/praktik" className="flex-1 bg-gradient-to-r from-teal-400 to-cyan-500 hover:opacity-90 p-4 rounded-xl text-center font-bold text-slate-950 shadow-lg transition">
            🎙️ Mulai Praktik Debat AI
          </Link>
        </div>

      </div>
    </div>
  );
}