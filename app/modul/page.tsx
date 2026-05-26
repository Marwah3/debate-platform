// app/modul/page.tsx
'use client';

import { useRouter } from 'next/navigation';

const babList = [
  {
    id: 1,
    title: "Bab 1: Pengantar Debat Parlementer",
    modules: [
      { id: 101, title: "Debat dan Jenis-jenisnya", status: "selesai" },
      { id: 102, title: "Tujuan Debat dan Manfaatnya", status: "selesai" },
      { id: 103, title: "Konsep Debat Kompetitif", status: "berlangsung" },
      { id: 104, title: "Membangun Kasus / Posisi", status: "terkunci" },
    ]
  },
  {
    id: 2,
    title: "Bab 2: Membangun Kasus Tim Debat (Case Build)",
    modules: [
      { id: 201, title: "Analisis Mosi Berdasarkan Jenisnya", status: "terkunci" },
      { id: 202, title: "Analisis Mosi Berdasarkan Kata Kunci", status: "terkunci" },
      { id: 203, title: "Beban Pembuktian (Burden of Proof)", status: "terkunci" },
    ]
  },
  {
    id: 3,
    title: "Bab 3: Argumentasi (Argumentation)",
    modules: [
      { id: 301, title: "Unsur-Unsur Argumen (Metode 3T)", status: "terkunci" },
      { id: 302, title: "Struktur Penalaran (Logika Informal)", status: "terkunci" },
      { id: 303, title: "Pemberian Bukti / Pembuktian", status: "terkunci" },
    ]
  },
  {
    id: 4,
    title: "Bab 4: Sanggahan (Refutation)",
    modules: [
      { id: 401, title: "Konsep Dasar Sanggahan", status: "terkunci" },
      { id: 402, title: "Tingkatan-Tingkatan Sanggahan", status: "terkunci" },
      { id: 403, title: "Kesesatan Logika (Logical Fallacies)", status: "terkunci" },
    ]
  },
];

export default function ModulList() {
  const router = useRouter();

  const getStatusBadge = (status: string) => {
    if (status === "selesai") return "bg-green-100 text-green-700";
    if (status === "berlangsung") return "bg-blue-100 text-blue-700";
    return "bg-gray-200 text-gray-500";
  };

  return (
    <div className="min-h-screen bg-[#f0fdfa] p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Modul Pembelajaran</h1>
        <p className="text-gray-600 mb-10">Pilih Bab dan Subbab yang ingin kamu pelajari</p>

        <div className="space-y-10">
          {babList.map((bab) => (
            <div key={bab.id} className="bg-white rounded-2xl shadow p-8">
              <h2 className="text-2xl font-semibold mb-6 text-[#14b8a6]">{bab.title}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bab.modules.map((modul) => (
                  <div 
                    key={modul.id}
                    className="border border-gray-200 rounded-xl p-5 hover:border-[#14b8a6] transition group"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg group-hover:text-[#14b8a6]">{modul.title}</h3>
                      </div>
                      <span className={`text-xs px-4 py-1 rounded-full ${getStatusBadge(modul.status)}`}>
                        {modul.status === "selesai" ? "Selesai" : 
                         modul.status === "berlangsung" ? "Berlangsung" : "Terkunci"}
                      </span>
                    </div>

                    <button
                      onClick={() => router.push(`/modul/${modul.id}`)}
                      className="mt-4 w-full py-3 text-sm font-medium rounded-xl border border-gray-300 hover:bg-gray-50 transition"
                    >
                      Buka Modul
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}