# 🌌 Automated Enterprise Environment & Competency Matrix Node

Aplikasi single-page (SPA) portofolio profesional dengan arsitektur modern yang reaktif dan ber-availability tinggi. Berfungsi untuk menyajikan matriks kompetensi dinamis, riwayat pengalaman sistem kontrol terdistribusi, dan automasi cerdas. Sistem ini terintegrasi penuh dengan interceptor data realtime dari database Postgres.

---

## ⚡ Fitur Utama Arsitektur

- **Real-time Synchronization Engine:** Menggunakan interceptor stream realtime dari tabel database PostgreSQL via Supabase Channel, memastikan pembaruan state UI instan pada field JSONB (`matrix_cards`, `proficiency_bars`) tanpa reload halaman.
- **Dual-Language Core Ecosystem:** Abstraksi Context API untuk penanganan mutasi bahasa secara dinamis antara Inggris (EN) dan Indonesia (ID).
- **Intelligent Communication Pipeline:** Integrasi SDK `@emailjs/browser` dengan wrapper notifikasi premium dari `SweetAlert2` untuk mentransmisikan pesan telemetry dari tamu langsung ke inbox email utama (`qisthih@gmail.com`).
- **Clean Artifact Segregation:** Konfigurasi `.gitignore` yang ketat untuk mengisolasi file konfigurasi sensitif (`.env`) dan modul build lokal agar tidak bocor ke publik.

---

## 🛠️ Gudang Senjata Teknologi (Stack Inventory)

### Sisi Frontend & Optimasi

- **Core Runtime:** React (Hooks, Context API, Context Lifecycle)
- **Build Delivery System:** Vite Compiler Environment
- **Design Engine:** Tailwind CSS Utility-First Framework
- **State Optimization:** `React.useMemo` untuk isolasi referensi memori objek JSON kompleks.

### Sisi Backend & Integrasi

- **Database & BaaS Layer:** Supabase / PostgreSQL Engine
- **Websocket Streams:** Supabase Realtime Channels (`postgres_changes`)
- **SMTP Gateway:** EmailJS API Broker
- **Feedback Engine:** SweetAlert2 Elegant Dark Modals

---

## 📂 Struktur Direktori Repositori

Sesuai dengan blueprint arsitektur folder pada workspace lokal:

```text
├── .vite/                  # Cache metadata compiler lokal (di-ignore)
├── node_modules/           # Dependencies library sistem (di-ignore)
├── public/                 # Aset statis publik
├── src/
│   ├── assets/             # Media & foto profil arsitek
│   ├── components/         # Komponen modular atomik
│   │   ├── admin/          # Form Dashboard Panel Kendali Kontrol
│   │   │   ├── TabHero.jsx
│   │   │   ├── TabProfile.jsx
│   │   │   ├── TabProjects.jsx
│   │   │   ├── TabResume.jsx
│   │   │   └── TabSkills.jsx
│   │   ├── AboutMe.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminLogin.jsx
│   │   ├── Contact.jsx     # Form pengiriman email via EmailJS
│   │   ├── Footer.jsx
│   │   ├── Hero.jsx
│   │   ├── LanguageContext.jsx
│   │   ├── Navbar.jsx
│   │   ├── Projects.jsx
│   │   ├── Resume.jsx
│   │   └── Skills.jsx      # Grafik persentase bar kemahiran realtime
│   ├── App.jsx             # Inti routing komponen utama
│   ├── index.css           # Injeksi utility Tailwind CSS
│   ├── Main.jsx            # Hook mount DOM React ke index.html
│   └── supabaseClient.js   # Inisialisasi singleton client Supabase
├── .gitignore              # Pola eksklusi berkas sampah & env rahasia
├── index.html              # Entry point HTML5 utama
├── package.json            # Manifest dependencies & script operasional
├── README.md               # Panduan dokumentasi sistem ini
└── vite.config.js          # Parameter konfigurasi compiler Vite
```
