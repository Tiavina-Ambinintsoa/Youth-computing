import { motion } from 'framer-motion';
import { MapPin, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Signalement } from '@/types';

const statutConfig = {
  en_attente: { label: 'En attente', icon: Clock, className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  en_cours:   { label: 'En cours',   icon: AlertTriangle, className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  resolu:     { label: 'Résolu',     icon: CheckCircle, className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
};

interface SignalementCardProps {
  signalement: Signalement;
  index?: number;
  onClick?: () => void;
}

export function SignalementCard({ signalement, index = 0, onClick }: SignalementCardProps) {
  const statut = statutConfig[signalement.statut] ?? statutConfig['en_attente'];
  const StatutIcon = statut.icon;

  return (
    <motion.div
      custom={index}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: 'easeOut' as const }}
      onClick={onClick}
      className={onClick ? 'cursor-pointer' : ''}
    >
      <Card className="border-0 shadow-sm hover:shadow-md transition-shadow h-full">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-slate-900 dark:text-white text-sm line-clamp-1">{signalement.titre}</h3>
            <Badge className={`shrink-0 text-xs gap-1 ${statut.className}`}>
              <StatutIcon size={11} />
              {statut.label}
            </Badge>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">{signalement.description}</p>

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            {signalement.adresse && (
              <span className="flex items-center gap-1">
                <MapPin size={11} />
                <span className="line-clamp-1">{signalement.adresse}</span>
              </span>
            )}
            <span className="ml-auto">
              {new Date(signalement.createdAt).toLocaleDateString('fr-FR')}
            </span>
          </div>

          {signalement.categorie && (
            <div
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: signalement.categorie.couleur }}
            >
              {signalement.categorie.nom}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
