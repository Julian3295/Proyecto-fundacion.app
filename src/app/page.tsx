import { cookies } from 'next/headers';
import LandingPage from './marketing/landing-page';
import AppPage from './app-content/app-page';

export default async function Home() {
  let userId;
  
  try {
    const cookieStore = await cookies();
    userId = cookieStore.get('userId');
  } catch (error) {
    // Si hay un error al leer las cookies durante el build, 
    // asumimos que no hay usuario y mostramos la landing.
    console.error("Error al leer cookies:", error);
  }

  if (!userId) {
    return <LandingPage />;
  }

  return <AppPage />;
}