import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Shield } from 'lucide-react';
import useAuthStore from '../context/authStore';

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-slate-800 border-b border-slate-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-red-400">
          <Shield size={32} />
          Burpsite
        </Link>

        <div className="flex items-center gap-6">
          {user && (
            <span className="text-slate-300 flex items-center gap-2">
              Welcome, {user.username}
              {user.role === 'admin' && (
                <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                  Admin
                </span>
              )}
            </span>
          )}
          {user && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
