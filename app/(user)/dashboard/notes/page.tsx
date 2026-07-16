'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function NotesPage() {
  const [userSession, setUserSession] = useState<any>(null);
  const [notesList, setNotesList] = useState<any[]>([]);
  const [judul, setJudul] = useState('');
  const [isi, setIsi] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem('user_session');
    if (!session) {
      window.location.href = '/login';
      return;
    }
    const loggedInUser = JSON.parse(session);
    setUserSession(loggedInUser);
    
    // Fallback dinamis jika field ID disimpan sebagai id_user atau id murni
    const targetUserId = loggedInUser.id_user || loggedInUser.id;
    if (targetUserId) {
      fetchCatatan(Number(targetUserId));
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCatatan = async (idUser: number) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/notes?id_user=${idUser}`);
      const json = await res.json();
      if (json.success) setNotesList(json.data);
    } catch (err) {
      console.error('Gagal memuat catatan:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSimpanCatatan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul.trim() || !isi.trim()) return alert('Judul dan isi catatan tidak boleh kosong!');
    
    const activeUserId = userSession?.id_user || userSession?.id;
    if (!activeUserId) return alert('Sesi pengguna tidak valid. Silakan login ulang.');

    try {
      setSubmitting(true);
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_user: Number(activeUserId),
          judul_catatan: judul,
          isi_catatan: isi
        })
      });
      const json = await res.json();
      if (json.success) {
        setJudul('');
        setIsi('');
        fetchCatatan(Number(activeUserId)); // Memuat ulang koleksi catatan terbaru
      } else {
        alert(json.error || 'Gagal menyimpan catatan.');
      }
    } catch (err) {
      console.error('Error saat menyimpan catatan:', err);
      alert('Terjadi kesalahan jaringan sistem backend.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleHapusCatatan = async (idNote: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus catatan evaluasi ini?')) return;
    const activeUserId = userSession?.id_user || userSession?.id;
    
    try {
      const res = await fetch(`/api/notes?id_note=${idNote}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success && activeUserId) {
        fetchCatatan(Number(activeUserId));
      }
    } catch (err) {
      console.error('Error saat menghapus catatan:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F3F4] text-[#334F70] p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Navigasi */}
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tight">📝 Buku Catatan Evaluasi Mandiri</h1>
            <p className="text-xs text-slate-500 font-medium">Simpan mosi sulit, strategi jitu, dan hasil koreksi penting dari Juri AI di sini.</p>
          </div>
          <Link href="/dashboard" className="px-4 py-2 bg-white border border-[#C8D8E8] text-sm font-bold rounded-xl hover:bg-slate-50 shadow-xs transition">
            ← Kembali ke Dasbor
          </Link>
        </div>

        {/* Form Pembuatan Catatan */}
        <form onSubmit={handleSimpanCatatan} className="bg-white p-6 rounded-2xl border border-[#C8D8E8] shadow-md space-y-4">
          <h2 className="text-md font-extrabold text-[#334F70] flex items-center gap-2">
            <span>🖋️</span> Tulis Catatan Baru
          </h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Judul Catatan (Contoh: Evaluasi Mosi Ekonomi Halal)"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              className="w-full p-3 bg-[#F3F3F4] border border-[#C8D8E8] rounded-xl text-sm focus:outline-hidden focus:border-[#7EA0CF] font-bold"
            />
            <textarea
              placeholder="Tulis detail catatan, strategi AREL baru, atau kekurangan argumenmu..."
              value={isi}
              rows={4}
              onChange={(e) => setIsi(e.target.value)}
              className="w-full p-3 bg-[#F3F3F4] border border-[#C8D8E8] rounded-xl text-sm focus:outline-hidden focus:border-[#7EA0CF] leading-relaxed"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full md:w-auto px-6 py-3 bg-[#334F70] hover:bg-[#253a54] text-white text-sm font-black rounded-xl shadow-sm transition disabled:opacity-50"
          >
            {submitting ? 'Menyimpan...' : 'Simpan ke Buku Catatan'}
          </button>
        </form>

        {/* Daftar Catatan Tersimpan */}
        <div className="space-y-4">
          <h2 className="text-lg font-black text-[#334F70]">📚 Koleksi Catatan Kamu</h2>
          
          {loading ? (
            <p className="text-sm font-bold animate-pulse text-slate-400">Membuka lembaran catatan...</p>
          ) : notesList.length === 0 ? (
            <div className="p-8 bg-[#C8D8E8]/30 border border-[#C8D8E8] rounded-2xl text-center">
              <p className="text-sm font-medium text-slate-500">Buku catatan masih kosong. Mulai tulis catatan evaluasi pertamamu di atas!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {notesList.map((catatan) => (
                <div key={catatan.id_note} className="bg-white p-6 rounded-2xl border border-[#C8D8E8] shadow-xs flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-extrabold text-base text-[#334F70] line-clamp-1">{catatan.judul_catatan}</h3>
                      <button
                        onClick={() => handleHapusCatatan(catatan.id_note)}
                        className="text-slate-400 hover:text-red-500 transition text-sm p-1"
                        title="Hapus Catatan"
                        type="button"
                      >
                        🗑️
                      </button>
                    </div>
                    <p className="text-xs text-slate-400 font-semibold">
                      {new Date(catatan.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">{catatan.isi_catatan}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}