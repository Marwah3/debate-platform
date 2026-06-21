import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { GoogleGenAI } from '@google/genai';
import { execSync } from 'child_process';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. PERBAIKAN: Amankan tipe data id_user menjadi Number agar sinkron dengan INT di MySQL
    const id_user = body.id_user ? Number(body.id_user) : null;
    const teks_argumen = body.teks_argumen;

    if (!teks_argumen) {
      return NextResponse.json({ error: 'Teks argumen tidak boleh kosong' }, { status: 400 });
    }

    // 2. TAHAP RETRIEVAL (Chroma DB via Python)
    let konteksMateriDebat = "";
    try {
      const perintahPython = `python query_vector.py "${teks_argumen.replace(/"/g, '\\"')}"`;
      const hasilBuffer = execSync(perintahPython, { encoding: 'utf-8' });
      konteksMateriDebat = hasilBuffer.trim();
    } catch (err) {
      console.error("Gagal mengambil data dari Chroma DB, menggunakan fallback:", err);
      konteksMateriDebat = "Model AREL terdiri atas Assertion, Reasoning, Evidence, dan Link Back.";
    }

    // 3. TAHAP AUGMENTATION & GENERATION (Prompting Gemini)
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

    // Memanggil model Gemini dengan instruksi JSON terstruktur
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: promptRAG,
      config: {
        // Memaksa Gemini mengembalikan format JSON murni tanpa markdown penutup ```json
        responseMimeType: "application/json"
      }
    });

    const textResult = response.text || "{}";
    
    // Pembersihan ekstra untuk memastikan kevalidan data JSON
    const jsonMatch = textResult.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Format respons dari AI tidak valid");
    }
    const parsedResult = JSON.parse(jsonMatch[0]);

    // 4. TAHAP GAMIFIKASI & SAVE TO MYSQL
    const xpDiperoleh = Math.round((parsedResult.skor_AREL || 0) * 0.5);

    const logArgumen = await prisma.argumens.create({
      data: {
        id_user: id_user, // Sudah aman bertipe number atau null
        teks_argumen: teks_argumen,
        skor_AREL: parsedResult.skor_AREL || 0,
        feedback_ai: parsedResult.feedback_ai || "Evaluasi selesai.",
        xp_diperoleh: xpDiperoleh
      }
    });

    // Melakukan update akumulasi XP jika mahasiswa melakukan login asli
    if (id_user) {
      try {
        await prisma.users.update({
          where: { id_user: id_user },
          data: { total_xp: { increment: xpDiperoleh } }
        });
      } catch (userErr) {
        console.error("Gagal update XP user:", userErr);
      }
    }

    return NextResponse.json({
      message: 'Evaluasi AI Berbasis RAG Sukses Berjalan',
      data: logArgumen
    }, { status: 200 });

  } catch (error: any) {
    console.error("EROR ASLI BACKEND EVALUATE:", error.message || error);
    return NextResponse.json({ error: 'Terjadi kesalahan sistem internal' }, { status: 500 });
  }
}