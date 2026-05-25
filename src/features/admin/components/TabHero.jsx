import React, { useState, useEffect } from "react";
import { profileService } from "../../../services/profileService";

export default function TabHero({ setGlobalMsg }) {
  const [loading, setLoading] = useState(false);
  const [heroForm, setHeroForm] = useState({
    hero_greeting_en: "",
    hero_greeting_id: "",
    hero_title_first_en: "",
    hero_title_first_id: "",
    hero_title_second_en: "",
    hero_title_second_id: "",
    hero_desc_en: "",
    hero_desc_id: "",
  });

  const fetchHeroAdminData = async () => {
    try {
      const data = await profileService.getProfile(
        "hero_greeting_en, hero_greeting_id, hero_title_first_en, hero_title_first_id, hero_title_second_en, hero_title_second_id, hero_desc_en, hero_desc_id"
      );

      if (data) {
        setHeroForm({
          hero_greeting_en: data.hero_greeting_en || "",
          hero_greeting_id: data.hero_greeting_id || "",
          hero_title_first_en: data.hero_title_first_en || "",
          hero_title_first_id: data.hero_title_first_id || "",
          hero_title_second_en: data.hero_title_second_en || "",
          hero_title_second_id: data.hero_title_second_id || "",
          hero_desc_en: data.hero_desc_en || "",
          hero_desc_id: data.hero_desc_id || "",
        });
      }
    } catch (error) {
      console.error("Fetch Hero Admin Data Failure:", error.message);
    }
  };

  useEffect(() => {
    fetchHeroAdminData();
  }, []);

  const handleHeroSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setGlobalMsg("");
    try {
      await profileService.updateProfile(heroForm);
      setGlobalMsg(
        "🚀 Main Hero section branding configuration deployed successfully!"
      );
    } catch (error) {
      setGlobalMsg(`Hero Mutation Fail: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleHeroSubmit}
      className="max-w-4xl mx-auto bg-[#0b1224] border border-slate-800 p-8 rounded-2xl space-y-6 text-xs shadow-xl"
    >
      <div className="border-b border-slate-800/60 pb-3">
        <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">
          // 01. Core Hero Section Controller
        </h2>
        <p className="text-[10px] text-slate-500 mt-1">
          Mengontrol teks sambutan, punchline teks gradasi utama, dan deskripsi
          singkat landing page portofolio Anda.
        </p>
      </div>

      {/* Greeting Label */}
      <div className="p-4 bg-[#070b18] border border-slate-800/80 rounded-xl space-y-3">
        <span className="text-emerald-500 font-bold font-mono tracking-wider">
          [ GREETING PILL NODE ]
        </span>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-500 mb-1">
              Greeting Text (EN)
            </label>
            <input
              type="text"
              value={heroForm.hero_greeting_en}
              onChange={(e) =>
                setHeroForm({ ...heroForm, hero_greeting_en: e.target.value })
              }
              className="w-full bg-[#050914] border border-slate-800 rounded p-2 text-slate-200 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-slate-500 mb-1">
              Greeting Text (ID)
            </label>
            <input
              type="text"
              value={heroForm.hero_greeting_id}
              onChange={(e) =>
                setHeroForm({ ...heroForm, hero_greeting_id: e.target.value })
              }
              className="w-full bg-[#050914] border border-slate-800 rounded p-2 text-slate-200 outline-none"
              required
            />
          </div>
        </div>
      </div>

      {/* Main Headline */}
      <div className="p-4 bg-[#070b18] border border-slate-800/80 rounded-xl space-y-3">
        <span className="text-emerald-500 font-bold font-mono tracking-wider">
          [ HEADLINE PUNCHLINE GRADIENT ]
        </span>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-500 mb-1">
              First Line - White/Slate (EN)
            </label>
            <input
              type="text"
              value={heroForm.hero_title_first_en}
              onChange={(e) =>
                setHeroForm({
                  ...heroForm,
                  hero_title_first_en: e.target.value,
                })
              }
              className="w-full bg-[#050914] border border-slate-800 rounded p-2 text-slate-200 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-slate-500 mb-1">
              First Line - White/Slate (ID)
            </label>
            <input
              type="text"
              value={heroForm.hero_title_first_id}
              onChange={(e) =>
                setHeroForm({
                  ...heroForm,
                  hero_title_first_id: e.target.value,
                })
              }
              className="w-full bg-[#050914] border border-slate-800 rounded p-2 text-slate-200 outline-none"
              required
            />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-500 mb-1">
              Second Line - Emerald/Cyan (EN)
            </label>
            <input
              type="text"
              value={heroForm.hero_title_second_en}
              onChange={(e) =>
                setHeroForm({
                  ...heroForm,
                  hero_title_second_en: e.target.value,
                })
              }
              className="w-full bg-[#050914] border border-slate-800 rounded p-2 text-slate-200 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-slate-500 mb-1">
              Second Line - Emerald/Cyan (ID)
            </label>
            <input
              type="text"
              value={heroForm.hero_title_second_id}
              onChange={(e) =>
                setHeroForm({
                  ...heroForm,
                  hero_title_second_id: e.target.value,
                })
              }
              className="w-full bg-[#050914] border border-slate-800 rounded p-2 text-slate-200 outline-none"
              required
            />
          </div>
        </div>
      </div>

      {/* Narrative Description */}
      <div className="p-4 bg-[#070b18] border border-slate-800/80 rounded-xl space-y-3">
        <span className="text-emerald-500 font-bold font-mono tracking-wider">
          [ BRANDING DESCRIPTION PARAGRAPH ]
        </span>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-500 mb-1">
              Main Description (EN)
            </label>
            <textarea
              rows="3"
              value={heroForm.hero_desc_en}
              onChange={(e) =>
                setHeroForm({ ...heroForm, hero_desc_en: e.target.value })
              }
              className="w-full bg-[#050914] border border-slate-800 rounded p-2 text-slate-300 outline-none resize-none leading-relaxed text-[11px]"
              required
            />
          </div>
          <div>
            <label className="block text-slate-500 mb-1">
              Deskripsi Utama (ID)
            </label>
            <textarea
              rows="3"
              value={heroForm.hero_desc_id}
              onChange={(e) =>
                setHeroForm({ ...heroForm, hero_desc_id: e.target.value })
              }
              className="w-full bg-[#050914] border border-slate-800 rounded p-2 text-slate-300 outline-none resize-none leading-relaxed text-[11px]"
              required
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-all uppercase tracking-wider shadow-md"
      >
        {loading
          ? "Transmitting Hero Vector Configurations..."
          : "Commit Hero Configuration Map"}
      </button>
    </form>
  );
}
