import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  iconClassName?: string;
  index?: number;
}

export function StatsCard({ title, value, subtitle, icon: Icon, iconClassName, index = 0 }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: 'easeOut' as const }}
    >
      <Card className="border-0 shadow-sm h-full">
        <CardContent className="p-5 space-y-3">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconClassName}`}>
            <Icon size={18} className="text-foreground/70" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{title}</p>
            <p className="text-4xl font-bold text-slate-900 dark:text-white">{value}</p>
            {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
