import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { RootLayout } from '@/layouts/RootLayout';
import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { authRoutes } from './authRoutes';

const HomePage = lazy(() => import('@/pages/HomePage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

// Wrap lazy-loaded components with Suspense
const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <SuspenseWrapper>
            <HomePage />
          </SuspenseWrapper>
        ),
      },
      ...authRoutes,
      {
        path: '*',
        element: (
          <SuspenseWrapper>
            <NotFoundPage />
          </SuspenseWrapper>
        ),
      },
    ],
  },
]);
