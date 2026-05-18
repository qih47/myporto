import React, { useEffect, useState } from "react";
import { useLanguage } from "./LanguageContext";
import { supabase } from "../supabaseClient";

export default function Resume() {
  const { lang } = useLanguage();
  const [dbProfile, setDbProfile] = useState(null);

  const fetchFullResumeEcosystemData = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select(
          "resume_education, resume_experience, contact_phone, contact_email, location_en, location_id, summary_en, summary_id, full_name",
        )
        .eq("id", 1)
        .single();
      if (error) throw error;
      if (data) setDbProfile(data);
    } catch (err) {
      console.error(
        "Error fetching qualifications resume ecosystem:",
        err.message,
      );
    }
  };

  useEffect(() => {
    fetchFullResumeEcosystemData();

    const channel = supabase
      .channel("profiles-resume-live-stream")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles" },
        () => {
          fetchFullResumeEcosystemData();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // 🔄 RECONCILIATION ENGINE: Ambil data master identitas langsung dari profile asset utama
  const currentName = dbProfile?.full_name || "QISTHI ISKANDAR HAQIKI";
  const currentPhone = dbProfile?.contact_phone || "+62 xxxx xxxx xxxx";
  const currentMail = dbProfile?.contact_email || "qisthi.dev@example.com";

  // 🎯 ROUTING DINAMIS: Otomatis ganti teks lokasid dan bio summary ngikutin lang switch!
  const currentLoc = dbProfile
    ? lang === "EN"
      ? dbProfile.location_en
      : dbProfile.location_id
    : "Bandung, West Java, ID";

  const currentSummaryDesc = dbProfile
    ? lang === "EN"
      ? dbProfile.summary_en
      : dbProfile.summary_id
    : "Technical Solution Architect and Full-stack Developer with a proven track record of engineering robust enterprise applications, optimizing complex database systems, and implementing secure self-hosted AI automation workflows.";

  const rawEdu = dbProfile?.resume_education || [];
  const processedEducation = rawEdu.map((edu) => ({
    title: lang === "EN" ? edu.title_en : edu.title_id,
    date: edu.date,
    institution: edu.institution,
    desc: lang === "EN" ? edu.desc_en : edu.desc_id,
  }));

  const finalEducation =
    processedEducation.length > 0
      ? processedEducation
      : [
          {
            title:
              lang === "EN"
                ? "Coding & Education Technical Training"
                : "Pelatihan Teknis Coding & Edukasi",
            date: "2025",
            institution: "Beamscoding",
            desc:
              lang === "EN"
                ? "Advanced intensive educational path covering modern full-stack engineering, system optimization protocols, and structured development paradigms."
                : "Program intensif lanjutan yang mencakup rekayasa full-stack modern, protokol optimasi arsitektur sistem, dan paradigma pengembangan terstruktur.",
          },
        ];

  const rawExp = dbProfile?.resume_experience || [];
  const processedExperience = rawExp.map((exp) => ({
    role: lang === "EN" ? exp.role_en : exp.role_id,
    date: exp.date,
    company: exp.company,
    bullets: lang === "EN" ? exp.bullets_en : exp.bullets_id,
  }));

  const finalExperience =
    processedExperience.length > 0
      ? processedExperience
      : [
          {
            role: "Technical Solution Architect & Dev",
            date: "2025 - Present",
            company: "Enterprise & Material Systems",
            bullets:
              lang === "EN"
                ? [
                    "Architected and deployed 'CAKRA AI', an automated enterprise workflow processing framework integrating self-hosted LLMs (Ollama/Qwen) with secure local RAG infrastructure.",
                    "Designed and optimized core material registration structures, material tracing monitors, and secure GitServer systems engineered for industrial data handling.",
                    "Successfully migrated legacy data environments into modern, highly relational spaces using PostgreSQL and MySQL/MariaDB with strict SQL transaction tuning.",
                  ]
                : [
                    "Merancang dan men-deploy 'CAKRA AI', sistem otomatisasi alur kerja dokumen menggunakan model LLM lokal mandiri (Ollama/Qwen) dengan infrastruktur RAG kustom.",
                    "Mendesain serta mengoptimalkan sistem registrasi material, monitoring inventaris alat berat, dan manajemen infrastruktur GitServer internal untuk kebutuhan industri.",
                    "Melakukan migrasi dan tuning query database skala besar pada PostgreSQL dan MySQL/MariaDB menggunakan arsitektur transaksi data yang aman.",
                  ],
          },
        ];

  const t = {
    sectionNum: "04.",
    sectionTitle:
      lang === "EN" ? "Professional Journey" : "Rekam Jejak Profesional",
    summaryTitle: lang === "EN" ? "Summary" : "Ringkasan",
    educationTitle: lang === "EN" ? "Education" : "Pendidikan",
    experienceTitle:
      lang === "EN" ? "Professional Experience" : "Pengalaman Profesional",
  };

  return (
    <section
      id="resume"
      className="py-24 px-6 max-w-7xl mx-auto border-t border-slate-800/60 animate-fade-in-up"
    >
      {/* Title Section */}
      <div className="space-y-3 mb-16">
        <p className="text-xs font-mono tracking-widest text-emerald-400 uppercase">
          <span className="mr-2">{t.sectionNum}</span> Qualifications
        </p>
        <h3 className="text-3xl md:text-4xl font-bold text-slate-100 tracking-tight">
          {t.sectionTitle}
        </h3>
      </div>

      {/* Main Layout */}
      <div className="grid md:grid-cols-12 gap-12 items-start font-sans">
        {/* KOLOM KIRI: Summary & Education */}
        <div className="md:col-span-5 space-y-12">
          {/* Section Ringkasan */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-slate-100 border-b border-slate-800 pb-2 flex items-center gap-2">
              <span className="text-emerald-400 text-sm font-mono">■</span>{" "}
              {t.summaryTitle}
            </h4>
            <div className="relative pl-6 border-l border-emerald-500/30 space-y-3">
              <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400"></div>
              <h5 className="text-base font-bold text-emerald-400 tracking-wide font-mono uppercase">
                {currentName}
              </h5>
              <p className="text-sm text-slate-300 leading-relaxed italic font-light">
                {currentSummaryDesc}
              </p>

              {/* 📞 LIST KONTAK */}
              <ul className="text-xs font-mono text-slate-400 space-y-2 pt-3 border-t border-slate-800/40">
                <li className="flex items-center gap-2.5 hover:text-emerald-400 transition-colors duration-200">
                  <span className="text-emerald-400 text-sm select-none">
                    📞
                  </span>
                  <span>{currentPhone}</span>
                </li>
                <li className="flex items-center gap-2.5 hover:text-emerald-400 transition-colors duration-200">
                  <span className="text-emerald-400 text-sm select-none">
                    ✉
                  </span>
                  <span>{currentMail}</span>
                </li>
                <li className="flex items-center gap-2.5 hover:text-emerald-400 transition-colors duration-200">
                  <span className="text-emerald-400 text-sm select-none">
                    📍
                  </span>
                  <span>{currentLoc}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section Pendidikan */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-slate-100 border-b border-slate-800 pb-2 flex items-center gap-2">
              <span className="text-emerald-400 text-sm font-mono">■</span>{" "}
              {t.educationTitle}
            </h4>
            <div className="space-y-8 border-l border-emerald-500/30 pl-6 relative">
              {finalEducation.map((edu, idx) => (
                <div key={idx} className="relative space-y-2">
                  <div className="absolute -left-[29px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-800 border border-emerald-400"></div>
                  <h5 className="text-base font-bold text-slate-200 tracking-tight leading-tight">
                    {edu.title}
                  </h5>
                  <span className="inline-block bg-slate-800 text-emerald-400 text-xs font-mono px-2.5 py-0.5 rounded-md border border-slate-700/60">
                    {edu.date}
                  </span>
                  <p className="text-xs text-slate-400 italic font-mono">
                    {edu.institution}
                  </p>
                  <p className="text-sm text-slate-400 font-light leading-relaxed">
                    {edu.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: Professional Experience */}
        <div className="md:col-span-7 space-y-6">
          <h4 className="text-xl font-bold text-slate-100 border-b border-slate-800 pb-2 flex items-center gap-2">
            <span className="text-emerald-400 text-sm font-mono">■</span>{" "}
            {t.experienceTitle}
          </h4>
          <div className="space-y-10 border-l border-emerald-500/30 pl-6 relative">
            {finalExperience.map((exp, idx) => (
              <div key={idx} className="relative space-y-3 group">
                <div className="absolute -left-[29px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#0b1224] border border-emerald-400 group-hover:bg-emerald-400 shadow-xs transition-colors duration-300"></div>
                <div className="space-y-1">
                  <h5 className="text-lg font-bold text-slate-200 tracking-tight group-hover:text-emerald-400 transition-colors duration-200">
                    {exp.role}
                  </h5>
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono px-3 py-0.5 rounded-full">
                      {exp.date}
                    </span>
                    <span className="text-slate-400 font-mono italic">
                      {exp.company}
                    </span>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-slate-400 font-light leading-relaxed list-disc pl-4 marker:text-emerald-400/70">
                  {(exp.bullets || []).map((bullet, bIdx) => (
                    <li
                      key={bIdx}
                      className="hover:text-slate-300 transition-colors duration-150"
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
