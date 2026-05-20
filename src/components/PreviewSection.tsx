/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { GeneratorState, CpElement, KbcValue } from "../types";
import { KBC_VALUES, getCpElements, getGrades, getSubjects } from "../data/curriculumData";
import { exportCompleteDocumentToDoc, exportIndividualDocToDoc } from "../utils/docxExporter";
import { ArrowLeft, Download, FileText, Calendar, Table, CheckSquare, BarChart, RefreshCw, Plus, Trash2, Edit } from "lucide-react";
import { motion } from "motion/react";

interface PreviewSectionProps {
  state: GeneratorState;
  onChange?: (updated: Partial<GeneratorState>) => void;
  onReset: () => void;
}

// Month structure for Semester matrix display
const MONTHS_S1 = [
  { name: "Juli", weeks: 4 },
  { name: "Agustus", weeks: 4 },
  { name: "September", weeks: 4 },
  { name: "Oktober", weeks: 4 },
  { name: "November", weeks: 4 },
  { name: "Desember", weeks: 4 }
];

const MONTHS_S2 = [
  { name: "Januari", weeks: 4 },
  { name: "Februari", weeks: 4 },
  { name: "Maret", weeks: 4 },
  { name: "April", weeks: 4 },
  { name: "Mei", weeks: 4 },
  { name: "Juni", weeks: 4 }
];

export default function PreviewSection({ state, onChange, onReset }: PreviewSectionProps) {
  const [activeTab, setActiveTab] = useState<"cp" | "tp" | "atp" | "protoprom" | "kktp" | "alokasi">("cp");
  const [promesSem, setPromesSem] = useState<1 | 2>(1);

  const grades = getGrades(state.jenjang);
  const gradeLabel = grades.find(g => g.id === state.selectedGrade)?.name || state.selectedGrade;
  
  const subjects = getSubjects(state.jenjang);
  const subjectLabel = subjects.find(s => s.id === state.selectedSubject)?.name || state.selectedSubject;
  const currentSubjectObj = subjects.find(s => s.id === state.selectedSubject);
  const isAgama = currentSubjectObj ? currentSubjectObj.category === "PAI/Bahasa Arab" : false;

  const cpList = state.customCps || getCpElements(state.jenjang, state.selectedGrade, state.selectedSubject);
  const selectedKbc = KBC_VALUES.filter(k => state.selectedKbcValues.includes(k.id));

  // State variables for Capaian Pembelajaran inline editing
  const [editingCpIdx, setEditingCpIdx] = useState<number | null>(null);
  const [tempCpElement, setTempCpElement] = useState("");
  const [tempCpDescription, setTempCpDescription] = useState("");

  const handleStartEditCp = (idx: number, cp: CpElement) => {
    setEditingCpIdx(idx);
    setTempCpElement(cp.element);
    setTempCpDescription(cp.description);
  };

  const handleSaveCp = (idx: number) => {
    if (!onChange) return;
    const currentList = [...cpList];
    currentList[idx] = {
      element: tempCpElement,
      description: tempCpDescription
    };
    onChange({ customCps: currentList });
    setEditingCpIdx(null);
  };

  const handleDeleteCp = (idx: number) => {
    if (!onChange) return;
    const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus elemen Capaian Pembelajaran ini?");
    if (confirmDelete) {
      const currentList = cpList.filter((_, i) => i !== idx);
      onChange({ customCps: currentList });
      if (editingCpIdx === idx) {
        setEditingCpIdx(null);
      }
    }
  };

  const handleAddCp = () => {
    if (!onChange) return;
    const currentList = [...cpList];
    const newCp: CpElement = {
      element: "Pemahaman Konsep - Elemen Baru",
      description: "Menerapkan dan menguraikan kompetensi pokok keagamaan/umum dalam membaca dan memahami kajian relevan."
    };
    const nextList = [...currentList, newCp];
    onChange({ customCps: nextList });
    
    // Auto-focus edit on newly added element
    setEditingCpIdx(nextList.length - 1);
    setTempCpElement(newCp.element);
    setTempCpDescription(newCp.description);
  };

  const handleResetCps = () => {
    if (!onChange) return;
    const confirmReset = window.confirm(
      "Apakah Anda yakin ingin memulihkan seluruh Elemen CP ke standar asli regulasi resmi SK Dirjen Pendis No. 9941 / 2025 (Agama) / BSKAP? Semua kustomisasi Anda untuk mata pelajaran ini akan disetel ulang."
    );
    if (confirmReset) {
      onChange({
        customCps: getCpElements(state.jenjang, state.selectedGrade, state.selectedSubject)
      });
      setEditingCpIdx(null);
    }
  };

  // Totals calculated dynamically
  const totalWeeks = state.chapters.reduce((acc, c) => acc + c.weeks, 0);
  const totalJp = state.chapters.reduce((acc, c) => acc + (c.weeks * c.jp), 0);
  const totalSumatifJp = state.chapters.reduce((acc, c) => acc + c.assessmentJp, 0);
  const pbmJp = totalJp - totalSumatifJp;

  // Tabs structure
  const tabs = [
    { id: "cp", label: "Capaian Pembelajaran (CP)", icon: FileText },
    { id: "tp", label: "Tujuan Pembelajaran (TP)", icon: CheckSquare },
    { id: "atp", label: "Alur Tujuan (ATP)", icon: Table },
    { id: "protoprom", label: "Prota & Promes", icon: Calendar },
    { id: "kktp", label: "KKTP Edisi KBC", icon: CheckSquare },
    { id: "alokasi", label: "Rekap Alokasi JP", icon: BarChart }
  ] as const;

  return (
    <div className="space-y-6">
      {/* 1. Preview Header Badge */}
      <div className="bg-emerald-800 dark:bg-emerald-950 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="bg-emerald-650 text-xs uppercase px-2.5 py-1 rounded-md font-extrabold tracking-wider">
            Hasil Kompilasi Sukses
          </span>
          <h2 className="text-2xl font-extrabold font-sans mt-2 tracking-tight">
            EduGen Perangkat Perangkat Ajar - {subjectLabel}
          </h2>
          <p className="text-sm text-emerald-100 mt-1">
            Lembaga: <strong>{state.identity.madrasahName}</strong> | Kelas/Fase: <strong>{gradeLabel}</strong> | Ajaran: <strong>{state.identity.academicYear}</strong>
          </p>
        </div>

        {/* Start over button quick */}
        <button
          onClick={onReset}
          className="px-4 py-2 bg-emerald-700/60 hover:bg-emerald-750 border border-emerald-500/20 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 self-start md:self-center cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Mulai Ulang Baru
        </button>
      </div>

      {/* 2. Interactive Navigation Horizontal Tabs */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[24px] overflow-hidden shadow-md">
        <div className="flex flex-wrap lg:flex-nowrap gap-1 bg-[#f9fafb] dark:bg-zinc-955/20 border-b border-zinc-200 dark:border-zinc-800 px-4 pt-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-4 py-3.5 font-bold text-xs transition-all whitespace-nowrap cursor-pointer border-b-2 -mb-[1px] ${
                  active
                    ? "border-emerald-600 text-emerald-800 dark:text-emerald-300 bg-white dark:bg-zinc-900"
                    : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content Preview Container */}
        <div className="py-6 px-6 max-h-[500px] overflow-y-auto">
          {activeTab === "cp" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5 text-zinc-800 dark:text-zinc-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border border-zinc-200 dark:border-zinc-808">
                <div>
                  <h3 className="text-base font-extrabold text-zinc-900 dark:text-zinc-50 flex items-center gap-1.5">
                    Capaian Pembelajaran (CP) Elemen - Regulasi Resmi
                  </h3>
                  <p className="text-xs text-zinc-500 leading-relaxed mt-0.5">
                    Pemetaan elemen dan uraian capaian pembelajaran mata pelajaran <strong>{subjectLabel}</strong> tingkat <strong>{gradeLabel}</strong> sesuai acuan kurikulum nasional.
                  </p>
                </div>
                {onChange && (
                  <div className="flex items-center gap-2 self-start sm:self-center flex-wrap">
                    <button
                      type="button"
                      onClick={handleAddCp}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      + Tambah Elemen
                    </button>
                    <button
                      type="button"
                      onClick={handleResetCps}
                      className="px-3 py-1.5 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-zinc-700 dark:text-zinc-300 font-bold text-xs rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                      title="Pulihkan seluruh elemen ke setelan regulasi resmi"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Reset Standar
                    </button>
                  </div>
                )}
              </div>

              {/* Dual-Regulation Interactive References Summary Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* General Curriculum Referencing */}
                <div className={`p-4 rounded-[18px] border transition-all ${!isAgama ? "bg-emerald-50/30 border-emerald-300 dark:bg-emerald-950/20 dark:border-emerald-800/40" : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800/80"}`}>
                  <div className="flex justify-between items-start">
                    <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md ${!isAgama ? "bg-emerald-600 text-white" : "bg-zinc-100 dark:bg-zinc-855 text-zinc-500"}`}>
                      {!isAgama ? "Aktif Digunakan (Mapel Umum)" : "Acuan Mapel Umum"}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs mt-2.5 text-zinc-850 dark:text-zinc-100">Capaian Pembelajaran Mapel Umum</h4>
                  <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
                    Sesuai Keputusan Kepala BSKAP No. 032/H/KR/2024 tentang pembaruan kurikulum nasional madrasah & sekolah umum.
                  </p>
                  <a
                    href="https://drive.google.com/file/d/1r4zWBbhP8Lo3fG30m9htzBbVvHi9qjzW/view?usp=sharing"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 hover:underline"
                  >
                    Buka Dokumen Resmi BSKAP 2024 (PDF) ↗
                  </a>
                </div>

                {/* Islamic / Religious PAI Curriculum Referencing */}
                <div className={`p-4 rounded-[18px] border transition-all ${isAgama ? "bg-emerald-50/30 border-emerald-300 dark:bg-emerald-950/20 dark:border-emerald-800/40" : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800/50"}`}>
                  <div className="flex justify-between items-start">
                    <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md ${isAgama ? "bg-emerald-600 text-white" : "bg-zinc-100 dark:bg-zinc-855 text-zinc-500"}`}>
                      {isAgama ? "Aktif Digunakan (Khas Agama)" : "Acuan Mapel Agama"}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs mt-2.5 text-zinc-850 dark:text-zinc-100">Capaian Pembelajaran Mapel Agama & PAI</h4>
                  <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
                    Sesuai SK Dirjen Pendis Nomor: 9941 / 2025 tentang Capaian Pembelajaran Pendidikan Agama Islam &amp; Bahasa Arab pada Kurikulum Merdeka di Madrasah.
                  </p>
                  <a
                    href="https://drive.google.com/file/d/11vPVH7-e2yBODBTO4ioiBLXuOAkvlj2D/view?usp=sharing"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 hover:underline"
                  >
                    Buka SK Dirjen Pendis No. 9941 / 2025 (PDF) ↗
                  </a>
                </div>
              </div>

              {/* Table CP List elements */}
              <div className="overflow-x-auto rounded-xl border border-zinc-150 dark:border-zinc-808 shadow-xs">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 font-bold">
                      <th className="p-3 w-1/4">Elemen CP</th>
                      <th className="p-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <span>Gagasan & Kompetensi CP {isAgama ? "SK Dirjen Pendis 9941/2025 (Agama)" : "BSKAP 2024 (Umum)"}</span>
                          <a
                            href={isAgama ? "https://drive.google.com/file/d/11vPVH7-e2yBODBTO4ioiBLXuOAkvlj2D/view?usp=sharing" : "https://drive.google.com/file/d/1r4zWBbhP8Lo3fG30m9htzBbVvHi9qjzW/view?usp=sharing"}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-700 dark:text-emerald-350 rounded font-bold text-[9px] transition-all border border-emerald-500/20"
                          >
                            Unduh Lampiran Resmi ↗
                          </a>
                        </div>
                      </th>
                      {onChange && <th className="p-3 w-28 text-center bg-zinc-50 dark:bg-zinc-950">Aksi</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 bg-white dark:bg-zinc-900">
                    {cpList.map((cp, idx) => {
                      const isEditing = editingCpIdx === idx;
                      return (
                        <tr key={idx} className="hover:bg-zinc-50/20 dark:hover:bg-zinc-950/10">
                          <td className="p-3 align-top font-bold text-zinc-900 dark:text-white">
                            {isEditing ? (
                              <input
                                type="text"
                                value={tempCpElement}
                                onChange={(e) => setTempCpElement(e.target.value)}
                                className="w-full px-2 py-1.5 text-xs font-bold bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-zinc-900 dark:text-zinc-100"
                              />
                            ) : (
                              cp.element
                            )}
                          </td>
                          <td className="p-3 leading-relaxed text-zinc-650 dark:text-zinc-400">
                            {isEditing ? (
                              <textarea
                                value={tempCpDescription}
                                onChange={(e) => setTempCpDescription(e.target.value)}
                                rows={5}
                                className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed font-normal text-zinc-900 dark:text-zinc-100"
                              />
                            ) : (
                              <div>{cp.description}</div>
                            )}
                            
                            {!isEditing && (
                              <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                                <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 bg-zinc-100 text-zinc-500 dark:bg-zinc-805 dark:text-zinc-400 rounded">
                                  {isAgama ? "Sumber: SK Dirjen Pendis 9941/2025" : "Sumber: SK BSKAP 032/H/KR/2024"}
                                </span>
                                <a
                                  href={isAgama ? "https://drive.google.com/file/d/11vPVH7-e2yBODBTO4ioiBLXuOAkvlj2D/view?usp=sharing" : "https://drive.google.com/file/d/1r4zWBbhP8Lo3fG30m9htzBbVvHi9qjzW/view?usp=sharing"}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-[9px] text-emerald-700 dark:text-emerald-450 hover:underline font-bold"
                                >
                                  Verifikasi Standar CP ↗
                                </a>
                              </div>
                            )}
                          </td>
                          {onChange && (
                            <td className="p-3 text-center align-top whitespace-nowrap">
                              {isEditing ? (
                                <div className="flex flex-col gap-1.5 justify-center">
                                  <button
                                    type="button"
                                    onClick={() => handleSaveCp(idx)}
                                    className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-semibold rounded-md cursor-pointer flex items-center justify-center gap-1"
                                  >
                                    Simpan
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setEditingCpIdx(null)}
                                    className="px-2 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-650 dark:bg-zinc-800 dark:text-zinc-300 text-[10px] font-semibold rounded-md cursor-pointer"
                                  >
                                    Batal
                                  </button>
                                </div>
                              ) : (
                                <div className="flex flex-col gap-1.5 justify-center">
                                  <button
                                    type="button"
                                    onClick={() => handleStartEditCp(idx, cp)}
                                    className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-350 dark:hover:bg-emerald-950/70 text-[10px] font-semibold rounded-lg cursor-pointer transition-all flex items-center justify-center gap-1"
                                  >
                                    <Edit className="w-3 h-3" />
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteCp(idx)}
                                    className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 dark:hover:bg-rose-950/40 text-[10px] font-semibold rounded-lg cursor-pointer transition-all flex items-center justify-center gap-1"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    Hapus
                                  </button>
                                </div>
                              )}
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === "tp" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                Tujuan Pembelajaran (TP) Terintegrasi Nilai-Nilai KBC
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Tujuan Pembelajaran (TP) di rumuskan menggunakan formula <strong>A (Audience), B (Behavior), C (Condition), D (Degree)</strong>, ditambah integrasi afektif karakter Kurikulum Berbasis Cinta (KBC).
              </p>

              <div className="overflow-x-auto rounded-xl border border-zinc-100 dark:border-zinc-800">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-emerald-800 border-b border-emerald-900 text-white font-bold">
                      <th className="p-3 w-16 text-center">Kode</th>
                      <th className="p-3 w-1/2">Rumusan Tujuan Pembelajaran (ABCD)</th>
                      <th className="p-3 w-2/5 bg-emerald-900 border-l border-emerald-800">Insersi Karakter KBC (Afektif)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {state.chapters.map((ch, chIdx) => {
                      const list = [];
                      for (let i = 1; i <= state.tpPerChapter; i++) {
                        const code = `${state.jenjang === "RA" ? "Fnd" : "TP"}.${ch.semester}.${ch.number}.${i}`;
                        const kbcObj = selectedKbc.length > 0 ? selectedKbc[(ch.number + i) % selectedKbc.length] : KBC_VALUES[0];
                        
                        list.push(
                          <tr key={`${ch.id}_${i}`} className="hover:bg-zinc-50/20 dark:hover:bg-zinc-950/10">
                            <td className="p-3 text-center font-bold text-emerald-600">{code}</td>
                            <td className="p-3 leading-relaxed text-zinc-600 dark:text-zinc-450">
                              Disajikan bahan kajian materi <strong>"{ch.title.split(":")[1] || ch.title}"</strong>, peserta didik (Audience) dapat menguraikan & menganalisis (Behavior) kompetensi pokok setelah melalui diskusi interpersonal (Condition) secara teliti dengan persetujuan kognitif di atas 80% (Degree).
                            </td>
                            <td className="p-3 bg-emerald-50/20 dark:bg-emerald-950/10 leading-relaxed border-l border-zinc-150 dark:border-zinc-800">
                              <span className="font-bold text-emerald-800 dark:text-emerald-450">{kbcObj.name} ({kbcObj.arabicName})</span><br/>
                              <span className="text-[11px] text-zinc-505 dark:text-zinc-400">
                                Sambil melatih empati kelas, di mana siswa dibiasakan {kbcObj.exampleIntegration.toLowerCase().replace(/mengawali dan mengakhiri pembelajaran dengan /, "")}
                              </span>
                            </td>
                          </tr>
                        );
                      }
                      return list;
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === "atp" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                Alur Tujuan Pembelajaran (ATP) - Konseptual & Sistematis
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Menjelaskan alur logis implementasi pembelajaran setahun ajaran penuh yang dilengkapi identifikasi Profil Pelajar Rahmatan Lil Alamin (P2RA).
              </p>

              <div className="overflow-x-auto rounded-xl border border-zinc-100 dark:border-zinc-800">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-150 dark:border-zinc-800 text-zinc-500 font-bold">
                      <th className="p-3 w-16 text-center">Semester</th>
                      <th className="p-3 w-20 text-center">Kode ATP</th>
                      <th className="p-3">Materi Kajian Serta Alur Logis Belajar</th>
                      <th className="p-3 w-20 text-center">Alokasi</th>
                      <th className="p-3 w-1/4">Kunci P2RA (Khas Kemenag)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {state.chapters.map((ch, idx) => {
                      const kbcObj = selectedKbc.length > 0 ? selectedKbc[ch.number % selectedKbc.length] : KBC_VALUES[0];
                      return (
                        <tr key={ch.id} className="hover:bg-zinc-50/20 dark:hover:bg-zinc-950/10">
                          <td className="p-3 text-center font-bold text-zinc-600">S{ch.semester}</td>
                          <td className="p-3 text-center font-bold text-zinc-900 dark:text-white">ATP.{ch.semester}.${ch.number}</td>
                          <td className="p-3">
                            <strong className="text-emerald-700 dark:text-emerald-450">{ch.title.split(":")[0]}</strong>: 
                            <span className="text-zinc-600 dark:text-zinc-400"> Penguasaan kerangka materi {ch.title.split(":")[1] || ch.title} yang diurutkan dari observasi konseptual, diskusi pemecahan masalah (Problem-based learning) hingga refleksi akhlakul karimah.</span>
                          </td>
                          <td className="p-3 text-center font-bold text-zinc-800 dark:text-zinc-200">{ch.weeks * ch.jp} JP</td>
                          <td className="p-3 text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                            - Beradab (Ta'addub)<br/>
                            - {kbcObj.name} ({kbcObj.arabicName})
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === "protoprom" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {/* Part A: PROTA */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                  A. Program Tahunan (PROTA)
                </h3>
                <div className="overflow-x-auto rounded-xl border border-zinc-100 dark:border-zinc-800">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-150 dark:border-zinc-800 text-zinc-500 font-bold">
                        <th className="p-3 w-20 text-center">Semester</th>
                        <th className="p-3 w-16 text-center">No Bab</th>
                        <th className="p-3">Bahan Kajian / Topik Materi Pembelajaran</th>
                        <th className="p-3 w-28 text-center">Durasi Minggu</th>
                        <th className="p-3 w-28 text-center">Alokasi JP</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                      {state.chapters.map((ch) => (
                        <tr key={ch.id} className="hover:bg-zinc-50/20 dark:hover:bg-zinc-950/10">
                          <td className="p-3 text-center font-bold text-zinc-650">{ch.semester === 1 ? "I (Ganjil)" : "II (Genap)"}</td>
                          <td className="p-3 text-center font-semibold">Bab {ch.number}</td>
                          <td className="p-3 text-zinc-700 dark:text-zinc-300 font-medium">{ch.title}</td>
                          <td className="p-3 text-center font-semibold text-zinc-600">{ch.weeks} Minggu</td>
                          <td className="p-3 text-center font-bold text-emerald-750 dark:text-emerald-450">{ch.weeks * ch.jp} JP</td>
                        </tr>
                      ))}
                      <tr className="bg-emerald-50/20 dark:bg-emerald-950/10 font-bold">
                        <td colspan="3" className="p-3 text-right">TOTAL ALOKASI JP TAHUNAN</td>
                        <td className="p-3 text-center text-zinc-900 dark:text-white">{totalWeeks} Minggu</td>
                        <td className="p-3 text-center text-emerald-700 dark:text-emerald-450">{totalJp} JP</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Part B: PROMES Matrix */}
              <div className="space-y-3 pt-4 border-t border-zinc-100 dark:border-zinc-850">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                    B. Program Semester (PROMES) Matrix
                  </h3>
                  {/* Semester Toggle */}
                  <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg gap-1 self-start">
                    <button
                      type="button"
                      onClick={() => setPromesSem(1)}
                      className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                        promesSem === 1 ? "bg-white dark:bg-zinc-950 text-emerald-650 shadow-xs" : "text-zinc-500"
                      }`}
                    >
                      Semester 1 (Ganjil)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPromesSem(2)}
                      className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                        promesSem === 2 ? "bg-white dark:bg-zinc-950 text-emerald-650 shadow-xs" : "text-zinc-500"
                      }`}
                    >
                      Semester 2 (Genap)
                    </button>
                  </div>
                </div>

                <p className="text-[10px] text-zinc-500 leading-relaxed">
                  ✓ = Jam pertemuan tatap muka aktif (PBM). S = Evaluasi Penilaian Sumatif Bab.
                </p>

                {/* Promes Grid */}
                <div className="overflow-x-auto rounded-xl border border-zinc-100 dark:border-zinc-800">
                  <table className="min-w-[800px] text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-zinc-50 dark:bg-zinc-950 text-zinc-550 font-bold border-b border-zinc-150 dark:border-zinc-800">
                        <th rowspan="2" className="p-3 w-1/4">Sub Kajian / Materi</th>
                        <th rowspan="2" className="p-3 w-16 text-center">Total JP</th>
                        <th rowspan="2" className="p-3 w-16 text-center">Tipe</th>
                        <th colspan={24} className="p-1.5 text-center bg-zinc-100 dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800">Penyebaran Minggu Efektif</th>
                      </tr>
                      <tr className="bg-zinc-50 dark:bg-zinc-950 text-[10px]">
                        {(promesSem === 1 ? MONTHS_S1 : MONTHS_S2).map((m) => (
                          <th key={m.name} colspan={m.weeks} className="p-1.5 text-center border-l border-zinc-150 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-950/20">{m.name}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                      {state.chapters.filter(c => c.semester === promesSem).map((ch, idx) => {
                        const totalChJp = ch.weeks * ch.jp;
                        const pbmChJp = totalChJp - ch.assessmentJp;

                        // Create two rows per chapter: PBM, Sum
                        return (
                          <React.Fragment key={ch.id}>
                            {/* PBM row */}
                            <tr className="hover:bg-zinc-55/40 dark:hover:bg-zinc-950/5">
                              <td className="p-2.5 font-bold text-zinc-900 dark:text-white">{ch.title.split(":")[0]} (Proses Belajar PT)</td>
                              <td className="p-2.5 text-center font-semibold text-zinc-650">{pbmChJp} JP</td>
                              <td className="p-2.5 text-center font-bold text-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/10">PBM</td>
                              {/* Draw weeks squares sequentially */}
                              {Array.from({ length: 24 }).map((_, wIdx) => {
                                // Simplified display sequencing: assign chapters consecutively
                                const startWeekRange = idx * 4; 
                                const active = wIdx >= startWeekRange && wIdx < (startWeekRange + ch.weeks - 1);
                                return (
                                  <td key={wIdx} className={`p-1.5 text-center border-l border-zinc-100 dark:border-zinc-805 ${active ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 font-extrabold" : ""}`}>
                                    {active ? "✓" : ""}
                                  </td>
                                );
                              })}
                            </tr>
                            {/* Sumatif row */}
                            <tr className="hover:bg-zinc-55/40 dark:hover:bg-zinc-950/5 text-zinc-500">
                              <td className="p-2.5 pl-4 italic">{ch.title.split(":")[0]} - Penilaian Sumatif</td>
                              <td className="p-2.5 text-center font-medium">{ch.assessmentJp} JP</td>
                              <td className="p-2.5 text-center font-bold text-rose-600 bg-rose-50/50 dark:bg-rose-950/10">Sum</td>
                              {Array.from({ length: 24 }).map((_, wIdx) => {
                                const startWeekRange = idx * 4;
                                const activeSum = wIdx === (startWeekRange + ch.weeks - 1);
                                return (
                                  <td key={wIdx} className={`p-1.5 text-center border-l border-zinc-100 dark:border-zinc-805 ${activeSum ? "bg-rose-100 dark:bg-rose-950 text-rose-700 font-extrabold" : ""}`}>
                                    {activeSum ? "S" : ""}
                                  </td>
                                );
                              })}
                            </tr>
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "kktp" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-1.5">
                Kriteria Ketuntasan Tujuan Pembelajaran (KKTP) - Karakter Cinta
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed text-justify">
                Kriteria ketuntasan ini dirumuskan berdasarkan integrasi kognitif kementerian dan ranah sikap Kurikulum Berbasis Cinta (KBC). Penilaian afektif sangat ditekankan demi menghindari iklim belajar kompetitif destruktif.
              </p>

              <div className="overflow-x-auto rounded-xl border border-zinc-100 dark:border-zinc-800">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-150 dark:border-zinc-800 text-zinc-500 font-bold">
                      <th className="p-3 w-1/5 text-center">Interval Skor</th>
                      <th className="p-3 w-1/4 text-center">Kriteria Kelulusan</th>
                      <th className="p-3">Rincian Deskripsi Sikap & Afektif KBC Pendidik</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    <tr className="bg-rose-50/20 dark:bg-rose-950/5">
                      <td className="p-3 text-center font-bold text-rose-700">0 - 40%</td>
                      <td className="p-3 text-center font-bold text-rose-800">Belum Mencapai Ketuntasan</td>
                      <td className="p-3 text-zinc-650 dark:text-zinc-400 leading-relaxed">
                        Siswa belum menguasai konsep dasar kognitif, kurang berminat dalam diskusi, serta belum membiasakan akhlak santun/empati di kelas. Membutuhkan bimbingan intensif dari guru dengan rasa cinta kasih yang mendalam (remedial personal).
                      </td>
                    </tr>
                    <tr className="bg-amber-50/20 dark:bg-amber-950/5">
                      <td className="p-3 text-center font-bold text-amber-700">41 - 60%</td>
                      <td className="p-3 text-center font-bold text-amber-800">Tuntas Sebagian (Remedial)</td>
                      <td className="p-3 text-zinc-650 dark:text-zinc-400 leading-relaxed">
                        Mulai menunjukkan peningkatan adab kesantunan dan kerja sama, tetapi pemahaman teori utama bab masih berserakan. Direkomendasikan pembelajaran remedial kelompok menggunakan metode tutor sebaya yang asertif.
                      </td>
                    </tr>
                    <tr className="bg-emerald-50/20 dark:bg-emerald-950/5">
                      <td className="p-3 text-center font-bold text-emerald-700">61 - 80%</td>
                      <td className="p-3 text-center font-bold text-emerald-800">Tuntas Layak (Standard)</td>
                      <td className="p-3 text-zinc-650 dark:text-zinc-450 leading-relaxed">
                        Siswa telah menguasai rincian kompetensi bab secara utuh, rajin mengamalkan prinsip peduli sesama mahluk, berbicara santun formal, dan aktif menjalin persaudaraan harmonis di kelas. Berhak melanjutkan materi baru.
                      </td>
                    </tr>
                    <tr className="bg-emerald-100/20 dark:bg-emerald-900/10">
                      <td className="p-3 text-center font-bold text-emerald-800">81 - 100%</td>
                      <td className="p-3 text-center font-bold text-emerald-900">Sangat Tuntas (Pengayaan)</td>
                      <td className="p-3 text-zinc-650 dark:text-zinc-450 leading-relaxed">
                        Menunjukkan penguasaan istimewa di atas rata-rata kelas, berinisiatif memimpin kerja sosial gotong royong, mencerminkan ketakwaan luhur secara mandiri, serta bersikap moderat toleran. Layak mendapatkan modul pengayaan analitis.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === "alokasi" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                Hubungan Proporsi Beban Pembelajaran & Asesmen
              </h3>

              {/* Bento cards summary grids */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-zinc-150 dark:border-zinc-800 space-y-1">
                  <span className="text-xs font-bold text-zinc-400 uppercase">Proses Belajar (PBM)</span>
                  <div className="text-2xl font-black text-emerald-700">{pbmJp} JP</div>
                  <p className="text-[10px] text-zinc-500">{((pbmJp / totalJp) * 100).toFixed(1)}% dari total jp pembelajaran aktif.</p>
                </div>
                <div className="p-4 rounded-xl border border-zinc-150 dark:border-zinc-800 space-y-1">
                  <span className="text-xs font-bold text-zinc-400 uppercase">Asesmen Sumatif</span>
                  <div className="text-2xl font-black text-rose-700">{totalSumatifJp} JP</div>
                  <p className="text-[10px] text-zinc-500">{((totalSumatifJp / totalJp) * 100).toFixed(1)}% dikasihkan untuk ujian evaluasi per bab.</p>
                </div>
                <div className="p-4 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/20 dark:bg-emerald-950/10 space-y-1">
                  <span className="text-xs font-bold text-emerald-700 uppercase">Total Beban Tahunan</span>
                  <div className="text-2xl font-black text-emerald-850 dark:text-white">{totalJp} JP</div>
                  <p className="text-[10px] text-emerald-600">Terdistribusikan dalam {totalWeeks} Minggu kegiatan sekolah.</p>
                </div>
              </div>

              {/* Alokasi Table */}
              <div className="overflow-x-auto rounded-xl border border-zinc-100 dark:border-zinc-800">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-150 dark:border-zinc-800 text-zinc-500 font-bold">
                      <th className="p-3">Kategori Jam Pertemuan</th>
                      <th className="p-3 text-center w-28">Jumlah JP</th>
                      <th className="p-3 text-center w-28">Persentase (%)</th>
                      <th className="p-3">Lingkup Kegiatan & Pelaksanaan Administrasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    <tr>
                      <td className="p-3 font-semibold text-zinc-900 dark:text-white">Proses Belajar Mengajar Terkoordinasi</td>
                      <td className="p-3 text-center font-bold text-zinc-800 dark:text-zinc-200">{pbmJp} JP</td>
                      <td className="p-3 text-center text-zinc-650">{((pbmJp / totalJp) * 100).toFixed(1)}%</td>
                      <td className="p-3 text-zinc-550 leading-relaxed">Tatap muka materi bab, penayangan media pembelajaran keagamaan, kuis kelompok kecil, dan evaluasi proses.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-zinc-900 dark:text-white">Asesmen Evaluasi Sumatif Materi</td>
                      <td className="p-3 text-center font-bold text-zinc-800 dark:text-zinc-200">{totalSumatifJp} JP</td>
                      <td className="p-3 text-center text-zinc-650">{((totalSumatifJp / totalJp) * 105).toFixed(1)}%</td>
                      <td className="p-3 text-zinc-550 leading-relaxed">Pelaksanaan penilaian tengah kompetensi, ujian tulis bab, penyerahan esai refleksi sikap serta kepedulian siswa.</td>
                    </tr>
                    <tr className="bg-emerald-50/20 dark:bg-emerald-950/10 font-bold border-t border-zinc-200">
                      <td className="p-3 text-zinc-900 dark:text-white">Jumlah Akhir JP Rencana Kegiatan</td>
                      <td className="p-3 text-center text-emerald-800 dark:text-emerald-400">{totalJp} JP</td>
                      <td className="p-3 text-center text-zinc-900 dark:text-white">100.0%</td>
                      <td className="p-3 text-emerald-850 dark:text-emerald-450 font-medium">Sempurna dan memenuhi syarat regulasi nasional kelulusan madrasah.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* 3. EXPORT SYSTEM CONTROLS FOOTER (IV Section of User prompt) */}
      <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Reset Trigger */}
        <button
          onClick={onReset}
          className="px-5 py-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-zinc-700 dark:text-zinc-300 font-bold rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Mulai Ulang Baru
        </button>

        {/* Action Downloads Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* SIdenote individual downloads */}
          <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-1">
            <button
              onClick={() => exportIndividualDocToDoc(state, "prota")}
              className="px-3.5 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              title="Unduh silabus PROTA dalam .doc"
            >
              <Download className="w-3.5 h-3.5" />
              Prota
            </button>
            <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-805" />
            <button
              onClick={() => exportIndividualDocToDoc(state, "promes")}
              className="px-3.5 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              title="Unduh matriks PROMES dalam .doc"
            >
              <Download className="w-3.5 h-3.5" />
              Promes
            </button>
            <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-805" />
            <button
              onClick={() => exportIndividualDocToDoc(state, "kktp")}
              className="px-3.5 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              title="Unduh interval KKTP dalam .doc"
            >
              <Download className="w-3.5 h-3.5" />
              KKTP
            </button>
          </div>

          {/* Master Complete Exporter Button */}
          <button
            onClick={() => exportCompleteDocumentToDoc(state)}
            className="px-6 py-3 bg-emerald-650 hover:bg-emerald-600 font-extrabold text-sm text-white rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-500/10 hover:shadow-emerald-650/20 active:scale-98 transition-all"
          >
            <Download className="w-4 h-4 text-white font-extrabold" />
            Export Lengkap (.docx)
          </button>
        </div>
      </div>
    </div>
  );
}
