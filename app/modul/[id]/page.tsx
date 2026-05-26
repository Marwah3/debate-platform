// app/modul/[id]/page.tsx
'use client';

import { useRouter, useParams } from 'next/navigation';

const modulContent = {
  101: {
    title: "Debat dan Jenis-jenisnya",
    bab: "Bab 1: Pengantar Debat Parlementer",
    content: `
      Debat adalah proses bertukar argumen secara terstruktur untuk mencari kebenaran atau solusi terbaik dari suatu isu.
      
      Jenis-jenis Debat:
      • Debat Parlementer (Asian Parliamentary & British Parliamentary)
      • Debat Kebijakan
      • Debat Nilai
      • Debat Fakta
      
      Dalam kompetisi, format yang paling umum digunakan di Indonesia adalah Asian Parliamentary (AP) dan British Parliamentary (BP).
    `,
  },
  102: {
    title: "Tujuan Debat dan Manfaatnya",
    bab: "Bab 1: Pengantar Debat Parlementer",
    content: `
      Tujuan utama debat adalah:
      1. Melatih berpikir kritis
      2. Meningkatkan kemampuan berargumen
      3. Mengasah kemampuan public speaking
      4. Membangun mentalitas dan keberanian
      
      Manfaat debat sangat besar, terutama dalam mengembangkan nalar kritis sesuai ajaran Islam (hifzhul aql).
    `,
  },
  // Tambahkan konten lain sesuai kebutuhan
};

export default function ModulDetail() {
  const params = useParams();
  const router = useRouter();
  const modulId = parseInt(params.id as string);

  const modul = modulContent[modulId as keyof typeof modulContent];

  if (!modul) {
    return <p className="text-center mt-20 text-xl">Modul tidak ditemukan</p>;
  }

  return (
    <div className="min-h-screen bg-[#f0fdfa] p-6">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => router.push('/modul')}
          className="mb-6 text-[#14b8a6] flex items-center gap-2 hover:underline"
        >
          ← Kembali ke Daftar Modul
        </button>

        <div className="bg-white rounded-2xl shadow p-10">
          <h1 className="text-3xl font-bold mb-2">{modul.title}</h1>
          <p className="text-[#14b8a6] font-medium mb-8">{modul.bab}</p>

          <div className="prose prose-lg max-w-none leading-relaxed text-gray-700">
            {modul.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">{paragraph}</p>
            ))}
          </div>

          <div className="mt-12 flex gap-4">
            <button 
              onClick={() => alert('Kuis akan dibuka')}
              className="flex-1 bg-[#14b8a6] text-white py-4 rounded-xl font-semibold"
            >
              Kerjakan Kuis
            </button>
            <button 
              onClick={() => router.push('/praktik')}
              className="flex-1 bg-[#0f766e] text-white py-4 rounded-xl font-semibold"
            >
              Latihan ke Ruang Praktik
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}