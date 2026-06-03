// app/praktik/page.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function PraktikDebat() {
  const { user } = useAuth();
  const [mosi, setMosi] = useState('');
  const [assertion, setAssertion] = useState('');
  const [reasoning, setReasoning] = useState('');
  const [evidence, setEvidence] = useState('');
  const [linkback, setLinkback] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmitArgumen = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulasi AI Evaluator (nanti kita integrasikan dengan Gemini)
    setTimeout(() => {
      const skor = Math.floor(Math.random() * 30) + 70; // skor dummy 70-100

      setFeedback(`
        **Skor AREL: ${skor}/100**\n\n
        ✅ **Assertion**: Bagus, jelas dan langsung menjawab mosi.\n
        ✅ **Reasoning**: Penalaran logis cukup kuat.\n
        ⚠️ **Evidence**: Tambahkan contoh kasus atau data yang lebih spesifik.\n
        ✅ **Link-back**: Sudah menghubungkan kembali ke mosi.\n\n
        **Saran Perbaikan**: Perkuat bagian Evidence dengan fakta atau contoh nyata.
      `);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#f0fdfa] p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Ruang Praktik Debat</h1>
        <p className="text-gray-600 mb-8">Susun argumenmu dan dapatkan feedback dari AI</p>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmitArgumen}>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Mosi / Topik Debat</label>
              <input
                type="text"
                value={mosi}
                onChange={(e) => setMosi(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-xl"
                placeholder="Contoh: Pendidikan gratis adalah hak semua warga negara"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Assertion (Pernyataan)</label>
                <textarea
                  value={assertion}
                  onChange={(e) => setAssertion(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-xl h-24"
                  placeholder="Negara harus menyediakan pendidikan gratis..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Reasoning (Penalaran)</label>
                <textarea
                  value={reasoning}
                  onChange={(e) => setReasoning(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-xl h-24"
                  placeholder="Karena pendidikan adalah investasi jangka panjang..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Evidence (Bukti)</label>
                <textarea
                  value={evidence}
                  onChange={(e) => setEvidence(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-xl h-24"
                  placeholder="Menurut data UNESCO tahun 2024..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Link-back (Tautan Balik)</label>
                <textarea
                  value={linkback}
                  onChange={(e) => setLinkback(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-xl h-20"
                  placeholder="Oleh karena itu, mosi ini harus didukung..."
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-8 w-full bg-[#14b8a6] hover:bg-[#0f766e] text-white py-4 rounded-xl font-semibold text-lg disabled:bg-gray-400"
            >
              {loading ? "AI sedang menilai argumen..." : "Kirim Argumen ke AI Evaluator"}
            </button>
          </form>

          {feedback && (
            <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-200">
              <h3 className="font-semibold mb-4 text-lg">Feedback AI Evaluator:</h3>
              <pre className="whitespace-pre-wrap text-gray-700 leading-relaxed">{feedback}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}