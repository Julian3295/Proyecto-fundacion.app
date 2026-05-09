import { cookies } from 'next/headers';
import LandingPage from './marketing/landing-page';
import AppPage from './app-content/app-page';

export default async function Home() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId');

  if (!userId) {
    return <LandingPage />;
  }

  return <AppPage />;
}
