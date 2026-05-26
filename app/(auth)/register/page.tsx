// app/(auth)/register/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [form, setForm] = useState({
    namaLengkap: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Password dan Konfirmasi Password tidak cocok!");
      return;
    }

    setLoading(true);

    const newUser = {
      username: form.namaLengkap,
      email: form.email,
      role: 'user'
    };

    localStorage.setItem('user', JSON.stringify(newUser));
    alert('Registrasi berhasil! Silakan login.');
    router.push('/login');
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

      {/* Right Side - Form Register */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          <div className="flex border-b mb-8">
            <button 
              onClick={() => router.push('/login')}
              className="flex-1 pb-4 text-center font-medium text-gray-400 hover:text-gray-600"
            >
              Masuk
            </button>
            <button 
              className="flex-1 pb-4 text-center font-medium border-b-2 border-[#14b8a6] text-[#14b8a6]"
            >
              Daftar
            </button>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
              <input
                type="text"
                value={form.namaLengkap}
                onChange={(e) => setForm({...form, namaLengkap: e.target.value})}
                className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#14b8a6]"
                placeholder="Nama Lengkap Anda"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({...form, email: e.target.value})}
                className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#14b8a6]"
                placeholder="nama@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({...form, password: e.target.value})}
                className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:border-[#14b8a6]"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password</label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => setForm({...form, confirmPassword: e.target.value})}
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
              {loading ? 'Mendaftar...' : 'Daftar'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Sudah punya akun?{' '}
            <span 
              onClick={() => router.push('/login')} 
              className="text-[#14b8a6] cursor-pointer hover:underline"
            >
              Masuk di sini
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}