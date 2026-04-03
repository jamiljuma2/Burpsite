import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Radio, Zap, Target, Globe, Home, ShieldCheck, Crown, BookOpen } from 'lucide-react';
import useAuthStore from '../context/authStore';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: Home },
  { label: 'Proxy', path: '/proxy', icon: Radio },
  { label: 'Repeater', path: '/repeater', icon: Activity },
  { label: 'Scanner', path: '/scanner', icon: Zap },
  { label: 'Intruder', path: '/intruder', icon: Target },
  { label: 'Target Map', path: '/targets', icon: Globe },
  { label: 'Documentation', path: '/documentation', icon: BookOpen },
];

const ADMIN_NAV_ITEMS = [
  { label: 'Admin Dashboard', path: '/admin', icon: Crown },
];

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  return (
    <>
      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          aria-label="Close navigation"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-72 max-w-[85vw] md:w-64 bg-slate-800 border-r border-slate-700 transform transition-transform duration-200 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <nav className="p-4 space-y-2 overflow-y-auto">
            {NAV_ITEMS.map(({ label, path, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={onClose}
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
                      onClick={onClose}
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

          <div className="p-4 border-t border-slate-700">
            <div className="bg-slate-700 rounded-lg p-4 text-sm text-slate-300">
              <p className="font-bold text-yellow-400 mb-2">Disclaimer</p>
              <p>Use this tool ethically and only on systems you have permission to test.</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
