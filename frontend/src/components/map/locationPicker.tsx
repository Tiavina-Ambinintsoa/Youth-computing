import { useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix icône Leaflet avec Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41], // Point bas du marqueur
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface LocationPickerProps {
  value: { lat: number; lng: number; adresse?: string } | null;
  onChange: (location: { lat: number; lng: number; adresse?: string }) => void;
}

// Fianarantsoa par défaut
const DEFAULT_CENTER: [number, number] = [-21.4545, 47.0833];
const DEFAULT_ZOOM = 13;

function MapClickHandler({
  onClick,
}: {
  onClick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export function LocationPicker({ value, onChange }: LocationPickerProps) {
  const [isGeolocating, setIsGeolocating] = useState(false);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      setIsReverseGeocoding(true);
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=fr`
      );
      const data = await res.json();
      return data.display_name ?? '';
    } catch {
      return '';
    } finally {
      setIsReverseGeocoding(false);
    }
  };

  const handleMapClick = async (lat: number, lng: number) => {
    const adresse = await reverseGeocode(lat, lng);
    onChange({ lat, lng, adresse });
    setGeoError(null);
  };

  const handleGeolocate = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoError('Géolocalisation non disponible sur ce navigateur');
      return;
    }

    setIsGeolocating(true);
    setGeoError(null);
    let watchId: number | null = null;
    let bestPosition: GeolocationCoordinates | null = null;
    let positionCount = 0;
    const minPositionsForBestAccuracy = 5; // Attendre au moins 5 positions pour meilleure précision
    const targetAccuracy = 5; // Viser < 5m
    const acceptableAccuracy = 15; // Accepter < 15m après quelques tentatives

    const successHandler = async (pos: GeolocationPosition) => {
      const accuracy = pos.coords.accuracy;
      positionCount++;

      // Stocker la meilleure position (celle avec la meilleure accuracy)
      if (!bestPosition || accuracy < bestPosition.accuracy) {
        bestPosition = pos.coords;
      }

      // Stratégie: 
      // - Si accuracy < 5m ET au moins 3 positions: valider immédiatement
      // - Si accuracy < 15m ET au moins 5 positions: valider
      // - Si accuracy < 30m ET au moins 8 positions: valider
      // - Sinon continuer à chercher jusqu'à 15 secondes
      
      const shouldValidate = 
        (accuracy < targetAccuracy && positionCount >= 3) ||
        (accuracy < acceptableAccuracy && positionCount >= minPositionsForBestAccuracy) ||
        (accuracy < 30 && positionCount >= 8);

      if (shouldValidate && bestPosition) {
        if (watchId !== null) {
          navigator.geolocation.clearWatch(watchId);
        }

        const adresse = await reverseGeocode(bestPosition.latitude, bestPosition.longitude);
        onChange({
          lat: bestPosition.latitude,
          lng: bestPosition.longitude,
          adresse,
        });

        // Afficher la précision obtenue
        const accuracyMsg = bestPosition.accuracy > 20 
          ? `Précision moyenne (±${Math.round(bestPosition.accuracy)}m). Pour plus de précision, assurez-vous d'être en plein air.`
          : `Localisation précise (±${Math.round(bestPosition.accuracy)}m)`;
        
        if (bestPosition.accuracy > 20) {
          setGeoError(accuracyMsg);
        } else {
          setGeoError(null);
        }
        setIsGeolocating(false);
      }
    };

    const errorHandler = (error: GeolocationPositionError) => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }

      let errorMsg = 'Erreur de géolocalisation';
      if (error.code === error.PERMISSION_DENIED) {
        errorMsg = 'Accès à la localisation refusé. Vérifiez les permissions du navigateur.';
      } else if (error.code === error.POSITION_UNAVAILABLE) {
        errorMsg = 'Position non disponible. Essayez en déplaçant le marqueur manuellement.';
      } else if (error.code === error.TIMEOUT) {
        errorMsg = 'Timeout - Vérifiez votre connexion et que vous avez une vue dégagée du ciel.';
      }

      setGeoError(errorMsg);
      setIsGeolocating(false);
    };

    // Utiliser watchPosition pour améliorer la précision progressivement
    watchId = navigator.geolocation.watchPosition(successHandler, errorHandler, {
      enableHighAccuracy: true,
      timeout: 20000, // 20 secondes par position
      maximumAge: 0, // Jamais de cache
    });

    // Timeout global de sécurité (18 secondes)
    // Utiliser la meilleure position trouvée jusqu'à présent
    const timeoutId = setTimeout(async () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
      if (bestPosition) {
        const adresse = await reverseGeocode(bestPosition.latitude, bestPosition.longitude);
        onChange({
          lat: bestPosition.latitude,
          lng: bestPosition.longitude,
          adresse,
        });
        
        const accuracyMsg = bestPosition.accuracy > 20 
          ? `Précision obtenue: ±${Math.round(bestPosition.accuracy)}m (imprécision potentielle)`
          : `Localisation confirmée: ±${Math.round(bestPosition.accuracy)}m`;
        
        if (bestPosition.accuracy > 30) {
          setGeoError(accuracyMsg);
        } else {
          setGeoError(null);
        }
      }
      setIsGeolocating(false);
    }, 18000);

    return () => clearTimeout(timeoutId);
  }, [onChange]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700 dark:text-white">
          Localisation <span className="text-red-500">*</span>
        </span>
        <button
          type="button"
          onClick={handleGeolocate}
          disabled={isGeolocating}
          className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-[#10B981]/10 text-emerald-700 dark:text-[#10B981] hover:bg-emerald-100 dark:hover:bg-[#10B981]/20 transition disabled:opacity-50"
          title={isGeolocating ? 'Acquisition précise de la localisation en cours...' : 'Utiliser ma position actuelle'}
        >
          {isGeolocating ? (
            <>
              <span className="animate-spin">⟳</span> Localisation...
            </>
          ) : (
            <>📍 Ma position</>
          )}
        </button>
      </div>

      {geoError && (
        <div className="text-xs bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-2 rounded-lg border border-red-200 dark:border-red-800">
          ⚠️ {geoError}
        </div>
      )}

      <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm" style={{ zIndex: 0, position: 'relative' }}>
        <MapContainer
          center={value ? [value.lat, value.lng] : DEFAULT_CENTER}
          zoom={DEFAULT_ZOOM}
          style={{ height: '280px', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onClick={handleMapClick} />
          {value && <Marker position={[value.lat, value.lng]} />}
        </MapContainer>
      </div>

      {isReverseGeocoding && (
        <p className="text-xs text-gray-500 dark:text-slate-400 animate-pulse">
          Recherche de l'adresse...
        </p>
      )}

      {value && (
        <div className="text-xs text-gray-500 dark:text-slate-400 space-y-1">
          <p>
            📌 {value.lat.toFixed(6)}, {value.lng.toFixed(6)}
          </p>
          {value.adresse && (
            <p className="line-clamp-2 text-gray-600 dark:text-slate-300">
              📍 {value.adresse}
            </p>
          )}
        </div>
      )}
    </div>
  );
}