// frontend/src/pages/citizen/Home.tsx
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin, Plus, ArrowRight, CheckCircle,
  Clock, AlertTriangle, TrendingUp, Map,
  Smartphone, Shield
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatsCard } from '@/components/ui/stats-card';
import { SignalementCard } from '@/components/signalement/SignalementCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useSignalements } from '@/hooks/useSignalements';
import { RecentMap } from '@/components/map/RecentMap';
import heroBg from '@/assets/fianara.webp'; // ← import de l'image

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' as const },
  }),
};

const steps = [
  {
    icon: MapPin,
    title: 'Localisez',
    description: "Cliquez sur la carte pour pointer l'emplacement exact du problème.",
    color: 'bg-[#10B981]/10',
    iconColor: 'text-[#10B981]',
  },
  {
    icon: Smartphone,
    title: 'Signalez',
    description: 'Décrivez le problème, ajoutez des photos et choisissez la catégorie.',
    color: 'bg-[#3B82F6]/10',
    iconColor: 'text-[#3B82F6]',
  },
  {
    icon: Shield,
    title: 'Suivez',
    description: "Suivez l'évolution de votre signalement jusqu'à sa résolution.",
    color: 'bg-amber-100 dark:bg-amber-900/20',
    iconColor: 'text-amber-500',
  },
];

export default function Home() {
  const navigate = useNavigate();

  const { data: allData, isLoading: loadingAll } = useSignalements({ pageSize: 100 });
  const { data: recentData, isLoading: loadingRecent } = useSignalements({ pageSize: 4 });
  const { data: mapData } = useSignalements({ pageSize: 20 });

  const total = allData?.meta?.pagination?.total ?? 0;
  const resolus = allData?.data?.filter(s => s.statut === 'resolu').length ?? 0;
  const enCours = allData?.data?.filter(s => s.statut === 'en_cours').length ?? 0;
  const enAttente = allData?.data?.filter(s => s.statut === 'en_attente').length ?? 0;
  const tauxResolution = total > 0 ? Math.round((resolus / total) * 100) : 0;
  const recentSignalements = recentData?.data ?? [];
  const mapSignalements = mapData?.data ?? [];

  return (
    <div className="min-h-screen bg-green-50 dark:bg-gray-900">

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden min-h-[600px]">

        {/* Image de fond */}
        <img
          src={heroBg}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Overlay sombre pour lisibilité du texte */}
        <div className="absolute inset-0 bg-gray-900/70" />

        {/* Lueurs vertes décoratives — par-dessus l'overlay */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-[#10B981] blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-[#10B981] blur-3xl" />
        </div>

        {/* Contenu — z-10 pour passer au-dessus de tout */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 py-24 md:py-36 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#10B981]/20 border border-[#10B981]/30 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-xs font-medium text-[#10B981]">Fianarantsoa Smart City</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-white"
          >
            Signalez,{' '}
            <span className="text-[#10B981]">ensemble</span>
            <br />
            améliorons notre ville
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-lg text-gray-300 mb-10 max-w-xl mx-auto"
          >
            <span className='text-red-400'>Signaleo</span> permet aux citoyens de Fianarantsoa de signaler
            facilement les problèmes urbains et de suivre leur résolution en temps réel.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <button
              onClick={() => navigate('/signaler')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#10B981] hover:bg-[#059669] text-white font-medium rounded-lg transition-colors shadow-lg"
            >
              <Plus size={20} />
              Faire un signalement
            </button>
            <button
              onClick={() => navigate('/carte')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/20 text-white hover:bg-white/10 font-medium rounded-lg transition-colors backdrop-blur-sm"
            >
              <Map size={20} />
              Voir la carte
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex items-center justify-center gap-8 mt-14 pt-10 border-t border-white/10"
          >
            {[
              { value: total, label: 'Signalements' },
              { value: `${tauxResolution}%`, label: 'Taux de résolution' },
              { value: resolus, label: 'Problèmes résolus' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white">
                  {loadingAll ? <Skeleton className="h-8 w-16 bg-white/10 mx-auto" /> : stat.value}
                </div>
                <div className="text-xs text-[#10B981] mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Stats cards ──────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          custom={0} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Statistiques en temps réel</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">État actuel des signalements à Fianarantsoa</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {loadingAll ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="border-0 shadow-sm">
                <CardContent className="p-5 space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-12" />
                </CardContent>
              </Card>
            ))
          ) : (
            <>
              <StatsCard title="Total" value={total} subtitle="signalements" icon={TrendingUp} iconClassName="bg-gray-100 dark:bg-gray-800" index={0} />
              <StatsCard title="En attente" value={enAttente} subtitle="à traiter" icon={Clock} iconClassName="bg-amber-100 dark:bg-amber-900/20" index={1} />
              <StatsCard title="En cours" value={enCours} subtitle="en traitement" icon={AlertTriangle} iconClassName="bg-[#3B82F6]/10" index={2} />
              <StatsCard title="Résolus" value={resolus} subtitle={`${tauxResolution}% du total`} icon={CheckCircle} iconClassName="bg-[#10B981]/10" index={3} />
            </>
          )}
        </div>
      </section>

      {/* ── Carte des signalements ────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          custom={0} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Carte des signalements</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">Visualisez les problèmes signalés dans la ville</p>
          </div>
          <button
            onClick={() => navigate('/carte')}
            className="inline-flex items-center gap-1.5 text-sm text-[#10B981] hover:text-[#059669] font-medium transition-colors"
          >
            Carte complète <ArrowRight size={16} />
          </button>
        </motion.div>
        <motion.div custom={1} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <RecentMap signalements={mapSignalements} />
        </motion.div>
      </section>

      {/* ── Comment ça marche ────────────────────────────── */}
      <section className="bg-green-100 dark:bg-slate-800 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            custom={0} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-3 bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20">Simple & Rapide</Badge>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Comment ça marche ?</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">Signalez un problème en moins de 2 minutes</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <Card className="border-0 shadow-sm text-center h-full bg-white dark:bg-gray-900">
                  <CardContent className="p-6 space-y-4">
                    <div className={`w-14 h-14 rounded-2xl ${step.color} flex items-center justify-center mx-auto`}>
                      <step.icon size={24} className={step.iconColor} />
                    </div>
                    <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto text-xs font-bold text-gray-500">
                      {i + 1}
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">{step.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">{step.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Derniers signalements ─────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          custom={0} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Derniers signalements</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">Les plus récents dans la ville</p>
          </div>
          <button
            onClick={() => navigate('/carte')}
            className="inline-flex items-center gap-1.5 text-sm text-[#10B981] hover:text-[#059669] font-medium transition-colors"
          >
            Voir tout <ArrowRight size={16} />
          </button>
        </motion.div>

        {loadingRecent ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="border-0 shadow-sm">
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </div>
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentSignalements.map((s, i) => (
              <SignalementCard
                key={s.id}
                signalement={s}
                index={i}
                onClick={() => navigate(`/signalements/${s.documentId}`)}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── CTA final ────────────────────────────────────── */}
      <section className="relative py-16 overflow-hidden" style={{backgroundImage: "url('./../../src/assets/police.avif')", backgroundSize: 'cover', backgroundPosition: '0% 20%'}}>
        <div className="absolute inset-0 bg-gray-900/75" />
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-[#10B981] blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-[#10B981] blur-3xl" />
        </div>

        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative z-10 max-w-2xl mx-auto px-4 text-center text-white"
        >
          <h2 className="text-2xl font-bold mb-3">Prêt à améliorer votre quartier ?</h2>
          <p className="text-white/80 mb-8">
            Rejoignez les citoyens actifs de Fianarantsoa et contribuez à une ville meilleure.
          </p>
          <button
            onClick={() => navigate('/signaler')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#10B981] hover:bg-gray-100 font-semibold rounded-lg transition-colors shadow-lg"
          >
            <Plus size={20} />
            Commencer maintenant
            <ArrowRight size={16} />
          </button>
        </motion.div>
      </section>

    </div>
  );
}