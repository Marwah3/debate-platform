'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import AuthBrandPanel from '../_components/AuthBrandPanel';

export default function AuthPage() {
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  const [regForm, setRegForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  // 1. Logika Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUsername, password: loginPassword }),
      });
      const responseData = await res.json();
      
      if (!res.ok) throw new Error(responseData.error || 'Gagal masuk ke sistem.');

      const userRole = String(responseData.user.role || '').toLowerCase();

      const activeUser = {
        id_user: responseData.user.id_user,
        username: responseData.user.nama,
        email: responseData.user.email,
        role: userRole
      };

      localStorage.setItem('user_session', JSON.stringify(activeUser));
      login(activeUser);
      
      alert(`Login berhasil! Selamat datang, ${activeUser.username}.`);
      
      if (userRole === 'admin') {
        router.push('/admin/dashboard'); 
      } else {
        router.push('/dashboard');
      }
      
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Terjadi kesalahan jaringan.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Logika Register
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (regForm.password !== regForm.confirmPassword) {
      alert("Password dan Konfirmasi Password tidak cocok!");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: regForm.username,
          email: regForm.email,
          password: regForm.password,
          role: 'admin'
        }),
      });
      const responseData = await res.json();
      if (!res.ok) throw new Error(responseData.error || 'Gagal mendaftarkan akun.');

      alert('Registrasi berhasil! Silakan masuk dengan akun baru Anda.');
      setIsRegisterMode(false);
      setLoginUsername(regForm.username);
      setRegForm({ username: '', email: '', password: '', confirmPassword: '' });
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Terjadi kesalahan saat mendaftar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full select-none overflow-x-hidden bg-white lg:h-screen lg:overflow-hidden">
      
      {/* PANEL 1: BACKGROUND NAVY */}
      <div 
        className={`absolute inset-y-0 z-20 hidden w-1/2 overflow-hidden text-[#F3F3F4] transition-[left] duration-700 ease-in-out lg:block ${
          isRegisterMode ? 'left-1/2' : 'left-0'
        }`}
      >
        <AuthBrandPanel>
          <div className="pt-5">
            <button
              onClick={() => { setIsRegisterMode(!isRegisterMode); setErrorMsg(''); }}
              className="rounded-xl border border-[#C8D8E8]/80 bg-white/5 px-8 py-3 text-sm font-bold text-white transition duration-200 hover:border-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              {isRegisterMode ? 'Sudah Punya Akun? Masuk' : 'Belum Punya Akun? Daftar'}
            </button>
          </div>
        </AuthBrandPanel>
      </div>

      {/* PANEL 2: FORM LOGIN */}
      <div 
        className={`absolute inset-y-0 right-0 z-10 flex min-h-screen w-full items-center justify-center overflow-y-auto bg-[#F3F3F4] p-5 transition-all duration-700 ease-in-out sm:p-8 lg:min-h-0 lg:w-1/2 lg:bg-white ${
          isRegisterMode ? 'opacity-0 pointer-events-none lg:translate-x-10' : 'opacity-100 translate-x-0'
        }`}
      >
        <div className="w-full max-w-md space-y-6 rounded-3xl border border-[#D8E3EE] bg-white p-6 shadow-xl shadow-[#334F70]/5 sm:p-9 lg:rounded-none lg:border-none lg:bg-transparent lg:p-0 lg:shadow-none">
          <p className="text-xs font-black tracking-[0.18em] text-[#7DA7D9] lg:hidden">DEBAT PLATFORM · UNIDA GONTOR</p>
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-black text-[#334F70]">Selamat Datang Kembali</h2>
            <p className="text-sm text-slate-400 mt-1">Masuk untuk melanjutkan latihan debat akademik Anda.</p>
          </div>

          {errorMsg && !isRegisterMode && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs">
              ⚠️ {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-[#334F70] mb-1">Username</label>
              <input
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                className="w-full rounded-xl border border-[#D4E1EE] bg-[#F4F6F8] p-4 text-sm font-medium text-[#334F70] transition placeholder:text-slate-400 focus:border-[#7DA7D9] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#7DA7D9]/15"
                placeholder="Ketik username Anda..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#334F70] mb-1">Password</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full rounded-xl border border-[#D4E1EE] bg-[#F4F6F8] p-4 text-sm font-medium text-[#334F70] transition placeholder:text-slate-400 focus:border-[#7DA7D9] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#7DA7D9]/15"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-linear-to-r from-[#7EA0CF] to-[#334F70] py-4 text-sm font-bold text-white shadow-md shadow-[#334F70]/15 transition hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#334F70] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 lg:hidden">
            Belum punya akun?{' '}
            <button
              type="button"
              onClick={() => { setIsRegisterMode(true); setErrorMsg(''); }}
              className="font-bold text-[#334F70] hover:underline"
            >
              Daftar di sini
            </button>
          </p>
        </div>
      </div>

      {/* PANEL 3: FORM REGISTER */}
      <div 
        className={`absolute inset-y-0 left-0 z-10 flex min-h-screen w-full items-center justify-center overflow-y-auto bg-[#F3F3F4] p-5 transition-all duration-700 ease-in-out sm:p-8 lg:min-h-0 lg:w-1/2 lg:bg-white ${
          isRegisterMode ? 'opacity-100 translate-x-0' : 'opacity-0 pointer-events-none lg:-translate-x-10'
        }`}
      >
        <div className="w-full max-w-md space-y-5 rounded-3xl border border-[#D8E3EE] bg-white p-6 shadow-xl shadow-[#334F70]/5 sm:p-9 lg:rounded-none lg:border-none lg:bg-transparent lg:p-0 lg:shadow-none">
          <p className="text-xs font-black tracking-[0.18em] text-[#7DA7D9] lg:hidden">DEBAT PLATFORM · UNIDA GONTOR</p>
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-black text-[#334F70]">Registrasi Akun Baru</h2>
            <p className="text-sm text-slate-400 mt-1">Buat akun debater akademik kamu sekarang.</p>
          </div>

          {errorMsg && isRegisterMode && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs">
              ⚠️ {errorMsg}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-[#334F70] mb-1">Username</label>
              <input
                type="text"
                value={regForm.username}
                onChange={(e) => setRegForm({...regForm, username: e.target.value})}
                className="w-full rounded-xl border border-[#D4E1EE] bg-[#F4F6F8] p-4 text-sm font-medium text-[#334F70] transition placeholder:text-slate-400 focus:border-[#7DA7D9] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#7DA7D9]/15"
                placeholder="Buat username unik..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#334F70] mb-1">Email</label>
              <input
                type="email"
                value={regForm.email}
                onChange={(e) => setRegForm({...regForm, email: e.target.value})}
                className="w-full rounded-xl border border-[#D4E1EE] bg-[#F4F6F8] p-4 text-sm font-medium text-[#334F70] transition placeholder:text-slate-400 focus:border-[#7DA7D9] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#7DA7D9]/15"
                placeholder="nama@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#334F70] mb-1">Password</label>
              <input
                type="password"
                value={regForm.password}
                onChange={(e) => setRegForm({...regForm, password: e.target.value})}
                className="w-full rounded-xl border border-[#D4E1EE] bg-[#F4F6F8] p-4 text-sm font-medium text-[#334F70] transition placeholder:text-slate-400 focus:border-[#7DA7D9] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#7DA7D9]/15"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#334F70] mb-1">Konfirmasi Password</label>
              <input
                type="password"
                value={regForm.confirmPassword}
                onChange={(e) => setRegForm({...regForm, confirmPassword: e.target.value})}
                className="w-full rounded-xl border border-[#D4E1EE] bg-[#F4F6F8] p-4 text-sm font-medium text-[#334F70] transition placeholder:text-slate-400 focus:border-[#7DA7D9] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#7DA7D9]/15"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-linier-to-r from-[#7EA0CF] to-[#334F70] py-4 text-sm font-bold text-white shadow-md shadow-[#334F70]/15 transition hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#334F70] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Mendaftar...' : 'Daftar Akun ✓'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 lg:hidden">
            Sudah punya akun?{' '}
            <button
              type="button"
              onClick={() => { setIsRegisterMode(false); setErrorMsg(''); }}
              className="font-bold text-[#334F70] hover:underline"
            >
              Masuk di sini
            </button>
          </p>
        </div>
      </div>

    </div>
  );
}