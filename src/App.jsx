import React, { useState, useEffect } from "react";
import { LanguageProvider } from "./core/context/LanguageContext";
import { authService } from "./services/authService";

// Layout components
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

// Features components
import { Hero, AboutMe, Skills, Projects, Resume, Contact } from "./features/portfolio";
import { AdminLogin, AdminDashboard } from "./features/admin";

function App() {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Cek token session login yang aktif dari Supabase
    authService.getSession().then((session) => {
      setSession(session);
    });

    const subscription = authService.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Deteksi jika user ketik url localhost:5173/#admin-portal
    const handleHashChange = () => {
      setIsAdminMode(window.location.hash === "#admin-portal");
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange(); // Cek saat inisialisasi awal load

    return () => {
      if (subscription && typeof subscription.unsubscribe === "function") {
        subscription.unsubscribe();
      }
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const handleLogout = async () => {
    await authService.signOut();
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
              authService.getSession().then((session) => setSession(session))
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
