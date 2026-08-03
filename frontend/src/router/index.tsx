// frontend/src/router/index.tsx
import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import CitizenLayout from '@/components/layout/CitizenLayout';
import AdminLayout from '@/components/layout/AdminLayout';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';

// Lazy loading des pages
const Home = lazy(() => import('@/pages/citizen/Home'));
const PublicMap = lazy(() => import('@/pages/citizen/PublicMap'));
const CreateSignalement = lazy(() => import('@/pages/citizen/createSignalement'));
const MesSignalements = lazy(() => import('@/pages/citizen/MesSignalements'));
const Login = lazy(() => import('@/pages/auth/Login'));
const Register = lazy(() => import('@/pages/auth/Register'));
const OAuthCallback = lazy(() => import('@/pages/auth/OAuthCallback'));
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'));
const AdminMap = lazy(() => import('@/pages/admin/AdminMap'));
const AdminSignalements = lazy(() => import('@/pages/admin/Signalements'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

export const router = createBrowserRouter([
  // Routes publiques
  {
    element: <CitizenLayout />,
    children: [
      {
        path: '/',
        element: <Suspense fallback={<PageLoader />}><Home /></Suspense>,
      },
      {
        path: '/carte',
        element: <Suspense fallback={<PageLoader />}><PublicMap /></Suspense>,
      },
      {
        path: '/signaler',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}><CreateSignalement /></Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: '/mes-signalements',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}><MesSignalements /></Suspense>
          </ProtectedRoute>
        ),
      },
    ],
  },
  // Routes auth
  {
    path: '/login',
    element: <Suspense fallback={<PageLoader />}><Login /></Suspense>,
  },
  {
    path: '/register',
    element: <Suspense fallback={<PageLoader />}><Register /></Suspense>,
  },
  {
    path: '/connect/google/redirect',
    element: <Suspense fallback={<PageLoader />}><OAuthCallback /></Suspense>,
  },
  // Routes admin
  {
    path: '/admin',
    element: (
      <ProtectedRoute adminOnly>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Suspense fallback={<PageLoader />}><AdminDashboard /></Suspense>,
      },
      {
        path: 'carte',
        element: <Suspense fallback={<PageLoader />}><AdminMap /></Suspense>,
      },
      {
        path: 'signalements',
        element: <Suspense fallback={<PageLoader />}><AdminSignalements /></Suspense>,
      },
    ],
  },
]);