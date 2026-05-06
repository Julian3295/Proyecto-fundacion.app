⚽ SOS Habilidosos - Plataforma de Entretenimiento & Comunidad
Sistema integral de entretenimiento desarrollado con Next.js 14, diseñado para ofrecer una experiencia interactiva que combina videojuegos, música y personalización de perfiles mediante avatares Pokémon.

📋 Descripción
SOS Habilidosos es una aplicación web moderna y responsive que centraliza el acceso a una zona de juegos seleccionada, integración con Spotify para búsqueda de música y un sistema de identidad único basado en avatares dinámicos. El proyecto destaca por su interfaz oscura con efectos de cristal (glassmorphism) y animaciones fluidas.

🚀 Instalación y Ejecución:
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción 
npm run build

# Ejecutar en producción
npm start

La aplicación estará disponible en http://localhost:3000

🛠️ Stack Tecnológico
Framework: Next.js 14 (App Router)

Lenguaje: TypeScript

Estilos: Tailwind CSS (Clases canónicas y personalizadas)

Animaciones: Framer Motion / Anime.js (usado en el hook useAnimeIntro)

Iconos: Lucide React

Fuentes: Tipografías modernas optimizadas para gaming.

Autenticación: Sistema basado en Cookies/Middleware para protección de rutas.

    ✅ Funcionalidades Implementadas

1. Sistema de Autenticación & Acceso:

    ✅ Protección de Rutas: Middleware que valida la sesión del usuario.

    ✅ AuthModal: Interfaz elegante para ingreso sin recargas de página.

    ✅ Gestión de Sesión: Persistencia mediante cookies y cierre de sesión seguro.

2. Personalización (Sistema Pokémon):

    ✅ Avatar Dinámico: Los usuarios cuentan con un avatar animado (Charmander, Bulbasaur, etc.) extraído de APIs de sprites clásicos.

    ✅ Modal de Estadísticas: Al interactuar con el avatar, se despliega un modal con el "Poder", "Tipo" y "Nivel" del usuario.

    ✅ Estado Online: Indicador visual de conexión activa.

3. Zona de Juegos (Gaming Center):

    ✅ Catálogo Dinámico: Listado de juegos con miniaturas optimizadas.

    ✅ Efecto Hover 3D: Animaciones de zoom y brillo al pasar el cursor sobre las tarjetas de juego.

    ✅ Acceso Directo: Enlaces externos a plataformas de juegos integradas.

4. Ritmo Habilidosos (Spotify):

    ✅ Buscador de Tracks: Integración para buscar canciones y artistas.

    ✅ Interfaz Multimedia: Diseño adaptado para la gestión de contenido musical dentro de la plataforma.

🎨 Diseño y UX:

    -Tema Dark Premium: Paleta de colores basada en #030712 con acentos en verde esmeralda (emerald-500).

    -Glassmorphism: Barras de navegación y modales con desenfoque de fondo (backdrop-blur).

    -Navegación Inteligente: Menú adaptativo que se transforma de botones horizontales a menú hamburguesa en dispositivos móviles.

    -Identidad Visual: Uso del logo oficial "SOS Habilidosos" y versiones especiales para la fase Beta.

🔮 Mejoras Futuras:

    [ ] Integración real con la API de Spotify para reproducción directa.

    [ ] Sistema de niveles y experiencia (XP) real basado en tiempo de juego.

    [ ] Chat global para la comunidad de Habilidosos.

    [ ] Tabla de clasificación (Leaderboard) de juegos.

    [ ] Soporte para múltiples idiomas (i18n).

Desarrollado con ❤️ por el equipo de SOS Habilidosos.
Versión Beta 2.0 — 2026
