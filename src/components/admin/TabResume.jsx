import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

export default function TabResume({ setGlobalMsg }) {
  const [loading, setLoading] = useState(false);
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);

  const fetchResumeAdminData = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("resume_education, resume_experience")
        .eq("id", 1)
        .single();
      if (error) throw error;
      if (data) {
        setEducation(data.resume_education || []);
        setExperience(data.resume_experience || []);
      }
    } catch (error) {
      console.error("Fetch Resume Admin Fail Node:", error.message);
    }
  };

  useEffect(() => {
    fetchResumeAdminData();
  }, []);

  const handleResumeSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setGlobalMsg("");
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          resume_education: education,
          resume_experience: experience,
          updated_at: new Date().toISOString(),
        })
        .eq("id", 1);
      if (error) throw error;
      setGlobalMsg(
        "🚀 Professional Journey Core map package uploaded successfully!",
      );
    } catch (error) {
      setGlobalMsg(`Sync Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Helper Pendidikan
  const updateEduField = (index, field, val) => {
    const updated = [...education];
    updated[index][field] = val;
    setEducation(updated);
  };

  // Helper Pengalaman Kerja
  const updateExpField = (index, field, val) => {
    const updated = [...experience];
    updated[index][field] = val;
    setExperience(updated);
  };

  // Helper Bullet Points Kerja (Dinamis Array)
  const updateBulletField = (expIdx, bulletIdx, lang, val) => {
    const updated = [...experience];
    updated[expIdx][lang][bulletIdx] = val;
    setExperience(updated);
  };

  const addBulletPoint = (expIdx) => {
    const updated = [...experience];
    if (!updated[expIdx].bullets_en) updated[expIdx].bullets_en = [];
    if (!updated[expIdx].bullets_id) updated[expIdx].bullets_id = [];
    updated[expIdx].bullets_en.push("");
    updated[expIdx].bullets_id.push("");
    setExperience(updated);
  };

  const removeBulletPoint = (expIdx, bulletIdx) => {
    const updated = [...experience];
    updated[expIdx].bullets_en = updated[expIdx].bullets_en.filter(
      (_, i) => i !== bulletIdx,
    );
    updated[expIdx].bullets_id = updated[expIdx].bullets_id.filter(
      (_, i) => i !== bulletIdx,
    );
    setExperience(updated);
  };

  return (
    <form
      onSubmit={handleResumeSubmit}
      className="max-w-4xl mx-auto bg-[#0b1224] border border-slate-800 p-8 rounded-2xl space-y-8 text-xs shadow-xl"
    >
      <div className="border-b border-slate-800/60 pb-3">
        <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">
          // 04. Professional Journey Node Controller
        </h2>
        <p className="text-[10px] text-slate-500 mt-1">
          Mengatur riwayat akademis teknis serta rekam jejak deskripsi
          pengerjaan project berskala industri.
        </p>
      </div>

      {/* SEKSI 1: EDUCATION BLOCKS */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-slate-400 font-bold tracking-widest">
            // MANAGEMENT SEKSI ACADEMIC / TRAINING
          </h3>
          <button
            type="button"
            onClick={() =>
              setEducation([
                ...education,
                {
                  title_en: "",
                  title_id: "",
                  date: "",
                  institution: "",
                  desc_en: "",
                  desc_id: "",
                },
              ])
            }
            className="bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded hover:bg-emerald-900 font-bold font-mono tracking-wide"
          >
            + Add Education Node
          </button>
        </div>

        <div className="space-y-4">
          {education.map((edu, idx) => (
            <div
              key={idx}
              className="p-4 bg-[#070b18] border border-slate-800 rounded-xl space-y-3 relative"
            >
              <button
                type="button"
                onClick={() =>
                  setEducation(education.filter((_, i) => i !== idx))
                }
                className="absolute top-3 right-3 text-red-400 hover:text-red-500 font-bold"
              >
                ✕ Delete
              </button>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-slate-500 mb-1">
                    Training/Degree Title (EN)
                  </label>
                  <input
                    type="text"
                    value={edu.title_en || ""}
                    onChange={(e) =>
                      updateEduField(idx, "title_en", e.target.value)
                    }
                    className="w-full bg-[#050914] border border-slate-800 rounded p-2 text-slate-200 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">
                    Year / Date
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 2025"
                    value={edu.date || ""}
                    onChange={(e) =>
                      updateEduField(idx, "date", e.target.value)
                    }
                    className="w-full bg-[#050914] border border-slate-800 rounded p-2 text-slate-200 text-center outline-none"
                    required
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 mb-1">
                    Training/Degree Title (ID)
                  </label>
                  <input
                    type="text"
                    value={edu.title_id || ""}
                    onChange={(e) =>
                      updateEduField(idx, "title_id", e.target.value)
                    }
                    className="w-full bg-[#050914] border border-slate-800 rounded p-2 text-slate-200 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">
                    Institution Name
                  </label>
                  <input
                    type="text"
                    value={edu.institution || ""}
                    onChange={(e) =>
                      updateEduField(idx, "institution", e.target.value)
                    }
                    className="w-full bg-[#050914] border border-slate-800 rounded p-2 text-slate-200 outline-none"
                    required
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 mb-1">
                    Short Description (EN)
                  </label>
                  <textarea
                    rows="2"
                    value={edu.desc_en || ""}
                    onChange={(e) =>
                      updateEduField(idx, "desc_en", e.target.value)
                    }
                    className="w-full bg-[#050914] border border-slate-800 rounded p-2 text-slate-300 outline-none resize-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">
                    Deskripsi Singkat (ID)
                  </label>
                  <textarea
                    rows="2"
                    value={edu.desc_id || ""}
                    onChange={(e) =>
                      updateEduField(idx, "desc_id", e.target.value)
                    }
                    className="w-full bg-[#050914] border border-slate-800 rounded p-2 text-slate-300 outline-none resize-none"
                    required
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SEKSI 2: PROFESSIONAL EXPERIENCES DECK */}
      <div className="border-t border-slate-800/60 pt-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-slate-400 font-bold tracking-widest">
            // MANAGEMENT SEKSI PROFESSIONAL EXPERIENCES
          </h3>
          <button
            type="button"
            onClick={() =>
              setExperience([
                ...experience,
                {
                  role_en: "",
                  role_id: "",
                  date: "",
                  company: "",
                  bullets_en: [""],
                  bullets_id: [""],
                },
              ])
            }
            className="bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded hover:bg-emerald-900 font-bold font-mono tracking-wide"
          >
            + Add Job Experience Node
          </button>
        </div>

        <div className="space-y-6">
          {experience.map((exp, expIdx) => (
            <div
              key={expIdx}
              className="p-5 bg-[#070b18] border border-slate-800 rounded-xl space-y-4 relative"
            >
              <button
                type="button"
                onClick={() =>
                  setExperience(experience.filter((_, i) => i !== expIdx))
                }
                className="absolute top-4 right-4 text-red-400 hover:text-red-500 font-bold uppercase tracking-wider text-[10px]"
              >
                ✕ Terminate Job
              </button>
              <span className="text-emerald-500 font-mono font-bold">
                [ WORK BLOCK NODE #{expIdx + 1} ]
              </span>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-500 mb-1">
                    Role / Position Title (EN)
                  </label>
                  <input
                    type="text"
                    value={exp.role_en || ""}
                    onChange={(e) =>
                      updateExpField(expIdx, "role_en", e.target.value)
                    }
                    className="w-full bg-[#050914] border border-slate-800 rounded p-2 text-slate-200 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">
                    Timeframe / Date Range
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 2025 - Present"
                    value={exp.date || ""}
                    onChange={(e) =>
                      updateExpField(expIdx, "date", e.target.value)
                    }
                    className="w-full bg-[#050914] border border-slate-800 rounded p-2 text-slate-200 text-center outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">
                    Company / Industry Sector Name
                  </label>
                  <input
                    type="text"
                    value={exp.company || ""}
                    onChange={(e) =>
                      updateExpField(expIdx, "company", e.target.value)
                    }
                    className="w-full bg-[#050914] border border-slate-800 rounded p-2 text-slate-200 outline-none"
                    required
                  />
                </div>
              </div>
              <div className="w-full">
                <label className="block text-slate-500 mb-1">
                  Role / Position Title (ID)
                </label>
                <input
                  type="text"
                  value={exp.role_id || ""}
                  onChange={(e) =>
                    updateExpField(expIdx, "role_id", e.target.value)
                  }
                  className="w-full bg-[#050914] border border-slate-800 rounded p-2 text-slate-200 outline-none"
                  required
                />
              </div>

              {/* NESTED DYNAMIC BULLET POINTS INTERFACE */}
              <div className="space-y-3 pt-2 border-t border-slate-800/60">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-mono font-semibold">
                    // Job Responsibilities & Bullet Achievements
                  </span>
                  <button
                    type="button"
                    onClick={() => addBulletPoint(expIdx)}
                    className="text-emerald-400 hover:text-emerald-300 font-bold text-[10px] uppercase font-mono"
                  >
                    + Add Bullet Item
                  </button>
                </div>

                <div className="space-y-2">
                  {(exp.bullets_en || []).map((_, bulletIdx) => (
                    <div
                      key={bulletIdx}
                      className="flex gap-3 bg-[#050914] border border-slate-800/80 p-3 rounded-lg items-start"
                    >
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          placeholder="Bullet detail achievement string in English..."
                          value={exp.bullets_en[bulletIdx] || ""}
                          onChange={(e) =>
                            updateBulletField(
                              expIdx,
                              bulletIdx,
                              "bullets_en",
                              e.target.value,
                            )
                          }
                          className="w-full bg-[#03060f] border border-slate-800/80 rounded p-1.5 text-slate-300 outline-none text-[11px]"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Butir detail capaian kerja dalam Bahasa Indonesia..."
                          value={exp.bullets_id[bulletIdx] || ""}
                          onChange={(e) =>
                            updateBulletField(
                              expIdx,
                              bulletIdx,
                              "bullets_id",
                              e.target.value,
                            )
                          }
                          className="w-full bg-[#03060f] border border-slate-800/80 rounded p-1.5 text-slate-300 outline-none text-[11px]"
                          required
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeBulletPoint(expIdx, bulletIdx)}
                        className="text-red-400 hover:text-red-500 font-mono text-xs font-bold pt-1.5"
                        disabled={exp.bullets_en.length <= 1}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-all uppercase tracking-wider shadow-md"
      >
        {loading
          ? "Transmitting Credentials & Job Matrix Packets..."
          : "Commit Full Qualifications Map"}
      </button>
    </form>
  );
}
