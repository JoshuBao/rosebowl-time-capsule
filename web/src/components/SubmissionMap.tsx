"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import type { Submission } from "@/lib/types";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Custom rose-colored marker icon
const roseIcon = L.divIcon({
  className: "custom-rose-marker",
  html: `<div style="
    width: 24px;
    height: 24px;
    background: #D4727E;
    border: 3px solid #B85865;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    box-shadow: 0 2px 8px rgba(180, 88, 101, 0.4);
  "></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24],
});

export function SubmissionMap({
  submissions,
}: {
  submissions: Submission[];
}) {
  const withPins = submissions.filter(
    (s) => typeof s.lat === "number" && typeof s.lng === "number",
  );

  useEffect(() => {
    // Fix for default marker icons in Leaflet with Next.js
    // https://github.com/Leaflet/Leaflet/issues/4968
    type IconDefault = L.Icon.Default & {
      _getIconUrl?: () => string;
    };
    delete (L.Icon.Default.prototype as IconDefault)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  if (withPins.length === 0) {
    return (
      <div className="rounded-3xl border border-[var(--foreground)]/10 bg-gradient-to-br from-[var(--beige)] to-[var(--background)] p-8 shadow-lg shadow-[var(--shadow)]">
        <div className="text-center">
          <div className="mb-3 text-3xl">📍</div>
          <p className="text-sm leading-relaxed text-[var(--foreground)]/60">
            No pinned memories yet.
            <br />
            Use &quot;Pin your location&quot; when submitting.
          </p>
        </div>
      </div>
    );
  }

  // Calculate center point from all pins
  const avgLat =
    withPins.reduce((sum, s) => sum + (s.lat as number), 0) / withPins.length;
  const avgLng =
    withPins.reduce((sum, s) => sum + (s.lng as number), 0) / withPins.length;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[var(--foreground)]/10 shadow-xl shadow-[var(--shadow)]">
      <style jsx global>{`
        .leaflet-container {
          height: 400px;
          width: 100%;
          border-radius: 1.5rem;
        }
        .leaflet-popup-content-wrapper {
          background: var(--beige);
          border-radius: 1rem;
          box-shadow: 0 4px 12px rgba(61, 46, 41, 0.15);
        }
        .leaflet-popup-content {
          margin: 12px 16px;
          font-family: var(--font-sans), sans-serif;
          color: var(--foreground);
        }
        .leaflet-popup-tip {
          background: var(--beige);
        }
        .custom-rose-marker {
          background: transparent;
          border: none;
        }
      `}</style>

      <MapContainer
        center={[avgLat, avgLng]}
        zoom={12}
        scrollWheelZoom={false}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {withPins.map((s) => (
          <Marker
            key={s.id}
            position={[s.lat as number, s.lng as number]}
            icon={roseIcon}
          >
            <Popup>
              <div className="text-sm">
                <div className="mb-1 font-semibold text-[var(--rose-deep)]">
                  📍 {s.location_text}
                </div>
                <p className="text-xs leading-relaxed text-[var(--foreground)]/80">
                  {s.message.length > 100
                    ? s.message.substring(0, 100) + "..."
                    : s.message}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Pin count badge */}
      <div className="absolute bottom-4 right-4 z-[1000] rounded-full border border-[var(--rose)]/30 bg-[var(--background)]/90 px-3 py-1.5 text-xs font-medium text-[var(--rose-deep)] shadow-lg backdrop-blur-sm">
        {withPins.length} {withPins.length === 1 ? "pin" : "pins"}
      </div>
    </div>
  );
}

