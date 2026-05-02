"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function SosHabilidoso() {
  const cardRef = useRef(null);

  useEffect(() => {
    // Animación suave de entrada con GSAP
    gsap.from(cardRef.current, {
      y: 50,
      opacity: 0,
      duration: 1.5,
      ease: "power4.out"
    });
  }, []);

  return (
    <div 
      ref={cardRef}
      className="max-w-4xl mx-auto my-12 p-1 bg-linear-to-r from-yellow-400 via-green-500 to-blue-500 rounded-3xl shadow-[0_0_30px_rgba(34,197,94,0.4)]"
    >
      <div className="bg-black rounded-[calc(1.5rem-1px)] p-8 text-center">
        <h2 className="text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-yellow-400 to-green-400 mb-4 uppercase tracking-tighter">
          ¡Apoya un sueño hoy!
        </h2>
        <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
          Sé parte del cambio. El programa <strong>S.O.S. Habilidoso</strong> permite que más jóvenes sigan transformando sus vidas a través del deporte.
        </p>
        <a 
          href="https://www.soshabilidoso.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block bg-green-500 hover:bg-green-400 text-black font-extrabold py-4 px-10 rounded-full text-xl transition-all hover:scale-110 active:scale-95 shadow-lg shadow-green-500/50"
        >
          QUIERO SER UN HABILIDOSO ⚽
        </a>
      </div>
    </div>
  );
}