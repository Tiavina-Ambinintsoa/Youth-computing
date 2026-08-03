// frontend/src/components/layout/AdminLayout.tsx
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Map, List, LogOut, ChevronLeft, Menu, Home, Sun, Moon, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';

const adminLinks = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/admin/carte', label: 'Carte', icon: Map },
  { to: '/admin/signalements', label: 'Signalements', icon: List },
];

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { isDark, toggle } = useTheme();

  return (
    <div className="min-h-screen bg-green-50 dark:bg-gray-950 flex">

      {/* Sidebar desktop */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 z-50 bg-white dark:bg-gray-900 border-r border-slate-200 dark:border-white/5 overflow-hidden"
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-white/5">
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2.5"
              >
                <div className="w-8 h-8 rounded-xl bg-[#10B981] flex items-center justify-center shadow-lg shadow-[#10B981]/30">
                  <Map size={15} className="text-white" />
                </div>
                <span style={{ fontFamily: 'Goodly' }} className="text-slate-800 dark:text-white text-lg">Signaleo</span>
              </motion.div>
            )}
          </AnimatePresence>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto text-slate-400 dark:text-gray-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10"
          >
            {collapsed ? <Menu size={18} /> : <ChevronLeft size={18} />}
          </Button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1.5">
          {adminLinks.map(({ to, label, icon: Icon, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all',
                  isActive
                    ? 'bg-[#10B981] text-white shadow-lg shadow-[#10B981]/20'
                    : 'text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10'
                )
              }
            >
              <Icon size={18} className="shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 space-y-1.5 border-t border-slate-200 dark:border-white/5">
          <button
            onClick={toggle}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-all"
          >
            {isDark ? <Sun size={18} className="shrink-0" /> : <Moon size={18} className="shrink-0" />}
            <AnimatePresence>
              {!collapsed && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {isDark ? 'Mode clair' : 'Mode sombre'}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-all"
          >
            <Home size={18} className="shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  Retour site
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-red-400 hover:text-white hover:bg-red-500 transition-all"
          >
            <LogOut size={18} className="shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  Déconnexion
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>

      {/* Contenu principal */}
      <motion.main
        animate={{ marginLeft: collapsed ? 72 : 240 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden md:block flex-1 min-h-screen"
      >
        <Outlet />
      </motion.main>

      {/* Mobile */}
      <div className="md:hidden flex flex-col min-h-screen w-full">
        {/* Header mobile */}
        <div className="h-14 flex items-center justify-between px-4 bg-white dark:bg-gray-900 border-b border-slate-200 dark:border-white/5 fixed top-0 left-0 right-0" style={{ zIndex: 99999 }}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#10B981] flex items-center justify-center">
              <Map size={13} className="text-white" />
            </div>
            <span style={{ fontFamily: 'Goodly' }} className="text-slate-800 dark:text-white text-lg">Signaleo</span>
          </div>
          <button
            onClick={() => setMobileOpen(o => !o)}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Drawer menu */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
                className="fixed inset-0 bg-black/40"
                style={{ zIndex: 99998 }}
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="fixed top-0 left-0 bottom-0 w-64 bg-white dark:bg-gray-900 flex flex-col shadow-xl"
                style={{ zIndex: 99999 }}
              >
                <div className="h-14 flex items-center justify-between px-4 border-b border-slate-200 dark:border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#10B981] flex items-center justify-center">
                      <Map size={13} className="text-white" />
                    </div>
                    <span style={{ fontFamily: 'Goodly' }} className="text-slate-800 dark:text-white text-lg">Signaleo</span>
                  </div>
                  <button onClick={() => setMobileOpen(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white">
                    <X size={18} />
                  </button>
                </div>

                <nav className="flex-1 p-3 space-y-1">
                  {adminLinks.map(({ to, label, icon: Icon, exact }) => (
                    <NavLink
                      key={to}
                      to={to}
                      end={exact}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all',
                          isActive
                            ? 'bg-[#10B981] text-white shadow-lg shadow-[#10B981]/20'
                            : 'text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10'
                        )
                      }
                    >
                      <Icon size={18} />
                      {label}
                    </NavLink>
                  ))}
                </nav>

                <div className="p-3 space-y-1 border-t border-slate-200 dark:border-white/5">
                  <button onClick={toggle} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-all">
                    {isDark ? <Sun size={18} /> : <Moon size={18} />}
                    {isDark ? 'Mode clair' : 'Mode sombre'}
                  </button>
                  <button onClick={() => { navigate('/'); setMobileOpen(false); }} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-all">
                    <Home size={18} />
                    Retour site
                  </button>
                  <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-red-400 hover:text-white hover:bg-red-500 transition-all">
                    <LogOut size={18} />
                    Déconnexion
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Contenu */}
        <div className="pt-14 flex-1 min-h-screen">
          <Outlet />
        </div>
      </div>

    </div>
  );
}
