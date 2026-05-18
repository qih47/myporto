import React, { useState, useEffect } from "react";
import { useLanguage } from "./LanguageContext";
import { supabase } from "../supabaseClient";
import emailjs from "@emailjs/browser";
import Swal from "sweetalert2"; // 🎯 INJEKSI: Import SweetAlert2 Engine

export default function Contact() {
  const { lang } = useLanguage();
  const [dbProfile, setDbProfile] = useState(null);

  const fetchContactEcosystemData = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select(
          "contact_location, contact_phone, contact_email, contact_linkedin, contact_github",
        )
        .eq("id", 1)
        .single();

      if (error) throw error;
      if (data) setDbProfile(data);
    } catch (err) {
      console.error("Error fetching operational contact node:", err.message);
    }
  };

  useEffect(() => {
    fetchContactEcosystemData();

    const channel = supabase
      .channel("profiles-contact-stream")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles" },
        () => {
          fetchContactEcosystemData();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // 🔄 RECONCILIATION ENGINE: Ganti data statis pake data dinamis dari Supabase
  const currentLoc =
    dbProfile?.contact_location || "Bandung, West Java, Indonesia";
  const currentPhone = dbProfile?.contact_phone || "+62 812-3456-7890";
  const currentEmail = dbProfile?.contact_email || "qisthih@gmail.com";
  const currentLinkedin =
    dbProfile?.contact_linkedin || "linkedin.com/in/qisthiiskandar";
  const currentGithub = dbProfile?.contact_github || "github.com/qisthi_id";

  // Bersihkan teks link untuk visual UI box
  const displayLinkedin = currentLinkedin.replace(
    /^(https?:\/\/)?(www\.)?/,
    "",
  );
  const displayGithub = currentGithub.replace(/^(https?:\/\/)?(www\.)?/, "");

  const contactContent = {
    EN: {
      partnership: "// Strategic Partnership",
      headline: "Let's discuss your next project",
      desc: "Whether you need a scalable system architecture designed, database query tuning, workflow automation, or robust full-stack development, feel free to reach out.",
      infoTitle: "Contact Information",
      locLabel: "Our Location",
      phoneLabel: "Phone / WhatsApp",
      mailLabel: "Official Email",
      netLabel: "Professional Network",
      repoLabel: "Source Code Repository",
      formTitle: "Get In Touch",
      formDesc:
        "Send a secure direct message to initiate a technical consultation session.",
      placeholders: {
        name: "Your Name",
        email: "Your Email",
        subject: "Subject",
        msg: "Message...",
      },
      btnAction: "Send Message Node",
      btnSending: "Transmitting Data...",
      swalSuccessTitle: "Transmission Success!",
      swalSuccessText:
        "Message node transmitted successfully to Qisthi Iskandar haqiki Mailbox",
      swalFailTitle: "Transmission Failure",
    },
    ID: {
      partnership: "// Kemitraan Strategis",
      headline: "Mari diskusikan transformasi arsitektur sistem Anda",
      desc: "Apakah perusahaan Anda sedang membutuhkan audit performa database, migrasi framework lama ke arsitektur modern, otomatisasi workflow bisnis, atau pembuatan aplikasi enterprise?",
      infoTitle: "Informasi Kontak",
      locLabel: "Lokasi Operasional",
      phoneLabel: "Telepon / WhatsApp",
      mailLabel: "Email Resmi",
      netLabel: "Jaringan Profesional",
      repoLabel: "Repositori Kode Sumber",
      formTitle: "Hubungi Langsung",
      formDesc:
        "Kirim pesan langsung secara aman untuk memulai sesi konsultasi teknis.",
      placeholders: {
        name: "Nama Anda",
        email: "Email Anda",
        subject: "Subjek",
        msg: "Pesan Anda...",
      },
      btnAction: "Kirim Node Pesan",
      btnSending: "Mentransmisikan Data...",
      swalSuccessTitle: "Transmisi Sukses!",
      swalSuccessText:
        "Node pesan berhasil ditransmisikan langsung ke qisthih@gmail.com",
      swalFailTitle: "Transmisi Gagal",
    },
  };

  const t = contactContent[lang];

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  // 🎛️ HANDLER SUBMIT EMAIL REALTIME WITH SWEETALERT2
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const templateParams = {
      name: formState.name,
      email: formState.email,
      subject: formState.subject,
      message: formState.message,
      to_email: "qisthih@gmail.com",
    };

    try {
      // Tembak sirkuit EmailJS API pake key asli lu
      await emailjs.send(
        "service_f28x3xs",
        "template_c54j1qg",
        templateParams,
        "Wu7XcvQg6GLfTp01e",
      );

      // 🎯 FIXED: Pake SweetAlert2 Premium Minimalist Style (Match Dark Theme)
      Swal.fire({
        title: t.swalSuccessTitle,
        text: t.swalSuccessText,
        icon: "success",
        background: "#0b1224",
        color: "#f1f5f9",
        confirmButtonColor: "#059669", // Emerald-600
        iconColor: "#10b981", // Emerald-500
        customClass: {
          popup: "border border-slate-800 rounded-2xl font-mono",
        },
      });

      // Reset form sirkuit setelah sukses dikirim
      setFormState({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Email Transmission Failure:", error);

      // 🎯 ERROR ALERT
      Swal.fire({
        title: t.swalFailTitle,
        text: error.text || "Check integration scopes or credentials.",
        icon: "error",
        background: "#0b1224",
        color: "#f1f5f9",
        confirmButtonColor: "#dc2626", // Red-600
        iconColor: "#ef4444", // Red-500
        customClass: {
          popup: "border border-slate-800 rounded-2xl font-mono",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="py-24 px-6 max-w-7xl mx-auto border-t border-slate-800/60 animate-fade-in-up"
    >
      {/* Section Header */}
      <div className="max-w-3xl mb-16 space-y-4">
        <p className="text-xs font-mono tracking-widest text-emerald-400 uppercase">
          {t.partnership}
        </p>
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-100 tracking-tight leading-tight">
          {t.headline}
        </h2>
        <p className="text-slate-400 text-sm leading-relaxed">{t.desc}</p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid lg:grid-cols-12 gap-8 items-stretch">
        {/* KOLOM KIRI: Contact Info Terminal Boxes */}
        <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-3">
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">
            // {t.infoTitle}
          </p>

          {/* Card 1: Lokasi */}
          <div className="flex items-center gap-4 p-4 bg-slate-800/10 border border-slate-800/80 rounded-xl flex-1 min-h-[72px]">
            <div className="w-9 h-9 bg-[#070b18] border border-slate-800 rounded-lg flex items-center justify-center text-sm">
              📍
            </div>
            <div className="space-y-0.5">
              <p className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">
                {t.locLabel}
              </p>
              <p className="text-xs font-medium text-slate-200">{currentLoc}</p>
            </div>
          </div>

          {/* Card 2: Telepon */}
          <a
            href={`https://wa.me/${currentPhone.replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 bg-slate-800/10 border border-slate-800/80 rounded-xl hover:border-emerald-500/30 hover:bg-slate-800/20 transition-all duration-300 group flex-1 min-h-[72px]"
          >
            <div className="w-9 h-9 bg-[#070b18] border border-slate-800 rounded-lg flex items-center justify-center text-sm text-emerald-400 group-hover:border-emerald-500/20 transition-colors">
              📞
            </div>
            <div className="space-y-0.5">
              <p className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">
                {t.phoneLabel}
              </p>
              <p className="text-xs font-semibold text-slate-200 group-hover:text-emerald-400 transition-colors">
                {currentPhone}
              </p>
            </div>
          </a>

          {/* Card 3: Email */}
          <a
            href={`mailto:${currentEmail}`}
            className="flex items-center gap-4 p-4 bg-slate-800/10 border border-slate-800/80 rounded-xl hover:border-emerald-500/30 hover:bg-slate-800/20 transition-all duration-300 group flex-1 min-h-[72px]"
          >
            <div className="w-9 h-9 bg-[#070b18] border border-slate-800 rounded-lg flex items-center justify-center text-sm text-emerald-400 group-hover:border-emerald-500/20 transition-colors">
              ✉️
            </div>
            <div className="space-y-0.5">
              <p className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">
                {t.mailLabel}
              </p>
              <p className="text-xs font-semibold text-slate-200 group-hover:text-emerald-400 transition-colors">
                {currentEmail}
              </p>
            </div>
          </a>

          {/* Card 4: LinkedIn */}
          <a
            href={
              currentLinkedin.startsWith("http")
                ? currentLinkedin
                : `https://${currentLinkedin}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 bg-slate-800/10 border border-slate-800/80 rounded-xl hover:border-emerald-500/30 hover:bg-slate-800/20 transition-all duration-300 group flex-1 min-h-[72px]"
          >
            <div className="w-9 h-9 bg-[#070b18] border border-slate-800 rounded-lg flex items-center justify-center text-sm text-emerald-400 group-hover:border-emerald-500/20 transition-colors">
              🔗
            </div>
            <div className="space-y-0.5">
              <p className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">
                {t.netLabel}
              </p>
              <p className="text-xs font-semibold text-slate-200 group-hover:text-emerald-400 transition-colors truncate max-w-[240px] sm:max-w-none">
                {displayLinkedin}
              </p>
            </div>
          </a>

          {/* Card 5: GitHub */}
          <a
            href={
              currentGithub.startsWith("http")
                ? currentGithub
                : `https://${currentGithub}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 bg-slate-800/10 border border-slate-800/80 rounded-xl hover:border-emerald-500/30 hover:bg-slate-800/20 transition-all duration-300 group flex-1 min-h-[72px]"
          >
            <div className="w-9 h-9 bg-[#070b18] border border-slate-800 rounded-lg flex items-center justify-center text-sm text-emerald-400 group-hover:border-emerald-500/20 transition-colors">
              📦
            </div>
            <div className="space-y-0.5">
              <p className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">
                {t.repoLabel}
              </p>
              <p className="text-xs font-semibold text-slate-200 group-hover:text-emerald-400 transition-colors truncate max-w-[240px] sm:max-w-none">
                {displayGithub}
              </p>
            </div>
          </a>
        </div>

        {/* KOLOM KANAN: Message Form */}
        <div className="lg:col-span-7 bg-[#0b1224] border border-slate-800 p-8 rounded-2xl shadow-xl flex flex-col justify-between">
          <div className="mb-4">
            <h4 className="text-lg font-bold text-slate-100 tracking-tight">
              {t.formTitle}
            </h4>
            <p className="text-xs text-slate-500 font-mono mt-1">
              // {t.formDesc}
            </p>
          </div>

          <form
            onSubmit={handleFormSubmit}
            className="space-y-4 font-mono text-xs flex-1 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  required
                  placeholder={t.placeholders.name}
                  value={formState.name}
                  onChange={(e) =>
                    setFormState({ ...formState, name: e.target.value })
                  }
                  className="w-full bg-[#070b18] border border-slate-800 rounded-xl p-3.5 outline-none focus:border-emerald-500/30 text-slate-200 transition-colors"
                />
                <input
                  type="email"
                  required
                  placeholder={t.placeholders.email}
                  value={formState.email}
                  onChange={(e) =>
                    setFormState({ ...formState, email: e.target.value })
                  }
                  className="w-full bg-[#070b18] border border-slate-800 rounded-xl p-3.5 outline-none focus:border-emerald-500/30 text-slate-200 transition-colors"
                />
              </div>

              <input
                type="text"
                required
                placeholder={t.placeholders.subject}
                value={formState.subject}
                onChange={(e) =>
                  setFormState({ ...formState, subject: e.target.value })
                }
                className="w-full bg-[#070b18] border border-slate-800 rounded-xl p-3.5 outline-none focus:border-emerald-500/30 text-slate-200 transition-colors"
              />

              <textarea
                rows="4"
                required
                placeholder={t.placeholders.msg}
                value={formState.message}
                onChange={(e) =>
                  setFormState({ ...formState, message: e.target.value })
                }
                className="w-full bg-[#070b18] border border-slate-800 rounded-xl p-3.5 outline-none focus:border-emerald-500/30 text-slate-200 transition-colors resize-none flex-1 min-h-[120px]"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl transition-all text-xs uppercase tracking-wider shadow-md active:scale-[0.99]"
            >
              {loading ? t.btnSending : t.btnAction}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
