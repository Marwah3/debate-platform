// app/modul/page.tsx
'use client';

import { useRouter } from 'next/navigation';

const babList = [
  { id: 1, title: "Bab 1: Pengantar Debat Parlementer" },
  { id: 2, title: "Bab 2: Membangun Kasus Tim Debat (Case Build)" },
  { id: 3, title: "Bab 3: Argumentasi (Argumentation)" },
  { id: 4, title: "Bab 4: Sanggahan (Refutation)" },
];

export default function ModulList() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#f0fdfa] p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Modul Pembelajaran</h1>
        <p className="text-gray-600 mb-10">Pilih Bab yang ingin kamu pelajari</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {babList.map((bab) => (
            <div 
              key={bab.id}
              onClick={() => router.push(`/modul/${bab.id}`)}
              className="bg-white rounded-2xl shadow p-8 hover:shadow-xl hover:border-[#14b8a6] border border-transparent transition cursor-pointer"
            >
              <h2 className="text-2xl font-semibold text-[#14b8a6]">{bab.title}</h2>
              <p className="text-gray-500 mt-3">Klik untuk melihat subbab</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}