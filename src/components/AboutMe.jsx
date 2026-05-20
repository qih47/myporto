import React, { useState, useEffect } from "react";
import { useLanguage } from "./LanguageContext";
import { supabase } from "../supabaseClient";

const staticLabels = {
  EN: {
    competency: "// Professional Competency",
    inventory: "Verified Technology Inventory",
    locationTitle: "Current Location",
    specTitle: "Specialization",
    frameworksTitle: "Core Frameworks",
  },
  ID: {
    competency: "// Kompetensi Profesional",
    inventory: "Inventaris Teknologi Terverifikasi",
    locationTitle: "Lokasi Saat Ini",
    specTitle: "Spesialisasi",
    frameworksTitle: "Framework Utama",
  },
};

export default function AboutMe() {
  const { lang } = useLanguage();
  const label = staticLabels[lang];
  const [dbProfile, setDbProfile] = useState(null);

  const fetchProfileData = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", 1)
        .single();

      if (error) throw error;
      if (data) setDbProfile(data);
    } catch (err) {
      console.error("Profile Data Fetch Fail Node:", err.message);
    }
  };

  useEffect(() => {
    fetchProfileData();

    const profileChannel = supabase
      .channel("profiles-live-stream")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles" },
        (payload) => {
          console.log("Profile Realtime update captured!", payload);
          fetchProfileData();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(profileChannel);
    };
  }, []);

  // 🔄 FALLBACK RECONCILIATION ENGINE
  const currentName = dbProfile?.full_name || "Qisthi Iskandar Haqiki";
  const currentAvatar = dbProfile?.avatar_url || "";
  const currentAvailable = dbProfile ? dbProfile.is_available : true;

  const currentSubHeadline = dbProfile
    ? lang === "EN"
      ? dbProfile.sub_headline_en
      : dbProfile.sub_headline_id
    : "Solution Architect & Dev";

  const currentHeadline = dbProfile
    ? lang === "EN"
      ? dbProfile.spec_en
      : dbProfile.spec_id
    : "Engineering High-Performance Business Solutions";

  const currentSummary = dbProfile
    ? lang === "EN"
      ? dbProfile.summary_en
      : dbProfile.summary_id
    : "I am a Full-stack Developer and Technical Solution Architect focused on engineering robust, efficient, and enterprise-grade software systems.";

  const currentSubSummary = dbProfile
    ? lang === "EN"
      ? dbProfile.sub_summary_en
      : dbProfile.sub_summary_id
    : "My architectural approach focuses on infrastructure efficiency, designing complex database configurations.";

  const currentTechInventory = dbProfile?.tech_inventory || [
    "PHP (CI4 / CI3 / Native)",
    "Python (FastAPI)",
    "JavaScript (React / ES6)",
    "PostgreSQL",
    "MySQL",
    "Tailwind CSS",
  ];

  const currentLocation = dbProfile
    ? lang === "EN"
      ? dbProfile.location_en
      : dbProfile.location_id
    : "Bandung, West Java, ID";

  const currentSpec = dbProfile
    ? lang === "EN"
      ? dbProfile.spec_en
      : dbProfile.spec_id
    : "Enterprise Architecture";

  const currentFrameworks = dbProfile?.frameworks_text || "CI4, React, FastAPI";

  // 🎯 REALTIME ARCHITECTURE: Mapping array JSON cards dinamis dari kolom Supabase profiles
  const rawCards = dbProfile?.competency_cards || [];
  const dynamicCards = rawCards
    .map((card) => ({
      title: lang === "EN" ? card.title_en : card.title_id,
      desc: lang === "EN" ? card.desc_en : card.desc_id,
    }))
    .filter((card) => card.title);

  return (
    <section
      id="about"
      className="py-28 px-6 max-w-7xl mx-auto border-t border-slate-800/60 space-y-20 animate-fade-in-up"
    >
      <div className="grid md:grid-cols-12 gap-16 items-start">
        {/* Kolom Kiri - Foto & Availability */}
        <div className="md:col-span-4 space-y-6 md:sticky md:top-28">
          <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-slate-700/40 group">
            <img
              src={currentAvatar}
              alt={currentName}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-6 left-6">
              <p className="text-xl font-bold text-white">{currentName}</p>
              <p className="text-xs font-mono text-emerald-400 mt-1">
                {currentSubHeadline}
              </p>
            </div>
          </div>

          <div className="p-5 bg-slate-800/20 border border-slate-800 rounded-xl space-y-3 font-mono text-xs">
            <p className="text-slate-500 uppercase tracking-wider">
              Availability
            </p>
            <div className="flex items-center gap-2 text-slate-200">
              <span
                className={`w-2 h-2 rounded-full animate-pulse ${currentAvailable ? "bg-emerald-500" : "bg-red-500"}`}
              ></span>
              <span>
                {currentAvailable
                  ? lang === "EN"
                    ? "Available for Contracts"
                    : "Tersedia untuk Kontrak Project"
                  : lang === "EN"
                    ? "Fully Booked"
                    : "Sedang Penuh / Tidak Tersedia"}
              </span>
            </div>
          </div>
        </div>

        {/* Kolom Kanan - Content Details */}
        <div className="md:col-span-8 space-y-8">
          <div className="space-y-3">
            <p className="text-xs font-mono tracking-widest text-emerald-400 uppercase">
              {label.competency}
            </p>
            <h2 className="text-4xl font-extrabold text-slate-100 tracking-tight leading-none">
              {currentHeadline}
            </h2>
          </div>

          <p className="text-slate-300 text-lg leading-relaxed">
            {currentSummary}
          </p>
          <p className="text-slate-400 text-base leading-relaxed">
            {currentSubSummary}
          </p>

          {/* Kartu Kompetensi Berjejer Rapi 2 Atas 2 Bawah */}
          {dynamicCards.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {dynamicCards.map((card, i) => (
                <div
                  key={i}
                  className="p-5 bg-slate-800/30 border border-slate-800 rounded-xl space-y-2 hover:-translate-y-1 hover:border-slate-700 transition-all duration-300 shadow-xs"
                >
                  <h3 className="text-xs font-bold text-slate-200 tracking-wide line-clamp-2 h-9">
                    {card.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {card.desc ||
                      (lang === "EN"
                        ? "No narrative text."
                        : "Tidak ada deskripsi.")}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Verified Technology Inventory */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
              {label.inventory}
            </h4>
            <div className="flex flex-wrap gap-2">
              {currentTechInventory.map((tech) => (
                <span
                  key={tech}
                  className="bg-slate-800/60 border border-slate-700/50 text-slate-300 font-mono text-xs px-3 py-1.5 rounded-md shadow-sm hover:border-emerald-500/20 transition-colors duration-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Footer Metadata Node */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-800">
            <div>
              <p className="text-xs text-slate-500 font-mono uppercase">
                {label.locationTitle}
              </p>
              <p className="text-sm font-medium text-slate-200 mt-1">
                {currentLocation}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-mono uppercase">
                {label.specTitle}
              </p>
              <p className="text-sm font-medium text-slate-200 mt-1">
                {currentSpec}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-mono uppercase">
                {label.frameworksTitle}
              </p>
              <p className="text-sm font-medium text-slate-200 mt-1">
                {currentFrameworks}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
