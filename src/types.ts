/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SchoolIdentity {
  madrasahName: string;
  teacherName: string;
  nipCode: string; // NUPTK/NIP
  academicYear: string;
  semester: "Ganjil" | "Genap" | "Ganjil & Genap";
  curriculum: string;
  address: string;
  principalName: string;
  principalNip: string;
}

export interface KbcValue {
  id: string;
  name: string;
  arabicName: string;
  description: string;
  exampleIntegration: string;
}

export type JenjangType = "RA" | "MI" | "MTs" | "MA";

export interface Subject {
  id: string;
  name: string;
  category: "PAI/Bahasa Arab" | "Umum";
  description: string;
}

export interface Grade {
  id: string;
  name: string;
  fase: string;
}

export interface Chapter {
  id: string;
  semester: 1 | 2;
  number: number;
  title: string;
  weeks: number; // Jumlah minggu efektif
  jp: number; // JP per minggu
  assessmentJp: number; // JP Penilaian Sumatif
}

export interface GeneratorState {
  identity: SchoolIdentity;
  jenjang: JenjangType;
  selectedGrade: string;
  selectedSubject: string;
  selectedKbcValues: string[]; // KbcValue IDs
  jpPerWeek: number;
  effectiveWeeks: number;
  tpPerChapter: number;
  sumatifJpPerChapter: number;
  chapters: Chapter[];
}

export interface CpElement {
  element: string;
  description: string;
}
