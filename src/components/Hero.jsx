import React, { useEffect, useState } from "react";
import { useLanguage } from "./LanguageContext";
import { supabase } from "../supabaseClient";

export default function Hero() {
  const { lang } = useLanguage();
  const [dbProfile, setDbProfile] = useState(null);

  const fetchHeroPublicData = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select(
          "full_name, hero_greeting_en, hero_greeting_id, hero_title_first_en, hero_title_first_id, hero_title_second_en, hero_title_second_id, hero_desc_en, hero_desc_id",
        )
        .eq("id", 1)
        .single();
      if (error) throw error;
      if (data) setDbProfile(data);
    } catch (err) {
      console.error("Error syncing hero landing component:", err.message);
    }
  };

  useEffect(() => {
    fetchHeroPublicData();

    const channel = supabase
      .channel("profiles-hero-live-stream")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles" },
        () => {
          fetchHeroPublicData();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // 🎯 BALIK KE MURNI GREETING TEXT: Langsung todong teks utuh dari inputan config Hero admin lu
  const currentGreeting = dbProfile
    ? lang === "EN"
      ? dbProfile.hero_greeting_en || "Hi, my name is Qisthi Iskandar H."
      : dbProfile.hero_greeting_id || "Halo, nama saya Qisthi Iskandar H."
    : lang === "EN"
      ? "Hi, my name is Qisthi Iskandar H."
      : "Halo, nama saya Qisthi Iskandar H.";

  const currentTitleFirst = dbProfile
    ? lang === "EN"
      ? dbProfile.hero_title_first_en
      : dbProfile.hero_title_first_id
    : lang === "EN"
      ? "System"
      : "Sistem";

  const currentTitleSecond = dbProfile
    ? lang === "EN"
      ? dbProfile.hero_title_second_en
      : dbProfile.hero_title_second_id
    : lang === "EN"
      ? "Architect."
      : "Arsitek.";

  const currentDesc = dbProfile
    ? lang === "EN"
      ? dbProfile.hero_desc_en
      : dbProfile.hero_desc_id
    : lang === "EN"
      ? "I build robust enterprise applications, design scalable system architectures, and automate intricate backend workflows with modern tech stacks."
      : "Saya membangun aplikasi enterprise yang tangguh, merancang arsitektur sistem yang skalabel, dan mengotomatisasi workflow backend yang kompleks dengan tech stack modern.";

  const btnPrimary = lang === "EN" ? "Explore My Work" : "Lihat Proyek Saya";
  const btnSecondary = lang === "EN" ? "Say Hello" : "Hubungi Saya";

  return (
    <section
      id="home"
      className="pt-36 pb-24 px-6 max-w-7xl mx-auto flex flex-col justify-center min-h-[90vh] relative z-10 animate-fade-in-up"
    >
      <div className="space-y-6">
        {/* Label Greeting Utuh Murni dari Config Hero Tanpa Tambahan Variabel Luar */}
        <p className="inline-block bg-emerald-500/10 text-emerald-300 font-mono text-sm px-4 py-1.5 rounded-full border border-emerald-500/20 font-bold">
          {currentGreeting}
        </p>

        {/* Headline */}
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-100 leading-[0.9]">
          <span className="bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
            {currentTitleFirst}
          </span>{" "}
          <br />
          <span className="bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
            {currentTitleSecond}
          </span>
        </h1>

        {/* Sub-headline Description */}
        <p className="text-slate-400 max-w-3xl text-xl leading-relaxed font-light">
          {currentDesc}
        </p>

        {/* CTA Buttons */}
        <div className="flex gap-4 pt-6">
          <a
            href="#projects"
            className="group inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-emerald-500 transition-all duration-300 shadow-lg shadow-emerald-500/20"
          >
            {btnPrimary}
            <span className="transform group-hover:translate-x-1 transition-transform duration-200">
              →
            </span>
          </a>
          <a
            href="#contact"
            className="inline-block border border-slate-700 text-slate-300 px-8 py-4 rounded-xl font-medium hover:bg-slate-800 hover:text-white transition-all"
          >
            {btnSecondary}
          </a>
        </div>
      </div>
    </section>
  );
}
