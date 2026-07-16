'use client';

import { useState, useEffect } from 'react';

export default function ManajemenMosiPage() {
  const [motions, setMotions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // State Form Input Mosi Baru
  const [teksMosi, setTeksMosi] = useState('');
  const [jenisMosi, setJenisMosi] = useState('Mosi Kebijakan (Policy Motion)');
  const [bahasaMosi, setBahasaMosi] = useState('id'); // ← State baru untuk pilihan bahasa

  // 1. Fungsi Mengambil (Fetch) Data Mosi dari API
  const fetchMotions = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/motions');
      const resData = await res.json();
      if (res.ok && resData.data) {
        setMotions(resData.data);
      }
    } catch (err) {
      console.warn('Gagal memuat mosi:', err);
    } finally { // ← UBAH DARI 'filter' MENJADI 'finally' DI SINI
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMotions();
  }, []);

  // 2. Fungsi Menambah Mosi Baru
  const handleTambahMosi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teksMosi.trim()) {
      alert('Teks mosi tidak boleh kosong!');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/motions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          teks: teksMosi, 
          jenis: jenisMosi, 
          bahasa: bahasaMosi // ← Parameter bahasa dikirim langsung ke API backend
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Gagal menyimpan mosi.');
      }

      alert('Mosi latihan baru berhasil ditambahkan!');
      setTeksMosi(''); // Kosongkan input
      setBahasaMosi('id'); // Reset ke default bahasa Indonesia
      fetchMotions(); // Refresh tabel data
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // 3. Fungsi Menghapus Mosi
  const handleHapusMosi = async (id_motion: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus mosi latihan ini?')) return;

    try {
      const res = await fetch(`/api/motions?id=${id_motion}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Gagal menghapus mosi.');
      }

      alert('Mosi berhasil dihapus dari sistem.');
      fetchMotions(); // Refresh tabel data
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn text-[#334F70]">
      {/* Header Halaman */}
      <div>
        <h1 className="text-3xl font-black tracking-tight">🎙️ Manajemen Bank Mosi AI</h1>
        <p className="text-sm text-slate-400 mt-1 font-medium">
          Tambah dan kontrol topik mosi debat yang menjadi bahan praktik penalaran AREL mahasiswa.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* ========================================================================= */}
        {/* PANEL KIRI: FORMULIR TAMBAH MOSI BARU                                     */}
        {/* ========================================================================= */}
        <div className="bg-white p-6 rounded-2xl border border-[#C8D8E8] shadow-sm space-y-4">
          <h2 className="text-lg font-extrabold border-b border-[#F3F3F4] pb-2">➕ Tambah Mosi Baru</h2>
          
          <form onSubmit={handleTambahMosi} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Kategori / Jenis Mosi
              </label>
              <select
                value={jenisMosi}
                onChange={(e) => setJenisMosi(e.target.value)}
                className="w-full p-3 bg-[#F3F3F4] border border-[#C8D8E8] rounded-xl focus:outline-hidden focus:border-[#334F70] text-sm font-semibold transition"
              >
                <option value="Mosi Kebijakan (Policy Motion)">Mosi Kebijakan (Policy Motion)</option>
                <option value="Mosi Prinsip/Nilai (Principle Motion)">Mosi Prinsip/Nilai (Principle Motion)</option>
                <option value="Mosi Penilaian/Evaluasi (Value Motion)">Mosi Penilaian/Evaluasi (Value Motion)</option>
              </select>
            </div>

            {/* ================= SELEKSI BAHASA MOSI BARU ================= */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                🌐 Bahasa Pengantar Mosi
              </label>
              <select
                value={bahasaMosi}
                onChange={(e) => setBahasaMosi(e.target.value)}
                className="w-full p-3 bg-[#F3F3F4] border border-[#C8D8E8] rounded-xl focus:outline-hidden focus:border-[#334F70] text-sm font-semibold transition"
              >
                <option value="id">🇮🇩 Bahasa Indonesia</option>
                <option value="en">🇬🇧 English Format</option>
                <option value="ar">🇦🇪 Arabic Format</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Teks Pernyataan Mosi Debat
              </label>
              <textarea
                value={teksMosi}
                onChange={(e) => setTeksMosi(e.target.value)}
                placeholder="Contoh: Dewan ini akan memajak klub olahraga besar untuk mendanai klub kecil..."
                className="w-full h-32 p-3 bg-[#F3F3F4] border border-[#C8D8E8] rounded-xl focus:outline-hidden focus:border-[#334F70] text-sm font-medium placeholder-slate-400 leading-relaxed transition"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-linear-to-r from-[#7EA0CF] to-[#334F70] hover:opacity-95 text-white font-black text-xs uppercase tracking-wider rounded-xl transition shadow-md shadow-[#334F70]/10"
            >
              {submitting ? 'Menyimpan...' : 'Simpan ke Bank Data ✓'}
            </button>
          </form>
        </div>

        {/* ========================================================================= */}
        {/* PANEL KANAN: TABEL MONITORING & KONTROL MOSI                              */}
        {/* ========================================================================= */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#C8D8E8] shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#F3F3F4]">
            <h2 className="text-lg font-extrabold">📋 Daftar Mosi Terdaftar di Database</h2>
          </div>

          {loading ? (
            <div className="p-12 text-center text-sm font-bold text-slate-400 animate-pulse">
              Sinkronisasi basis data mosi...
            </div>
          ) : motions.length === 0 ? (
            <div className="p-12 text-center text-sm font-medium text-slate-400">
              Belum ada mosi khusus yang diinput oleh admin.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F3F3F4] border-b border-[#C8D8E8] text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="p-4 pl-6 w-16 text-center">No</th>
                    <th className="p-4">Pernyataan Mosi</th>
                    <th className="p-4 w-32 text-center">Bahasa</th>
                    <th className="p-4 w-52">Jenis Kategori</th>
                    <th className="p-4 w-24 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3F3F4] text-sm font-medium">
                  {motions.map((item, index) => (
                    <tr key={item.id_motion} className="hover:bg-slate-50/80 transition duration-150">
                      <td className="p-4 pl-6 text-center text-slate-400 font-bold">{index + 1}</td>
                      <td 
                        className="p-4 font-bold text-[#334F70] pr-6 leading-relaxed"
                        dir={item.bahasa === 'ar' ? 'rtl' : 'ltr'}
                      >
                        "{item.teks}"
                      </td>
                      {/* ================= BARIS BADGE BAHASA ADAPTIF ================= */}
                      <td className="p-4 text-center">
                        <span className={`px-2 py-1 text-xs font-black rounded-md border ${
                          item.bahasa === 'en' 
                            ? 'bg-blue-50 text-blue-600 border-blue-200' 
                            : item.bahasa === 'ar' 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                            : 'bg-slate-50 text-slate-600 border-slate-200'
                        }`}>
                          {item.bahasa === 'en' ? '🇬🇧 EN' : item.bahasa === 'ar' ? '🇸🇦 AR' : '🇮🇩 ID'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 bg-[#C8D8E8]/50 text-[#334F70] text-xs font-bold rounded-md border border-[#7EA0CF]/10">
                          {item.jenis}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleHapusMosi(item.id_motion)}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-xs font-bold rounded-lg transition"
                        >
                          Hapus
                        </button>
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