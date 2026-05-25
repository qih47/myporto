import React, { useState, useEffect } from "react";
import { profileService } from "../../../services/profileService";

export default function TabSkills({ setGlobalMsg }) {
  const [matrixLoading, setMatrixLoading] = useState(false);
  const [skillsLoading, setSkillsLoading] = useState(false);

  const [matrixCards, setMatrixCards] = useState([]);
  const [proficiencyBars, setProficiencyBars] = useState([]);

  // 🔄 FETCH FILTER: Menarik data matrix dan proficiency langsung dari single master profile
  const fetchFullSkillsTabCore = async () => {
    try {
      const data = await profileService.getProfile("matrix_cards, proficiency_bars");
      if (data) {
        setMatrixCards(data.matrix_cards || []);
        setProficiencyBars(data.proficiency_bars || []);
      }
    } catch (error) {
      console.error("Fetch Skills Tab Core Fail:", error.message);
    }
  };

  useEffect(() => {
    fetchFullSkillsTabCore();

    const stream = profileService.subscribeToChanges(
      "profiles-skills-stream",
      () => {
        console.log(
          "Admin Realtime Change Detected! Refreshing Core States..."
        );
        fetchFullSkillsTabCore(); // KUNCIAN: Hit ulang DB biar form admin sinkron instan!
      },
      "id=eq.1"
    );

    return () => {
      profileService.unsubscribe(stream);
    };
  }, []);

  // 🎛️ SUBMIT HANDLER 1: Architectural Focus Cards
  const handleMatrixSubmit = async (e) => {
    e.preventDefault();
    setMatrixLoading(true);
    setGlobalMsg("");
    try {
      await profileService.updateProfile({
        matrix_cards: matrixCards,
        proficiency_bars: proficiencyBars, // Angkut data bars saat update matrix biar gak ilang di row DB!
      });
      setGlobalMsg(
        "🚀 Expertise Matrix dynamic card stack updated successfully!"
      );
    } catch (error) {
      setGlobalMsg(`Matrix Save Fail: ${error.message}`);
    } finally {
      setMatrixLoading(false);
    }
  };

  const updateMatrixCardField = (index, field, value) => {
    const updated = [...matrixCards];
    updated[index][field] = value;
    setMatrixCards(updated);
  };

  // 🎛️ SUBMIT HANDLER 2: Dynamic Proficiency Rating Bars
  const handleBarsSubmit = async (e) => {
    e.preventDefault();
    setSkillsLoading(true);
    setGlobalMsg("");
    try {
      await profileService.updateProfile({
        matrix_cards: matrixCards, // Angkut data cards saat update bars biar gak memicu fallback ghaib!
        proficiency_bars: proficiencyBars,
      });
      setGlobalMsg(
        "📊 Technical proficiency rating map synchronized successfully!"
      );
    } catch (error) {
      setGlobalMsg(`Proficiency Bars Save Fail: ${error.message}`);
    } finally {
      setSkillsLoading(false);
    }
  };

  const updateBarField = (index, field, value) => {
    const updated = [...proficiencyBars];
    updated[index][field] = field === "value" ? parseInt(value) || 0 : value;
    setProficiencyBars(updated);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto text-xs">
      {/* 1. MANAGEMENT FOR ARCHITECTURAL FOCUS CARDS */}
      <form
        onSubmit={handleMatrixSubmit}
        className="bg-[#0b1224] border border-slate-800 p-8 rounded-2xl space-y-6 shadow-xl"
      >
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">
              // 02. Architectural Focus Cards Engine
            </h2>
            <p className="text-[10px] text-slate-500 mt-1">
              Kelola kartu matrix kapabilitas profesional. Jika lebih dari 3,
              sistem otomatis mengaktifkan sliding mode.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              setMatrixCards([
                ...matrixCards,
                {
                  title_en: "",
                  title_id: "",
                  desc_en: "",
                  desc_id: "",
                  stack_str: "",
                },
              ])
            }
            className="bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded hover:bg-emerald-900 font-bold font-mono tracking-wide cursor-pointer text-[10px] uppercase"
          >
            + Add New Matrix Card
          </button>
        </div>

        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {matrixCards.map((card, idx) => (
            <div
              key={idx}
              className="p-5 bg-[#070b18] border border-slate-800 rounded-xl space-y-3 relative"
            >
              <button
                type="button"
                onClick={() =>
                  setMatrixCards(matrixCards.filter((_, i) => i !== idx))
                }
                className="absolute top-4 right-4 text-red-400 hover:text-red-500 font-bold font-mono text-[10px] uppercase cursor-pointer"
              >
                ✕ Delete
              </button>
              <span className="text-slate-500 font-mono font-bold">
                [ NODE MATRIX CARD #{idx + 1} ]
              </span>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 mb-1">
                    Card Title (EN)
                  </label>
                  <input
                    type="text"
                    value={card.title_en || ""}
                    onChange={(e) =>
                      updateMatrixCardField(idx, "title_en", e.target.value)
                    }
                    className="w-full bg-[#050914] border border-slate-800 rounded p-2 text-slate-200 outline-none focus:border-emerald-500/20"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">
                    Card Title (ID)
                  </label>
                  <input
                    type="text"
                    value={card.title_id || ""}
                    onChange={(e) =>
                      updateMatrixCardField(idx, "title_id", e.target.value)
                    }
                    className="w-full bg-[#050914] border border-slate-800 rounded p-2 text-slate-200 outline-none focus:border-emerald-500/20"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 mb-1">
                    Description Narrative (EN)
                  </label>
                  <textarea
                    rows="2"
                    value={card.desc_en || ""}
                    onChange={(e) =>
                      updateMatrixCardField(idx, "desc_en", e.target.value)
                    }
                    className="w-full bg-[#050914] border border-slate-800 rounded p-2 text-slate-300 outline-none resize-none text-[11px] focus:border-emerald-500/20"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">
                    Deskripsi Narasi (ID)
                  </label>
                  <textarea
                    rows="2"
                    value={card.desc_id || ""}
                    onChange={(e) =>
                      updateMatrixCardField(idx, "desc_id", e.target.value)
                    }
                    className="w-full bg-[#050914] border border-slate-800 rounded p-2 text-slate-300 outline-none resize-none text-[11px] focus:border-emerald-500/20"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">
                  Sub-Stack Badges Technologies (Separated by Commas)
                </label>
                <input
                  type="text"
                  placeholder="React, Tailwind CSS, Context API"
                  value={card.stack_str || ""}
                  onChange={(e) =>
                    updateMatrixCardField(idx, "stack_str", e.target.value)
                  }
                  className="w-full bg-[#050914] border border-slate-800 rounded p-2 text-emerald-400 font-mono outline-none tracking-wide focus:border-emerald-500/20"
                  required
                />
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={matrixLoading}
          className="w-full cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-all uppercase tracking-wider shadow-md disabled:opacity-50"
        >
          {matrixLoading
            ? "Deploying Dynamic Structural Data..."
            : "Commit Matrix Cards Structural Map"}
        </button>
      </form>

      {/* 2. DYNAMIC PROFICIENCY RATING BARS */}
      <form
        onSubmit={handleBarsSubmit}
        className="bg-[#0b1224] border border-slate-800 p-8 rounded-2xl space-y-6 shadow-xl"
      >
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-sm font-bold text-amber-400 uppercase tracking-wider">
              // 03. Technical Proficiency Rating Bars Controller
            </h2>
            <p className="text-[10px] text-slate-500 mt-1">
              Tambahkan, edit, dan urutkan baris kemahiran persentase teknologi
              secara dinamis dan real-time.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              setProficiencyBars([
                ...proficiencyBars,
                { name: "New Core Technology", value: 80 },
              ])
            }
            className="bg-amber-950 text-amber-400 border border-amber-500/30 px-3 py-1.5 rounded hover:bg-amber-900 font-bold font-mono tracking-wide cursor-pointer text-[10px] uppercase"
          >
            + Add Dynamic Bar
          </button>
        </div>

        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {proficiencyBars.length === 0 ? (
            <p className="text-center py-6 text-slate-600 font-mono">
              // No proficiency bar nodes injected yet
            </p>
          ) : (
            proficiencyBars.map((bar, idx) => (
              <div
                key={idx}
                className="flex gap-3 items-center bg-[#070b18] border border-slate-800 p-3 rounded-xl relative group"
              >
                <div className="w-8 h-5 flex items-center justify-center bg-slate-900 border border-slate-800 text-slate-500 rounded font-mono text-[10px] select-none font-bold">
                  #{idx + 1}
                </div>

                <div className="w-2/3">
                  <input
                    type="text"
                    value={bar.name}
                    onChange={(e) =>
                      updateBarField(idx, "name", e.target.value)
                    }
                    className="w-full bg-[#050914] border border-slate-800 rounded p-2 text-slate-200 outline-none focus:border-amber-500/20 font-medium"
                    placeholder="e.g., PHP (CodeIgniter & Native)"
                    required
                  />
                </div>

                <div className="w-24 relative flex items-center">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={bar.value}
                    onChange={(e) =>
                      updateBarField(idx, "value", e.target.value)
                    }
                    className="w-full bg-[#050914] border border-slate-800 rounded p-2 text-amber-400 font-bold text-center outline-none pr-6 focus:border-amber-500/20 font-mono"
                    placeholder="85"
                    required
                  />
                  <span className="absolute right-2.5 text-slate-500 font-bold font-mono text-[10px] select-none">
                    %
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setProficiencyBars(
                      proficiencyBars.filter((_, i) => i !== idx)
                    )
                  }
                  className="bg-slate-800/60 border border-slate-700/80 p-2 rounded-lg text-red-400 hover:text-red-500 transition-colors cursor-pointer font-bold shrink-0 font-mono"
                >
                  ✕ Remove
                </button>
              </div>
            ))
          )}
        </div>

        <button
          type="submit"
          disabled={skillsLoading}
          className="w-full cursor-pointer bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 rounded-xl transition-all uppercase tracking-wider shadow-md disabled:opacity-50"
        >
          {skillsLoading
            ? "Synchronizing Rating System Configuration..."
            : "Commit Proficiency Bars Matrix"}
        </button>
      </form>
    </div>
  );
}
