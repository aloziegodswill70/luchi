export default function Footer() {
  return (
    <footer className="bg-green-800 text-white py-4 text-center border-t border-yellow-400">
      <p className="text-sm">
        &copy; {new Date().getFullYear()} <span className="text-yellow-400 font-semibold">Luchi25</span>. 
        <span className="text-red-400"> Built for Nigerian Hustlers 🇳🇬</span>
      </p>
    </footer>
  );
}
