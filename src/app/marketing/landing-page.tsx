"use client";

import { useState, useRef } from 'react';
import Image from 'next/image';
import AuthModal from '@/components/AuthModal';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Gamepad2, Music, Trophy } from 'lucide-react';

export default function LandingPage() {
  const [showAuth, setShowAuth] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useGSAP(() => {
    gsap.from(buttonRef.current, {
      y: 40,
      opacity: 0,
      scale: 0.5,
      duration: 1.2,
      ease: "elastic.out(1, 0.4)",
      delay: 0.6,
    });
  }, []);

  return (
    <>
      <div className="min-h-screen bg-[#030712] text-white flex flex-col items-center justify-center p-4">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="relative w-52 h-52 mx-auto">
            <Image
              src="/images/habiupscalemediapreview.png"
              alt="Habi Logo"
              fill
              sizes="208px"
              className="object-contain drop-shadow-[0_0_30px_rgba(16,185,129,0.3)]"
              preload
              unoptimized
            />
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter">
              <span className="text-emerald-400">Habilidosos</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              La plataforma definitiva para jugadores habilidosos.
              Descubre juegos, conecta con otros jugadores y demuestra tu poder.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-emerald-500/30 transition-all">
              <Gamepad2 className="w-8 h-8 text-emerald-400" />
              <h3 className="text-lg font-bold mt-2">Zona de Juegos</h3>
              <p className="text-gray-500 text-sm mt-1">Accede a los mejores juegos</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-emerald-500/30 transition-all">
              <Music className="w-8 h-8 text-emerald-400" />
              <h3 className="text-lg font-bold mt-2">Ritmo</h3>
              <p className="text-gray-500 text-sm mt-1">Música para tu experiencia</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-emerald-500/30 transition-all">
              <Trophy className="w-8 h-8 text-emerald-400" />
              <h3 className="text-lg font-bold mt-2">Estadísticas</h3>
              <p className="text-gray-500 text-sm mt-1">Sigue tu progreso y poder</p>
            </div>
          </div>

          <button
            ref={buttonRef}
            onClick={() => setShowAuth(true)}
            className="inline-flex items-center gap-3 px-10 py-5 bg-emerald-500 text-black font-black text-lg rounded-2xl active:scale-95 shadow-lg shadow-emerald-500/25"
            onMouseEnter={() => {
              gsap.to(buttonRef.current, {
                scale: 1.08,
                backgroundColor: "#34d399",
                boxShadow: "0 0 35px rgba(16, 185, 129, 0.6)",
                duration: 0.3,
                ease: "power2.out",
              });
            }}
            onMouseLeave={() => {
              gsap.to(buttonRef.current, {
                scale: 1,
                backgroundColor: "#10b981",
                boxShadow: "0 10px 25px rgba(16, 185, 129, 0.25)",
                duration: 0.4,
                ease: "power2.out",
              });
            }}
          >
            COMENZAR
          </button>

          <p className="text-gray-600 text-sm">Regístrate o inicia sesión para acceder</p>
        </div>
      </div>

      {showAuth && (
        <AuthModal onLogin={() => window.location.reload()} onClose={() => setShowAuth(false)} />
      )}
    </>
  );
}
