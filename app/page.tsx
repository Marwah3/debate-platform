'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

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
  const ff = { fontFamily: "'Plus Jakarta Sans', sans-serif" };

  // Data Gambar Default (Fallback)
  const IMG = {
    hero:      "https://images.unsplash.com/photo-1660795308754-4c6422baf2f6?fit=max&fm=jpg&q=80&w=1600",
    about:     "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?fit=max&fm=jpg&q=80&w=1080",
    speaking:  "https://images.unsplash.com/photo-1660796046943-ae52067e019f?fit=max&fm=jpg&q=80&w=1080",
    mic:       "https://images.unsplash.com/photo-1660795939433-c1964528c485?fit=max&fm=jpg&q=80&w=1080",
    trophy:    "https://images.unsplash.com/photo-1578269174936-2709b6aeb913?fit=max&fm=jpg&q=80&w=1080",
    audience:  "https://images.unsplash.com/photo-1778876091184-8839210e1917?fit=max&fm=jpg&q=80&w=1080",
    lecture:   "https://images.unsplash.com/photo-1778876088510-84d7d8defaaa?fit=max&fm=jpg&q=80&w=1080",
    group:     "https://images.unsplash.com/photo-1569617084133-26942bb441f2?fit=max&fm=jpg&q=80&w=1080",
  };

  // State Dinamis
  const [stats, setStats] = useState<StatData>({ total_anggota: "48+", total_prestasi: "12", total_lomba: "20+" });
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
  const [beritaAcara, setBeritaAcara] = useState<BeritaItem[]>([
    { id_berita: 1, title: "Seminar Nasional Debat Parlementer 2025", date: "12 Maret 2025", tag: "Seminar", img_url: IMG.audience, desc: "Seminar nasional yang menghadirkan para juri dan alumni debat berprestasi sebagai narasumber utama." },
    { id_berita: 2, title: "Latihan Rutin Bersama Tim Inti UKM", date: "5 Mei 2025", tag: "Latihan", img_url: IMG.speaking, desc: "Sesi latihan intensif berfokus pada penguatan struktur argumen AREL dan teknik refutasi lawan." },
    { id_berita: 3, title: "Rapat Pleno Rekruitmen Anggota Baru", date: "20 Juni 2025", tag: "Rapat", img_url: IMG.lecture, desc: "Rapat pleno evaluasi proses rekruitmen dan orientasi anggota baru periode 2025/2026." },
  ]);
  const [lomba, setLomba] = useState<LombaItem[]>([
    { id_lomba: 1, nama: "NUDC 2024", level: "Nasional", kota: "Jakarta", img_url: IMG.mic },
    { id_lomba: 2, nama: "Olimpiade Debat Kemendikbud", level: "Nasional", kota: "Surabaya", img_url: IMG.speaking },
    { id_lomba: 3, nama: "Piala Rektor UNIDA 2024", level: "Internal", kota: "Ponorogo", img_url: IMG.audience },
    { id_lomba: 4, nama: "Debat Antar-PTKIN Se-Jatim", level: "Regional", kota: "Malang", img_url: IMG.lecture },
    { id_lomba: 5, nama: "Asian Parliamentary Invitational", level: "Nasional", kota: "Bandung", img_url: IMG.mic },
    { id_lomba: 6, nama: "WSD Exhibition UNIDA 2023", level: "Internal", kota: "Ponorogo", img_url: IMG.speaking },
  ]);

  // Load Data dari Database
  useEffect(() => {
    async function loadLandingData() {
      try {
        const res = await fetch('/api/landing');
        const result = await res.json();
        if (result.success) {
          if (result.data.stats) setStats(result.data.stats);
          if (result.data.anggota.length > 0) setAnggota(result.data.anggota);
          if (result.data.prestasi.length > 0) setPrestasi(result.data.prestasi);
          if (result.data.berita.length > 0) setBeritaAcara(result.data.berita);
          if (result.data.lomba.length > 0) setLomba(result.data.lomba);
        }
      } catch (err) {
        console.log("Menggunakan data default (Fallback Data)");
      }
    }
    loadLandingData();
  }, []);

  return (
    <div style={{ background: C.white, ...ff }} className="select-none min-h-screen">

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
            <img src={IMG.group} alt="Foto tim UKM Debat" className="w-full h-full object-cover object-top" />
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
            <img src={IMG.about} alt="Tentang UKM Debat" className="rounded-3xl w-full h-80 md:h-115 object-cover shadow-md" />
            <div className="absolute -bottom-4 -right-4 px-6 py-4 rounded-2xl shadow-xl" style={{ background: C.navy }}>
              <p className="text-2xl font-extrabold text-white">Est. 2018</p>
              <p className="text-xs font-semibold" style={{ color: C.ice }}>Berdiri sejak 2018</p>
            </div>
          </div>

          <div className="space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: C.ice, color: C.navy }}>
              Tentang Kami
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold leading-snug" style={{ color: C.navy }}>
              Membangun Debater<br />Berkarakter & Berprestasi
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed" style={{ color: "#6b8aaa" }}>
              UKM Debat UNIDA Gontor adalah unit kegiatan mahasiswa yang berfokus pada pengembangan kemampuan debat parlementer, berpikir kritis, dan komunikasi publik. Berdiri sejak 2018, kami telah melahirkan puluhan debater berprestasi di tingkat regional dan nasional.
            </p>
            <p className="text-xs sm:text-sm leading-relaxed" style={{ color: "#6b8aaa" }}>
              Dengan kurikulum berbasis format internasional — Asian Parliamentary, British Parliamentary, dan World Schools Debate — kami mempersiapkan anggota untuk bersaing di panggung debat tertinggi.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              {[["🎯", "Visi", "Mencetak debater nasional yang berintegritas"], ["📘", "Misi", "Latihan rutin, kompetisi aktif, pembinaan karakter"]].map(([icon, judul, isi]) => (
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

          <div className="grid md:grid-cols-3 gap-6">
            {beritaAcara.map((b) => (
              <div key={b.id_berita} className="rounded-3xl overflow-hidden hover:shadow-lg transition-all duration-300 bg-white" style={{ border: `1.5px solid ${C.ice}` }}>
                <div className="h-52 overflow-hidden relative">
                  <img src={b.img_url || IMG.speaking} alt={b.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold shadow-md" style={{ background: C.cobalt, color: "#fff" }}>
                    {b.tag}
                  </span>
                </div>
                <div className="p-5">
                  <p className="text-xs mb-1.5 font-bold" style={{ color: C.cobalt }}>{b.date}</p>
                  <h3 className="font-bold text-sm mb-2 leading-snug" style={{ color: C.navy }}>{b.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: "#6b8aaa" }}>{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
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
          <img src={IMG.hero} alt="" className="w-full h-full object-cover" />
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