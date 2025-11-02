import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { Outlet } from 'react-router-dom';

export const RootLayout = () => {
  return (
    <div className='flex min-h-screen flex-col'>
      <Header />
      <main className='grow'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
