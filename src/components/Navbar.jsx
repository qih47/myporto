import React, { useState, useEffect } from "react";
import { useLanguage } from "./LanguageContext";

const navItems = [
  { id: "home", label: { EN: "Home", ID: "Beranda" } },
  { id: "about", label: { EN: "About", ID: "Tentang" } },
  { id: "skills", label: { EN: "Skills", ID: "Keahlian" } },
  { id: "projects", label: { EN: "Projects", ID: "Proyek" } },
  { id: "resume", label: { EN: "Resume", ID: "Resume" } },
  { id: "contact", label: { EN: "Contact", ID: "Kontak" } },
];

export default function Navbar() {
  const { lang, toggleLanguage } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);

  // State untuk ngelacak section mana yang lagi aktif di layar
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    // 1. Deteksi scroll untuk efek glassmorphism navbar
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    // 2. IntersectionObserver untuk otomatis nyalain menu pas di-scroll
    const observerOptions = {
      root: null,
      rootMargin: "-30% 0px -60% 0px", // Memicu pergantian saat section di tengah layar
      threshold: 0,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    navItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 px-6 transition-all duration-300 border-b ${
        isScrolled
          ? "bg-[#0b1224]/80 backdrop-blur-xl py-3 border-emerald-500/10 shadow-lg shadow-black/20"
          : "bg-transparent py-5 border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* 🚀 BRAND LOGO FIXED MASTER: Bersih total dari hantu < /> & spasi, murni gradasi linear */}
        <div className="text-xl md:text-2xl font-sans font-black tracking-tight select-none cursor-pointer group">
          <span className="bg-gradient-to-r from-white via-slate-300 via-emerald-400 to-cyan-500 bg-clip-text text-transparent group-hover:brightness-110 transition-all duration-300">
            Portofolio.
          </span>
        </div>

        {/* Nav Links + Language Toggle Container */}
        <div className="flex items-center space-x-8 font-mono text-sm">
          {/* Menu Navigasi dengan Double Combo Animasi */}
          <div className="space-x-2 hidden md:flex font-medium">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`px-4 py-2 rounded-xl transition-all duration-300 relative text-xs uppercase tracking-wider block after:absolute after:bottom-[2px] after:left-4 after:h-[1px] after:bg-emerald-400 after:transition-all after:duration-300 ${
                    isActive
                      ? "text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 shadow-inner shadow-emerald-500/10 font-bold after:w-[calc(100%-32px)]"
                      : "text-slate-400 hover:text-slate-200 border border-transparent after:w-0 hover:after:w-[calc(100%-32px)]"
                  }`}
                >
                  {item.label[lang]}
                </a>
              );
            })}
          </div>

          {/* Batas Garis Vertikal Pemisah Menu biar Rapi */}
          <span className="h-4 w-[1px] bg-slate-800 hidden md:inline" />

          {/* Tombol Toggle Bahasa */}
          <button
            onClick={toggleLanguage}
            className="cursor-pointer bg-slate-800/40 border border-slate-800 text-xs font-mono text-slate-200 px-3.5 py-2 rounded-xl hover:bg-slate-800/90 hover:border-emerald-500/40 transition-all duration-300 shadow-xs flex items-center gap-2 group active:scale-95"
          >
            {lang === "EN" ? (
              <>
                <span className="text-base select-none transform group-hover:scale-110 transition-transform">
                  🇮🇩
                </span>
                <span className="font-semibold tracking-wide text-slate-300 group-hover:text-emerald-400 transition-colors">
                  ID
                </span>
              </>
            ) : (
              <>
                <span className="text-base select-none transform group-hover:scale-110 transition-transform">
                  🇬🇧
                </span>
                <span className="font-semibold tracking-wide text-slate-300 group-hover:text-emerald-400 transition-colors">
                  EN
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
