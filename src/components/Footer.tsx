'use client'
import anime from 'animejs'
import { FaFacebook, FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';

export default function Footer() {

  const logoPop = (el: any) => {
    anime({
      targets: el,
      scale: 1.3, // Un poco más grande para que se note el efecto
      duration: 300,
      easing: 'easeOutBack'
    })
  }

  const logoReset = (el: any) => {
    anime({
      targets: el,
      scale: 1,
      duration: 300,
      easing: 'easeOutQuad'
    })
  }
  
  return (
    <footer className="w-full py-8 border-t border-green-500/20 bg-black/50 backdrop-blur-md mt-20">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <h3 className="text-green-400 font-bold text-lg">Fundación Habilidosos</h3>
          <p className="text-gray-400 text-sm italic">"Un golazo a tus sueños"</p>
        </div>
        
        {/* ICONOS CON ANIMACIÓN HOVER */}
        <div className="flex gap-6 text-2xl">
          <a 
            href="https://facebook.com/fundahabilidosos" 
            target="_blank" 
            onMouseEnter={(e) => logoPop(e.currentTarget)}
            onMouseLeave={(e) => logoReset(e.currentTarget)}
            className="hover:text-blue-500 transition-colors"
          >
            <FaFacebook />
          </a>
          <a 
            href="https://instagram.com/Fundahabilidosos" 
            target="_blank"
            onMouseEnter={(e) => logoPop(e.currentTarget)}
            onMouseLeave={(e) => logoReset(e.currentTarget)}
            className="hover:text-pink-500 transition-colors"
          >
            <FaInstagram />
          </a>
          <a 
            href="https://www.tiktok.com/@Fundahabilidosos" 
            target="_blank"
            onMouseEnter={(e) => logoPop(e.currentTarget)}
            onMouseLeave={(e) => logoReset(e.currentTarget)}
            className="hover:text-white transition-colors"
          >
            <FaTiktok />
          </a>
          <a 
            href="https://www.youtube.com/@Fundahabilidosos" 
            target="_blank"
            onMouseEnter={(e) => logoPop(e.currentTarget)}
            onMouseLeave={(e) => logoReset(e.currentTarget)}
            className="hover:text-red-600 transition-colors"
          >
            <FaYoutube />
          </a>
        </div>
      </div>
      <div className="text-center mt-6 text-gray-600 text-xs">
        © 2026 Desarrollado por Julian Rivera Valencia - Medellín, Colombia
      </div>
    </footer>
  );
}