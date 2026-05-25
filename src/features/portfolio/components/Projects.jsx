import React, { useEffect, useState } from "react";
import { useLanguage } from "../../../core/context/LanguageContext";
import { projectService } from "../../../services/projectService";

export default function Projects() {
  const { lang } = useLanguage();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // State untuk melacak halaman slider aktif
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 4; // Batasan maksimal 4 proyek per tampilan halaman

  const fetchProjects = async () => {
    try {
      const data = await projectService.getProjects();
      setProjects(data || []);
    } catch (error) {
      console.error("Error fetching projects:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();

    const projectsChannel = projectService.subscribeToChanges(
      "live-projects-stream",
      (payload) => {
        console.log("Realtime update captured!", payload);
        fetchProjects(); // Tarik ulang dari db agar urutan sorting tetap konsisten
      }
    );

    return () => {
      projectService.unsubscribe(projectsChannel);
    };
  }, []);

  // Logika pembagian halaman slider (Chunking array)
  const totalPages = Math.ceil(projects.length / itemsPerPage);

  const handleNext = () => {
    if (currentIndex < totalPages - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Ambil potongan 4 item proyek yang aktif berdasarkan halaman index saat ini
  const visibleProjects = projects.slice(
    currentIndex * itemsPerPage,
    currentIndex * itemsPerPage + itemsPerPage
  );

  return (
    <section
      id="projects"
      className="py-24 px-6 max-w-7xl mx-auto border-t border-slate-800/60 overflow-hidden"
    >
      {/* Header Section + Navigasi Slider */}
      <div className="flex justify-between items-end mb-16">
        <div className="space-y-3">
          <p className="text-xs font-mono tracking-widest text-emerald-400 uppercase">
            <span className="mr-2">03.</span> Showcase
          </p>
          <h3 className="text-3xl md:text-4xl font-bold text-slate-100 tracking-tight">
            {lang === "EN" ? "Featured Projects" : "Proyek Pilihan"}
          </h3>
        </div>

        {/* Tombol Panah Navigasi Slider */}
        {totalPages > 1 && (
          <div className="flex gap-2 font-mono text-xs">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`cursor-pointer w-10 h-10 rounded-xl border border-slate-800 flex items-center justify-center transition-all ${
                currentIndex === 0
                  ? "text-slate-600 border-slate-900 bg-slate-900/20 cursor-not-allowed"
                  : "text-slate-300 bg-slate-800/30 hover:border-emerald-500/40 hover:text-emerald-400"
              }`}
            >
              ←
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex === totalPages - 1}
              className={`cursor-pointer w-10 h-10 rounded-xl border border-slate-800 flex items-center justify-center transition-all ${
                currentIndex === totalPages - 1
                  ? "text-slate-600 border-slate-900 bg-slate-900/20 cursor-not-allowed"
                  : "text-slate-300 bg-slate-800/30 hover:border-emerald-500/40 hover:text-emerald-400"
              }`}
            >
              →
            </button>
          </div>
        )}
      </div>

      {/* COUNTER STATS CARD TIMBUL */}
      {!loading && (
        <div className="flex justify-center mb-16">
          <div className="relative bg-[#0b1224]/40 border border-slate-800 p-8 rounded-2xl w-full max-w-xs text-center shadow-lg hover:border-emerald-500/20 transition-all duration-300 group">
            {/* Lingkaran Badge Ikon Timbul */}
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-[#0b1224] border border-slate-800 rounded-full flex items-center justify-center shadow-md group-hover:border-emerald-400/40 transition-colors duration-300">
              <span className="text-emerald-400 text-lg select-none">📋</span>
            </div>

            {/* Total Angka Dinamis */}
            <div className="text-5xl font-black font-mono tracking-tight text-slate-100 mt-2 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
              {projects.length}
            </div>

            {/* Label Bilingual */}
            <div className="text-slate-400 font-medium text-sm mt-2 tracking-wide">
              {lang === "EN"
                ? "Total Managed Projects"
                : "Total Proyek Dikelola"}
            </div>

            <div className="text-[10px] font-mono text-slate-600 mt-1 uppercase tracking-widest">
              // database_record_count
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="text-center font-mono text-sm text-slate-500 animate-pulse">
          {lang === "EN"
            ? "Loading database elements..."
            : "Memuat elemen database..."}
        </div>
      ) : (
        <div className="space-y-8">
          {/* Grid Proyek Container */}
          <div className="grid md:grid-cols-2 gap-8 transition-all duration-500 ease-in-out transform">
            {visibleProjects.map((project) => (
              <div
                key={project.id}
                className="bg-slate-800/20 p-8 rounded-2xl border border-slate-800/80 flex flex-col justify-between hover:-translate-y-1.5 hover:border-slate-700/60 hover:bg-slate-800/30 transition-all duration-300 group shadow-xs hover:shadow-xl animate-fade-in-up"
              >
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-2xl text-slate-400 transform group-hover:scale-110 transition-transform duration-300 inline-block">
                      📁
                    </span>
                    <span className="text-[10px] font-mono font-semibold tracking-wider text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-md uppercase border border-emerald-500/10">
                      {lang === "EN" ? project.badge_en : project.badge_id}
                    </span>
                  </div>

                  <h4 className="text-2xl font-bold text-slate-100 mb-3 tracking-tight hover:text-emerald-400 transition-colors">
                    {lang === "EN" ? project.title_en : project.title_id}
                  </h4>

                  <p className="text-slate-400 text-sm mb-8 leading-relaxed font-light line-clamp-3">
                    {lang === "EN" ? project.desc_en : project.desc_id}
                  </p>
                </div>

                <div>
                  {/* Tautan Preview & GitHub */}
                  <div className="flex gap-4 mb-4 font-mono text-xs">
                    {project.preview_url && (
                      <a
                        href={project.preview_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-400 hover:underline"
                      >
                        🔗 Live Demo
                      </a>
                    )}
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-white hover:underline"
                      >
                        📦 Source Code
                      </a>
                    )}
                  </div>

                  <ul className="flex flex-wrap gap-2 font-mono text-xs text-slate-400 pt-4 border-t border-slate-800/60">
                    {project.tech.map((techName, idx) => (
                      <li
                        key={idx}
                        className="bg-[#070b18] border border-slate-800/80 px-2.5 py-1 rounded-md text-slate-300"
                      >
                        {techName}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Indikator Halaman (Dots Navigator) */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-4">
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentIndex === idx
                      ? "w-8 bg-emerald-500"
                      : "w-2 bg-slate-800"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
