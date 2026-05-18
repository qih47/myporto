import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../../supabaseClient";

export default function TabProjects({ setGlobalMsg }) {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    title_en: "",
    title_id: "",
    desc_en: "",
    desc_id: "",
    tech: "",
    badge_en: "Production",
    badge_id: "Produksi",
    preview_url: "",
    github_url: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [translateStatus, setTranslateStatus] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const typingTimeoutRef = useRef(null);

  const fetchAdminProjects = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error("Fetch Admin Error:", error.message);
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminProjects();

    const adminChannel = supabase
      .channel("admin-realtime-stream")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "projects" },
        () => {
          fetchAdminProjects();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(adminChannel);
    };
  }, []);

  const triggerAutoTranslate = (targetField, value) => {
    if (isEditing) return;
    setTranslateStatus("TYPING");

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(async () => {
      if (!value.trim()) {
        setTranslateStatus("");
        return;
      }

      setTranslateStatus("TRANSLATING");
      const endpoint = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=id&dt=t&q=${encodeURIComponent(value)}`;

      try {
        const res = await fetch(endpoint);
        if (!res.ok) throw new Error(`Translation Status: ${res.status}`);
        const json = await res.json();

        if (json && json[0]) {
          let translatedText = json[0]
            .map((item) => item[0])
            .join("")
            .trim();
          const techGlossary = {
            "tumpukan penuh": "full-stack",
            "tumpukan lengkap": "full-stack",
            "arsitektur sistem": "system architecture",
            "ujung belakang": "backend",
            "latar belakang": "backend",
            "kerangka kerja": "framework",
            "waktu nyata": "real-time",
            penyetelan: "tuning",
            "basis data": "database",
            "gudang kode": "repository",
          };

          let lowerText = translatedText.toLowerCase();
          Object.keys(techGlossary).forEach((kakuKey) => {
            if (lowerText.includes(kakuKey)) {
              const regex = new RegExp(kakuKey, "gi");
              translatedText = translatedText.replace(
                regex,
                techGlossary[kakuKey],
              );
            }
          });

          setFormData((prev) => {
            const updated = { ...prev };
            if (targetField === "title_en") updated.title_id = translatedText;
            if (targetField === "desc_en") updated.desc_id = translatedText;
            if (targetField === "badge_en") {
              if (value.toLowerCase() === "production")
                updated.badge_id = "Produksi";
              else if (value.toLowerCase() === "development")
                updated.badge_id = "Pengembangan";
              else updated.badge_id = translatedText;
            }
            return updated;
          });
          setTranslateStatus("SUCCESS");
        }
      } catch (err) {
        console.error("Translation Failure:", err);
        setTranslateStatus("ERROR");
      }
    }, 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setGlobalMsg("");

    const techArray = formData.tech
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t !== "");
    const projectPayload = {
      title_en: formData.title_en,
      title_id: formData.title_id,
      desc_en: formData.desc_en,
      desc_id: formData.desc_id,
      tech: techArray,
      badge_en: formData.badge_en,
      badge_id: formData.badge_id,
      preview_url: formData.preview_url || null,
      github_url: formData.github_url || null,
    };

    try {
      if (isEditing) {
        const { error } = await supabase
          .from("projects")
          .update(projectPayload)
          .eq("id", editId);
        if (error) throw error;
        setGlobalMsg("Project deployment update sequence successful!");
        setIsEditing(false);
        setEditId(null);
      } else {
        const { error } = await supabase
          .from("projects")
          .insert([projectPayload]);
        if (error) throw error;
        setGlobalMsg("Project deployment sequence successful!");
      }
      resetForm();
    } catch (error) {
      setGlobalMsg(`Deployment Fail: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (
      !window.confirm(
        `Apakah Anda yakin ingin mematikan Node Proyek: "${title}"?`,
      )
    )
      return;
    try {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
      setGlobalMsg(`Node [${title}] successfully terminated.`);
      if (editId === id) handleCancelEdit();
    } catch (error) {
      setGlobalMsg(`Termination Fail: ${error.message}`);
    }
  };

  const resetForm = () => {
    setFormData({
      title_en: "",
      title_id: "",
      desc_en: "",
      desc_id: "",
      tech: "",
      badge_en: "Production",
      badge_id: "Produksi",
      preview_url: "",
      github_url: "",
    });
    setTranslateStatus("");
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditId(null);
    resetForm();
  };

  return (
    <div className="grid lg:grid-cols-12 gap-8 items-start">
      <form
        onSubmit={handleSubmit}
        className="lg:col-span-7 bg-[#0b1224] border border-slate-800 p-6 rounded-2xl space-y-5 text-xs shadow-xl"
      >
        <div className="flex justify-between items-center border-b border-slate-800/60 pb-3">
          <span className="text-slate-400 font-bold uppercase tracking-wider">
            {isEditing ? "// Edit Project Node" : "// Create Project Node"}
          </span>
          <div className="text-[10px] tracking-wide font-semibold">
            {translateStatus === "TYPING" && (
              <span className="text-amber-400 animate-pulse">
                // User is typing...
              </span>
            )}
            {translateStatus === "TRANSLATING" && (
              <span className="text-cyan-400 animate-bounce">
                // Gemini AI processing...
              </span>
            )}
            {translateStatus === "SUCCESS" && (
              <span className="text-emerald-400">
                // Pipeline sync synchronized
              </span>
            )}
            {translateStatus === "ERROR" && (
              <span className="text-red-400">// Gemini node failure</span>
            )}
          </div>
          {isEditing && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="cursor-pointer text-slate-400 hover:text-red-400"
            >
              [ Cancel Edit ]
            </button>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-4 md:border-r md:border-slate-800/60 md:pr-4">
            <div>
              <label className="block text-slate-500 mb-1">
                Project Title (EN)
              </label>
              <input
                type="text"
                value={formData.title_en}
                onChange={(e) => {
                  setFormData({ ...formData, title_en: e.target.value });
                  triggerAutoTranslate("title_en", e.target.value);
                }}
                className="w-full bg-[#070b18] border border-slate-800 rounded-lg p-2.5 outline-none focus:border-emerald-500/30 text-slate-200"
                required
              />
            </div>
            <div>
              <label className="block text-slate-500 mb-1">
                Description (EN)
              </label>
              <textarea
                rows="4"
                value={formData.desc_en}
                onChange={(e) => {
                  setFormData({ ...formData, desc_en: e.target.value });
                  triggerAutoTranslate("desc_en", e.target.value);
                }}
                className="w-full bg-[#070b18] border border-slate-800 rounded-lg p-2.5 outline-none focus:border-emerald-500/30 text-slate-200 resize-none"
                required
              ></textarea>
            </div>
            <div>
              <label className="block text-slate-500 mb-1">
                Badge System (EN)
              </label>
              <input
                type="text"
                value={formData.badge_en}
                onChange={(e) => {
                  setFormData({ ...formData, badge_en: e.target.value });
                  triggerAutoTranslate("badge_en", e.target.value);
                }}
                className="w-full bg-[#070b18] border border-slate-800 rounded-lg p-2.5 outline-none focus:border-emerald-500/30 text-slate-200"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-slate-500 mb-1">
                Nama Proyek (ID)
              </label>
              <input
                type="text"
                value={formData.title_id}
                onChange={(e) =>
                  setFormData({ ...formData, title_id: e.target.value })
                }
                className="w-full bg-[#070b18] border border-slate-800 rounded-lg p-2.5 outline-none focus:border-emerald-500/30 text-slate-200"
                required
              />
            </div>
            <div>
              <label className="block text-slate-500 mb-1">
                Deskripsi Proyek (ID)
              </label>
              <textarea
                rows="4"
                value={formData.desc_id}
                onChange={(e) =>
                  setFormData({ ...formData, desc_id: e.target.value })
                }
                className="w-full bg-[#070b18] border border-slate-800 rounded-lg p-2.5 outline-none focus:border-emerald-500/30 text-slate-200 resize-none"
                required
              ></textarea>
            </div>
            <div>
              <label className="block text-slate-500 mb-1">
                Sistem Badge (ID)
              </label>
              <input
                type="text"
                value={formData.badge_id}
                onChange={(e) =>
                  setFormData({ ...formData, badge_id: e.target.value })
                }
                className="w-full bg-[#070b18] border border-slate-800 rounded-lg p-2.5 outline-none focus:border-emerald-500/30 text-slate-200"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/80 pt-4 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-500 mb-1">
                Tech Stack (Commas separated)
              </label>
              <input
                type="text"
                placeholder="React, PHP, MySQL"
                value={formData.tech}
                onChange={(e) =>
                  setFormData({ ...formData, tech: e.target.value })
                }
                className="w-full bg-[#070b18] border border-slate-800 rounded-lg p-2.5 outline-none focus:border-emerald-500/30 text-slate-200"
                required
              />
            </div>
            <div>
              <label className="block text-slate-500 mb-1">
                Live Preview URL
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={formData.preview_url}
                onChange={(e) =>
                  setFormData({ ...formData, preview_url: e.target.value })
                }
                className="w-full bg-[#070b18] border border-slate-800 rounded-lg p-2.5 outline-none focus:border-emerald-500/30 text-slate-200"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-slate-500 mb-1">
                GitHub Repository Target URL
              </label>
              <input
                type="url"
                placeholder="https://github.com/..."
                value={formData.github_url}
                onChange={(e) =>
                  setFormData({ ...formData, github_url: e.target.value })
                }
                className="w-full bg-[#070b18] border border-slate-800 rounded-lg p-2.5 outline-none focus:border-emerald-500/30 text-slate-200"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full cursor-pointer text-white font-bold py-3 rounded-xl transition-all text-xs uppercase tracking-wider ${isEditing ? "bg-amber-600 hover:bg-amber-500" : "bg-emerald-600 hover:bg-emerald-500"}`}
        >
          {loading
            ? "Processing Operations..."
            : isEditing
              ? "Update Node Structure"
              : "Commit Changes to Database"}
        </button>
      </form>

      <div className="lg:col-span-5 bg-[#0b1224] border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4 h-full max-h-[640px] flex flex-col">
        <p className="text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800/60 pb-3">
          // Manage Repositories ({projects.length})
        </p>
        {fetchLoading ? (
          <div className="text-center py-8 text-slate-500 animate-pulse text-xs">
            Fetching storage elements...
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-8 text-slate-600 text-xs">
            // Empty record block
          </div>
        ) : (
          <div className="overflow-y-auto space-y-3 flex-1 pr-1 custom-scrollbar">
            {projects.map((project) => (
              <div
                key={project.id}
                className={`p-4 bg-[#070b18] border rounded-xl flex items-center justify-between gap-4 transition-all ${editId === project.id ? "border-amber-500/40 shadow-md shadow-amber-500/5" : "border-slate-800/80 hover:border-slate-700"}`}
              >
                <div className="truncate space-y-1">
                  <p className="text-xs font-bold text-slate-200 truncate">
                    {project.title_en}
                  </p>
                  <div className="flex gap-2 text-[9px] font-mono text-slate-500">
                    <span>ID: {project.id}</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-semibold">
                      {project.badge_id}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 text-[10px]">
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setEditId(project.id);
                      setFormData({
                        title_en: project.title_en,
                        title_id: project.title_id,
                        desc_en: project.desc_en,
                        desc_id: project.desc_id,
                        tech: project.tech.join(", "),
                        badge_en: project.badge_en || "Production",
                        badge_id: project.badge_id || "Produksi",
                        preview_url: project.preview_url || "",
                        github_url: project.github_url || "",
                      });
                    }}
                    className="cursor-pointer bg-slate-800/40 border border-slate-700 text-slate-300 px-2.5 py-1.5 rounded-lg hover:bg-amber-500/10 hover:text-amber-400 hover:border-amber-500/30 transition-all"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project.id, project.title_en)}
                    className="cursor-pointer bg-slate-800/40 border border-slate-700 text-red-400 px-2.5 py-1.5 rounded-lg hover:bg-red-500/10 hover:border-red-500/30 transition-all"
                  >
                    Del
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
