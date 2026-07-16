'use client';

import { useState, useEffect } from 'react';

export default function ManajemenModulPage() {
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // State Form Input Modul Materi Baru
  const [judulMateri, setJudulMateri] = useState('');
  const [kontenMateri, setKontenMateri] = useState('');
  const [urutanBab, setUrutanBab] = useState('1');
  const [bahasaMateri, setBahasaMateri] = useState('id');

  // 1. Fungsi Mengambil (Fetch) Data Modul dari API
  const fetchModules = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/modul');
      const resData = await res.json();
      if (res.ok && resData.data) {
        setModules(resData.data);
      }
    } catch (err) {
      console.warn('Gagal memuat materi pembelajaran:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  // 2. Fungsi Menambah Modul Materi Baru
  const handleTambahMateri = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!judulMateri.trim() || !kontenMateri.trim()) {
      alert('Judul dan Konten materi tidak boleh kosong!');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/modul', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: judulMateri, 
          content: kontenMateri, 
          order_num: urutanBab, 
          language: bahasaMateri 
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Gagal menyimpan materi baru.');
      }

      alert('Materi pembelajaran baru berhasil ditambahkan!');
      setJudulMateri('');
      setKontenMateri('');
      setUrutanBab((prev) => String(Number(prev) + 1)); // Otomatis naikkan urutan bab biar admin gampang
      fetchModules(); // Refresh tabel data
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn text-[#334F70]">
      {/* Header Halaman */}
      <div>
        <h1 className="text-3xl font-black tracking-tight">📚 Manajemen Silabus & Materi Debat</h1>
        <p className="text-sm text-slate-400 mt-1 font-medium">
          Kelola materi alur pembelajaran silabus debat terstruktur untuk bekal teori logika AREL mahasiswa.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* PANEL KIRI: FORMULIR TAMBAH MATERI */}
        <div className="bg-white p-6 rounded-2xl border border-[#C8D8E8] shadow-sm space-y-4">
          <h2 className="text-lg font-extrabold border-b border-[#F3F3F4] pb-2">➕ Tambah Bab Materi</h2>
          
          <form onSubmit={handleTambahMateri} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Urutan Nomor Bab
              </label>
              <input
                type="number"
                value={urutanBab}
                onChange={(e) => setUrutanBab(e.target.value)}
                className="w-full p-3 bg-[#F3F3F4] border border-[#C8D8E8] rounded-xl focus:outline-hidden focus:border-[#334F70] text-sm font-semibold"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                🌐 Bahasa Pengantar Materi
              </label>
              <select
                value={bahasaMateri}
                onChange={(e) => setBahasaMateri(e.target.value)}
                className="w-full p-3 bg-[#F3F3F4] border border-[#C8D8E8] rounded-xl focus:outline-hidden focus:border-[#334F70] text-sm font-semibold transition"
              >
                <option value="id">🇮🇩 Bahasa Indonesia</option>
                <option value="en">🇬🇧 English Format</option>
                <option value="ar">🇦🇪 Arabic Format</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Judul Bab Materi
              </label>
              <input
                type="text"
                value={judulMateri}
                onChange={(e) => setJudulMateri(e.target.value)}
                placeholder="Contoh: BAB 1: Pengantar Dasar Penalaran AREL"
                className="w-full p-3 bg-[#F3F3F4] border border-[#C8D8E8] rounded-xl focus:outline-hidden focus:border-[#334F70] text-sm font-medium placeholder-slate-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Isi Dokumen Materi Pembelajaran
              </label>
              <textarea
                value={kontenMateri}
                onChange={(e) => setKontenMateri(e.target.value)}
                placeholder="Tuliskan isi penjabaran teori silabus di sini..."
                className="w-full h-48 p-3 bg-[#F3F3F4] border border-[#C8D8E8] rounded-xl focus:outline-hidden focus:border-[#334F70] text-sm font-medium placeholder-slate-400 leading-relaxed"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-linear-to-r from-[#7EA0CF] to-[#334F70] hover:opacity-95 text-white font-black text-xs uppercase tracking-wider rounded-xl transition shadow-md"
            >
              {submitting ? 'Menyimpan...' : 'Simpan Materi ke Silabus ✓'}
            </button>
          </form>
        </div>

        {/* PANEL KANAN: MONITORING SILABUS */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#C8D8E8] shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#F3F3F4]">
            <h2 className="text-lg font-extrabold">📋 Kurikulum & Struktur Silabus Aktif</h2>
          </div>

          {loading ? (
            <div className="p-12 text-center text-sm font-bold text-slate-400 animate-pulse">
              Memuat data silabus debat...
            </div>
          ) : modules.length === 0 ? (
            <div className="p-12 text-center text-sm font-medium text-slate-400">
              Belum ada modul materi silabus yang ditambahkan.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F3F3F4] border-b border-[#C8D8E8] text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="p-4 w-20 text-center">Urutan</th>
                    <th className="p-4">Judul Modul Silabus</th>
                    <th className="p-4 w-28 text-center">Bahasa</th>
                    <th className="p-4 w-32 text-center">Status Awal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3F3F4] text-sm font-medium">
                  {modules.map((item) => (
                    <tr key={item.id_modul} className="hover:bg-slate-50/80 transition duration-150">
                      <td className="p-4 text-center font-black text-[#334F70] bg-[#F3F3F4]/30">
                        {item.urutan}
                      </td>
                      <td className="p-4 font-bold text-[#334F70] leading-relaxed">
                        {item.judul}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-0.5 text-xs font-black rounded-md border ${
                          item.bahasa === 'en' 
                            ? 'bg-blue-50 text-blue-600 border-blue-200' 
                            : item.bahasa === 'ar' 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                            : 'bg-slate-50 text-slate-600 border-slate-200'
                        }`}>
                          {item.bahasa === 'en' ? '🇬🇧 EN' : item.bahasa === 'ar' ? '🇸🇦 AR' : '🇮🇩 ID'}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
                          🔒 Auto Lock
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}