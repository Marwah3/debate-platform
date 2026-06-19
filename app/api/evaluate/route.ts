import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { GoogleGenAI } from '@google/genai';
import { execSync } from 'child_process';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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
      console.error("Gagal mengambil data dari Chroma DB, menggunakan fallback:", err);
      konteksMateriDebat = "Model AREL terdiri atas Assertion, Reasoning, Evidence, dan Link Back.";
    }

    // 2. TAHAP AUGMENTATION & GENERATION (Prompting Gemini)
    const promptRAG = `
      Kamu adalah seorang Juri Debat Parlementer (Adjudicator) profesional di Universitas Darussalam Gontor.
      Tugasmu adalah mengevaluasi argumen mahasiswa berdasarkan Pedoman Konteks Materi asli berikut:
      ---
      ${konteksMateriDebat}
      ---

      Berikut adalah argumen mahasiswa yang harus kamu nilai secara objektif:
      "${teks_argumen}"

      Berikan penilaian secara ketat dengan format output JSON murni. Strukturnya harus tepat seperti ini:
      {
        "skor_AREL": 80,
        "feedback_ai": "Tuliskan analisis tajam di sini"
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: promptRAG,
    });

    const textResult = response.text || "{}";
    
    // REGEX PEMBERSIH EKSTRA: Menjamin ekstrak JSON murni dari Gemini meskipun ada markdown tambahan
    const jsonMatch = textResult.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Format respons dari AI tidak valid");
    }
    const parsedResult = JSON.parse(jsonMatch[0]);

    // 3. TAHAP GAMIFIKASI & SAVE TO MYSQL
    const xpDiperoleh = Math.round((parsedResult.skor_AREL || 0) * 0.5);

    const logArgumen = await prisma.argumens.create({
      data: {
        id_user: id_user || null,
        teks_argumen: teks_argumen,
        skor_AREL: parsedResult.skor_AREL || 0,
        feedback_ai: parsedResult.feedback_ai || "Evaluasi selesai.",
        xp_diperoleh: xpDiperoleh
        // Kita biarkan kolom 'timestamp' diisi otomatis oleh default CURRENT_TIMESTAMP milik MySQL kamu!
      }
    });

    if (id_user) {
      try {
        await prisma.users.update({
          where: { id_user: id_user },
          data: { total_xp: { increment: xpDiperoleh } }
        });
      } catch (userErr) {
        console.error("Gagal update XP user (mungkin ID user belum terdaftar):", userErr);
      }
    }

    return NextResponse.json({
      message: 'Evaluasi AI Berbasis RAG Sukses Berjalan',
      data: logArgumen
    }, { status: 200 });

  } catch (error: any) {
    // Mencetak eror asli ke terminal VS Code kamu agar kita tahu baris mana yang merajuk
    console.error("EROR ASLI BACKEND:", error.message || error);
    return NextResponse.json({ error: 'Terjadi kesalahan sistem internal' }, { status: 500 });
  }
}