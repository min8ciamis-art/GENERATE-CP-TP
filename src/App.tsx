/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { GeneratorState } from "./types";
import { getDefaultChapters, getCpElements } from "./data/curriculumData";
import Step1Form from "./components/Step1Form";
import Step2Form from "./components/Step2Form";
import Step3Review from "./components/Step3Review";
import PreviewSection from "./components/PreviewSection";
import { Heart, Sun, Moon, HelpCircle, GraduationCap, CheckCircle } from "lucide-react";

const LOCAL_STORAGE_KEY = "edugen_pro_kbc_state_v1";

// Default state tailored thoughtfully for MIN 8 Ciamis (based on user email metadata)
const DEFAULT_STATE: GeneratorState = {
  identity: {
    madrasahName: "MIN 8 Ciamis",
    teacherName: "Ahmad Jupri, S.Pd.I.",
    nipCode: "198504032014021002",
    academicYear: "2025/2026",
    semester: "Ganjil & Genap",
    curriculum: "Kurikulum Merdeka - Kurikulum Berbasis Cinta (KBC)",
    address: "Jl. Lapang Karangsari Raya No. 98, Ciamis, Jawa Barat",
    principalName: "Drs. H. Maman Suryaman, M.Pd.I.",
    principalNip: "197203111998031001"
  },
  jenjang: "MI",
  selectedGrade: "mi_3", // Kelas 3
  selectedSubject: "quran_hadis", // Al-Qur'an Hadis PAI
  selectedKbcValues: ["cinta_allah_rasul", "cinta_ilmu", "cinta_diri_sesama"],
  jpPerWeek: 2,
  effectiveWeeks: 18,
  tpPerChapter: 2,
  sumatifJpPerChapter: 2,
  chapters: getDefaultChapters("MI", "mi_3", "quran_hadis"),
  customCps: getCpElements("MI", "mi_3", "quran_hadis")
};

export default function App() {
  const [state, setState] = useState<GeneratorState>(DEFAULT_STATE);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Load state from local storage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        setState(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Could not parse saved storage: ", e);
    }

    // Default dark mode check
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setDarkMode(true);
    }
  }, []);

  // Sync state to local storage when changed
  const handleStateChange = (updated: Partial<GeneratorState>) => {
    setState((prev) => {
      const next = { ...prev, ...updated };
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.warn("Storage sync failed: ", e);
      }
      return next;
    });
  };

  const handleIdentityChange = (updatedIdentity: GeneratorState["identity"]) => {
    handleStateChange({ identity: updatedIdentity });
  };

  // Stepper state trackers
  const stepsList = [
    { num: 1, label: "Identitas Madrasah" },
    { num: 2, label: "Pilihan Kurikulum cinta" },
    { num: 3, label: "Review & Validasi" },
    { num: 4, label: "Hasil Preview & Export" }
  ];

  // Sync darkmode class on document
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-zinc-950 font-sans transition-colors duration-200 pb-20`}>
      {/* 1. Header (Top Navigation) */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-emerald-600 dark:bg-emerald-750 rounded-xl flex items-center justify-center text-white shadow-md shadow-emerald-600/10">
              <Heart className="w-5 h-5 fill-white animate-pulse" />
            </div>
            <div>
              <span className="text-base font-black text-emerald-800 dark:text-emerald-450 tracking-tight flex items-center gap-1.5">
                EduGen Pro <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-450 px-1.5 py-0.5 rounded-md font-bold">KBC</span>
              </span>
              <p className="text-[9px] text-zinc-500 font-medium">
                Edisi Kurikulum Berbasis Cinta (KBC Kemenag)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Dark Mode Switcher */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-850 text-zinc-650 dark:text-zinc-450 transition-colors cursor-pointer"
              title="Ganti Tema Tampilan"
            >
              {darkMode ? <Sun className="w-4 h-4 text-emerald-500" /> : <Moon className="w-4 h-4 text-zinc-700" />}
            </button>
            
            <a
              href="https://kemenag.go.id"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 border border-emerald-500/20 text-emerald-600 rounded-lg text-xs font-bold bg-emerald-50/10 hover:bg-emerald-50/20"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              Portal Kemenag
            </a>
          </div>
        </div>
      </header>

       {/* 2. Wizard Stepper Indicator */}
      <div className="max-w-4xl mx-auto px-4 pt-8">
        <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2 scrollbar-none">
          {stepsList.map((s, idx) => {
            const active = step === s.num;
            const completed = step > s.num;
            return (
              <React.Fragment key={s.num}>
                <div className="flex items-center gap-2.5 whitespace-nowrap">
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all ${
                      active
                        ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-605 text-emerald-800 dark:text-emerald-300"
                        : completed
                        ? "bg-transparent border-emerald-600/40 text-emerald-600 opacity-60"
                        : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-400"
                    }`}
                  >
                    {completed ? "✓" : s.num}
                  </span>
                  <span
                    className={`text-xs font-bold leading-none ${
                      active
                        ? "text-emerald-800 dark:text-emerald-450"
                        : completed
                        ? "text-emerald-600/60"
                        : "text-zinc-450"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {idx < stepsList.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 min-w-[30px] mx-2 hidden sm:block ${
                      step > s.num ? "bg-emerald-600/40" : "bg-zinc-200 dark:bg-zinc-805"
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* 3. Main Wizard Switcher */}
      <main className="max-w-4xl mx-auto px-4 pb-20">
        {step === 1 && (
          <Step1Form
            identity={state.identity}
            onChange={handleIdentityChange}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <Step2Form
            state={state}
            onChange={handleStateChange}
            onPrev={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        )}

        {step === 3 && (
          <Step3Review
            state={state}
            onEdit={() => setStep(2)}
            onGenerate={() => setStep(4)}
          />
        )}

        {step === 4 && (
          <PreviewSection state={state} onChange={handleStateChange} onReset={() => setStep(1)} />
        )}
      </main>

      {/* 4. Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-900 py-3.5 text-center text-xs text-zinc-500 dark:text-zinc-400 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-extrabold text-sm text-emerald-800 dark:text-emerald-400 tracking-widest">
            MUHAMMAD IMAM SYAFI'I @ 2026
          </p>
        </div>
      </footer>
    </div>
  );
}
