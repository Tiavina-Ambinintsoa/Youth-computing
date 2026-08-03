import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Map, Plus, List, Home, LogOut, LayoutDashboard, ChevronDown, Sun, Moon, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/hooks/useTheme';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navLinks = [
  { to: '/', label: 'Accueil', icon: Home, exact: true },
  { to: '/carte', label: 'Carte', icon: Map },
  { to: '/signaler', label: 'Signaler', icon: Plus },
  { to: '/mes-signalements', label: 'Mes signalements', icon: List },
];

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isDark, toggle } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrolledBg = isDark ? 'rgba(17,24,39,0.90)' : 'rgba(240,253,244,0.95)';
  const scrolledBorder = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(16,185,129,0.15)';
  const scrolledShadow = isDark ? '0 8px 32px rgba(0,0,0,0.25)' : '0 4px 16px rgba(16,185,129,0.10)';

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:flex fixed top-0 left-0 right-0 justify-center" style={{ zIndex: 99999 }}>
        <motion.header
          animate={{
            width: scrolled ? '70%' : '100%',
            marginTop: scrolled ? 12 : 0,
            borderRadius: scrolled ? 999 : 0,
            backgroundColor: scrolled ? scrolledBg : 'rgba(0,0,0,0)',
            boxShadow: scrolled ? scrolledShadow : 'none',
            backdropFilter: scrolled ? 'blur(20px)' : 'blur(0px)',
          }}
          transition={{ type: 'spring', stiffness: 200, damping: 30 }}
          className="overflow-hidden border border-transparent"
          style={{ borderColor: scrolled ? scrolledBorder : 'transparent' }}
        >
          <div className="px-6 h-14 flex items-center justify-between">
            <NavLink to="/" className="flex items-center">
              <span style={{ fontFamily: 'Goodly' }} className={`text-2xl ${scrolled && !isDark ? 'text-slate-800' : 'text-white'}`}>Signaleo</span>
            </NavLink>

            <AnimatePresence>
              {scrolled && (
                <motion.nav
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-1"
                >
                  {navLinks.map(({ to, label, exact }) => (
                    <NavLink
                      key={to}
                      to={to}
                      end={exact}
                      className={({ isActive }) =>
                        cn(
                          'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-[#10B981] text-white'
                            : scrolled && !isDark
                              ? 'text-slate-600 hover:text-slate-900 hover:bg-green-100'
                              : 'text-white/70 hover:text-white hover:bg-white/10'
                        )
                      }
                    >
                      {label}
                    </NavLink>
                  ))}
                </motion.nav>
              )}
            </AnimatePresence>

            <div className="flex items-center gap-2">
              <button
                onClick={toggle}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  scrolled && !isDark
                    ? 'text-slate-500 hover:text-slate-900 hover:bg-green-100'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
                aria-label="Toggle theme"
              >
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className={`flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full border transition-all text-sm ${
                      scrolled && !isDark
                        ? 'bg-green-100 hover:bg-green-200 border-green-200'
                        : 'bg-white/10 hover:bg-white/20 border-white/10 hover:border-white/20'
                    }`}>
                      <div className="w-6 h-6 rounded-full bg-[#10B981] flex items-center justify-center text-white font-bold text-xs">
                        {user?.username?.charAt(0).toUpperCase()}
                      </div>
                      <span className={`font-medium ${scrolled && !isDark ? 'text-slate-700' : 'text-white/90'}`}>{user?.username}</span>
                      <ChevronDown size={13} className={scrolled && !isDark ? 'text-slate-400' : 'text-white/50'} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 mt-2 p-0 overflow-hidden bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-700 shadow-xl z-[9999]">
                    <div className="px-4 py-3 bg-gradient-to-br from-[#10B981]/10 to-transparent border-b border-slate-100 dark:border-slate-700">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#10B981] flex items-center justify-center text-white font-bold text-sm shrink-0">
                          {user?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user?.username}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                        </div>
                      </div>
                      {user?.role?.type === 'admin' && (
                        <span className="mt-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#10B981]/15 text-[#10B981]">
                          Admin
                        </span>
                      )}
                    </div>

                    <div className="p-1.5">
                      {user?.role?.type === 'admin' && (
                        <DropdownMenuItem
                          onClick={() => navigate('/admin')}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm cursor-pointer text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <LayoutDashboard size={14} className="text-[#10B981]" />
                          Dashboard Admin
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => navigate('/mes-signalements')}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm cursor-pointer text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <List size={14} className="text-slate-400" />
                        Mes signalements
                      </DropdownMenuItem>
                    </div>

                    <DropdownMenuSeparator className="my-0" />

                    <div className="p-1.5">
                      <DropdownMenuItem
                        onClick={logout}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-900/20 cursor-pointer"
                      >
                        <LogOut size={14} />
                        Déconnexion
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/login')}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      scrolled && !isDark
                        ? 'text-slate-600 hover:text-slate-900 hover:bg-green-100'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    Connexion
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="px-3 py-1.5 rounded-full bg-[#10B981] hover:bg-[#059669] text-white text-sm font-medium transition-colors"
                  >
                    S'inscrire
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.header>
      </div>

      {/* Mobile top hamburger */}
      <div className="md:hidden fixed top-0 left-0 right-0" style={{ zIndex: 99999 }}>
        <div className={`flex items-center justify-between px-4 h-14 border-b transition-all duration-300 ${
            scrolled ? 'bg-gray-900/80 backdrop-blur-md border-white/10' : 'bg-transparent border-transparent'
          }`}>
          <NavLink to="/">
            <span style={{ fontFamily: 'Goodly' }} className="text-xl text-white">Signaleo</span>
          </NavLink>
          <div className="flex items-center gap-2">
            <button onClick={toggle} className="w-8 h-8 flex items-center justify-center text-white/70">
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="w-8 h-8 flex items-center justify-center text-white"
            >
              <motion.div animate={{ rotate: mobileOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </motion.div>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="bg-gray-900/95 backdrop-blur-md border-b border-white/10 px-4 py-3 space-y-1"
            >
              {navLinks.map(({ to, label, icon: Icon, exact }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={exact}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                      isActive ? 'bg-[#10B981] text-white' : 'text-white/70 hover:text-white hover:bg-white/10'
                    )
                  }
                >
                  <Icon size={17} />
                  {label}
                </NavLink>
              ))}

              <div className="pt-2 border-t border-white/10">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-3 px-3 py-2">
                      <div className="w-7 h-7 rounded-full bg-[#10B981] flex items-center justify-center text-white font-bold text-xs">
                        {user?.username?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{user?.username}</p>
                        <p className="text-xs text-white/50">{user?.email}</p>
                      </div>
                    </div>
                    {user?.role?.type === 'admin' && (
                      <button
                        onClick={() => { navigate('/admin'); setMobileOpen(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <LayoutDashboard size={17} className="text-[#10B981]" />
                        Dashboard Admin
                      </button>
                    )}
                    <button
                      onClick={() => { logout(); setMobileOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-white hover:bg-red-500 transition-colors"
                    >
                      <LogOut size={17} />
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <div className="flex gap-2 px-1">
                    <button
                      onClick={() => { navigate('/login'); setMobileOpen(false); }}
                      className="flex-1 py-2 rounded-xl border border-white/20 text-white text-sm font-medium hover:bg-white/10 transition-colors"
                    >
                      Connexion
                    </button>
                    <button
                      onClick={() => { navigate('/register'); setMobileOpen(false); }}
                      className="flex-1 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-sm font-medium transition-colors"
                    >
                      S'inscrire
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
