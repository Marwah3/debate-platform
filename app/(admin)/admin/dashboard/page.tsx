'use client';

import { useState, useEffect } from 'react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ totalMahasiswa: 0, totalMosi: 0, rataSkorArel: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/admin/dashboard');
        const resData = await res.json();
        
        if (res.ok && resData.data) {
          setStats(resData.data);
        }
      } catch (err) {
        console.error('Gagal memuat statistik riil dasbor admin:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardStats();
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn text-[#334F70]">
      {/* Header Halaman */}
      <div>
        <h1 className="text-3xl font-black tracking-tight">📊 Ringkasan Dasbor Admin</h1>
        <p className="text-sm text-slate-400 mt-1 font-medium">
          Ikhtisar aktivitas platform pembelajaran debat berbasis RAG secara real-time.
        </p>
      </div>

      {/* Baris Grid Kartu Metrik - Dinamis Terhubung ke MySQL */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        <div className="bg-[#C8D8E8] p-6 rounded-2xl border border-[#7EA0CF]/30 shadow-xs">
          <span className="text-xs font-bold uppercase text-[#334F70]/70 tracking-wider block">Total Anggota Aktif</span>
          <span className="text-4xl font-black mt-2 block">
            {loading ? '...' : `${stats.totalMahasiswa} Orang`}
          </span>
        </div>

        <div className="bg-[#C8D8E8] p-6 rounded-2xl border border-[#7EA0CF]/30 shadow-xs">
          <span className="text-xs font-bold uppercase text-[#334F70]/70 tracking-wider block">Mosi di Lab AI</span>
          <span className="text-4xl font-black mt-2 block">
            {loading ? '...' : `${stats.totalMosi} Tema`}
          </span>
        </div>

        <div className="bg-[#C8D8E8] p-6 rounded-2xl border border-[#7EA0CF]/30 shadow-xs">
          <span className="text-xs font-bold uppercase text-[#334F70]/70 tracking-wider block">Rata-rata Skor AREL</span>
          <span className="text-4xl font-black mt-2 block text-emerald-700">
            {loading ? '...' : `${stats.rataSkorArel} / 100`}
          </span>
        </div>

      </div>

      {/* Papan Informasi Alur Penelitian */}
      <div className="bg-white p-6 rounded-2xl border border-[#C8D8E8] shadow-sm space-y-3">
        <h3 className="font-extrabold text-base">📌 Petunjuk Pengurus UKM Debat UNIDA Gontor</h3>
        <p className="text-sm text-slate-500 leading-relaxed font-medium">
          Melalui panel ini, Anda dapat memperbarui topik mosi debat secara real-time pada menu <strong>Manajemen Mosi AI</strong> untuk mengganti bahan latihan mandiri mahasiswa, serta melihat grafik rekam jejak penalaran logika AREL anggota pada menu <strong>Monitoring Anggota</strong>.
        </p>
      </div>
    </div>
  );
}