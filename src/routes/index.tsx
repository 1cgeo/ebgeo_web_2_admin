// Path: routes\index.tsx
import { Suspense, lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

import DashboardLayout from '@/layouts/DashboardLayout';

import { RequireAuth as ProtectedRoute } from '@/components/Auth/RequireAuth';
import LoadingScreen from '@/components/Feedback/LoadingScreen';

// Lazy loading das páginas
const LoginPage = lazy(() => import('@/pages/Login'));
const DashboardPage = lazy(() => import('@/pages/Dashboard'));
const UsersPage = lazy(() => import('@/pages/Users'));
const GroupsPage = lazy(() => import('@/pages/Groups'));
const CatalogPage = lazy(() => import('@/pages/Catalog'));
const ZonesPage = lazy(() => import('@/pages/Zones'));
const LogsPage = lazy(() => import('@/pages/Logs'));
const AuditPage = lazy(() => import('@/pages/Audit'));

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <Suspense fallback={<LoadingScreen />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <DashboardPage />
          </Suspense>
        ),
      },
      {
        path: 'users',
        element: (
          <ProtectedRoute requireAdmin>
            <Suspense fallback={<LoadingScreen />}>
              <UsersPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'groups',
        element: (
          <ProtectedRoute requireAdmin>
            <Suspense fallback={<LoadingScreen />}>
              <GroupsPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'catalog',
        element: (
          <ProtectedRoute requireAdmin>
            <Suspense fallback={<LoadingScreen />}>
              <CatalogPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'zones',
        element: (
          <ProtectedRoute requireAdmin>
            <Suspense fallback={<LoadingScreen />}>
              <ZonesPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'logs',
        element: (
          <ProtectedRoute requireAdmin>
            <Suspense fallback={<LoadingScreen />}>
              <LogsPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'audit',
        element: (
          <ProtectedRoute requireAdmin>
            <Suspense fallback={<LoadingScreen />}>
              <AuditPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
