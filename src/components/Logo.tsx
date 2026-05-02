// src/app/components/Logo.tsx
'use client';

interface LogoProps {
  variant?: 'full' | 'icon' | 'text';  // Tipo de logo
  size?: 'sm' | 'md' | 'lg';           // Tamaño
  className?: string;                   // Clases adicionales
  onClick?: () => void;                 // Acción al hacer click
  showSubtitle?: boolean;               // Mostrar subtítulo
}

export default function Logo({ 
  variant = 'full', 
  size = 'md', 
  className = '', 
  onClick,
  showSubtitle = true 
}: LogoProps) {
  
  // Tamaños predefinidos
  const sizes = {
    sm: { 
      iconSize: 'w-6 h-6 sm:w-7 sm:h-7', 
      textSize: 'text-sm sm:text-base',
      iconEmoji: 'text-sm sm:text-base',
      subtitle: 'hidden'
    },
    md: { 
      iconSize: 'w-8 h-8 sm:w-10 sm:h-10', 
      textSize: 'text-base sm:text-xl',
      iconEmoji: 'text-base sm:text-xl',
      subtitle: 'hidden sm:block'
    },
    lg: { 
      iconSize: 'w-10 h-10 sm:w-12 sm:h-12', 
      textSize: 'text-xl sm:text-2xl',
      iconEmoji: 'text-xl sm:text-2xl',
      subtitle: 'block'
    }
  };
  
  const currentSize = sizes[size];
  
  // Variante solo ícono
  if (variant === 'icon') {
    return (
      <div 
        onClick={onClick}
        className={`${currentSize.iconSize} bg-linear-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 cursor-pointer hover:scale-105 transition-transform ${className}`}
      >
        <span className={currentSize.iconEmoji}>⚽</span>
      </div>
    );
  }
  
  // Variante solo texto
  if (variant === 'text') {
    return (
      <div onClick={onClick} className={`cursor-pointer hover:opacity-80 transition-opacity ${className}`}>
        <span className={`font-black tracking-tighter text-green-400 ${currentSize.textSize}`}>
          HABILIDOSOS
        </span>
        <span className="text-xs text-gray-500 ml-1">F.C.</span>
        {showSubtitle && (
          <p className={`${currentSize.subtitle} text-[10px] text-gray-500 -mt-1`}>
            Tecnología deportiva
          </p>
        )}
      </div>
    );
  }
  
  // Variante completa (ícono + texto)
  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-2 sm:gap-3 cursor-pointer hover:scale-105 transition-transform ${className}`}
    >
      {/* Ícono */}
      <div className={`${currentSize.iconSize} bg-linear-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30`}>
        <span className={currentSize.iconEmoji}>⚽</span>
      </div>
      
      {/* Texto */}
      <div className="text-left">
        <div>
          <span className={`font-black tracking-tighter text-green-400 ${currentSize.textSize}`}>
            HABILIDOSOS
          </span>
          <span className="hidden sm:inline text-xs text-gray-400 ml-1">F.C.</span>
        </div>
        {showSubtitle && (
          <p className={`${currentSize.subtitle} text-[8px] sm:text-[10px] text-gray-500 -mt-1`}>
            Tecnología deportiva
          </p>
        )}
      </div>
    </div>
  );
}