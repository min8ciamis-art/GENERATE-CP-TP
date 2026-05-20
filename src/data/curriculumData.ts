/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { JenjangType, KbcValue, Subject, Grade, Chapter, CpElement } from "../types";

export const KBC_VALUES: KbcValue[] = [
  {
    id: "rahmah",
    name: "Kasih Sayang (Rahmah)",
    arabicName: "الرَّحْمَة",
    description: "Internalisasi rasa cinta kasih, empati mendalam, dan kelembutan serta kelapangan dada dalam interaksi belajar mengajar tanpa kekerasan.",
    exampleIntegration: "Mengawali dan mengakhiri pembelajaran dengan saling mendoakan, menghargai kelemahan kognitif siswa dengan bimbingan personal yang penuh kehangatan."
  },
  {
    id: "kepedulian",
    name: "Kepedulian (Inayah)",
    arabicName: "العِنَايَة",
    description: "Kepekaan sosial yang tinggi untuk menolong sesama teman, tanggap terhadap kesulitan belajar rekan sebaya, dan cinta lingkungan madrasah.",
    exampleIntegration: "Metode tutor sebaya (peer tutoring) dan membiasakan siswa memberikan sumbangan pemikiran serta bantuan sosial nyata."
  },
  {
    id: "kesantunan",
    name: "Kesantunan (Ta'adub)",
    arabicName: "التَّأَدُّب",
    description: "Sikap beradab tinggi, menggunakan tutur kata yang baik (QAulan Karima), menghormati guru, orang tua, dan menghargai teman sejawat.",
    exampleIntegration: "Praktik berkomunikasi formal, teknik menyanggah pendapat secara akademis namun tetap menjunjung adab islami yang luhur."
  },
  {
    id: "kedamaian",
    name: "Kedamaian (As-Salam)",
    arabicName: "السَّلَام",
    description: "Pencegahan konflik, menjauhi perundungan (bullying) verbal maupun fisik, serta menghadirkan ketenangan dalam proses pembelajaran.",
    exampleIntegration: "Membangun kesepakatan kelas yang antidiskriminasi, serta latihan refleksi diri untuk meredakan ketegangan emosional."
  },
  {
    id: "moderasi",
    name: "Moderasi Beragama (Tawasut)",
    arabicName: "التَّوَسُّط",
    description: "Sikap tawasut (moderat), tawazun (seimbang), i'tidal (adil), dan tasamuh (toleran) dalam beragama dan berbangsa di tengah keberagaman.",
    exampleIntegration: "Diskusi bertema kerukunan, mengkaji materi keagamaan dengan pendekatan komparasi yang bijak, serta melatih inklusivitas sosial."
  }
];

export function getGrades(jenjang: JenjangType): Grade[] {
  switch (jenjang) {
    case "RA":
      return [
        { id: "ra_a", name: "Kelas A (Usia 4-5 Tahun)", fase: "Fase Fondasi" },
        { id: "ra_b", name: "Kelas B (Usia 5-6 Tahun)", fase: "Fase Fondasi" }
      ];
    case "MI":
      return [
        { id: "mi_1", name: "Kelas 1", fase: "Fase A" },
        { id: "mi_2", name: "Kelas 2", fase: "Fase A" },
        { id: "mi_3", name: "Kelas 3", fase: "Fase B" },
        { id: "mi_4", name: "Kelas 4", fase: "Fase B" },
        { id: "mi_5", name: "Kelas 5", fase: "Fase C" },
        { id: "mi_6", name: "Kelas 6", fase: "Fase C" }
      ];
    case "MTs":
      return [
        { id: "mts_7", name: "Kelas 7", fase: "Fase D" },
        { id: "mts_8", name: "Kelas 8", fase: "Fase D" },
        { id: "mts_9", name: "Kelas 9", fase: "Fase D" }
      ];
    case "MA":
      return [
        { id: "ma_10", name: "Kelas 10", fase: "Fase E" },
        { id: "ma_11", name: "Kelas 11", fase: "Fase F" },
        { id: "ma_12", name: "Kelas 12", fase: "Fase F" }
      ];
    default:
      return [];
  }
}

export function getSubjects(jenjang: JenjangType): Subject[] {
  const commonPAI: Subject[] = [
    { id: "quran_hadis", name: "Al-Qur'an Hadis", category: "PAI/Bahasa Arab", description: "Pembelajaran pemahaman makna ayat Al-Qur'an dan Hadis tentang cinta sesama dan adab mulia." },
    { id: "akidah_akhlak", name: "Akidah Akhlak", category: "PAI/Bahasa Arab", description: "Penanaman keyakinan tauhid dan pengembangan akhlakul karimah berbasis cinta kasih makhluk." },
    { id: "fikih", name: "Fikih", category: "PAI/Bahasa Arab", description: "Aturan ibadah dan muamalah berlandaskan asas kemudahan dan kemaslahatan umat." },
    { id: "ski", name: "Sejarah Kebudayaan Islam (SKI)", category: "PAI/Bahasa Arab", description: "Analisis keteladanan perjuangan Rasulullah SAW dan para sahabat yang mengutamakan rahmah." },
    { id: "bahasa_arab", name: "Bahasa Arab", category: "PAI/Bahasa Arab", description: "Penguasaan komunikasi reseptif dan produktif berbahasa Arab dengan sopan santun mulia." }
  ];

  switch (jenjang) {
    case "RA":
      return [
        { id: "nilai_agama", name: "Nilai Agama & Budi Pekerti (Khas RA)", category: "PAI/Bahasa Arab", description: "Mengenal rukun iman, rukun islam, dan membiasakan akhlak mulia sejak dini." },
        { id: "jati_diri", name: "Jati Diri & Karakter Cinta", category: "Umum", description: "Pengembangan emosional diri, cinta madrasah, dan kebangsaan." },
        { id: "dasar_literasi", name: "Dasar Literasi, Matematika, dan Sains", category: "Umum", description: "Eksplorasi bahasa rupa, angka sederhana, dan keindahan alam ciptaan Allah." }
      ];
    case "MI":
      return [
        ...commonPAI,
        { id: "pend_pancasila", name: "Pendidikan Pancasila", category: "Umum", description: "Pemahaman pilar kebangsaan, gotong-royong, dan keadilan sosial." },
        { id: "b_indonesia", name: "Bahasa Indonesia", category: "Umum", description: "Keterampilan berbahasa lisan dan tulisan yang santun dan efektif." },
        { id: "matematika", name: "Matematika", category: "Umum", description: "Kemampuan logika, bilangan, geometri, dan pemecahan masalah." },
        { id: "ipas", name: "Ilmu Pengetahuan Alam & Sosial (IPAS)", category: "Umum", description: "Hubungan fenomena alam dan sosial budaya masyarakat nusantara." },
        { id: "seni_budaya", name: "Seni dan Budaya", category: "Umum", description: "Apresiasi keindahan, kreativitas seni rupa/musik yang santun." }
      ];
    case "MTs":
      return [
        ...commonPAI.filter(s => s.id !== "ra_nilai"),
        { id: "pend_pancasila", name: "Pendidikan Pancasila", category: "Umum", description: "Penerapan nilai-nilai dasar negara dalam persatuan berbangsa." },
        { id: "b_indonesia", name: "Bahasa Indonesia", category: "Umum", description: "Keterampilan literasi kritis dan penyusunan argumen santun." },
        { id: "matematika", name: "Matematika", category: "Umum", description: "Berpikir aljabar, statistik, geometri, dan pemecahan masalah terapan." },
        { id: "ipa", name: "Ilmu Pengetahuan Alam (IPA)", category: "Umum", description: "Konsep dasar fisika, kimia, biologi, objek biotik dan abiotik." },
        { id: "ips", name: "Ilmu Pengetahuan Sosial (IPS)", category: "Umum", description: "Sejarah, geografi, sosiologi, dan ekonomi masyarakat regional." },
        { id: "b_inggris", name: "Bahasa Inggris", category: "Umum", description: "Komunikasi global, dialog sosial, dan pemahaman budaya antarbangsa." },
        { id: "informatika", name: "Informatika", category: "Umum", description: "Algoritma pemecahan masalah komputer dan etika digital sehat." }
      ];
    case "MA":
      return [
        ...commonPAI,
        { id: "pend_pancasila", name: "Pendidikan Pancasila", category: "Umum", description: "Studi komparatif hukum tata negara, konstitusi, dan moderasi bernegara." },
        { id: "b_indonesia", name: "Bahasa Indonesia", category: "Umum", description: "Kajian filologis sastra indonesia, menulis karya tulis ilmiah." },
        { id: "matematika", name: "Matematika", category: "Umum", description: "Logika matematika tingkat lanjut, trigonometri, kalkulus dasar." },
        { id: "ipa", name: "Ilmu Pengetahuan Alam (Fisika/Kimia/Biologi)", category: "Umum", description: "Analisis mikro dan makroskopis materi fisika dasar, zat kimia, ekosistem hayati." },
        { id: "ips", name: "Ilmu Pengetahuan Sosial (Sejarah/Sosiologi/Ekonomi)", category: "Umum", description: "Studi integratif struktur sosial, transaksi moneter syariah, sejarah peradaban." },
        { id: "b_inggris", name: "Bahasa Inggris", category: "Umum", description: "Debat akademis, penulisan esai kritis berbahasa asing." }
      ];
    default:
      return [];
  }
}

export function getCpElements(jenjang: JenjangType, gradeId: string, subjectId: string): CpElement[] {
  // Return authentic-looking Capaian Pembelajaran Elemen based on subject
  switch (subjectId) {
    case "quran_hadis":
      return [
        { element: "Al-Qur'an", description: "Peserta didik mampu melafalkan, menghafal, menganalisis, serta mengomunikasikan kandungan ayat Al-Qur'an secara kontekstual dengan didasari rasa cinta kepada wahyu Ilahi." },
        { element: "Hadis", description: "Peserta didik mampu memahami dan meneladani perilaku Rasulullah SAW yang didokumentasikan dalam hadis-hadis sahih tentang pembinaan akhlak mulia dan kasih sayang universal (rahmatan lil alamin)." }
      ];
    case "akidah_akhlak":
      return [
        { element: "Akidah/Tauhid", description: "Peserta didik mampu meyakini, memahami, dan memelihara keimanan yang kokoh kepada Allah SWT, Rasul-Rasul, serta Malaikat melalui pemahaman sifat mulia-Nya." },
        { element: "Akhlak Mulia", description: "Peserta didik dapat mengintegrasikan adab berkendara, sosial, belajar, dan bernegara yang santun, mencerminkan nilai Kurikulum Berbasis Cinta (KBC) Kemenag." }
      ];
    case "fikih":
      return [
        { element: "Fikih Ibadah", description: "Peserta didik mampu melaksanakan ketentuan syariat (shalat, zakat, puasa, haji) dengan benar, memahami substansi batiniah ibadah sebagai manifestasi cinta hamba kepada Pencipta." },
        { element: "Fikih Muamalah", description: "Peserta didik memiliki kesadaran hukum dalam bertransaksi ekonomi sosial secara moderat, adil, menjunjung asas kerelaan bersama (an-taradin) dan anti-ribawi." }
      ];
    case "ski":
      return [
        { element: "Sejarah Kenabian & Sahabat", description: "Peserta didik mampu menganalisis misi dakwah Rasulullah SAW di Makkah dan Madinah, meneladani sikap ksatria penuh damai dan toleransi kepemimpinan sahabat khulafaur rasyidin." },
        { element: "Kejayaan Islam & Peradaban", description: "Peserta didik mengkaji produk-produk budaya, ilmu pengetahuan, dan kontribusi emas madrasah/ulama klasik nusantara dalam membawa kedamaian global." }
      ];
    case "bahasa_arab":
      return [
        { element: "Istima' (Mendengar)", description: "Peserta didik mampu mendengarkan ujaran ungkapan harian, dialog interpersonal bahasa Arab dengan penuh fokus dan kesadaran kontekstual yang harmonis." },
        { element: "Kalam & Kitabah (Berbicara & Menulis)", description: "Peserta didik mampu mengucapkan tata bahasa Arab serta menuangkannya dalam teks sederhana dengan tutur santun bernilai tinggi." }
      ];
    case "pend_pancasila":
      return [
        { element: "Pancasila & UUD NRI 1945", description: "Peserta didik menganalisis hakikat persatuan, keragaman berbangsa, dan keselarasan nilai pancasila dengan sendi kesantunan adat ketimuran berbasis cinta tanah air." },
        { element: "Bhinneka Tunggal Ika & NKRI", description: "Menerapkan sikap toleransi antarsuku dan pemeluk agama demi melahirkan tatanan masyarakat madani yang moderat dan rukun." }
      ];
    case "b_indonesia":
      return [
        { element: "Menyimak & Membaca", description: "Peserta didik memahami gagasan pikiran teks informatif atau sastra dengan interpretasi logis santun dan komparasi objektif." },
        { element: "Berbicara & Mempresentasikan", description: "Mengungkapkan pendapat secara asertif dengan pilihan diksi positif yang menenangkan hati pendengar (anti perundungan)." }
      ];
    case "matematika":
      return [
        { element: "Bilangan & Aljabar", description: "Peserta didik mengoperasikan logika numerik, pemodelan persamaan matematika, mendesain proporsi efisiensi biaya secara jujur dan cinta keadilan." },
        { element: "Geometri & Statistika", description: "Kemampuan memvisualisasikan ruang, menyusun data secara objektif transparan, guna menumbuhkan ketelitian berpikir ilmiah." }
      ];
    case "ipas":
    case "ipa":
      return [
        { element: "Pemahaman Sains / IPAS", description: "Menganalisis keterkaitan siklus makhluk hidup, sifat fisika energi, keseimbangan alam raya sebagai wujud kebesaran Pencipta (tafakkur alam)." },
        { element: "Keterampilan Proses Ilmiah", description: "Merancang eksperimen, menguji hipotesis secara kolaboratif mengutamakan gotong royong penuh cinta kasih dan penghargaan hak hidup satwa liar." }
      ];
    case "nilai_agama":
      return [
        { element: "Nilai Agama & Moral", description: "Anak didik mampu mengenal Tuhan melalui ciptaan-Nya, melafalkan doa harian pendek, menirukan gerakan ibadah dasar secara riang gembira dipenuhi cinta." }
      ];
    case "jati_diri":
      return [
        { element: "Sosial Emosional RA", description: "Anak dapat menyayangi teman sebaya, berbagi mainan tanpa rebutan, mengekspresikan emosi secara aman dan santun." }
      ];
    case "dasar_literasi":
      return [
        { element: "Kognitif Berbahasa & Karya", description: "Merespon instruksi lisan sederhana, bernyanyi lagu keagamaan nasional, mengekspresikan lukisan coretan penuh imajinasi cinta kasih." }
      ];
    default:
      return [
        { element: "Elemen Pemahaman Utama", description: "Peserta didik membiasakan penalaran analitis kritis berlandaskan nilai keteladanan akhlak islami berakar pada cinta kasih sesama." },
        { element: "Elemen Penerapan Praktis", description: "Peserta didik mengonstruksikan hasil pembelajaran menjadi karya nyata yang bermanfaat bagi kemaslahatan madrasah dan lingkungan luas." }
      ];
  }
}

export function getDefaultChapters(jenjang: JenjangType, gradeId: string, subjectId: string): Chapter[] {
  // Provide realistic chapters for dynamic edit
  const mapelPrefix = subjectId.toUpperCase();
  
  const miMtsChapters: Omit<Chapter, "id">[] = [
    { semester: 1, number: 1, title: `Bab 1: Menelaah Konsep Dasar ${subjectId.replace("_", " ")} dengan Ketulusan Hati`, weeks: 4, jp: 4, assessmentJp: 2 },
    { semester: 1, number: 2, title: `Bab 2: Formulasi Sikap Peduli & Aktualisasi Nilai Kasih Sayang`, weeks: 4, jp: 4, assessmentJp: 2 },
    { semester: 1, number: 3, title: `Bab 3: Internalisasi Adab Kesantunan & Moderasi Sosial`, weeks: 4, jp: 4, assessmentJp: 2 },
    { semester: 2, number: 4, title: `Bab 4: Eksplorasi Hubungan Kedamaian & Penerapan Praktis Kehidupan`, weeks: 4, jp: 4, assessmentJp: 2 },
    { semester: 2, number: 5, title: `Bab 5: Penguatan Ukhuwah & Kolaborasi Konstruktif di Madrasah`, weeks: 4, jp: 4, assessmentJp: 2 }
  ];

  // Tailored chapters based on specific subjects for realistic feel
  if (subjectId === "quran_hadis") {
    return [
      { id: "qh_1", semester: 1, number: 1, title: "Bab 1: Indahnya Bertutur Kata Santun dalam Al-Qur'an (Kajian QS Al-Hujurat)", weeks: 4, jp: 2, assessmentJp: 2 },
      { id: "qh_2", semester: 1, number: 2, title: "Bab 2: Hadis Keutamaan Berbagi dengan Kasih Sayang dan Cinta Anak Yatim", weeks: 4, jp: 2, assessmentJp: 2 },
      { id: "qh_3", semester: 1, number: 3, title: "Bab 3: Menjaga Kedamaian Melalui Kelestarian Alam Sekitar Kita", weeks: 4, jp: 2, assessmentJp: 2 },
      { id: "qh_4", semester: 2, number: 4, title: "Bab 4: Membumikan Sikap Toleran & Moderasi Sesuai Surah Al-Kafirun", weeks: 5, jp: 2, assessmentJp: 2 },
      { id: "qh_5", semester: 2, number: 5, title: "Bab 5: Hadis Menghormati Guru Serta Adab Luhur Menuntut Ilmu", weeks: 5, jp: 2, assessmentJp: 2 }
    ];
  }

  if (subjectId === "akidah_akhlak") {
    return [
      { id: "aa_1", semester: 1, number: 1, title: "Bab 1: Mengenal Sifat Allah Al-Ghaffar & Ar-Rahman (Maha Pengasih)", weeks: 4, jp: 2, assessmentJp: 2 },
      { id: "aa_2", semester: 1, number: 2, title: "Bab 2: Membiasakan Akhlak Terpuji Syukur, Sabar dan Indahnya Memaafkan", weeks: 4, jp: 2, assessmentJp: 2 },
      { id: "aa_3", semester: 1, number: 3, title: "Bab 3: Menghindari Perilaku Tercela Marah, Dengki dan Bullying (Perundungan)", weeks: 4, jp: 2, assessmentJp: 2 },
      { id: "aa_4", semester: 2, number: 4, title: "Bab 4: Adab Pergaulan Remaja yang Anggun, Sopan dan Beradab Mulia", weeks: 4, jp: 2, assessmentJp: 2 },
      { id: "aa_5", semester: 2, number: 5, title: "Bab 5: Keteladanan Ulama Nusantara dalam Menyebarkan Kedamaian", weeks: 4, jp: 2, assessmentJp: 2 }
    ];
  }

  if (subjectId === "fikih") {
    return [
      { id: "f_1", semester: 1, number: 1, title: "Bab 1: Kebersihan Lahir dan Batin (Thaharah) Cermin Kesucian Cinta", weeks: 4, jp: 2, assessmentJp: 2 },
      { id: "f_2", semester: 1, number: 2, title: "Bab 2: Solat Berjamaah Gerakan Menguatkan Kepedulian Antarsesama", weeks: 4, jp: 2, assessmentJp: 2 },
      { id: "f_3", semester: 2, number: 3, title: "Bab 3: Puasa Ramadan sebagai Sarana Empati dan Merasakan Lapar Miskin", weeks: 5, jp: 2, assessmentJp: 2 },
      { id: "f_4", semester: 2, number: 4, title: "Bab 4: Fikih Makanan Halal Toyyib Guna Membangun Karakter Lembut", weeks: 5, jp: 2, assessmentJp: 2 }
    ];
  }

  if (subjectId === "ski") {
    return [
      { id: "s_1", semester: 1, number: 1, title: "Bab 1: Kondisi Masyarakat Arab Jahiliyah & Fajar Rahmatan Lil Alamin", weeks: 4, jp: 2, assessmentJp: 2 },
      { id: "s_2", semester: 1, number: 2, title: "Bab 2: Dakwah Kasih Sayang Rasulullah SAW Periode Makkah", weeks: 4, jp: 2, assessmentJp: 2 },
      { id: "s_3", semester: 2, number: 3, title: "Bab 3: Piagam Madinah: Konsensus Kedamaian & Toleransi Pertama di Dunia", weeks: 5, jp: 2, assessmentJp: 2 },
      { id: "s_4", semester: 2, number: 4, title: "Bab 4: Perjuangan Dakwah Pembawa Kedamaian Walisongo di Nusantara", weeks: 5, jp: 2, assessmentJp: 2 }
    ];
  }

  if (subjectId === "b_indonesia") {
    return [
      { id: "bi_1", semester: 1, number: 1, title: "Bab 1: Mengenali Karakter Diri dan Berani Menyapa Kebaikan", weeks: 4, jp: 4, assessmentJp: 2 },
      { id: "bi_2", semester: 1, number: 2, title: "Bab 2: Berdiskusi Sehat: Membahas Hobi dengan Tutur Kata Santun", weeks: 4, jp: 4, assessmentJp: 2 },
      { id: "bi_3", semester: 2, number: 3, title: "Bab 3: Melaporkan Kegiatan Peduli Lingkungan dalam Teks Rekon", weeks: 4, jp: 4, assessmentJp: 2 },
      { id: "bi_4", semester: 2, number: 4, title: "Bab 4: Membaca Cerita Rakyat Menggali Pesan Damai & Toleransi Suku", weeks: 4, jp: 4, assessmentJp: 2 }
    ];
  }

  if (jenjang === "RA") {
    return [
      { id: "ra_c1", semester: 1, number: 1, title: "Topik 1: Aku Sayang Temanku & Alam Madrasahku", weeks: 4, jp: 8, assessmentJp: 2 },
      { id: "ra_c2", semester: 1, number: 2, title: "Topik 2: Keluargaku Bahagia, Rumahku Syurgaku", weeks: 4, jp: 8, assessmentJp: 2 },
      { id: "ra_c3", semester: 2, number: 3, title: "Topik 3: Sopan Kepada Ayah, Ibu, Guru Terkasih", weeks: 4, jp: 8, assessmentJp: 2 },
      { id: "ra_c4", semester: 2, number: 4, title: "Topik 4: Gotong Royong Mewarnai Hari Menyenangkan", weeks: 4, jp: 8, assessmentJp: 2 }
    ];
  }

  // Fallback map
  return miMtsChapters.map((ch, idx) => ({
    ...ch,
    id: `${subjectId}_ch_${idx + 1}`
  }));
}
