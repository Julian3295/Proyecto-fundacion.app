// src/app/hooks/useAnime.ts
'use client';
import { useEffect, useRef } from 'react';
import anime from 'animejs';

export function useAnimeIntro() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Animación de entrada para elementos
    (anime as any)({
      targets: '.anime-item',
      translateY: [30, 0],
      opacity: [0, 1],
      duration: 600,
      delay: (anime as any).stagger(80),
      easing: 'easeOutQuad',
    });

    // Animación del logo - Efecto de rebote y rotación
    (anime as any)({
      targets: '.anime-logo',
      scale: [0.5, 1.2, 1],
      rotate: ['-5deg', '5deg', '0deg'],
      duration: 1200,
      easing: 'spring(1, 80, 10, 0)',
    });

    // Animación de brillo continuo para el logo
    (anime as any)({
      targets: '.anime-logo-glow',
      opacity: [0.3, 1, 0.3],
      duration: 2000,
      loop: true,
      easing: 'easeInOutQuad',
      direction: 'alternate',
    });

  }, []);

  return containerRef;
}

export function useAnimeScroll() {
  useEffect(() => {
    const elements = document.querySelectorAll('.anime-scroll');
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            (anime as any)({
              targets: el,
              translateY: [30, 0],
              opacity: [0, 1],
              duration: 700,
              easing: 'easeOutQuad',
              delay: 100,
            });
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.15 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}