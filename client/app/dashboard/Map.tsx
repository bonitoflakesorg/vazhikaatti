"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet";
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

export interface RouteOption {
  geometry: [number, number][]; // Array of [lat, lng]
  distance: number;
  duration: number;
}

function FlyToLocation({ position }: { position: [number, number] | null }) {
  const map = useMap();
  const isFirstFly = useRef(true);

  useEffect(() => {
    if (position) {
      if (isFirstFly.current) {
        map.flyTo(position, 16, { animate: true, duration: 1.5 });
        isFirstFly.current = false;
      } else {
        map.panTo(position, { animate: true });
      }
    } else {
      isFirstFly.current = true;
    }
  }, [position, map]);
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

interface MapProps {
  position: [number, number] | null;
  routes?: RouteOption[];
  selectedRouteIndex?: number | null;
  onRouteSelect?: (index: number) => void;
  bounds?: [number, number][] | null;
  startPoint?: [number, number] | null;
  endPoint?: [number, number] | null;
}

export default function Map({
  position,
  routes = [],
  selectedRouteIndex = null,
  onRouteSelect,
  bounds = null,
  startPoint = null,
  endPoint = null,
}: MapProps) {
  const defaultCenter: [number, number] = [20.5937, 78.9629];
  const routeColors = ["#4F46E5", "#0D9488", "#E11D48"]; // Indigo, Teal, Rose

  const startIcon = createPinIcon("#16a34a", "Start");
  const endIcon = createPinIcon("#dc2626", "End");

  return (
    <div className="w-full h-full relative z-0">
      <MapContainer
        center={position || defaultCenter}
        zoom={position ? 16 : 5}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Live location marker */}
        {position && (
          <Marker position={position}>
            <Popup>You are here!</Popup>
          </Marker>
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

        <FlyToLocation position={position} />
        <FitBounds bounds={bounds} />
      </MapContainer>
    </div>
  );
}
