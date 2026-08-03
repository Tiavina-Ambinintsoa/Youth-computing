import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ChevronDown, MapPin, Clock, AlertTriangle, CheckCircle, FileX, SlidersHorizontal, List } from 'lucide-react';
import { useSignalements, useUpdateSignalement, useDeleteSignalement } from '@/hooks/useSignalements';
import { useCategories } from '@/hooks/useCategories';
import type { Signalement } from '@/types';

const statutConfig = {
  en_attente: { label: 'En attente', icon: Clock,         className: 'bg-amber-100 text-amber-700',   dot: 'bg-amber-400' },
  en_cours:   { label: 'En cours',   icon: AlertTriangle, className: 'bg-blue-100 text-blue-700',     dot: 'bg-blue-400' },
  resolu:     { label: 'Résolu',     icon: CheckCircle,   className: 'bg-emerald-100 text-emerald-700', dot: 'bg-[#10B981]' },
};

function StatutSelect({ signalement }: { signalement: Signalement }) {
  const { mutate: update, isPending } = useUpdateSignalement();
  const cfg = statutConfig[signalement.statut ?? 'en_attente'] ?? statutConfig['en_attente'];

  return (
    <div className="relative">
      <select
        value={signalement.statut ?? 'en_attente'}
        disabled={isPending}
        onChange={(e) => update({ documentId: signalement.documentId, payload: { statut: e.target.value as any } })}
        className={`appearance-none text-xs font-semibold pl-3 pr-7 py-1.5 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-[#10B981] disabled:opacity-50 cursor-pointer ${cfg.className}`}
      >
        {Object.entries(statutConfig).map(([val, { label }]) => (
          <option key={val} value={val}>{label}</option>
        ))}
      </select>
      <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
    </div>
  );
}

export default function AdminSignalements() {
  const [statut, setStatut] = useState<string>('');
  const [categorieId, setCategorieId] = useState<string>('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const { data, isLoading } = useSignalements({ pageSize: 100 });
  const { data: categories = [] } = useCategories();
  const { mutate: deleteSignalement, isPending: isDeleting } = useDeleteSignalement();

  const signalements = data?.data ?? [];
  const filtered = signalements.filter((s) => {
    if (statut && s.statut !== statut) return false;
    if (categorieId && s.categorie?.documentId !== categorieId) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-green-50 dark:bg-gray-950">

      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-slate-100 dark:border-slate-800 px-4 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#10B981]/10 flex items-center justify-center">
              <List size={16} className="text-[#10B981]" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 dark:text-white">Signalements</h1>
              <p className="text-xs text-slate-400">{filtered.length} résultat{filtered.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          {/* Filtres */}
          <div className="flex items-center gap-2 flex-wrap">
            <SlidersHorizontal size={14} className="text-slate-400 shrink-0" />
            <select
              value={statut}
              onChange={(e) => setStatut(e.target.value)}
              className="flex-1 min-w-0 text-sm bg-slate-100 dark:bg-slate-800 border-0 rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#10B981] outline-none text-slate-700 dark:text-slate-300"
            >
              <option value="">Tous les statuts</option>
              {Object.entries(statutConfig).map(([val, { label }]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
            <select
              value={categorieId}
              onChange={(e) => setCategorieId(e.target.value)}
              className="flex-1 min-w-0 text-sm bg-slate-100 dark:bg-slate-800 border-0 rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#10B981] outline-none text-slate-700 dark:text-slate-300"
            >
              <option value="">Toutes catégories</option>
              {categories.map((cat) => (
                <option key={cat.documentId} value={cat.documentId}>{cat.nom}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-6">
        {isLoading ? (
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 border-2 border-[#10B981] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
              <FileX size={28} className="opacity-50" />
            </div>
            <p className="text-sm font-medium">Aucun signalement trouvé</p>
          </div>
        ) : (
          <>
            {/* Cards mobile */}
            <div className="sm:hidden space-y-3">
              <AnimatePresence>
                {filtered.map((s, i) => {
                  const cfg = statutConfig[s.statut ?? 'en_attente'] ?? statutConfig['en_attente'];
                  return (
                    <motion.div
                      key={s.documentId}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />
                          <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{s.titre}</p>
                        </div>
                        <button
                          onClick={() => setConfirmDelete(s.documentId)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shrink-0"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          {s.categorie && (
                            <span className="text-xs text-white px-2 py-0.5 rounded-full" style={{ backgroundColor: s.categorie.couleur ?? '#6B7280' }}>
                              {s.categorie.nom}
                            </span>
                          )}
                          <span className="text-xs text-slate-400">{new Date(s.createdAt).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <StatutSelect signalement={s} />
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Table desktop */}
            <div className="hidden sm:block bg-white dark:bg-gray-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Titre</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Catégorie</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Adresse</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Statut</th>
                    <th className="px-5 py-3.5" />
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filtered.map((s, i) => {
                      const cfg = statutConfig[s.statut ?? 'en_attente'] ?? statutConfig['en_attente'];
                      return (
                        <motion.tr
                          key={s.documentId}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ delay: i * 0.03 }}
                          className="border-b border-slate-50 dark:border-slate-800 last:border-0 hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2.5">
                              <div className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />
                              <p className="text-sm font-medium text-slate-900 dark:text-white truncate max-w-[180px]">{s.titre}</p>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            {s.categorie ? (
                              <span
                                className="inline-flex items-center text-xs font-medium text-white px-2.5 py-1 rounded-full"
                                style={{ backgroundColor: s.categorie.couleur ?? '#6B7280' }}
                              >
                                {s.categorie.nom}
                              </span>
                            ) : (
                              <span className="text-slate-300 text-xs">—</span>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-xs text-slate-400 flex items-center gap-1 max-w-[160px] truncate">
                              <MapPin size={10} className="shrink-0" />
                              {s.adresse ?? '—'}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-xs text-slate-400 whitespace-nowrap">
                            {new Date(s.createdAt).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="px-5 py-4">
                            <StatutSelect signalement={s} />
                          </td>
                          <td className="px-5 py-4">
                            <button
                              onClick={() => setConfirmDelete(s.documentId)}
                              className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
          </>
        )}
      </div>

      {/* Modal suppression */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
            onClick={() => setConfirmDelete(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-slate-100 dark:border-slate-800"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
                <Trash2 size={20} className="text-red-500" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">Supprimer ce signalement ?</h3>
              <p className="text-sm text-slate-400 mb-6">Cette action est irréversible et définitive.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    const id = confirmDelete!;
                    setConfirmDelete(null);
                    deleteSignalement(id);
                  }}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-sm font-semibold transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
