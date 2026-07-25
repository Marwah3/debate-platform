'use client';

import { useState, useEffect } from 'react';

export default function ManajemenModulPage() {
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // State mode Edit (null = Tambah Baru, angka = ID Modul yang sedang di-edit)
  const [editingId, setEditingId] = useState<number | null>(null);

  // State Form Input Modul Materi
  const [judulMateri, setJudulMateri] = useState('');
  const [kontenMateri, setKontenMateri] = useState('');
  const [urutanBab, setUrutanBab] = useState('1');
  const [bahasaMateri, setBahasaMateri] = useState('id');
  const [statusLockInput, setStatusLockInput] = useState('true');

  // 1. Fetch Data Modul
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

  // Reset Form ke Kondisi Awal
  const resetForm = () => {
    setEditingId(null);
    setJudulMateri('');
    setKontenMateri('');
    setStatusLockInput('true');
    setBahasaMateri('id');
    setUrutanBab(String(modules.length + 1));
  };

  // 2. Fungsi Pasang Data ke Form saat Klik 'Edit'
  const handleStartEdit = (item: any) => {
    setEditingId(item.id_modul);
    setJudulMateri(item.judul || item.title || '');
    setKontenMateri(item.konten_materi || item.konten || item.content || '');
    setUrutanBab(String(item.urutan || 1));
    setBahasaMateri(item.bahasa || 'id');
    setStatusLockInput(item.status_lock === false ? 'false' : 'true');
  };

  // 3. Fungsi Submit (Tambah Baru ATAU Update Data)
  const handleSubmitMateri = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!judulMateri.trim()) {
      alert('Judul materi tidak boleh kosong!');
      return;
    }

    try {
      setSubmitting(true);
      const isEdit = editingId !== null;
      const url = '/api/modul';
      const method = isEdit ? 'PUT' : 'POST';

      const payload = {
        id_modul: editingId,
        title: judulMateri,
        content: kontenMateri, // Jika kosong, backend API tidak akan menimpa materi bawaan
        order_num: Number(urutanBab),
        language: bahasaMateri,
        status_lock: statusLockInput === 'true',
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Gagal menyimpan materi.');
      }

      alert(isEdit ? 'Modul materi berhasil diperbarui!' : 'Materi pembelajaran baru berhasil ditambahkan!');
      resetForm();
      fetchModules();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // 4. Fungsi Hapus Modul
  const handleHapusModul = async (id_modul: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus bab materi silabus ini?')) return;

    try {
      const res = await fetch(`/api/modul?id=${id_modul}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Gagal menghapus modul materi.');
      }

      alert('Modul materi berhasil dihapus dari silabus.');
      fetchModules();
    } catch (err: any) {
      alert(err.message);
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
        
        {/* PANEL KIRI: FORMULIR TAMBAH / EDIT MATERI */}
        <div className="bg-white p-6 rounded-2xl border border-[#C8D8E8] shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-[#F3F3F4] pb-2">
            <h2 className="text-lg font-extrabold">
              {editingId ? '✏️ Edit Bab Materi' : '➕ Tambah Bab Materi'}
            </h2>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-xs font-bold text-slate-400 hover:text-red-500 underline cursor-pointer"
              >
                Batal Edit
              </button>
            )}
          </div>
          
          <form onSubmit={handleSubmitMateri} className="space-y-4">
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
                🔒 Aksesibilitas Modul (Kuncian)
              </label>
              <select
                value={statusLockInput}
                onChange={(e) => setStatusLockInput(e.target.value)}
                className="w-full p-3 bg-[#F3F3F4] border border-[#C8D8E8] rounded-xl focus:outline-hidden focus:border-[#334F70] text-sm font-semibold transition"
              >
                <option value="true">🔒 Terkunci (Perlu Syarat/Urutan)</option>
                <option value="false">🔓 Terbuka Bebas (Bisa Langsung Diakses/Lampiran)</option>
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
                Isi Dokumen Materi Pembelajaran (Opsional)
              </label>
              <textarea
                value={kontenMateri}
                onChange={(e) => setKontenMateri(e.target.value)}
                placeholder="Kosongkan jika isi materi menggunakan file Word/RAG bawaan..."
                className="w-full h-48 p-3 bg-[#F3F3F4] border border-[#C8D8E8] rounded-xl focus:outline-hidden focus:border-[#334F70] text-sm font-medium placeholder-slate-400 leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-3 text-white font-black text-xs uppercase tracking-wider rounded-xl transition shadow-md cursor-pointer ${
                editingId
                  ? 'bg-[#334F70] hover:bg-[#283e58]'
                  : 'bg-linear-to-r from-[#7EA0CF] to-[#334F70] hover:opacity-95'
              }`}
            >
              {submitting
                ? 'Menyimpan...'
                : editingId
                ? 'Simpan Perubahan Modul ✓'
                : 'Simpan Materi ke Silabus ✓'}
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
                    <th className="p-4 w-16 text-center">Urutan</th>
                    <th className="p-4">Judul Modul Silabus</th>
                    <th className="p-4 w-24 text-center">Bahasa</th>
                    <th className="p-4 w-32 text-center">Status Awal</th>
                    <th className="p-4 w-36 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3F3F4] text-sm font-medium">
                  {modules.map((item) => (
                    <tr
                      key={item.id_modul}
                      className={`hover:bg-slate-50/80 transition duration-150 ${
                        editingId === item.id_modul ? 'bg-blue-50/60' : ''
                      }`}
                    >
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
                        {item.status_lock === false ? (
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                            🔓 Terbuka Bebas
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
                            🔒 Auto Lock
                          </span>
                        )}
                      </td>
                      
                      {/* KOLOM AKSI: EDIT & HAPUS */}
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(item)}
                            className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600 text-xs font-bold rounded-lg transition cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleHapusModul(item.id_modul)}
                            className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-xs font-bold rounded-lg transition cursor-pointer"
                          >
                            Hapus
                          </button>
                        </div>
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