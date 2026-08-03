import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp, Clock, AlertTriangle, CheckCircle,
  ArrowRight, MapPin, Activity, BarChart3, ListChecks, Home
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useSignalements } from '@/hooks/useSignalements';
import { useAuth } from '@/contexts/AuthContext';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: 'easeOut' as const },
  }),
};

const statutConfig = {
  en_attente: { label: 'En attente', color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-400' },
  en_cours:   { label: 'En cours',   color: 'bg-blue-100 text-blue-700',   dot: 'bg-blue-400' },
  resolu:     { label: 'Résolu',     color: 'bg-emerald-100 text-emerald-700', dot: 'bg-[#10B981]' },
};

const catColors = ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EF4444'];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, isLoading } = useSignalements({ pageSize: 100 });
  const { data: recentData, isLoading: loadingRecent } = useSignalements({ pageSize: 6 });

  const signalements = data?.data ?? [];
  const total = signalements.length;
  const enAttente = signalements.filter(s => s.statut === 'en_attente').length;
  const enCours   = signalements.filter(s => s.statut === 'en_cours').length;
  const resolus   = signalements.filter(s => s.statut === 'resolu').length;
  const tauxResolution = total > 0 ? Math.round((resolus / total) * 100) : 0;

  const stats = [
    { label: 'Total signalements', value: total,     icon: TrendingUp,    accent: '#6B7280', light: 'bg-slate-100' },
    { label: 'En attente',         value: enAttente, icon: Clock,         accent: '#F59E0B', light: 'bg-amber-50' },
    { label: 'En cours',           value: enCours,   icon: AlertTriangle, accent: '#3B82F6', light: 'bg-blue-50' },
    { label: 'Résolus',            value: resolus,   icon: CheckCircle,   accent: '#10B981', light: 'bg-emerald-50' },
  ];

  const byCategorie = signalements.reduce<Record<string, number>>((acc, s) => {
    const nom = s.categorie?.nom ?? 'Autre';
    acc[nom] = (acc[nom] ?? 0) + 1;
    return acc;
  }, {});
  const categorieEntries = Object.entries(byCategorie).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div className="min-h-screen bg-green-50 dark:bg-gray-950">

      {/* Top bar */}
      <div className="bg-white dark:bg-gray-900 border-b border-slate-100 dark:border-slate-800 px-4 py-3">
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible"
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#10B981] flex items-center justify-center shadow-lg shadow-[#10B981]/30">
              <BarChart3 size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 dark:text-white">Bonjour, {user?.username} 👋</h1>
              <p className="text-xs text-slate-400">Tableau de bord</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              <span className="text-xs font-medium text-[#10B981]">En ligne</span>
            </div>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium transition-colors"
            >
              <Home size={13} /><span className="hidden sm:inline"> Accueil</span>
            </button>
          </div>
        </motion.div>
      </div>

      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto">

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((stat, i) => (
            <motion.div key={stat.label} custom={i + 1} variants={fadeUp} initial="hidden" animate="visible">
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-xl ${stat.light} flex items-center justify-center`}>
                    <stat.icon size={16} style={{ color: stat.accent }} />
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium text-slate-400 text-right">{stat.label}</span>
                </div>
                {isLoading
                  ? <Skeleton className="h-8 w-12" />
                  : <p className="text-3xl sm:text-5xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                }
                <div className="mt-3 h-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: total > 0 ? `${Math.round((stat.value / total) * 100)}%` : '0%' }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: stat.accent }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Taux de résolution */}
          <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm h-full flex flex-col">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-xl bg-[#10B981]/10 flex items-center justify-center">
                  <Activity size={15} className="text-[#10B981]" />
                </div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Taux de résolution</p>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center py-4">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#F1F5F9" strokeWidth="10" />
                    <motion.circle
                      cx="50" cy="50" r="40" fill="none"
                      stroke="#10B981" strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - tauxResolution / 100) }}
                      transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-slate-900 dark:text-white">{tauxResolution}%</span>
                    <span className="text-xs text-slate-400">résolu</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4">
                {[
                  { label: 'Attente', value: enAttente, color: '#F59E0B' },
                  { label: 'En cours', value: enCours,  color: '#3B82F6' },
                  { label: 'Résolus',  value: resolus,  color: '#10B981' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="bg-slate-50 dark:bg-slate-800 rounded-xl p-2.5 text-center">
                    <div className="w-2 h-2 rounded-full mx-auto mb-1" style={{ backgroundColor: color }} />
                    <p className="text-[10px] text-slate-400">{label}</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Répartition par catégorie */}
          <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible" className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm h-full">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-xl bg-[#10B981]/10 flex items-center justify-center">
                  <BarChart3 size={15} className="text-[#10B981]" />
                </div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Répartition par catégorie</p>
              </div>

              <div className="space-y-4">
                {isLoading
                  ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)
                  : categorieEntries.length === 0
                    ? <p className="text-sm text-slate-400 text-center py-8">Aucune donnée</p>
                    : categorieEntries.map(([nom, count], i) => {
                        const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                        const color = catColors[i % catColors.length];
                        return (
                          <div key={nom}>
                            <div className="flex items-center justify-between text-xs mb-1.5">
                              <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                                <span className="font-medium text-slate-700 dark:text-slate-300">{nom}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-slate-900 dark:text-white">{count}</span>
                                <span className="text-slate-400 w-8 text-right">{pct}%</span>
                              </div>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ delay: 0.3 + i * 0.1, duration: 0.7, ease: 'easeOut' }}
                                className="h-2 rounded-full"
                                style={{ backgroundColor: color }}
                              />
                            </div>
                          </div>
                        );
                      })
                }
              </div>
            </div>
          </motion.div>
        </div>

        {/* Derniers signalements */}
        <motion.div custom={7} variants={fadeUp} initial="hidden" animate="visible">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#10B981]/10 flex items-center justify-center">
                  <ListChecks size={15} className="text-[#10B981]" />
                </div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Derniers signalements</p>
              </div>
              <button
                onClick={() => navigate('/admin/signalements')}
                className="flex items-center gap-1 text-xs text-[#10B981] hover:text-[#059669] font-medium transition-colors"
              >
                Voir tout <ArrowRight size={13} />
              </button>
            </div>

            {loadingRecent ? (
              <div className="p-5 space-y-3">
                {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
              </div>
            ) : (
              <div>
                {(recentData?.data ?? []).map((s, i) => {
                  const cfg = statutConfig[s.statut ?? 'en_attente'] ?? statutConfig['en_attente'];
                  return (
                    <motion.div
                      key={s.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-50 dark:border-slate-800 last:border-0"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${cfg.dot}`} />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{s.titre}</p>
                          <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                            <MapPin size={10} />
                            {s.categorie?.nom ?? '—'} · {new Date(s.createdAt).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      <span className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${cfg.color}`}>
                        {cfg.label}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
