'use client'
import { useEffect, useRef } from 'react'
import anime from 'animejs' // Importación estándar compatible con V3

interface AvatarProps {
  pokemonNombre: string;
  pokemonImagen?: string; 
}

export default function AvatarAnimado({ pokemonNombre, pokemonImagen }: AvatarProps) {
  const imgRef = useRef(null)

  useEffect(() => {
    // Verificamos que el elemento exista antes de animar
    if (imgRef.current) {
      anime({
        targets: imgRef.current,
        translateY: [-15, 15], // Efecto de flotar
        rotate: '5deg',        // Pequeña inclinación
        duration: 2500,
        direction: 'alternate',
        loop: true,
        easing: 'easeInOutSine'
      })
    }
  }, [pokemonNombre]) // Se reinicia si cambias de usuario

  // Lógica de imagen: usa la de la DB o construye la de pokemondb
  const spriteUrl = pokemonImagen 
    ? pokemonImagen 
    : pokemonNombre === 'pendiente' 
      ? 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'
      : `https://img.pokemondb.net/sprites/black-white/anim/normal/${pokemonNombre.toLowerCase()}.gif`

  return (
    <div className="flex flex-col items-center">
      {/* Contenedor con el estilo visual de Habilidosos */}
      <div className="bg-linear-to-b from-green-500/20 to-transparent p-8 rounded-full border border-green-500/20 shadow-[0_0_60px_-15px_rgba(34,197,94,0.4)]">
        <img 
          ref={imgRef}
          src={spriteUrl} 
          alt={pokemonNombre}
          className="w-32 h-32 object-contain"
        />
      </div>
      
      <h3 className="mt-6 text-green-400 font-mono text-xl uppercase tracking-widest drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]">
        {pokemonNombre}
      </h3>

      <div className="mt-2 bg-yellow-500 text-black text-[10px] px-3 py-0.5 rounded font-bold uppercase">
        Beta Habilidosos
      </div>
    </div>
  )
}