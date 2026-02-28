"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// @ts-expect-error internal
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function createSOSIcon() {
  return L.divIcon({
    className: "",
    html: `
      <style>
        @keyframes sosRipple {
          0%   { transform: scale(1);   opacity: 0.7; }
          100% { transform: scale(4);   opacity: 0;   }
        }
      </style>
      <div style="position:relative;width:24px;height:24px;display:flex;align-items:center;justify-content:center">
        <div style="position:absolute;width:24px;height:24px;background:rgba(220,38,38,0.4);border-radius:50%;animation:sosRipple 1.6s ease-out infinite;top:0;left:0"></div>
        <div style="position:relative;width:16px;height:16px;background:#dc2626;border-radius:50%;border:3px solid white;box-shadow:0 2px 10px rgba(220,38,38,0.8);z-index:2"></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

function PanTo({ position }: { position: [number, number] }) {
  const map = useMap();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      map.flyTo(position, 16, { animate: true, duration: 1.5 });
      first.current = false;
    } else {
      map.panTo(position, { animate: true });
    }
  }, [position, map]);
  return null;
}

export default function TrackMap({ position }: { position: [number, number] }) {
  const icon = createSOSIcon();
  return (
    <MapContainer
      center={position}
      zoom={16}
      scrollWheelZoom={true}
      zoomControl={true}
      className="w-full h-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      <Marker position={position} icon={icon} />
      <PanTo position={position} />
    </MapContainer>
  );
}
