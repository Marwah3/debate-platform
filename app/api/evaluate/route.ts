import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import Groq from 'groq-sdk';
import { execSync } from 'child_process';

// Inisialisasi client Groq SDK
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
});

export async function POST(request: Request) {
  try {
    const { id_user, teks_argumen } = await request.json();

    if (!teks_argumen) {
      return NextResponse.json({ error: 'Teks argumen tidak boleh kosong' }, { status: 400 });
    }

    // 1. TAHAP RETRIEVAL (RAG dari Chroma DB via Script Python)
    let konteksMateriDebat = "";
    try {
      const perintahPython = `python query_vector.py "${teks_argumen.replace(/"/g, '\\"')}"`;
      // Timeout 5000ms agar serverless Netlify tidak hang jika python tak ditemukan
      const hasilBuffer = execSync(perintahPython, { encoding: 'utf-8', timeout: 5000 });
      konteksMateriDebat = hasilBuffer.trim();
    } catch (err) {
      console.warn("⚠️ Gagal mengambil data RAG dari Chroma DB (Lingkungan Serverless/Netlify), menggunakan fallback:", err);
      konteksMateriDebat = "Model argumentasi AREL terdiri dari Assertion (Pernyataan), Reasoning (Penalaran sebab-akibat), Evidence (Bukti/Studi Kasus), dan Link-back (Kaitan kesimpulan).";
    }

    // 2. TAHAP AUGMENTATION & GENERATION (Groq AI Prompt)
    const promptRAG = `
      Kamu adalah seorang Juri Debat Parlementer (Adjudicator) profesional di Universitas Darussalam Gontor.
      Tugasmu adalah mengevaluasi argumen mahasiswa secara objektif dan ketat berdasarkan Pedoman Konteks Materi asli berikut:
      ---
      ${konteksMateriDebat}
      ---

      Berikut adalah teks argumen konstruksi kasus yang diajukan oleh mahasiswa:
      "${teks_argumen}"

      Berikan penilaian secara akademis dengan format output JSON murni tanpa markdown, tanpa kata pengantar apa pun. Strukturnya wajib tepat seperti ini:
      {
        "skor_AREL": (berikan nilai angka 1-100 berdasarkan pemenuhan struktur dan kedalaman dampak sesuai pedoman materi),
        "feedback_ai": "Tuliskan analisis komprehensif per elemen (Assertion, Reasoning, Evidence, Link-back) dan berikan rekomendasi perbaikan spesifik menggunakan bahasa Indonesia yang santun"
      }
    `;

    // Pemanggilan ke Groq API
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'Kamu adalah sistem penilai dan evaluator debat yang selalu memberikan output berbentuk JSON valid.'
        },
        {
          role: 'user',
          content: promptRAG,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      response_format: { type: 'json_object' }, // Memastikan output murni JSON valid dari Groq
    });

    const textResult = chatCompletion.choices[0]?.message?.content || "{}";
    const cleanJsonString = textResult.replace(/```json/g, '').replace(/```/g, '').trim();
    
    let parsedResult = { skor_AREL: 0, feedback_ai: "Gagal memproses analisis argumen." };
    try {
      parsedResult = JSON.parse(cleanJsonString);
    } catch (parseErr) {
      console.error("⚠️ Gagal parse JSON dari Groq response:", textResult);
      parsedResult = {
        skor_AREL: 70,
        feedback_ai: textResult || "Format respon dari AI tidak sesuai, namun argumen berhasil dicatat."
      };
    }

    // 3. TAHAP GAMIFIKASI & SAVE KE MYSQL (Aiven)
    const xpDiperoleh = Math.round((parsedResult.skor_AREL || 0) * 0.5);

    const logArgumen = await prisma.argumens.create({
      data: {
        id_user: id_user ? Number(id_user) : null,
        teks_argumen: teks_argumen,
        skor_AREL: parsedResult.skor_AREL || 0,
        feedback_ai: parsedResult.feedback_ai || 'Gagal menghasilkan umpan balik otomatis.',
        xp_diperoleh: xpDiperoleh
      }
    });

    if (id_user) {
      await prisma.users.update({
        where: { id_user: Number(id_user) },
        data: {
          total_xp: { increment: xpDiperoleh }
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Evaluasi argumen berbasis AI RAG sukses diproses!',
      data: logArgumen
    }, { status: 200 });

  } catch (error: any) {
    console.error("❌ ERROR API EVALUATOR AI:", error);

    // Penanganan khusus jika terkena Rate Limit dari Groq
    if (error.status === 429 || error.message?.includes('429') || error.message?.toLowerCase().includes('rate limit')) {
      return NextResponse.json({ 
        error: 'Sistem AI sedang mencapai batas kuota pemanggilan (Rate Limit Groq). Silakan coba lagi beberapa saat.' 
      }, { status: 429 });
    }

    return NextResponse.json({ 
      error: 'Terjadi kesalahan sistem internal backend: ' + (error.message || 'Unknown Error') 
    }, { status: 500 });
  }
}