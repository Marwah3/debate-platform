'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const session = localStorage.getItem('user_session');
    
    // Proteksi Ketat: Jika tidak ada session atau role bukan admin, tendang ke login
    if (!session) {
      alert('Akses ditolak! Silakan masuk ke akun Admin.');
      window.location.href = '/login';
      return;
    }

    const user = JSON.parse(session);
    if (user.role !== 'admin') {
      alert('Akses ilegal! Halaman ini khusus untuk Pengurus/Admin.');
      window.location.href = '/dashboard';
      return;
    }

    setIsAdmin(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user_session');
    window.location.href = '/'; //;
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#F3F3F4] text-[#334F70] flex items-center justify-center font-bold">
        Memverifikasi Kredensial Admin Gontor...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F3F4] flex flex-col md:flex-row text-[#334F70]">
      
      {/* SIDEBAR NAVIGASI: Menggunakan Deep Navy pekat agar terlihat tegas */}
      <aside className="w-full md:w-64 bg-[#334F70] text-[#F3F3F4] flex flex-col justify-between p-6 shadow-xl">
        <div className="space-y-8">
          {/* Header Sidebar */}
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">Debat Panel Admin</h2>
            <p className="text-xs text-[#C8D8E8] mt-1 font-medium">Dashboard Pengurus UKM</p>
          </div>

          {/* Menu Link Navigasi */}
          <nav className="flex flex-col gap-2">
            <Link 
              href="/admin/dashboard" 
              className={`px-4 py-3 rounded-xl text-sm font-bold transition flex items-center gap-2 ${
                pathname === '/admin/dashboard' ? 'bg-[#7EA0CF]/20 text-white border-l-4 border-[#7EA0CF]' : 'hover:bg-white/5 text-[#C8D8E8] hover:text-white'
              }`}
            >
              📊 Ringkasan Dasbor
            </Link>
            
            <Link 
              href="/admin/motions" 
              className={`px-4 py-3 rounded-xl text-sm font-bold transition flex items-center gap-2 ${
                pathname === '/admin/motions' ? 'bg-[#7EA0CF]/20 text-white border-l-4 border-[#7EA0CF]' : 'hover:bg-white/5 text-[#C8D8E8] hover:text-white'
              }`}
            >
              🎙️ Manajemen Mosi AI
            </Link>

            <Link 
              href="/admin/users" 
              className={`px-4 py-3 rounded-xl text-sm font-bold transition flex items-center gap-2 ${
                pathname === '/admin/users' ? 'bg-[#7EA0CF]/20 text-white border-l-4 border-[#7EA0CF]' : 'hover:bg-white/5 text-[#C8D8E8] hover:text-white'
              }`}
            >
              📈 Monitoring Anggota
            </Link>

            <Link 
              href="/admin/modul" 
              className={`px-4 py-3 rounded-xl text-sm font-bold transition flex items-center gap-2 ${
                pathname === '/admin/modul' ? 'bg-[#7EA0CF]/20 text-white border-l-4 border-[#7EA0CF]' : 'hover:bg-white/5 text-[#C8D8E8] hover:text-white'
              }`}
            >
              📚 Manajemen Silabus
            </Link>

            <Link 
            href="/admin/landing" 
            className={`px-4 py-3 rounded-xl text-sm font-bold transition flex items-center gap-2 ${
                pathname === '/admin/landing' ? 'bg-[#7EA0CF]/20 text-white border-l-4 border-[#7EA0CF]' : 'hover:bg-white/5 text-[#C8D8E8] hover:text-white'
              }`}
          >
            🌐 Kelola Landing Page
          </Link>
          </nav>
        </div>

        {/* Tombol Keluar di Bagian Bawah */}
        <button 
          onClick={handleLogout}
          className="w-full mt-8 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-300 font-bold rounded-xl text-xs border border-red-500/20 transition"
        >
          🚪 Keluar Sistem Admin
        </button>
      </aside>

      {/* AREA KONTEN UTAMA */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        {children}
      </main>

    </div>
  );
}