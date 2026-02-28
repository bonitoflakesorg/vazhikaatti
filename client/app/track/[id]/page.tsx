"use client";

import { use, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { supabase } from "../../utils/supabase";

const TrackMap = dynamic(() => import("./TrackMap"), {
  ssr: false,
  loading: () => (
    <div className="flex w-full h-full items-center justify-center bg-gray-900">
      <span className="text-white/50 text-lg font-semibold">Loading map…</span>
    </div>
  ),
});

export default function TrackPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    // 1. Load initial row
    supabase
      .from("sos_sessions")
      .select("lat, lng")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) { setNotFound(true); return; }
        setPosition([data.lat, data.lng]);
        setLastUpdated(new Date());
      });

    // 2. Subscribe to real-time updates on that row
    const channel = supabase
      .channel(`sos_track_${id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "sos_sessions",
          filter: `id=eq.${id}`,
        },
        (payload) => {
          const row = payload.new as { lat: number; lng: number };
          setPosition([row.lat, row.lng]);
          setLastUpdated(new Date());
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [id]);

  if (notFound) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-950 text-white gap-4 p-8">
        <span className="text-5xl">🔒</span>
        <h1 className="text-2xl font-bold">Session not found</h1>
        <p className="text-white/50 text-center text-sm">
          This tracking link is invalid or has expired.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen flex flex-col bg-gray-950">
      {/* Header */}
      <div
        className="shrink-0 flex items-center justify-between px-5 py-3 z-10"
        style={{ background: "linear-gradient(90deg,#991b1b,#dc2626)" }}
      >
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-white" />
          </span>
          <span className="text-white font-extrabold text-lg tracking-wide">
            🚨 LIVE SOS TRACKING
          </span>
        </div>
        {lastUpdated && (
          <span className="text-white/70 text-xs font-semibold">
            Updated {lastUpdated.toLocaleTimeString()}
          </span>
        )}
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        {position ? (
          <TrackMap position={position} />
        ) : (
          <div className="flex w-full h-full items-center justify-center bg-gray-900">
            <div className="flex flex-col items-center gap-3">
              <svg className="animate-spin h-8 w-8 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <p className="text-white/60 text-sm font-medium">Waiting for location…</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="shrink-0 bg-gray-900 border-t border-gray-800 px-5 py-3 flex items-center justify-between">
        <p className="text-white/50 text-xs">
          Location updates automatically as the person moves
        </p>
        {position && (
          <a
            href={`https://maps.google.com/?q=${position[0]},${position[1]}`}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors"
          >
            Open in Google Maps →
          </a>
        )}
      </div>
    </div>
  );
}
