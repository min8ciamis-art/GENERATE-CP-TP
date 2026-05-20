/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { GeneratorState, JenjangType, Chapter, KbcValue } from "../types";
import { KBC_VALUES, getGrades, getSubjects, getDefaultChapters } from "../data/curriculumData";
import { Layers, CheckCircle2, Heart, Plus, Trash2, ArrowLeft, ArrowRight, BookOpen, Clock, CalendarDays, HelpCircle } from "lucide-react";
import { motion } from "motion/react";

interface Step2FormProps {
  state: GeneratorState;
  onChange: (updated: Partial<GeneratorState>) => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function Step2Form({ state, onChange, onPrev, onNext }: Step2FormProps) {
  const grades = getGrades(state.jenjang);
  const subjects = getSubjects(state.jenjang);

  // Monitor Jenjang changes to reset grade, maps, and chapters with logical defaults
  const handleJenjangChange = (newJenjang: JenjangType) => {
    const nextGrades = getGrades(newJenjang);
    const nextSubjects = getSubjects(newJenjang);
    const defaultGrade = nextGrades[0]?.id || "";
    const defaultSubject = nextSubjects[0]?.id || "";
    const nextChapters = getDefaultChapters(newJenjang, defaultGrade, defaultSubject);

    onChange({
      jenjang: newJenjang,
      selectedGrade: defaultGrade,
      selectedSubject: defaultSubject,
      chapters: nextChapters,
      // Default RA typical schedules
      jpPerWeek: newJenjang === "RA" ? 8 : (newJenjang === "MI" ? 4 : 4),
      effectiveWeeks: 18
    });
  };

  // Monitor Subject changes to refresh chapters
  const handleSubjectChange = (newSubject: string) => {
    const nextChapters = getDefaultChapters(state.jenjang, state.selectedGrade, newSubject);
    onChange({
      selectedSubject: newSubject,
      chapters: nextChapters
    });
  };

  // Toggle KBC checkbox selections
  const handleKbcToggle = (id: string) => {
    const list = [...state.selectedKbcValues];
    const idx = list.indexOf(id);
    if (idx >= 0) {
      // Must maintain at least one KBC value
      if (list.length > 1) {
        list.splice(idx, 1);
      }
    } else {
      list.push(id);
    }
    onChange({ selectedKbcValues: list });
  };

  // Dynamic row changes for chapters table
  const updateChapterField = (id: string, field: keyof Chapter, value: any) => {
    const nextChapters = state.chapters.map((ch) => {
      if (ch.id === id) {
        return { ...ch, [field]: value };
      }
      return ch;
    });
    onChange({ chapters: nextChapters });
  };

  const addChapter = (semester: 1 | 2) => {
    const semChapters = state.chapters.filter((ch) => ch.semester === semester);
    const nextNum = semChapters.length > 0 ? Math.max(...semChapters.map(c => c.number)) + 1 : 1;
    
    const newCh: Chapter = {
      id: `custom_${semester}_${Date.now()}`,
      semester,
      number: nextNum,
      title: `Bab ${nextNum}: Topik Pembelajaran KBC Baru Terkait Karakter Mulia`,
      weeks: 4,
      jp: state.jpPerWeek,
      assessmentJp: state.sumatifJpPerChapter
    };

    onChange({
      chapters: [...state.chapters, newCh]
    });
  };

  const deleteChapter = (id: string) => {
    if (state.chapters.length <= 2) {
      alert("Madrasah minimal harus memiliki 2 Bab pembelajaran untuk program tahunan.");
      return;
    }
    onChange({
      chapters: state.chapters.filter((ch) => ch.id !== id)
    });
  };

  // Organize chapters into semester structures
  const semester1Chapters = state.chapters.filter(ch => ch.semester === 1).sort((a,b) => a.number - b.number);
  const semester2Chapters = state.chapters.filter(ch => ch.semester === 2).sort((a,b) => a.number - b.number);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Selector Container */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[24px] p-6 shadow-md">
        <div className="flex items-center gap-3 mb-6 border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 rounded-xl">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 font-sans tracking-tight">
              Step 2: Jenjang, Mata Pelajaran, & Insersi KBC
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Pilih pilar operasional kurikulum, mata pelajaran, serta nilai luhur Kurikulum Berbasis Cinta (KBC) yang ingin ditanamkan.
            </p>
          </div>
        </div>

        {/* 1. Pemilihan Jenjang */}
        <div className="mb-6">
          <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 block mb-3">
            Pilih Jenjang Lembaga Pendidikan:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(["RA", "MI", "MTs", "MA"] as JenjangType[]).map((j) => {
              const active = state.jenjang === j;
              return (
                <button
                  key={j}
                  type="button"
                  onClick={() => handleJenjangChange(j)}
                  className={`py-3 px-4 rounded-xl border font-bold text-sm transition-all text-center flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    active
                      ? "bg-emerald-600 border-emerald-600 text-white shadow-sm shadow-emerald-600/10"
                      : "bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-700 dark:text-zinc-350"
                  }`}
                >
                  <span className="text-base">{j}</span>
                  <span className="text-[10px] opacity-75 font-normal">
                    {j === "RA" ? "Raudhatul Athfal" : j === "MI" ? "Madrasah Ibtidaiyah" : j === "MTs" ? "Madrasah Tsanawiyah" : "Madrasah Aliyah"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Grade & Subject Selector Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Kelas & Fase Selector */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-500" />
              Kelas & Fase
            </label>
            <select
              value={state.selectedGrade}
              onChange={(e) => onChange({ selectedGrade: e.target.value })}
              className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm text-zinc-900 dark:text-zinc-100"
            >
              {grades.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name} ({g.fase})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-zinc-500">
              * Fase otomatis tersinkronisasi menurut Regulasi BSKAP Tahun 2025 Madrasah.
            </p>
          </div>

          {/* Mata Pelajaran Selector */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-500" />
              Mata Pelajaran (Kurikulum Kemenag)
            </label>
            <select
              value={state.selectedSubject}
              onChange={(e) => handleSubjectChange(e.target.value)}
              className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm text-zinc-900 dark:text-zinc-100"
            >
              <optgroup label="Mapel Keagamaan Khas Kemenag / RA">
                {subjects.filter(s => s.category === "PAI/Bahasa Arab").map((sub) => (
                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))}
              </optgroup>
              <optgroup label="Mapel Umum / Jati Diri">
                {subjects.filter(s => s.category === "Umum").map((sub) => (
                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>

        {/* 3. KBC Core Values - Interactive Tiles */}
        <div className="border border-zinc-100 dark:border-zinc-800 rounded-xl p-4 bg-emerald-50/20 dark:bg-emerald-950/5">
          <label className="text-sm font-bold text-emerald-850 dark:text-emerald-450 flex items-center gap-2 mb-3">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500 animate-pulse" />
            Integrasi Nilai Kurikulum Berbasis Cinta (KBC): *
          </label>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mb-4">
            Centang nilai-nilai KBC Kemenag di bawah ini guna diinsersikan secara cerdas ke dalam format TP (Tujuan Pembelajaran), ATP, dan deskripsi KKTP.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {KBC_VALUES.map((kbc) => {
              const selected = state.selectedKbcValues.includes(kbc.id);
              return (
                <div
                  key={kbc.id}
                  onClick={() => handleKbcToggle(kbc.id)}
                  className={`p-3 rounded-xl border cursor-pointer select-none transition-all flex flex-col gap-1.5 hover:shadow-sm ${
                    selected
                      ? "border-emerald-600 dark:border-emerald-500 bg-emerald-100/40 dark:bg-emerald-950/20 ring-1 ring-emerald-500"
                      : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-zinc-900 dark:text-zinc-50 flex items-center gap-1.5">
                      {kbc.name}
                    </span>
                    <span className="text-[11px] font-mono text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded font-bold">
                      {kbc.arabicName}
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2">
                    {kbc.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Numeric Setting Counters */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[24px] p-6 shadow-md">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 mb-4 flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <Clock className="w-4 h-4 text-emerald-500" />
          Volume Beban Pembelajaran Tahunan
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* JP per Week */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-650 dark:text-zinc-400">
              Beban Jam (JP) / Minggu
            </label>
            <input
              type="number"
              min={1}
              max={12}
              value={state.jpPerWeek}
              onChange={(e) => onChange({ jpPerWeek: parseInt(e.target.value) || 2 })}
              className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Effective Weeks */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-650 dark:text-zinc-400">
              Minggu Efektif / Semester
            </label>
            <input
              type="number"
              min={10}
              max={22}
              value={state.effectiveWeeks}
              onChange={(e) => onChange({ effectiveWeeks: parseInt(e.target.value) || 18 })}
              className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* TP per Bab */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-650 dark:text-zinc-400">
              Jumlah TP Formula ABCD / Bab
            </label>
            <input
              type="number"
              min={1}
              max={5}
              value={state.tpPerChapter}
              onChange={(e) => onChange({ tpPerChapter: parseInt(e.target.value) || 2 })}
              className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* JP Sumatif / Bab */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-650 dark:text-zinc-400">
              Beban JP Penilaian / Bab
            </label>
            <input
              type="number"
              min={1}
              max={4}
              value={state.sumatifJpPerChapter}
              onChange={(e) => onChange({ sumatifJpPerChapter: parseInt(e.target.value) || 2 })}
              className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Chapters Table Editor */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[24px] p-6 shadow-md space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-emerald-500" />
              Kelola Distribusi Bab & Materi Pembelajaran
            </h3>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Modifikasi judul bab, atau tetapkan durasi pengajaran (minggu) tiap bab secara fleksibel.
            </p>
          </div>
        </div>

        {/* 1st Semester Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1 rounded-lg">
              Semester 1 (Ganjil)
            </span>
            <button
              type="button"
              onClick={() => addChapter(1)}
              className="px-3 py-1.5 bg-zinc-55 dark:bg-zinc-800 hover:bg-zinc-100 text-xs font-semibold rounded-lg text-emerald-600 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah Bab S1
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-zinc-100 dark:border-zinc-800">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-800 text-zinc-500">
                  <th className="p-3 w-16 text-center">No Bab</th>
                  <th className="p-3">Judul Bab Pembelajaran / Bahan Pengajaran KBC</th>
                  <th className="p-3 w-28 text-center">Durasi (Minggu)</th>
                  <th className="p-3 w-24 text-center">JP Mingguan</th>
                  <th className="p-3 w-16 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {semester1Chapters.map((ch) => (
                  <tr key={ch.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-950/10">
                    <td className="p-3 text-center">
                      <input
                        type="number"
                        min={1}
                        value={ch.number}
                        onChange={(e) => updateChapterField(ch.id, "number", parseInt(e.target.value) || 1)}
                        className="w-10 text-center font-bold text-zinc-900 dark:text-white bg-transparent border-b border-zinc-200 dark:border-zinc-850 focus:border-emerald-500 outline-none"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        value={ch.title}
                        onChange={(e) => updateChapterField(ch.id, "title", e.target.value)}
                        className="w-full text-zinc-800 dark:text-zinc-250 bg-transparent border-b border-zinc-200 dark:border-zinc-850 focus:border-emerald-500 outline-none font-medium"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        min={2}
                        max={10}
                        value={ch.weeks}
                        onChange={(e) => updateChapterField(ch.id, "weeks", parseInt(e.target.value) || 2)}
                        className="w-14 mx-auto text-center font-semibold bg-transparent border-b border-zinc-200 dark:border-zinc-850 focus:border-emerald-500 outline-none"
                      />
                    </td>
                    <td className="p-3 text-center">
                      <span className="font-semibold text-zinc-500">{ch.jp} JP</span>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        type="button"
                        onClick={() => deleteChapter(ch.id)}
                        className="p-1.5 text-rose-650 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2nd Semester Section */}
        <div className="space-y-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1 rounded-lg">
              Semester 2 (Genap)
            </span>
            <button
              type="button"
              onClick={() => addChapter(2)}
              className="px-3 py-1.5 bg-zinc-55 dark:bg-zinc-800 hover:bg-zinc-100 text-xs font-semibold rounded-lg text-emerald-600 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah Bab S2
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-zinc-100 dark:border-zinc-800">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-800 text-zinc-500">
                  <th className="p-3 w-16 text-center">No Bab</th>
                  <th className="p-3">Judul Bab Pembelajaran / Bahan Pengajaran KBC</th>
                  <th className="p-3 w-28 text-center">Durasi (Minggu)</th>
                  <th className="p-3 w-24 text-center">JP Mingguan</th>
                  <th className="p-3 w-16 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {semester2Chapters.map((ch) => (
                  <tr key={ch.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-950/10">
                    <td className="p-3 text-center">
                      <input
                        type="number"
                        min={1}
                        value={ch.number}
                        onChange={(e) => updateChapterField(ch.id, "number", parseInt(e.target.value) || 1)}
                        className="w-10 text-center font-bold text-zinc-900 dark:text-white bg-transparent border-b border-zinc-200 dark:border-zinc-850 focus:border-emerald-500 outline-none"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        value={ch.title}
                        onChange={(e) => updateChapterField(ch.id, "title", e.target.value)}
                        className="w-full text-zinc-800 dark:text-zinc-250 bg-transparent border-b border-zinc-200 dark:border-zinc-850 focus:border-emerald-500 outline-none font-medium"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        min={2}
                        max={10}
                        value={ch.weeks}
                        onChange={(e) => updateChapterField(ch.id, "weeks", parseInt(e.target.value) || 2)}
                        className="w-14 mx-auto text-center font-semibold bg-transparent border-b border-zinc-200 dark:border-zinc-850 focus:border-emerald-500 outline-none"
                      />
                    </td>
                    <td className="p-3 text-center">
                      <span className="font-semibold text-zinc-500">{ch.jp} JP</span>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        type="button"
                        onClick={() => deleteChapter(ch.id)}
                        className="p-1.5 text-rose-650 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 rounded-xl border">
        <button
          type="button"
          onClick={onPrev}
          className="px-5 py-2.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-zinc-700 dark:text-zinc-300 font-semibold rounded-xl text-sm flex items-center gap-2 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kelebihan / Identitas
        </button>

        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-sm flex items-center gap-2 cursor-pointer shadow-sm shadow-emerald-600/10 transition-colors"
        >
          Lanjut ke Ringkasan Ulasan
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
