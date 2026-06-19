import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { GoogleGenAI } from '@google/genai';
import { execSync } from 'child_process';

// Inisialisasi Google Gen AI SDK menggunakan API Key dari .env kamu
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: Request) {
  try {
    const { id_user, teks_argumen } = await request.json();

    if (!teks_argumen) {
      return NextResponse.json({ error: 'Teks argumen tidak boleh kosong' }, { status: 400 });
    }

    // ==========================================
    // 1. TAHAP RETRIEVAL (Mengambil Konteks dari Chroma DB)
    // ==========================================
    let konteksMateriDebat = "";
    try {
      // Menjalankan skrip python query_vector.py dan mengirimkan teks argumen sebagai parameter
      const perintahPython = `python query_vector.py "${teks_argumen.replace(/"/g, '\\"')}"`;
      const hasilBuffer = execSync(perintahPython, { encoding: 'utf-8' });
      konteksMateriDebat = hasilBuffer.trim();
    } catch (err) {
      console.error("Gagal mengambil data dari Chroma DB, menggunakan fallback materi standar:", err);
      // Fallback aman jika python lokal mendadak sibuk
      konteksMateriDebat = "Model AREL terdiri atas Assertion, Reasoning, Evidence, dan Link Back.";
    }

    // ==========================================
    // 2. TAHAP AUGMENTATION & GENERATION (Prompting Gemini)
    // ==========================================
    const promptRAG = `
      Kamu adalah seorang Juri Debat Parlementer (Adjudicator) profesional di Universitas Darussalam Gontor.
      Tugasmu adalah mengevaluasi argumen mahasiswa berdasarkan Pedoman Konteks Materi asli berikut:
      ---
      ${konteksMateriDebat}
      ---

      Berikut adalah argumen mahasiswa yang harus kamu nilai secara objektif:
      "${teks_argumen}"

      Berikan penilaian secara ketat dengan format output JSON murni tanpa markdown (tanpa trik tanda kutip \`\`\`json), tanpa kata pengantar apa pun. Strukturnya harus tepat seperti ini:
      {
        "skor_AREL": (berikan nilai angka 1-100 berdasarkan kesesuaian dan kelengkapan dengan konteks materi di atas),
        "feedback_ai": "Tuliskan analisis tajam per elemen (Assertion, Reasoning, Evidence, Link-back) dan berikan saran perbaikan akademik spesifik menggunakan bahasa Indonesia yang santun"
      }
    `;

    // Kirim instruksi gabungan (RAG) ke Google Gemini
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: promptRAG,
    });

    const textResult = response.text || "{}";
    
    // Bersihkan teks dari kemungkinan spasi atau tag markdown otomatis bawaan LLM
    const cleanJsonString = textResult.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedResult = JSON.parse(cleanJsonString);

    // ==========================================
    // 3. TAHAP GAMIFIKASI & SAVE TO MYSQL
    // ==========================================
    // Hitung reward XP mahasiswa berdasarkan nilai yang didapat (misal: skor dikali 0.5)
    const xpDiperoleh = Math.round(parsedResult.skor_AREL * 0.5);

    const logArgumen = await prisma.argumens.create({
      data: {
        id_user: id_user || null,
        teks_argumen: teks_argumen,
        skor_AREL: parsedResult.skor_AREL,
        feedback_ai: parsedResult.feedback_ai,
        xp_diperoleh: xpDiperoleh
      }
    });

    // Jika id_user dikirim (sudah login), otomatis tambahkan total_xp di tabel users MySQL
    if (id_user) {
      await prisma.users.update({
        where: { id_user: id_user },
        data: {
          total_xp: { increment: xpDiperoleh }
        }
      });
    }

    return NextResponse.json({
      message: 'Evaluasi AI Berbasis RAG Sukses Berjalan',
      data: logArgumen
    }, { status: 200 });

  } catch (error: any) {
    console.error("Error pada API Evaluator RAG:", error);
    return NextResponse.json({ error: 'Terjadi kesalahan sistem internal' }, { status: 500 });
  }
}