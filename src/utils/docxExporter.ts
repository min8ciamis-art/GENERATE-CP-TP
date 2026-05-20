/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GeneratorState, CpElement, Chapter, KbcValue } from "../types";
import { KBC_VALUES, getCpElements, getGrades, getSubjects } from "../data/curriculumData";

// Months for Semester distribution
const MONTHS_SEM1 = [
  { name: "Juli", weeks: 4 },
  { name: "Agustus", weeks: 4 },
  { name: "September", weeks: 4 },
  { name: "Oktober", weeks: 4 },
  { name: "November", weeks: 4 },
  { name: "Desember", weeks: 4 }
];

const MONTHS_SEM2 = [
  { name: "Januari", weeks: 4 },
  { name: "Februari", weeks: 4 },
  { name: "Maret", weeks: 4 },
  { name: "April", weeks: 4 },
  { name: "Mei", weeks: 4 },
  { name: "Juni", weeks: 4 }
];

// Helper to generate a standardized document header for Madrasah
function generateDocIdentityHeader(state: GeneratorState, title: string): string {
  const grades = getGrades(state.jenjang);
  const gradeLabel = grades.find(g => g.id === state.selectedGrade)?.name || state.selectedGrade;
  const faseLabel = grades.find(g => g.id === state.selectedGrade)?.fase || "";
  const subjects = getSubjects(state.jenjang);
  const subjectLabel = subjects.find(s => s.id === state.selectedSubject)?.name || state.selectedSubject;

  return `
    <div class="header-box">
      <table style="width: 100%; border: none; margin-bottom: 10px;">
        <tr style="border: none;">
          <td style="width: 20%; border: none; padding: 0;">
            <strong style="font-size: 14pt; color: #047857;">Edügen Pro</strong><br/>
            <span style="font-size: 8pt; color: #6b7280;">Kurikulum Berbasis Cinta</span>
          </td>
          <td style="width: 60%; text-align: center; border: none; padding: 0;">
            <strong style="font-size: 14pt; text-transform: uppercase;">DOKUMEN PERANGKAT PEMBELAJARAN</strong><br/>
            <strong style="font-size: 12pt; color: #047857;">${title.toUpperCase()}</strong><br/>
            <span style="font-size: 10pt;">Kementerian Agama Republik Indonesia</span>
          </td>
          <td style="width: 20%; text-align: right; border: none; padding: 0;">
            <span style="font-size: 9pt; border: 1px solid #047857; padding: 3px 6px; color: #047857; font-weight: bold; border-radius: 4px;">KBC Kemenag 2025</span>
          </td>
        </tr>
      </table>
      
      <hr style="border: 0; border-top: 2px double #047857; margin-bottom: 15px;" />

      <table style="width: 100%; border: none; font-size: 9.5pt;">
        <tr style="border: none;">
          <td style="width: 15%; border: none; padding: 2px;"><strong>Madrasah/Sekolah</strong></td>
          <td style="width: 35%; border: none; padding: 2px;">: ${state.identity.madrasahName}</td>
          <td style="width: 15%; border: none; padding: 2px;"><strong>Mata Pelajaran</strong></td>
          <td style="width: 35%; border: none; padding: 2px;">: ${subjectLabel}</td>
        </tr>
        <tr style="border: none;">
          <td style="width: 15%; border: none; padding: 2px;"><strong>Nama Pendidik</strong></td>
          <td style="width: 35%; border: none; padding: 2px;">: ${state.identity.teacherName}</td>
          <td style="width: 15%; border: none; padding: 2px;"><strong>Kelas / Semester</strong></td>
          <td style="width: 35%; border: none; padding: 2px;">:  ${gradeLabel} / ${state.identity.semester}</td>
        </tr>
        <tr style="border: none;">
          <td style="width: 15%; border: none; padding: 2px;"><strong>NIP/NUPTK</strong></td>
          <td style="width: 35%; border: none; padding: 2px;">: ${state.identity.nipCode || "-"}</td>
          <td style="width: 15%; border: none; padding: 2px;"><strong>Fase / Kurikulum</strong></td>
          <td style="width: 35%; border: none; padding: 2px;">: ${faseLabel} / ${state.identity.curriculum}</td>
        </tr>
        <tr style="border: none;">
          <td style="width: 15%; border: none; padding: 2px;"><strong>Tahun Pelajaran</strong></td>
          <td style="width: 35%; border: none; padding: 2px;">: ${state.identity.academicYear}</td>
          <td style="width: 15%; border: none; padding: 2px;"><strong>Alamat Madrasah</strong></td>
          <td style="width: 35%; border: none; padding: 2px;">: ${state.identity.address || "-"}</td>
        </tr>
      </table>
    </div>
  `;
}

// Generates signature sections in Word style
function generateDocSignatures(state: GeneratorState): string {
  return `
    <br/><br/>
    <table style="width: 100%; border: none; font-size: 10pt; margin-top: 30px;">
      <tr style="border: none;">
        <td style="width: 50%; border: none; padding: 2px;">
          Mengetahui,<br/>
          Kepala Madrasah ${state.identity.madrasahName}
          <br/><br/><br/><br/><br/>
          <strong><u>${state.identity.principalName || "......................................."}</u></strong><br/>
          NIP: ${state.identity.principalNip || "......................................."}
        </td>
        <td style="width: 50%; border: none; padding: 2px; text-align: right;">
          Guru Mata Pelajaran
          <br/><br/><br/><br/><br/>
          <strong><u>${state.identity.teacherName}</u></strong><br/>
          NIP/NUPTK: ${state.identity.nipCode || "......................................."}
        </td>
      </tr>
    </table>
  `;
}

// Generate Capaian Pembelajaran HTML string
export function generateCpHtml(state: GeneratorState, cpList: CpElement[]): string {
  let content = `
    <h1 class="first">Analisis Capaian Pembelajaran (CP) Berdasarkan BSKAP Tahun 2025</h1>
    <p style="margin-bottom: 12px; font-size: 10pt; text-align: justify; line-height: 1.4;">
      Analisis ini disusun berdasarkan Peraturan Kepala BSKAP Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi terbaru yang diintegrasikan dengan panduan Kurikulum Berbasis Cinta (KBC) Kemenag. Fokus utama analisis ini adalah memadukan kedalaman kompetensi literasi, numerasi, serta elemen keagamaan dengan karakter cinta kasih sesama makhluk ciptaan Allah SWT.
    </p>
    <table style="margin-bottom: 25px;">
      <thead>
        <tr>
          <th style="width: 25%;">Elemen Capaian Pembelajaran</th>
          <th style="width: 75%;">Deskripsi Kompetensi BSKAP 2025</th>
        </tr>
      </thead>
      <tbody>
  `;

  cpList.forEach(cp => {
    content += `
      <tr>
        <td><strong>${cp.element}</strong></td>
        <td>${cp.description}</td>
      </tr>
    `;
  });

  content += `
      </tbody>
    </table>
  `;
  return content;
}

// Generate Tujuan Pembelajaran HTML string incorporating KBC Value integration
export function generateTpHtml(state: GeneratorState, cpList: CpElement[]): string {
  const selectedKbc = KBC_VALUES.filter(k => state.selectedKbcValues.includes(k.id));
  const kbcHighlight = selectedKbc.length > 0 ? selectedKbc.map(k => `${k.name}`).join(", ") : "Kasih Sayang";

  let content = `
    <h1>Perumusan Tujuan Pembelajaran (TP) Terintegrasi KBC</h1>
    <p style="margin-bottom: 12px; font-size: 10pt; text-align: justify; line-height: 1.4;">
      Tujuan Pembelajaran (TP) diturunkan secara logis dari Capaian Pembelajaran (CP) menggunakan prinsip format <strong>ABCD (Audience, Behavior, Condition, Degree)</strong>, yang kemudian diinsersikan secara khusus dengan nilai-nilai luhur <strong>Kurikulum Berbasis Cinta (KBC)</strong> sebagai wujud integrasi karakter islami khas Kementerian Agama.
    </p>
    <table style="margin-bottom: 25px;">
      <thead>
        <tr>
          <th style="width: 8%;">Kode TP</th>
          <th style="width: 47%;">Rumusan Tujuan Pembelajaran (Aspek Kognitif & Keterampilan - ABCD)</th>
          <th style="width: 45%; background-color: #065F46;">Insersi Nilai Karakter KBC (Afektif & Internalisasi Rasa Cinta)</th>
        </tr>
      </thead>
      <tbody>
  `;

  let tpCounter = 1;
  state.chapters.forEach((ch) => {
    // Generate TP items per chapter
    for (let i = 1; i <= state.tpPerChapter; i++) {
      const tpCode = `${state.jenjang === "RA" ? "Fnd" : "TP"}.${ch.semester}.${ch.number}.${i}`;
      
      // Select KBC value cyclically if multiple
      const kbcObj = selectedKbc.length > 0 
        ? selectedKbc[(ch.number + i) % selectedKbc.length]
        : KBC_VALUES[0];

      const tpDescriptionText = `Peserta didik (A) mampu mendalami & menganalisis (B) substansi pokok bahasan materi '${ch.title.split(":")[1] || ch.title}' melalui observasi terbimbing (C) secara mandiri dan menguasainya dengan tingkat ketelitian di atas 80% (D).`;
      
      const kbcIntegrationText = `Sambil menanamkan semangat <strong>${kbcObj.name}</strong>, di mana siswa dilatih untuk saling menghargai pendapat, mewujudkan ${kbcObj.exampleIntegration.toLowerCase().replace(/mengawali dan mengakhiri pembelajaran dengan /, "")}`;

      content += `
        <tr>
          <td style="text-align: center;"><strong>${tpCode}</strong></td>
          <td>${tpDescriptionText}</td>
          <td class="kbc-insersi">
            <strong>Nilai: ${kbcObj.name} (${kbcObj.arabicName})</strong><br/>
            ${kbcIntegrationText}
          </td>
        </tr>
      `;
      tpCounter++;
    }
  });

  content += `
      </tbody>
    </table>
  `;
  return content;
}

// Generate Alur Tujuan Pembelajaran HTML string
export function generateAtpHtml(state: GeneratorState): string {
  let content = `
    <h1>Alur Tujuan Pembelajaran (ATP) Alur Logis Per Semester</h1>
    <p style="margin-bottom: 12px; font-size: 10pt; text-align: justify; line-height: 1.4;">
      Sistematisasi Alur Tujuan Pembelajaran (ATP) disusun secara logis dan berkesinambungan (dari materi konseptual mudah ke tingkat pemecahan kasus yang kompleks). Dilengkapi dengan penentuan jam pelajaran (JP) efektif, alokasi sumatif, dan rujukan integrasi karakter cinta.
    </p>
    <table style="margin-bottom: 25px;">
      <thead>
        <tr>
          <th style="width: 8%;">Semester</th>
          <th style="width: 10%;">Kode ATP</th>
          <th style="width: 42%;">Alur Logis Tujuan Pembelajaran</th>
          <th style="width: 10%;">Alokasi JP</th>
          <th style="width: 30%;">Kunci Profil Pelajar Rahmatan Lil Alamin (P2RA)</th>
        </tr>
      </thead>
      <tbody>
  `;

  state.chapters.forEach((ch) => {
    // Collect specific KBC values for display
    const selectedKbc = KBC_VALUES.filter(k => state.selectedKbcValues.includes(k.id));
    const kbcObj = selectedKbc.length > 0 ? selectedKbc[ch.number % selectedKbc.length] : KBC_VALUES[0];

    const totalJp = ch.weeks * ch.jp;
    const itemTitle = ch.title.split(":")[1] || ch.title;

    content += `
      <tr>
        <td style="text-align: center;">Semester ${ch.semester}</td>
        <td style="text-align: center;"><strong>ATP.${ch.semester}.${ch.number}</strong></td>
        <td>
          <strong>Topik Materi: ${itemTitle}</strong><br/>
          Mengurutkan pemahaman konsep dasar, memraktikkan sikap toleransi dan adab kesantunan, serta menyusun skema aksi nyata dalam lingkungan madrasah.
        </td>
        <td style="text-align: center;">${totalJp} JP</td>
        <td>
          - Beradab (Ta'addub)<br/>
          - Mengutamakan Harmoni (Syura)<br/>
          - Berorientasi ${kbcObj.name.split(" ")[0]}
        </td>
      </tr>
    `;
  });

  content += `
      </tbody>
    </table>
  `;
  return content;
}

// Generate Program Tahunan (PROTA) HTML string
export function generateProtaHtml(state: GeneratorState): string {
  let content = `
    <h1 class="first">Program Tahunan (PROTA) Kurikulum Berbasis Cinta</h1>
    <p style="margin-bottom: 12px; font-size: 10pt; text-align: justify; line-height: 1.4;">
      Program Tahunan ini mendistribusikan jam pelajaran efektif selama satu tahun ajaran (Semester Ganjil dan Semester Genap) guna menjamin seluruh kompetensi dasar dapat tersampaikan secara proposional.
    </p>
    <table style="margin-bottom: 25px;">
      <thead>
        <tr>
          <th style="width: 8%; text-align: center;">Semester</th>
          <th style="width: 12%; text-align: center;">Nomor Bab</th>
          <th style="width: 50%;">Judul Bahan Kajian / Bab Pembelajaran</th>
          <th style="width: 15%; text-align: center;">Minggu Efektif</th>
          <th style="width: 15%; text-align: center;">Alokasi JP</th>
        </tr>
      </thead>
      <tbody>
  `;

  let totalWeeks = 0;
  let totalJp = 0;

  state.chapters.forEach((ch) => {
    const jpResult = ch.weeks * ch.jp;
    totalWeeks += ch.weeks;
    totalJp += jpResult;

    content += `
      <tr>
        <td style="text-align: center;">${ch.semester === 1 ? "I (Ganjil)" : "II (Genap)"}</td>
        <td style="text-align: center;">Bab ${ch.number}</td>
        <td>${ch.title}</td>
        <td style="text-align: center;">${ch.weeks} Minggu</td>
        <td style="text-align: center;">${jpResult} JP</td>
      </tr>
    `;
  });

  content += `
      <tr style="background-color: #f3f4f6; font-weight: bold;">
        <td colspan="3" style="text-align: right; padding-right: 15px;">TOTAL ALOKASI JP TAHUNAN</td>
        <td style="text-align: center;">${totalWeeks} Minggu</td>
        <td style="text-align: center;">${totalJp} JP</td>
      </tr>
    </tbody>
  </table>
  `;
  return content;
}

// Generate Program Semester (PROMES) Matrix HTML string
export function generatePromesHtml(state: GeneratorState, semesterToShow: 1 | 2): string {
  const months = semesterToShow === 1 ? MONTHS_SEM1 : MONTHS_SEM2;
  const targetChapters = state.chapters.filter(ch => ch.semester === semesterToShow);

  let totalCols = months.reduce((acc, m) => acc + m.weeks, 0);

  let content = `
    <h1>Program Semester (PROMES) - Semester ${semesterToShow === 1 ? "Ganjil" : "Genap"}</h1>
    <p style="margin-bottom: 12px; font-size: 10pt; text-align: justify; line-height: 1.4;">
      Matriks pelaksanaan pengajaran didistribusikan secara mingguan dalam kurun semester berjalan. Kolom bernilai warna hijau mengindikasikan pembelajaran aktif, sementara kolom bertulis 'S' mengindikasikan Asesmen Sumatif Bab.
    </p>
    
    <table style="margin-bottom: 25px; table-layout: fixed; width: 100%; border-collapse: collapse;">
      <thead>
        <tr>
          <th rowspan="2" style="width: 25%; text-align: center; font-size: 8.5pt;">Materi Pembelajaran (Bab)</th>
          <th rowspan="2" style="width: 6%; text-align: center; font-size: 8.5pt;">Alokasi JP</th>
          <th rowspan="2" style="width: 5%; text-align: center; font-size: 8.5pt;">PBM/Sum</th>
          <th colspan="${months.length}" style="text-align: center; font-size: 8.5pt;">Bulan dan Minggu Efektif</th>
        </tr>
        <tr>
  `;

  // Month names
  months.forEach(m => {
    content += `<th colspan="${m.weeks}" style="text-align: center; font-size: 8.5pt; padding: 2px;">${m.name}</th>`;
  });

  content += `
        </tr>
        <tr>
          <th style="font-size: 8pt; background-color: #0d9488;">Detail Distribusi</th>
          <th style="font-size: 8pt; background-color: #0d9488;">Total</th>
          <th style="font-size: 8pt; background-color: #0d9488;">Jenis</th>
  `;

  // Week markers (M1 - M4)
  months.forEach(m => {
    for (let w = 1; w <= m.weeks; w++) {
      content += `<th style="text-align: center; font-size: 7.5pt; background-color: #3f3f46; padding: 2px; color: white;">M${w}</th>`;
    }
  });

  content += `
        </tr>
      </thead>
      <tbody>
  `;

  // Distribute weeks sequentially for target chapters
  let currentAssignedWeek = 0;

  targetChapters.forEach((ch) => {
    const totalJp = ch.weeks * ch.jp;
    const pbmRowJp = totalJp - ch.assessmentJp;

    // 1st row: PBM (Proses Belajar Mengajar)
    content += `
      <tr>
        <td style="font-size: 8.5pt; font-weight: bold; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${ch.title.split(":")[0]} - Belajar</td>
        <td style="text-align: center; font-size: 8.5pt;">${pbmRowJp} JP</td>
        <td style="text-align: center; font-size: 8pt; color: #047857; font-weight: bold;">PBM</td>
    `;

    // Fill PBM active boxes
    for (let colIdx = 0; colIdx < totalCols; colIdx++) {
      const active = colIdx >= currentAssignedWeek && colIdx < (currentAssignedWeek + ch.weeks - 1);
      if (active) {
        content += `<td style="background-color: #D1FAE5; text-align: center; font-size: 8pt; color: #047857; font-weight: bold;">✓</td>`;
      } else {
        content += `<td></td>`;
      }
    }
    content += `</tr>`;

    // 2nd row: Sumatif Assessment (Evaluasi Sumatif)
    content += `
      <tr>
        <td style="font-size: 8.5pt; font-style: italic; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${ch.title.split(":")[0]} - Penilaian Sumatif</td>
        <td style="text-align: center; font-size: 8.5pt;">${ch.assessmentJp} JP</td>
        <td style="text-align: center; font-size: 8pt; color: #b91c1c; font-weight: bold;">Sum</td>
    `;

    // Fill Sumatif assessments (typically triggers in the last week of the chapter)
    const sumatifColIdx = currentAssignedWeek + ch.weeks - 1;
    for (let colIdx = 0; colIdx < totalCols; colIdx++) {
      if (colIdx === sumatifColIdx) {
        content += `<td style="background-color: #FEE2E2; text-align: center; font-size: 8pt; color: #b91c1c; font-weight: bold;">S</td>`;
      } else {
        content += `<td></td>`;
      }
    }
    content += `</tr>`;

    currentAssignedWeek += ch.weeks;
  });

  content += `
      </tbody>
    </table>
  `;

  return content;
}

// Generate Kriteria Ketuntasan Tujuan Pembelajaran (KKTP) HTML string
export function generateKktpHtml(state: GeneratorState): string {
  let content = `
    <h1>Kriteria Ketuntasan Tujuan Pembelajaran (KKTP) Edisi KBC</h1>
    <p style="margin-bottom: 12px; font-size: 10pt; text-align: justify; line-height: 1.4;">
      KKTP ini tidak melulu menilai ketuntasan aspek kognitif, melainkan juga menakar pemahaman afektif, respon kesantunan, serta rasa cinta kasih siswa melalui instrumen interval nilai deskriptif.
    </p>
    <table style="margin-bottom: 25px;">
      <thead>
        <tr>
          <th style="width: 15%; text-align: center;">Interval Skor</th>
          <th style="width: 20%; text-align: center;">Kriteria Ketuntasan</th>
          <th style="width: 65%;">Rincian Deskripsi Sikap, Afektif & Kognitif (Kurikulum Berbasis Cinta)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="text-align: center; font-weight: bold; background-color: #FEF2F2; color: #991B1B;">0 - 40%</td>
          <td style="text-align: center; font-weight: bold; background-color: #FEF2F2; color: #991B1B;">Belum Mencapai Ketuntasan</td>
          <td>Peserta didik belum menguasai konsep dasar materi, menunjukkan sikap pasif, serta belum menunjukkan kebiasaan empati/adab islami kelas. Diperlukan intervensi remedial individual yang intensif dengan model pendampingan personal penuh kasih sayang.</td>
        </tr>
        <tr>
          <td style="text-align: center; font-weight: bold; background-color: #FFFBEB; color: #92400E;">41 - 60%</td>
          <td style="text-align: center; font-weight: bold; background-color: #FFFBEB; color: #92400E;">Belum Tuntas (Remedial Sebagian)</td>
          <td>Peserta didik telah memahami bab secara garis besar, mulai menumbuhkan rasa peduli serta adab sopan santun namun masih labil dalam implementasi harian kelas. Pembimbingan dilakukan lewat mentor sebaya (Peer-tutoring).</td>
        </tr>
        <tr>
          <td style="text-align: center; font-weight: bold; background-color: #ECFDF5; color: #065F46;">61 - 80%</td>
          <td style="text-align: center; font-weight: bold; background-color: #ECFDF5; color: #065F46;">Sudah Tuntas (Sangat Layak)</td>
          <td>Peserta didik menguasai materi secara mumpuni, menunjukkan karakter kepedulian yang konsisten, menjaga ucapan yang santun serta mengutamakan harmoni cinta kasih di madrasah. Siap menempuh materi berikutnya secara reguler.</td>
        </tr>
        <tr>
          <td style="text-align: center; font-weight: bold; background-color: #F0FDF4; color: #166534;">81 - 100%</td>
          <td style="text-align: center; font-weight: bold; background-color: #F0FDF4; color: #166534;">Sangat Baik (Lulus Pengayaan)</td>
          <td>Peserta didik menunjukkan kemampuan istimewa, mandiri menganalisis problematika, serta menjadi teladan ukhuwah islamiyah dalam moderasi beragama penuh cinta. Berhak mendapatkan materi pengayaan/studi kasus tingkat lanjut.</td>
        </tr>
      </tbody>
    </table>
  `;
  return content;
}

// Generate Alokasi & Rekapitulasi HTML string
export function generateAlokasiHtml(state: GeneratorState): string {
  let totalWeeks = 0;
  let totalJp = 0;
  let totalSumatifJp = 0;

  state.chapters.forEach(ch => {
    totalWeeks += ch.weeks;
    totalJp += (ch.weeks * ch.jp);
    totalSumatifJp += ch.assessmentJp;
  });

  const pbmJp = totalJp - totalSumatifJp;

  let content = `
    <h1>Rekapitulasi Jam Pelajaran & Asesmen Pembelajaran</h1>
    <p style="margin-bottom: 12px; font-size: 10pt; text-align: justify; line-height: 1.4;">
      Tabulasi ini merangkum seluruh pembagian jam pelajaran guna audit administrasi madrasah untuk menjamin kesesuaian jam mengajar guru dengan standar Kementerian Agama.
    </p>
    <table style="margin-bottom: 25px;">
      <thead>
        <tr>
          <th>Kategori Jam Pertemuan</th>
          <th style="text-align: center;">Jumlah Jam Pelajaran (JP)</th>
          <th style="text-align: center;">Persentase (%)</th>
          <th>Keterangan Deskriptif Operasional</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Proses Belajar Aktif (Tatap Muka kognitif & KBC)</strong></td>
          <td style="text-align: center; font-weight: bold;">${pbmJp} JP</td>
          <td style="text-align: center;">${((pbmJp / totalJp) * 100).toFixed(1)}%</td>
          <td>Fokus internalisasi materi bab, aktivitas kelompok cinta kasih, dan praktik sosiologis siswa.</td>
        </tr>
        <tr>
          <td><strong>Asesmen Sumatif Bab & Semester</strong></td>
          <td style="text-align: center; font-weight: bold; color: #b91c1c;">${totalSumatifJp} JP</td>
          <td style="text-align: center; color: #b91c1c;">${((totalSumatifJp / totalJp) * 100).toFixed(1)}%</td>
          <td>Pelaksanaan asesmen objektif guna menilik penguasaan standar kompetensi belajar.</td>
        </tr>
        <tr style="background-color: #F0FDF4; font-weight: bold;">
          <td>Total Jam Pelajaran Efektif Setahun</td>
          <td style="text-align: center; color: #047857;">${totalJp} JP</td>
          <td style="text-align: center; color: #047857;">100.0%</td>
          <td>Sesuai regulasi BSKAP 2025 dan Standar Kemenag RI jenjang ${state.jenjang}.</td>
        </tr>
      </tbody>
    </table>
  `;
  return content;
}


// Master Export Function that combines all tabs into a single exportable .doc/docx Word file
export function exportCompleteDocumentToDoc(state: GeneratorState): void {
  const cpList = state.customCps || getCpElements(state.jenjang, state.selectedGrade, state.selectedSubject);
  
  const cpContent = generateCpHtml(state, cpList);
  const tpContent = generateTpHtml(state, cpList);
  const atpContent = generateAtpHtml(state);
  const protaContent = generateProtaHtml(state);
  const promesContent1 = generatePromesHtml(state, 1);
  const promesContent2 = generatePromesHtml(state, 2);
  const kktpContent = generateKktpHtml(state);
  const alokasiContent = generateAlokasiHtml(state);

  const finalHtmlString = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8">
      <title>EduGen Pro - Kurikulum Berbasis Cinta</title>
      <!--[if gte mso 9]><xml>
       <o:DocumentProperties>
        <o:Author>EduGen Pro - Edisi KBC</o:Author>
        <o:Template>Normal</o:Template>
       </o:DocumentProperties>
       <w:WordDocument>
        <w:View>Print</w:View>
        <w:Zoom>100</w:Zoom>
       </w:WordDocument>
      </xml><![endif]-->
      <style>
        @page {
          size: 21cm 29.7cm; /* A4 size */
          margin: 2cm 2cm 2cm 2cm;
        }
        body {
          font-family: 'Calibri', 'Segoe UI', 'Arial', sans-serif;
          color: #1f2937;
          line-height: 1.4;
          font-size: 11pt;
        }
        .header-box {
          border: 2px solid #047857;
          padding: 15px;
          background-color: #F0FDF4;
          margin-bottom: 20px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
          margin-bottom: 20px;
        }
        th {
          background-color: #047857 !important;
          color: #ffffff !important;
          text-align: left;
          padding: 8px;
          border: 1px solid #71717a;
          font-size: 10pt;
          font-weight: bold;
        }
        td {
          padding: 8px;
          border: 1px solid #a1a1aa;
          font-size: 9.5pt;
          vertical-align: top;
        }
        h1 {
          font-size: 15pt;
          color: #047857;
          margin-top: 25pt;
          margin-bottom: 8pt;
          border-bottom: 2px solid #047857;
          padding-bottom: 4px;
          page-break-before: always;
        }
        h1.first {
          page-break-before: avoid !important;
          margin-top: 10pt;
        }
        .kbc-insersi {
          background-color: #ECFDF5;
          border-left: 3px solid #10B981;
          font-size: 9pt;
        }
        hr {
          border: 0;
          border-top: 1px solid #d1d5db;
          margin: 15px 0;
        }
      </style>
    </head>
    <body>
      <div class="Section1">
        <!-- Main Document Header -->
        ${generateDocIdentityHeader(state, "PROGRAM PERANGKAT AJAR LENGKAP")}
        
        <!-- CP Tab -->
        ${cpContent}
        
        <!-- TP Tab -->
        ${tpContent}
        
        <!-- ATP Tab -->
        ${atpContent}

        <!-- PROTA Tab -->
        ${protaContent}
        
        <!-- PROMES Tab SEMESTER 1 -->
        ${promesContent1}

        <!-- PROMES Tab SEMESTER 2 -->
        ${promesContent2}
        
        <!-- KKTP Tab -->
        ${kktpContent}
        
        <!-- ALOKASI Tab -->
        ${alokasiContent}

        <!-- Document Signatures -->
        ${generateDocSignatures(state)}
      </div>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff' + finalHtmlString], {
    type: 'application/msword'
  });

  const subjects = getSubjects(state.jenjang);
  const subjectName = subjects.find(s => s.id === state.selectedSubject)?.name || state.selectedSubject;
  const fileName = `EduGen_Pro_KBC_${state.jenjang}_${subjectName.replace(/\s+/g, "_")}.doc`;

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Individual Doc Exporter: PROTA, PROMES, KKTP
export function exportIndividualDocToDoc(state: GeneratorState, type: "prota" | "promes" | "kktp"): void {
  let innerHtmlContent = "";
  let title = "";

  if (type === "prota") {
    title = "Program Tahunan (PROTA)";
    innerHtmlContent = generateProtaHtml(state);
  } else if (type === "promes") {
    title = "Program Semester (PROMES)";
    innerHtmlContent = generatePromesHtml(state, 1) + "<br/><br/>" + generatePromesHtml(state, 2);
  } else if (type === "kktp") {
    title = "Kriteria Ketuntasan Tujuan Pembelajaran (KKTP)";
    innerHtmlContent = generateKktpHtml(state);
  }

  const finalHtmlString = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8">
      <title>EduGen Pro - ${title}</title>
      <!--[if gte mso 9]><xml>
       <o:DocumentProperties>
        <o:Author>EduGen Pro - Edisi KBC</o:Author>
        <o:Template>Normal</o:Template>
       </o:DocumentProperties>
       <w:WordDocument>
        <w:View>Print</w:View>
        <w:Zoom>100</w:Zoom>
       </w:WordDocument>
      </xml><![endif]-->
      <style>
        @page {
          size: 21cm 29.7cm; /* A4 size */
          margin: 2cm 2cm 2cm 2cm;
        }
        body {
          font-family: 'Calibri', 'Segoe UI', 'Arial', sans-serif;
          color: #1f2937;
          line-height: 1.4;
          font-size: 11pt;
        }
        .header-box {
          border: 2px solid #047857;
          padding: 15px;
          background-color: #F0FDF4;
          margin-bottom: 20px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
          margin-bottom: 20px;
        }
        th {
          background-color: #047857 !important;
          color: #ffffff !important;
          text-align: left;
          padding: 8px;
          border: 1px solid #71717a;
          font-size: 10pt;
          font-weight: bold;
        }
        td {
          padding: 8px;
          border: 1px solid #a1a1aa;
          font-size: 9.5pt;
          vertical-align: top;
        }
        h1 {
          font-size: 15.0pt;
          color: #047857;
          margin-top: 20pt;
          margin-bottom: 8pt;
          border-bottom: 2px solid #047857;
          padding-bottom: 4px;
        }
        h1.first {
          page-break-before: avoid !important;
          margin-top: 10pt;
        }
        .kbc-insersi {
          background-color: #ECFDF5;
          border-left: 3px solid #10B981;
          font-size: 9pt;
        }
        hr {
          border: 0;
          border-top: 1px solid #d1d5db;
          margin: 15px 0;
        }
      </style>
    </head>
    <body>
      <div class="Section1">
        ${generateDocIdentityHeader(state, title)}
        ${innerHtmlContent.replace('h1 class="first"', 'h1 class="first"')}
        ${generateDocSignatures(state)}
      </div>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff' + finalHtmlString], {
    type: 'application/msword'
  });

  const subjects = getSubjects(state.jenjang);
  const subjectName = subjects.find(s => s.id === state.selectedSubject)?.name || state.selectedSubject;
  const fileName = `EduGen_Pro_KBC_${type.toUpperCase()}_${state.jenjang}_${subjectName.replace(/\s+/g, "_")}.doc`;

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
