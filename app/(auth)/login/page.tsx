// app/(auth)/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const [username, setUsername] = useState(''); // Menggunakan nama state yang sesuai
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.error || 'Gagal masuk ke sistem.');
      }

      const activeUser = {
        id_user: responseData.user.id_user,
        username: responseData.user.nama,
        email: responseData.user.email,
        role: 'user'
      };

      localStorage.setItem('user_session', JSON.stringify(activeUser));
      login(activeUser);
      
      alert('Login berhasil!');
      router.push('/dashboard');

    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan jaringan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side */}
      <div className="hidden lg:flex w-1/2 bg-[#14b8a6] items-center justify-center text-white">
        <div className="text-center px-12">
          <h1 className="text-5xl font-bold mb-4">Debat Platform</h1>
          <p className="text-xl opacity-90">Latihan Debat Kapan Saja, Di Mana Saja</p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          <div className="flex border-b mb-8">
            <button className="flex-1 pb-4 text-center font-medium border-b-2 border-[#14b8a6] text-[#14b8a6]">
              Masuk
            </button>
            <button 
              onClick={() => router.push('/register')}
              className="flex-1 pb-4 text-center font-medium text-gray-400 hover:text-gray-600"
            >
              Daftar
            </button>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-xl text-sm">
              ⚠️ {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            {/* INPUT USERNAME */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#14b8a6] text-black"
                placeholder="Ketik username Anda..."
                required
              />
            </div>

            {/* INPUT PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#14b8a6] text-black"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#14b8a6] hover:bg-[#0f766e] text-white py-4 rounded-xl font-medium text-lg transition"
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Belum punya akun?{' '}
            <span onClick={() => router.push('/register')} className="text-[#14b8a6] cursor-pointer hover:underline">
              Daftar di sini
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}