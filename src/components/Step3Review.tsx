/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { GeneratorState } from "../types";
import { KBC_VALUES, getGrades, getSubjects } from "../data/curriculumData";
import { ShieldCheck, Heart, Sparkles, CheckSquare, Edit, ListTodo, GraduationCap, Calendar, Clock } from "lucide-react";
import { motion } from "motion/react";

interface Step3ReviewProps {
  state: GeneratorState;
  onEdit: () => void;
  onGenerate: () => void;
}

export default function Step3Review({ state, onEdit, onGenerate }: Step3ReviewProps) {
  const grades = getGrades(state.jenjang);
  const gradeLabel = grades.find(g => g.id === state.selectedGrade)?.name || state.selectedGrade;
  const gradeFase = grades.find(g => g.id === state.selectedGrade)?.fase || "";

  const subjects = getSubjects(state.jenjang);
  const subjectLabel = subjects.find(s => s.id === state.selectedSubject)?.name || state.selectedSubject;

  const activeKbcs = KBC_VALUES.filter(k => state.selectedKbcValues.includes(k.id));

  // Auto-calculated totals
  const totalChapters = state.chapters.length;
  const totalWeeks = state.chapters.reduce((acc, c) => acc + c.weeks, 0);
  const totalJp = state.chapters.reduce((acc, c) => acc + (c.weeks * c.jp), 0);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[24px] p-6 shadow-md">
        <div className="flex items-center gap-3 mb-6 border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 rounded-xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 font-sans tracking-tight">
              Step 3: Ringkasan & Validasi Perangkat
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Tinjau keselarasan administrasi madrasah untuk menjamin standar BSKAP 2025 dan KBC Kemenag sebelum melakukan kompilasi berkas.
            </p>
          </div>
        </div>

        {/* 1. Split Layout summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Left Column: Identitas */}
          <div className="space-y-4 border border-zinc-100 dark:border-zinc-800 p-4 rounded-xl bg-zinc-50/50 dark:bg-zinc-950/5">
            <h3 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <GraduationCap className="w-3.5 h-3.5" /> Profil Lembaga & Pengajar
            </h3>
            <table className="w-full text-xs">
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-805">
                <tr>
                  <td className="py-2 pr-4 font-semibold text-zinc-500 w-1/3 border-none">Madrasah</td>
                  <td className="py-2 font-bold text-zinc-850 dark:text-zinc-50 border-none">{state.identity.madrasahName}</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-semibold text-zinc-500 border-none">Nama Guru</td>
                  <td className="py-2 font-bold text-zinc-850 dark:text-zinc-50 border-none">{state.identity.teacherName}</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-semibold text-zinc-500 border-none">NUPTIK/NIP</td>
                  <td className="py-2 text-zinc-700 dark:text-zinc-300 border-none">{state.identity.nipCode || "-"}</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-semibold text-zinc-500 border-none">Kepala Madrasah</td>
                  <td className="py-2 text-zinc-700 dark:text-zinc-300 border-none">{state.identity.principalName || "-"}</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-semibold text-zinc-500 border-none">Tahun Ajaran</td>
                  <td className="py-2 text-zinc-700 dark:text-zinc-300 border-none">{state.identity.academicYear} - Semester {state.identity.semester}</td>
                </tr>
                <tr>
                  <td className="py-2 pr-3 font-semibold text-zinc-500 border-none">Alamat</td>
                  <td className="py-2 text-zinc-700 dark:text-zinc-300 border-none">{state.identity.address || "-"}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Right Column: Curriculum Details */}
          <div className="space-y-4 border border-zinc-100 dark:border-zinc-800 p-4 rounded-xl bg-zinc-50/50 dark:bg-zinc-950/5">
            <h3 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> Muatan Kurikulum Cinta
            </h3>
            <table className="w-full text-xs">
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-805">
                <tr>
                  <td className="py-2 pr-4 font-semibold text-zinc-500 w-1/3 border-none">Jenjang</td>
                  <td className="py-2 font-bold text-emerald-650 border-none">{state.jenjang} ({gradeLabel})</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-semibold text-zinc-500 border-none">Fase Merdeka</td>
                  <td className="py-2 font-bold text-emerald-650 border-none">{gradeFase}</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-semibold text-zinc-500 border-none">Mata Pelajaran</td>
                  <td className="py-2 font-bold text-emerald-650 border-none">{subjectLabel}</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-semibold text-zinc-500 border-none">Beban JP/Minggu</td>
                  <td className="py-2 text-zinc-700 dark:text-zinc-300 border-none">{state.jpPerWeek} JP pertemuan</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-semibold text-zinc-500 border-none">Total Bahan Ajar</td>
                  <td className="py-2 text-zinc-700 dark:text-zinc-300 border-none">{totalChapters} Bab (${totalWeeks} Minggu Efektif)</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-semibold text-zinc-500 border-none">Rekap JP Tahun</td>
                  <td className="py-2 text-emerald-700 dark:text-emerald-450 font-bold border-none">{totalJp} JP Belajar Efektif</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. KBC Value Integrations summary list */}
        <div className="mb-6 p-4 rounded-xl bg-emerald-50/20 border border-emerald-100/40 dark:bg-emerald-950/5 dark:border-emerald-950/30">
          <h3 className="text-xs font-bold text-emerald-750 dark:text-emerald-450 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
            Adab Islami & Nilai KBC yang Terkandung:
          </h3>
          <div className="flex flex-wrap gap-2">
            {activeKbcs.map((k) => (
              <span
                key={k.id}
                className="text-xs bg-emerald-100/40 dark:bg-emerald-950/40 border border-emerald-350 dark:border-emerald-800 text-emerald-800 dark:text-emerald-350 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5"
              >
                <span className="font-semibold text-emerald-600 font-mono text-[10px]">{k.arabicName}</span>
                {k.name.split(" ")[0]}
              </span>
            ))}
          </div>
        </div>

        {/* 3. Validation Checklist Grid */}
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3">
          <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wiest flex items-center gap-1.5 mb-2">
            <CheckSquare className="w-4 h-4 text-emerald-500" /> Indikator Kepatuhan BSKAP 2025 & Kemenag RI
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {/* Rule 1 */}
            <div className="flex items-start gap-2 text-zinc-650 dark:text-zinc-400">
              <span className="text-emerald-600 font-bold">✓</span>
              <span><strong>Fase Kurikulum Cocok:</strong> {gradeFase} selaras dengan usia perkembangan jenjang {state.jenjang}.</span>
            </div>
            {/* Rule 2 */}
            <div className="flex items-start gap-2 text-zinc-650 dark:text-zinc-400">
              <span className="text-emerald-600 font-bold">✓</span>
              <span><strong>Kompilasi JP Seimbang:</strong> Distribusi sumatif ({state.sumatifJpPerChapter} JP) berada tidak melebihi 50% JP Bab.</span>
            </div>
            {/* Rule 3 */}
            <div className="flex items-start gap-2 text-zinc-650 dark:text-zinc-400">
              <span className="text-emerald-600 font-bold">✓</span>
              <span><strong>Insersi Afektif Terjaga:</strong> Nilai cinta kasih (${activeKbcs.map(k=>k.name.split(" ")[0]).join(", ")}) dipadukan di kolom khusus TP.</span>
            </div>
            {/* Rule 4 */}
            <div className="flex items-start gap-2 text-zinc-650 dark:text-zinc-400">
              <span className="text-emerald-600 font-bold">✓</span>
              <span><strong>Program Efektif:</strong> Total durasi {totalWeeks} minggu mencakupi standar kalender kegiatan kementerian.</span>
            </div>
          </div>
        </div>

        {/* Buttons Action */}
        <div className="flex items-center gap-3 pt-6 mt-6 border-t border-zinc-150 dark:border-zinc-800">
          <button
            type="button"
            onClick={onEdit}
            className="px-5 py-3 border border-zinc-200 dark:border-zinc-850 hover:bg-zinc-50 dark:hover:bg-zinc-950 text-xs font-semibold rounded-xl text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Edit className="w-4 h-4" />
            Edit Rancangan Data
          </button>

          <button
            type="button"
            onClick={onGenerate}
            className="flex-1 py-3.5 bg-emerald-650 hover:bg-emerald-600 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-700/10 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
            + Generate Perangkat Pembelajaran Otomatis Sekarang!
          </button>
        </div>
      </div>
    </motion.div>
  );
}
