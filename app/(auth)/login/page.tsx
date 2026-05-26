// app/(auth)/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const dummyUser = {
      username: email.split('@')[0],
      email: email,
      role: 'user'
    };

    login(dummyUser);
    alert('Login berhasil!');
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Teal Background */}
      <div className="hidden lg:flex w-1/2 bg-[#14b8a6] items-center justify-center text-white">
        <div className="text-center px-12">
          <h1 className="text-5xl font-bold mb-4">Debat Platform</h1>
          <p className="text-xl opacity-90">
            Latihan Debat Kapan Saja, Di Mana Saja
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          <div className="flex border-b mb-8">
            <button 
              className="flex-1 pb-4 text-center font-medium border-b-2 border-[#14b8a6] text-[#14b8a6]"
            >
              Masuk
            </button>
            <button 
              onClick={() => router.push('/register')}
              className="flex-1 pb-4 text-center font-medium text-gray-400 hover:text-gray-600"
            >
              Daftar
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#14b8a6]"
                placeholder="nama@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#14b8a6]"
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
            <span 
              onClick={() => router.push('/register')} 
              className="text-[#14b8a6] cursor-pointer hover:underline"
            >
              Daftar di sini
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}