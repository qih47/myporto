// Footer.jsx
export default function Footer() {
  return (
    <footer className="py-8 text-center text-slate-500 text-xs font-mono border-t border-slate-800 mt-20">
      <p>Built with React & Tailwind CSS</p>
      <p className="mt-1">© {new Date().getFullYear()} All Rights Reserved.</p>
    </footer>
  );
}
