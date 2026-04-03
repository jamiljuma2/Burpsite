import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Menu, Shield } from 'lucide-react';
import useAuthStore from '../context/authStore';

export default function Header({ onMenuToggle }) {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-slate-800 border-b border-slate-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={onMenuToggle}
          className="md:hidden inline-flex items-center justify-center rounded-lg border border-slate-600 bg-slate-700 p-2 text-slate-100"
          aria-label="Toggle navigation"
        >
          <Menu size={20} />
        </button>

        <Link to="/" className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-red-400 shrink-0">
          <Shield size={28} className="sm:w-8 sm:h-8" />
          WebSecSuite
        </Link>

        <div className="ml-auto flex items-center gap-2 sm:gap-4 min-w-0">
          {user && (
            <span className="hidden sm:flex text-slate-300 items-center gap-2 min-w-0">
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
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-3 sm:px-4 py-2 rounded-lg transition text-sm sm:text-base"
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
