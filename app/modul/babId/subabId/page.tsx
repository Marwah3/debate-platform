// app/modul/[babId]/[subbabId]/page.tsx
'use client';

import { useRouter, useParams } from 'next/navigation';

const subbabContent = {
  // Bab 1
  101: {
    title: "Debat dan Jenis-jenisnya",
    bab: "Bab 1: Pengantar Debat Parlementer",
    content: `
      Debat adalah proses bertukar argumen secara terstruktur dan beradab untuk mencari kebenaran atau solusi terbaik dari suatu isu.

      Jenis-jenis Debat yang umum digunakan:
      • Asian Parliamentary (AP) → 3 vs 3, 2 debat utama + 1 reply speech
      • British Parliamentary (BP) → 4 tim (Opening + Closing Government & Opposition)
      • Debat Kebijakan (Policy Debate)
      • Debat Nilai (Value Debate)
    `,
  },
  102: {
    title: "Tujuan Debat dan Manfaatnya",
    bab: "Bab 1: Pengantar Debat Parlementer",
    content: `
      Tujuan utama debat kompetitif bukan hanya untuk menang, melainkan:

      1. Melatih berpikir kritis dan analitis
      2. Meningkatkan kemampuan berargumen secara logis
      3. Mengasah kemampuan public speaking dan penyampaian
      4. Membangun mentalitas, keberanian, dan sportivitas
      5. Mengembangkan nalar kritis sesuai ajaran Islam (Hifzhul Aql)
    `,
  },
  // Tambahkan subbab lain nanti
};

export default function SubbabDetail() {
  const params = useParams();
  const router = useRouter();
  const babId = params.babId as string;
  const subbabId = params.subbabId as string;

  const subbab = subbabContent[subbabId as unknown as keyof typeof subbabContent];

  if (!subbab) {
    return <div className="text-center mt-20 text-xl">Subbab tidak ditemukan</div>;
  }

  return (
    <div className="min-h-screen bg-[#f0fdfa] p-6">
      <div className="max-w-4xl mx-auto">
        
        <button
          onClick={() => router.push(`/modul/${babId}`)}
          className="mb-6 flex items-center gap-2 text-[#14b8a6] hover:underline font-medium"
        >
          ← Kembali ke Daftar Subbab
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-10">
          <p className="text-[#14b8a6] font-medium text-lg">{subbab.bab}</p>
          <h1 className="text-3xl font-bold mt-3 mb-8">{subbab.title}</h1>

          <div className="prose prose-lg leading-relaxed text-gray-700">
            {subbab.content.split('\n').map((paragraph, index) => (
              paragraph.trim() && <p key={index} className="mb-5">{paragraph}</p>
            ))}
          </div>

          <div className="mt-12 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => alert('Fitur Kuis akan dibuka')}
              className="flex-1 bg-[#14b8a6] hover:bg-[#0f766e] text-white py-4 rounded-xl font-semibold text-lg"
            >
              Kerjakan Kuis
            </button>
            
            <button
              onClick={() => router.push('/praktik')}
              className="flex-1 bg-[#0f766e] hover:bg-[#115e59] text-white py-4 rounded-xl font-semibold text-lg"
            >
              Latihan ke Ruang Praktik AI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}