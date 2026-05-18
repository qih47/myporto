import React, { useState, useEffect } from "react";
import { LanguageProvider } from "./components/LanguageContext";
import { supabase } from "./supabaseClient";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import AboutMe from "./components/AboutMe";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import Resume from "./components/Resume";

function App() {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Cek token session login yang aktif dari Supabase Storage local
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Deteksi jika user ketik url localhost:5173/#admin-portal
    const handleHashChange = () => {
      setIsAdminMode(window.location.hash === "#admin-portal");
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange(); // Cek saat inisialisasi awal load

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    window.location.hash = ""; // Lempar balik ke home
  };

  // 1. JIKA JALUR ROUTE ADALAH ADMIN PORTAL
  if (isAdminMode) {
    return (
      <LanguageProvider>
        {session ? (
          <AdminDashboard onLogout={handleLogout} />
        ) : (
          <AdminLogin
            onLoginSuccess={() =>
              supabase.auth
                .getSession()
                .then(({ data: { session } }) => setSession(session))
            }
          />
        )}
      </LanguageProvider>
    );
  }

  // 2. JIKA PATH NORMAL (WEB PORTOFOLIO UTAMA)
  return (
    <LanguageProvider>
      <div className="bg-[#0b1224] text-slate-100 min-h-screen font-sans antialiased scroll-smooth">
        <Navbar />
        <main>
          <Hero />
          <AboutMe />
          <Skills />
          <Projects />
          <Resume />
          <Contact />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}

export default App;
