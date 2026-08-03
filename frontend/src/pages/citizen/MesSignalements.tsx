import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Clock, AlertTriangle, CheckCircle, FileX } from 'lucide-react';
import { useMySignalements, useDeleteSignalement } from '@/hooks/useSignalements';
import { SignalementCard } from '@/components/signalement/SignalementCard';

const STATUTS = [
  { value: '', label: 'Tous' },
  { value: 'en_attente', label: 'En attente', icon: Clock, color: 'text-amber-500' },
  { value: 'en_cours', label: 'En cours', icon: AlertTriangle, color: 'text-blue-500' },
  { value: 'resolu', label: 'Résolu', icon: CheckCircle, color: 'text-emerald-500' },
];

export default function MesSignalements() {
  const navigate = useNavigate();
  const [statut, setStatut] = useState<any>('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const { data, isLoading } = useMySignalements();
  const { mutate: deleteSignalement, isPending: isDeleting } = useDeleteSignalement();

  const signalements = data?.data ?? [];

  const stats = {
    total: signalements.length,
    en_attente: signalements.filter((s) => s.statut === 'en_attente').length,
    en_cours: signalements.filter((s) => s.statut === 'en_cours').length,
    resolu: signalements.filter((s) => s.statut === 'resolu').length,
  };

  const filtered = statut ? signalements.filter((s) => s.statut === statut) : signalements;


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gray-900 pt-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Mes signalements</h1>
              <p className="text-sm text-white/60 mt-0.5">{stats.total} signalement{stats.total !== 1 ? 's' : ''} au total</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/signaler')}
              className="flex items-center gap-2 bg-[#10B981] hover:bg-[#059669] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
            >
              <Plus size={16} /> Nouveau
            </motion.button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            {[
              { label: 'En attente', value: stats.en_attente, color: 'bg-amber-500' },
              { label: 'En cours', value: stats.en_cours, color: 'bg-blue-500' },
              { label: 'Résolus', value: stats.resolu, color: 'bg-emerald-500' },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 rounded-xl px-4 py-3 text-center">
                <div className="text-2xl font-bold text-white">{s.value}</div>
                <div className="text-xs text-white/60 mt-0.5">{s.label}</div>
                <div className={`h-1 rounded-full mt-2 ${s.color}`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Filtres */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {STATUTS.map((s) => (
            <button
              key={s.value}
              onClick={() => setStatut(s.value)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                statut === s.value
                  ? 'bg-[#10B981] text-white'
                  : 'bg-white dark:bg-gray-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-[#10B981]'
              }`}
            >
              {s.icon && <s.icon size={13} />}
              {s.label}
            </button>
          ))}
        </div>

        {/* Liste */}
        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <FileX size={40} className="mb-3 opacity-50" />
            <p className="text-sm">Aucun signalement{statut ? ' pour ce statut' : ''}</p>
            {!statut && (
              <button onClick={() => navigate('/signaler')} className="mt-4 text-sm text-[#10B981] hover:underline">
                Créer mon premier signalement
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AnimatePresence>
              {filtered.map((s, i) => (
                <div key={s.documentId} className="relative group">
                  <SignalementCard signalement={s} index={i} />
                  <button
                    onClick={() => setConfirmDelete(s.documentId)}
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-red-50 dark:bg-red-900/30 hover:bg-red-100 text-red-500 p-1.5 rounded-lg"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Modal confirmation suppression */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
            onClick={() => setConfirmDelete(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm shadow-xl"
            >
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Supprimer ce signalement ?</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Cette action est irréversible.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors"
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
                  {isDeleting ? 'Suppression...' : 'Supprimer'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
