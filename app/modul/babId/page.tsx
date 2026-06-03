// app/modul/[babId]/page.tsx
'use client';

import { useRouter, useParams } from 'next/navigation';

const babData: Record<string, { title: string; subbab: { id: number; title: string; status: string }[] }> = {
  '1': {
    title: "Bab 1: Pengantar Debat Parlementer",
    subbab: [
      { id: 101, title: "Debat dan Jenis-jenisnya", status: "selesai" },
      { id: 102, title: "Tujuan Debat dan Manfaatnya", status: "selesai" },
      { id: 103, title: "Konsep Debat Kompetitif", status: "berlangsung" },
      { id: 104, title: "Membangun Kasus / Posisi", status: "terkunci" },
    ]
  },
  // Tambahkan bab 2, 3, 4 nanti
};

export default function BabDetail() {
  const params = useParams();
  const router = useRouter();
  const babId = params.babId as string;

  const bab = babData[babId];

  if (!bab) return <p>Bab tidak ditemukan</p>;

  return (
    <div className="min-h-screen bg-[#f0fdfa] p-6">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => router.push('/modul')} className="mb-6 text-[#14b8a6] hover:underline">
          ← Kembali ke Daftar Bab
        </button>

        <h1 className="text-3xl font-bold mb-8">{bab.title}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bab.subbab.map((sub) => (
            <div key={sub.id} className="bg-white rounded-2xl p-6 shadow hover:shadow-md transition">
              <div className="flex justify-between">
                <h3 className="font-medium">{sub.title}</h3>
                <span className={`text-xs px-3 py-1 rounded-full ${sub.status === 'selesai' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                  {sub.status}
                </span>
              </div>
              <button 
                onClick={() => router.push(`/modul/${babId}/${sub.id}`)}
                className="mt-4 w-full py-3 bg-[#14b8a6] text-white rounded-xl hover:bg-[#0f766e]"
              >
                Buka Materi
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}