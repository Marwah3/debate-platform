'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

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
      
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan jaringan.');
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
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan saat mendaftar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen bg-white relative flex overflow-hidden select-none">
      
      {/* PANEL 1: BACKGROUND NAVY */}
      <div 
        className={`hidden lg:flex absolute top-0 bottom-0 w-1/2 bg-[#334F70] text-[#F3F3F4] p-12 flex-col justify-center items-center text-center space-y-6 z-20 transition-all duration-700 ease-in-out ${
          isRegisterMode ? 'left-1/2' : 'left-0'
        }`}
      >
        <div className="space-y-3 animate-fadeIn">
          <h1 className="text-5xl font-black tracking-tight text-white">Debat Platform</h1>
          <p className="text-base text-[#C8D8E8] font-medium max-w-xs mx-auto">
            Latihan Debat Kapan Saja, Di Mana Saja
          </p>
        </div>

        <div className="pt-4">
          <button
            onClick={() => { setIsRegisterMode(!isRegisterMode); setErrorMsg(''); }}
            className="px-8 py-3 border-2 border-[#C8D8E8] text-white text-sm font-bold rounded-xl hover:bg-white/10 transition duration-200"
          >
            {isRegisterMode ? 'Sudah Punya Akun? Masuk' : 'Belum Punya Akun? Daftar'}
          </button>
        </div>
      </div>

      {/* PANEL 2: FORM LOGIN */}
      <div 
        className={`w-full lg:w-1/2 h-full flex items-center justify-center p-8 bg-[#F3F3F4] lg:bg-white transition-all duration-700 ease-in-out absolute top-0 bottom-0 right-0 z-10 ${
          isRegisterMode ? 'opacity-0 pointer-events-none lg:translate-x-10' : 'opacity-100 translate-x-0'
        }`}
      >
        <div className="w-full max-w-md space-y-6 bg-white lg:bg-transparent p-8 lg:p-0 rounded-2xl border border-[#C8D8E8] lg:border-none shadow-md lg:shadow-none">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-black text-[#334F70]">Selamat Datang Kembali</h2>
            <p className="text-sm text-slate-400 mt-1">Masuk untuk melanjutkan latihan debat akademik anda.</p>
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
                className="w-full p-4 bg-[#F3F3F4] border border-[#C8D8E8] rounded-xl focus:outline-hidden focus:border-[#334F70] text-[#334F70] text-sm font-medium transition"
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
                className="w-full p-4 bg-[#F3F3F4] border border-[#C8D8E8] rounded-xl focus:outline-hidden focus:border-[#334F70] text-[#334F70] text-sm font-medium transition"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-[#7EA0CF] to-[#334F70] hover:opacity-95 text-white py-4 rounded-xl font-bold text-sm transition shadow-md shadow-[#334F70]/10"
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 lg:hidden">
            Belum punya akun?{' '}
            <span onClick={() => setIsRegisterMode(true)} className="text-[#334F70] font-bold cursor-pointer hover:underline">
              Daftar di sini
            </span>
          </p>
        </div>
      </div>

      {/* PANEL 3: FORM REGISTER */}
      <div 
        className={`w-full lg:w-1/2 h-full flex items-center justify-center p-8 bg-[#F3F3F4] lg:bg-white transition-all duration-700 ease-in-out absolute top-0 bottom-0 left-0 z-10 ${
          isRegisterMode ? 'opacity-100 translate-x-0' : 'opacity-0 pointer-events-none lg:-translate-x-10'
        }`}
      >
        <div className="w-full max-w-md space-y-5 bg-white lg:bg-transparent p-8 lg:p-0 rounded-2xl border border-[#C8D8E8] lg:border-none shadow-md lg:shadow-none">
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
                className="w-full p-4 bg-[#F3F3F4] border border-[#C8D8E8] rounded-xl focus:outline-hidden focus:border-[#334F70] text-[#334F70] text-sm font-medium transition"
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
                className="w-full p-4 bg-[#F3F3F4] border border-[#C8D8E8] rounded-xl focus:outline-hidden focus:border-[#334F70] text-[#334F70] text-sm font-medium transition"
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
                className="w-full p-4 bg-[#F3F3F4] border border-[#C8D8E8] rounded-xl focus:outline-hidden focus:border-[#334F70] text-[#334F70] text-sm font-medium transition"
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
                className="w-full p-4 bg-[#F3F3F4] border border-[#C8D8E8] rounded-xl focus:outline-hidden focus:border-[#334F70] text-[#334F70] text-sm font-medium transition"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-[#7EA0CF] to-[#334F70] hover:opacity-95 text-white py-4 rounded-xl font-bold text-sm transition duration-150 shadow-md shadow-[#334F70]/10"
            >
              {loading ? 'Mendaftar...' : 'Daftar Akun ✓'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 lg:hidden">
            Sudah punya akun?{' '}
            <span onClick={() => setIsRegisterMode(false)} className="text-[#334F70] font-bold cursor-pointer hover:underline">
              Masuk di sini
            </span>
          </p>
        </div>
      </div>

    </div>
  );
}