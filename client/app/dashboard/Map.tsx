"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icon in Next.js
// @ts-expect-error - _getIconUrl is an internal property not typed in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export interface RouteStep {
  instruction: string;
  distance: number;
  duration: number;
  type: number;
  way_points: [number, number];
}

export interface RouteOption {
  geometry: [number, number][]; // Array of [lat, lng]
  distance: number;
  duration: number;
  steps: RouteStep[];
}

export type Review = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  rating: number;
  location: string;
  coordinates: string | null;
  image_url: string | null;
  created_at: string;
};

function FlyToLocation({ position, recenterKey }: { position: [number, number] | null, recenterKey?: number }) {
  const map = useMap();
  const isFirstFly = useRef(true);
  const prevRecenterKey = useRef(recenterKey);

  useEffect(() => {
    if (position) {
      if (isFirstFly.current) {
        map.flyTo(position, 16, { animate: true, duration: 1.5 });
        isFirstFly.current = false;
      } else if (recenterKey !== prevRecenterKey.current) {
        // Explicit recenter trigger
        map.flyTo(position, 16, { animate: true, duration: 1 });
        prevRecenterKey.current = recenterKey;
      } else {
        // Normal position update pan
        map.panTo(position, { animate: true });
      }
    } else {
      isFirstFly.current = true;
    }
  }, [position, map, recenterKey]);
  return null;
}

function FitBounds({ bounds }: { bounds: [number, number][] | null }) {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50], animate: true });
    }
  }, [bounds, map]);
  return null;
}

function MapEventsHelper({ onMapClick }: { onMapClick?: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

// Custom teardrop pin icon using inline HTML
function createPinIcon(color: string, label: string) {
  return L.divIcon({
    className: "",
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.4))">
        <div style="
          background:${color};
          color:white;
          font-size:10px;
          font-weight:700;
          font-family:sans-serif;
          padding:3px 8px;
          border-radius:20px;
          white-space:nowrap;
          margin-bottom:3px;
          line-height:1.4;
          box-shadow:0 1px 4px rgba(0,0,0,0.3)
        ">${label}</div>
        <div style="
          width:16px;
          height:16px;
          background:${color};
          border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          border:3px solid white;
          box-shadow:0 1px 4px rgba(0,0,0,0.3)
        "></div>
      </div>
    `,
    iconSize: [60, 48],
    iconAnchor: [30, 48],
    popupAnchor: [0, -48],
  });
}

// Animated pulsing user location dot (Google Maps style)
function createUserLocationIcon() {
  return L.divIcon({
    className: "",
    html: `
      <style>
        @keyframes locRipple {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(3.5); opacity: 0; }
        }
      </style>
      <div style="position:relative;width:22px;height:22px;display:flex;align-items:center;justify-content:center">
        <div style="position:absolute;width:22px;height:22px;background:rgba(79,70,229,0.3);border-radius:50%;animation:locRipple 2s ease-out infinite;top:0;left:0"></div>
        <div style="position:relative;width:15px;height:15px;background:#4F46E5;border-radius:50%;border:3px solid white;box-shadow:0 2px 10px rgba(79,70,229,0.7);z-index:2"></div>
      </div>
    `,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
}

// Next-turn waypoint indicator
function createNextTurnIcon() {
  return L.divIcon({
    className: "",
    html: `<div style="width:12px;height:12px;background:#f97316;border-radius:50%;border:2.5px solid white;box-shadow:0 1px 6px rgba(249,115,22,0.6)"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });
}

// Custom hazard pin for reported issues
function createHazardIcon(rating: number) {
  const isCritical = rating >= 4;
  const outerColor = isCritical ? "bg-red-500/40" : "bg-orange-500/40";
  const innerColor = isCritical ? "bg-red-600" : "bg-orange-500";

  return L.divIcon({
    className: "hazard-pin",
    html: `
      <div class="relative flex items-center justify-center w-8 h-8 cursor-pointer">
        <div class="absolute w-full h-full rounded-full ${outerColor} animate-ping" style="animation-duration: 2s;"></div>
        <div class="relative flex items-center justify-center w-5 h-5 ${innerColor} border-2 border-white rounded-full shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 text-white stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
}

interface MapProps {
  position: [number, number] | null;
  routes?: RouteOption[];
  selectedRouteIndex?: number | null;
  onRouteSelect?: (index: number) => void;
  bounds?: [number, number][] | null;
  startPoint?: [number, number] | null;
  endPoint?: [number, number] | null;
  reviews?: Review[];
  nextTurnPoint?: [number, number] | null;
  recenterKey?: number;
  onMapClick?: (lat: number, lng: number) => void;
  pickedPoint?: [number, number] | null;
}

export default function Map({
  position,
  routes = [],
  selectedRouteIndex = null,
  onRouteSelect,
  bounds = null,
  startPoint = null,
  endPoint = null,
  reviews = [],
  nextTurnPoint = null,
  recenterKey = 0,
  onMapClick,
  pickedPoint = null,
}: MapProps) {
  const defaultCenter: [number, number] = [10.0159, 76.3419]; // Kochi, Kerala
  const routeColors = ["#4F46E5", "#0D9488", "#E11D48"]; // Indigo, Teal, Rose

  const startIcon = createPinIcon("#16a34a", "Start");
  const endIcon = createPinIcon("#dc2626", "End");
  const pickedIcon = createPinIcon("#8b5cf6", "Picked");
  const userLocationIcon = createUserLocationIcon();
  const nextTurnIcon = createNextTurnIcon();

  return (
    <div className="w-full h-full relative z-0">
      <MapContainer
        center={position || defaultCenter}
        zoom={position ? 16 : 13}
        scrollWheelZoom={true}
        zoomControl={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {/* Animated user location marker */}
        {position && (
          <Marker position={position} icon={userLocationIcon} />
        )}

        {/* Next turn waypoint indicator */}
        {nextTurnPoint && (
          <Marker position={nextTurnPoint} icon={nextTurnIcon} />
        )}

        {/* Start pin */}
        {startPoint && (
          <Marker position={startPoint} icon={startIcon}>
            <Popup>Start</Popup>
          </Marker>
        )}

        {/* End pin */}
        {endPoint && (
          <Marker position={endPoint} icon={endIcon}>
            <Popup>Destination</Popup>
          </Marker>
        )}

        {/* Route polylines */}
        {routes.map((route, index) => {
          const isSelected = selectedRouteIndex === index;
          const isDimmed = selectedRouteIndex !== null && selectedRouteIndex !== index;
          if (isDimmed) return null;

          const color = isSelected ? "#4F46E5" : routeColors[index % routeColors.length];

          return (
            <Polyline
              key={index}
              positions={route.geometry}
              pathOptions={{
                color,
                weight: isSelected ? 6 : 5,
                opacity: isSelected ? 0.9 : 0.7,
                dashArray: isSelected ? undefined : "10, 10",
              }}
              eventHandlers={{
                click: () => onRouteSelect && onRouteSelect(index),
              }}
            />
          );
        })}

        {/* Review markers */}
        {reviews.map((review) => {
          if (!review.coordinates) return null;
          const [lat, lng] = review.coordinates.split(",").map(Number);
          if (isNaN(lat) || isNaN(lng)) return null;

          return (
            <Marker key={review.id} position={[lat, lng]} icon={createHazardIcon(review.rating)}>
              <Popup className="rounded-xl overflow-hidden shadow-2xl border-0 p-0 m-0">
                <div className="w-64 -m-3">
                  {review.image_url && (
                    <div className="w-full h-32 relative group">
                      <img src={review.image_url} alt={review.title} className="w-full h-full object-cover rounded-t-xl" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                        <a href={review.image_url} target="_blank" rel="noreferrer" className="text-white text-xs font-bold px-3 py-1.5 bg-white/20 rounded-full border border-white/40 hover:bg-white/30 transition-colors">
                          View Full Image
                        </a>
                      </div>
                    </div>
                  )}
                  <div className={`p-4 ${review.image_url ? 'bg-white rounded-b-xl' : 'bg-white rounded-xl'} flex flex-col gap-2.5`}>
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-gray-800 leading-tight">{review.title}</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${review.rating >= 4 ? 'bg-red-100 text-red-600' :
                          review.rating === 3 ? 'bg-orange-100 text-orange-600' :
                            'bg-emerald-100 text-emerald-600'
                        }`}>
                        Severity: {review.rating}/5
                      </span>
                    </div>
                    {review.description && (
                      <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                        {review.description}
                      </p>
                    )}
                    <div className="flex justify-between items-center mt-1">
                      <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-full border border-gray-100">
                        <span className="text-[10px]">📍</span>
                        <span className="text-[10px] font-semibold text-gray-600 truncate max-w-[120px]" title={review.location || 'Unknown'}>
                          {review.category || 'Hazard'}
                        </span>
                      </div>
                      <span className="text-[9px] text-gray-400 font-medium">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        <FlyToLocation position={position} recenterKey={recenterKey} />
        <FitBounds bounds={bounds} />
        <MapEventsHelper onMapClick={onMapClick} />
        {pickedPoint && (
          <Marker position={pickedPoint} icon={pickedIcon} />
        )}
      </MapContainer>
    </div>
  );
}
