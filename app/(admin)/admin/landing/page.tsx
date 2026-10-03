'use client';

import { useState, useEffect } from 'react';

interface BeritaAdminItem {
  id_berita: number;
  title: string;
  date: string;
  tag: string;
  desc?: string | null;
  img_url?: string | null;
}

interface AnggotaAdminItem {
  id_anggota: number;
  nama: string;
  posisi: string;
  inisial: string;
}

interface AboutContent {
  title: string;
  paragraph1: string;
  paragraph2: string;
  vision: string;
  mission: string;
  established: string;
}

const initialAboutContent: AboutContent = {
  title: 'Membangun Debater Berkarakter & Berprestasi',
  paragraph1: 'UKM Debat UNIDA Gontor adalah unit kegiatan mahasiswa yang berfokus pada pengembangan kemampuan debat parlementer, berpikir kritis, dan komunikasi publik. Berdiri sejak 2018, kami telah melahirkan puluhan debater berprestasi di tingkat regional dan nasional.',
  paragraph2: 'Dengan kurikulum berbasis format internasional — Asian Parliamentary, British Parliamentary, dan World Schools Debate — kami mempersiapkan anggota untuk bersaing di panggung debat tertinggi.',
  vision: 'Mencetak debater nasional yang berintegritas',
  mission: 'Latihan rutin, kompetisi aktif, pembinaan karakter',
  established: '2018',
};

function formatBeritaImageUrls(value: unknown) {
  if (typeof value !== 'string' || !value) return '';

  try {
    const parsed: unknown = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.filter((image): image is string => typeof image === 'string').join('\n');
    }
  } catch {
    // Existing records store a single URL as plain text.
  }

  return value;
}

export default function AdminLandingPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'stats' | 'about' | 'anggota' | 'berita' | 'prestasi' | 'lomba'>('stats');

  // --- STATE FORM STATISTIK ---
  const [totalAnggota, setTotalAnggota] = useState('-');
  const [totalPrestasi, setTotalPrestasi] = useState('-');
  const [totalLomba, setTotalLomba] = useState('-');
  const [heroImg, setHeroImg] = useState('');
  const [aboutImg, setAboutImg] = useState('');
  const [groupImg, setGroupImg] = useState('');
  const [ctaImg, setCtaImg] = useState('');
  const [aboutContent, setAboutContent] = useState<AboutContent>(initialAboutContent);
  const [anggotaNama, setAnggotaNama] = useState('');
  const [anggotaPosisi, setAnggotaPosisi] = useState('');
  const [anggotaInisial, setAnggotaInisial] = useState('');
  const [editingAnggotaId, setEditingAnggotaId] = useState<number | null>(null);

  // --- STATE FORM BERITA ---
  const [judulBerita, setJudulBerita] = useState('');
  const [tanggalBerita, setTanggalBerita] = useState('');
  const [tagBerita, setTagBerita] = useState('Seminar');
  const [descBerita, setDescBerita] = useState('');
  const [imgBerita, setImgBerita] = useState('');
  const [editingBeritaId, setEditingBeritaId] = useState<number | null>(null);

  // --- STATE FORM PRESTASI ---
  const [juaraPrestasi, setJuaraPrestasi] = useState('');
  const [lombaPrestasi, setLombaPrestasi] = useState('');
  const [tahunPrestasi, setTahunPrestasi] = useState('');
  const [penyelenggaraPrestasi, setPenyelenggaraPrestasi] = useState('');
  const [imgPrestasi, setImgPrestasi] = useState('');

  // --- STATE FORM LOMBA ---
  const [namaLomba, setNamaLomba] = useState('');
  const [kategoriLomba, setKategoriLomba] = useState('Nasional');
  const [lokasiLomba, setLokasiLomba] = useState('');
  const [imgLomba, setImgLomba] = useState('');

  // Data dari API
  const [beritaData, setBeritaData] = useState<BeritaAdminItem[]>([]);
  const [anggotaData, setAnggotaData] = useState<AnggotaAdminItem[]>([]);
  const [prestasiData, setPrestasiData] = useState<any[]>([]);
  const [lombaData, setLombaData] = useState<any[]>([]);

  // 1. Fetch Data Awal
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/landing', { cache: 'no-store' });
      const resData = await res.json();
      if (res.ok && resData.data) {
        if (resData.data.stats) {
          setTotalAnggota(resData.data.stats.total_anggota || '0');
          setTotalPrestasi(resData.data.stats.total_prestasi || '0');
          setTotalLomba(resData.data.stats.total_lomba || '0');
          setHeroImg(resData.data.stats.hero_img || '');
          setAboutImg(resData.data.stats.about_img || '');
          setGroupImg(resData.data.stats.group_img || '');
          setCtaImg(resData.data.stats.cta_img || '');
          if (resData.data.stats.about_content) {
            try {
              const savedContent: unknown = JSON.parse(resData.data.stats.about_content);
              if (savedContent && typeof savedContent === 'object') {
                setAboutContent({ ...initialAboutContent, ...savedContent });
              }
            } catch {
              setAboutContent(initialAboutContent);
            }
          }
        }
        setAnggotaData(resData.data.anggota || []);
        setBeritaData(resData.data.berita || []);
        setPrestasiData(resData.data.prestasi || []);
        setLombaData(resData.data.lomba || []);
      }
    } catch (err) {
      console.warn('Gagal memuat data landing:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await fetch('/api/admin/landing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'about', payload: { about_content: aboutContent } }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Gagal menyimpan Tentang Kami');
      alert('Konten Tentang Kami berhasil diperbarui!');
      fetchData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Gagal menyimpan Tentang Kami');
    } finally {
      setSubmitting(false);
    }
  };

  const resetAnggotaForm = () => {
    setEditingAnggotaId(null);
    setAnggotaNama('');
    setAnggotaPosisi('');
    setAnggotaInisial('');
  };

  const handleSaveAnggota = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await fetch('/api/admin/landing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'anggota',
          payload: {
            id_anggota: editingAnggotaId,
            nama: anggotaNama,
            posisi: anggotaPosisi,
            inisial: anggotaInisial,
          },
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Gagal menyimpan anggota');
      alert(editingAnggotaId ? 'Data anggota berhasil diperbarui!' : 'Anggota berhasil ditambahkan!');
      resetAnggotaForm();
      fetchData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Gagal menyimpan anggota');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 2. Simpan Statistik
  const handleSaveStats = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await fetch('/api/admin/landing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'stats',
          payload: {
            hero_img: heroImg,
            about_img: aboutImg,
            group_img: groupImg,
            cta_img: ctaImg,
          },
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Gagal menyimpan foto landing page');

      alert('Foto landing page berhasil diperbarui!');
      fetchData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // 3. Tambah Berita
  const handleTambahBerita = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!judulBerita.trim() || !tanggalBerita.trim()) {
      alert('Judul dan tanggal berita wajib diisi!');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/admin/landing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'berita',
          payload: {
            id_berita: editingBeritaId,
            title: judulBerita,
            date: tanggalBerita,
            tag: tagBerita,
            desc: descBerita,
            img_url: imgBerita,
          },
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Gagal menyimpan berita');

      alert(editingBeritaId ? 'Berita acara berhasil diperbarui!' : 'Berita acara berhasil ditambahkan!');
      setEditingBeritaId(null);
      setJudulBerita('');
      setTanggalBerita('');
      setDescBerita('');
      setImgBerita('');
      fetchData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditBerita = (item: BeritaAdminItem) => {
    setEditingBeritaId(item.id_berita);
    setJudulBerita(item.title || '');
    setTanggalBerita(item.date || '');
    setTagBerita(item.tag || 'Seminar');
    setDescBerita(item.desc || '');
    setImgBerita(formatBeritaImageUrls(item.img_url));
  };

  const handleCancelEditBerita = () => {
    setEditingBeritaId(null);
    setJudulBerita('');
    setTanggalBerita('');
    setTagBerita('Seminar');
    setDescBerita('');
    setImgBerita('');
  };

  // 4. Tambah Prestasi
  const handleTambahPrestasi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!juaraPrestasi.trim() || !lombaPrestasi.trim()) {
      alert('Peringkat dan Nama Lomba wajib diisi!');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/admin/landing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'prestasi',
          payload: {
            juara: juaraPrestasi,
            lomba: lombaPrestasi,
            tahun: tahunPrestasi,
            penyelenggara: penyelenggaraPrestasi,
            img_url: imgPrestasi,
          },
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Gagal menambah prestasi');

      alert('Capaian prestasi berhasil ditambahkan!');
      setJuaraPrestasi('');
      setLombaPrestasi('');
      setTahunPrestasi('');
      setPenyelenggaraPrestasi('');
      setImgPrestasi('');
      fetchData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // 5. Tambah Lomba
  const handleTambahLomba = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaLomba.trim() || !lokasiLomba.trim()) {
      alert('Nama Lomba dan Lokasi wajib diisi!');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/admin/landing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'lomba',
          payload: {
            nama_lomba: namaLomba,
            kategori: kategoriLomba,
            lokasi: lokasiLomba,
            image_url: imgLomba,
          },
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Gagal menambah data lomba');

      alert('Data lomba berhasil ditambahkan!');
      setNamaLomba('');
      setLokasiLomba('');
      setImgLomba('');
      fetchData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // 6. Hapus Item
  const handleHapusItem = async (type: 'anggota' | 'berita' | 'prestasi' | 'lomba', id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data ini dari landing page?')) return;

    try {
      const res = await fetch(`/api/admin/landing?type=${type}&id=${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Gagal menghapus data');

      alert('Data berhasil dihapus.');
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn text-[#334F70]">
      {/* Header Halaman */}
      <div>
        <h1 className="text-3xl font-black tracking-tight">🌐 Manajemen Konten Landing Page</h1>
        <p className="text-sm text-slate-400 mt-1 font-medium">
          Atur dan perbarui informasi publik UKM Debat Dewan Mahasiswa UNIDA Gontor secara real-time.
        </p>
      </div>

      {/* Navigasi Tab */}
      <div className="flex flex-wrap gap-2 bg-[#F3F3F4] p-1.5 rounded-2xl w-fit border border-[#C8D8E8]">
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-5 py-2.5 rounded-xl text-xs font-black transition cursor-pointer ${
            activeTab === 'stats'
              ? 'bg-[#334F70] text-white shadow-md'
              : 'text-slate-500 hover:text-[#334F70]'
          }`}
        >
          📊 Statistik & Hero
        </button>
        <button
          onClick={() => setActiveTab('about')}
          className={`px-5 py-2.5 rounded-xl text-xs font-black transition cursor-pointer ${activeTab === 'about' ? 'bg-[#334F70] text-white shadow-md' : 'text-slate-500 hover:text-[#334F70]'}`}
        >
          ℹ️ Tentang Kami
        </button>
        <button
          onClick={() => setActiveTab('anggota')}
          className={`px-5 py-2.5 rounded-xl text-xs font-black transition cursor-pointer ${activeTab === 'anggota' ? 'bg-[#334F70] text-white shadow-md' : 'text-slate-500 hover:text-[#334F70]'}`}
        >
          👥 Struktur UKM ({anggotaData.length})
        </button>
        <button
          onClick={() => setActiveTab('berita')}
          className={`px-5 py-2.5 rounded-xl text-xs font-black transition cursor-pointer ${
            activeTab === 'berita'
              ? 'bg-[#334F70] text-white shadow-md'
              : 'text-slate-500 hover:text-[#334F70]'
          }`}
        >
          📰 Berita Acara ({beritaData.length})
        </button>
        <button
          onClick={() => setActiveTab('prestasi')}
          className={`px-5 py-2.5 rounded-xl text-xs font-black transition cursor-pointer ${
            activeTab === 'prestasi'
              ? 'bg-[#334F70] text-white shadow-md'
              : 'text-slate-500 hover:text-[#334F70]'
          }`}
        >
          🏆 Capaian Prestasi ({prestasiData.length})
        </button>
        <button
          onClick={() => setActiveTab('lomba')}
          className={`px-5 py-2.5 rounded-xl text-xs font-black transition cursor-pointer ${
            activeTab === 'lomba'
              ? 'bg-[#334F70] text-white shadow-md'
              : 'text-slate-500 hover:text-[#334F70]'
          }`}
        >
          🎯 Lomba Diikuti ({lombaData.length})
        </button>
      </div>

      {/* TAB 1: STATISTIK HERO */}
      {activeTab === 'stats' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="bg-white p-6 rounded-2xl border border-[#C8D8E8] shadow-sm space-y-4">
            <h2 className="text-lg font-extrabold border-b border-[#F3F3F4] pb-2">📊 Statistik Otomatis & Foto Hero</h2>
            
            <form onSubmit={handleSaveStats} className="space-y-4">
              <p className="text-xs leading-relaxed text-slate-500">
                Total anggota, prestasi, dan lomba dihitung otomatis dari akun pengguna aktif, data capaian prestasi, dan data lomba yang tersimpan. Angka tersebut tidak perlu diubah manual.
              </p>
              <p className="text-xs leading-relaxed text-slate-500">
                Link Google Drive dikonversi otomatis. Untuk situs lain, gunakan URL langsung ke file gambar (HTTP/HTTPS), bukan link halaman album atau pratinjau.
              </p>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  URL Gambar Background Hero (Opsional)
                </label>
                <input
                  type="text"
                  value={heroImg}
                  onChange={(e) => setHeroImg(e.target.value)}
                  placeholder="https://drive.google.com/file/d/..."
                  className="w-full p-3 bg-[#F3F3F4] border border-[#C8D8E8] rounded-xl text-sm font-medium transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  URL Foto Tim UKM Debat (Opsional)
                </label>
                <input
                  type="text"
                  value={groupImg}
                  onChange={(e) => setGroupImg(e.target.value)}
                  placeholder="https://drive.google.com/file/d/..."
                  className="w-full p-3 bg-[#F3F3F4] border border-[#C8D8E8] rounded-xl text-sm font-medium transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  URL Foto Tentang Kami / Est. 2018 (Opsional)
                </label>
                <input
                  type="text"
                  value={aboutImg}
                  onChange={(e) => setAboutImg(e.target.value)}
                  placeholder="https://drive.google.com/file/d/..."
                  className="w-full p-3 bg-[#F3F3F4] border border-[#C8D8E8] rounded-xl text-sm font-medium transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  URL Foto Background CTA / Siap Menjadi Debater (Opsional)
                </label>
                <input
                  type="text"
                  value={ctaImg}
                  onChange={(e) => setCtaImg(e.target.value)}
                  placeholder="https://drive.google.com/file/d/..."
                  className="w-full p-3 bg-[#F3F3F4] border border-[#C8D8E8] rounded-xl text-sm font-medium transition"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-linear-to-r from-[#7EA0CF] to-[#334F70] hover:opacity-95 text-white font-black text-xs uppercase tracking-wider rounded-xl transition shadow-md"
              >
                {submitting ? 'Menyimpan...' : 'Simpan Perubahan Foto ✓'}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl border border-[#C8D8E8] shadow-sm overflow-hidden p-6 space-y-4">
            <h2 className="text-lg font-extrabold border-b border-[#F3F3F4] pb-2">📋 Pratinjau Tampilan Counter Hero</h2>
            <p className="text-xs text-slate-400 font-medium">
              Ini adalah gambaran angka statistik yang akan tampil pada banner utama halaman depan.
            </p>

            <div className="grid grid-cols-3 gap-4 pt-4 text-center">
              <div className="bg-[#F3F3F4] p-5 rounded-2xl border border-[#C8D8E8]">
                <p className="text-3xl font-black text-[#334F70]">{totalAnggota}</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Anggota Aktif</p>
              </div>
              <div className="bg-[#F3F3F4] p-5 rounded-2xl border border-[#C8D8E8]">
                <p className="text-3xl font-black text-[#334F70]">{totalPrestasi}</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Prestasi</p>
              </div>
              <div className="bg-[#F3F3F4] p-5 rounded-2xl border border-[#C8D8E8]">
                <p className="text-3xl font-black text-[#334F70]">{totalLomba}</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Lomba</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'about' && (
        <form onSubmit={handleSaveAbout} className="max-w-3xl space-y-5 rounded-2xl border border-[#C8D8E8] bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-lg font-extrabold">Konten Tentang Kami</h2>
            <p className="mt-1 text-xs text-slate-500">Perubahan akan tampil pada bagian Tentang Kami di landing page.</p>
          </div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
            Judul
            <input value={aboutContent.title} onChange={(e) => setAboutContent({ ...aboutContent, title: e.target.value })} className="mt-1 w-full rounded-xl border border-[#C8D8E8] bg-[#F3F3F4] p-3 text-sm font-semibold normal-case text-[#334F70]" required />
          </label>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
            Deskripsi
            <textarea value={aboutContent.paragraph1} onChange={(e) => setAboutContent({ ...aboutContent, paragraph1: e.target.value })} rows={4} className="mt-1 w-full rounded-xl border border-[#C8D8E8] bg-[#F3F3F4] p-3 text-sm font-medium normal-case text-[#334F70]" />
          </label>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
            Pendekatan / Kurikulum
            <textarea value={aboutContent.paragraph2} onChange={(e) => setAboutContent({ ...aboutContent, paragraph2: e.target.value })} rows={3} className="mt-1 w-full rounded-xl border border-[#C8D8E8] bg-[#F3F3F4] p-3 text-sm font-medium normal-case text-[#334F70]" />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
              Visi
              <textarea value={aboutContent.vision} onChange={(e) => setAboutContent({ ...aboutContent, vision: e.target.value })} rows={3} className="mt-1 w-full rounded-xl border border-[#C8D8E8] bg-[#F3F3F4] p-3 text-sm font-medium normal-case text-[#334F70]" />
            </label>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
              Misi
              <textarea value={aboutContent.mission} onChange={(e) => setAboutContent({ ...aboutContent, mission: e.target.value })} rows={3} className="mt-1 w-full rounded-xl border border-[#C8D8E8] bg-[#F3F3F4] p-3 text-sm font-medium normal-case text-[#334F70]" />
            </label>
          </div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
            Label tahun berdiri
            <input value={aboutContent.established} onChange={(e) => setAboutContent({ ...aboutContent, established: e.target.value })} className="mt-1 w-full rounded-xl border border-[#C8D8E8] bg-[#F3F3F4] p-3 text-sm font-semibold normal-case text-[#334F70]" />
          </label>
          <button type="submit" disabled={submitting} className="w-full rounded-xl bg-[#334F70] py-3 text-xs font-black uppercase tracking-wider text-white transition hover:opacity-90 disabled:opacity-60">
            {submitting ? 'Menyimpan...' : 'Simpan Tentang Kami'}
          </button>
        </form>
      )}

      {activeTab === 'anggota' && (
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
          <form onSubmit={handleSaveAnggota} className="space-y-4 rounded-2xl border border-[#C8D8E8] bg-white p-6 shadow-sm">
            <h2 className="border-b border-[#F3F3F4] pb-2 text-lg font-extrabold">{editingAnggotaId ? 'Edit Anggota' : 'Tambah Anggota'}</h2>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
              Nama
              <input value={anggotaNama} onChange={(e) => setAnggotaNama(e.target.value)} className="mt-1 w-full rounded-xl border border-[#C8D8E8] bg-[#F3F3F4] p-3 text-sm font-semibold normal-case text-[#334F70]" required />
            </label>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
              Jabatan / Posisi
              <input value={anggotaPosisi} onChange={(e) => setAnggotaPosisi(e.target.value)} placeholder="Contoh: Ketua UKM" className="mt-1 w-full rounded-xl border border-[#C8D8E8] bg-[#F3F3F4] p-3 text-sm font-semibold normal-case text-[#334F70]" required />
            </label>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
              Inisial (opsional)
              <input value={anggotaInisial} onChange={(e) => setAnggotaInisial(e.target.value)} maxLength={10} placeholder="Otomatis dari nama" className="mt-1 w-full rounded-xl border border-[#C8D8E8] bg-[#F3F3F4] p-3 text-sm font-semibold normal-case text-[#334F70]" />
            </label>
            <button type="submit" disabled={submitting} className="w-full rounded-xl bg-[#334F70] py-3 text-xs font-black uppercase tracking-wider text-white transition hover:opacity-90 disabled:opacity-60">
              {submitting ? 'Menyimpan...' : editingAnggotaId ? 'Perbarui Anggota' : 'Tambah Anggota'}
            </button>
            {editingAnggotaId && <button type="button" onClick={resetAnggotaForm} className="w-full rounded-xl border border-[#C8D8E8] py-3 text-xs font-bold">Batal Edit</button>}
          </form>

          <div className="overflow-hidden rounded-2xl border border-[#C8D8E8] bg-white shadow-sm lg:col-span-2">
            <div className="border-b border-[#F3F3F4] p-6">
              <h2 className="text-lg font-extrabold">Struktur UKM ({anggotaData.length})</h2>
            </div>
            {loading ? <p className="p-8 text-center text-sm text-slate-400">Memuat anggota...</p> : anggotaData.length === 0 ? (
              <p className="p-8 text-center text-sm text-slate-400">Belum ada anggota dalam struktur UKM.</p>
            ) : (
              <div className="divide-y divide-[#F3F3F4]">
                {anggotaData.map((item) => (
                  <div key={item.id_anggota} className="flex flex-wrap items-center justify-between gap-3 p-4 sm:px-6">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#C8D8E8] text-xs font-black text-[#334F70]">{item.inisial}</span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-[#334F70]">{item.nama}</p>
                        <p className="text-xs text-slate-500">{item.posisi}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => { setEditingAnggotaId(item.id_anggota); setAnggotaNama(item.nama); setAnggotaPosisi(item.posisi); setAnggotaInisial(item.inisial); }} className="rounded-lg border border-[#C8D8E8] px-3 py-1.5 text-xs font-bold text-[#334F70] hover:bg-[#F3F3F4]">Edit</button>
                      <button type="button" onClick={() => handleHapusItem('anggota', item.id_anggota)} className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100">Hapus</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: MANAJEMEN BERITA ACARA */}
      {activeTab === 'berita' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="bg-white p-6 rounded-2xl border border-[#C8D8E8] shadow-sm space-y-4">
            <h2 className="text-lg font-extrabold border-b border-[#F3F3F4] pb-2">
              {editingBeritaId ? '✏️ Edit Berita Acara' : '➕ Tambah Berita Acara'}
            </h2>
            
            <form onSubmit={handleTambahBerita} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Judul Berita / Kegiatan
                </label>
                <input
                  type="text"
                  value={judulBerita}
                  onChange={(e) => setJudulBerita(e.target.value)}
                  placeholder="Contoh: Seminar Nasional Debat 2025"
                  className="w-full p-3 bg-[#F3F3F4] border border-[#C8D8E8] rounded-xl text-sm font-semibold transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Tanggal Kegiatan
                </label>
                <input
                  type="text"
                  value={tanggalBerita}
                  onChange={(e) => setTanggalBerita(e.target.value)}
                  placeholder="Contoh: 12 Maret 2025"
                  className="w-full p-3 bg-[#F3F3F4] border border-[#C8D8E8] rounded-xl text-sm font-semibold transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Kategori / Tag
                </label>
                <select
                  value={tagBerita}
                  onChange={(e) => setTagBerita(e.target.value)}
                  className="w-full p-3 bg-[#F3F3F4] border border-[#C8D8E8] rounded-xl text-sm font-semibold transition"
                >
                  <option value="Seminar">Seminar</option>
                  <option value="Latihan">Latihan</option>
                  <option value="Rapat">Rapat</option>
                  <option value="Workshop">Workshop</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Ringkasan Deskripsi
                </label>
                <textarea
                  value={descBerita}
                  onChange={(e) => setDescBerita(e.target.value)}
                  placeholder="Tuliskan ringkasan kegiatan..."
                  className="w-full h-24 p-3 bg-[#F3F3F4] border border-[#C8D8E8] rounded-xl text-sm font-medium transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  URL Foto Kegiatan (Opsional, satu URL per baris)
                </label>
                <textarea
                  value={imgBerita}
                  onChange={(e) => setImgBerita(e.target.value)}
                  placeholder={'https://drive.google.com/file/d/...\nhttps://contoh.com/foto-kedua.jpg'}
                  rows={3}
                  className="w-full p-3 bg-[#F3F3F4] border border-[#C8D8E8] rounded-xl text-sm font-medium transition"
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  Masukkan satu URL gambar per baris. Link Google Drive dikonversi otomatis; situs lain perlu URL langsung ke file gambar (HTTP/HTTPS).
                </p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-linear-to-r from-[#7EA0CF] to-[#334F70] hover:opacity-95 text-white font-black text-xs uppercase tracking-wider rounded-xl transition shadow-md"
              >
                {submitting ? 'Menyimpan...' : editingBeritaId ? 'Perbarui Berita ✓' : 'Simpan Berita Baru ✓'}
              </button>
              {editingBeritaId && (
                <button
                  type="button"
                  onClick={handleCancelEditBerita}
                  disabled={submitting}
                  className="w-full rounded-xl border border-[#C8D8E8] py-3 text-xs font-bold text-[#334F70] transition hover:bg-[#F3F3F4]"
                >
                  Batal Edit
                </button>
              )}
            </form>
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl border border-[#C8D8E8] shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[#F3F3F4]">
              <h2 className="text-lg font-extrabold">📋 Daftar Berita Acara di Database</h2>
            </div>

            {loading ? (
              <div className="p-12 text-center text-sm font-bold text-slate-400 animate-pulse">
                Sinkronisasi data berita...
              </div>
            ) : beritaData.length === 0 ? (
              <div className="p-12 text-center text-sm font-medium text-slate-400">
                Belum ada berita acara yang ditambahkan.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F3F3F4] border-b border-[#C8D8E8] text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <th className="p-4 pl-6 w-16 text-center">No</th>
                      <th className="p-4">Judul Berita</th>
                      <th className="p-4 w-36">Tanggal</th>
                      <th className="p-4 w-28 text-center">Tag</th>
                      <th className="p-4 w-36 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F3F3F4] text-sm font-medium">
                    {beritaData.map((item, index) => (
                      <tr key={item.id_berita} className="hover:bg-slate-50/80 transition">
                        <td className="p-4 pl-6 text-center text-slate-400 font-bold">{index + 1}</td>
                        <td className="p-4 font-bold text-[#334F70]">{item.title}</td>
                        <td className="p-4 text-slate-500 text-xs font-semibold">{item.date}</td>
                        <td className="p-4 text-center">
                          <span className="px-2.5 py-1 bg-[#C8D8E8]/50 text-[#334F70] text-xs font-bold rounded-md border border-[#7EA0CF]/20">
                            {item.tag}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleEditBerita(item)}
                            className="mr-2 rounded-lg border border-[#C8D8E8] bg-white px-3 py-1.5 text-xs font-bold text-[#334F70] transition hover:bg-[#F3F3F4]"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleHapusItem('berita', item.id_berita)}
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
      )}

      {/* TAB 3: MANAJEMEN PRESTASI */}
      {activeTab === 'prestasi' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="bg-white p-6 rounded-2xl border border-[#C8D8E8] shadow-sm space-y-4">
            <h2 className="text-lg font-extrabold border-b border-[#F3F3F4] pb-2">🏆 Tambah Capaian Prestasi</h2>
            
            <form onSubmit={handleTambahPrestasi} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Peringkat / Juara
                </label>
                <input
                  type="text"
                  value={juaraPrestasi}
                  onChange={(e) => setJuaraPrestasi(e.target.value)}
                  placeholder="Contoh: Juara 1 / Best Speaker"
                  className="w-full p-3 bg-[#F3F3F4] border border-[#C8D8E8] rounded-xl text-sm font-semibold transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Nama Perlombaan
                </label>
                <input
                  type="text"
                  value={lombaPrestasi}
                  onChange={(e) => setLombaPrestasi(e.target.value)}
                  placeholder="Contoh: ODBI Nasional Kemendikbud"
                  className="w-full p-3 bg-[#F3F3F4] border border-[#C8D8E8] rounded-xl text-sm font-semibold transition"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Tahun
                  </label>
                  <input
                    type="text"
                    value={tahunPrestasi}
                    onChange={(e) => setTahunPrestasi(e.target.value)}
                    placeholder="2024"
                    className="w-full p-3 bg-[#F3F3F4] border border-[#C8D8E8] rounded-xl text-sm font-semibold transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Penyelenggara
                  </label>
                  <input
                    type="text"
                    value={penyelenggaraPrestasi}
                    onChange={(e) => setPenyelenggaraPrestasi(e.target.value)}
                    placeholder="Kemendikbud RI"
                    className="w-full p-3 bg-[#F3F3F4] border border-[#C8D8E8] rounded-xl text-sm font-semibold transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  URL Foto Piala / Dokumentasi (Opsional)
                </label>
                <input
                  type="text"
                  value={imgPrestasi}
                  onChange={(e) => setImgPrestasi(e.target.value)}
                  placeholder="https://drive.google.com/file/d/..."
                  className="w-full p-3 bg-[#F3F3F4] border border-[#C8D8E8] rounded-xl text-sm font-medium transition"
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  Link Google Drive dikonversi otomatis. Untuk situs lain, gunakan URL langsung ke file gambar (HTTP/HTTPS), bukan link album atau halaman pratinjau.
                </p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-linear-to-r from-[#7EA0CF] to-[#334F70] hover:opacity-95 text-white font-black text-xs uppercase tracking-wider rounded-xl transition shadow-md"
              >
                {submitting ? 'Menyimpan...' : 'Simpan Prestasi Baru ✓'}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl border border-[#C8D8E8] shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[#F3F3F4]">
              <h2 className="text-lg font-extrabold">📋 Daftar Capaian Prestasi di Database</h2>
            </div>

            {loading ? (
              <div className="p-12 text-center text-sm font-bold text-slate-400 animate-pulse">
                Sinkronisasi data prestasi...
              </div>
            ) : prestasiData.length === 0 ? (
              <div className="p-12 text-center text-sm font-medium text-slate-400">
                Belum ada data prestasi yang ditambahkan.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F3F3F4] border-b border-[#C8D8E8] text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <th className="p-4 pl-6 w-16 text-center">No</th>
                      <th className="p-4 w-28">Peringkat</th>
                      <th className="p-4">Nama Lomba</th>
                      <th className="p-4 w-24">Tahun</th>
                      <th className="p-4 w-24 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F3F3F4] text-sm font-medium">
                    {prestasiData.map((item, index) => (
                      <tr key={item.id_prestasi} className="hover:bg-slate-50/80 transition">
                        <td className="p-4 pl-6 text-center text-slate-400 font-bold">{index + 1}</td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 bg-amber-50 text-amber-600 text-xs font-bold rounded-md border border-amber-200">
                            {item.juara}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-[#334F70]">{item.lomba}</td>
                        <td className="p-4 text-slate-500 text-xs font-semibold">{item.tahun}</td>
                        <td className="p-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleHapusItem('prestasi', item.id_prestasi)}
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
      )}

      {/* TAB 4: MANAJEMEN LOMBA YANG PERNAH DIIKUTI */}
      {activeTab === 'lomba' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="bg-white p-6 rounded-2xl border border-[#C8D8E8] shadow-sm space-y-4">
            <h2 className="text-lg font-extrabold border-b border-[#F3F3F4] pb-2">🎯 Tambah Lomba yang Diikuti</h2>
            
            <form onSubmit={handleTambahLomba} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Nama Kompetisi / Lomba
                </label>
                <input
                  type="text"
                  value={namaLomba}
                  onChange={(e) => setNamaLomba(e.target.value)}
                  placeholder="Contoh: NUDC 2024 / Piala Rektor"
                  className="w-full p-3 bg-[#F3F3F4] border border-[#C8D8E8] rounded-xl text-sm font-semibold transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Tingkat / Kategori
                </label>
                <select
                  value={kategoriLomba}
                  onChange={(e) => setKategoriLomba(e.target.value)}
                  className="w-full p-3 bg-[#F3F3F4] border border-[#C8D8E8] rounded-xl text-sm font-semibold transition"
                >
                  <option value="Internal">Internal</option>
                  <option value="Regional">Regional</option>
                  <option value="Nasional">Nasional</option>
                  <option value="Internasional">Internasional</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Lokasi Pelaksanaan
                </label>
                <input
                  type="text"
                  value={lokasiLomba}
                  onChange={(e) => setLokasiLomba(e.target.value)}
                  placeholder="Contoh: Jakarta / Surabaya / Ponorogo"
                  className="w-full p-3 bg-[#F3F3F4] border border-[#C8D8E8] rounded-xl text-sm font-semibold transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  URL Foto Kartu/Poster Lomba (Opsional)
                </label>
                <input
                  type="text"
                  value={imgLomba}
                  onChange={(e) => setImgLomba(e.target.value)}
                  placeholder="https://drive.google.com/file/d/..."
                  className="w-full p-3 bg-[#F3F3F4] border border-[#C8D8E8] rounded-xl text-sm font-medium transition"
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  Link Google Drive dikonversi otomatis. Untuk situs lain, gunakan URL langsung ke file gambar (HTTP/HTTPS), bukan link album atau halaman pratinjau.
                </p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-linear-to-r from-[#7EA0CF] to-[#334F70] hover:opacity-95 text-white font-black text-xs uppercase tracking-wider rounded-xl transition shadow-md"
              >
                {submitting ? 'Menyimpan...' : 'Simpan Lomba Baru ✓'}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl border border-[#C8D8E8] shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[#F3F3F4]">
              <h2 className="text-lg font-extrabold">📋 Daftar Lomba yang Pernah Diikuti</h2>
            </div>

            {loading ? (
              <div className="p-12 text-center text-sm font-bold text-slate-400 animate-pulse">
                Sinkronisasi data lomba...
              </div>
            ) : lombaData.length === 0 ? (
              <div className="p-12 text-center text-sm font-medium text-slate-400">
                Belum ada data lomba yang ditambahkan.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F3F3F4] border-b border-[#C8D8E8] text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <th className="p-4 pl-6 w-16 text-center">No</th>
                      <th className="p-4">Nama Lomba</th>
                      <th className="p-4 w-32 text-center">Kategori</th>
                      <th className="p-4 w-36">Lokasi</th>
                      <th className="p-4 w-24 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F3F3F4] text-sm font-medium">
                    {lombaData.map((item, index) => (
                      <tr key={item.id_lomba} className="hover:bg-slate-50/80 transition">
                        <td className="p-4 pl-6 text-center text-slate-400 font-bold">{index + 1}</td>
                        <td className="p-4 font-bold text-[#334F70]">{item.nama_lomba}</td>
                        <td className="p-4 text-center">
                          <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-md border border-blue-200">
                            {item.kategori || 'Nasional'}
                          </span>
                        </td>
                        <td className="p-4 text-slate-500 text-xs font-semibold">📍 {item.lokasi}</td>
                        <td className="p-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleHapusItem('lomba', item.id_lomba)}
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
      )}
    </div>
  );
}