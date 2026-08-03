// frontend/src/pages/citizen/CreateSignalement.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MapPin, Send, ArrowLeft, Camera, Tag, AlignLeft, Type } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { LocationPicker } from '@/components/map/locationPicker';
import { PhotoUploader } from '@/components/signalement/photoUploader';
import { useCreateSignalement } from '@/hooks/useSignalements';
import { useCategories } from '@/hooks/useCategories';
import { useQuartiers } from '@/hooks/useQuartiers';
import { useAuth } from '@/contexts/AuthContext';
import { signalementService } from '@/services/signalement.service';

const schema = z.object({
  titre: z.string().min(5, 'Minimum 5 caractères').max(100),
  description: z.string().min(10, 'Minimum 10 caractères').max(1000),
  categorieId: z.string().min(1, 'Choisissez une catégorie'),
  quartierId: z.string().optional(),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
    adresse: z.string().optional(),
  }).optional().refine((v) => v !== undefined, { message: 'Choisissez une localisation' }),
  photos: z.array(z.instanceof(File)).max(3),
});

type FormData = z.infer<typeof schema>;

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' as const },
  }),
};

function SectionCard({ icon: Icon, title, children, index }: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  index: number;
}) {
  return (
    <motion.div custom={index} variants={fadeUp} initial="hidden" animate="visible">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 dark:border-slate-700">
          <div className="w-8 h-8 rounded-lg bg-[#10B981]/10 flex items-center justify-center">
            <Icon size={16} className="text-[#10B981]" />
          </div>
          <span className="text-sm font-semibold text-slate-900 dark:text-white">{title}</span>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </motion.div>
  );
}

export default function CreateSignalement() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { data: categories = [] } = useCategories();
  const { data: quartiers = [] } = useQuartiers();
  const { mutateAsync: createSignalement, isPending } = useCreateSignalement();
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated, navigate]);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { photos: [], location: undefined },
  });

  const onSubmit = async (formData: FormData) => {
    setSubmitError(null);
    try {
      let photoIds: number[] = [];
      if (formData.photos.length > 0) {
        const uploaded = await Promise.all(formData.photos.map((f) => signalementService.uploadPhoto(f)));
        photoIds = uploaded.flat().map((p) => p.id);
      }
      await createSignalement({
        titre: formData.titre,
        description: formData.description,
        latitude: formData.location!.lat,
        longitude: formData.location!.lng,
        adresse: formData.location!.adresse,
        categorie: formData.categorieId,
        quartier: formData.quartierId ?? undefined,
        photos: photoIds,
      });
      navigate('/mes-signalements');
    } catch (err: any) {
      setSubmitError(err?.response?.data?.error?.message ?? 'Une erreur est survenue');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900">

      {/* Hero header — pt-16 pour compenser la navbar fixed */}
      <div className="bg-gray-900 pt-20">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-white/60 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft size={16} /> Retour
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#10B981] flex items-center justify-center shadow-lg shadow-[#10B981]/30">
              <MapPin size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Nouveau signalement</h1>
              <p className="text-sm text-white/60 mt-0.5">Signalez un problème dans votre quartier</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            {/* Titre */}
            <SectionCard icon={Type} title="Titre" index={0}>
              <FormField
                control={form.control}
                name="titre"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Ex: Nid de poule dangereux rue Principale"
                        className="bg-slate-100 dark:bg-gray-700 dark:text-white dark:placeholder:text-slate-400 border-0 focus-visible:ring-2 focus-visible:ring-[#10B981] rounded-xl h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </SectionCard>

            {/* Description */}
            <SectionCard icon={AlignLeft} title="Description" index={1}>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={4}
                        placeholder="Décrivez le problème en détail..."
                        className="bg-slate-100 dark:bg-gray-700 dark:text-white dark:placeholder:text-slate-400 border-0 focus-visible:ring-2 focus-visible:ring-[#10B981] rounded-xl resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </SectionCard>

            {/* Catégorie + Quartier */}
            <SectionCard icon={Tag} title="Catégorie & Quartier" index={2}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="categorieId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-slate-500 dark:text-slate-400">
                        Catégorie <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full bg-slate-100 dark:bg-gray-700 dark:text-white border-0 focus:ring-2 focus:ring-[#10B981] rounded-xl h-11">
                            <SelectValue placeholder="Choisissez..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent position="popper" className="w-full dark:bg-gray-800 dark:text-white dark:border-slate-700">
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.documentId} className="dark:focus:bg-gray-700 dark:text-white">{cat.nom}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="quartierId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-slate-500 dark:text-slate-400">Quartier</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full bg-slate-100 dark:bg-gray-700 dark:text-white border-0 focus:ring-2 focus:ring-[#10B981] rounded-xl h-11">
                            <SelectValue placeholder="Optionnel..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent position="popper" className="w-full dark:bg-gray-800 dark:text-white dark:border-slate-700">
                          {quartiers.map((q) => (
                            <SelectItem key={q.id} value={q.documentId} className="dark:focus:bg-gray-700 dark:text-white">{q.nom}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </SectionCard>

            {/* Localisation */}
            <SectionCard icon={MapPin} title="Localisation *" index={3}>
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <LocationPicker
                        value={field.value || null}
                        onChange={(loc) => field.onChange(loc || undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                    <AnimatePresence>
                      {form.watch('location')?.adresse && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-xs text-[#10B981] bg-[#10B981]/10 px-3 py-2 rounded-lg mt-2"
                        >
                          📍 {form.watch('location')?.adresse}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </FormItem>
                )}
              />
            </SectionCard>

            {/* Photos */}
            <SectionCard icon={Camera} title="Photos (max 3)" index={4}>
              <FormField
                control={form.control}
                name="photos"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <PhotoUploader value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </SectionCard>

            {/* Submit */}
            <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible">
              {submitError && (
                <p className="text-sm text-red-500 mb-3 text-center bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-xl">
                  {submitError}
                </p>
              )}
              <motion.button
                type="submit"
                disabled={isPending}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full h-12 bg-[#10B981] hover:bg-[#059669] disabled:opacity-50 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#10B981]/25"
              >
                <AnimatePresence mode="wait">
                  {isPending ? (
                    <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                      <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>⟳</motion.span>
                      Envoi en cours...
                    </motion.span>
                  ) : (
                    <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                      <Send size={18} /> Envoyer le signalement
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>

          </form>
        </Form>
      </div>
    </div>
  );
}
