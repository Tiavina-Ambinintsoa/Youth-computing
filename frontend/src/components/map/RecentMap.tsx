import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import type { Signalement } from '@/types';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const statutColors: Record<string, string> = {
  en_attente: '#F59E0B',
  en_cours:   '#3B82F6',
  resolu:     '#10B981',
};

function createColoredIcon(color: string) {
  return L.divIcon({
    className: '',
    html: `<div style="
      width:14px;height:14px;border-radius:50%;
      background:${color};border:2px solid white;
      box-shadow:0 2px 6px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

const DEFAULT_CENTER: [number, number] = [-21.4545, 47.0833];

interface RecentMapProps {
  signalements: Signalement[];
}

export function RecentMap({ signalements }: RecentMapProps) {
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm" style={{ position: 'relative', zIndex: 0 }}>
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={13}
        style={{ height: '420px', width: '100%' }}
        zoomControl={true}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {signalements.map((s) => (
          <Marker
            key={s.id}
            position={[s.latitude, s.longitude]}
            icon={createColoredIcon(statutColors[s.statut] ?? '#6B7280')}
          >
            <Popup>
              <div className="min-w-[160px]">
                <p className="font-semibold text-sm text-slate-900 mb-1">{s.titre}</p>
                {s.categorie && (
                  <span
                    className="inline-block text-xs text-white px-2 py-0.5 rounded-full mb-2"
                    style={{ backgroundColor: s.categorie.couleur }}
                  >
                    {s.categorie.nom}
                  </span>
                )}
                <p className="text-xs text-slate-500 line-clamp-2 mb-2">{s.description}</p>
                <button
                  onClick={() => navigate(`/signalements/${s.documentId}`)}
                  className="text-xs text-[#10B981] font-medium hover:underline"
                >
                  Voir le détail →
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Légende */}
      <div className="absolute bottom-4 left-4 z-[400] bg-white dark:bg-gray-800 rounded-xl px-3 py-2 shadow-md border border-slate-200 dark:border-slate-700 flex items-center gap-3">
        {[
          { label: 'En attente', color: '#F59E0B' },
          { label: 'En cours',   color: '#3B82F6' },
          { label: 'Résolu',     color: '#10B981' },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: color }} />
            <span className="text-xs text-slate-600 dark:text-slate-300">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
