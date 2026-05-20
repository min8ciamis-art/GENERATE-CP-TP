/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { SchoolIdentity } from "../types";
import { School, User, Hash, Calendar, Layers, MapPin, Award, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

interface Step1FormProps {
  identity: SchoolIdentity;
  onChange: (updated: SchoolIdentity) => void;
  onNext: () => void;
}

export default function Step1Form({ identity, onChange, onNext }: Step1FormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity.madrasahName.trim() || !identity.teacherName.trim()) {
      alert("Nama Madrasah dan Nama Guru wajib diisi!");
      return;
    }
    onNext();
  };

  const handleFieldChange = (key: keyof SchoolIdentity, value: string) => {
    onChange({
      ...identity,
      [key]: value
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[24px] p-6 shadow-md"
    >
      <div className="flex items-center gap-3 mb-6 border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 rounded-xl">
          <School className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 font-sans tracking-tight">
            Step 1: Identitas Madrasah & Pendidik
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Masukkan data kelembagaan dan profil pengajar untuk personalisasi dokumen perangkat ajar.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Madrasah Name */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
              <School className="w-4 h-4 text-emerald-500" />
              Nama Madrasah / Sekolah *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: MI Negeri 8 Ciamis"
              value={identity.madrasahName}
              onChange={(e) => handleFieldChange("madrasahName", e.target.value)}
              className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
            />
          </div>

          {/* Teacher Name */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-500" />
              Nama Lengkap Guru (Pendidik) *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: KH. Ahmad Syafi'i, S.Pd.I."
              value={identity.teacherName}
              onChange={(e) => handleFieldChange("teacherName", e.target.value)}
              className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
            />
          </div>

          {/* Teacher NIP */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
              <Hash className="w-4 h-4 text-emerald-500" />
              NIP / NUPTK / PegID
            </label>
            <input
              type="text"
              placeholder="Contoh: 198205122009121003 (isi - jika non-NIP)"
              value={identity.nipCode}
              onChange={(e) => handleFieldChange("nipCode", e.target.value)}
              className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
            />
          </div>

          {/* Academic Year */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-500" />
              Tahun Pelajaran
            </label>
            <select
              value={identity.academicYear}
              onChange={(e) => handleFieldChange("academicYear", e.target.value)}
              className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm text-zinc-900 dark:text-zinc-100"
            >
              <option value="2025/2026">2025/2026 (Aktif - Regulasi BSKAP 2025)</option>
              <option value="2026/2027">2026/2027</option>
              <option value="2024/2025">2024/2025</option>
            </select>
          </div>

          {/* Semester */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-500" />
              Semester Pembelajaran
            </label>
            <select
              value={identity.semester}
              onChange={(e) => handleFieldChange("semester", e.target.value as any)}
              className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm text-zinc-900 dark:text-zinc-100"
            >
              <option value="Ganjil & Genap">Ganjil & Genap (Satu Tahun Penuh)</option>
              <option value="Ganjil">Semester 1 (Ganjil)</option>
              <option value="Genap">Semester 2 (Genap)</option>
            </select>
          </div>

          {/* Curriculum */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-500" />
              Acuan Kurikulum Nasional
            </label>
            <input
              type="text"
              disabled
              value={identity.curriculum}
              className="w-full px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-850 rounded-xl text-sm text-zinc-500 dark:text-zinc-400 cursor-not-allowed font-medium"
            />
          </div>

          {/* Kepala Madrasah (Principal) */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-500" />
              Nama Kepala Madrasah
            </label>
            <input
              type="text"
              placeholder="Nama Kepala Madrasah beserta gelar akademis"
              value={identity.principalName}
              onChange={(e) => handleFieldChange("principalName", e.target.value)}
              className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
            />
          </div>

          {/* Kepala Madrasah NIP */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
              <Hash className="w-4 h-4 text-emerald-500" />
              NIP Kepala Madrasah
            </label>
            <input
              type="text"
              placeholder="NIP Kepala Madrasah (isi - jika non-Pegawai)"
              value={identity.principalNip}
              onChange={(e) => handleFieldChange("principalNip", e.target.value)}
              className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
            />
          </div>
        </div>

        {/* Address */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-500" />
            Alamat Lengkap Madrasah
          </label>
          <textarea
            rows={2}
            placeholder="Jalan, RT/RW, Desa, Kecamatan, Kabupaten/Kota, Provinsi"
            value={identity.address}
            onChange={(e) => handleFieldChange("address", e.target.value)}
            className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
          />
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <button
            type="submit"
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-sm flex items-center gap-2 cursor-pointer shadow-sm shadow-emerald-600/10 transition-colors"
          >
            Lanjut ke Pemilihan Jenjang & Mapel
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </motion.div>
  );
}
