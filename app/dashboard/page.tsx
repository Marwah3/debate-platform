// app/dashboard/page.tsx
'use client';

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  // Data awal kosong (akan bertambah nanti)
  const stats = {
    totalXP: 0,
    maxXP: 1500,
    level: "1",
    levelName: "Pemula",
    modulesCompleted: 0,
    totalModules: 12,
    argumentsSubmitted: 0,
    badges: 0,
  };

  if (!user) {
    router.push('/login');
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-[#f0fdfa] p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Profile Header */}
        <div className="bg-white rounded-2xl p-6 flex items-center justify-between shadow mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#14b8a6] rounded-full flex items-center justify-center text-white text-4xl">
              👤
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user.username}</h1>
              <p className="text-gray-600">Level {stats.level} - {stats.levelName}</p>
            </div>
          </div>

          {/* XP Progress */}
          <div className="text-right">
            <div className="text-sm text-gray-500 mb-1">
              {stats.totalXP} / {stats.maxXP} XP
            </div>
            <div className="w-64 h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="bg-[#14b8a6] h-full rounded-full transition-all"
                style={{ inlineSize: "0%" }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-1">Level {stats.level}</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow flex items-center gap-4">
            <div className="text-4xl">📚</div>
            <div>
              <p className="text-gray-500 text-sm">Total Modul Selesai</p>
              <p className="text-4xl font-bold text-[#14b8a6]">{stats.modulesCompleted} / {stats.totalModules}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow flex items-center gap-4">
            <div className="text-4xl">💬</div>
            <div>
              <p className="text-gray-500 text-sm">Total Argumen Disubmit</p>
              <p className="text-4xl font-bold text-[#14b8a6]">{stats.argumentsSubmitted}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow flex items-center gap-4">
            <div className="text-4xl">🏆</div>
            <div>
              <p className="text-gray-500 text-sm">Badge Diraih</p>
              <p className="text-4xl font-bold text-[#14b8a6]">{stats.badges}</p>
            </div>
          </div>
        </div>

        {/* Modul Tersedia & Aktivitas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow">
            <h2 className="text-xl font-semibold mb-5">Modul Tersedia</h2>
            <p className="text-gray-500 italic py-8 text-center">Mulai belajar modul pertama untuk melihat progress</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow">
            <h2 className="text-xl font-semibold mb-5">Aktivitas Terbaru</h2>
            <p className="text-gray-500 italic py-8 text-center">Belum ada aktivitas</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          <button 
            onClick={() => router.push('/modul')}
            className="bg-[#14b8a6] hover:bg-[#0f766e] text-white py-5 rounded-2xl text-xl font-semibold flex items-center justify-center gap-3"
          >
            📖 Mulai Belajar
          </button>
          
          <button 
            onClick={() => router.push('/praktik')}
            className="bg-[#0f766e] hover:bg-[#115e59] text-white py-5 rounded-2xl text-xl font-semibold flex items-center justify-center gap-3"
          >
            ⚔️ Masuk Ruang Praktik
          </button>
        </div>
      </div>
    </div>
  );
}