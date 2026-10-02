'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthBrandPanel from '../_components/AuthBrandPanel';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Validasi konfirmasi password
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Konfirmasi kata sandi tidak cocok!');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Gagal mendaftar');
      }

      setSuccessMsg('Registrasi berhasil! Mengalihkan ke halaman login...');
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Terjadi kesalahan sistem');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen bg-white lg:grid-cols-2">
      <main className="flex min-h-screen items-center justify-center bg-[#F4F6F8] px-5 py-8 sm:px-8 lg:bg-white lg:px-12">
        <div className="w-full max-w-md space-y-5 rounded-3xl border border-[#D8E3EE] bg-white p-6 shadow-xl shadow-[#334F70]/5 sm:p-9 lg:rounded-none lg:border-none lg:p-0 lg:shadow-none">
          <p className="text-xs font-black tracking-[0.18em] text-[#7DA7D9] lg:hidden">DEBAT PLATFORM · UNIDA GONTOR</p>
          <div>
            <h2 className="text-3xl font-black text-[#334F70]">Registrasi Akun Baru</h2>
            <p className="mt-1 text-sm text-slate-400">Buat akun debater akademik kamu sekarang.</p>
          </div>

          {errorMsg && (
            <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="register-username" className="mb-1 block text-sm font-bold text-[#334F70]">Username</label>
              <input
                id="register-username"
                type="text"
                name="username"
                autoComplete="username"
                required
                value={formData.username}
                onChange={handleChange}
                placeholder="Buat username unik..."
                className="w-full rounded-xl border border-[#D4E1EE] bg-[#F4F6F8] p-4 text-sm text-[#334F70] transition placeholder:text-slate-400 focus:border-[#7DA7D9] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#7DA7D9]/15"
              />
            </div>

            <div>
              <label htmlFor="register-email" className="mb-1 block text-sm font-bold text-[#334F70]">Email</label>
              <input
                id="register-email"
                type="email"
                name="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="nama@email.com"
                className="w-full rounded-xl border border-[#D4E1EE] bg-[#F4F6F8] p-4 text-sm text-[#334F70] transition placeholder:text-slate-400 focus:border-[#7DA7D9] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#7DA7D9]/15"
              />
            </div>

            <div>
              <label htmlFor="register-password" className="mb-1 block text-sm font-bold text-[#334F70]">Password</label>
              <input
                id="register-password"
                type="password"
                name="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full rounded-xl border border-[#D4E1EE] bg-[#F4F6F8] p-4 text-sm text-[#334F70] transition placeholder:text-slate-400 focus:border-[#7DA7D9] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#7DA7D9]/15"
              />
            </div>

            <div>
              <label htmlFor="register-confirm-password" className="mb-1 block text-sm font-bold text-[#334F70]">Konfirmasi Password</label>
              <input
                id="register-confirm-password"
                type="password"
                name="confirmPassword"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full rounded-xl border border-[#D4E1EE] bg-[#F4F6F8] p-4 text-sm text-[#334F70] transition placeholder:text-slate-400 focus:border-[#7DA7D9] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#7DA7D9]/15"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-xl bg-linear-to-r from-[#7EA0CF] to-[#334F70] py-4 text-sm font-bold text-white shadow-md shadow-[#334F70]/15 transition hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#334F70] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Memproses...' : 'Daftar Akun ✓'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500">
            Sudah memiliki akun?{' '}
            <Link href="/login" className="font-bold text-[#334F70] hover:underline">
              Masuk di sini
            </Link>
          </p>
        </div>
      </main>

      <aside className="hidden min-h-screen lg:block">
        <AuthBrandPanel>
          <div className="pt-5">
            <Link
              href="/login"
              className="inline-flex rounded-xl border border-[#C8D8E8]/80 bg-white/5 px-8 py-3 text-sm font-bold text-white transition hover:border-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Sudah Punya Akun? Masuk
            </Link>
          </div>
        </AuthBrandPanel>
      </aside>
    </div>
  );
}