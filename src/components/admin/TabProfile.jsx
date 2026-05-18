import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

export default function TabProfile({ setGlobalMsg }) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // 1 Single Master State Block
  const [formData, setFormData] = useState({
    full_name: "",
    avatar_url: "",
    sub_headline_en: "",
    sub_headline_id: "",
    location_en: "",
    location_id: "",
    spec_en: "",
    spec_id: "",
    frameworks_text: "",
    tech_inventory_string: "",
    is_available: true,
    summary_en: "",
    summary_id: "",
    sub_summary_en: "",
    sub_summary_id: "",
    // Contact Info Integration
    contact_location: "",
    contact_phone: "",
    contact_email: "",
    contact_linkedin: "",
    contact_github: "",
    // Dynamic Arrays
    competency_cards: [],
  });

  const fetchProfileAdminData = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", 1)
        .single();
      if (error && error.code !== "PGRST116") throw error;
      if (data) {
        setFormData({
          full_name: data.full_name || "",
          avatar_url: data.avatar_url || "",
          sub_headline_en: data.sub_headline_en || "",
          sub_headline_id: data.sub_headline_id || "",
          location_en: data.location_en || "",
          location_id: data.location_id || "",
          spec_en: data.spec_en || "",
          spec_id: data.spec_id || "",
          frameworks_text: data.frameworks_text || "",
          tech_inventory_string: data.tech_inventory
            ? data.tech_inventory.join(", ")
            : "",
          is_available: data.is_available ?? true,
          summary_en: data.summary_en || "",
          summary_id: data.summary_id || "",
          sub_summary_en: data.sub_summary_en || "",
          sub_summary_id: data.sub_summary_id || "",
          contact_location: data.contact_location || "",
          contact_phone: data.contact_phone || "",
          contact_email: data.contact_email || "",
          contact_linkedin: data.contact_linkedin || "",
          contact_github: data.contact_github || "",
          competency_cards: data.competency_cards || [],
        });
      }
    } catch (error) {
      console.error("Fetch Master Profile Error:", error.message);
    }
  };

  useEffect(() => {
    fetchProfileAdminData();

    // 🎧 REALTIME INTERCEPTOR: Dengerin perubahan data baris secara agresif
    const stream = supabase
      .channel("profiles-master-stream")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles", filter: "id=eq.1" },
        (payload) => {
          console.log("Realtime Profile Sync Captured:", payload.new);
          // Langsung paksa inject data baru dari postgres ke state tanpa nunggu fetch lambat
          if (payload.new) {
            setFormData((prev) => ({
              ...prev,
              ...payload.new,
              tech_inventory_string: payload.new.tech_inventory
                ? payload.new.tech_inventory.join(", ")
                : prev.tech_inventory_string,
            }));
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(stream);
    };
  }, []);

  // 🚀 ENGINE UPLOAD STORAGE: Direct pipeline ke Supabase Storage Bucket 'avatars'
  const handleAvatarUpload = async (e) => {
    try {
      setUploading(true);
      setGlobalMsg("");
      const file = e.target.files[0];
      if (!file) return;

      // Buat nama file unik berdasarkan timestamp biar gak tabrakan di bucket cache
      const fileExt = file.name.split(".").pop();
      const fileName = `avatar_qisthi_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // 1. Upload file fisik ke bucket 'avatars' (Pastikan bucket lu diset PUBLIC di dashboard Supabase!)
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { cacheControl: "3600", upsert: true });

      if (uploadError) throw uploadError;

      // 2. Ambil URL Publik murni dari storage asset
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      // 3. Langsung tembak state lokal biar preview berubah instan tanpa nunggu commit form!
      setFormData((prev) => ({ ...prev, avatar_url: publicUrl }));
      setGlobalMsg(
        "📸 New Avatar uploaded to storage pipeline! Click commit to save permanently.",
      );
    } catch (error) {
      setGlobalMsg(`Upload Storage Failure: ${error.message}`);
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleMasterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setGlobalMsg("");

    const techArray = formData.tech_inventory_string
      .split(",")
      .map((i) => i.trim())
      .filter((i) => i !== "");

    const payload = {
      ...formData,
      tech_inventory: techArray,
      updated_at: new Date().toISOString(),
    };
    delete payload.tech_inventory_string;

    try {
      const { error } = await supabase
        .from("profiles")
        .update(payload)
        .eq("id", 1);
      if (error) throw error;
      setGlobalMsg(
        "🚀 Single Terminal Configuration Package Saved Successfully!",
      );
    } catch (error) {
      setGlobalMsg(`Sync Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const updateCard = (index, field, val) => {
    const updated = [...formData.competency_cards];
    updated[index][field] = val;
    setFormData({ ...formData, competency_cards: updated });
  };

  return (
    <form
      onSubmit={handleMasterSubmit}
      className="max-w-4xl mx-auto bg-[#0b1224] border border-slate-800 p-8 rounded-2xl space-y-8 text-xs shadow-xl"
    >
      <div className="border-b border-slate-800/60 pb-3">
        <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">
          // Unified Dynamic Core System Controller
        </h2>
        <p className="text-[10px] text-slate-500 mt-1">
          Mengontrol identitas fisik, teks narasi multialur, kartu kompetensi,
          kontak repositori, dan metadata core portfolio.
        </p>
      </div>

      {/* SECTION 1: IDENTITY */}
      <div className="space-y-4">
        <h3 className="text-slate-400 font-bold tracking-widest">
          // SEKSI 1: CORE IDENTITY & AVATAR
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-500 mb-1">
              Professional Full Name
            </label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) =>
                setFormData({ ...formData, full_name: e.target.value })
              }
              className="w-full bg-[#070b18] border border-slate-800 rounded-lg p-2.5 outline-none focus:border-emerald-500/30 text-slate-200"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="block text-slate-500 mb-1">
              Avatar Profile Image{" "}
              {uploading && (
                <span className="text-cyan-400 font-mono text-[10px] animate-pulse">
                  (Uploading...)
                </span>
              )}
            </label>
            <div className="flex items-center gap-3 bg-[#070b18] border border-slate-800 rounded-lg p-1.5 h-[39px]">
              {formData.avatar_url && (
                <img
                  src={formData.avatar_url}
                  alt="Preview"
                  className="w-7 h-7 object-cover rounded-md border border-slate-700 shrink-0"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                disabled={uploading}
                className="w-full text-xs text-slate-400 file:mr-3 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-[11px] file:bg-slate-800 file:text-emerald-400 file:cursor-pointer outline-none disabled:opacity-50"
              />
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-500 mb-1">
              Sub-Headline Label (EN)
            </label>
            <input
              type="text"
              value={formData.sub_headline_en}
              onChange={(e) =>
                setFormData({ ...formData, sub_headline_en: e.target.value })
              }
              className="w-full bg-[#070b18] border border-slate-800 rounded-lg p-2.5 outline-none focus:border-emerald-500/30 text-slate-200"
              required
            />
          </div>
          <div>
            <label className="block text-slate-500 mb-1">
              Sub-Headline Label (ID)
            </label>
            <input
              type="text"
              value={formData.sub_headline_id}
              onChange={(e) =>
                setFormData({ ...formData, sub_headline_id: e.target.value })
              }
              className="w-full bg-[#070b18] border border-slate-800 rounded-lg p-2.5 outline-none focus:border-emerald-500/30 text-slate-200"
              required
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: SUMMARIES */}
      <div className="border-t border-slate-800/60 pt-6 grid md:grid-cols-2 gap-6">
        <div className="space-y-4 md:border-r md:border-slate-800/60 md:pr-4">
          <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">
            // English Narrative Pack
          </span>
          <div>
            <label className="block text-slate-500 mb-1">
              Main Summary Paragraph (EN)
            </label>
            <textarea
              rows="3"
              value={formData.summary_en}
              onChange={(e) =>
                setFormData({ ...formData, summary_en: e.target.value })
              }
              className="w-full bg-[#070b18] border border-slate-800 rounded-lg p-2.5 outline-none focus:border-emerald-500/30 text-slate-200 resize-none"
              required
            ></textarea>
          </div>
          <div>
            <label className="block text-slate-500 mb-1">
              Sub Summary Paragraph (EN)
            </label>
            <textarea
              rows="2"
              value={formData.sub_summary_en}
              onChange={(e) =>
                setFormData({ ...formData, sub_summary_en: e.target.value })
              }
              className="w-full bg-[#070b18] border border-slate-800 rounded-lg p-2.5 outline-none focus:border-emerald-500/30 text-slate-200 resize-none"
              required
            ></textarea>
          </div>
        </div>
        <div className="space-y-4">
          <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">
            // Indonesian Narrative Pack
          </span>
          <div>
            <label className="block text-slate-500 mb-1">
              Main Summary Paragraph (ID)
            </label>
            <textarea
              rows="3"
              value={formData.summary_id}
              onChange={(e) =>
                setFormData({ ...formData, summary_id: e.target.value })
              }
              className="w-full bg-[#070b18] border border-slate-800 rounded-lg p-2.5 outline-none focus:border-emerald-500/30 text-slate-200 resize-none"
              required
            ></textarea>
          </div>
          <div>
            <label className="block text-slate-500 mb-1">
              Sub Summary Paragraph (ID)
            </label>
            <textarea
              rows="2"
              value={formData.sub_summary_id}
              onChange={(e) =>
                setFormData({ ...formData, sub_summary_id: e.target.value })
              }
              className="w-full bg-[#070b18] border border-slate-800 rounded-lg p-2.5 outline-none focus:border-emerald-500/30 text-slate-200 resize-none"
              required
            ></textarea>
          </div>
        </div>
      </div>

      {/* SECTION 3: FULL DYNAMIC COMPETENCY CARDS DECK */}
      <div className="border-t border-slate-800/60 pt-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-slate-400 font-bold tracking-widest">
            // SEKSI 2: DYNAMIC COMPETENCY CARDS DECK
          </h3>
          <button
            type="button"
            onClick={() =>
              setFormData({
                ...formData,
                competency_cards: [
                  ...formData.competency_cards,
                  { title_en: "", title_id: "", desc_en: "", desc_id: "" },
                ],
              })
            }
            className="bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded hover:bg-emerald-900 font-bold font-mono text-[10px] uppercase cursor-pointer"
          >
            + Add Competency Card
          </button>
        </div>

        <div className="space-y-4">
          {formData.competency_cards.map((card, idx) => (
            <div
              key={idx}
              className="p-4 bg-[#070b18] border border-slate-800 rounded-xl space-y-3 relative group"
            >
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    competency_cards: formData.competency_cards.filter(
                      (_, i) => i !== idx,
                    ),
                  })
                }
                className="absolute top-3 right-3 text-red-400 hover:text-red-500 font-bold cursor-pointer text-xs"
              >
                ✕ Remove Card
              </button>

              <div className="grid md:grid-cols-2 gap-4 pt-4">
                <div>
                  <label className="block text-slate-500 mb-1">
                    Card Title (EN)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Robust Monolithic Ecosystems"
                    value={card.title_en || ""}
                    onChange={(e) =>
                      updateCard(idx, "title_en", e.target.value)
                    }
                    className="w-full bg-[#050914] border border-slate-800 rounded p-2 text-slate-200 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">
                    Card Title (ID)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Ekosistem Monolitik Tangguh"
                    value={card.title_id || ""}
                    onChange={(e) =>
                      updateCard(idx, "title_id", e.target.value)
                    }
                    className="w-full bg-[#050914] border border-slate-800 rounded p-2 text-slate-200 outline-none"
                    required
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 mb-1">
                    Card Description (EN)
                  </label>
                  <textarea
                    placeholder="Description narrative in English..."
                    rows="2"
                    value={card.desc_en || ""}
                    onChange={(e) => updateCard(idx, "desc_en", e.target.value)}
                    className="w-full bg-[#050914] border border-slate-800 rounded p-2 text-slate-200 outline-none resize-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">
                    Card Description (ID)
                  </label>
                  <textarea
                    placeholder="Narasi deskripsi dalam Bahasa Indonesia..."
                    rows="2"
                    value={card.desc_id || ""}
                    onChange={(e) => updateCard(idx, "desc_id", e.target.value)}
                    className="w-full bg-[#050914] border border-slate-800 rounded p-2 text-slate-200 outline-none resize-none"
                    required
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: UNIFIED CONTACT INTEGRATION */}
      <div className="border-t border-slate-800/60 pt-6 space-y-4">
        <h3 className="text-slate-400 font-bold tracking-widest">
          // SEKSI 3: ONE-CLICK CONTACT ROUTING INFO
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-500 mb-1">
              Physical Address
            </label>
            <input
              type="text"
              value={formData.contact_location}
              onChange={(e) =>
                setFormData({ ...formData, contact_location: e.target.value })
              }
              className="w-full bg-[#070b18] border border-slate-800 rounded-lg p-2.5 text-slate-200 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-slate-500 mb-1">
              WhatsApp Line Connection
            </label>
            <input
              type="text"
              value={formData.contact_phone}
              onChange={(e) =>
                setFormData({ ...formData, contact_phone: e.target.value })
              }
              className="w-full bg-[#070b18] border border-slate-800 rounded-lg p-2.5 text-slate-200 outline-none"
              required
            />
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-slate-500 mb-1">Official Email</label>
            <input
              type="email"
              value={formData.contact_email}
              onChange={(e) =>
                setFormData({ ...formData, contact_email: e.target.value })
              }
              className="w-full bg-[#070b18] border border-slate-800 rounded-lg p-2.5 text-slate-200 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-slate-500 mb-1">
              LinkedIn Profile Link
            </label>
            <input
              type="text"
              value={formData.contact_linkedin}
              onChange={(e) =>
                setFormData({ ...formData, contact_linkedin: e.target.value })
              }
              className="w-full bg-[#070b18] border border-slate-800 rounded-lg p-2.5 text-slate-200 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-slate-500 mb-1">
              GitHub Endpoint URL
            </label>
            <input
              type="text"
              value={formData.contact_github}
              onChange={(e) =>
                setFormData({ ...formData, contact_github: e.target.value })
              }
              className="w-full bg-[#070b18] border border-slate-800 rounded-lg p-2.5 text-slate-200 outline-none"
              required
            />
          </div>
        </div>
      </div>

      {/* SECTION 6: METADATA & FOOTERS */}
      <div className="border-t border-slate-800/60 pt-6 grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-slate-500 mb-1">
            Current Location (EN)
          </label>
          <input
            type="text"
            value={formData.location_en}
            onChange={(e) =>
              setFormData({ ...formData, location_en: e.target.value })
            }
            className="w-full bg-[#070b18] border border-slate-800 rounded-lg p-2.5 text-slate-200 outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-slate-500 mb-1">
            Lokasi Saat Ini (ID)
          </label>
          <input
            type="text"
            value={formData.location_id}
            onChange={(e) =>
              setFormData({ ...formData, location_id: e.target.value })
            }
            className="w-full bg-[#070b18] border border-slate-800 rounded-lg p-2.5 text-slate-200 outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-slate-500 mb-1">
            Specialization (EN)
          </label>
          <input
            type="text"
            value={formData.spec_en}
            onChange={(e) =>
              setFormData({ ...formData, spec_en: e.target.value })
            }
            className="w-full bg-[#070b18] border border-slate-800 rounded-lg p-2.5 text-slate-200 outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-slate-500 mb-1">Spesialisasi (ID)</label>
          <input
            type="text"
            value={formData.spec_id}
            onChange={(e) =>
              setFormData({ ...formData, spec_id: e.target.value })
            }
            className="w-full bg-[#070b18] border border-slate-800 rounded-lg p-2.5 text-slate-200 outline-none"
            required
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 items-end">
        <div className="md:col-span-2">
          <label className="block text-slate-500 mb-1">
            Core Frameworks Footer Text
          </label>
          <input
            type="text"
            value={formData.frameworks_text}
            onChange={(e) =>
              setFormData({ ...formData, frameworks_text: e.target.value })
            }
            className="w-full bg-[#070b18] border border-slate-800 rounded-lg p-2.5 text-slate-200 outline-none"
            required
          />
        </div>
        <div className="flex items-center justify-between bg-[#070b18] border border-slate-800 p-2.5 rounded-lg select-none">
          <span className="text-slate-500 font-semibold">
            Availability Status
          </span>
          <button
            type="button"
            onClick={() =>
              setFormData({ ...formData, is_available: !formData.is_available })
            }
            className={`cursor-pointer px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${formData.is_available ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30" : "bg-red-950 text-red-400 border border-red-500/30"}`}
          >
            {formData.is_available ? "Available" : "Full Booked"}
          </button>
        </div>
      </div>

      <div className="space-y-1">
        <label className="block text-slate-500 mb-1">
          Verified Technology Inventory (Commas separated)
        </label>
        <textarea
          rows="3"
          value={formData.tech_inventory_string}
          onChange={(e) =>
            setFormData({ ...formData, tech_inventory_string: e.target.value })
          }
          className="w-full bg-[#070b18] border border-slate-800 rounded-lg p-2.5 text-slate-200 outline-none resize-none font-mono"
          required
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={loading || uploading}
        className="w-full cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-all uppercase tracking-wider shadow-md disabled:opacity-50"
      >
        {loading
          ? "Transmitting Master Config Packets..."
          : "Commit Full Configuration Map"}
      </button>
    </form>
  );
}
