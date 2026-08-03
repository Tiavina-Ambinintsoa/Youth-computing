// frontend/src/components/signalement/CreateSignalementSkeleton.tsx
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0
  },
};

export function CreateSignalementSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header skeleton */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white border-b sticky top-0 z-10"
      >
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Skeleton className="w-6 h-6 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-3 w-64" />
          </div>
        </div>
      </motion.div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

        {/* Titre */}
        <motion.div 
          variants={fadeUp} 
          initial="hidden" 
          animate="visible" 
          transition={{ delay: 0 * 0.08, duration: 0.4, ease: "easeOut" }}
          className="space-y-2"
        >
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full rounded-md" />
        </motion.div>

        {/* Description */}
        <motion.div 
          variants={fadeUp} 
          initial="hidden" 
          animate="visible" 
          transition={{ delay: 1 * 0.08, duration: 0.4, ease: "easeOut" }}
          className="space-y-2"
        >
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-28 w-full rounded-md" />
        </motion.div>

        {/* Catégorie + Quartier */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 2 * 0.08, duration: 0.4, ease: "easeOut" }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </motion.div>

        {/* Localisation */}
        <motion.div 
          variants={fadeUp} 
          initial="hidden" 
          animate="visible"
          transition={{ delay: 3 * 0.08, duration: 0.4, ease: "easeOut" }}
        >
          <Card>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-28" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[280px] w-full rounded-xl" />
            </CardContent>
          </Card>
        </motion.div>

        {/* Photos */}
        <motion.div 
          variants={fadeUp} 
          initial="hidden" 
          animate="visible"
          transition={{ delay: 4 * 0.08, duration: 0.4, ease: "easeOut" }}
        >
          <Card>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-16" />
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Skeleton className="w-24 h-24 rounded-lg" />
                <Skeleton className="w-24 h-24 rounded-lg" />
                <Skeleton className="w-24 h-24 rounded-lg" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bouton */}
        <motion.div 
          variants={fadeUp} 
          initial="hidden" 
          animate="visible"
          transition={{ delay: 5 * 0.08, duration: 0.4, ease: "easeOut" }}
        >
          <Skeleton className="h-11 w-full rounded-md" />
        </motion.div>

      </div>
    </div>
  );
}