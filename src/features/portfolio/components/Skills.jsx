import React, { useEffect, useState } from "react";
import { useLanguage } from "../../../core/context/LanguageContext";
import { profileService } from "../../../services/profileService";

export default function SkillsMatrixAndProficiency() {
  const { lang } = useLanguage();
  const [dbProfile, setDbProfile] = useState(null);

  // 🔄 OPTIMIZED DATA ENGINE: Sekali tembak narik dua sirkuit array JSON terpadu
  const fetchFullSkillsDataEngine = async () => {
    try {
      const data = await profileService.getProfile("matrix_cards, proficiency_bars");
      if (data) setDbProfile(data);
    } catch (err) {
      console.error("Error syncing skills matrix component:", err.message);
    }
  };

  useEffect(() => {
    fetchFullSkillsDataEngine();

    const profilesChannel = profileService.subscribeToChanges(
      "profiles-matrix-live",
      () => {
        console.log("Realtime Change Detected! Re-firing Data Engine...");
        fetchFullSkillsDataEngine();
      },
      "id=eq.1"
    );

    return () => {
      profileService.unsubscribe(profilesChannel);
    };
  }, []);

  // 🎯 REALTIME RERECIPIENT FIX: Gunakan useMemo biar variabel ikut reaktif bergetar pas dbProfile berubah!
  const finalCards = React.useMemo(() => {
    const rawCards = dbProfile?.matrix_cards || [];
    const processed = rawCards
      .map((card) => {
        const title = lang === "EN" ? card.title_en : card.title_id;
        const desc = lang === "EN" ? card.desc_en : card.desc_id;
        const stackArray = card.stack_str
          ? card.stack_str
              .split(",")
              .map((i) => i.trim())
              .filter((i) => i !== "")
          : [];
        return { title, desc, stack: stackArray };
      })
      .filter((c) => c.title);

    return processed.length > 0
      ? processed
      : [
          {
            title:
              lang === "EN"
                ? "Backend Core & Data Engineering"
                : "Inti Backend & Rekayasa Data",
            desc:
              lang === "EN"
                ? "Building highly stable enterprise logic and heavy data transactions. Focused on relational integrity and query optimization."
                : "Membangun logika bisnis enterprise yang stabil dan transaksi data berat. Berfokus pada integritas relasional dan optimasi query.",
            stack: [
              "PHP (CI4/CI3/Native)",
              "Python (FastAPI)",
              "PostgreSQL",
              "MySQL / MariaDB",
              "SQL Tuning",
            ],
          },
          {
            title:
              lang === "EN"
                ? "Modern Interfaces & Context"
                : "Antarmuka Modern & Konteks",
            desc:
              lang === "EN"
                ? "Developing fast, reactive dashboards and single-page ecosystems that handle complex state transitions seamlessly."
                : "Mengembangkan dashboard reaktif yang cepat dan ekosistem SPA yang mengelola perubahan state kompleks secara mulus.",
            stack: [
              "React",
              "JavaScript (ES6+)",
              "Tailwind CSS",
              "jQuery",
              "Context API",
            ],
          },
          {
            title:
              lang === "EN"
                ? "Automation & Intelligent Workflows"
                : "Automation & Workflow Pintar",
            desc:
              lang === "EN"
                ? "Eliminating manual overhead by deploying self-hosted AI resources, OCR data extraction pipelines, and server-level webhooks."
                : "Mengeliminasi proses manual dengan men-deploy AI lokal mandiri, pipeline ekstraksi data OCR, dan webhook level server.",
            stack: [
              "n8n Integration",
              "Ollama (Local LLMs)",
              "PaddleOCR",
              "RAG Systems",
              "Python Automation",
            ],
          },
        ];
  }, [dbProfile, lang]);

  // 🎯 REALTIME PROFICIENCY RECIPIENT: Ikut dibungkus useMemo biar barnya langsung reaktif bergerak instan!
  const currentSkills = React.useMemo(() => {
    const rawSkills = dbProfile?.proficiency_bars || [];
    return rawSkills.length > 0
      ? rawSkills
      : [
          { name: "PHP (Native & CI)", value: 95 },
          { name: "Python (FastAPI & Scripts)", value: 90 },
          { name: "PostgreSQL / MySQL", value: 92 },
          { name: "System Architecture", value: 90 },
          { name: "React & JS ES6+", value: 85 },
          { name: "Tailwind CSS & UI/UX", value: 88 },
        ];
  }, [dbProfile]);

  return (
    <section
      id="skills"
      className="py-24 px-6 max-w-7xl mx-auto border-t border-slate-800/60 animate-fade-in-up"
    >
      {/* 1. SECTION TITLES */}
      <div className="space-y-3 mb-16">
        <p className="text-xs font-mono tracking-widest text-emerald-400 uppercase">
          <span className="mr-2">02.</span> Expertise Matrix & Proficiency
        </p>
        <h3 className="text-3xl md:text-4xl font-bold text-slate-100 tracking-tight">
          {lang === "EN"
            ? "Architectural Focus & Capabilities"
            : "Fokus Arsitektur & Kapabilitas"}
        </h3>
      </div>

      {/* 2. DYNAMIC SLIDER GRID INTERFACE */}
      <div className="relative mb-24 w-full">
        <div
          className={`grid gap-8 w-full ${
            finalCards.length <= 3
              ? "grid-cols-1 md:grid-cols-3"
              : "flex overflow-x-auto pb-6 scroll-smooth snap-x snap-mandatory scrollbar-thin scrollbar-thumb-slate-800"
          }`}
        >
          {finalCards.map((cat, index) => (
            <div
              key={index}
              className={`bg-slate-800/20 p-8 rounded-2xl border border-slate-800/80 hover:border-emerald-500/30 hover:bg-slate-800/30 transition-all duration-300 flex flex-col justify-between shadow-xs ${
                finalCards.length > 3
                  ? "w-full md:w-[calc(33.333%-18px)] shrink-0 snap-start"
                  : ""
              }`}
            >
              <div className="space-y-4">
                <h4 className="text-xl font-bold text-slate-200 tracking-tight h-14 line-clamp-2">
                  {cat.title}
                </h4>
                <p className="text-slate-400 text-sm leading-relaxed font-light line-clamp-4 min-h-[80px]">
                  {cat.desc}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-800/60">
                <div className="flex flex-wrap gap-1.5">
                  {cat.stack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="bg-[#070b18] border border-slate-800 text-emerald-400 font-mono text-[10px] md:text-xs px-2.5 py-1 rounded-md"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Indikator scroll di Bawah */}
        {finalCards.length > 3 && (
          <div className="flex justify-center gap-1.5 mt-2 font-mono text-[9px] text-slate-600 animate-pulse">
            <span>← SCROLL OR SWIPE MATRIX NODES TO VIEW MORE →</span>
          </div>
        )}
      </div>

      {/* 3. TECHNICAL PROFICIENCY BARS */}
      <div className="space-y-12">
        <div className="border-l-4 border-emerald-500 pl-4 py-1">
          <h4 className="text-2xl font-bold text-slate-100 tracking-tight">
            {lang === "EN"
              ? "Technical Proficiency Bars"
              : "Grafik Kemahiran Teknis"}
          </h4>
        </div>

        <div className="grid md:grid-cols-2 gap-x-12 gap-y-10 font-mono">
          {currentSkills.map((skill, index) => (
            <div key={index} className="space-y-3">
              <div className="flex justify-between items-baseline text-slate-300">
                <span className="text-sm font-semibold tracking-wide">
                  {skill.name}
                </span>
                <span className="text-xl font-black text-emerald-400">
                  {skill.value}%
                </span>
              </div>

              <div className="w-full bg-slate-800/40 rounded-full h-2.5 border border-slate-700/50 p-[2px]">
                <div
                  className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full rounded-full transition-all duration-500 shadow-lg shadow-emerald-500/20"
                  style={{ width: `${skill.value}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
