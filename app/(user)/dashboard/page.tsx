'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const [userData, setUserData] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const session = localStorage.getItem('user_session');
    
    if (!session) {
      alert('Akses ditolak! Silakan masuk ke akun Anda terlebih dahulu.');
      window.location.href = '/login';
      return;
    }

    const loggedInUser = JSON.parse(session);

    const fetchDataDasbor = async () => {
      try {
        setLoading(true);
        
        const resUser = await fetch(`/api/user?id_user=${loggedInUser.id_user}`);
        const resUserData = await resUser.json();
        if (resUserData.success) {
          setUserData(resUserData.data);
        }

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

  // Fungsi penanganan keluar sistem (Logout)
  const handleLogout = () => {
    if (confirm('Apakah Anda yakin ingin keluar dari dashboard?')) {
      localStorage.removeItem('user_session');
      window.location.href = '/login'; // Kembali ke halaman login/registrasi
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3F3F4] text-[#334F70] flex items-center justify-center">
        <p className="text-[#334F70] font-bold animate-pulse text-lg">Memuat Status Kompetensi Debat...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F3F4] text-[#334F70] p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        
       {/* Banner Selamat Datang */}
      <div className="bg-linear-to-r from-[#334F70] to-[#7EA0CF] p-8 rounded-2xl shadow-md text-white flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight">Ahlan Wa Sahlan, {userData?.nama || 'Debater'}! 👋</h1>
          <p className="text-[#C8D8E8] text-sm font-medium">Siap mengasah argumen AREL kamu hari ini? Tingkatkan levelmu untuk menjadi Debater Utama.</p>
        </div>
        
        {/* Tombol Ikon Log Out Line-Art (Sesuai Gambar Referensi) */}
        <button
          onClick={handleLogout}
          title="Keluar Akun"
          className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition border border-white/10 group flex items-center justify-center shadow-xs"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth="2.5" 
            stroke="currentColor" 
            className="w-6 h-6 group-hover:translate-x-0.5 transition-transform duration-150"
          >
            {/* Garis Box/Pintu */}
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15" 
            />
            {/* Garis Panah Keluar */}
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M18 12H9m9 0l-3-3m3 3l-3 3" 
            />
          </svg>
        </button>
      </div>

        {/* Baris Kartu Status Gamifikasi - Ice Blue Theme */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Kartu Pencapaian Level */}
          <div className="bg-[#C8D8E8] p-6 rounded-xl border border-[#7EA0CF]/40 flex flex-col justify-between shadow-xs">
            <div>
              <span className="text-xs font-bold uppercase text-[#334F70]/70 tracking-wider">Peringkat Kompetensi</span>
              <h2 className="text-3xl font-black text-[#334F70] mt-1">LEVEL {userData?.current_level || 1}</h2>
            </div>
            <p className="text-xs text-[#334F70]/80 mt-4 leading-relaxed">Setiap kenaikan level membuka tantangan mosi debat baru yang lebih kompleks.</p>
          </div>

          {/* Kartu Total Poin XP */}
          <div className="bg-[#C8D8E8] p-6 rounded-xl border border-[#7EA0CF]/40 flex flex-col justify-between shadow-xs">
            <div>
              <span className="text-xs font-bold uppercase text-[#334F70]/70 tracking-wider">Akumulasi Pengalaman</span>
              <h2 className="text-3xl font-black text-[#334F70] mt-1">{userData?.total_xp || 0} <span className="text-sm font-normal text-[#334F70]/80">XP</span></h2>
            </div>
            <p className="text-xs text-[#334F70]/80 mt-4 leading-relaxed">XP didapatkan secara objektif dari kalkulasi akurasi parameter argumen oleh Juri AI.</p>
          </div>

          {/* Kartu Progress Bar Naik Level */}
          <div className="bg-[#C8D8E8] p-6 rounded-xl border border-[#7EA0CF]/40 flex flex-col justify-between space-y-4 shadow-xs">
            <div>
              <span className="text-xs font-bold uppercase text-[#334F70]/70 tracking-wider">Progress Menuju Level</span>
              <div className="flex justify-between text-xs font-bold text-[#334F70] mt-2 mb-1">
                <span>{(userData?.total_xp % 100) || 0} / 100 XP</span>
                <span>{((userData?.total_xp % 100)) || 0}%</span>
              </div>
              
              {/* Batang Progress Bar Dinamis */}
              <div className="w-full bg-[#F3F3F4] rounded-full h-3 overflow-hidden border border-[#7EA0CF]/30">
                <div 
                  className="bg-[#334F70] h-full rounded-full transition-all duration-500"
                  style={{ inlineSize: `${(userData?.total_xp % 100) || 0}%` }}          />
              </div>
            </div>
            <p className="text-xs text-[#334F70] font-bold">✨ Butuh {100 - ((userData?.total_xp % 100) || 0)} XP lagi untuk naik level!</p>
          </div>

        </div>

        {/* Section List Modul Dinamis dari Database */}
        <div className="space-y-4">
          <h2 className="text-xl font-black text-[#334F70] flex items-center gap-2">
            <span>📖</span> Alur Pembelajaran Silabus Debat
          </h2>

          {errorMsg && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              ⚠️ {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {modules.map((modul) => {
              const userLevel = userData?.current_level || 1;
              const isLocked = modul.urutan > 1 && modul.urutan > userLevel;

              return (
                <div 
                  key={modul.id_modul}
                  className={`bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-md ${
                    isLocked 
                      ? 'border-[#C8D8E8] opacity-60' 
                      : 'border-[#C8D8E8] hover:border-[#7EA0CF]'
                  }`}
                >
                  <div className="p-6 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-[#334F70] uppercase tracking-wider bg-[#C8D8E8] px-2.5 py-1 rounded-md">
                        Kelas Teori Debat
                      </span>
                      <span className="text-xs font-bold text-slate-400">
                        Urutan {modul.urutan}
                      </span>
                    </div>
                    <h3 className="text-lg font-extrabold text-[#334F70] line-clamp-2 leading-snug">
                      {modul.judul}
                    </h3>
                  </div>

                  <div className="p-6 pt-0">
                    {isLocked ? (
                      <div className="w-full py-3 bg-[#F3F3F4] border border-[#C8D8E8] rounded-xl text-center text-sm font-bold text-slate-400 flex items-center justify-center gap-2 cursor-not-allowed">
                        <span>🔒</span> Modul Terkunci
                      </div>
                    ) : (
                      <Link 
                        href={`/modul/${modul.id_modul}`}
                        className="block w-full py-3 bg-linear-to-r from-[#7EA0CF] to-[#334F70] hover:opacity-95 text-white text-center text-sm font-black rounded-xl transition shadow-sm"
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
       {/* Akses Pintasan Cepat Buku Catatan */}
        <div className="w-full mb-4">
          <Link 
            href="/dashboard/notes" 
            className="block w-full bg-white border border-[#C8D8E8] hover:bg-slate-50 p-4 rounded-xl text-center font-black text-[#334F70] shadow-sm transition"
          >
            📝 Buka Buku Catatan Evaluasi Mandiri
          </Link>
        </div>

        {/* Akses Pintasan Cepat Laboratorium AI */}
        <div className="pt-2">
          <Link href="/praktik" className="block w-full bg-linear-to-r from-[#334F70] to-[#7EA0CF] hover:opacity-95 p-4 rounded-xl text-center font-black text-white shadow-md shadow-[#334F70]/10 transition">
            🎙️ Masuk Laboratorium Evaluator Debat AI (RAG)
          </Link>
        </div>

        

      </div>
    </div>
  );
}