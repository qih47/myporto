import React, { useState } from "react";
import TabProjects from "../components/TabProjects";
import TabProfile from "../components/TabProfile";
import TabSkills from "../components/TabSkills";
import TabResume from "../components/TabResume";
import TabHero from "../components/TabHero";

export default function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState("projects");
  const [msg, setMsg] = useState("");

  return (
    <div className="min-h-screen bg-[#050914] text-slate-200 font-mono p-8 animate-fade-in-up">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Dashboard Control */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-xl font-bold text-slate-100">
              Project Core Terminal Control
            </h1>
            <p className="text-xs text-emerald-400">
              // CONTROL_PANEL_NODE_V7_MODULAR_HERO
            </p>
          </div>

          {/* TAB NAVIGATION CONTROLLER */}
          <div className="flex flex-wrap bg-[#0b1224] border border-slate-800 p-1 rounded-xl text-xs gap-1 sm:gap-0">
            <button
              onClick={() => {
                setActiveTab("projects");
                setMsg("");
              }}
              className={`cursor-pointer px-4 py-2 rounded-lg font-bold transition-all ${activeTab === "projects" ? "bg-emerald-600 text-white shadow-md" : "text-slate-400 hover:text-slate-200"}`}
            >
              Manage Projects
            </button>
            <button
              onClick={() => {
                setActiveTab("hero");
                setMsg("");
              }}
              className={`cursor-pointer px-4 py-2 rounded-lg font-bold transition-all ${activeTab === "hero" ? "bg-emerald-600 text-white shadow-md" : "text-slate-400 hover:text-slate-200"}`}
            >
              Manage Hero
            </button>
            <button
              onClick={() => {
                setActiveTab("profile");
                setMsg("");
              }}
              className={`cursor-pointer px-4 py-2 rounded-lg font-bold transition-all ${activeTab === "profile" ? "bg-emerald-600 text-white shadow-md" : "text-slate-400 hover:text-slate-200"}`}
            >
              Profile & Metadata
            </button>
            <button
              onClick={() => {
                setActiveTab("skills_resume");
                setMsg("");
              }}
              className={`cursor-pointer px-4 py-2 rounded-lg font-bold transition-all ${activeTab === "skills_resume" ? "bg-emerald-600 text-white shadow-md" : "text-slate-400 hover:text-slate-200"}`}
            >
              Skills & Resume Matrix
            </button>
          </div>

          <button
            onClick={onLogout}
            className="cursor-pointer bg-red-950/40 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg text-xs hover:bg-red-500/20 transition-all ml-auto lg:ml-0"
          >
            Terminate Session (Logout)
          </button>
        </div>

        {msg && (
          <div className="p-4 bg-slate-800/40 border border-slate-700 rounded-xl text-xs text-center font-semibold text-emerald-400 tracking-wide">
            {msg}
          </div>
        )}

        {/* MODULAR RENDER ROUTING TERMINAL */}
        {activeTab === "projects" && <TabProjects setGlobalMsg={setMsg} />}

        {/* Hero Configuration */}
        {activeTab === "hero" && <TabHero setGlobalMsg={setMsg} />}

        {activeTab === "profile" && <TabProfile setGlobalMsg={setMsg} />}

        {activeTab === "skills_resume" && (
          <div className="space-y-8">
            <TabSkills setGlobalMsg={setMsg} />
            <TabResume setGlobalMsg={setMsg} />
          </div>
        )}
      </div>
    </div>
  );
}
