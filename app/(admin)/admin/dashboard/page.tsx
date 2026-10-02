'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, BookOpenCheck, ChartNoAxesColumnIncreasing, Medal, Users } from 'lucide-react';

interface DashboardData {
  totalMahasiswa: number;
  totalLatihan: number;
  totalMosi: number;
  rataSkorArel: number;
  tingkatKelayakanSparing: number;
  totalLayakSparing: number;
  tingkatKelayakanLomba: number;
  totalLayakLomba: number;
  aktivitasTerbaru: {
    id: number;
    nama: string;
    ringkasan: string;
    skor: number;
    waktu: string | null;
  }[];
  leaderboard: {
    id: number;
    nama: string;
    xp: number;
    level: number;
  }[];
  trenMingguan: { date: string; jumlah: number }[];
}

const initialStats: DashboardData = {
  totalMahasiswa: 0,
  totalLatihan: 0,
  totalMosi: 0,
  rataSkorArel: 0,
  tingkatKelayakanSparing: 0,
  totalLayakSparing: 0,
  tingkatKelayakanLomba: 0,
  totalLayakLomba: 0,
  aktivitasTerbaru: [],
  leaderboard: [],
  trenMingguan: [],
};

function formatActivityTime(value: string | null) {
  if (!value) return 'Waktu tidak tersedia';
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function formatTrendDate(value: string) {
  return new Intl.DateTimeFormat('id-ID', { weekday: 'short' }).format(new Date(`${value}T12:00:00`));
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardData>(initialStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchDashboardStats() {
      try {
        const res = await fetch('/api/admin/dashboard', { cache: 'no-store' });
        const resData = await res.json();

        if (!res.ok || !resData.success || !resData.data) {
          throw new Error(resData.error || 'Gagal memuat ringkasan aktivitas.');
        }

        setStats(resData.data);
        setError('');
      } catch (err: unknown) {
        console.error('Gagal memuat statistik riil dasbor admin:', err);
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat dasbor.');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardStats();
    const refreshInterval = window.setInterval(fetchDashboardStats, 30_000);

    return () => window.clearInterval(refreshInterval);
  }, []);

  const maxDailyActivity = Math.max(...stats.trenMingguan.map((day) => day.jumlah), 1);
  const metrics = [
    {
      label: 'Total Anggota Aktif',
      value: stats.totalMahasiswa,
      suffix: 'orang',
      icon: Users,
      accent: 'text-[#334F70]',
      detail: 'Akun mahasiswa terdaftar',
    },
    {
      label: 'Total Latihan Disubmit',
      value: stats.totalLatihan,
      suffix: 'latihan',
      icon: BookOpenCheck,
      accent: 'text-[#334F70]',
      detail: 'Akumulasi evaluasi argumen',
    },
    {
      label: 'Mosi Aktif',
      value: stats.totalMosi,
      suffix: 'mosi',
      icon: ChartNoAxesColumnIncreasing,
      accent: 'text-[#334F70]',
      detail: 'Tersedia di Lab AI',
    },
    {
      label: 'Rata-rata Skor AREL',
      value: stats.rataSkorArel,
      suffix: '/ 100',
      icon: Medal,
      accent: 'text-emerald-700',
      detail: 'Dari semua evaluasi',
    },
  ];

  return (
    <div className="space-y-8 pb-8 text-[#334F70]">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#7EA0CF]">Executive Summary</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight">Ringkasan Dasbor Admin</h1>
        <p className="mt-1 text-sm font-medium text-slate-400">
          Ikhtisar perkembangan latihan debat dan kesiapan anggota UKM.
        </p>
      </div>

      {error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <section aria-label="Metrik utama" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <article key={metric.label} className="rounded-2xl border border-[#C8D8E8] bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-bold uppercase leading-relaxed tracking-wide text-slate-500">{metric.label}</p>
                <span className="rounded-xl bg-[#F0F5FA] p-2 text-[#52749A]">
                  <Icon size={18} aria-hidden="true" />
                </span>
              </div>
              <p className={`mt-4 text-3xl font-black ${metric.accent}`}>
                {loading ? '...' : metric.value}{' '}
                <span className="ml-1 text-sm font-bold text-slate-500">{metric.suffix}</span>
              </p>
              <p className="mt-2 text-xs text-slate-400">{metric.detail}</p>
            </article>
          );
        })}
      </section>

      <section aria-labelledby="offline-eligibility-title" className="space-y-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#7EA0CF]">Kesiapan Kompetisi</p>
          <h2 id="offline-eligibility-title" className="mt-1 text-xl font-black">Kelayakan Sparing & Lomba Offline</h2>
          <p className="mt-1 text-sm text-slate-500">Jumlah dan persentase anggota yang sudah mencapai level kelayakan.</p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[
            {
              label: 'Sparing Offline',
              level: 'Level 5+',
              count: stats.totalLayakSparing,
              percentage: stats.tingkatKelayakanSparing,
              color: 'bg-[#52749A]',
              textColor: 'text-[#334F70]',
            },
            {
              label: 'Lomba Offline',
              level: 'Level 10+',
              count: stats.totalLayakLomba,
              percentage: stats.tingkatKelayakanLomba,
              color: 'bg-emerald-600',
              textColor: 'text-emerald-700',
            },
          ].map((eligibility) => (
            <article key={eligibility.label} className="rounded-2xl border border-[#C8D8E8] bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-extrabold">{eligibility.label}</h3>
                  <p className="mt-1 text-xs font-bold text-slate-400">{eligibility.level}</p>
                </div>
                <p className={`text-3xl font-black ${eligibility.textColor}`}>
                  {loading ? '...' : `${eligibility.percentage}%`}
                </p>
              </div>
              <p className="mt-4 text-sm font-semibold text-slate-600">
                {loading ? 'Menghitung anggota...' : `${eligibility.count} dari ${stats.totalMahasiswa} anggota memenuhi syarat`}
              </p>
              <div
                className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100"
                role="progressbar"
                aria-label={`${eligibility.label} memenuhi syarat`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={loading ? 0 : eligibility.percentage}
              >
                <div
                  className={`h-full rounded-full transition-all ${eligibility.color}`}
                  style={{ width: loading ? '0%' : `${eligibility.percentage}%` }}
                />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="weekly-trend-title" className="rounded-2xl border border-[#C8D8E8] bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 id="weekly-trend-title" className="text-lg font-extrabold">Tren Aktivitas Latihan</h2>
            <p className="mt-1 text-sm text-slate-400">Evaluasi argumen harian selama 7 hari terakhir.</p>
          </div>
          <span className="rounded-full bg-[#EEF4FA] px-3 py-1 text-xs font-bold text-[#52749A]">7 hari</span>
        </div>

        <div
          role="img"
          aria-label={`Grafik latihan 7 hari terakhir: ${stats.trenMingguan.map((day) => `${formatTrendDate(day.date)} ${day.jumlah}`).join(', ')}`}
          className="mt-6 grid h-48 grid-cols-7 items-end gap-2 sm:gap-5"
        >
          {stats.trenMingguan.map((day) => (
            <div key={day.date} className="flex h-full min-w-0 flex-col items-center justify-end gap-2">
              <span className="text-xs font-bold text-[#334F70]">{loading ? '' : day.jumlah}</span>
              <div className="flex h-32 w-full items-end overflow-hidden rounded-t-lg bg-[#F1F5F9]">
                <div
                  className="w-full rounded-t-lg bg-linear-to-t from-[#334F70] to-[#7EA0CF] transition-all"
                  style={{ height: loading ? '0%' : `${(day.jumlah / maxDailyActivity) * 100}%` }}
                />
              </div>
              <span className="text-[11px] font-semibold text-slate-400">{formatTrendDate(day.date)}</span>
            </div>
          ))}
          {!loading && stats.trenMingguan.length === 0 && (
            <p className="col-span-7 self-center text-center text-sm text-slate-400">Belum ada data latihan minggu ini.</p>
          )}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[2fr_1fr]">
        <section aria-labelledby="recent-activity-title" className="min-w-0 rounded-2xl border border-[#C8D8E8] bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-[#EDF2F7] p-6">
            <div>
              <h2 id="recent-activity-title" className="text-lg font-extrabold">Aktivitas Terbaru</h2>
              <p className="mt-1 text-sm text-slate-400">5 evaluasi argumen terakhir dari anggota.</p>
            </div>
            <BookOpenCheck className="text-[#7EA0CF]" size={20} aria-hidden="true" />
          </div>
          {stats.aktivitasTerbaru.length > 0 ? (
            <ul className="divide-y divide-[#EDF2F7]">
              {stats.aktivitasTerbaru.map((activity) => (
                <li key={activity.id} className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="font-bold text-[#334F70]">{activity.nama} mengirim latihan argumen</p>
                    <p className="mt-1 wrap-break-wordbreak-words text-sm text-slate-500">
                      “{activity.ringkasan.trim().slice(0, 140)}{activity.ringkasan.length > 140 ? '…' : ''}”
                    </p>
                    <p className="mt-1 text-xs text-slate-400">{formatActivityTime(activity.waktu)}</p>
                  </div>
                  <span className="w-fit shrink-0 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700">
                    Skor {activity.skor}/100
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-8 text-center text-sm text-slate-400">
              {loading ? 'Memuat aktivitas...' : 'Belum ada latihan yang dievaluasi.'}
            </p>
          )}
        </section>

        <section aria-labelledby="leaderboard-title" className="rounded-2xl border border-[#C8D8E8] bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-[#EDF2F7] p-6">
            <div>
              <h2 id="leaderboard-title" className="text-lg font-extrabold">Top 3 Anggota</h2>
              <p className="mt-1 text-sm text-slate-400">Peringkat berdasarkan total XP.</p>
            </div>
            <Medal className="text-amber-500" size={20} aria-hidden="true" />
          </div>
          {stats.leaderboard.length > 0 ? (
            <ol className="divide-y divide-[#EDF2F7]">
              {stats.leaderboard.map((user, index) => (
                <li key={user.id} className="flex items-center gap-4 p-5">
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-black ${index === 0 ? 'bg-amber-100 text-amber-700' : 'bg-[#EEF4FA] text-[#52749A]'}`}>
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-[#334F70]">{user.nama}</p>
                    <p className="text-xs text-slate-400">Level {user.level}</p>
                  </div>
                  <span className="shrink-0 text-sm font-black text-[#52749A]">{user.xp} XP</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="p-8 text-center text-sm text-slate-400">
              {loading ? 'Memuat peringkat...' : 'Belum ada anggota untuk diperingkatkan.'}
            </p>
          )}
          <div className="p-5 pt-3">
            <Link
              href="/admin/users"
              className="inline-flex items-center gap-1 text-sm font-bold text-[#52749A] transition hover:text-[#334F70]"
            >
              Lihat Selengkapnya <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </div>

    </div>
  );
}
