import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Radio, Zap, Target, Globe, Home, ShieldCheck, Crown } from 'lucide-react';
import useAuthStore from '../context/authStore';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: Home },
  { label: 'Proxy', path: '/proxy', icon: Radio },
  { label: 'Repeater', path: '/repeater', icon: Activity },
  { label: 'Scanner', path: '/scanner', icon: Zap },
  { label: 'Intruder', path: '/intruder', icon: Target },
  { label: 'Target Map', path: '/targets', icon: Globe },
];

const ADMIN_NAV_ITEMS = [
  { label: 'Admin Dashboard', path: '/admin', icon: Crown },
];

export default function Sidebar() {
  const location = useLocation();
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  return (
    <aside className="w-64 bg-slate-800 border-r border-slate-700 min-h-screen relative">
      <nav className="p-4 space-y-2 pb-32">
        {NAV_ITEMS.map(({ label, path, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
              location.pathname === path
                ? 'bg-red-600 text-white'
                : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Icon size={20} />
            {label}
          </Link>
        ))}

        {isAdmin && (
          <div className="pt-4 mt-4 border-t border-slate-700">
            <div className="flex items-center gap-2 px-4 pb-3 text-xs uppercase tracking-[0.2em] text-red-400">
              <ShieldCheck size={14} />
              Admin Navigation
            </div>
            <div className="space-y-2">
              {ADMIN_NAV_ITEMS.map(({ label, path, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                    location.pathname === path
                      ? 'bg-red-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Icon size={20} />
                  {label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-slate-700 rounded-lg p-4 text-sm text-slate-300">
          <p className="font-bold text-yellow-400 mb-2">⚠️ Disclaimer</p>
          <p>Use this tool ethically and only on systems you have permission to test.</p>
        </div>
      </div>
    </aside>
  );
}
