import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { PublicRoute } from '@/components/auth/PublicRoute';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<div>Landing Page</div>} />
      <Route
        path="/auth/*"
        element={
          <PublicRoute>
            <div>Auth Pages</div>
          </PublicRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <div>Dashboard</div>
          </ProtectedRoute>
        }
      />

      {/* Author Routes */}
      <Route
        path="/author/*"
        element={
          <ProtectedRoute allowedRoles={['author']}>
            <div>Author Dashboard</div>
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <div>Admin Dashboard</div>
          </ProtectedRoute>
        }
      />

      {/* Catch all route */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;