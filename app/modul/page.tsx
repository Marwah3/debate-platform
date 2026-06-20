import { prisma } from '@/lib/prisma';
import Link from 'next/link';

// Fungsi untuk mengambil data langsung dari MySQL
async function getSemuaModul() {
  try {
    // Mengambil data dari tabel moduls MySQL
    const moduls = await prisma.moduls.findMany({
      orderBy: { 
        id_modul: 'asc'
      }
    });
    
    return moduls;
  } catch (error) {
    console.error("Gagal mengambil data modul:", error);
    return [];
  }
}

export default async function ModulPage() {
  const daftarModul = await getSemuaModul();

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-teal-400 mb-2">Daftar Modul Pembelajaran</h1>
        <p className="text-slate-400 mb-8">Kuasai parameter AREL melalui materi terstruktur di bawah ini.</p>

        {/* Tempat Menampilkan List Modul Berdasarkan Database */}
        <div className="grid gap-4">
          {daftarModul.map((modul) => (
            <div key={modul.id_modul} className="p-6 bg-slate-800 rounded-lg border border-slate-700 flex justify-between items-center shadow-md">
              <div>
                <h3 className="text-xl font-semibold text-slate-200">
                  {/* Disesuaikan dengan kolom 'urutan' dan 'judul_modul' sesuai schema database kamu */}
                  {modul.urutan}. {modul.judul}
                </h3>
                <p className="text-slate-400 text-sm mt-1">
                  {/* Memotong konten materi sepanjang 100 karakter dengan aman */}
                  {modul.konten_materi ? `${modul.konten_materi.substring(0, 100)}...` : ''}
                </p>
              </div>

              {/* Tombol Baca / Status Terkunci (Gamifikasi dasar) */}
              {modul.status_lock ? (
                <span className="bg-slate-700 text-slate-500 px-4 py-2 rounded text-sm cursor-not-allowed">
                  🔒 Terkunci
                </span>
              ) : (
                <Link 
                  href={`/modul/${modul.id_modul}`}
                  className="bg-teal-500 hover:bg-teal-400 text-slate-900 px-4 py-2 rounded text-sm font-semibold transition"
                >
                  Mulai Belajar →
                </Link>
              )}
            </div>
          ))}

          {daftarModul.length === 0 && (
            <p className="text-slate-500 italic">Belum ada data modul di database.</p>
          )}
        </div>
      </div>
    </div>
  );
}