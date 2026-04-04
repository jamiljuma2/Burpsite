import React, { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './context/authStore';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import { LoadingSpinner } from './components/Common';
import apiClient from './utils/api';
import './index.css';

const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ProxyPage = lazy(() => import('./pages/ProxyPage'));
const RepeaterPage = lazy(() => import('./pages/RepeaterPage'));
const ScannerPage = lazy(() => import('./pages/ScannerPage'));
const IntruderPage = lazy(() => import('./pages/IntruderPage'));
const TargetsPage = lazy(() => import('./pages/TargetsPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const DocumentationPage = lazy(() => import('./pages/DocumentationPage'));

function PageLoader() {
  return (
    <div className="h-full min-h-[240px] flex items-center justify-center p-4">
      <LoadingSpinner />
    </div>
  );
}

function AdminRoute({ children }) {
  const { user, isAuthenticated } = useAuthStore();
  return isAuthenticated && user?.role === 'admin' ? children : <Navigate to="/dashboard" />;
}

function PublicRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
}

export default function App() {
  const { isAuthenticated, user, setUser } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated && (!user || !user.role)) {
      apiClient
        .get('/auth/profile')
        .then((response) => {
          setUser(response.data);
        })
        .catch(() => {
          // The response interceptor handles invalid tokens.
        });
    }
  }, [isAuthenticated, user, setUser]);

  if (!isAuthenticated) {
    return (
      <Router>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Suspense>
      </Router>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-slate-900 flex flex-col">
        <Header onMenuToggle={() => setIsSidebarOpen((prev) => !prev)} />
        <div className="flex flex-1 min-h-0">
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
          <main className="flex-1 min-w-0 overflow-auto overscroll-contain">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/proxy" element={<ProxyPage />} />
                <Route path="/repeater" element={<RepeaterPage />} />
                <Route path="/scanner" element={<ScannerPage />} />
                <Route path="/intruder" element={<IntruderPage />} />
                <Route path="/targets" element={<TargetsPage />} />
                <Route path="/documentation" element={<DocumentationPage />} />
                <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </div>
    </Router>
  );
}
