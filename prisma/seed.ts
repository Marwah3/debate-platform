import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Memulai proses seeding materi terstruktur dengan token eksplisit...');

  // Bersihkan data lama untuk menghindari bentrok ID unik
  await prisma.quizzes.deleteMany({});
  await prisma.moduls.deleteMany({});

  // =========================================================================
  // MODUL 1 (BAB I LENGKAP)
  // =========================================================================
  await prisma.moduls.create({
    data: {
      id_modul: 1,
      judul: 'BAB 1: Pengantar Debat dan Dasar-Dasar Berpikir Kritis',
      status_lock: false,
      urutan: 1,
      konten_materi: `Dalam budaya diskusi saat ini, kita sering melihat perdebatan yang berubah menjadi ajang saling serang dan adu emosi, di mana substansi menghilang dan yang tersisa hanyalah ego. Bab ini akan meluruskan kembali esensi debat yang sebenarnya, memperkenalkan format kompetisi global, serta menanamkan etika dasar yang wajib dimiliki oleh seorang pemikir kritis.
---SUBBAB---
1. Apa Itu Debat?
Esensi Debat: Dalam tradisi intelektual, debat bukanlah tentang siapa yang menang atau kalah, melainkan sebuah alat untuk menguji gagasan, memperkaya perspektif, dan mendekati kebenaran. Secara formal, debat adalah kegiatan adu argumentasi antara dua pihak atau lebih mengenai suatu isu tertentu, di mana setiap pihak berusaha mempertahankan pendapatnya dengan alasan yang logis dan bukti yang relevan.
Debat sangat berbeda dengan dua bentuk komunikasi lainnya:
- Diskusi: Bertujuan untuk mencari solusi bersama atau titik temu, di mana pesertanya bisa sejalan.
- Pidato: Merupakan komunikasi satu arah untuk menyampaikan gagasan tanpa adanya pertentangan langsung.
- Debat: Berfokus pada kekuatan argumen untuk meyakinkan juri/audiens di mana pendapat antarpihak saling bertentangan secara diametral.

Unsur-Unsur Pembentuk Debat: Sebuah perdebatan yang terstruktur umumnya terdiri atas lima unsur utama:
- Mosi/Isu: Topik atau pernyataan yang sedang diperdebatkan.
- Tim Afirmatif (Pro/Pemerintah): Pihak yang setuju dan mendukung mosi.
- Tim Oposisi (Kontra): Pihak yang menolak dan melawan mosi.
- Juri: Pihak netral (berperan sebagai pemilih awam yang cerdas) yang menilai jalannya debat dan kualitas argumen untuk menentukan pemenang.
- Audiens: Pendengar atau penonton yang menyaksikan perdebatan.
---SUBBAB---
2. Jenis-Jenis Debat di Dunia Nyata dan Pendidikan
Secara umum, kegiatan debat dibagi menjadi dua kelompok besar berdasarkan tujuan dan tempat pelaksanaannya:
- Debat Nyata (Real Debate): Ini adalah debat yang terjadi di kehidupan nyata, di mana para peserta benar-benar meyakini posisi yang mereka bela dan dampaknya langsung memengaruhi masyarakat.
  * Debat Politik: Dilakukan oleh politisi (seperti debat calon presiden) untuk meyakinkan masyarakat terhadap program mereka.
  * Debat Hukum/Peradilan: Terjadi di pengadilan antara jaksa dan pengacara untuk membuktikan benar atau salahnya suatu perkara.
  * Debat Parlementer: Dilakukan di lembaga legislatif/parlemen untuk membahas dan mengesahkan undang-undang.
  * Debat Akademik: Dilakukan oleh ilmuwan atau peneliti untuk membedah persoalan ilmiah berdasarkan data.
- Debat Pendidikan (Educational Debate): Debat ini digunakan sebagai sarana e-learning dan pengembangan keterampilan berpikir kritis pelajar/mahasiswa.
  * Debat Kelas: Dilakukan dalam proses pembelajaran di sekolah atau kampus untuk melatih pemahaman materi.
  * Debat Kompetitif: Debat dengan aturan, batasan waktu, and sistem penilaian tertentu yang diperlombakan antar-institusi pendidikan.
  * Debat Eksibisi: Debat yang bertujuan memberi edukasi atau hiburan kepada publik.
---SUBBAB---
3. Mengenal Format Debat Kompetitif Global
Dalam debat kompetitif tingkat sekolah dan universitas, terdapat tiga sistem (format) yang paling mendominasi secara global dan di Indonesia:
- Asian Parliamentary (Parlementer Asia / AP): Mempertemukan 2 tim (Pemerintah dan Oposisi) di mana masing-masing tim beranggotakan 3 orang pembicara. Karakteristik utamanya adalah terdapat pidato simpulan (Reply Speech) di akhir perdebatan yang dibawakan oleh pembicara pertama atau kedua dari masing-masing tim untuk merangkum mengapa tim mereka lebih unggul.
- British Parliamentary (Parlementer Inggris / BP): Sistem ini sangat dinamis karena melibatkan 4 tim independen sekaligus dalam satu ronde (2 tim di kubu Pemerintah dan 2 tim di kubu Oposisi). Setiap tim hanya beranggotakan 2 pembicara. Meskipun dua tim berada di kubu yang sama (misal: Opening Government dan Closing Government), mereka tidak boleh saling bekerja sama dan tetap bersaing satu sama lain. Sistem ini tidak memiliki reply speech.
- World Schools Style Debate (WSD): Format resmi yang digunakan dalam kompetisi debat tingkat sekolah menengah internasional (World Schools Debating Championships). Format ini merupakan gabungan dari unsur Asian Parliamentary dan Australasian Debate, yang melibatkan 3 pembicara per tim dengan fokus pada gaya penyampaian dan argumentasi yang mudah dipahami.
---SUBBAB---
4. Etika Dasar dalam Berdebat
Banyak orang mengira bahwa selama argumennya logis, maka ia pasti akan memenangkan debat. Kenyataannya, cara menyampaikan argumen (etika) sama pentingnya dengan isi argumen itu sendiri. Dalam teori retorika klasik, karakter dan etika pembicara (ethos) sangat memengaruhi tingkat kepercayaan audiens dan juri. Berikut adalah etika dasar yang wajib dijunjung tinggi oleh seorang debater:
- Dilarang Menyerang Fisik/Karakter Pribadi (Ad Hominem): Kesalahan fatal dalam debat adalah menyerang pribadi, fisik, atau menggunakan nada merendahkan kepada lawan bicara. Fokuslah untuk membantah ide dan gagasannya, bukan orangnya.
- Dilarang Menyinggung SARA: Mengutarakan argumen yang menyinggung Suku, Agama, Ras, dan Antargolongan (SARA) dilarang mutlak karena dapat memicu pertikaian dan membuat argumen menjadi sangat tidak etis.
- Bicara Berdasarkan Data, Bukan Asumsi: Debat tidak boleh dibangun di atas informasi palsu (hoax) atau sekadar perasaan. Gagasan yang disajikan harus akurat, dapat dipertanggungjawabkan, dan didukung oleh data serta fakta.
- Menghargai dan Mendengarkan Lawan: Berdebat dengan baik berarti Anda harus bersedia menjadi pendengar yang baik. Jangan memotong pembicaraan lawan secara paksa; berikan mereka kesempatan menyampaikan argumen sesuai aturan waktu yang berlaku.
- Menerima Hasil Secara Sportif: Mengakui bahwa menang atau kalah adalah bagian dari proses belajar, dan perbedaan pendapat harus selalu disikapi dengan hormat.`,
    },
  });

  // =========================================================================
  // MODUL 2 (BAB II LENGKAP)
  // =========================================================================
  await prisma.moduls.create({
    data: {
      id_modul: 2,
      judul: 'BAB 2: Analisis Mosi dan Strategi Konstruksi Kasus (Case Building)',
      status_lock: true,
      urutan: 2,
      konten_materi: `Perdebatan yang hebat tidak lahir dari kemampuan merangkai kata secara spontan di atas podium, melainkan dari fondasi kerangka berpikir yang matang. Sebelum debat dimulai, setiap tim diberikan waktu (biasanya 15-30 menit) untuk menyusun strategi yang disebut Case Building (Penyusunan Kasus). Di tahap inilah tim harus membedah mosi, menentukan batasan, dan merumuskan argumen.
---SUBBAB---
1. Membedah Mosi dan Kata Kunci
Langkah pertama sebelum berargumen adalah menentukan apa yang sebenarnya sedang diperdebatkan. Mosi atau topik debat berfungsi sebagai penentu arah dan ruang lingkup perdebatan. Secara akademis, mosi terbagi menjadi tiga jenis utama:
- Mosi Kebijakan (Policy Motion): Mosi ini membahas penerapan suatu tindakan, aturan, atau kebijakan baru. Kata kuncinya biasanya adalah "Dewan ini akan..." atau "Dewan ini mewajibkan...". Tim wajib merumuskan mekanisme atau bagaimana kebijakan tersebut akan dijalankan.
  * Contoh Mosi: "Dewan ini akan menghukum orang tua atas kejahatan anak mereka yang masih di bawah umur."
  * Aplikasi: Tim Pro harus memberikan definisi batasan usia "anak di bawah umur" dan "jenis kejahatan berat", lalu merumuskan mekanisme bagaimana hukuman tersebut diterapkan di pengadilan bersamaan dengan program rehabilitasi untuk sang anak.
- Mosi Prinsip/Nilai (Principle Motion): Fokus perdebatan bukan pada teknis penerapan kebijakan, melainkan pada apakah suatu nilai atau prinsip dapat dibenarkan secara moral dan keadilan. Kata kuncinya adalah "Dewan ini meyakini..." atau "Dewan ini percaya bahwa...".
  * Contoh Mosi: "Dewan ini meyakini bahwa hak kebebasan berekspresi tidak mencakup hak untuk menghina agama."
  * Aplikasi: Tidak perlu ada mekanisme hukuman. Perdebatan murni membahas batasan moral dari kebebasan berekspresi.
- Mosi Penilaian/Evaluasi (Value/Assessment Motion): Mosi ini membandingkan atau mengevaluasi dampak dari dua hal atau fenomena yang sudah ada di status quo. Kata kuncinya adalah "Dewan ini lebih memilih...", "Dewan ini mendukung/menolak...", atau "Dewan ini menyesali...".
  * Contoh Mosi: "Dewan ini menyesali tren budaya kerja berlebihan (hustle culture)."
  * Aplikasi: Tim Pro harus membuktikan bahwa tren tersebut membawa dampak buruk yang dominan, sementara Tim Kontra membuktikan bahwa tren tersebut membawa manfaat nyata (misal: kemajuan ekonomi) yang pantas untuk dipertahankan.
---SUBBAB---
2. Beban Pembuktian (Burden of Proof)
Setelah memahami jenis mosi, tim harus mengetahui apa "syarat sah" kemenangan mereka. Ini disebut sebagai Beban Pembuktian. Jika beban ini gagal dipenuhi, argumen sebagus apa pun tidak akan memenangkan debat.
- Beban Tim Pro (Pemerintah/Afirmatif): Tim Pro harus membuktikan tiga hal utama:
  1. Justifikasi Masalah: Ada masalah nyata di status quo yang mendesak untuk diselesaikan.
  2. Efektivitas: Solusi atau posisi yang mereka ajukan terbukti mampu menyelesaikan masalah tersebut secara efektif.
  3. Justifikasi Moral/Dampak: Manfaat yang dihasilkan jauh lebih besar daripada kerugiannya.
- Beban Tim Kontra (Oposisi): Tim Kontra tidak selalu harus membawa solusi baru, namun wajib membuktikan setidaknya satu dari hal berikut:
  1. Solusi Gagal: Kebijakan Tim Pro tidak akan mampu menyelesaikan masalah yang ada.
  2. Dampak Buruk: Kebijakan Tim Pro justru akan memicu masalah baru atau membuat keadaan saat ini menjadi jauh lebih buruk (worse off).
  3. Prinsip yang Salah: Kebijakan tersebut melanggar hak asasi atau keadilan secara fundamental.
---SUBBAB---
3. Analisis Pemangku Kepentingan (Stakeholder Analysis)
Agar argumen tidak mengawang-awang, setiap tim harus memetakan pihak-pihak yang terlibat atau terdampak oleh mosi tersebut. Ini disebut Stakeholder Analysis. Jika dilakukan dengan benar, pemetaan ini akan menghasilkan argumen yang sangat kaya dan spesifik. Ada 4 kategori aktor yang wajib diidentifikasi:
- Penerima Manfaat Langsung: Siapa pihak yang paling diuntungkan dari kebijakan ini?
- Korban/Pihak Dirugikan Langsung: Siapa pihak yang paling menderita akibat kebijakan ini?
- Terdampak Sampingan (Sekunder): Pihak di luar fokus utama yang ikut terkena dampak (bisa positif atau negatif).
- Pihak Pelaksana: Siapa lembaga atau otoritas yang harus mengeksekusi kebijakan ini?
Contoh Mosi: "Dewan ini akan memajak klub olahraga besar untuk mendanai klub kecil."
- Penerima Manfaat: Klub olahraga kecil (pemain, staf pelatih, fasilitas).
- Pihak Dirugikan: Pemilik atau investor klub besar.
- Terdampak Sekunder: Pemain di klub besar dan penggemar sepak bola secara umum.
---SUBBAB---
4. Analisis Manfaat dan Kerugian (Cost-Benefit)
Dalam setiap kebijakan atau fenomena, tidak ada yang 100% sempurna. Selalu ada pihak yang untung dan pihak yang rugi. Debat tingkat tinggi ditentukan oleh siapa yang berhasil menimbang (weighing) mengapa kerugian yang muncul masih bisa ditoleransi demi tercapainya manfaat yang jauh lebih besar. Berikut adalah hierarki prioritas dalam menimbang dampak (Cost-Benefit):
- Dampak Umum Lebih Utama dari Dampak Khusus: Mengutamakan keselamatan dan kepentingan masyarakat luas lebih diprioritaskan daripada kerugian yang hanya menimpa segelintir kelompok atau individu.
- Melindungi Pihak Rentan Lebih Utama dari Pihak Kuat: Apabila terjadi benturan kepentingan, negara memiliki moral untuk melindungi pihak minoritas/lemah dibandingkan pihak yang sudah dominan.
- Dampak Langsung Lebih Utama dari Dampak Sampingan: Fokuslah untuk menyelesaikan penderitaan korban secara langsung daripada sekadar mengejar keuntungan tambahan.
- Hak Dasar Kehidupan adalah Prioritas Mutlak: Menyelamatkan nyawa atau mempertahankan hak dasar esensial manusia selalu lebih tinggi bobotnya daripada sekadar kerugian finansial atau kenyamanan.
Contoh Mosi: "Di masa krisis, Dewan ini lebih memilih memberikan bantuan keuangan langsung kepada individu daripada kepada perusahaan."
- Timbangan Tim Pro: Menggunakan prinsip Hak Dasar. Memprioritaskan individu karena bantuan ini menjadi jaring pengaman agar mereka bisa makan dan bertahan hidup hari itu juga. Nyawa lebih penting daripada kerugian bisnis.
- Timbangan Tim Kontra: Menggunakan prinsip Dampak Umum. Memprioritaskan perusahaan karena jika perusahaan diselamatkan, mereka tidak akan memecat karyawannya. Mengamankan perputaran roda ekonomi secara keseluruhan akan menyehindari kemiskinan lebih banyak individu dalam jangka panjang, daripada sekadar bantuan tunai yang akan habis dalam sebulan.`,
    },
  });

  // =========================================================================
  // MODUL 3 (BAB III LENGKAP)
  // =========================================================================
  await prisma.moduls.create({
    data: {
      id_modul: 3,
      judul: 'BAB 3: Anatomi Argumentasi dan Seni Menyanggah (Refutasi)',
      status_lock: true,
      urutan: 3,
      konten_materi: `Jika Case Building di Bab 2 adalah proses membangun benteng pertahanan tim, maka Bab 3 ini mengajarkan cara menyerang dan mempertahankan benteng tersebut di medan pertempuran. Debat bukanlah dua pidato yang disampaikan secara bergantian secara paralel, melainkan pertarungan ide interaktif yang mengharuskan kedua tim saling membongkar logika satu sama lain.
---SUBBAB---
1. Menyusun Argumen yang Kokoh (Metode AREL / 3T)
Opini tanpa dasar tidak memiliki kekuatan persuasif. Argumen bukanlah sekadar menyatakan opini seperti "Saya tidak setuju dengan ujian nasional"; argumen harus mengandung alasan yang dapat diperdebatkan dan diuji kelogisannya. Model paling universal yang digunakan oleh debater di seluruh dunia untuk menyusun argumen adalah AREL, yang dalam panduan debat berbahasa Arab dari Qatar Foundation ekuivalen dengan konsep 3T (Taukid, Ta'leel, Tadleel):
- Assertion / Taukid (Pernyataan Utama): Klaim utama yang ingin dibuktikan. Bagian ini berfungsi sebagai "judul" argumen yang harus jelas dan spesifik.
- Reasoning / Ta'leel (Penalaran): Penjelasan logis mengapa Assertion tersebut benar. Di sinilah Anda menjawab pertanyaan "Bagaimana prosesnya?" dan "Mengapa bisa demikian?". Ini adalah inti dari kekuatan argumen.
- Evidence / Tadleel (Bukti): Data statistik, pendapat ahli, studi kasus, atau contoh rasional di dunia nyata yang memvalidasi penalaran Anda. Bukti berfungsi mendukung logika, bukan menggantikannya.
- Link-back (Kaitan Kesimpulan): Merangkum argumen dan menghubungkannya kembali secara langsung ke mosi, menegaskan mengapa poin ini membuat tim Anda memenangkan perdebatan.

Contoh Kasus & Aplikasi AREL: Mosi: "Dewan ini akan melarang penggunaan telepon genggam di sekolah."
- Assertion (A): Pelarangan telepon genggam akan meningkatkan fokus belajar siswa secara signifikan.
- Reasoning (R): Telepon genggam memberikan banyak distraksi berwujud media sosial dan game. Ketika akses terhadap distraksi ini diputus selama jam belajar, otak siswa tidak akan terpecah fokusnya (multitasking), sehingga perhatian mereka akan terpusat penuh pada materi pelajaran dan interaksi guru di kelas.
- Evidence (E): Berbagai pakar psikologi pendidikan menyatakan bahwa multitasking digital menurunkan kemampuan fokus jangka panjang anak. Sekolah-sekolah yang menerapkan larangan ini telah melaporkan peningkatan partisipasi aktif siswa di dalam kelas.
- Link-back (L): Oleh karena itu, pelarangan ini adalah langkah mutlak dan efektif untuk meningkatkan kualitas pembelajaran, sehingga mosi ini harus didukung.
---SUBBAB---
2. Teknik Sanggahan (Refutasi) 5 Langkah
Tim yang memiliki argumen brilian tetapi gagal menjawab serangan lawan sangat mungkin untuk kalah. Refutasi (Tafneed) adalah proses merespons, membantah, dan menunjukkan kelemahan argumen lawan. Langkah sistematis dalam melakukan refutasi yang kuat:
1. Dengarkan (Listen): Pahami argumen lawan tanpa memanipulasinya.
2. Ulangi (Restate): Ucapkan kembali secara singkat apa yang lawan katakan (Misal: "Mereka berkata bahwa...").
3. Tunjukkan Titik Lemah (Object): Nyatakan ketidaksetujuan Anda secara tegas (Misal: "Namun, argumen tersebut tidak tepat karena...").
4. Berikan Alasan (Reason): Bongkar kecacatan logikanya. Anda dapat menyerang Faktanya (data yang kedaluwarsa), Buktinya (contoh yang tidak mewakili), Logikanya (hubungan sebab-akibat yang terputus), atau Asumsinya (premis dasar yang keliru).
5. Tarik Kesimpulan Baru (Conclude): Balikkan keadaan dan tunjukkan mengapa runtuhnya argumen lawan justru menguatkan sisi Anda.

Contoh Kasus & Aplikasi Refutasi: Mosi: "Dewan ini akan membatasi penggunaan media sosial bagi pelajar."
- Aplikasi 5 Langkah: "Tim Oposisi menyatakan bahwa pembatasan media sosial akan mengurangi kebebasan individu secara opresif. Namun, asumsi tersebut salah. Karena di dalam iklim kebebasan berdemokrasi, kebebasan individu tidak pernah bersifat absolut. Kebebasan dapat dan harus dibatasi oleh negara ketika hal tersebut terbukti menimbulkan dampak destruktif yang masif bagi masyarakat, dalam hal ini ancaman kecemasan dan depresi pada anak di bawah umur. Maka, pembatasan ini bukanlah opresi, melainkan bentuk perlindungan negara yang sangat bisa dibenarkan."
---SUBBAB---
3. Penimbangan Dampak (Weighing) dan Titik Bentur (Clash)
Sering kali, kedua tim membawakan argumen yang sama-sama logis dan benar. Pemerintah benar, Oposisi juga benar. Lalu, bagaimana juri menentukan pemenang? Pemenangnya adalah tim yang berhasil memenangkan Titik Bentur (Clash) melalui Penimbangan Dampak (Weighing).
Weighing adalah keterampilan mengkomparasi dampak, di mana Anda membuktikan kepada juri bahwa "kebenaran/dampak" dari sisi Anda jauh lebih krusial dibandingkan "kebenaran/dampak" dari sisi lawan. Juri menilai metrik weighing ini menggunakan empat instrumen utama:
- Magnitude (Besarnya Dampak): Dampak mana yang kehancuran atau keuntungannya lebih besar? (Kerugian Rp1 Miliar vs Kerugian Rp100 Triliun).
- Scope (Cakupan / Jumlah Terdampak): Siapa dan berapa banyak yang terdampak? (Mempengaruhi 1.000 orang vs Mempengaruhi 10 Juta orang).
- Duration (Durasi / Waktu): Berapa lama dampak itu terasa? (Ketidaknyamanan selama 1 bulan vs Perbaikan sistem pendidikan untuk 20 tahun ke depan).
- Probability (Probabilitas/Kepastian): Seberapa nyata probabilitas hal itu akan terjadi? (Dampak lawan hanya berupa kemungkinan 5%, sedangkan dampak tim kita pasti 90% terjadi).
---SUBBAB---
4. Interupsi (Point of Information / POI) dan Dinamika Debat
Debat yang dinamis dan berwibawa tidak akan lepas dari mekanisme POI. Point of Information (POI) adalah interupsi lisan singkat yang diajukan oleh tim lawan kepada pembicara yang sedang berpidato di mimbar.
Aturan Main dan Etika POI:
- Waktu Terlindungi: POI hanya boleh diajukan di antara menit pertama hingga menit keenam dari sebuah pidato. Menit 0:00-1:00 dan 6:00 - 7:00 adalah waktu steril (protected time) di mana lawan dilarang melakukan interupsi.
- Durasi: Batas waktu penyampaian POI sangat singkat, maksimal hanya 15 detik.
- Penerimaan: Pendebat yang sedang berpidato memiliki hak prerogatif penuh untuk menerima atau menolak POI.
- Penalti Mengabaikan POI: Pendebat sangat dianjurkan untuk menerima setidaknya 1-2 POI. Jika mengabaikan semua tawaran interupsi, juri dapat menganggap debater tersebut takut berinteraksi atau gagal membela kasusnya, berakibat pada penalti pengurangan skor persuasi.
Fungsi dan Strategi POI: POI berupa Pertanyaan konfirmasi, Klarifikasi, atau Sanggahan kilat. Strategi terbaik adalah menyela ketika lawan sedang membangun premis yang Anda tahu pasti salah.
Contoh Kasus POI: Mosi: "Dewan ini akan menyerahkan kewenangan evaluasi guru kepada para siswa."
- (Pembicara Pro): "...Siswa menghabiskan waktu setiap hari dengan guru di kelas, mereka adalah penilai yang paling tahu kompetensi guru tersebut."
- Interupsi (POI) Tim Kontra: "Interupsi! Tolong jelaskan bagaimana Anda menjamin murid di bawah umur mampu memberikan evaluasi akademik yang objektif, alih-alih sekadar memberi nilai buruk kepada guru pendisiplin yang sering menghukum mereka dengan tugas?"`,
    },
  });

  // =========================================================================
  // MODUL 4 (BAB IV LENGKAP)
  // =========================================================================
  await prisma.moduls.create({
    data: {
      id_modul: 4,
      judul: 'BAB 4: Jebakan Logika (Logical Fallacy) dan Parameter Penilaian Juri',
      status_lock: true,
      urutan: 4,
      konten_materi: `Dalam sebuah perdebatan, memiliki gagasan yang cemerlang belumlah cukup jika Anda tidak tahu cara melindunginya dari kecacatan berpikir. Bab terakhir ini akan membekali Anda dengan kemampuan mendeteksi "jebakan logika" lawan, sekaligus mengajak Anda memahami perdebatan dari kacamata seorang juri profesional agar setiap argumen yang Anda sampaikan tepat sasaran.
---SUBBAB---
1. Memahami Kesesatan Pikir (Logical Fallacy)
Kesesatan pikir atau logical fallacy adalah tipe argumen yang sekilas terlihat meyakinkan dan benar, namun sebenarnya mengandung kecacatan atau kesalahan fatal dalam penalarannya. Karakteristik utama dari logical fallacy adalah adanya kesalahan logika yang appliable ke dalam argumen, sehingga memberikan kesan "menipu". Memahami sesat pikir adalah kunci untuk menjatuhkan argumen lawan secara elegan tanpa perlu bersusah payah menciptakan teori baru.
---SUBBAB---
2. Jenis-Jenis Kesesatan Pikir yang Sering Terjadi
Ada banyak jebakan logika yang sering tidak disadari oleh pendebat, baik pemula maupun tingkat lanjut. Berikut adalah beberapa yang paling umum:
- Ad Hominem (Menyerang Pribadi): Terjadi ketika seseorang tidak membalas argumen lawan, melainkan justru menyerang fisik, latar belakang, karakter, atau atribut pribadi lawan bicaranya. Contoh: "Kita tidak perlu mendengarkan argumen mereka karena mereka hanyalah anak kuliahan yang belum punya pengalaman kerja nyata!".
- Slippery Slope (Efek Bola Salju): Menolak sebuah ide dengan berasumsi bahwa satu tindakan kecil otomatis akan memicu rentetan peristiwa bencana yang ekstrem di masa depan, tanpa adanya bukti yang menghubungkan kejadian tersebut.
- Hasty Generalization (Generalisasi Terburu-buru): Mengambil kesimpulan raksasa berdasarkan sampel data, kejadian, atau pengalaman yang sangat terbatas dan tidak representatif.
- Bandwagon / Argumentum Ad Populum: Mengklaim bahwa suatu pernyataan itu benar hanya karena mayoritas orang melakukannya atau memercayainya.
- False Dichotomy (Dikotomi Palsu): Menyederhanakan masalah yang sangat kompleks seolah-olah hanya ada dua pilihan mutlak, padahal masih banyak opsi lain yang tersedia.
- Strawman Fallacy (Membangun Manusia Jerami): Memelintir atau melebih-lebihkan argumen lawan agar terdengar buruk atau ekstrem sehingga lebih mudah diserang.
---SUBBAB---
3. Sudut Pandang Juri: Pemilih Awam yang Cerdas
Setelah Anda memahami cara berargumen secara logis, Anda harus tahu siapa yang Anda yakinkan. Dalam debat parlementer, dewan juri tidak memposisikan dirinya sebagai pakar, melainkan memposisikan diri sebagai Pemilih Awam yang Cerdas (Ordinary Intelligent Voter). Karakteristik utamanya:
- Netral dan Tidak Bias: Juri menyingkirkan segala bentuk bias pribadi, afiliasi politik, atau agama saat masuk ke ruang debat.
- Berwawasan Umum: Juri mengetahui isu-isu global, sejarah, dan tajuk rencana secara umum, namun tidak memiliki wawasan mendetail layaknya seorang profesor.
- Sangat Mahir Berlogika: Juri hanya mempercayai argumen yang dijelaskan secara rasional dan menolak argumen melompat. Jangan berpikir Anda bisa menang hanya dengan menyebut banyak data statistik tanpa menganalisis maknanya.
---SUBBAB---
4. Tiga Elemen Utama Penilaian (Standar Global)
Meskipun sistem British Parliamentary menggunakan penilaian holistik, secara general standar kekuatan seorang debater dibagi ke dalam tiga indikator penilaian universal:
- Matter/Content (Isi/Materi): Menilai kekuatan dari apa yang Anda katakan. Meliputi kualitas argumen pemenuhan struktur AREL, kedalaman analisis dampak, ketajaman sanggahan, serta relevansi bukti empiris.
- Manner/Style (Gaya Penyampaian): Menilai cara Anda menyajikan materi agar efektif dan persuasif dalam mentransfer pesan. Mencakup kontak mata, gerak tubuh, kejelasan artikulasi, serta kemampuan membangun koneksi emosional yang wajar.
- Method/Strategy (Metode dan Strategi): Menilai seberapa baik Anda memahami medan pertempuran debat. Mencakup pemenuhan peran pembicara sesuai urutan, manajemen waktu pidato 7 menit, serta ketepatan menentukan prioritas isu (Weighing).`,
    },
  });

  // =========================================================================
  // BANK SOAL KUIS LENGKAP 32 BUTIR
  // =========================================================================
  await prisma.quizzes.createMany({
    data: [
      // ----------------- BAB 1 -----------------
      {
        id_modul: 1,
        pertanyaan: 'Secara formal, esensi utama dari kegiatan debat dalam tradisi intelektual adalah...|A. Menjatuhkan mental lawan menggunakan taktik intimidasi verbal.|B. Mencari jalan tengah agar kedua pihak yang berbeda pendapat bisa sejalan.|C. Menguji gagasan, memperkaya perspektif, dan mendekati kebenaran melalui argumen logis dan bukti relevan.|D. Menyampaikan gagasan satu arah tanpa adanya pertentangan langsung dari audiens.',
        kunci_jawaban: 'C',
        bobot_xp: 25
      },
      {
        id_modul: 1,
        pertanyaan: 'Komunikasi yang berfokus pada kekuatan argumen untuk meyakinkan juri/audiens di mana pendapat antarpihak saling bertentangan secara diametral disebut...|A. Pidato|B. Debat|C. Diskusi|D. Simposium',
        kunci_jawaban: 'B',
        bobot_xp: 25
      },
      {
        id_modul: 1,
        pertanyaan: 'Manakah di bawah ini yang merupakan unsur pembentuk debat yang berperan sebagai "pemilih awam yang cerdas" untuk menilai jalannya debat?|A. Tim Afirmatif|B. Mosi|C. Juri|D. Audiens',
        kunci_jawaban: 'C',
        bobot_xp: 25
      },
      {
        id_modul: 1,
        pertanyaan: 'Debat yang terjadi di pengadilan antara jaksa dan pengacara untuk membuktikan benar atau salahnya suatu perkara termasuk ke dalam kategori...|A. Debat Kompetitif|B. Debat Kelas|C. Real Debate (Debat Hukum/Peradilan)|D. Debat Eksibisi',
        kunci_jawaban: 'C',
        bobot_xp: 25
      },
      {
        id_modul: 1,
        pertanyaan: 'Karakteristik utama dari format debat Asian Parliamentary (AP) yang membedakannya dengan British Parliamentary (BP) adalah...|A. Melibatkan 4 tim independen sekaligus dalam satu ronde perdebatan.|B. Adanya pidato simpulan (Reply Speech) di akhir perdebatan.|C. Setiap tim hanya beranggotakan 2 orang pembicara saja.|D. Fokus murni pada gaya penyampaian tanpa memedulikan data empiris.',
        kunci_jawaban: 'B',
        bobot_xp: 25
      },
      {
        id_modul: 1,
        pertanyaan: 'Dalam sistem British Parliamentary (BP), meskipun dua tim berada di kubu yang sama (misalnya Opening Government dan Closing Government), aturan yang berlaku adalah...|A. Boleh saling bekerja sama dan berbagi strategi sebelum debat dimulai.|B. Tidak boleh saling bekerja sama dan tetap bersaing satu sama lain.|C. Diwajibkan menyampaikan pidato simpulan bersama di akhir ronde.|D. Salah satu tim boleh memotong pembicara tim pasangannya kapan saja.',
        kunci_jawaban: 'B',
        bobot_xp: 25
      },
      {
        id_modul: 1,
        pertanyaan: 'Format resmi yang digunakan dalam kompetisi debat tingkat sekolah menengah internasional yang menggabungkan unsur Asian Parliamentary dan Australasian Debate adalah...|A. British Parliamentary Style|B. World Schools Style Debate (WSD)|C. American Parliamentary Style|D. Real Politics Style',
        kunci_jawaban: 'B',
        bobot_xp: 25
      },
      {
        id_modul: 1,
        pertanyaan: 'Mengapa aspek Ethos (karakter dan etika pembicara) sangat penting dalam debat menurut teori retorika klasik?|A. Karena juri hanya menilai penampilan fisik dari seorang debater.|B. Karena etika pembicara sangat memengaruhi tingkat kepercayaan audiens and juri.|C. Karena dengan etika yang baik, debater tidak perlu membawa data empiris.|D. Karena etika dapat menggantikan fungsi argumen logis sepenuhnya.',
        kunci_jawaban: 'B',
        bobot_xp: 25
      },

      // ----------------- BAB 2 -----------------
      {
        id_modul: 2,
        pertanyaan: 'Tahap di mana setiap tim diberikan waktu sekitar 15-30 menit sebelum debat dimulai untuk membedah mosi, menentukan batasan, dan merumuskan argumen disebut...|A. Case Building|B. Refutasi|C. Point of Information|D. Clash Matrix',
        kunci_jawaban: 'A',
        bobot_xp: 25
      },
      {
        id_modul: 2,
        pertanyaan: 'Mosi yang membahas penerapan suatu tindakan, aturan, atau kebijakan baru, serta mewajibkan Tim Pro untuk merumuskan mekanisme pelaksanaannya disebut...|A. Mosi Prinsip (Principle Motion)|B. Mosi Evaluasi (Assessment Motion)|C. Mosi Kebijakan (Policy Motion)|D. Mosi Teoretis',
        kunci_jawaban: 'C',
        bobot_xp: 25
      },
      {
        id_modul: 2,
        pertanyaan: 'Jika sebuah mosi berbunyi: "Dewan ini meyakini bahwa hak kebebasan berekspresi tidak mencakup hak untuk menghina agama", maka aplikasi yang tepat bagi tim dalam debat adalah...|A. Menyusun mekanisme hukuman pidana kurungan secara mendetail.|B. Membahas batasan moral dari kebebasan berekspresi tanpa perlu mekanisme hukuman.|C. Membandingkan kerugian finansial dari kedua belah pihak yang terlibat.|D. Menolak mosi karena tidak memiliki kata kunci "Dewan ini akan".',
        kunci_jawaban: 'B',
        bobot_xp: 25
      },
      {
        id_modul: 2,
        pertanyaan: 'Di bawah ini yang bukan merupakan komponen dari "Beban Pembuktian" (Burden of Proof) yang wajib dipenuhi oleh Tim Pro (Afirmatif) adalah...|A. Membuktikan adanya masalah nyata dan mendesak di status quo.|B. Membuktikan efektivitas solusi yang mereka ajukan.|C. Membuktikan bahwa kebijakan mereka justru akan memicu masalah baru yang lebih buruk (worse off).|D. Membuktikan bahwa manfaat yang dihasilkan jauh lebih besar daripada kerugiannya.',
        kunci_jawaban: 'C',
        bobot_xp: 25
      },
      {
        id_modul: 2,
        pertanyaan: 'Dalam melakukan Stakeholder Analysis, pihak luar yang berada di luar fokus utama namun ikut terkena dampak (baik positif maupun negatif) dimasukkan ke dalam kategori...|A. Penerima Manfaat Langsung|B. Terdampak Sampingan (Sekunder)|C. Pihak Pelaksana|D. Korban Langsung',
        kunci_jawaban: 'B',
        bobot_xp: 25
      },
      {
        id_modul: 2,
        pertanyaan: 'Berdasarkan hierarki prioritas analisis Cost-Benefit, jika terjadi benturan antara kepentingan kelompok kecil dengan masyarakat luas, prinsip yang benar adalah...|A. Dampak khusus lebih utama dari dampak umum.|B. Dampak umum lebih utama dari dampak khusus.|C. Mengabaikan kedua dampak dan mencari opsi ketiga.|D. Mengutamakan kelompok yang memiliki kapital finansial terbesar.',
        kunci_jawaban: 'B',
        bobot_xp: 25
      },
      {
        id_modul: 2,
        pertanyaan: 'Ketika mengevaluasi dampak, tim harus membela hak minoritas atau kelompok yang lemah jika terjadi benturan kepentingan. Hal ini didasarkan pada prinsip...|A. Melindungi pihak rentan lebih utama dari pihak kuat.|B. Hak dasar kehidupan bersifat opsional.|C. Efektivitas birokrasi pelaksana.|D. Keuntungan finansial jangka pendek.',
        kunci_jawaban: 'A',
        bobot_xp: 25
      },
      {
        id_modul: 2,
        pertanyaan: 'Dalam mosi pemberian bantuan tunai di masa krisis, Tim Kontra memprioritaskan penyelamatan perusahaan dengan argumen bahwa hal tersebut menjaga perputaran ekonomi agar karyawan tidak dipecat. Timbangan dampak ini menggunakan prinsip...|A. Hak Dasar Kehidupan|B. Dampak Langsung|C. Dampak Umum|D. Perlindungan Pihak Rentan',
        kunci_jawaban: 'C',
        bobot_xp: 25
      },

      // ----------------- BAB 3 -----------------
      {
        id_modul: 3,
        pertanyaan: 'Struktur argumen internasional AREL setara dengan konsep 3T dalam panduan debat bahasa Arab dari Qatar Foundation. Urutan yang benar dari konsep 3T tersebut adalah...|A. Tadleel, Ta\'leel, Taukid|B. Taukid, Ta\'leel, Tadleel|C. Ta\'leel, Taukid, Tadleel|D. Taukid, Tadleel, Ta\'leel',
        kunci_jawaban: 'B',
        bobot_xp: 25
      },
      {
        id_modul: 3,
        pertanyaan: 'Bagian dari struktur AREL yang berfungsi sebagai "judul" atau klaim utama yang ingin dibuktikan dan harus disampaikan secara jelas dan spesifik dinamakan...|A. Reasoning|B. Evidence|C. Link-back|D. Assertion (Taukid)',
        kunci_jawaban: 'D',
        bobot_xp: 25
      },
      {
        id_modul: 3,
        pertanyaan: 'Fungsi utama dari komponen Evidence (Tadleel) dalam sebuah argumen yang kokoh adalah...|A. Menggantikan proses penalaran logis pembicara secara total.|B. Memvalidasi dan mendukung logika penalaran menggunakan data, statistik, atau studi kasus nyata.|C. Menyerang karakter pribadi pembicara lawan.|D. Menutup pidato agar pas dengan batasan waktu yang ditentukan.',
        kunci_jawaban: 'B',
        bobot_xp: 25
      },
      {
        id_modul: 3,
        pertanyaan: 'Langkah kedua yang tepat dalam melakukan Teknik Sanggahan (Refutasi) 5 Langkah setelah kita mendengarkan argumen lawan adalah...|A. Menunjukkan titik lemah lawan secara emosional.|B. Mengulangi (Restate) secara singkat apa yang lawan katakan tanpa memanipulasinya.|C. Menarik kesimpulan baru yang membalikkan keadaan.|D. Mengajukan interupsi (POI) selama 15 detik.',
        kunci_jawaban: 'B',
        bobot_xp: 25
      },
      {
        id_modul: 3,
        pertanyaan: 'Jika kamu ingin menyanggah argumen lawan dengan membongkar hubungan sebab-akibat mereka yang terputus, berarti kamu menyerang bagian...|A. Faktanya|B. Buktinya|C. Asumsinya|D. Logikanya',
        kunci_jawaban: 'D',
        bobot_xp: 25
      },
      {
        id_modul: 3,
        pertanyaan: 'Keterampilan untuk mengkomparasi dampak guna membuktikan kepada juri bahwa dampak dari sisi timmu jauh lebih krusial dibandingkan dampak dari sisi lawan disebut...|A. Case Building|B. Weighing (Penimbangan Dampak)|C. Assertion|D. SARA Filtering',
        kunci_jawaban: 'B',
        bobot_xp: 25
      },
      {
        id_modul: 3,
        pertanyaan: 'Jika kita memperdebatkan metrik penimbangan dampak (weighing) berdasarkan berapa banyak jumlah orang yang terkena dampak tersebut (misal: 1.000 orang vs 10 juta orang), maka instrumen juri yang digunakan adalah...|A. Magnitude|B. Scope|C. Duration|D. Probability',
        kunci_jawaban: 'B',
        bobot_xp: 25
      },
      {
        id_modul: 3,
        pertanyaan: 'Apa konsekuensi (penalty) bagi seorang debater yang mengabaikan seluruh tawaran POI/interupsi dari lawan sepanjang pidatonya?|A. Langsung didiskualifikasi dari kompetisi.|B. Juri dapat menganggap debater takut berinteraksi dan memberikan penalti pengurangan skor persuasi.|C. Waktu pidatonya dipotong secara otomatis sebanyak 2 menit.|D. Tidak ada konsekuensi apa pun karena menerima POI bersifat opsional mutlak.',
        kunci_jawaban: 'B',
        bobot_xp: 25
      },

      // ----------------- BAB 4 -----------------
      {
        id_modul: 4,
        pertanyaan: 'Kecacatan berpikir di mana seseorang menyerang latar belakang, status, atau fisik lawan bicaranya, alih-alih membantah isi argumen yang disampaikan disebut...|A. Slippery Slope|B. Strawman Fallacy|C. Ad Hominem|D. False Dichotomy',
        kunci_jawaban: 'C',
        bobot_xp: 25
      },
      {
        id_modul: 4,
        pertanyaan: 'Ketika seseorang menolak sebuah ide dengan berasumsi bahwa satu tindakan kecil otomatis memicu rentetan peristiwa bencana ekstrem di masa depan tanpa bukti penghubung yang jelas, ia terjebak dalam...|A. Bandwagon|B. Slippery Slope|C. Hasty Generalization|D. Ad Hominem',
        kunci_jawaban: 'B',
        bobot_xp: 25
      },
      {
        id_modul: 4,
        pertanyaan: 'Menyederhanakan masalah yang sangat kompleks seolah-olah hanya ada dua pilihan mutlak (hitam-putih), padahal masih terdapat alternatif opsi lainnya merupakan definisi dari...|A. Strawman Fallacy|B. Hasty Generalization|C. False Dichotomy|D. Argumentum Ad Populum',
        kunci_jawaban: 'C',
        bobot_xp: 25
      },
      {
        id_modul: 4,
        pertanyaan: 'Jika Tim Kontra membelokkan argumen pemotongan anggaran bansos milik Tim Pro menjadi tuduhan ekstrem seperti "Tim Pro ingin membiarkan rakyat miskin mati kelaparan", maka kesesatan pikir ini disebut...|A. Strawman Fallacy|B. Bandwagon|C. Slippery Slope|D. Ad Hominem',
        kunci_jawaban: 'A',
        bobot_xp: 25
      },
      {
        id_modul: 4,
        pertanyaan: 'Dalam penilaian juri profesional, karakteristik utama dari Ordinary Intelligent Voter adalah netral dan tidak bias, artinya...|A. Juri harus mendukung tim yang berasal dari institusi yang sama dengannya.|B. Juri menyingkirkan segala bentuk bias pribadi, afiliasi politik, agama, atau kepercayaannya saat masuk ruang debat.|C. Juri akan memberikan kemenangan kepada tim yang paling emosional.|D. Juri bebas menentukan pemenang berdasarkan opini pribadinya sendiri.',
        kunci_jawaban: 'B',
        bobot_xp: 25
      },
      {
        id_modul: 4,
        pertanyaan: 'Tiga indikator atau elemen utama penilaian debat standar global (seperti pada format Asian Parliamentary) adalah...|A. Motion, Assertion, Refutation|B. Logic, Data, Presentation|C. Matter, Manner, Method|D. Speaker, Judge, Audience',
        kunci_jawaban: 'C',
        bobot_xp: 25
      },
      {
        id_modul: 4,
        pertanyaan: 'Elemen penilaian juri yang mengevaluasi struktur AREL, kedalaman analisis dampak, ketajaman sanggahan, serta relevansi bukti empiris disebut...|A. Manner|B. Method|C. Matter (Content)|D. Timing',
        kunci_jawaban: 'C',
        bobot_xp: 25
      },
      {
        id_modul: 4,
        pertanyaan: 'Seorang Pembicara ke-3 sukses merangkum titik bentur (clash) perdebatan dengan sangat rapi tanpa membawa argumen baru, serta memaksimalkan waktu pidatonya secara efisien. Kinerja pembicara tersebut akan dinilai tinggi pada elemen...|A. Matter|B. Method (Strategy)|C. Manner|D. Ethos',
        kunci_jawaban: 'B',
        bobot_xp: 25
      }
    ]
  });

  console.log('✅ Seeding Selesai! 4 Bab Materi dan 32 Bank Soal Terikat Sempurna.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });