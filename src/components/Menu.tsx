// src/app/components/Menu.tsx
'use client';
import { useState, useEffect } from 'react';
import { Menu as MenuIcon, X, Gamepad2, Music, Search, UserPlus } from 'lucide-react';
import Logo from './Logo';  // ← Importamos el componente Logo

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      const sections = ['inicio', 'registro', 'scouting', 'juegos', 'ritmo'];
      const scrollPos = window.scrollY + 100;
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPos >= offsetTop && scrollPos < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  const menuItems = [
    { id: 'inicio', name: 'Inicio', icon: null },
    { id: 'registro', name: 'Registro', icon: UserPlus },
    { id: 'scouting', name: 'Scouting', icon: Search },
    { id: 'juegos', name: 'Juegos', icon: Gamepad2 },
    { id: 'ritmo', name: 'Ritmo', icon: Music },
  ];

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-black/90 backdrop-blur-xl border-b border-green-500/20 shadow-2xl' 
          : 'bg-linear-to-b from-black/80 to-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            
            {/* LOGO - AHORA USAMOS EL COMPONENTE */}
            <Logo 
              variant="full"     // Ícono + texto
              size="md"          // Tamaño mediano
              onClick={() => scrollToSection('inicio')}  // Al hacer click va al inicio
              showSubtitle={true}  // Muestra "Tecnología deportiva"
            />

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-4 lg:px-5 py-2 rounded-xl text-sm lg:text-base font-medium transition-all duration-300 relative group ${
                    activeSection === item.id
                      ? 'text-green-400'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {activeSection === item.id && (
                    <span className="absolute inset-0 bg-green-500/10 rounded-xl animate-pulse"></span>
                  )}
                  <span className="relative z-10">{item.name}</span>
                  {activeSection === item.id && (
                    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-green-400 rounded-full"></span>
                  )}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-xl bg-green-500/10 hover:bg-green-500/20 transition-all"
            >
              {isOpen ? <X size={22} className="text-green-400" /> : <MenuIcon size={22} className="text-green-400" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        <div className={`md:hidden transition-all duration-400 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="bg-black/95 backdrop-blur-xl border-t border-green-500/20 py-4">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`w-full text-left px-6 py-3 transition-all duration-200 flex items-center gap-3 ${
                  activeSection === item.id
                    ? 'bg-green-500/10 text-green-400 border-l-4 border-green-400'
                    : 'text-gray-400 hover:bg-white/5'
                }`}
              >
                {item.icon && <item.icon size={18} />}
                <span className="font-medium">{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Espaciador para compensar el menú fijo */}
      <div className="h-16 sm:h-20"></div>
    </>
  );
}