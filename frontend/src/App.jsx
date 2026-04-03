import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './context/authStore';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import apiClient from './utils/api';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProxyPage from './pages/ProxyPage';
import RepeaterPage from './pages/RepeaterPage';
import ScannerPage from './pages/ScannerPage';
import IntruderPage from './pages/IntruderPage';
import TargetsPage from './pages/TargetsPage';
import AdminPage from './pages/AdminPage';
import './index.css';

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
        <Routes>
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-slate-900 flex flex-col">
        <Header onMenuToggle={() => setIsSidebarOpen((prev) => !prev)} />
        <div className="flex flex-1 min-h-0">
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
          <main className="flex-1 min-w-0 overflow-auto">
            <Routes>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/proxy" element={<ProxyPage />} />
              <Route path="/repeater" element={<RepeaterPage />} />
              <Route path="/scanner" element={<ScannerPage />} />
              <Route path="/intruder" element={<IntruderPage />} />
              <Route path="/targets" element={<TargetsPage />} />
              <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}
