'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Helper Logic Kalkulasi Level 1 - 10 & Status Kualifikasi Kompetensi
function getLevelInfo(totalXp: number = 0) {
  if (totalXp >= 3000) return { level: 10, label: 'Level 10', badge: '🏆 Siap Lomba Offline', nextTarget: 3000, isMax: true };
  if (totalXp >= 2600) return { level: 9,  label: 'Level 9',  badge: '⚔️ Layak Sparring Offline', nextTarget: 3000, isMax: false };
  if (totalXp >= 2200) return { level: 8,  label: 'Level 8',  badge: '⚔️ Layak Sparring Offline', nextTarget: 2600, isMax: false };
  if (totalXp >= 1800) return { level: 7,  label: 'Level 7',  badge: '⚔️ Layak Sparring Offline', nextTarget: 2200, isMax: false };
  if (totalXp >= 1400) return { level: 6,  label: 'Level 6',  badge: '⚔️ Layak Sparring Offline', nextTarget: 1800, isMax: false };
  if (totalXp >= 1000) return { level: 5,  label: 'Level 5',  badge: '⚔️ Layak Sparring Offline', nextTarget: 1400, isMax: false };
  if (totalXp >= 700)  return { level: 4,  label: 'Level 4',  badge: '📚 Debater Mahir', nextTarget: 1000, isMax: false };
  if (totalXp >= 400)  return { level: 3,  label: 'Level 3',  badge: '📚 Debater Menengah', nextTarget: 700,  isMax: false };
  if (totalXp >= 150)  return { level: 2,  label: 'Level 2',  badge: '📚 Debater Dasar', nextTarget: 400,  isMax: false };
  return { level: 1, label: 'Level 1', badge: '🌱 Pemula', nextTarget: 150, isMax: false };
}

export default function DashboardPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // State Carousel Swipe Per 4 Modul (2x2 Grid)
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;

  useEffect(() => {
    const session = localStorage.getItem('user_session');
    
    if (!session) {
      alert('Akses ditolak! Silakan masuk ke akun Anda terlebih dahulu.');
      window.location.href = '/login';
      return;
    }

    const loggedInUser = JSON.parse(session);

    // SATPAM ROUTE GUARD: Proteksi Khusus Admin
    const userRole = String(loggedInUser.role || '').toLowerCase();
    if (userRole === 'admin') {
      router.replace('/admin/dashboard');
      return;
    }

    const fetchDataDasbor = async () => {
      try {
        setLoading(true);
        
        // Fetch User Data
        const resUser = await fetch(`/api/user?id_user=${loggedInUser.id_user}`);
        const resUserData = await resUser.json();
        if (resUserData.success) {
          setUserData(resUserData.data);
        }

        // Fetch Modul + Status Kuis User Specific
        const resModul = await fetch(`/api/modul?id_user=${loggedInUser.id_user}`);
        const resModulData = await resModul.json();
        if (resModulData.success) {
          const sorted = [...resModulData.data].sort((a: any, b: any) => a.urutan - b.urutan);
          setModules(sorted);
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
  }, [router]);

  // Kalkulasi Pagination
  const totalPages = Math.ceil(modules.length / itemsPerPage);
  
  const currentModuls = modules.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 0) setCurrentPage((prev) => prev - 1);
  };

  // Logout
  const handleLogout = () => {
    if (confirm('Apakah Anda yakin ingin keluar dari dashboard?')) {
      localStorage.removeItem('user_session');
      window.location.href = '/';
    }
  };

  // Kalkulasi Level & Progress XP
  const userXp = userData?.total_xp || 0;
  const levelInfo = getLevelInfo(userXp);
  
  // Hitung persentase progress menuju level berikutnya
  const prevLevelTarget = levelInfo.level === 1 ? 0 : [0, 0, 150, 400, 700, 1000, 1400, 1800, 2200, 2600, 3000][levelInfo.level];
  const xpNeededInCurrentLevel = levelInfo.nextTarget - prevLevelTarget;
  const xpGainedInCurrentLevel = Math.max(0, userXp - prevLevelTarget);
  const progressPercent = levelInfo.isMax 
    ? 100 
    : Math.min(100, Math.round((xpGainedInCurrentLevel / xpNeededInCurrentLevel) * 100));

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3F3F4] text-[#334F70] flex items-center justify-center">
        <p className="text-[#334F70] font-bold animate-pulse text-lg">Memuat Status Kompetensi Debat...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F3F4] text-[#334F70] p-6 md:p-12 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Banner Selamat Datang */}
        <div className="bg-linear-to-r from-[#334F70] to-[#7EA0CF] p-8 rounded-2xl shadow-md text-white flex justify-between items-center">
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tight">Ahlan Wa Sahlan, {userData?.nama || 'Debater'}! 👋</h1>
            <p className="text-[#C8D8E8] text-sm font-medium">Siap mengasah argumen AREL kamu hari ini? Tingkatkan levelmu untuk menjadi Debater Utama.</p>
          </div>
          
          <button
            onClick={handleLogout}
            title="Keluar Akun"
            className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition border border-white/10 group flex items-center justify-center shadow-xs cursor-pointer"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth="2.5" 
              stroke="currentColor" 
              className="w-6 h-6 group-hover:translate-x-0.5 transition-transform duration-150"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H9m9 0l-3-3m3 3l-3 3" />
            </svg>
          </button>
        </div>

        {/* Baris Kartu Status Gamifikasi */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Kartu Level */}
          <div className="bg-[#C8D8E8] p-6 rounded-xl border border-[#7EA0CF]/40 flex flex-col justify-between shadow-xs">
            <div>
              <span className="text-xs font-bold uppercase text-[#334F70]/70 tracking-wider">Peringkat Kompetensi</span>
              <h2 className="text-3xl font-black text-[#334F70] mt-1">LEVEL {levelInfo.level}</h2>
              <div className="mt-2">
                <span className={`inline-block px-3 py-1 text-[11px] font-black rounded-full text-white ${
                  levelInfo.level === 10 ? 'bg-emerald-600' : levelInfo.level >= 5 ? 'bg-amber-600' : 'bg-[#334F70]'
                }`}>
                  {levelInfo.badge}
                </span>
              </div>
            </div>
            <p className="text-xs text-[#334F70]/80 mt-4 leading-relaxed">
              Level 5 membuka akses <b>Sparring Offline</b>, sedangkan Level 10 kualifikasi <b>Lomba Offline</b>.
            </p>
          </div>

          {/* Kartu XP */}
          <div className="bg-[#C8D8E8] p-6 rounded-xl border border-[#7EA0CF]/40 flex flex-col justify-between shadow-xs">
            <div>
              <span className="text-xs font-bold uppercase text-[#334F70]/70 tracking-wider">Akumulasi Pengalaman</span>
              <h2 className="text-3xl font-black text-[#334F70] mt-1">{userXp} <span className="text-sm font-normal text-[#334F70]/80">XP</span></h2>
            </div>
            <p className="text-xs text-[#334F70]/80 mt-4 leading-relaxed">XP didapatkan dari kelulusan kuis materi dan akurasi evaluasi argumen AREL oleh AI.</p>
          </div>

          {/* Kartu Progress Bar */}
          <div className="bg-[#C8D8E8] p-6 rounded-xl border border-[#7EA0CF]/40 flex flex-col justify-between space-y-4 shadow-xs">
            <div>
              <span className="text-xs font-bold uppercase text-[#334F70]/70 tracking-wider">Progress Menuju Level</span>
              <div className="flex justify-between text-xs font-bold text-[#334F70] mt-2 mb-1">
                <span>{userXp} / {levelInfo.nextTarget} XP</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="w-full bg-[#F3F3F4] rounded-full h-3 overflow-hidden border border-[#7EA0CF]/30">
                <div 
                  className="bg-[#334F70] h-full rounded-full transition-all duration-500"
                 style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
            <p className="text-xs text-[#334F70] font-bold">
              {levelInfo.isMax 
                ? '🎉 Selamat! Kamu telah mencapai Level Maksimal (Level 10)!' 
                : `✨ Butuh ${levelInfo.nextTarget - userXp} XP lagi untuk naik ke Level ${levelInfo.level + 1}!`}
            </p>
          </div>

        </div>

        {/* Section List Modul Dinamis */}
        <div className="space-y-4">
          
          {/* Header Section */}
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-black text-[#334F70] flex items-center gap-2">
              <span>📖</span> Alur Pembelajaran Silabus Debat
            </h2>
            <span className="bg-[#F6EFCC] text-[#334F70] font-black text-xs px-3 py-1 rounded-full border border-[#7EA0CF]/30">
              {modules.length} Bab
            </span>
          </div>

          {errorMsg && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              ⚠️ {errorMsg}
            </div>
          )}

          {/* Wrapper Carousel */}
          <div className="flex items-center gap-3 md:gap-4">

            {/* 1. TOMBOL PANAH KIRI */}
            <div className="w-12 flex justify-center shrink-0">
              {currentPage > 0 ? (
                <button
                  onClick={handlePrevPage}
                  title="Materi Sebelumnya"
                  className="w-11 h-11 rounded-full bg-[#334F70] hover:bg-[#283e58] text-white flex items-center justify-center shadow-md transition-all duration-200 hover:scale-105 cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
              ) : null}
            </div>

            {/* 2. GRID MATERI 2x2 */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-5 min-h-75">
              {currentModuls.map((modul) => {
                const userLevel = levelInfo.level;

                const isUnlocked = 
                  modul.urutan === 1 || 
                  modul.status_lock === false || 
                  userLevel >= modul.urutan;

                return (
                  <div 
                    key={modul.id_modul}
                    className={`bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-xs ${
                      !isUnlocked 
                        ? 'border-[#C8D8E8] opacity-75' 
                        : 'border-[#C8D8E8] hover:border-[#7EA0CF] hover:shadow-md'
                    }`}
                  >
                    <div className="p-6 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-black text-[#334F70] uppercase tracking-wider bg-[#C8D8E8]/60 px-3 py-1 rounded-lg">
                          Kelas Teori Debat
                        </span>
                        
                        {modul.is_completed ? (
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                            ✅ Selesai (Lulus)
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-slate-400">
                            Urutan {modul.urutan}
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-extrabold text-[#334F70] line-clamp-2 leading-snug">
                        {modul.judul}
                      </h3>
                    </div>

                    <div className="p-6 pt-0">
                      {!isUnlocked ? (
                        <div className="w-full py-3 bg-[#F3F3F4] border border-[#C8D8E8] rounded-xl text-center text-xs font-bold text-slate-400 flex items-center justify-center gap-2 cursor-not-allowed">
                          <span>🔒</span> Modul Terkunci (Butuh Level {modul.urutan})
                        </div>
                      ) : (
                        <Link 
                          href={`/modul/${modul.id_modul}`}
                          className="block w-full py-3 bg-linear-to-r from-[#7EA0CF] to-[#334F70] hover:opacity-95 text-white text-center text-xs font-black rounded-xl transition shadow-xs"
                        >
                          Buka Materi Pembelajaran →
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 3. TOMBOL PANAH KANAN */}
            <div className="w-12 flex justify-center shrink-0">
              {currentPage < totalPages - 1 ? (
                <button
                  onClick={handleNextPage}
                  title="Materi Selanjutnya"
                  className="w-11 h-11 rounded-full bg-[#334F70] hover:bg-[#283e58] text-white flex items-center justify-center shadow-md transition-all duration-200 hover:scale-105 cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              ) : null}
            </div>

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