import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { GoogleGenAI } from '@google/genai';
import { execSync } from 'child_process';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function POST(request: Request) {
  try {
    const { id_user, teks_argumen } = await request.json();

    if (!teks_argumen) {
      return NextResponse.json({ error: 'Teks argumen tidak boleh kosong' }, { status: 400 });
    }

    // 1. TAHAP RETRIEVAL (Chroma DB via Python)
  
    let konteksMateriDebat = "";
    try {
      const perintahPython = `python query_vector.py "${teks_argumen.replace(/"/g, '\\"')}"`;
      const hasilBuffer = execSync(perintahPython, { encoding: 'utf-8' });
      konteksMateriDebat = hasilBuffer.trim();
    } catch (err) {
      console.error("⚠️ Gagal mengambil data RAG dari Chroma DB, menggunakan fallback:", err);
      konteksMateriDebat = "Model argumentasi AREL terdiri dari Assertion (Pernyataan), Reasoning (Penalaran sebab-akibat), Evidence (Bukti/Studi Kasus), dan Link-back (Kaitan kesimpulan).";
    }

    // 2. TAHAP AUGMENTATION & GENERATION (Gemini Prompt)

    const promptRAG = `
      Kamu adalah seorang Juri Debat Parlementer (Adjudicator) profesional di Universitas Darussalam Gontor.
      Tugasmu adalah mengevaluasi argumen mahasiswa secara objektif dan ketat berdasarkan Pedoman Konteks Materi asli berikut:
      ---
      ${konteksMateriDebat}
      ---

      Berikut adalah teks argumen konstruksi kasus yang diajukan oleh mahasiswa:
      "${teks_argumen}"

      Berikan penilaian secara akademis dengan format output JSON murni tanpa markdown (tanpa trik tanda kutip \`\`\`json), tanpa kata pengantar apa pun. Strukturnya wajib tepat seperti ini:
      {
        "skor_AREL": (berikan nilai angka 1-100 berdasarkan pemenuhan struktur dan kedalaman dampak sesuai pedoman materi),
        "feedback_ai": "Tuliskan analisis komprehensif per elemen (Assertion, Reasoning, Evidence, Link-back) dan berikan rekomendasi perbaikan spesifik menggunakan bahasa Indonesia yang santun"
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: promptRAG,
    });

    const textResult = response.text || "{}";
    const cleanJsonString = textResult.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedResult = JSON.parse(cleanJsonString);

    // 3. TAHAP GAMIFIKASI & SAVE KE MYSQL

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
    return NextResponse.json({ error: 'Terjadi kesalahan sistem internal backend' }, { status: 500 });
  }
}