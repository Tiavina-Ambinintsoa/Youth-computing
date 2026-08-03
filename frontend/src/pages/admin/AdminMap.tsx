import { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { useSignalements, useUpdateSignalement, useDeleteSignalement } from '@/hooks/useSignalements';
import { useCategories } from '@/hooks/useCategories';
import type { Signalement } from '@/types';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const statutColors: Record<string, string> = {
  en_attente: '#F59E0B',
  en_cours:   '#3B82F6',
  resolu:     '#10B981',
};

const statutLabels: Record<string, string> = {
  en_attente: 'En attente',
  en_cours:   'En cours',
  resolu:     'Résolu',
};

function getImageUrl(photoUrl: string): string {
  if (!photoUrl) return '';
  // Si l'URL est déjà complète (http/https), la retourner
  if (photoUrl.startsWith('http')) return photoUrl;
  // Sinon construire l'URL complète avec le baseURL
  const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:1337';
  return `${apiUrl}${photoUrl}`;
}

function createColoredIcon(color: string) {
  return L.divIcon({
    className: '',
    html: `<div style="width:32px;height:41px;display:flex;align-items:center;justify-content:center;"><div style="width:24px;height:24px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 3px 10px rgba(0,0,0,0.35);"></div></div>`,
    iconSize: [32, 41],
    iconAnchor: [16, 41],
    popupAnchor: [0, -41],
  });
}

const DEFAULT_CENTER: [number, number] = [-21.4545, 47.0833];

function MarkerPopup({ s }: { s: Signalement }) {
  const { mutate: update, isPending } = useUpdateSignalement();
  const { mutate: remove, isPending: isDeleting } = useDeleteSignalement();

  return (
    <div className="min-w-[200px] space-y-2">
      <p className="font-semibold text-sm text-slate-900">{s.titre}</p>
      {s.categorie && (
        <span
          className="inline-block text-xs text-white px-2 py-0.5 rounded-full"
          style={{ backgroundColor: s.categorie.couleur ?? '#6B7280' }}
        >
          {s.categorie.nom}
        </span>
      )}
      {s.adresse && <p className="text-xs text-slate-400 line-clamp-2">{s.adresse}</p>}
      <p className="text-xs text-slate-400">{new Date(s.createdAt).toLocaleDateString('fr-FR')}</p>

      {/* Changement statut */}
      <select
        value={s.statut ?? 'en_attente'}
        disabled={isPending}
        onChange={(e) => update({ documentId: s.documentId, payload: { statut: e.target.value as any } })}
        className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#10B981] disabled:opacity-50"
      >
        {Object.entries(statutLabels).map(([val, label]) => (
          <option key={val} value={val}>{label}</option>
        ))}
      </select>

      {s.photos && s.photos.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-700">Photos:</p>
          <div className="grid grid-cols-2 gap-1">
            {s.photos.map((photo, idx) => (
              <a
                key={idx}
                href={getImageUrl(photo.url)}
                target="_blank"
                rel="noopener noreferrer"
                className="block overflow-hidden rounded border border-slate-300 hover:border-slate-500 transition"
              >
                <img
                  src={getImageUrl(photo.url)}
                  alt={photo.name ?? `Photo ${idx + 1}`}
                  className="w-full h-16 object-cover hover:scale-105 transition"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f0f0f0" width="100" height="100"/%3E%3Ctext x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999" font-size="12"%3EImage non disponible%3C/text%3E%3C/svg%3E';
                  }}
                />
              </a>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => remove(s.documentId)}
        disabled={isDeleting}
        className="w-full text-xs text-red-500 hover:bg-red-50 border border-red-200 rounded-lg px-2 py-1.5 transition-colors disabled:opacity-50"
      >
        {isDeleting ? 'Suppression...' : 'Supprimer'}
      </button>
    </div>
  );
}

export default function AdminMap() {
  const [statut, setStatut] = useState<string>('');
  const [categorieId, setCategorieId] = useState<string>('');

  const { data, isLoading } = useSignalements({ pageSize: 100 });
  const { data: categories = [] } = useCategories();

  const signalements: Signalement[] = data?.data ?? [];

  const filtered = useMemo(() => signalements.filter((s) => {
    if (statut && s.statut !== statut) return false;
    if (categorieId && s.categorie?.documentId !== categorieId) return false;
    return true;
  }), [signalements, statut, categorieId]);

  return (
    <div className="relative h-screen w-full">
      {/* Filtres */}
      <div className="absolute top-4 left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-[1000] flex gap-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 px-3 py-2.5">
        <select
          value={statut}
          onChange={(e) => setStatut(e.target.value)}
          className="text-sm bg-slate-100 dark:bg-gray-700 dark:text-white border-0 rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#10B981] outline-none"
        >
          <option value="">Tous les statuts</option>
          {Object.entries(statutLabels).map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>

        <select
          value={categorieId}
          onChange={(e) => setCategorieId(e.target.value)}
          className="text-sm bg-slate-100 dark:bg-gray-700 dark:text-white border-0 rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#10B981] outline-none"
        >
          <option value="">Toutes les catégories</option>
          {categories.map((cat) => (
            <option key={cat.documentId} value={cat.documentId}>{cat.nom}</option>
          ))}
        </select>

        <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 px-2">
          {filtered.length} signalement{filtered.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Carte */}
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {filtered.map((s) => (
          <Marker
            key={s.id}
            position={[s.latitude, s.longitude]}
            icon={createColoredIcon(statutColors[s.statut ?? 'en_attente'] ?? '#F59E0B')}
          >
            <Popup>
              <MarkerPopup s={s} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Légende */}
      <div className="absolute bottom-6 left-4 z-[1000] bg-white dark:bg-gray-800 rounded-xl px-3 py-2 shadow-md border border-slate-200 dark:border-slate-700 flex items-center gap-3">
        {Object.entries(statutColors).map(([key, color]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: color }} />
            <span className="text-xs text-slate-600 dark:text-slate-300">{statutLabels[key]}</span>
          </div>
        ))}
      </div>

      {isLoading && (
        <div className="absolute inset-0 z-[2000] flex items-center justify-center bg-white/50">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
