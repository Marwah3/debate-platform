import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import Groq from 'groq-sdk';
import { execSync } from 'child_process';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
});

export async function POST(request: Request) {
  try {
    const { id_user, teks_argumen, mosi, bahasa } = await request.json();

    if (!teks_argumen) {
      return NextResponse.json({ error: 'Teks argumen tidak boleh kosong' }, { status: 400 });
    }

    // 1. TAHAP RETRIEVAL (RAG dari Chroma DB)
    let konteksMateriDebat = "";
    try {
      const perintahPython = `python query_vector.py "${teks_argumen.replace(/"/g, '\\"')}"`;
      const hasilBuffer = execSync(perintahPython, { encoding: 'utf-8', timeout: 5000 });
      konteksMateriDebat = hasilBuffer.trim();
    } catch (err) {
      console.warn("⚠️ Gagal mengambil data RAG dari Chroma DB, menggunakan fallback:", err);
      konteksMateriDebat = "Model argumentasi AREL terdiri dari Assertion (Pernyataan), Reasoning (Penalaran sebab-akibat), Evidence (Bukti/Studi Kasus), dan Link-back (Kaitan kesimpulan).";
    }

    const targetLang = bahasa === 'ar' ? 'Bahasa Arab' : bahasa === 'en' ? 'Bahasa Inggris' : 'Bahasa Indonesia';

    // 2. PROMPT PENILAIAN BREAKDOWN 4 UNSUR (Maks 25 Poin / Unsur)
    const promptRAG = `
      Kamu adalah seorang Juri Debat Parlementer profesional di Universitas Darussalam Gontor.
      Evaluasi argumen mahasiswa berdasarkan 4 Unsur AREL dengan bobot maksimal 25 poin untuk tiap unsur (Total Maksimal 100 Poin).

      Mosi Debat: "${mosi || '-'}"
      Teks Argumen Mahasiswa: "${teks_argumen}"
      Bahasa Output: ${targetLang}

      Pedoman Skor Sub-Unsur (Maksimal 25 Poin per Unsur):
      1. Assertion (A) - Maks 25 Poin (Minimal Layak = 10)
      2. Reasoning (R) - Maks 25 Poin (Minimal Layak = 15)
      3. Evidence (E) - Maks 25 Poin (Minimal Layak = 15)
      4. Link-back (L) - Maks 25 Poin (Minimal Layak = 10)

      Aturan Evaluasi:
      - Total Skor = assertion_score + reasoning_score + evidence_score + linkback_score.
      - Jika Total Skor >= 70, argumen dianggap "LAYAK". Jika < 70, dianggap "TIDAK LAYAK".

      Output WAJIB berupa JSON MURNI tanpa markdown dengan format berikut:
      {
        "assertion_score": (angka 0-25),
        "reasoning_score": (angka 0-25),
        "evidence_score": (angka 0-25),
        "linkback_score": (angka 0-25),
        "skor_AREL": (total penjumlahan 4 skor di atas, angka 0-100),
        "is_layak": (boolean true jika skor_AREL >= 70, false jika < 70),
        "feedback_ai": "1. **Assertion (A) - Pernyataan:** [Penjelasan penilaian]\\n* **Rekomendasi:** [Rekomendasi perbaikan]\\n\\n2. **Reasoning (R) - Penalaran:** [Penjelasan penilaian]\\n* **Rekomendasi:** [Rekomendasi perbaikan]\\n\\n3. **Evidence (E) - Bukti/Elaborasi:** [Penjelasan penilaian]\\n* **Rekomendasi:** [Rekomendasi perbaikan]\\n\\n4. **Link-back (L) - Keterkaitan:** [Penjelasan penilaian]\\n* **Rekomendasi:** [Rekomendasi perbaikan]\\n\\nSaran Umum: [Ulasan umum evaluasi]"
      }
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'Kamu adalah sistem penilai debat yang memberikan output JSON terstruktur murni.' },
        { role: 'user', content: promptRAG },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const textResult = chatCompletion.choices[0]?.message?.content || "{}";
    const cleanJsonString = textResult.replace(/```json/g, '').replace(/```/g, '').trim();
    
    let parsedResult: any = {};
    try {
      parsedResult = JSON.parse(cleanJsonString);
    } catch (parseErr) {
      console.error("⚠️ Gagal parse JSON dari Groq response:", textResult);
      parsedResult = {
        assertion_score: 15,
        reasoning_score: 15,
        evidence_score: 15,
        linkback_score: 10,
        skor_AREL: 55,
        is_layak: false,
        feedback_ai: textResult || "Format respon dari AI tidak sesuai."
      };
    }

    const xpDiperoleh = Math.round((parsedResult.skor_AREL || 0) * 0.5);

    // Save ke MySQL Database
    const logArgumen = await prisma.argumens.create({
      data: {
        id_user: id_user ? Number(id_user) : null,
        teks_argumen: teks_argumen,
        skor_AREL: parsedResult.skor_AREL || 0,
        feedback_ai: JSON.stringify(parsedResult), // Simpan objek JSON utuh ke feedback_ai
        xp_diperoleh: xpDiperoleh
      }
    });

    if (id_user) {
      await prisma.users.update({
        where: { id_user: Number(id_user) },
        data: { total_xp: { increment: xpDiperoleh } }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Evaluasi argumen berbasis AI RAG sukses diproses!',
      data: {
        ...logArgumen,
        eval_data: parsedResult
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error("❌ ERROR API EVALUATOR AI:", error);
    return NextResponse.json({ 
      error: 'Terjadi kesalahan sistem internal backend: ' + (error.message || 'Unknown Error') 
    }, { status: 500 });
  }
}