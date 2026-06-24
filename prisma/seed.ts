import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Memulai proses seeding database materi lengkap...');

  // Bersihkan data lama agar tidak duplikat
  await prisma.quizzes.deleteMany({});
  await prisma.moduls.deleteMany({});

  // 1. INPUT DATA LENGKAP MODUL 1 (BAB I PDF)
  await prisma.moduls.create({
    data: {
      id_modul: 1,
      judul: 'BAB I — Pengenalan Debat dan Dasar-Dasar Berpikir Kritis',
      format_debat: 'AP',
      status_lock: false,
      urutan: 1,
      konten_materi: `A. Apa Itu Debat?
Debat adalah kegiatan adu argumentasi antara dua pihak atau lebih mengenai suatu isu tertentu. Dalam debat, setiap pihak berusaha mempertahankan pendapatnya dengan alasan yang logis dan bukti yang relevan. Berbeda dengan pertengkaran, debat memiliki aturan, tujuan, dan etika yang jelas. Tujuan utamanya bukan menjatuhkan lawan, melainkan menguji kekuatan argumen untuk menemukan pemahaman yang lebih baik terhadap suatu persoalan. Debat melatih seseorang untuk berpikir kritis, berbicara terstruktur, dan menghargai perbedaan pendapat.

Unsur-Unsur Debat:
1. Mosi/isu topik yang diperdebatkan.
2. Tim afirmatif (pro) → pihak yang mendukung mosi.
3. Tim oposisi (kontra) → pihak yang menolak mosi.
4. Juri penilai jalannya debat dan kualitas argumen.
5. Audiens pendengar atau penonton debat.

Contoh Mosi Debat:
"Dewan ini mendukung pembatasan penggunaan media sosial bagi pelajar."
Pada mosi tersebut: Tim pro mendukung adanya pembatasan, sedangkan tim kontra menolak pembatasan tersebut.

B. Debat, Diskusi, dan Pidato: Apa Bedanya?
1. Debat:
   - Tujuan: Meyakinkan lawan/juri
   - Pihak yang terlibat: Minimal dua pihak berbeda pendapat
   - Sifat pendapat: Bertentangan
   - Aturan berbicara: Ketat dan bergiliran
   - Fokus utama: Kekuatan argumen
2. Diskusi:
   - Tujuan: Mencari solusi bersama
   - Pihak yang terlibat: Beberapa peserta
   - Sifat pendapat: Bisa sejalan atau berbeda
   - Aturan berbicara: Lebih fleksibel
   - Fokus utama: Pertukaran ide
3. Pidato:
   - Tujuan: Menyampaikan gagasan
   - Pihak yang terlibat: Satu pembicara
   - Sifat pendapat: Satu arah
   - Aturan berbicara: Tergantung acara
   - Fokus utama: Retorika dan penyampaian

Dengan memahami perbedaan ini, pelajar dapat mengetahui bahwa debat bukan sekadar "berbicara di depan umum", tetapi keterampilan berpikir dan berargumentasi secara sistematis.

C. Jenis-Jenis Debat
Secara umum dibagi menjadi dua kelompok besar: debat nyata dan debat pendidikan.
1. Debat Nyata (Real Debate):
   Debat jenis ini terjadi dalam kehidupan nyata dan para peserta benar-benar meyakini posisi yang mereka bela.
   a. Debat Politik: Dilakukan oleh politisi atau calon pemimpin untuk meyakinkan masyarakat terhadap program dan pandangannya. Contoh: debat calon presiden dalam pemilu.
   b. Debat Hukum/Peradilan: Terjadi di pengadilan antara jaksa dan pengacara untuk membuktikan benar atau salahnya suatu perkara.
   c. Debat Parlementer: Dilakukan di lembaga legislatif untuk membahas undang-undang atau kebijakan negara.
   d. Debat Akademik: Dilakukan oleh akademisi atau peneliti untuk membahas persoalan ilmiah berdasarkan data dan teori.
2. Debat Pendidikan (Educational Debate):
   Debat ini digunakan sebagai sarana pembelajaran dan pengembangan keterampilan berpikir kritis.
   a. Debat Kelas: Dilakukan dalam proses pembelajaran di sekolah atau kampus untuk melatih pemahaman materi dan kemampuan berbicara.
   b. Debat Kompetitif: Debat dengan aturan dan format tertentu yang diperlombakan antar siswa atau mahasiswa. Jenis inilah yang paling populer di dunia pendidikan modern.
   c. Debat Eksibisi (Show Debate): Debat yang bertujuan memberi edukasi atau hiburan kepada publik, biasanya dilakukan dalam seminar, webinar, atau acara kampus.

D. Tujuan dan Manfaat Debat bagi Pelajar
Debat bukan hanya untuk lomba. Keterampilan debat sangat bermanfaat dalam kehidupan akademik maupun sosial:
1. Melatih Berpikir Kritis: Pelajar belajar menganalisis informasi, membedakan fakta dan opini, serta menilai kekuatan suatu argumen.
2. Meningkatkan Kemampuan Berbicara: Debat melatih keberanian berbicara di depan umum dengan bahasa yang runtut dan meyakinkan.
3. Memperkaya Pengetahuan: Dalam debat, peserta harus mencari data dan memahami berbagai isu seperti pendidikan, ekonomi, teknologi, dan sosial.
4. Melatih Kerja Sama Tim: Debat kompetitif dilakukan secara tim, sehingga peserta belajar menyusun strategi dan bekerja sama dengan anggota lain.
5. Menumbuhkan Sikap Menghargai Perbedaan: Debat mengajarkan bahwa perbedaan pendapat adalah hal wajar dan harus disikapi dengan hormat.

E. Debat Kompetitif: Dasar yang Perlu Dipahami
Debat kompetitif, yaitu debat yang memiliki aturan, waktu, dan sistem penilaian tertentu.
Ciri-Ciri Debat Kompetitif:
1. Ada mosi yang jelas.
2. Peserta dibagi menjadi tim pro dan kontra.
3. Setiap pembicara memiliki durasi tertentu.
4. Argumen dinilai berdasarkan logika, bukti, dan cara penyampaian.
5. Ada juri yang menentukan pemenang.

Alur Sederhana Debat Kompetitif:
1. Pengumuman mosi.
2. Persiapan tim.
3. Penyampaian pidato pembicara pertama.
4. Sanggahan dan pengembangan argumen oleh pembicara berikutnya.
5. Pidato penutup.
6. Penilaian juri dan pengumuman hasil.

F. Etika Dasar dalam Debat
Agar debat berjalan sehat dan bermanfaat, setiap peserta harus memegang etika berikut:
1. Menghormati lawan debat: Fokuslah pada argumen, bukan menyerang pribadi lawan.
2. Berbicara secara sopan: Gunakan bahasa yang santun dan profesional meskipun tidak setuju.
3. Tidak memotong pembicaraan: Berikan kesempatan lawan menyampaikan argumennya sesuai aturan waktu.
4. Menggunakan data yang dapat dipertanggungjawabkan: Hindari menyebarkan informasi palsu atau tidak jelas sumbernya.
5. Menerima hasil dengan sportif: Menang atau kalah adalah bagian dari proses belajar.

Ingat: Debat yang baik bukan tentang siapa yang paling keras suaranya, tetapi siapa yang paling kuat argumennya.`,
    },
  });

  // 2. INPUT DATA LENGKAP MODUL 2 (BAB II PDF)
  await prisma.moduls.create({
    data: {
      id_modul: 2,
      judul: 'BAB II — Membangun Posisi dan Analisis Mosi',
      format_debat: 'AP',
      status_lock: false, // Dibuka untuk kebutuhan peninjauan navigasi
      urutan: 2,
      konten_materi: `A. Mengenal Mosi Debat
Apa Itu Mosi?
Mosi adalah pernyataan atau isu yang menjadi pokok perdebatan dalam suatu debat. Semua argumen yang disampaikan oleh tim afirmatif maupun oposisi harus berkaitan dengan mosi yang sedang diperdebatkan. Sederhananya, mosi adalah pertanyaan besar yang harus dijawab oleh kedua tim melalui argumentasi mereka.

Contoh Mosi:
"Dewan ini akan melarang penggunaan telepon genggam di sekolah."
Pada mosi tersebut:
- Tim afirmatif harus membuktikan bahwa larangan tersebut perlu diterapkan.
- Tim oposisi harus membuktikan bahwa larangan tersebut tidak perlu diterapkan atau justru menimbulkan masalah baru.

Mengapa Mosi Penting?
Mosi berfungsi sebagai:
1. Penentu Arah Debat: Mosi menentukan ruang lingkup pembahasan yang boleh dan tidak boleh dibahas.
2. Dasar Penyusunan Argumen: Seluruh argumen harus relevan dengan mosi.
3. Penentu Kemenangan: Tim yang paling berhasil membuktikan posisinya terhadap mosi akan memenangkan debat.

B. Jenis-Jenis Mosi Debat
Secara umum dapat dikategorikan menjadi tiga jenis utama:
1. Mosi Kebijakan (Policy Motion):
   Mosi kebijakan membahas suatu tindakan, aturan, atau kebijakan yang akan diterapkan. Biasanya ditandai dengan kata: Akan, Harus, Mewajibkan, Melarang, Memberikan, Menghapus.
   - Contoh: "Dewan ini akan menghapus hukuman mati.", "Dewan ini akan memberikan pendidikan gratis hingga perguruan tinggi."
   - Fokus Debat: Perdebatan biasanya berpusat pada bagaimana kebijakan diterapkan, apakah efektif, apa manfaatnya, dan apa dampak negatifnya.
2. Mosi Prinsip (Principle Motion):
   Mosi prinsip membahas nilai, moralitas, hak, atau prinsip tertentu. Biasanya menggunakan kata: Meyakini, Berpendapat, Percaya bahwa.
   - Contoh: "Dewan ini meyakini bahwa kebebasan berbicara harus bersifat mutlak.", "Dewan ini meyakini bahwa pemerintah tidak boleh mencabut kewarganegaraan seseorang."
   - Fokus Debat: Perdebatan tidak berfokus pada cara penerapan, melainkan pada aspek benar atau salah, adil atau tidak adil, bermoral atau tidak bermoral.
3. Mosi Penilaian (Value Motion):
   Mosi penilaian membandingkan atau mengevaluasi suatu keadaan. Biasanya menggunakan kata: Lebih baik, Lebih penting, Lebih memilih, Menyesali, Mendukung.
   - Contoh: "Dewan ini lebih memilih keamanan dibandingkan kebebasan.", "Dewan ini menyesali ketergantungan generasi muda terhadap media sosial."
   - Fokus Debat: Perdebatan berpusat pada perbandingan manfaat, perbandingan kerugian, dan prioritas nilai.

C. Membedah Kata Kunci dalam Mosi
Salah satu keterampilan terpenting dalam debat adalah memahami kata kunci yang terdapat pada awal mosi. Kesalahan memahami kata kunci sering menyebabkan tim membangun argumen yang tidak relevan.
1. "Akan" (This House Would)
   - Contoh: Dewan ini akan melarang iklan rokok.
   - Makna: Tim afirmatif harus menjelaskan siapa yang melarang, bagaimana pelarangannya, dan bagaimana pelaksanaannya. Karena itu, mosi ini termasuk mosi kebijakan.
2. "Meyakini" (This House Believes)
   - Contoh: Dewan ini meyakini bahwa pendidikan adalah hak dasar manusia.
   - Makna: Perdebatan fokus pada prinsip dan nilai. Tim tidak perlu menjelaskan mekanisme kebijakan.
3. "Menyesali" (This House Regrets)
   - Contoh: Dewan ini menyesali budaya kerja berlebihan (hustle culture).
   - Makna: Tim afirmatif harus menunjukkan mengapa fenomena tersebut buruk. Tim oposisi harus menunjukkan manfaat atau alasan mengapa fenomena tersebut tidak pantas disesali.
4. "Lebih Memilih" (This House Prefers)
   - Contoh: Dewan ini lebih memilih pendidikan vokasi dibanding pendidikan akademik.
   - Makna: Perdebatan berfokus pada perbandingan dua pilihan.

D. Burden of Proof (Beban Pembuktian)
Burden of Proof adalah tanggung jawab yang harus dipenuhi oleh masing-masing tim untuk memenangkan debat. Dengan kata lain: Apa yang harus dibuktikan oleh suatu tim?
- Beban Tim Afirmatif: Tim afirmatif harus membuktikan bahwa ada masalah yang perlu diselesaikan, posisi atau kebijakan mereka layak diterapkan, dan manfaat lebih besar daripada kerugian.
- Beban Tim Oposisi: Tim oposisi harus membuktikan bahwa klaim afirmatif tidak benar, kebijakan afirmatif tidak efektif, dampak negatif lebih besar daripada manfaat, atau status quo lebih baik atau lebih aman.

Kesalahan Umum:
- Kesalahan 1: Membahas isu yang tidak berkaitan dengan mosi.
- Kesalahan 2: Menganggap lawan harus membuktikan semua hal.
- Kesalahan 3: Tidak menjelaskan mengapa argumen tersebut penting.

E. Analisis Pemangku Kepentingan (Stakeholder Analysis)
Stakeholder adalah pihak yang akan terdampak oleh suatu kebijakan atau perubahan yang dibahas dalam mosi. Sebelum membuat argumen, seorang debater harus bertanya: "Siapa yang terkena dampak?"
- Contoh Mosi: "Dewan ini akan melarang media sosial bagi anak di bawah usia 16 tahun."
- Stakeholder Langsung: Anak-anak, Orang tua, Sekolah.
- Stakeholder Tidak Langsung: Perusahaan media sosial, Pengiklan, Pemerintah.

Mengapa Analisis Stakeholder Penting? Karena sebagian besar argumen debat berasal dari dampak yang dirasakan stakeholder. Semakin banyak pihak yang dianalisis, semakin kaya argumen yang dapat dibangun.

F. Analisis Manfaat dan Kerugian
Setelah mengetahui stakeholder, langkah berikutnya adalah menganalisis dampak. Gunakan pertanyaan berikut:
- Jika mosi diterapkan: Siapa yang diuntungkan? Mengapa mereka diuntungkan? Seberapa besar manfaatnya?
- Jika mosi diterapkan: Siapa yang dirugikan? Mengapa mereka dirugikan? Seberapa besar kerugiannya?

Contoh Sederhana Mosi: "Dewan ini akan menerapkan sekolah empat hari dalam seminggu."
- Manfaat: Siswa memiliki waktu istirahat lebih banyak, guru memiliki waktu persiapan lebih baik, kesehatan mental meningkat.
- Kerugian: Materi pelajaran bisa tertinggal, orang tua kesulitan mengawasi anak di rumah, penyesuaian sistem belajar membutuhkan biaya.

G. Menyusun Kerangka Kasus (Case Building)
Case Building adalah proses menyusun posisi tim sebelum debat dimulai. Tahapan ini merupakan fondasi utama dalam debat kompetitif.
- Langkah 1: Memahami Mosi (Apa isu utamanya? Apa yang diperdebatkan? Apa kata kuncinya?)
- Langkah 2: Menentukan Posisi Tim
- Langkah 3: Menentukan Stakeholder (Siswa, Guru, Sekolah, Orang tua)
- Langkah 4: Menentukan Argumen Utama (Idealnya memiliki Argumen Dampak Pendidikan, Dampak Sosial, dan Dampak Jangka Panjang)
- Langkah 5: Menentukan Prioritas Argumen (Argumen yang kuat biasanya berdampak luas, berdampak jangka panjang, dan sulit dibantah lawan).

Tips Praktis Analisis Mosi (5 Pertanyaan Emas):
1. Apa jenis mosi ini?
2. Siapa stakeholder-nya?
3. Apa masalah yang ingin diselesaikan?
4. Siapa yang diuntungkan?
5. Siapa yang dirugikan?
Jika lima pertanyaan ini terjawab, biasanya setengah pekerjaan membangun kasus sudah selesai.`,
    },
  });

  // 3. BANK SOAL KUIS (RELASI KE MODUL 1)
  await prisma.quizzes.createMany({
    data: [
      {
        id_modul: 1,
        pertanyaan: 'Di dalam metode AREL, bagian yang berisi pernyataan atau argumen utama yang ingin disampaikan disebut...',
        kunci_jawaban: 'Menguji dan mempertahankan argumen secara logis',
        bobot_xp: 30,
      },
      {
        id_modul: 1,
        pertanyaan: 'Debat yang dilakukan di pengadilan antara jaksa dan pengacara disebut...',
        kunci_jawaban: 'Debat hukum/peradilan',
        bobot_xp: 30,
      },
      {
        id_modul: 1,
        pertanyaan: 'Dalam debat kompetitif, pihak yang mendukung mosi disebut...',
        kunci_jawaban: 'Afirmatif',
        bobot_xp: 30,
      },
    ],
  });

  console.log('✅ Database berhasil dimigrasikan dengan konten materi utuh!');
}

main()
  .catch((e) => {
    console.error('❌ Terjadi kesalahan saat seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });