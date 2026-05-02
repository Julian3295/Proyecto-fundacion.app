export default function Header() {
  return (
    <header className="w-full py-5 px-6 border-b border-gray-800 bg-black/50 backdrop-blur-sm fixed top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
            {/* Logo (Usando tu texto pero con estilo) */}
            <h1 className="text-2xl font-black tracking-tighter text-neon-green italic">
                HABILIDOSOS F.C.
            </h1>

            {/* Navegación (Inspirada en la imagen 8) */}
                <nav className="hidden md:flex gap-8 text-sm text-gray-300 font-medium">
                <a href="#" className="hover:text-white transition">Inicio</a>
                <a href="#" className="hover:text-white transition">Miembros</a>
                <a href="#" className="hover:text-white transition">Scouting</a>
                <a href="#" className="hover:text-white transition">Contacto</a>
            </nav>

            {/* Botón Login (Estilo Neón Cian de Camilo) */}
            <button className="border-2 border-cyan-400 text-cyan-400 font-bold py-2 px-6 rounded-full hover:bg-cyan-400 hover:text-black hover:shadow-[0_0_20px_rgba(34,211,238,0.7)] transition-all duration-300 text-sm">
                Login
            </button>
        </div>
    </header>
  );
}