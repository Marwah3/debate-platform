import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 text-white p-6">
      {/* Konten Utama */}
      <main className="text-center max-w-2xl">
        <h1 className="text-5xl font-extrabold tracking-tight text-teal-400 mb-4">
          Platform Pembelajaran Debat Parlementer
        </h1>
        <p className="text-lg text-slate-300 mb-8">
          Selamat datang di pusat pelatihan debat digital khusus Mahasiswa Universitas Darussalam Gontor. 
          Asah kemampuan berpikir kritis dan kuasai kerangka parameter AREL secara interaktif.
        </p>

        {/* Tombol Aksi Menuju Halaman Login */}
        <div className="flex justify-center gap-4">
          <Link 
            href="/login" 
            className="rounded-md bg-teal-500 px-6 py-3 font-semibold text-slate-900 transition duration-200 hover:bg-teal-400 shadow-lg shadow-teal-500/20"
          >
            Mulai Latihan Sekarang
          </Link>
        </div>
      </main>

      {/* Identitas Kampus di Bagian Bawah */}
      <footer className="absolute bottom-4 text-xs text-slate-500">
        Teknik Informatika • Universitas Darussalam Gontor
      </footer>
    </div>
  );
}