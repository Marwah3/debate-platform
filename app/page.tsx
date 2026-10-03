'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, X } from 'lucide-react';

const C = {
  navy:   "#35506F",
  white:  "#F5F5F5",
  cobalt: "#7DA7D9",
  butter: "#F6EFCC",
  ice:    "#C7D9EA",
};

// Interface Data
interface StatData {
  total_anggota: string;
  total_prestasi: string;
  total_lomba: string;
  hero_img?: string;
  about_img?: string;
  group_img?: string;
  cta_img?: string;
  about_content?: string | null;
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

function parseAboutContent(value: unknown): AboutContent {
  if (typeof value !== 'string') return initialAboutContent;

  try {
    const parsed: unknown = JSON.parse(value);
    if (parsed && typeof parsed === 'object') {
      return { ...initialAboutContent, ...(parsed as Partial<AboutContent>) };
    }
  } catch {
    return initialAboutContent;
  }

  return initialAboutContent;
}

interface AnggotaItem {
  id_anggota: number;
  nama: string;
  posisi: string;
  inisial: string;
}

interface PrestasiItem {
  id_prestasi: number;
  juara: string;
  lomba: string;
  tahun: string;
  penyelenggara: string;
  img_url?: string;
}

interface BeritaItem {
  id_berita: number;
  title: string;
  date: string;
  tag: string;
  desc?: string;
  img_url?: string;
}

interface LombaItem {
  id_lomba: number;
  nama: string;
  level: string;
  kota: string;
  img_url?: string;
}

export default function LandingPage() {
  // Data Gambar Default (Fallback)
  const IMG = {
    hero:     "https://images.unsplash.com/photo-1660795308754-4c6422baf2f6?fit=max&fm=jpg&q=80&w=1600",
    about:    "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?fit=max&fm=jpg&q=80&w=1080",
    speaking: "https://images.unsplash.com/photo-1660796046943-ae52067e019f?fit=max&fm=jpg&q=80&w=1080",
    mic:      "https://images.unsplash.com/photo-1660795939433-c1964528c485?fit=max&fm=jpg&q=80&w=1080",
    trophy:   "https://images.unsplash.com/photo-1578269174936-2709b6aeb913?fit=max&fm=jpg&q=80&w=1080",
    audience: "https://images.unsplash.com/photo-1778876091184-8839210e1917?fit=max&fm=jpg&q=80&w=1080",
    lecture:  "https://images.unsplash.com/photo-1778876088510-84d7d8defaaa?fit=max&fm=jpg&q=80&w=1080",
    group:    "https://images.unsplash.com/photo-1569617084133-26942bb441f2?fit=max&fm=jpg&q=80&w=1080",
  };

  // State Dinamis
  const [stats, setStats] = useState<StatData>({ total_anggota: "-", total_prestasi: "-", total_lomba: "-" });
  const [aboutContent, setAboutContent] = useState<AboutContent>(initialAboutContent);
  const [anggota, setAnggota] = useState<AnggotaItem[]>([
    { id_anggota: 1, nama: "Ahmad Fauzan", posisi: "Ketua UKM", inisial: "AF" },
    { id_anggota: 2, nama: "Rizky Amalia", posisi: "Wakil Ketua", inisial: "RA" },
    { id_anggota: 3, nama: "Iuin Maulana", posisi: "Sekretaris", inisial: "IM" },
    { id_anggota: 4, nama: "Siti Nurhaliza", posisi: "Bendahara", inisial: "SN" },
    { id_anggota: 5, nama: "Bagas Prasetyo", posisi: "Debater Utama", inisial: "BP" },
    { id_anggota: 6, nama: "Dewi Kartika", posisi: "Debater Utama", inisial: "DK" },
    { id_anggota: 7, nama: "Fajar Hidayat", posisi: "Debater Junior", inisial: "FH" },
    { id_anggota: 8, nama: "Nadia Putri", posisi: "Debater Junior", inisial: "NP" },
  ]);
  const [prestasi, setPrestasi] = useState<PrestasiItem[]>([
    { id_prestasi: 1, juara: "Juara 1", lomba: "Olimpiade Debat Bahasa Indonesia Nasional", tahun: "2024", penyelenggara: "Kemendikbud RI", img_url: IMG.trophy },
    { id_prestasi: 2, juara: "Juara 2", lomba: "Kompetisi Debat Antar Perguruan Tinggi Jawa Timur", tahun: "2024", penyelenggara: "Universitas Airlangga", img_url: IMG.trophy },
    { id_prestasi: 3, juara: "Juara 3", lomba: "National University Debate Championship (NUDC)", tahun: "2023", penyelenggara: "Dikti", img_url: IMG.trophy },
    { id_prestasi: 4, juara: "Best Speaker", lomba: "World Schools Debate Exhibition UNIDA", tahun: "2023", penyelenggara: "UNIDA Gontor", img_url: IMG.trophy },
  ]);
  const [beritaAcara, setBeritaAcara] = useState<BeritaItem[]>([]);
  const [selectedBerita, setSelectedBerita] = useState<BeritaItem | null>(null);
  const [lomba, setLomba] = useState<LombaItem[]>([
    { id_lomba: 1, nama: "NUDC 2024", level: "Nasional", kota: "Jakarta", img_url: IMG.mic },
    { id_lomba: 2, nama: "Olimpiade Debat Kemendikbud", level: "Nasional", kota: "Surabaya", img_url: IMG.speaking },
    { id_lomba: 3, nama: "Piala Rektor UNIDA 2024", level: "Internal", kota: "Ponorogo", img_url: IMG.audience },
    { id_lomba: 4, nama: "Debat Antar-PTKIN Se-Jatim", level: "Regional", kota: "Malang", img_url: IMG.lecture },
    { id_lomba: 5, nama: "Asian Parliamentary Invitational", level: "Nasional", kota: "Bandung", img_url: IMG.mic },
    { id_lomba: 6, nama: "WSD Exhibition UNIDA 2023", level: "Internal", kota: "Ponorogo", img_url: IMG.speaking },
  ]);

  // Load Data dari Database secara Aman
  useEffect(() => {
    async function loadLandingData() {
      try {
        const res = await fetch('/api/landing');
        if (!res.ok) throw new Error("Gagal load API landing");
        const result = await res.json();
        
        if (result?.success && result?.data) {
          if (result.data.stats) {
            setStats(result.data.stats);
            setAboutContent(parseAboutContent(result.data.stats.about_content));
          }
          if (Array.isArray(result.data.anggota)) setAnggota(result.data.anggota);
          if (Array.isArray(result.data.prestasi)) setPrestasi(result.data.prestasi);
          if (Array.isArray(result.data.berita)) setBeritaAcara(result.data.berita);
          if (Array.isArray(result.data.lomba)) setLomba(result.data.lomba);
        }
      } catch (err) {
        console.error("Gagal memuat data landing page:", err);
      }
    }
    loadLandingData();
  }, []);

  useEffect(() => {
    if (!selectedBerita) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedBerita(null);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedBerita]);

  function getBeritaImages(value?: string) {
    if (!value) return [];

    try {
      const parsed: unknown = JSON.parse(value);
      if (Array.isArray(parsed) && parsed.every((image) => typeof image === 'string')) {
        return parsed;
      }
    } catch {
      // Existing records store a single URL as plain text.
    }

    return [value];
  }

  return (
    <div style={{ background: C.white }} className="select-none min-h-screen font-sans">

      {/* ── 1. HERO SECTION ── */}
      <section className="relative min-h-160 flex items-end overflow-hidden">
        <img src={stats.hero_img || IMG.hero} alt="UKM Debat UNIDA Gontor" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(53,80,111,0.96) 42%, rgba(53,80,111,0.38) 100%)" }} />
        
        <div className="relative z-10 w-full px-6 md:px-16 pt-32 pb-12">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            
            <div className="max-w-2xl space-y-4">
              <span className="inline-block px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs" style={{ background: C.cobalt, color: "#fff" }}>
                🎙️ Unit Kegiatan Mahasiswa · Universitas Darussalam Gontor
              </span>
              
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white leading-tight">
                UKM Debat<br />
                <span style={{ color: C.ice }}>UNIDA Gontor</span>
              </h1>
              
              <p className="text-sm md:text-base leading-relaxed max-w-xl font-medium" style={{ color: C.ice }}>
                Mengasah kemampuan berpikir kritis, membangun karakter pemimpin, dan mencetak debater berprestasi tingkat nasional.
              </p>
              
              <div className="pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-sm transition-all hover:scale-105 cursor-pointer shadow-xl"
                  style={{ background: C.cobalt, color: "#fff" }}
                >
                  Masuk Platform Latihan <ArrowRight size={18} />
                </Link>
              </div>
            </div>

            {/* Stat Bar Hero (Dinamis dari Database) */}
            <div className="flex rounded-2xl overflow-hidden shadow-2xl border border-white/20">
              {[
                [stats.total_anggota, "Anggota Aktif"],
                [stats.total_prestasi, "Prestasi"],
                [stats.total_lomba, "Lomba"]
              ].map(([n, l], idx) => (
                <div 
                  key={l} 
                  className="px-6 sm:px-8 py-5 text-center" 
                  style={{ 
                    background: "rgba(199,217,234,0.18)", 
                    backdropFilter: "blur(12px)", 
                    borderInlineStart: idx > 0 ? "1px solid rgba(199,217,234,0.25)" : "none" 
                  }}
                >
                  <p className="text-2xl sm:text-3xl font-extrabold text-white">{n}</p>
                  <p className="text-[11px] font-semibold mt-1" style={{ color: C.ice }}>{l}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── 2. REKAP ANGGOTA ── */}
      <section id="anggota" className="py-16 md:py-20 px-6 md:px-16" style={{ background: C.navy }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-3" style={{ background: C.cobalt, color: "#fff" }}>
                Rekap Anggota
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">
                Tim UKM Debat <span style={{ color: C.ice }}>2025/2026</span>
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-semibold hidden md:block" style={{ color: C.ice }}>
              {stats.total_anggota} anggota aktif terdaftar
            </p>
          </div>

          <div className="relative rounded-3xl overflow-hidden mb-8 h-64 md:h-80 shadow-lg">
            <img src={stats.group_img || IMG.group} alt="Foto tim UKM Debat" className="w-full h-full object-cover object-top" />
            <div className="absolute inset-0 flex items-end p-6" style={{ background: "linear-gradient(to top, rgba(53,80,111,0.92) 30%, transparent)" }}>
              <p className="font-bold text-white text-base sm:text-lg">Foto Bersama Anggota UKM Debat UNIDA Gontor 2025</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {anggota.map((m) => (
              <div key={m.id_anggota} className="rounded-2xl p-5 flex flex-col items-center text-center transition hover:bg-white/10" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(199,217,234,0.2)" }}>
                <div className="w-14 h-14 rounded-full flex items-center justify-center font-extrabold text-lg mb-3 shadow-md" style={{ background: C.cobalt, color: "#fff" }}>
                  {m.inisial}
                </div>
                <p className="font-bold text-sm text-white">{m.nama}</p>
                <p className="text-xs mt-1" style={{ color: C.ice }}>{m.posisi}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. PRESTASI ── */}
      <section id="prestasi" className="py-16 md:py-20 px-6 md:px-16" style={{ background: C.ice }}>
        <div className="max-w-6xl mx-auto">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-3" style={{ background: C.navy, color: "#fff" }}>
            Prestasi
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-8" style={{ color: C.navy }}>
            Capaian Membanggakan
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {prestasi.map((p) => (
              <div key={p.id_prestasi} className="rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                <div className="h-44 relative overflow-hidden">
                  <img src={p.img_url || IMG.trophy} alt={p.lomba} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(53,80,111,0.65)" }}>
                    <span className="text-4xl drop-shadow-lg">🏆</span>
                  </div>
                  <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-[11px] font-extrabold shadow-sm" style={{ background: C.cobalt, color: "#fff" }}>
                    {p.juara}
                  </span>
                </div>
                <div className="p-5">
                  <p className="font-bold text-xs leading-snug mb-1" style={{ color: C.navy }}>{p.lomba}</p>
                  <p className="text-[11px] font-medium" style={{ color: "#6b8aaa" }}>{p.penyelenggara} · {p.tahun}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. TENTANG KAMI ── */}
      <section id="tentang" className="py-16 md:py-20 px-6 md:px-16" style={{ background: C.white }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <img src={stats.about_img || IMG.about} alt="Tentang UKM Debat" className="rounded-3xl w-full h-80 md:h-115 object-cover shadow-md" />
            <div className="absolute -bottom-4 -right-4 px-6 py-4 rounded-2xl shadow-xl" style={{ background: C.navy }}>
                <p className="text-2xl font-extrabold text-white">Est. {aboutContent.established}</p>
                <p className="text-xs font-semibold" style={{ color: C.ice }}>Berdiri sejak {aboutContent.established}</p>
            </div>
          </div>

          <div className="space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: C.ice, color: C.navy }}>
              Tentang Kami
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold leading-snug" style={{ color: C.navy }}>
                {aboutContent.title}
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed" style={{ color: "#6b8aaa" }}>
                {aboutContent.paragraph1}
            </p>
            <p className="text-xs sm:text-sm leading-relaxed" style={{ color: "#6b8aaa" }}>
                {aboutContent.paragraph2}
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
                {[ ["🎯", "Visi", aboutContent.vision], ["📘", "Misi", aboutContent.mission]].map(([icon, judul, isi]) => (
                <div key={judul} className="p-4 rounded-2xl border border-[#C7D9EA]" style={{ background: C.ice }}>
                  <p className="text-xl mb-1">{icon}</p>
                  <p className="font-bold text-xs sm:text-sm mb-1" style={{ color: C.navy }}>{judul}</p>
                  <p className="text-[11px] leading-relaxed" style={{ color: "#547191" }}>{isi}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. BERITA ACARA ── */}
      <section id="berita" className="py-16 md:py-20 px-6 md:px-16" style={{ background: C.white }}>
        <div className="max-w-6xl mx-auto">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-3" style={{ background: C.ice, color: C.navy }}>
            Berita Acara
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-8" style={{ color: C.navy }}>
            Kegiatan Terkini
          </h2>

          {beritaAcara.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {beritaAcara.map((b) => {
                const images = getBeritaImages(b.img_url);

                return (
                  <button
                    key={b.id_berita}
                    type="button"
                    onClick={() => setSelectedBerita(b)}
                    aria-haspopup="dialog"
                    aria-expanded={selectedBerita?.id_berita === b.id_berita}
                    aria-label={`Buka berita ${b.title}`}
                    className="group block w-full cursor-pointer overflow-hidden rounded-3xl bg-white text-left transition-all duration-300 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4"
                    style={{ border: `1.5px solid ${C.ice}` }}
                  >
                    <div className="h-52 overflow-hidden relative bg-[#C7D9EA]">
                      {images[0] ? (
                        <img src={images[0]} alt={b.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-sm font-semibold text-[#35506F]">
                          Foto kegiatan belum ditambahkan
                        </div>
                      )}
                      <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold shadow-md" style={{ background: C.cobalt, color: "#fff" }}>
                        {b.tag}
                      </span>
                    </div>
                    <div className="p-5">
                      <p className="text-xs mb-1.5 font-bold" style={{ color: C.cobalt }}>{b.date}</p>
                      <h3 className="font-bold text-sm mb-2 leading-snug" style={{ color: C.navy }}>{b.title}</h3>
                      <p className="line-clamp-3 text-xs leading-relaxed" style={{ color: "#6b8aaa" }}>{b.desc || 'Belum ada deskripsi kegiatan.'}</p>
                      <span className="mt-3 inline-block text-xs font-bold" style={{ color: C.navy }}>Baca selengkapnya</span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="rounded-2xl border border-[#C7D9EA] bg-white p-8 text-center text-sm font-medium text-[#6b8aaa]">
              Belum ada kegiatan terbaru. Informasi kegiatan dapat ditambahkan melalui Kelola Landing Page.
            </p>
          )}

          {selectedBerita && (
            <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
              <button
                type="button"
                aria-label="Tutup detail berita"
                className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-sm"
                onClick={() => setSelectedBerita(null)}
              />
              <article
                role="dialog"
                aria-modal="true"
                aria-labelledby="berita-detail-title"
                className="relative z-10 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
              >
                <div className="sticky top-0 z-10 flex justify-end border-b border-[#C7D9EA] bg-white/95 p-3 backdrop-blur-sm">
                  <button
                    type="button"
                    onClick={() => setSelectedBerita(null)}
                    aria-label="Tutup detail berita"
                    title="Tutup"
                    className="inline-flex size-10 items-center justify-center rounded-full text-[#35506F] transition hover:bg-[#C7D9EA]/50 focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    <X size={20} aria-hidden="true" />
                  </button>
                </div>
                <div className="space-y-5 p-5 sm:p-8">
                  <div>
                    <span className="inline-block rounded-full px-3 py-1 text-xs font-bold text-white" style={{ background: C.cobalt }}>
                      {selectedBerita.tag}
                    </span>
                    <p className="mt-4 text-sm font-bold" style={{ color: C.cobalt }}>{selectedBerita.date}</p>
                    <h3 id="berita-detail-title" className="mt-1 text-2xl font-extrabold" style={{ color: C.navy }}>
                      {selectedBerita.title}
                    </h3>
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed" style={{ color: "#547191" }}>
                    {selectedBerita.desc || 'Belum ada deskripsi kegiatan.'}
                  </p>
                  {getBeritaImages(selectedBerita.img_url).length > 0 && (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {getBeritaImages(selectedBerita.img_url).map((image, index) => (
                        <img
                          key={`${selectedBerita.id_berita}-${image}`}
                          src={image}
                          alt={`${selectedBerita.title} - foto ${index + 1}`}
                          className="aspect-square w-full rounded-xl object-cover"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </article>
            </div>
          )}
        </div>
      </section>

      {/* ── 6. LOMBA YANG PERNAH DIIKUTI ── */}
      <section id="lomba" className="py-16 md:py-20 px-6 md:px-16" style={{ background: C.white }}>
        <div className="max-w-6xl mx-auto">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-3" style={{ background: C.ice, color: C.navy }}>
            Kompetisi
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-8" style={{ color: C.navy }}>
            Lomba yang Pernah Diikuti
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {lomba.map((l) => (
              <div key={l.id_lomba} className="group relative rounded-3xl overflow-hidden h-56 cursor-pointer shadow-xs hover:shadow-xl transition-all">
                <img src={l.img_url || IMG.mic} alt={l.nama} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(53,80,111,0.92) 55%, rgba(53,80,111,0.2))" }} />
                <div className="absolute inset-0 flex flex-col justify-end p-5">
                  <span className="inline-block self-start px-2.5 py-0.5 rounded-full text-[10px] font-bold mb-2 shadow-xs" style={{ background: C.cobalt, color: "#fff" }}>
                    {l.level}
                  </span>
                  <p className="font-extrabold text-white text-base leading-tight">{l.nama}</p>
                  <p className="text-xs mt-1 font-medium" style={{ color: C.ice }}>📍 {l.kota}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. CTA FOOTER ── */}
      <section className="py-20 px-6 text-center relative overflow-hidden" style={{ background: C.navy }}>
        <div className="absolute inset-0 opacity-15">
          <img src={stats.cta_img || stats.hero_img || IMG.hero} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-xl mx-auto space-y-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
            Siap Menjadi Debater<br />
            <span style={{ color: C.ice }}>Terbaik UNIDA?</span>
          </h2>
          <p className="text-xs sm:text-sm max-w-md mx-auto" style={{ color: C.ice }}>
            Masuk ke platform latihan dan mulai perjalanan akademikmu bersama UKM Debat UNIDA Gontor.
          </p>
          <div className="pt-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-sm transition-all hover:scale-105 cursor-pointer shadow-xl"
              style={{ background: C.cobalt, color: "#fff" }}
            >
              Masuk Platform Sekarang <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Copyright Bar */}
      <footer className="py-5 px-6 text-center text-xs font-semibold" style={{ background: "#1e3349", color: "#6b8aaa" }}>
        © 2025 UKM Debat UNIDA Gontor · Teknik Informatika · Universitas Darussalam Gontor
      </footer>

    </div>
  );
}