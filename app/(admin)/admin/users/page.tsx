'use client';

import { useState, useEffect } from 'react';

export default function MonitoringAnggotaPage() {
  const [anggota, setAnggota] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk manajemen Jendela Pop-up Modal Detail Riwayat
  const [modalOpen, setModalOpen] = useState(false);
  const [userTerpilih, setUserTerpilih] = useState<any>(null);

  const fetchAnggotaData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/users');
      const resData = await res.json();
      if (res.ok && resData.data) {
        setAnggota(resData.data);
      }
    } catch (err) {
      console.error('Gagal mengambil data monitoring:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnggotaData();
  }, []);

  const bukaDetailRiwayat = (mhs: any) => {
    setUserTerpilih(mhs);
    setModalOpen(true);
  };

  // Fungsi Aksi Menghapus Anggota/Mahasiswa tidak aktif
  const handleHapusAnggota = async (id_user: number, nama: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus anggota "${nama}"? Semua riwayat nilai latihan dan XP miliknya akan dihapus permanen.`)) return;

    try {
      const res = await fetch(`/api/admin/users?id=${id_user}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Gagal menghapus anggota.');
      }

      alert('Akun anggota berhasil dihapus.');
      fetchAnggotaData(); // Segarkan baris tabel
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn text-[#334F70]">
      {/* Header Halaman */}
      <div>
        <h1 className="text-3xl font-black tracking-tight">📈 Monitoring Progres Anggota</h1>
        <p className="text-sm text-slate-400 mt-1 font-medium">
          Pantau akumulasi pengalaman (XP), level kompetensi, and rekam jejak penilaian juri AI secara objektif.
        </p>
      </div>

      {/* TABEL LEADERBOARD PROGRESS */}
      <div className="bg-white rounded-2xl border border-[#C8D8E8] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#F3F3F4]">
          <h2 className="text-lg font-extrabold">🏆 Papan Peringkat & Aktivitas Mahasiswa</h2>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm font-bold text-slate-400 animate-pulse">
            Menyelaraskan grafik kompetensi anggota UKM...
          </div>
        ) : anggota.length === 0 ? (
          <div className="p-12 text-center text-sm font-medium text-slate-400">
            Belum ada akun mahasiswa aktif yang terdaftar di database.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F3F3F4] border-b border-[#C8D8E8] text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="p-4 pl-6 w-16 text-center">Rank</th>
                  <th className="p-4">Nama Mahasiswa</th>
                  <th className="p-4 text-center">Kompetensi</th>
                  <th className="p-4 text-center">Total XP</th>
                  <th className="p-4 text-center">Latihan Mandiri</th>
                  <th className="p-4 text-center">Rata-rata Skor</th>
                  <th className="p-4 text-center w-56">Aksi Kontrol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F3F4] text-sm font-medium">
                {anggota.map((mhs, index) => (
                  <tr key={mhs.id_user} className="hover:bg-slate-50/80 transition duration-150">
                    <td className="p-4 pl-6 text-center">
                      <span className={`inline-flex w-6 h-6 rounded-full text-xs font-black items-center justify-center ${
                        index === 0 ? 'bg-amber-100 text-amber-700' : index === 1 ? 'bg-slate-200 text-slate-700' : 'bg-[#F3F3F4] text-slate-400'
                      }`}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-[#334F70]">{mhs.nama}</div>
                      <div className="text-xs text-slate-400 font-medium">{mhs.email}</div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="px-2.5 py-1 bg-[#334F70] text-white text-xs font-black rounded-md shadow-xs">
                        LVL {mhs.current_level}
                      </span>
                    </td>
                    <td className="p-4 text-center text-[#334F70] font-black">
                      {mhs.total_xp} XP
                    </td>
                    <td className="p-4 text-center text-slate-500 font-semibold">
                      {mhs.total_latihan} Kali
                    </td>
                    <td className="p-4 text-center">
                      <span className={`font-black text-sm ${mhs.rata_rata_skor >= 75 ? 'text-emerald-600' : 'text-[#334F70]'}`}>
                        {mhs.rata_rata_skor} / 100
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => bukaDetailRiwayat(mhs)}
                          className="px-3 py-1.5 bg-[#C8D8E8]/50 hover:bg-[#7EA0CF]/30 border border-[#7EA0CF]/20 text-[#334F70] text-xs font-bold rounded-lg transition"
                        >
                          Riwayat
                        </button>
                        <button
                          onClick={() => handleHapusAnggota(mhs.id_user, mhs.nama)}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-xs font-bold rounded-lg transition"
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

      {/* POP-UP MODAL: DETAIL RIWAYAT EVALUASI */}
      {modalOpen && userTerpilih && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl border border-[#C8D8E8] shadow-2xl max-w-3xl w-full h-137.5 flex flex-col overflow-hidden animate-scaleUp">
            
            <div className="p-6 bg-[#F3F3F4] border-b border-[#C8D8E8] flex justify-between items-center">
              <div>
                <h3 className="text-lg font-black text-[#334F70]">📋 Rekam Log Latihan: {userTerpilih.nama}</h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Menampilkan seluruh kasus struktur AREL yang tersimpan.</p>
              </div>
              <button 
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white border border-[#C8D8E8] text-slate-400 hover:text-[#334F70] font-bold text-sm transition"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-[#F3F3F4]/30">
              {userTerpilih.riwayat_argumen.length === 0 ? (
                <div className="text-center py-12 text-sm font-medium text-slate-400">
                  Mahasiswa ini belum pernah melakukan uji kerangka argumen di Laboratorium AI.
                </div>
              ) : (
                userTerpilih.riwayat_argumen.map((log: any, idx: number) => (
                  <div key={log.id_argumen} className="bg-white p-5 rounded-2xl border border-[#C8D8E8] shadow-xs space-y-4">
                    <div className="flex justify-between items-center border-b border-[#F3F3F4] pb-2">
                      <span className="text-xs font-bold text-slate-400">
                        Latihan #{userTerpilih.riwayat_argumen.length - idx} • {new Date(log.timestamp).toLocaleDateString('id-ID')}
                      </span>
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-black rounded-md border border-emerald-200">
                        Skor AREL: {log.skor_AREL} / 100
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Konstruksi Kasus Mahasiswa:</span>
                      <p className="text-sm font-medium text-[#334F70] bg-[#F3F3F4] p-3 rounded-xl border border-[#C8D8E8]/70 leading-relaxed italic">
                        {log.teks_argumen}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block">Ulasan Analisis Juri AI:</span>
                      <p className="text-xs font-mono font-medium text-slate-600 bg-amber-50/40 p-3 rounded-xl border border-amber-200/60 leading-relaxed whitespace-pre-line">
                        {log.feedback_ai}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-[#F3F3F4] bg-white flex justify-end">
              <button
                onClick={() => setModalOpen(false)}
                className="px-5 py-2 bg-[#334F70] text-white text-xs font-bold rounded-xl hover:opacity-90 transition shadow-xs"
              >
                Tutup Lembar Pemantauan
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}